const express = require("express");
const bodyParser = require("body-parser");
// Codex Root v0.7
// Core backend engine for Invention Radar / Codex Labs

const express = require("express");
const cors = require("cors");

const app = express();

// ----- Middleware -----
app.use(cors());
app.use(express.json({ limit: "1mb" }));

// Simple request logging for stability and observability
app.use((req, res, next) => {
  const start = Date.now();
  res.on("finish", () => {
    const duration = Date.now() - start;
    console.log(
      `[${new Date().toISOString()}] ${req.method} ${req.originalUrl} -> ${
        res.statusCode
      } (${duration}ms)`
    );
  });
  next();
});

// ----- Health & root routes -----

// Render / uptime / health check
app.get("/", (req, res) => {
  res.status(200).send("Codex Root v0.7 is running");
});

// Optional explicit health endpoint
app.get("/health", (req, res) => {
  res.status(200).json({
    status: "ok",
    service: "codex-root",
    version: "0.7.0",
    timestamp: new Date().toISOString()
  });
});

// ----- Core Invention Radar stub (safe, stable, extendable) -----

// v0.7: single entrypoint for analysis
app.post("/radar", (req, res) => {
  try {
    const { input } = req.body || {};

    if (!input || typeof input !== "string") {
      return res.status(400).json({
        error: "Missing or invalid 'input'. Expected a non-empty string."
      });
    }

    // Placeholder analysis logic — safe, deterministic, and ready to be
    // replaced by your AI/agent pipeline. For now, it returns a structured,
    // stable response shape that the frontend and agents can rely on.

    const now = new Date().toISOString();

    const response = {
      meta: {
        service: "codex-root",
        module: "invention-radar",
        version: "0.7.0",
        timestamp: now
      },
      input: {
        raw: input.trim(),
        length: input.trim().length
      },
      analysis: {
        noveltyScore: 0.72, // placeholder
        riskFlags: [],
        industryTags: ["UNCLASSIFIED"], // placeholder
        confidence: 0.65 // placeholder
      },
      proceduralBrief: {
        summary:
          "This is a v0.7 placeholder procedural brief. The full Invention Radar pipeline will enrich this with legal, technical, and strategic guidance.",
        recommendedNextSteps: [
          "Clarify the core inventive concept in one sentence.",
          "Identify prior art or similar systems you are aware of.",
          "Decide whether this is patent, trade secret, or publication oriented.",
          "Run a deeper Invention Radar pass once the full pipeline is online."
        ]
      }
    };

    return res.status(200).json(response);
  } catch (err) {
    console.error("Error in /radar:", err);
    return res.status(500).json({
      error: "Internal server error in Invention Radar module."
    });
  }
});

// Backwards-compatible root POST (if you were previously POSTing to `/`)
app.post("/", (req, res) => {
  // Delegate to /radar for now to keep behavior consistent
  req.url = "/radar";
  app._router.handle(req, res);
});

// ----- Server bootstrap -----
const PORT = process.env.PORT || 10000;

app.listen(PORT, () => {
  console.log(`Codex Root v0.7 running on port ${PORT}`);
});
  console.log(`Codex Root v0.7 running on port ${PORT}`);
});
