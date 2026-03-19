/**
 * summarize.ts
 *
 * Generates a human-readable summary from raw invention text.
 *
 * Returns:
 *   – shortSummary     : 2–3 sentence synthesis (no double periods)
 *   – keyPhrases[]     : ranked noun phrases / key terms
 *   – topicArea        : concise domain label (e.g. "Biomedical Devices")
 *   – confidenceScore  : 0–1 reflecting text quality / richness
 *
 * No external APIs – pure TypeScript.
 */

import { STOP_WORDS } from "./constants";

export interface SummaryResult {
  shortSummary: string;
  keyPhrases: string[];
  topicArea: string;
  confidenceScore: number;
}

// ---------------------------------------------------------------------------
// Domain topic taxonomy
// ---------------------------------------------------------------------------

interface TopicRule {
  label: string;
  keywords: string[];
}

const TOPIC_RULES: TopicRule[] = [
  { label: "Artificial Intelligence & Machine Learning", keywords: ["neural network", "machine learning", "deep learning", "ai model", "training data", "inference", "classifier", "transformer"] },
  { label: "Biotechnology & Medicine", keywords: ["gene", "protein", "cell", "therapy", "drug", "pharmaceutical", "diagnostic", "biological", "medical device", "biosensor"] },
  { label: "Clean Energy & Sustainability", keywords: ["solar", "battery", "renewable", "energy storage", "fuel cell", "carbon", "emission", "sustainability", "photovoltaic"] },
  { label: "Semiconductor & Electronics", keywords: ["semiconductor", "transistor", "circuit", "chip", "pcb", "microcontroller", "fpga", "integrated circuit", "diode", "capacitor"] },
  { label: "Robotics & Automation", keywords: ["robot", "actuator", "servo", "autonomous", "motion control", "gripper", "industrial automation", "mechatronic"] },
  { label: "Communications & Networking", keywords: ["wireless", "5g", "antenna", "protocol", "encryption", "network", "bandwidth", "latency", "packet", "routing"] },
  { label: "Software & Computing", keywords: ["software", "algorithm", "database", "api", "cloud", "distributed system", "compiler", "operating system", "microservice"] },
  { label: "Materials Science", keywords: ["alloy", "composite", "polymer", "nanoparticle", "coating", "ceramic", "graphene", "metamaterial", "crystalline"] },
  { label: "Chemistry & Chemical Engineering", keywords: ["catalyst", "reaction", "synthesis", "compound", "solvent", "polymer", "oxidation", "reagent", "electrolyte"] },
  { label: "Mechanical Engineering", keywords: ["mechanism", "gear", "valve", "hydraulic", "pneumatic", "bearing", "transmission", "structural", "thermal management"] },
  { label: "Optical & Photonic Systems", keywords: ["laser", "lens", "photon", "optical fiber", "spectroscopy", "imaging", "waveguide", "infrared", "lidar"] },
  { label: "Data Analytics & Sensing", keywords: ["sensor", "data acquisition", "signal processing", "measurement", "detection", "monitoring", "analytics", "telemetry"] },
];

// ---------------------------------------------------------------------------
// Helpers
// ---------------------------------------------------------------------------

/** Collapse multiple spaces / newlines and trim. */
function clean(s: string): string {
  return s.replace(/\s+/g, " ").trim();
}

/** Ensure a sentence ends with exactly one period. */
function ensurePeriod(s: string): string {
  s = s.trim();
  // Remove trailing punctuation clusters before adding a single one
  s = s.replace(/[.!?,;:]+$/, "");
  return s + ".";
}

/** Split text into sentences. */
function toSentences(text: string): string[] {
  return text
    .split(/(?<=[.!?])\s+/)
    .map(clean)
    .filter((s) => s.length > 20);
}

// ---------------------------------------------------------------------------
// Key phrase extraction (bigram + unigram TF scoring)
// ---------------------------------------------------------------------------

function extractKeyPhrases(text: string, maxPhrases = 8): string[] {
  const lower = text.toLowerCase().replace(/[^a-z\s]/g, " ");
  const words = lower.split(/\s+/).filter((w) => w.length > 3 && !STOP_WORDS.has(w));

  // Unigram frequency
  const uniFreq: Record<string, number> = {};
  for (const w of words) {
    uniFreq[w] = (uniFreq[w] ?? 0) + 1;
  }

  // Bigram frequency
  const biFreq: Record<string, number> = {};
  for (let i = 0; i < words.length - 1; i++) {
    const bi = `${words[i]} ${words[i + 1]}`;
    biFreq[bi] = (biFreq[bi] ?? 0) + 1;
  }

  // Merge bigrams first (they carry more semantic weight), then unigrams
  const scored: Array<[string, number]> = [
    ...Object.entries(biFreq).filter(([, c]) => c >= 2),
    ...Object.entries(uniFreq).filter(([, c]) => c >= 2),
  ].sort((a, b) => b[1] - a[1]);

  // Deduplicate (skip unigrams already covered by a bigram)
  const seen = new Set<string>();
  const phrases: string[] = [];
  for (const [phrase] of scored) {
    if (!seen.has(phrase)) {
      // Mark constituent words
      for (const w of phrase.split(" ")) seen.add(w);
      seen.add(phrase);
      phrases.push(phrase);
    }
    if (phrases.length >= maxPhrases) break;
  }

  return phrases;
}

