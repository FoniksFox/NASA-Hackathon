
## Project overview

Project name: **Simbiosis**

Tagline / short description: Interactive AI-powered exploration of NASA's bioscience research universe

Logo: `simbiosisrecortado.png` / `logo_clear.png`

Accent Color: Mint Green (#4db391)

Access Link: http://54.38.34.111:3000/

Concept summary
----------------
This repository contains a hackathon project for the 2025 NASA Space Apps Challenge: a dynamic dashboard that combines the note-taking / graph-exploration feel of Obsidian with an LLM-driven conversational layer (ChatGPT-style) and a UMAP-based 3D projection instead of a static Obsidian graph. The goal is to help researchers, mission planners, and curious users explore and summarize the 608 NASA bioscience publications using AI, knowledge graph concepts, and visual embeddings.

High-level goals
- Provide interactive, searchable summaries of NASA bioscience publications.
- Use embeddings + UMAP to visually cluster related publications and surface connections.
- Allow conversational queries over the corpus with provenance and source links.

# NASA Bioscience Explorer (TBD)

Short description: An interactive dashboard combining an Obsidian-style note/graph workflow with an LLM-driven chat and a UMAP 3D projection for exploring NASA bioscience publications.

Table of contents
- [Project overview](#project-overview)
- [Goals](#goals)
- [Architecture](#architecture)
- [API contract (minimal)](#api-contract-minimal)
- [Environment variables](#environment-variables)
- [Developer setup](#developer-setup)
- [Data ingestion notes](#data-ingestion-notes)
- [UMAP & visualization](#umap--visualization)
- [Demo / judging script](#demo--judging-script)
- [Roadmap](#roadmap--next-steps)
- [Resources](#resources)
- [Security & provenance](#security--provenance)
- [Contributing & license](#contributing--license)

## Project overview

- **Project name:** Simbiosis
- **Tagline:** Interactive AI-powered exploration of NASA's bioscience research universe
- **Logo:** `frontend/public/logo_clear.png` or `simbiosisrecortado.png`
- **Primary contact / team:** borisbeslimov@gmail.com

This repository contains a hackathon project for the 2025 NASA Space Apps Challenge: a dynamic dashboard that merges the note-taking / graph-exploration feel of Obsidian with an LLM-driven conversational layer and a UMAP-based 3D projection of document embeddings. The dashboard helps researchers, mission planners, and curious users explore and summarize the 608 NASA bioscience publications using embeddings, vector search, and provenance-aware LLM responses.

## Goals

- Provide interactive, searchable summaries of NASA bioscience publications.
- Use embeddings + UMAP to visually cluster related publications and surface connections.
- Allow conversational queries over the corpus with source citations and provenance.
- Support domain-specific conversations and exports for mission planning or literature review.

## Architecture

### Frontend (`frontend/`)
- Vite + React + TypeScript
- Mantine UI components
- UMAP visualization canvas showing a 3D projection
- Chat interface that calls backend conversational API

### Backend (`backend/`)
- Ingest pipeline: download, parse, and chunk publications (prefer Results / Conclusions / Abstract)
- Embedding generator: compute vectors for text chunks
- Vector store: persistent semantic index (Pinecone, Milvus, Weaviate, FAISS, etc.)
- Conversational API: RAG endpoints returning answers and inline citations

## API contract (minimal)

See [INTEGRATION.md](INTEGRATION.md) for detailed API documentation.

**Key endpoints:**
- `POST /rag/find-topic` - Determines the most relevant topic for a question
- `POST /rag/ask-topic` - Answers questions within a specific topic context
- `POST /rag/add` - Adds text chunks to the vector store
- `GET /umap/data` - Returns UMAP 3D projection data for visualization

**Backend:** Spring Boot (Java 17) on port 8080  
**Frontend:** Vite + React + TypeScript on port 5173

## Environment variables

### Backend
Create a `.env` file or configure environment variables in your IDE:
- `GEMINI_API_KEY` - Your Google Gemini AI API key
- `SPRING_DATASOURCE_URL` - Database connection string (if using persistence)
- `SERVER_PORT` - Server port (default: 8080)

### Frontend
Create a `.env` file in the `frontend` directory:
- `VITE_API_BASE_URL` - Backend API URL (default: http://localhost:8080)

**Note:** Never commit API keys or secrets to version control. Use `.env.local` or environment-specific configuration.

## Developer setup

### Frontend

From the `frontend` folder:

```powershell
npm install
npm run dev
```

### Backend

From the `backend/symbiosis` folder:

```powershell
# Using Maven wrapper (Windows)
.\mvnw spring-boot:run

# Or if you have Maven installed
mvn spring-boot:run
```

**Requirements:**
- Java 17 or higher
- Maven 3.6+ (or use the included wrapper)
- Gemini API key configured in environment variables

See [backend/symbiosis/README.md](backend/symbiosis/README.md) for more details.

## Data ingestion notes

- Prioritize Results and Conclusions for objective findings.
- Chunk long sections with a sliding window (e.g., 500 tokens with 50-token overlap).
- Store per-chunk metadata: publication id, title, section, paragraph index, DOI/URL, and embedding vector id.

## UMAP & visualization

- The backend computes embeddings and (optionally) runs UMAP to produce a 3D projection (x,y,z).
- Each point can represent a document or an aggregated embedding for that document.
- Frontend fetches `/api/umap` and renders the 3D scatterplot. Clicking a point shows source.

## Demo / judging script (suggested)

1. Show the 3D UMAP scatterplot clustered by topic; pan/zoom and select a region.
2. Click a few points to surface excerpts and sources.
3. Run a conversational query such as "Summarize plant growth results in microgravity" and show the answer with inline citations.

## Roadmap & next steps

### Short term (hackathon)
- Fill placeholders (app name, logo, LLM + vector provider).
- Implement minimal ingest and produce a UMAP projection.
- Build the chat UI.

### Medium term
- Add knowledge graph linking entities (genes, organisms, experiments).
- Add export / shareable research notes and integration with NASA OSDR.

## Resources

- NASA bioscience publications list (608 papers) — `backend/analysis/articles.csv`
- NASA Open Science Data Repository (OSDR) - https://osdr.nasa.gov/bio/
- Space Life Sciences Library - https://github.com/jgalazka/SB_publications/tree/main
- Google Gemini AI for conversational interface

## Security & provenance

- Always include source citations for LLM-generated statements.
- Protect API keys and never commit them to version control.

## Contributing & license

- Main development happens on the `main` branch
- Create feature branches for significant changes
- License: MIT (Open Source)

## Contact

- Team / primary contact: Boris Mladenv Beslimov (borisbeslimov@gmail.com)
- Repository: https://github.com/FoniksFox/NASA-Hackathon

## Acknowledgements

Built for the 2025 NASA Space Apps Challenge. Use of NASA data should follow NASA's terms and attribution guidelines.