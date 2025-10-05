from tenacity.wait import wait_base
from tenacity import retry, retry_if_exception, stop_after_attempt, wait_fixed
from urllib.parse import urlparse
import os
import asyncio
import httpx
import pandas as pd
from bs4 import BeautifulSoup
import json
import re
from google import genai
import ast
from google.genai import errors as gen_errors

# ========== CONFIG ==========
CACHE_DIR = "cache"
SUMMARY_FILE = "result.json"
API_KEY = "AIzaSyDyM2YV8rH8XMHLZYgxylOT2DmvmkmnlqI"
MAX_CONCURRENT = 3

os.makedirs(CACHE_DIR, exist_ok=True)

# ========== HELPER FUNCTIONS ==========


def getError(error):
    s = error[0]

    dict_str = s[s.find('{'):]

    obj = ast.literal_eval(dict_str)

    status = obj['error']['status']
    code = obj['error']['code']

    # Extract retryDelay
    if (code != 503):
        retry_delay = None
        if (len(obj['error']) >= 3):
            print(obj['error'])
            for detail in obj['error']['details']:
                if detail.get('@type') == 'type.googleapis.com/google.rpc.RetryInfo':
                    retry_delay = detail.get('retryDelay')
                    retry_delay = int(retry_delay[:-1])
                    break
            return [status, int(code), retry_delay]
    return [status, int(code)]


def extract_pmc_id_from_url(url: str) -> str:
    m = re.search(r"/PMC(\d+)", url)
    if m:
        return m.group(1)
    parts = url.rstrip("/").split("/")
    for part in parts[::-1]:
        if part.startswith("PMC") and part[3:].isdigit():
            return part[3:]
    return None

# ========== FETCH ARTICLES ==========


async def fetch_article(pmc_id, client_http):
    cache_path = os.path.join(CACHE_DIR, f"{pmc_id}.xml")
    if os.path.exists(cache_path):
        with open(cache_path, "r", encoding="utf-8") as f:
            return f.read()

    url = "https://eutils.ncbi.nlm.nih.gov/entrez/eutils/efetch.fcgi"
    params = {"db": "pmc", "id": pmc_id, "retmode": "xml"}

    while True:
        try:
            resp = await client_http.get(url, params=params)
            if resp.status_code == 200:
                text = resp.text
                with open(cache_path, "w", encoding="utf-8") as f:
                    f.write(text)
                return text
            elif resp.status_code == 429:
                print(f"HTTP 429 Too Many Requests for PMC{
                      pmc_id}. Waiting 30s...")
                await asyncio.sleep(30)
            else:
                resp.raise_for_status()
        except httpx.RequestError as e:
            print(f"Request error for PMC{pmc_id}: {e}. Retrying in 60s...")
            await asyncio.sleep(60)


async def fetch_all_articles(pmc_ids):
    semaphore = asyncio.Semaphore(MAX_CONCURRENT)
    limits = httpx.Limits(max_connections=MAX_CONCURRENT)
    async with httpx.AsyncClient(timeout=60.0, limits=limits) as client_http:

        async def sem_fetch(pid):
            async with semaphore:
                return await fetch_article(pid, client_http)

        tasks = [sem_fetch(pid) for pid in pmc_ids]
        return await asyncio.gather(*tasks)

# ========== PARSE ARTICLE ==========


def extract_text(xml_content):
    if not xml_content:
        return ""
    soup = BeautifulSoup(xml_content, "xml")
    paragraphs = soup.find_all("abstract")
    return "\n".join(p.get_text() for p in paragraphs)


# ========== GEMINI AI SUMMARIZATION ==========
client = genai.Client(api_key=API_KEY)


class retry_if_gemini_429_error(retry_if_exception):
    def __init__(self):
        def is_gemini_429_error(exception):
            err = getError(exception.args)
            return (
                isinstance(exception, gen_errors.ClientError)
                and (
                    err[0] == "RESOURCE_EXHAUSTED"
                    or err[1] == 429
                )
            )
        super().__init__(predicate=is_gemini_429_error)


