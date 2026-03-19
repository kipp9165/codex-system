export interface NoveltyHint {
  type: "positive" | "neutral" | "warning";
  label: string;
  detail: string;
}

export interface NoveltyResult {
  hints: NoveltyHint[];
  noveltyScore: number; // 0-100
  summary: string;
}

export function detectNovelty(text: string): NoveltyResult {
  const hints: NoveltyHint[] = [];
  let score = 50;

  const lower = text.toLowerCase();

  if (/novel|new|improved|innovative|unique|first|original/i.test(lower)) {
    hints.push({
      type: "positive",
      label: "Novelty Language",
      detail: "Text contains explicit novelty claims ('novel', 'new', 'innovative', etc.).",
    });
    score += 15;
  }

  if (/combination|integrat|synerg|hybrid/i.test(lower)) {
    hints.push({
      type: "positive",
      label: "Combination Invention",
      detail:
        "Combination or integration of existing elements detected — can be novel if the combination is non-obvious.",
    });
    score += 10;
  }

  if (/for the first time|never before|no prior/i.test(lower)) {
    hints.push({
      type: "positive",
      label: "First-of-Kind Claim",
      detail: "Text suggests this is a first-of-kind invention.",
    });
    score += 20;
  }

  if (/known|existing|conventional|traditional|standard/i.test(lower)) {
    hints.push({
      type: "warning",
      label: "Conventional Technology Reference",
      detail:
        "References to known or conventional technology may weaken novelty — ensure claims are differentiated.",
    });
    score -= 15;
  }

  if (/specific|particular|precise|exact|defined/i.test(lower)) {
    hints.push({
      type: "positive",
      label: "Specificity Detected",
      detail: "Specific technical details increase the novelty of the disclosure.",
    });
    score += 5;
  }

  if (hints.length === 0) {
    hints.push({
      type: "neutral",
      label: "Neutral — No Clear Novelty Signals",
      detail:
        "No strong novelty signals detected. Consider adding explicit language about what makes this invention new.",
    });
  }

  const noveltyScore = Math.max(0, Math.min(100, score));

  const summary =
    noveltyScore >= 70
      ? "Strong novelty signals detected."
      : noveltyScore >= 45
      ? "Moderate novelty signals — further differentiation from prior art recommended."
      : "Weak novelty signals — significant risk of prior art overlap.";

  return { hints, noveltyScore, summary };
}
