/**
 * detectRisks.ts
 *
 * Analyses invention text for IP / patent / regulatory risk patterns.
 *
 * Returns:
 *   – overallRiskLevel  : "low" | "medium" | "high"
 *   – reasons[]         : plain-English explanations
 *   – flags[]           : typed, severity-tagged individual risk flags
 *
 * No external APIs – pure TypeScript heuristics.
 */

export type RiskLevel = "low" | "medium" | "high";
export type FlagSeverity = "info" | "warning" | "critical";

export type FlagType =
  | "obviousness"
  | "over-broad-claims"
  | "lack-of-enablement"
  | "prior-art-vulnerability"
  | "regulatory-safety"
  | "vague-language"
  | "single-claim"
  | "generic-solution";

export interface RiskFlag {
  type: FlagType;
  severity: FlagSeverity;
  message: string;
}

export interface RiskResult {
  overallRiskLevel: RiskLevel;
  reasons: string[];
  flags: RiskFlag[];
}

// ---------------------------------------------------------------------------
// Risk rule definitions
// ---------------------------------------------------------------------------

interface RiskRule {
  type: FlagType;
  severity: FlagSeverity;
  /** At least one pattern must match (case-insensitive) */
  patterns: RegExp[];
  /** Plain-English message when triggered */
  message: string;
  /** Reason added to the reasons[] array */
  reason: string;
}

const RISK_RULES: RiskRule[] = [
  // ── Obviousness ────────────────────────────────────────────────────────────
  {
    type: "obviousness",
    severity: "warning",
    patterns: [
      /\bsimply\b/i,
      /\bwell[- ]known\b/i,
      /\bcommonly used\b/i,
      /\bstandard (method|technique|approach|practice)\b/i,
      /\bconventional\b/i,
      /\btraditional (method|approach)\b/i,
      /\bwidely adopted\b/i,
      /\bobvious (to|for)\b/i,
    ],
    message: "Text contains language suggesting the approach may be considered obvious (e.g. 'simply', 'well-known', 'conventional').",
    reason: "Obviousness risk: the description uses terms that indicate the invention may lack non-obvious character over the prior art.",
  },

  // ── Over-broad claims ───────────────────────────────────────────────────────
  {
    type: "over-broad-claims",
    severity: "critical",
    patterns: [
      /\bany (method|system|device|process|means)\b/i,
      /\ball (methods|systems|devices|processes)\b/i,
      /\bwhatever (means|method)\b/i,
      /\bany and all\b/i,
      /\bwherein [^.]{0,20}(any|all)\b/i,
      /\bgeneral(ly|ised)\b/i,
    ],
    message: "Claims appear over-broad; broad language like 'any method' or 'all systems' risks invalidation.",
    reason: "Over-broad claims: un-scoped language substantially increases the likelihood of a rejection or post-grant invalidation.",
  },

  // ── Lack of enablement ─────────────────────────────────────────────────────
  {
    type: "lack-of-enablement",
    severity: "warning",
    patterns: [
      /\b(might|could|possibly|potentially|may be able to)\b/i,
      /\bfuture work\b/i,
      /\bnot yet (tested|validated|demonstrated)\b/i,
      /\bin theory\b/i,
      /\bto be determined\b/i,
      /\bunder (investigation|development)\b/i,
    ],
    message: "Language suggests the invention is speculative or not fully reduced to practice, risking lack-of-enablement rejection.",
    reason: "Enablement risk: speculative or hedged language can cause a patent examiner to find the disclosure insufficient to enable one skilled in the art.",
  },

  // ── Prior-art vulnerability ─────────────────────────────────────────────────
  {
    type: "prior-art-vulnerability",
    severity: "warning",
    patterns: [
      /\bpreviously (reported|described|disclosed)\b/i,
      /\bprior (work|art|approach|technique)\b/i,
      /\bexisting (system|method|approach)\b/i,
      /\bbuilds on\b/i,
      /\bextends (the|existing)\b/i,
      /\bwell[- ]established\b/i,
      /\binspired by\b/i,
      /\bbased on (existing|prior|known)\b/i,
    ],
    message: "References to prior work or existing approaches indicate potential prior-art vulnerability.",
    reason: "Prior-art risk: explicit acknowledgment of prior work narrows the scope of patentable novelty.",
  },

  // ── Regulatory / safety concerns ───────────────────────────────────────────
  {
    type: "regulatory-safety",
    severity: "critical",
    patterns: [
      /\b(drug|pharmaceutical|medicine|therapeutic|clinical trial)\b/i,
      /\b(FDA|CE mark|ISO 13485|medical device|510k)\b/i,
      /\b(radiation|toxic|hazardous|explosive|flammable|carcinogen)\b/i,
      /\b(nuclear|radioactive|bioweapon|pathogen)\b/i,
      /\bhuman (subjects?|trials?|patient)\b/i,
    ],
    message: "Domain involves regulated products (medical, pharmaceutical, hazardous materials), requiring additional compliance steps.",
    reason: "Regulatory / safety risk: the invention touches regulated domains that impose pre-market approval, safety testing, or special IP provisions.",
  },

  // ── Vague language ──────────────────────────────────────────────────────────
  {
    type: "vague-language",
    severity: "info",
    patterns: [
      /\bsomething like\b/i,
      /\betc\.?\b/i,
      /\band\/or\b/i,
      /\bvarious (ways|methods|means)\b/i,
      /\bapproximately\b/i,
      /\bsome (kind|type|form) of\b/i,
      /\bunspecified\b/i,
    ],
    message: "Vague or ambiguous language detected; claims should be precise to be defensible.",
    reason: "Vague language risk: imprecise wording may create prosecution history estoppel or allow competitors to design around claims.",
  },

  // ── Single-claim / thin description ────────────────────────────────────────
  {
    type: "single-claim",
    severity: "info",
    patterns: [
      /^(?![\s\S]*\bfurthermore\b)(?![\s\S]*\bin another embodiment\b)(?![\s\S]*\balternatively\b).{0,300}$/i,
    ],
    message: "Very short or single-aspect description detected; consider expanding claims to cover alternatives and embodiments.",
    reason: "Thin description risk: a narrow description limits claim scope and makes the patent easier to design around.",
  },

  // ── Generic solution ───────────────────────────────────────────────────────
  {
    type: "generic-solution",
    severity: "warning",
    patterns: [
      /\busing (ai|machine learning|blockchain|cloud computing)\b/i,
      /\bapplying (ai|machine learning|neural network)\b/i,
      /\bleveraging (ai|machine learning|big data)\b/i,
      /\b(automate|optimize) (using|with|via) (ai|ml|software)\b/i,
    ],
    message: "Solution relies on a generic technological approach (AI, blockchain, cloud) without a specific novel implementation.",
    reason: "Generic-solution risk: claiming broad use of a trending technology without specific implementation details is unlikely to survive patent examination.",
  },
];

