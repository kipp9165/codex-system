/**
 * detectNovelty.ts
 *
 * Scores invention text on a 0–100 novelty scale using four independent
 * heuristic sub-scores:
 *
 *   1. Mechanism specificity    – are concrete mechanisms described?
 *   2. Combination uniqueness   – does the text combine distinct concepts?
 *   3. Problem/solution clarity – is the problem→solution arc explicit?
 *   4. Non-obvious twists       – are surprising or counter-intuitive ideas present?
 *
 * Returns:
 *   – noveltyScore    : 0–100 integer
 *   – rationale[]     : per-dimension explanations
 *   – noveltySignals  : matched signals that boosted or penalised the score
 *
 * No external APIs – pure TypeScript.
 */

export interface NoveltyResult {
  noveltyScore: number;
  rationale: string[];
  noveltySignals: string[];
}

// ---------------------------------------------------------------------------
// Signal dictionaries
// ---------------------------------------------------------------------------

/** Words / phrases that signal a specific, novel mechanism. */
const MECHANISM_SIGNALS = [
  "specifically", "precisely", "wherein", "configured to", "adapted to",
  "by means of", "via the", "using a novel", "comprising a", "integrating",
  "the mechanism", "the process involves", "operates by", "functions by",
  "achieves this through", "this is accomplished by",
];

/** Connector words that suggest multi-concept combination. */
const COMBINATION_SIGNALS = [
  " and ", " combined with ", " integrated with ", " together with ",
  " in conjunction with ", " alongside ", " coupled with ", " paired with ",
  " while simultaneously ", " that also ",
];

/** Problem–solution signal pairs (one from each column triggers scoring). */
const PROBLEM_MARKERS = [
  "problem", "challenge", "limitation", "drawback", "difficulty",
  "inefficiency", "bottleneck", "barrier", "obstacle",
];
const SOLUTION_MARKERS = [
  "solves", "overcomes", "addresses", "eliminates", "reduces",
  "improves", "enhances", "enables", "provides a solution", "mitigates",
];

/** Words that suggest a non-obvious twist or counter-intuitive insight. */
const NON_OBVIOUS_SIGNALS = [
  "surprisingly", "unexpectedly", "counter-intuitively", "contrary to",
  "against conventional", "unlike previous", "in contrast to traditional",
  "novel approach", "innovative", "breakthrough", "first-of-its-kind",
  "paradigm shift", "unconventional", "non-obvious", "unexpected advantage",
  "previously unknown", "hitherto unknown", "first time",
];

/** Phrases that penalise novelty (known / generic). */
const PENALTY_SIGNALS = [
  "well-known", "conventional", "standard practice", "obvious",
  "prior art", "existing method", "traditional approach", "widely used",
  "simply applies", "off-the-shelf",
];

// ---------------------------------------------------------------------------
// Sub-score helpers
// ---------------------------------------------------------------------------

/** Count how many items from a list appear in the lower-cased text. */
function countMatches(lower: string, signals: string[]): number {
  return signals.filter((s) => lower.includes(s)).length;
}

/** Count distinct non-trivial "noun-like" tokens (proxy for concept count). */
function conceptCount(text: string): number {
  const stopWords = new Set([
    "the", "a", "an", "is", "are", "was", "were", "be", "been",
    "to", "of", "in", "on", "at", "by", "for", "with", "and",
    "or", "that", "this", "it", "its", "their", "they",
  ]);
  return new Set(
    text
      .toLowerCase()
      .replace(/[^a-z\s]/g, " ")
      .split(/\s+/)
      .filter((w) => w.length > 4 && !stopWords.has(w))
  ).size;
}

// ---------------------------------------------------------------------------
// Four sub-scores (each 0–25)
// ---------------------------------------------------------------------------

/** 1. Mechanism specificity (0–25). */
function scoreMechanismSpecificity(lower: string): { score: number; signals: string[] } {
  const hits = MECHANISM_SIGNALS.filter((s) => lower.includes(s));
  // Scale: every 2 hits ≈ +5 points, cap at 25
  const score = Math.min(Math.round((hits.length / 2) * 5), 25);
  return { score, signals: hits.slice(0, 5) };
}

