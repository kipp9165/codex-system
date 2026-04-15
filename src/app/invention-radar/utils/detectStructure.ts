export interface StructureResult {
  sections: string[];
  claims: string[];
  hasProblemStatement: boolean;
  hasSolution: boolean;
  wordCount: number;
  sentenceCount: number;
}

export function detectStructure(text: string): StructureResult {
  const sentences = text.split(/[.!?]+/).filter((s) => s.trim().length > 0);
  const words = text.split(/\s+/).filter((w) => w.length > 0);

  const lower = text.toLowerCase();

  const claimKeywords = ["claim", "wherein", "comprising", "consisting", "having", "whereby"];
  const claims = sentences.filter((s) =>
    claimKeywords.some((k) => s.toLowerCase().includes(k))
  );

  const sectionPatterns = [
    { label: "Background", pattern: /background|prior art|existing/i },
    { label: "Problem", pattern: /problem|issue|challenge|limitation/i },
    { label: "Solution", pattern: /solution|invention|method|apparatus|system/i },
    { label: "Claims", pattern: /claim|wherein|comprising/i },
    { label: "Abstract", pattern: /abstract|summary|overview/i },
    { label: "Embodiment", pattern: /embodiment|example|embodiments/i },
  ];

  const sections = sectionPatterns
    .filter(({ pattern }) => pattern.test(text))
    .map(({ label }) => label);

  const hasProblemStatement =
    /problem|challenge|issue|limitation|drawback|disadvantage/i.test(lower);
  const hasSolution =
    /solution|invention|provides?|method|apparatus|system|device/i.test(lower);

  return {
    sections,
    claims,
    hasProblemStatement,
    hasSolution,
    wordCount: words.length,
    sentenceCount: sentences.length,
  };
}
