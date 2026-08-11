"use client";

import { useMemo } from "react";
import { Check, X, Info } from "lucide-react";
import { SUPPORTED_CONDITIONS, CROP_COLORS, CROP_EMOJIS } from "@/lib/supported-conditions";

export default function SupportedCropsPage() {
  // Group conditions by crop
  const grouped = useMemo(() => {
    const map: Record<string, typeof SUPPORTED_CONDITIONS> = {};
    for (const c of SUPPORTED_CONDITIONS) {
      if (!map[c.crop]) map[c.crop] = [];
      map[c.crop].push(c);
    }
    return map;
  }, []);

  return (
    <div style={{ minHeight: "calc(100vh - 64px)", background: "var(--bg-base)", padding: "48px 0 80px" }}>
      <div className="section-container" style={{ maxWidth: "1000px" }}>
        
        <div style={{ textAlign: "center", marginBottom: "48px", animation: "fade-in-up 0.4s ease both" }}>
          <h1 className="font-display" style={{ fontSize: "clamp(1.8rem, 3vw, 2.8rem)", fontWeight: 900, marginBottom: "16px" }}>
            Supported <span className="gradient-text">Crops & Conditions</span>
          </h1>
          <p style={{ color: "var(--text-secondary)", fontSize: "1.05rem", maxWidth: "600px", margin: "0 auto" }}>
            AgriShield is trained to detect 13 specific crop conditions across 3 crops. 
            We do not attempt to classify conditions outside this validated set.
          </p>
        </div>

        <div style={{ display: "grid", gap: "40px" }}>
          {Object.entries(grouped).map(([cropKey, conditions], idx) => {
            const cropName = conditions[0].cropDisplay;
            const emoji = CROP_EMOJIS[cropKey] || "🌱";
            const color = CROP_COLORS[cropKey] || "#10b981";

            return (
              <div
                key={cropKey}
                className="card"
                style={{
                  overflow: "hidden",
                  animation: `fade-in-up 0.5s ease ${idx * 0.1}s both`,
                }}
              >
                {/* Crop Header */}
                <div
                  style={{
                    background: `linear-gradient(90deg, ${color}15, transparent)`,
                    borderBottom: "1px solid var(--border-card)",
                    padding: "24px 32px",
                    display: "flex",
                    alignItems: "center",
                    gap: "12px",
                  }}
                >
                  <span style={{ fontSize: "2rem" }}>{emoji}</span>
                  <h2 style={{ fontSize: "1.5rem", fontWeight: 800, color: "var(--text-primary)", margin: 0 }}>
                    {cropName}
                  </h2>
                </div>

                {/* Table */}
                <div style={{ overflowX: "auto" }}>
                  <table style={{ width: "100%", borderCollapse: "collapse", minWidth: "600px" }}>
                    <thead>
                      <tr style={{ background: "var(--bg-elevated)", borderBottom: "1px solid var(--border-card)" }}>
                        <th style={{ padding: "16px 32px", textAlign: "left", fontSize: "0.85rem", color: "var(--text-muted)", fontWeight: 600, textTransform: "uppercase" }}>Condition</th>
                        <th style={{ padding: "16px 32px", textAlign: "left", fontSize: "0.85rem", color: "var(--text-muted)", fontWeight: 600, textTransform: "uppercase" }}>Severity Estimation</th>
                        <th style={{ padding: "16px 32px", textAlign: "left", fontSize: "0.85rem", color: "var(--text-muted)", fontWeight: 600, textTransform: "uppercase" }}>Dataset Source</th>
                        <th style={{ padding: "16px 32px", textAlign: "left", fontSize: "0.85rem", color: "var(--text-muted)", fontWeight: 600, textTransform: "uppercase" }}>Status</th>
                      </tr>
                    </thead>
                    <tbody>
                      {conditions.map((c, i) => (
                        <tr
                          key={c.condition}
                          style={{
                            borderBottom: i === conditions.length - 1 ? "none" : "1px solid var(--border-subtle)",
                            background: i % 2 === 0 ? "transparent" : "var(--bg-elevated)",
                            transition: "background 0.2s"
                          }}
                        >
                          <td style={{ padding: "16px 32px", fontSize: "0.95rem", fontWeight: 600, color: "var(--text-primary)" }}>
                            {c.conditionDisplay}
                          </td>
                          <td style={{ padding: "16px 32px", fontSize: "0.9rem" }}>
                            {c.severityAvailable ? (
                              <span style={{ display: "inline-flex", alignItems: "center", gap: "6px", color: "#10b981", background: "rgba(16,185,129,0.1)", padding: "4px 10px", borderRadius: "20px", fontWeight: 600 }}>
                                <Check size={14} /> Available
                              </span>
                            ) : (
                              <span style={{ display: "inline-flex", alignItems: "center", gap: "6px", color: "var(--text-muted)", background: "var(--bg-hover)", padding: "4px 10px", borderRadius: "20px", fontWeight: 500 }}>
                                <X size={14} /> Unavailable
                              </span>
                            )}
                          </td>
                          <td style={{ padding: "16px 32px", fontSize: "0.85rem", color: "var(--text-secondary)" }}>
                            {c.datasetSource}
                          </td>
                          <td style={{ padding: "16px 32px" }}>
                            {c.status === "demo-only" ? (
                              <span className="badge badge-warning">Demo Only</span>
                            ) : c.status === "validated" ? (
                              <span className="badge badge-accent">Validated</span>
                            ) : (
                              <span className="badge badge-neutral">Trained</span>
                            )}
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              </div>
            );
          })}
        </div>

        <div
          style={{
            display: "flex",
            gap: "12px",
            alignItems: "flex-start",
            padding: "16px 20px",
            background: "rgba(59,130,246,0.07)",
            border: "1px solid rgba(59,130,246,0.2)",
            borderRadius: "12px",
            marginTop: "40px",
          }}
        >
          <Info size={18} color="#3b82f6" style={{ flexShrink: 0, marginTop: "2px" }} />
          <div>
            <p style={{ color: "#3b82f6", fontWeight: 600, fontSize: "0.9rem", marginBottom: "4px" }}>
              Why is severity estimation not available for all crops?
            </p>
            <p style={{ color: "var(--text-secondary)", fontSize: "0.85rem", lineHeight: 1.6, margin: 0 }}>
              Severity estimation requires pixel-level lesion segmentation masks during model training. 
              Currently, we only have reliable segmentation data for specific Rice/Paddy diseases. We will 
              expand this capability to Tomato and Potato as high-quality segmentation datasets become available.
            </p>
          </div>
        </div>

      </div>
    </div>
  );
}
