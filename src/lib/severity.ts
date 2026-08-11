// ============================================================
// AgriShield — Severity Utilities
// ============================================================

import type { SeverityLabel } from "@/types/analysis";

/**
 * Convert a lesion-pixel percentage to a SeverityLabel.
 * Thresholds per spec:
 *   0%          → healthy
 *   0.1–10%     → mild
 *   10.1–25%    → moderate
 *   25.1–45%    → high
 *   45.1–65%    → very_high
 *   >65%        → critical
 */
export function percentageToSeverity(pct: number): SeverityLabel {
  if (pct <= 0) return "healthy";
  if (pct <= 10) return "mild";
  if (pct <= 25) return "moderate";
  if (pct <= 45) return "high";
  if (pct <= 65) return "very_high";
  return "critical";
}

export const SEVERITY_CONFIG: Record<
  SeverityLabel,
  { label: string; color: string; bg: string; bar: string }
> = {
  healthy:     { label: "Healthy",    color: "#10b981", bg: "rgba(16,185,129,0.15)", bar: "#10b981" },
  mild:        { label: "Mild",       color: "#84cc16", bg: "rgba(132,204,22,0.15)", bar: "#84cc16" },
  moderate:    { label: "Moderate",   color: "#f59e0b", bg: "rgba(245,158,11,0.15)", bar: "#f59e0b" },
  high:        { label: "High",       color: "#f97316", bg: "rgba(249,115,22,0.15)", bar: "#f97316" },
  very_high:   { label: "Very High",  color: "#ef4444", bg: "rgba(239,68,68,0.15)",  bar: "#ef4444" },
  critical:    { label: "Critical",   color: "#dc2626", bg: "rgba(220,38,38,0.15)",  bar: "#dc2626" },
  unavailable: { label: "N/A",        color: "#6b7280", bg: "rgba(107,114,128,0.1)", bar: "#6b7280" },
};
