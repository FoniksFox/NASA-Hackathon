import json
import re
import numpy as np
import pandas as pd
import umap

with open("result.json", "r") as f:
    data = json.load(f)

ids = list(data.keys())
vectors = [list(map(float, data[k].split(","))) for k in ids]

df = pd.read_csv("articles.csv")

title_map = {}
for _, row in df.iterrows():
    match = re.search(r"PMC(\d+)", row["Link"])
    if match:
        pmc_id = match.group(1)
        title_map[pmc_id] = row["Title"]

X = np.array(vectors)
reducer = umap.UMAP(n_components=3, random_state=None, n_jobs=1)
embedding = reducer.fit_transform(X)

output = [
    {
        "id": id_,
        "title": title_map.get(id_, "Unknown Title"),
        "x": float(x),
        "y": float(y),
        "z": float(z)
    }
    for id_, (x, y, z) in zip(ids, embedding)
]

with open("output_3d.json", "w", encoding="utf-8") as f:
    json.dump(output, f, indent=2, ensure_ascii=False)
