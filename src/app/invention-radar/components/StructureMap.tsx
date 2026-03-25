/**
 * StructureMap.tsx
 *
 * Renders the rich structural analysis returned by detectStructure():
 *   – Signals panel       (problem / solution / mechanism / outcome)
 *   – Sections list       (named text blocks)
 *   – Arguments list      (claim / evidence / conclusion triples)
 *   – Steps list          (ordered process actions)
 *   – Themes cloud        (recurring concepts)
 *   – Sequences list      (chronological or logical flows)
 */

import type { StructureResult } from "../utils/detectStructure";

interface Props {
  data: StructureResult;
}

// ---------------------------------------------------------------------------
// Small sub-components
// ---------------------------------------------------------------------------

function Badge({ label, color }: { label: string; color: string }) {
  return (
    <span
      className={`inline-block rounded-full px-2 py-0.5 text-xs font-medium ${color}`}
    >
      {label}
    </span>
  );
}

function SectionCard({ title, body }: { title: string; body: string }) {
  return (
    <div className="rounded-lg border border-slate-200 bg-white p-3">
      <p className="mb-1 text-xs font-semibold uppercase tracking-wide text-slate-500">
        {title}
      </p>
      <p className="text-sm text-slate-700 leading-relaxed">{body}</p>
    </div>
  );
}

// ---------------------------------------------------------------------------
// Main component
// ---------------------------------------------------------------------------

export default function StructureMap({ data }: Props) {
  const { sections, arguments: args, steps, themes, sequences, signals } = data;

  return (
    <div className="space-y-6">
      {/* ── Signals ─────────────────────────────────────────────────── */}
      <div>
        <h3 className="mb-2 text-sm font-semibold text-slate-700">Key Signals</h3>
        <div className="grid grid-cols-1 gap-2 sm:grid-cols-2">
          {(
            [
              { key: "problem", label: "Problem", color: "bg-red-50 border-red-200" },
              { key: "solution", label: "Solution", color: "bg-green-50 border-green-200" },
              { key: "mechanism", label: "Mechanism", color: "bg-blue-50 border-blue-200" },
              { key: "outcome", label: "Outcome", color: "bg-purple-50 border-purple-200" },
            ] as const
          ).map(({ key, label, color }) =>
            signals[key] ? (
              <div key={key} className={`rounded-lg border p-3 ${color}`}>
                <p className="mb-0.5 text-xs font-semibold uppercase tracking-wide text-slate-500">
                  {label}
                </p>
                <p className="text-sm text-slate-700">{signals[key]}</p>
              </div>
            ) : null
          )}
        </div>
        {!signals.problem && !signals.solution && !signals.mechanism && !signals.outcome && (
          <p className="text-sm text-slate-400 italic">No clear signals detected.</p>
        )}
      </div>

      {/* ── Sections ────────────────────────────────────────────────── */}
      {sections.length > 0 && (
        <div>
          <h3 className="mb-2 text-sm font-semibold text-slate-700">
            Sections <span className="text-slate-400">({sections.length})</span>
          </h3>
          <div className="space-y-2">
            {sections.map((sec, i) => (
              <SectionCard key={i} title={sec.title} body={sec.body} />
            ))}
          </div>
        </div>
      )}

      {/* ── Arguments ───────────────────────────────────────────────── */}
      {args.length > 0 && (
        <div>
          <h3 className="mb-2 text-sm font-semibold text-slate-700">
            Arguments <span className="text-slate-400">({args.length})</span>
          </h3>
          <div className="space-y-3">
            {args.map((arg, i) => (
              <div key={i} className="rounded-lg border border-slate-200 bg-white p-3 space-y-1">
                <div>
                  <Badge label="Claim" color="bg-indigo-100 text-indigo-700" />
                  <p className="mt-1 text-sm text-slate-700">{arg.claim}</p>
                </div>
                {arg.evidence && (
                  <div>
                    <Badge label="Evidence" color="bg-amber-100 text-amber-700" />
                    <p className="mt-1 text-sm text-slate-600">{arg.evidence}</p>
                  </div>
                )}
                {arg.conclusion && (
                  <div>
                    <Badge label="Conclusion" color="bg-teal-100 text-teal-700" />
                    <p className="mt-1 text-sm text-slate-600">{arg.conclusion}</p>
                  </div>
                )}
              </div>
            ))}
          </div>
        </div>
      )}

      {/* ── Steps ───────────────────────────────────────────────────── */}
      {steps.length > 0 && (
        <div>
          <h3 className="mb-2 text-sm font-semibold text-slate-700">
            Process Steps <span className="text-slate-400">({steps.length})</span>
          </h3>
          <ol className="space-y-1">
            {steps.map((step) => (
              <li key={step.index} className="flex gap-3 items-start">
                <span className="flex-shrink-0 mt-0.5 h-5 w-5 rounded-full bg-indigo-600 text-white flex items-center justify-center text-xs font-bold">
                  {step.index}
                </span>
                <p className="text-sm text-slate-700">{step.action}</p>
              </li>
            ))}
          </ol>
        </div>
      )}

      {/* ── Themes ──────────────────────────────────────────────────── */}
      {themes.length > 0 && (
        <div>
          <h3 className="mb-2 text-sm font-semibold text-slate-700">Recurring Themes</h3>
          <div className="flex flex-wrap gap-2">
            {themes.map((theme) => (
              <span
                key={theme.label}
                className="rounded-full bg-slate-100 px-3 py-1 text-xs font-medium text-slate-700"
                title={`${theme.occurrences} occurrences`}
              >
                {theme.label} &times; {theme.occurrences}
              </span>
            ))}
          </div>
        </div>
      )}

      {/* ── Sequences ───────────────────────────────────────────────── */}
      {sequences.length > 0 && (
        <div>
          <h3 className="mb-2 text-sm font-semibold text-slate-700">
            Logical Sequences <span className="text-slate-400">({sequences.length})</span>
          </h3>
          <div className="space-y-3">
            {sequences.map((seq, i) => (
              <div key={i} className="rounded-lg border border-slate-200 bg-slate-50 p-3">
                <p className="mb-2 text-xs font-semibold uppercase tracking-wide text-slate-500">
                  {seq.label}
                </p>
                <ul className="space-y-1">
                  {seq.items.map((item, j) => (
                    <li key={j} className="flex gap-2 items-start text-sm text-slate-700">
                      <span className="text-slate-400 font-mono">{j + 1}.</span>
                      {item}
                    </li>
                  ))}
                </ul>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Empty state */}
      {sections.length === 0 &&
        args.length === 0 &&
        steps.length === 0 &&
        themes.length === 0 &&
        sequences.length === 0 && (
          <p className="text-sm text-slate-400 italic">
            No structural elements detected. Try providing more detailed text.
          </p>
        )}
    </div>
  );
}
