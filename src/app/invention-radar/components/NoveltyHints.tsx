import React from "react";
import { NoveltyResult } from "../utils/detectNovelty";

interface NoveltyHintsProps {
  data: NoveltyResult;
}

const hintStyles: Record<string, { bg: string; text: string; icon: string }> = {
  positive: { bg: "bg-green-50", text: "text-green-700", icon: "✅" },
  neutral: { bg: "bg-gray-50", text: "text-gray-600", icon: "ℹ️" },
  warning: { bg: "bg-yellow-50", text: "text-yellow-700", icon: "⚠️" },
};

function ScoreBar({ score }: { score: number }) {
  const color = score >= 70 ? "bg-green-500" : score >= 45 ? "bg-yellow-400" : "bg-red-400";
  return (
    <div className="mt-1 h-3 w-full rounded-full bg-gray-100">
      <div
        className={`h-3 rounded-full transition-all ${color}`}
        style={{ width: `${score}%` }}
      />
    </div>
  );
}

export default function NoveltyHints({ data }: NoveltyHintsProps) {
  return (
    <div className="rounded-xl border border-gray-200 bg-white p-6 shadow-sm">
      <h2 className="mb-4 text-base font-semibold text-gray-800">💡 Novelty Hints</h2>

      <div className="mb-4">
        <div className="flex items-center justify-between text-sm">
          <span className="text-gray-600">Novelty Score</span>
          <span className="font-bold text-gray-800">{data.noveltyScore} / 100</span>
        </div>
        <ScoreBar score={data.noveltyScore} />
        <p className="mt-2 text-sm text-gray-500 italic">{data.summary}</p>
      </div>

      <ul className="space-y-3">
        {data.hints.map((hint, i) => {
          const style = hintStyles[hint.type];
          return (
            <li key={i} className={`rounded-lg p-4 ${style.bg}`}>
              <div className="flex items-center gap-2 mb-1">
                <span>{style.icon}</span>
                <span className={`text-sm font-semibold ${style.text}`}>{hint.label}</span>
              </div>
              <p className="text-sm text-gray-600">{hint.detail}</p>
            </li>
          );
        })}
      </ul>
    </div>
  );
}
