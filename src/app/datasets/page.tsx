"use client";

import { ExternalLink, Database, Cpu, FileText, AlertTriangle } from "lucide-react";
import { DATASETS } from "./data";

export default function DatasetsPage() {
  return (
    <div style={{ minHeight: "calc(100vh - 64px)", background: "var(--bg-base)", padding: "48px 0 80px" }}>
      <div className="section-container" style={{ maxWidth: "1000px" }}>
        
        <div style={{ textAlign: "center", marginBottom: "48px", animation: "fade-in-up 0.4s ease both" }}>
          <h1 className="font-display" style={{ fontSize: "clamp(1.8rem, 3vw, 2.8rem)", fontWeight: 900, marginBottom: "16px" }}>
            Dataset & <span className="gradient-text">Model Transparency</span>
          </h1>
          <p style={{ color: "var(--text-secondary)", fontSize: "1.05rem", maxWidth: "600px", margin: "0 auto" }}>
            We believe in open agricultural AI. Below is the complete list of datasets, model architectures, and known limitations used to train AgriShield.
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
                    {ds.name}
                  </h2>
                  <div style={{ display: "flex", alignItems: "center", gap: "8px", flexWrap: "wrap" }}>
                    <span className="badge badge-accent">
                      {ds.crops.join(", ")}
                    </span>
                    <span className="badge badge-neutral">
                      {ds.diseasesCovered} Conditions
                    </span>
                    <span className="badge badge-warning" style={{ background: "transparent" }}>
                      <FileText size={12} style={{ marginRight: "2px" }} /> {ds.license}
                    </span>
                  </div>
                </div>
                
                <a
                  href={ds.sourceLink}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="btn-ghost"
                  style={{ color: "#3b82f6", border: "1px solid rgba(59,130,246,0.3)" }}
                >
                  <ExternalLink size={14} /> View Source
                </a>
              </div>

              <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(280px, 1fr))", gap: "24px" }}>
                <div>
                  <h4 style={{ display: "flex", alignItems: "center", gap: "6px", fontSize: "0.9rem", color: "var(--text-primary)", marginBottom: "8px" }}>
                    <Database size={16} color="var(--accent-primary)" /> Purpose & Usage
                  </h4>
                  <p style={{ fontSize: "0.9rem", color: "var(--text-secondary)", lineHeight: 1.6 }}>
                    {ds.purpose}
                  </p>
                </div>
                
                <div>
                  <h4 style={{ display: "flex", alignItems: "center", gap: "6px", fontSize: "0.9rem", color: "var(--text-primary)", marginBottom: "8px" }}>
                    <Cpu size={16} color="#84cc16" /> Model Architecture
                  </h4>
                  <p style={{ fontSize: "0.9rem", color: "var(--text-secondary)", lineHeight: 1.6 }}>
                    {ds.modelArchitecture}
                  </p>
                </div>
              </div>

              <div style={{ marginTop: "24px", paddingTop: "24px", borderTop: "1px solid var(--border-subtle)" }}>
                <h4 style={{ display: "flex", alignItems: "center", gap: "6px", fontSize: "0.9rem", color: "#f59e0b", marginBottom: "12px" }}>
                  <AlertTriangle size={16} /> Known Limitations
                </h4>
                <ul style={{ margin: 0, paddingLeft: "20px", color: "var(--text-secondary)", fontSize: "0.9rem", lineHeight: 1.6 }}>
                  {ds.limitations.map((limit, i) => (
                    <li key={i} style={{ marginBottom: "6px" }}>{limit}</li>
                  ))}
                </ul>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
