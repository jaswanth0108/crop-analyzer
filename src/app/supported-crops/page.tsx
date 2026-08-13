"use client";

import { SUPPORTED_CONDITIONS, UNIQUE_SPECIES, getConditionsForSpecies } from "@/lib/supported-conditions";
import { DATASET_TOTALS } from "@/app/datasets/data";
import { useTranslation } from "@/lib/i18n/useTranslation";

// Note: This page is now "use client" so it can access the language context.
// The metadata export is removed (not allowed in client components);
// page-level metadata for this route is set in a parent server component if needed.

export default function SupportedCropsPage() {
  const { t } = useTranslation();

  return (
    <div style={{ minHeight: "calc(100vh - 64px)", background: "var(--bg-base)", padding: "48px 0 80px" }}>
      <div className="section-container" style={{ maxWidth: "1100px" }}>

        {/* Header */}
        <div style={{ textAlign: "center", marginBottom: "56px" }}>
          <div
            style={{
              display: "inline-flex",
              alignItems: "center",
              gap: "8px",
              padding: "6px 16px",
              background: "rgba(16,185,129,0.08)",
              border: "1px solid rgba(16,185,129,0.25)",
              borderRadius: "100px",
              marginBottom: "20px",
              fontSize: "0.8rem",
              color: "#10b981",
              fontWeight: 600,
            }}
          >
            <span>🌿</span>
            <span>{t("supportedCrops.badge")}</span>
          </div>
          <h1
            className="font-display"
            style={{ fontSize: "clamp(2rem, 4vw, 3rem)", fontWeight: 900, marginBottom: "16px" }}
          >
            <span className="gradient-text">{t("supportedCrops.title1")}</span>{" "}
            {t("supportedCrops.titleHighlight")}
          </h1>
          <p style={{ color: "var(--text-secondary)", fontSize: "1.05rem", maxWidth: "640px", margin: "0 auto" }}>
            {t("supportedCrops.subtitlePart1")}{" "}
            <strong style={{ color: "var(--text-primary)" }}>
              {DATASET_TOTALS.totalImages.toLocaleString()} {t("supportedCrops.subtitleImages")}
            </strong>{" "}
            {t("supportedCrops.subtitlePart2")}{" "}
            <strong style={{ color: "var(--text-primary)" }}>
              {DATASET_TOTALS.totalSpecies} {t("supportedCrops.subtitleSpecies")}
            </strong>{" "}
            {t("supportedCrops.subtitlePart3")}{" "}
            <strong style={{ color: "var(--text-primary)" }}>
              {DATASET_TOTALS.totalClasses} {t("supportedCrops.subtitleClasses")}
            </strong>{" "}
            {t("supportedCrops.subtitlePart4")}
          </p>
        </div>

        {/* Stats bar */}
        <div
          style={{
            display: "grid",
            gridTemplateColumns: "repeat(3, 1fr)",
            gap: "16px",
            marginBottom: "48px",
          }}
        >
          {[
            { label: t("supportedCrops.statSpecies"),    value: DATASET_TOTALS.totalSpecies,             icon: "🌱" },
            { label: t("supportedCrops.statConditions"), value: DATASET_TOTALS.totalClasses,             icon: "🔬" },
            { label: t("supportedCrops.statImages"),     value: DATASET_TOTALS.totalImages.toLocaleString(), icon: "📸" },
          ].map((stat) => (
            <div
              key={stat.label}
              className="card"
              style={{ padding: "24px", textAlign: "center" }}
            >
              <div style={{ fontSize: "2rem", marginBottom: "8px" }}>{stat.icon}</div>
              <div
                className="font-display"
                style={{ fontSize: "clamp(1.8rem, 3vw, 2.4rem)", fontWeight: 900, color: "var(--text-primary)", marginBottom: "4px" }}
              >
                {stat.value}
              </div>
              <div style={{ fontSize: "0.85rem", color: "var(--text-muted)" }}>{stat.label}</div>
            </div>
          ))}
        </div>

        {/* Per-species breakdown */}
        <h2 className="font-display" style={{ fontSize: "1.4rem", fontWeight: 800, marginBottom: "24px" }}>
          {t("supportedCrops.breakdown")}
        </h2>

        <div style={{ display: "flex", flexDirection: "column", gap: "16px" }}>
          {UNIQUE_SPECIES.map((species) => {
            const conditions = getConditionsForSpecies(species);
            const diseases = conditions.filter((c) => !c.isHealthy);
            const emoji = conditions[0]?.emoji ?? "🌱";
            const sources = [...new Set(conditions.flatMap((c) => c.sources))];

            return (
              <div key={species} className="card" style={{ padding: "24px" }}>
                {/* Species header */}
                <div style={{ display: "flex", alignItems: "center", gap: "16px", marginBottom: "20px", flexWrap: "wrap" }}>
                  <span style={{ fontSize: "2.2rem" }}>{emoji}</span>
                  <div style={{ flex: 1 }}>
                    <h3 className="font-display" style={{ fontSize: "1.15rem", fontWeight: 800, marginBottom: "4px" }}>
                      {species}
                    </h3>
                    <div style={{ display: "flex", gap: "6px", flexWrap: "wrap" }}>
                      {sources.map((src) => (
                        <span
                          key={src}
                          style={{
                            padding: "2px 10px",
                            background: "rgba(59,130,246,0.08)",
                            border: "1px solid rgba(59,130,246,0.2)",
                            borderRadius: "100px",
                            fontSize: "0.72rem",
                            color: "#3b82f6",
                            fontWeight: 600,
                          }}
                        >
                          {src}
                        </span>
                      ))}
                    </div>
                  </div>
                  <div style={{ textAlign: "right" }}>
                    <div style={{ fontSize: "1.3rem", fontWeight: 800, color: "var(--text-primary)" }}>
                      {diseases.length}
                    </div>
                    <div style={{ fontSize: "0.75rem", color: "var(--text-muted)" }}>
                      {t("supportedCrops.diseases")}
                    </div>
                  </div>
                </div>

                {/* Conditions grid */}
                <div style={{ display: "flex", flexWrap: "wrap", gap: "8px" }}>
                  {conditions.map((cond) => (
                    <div
                      key={cond.condition}
                      style={{
                        display: "flex",
                        alignItems: "center",
                        gap: "6px",
                        padding: "5px 12px",
                        background: cond.isHealthy
                          ? "rgba(16,185,129,0.08)"
                          : "rgba(255,255,255,0.03)",
                        border: cond.isHealthy
                          ? "1px solid rgba(16,185,129,0.25)"
                          : "1px solid rgba(255,255,255,0.07)",
                        borderRadius: "8px",
                        fontSize: "0.82rem",
                        color: cond.isHealthy ? "#10b981" : "var(--text-secondary)",
                      }}
                    >
                      <span>{cond.isHealthy ? "✅" : "🔴"}</span>
                      {/* conditionDisplay is kept in English (disease name accuracy) */}
                      <span>{cond.conditionDisplay}</span>
                    </div>
                  ))}
                </div>
              </div>
            );
          })}
        </div>

        {/* Footer note */}
        <div
          style={{
            marginTop: "48px",
            padding: "20px 24px",
            background: "rgba(245,158,11,0.07)",
            border: "1px solid rgba(245,158,11,0.2)",
            borderRadius: "12px",
          }}
        >
          <p style={{ fontSize: "0.85rem", color: "var(--text-secondary)", lineHeight: 1.7, margin: 0 }}>
            ⚠️{" "}
            <strong style={{ color: "#f59e0b" }}>{t("supportedCrops.footerImportant")}</strong>{" "}
            {t("supportedCrops.footerNote")}
          </p>
        </div>
      </div>
    </div>
  );
}
