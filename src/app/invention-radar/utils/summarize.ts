export interface SummaryResult {
  shortSummary: string;
  keyPhrases: string[];
  topicArea: string;
  confidence: "high" | "medium" | "low";
}

const STOP_WORDS = new Set([
  "a", "an", "the", "and", "or", "but", "in", "on", "at", "to", "for",
  "of", "with", "by", "from", "is", "are", "was", "were", "be", "been",
  "being", "have", "has", "had", "do", "does", "did", "will", "would",
  "could", "should", "may", "might", "that", "this", "these", "those",
  "it", "its", "as", "not", "no", "so", "if", "then", "than", "when",
  "where", "which", "who", "what", "how",
]);

function extractKeyPhrases(text: string): string[] {
  const words = text
    .toLowerCase()
    .replace(/[^a-z0-9\s]/g, " ")
    .split(/\s+/)
    .filter((w) => w.length > 3 && !STOP_WORDS.has(w));

  const freq: Record<string, number> = {};
  for (const word of words) {
    freq[word] = (freq[word] || 0) + 1;
  }

  return Object.entries(freq)
    .sort((a, b) => b[1] - a[1])
    .slice(0, 8)
    .map(([word]) => word);
}

function detectTopicArea(text: string): string {
  const lower = text.toLowerCase();
  if (/drug|pharmaceutical|medicine|compound|treatment|patient|therapy/i.test(lower))
    return "Pharmaceutical / Medical";
  if (/software|algorithm|computer|data|network|server|cloud|api|code/i.test(lower))
    return "Software / Technology";
  if (/mechanical|machine|motor|pump|valve|gear|engine|device/i.test(lower))
    return "Mechanical Engineering";
  if (/material|polymer|alloy|composite|nano|crystal|chemical/i.test(lower))
    return "Materials Science";
  if (/electric|circuit|battery|sensor|semiconductor|chip|transistor/i.test(lower))
    return "Electronics / Hardware";
  if (/biology|gene|protein|cell|organism|dna|rna|enzyme/i.test(lower))
    return "Biotechnology";
  return "General / Unknown";
}

export function summarize(text: string): SummaryResult {
  const sentences = text.split(/[.!?]+/).filter((s) => s.trim().length > 20);
  const keyPhrases = extractKeyPhrases(text);
  const topicArea = detectTopicArea(text);

  const shortSummary =
    sentences.length > 0
      ? sentences
          .slice(0, 2)
          .map((s) => s.trim().replace(/\.+$/, ""))
          .join(". ") + "."
      : "No summary available — text too short.";

  const wordCount = text.split(/\s+/).length;
  const confidence: "high" | "medium" | "low" =
    wordCount > 200 ? "high" : wordCount > 80 ? "medium" : "low";

  return { shortSummary, keyPhrases, topicArea, confidence };
}