class wait_for_gemini_retry_delay(wait_base):
    def __init__(self, fallback):
        self.fallback = fallback

    def __call__(self, retry_state):
        exc = retry_state.outcome.exception()
        wait_seconds = None

        if isinstance(exc, gen_errors.ClientError):
            err = getError(exc.args)
            if (len(err) == 3 and err[1] == 429):
                print(f"⚠️ Gemini quota hit. Waiting {
                    err[2]}s before retry...")
                return err[2]
            elif (err[1] == 503):
                print("Gemini overloaded. Waiting 5 minutes before retry...")
                return 300

        fallback_wait = self.fallback(retry_state)
        print(f"⚠️ Gemini quota hit. Waiting {
              fallback_wait}s (fallback) before retry...")
        return fallback_wait


@retry(
    retry=retry_if_gemini_429_error(),
    wait=wait_for_gemini_retry_delay(fallback=wait_fixed(60)),
    stop=stop_after_attempt(5)
)
async def summarize_with_gemini(text, content):
    response = client.models.generate_content(
        # model="gemini-2.5-pro",
        # model="gemini-2.5-flash-lite",
        model="gemini-2.5-flash",
        # model="gemini-2.0-flash",
        # model="gemini-2.0-flash-001",
        contents=f"{content}:\n{text}"
    )
    return response.text


async def summarize_article(text):
    prompt = """
Hello Gemini! I will give you a text. You must analyze how strongly it relates to each of the following 15 established scientific topics:
Molecular Biology
Space Biology
Microgravity
Space Medicine
Radiation Biology
Immunology
Genomics
Bioinformatics & Systems Biology
Bone-related Biology
Cardiovascular-related Biology
Microbiology
Astrobiology
Plant Biology & Space Agriculture
Stem Cell & Regenerative Medicine
Oxidative Stress & Aging Biology
For each topic, output a decimal value between 0 and 1 (with up to 3 decimals), representing how strongly the text relates to that topic.
Output only the 15 decimal numbers in order, separated by commas and please dont skip to the next line. No explanations, no extra text.
"""
    try:
        return await summarize_with_gemini(text, prompt)
    except gen_errors.ServerError as e:
        code = getattr(e, "error", {}).get("code", None)
        if code == 503:
            print("Gemini overloaded. Waiting 5 minutes before retry...")
            await asyncio.sleep(300)
            return await summarize_article(text)
        else:
            raise

# ========== MAIN ==========


async def main():
    df = pd.read_csv("test.csv")
    urls = df["url"].tolist()

    pmc_ids = []
    for url in urls:
        pid = extract_pmc_id_from_url(url)
        if pid:
            pmc_ids.append(pid)
        else:
            print("Warning: failed to parse PMC ID from:", url)

    if os.path.exists(SUMMARY_FILE):
        with open(SUMMARY_FILE, "r", encoding="utf-8") as f:
            try:
                existing_data = json.load(f)
            except json.JSONDecodeError:
                existing_data = {}
    else:
        existing_data = {}

    if not isinstance(existing_data, dict):
        existing_data = {}

    semaphore = asyncio.Semaphore(MAX_CONCURRENT)
    limits = httpx.Limits(max_connections=MAX_CONCURRENT)
    async with httpx.AsyncClient(timeout=60.0, limits=limits) as client_http:

        async def fetch_process_save(pmc_id):
            async with semaphore:
                if pmc_id in existing_data:
                    print(f"PMC{pmc_id} already in database, skipping...")
                    return

                xml = await fetch_article(pmc_id, client_http)
                if not xml:
                    print(f"No XML returned for PMC{pmc_id}")
                    return

                text = extract_text(xml)
                if not text:
                    print(f"No abstract found for PMC{pmc_id}")
                    return

                summary = await summarize_article(text)
                print(f"PMC{pmc_id} summary:", summary)
                existing_data[pmc_id] = summary
                with open(SUMMARY_FILE, "w", encoding="utf-8") as f:
                    json.dump(existing_data, f, indent=2, ensure_ascii=False)

        tasks = [fetch_process_save(pid) for pid in pmc_ids]
        await asyncio.gather(*tasks)

    print(f"Done. Summaries saved to {SUMMARY_FILE}")

if __name__ == "__main__":
    asyncio.run(main())
