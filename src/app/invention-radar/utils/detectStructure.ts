/**
 * detectStructure.ts
 *
 * Analyses raw invention text and extracts a rich structural model:
 *   – sections[]   : named blocks of text (headings or implicit breaks)
 *   – arguments[]  : claim / evidence / conclusion triples
 *   – steps[]      : ordered instructions or process actions
 *   – themes[]     : recurring high-level concepts
 *   – sequences[]  : chronological or logical flows
 *   – signals      : one-liner captures for problem / solution / mechanism / outcome
 *
 * No external APIs – pure TypeScript string analysis.
 */

import { STOP_WORDS } from "./constants";

export interface Section {
  title: string;
  body: string;
}

export interface Argument {
  claim: string;
  evidence: string;
  conclusion: string;
}

export interface Step {
  index: number;
  action: string;
}

export interface Theme {
  label: string;
  occurrences: number;
}

export interface Sequence {
  label: string;
  items: string[];
}

export interface Signals {
  problem: string;
  solution: string;
  mechanism: string;
  outcome: string;
}

export interface StructureResult {
  sections: Section[];
  arguments: Argument[];
  steps: Step[];
  themes: Theme[];
  sequences: Sequence[];
  signals: Signals;
}

// ---------------------------------------------------------------------------
// Helpers
// ---------------------------------------------------------------------------

/** Normalise whitespace and trim. */
function clean(s: string): string {
  return s.replace(/\s+/g, " ").trim();
}

/** Split text into individual sentences. */
function toSentences(text: string): string[] {
  return text
    .split(/(?<=[.!?])\s+/)
    .map((s) => s.trim())
    .filter(Boolean);
}

/** Return true when a line looks like an explicit heading. */
function isHeading(line: string): boolean {
  // Markdown-style headings
  if (/^#{1,4}\s/.test(line)) return true;
  // ALL-CAPS line with ≤ 8 words
  if (/^[A-Z][A-Z\s\d:/-]{3,}$/.test(line) && line.split(/\s+/).length <= 8) return true;
  // Line ending with a colon (e.g. "Background:")
  if (/^[A-Z][^.!?]{2,60}:\s*$/.test(line)) return true;
  return false;
}

// ---------------------------------------------------------------------------
// Section detection
// ---------------------------------------------------------------------------

function detectSections(text: string): Section[] {
  const lines = text.split("\n");
  const sections: Section[] = [];
  let currentTitle = "Introduction";
  let bodyLines: string[] = [];

  for (const rawLine of lines) {
    const line = rawLine.trim();
    if (!line) continue;

    if (isHeading(line)) {
      // Save the previous section if it has content
      if (bodyLines.length > 0) {
        sections.push({ title: currentTitle, body: clean(bodyLines.join(" ")) });
      }
      currentTitle = line.replace(/^#{1,4}\s*/, "").replace(/:$/, "").trim();
      bodyLines = [];
    } else {
      bodyLines.push(line);
    }
  }

  // Flush remaining content
  if (bodyLines.length > 0) {
    sections.push({ title: currentTitle, body: clean(bodyLines.join(" ")) });
  }

  // If there is only one implicit section, try to split by double newline
  if (sections.length === 1) {
    const paragraphs = text.split(/\n{2,}/).map(clean).filter(Boolean);
    if (paragraphs.length > 1) {
      return paragraphs.map((body, i) => ({
        title: `Paragraph ${i + 1}`,
        body,
      }));
    }
  }

  return sections.length > 0
    ? sections
    : [{ title: "Full Text", body: clean(text) }];
}

// ---------------------------------------------------------------------------
// Argument detection
// ---------------------------------------------------------------------------

/** Keyword sets for each argument role. */
const CLAIM_MARKERS = [
  "we claim",
  "the invention",
  "it is proposed",
  "the system",
  "the method",
  "the device",
  "the apparatus",
  "comprises",
  "is configured to",
];
const EVIDENCE_MARKERS = [
  "because",
  "since",
  "as shown",
  "tests show",
  "data indicates",
  "experiments",
  "results",
  "evidence",
  "for example",
  "for instance",
  "specifically",
  "in particular",
];
const CONCLUSION_MARKERS = [
  "therefore",
  "thus",
  "consequently",
  "as a result",
  "in conclusion",
  "ultimately",
  "this means",
  "hence",
  "so",
];

function hasMarker(sentence: string, markers: string[]): boolean {
  const lower = sentence.toLowerCase();
  return markers.some((m) => lower.includes(m));
}

function detectArguments(text: string): Argument[] {
  const sentences = toSentences(text);
  const args: Argument[] = [];

  for (let i = 0; i < sentences.length; i++) {
    const s = sentences[i];
    if (hasMarker(s, CLAIM_MARKERS)) {
      const evidence =
        sentences
          .slice(i + 1, i + 4)
          .find((e) => hasMarker(e, EVIDENCE_MARKERS)) ?? "";
      const conclusion =
        sentences
          .slice(i + 1, i + 6)
          .find((c) => hasMarker(c, CONCLUSION_MARKERS)) ?? "";
      args.push({ claim: clean(s), evidence: clean(evidence), conclusion: clean(conclusion) });
    }
  }

  return args;
}

// ---------------------------------------------------------------------------
// Step detection
// ---------------------------------------------------------------------------

/** Patterns that introduce an ordered step. */
const STEP_PATTERNS = [
  /^\s*(\d+)[.)]\s+(.+)/,             // "1. do something"
  /^\s*step\s+(\d+)\s*[:.]\s*(.+)/i,  // "Step 1: …"
  /^\s*([a-z])[.)]\s+(.+)/,           // "a) …"
  /^\s*[-•]\s+(first|then|next|finally|after|before|subsequently),?\s+(.+)/i,
];

