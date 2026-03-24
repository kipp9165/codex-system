const express = require("express");
const bodyParser = require("body-parser");
const cors = require("cors");
const morgan = require("morgan");

const app = express();

// ----- Global middleware -----
app.use(cors());
app.use(bodyParser.json({ limit: "1mb" }));
app.use(morgan("combined"));

// ----- Basic health + version -----
app.get("/", (req, res) => {
  res
    .status(200)
    .type("text/plain")
    .send("Codex Root v0.7 is running.");
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

// ----- Invention Radar: /radar/analyze -----
// Input: { "input": "freeform idea text" }
// Output: { "signals": { ... } }
app.post("/radar/analyze", (req, res) => {
  try {
    const { input } = req.body;

    if (!input || typeof input !== "string") {
      return res
        .status(400)
        .json({ error: "Missing or invalid 'input' string." });
    }

    // Placeholder deterministic extraction – safe, no external calls.
    const signals = {
      problem: "Extracted problem statement from input.",
      solution: "Extracted solution concept from input.",
      industry: "Inferred industry or domain.",
      novelty: "Inferred novelty pattern.",
      mechanics: "Key mechanics / moving parts.",
      risks: [
        "Example risk 1 – execution risk.",
        "Example risk 2 – market adoption risk."
      ]
    };

    return res.status(200).json({ signals });
  } catch (err) {
    console.error("Error in /radar/analyze:", err);
    return res.status(500).json({ error: "Internal error in /radar/analyze." });
  }
});

// ----- Invention Radar: /radar/score -----
// Input: { "signals": { ... } }
// Output: { "scores": { novelty, viability, risk } }
app.post("/radar/score", (req, res) => {
  try {
    const { signals } = req.body;

    if (!signals || typeof signals !== "object") {
      return res
        .status(400)
        .json({ error: "Missing or invalid 'signals' object." });
    }

    // Placeholder deterministic scoring – stable, no randomness.
    const scores = {
      novelty: 0.78,
      viability: 0.64,
      risk: 0.32
    };

    return res.status(200).json({ scores });
  } catch (err) {
    console.error("Error in /radar/score:", err);
    return res.status(500).json({ error: "Internal error in /radar/score." });
  }
});

// ----- Invention Radar: /radar/brief -----
// Input: { "signals": { ... }, "scores": { ... } }
// Output: { "brief": "string" }
app.post("/radar/brief", (req, res) => {
  try {
    const { signals, scores } = req.body;

    if (!signals || typeof signals !== "object") {
      return res
        .status(400)
        .json({ error: "Missing or invalid 'signals' object." });
    }

    if (!scores || typeof scores !== "object") {
      return res
        .status(400)
        .json({ error: "Missing or invalid 'scores' object." });
    }

    const brief = `
Invention Radar Brief

Problem:
${signals.problem || "N/A"}

Solution:
${signals.solution || "N/A"}

Industry:
${signals.industry || "N/A"}

Novelty:
${signals.novelty || "N/A"}

Mechanics:
${signals.mechanics || "N/A"}

Risks:
${
  Array.isArray(signals.risks) && signals.risks.length > 0
    ? signals.risks.join(", ")
    : "N/A"
}

Scores:
- Novelty: ${scores.novelty ?? "N/A"}
- Viability: ${scores.viability ?? "N/A"}
- Risk: ${scores.risk ?? "N/A"}
`.trim();

    return res.status(200).json({ brief });
  } catch (err) {
    console.error("Error in /radar/brief:", err);
    return res.status(500).json({ error: "Internal error in /radar/brief." });
  }
});

// ----- 404 fallback -----
app.use((req, res) => {
  res.status(404).json({
    error: "Route not found.",
    method: req.method,
    path: req.path
  });
});

// ----- Global error handler -----
app.use((err, req, res, next) => {
  console.error("Unhandled error:", err);
  res.status(500).json({ error: "Unhandled server error." });
});

// ----- Server bootstrap -----
const PORT = process.env.PORT || 10000;
app.listen(PORT, () => {
  console.log(`Codex Root v0.7 running on port ${PORT}`);
});
