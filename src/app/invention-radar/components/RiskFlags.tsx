/**
 * RiskFlags.tsx
 *
 * Renders the risk analysis returned by detectRisks():
 *   – overallRiskLevel  : "low" | "medium" | "high" banner
 *   – flags[]           : individual typed flags with severity styling
 *   – reasons[]         : explanatory text for each risk
 */

import type { RiskResult, FlagSeverity } from "../utils/detectRisks";

interface Props {
  data: RiskResult;
}

// ---------------------------------------------------------------------------
// Severity styling helpers
// ---------------------------------------------------------------------------

const SEVERITY_STYLES: Record<
  FlagSeverity,
  { bg: string; border: string; badge: string; icon: string }
> = {
  info: {
    bg: "bg-blue-50",
    border: "border-blue-200",
    badge: "bg-blue-100 text-blue-700",
    icon: "ℹ",
  },
  warning: {
    bg: "bg-amber-50",
    border: "border-amber-200",
    badge: "bg-amber-100 text-amber-800",
    icon: "⚠",
  },
  critical: {
    bg: "bg-red-50",
    border: "border-red-200",
    badge: "bg-red-100 text-red-800",
    icon: "✕",
  },
};

const RISK_LEVEL_STYLES = {
  low: {
    container: "bg-emerald-50 border-emerald-300",
    text: "text-emerald-800",
    label: "Low Risk",
    icon: "✓",
  },
  medium: {
    container: "bg-amber-50 border-amber-300",
    text: "text-amber-800",
    label: "Medium Risk",
    icon: "~",
  },
  high: {
    container: "bg-red-50 border-red-300",
    text: "text-red-800",
    label: "High Risk",
    icon: "!",
  },
};

// ---------------------------------------------------------------------------
// Main component
// ---------------------------------------------------------------------------

export default function RiskFlags({ data }: Props) {
  const { overallRiskLevel, flags, reasons } = data;
  const levelStyle = RISK_LEVEL_STYLES[overallRiskLevel];

  return (
    <div className="space-y-4">
      {/* ── Overall risk banner ─────────────────────────────────────── */}
      <div
        className={`flex items-center gap-3 rounded-lg border px-4 py-3 ${levelStyle.container}`}
      >
        <span
          className={`flex h-8 w-8 flex-shrink-0 items-center justify-center rounded-full border-2 font-bold text-sm ${levelStyle.container} ${levelStyle.text}`}
        >
          {levelStyle.icon}
        </span>
        <div>
          <p className={`font-semibold ${levelStyle.text}`}>{levelStyle.label}</p>
          <p className="text-xs text-slate-500">
            {flags.length} flag{flags.length !== 1 ? "s" : ""} detected
          </p>
        </div>
      </div>

      {/* ── Individual flags ────────────────────────────────────────── */}
      {flags.length > 0 ? (
        <div className="space-y-3">
          {flags.map((flag, i) => {
            const style = SEVERITY_STYLES[flag.severity];
            return (
              <div
                key={i}
                className={`rounded-lg border p-3 ${style.bg} ${style.border}`}
              >
                <div className="mb-1 flex items-center gap-2">
                  <span
                    className={`inline-flex h-5 w-5 items-center justify-center rounded-full text-xs font-bold ${style.badge}`}
                  >
                    {style.icon}
                  </span>
                  <span className={`text-xs font-semibold uppercase tracking-wide ${style.badge.split(" ")[1]}`}>
                    {flag.severity}
                  </span>
                  <span className="text-xs font-medium text-slate-600 capitalize">
                    — {flag.type.replace(/-/g, " ")}
                  </span>
                </div>
                <p className="text-sm text-slate-700">{flag.message}</p>
              </div>
            );
          })}
        </div>
      ) : (
        <p className="text-sm text-slate-400 italic">No specific risk flags detected.</p>
      )}

      {/* ── Reasons ─────────────────────────────────────────────────── */}
      {reasons.length > 0 && (
        <div>
          <h3 className="mb-2 text-sm font-semibold text-slate-700">Risk Rationale</h3>
          <ul className="space-y-1">
            {reasons.map((reason, i) => (
              <li key={i} className="flex gap-2 items-start text-sm text-slate-600">
                <span className="mt-0.5 text-slate-400">•</span>
                {reason}
              </li>
            ))}
          </ul>
        </div>
      )}
    </div>
  );
}
