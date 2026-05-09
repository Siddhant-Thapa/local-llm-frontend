# CLAUDE.md — LLM Chat Frontend

Re-read this file at the start of every session before touching any code.

## Project Overview

React + TypeScript (Vite) chat UI for a self-hosted LLM running on EC2 t2.micro.
The frontend consumes a Server-Sent Events stream from the FastAPI backend and renders
tokens as they arrive. Deployed as a static build served by Nginx; no Node.js process
runs in production.

---

## Architecture Decisions

| Decision | Choice | Reason |
|---|---|---|
| Bundler | Vite | Fast HMR, native ESM, trivial SSE proxy config |
| UI framework | React 18 | Concurrent rendering suits streaming UI updates |
| Language | TypeScript (strict) | Catches prop/type mismatches at compile time |
| State management | React hooks only | No Redux/Zustand needed for single-user chat |
| SSE reading | fetch + ReadableStream | No external SSE library; works with AbortSignal for cleanup |
| Styling | globals.css (plain CSS) | No Tailwind/CSS-in-JS dependency; simpler bundle |

---

## Critical Constraints

- **No `any` types** — use `unknown` and narrow, or define a proper interface
- **Always pass `AbortSignal`** to `streamChat` and abort on component unmount to
  prevent memory leaks from dangling SSE connections
- **Never buffer tokens** — append each token to state immediately so the UI updates
  token-by-token
- The Vite dev proxy (`/api → localhost:8000`) handles CORS in dev; do not hardcode
  backend URLs in source files

---

## Local Dev Workflow

1. Install dependencies:
   ```
   npm install
   ```
2. Start dev server (backend must be running on port 8000):
   ```
   npm run dev
   ```
3. Open `http://localhost:5173`

## Production Build

```
npm run build     # outputs to dist/
npm run preview   # preview the build locally
```

Copy `dist/` to `/var/www/llm-chat` on the EC2 instance (handled by `deploy.sh`).