// ---------------------------------------------------------------------------
// Helpers
// ---------------------------------------------------------------------------

function countWords(text: string): number {
  return text.split(/\s+/).filter(Boolean).length;
}

// ---------------------------------------------------------------------------
// Main analysis
// ---------------------------------------------------------------------------

/**
 * Evaluate invention text for patent / IP risk factors.
 */
export function detectRisks(text: string): RiskResult {
  if (!text || text.trim().length === 0) {
    return {
      overallRiskLevel: "low",
      reasons: ["No text provided; unable to assess risks."],
      flags: [],
    };
  }

  const flags: RiskFlag[] = [];
  const reasons: string[] = [];

  for (const rule of RISK_RULES) {
    const triggered = rule.patterns.some((p) => p.test(text));
    if (triggered) {
      flags.push({
        type: rule.type,
        severity: rule.severity,
        message: rule.message,
      });
      reasons.push(rule.reason);
    }
  }

  // Special heuristic: very short texts lack enablement by default
  if (countWords(text) < 80 && !flags.some((f) => f.type === "lack-of-enablement")) {
    flags.push({
      type: "lack-of-enablement",
      severity: "warning",
      message: "Description is very short; more detail is needed to satisfy enablement requirements.",
    });
    reasons.push(
      "Enablement risk: texts under ~80 words rarely provide sufficient technical depth to enable the invention."
    );
  }

  // Derive overall risk level from flag severities
  const hasCritical = flags.some((f) => f.severity === "critical");
  const warningCount = flags.filter((f) => f.severity === "warning").length;

  let overallRiskLevel: RiskLevel;
  if (hasCritical || warningCount >= 3) {
    overallRiskLevel = "high";
  } else if (warningCount >= 1 || flags.length >= 2) {
    overallRiskLevel = "medium";
  } else {
    overallRiskLevel = "low";
  }

  return { overallRiskLevel, reasons, flags };
}
