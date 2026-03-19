import React from "react";
import { OpportunitiesResult } from "../utils/suggestOpportunities";

interface OpportunitiesProps {
  data: OpportunitiesResult;
}

const categoryStyles: Record<string, { bg: string; text: string }> = {
  Patent: { bg: "bg-purple-50", text: "text-purple-700" },
  Market: { bg: "bg-green-50", text: "text-green-700" },
  Technical: { bg: "bg-blue-50", text: "text-blue-700" },
  Research: { bg: "bg-orange-50", text: "text-orange-700" },
};

export default function Opportunities({ data }: OpportunitiesProps) {
  return (
    <div className="rounded-xl border border-gray-200 bg-white p-6 shadow-sm">
      <h2 className="mb-4 text-base font-semibold text-gray-800">🚀 Opportunities</h2>

      {data.opportunities.length === 0 ? (
        <p className="text-sm text-gray-500">No specific opportunities identified.</p>
      ) : (
        <ul className="space-y-4">
          {data.opportunities.map((opp, i) => {
            const style = categoryStyles[opp.category] ?? {
              bg: "bg-gray-50",
              text: "text-gray-600",
            };
            return (
              <li key={i} className="rounded-lg border border-gray-100 p-4">
                <div className="mb-2 flex items-center gap-2">
                  <span
                    className={`rounded-full px-2 py-0.5 text-xs font-semibold ${style.bg} ${style.text}`}
                  >
                    {opp.category}
                  </span>
                  <span className="text-sm font-semibold text-gray-800">{opp.title}</span>
                </div>
                <p className="text-sm text-gray-600">{opp.description}</p>
              </li>
            );
          })}
        </ul>
      )}
    </div>
  );
}
