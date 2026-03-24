# Codex Root v0.7

Backend substrate for Codex Labs – powers Invention Radar and other procedural modules.

- Runtime: Node + Express
- Hosting: Render
- Purpose: Backend-only API (no UI)
- Primary routes:
  - `GET /` – health + version
  - `POST /radar/analyze`
  - `POST /radar/score`
  - `POST /radar/brief`

## Run locally

```bash
npm install
npm run dev
```

Service will start on http://localhost:10000 (or PORT env var).

## Code

Server code: `index.js` implements the Radar endpoints and basic health checks.
