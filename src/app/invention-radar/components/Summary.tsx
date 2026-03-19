/**
 * Summary.tsx
 *
 * Displays the summarisation result from summarize():
 *   – shortSummary     : 2–3 sentence synthesis
 *   – topicArea        : domain label
 *   – keyPhrases[]     : ranked key terms
 *   – confidenceScore  : 0–1 indicator with visual bar
 */

import type { SummaryResult } from "../utils/summarize";

interface Props {
  data: SummaryResult;
}

export default function Summary({ data }: Props) {
  const { shortSummary, topicArea, keyPhrases, confidenceScore } = data;

  const confidencePct = Math.round(confidenceScore * 100);

  // Colour-code the confidence bar
  const barColor =
    confidencePct >= 70
      ? "bg-emerald-500"
      : confidencePct >= 40
      ? "bg-amber-400"
      : "bg-red-400";

  const labelColor =
    confidencePct >= 70
      ? "text-emerald-700"
      : confidencePct >= 40
      ? "text-amber-700"
      : "text-red-600";

  return (
    <div className="space-y-5">
      {/* Topic area pill */}
      <div className="flex items-center gap-2">
        <span className="rounded-full bg-indigo-100 px-3 py-1 text-xs font-semibold text-indigo-700">
          {topicArea}
        </span>
      </div>

      {/* Short summary */}
      <div>
        <h3 className="mb-1 text-sm font-semibold text-slate-700">Summary</h3>
        <p className="text-sm leading-relaxed text-slate-700">{shortSummary}</p>
      </div>

      {/* Key phrases */}
      {keyPhrases.length > 0 && (
        <div>
          <h3 className="mb-2 text-sm font-semibold text-slate-700">Key Phrases</h3>
          <div className="flex flex-wrap gap-2">
            {keyPhrases.map((phrase, i) => (
              <span
                key={i}
                className="rounded-full border border-slate-300 bg-white px-3 py-0.5 text-xs font-medium text-slate-600"
              >
                {phrase}
              </span>
            ))}
          </div>
        </div>
      )}

      {/* Confidence score */}
      <div>
        <div className="mb-1 flex items-center justify-between">
          <span className="text-sm font-semibold text-slate-700">Analysis Confidence</span>
          <span className={`text-sm font-bold ${labelColor}`}>{confidencePct}%</span>
        </div>
        <div className="h-2 w-full rounded-full bg-slate-200 overflow-hidden">
          <div
            className={`h-full rounded-full transition-all duration-500 ${barColor}`}
            style={{ width: `${confidencePct}%` }}
          />
        </div>
        <p className="mt-1 text-xs text-slate-400">
          Based on text length, vocabulary richness, and structural markers.
        </p>
      </div>
    </div>
  );
}
