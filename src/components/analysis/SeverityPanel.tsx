"use client";

import { useEffect, useState } from "react";
import { Activity } from "lucide-react";
import type { DiseaseResult } from "@/types/analysis";
import { SEVERITY_CONFIG } from "@/lib/severity";

interface Props {
  result: DiseaseResult;
}

export default function SeverityPanel({ result }: Props) {
  const config = SEVERITY_CONFIG[result.severityLabel];
  const [fillPct, setFillPct] = useState(0);

  useEffect(() => {
    // If unavailable, no bar
    if (result.severityLabel === "unavailable" || result.severityPercentage === null) {
      setFillPct(0);
      return;
    }
    // slight animation delay
    const t = setTimeout(() => {
      // Clamp between 2% (so it's visible if very low) and 100%
      setFillPct(Math.max(2, Math.min(100, result.severityPercentage!)));
    }, 100);
    return () => clearTimeout(t);
  }, [result.severityLabel, result.severityPercentage]);

  return (
    <div className="card" style={{ padding: "24px" }}>
      <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", marginBottom: "16px" }}>
        <div style={{ display: "flex", alignItems: "center", gap: "8px" }}>
          <Activity size={18} color="var(--text-secondary)" />
          <h3 style={{ fontSize: "1rem", fontWeight: 700, color: "var(--text-primary)" }}>
            Severity Estimation
          </h3>
        </div>
        
        {result.severityLabel !== "unavailable" && (
          <div
            style={{
              padding: "4px 12px",
              borderRadius: "20px",
              background: config.bg,
              color: config.color,
              fontSize: "0.8rem",
              fontWeight: 700,
              textTransform: "uppercase",
              letterSpacing: "0.05em",
            }}
          >
            {config.label}
          </div>
        )}
      </div>

      {result.severityLabel === "unavailable" ? (
        <p style={{ fontSize: "0.9rem", color: "var(--text-secondary)", fontStyle: "italic", margin: 0 }}>
          Severity estimation is currently unavailable for this condition.
        </p>
      ) : (
        <div>
          {/* Main Bar */}
          <div
            style={{
              height: "12px",
              background: "var(--bg-elevated)",
              borderRadius: "6px",
              overflow: "hidden",
              marginBottom: "12px",
              position: "relative",
            }}
          >
            {/* Range markers */}
            {[10, 25, 45, 65].map((pct) => (
              <div
                key={pct}
                style={{
                  position: "absolute",
                  left: `${pct}%`,
                  top: 0,
                  bottom: 0,
                  width: "1px",
                  background: "var(--bg-card)",
                  zIndex: 1,
                }}
              />
            ))}
            
            {/* Fill */}
            <div
              className="severity-bar-fill"
              style={{
                height: "100%",
                width: `${fillPct}%`,
                background: config.bar,
                borderRadius: "6px",
              }}
            />
          </div>

          <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center" }}>
            <div style={{ display: "flex", gap: "2px" }}>
              {["Healthy", "Mild", "Mod", "High", "V.High", "Crit"].map((lbl, i) => (
                <div key={lbl} style={{ fontSize: "0.6rem", color: "var(--text-muted)", width: i === 0 ? "10%" : i === 5 ? "35%" : i===1 ? "15%" : "20%" }}>
                  {lbl}
                </div>
              ))}
            </div>
            {result.severityPercentage !== null && (
              <span style={{ fontSize: "0.85rem", fontWeight: 600, color: "var(--text-secondary)" }}>
                {result.severityPercentage.toFixed(1)}% lesion area
              </span>
            )}
          </div>
        </div>
      )}
    </div>
  );
}
