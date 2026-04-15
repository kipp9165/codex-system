import React from "react";
import { StructureResult } from "../utils/detectStructure";

interface StructureMapProps {
  data: StructureResult;
}

export default function StructureMap({ data }: StructureMapProps) {
  return (
    <div className="rounded-xl border border-gray-200 bg-white p-6 shadow-sm">
      <h2 className="mb-4 text-base font-semibold text-gray-800">📐 Structure Map</h2>

      <div className="mb-4 grid grid-cols-2 gap-3 sm:grid-cols-4">
        <Stat label="Words" value={data.wordCount} />
        <Stat label="Sentences" value={data.sentenceCount} />
        <Stat label="Problem?" value={data.hasProblemStatement ? "✅ Yes" : "❌ No"} />
        <Stat label="Solution?" value={data.hasSolution ? "✅ Yes" : "❌ No"} />
      </div>

      {data.sections.length > 0 && (
        <div className="mb-4">
          <p className="mb-2 text-xs font-medium uppercase tracking-wide text-gray-500">
            Detected Sections
          </p>
          <div className="flex flex-wrap gap-2">
            {data.sections.map((s) => (
              <span
                key={s}
                className="rounded-full bg-blue-50 px-3 py-1 text-xs font-medium text-blue-700"
              >
                {s}
              </span>
            ))}
          </div>
        </div>
      )}

      {data.claims.length > 0 && (
        <div>
          <p className="mb-2 text-xs font-medium uppercase tracking-wide text-gray-500">
            Claim-like Sentences ({data.claims.length})
          </p>
          <ul className="space-y-1">
            {data.claims.slice(0, 3).map((c, i) => (
              <li key={i} className="rounded bg-gray-50 px-3 py-2 text-xs text-gray-600">
                {c.trim().slice(0, 160)}…
              </li>
            ))}
          </ul>
        </div>
      )}
    </div>
  );
}

function Stat({ label, value }: { label: string; value: string | number }) {
  return (
    <div className="rounded-lg bg-gray-50 px-3 py-3 text-center">
      <p className="text-lg font-bold text-gray-800">{value}</p>
      <p className="text-xs text-gray-500">{label}</p>
    </div>
  );
}