// ---------------------------------------------------------------------------
// Topic area detection
// ---------------------------------------------------------------------------

function detectTopicArea(text: string): string {
  const lower = text.toLowerCase();

  let bestLabel = "General Technology";
  let bestScore = 0;

  for (const rule of TOPIC_RULES) {
    const score = rule.keywords.reduce((acc, kw) => acc + (lower.includes(kw) ? 1 : 0), 0);
    if (score > bestScore) {
      bestScore = score;
      bestLabel = rule.label;
    }
  }

  return bestLabel;
}

// ---------------------------------------------------------------------------
// Confidence score
// ---------------------------------------------------------------------------

/**
 * Heuristic confidence based on text richness:
 * – Length (more content = more confident)
 * – Vocabulary diversity
 * – Presence of structured markers (headings, numbered lists, etc.)
 */
function computeConfidence(text: string): number {
  let score = 0;

  // Length score (0–0.3)
  const wordCount = text.split(/\s+/).length;
  score += Math.min(wordCount / 500, 1) * 0.3;

  // Vocabulary diversity (0–0.25)
  const allWords = text.toLowerCase().replace(/[^a-z\s]/g, " ").split(/\s+/).filter(Boolean);
  const uniqueWords = new Set(allWords);
  const diversity = uniqueWords.size / Math.max(allWords.length, 1);
  score += diversity * 0.25;

  // Structured markers (0–0.25)
  const structureMarkers = [
    /^#{1,4}\s/m,           // markdown headings
    /^\d+[.)]\s/m,          // numbered list
    /^step\s+\d/im,         // explicit steps
    /\bcomprises?\b/i,
    /\bwherein\b/i,
    /\bclaim\b/i,
    /\bembodiment\b/i,
  ];
  const markerHits = structureMarkers.filter((r) => r.test(text)).length;
  score += (markerHits / structureMarkers.length) * 0.25;

  // Technical vocabulary presence (0–0.2)
  const techTerms = [
    "method", "system", "apparatus", "device", "process", "mechanism",
    "component", "module", "algorithm", "interface",
  ];
  const techHits = techTerms.filter((t) => text.toLowerCase().includes(t)).length;
  score += (techHits / techTerms.length) * 0.2;

  return Math.min(Math.round(score * 100) / 100, 1);
}

// ---------------------------------------------------------------------------
// Short summary generation
// ---------------------------------------------------------------------------

/**
 * Pick the best 2–3 representative sentences from the text.
 * Strategy: prefer sentences that contain invention-signal words,
 * then fill with highest-information sentences.
 */
function buildShortSummary(text: string, keyPhrases: string[]): string {
  const sentences = toSentences(text);
  if (sentences.length === 0) return "No summary available.";

  const SIGNAL_WORDS = [
    "invention", "method", "system", "device", "apparatus", "provides",
    "enables", "solves", "addresses", "improvement", "novel", "unique",
    "advantage", "benefit", "result", "outcome",
  ];

  // Score each sentence
  const scored = sentences.map((s) => {
    let score = 0;
    const lower = s.toLowerCase();
    score += SIGNAL_WORDS.filter((w) => lower.includes(w)).length * 2;
    score += keyPhrases.filter((p) => lower.includes(p)).length * 3;
    // Prefer medium-length sentences
    const wc = s.split(/\s+/).length;
    if (wc >= 10 && wc <= 40) score += 2;
    // Slight preference for earlier sentences (they often state the invention)
    score += (1 / (sentences.indexOf(s) + 1)) * 2;
    return { s, score };
  });

  scored.sort((a, b) => b.score - a.score);

  // Take top 3, restore original order
  const top = scored
    .slice(0, 3)
    .map(({ s }) => s)
    .sort((a, b) => sentences.indexOf(a) - sentences.indexOf(b));

  return top.map(ensurePeriod).join(" ");
}

// ---------------------------------------------------------------------------
// Main export
// ---------------------------------------------------------------------------

/**
 * Generate a summary of raw invention text.
 */
export function summarize(text: string): SummaryResult {
  if (!text || text.trim().length === 0) {
    return {
      shortSummary: "No text provided.",
      keyPhrases: [],
      topicArea: "Unknown",
      confidenceScore: 0,
    };
  }

  const keyPhrases = extractKeyPhrases(text);
  const shortSummary = buildShortSummary(text, keyPhrases);
  const topicArea = detectTopicArea(text);
  const confidenceScore = computeConfidence(text);

  return { shortSummary, keyPhrases, topicArea, confidenceScore };
}
