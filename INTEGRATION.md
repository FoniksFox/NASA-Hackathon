# Frontend-Backend Integration

This document explains how the frontend and backend are connected and how to run the full application.

## Architecture Overview

- **Frontend**: React + TypeScript + Vite (running on port 5173)
- **Backend**: Spring Boot (Java 17) + Gemini AI (running on port 8080)
- **Communication**: REST API with CORS enabled

## Backend Endpoints

### RAG (Retrieval-Augmented Generation) API

- **POST /rag/find-topic**
  - Body: `string` (the question)
  - Returns: Topic name as text
  - Purpose: Determines the most relevant topic for a user's question

- **POST /rag/ask-topic**
  - Body: `{"topic": "string", "question": "string"}`
  - Returns: AI-generated response as text
  - Purpose: Answers a question within a specific topic context

- **POST /rag/add**
  - Body: `{"id": "string", "text": "string"}`
  - Returns: Confirmation message
  - Purpose: Adds a text chunk to the vector store

### UMAP (Visualization) API

- **GET /umap/articles**
  - Returns: Array of `ArticleCoords` objects
  - Purpose: Retrieves all article coordinates for 3D visualization

- **GET /umap/coords/{id}**
  - Returns: Single `ArticleCoords` object or 404
  - Purpose: Gets coordinates for a specific article

## How to Run

### 1. Start the Backend

```bash
cd backend/symbiosis
./mvnw spring-boot:run
```

Or on Windows:
```powershell
cd backend\symbiosis
.\mvnw.cmd spring-boot:run
```

The backend will start on `http://localhost:8080`

### 2. Start the Frontend

```bash
cd frontend
npm install  # First time only
npm run dev
```

The frontend will start on `http://localhost:5173`

### 3. Verify Connection

Open your browser to `http://localhost:5173` and:
- Try asking a question in the chat
- Navigate to the Graph view to see article visualizations
- Check the browser console for any connection errors

## Configuration

### Frontend Configuration

The frontend uses Vite proxy to route API requests:

**vite.config.ts**:
```typescript
server: {
  proxy: {
    '/api': {
      target: 'http://localhost:8080',
      changeOrigin: true,
      rewrite: (path) => path.replace(/^\/api/, ''),
    },
  },
}
```

**Environment Variables** (`.env`):
```
VITE_API_BASE_URL=http://localhost:8080
```

### Backend Configuration

**application.properties**:
```properties
spring.application.name=symbiosis
gemini.api.key=YOUR_GEMINI_API_KEY
```

**CORS Configuration** (`WebConfig.java`):
- Allows requests from `http://localhost:5173` (frontend dev server)
- Supports GET, POST, PUT, DELETE, OPTIONS methods

## API Service Layer

The frontend uses a centralized API service (`src/services/api.ts`) that exports:

- `ragApi.findTopic(question)` - Find relevant topic
- `ragApi.askTopic(topic, question)` - Ask question within topic
- `ragApi.addChunk(id, text)` - Add text to vector store
- `umapApi.getAllArticles()` - Get all article coordinates
- `umapApi.getArticleCoords(id)` - Get specific article coords
- `handleApiError(error)` - Error handling utility

## Chat Flow

1. User sends a message in ChatView
2. Frontend calls `ragApi.findTopic(message)` to detect the topic
3. Frontend calls `ragApi.askTopic(topic, message)` to get AI response
4. AI response is displayed with the detected topic
5. Current workspace topic is updated

## Graph Visualization Flow

1. GraphView component mounts
2. Calls `umapApi.getAllArticles()` to fetch article coordinates
3. Transforms 2D coordinates to 3D points
4. Renders articles as interactive spheres in 3D space
5. User can click on articles to open them

## Troubleshooting

### Backend won't start
- Ensure Java 17 is installed: `java -version`
- Check if port 8080 is available
- Verify Maven is working: `mvn --version`

### Frontend can't connect to backend
- Ensure backend is running on port 8080
- Check browser console for CORS errors
- Verify Vite proxy configuration in `vite.config.ts`

### API errors in chat
- Check backend logs for error messages
- Verify Gemini API key is valid in `application.properties`
- Ensure data.json and umap.json exist in backend resources

## Development Notes

- Both servers support hot-reload (no restart needed for most changes)
- Frontend uses TypeScript for type safety
- Backend uses Spring Boot auto-configuration
- All API calls include error handling with user-friendly messages
