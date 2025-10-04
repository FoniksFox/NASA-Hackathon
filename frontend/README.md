# Frontend

This folder contains the Vite + React + TypeScript frontend for the hackathon dashboard. It implements the UMAP visualization, chat UI, search and filtering controls, and ties into the backend conversational and vector endpoints.

## Quick start

From the `frontend/` directory:

```powershell
npm install
npm run dev
```

Open the app at the URL shown by Vite (usually `http://localhost:5173`).

## Tech stack

- Vite
- React + TypeScript
- TailwindCSS
- Mantine UI (component library)
- React Router (routing)
- A visualization library for UMAP scatterplots (three.js)

## Mantine components used

This project uses Mantine for consistent, accessible UI elements. The README documents the main components expected in the app so contributors know where to look and how to extend them.

- AppShell (layout)
- Header / Navbar
  - https://ui.mantine.dev/component/header-tabs/
  - https://ui.mantine.dev/component/navbar-simple/
- Container / Grid / Stack
- Buttons (Button, IconButton)
- Inputs (TextInput, Textarea, Select, MultiSelect)
- Modal / Drawer (for document details / source excerpts)
- Card / Paper (for search results and document previews)
- Tabs (for switching views: Map / Documents / Chat)
- Tooltip / Popover (inline help and citations)
- ThemeProvider (MantineProvider) — custom theme tokens live in `src/theme` or similar

## Project structure (important files)

- `index.html` — Vite entry
- `src/main.tsx` — React root, providers (MantineProvider, Router, QueryClient if used)
- `src/App.tsx` — top-level routes and layout
- `src/pages/` — route components
- `src/components/` — reusable UI components (UMAPCanvas, ChatWindow, SearchBar, DocumentCard)
- `src/api/` — frontend API client functions for /api/ endpoints
- `src/theme/` — theme tokens and Mantine customization
- `src/assets/` — images, icons, logo placeholders

## Environment & configuration

The frontend reads only a few runtime values. Use environment variables prefixed with `VITE_`.

Create a `.env` file in `frontend/` for local development (do not commit secrets).

Example `.env`:

```env
VITE_API_URL=http://localhost:4000/api
VITE_APP_NAME="NASA Bioscience Explorer"
```

Notes:
- Keep secrets (LLM/API keys) on the backend only. The frontend should never store provider API keys.

## UMAP visualization

- The visualization component `UMAPCanvas` (or equivalent) consumes `/api/umap` which returns an array of points with coordinates and metadata.
- Points can be rendered using a fast WebGL layer (three.js).
- Clicking a point opens a window with the publication.

## Chat UI

- `ChatWindow` handles conversation state and displays LLM responses with inline citations.
- Each citation renders a small `DocumentCard` or popover with the excerpt and a link back to the source.

## Accessibility

- Mantine provides accessible primitives. Continue using semantic elements and ARIA attributes where needed.
- Test keyboard navigation (tab order) and screen-reader labels for interactive UMAP controls.

## Known TODOs

- Update known TODOs