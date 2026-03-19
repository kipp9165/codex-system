import React from "react";
import { SummaryResult } from "../utils/summarize";

interface SummaryProps {
  data: SummaryResult;
}

const confidenceColor: Record<string, string> = {
  high: "bg-green-100 text-green-700",
  medium: "bg-yellow-100 text-yellow-700",
  low: "bg-red-100 text-red-700",
};

export default function Summary({ data }: SummaryProps) {
  return (
    <div className="rounded-xl border border-gray-200 bg-white p-6 shadow-sm">
      <h2 className="mb-4 text-base font-semibold text-gray-800">📝 Summary</h2>

      <div className="mb-4 flex items-center gap-3">
        <span className="text-sm font-medium text-gray-600">Topic Area:</span>
        <span className="rounded-full bg-indigo-50 px-3 py-1 text-xs font-semibold text-indigo-700">
          {data.topicArea}
        </span>
        <span
          className={`rounded-full px-3 py-1 text-xs font-semibold ${confidenceColor[data.confidence]}`}
        >
          {data.confidence.charAt(0).toUpperCase() + data.confidence.slice(1)} Confidence
        </span>
      </div>

      <p className="mb-4 rounded-lg bg-gray-50 p-4 text-sm leading-relaxed text-gray-700">
        {data.shortSummary}
      </p>

      {data.keyPhrases.length > 0 && (
        <div>
          <p className="mb-2 text-xs font-medium uppercase tracking-wide text-gray-500">
            Key Phrases
          </p>
          <div className="flex flex-wrap gap-2">
            {data.keyPhrases.map((phrase) => (
              <span
                key={phrase}
                className="rounded-full bg-gray-100 px-3 py-1 text-xs text-gray-600"
              >
                {phrase}
              </span>
            ))}
          </div>
        </div>
      )}
    </div>
  );
}
