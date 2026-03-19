import React from "react";
import { RiskResult } from "../utils/detectRisks";

interface RiskFlagsProps {
  data: RiskResult;
}

const levelStyles: Record<string, { bg: string; text: string; border: string; icon: string }> = {
  high: {
    bg: "bg-red-50",
    text: "text-red-700",
    border: "border-red-200",
    icon: "🔴",
  },
  medium: {
    bg: "bg-yellow-50",
    text: "text-yellow-700",
    border: "border-yellow-200",
    icon: "🟡",
  },
  low: {
    bg: "bg-blue-50",
    text: "text-blue-700",
    border: "border-blue-200",
    icon: "🔵",
  },
};

const overallBadge: Record<string, string> = {
  high: "bg-red-100 text-red-700",
  medium: "bg-yellow-100 text-yellow-700",
  low: "bg-green-100 text-green-700",
};

export default function RiskFlags({ data }: RiskFlagsProps) {
  return (
    <div className="rounded-xl border border-gray-200 bg-white p-6 shadow-sm">
      <div className="mb-4 flex items-center justify-between">
        <h2 className="text-base font-semibold text-gray-800">⚠️ Risk Flags</h2>
        <span
          className={`rounded-full px-3 py-1 text-xs font-semibold ${overallBadge[data.overallRisk]}`}
        >
          Overall: {data.overallRisk.charAt(0).toUpperCase() + data.overallRisk.slice(1)} Risk
        </span>
      </div>

      {data.flags.length === 0 ? (
        <p className="text-sm text-gray-500">No risk flags detected. Looking good! 🎉</p>
      ) : (
        <ul className="space-y-3">
          {data.flags.map((flag, i) => {
            const style = levelStyles[flag.level];
            return (
              <li
                key={i}
                className={`rounded-lg border p-4 ${style.bg} ${style.border}`}
              >
                <div className="flex items-center gap-2 mb-1">
                  <span>{style.icon}</span>
                  <span className={`text-sm font-semibold ${style.text}`}>{flag.category}</span>
                </div>
                <p className="text-sm text-gray-600">{flag.description}</p>
              </li>
            );
          })}
        </ul>
      )}
    </div>
  );
}
