/**
 * NoveltyHints.tsx
 *
 * Renders the novelty analysis returned by detectNovelty():
 *   – noveltyScore    : 0–100 with a colour-coded visual bar
 *   – rationale[]     : per-dimension explanation
 *   – noveltySignals  : matched signal phrases
 */

import type { NoveltyResult } from "../utils/detectNovelty";

interface Props {
  data: NoveltyResult;
}

// ---------------------------------------------------------------------------
// Score colour helpers
// ---------------------------------------------------------------------------

function scoreColor(score: number): { bar: string; text: string; label: string } {
  if (score >= 75) {
    return { bar: "bg-emerald-500", text: "text-emerald-700", label: "High" };
  }
  if (score >= 50) {
    return { bar: "bg-amber-400", text: "text-amber-700", label: "Moderate" };
  }
  if (score >= 25) {
    return { bar: "bg-orange-400", text: "text-orange-700", label: "Low" };
  }
  return { bar: "bg-red-400", text: "text-red-700", label: "Minimal" };
}

// ---------------------------------------------------------------------------
// Main component
// ---------------------------------------------------------------------------

export default function NoveltyHints({ data }: Props) {
  const { noveltyScore, rationale, noveltySignals } = data;
  const { bar, text, label } = scoreColor(noveltyScore);

  return (
    <div className="space-y-5">
      {/* ── Score bar ───────────────────────────────────────────────── */}
      <div>
        <div className="mb-2 flex items-end justify-between">
          <span className="text-sm font-semibold text-slate-700">Novelty Score</span>
          <div className="flex items-baseline gap-1">
            <span className={`text-3xl font-extrabold ${text}`}>{noveltyScore}</span>
            <span className="text-sm text-slate-400">/ 100</span>
            <span className={`ml-2 rounded-full px-2 py-0.5 text-xs font-semibold ${text} bg-slate-100`}>
              {label}
            </span>
          </div>
        </div>
        {/* Track */}
        <div className="relative h-4 w-full overflow-hidden rounded-full bg-slate-200">
          <div
            className={`h-full rounded-full transition-all duration-700 ${bar}`}
            style={{ width: `${noveltyScore}%` }}
          />
          {/* Tick marks at 25, 50, 75 */}
          {[25, 50, 75].map((tick) => (
            <div
              key={tick}
              className="absolute top-0 h-full w-px bg-white opacity-60"
              style={{ left: `${tick}%` }}
            />
          ))}
        </div>
        {/* Tick labels */}
        <div className="mt-0.5 flex justify-between text-[10px] text-slate-400 px-0.5">
          <span>0</span>
          <span>25</span>
          <span>50</span>
          <span>75</span>
          <span>100</span>
        </div>
      </div>

      {/* ── Rationale ───────────────────────────────────────────────── */}
      {rationale.length > 0 && (
        <div>
          <h3 className="mb-2 text-sm font-semibold text-slate-700">Score Breakdown</h3>
          <ul className="space-y-2">
            {rationale.map((line, i) => {
              // Visual cue: bullet colour based on whether the line is positive
              const positive =
                line.toLowerCase().startsWith("strong") ||
                line.toLowerCase().startsWith("clear") ||
                line.toLowerCase().startsWith("high");
              return (
                <li key={i} className="flex gap-2 items-start text-sm text-slate-700">
                  <span
                    className={`mt-0.5 flex-shrink-0 h-4 w-4 rounded-full flex items-center justify-center text-[10px] font-bold text-white ${
                      positive ? "bg-emerald-500" : "bg-slate-400"
                    }`}
                  >
                    {positive ? "+" : "–"}
                  </span>
                  {line}
                </li>
              );
            })}
          </ul>
        </div>
      )}

      {/* ── Novelty signals ─────────────────────────────────────────── */}
      {noveltySignals.length > 0 && (
        <div>
          <h3 className="mb-2 text-sm font-semibold text-slate-700">Detected Signals</h3>
          <div className="flex flex-wrap gap-2">
            {noveltySignals.map((sig, i) => (
              <span
                key={i}
                className="rounded-full bg-indigo-50 border border-indigo-200 px-3 py-0.5 text-xs font-medium text-indigo-700"
              >
                {sig}
              </span>
            ))}
          </div>
        </div>
      )}

      {noveltyScore === 0 && noveltySignals.length === 0 && (
        <p className="text-sm text-slate-400 italic">
          No novelty signals detected. Try adding more specific technical detail.
        </p>
      )}
    </div>
  );
}