function detectSteps(text: string): Step[] {
  const lines = text.split("\n");
  const steps: Step[] = [];
  let autoIndex = 1;

  for (const rawLine of lines) {
    const line = rawLine.trim();
    for (const pattern of STEP_PATTERNS) {
      const m = line.match(pattern);
      if (m) {
        const action = clean(m[m.length - 1]);
        steps.push({ index: autoIndex++, action });
        break;
      }
    }
  }

  return steps;
}

// ---------------------------------------------------------------------------
// Theme detection
// ---------------------------------------------------------------------------

/** Technical / domain concept words to boost. */
const THEME_BOOST_WORDS = new Set([
  "algorithm", "system", "method", "device", "process", "apparatus",
  "sensor", "network", "data", "machine", "model", "interface",
  "structure", "component", "module", "circuit", "signal", "control",
  "energy", "material", "chemical", "biological", "software", "hardware",
  "protocol", "communication", "detection", "analysis", "synthesis",
  "optimization", "compression", "encryption", "authentication",
]);

function detectThemes(text: string): Theme[] {
  const words = text
    .toLowerCase()
    .replace(/[^a-z\s]/g, " ")
    .split(/\s+/)
    .filter((w) => w.length > 3 && !STOP_WORDS.has(w));

  const freq: Record<string, number> = {};
  for (const w of words) {
    freq[w] = (freq[w] ?? 0) + (THEME_BOOST_WORDS.has(w) ? 3 : 1);
  }

  return Object.entries(freq)
    .sort((a, b) => b[1] - a[1])
    .slice(0, 10)
    .map(([label, occurrences]) => ({ label, occurrences }));
}

// ---------------------------------------------------------------------------
// Sequence detection
// ---------------------------------------------------------------------------

const SEQUENCE_CONNECTORS = [
  "first", "second", "third", "fourth", "fifth",
  "initially", "then", "next", "subsequently", "finally",
  "after", "before", "followed by", "prior to", "once",
  "meanwhile", "simultaneously", "concurrently",
];

function detectSequences(text: string): Sequence[] {
  const sentences = toSentences(text);
  const sequences: Sequence[] = [];
  let currentSeq: string[] = [];

  for (const s of sentences) {
    const lower = s.toLowerCase();
    const isConnected = SEQUENCE_CONNECTORS.some((c) => lower.startsWith(c) || lower.includes(`, ${c} `));
    if (isConnected) {
      currentSeq.push(clean(s));
    } else {
      if (currentSeq.length >= 2) {
        sequences.push({ label: `Flow ${sequences.length + 1}`, items: currentSeq });
      }
      currentSeq = [];
    }
  }

  if (currentSeq.length >= 2) {
    sequences.push({ label: `Flow ${sequences.length + 1}`, items: currentSeq });
  }

  return sequences;
}

// ---------------------------------------------------------------------------
// Signal extraction
// ---------------------------------------------------------------------------

const PROBLEM_MARKERS = ["problem", "challenge", "issue", "difficulty", "limitation", "drawback", "need", "lack"];
const SOLUTION_MARKERS = ["solution", "solves", "addresses", "overcomes", "provides", "enables", "allows"];
const MECHANISM_MARKERS = ["by using", "through", "via", "mechanism", "utilizes", "employs", "based on", "comprises"];
const OUTCOME_MARKERS = ["result", "outcome", "benefit", "advantage", "improvement", "achieves", "leads to", "produces"];

function extractSignal(sentences: string[], markers: string[]): string {
  const match = sentences.find((s) =>
    markers.some((m) => s.toLowerCase().includes(m))
  );
  return match ? clean(match) : "";
}

function extractSignals(text: string): Signals {
  const sentences = toSentences(text);
  return {
    problem: extractSignal(sentences, PROBLEM_MARKERS),
    solution: extractSignal(sentences, SOLUTION_MARKERS),
    mechanism: extractSignal(sentences, MECHANISM_MARKERS),
    outcome: extractSignal(sentences, OUTCOME_MARKERS),
  };
}

// ---------------------------------------------------------------------------
// Main export
// ---------------------------------------------------------------------------

/**
 * Analyse raw text and return a rich structural model.
 */
export function detectStructure(text: string): StructureResult {
  if (!text || text.trim().length === 0) {
    return {
      sections: [],
      arguments: [],
      steps: [],
      themes: [],
      sequences: [],
      signals: { problem: "", solution: "", mechanism: "", outcome: "" },
    };
  }

  return {
    sections: detectSections(text),
    arguments: detectArguments(text),
    steps: detectSteps(text),
    themes: detectThemes(text),
    sequences: detectSequences(text),
    signals: extractSignals(text),
  };
}
