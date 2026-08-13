"use client";

import { useState } from "react";
import { ShieldAlert, Stethoscope, ShieldCheck, AlertCircle } from "lucide-react";
import type { Recommendation } from "@/types/analysis";
import { useTranslation } from "@/lib/i18n/useTranslation";

interface Props {
  recommendations: Recommendation[];
}

const CATEGORY_ICONS = {
  immediate: ShieldAlert,
  treatment: Stethoscope,
  prevention: ShieldCheck,
};

const CATEGORY_COLORS = {
  immediate: "#ef4444",
  treatment: "#3b82f6",
  prevention: "#10b981",
};

export default function RecommendationPanel({ recommendations }: Props) {
  const { t } = useTranslation();
  const [activeTab, setActiveTab] = useState<"immediate" | "treatment" | "prevention">("immediate");

  const CATEGORY_LABELS = {
    immediate: t("recommendation.immediate"),
    treatment: t("recommendation.treatment"),
    prevention: t("recommendation.prevention"),
  };

  const categories = ["immediate", "treatment", "prevention"] as const;

  // Default to the first available category if immediate is empty
  useState(() => {
    if (!recommendations.some(r => r.category === "immediate")) {
      if (recommendations.some(r => r.category === "treatment")) setActiveTab("treatment");
      else if (recommendations.some(r => r.category === "prevention")) setActiveTab("prevention");
    }
  });

  const activeRecs = recommendations.filter(r => r.category === activeTab);

  return (
    <div className="card" style={{ padding: "24px", display: "flex", flexDirection: "column" }}>
      <div style={{ display: "flex", alignItems: "center", gap: "8px", marginBottom: "20px" }}>
        <ShieldCheck size={20} color="var(--accent-primary)" />
        <h3 style={{ fontSize: "1.2rem", fontWeight: 700, color: "var(--text-primary)" }}>
          {t("recommendation.title")}
        </h3>
      </div>

      {/* Tabs */}
      <div style={{ display: "flex", gap: "8px", borderBottom: "1px solid var(--border-subtle)", paddingBottom: "12px", marginBottom: "20px", overflowX: "auto" }}>
        {categories.map((cat) => {
          const count = recommendations.filter(r => r.category === cat).length;
          if (count === 0) return null;

          const isActive = activeTab === cat;
          const Icon = CATEGORY_ICONS[cat];
          const color = CATEGORY_COLORS[cat];

          return (
            <button
              key={cat}
              onClick={() => setActiveTab(cat)}
              className={`tab-btn ${isActive ? "active" : ""}`}
              style={{ display: "flex", alignItems: "center", gap: "6px", whiteSpace: "nowrap" }}
            >
              <Icon size={16} color={isActive ? color : "currentColor"} />
              {CATEGORY_LABELS[cat]}
              <span style={{
                background: isActive ? `${color}20` : "var(--bg-hover)",
                color: isActive ? color : "var(--text-muted)",
                padding: "2px 6px",
                borderRadius: "10px",
                fontSize: "0.7rem",
                marginLeft: "4px"
              }}>
                {count}
              </span>
            </button>
          );
        })}
      </div>

      {/* Content */}
      <div style={{ display: "flex", flexDirection: "column", gap: "16px", minHeight: "200px" }}>
        {activeRecs.length === 0 ? (
          <p style={{ color: "var(--text-muted)", fontSize: "0.9rem", textAlign: "center", marginTop: "32px" }}>
            {t("recommendation.none")}
          </p>
        ) : (
          activeRecs.map((rec, idx) => (
            <div
              key={idx}
              style={{
                background: "var(--bg-elevated)",
                border: "1px solid var(--border-subtle)",
                borderRadius: "12px",
                padding: "16px",
                display: "flex",
                gap: "16px",
                alignItems: "flex-start",
                animation: `fade-in-up 0.4s ease ${idx * 0.1}s both`
              }}
            >
              <div
                style={{
                  width: "4px",
                  alignSelf: "stretch",
                  borderRadius: "4px",
                  background: rec.urgency === "high" ? "#ef4444" : rec.urgency === "medium" ? "#f59e0b" : "#10b981",
                  flexShrink: 0
                }}
              />
              <div style={{ flex: 1 }}>
                <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", marginBottom: "6px" }}>
                  <h4 style={{ fontSize: "1rem", fontWeight: 700, color: "var(--text-primary)", margin: 0 }}>
                    {rec.title}
                  </h4>
                  {rec.urgency === "high" && (
                    <span style={{ display: "flex", alignItems: "center", gap: "4px", fontSize: "0.75rem", color: "#ef4444", fontWeight: 600, background: "rgba(239,68,68,0.1)", padding: "2px 8px", borderRadius: "10px" }}>
                      <AlertCircle size={12} /> {t("recommendation.highPriority")}
                    </span>
                  )}
                </div>
                <p style={{ fontSize: "0.9rem", color: "var(--text-secondary)", lineHeight: 1.5, margin: 0 }}>
                  {rec.description}
                </p>
              </div>
            </div>
          ))
        )}
      </div>
    </div>
  );
}
