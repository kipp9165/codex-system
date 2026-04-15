# Codex Root v0.7

Core backend engine for **Invention Radar** and other Codex Labs systems.

This service is designed to be:

- **Stable**: Minimal dependencies, explicit routes, clear logging.
- **Deployable**: Works out of the box on Render, Vercel functions, or any Node host.
- **Extendable**: `/radar` is the primary entrypoint for Invention Radar analysis.

## Quick start

```bash
npm install
npm start
```

The server will start on:

http://localhost:10000 (locally)

process.env.PORT (in production, e.g. Render)

## Routes

**GET /**
Health/root route. Used by Render and uptime checks.

Response:

```
Codex Root v0.7 is running
```

**GET /health**
JSON health check.

Example response:

```json
{
  "status": "ok",
  "service": "codex-root",
  "version": "0.7.0",
  "timestamp": "2026-03-24T00:00:00.000Z"
}
```

**POST /radar**
Primary Invention Radar entrypoint.

Request body:

```json
{
  "input": "A system that..."
}
```
Example response (placeholder v0.7):

```json
{
  "meta": {
    "service": "codex-root",
    "module": "invention-radar",
    "version": "0.7.0",
    "timestamp": "2026-03-24T00:00:00.000Z"
  },
  "input": {
    "raw": "A system that...",
    "length": 16
  },
  "analysis": {
    "noveltyScore": 0.72,
    "riskFlags": [],
    "industryTags": ["UNCLASSIFIED"],
    "confidence": 0.65
  },
  "proceduralBrief": {
    "summary": "This is a v0.7 placeholder procedural brief. The full Invention Radar pipeline will enrich this with legal, technical, and strategic guidance.",
    "recommendedNextSteps": [
      "Clarify the core inventive concept in one sentence.",
      "Identify prior art or similar systems you are aware of.",
      "Decide whether this is patent, trade secret, or publication oriented.",
      "Run a deeper Invention Radar pass once the full pipeline is online."
    ]
  }
}
```

**POST /**
Backwards-compatible alias for /radar.

## Deployment notes

Render:

Build command: `npm install`

Start command: `node index.js`

Root Directory: leave blank

Node version: >= 18 recommended

Codex Root is intended to grow into a multi-module engine powering Invention Radar, procedural briefs, and real-time invention intelligence.

---
