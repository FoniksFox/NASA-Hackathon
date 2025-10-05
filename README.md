
## Project overview

Project name: [TBD]

Tagline / short description: [TBD]

Logo: [TBD]

Accent Color: [TBD]

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

- **Project name:** [TBD]
- **Tagline:** [TBD]
- **Logo:** `frontend/public/<logo.png>` (or a URL)
- **Primary contact / team:** [TBD]

This repository contains a hackathon project for the 2025 NASA Space Apps Challenge: a dynamic dashboard that merges the note-taking / graph-exploration feel of Obsidian with an LLM-driven conversational layer and a UMAP-based 3D projection of document embeddings. The dashboard helps researchers, mission planners, and curious users explore and summarize the 608 NASA bioscience publications using embeddings, vector search, and provenance-aware LLM responses.

## Goals

- Provide interactive, searchable summaries of NASA bioscience publications.
- Use embeddings + UMAP to visually cluster related publications and surface connections.
- Allow conversational queries over the corpus with source citations and provenance.
- Support domain-specific conversations and exports for mission planning or literature review.

## Architecture

### Frontend (`frontend/`)
- Vite + React + TypeScript UI
- Mantine UI components
- UMAP visualization canvas (deck.gl / D3 / three.js) showing a 3D projection
- Chat interface that calls backend conversational API

### Backend (`backend/`)
- Ingest pipeline: download, parse, and chunk publications (prefer Results / Conclusions / Abstract)
- Embedding generator: compute vectors for text chunks
- Vector store: persistent semantic index (Pinecone, Milvus, Weaviate, FAISS, etc.)
- Conversational API: RAG endpoints returning answers and inline citations

## API contract (minimal)

[TBD]

## Environment variables

[TBD]

## Developer setup

### Frontend

From the `frontend` folder:

```powershell
npm install
npm run dev
```

### Backend (high level)

- Choose implementation (e.g., Node/Express, FastAPI).
- Install dependencies, set `.env` values, and run the server.

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

- NASA bioscience publications list (608 papers) — [TBD]
- NASA Open Science Data Repository (OSDR)
- Space Life Sciences Library

## Security & provenance

- Always include source citations for LLM-generated statements.
- Protect API keys and never commit them to version control.

## Contributing & license

- Use `frontend` branch for UI changes and `backend` branch for server work.
- License: [TBD] (e.g., MIT)

## Contact

- Team / primary contact: [TBD]

## Acknowledgements

Built for the 2025 NASA Space Apps Challenge. Use of NASA data should follow NASA's terms and attribution guidelines.