/** 2. Combination uniqueness (0–25). */
function scoreCombinationUniqueness(text: string, lower: string): { score: number; signals: string[] } {
  const combHits = COMBINATION_SIGNALS.filter((s) => lower.includes(s));
  const concepts = conceptCount(text);
  // More diverse concepts + combination connectors = higher score
  const conceptBonus = Math.min(concepts / 10, 1) * 15; // up to 15
  const connectorBonus = Math.min(combHits.length * 2, 10); // up to 10
  const score = Math.min(Math.round(conceptBonus + connectorBonus), 25);
  return { score, signals: combHits.slice(0, 3) };
}

/** 3. Problem / solution clarity (0–25). */
function scoreProblemSolutionClarity(lower: string): { score: number; signals: string[] } {
  const problemHits = countMatches(lower, PROBLEM_MARKERS);
  const solutionHits = countMatches(lower, SOLUTION_MARKERS);
  // Both must be present for full marks
  const hasBoth = problemHits > 0 && solutionHits > 0 ? 15 : 0;
  const breadth = Math.min((problemHits + solutionHits) * 2, 10);
  const score = Math.min(hasBoth + breadth, 25);
  const signals: string[] = [
    ...PROBLEM_MARKERS.filter((s) => lower.includes(s)).slice(0, 2),
    ...SOLUTION_MARKERS.filter((s) => lower.includes(s)).slice(0, 2),
  ];
  return { score, signals };
}

/** 4. Non-obvious twists (0–25). */
function scoreNonObviousTwists(lower: string): { score: number; signals: string[] } {
  const positiveHits = NON_OBVIOUS_SIGNALS.filter((s) => lower.includes(s));
  const penaltyHits = countMatches(lower, PENALTY_SIGNALS);
  const raw = Math.min(positiveHits.length * 5, 25) - penaltyHits * 3;
  const score = Math.max(0, Math.min(raw, 25));
  return { score, signals: positiveHits.slice(0, 4) };
}

// ---------------------------------------------------------------------------
// Rationale builder
// ---------------------------------------------------------------------------

function buildRationale(
  mechScore: number,
  combScore: number,
  psScore: number,
  novelScore: number
): string[] {
  const lines: string[] = [];

  lines.push(
    mechScore >= 20
      ? "Strong mechanism specificity: the text describes concrete, detailed implementation mechanics."
      : mechScore >= 10
      ? "Moderate mechanism specificity: some implementation detail is present but could be more precise."
      : "Low mechanism specificity: the description lacks concrete technical detail about how the invention works."
  );

  lines.push(
    combScore >= 20
      ? "High combination uniqueness: the invention integrates multiple distinct concepts in a non-trivial way."
      : combScore >= 10
      ? "Moderate combination uniqueness: some cross-domain or multi-concept integration is evident."
      : "Low combination uniqueness: the description does not clearly combine novel concepts."
  );

  lines.push(
    psScore >= 20
      ? "Clear problem/solution pairing: the text explicitly identifies a problem and directly links it to the solution."
      : psScore >= 10
      ? "Partial problem/solution pairing: the problem or the solution is evident, but the linkage could be clearer."
      : "Weak problem/solution pairing: the text does not clearly articulate what problem this invention solves."
  );

  lines.push(
    novelScore >= 20
      ? "Strong non-obvious signals: the text highlights surprising, counter-intuitive, or unprecedented aspects."
      : novelScore >= 10
      ? "Some non-obvious signals detected, but the description could better highlight unexpected advantages."
      : "Few non-obvious signals: the text reads as incremental rather than breakthrough innovation."
  );

  return lines;
}

// ---------------------------------------------------------------------------
// Main export
// ---------------------------------------------------------------------------

/**
 * Score the novelty of an invention described in raw text.
 */
export function detectNovelty(text: string): NoveltyResult {
  if (!text || text.trim().length === 0) {
    return {
      noveltyScore: 0,
      rationale: ["No text provided; cannot assess novelty."],
      noveltySignals: [],
    };
  }

  const lower = text.toLowerCase();

  const { score: mechScore, signals: mechSignals } = scoreMechanismSpecificity(lower);
  const { score: combScore, signals: combSignals } = scoreCombinationUniqueness(text, lower);
  const { score: psScore, signals: psSignals } = scoreProblemSolutionClarity(lower);
  const { score: novelScore, signals: noSignals } = scoreNonObviousTwists(lower);

  const noveltyScore = mechScore + combScore + psScore + novelScore; // 0–100

  const rationale = buildRationale(mechScore, combScore, psScore, novelScore);

  const noveltySignals = [...new Set([...mechSignals, ...combSignals, ...psSignals, ...noSignals])];

  return { noveltyScore, rationale, noveltySignals };
}
