"use client";

import { ExternalLink, Database, Cpu, FileText, AlertTriangle } from "lucide-react";
import { DATASETS } from "./data";
import { useTranslation } from "@/lib/i18n/useTranslation";

export default function DatasetsPage() {
  const { t } = useTranslation();

  return (
    <div style={{ minHeight: "calc(100vh - 64px)", background: "var(--bg-base)", padding: "48px 0 80px" }}>
      <div className="section-container" style={{ maxWidth: "1000px" }}>

        <div style={{ textAlign: "center", marginBottom: "48px", animation: "fade-in-up 0.4s ease both" }}>
          <h1 className="font-display" style={{ fontSize: "clamp(1.8rem, 3vw, 2.8rem)", fontWeight: 900, marginBottom: "16px" }}>
            {t("datasets.title1")} <span className="gradient-text">{t("datasets.titleHighlight")}</span>
          </h1>
          <p style={{ color: "var(--text-secondary)", fontSize: "1.05rem", maxWidth: "600px", margin: "0 auto" }}>
            {t("datasets.subtitle")}
          </p>
        </div>

        <div style={{ display: "grid", gap: "24px" }}>
          {DATASETS.map((ds, idx) => (
            <div
              key={ds.id}
              className="card"
              style={{
                padding: "32px",
                animation: `fade-in-up 0.5s ease ${idx * 0.1}s both`,
                borderLeft: "4px solid var(--accent-primary)",
              }}
            >
              <div style={{ display: "flex", alignItems: "flex-start", justifyContent: "space-between", flexWrap: "wrap", gap: "16px", marginBottom: "20px" }}>
                <div>
                  <h2 style={{ fontSize: "1.4rem", fontWeight: 700, color: "var(--text-primary)", marginBottom: "4px" }}>
                    {ds.name} ({ds.year})
                  </h2>
                  <div style={{ display: "flex", alignItems: "center", gap: "8px", flexWrap: "wrap" }}>
                    <span className="badge badge-accent">
                      {ds.numSpecies} {t("datasets.species")}
                    </span>
                    <span className="badge badge-neutral">
                      {ds.numClasses} {t("datasets.conditions")}
                    </span>
                    <span className="badge badge-neutral">
                      {ds.numImages.toLocaleString()} {t("datasets.images")}
                    </span>
                    <span className="badge badge-warning" style={{ background: "transparent" }}>
                      <FileText size={12} style={{ marginRight: "2px" }} /> {ds.license}
                    </span>
                  </div>
                </div>

                <a
                  href={ds.url}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="btn-ghost"
                  style={{ color: "#3b82f6", border: "1px solid rgba(59,130,246,0.3)" }}
                >
                  <ExternalLink size={14} /> {t("datasets.viewSource")}
                </a>
              </div>

              <div style={{ display: "grid", gridTemplateColumns: "1fr", gap: "16px", marginBottom: "24px" }}>
                <p style={{ fontSize: "0.95rem", color: "var(--text-secondary)", lineHeight: 1.6 }}>
                  {ds.description}
                </p>
                <div style={{ fontSize: "0.85rem", color: "var(--text-muted)", fontStyle: "italic" }}>
                  Citation: {ds.citation}
                </div>
              </div>

              <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(280px, 1fr))", gap: "24px" }}>
                <div>
                  <h4 style={{ display: "flex", alignItems: "center", gap: "6px", fontSize: "0.9rem", color: "var(--text-primary)", marginBottom: "8px" }}>
                    <Database size={16} color="var(--accent-primary)" /> {t("datasets.coverage")}
                  </h4>
                  <ul style={{ margin: 0, paddingLeft: "20px", color: "var(--text-secondary)", fontSize: "0.9rem", lineHeight: 1.6 }}>
                    {ds.coverage.map((cov, i) => (
                      <li key={i} style={{ marginBottom: "6px" }}>{cov}</li>
                    ))}
                  </ul>
                </div>

                <div>
                  <h4 style={{ display: "flex", alignItems: "center", gap: "6px", fontSize: "0.9rem", color: "#f59e0b", marginBottom: "8px" }}>
                    <AlertTriangle size={16} /> {t("datasets.limitations")}
                  </h4>
                  <ul style={{ margin: 0, paddingLeft: "20px", color: "var(--text-secondary)", fontSize: "0.9rem", lineHeight: 1.6 }}>
                    {ds.limitations.map((limit, i) => (
                      <li key={i} style={{ marginBottom: "6px" }}>{limit}</li>
                    ))}
                  </ul>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
