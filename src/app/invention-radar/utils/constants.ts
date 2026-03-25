/**
 * constants.ts
 *
 * Shared constants used across the Invention Radar utility modules.
 */

/**
 * Common English stop words excluded from keyword / theme extraction.
 * Kept in a single place so both summarize.ts and detectStructure.ts
 * stay in sync with any future changes.
 */
export const STOP_WORDS = new Set([
  "the", "a", "an", "is", "are", "was", "were", "be", "been", "being",
  "have", "has", "had", "do", "does", "did", "will", "would", "could",
  "should", "may", "might", "shall", "can", "need", "dare", "ought",
  "used", "to", "of", "in", "on", "at", "by", "for", "with", "about",
  "as", "from", "into", "through", "during", "including", "until",
  "against", "among", "throughout", "despite", "towards", "upon",
  "and", "but", "or", "nor", "not", "so", "yet", "both", "either",
  "neither", "whether", "than", "that", "which", "who", "what",
  "this", "these", "those", "it", "its", "they", "their", "them",
  "he", "she", "we", "you", "i", "me", "my", "our", "your",
  "also", "such", "use", "using", "each", "any", "all", "more",
  "other", "some", "same", "new", "one", "two", "three", "said",
  "where", "when", "how", "then", "very", "just", "like", "even",
  "still", "well", "back", "only", "come", "over", "think", "take",
  "make", "know", "time", "good", "look", "see", "go", "get", "way",
  "now",
]);
