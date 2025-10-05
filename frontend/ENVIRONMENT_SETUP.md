# Frontend Environment Setup

## Overview

The frontend has been configured to use environment variables for flexible deployment across different environments.

## Configuration Files

### `.env.example`
Template file committed to git showing all available configuration options with default values.

### `.env`
Local configuration file (gitignored) containing your actual environment values.

### `.gitignore`
Updated to exclude `.env`, `.env.local`, and `.env.*.local` files from version control.

## Environment Variables

| Variable | Description | Default |
|----------|-------------|---------|
| `VITE_BACKEND_URL` | Backend API base URL | `http://localhost:8080` |

## Usage

### First-time Setup

1. Copy the example file:
   ```powershell
   Copy-Item .env.example .env
   ```

2. Edit `.env` with your backend URL:
   ```env
   VITE_BACKEND_URL=http://192.168.238.233:8080
   ```

### Development

The Vite dev server will automatically read `.env` and use `VITE_BACKEND_URL` to proxy `/api/*` requests to your backend.

```powershell
npm run dev
```

### Production Build

Environment variables are read at build time:

```powershell
npm run build
```

For different environments, you can create:
- `.env.development` - Development-specific variables
- `.env.production` - Production-specific variables
- `.env.staging` - Staging-specific variables

## How It Works

1. **Vite Proxy**: In `vite.config.ts`, the dev server proxy reads `process.env.VITE_BACKEND_URL`
2. **Request Flow**: Frontend makes requests to `/api/*` → Vite proxy forwards to backend
3. **CORS**: The proxy handles CORS issues by forwarding requests server-side

## Files Modified

- `vite.config.ts` - Updated to use `process.env.VITE_BACKEND_URL`
- `.env` - Created with current backend URL
- `.env.example` - Updated with correct variable name
- `.gitignore` - Added `.env` file patterns
- `README.md` - Added environment configuration documentation

## Next Steps

For the backend, you would want to set up similar environment configuration for:
- Database connection strings
- API keys (OpenAI, etc.)
- Port configuration
- CORS origins
