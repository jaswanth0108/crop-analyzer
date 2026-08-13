"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { BarChart2, Trash2, ArrowLeft } from "lucide-react";
import { getHistory, clearHistory } from "@/lib/history";
import type { HistoryEntry } from "@/types/analysis";
import HistoryCard from "@/components/history/HistoryCard";
import TrendChart from "@/components/history/TrendChart";
import ResultCard from "@/components/analysis/ResultCard";
import SeverityPanel from "@/components/analysis/SeverityPanel";
import RecommendationPanel from "@/components/analysis/RecommendationPanel";
import DisclaimerBanner from "@/components/analysis/DisclaimerBanner";
import { useTranslation } from "@/lib/i18n/useTranslation";

export default function HistoryPage() {
  const { t } = useTranslation();
  const [history, setHistory] = useState<HistoryEntry[]>([]);
  const [selectedEntry, setSelectedEntry] = useState<HistoryEntry | null>(null);
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setHistory(getHistory());
    setMounted(true);
  }, []);

  const handleClear = () => {
    if (confirm(t("history.clearConfirm"))) {
      clearHistory();
      setHistory([]);
      setSelectedEntry(null);
    }
  };

  if (!mounted) return null;

  return (
    <div style={{ minHeight: "calc(100vh - 64px)", background: "var(--bg-base)", padding: "48px 0 80px" }}>
      <div className="section-container" style={{ maxWidth: "1000px" }}>

        {/* Header */}
        <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", marginBottom: "40px", flexWrap: "wrap", gap: "16px" }}>
          <div>
            <h1 className="font-display" style={{ fontSize: "clamp(1.8rem, 3vw, 2.5rem)", fontWeight: 900, marginBottom: "8px" }}>
              {t("history.title")} <span className="gradient-text">{t("history.titleHighlight")}</span>
            </h1>
            <p style={{ color: "var(--text-secondary)", fontSize: "1rem" }}>
              {t("history.subtitle")}
            </p>
          </div>

          {history.length > 0 && !selectedEntry && (
            <button onClick={handleClear} className="btn-ghost" style={{ color: "#ef4444" }}>
              <Trash2 size={16} />
              {t("history.clearHistory")}
            </button>
          )}
        </div>

        {/* Selected Entry Detail View */}
        {selectedEntry ? (
          <div style={{ animation: "fade-in-up 0.4s ease both" }}>
            <button
              onClick={() => setSelectedEntry(null)}
              className="btn-ghost"
              style={{ marginBottom: "24px" }}
            >
              <ArrowLeft size={16} />
              {t("history.backToList")}
            </button>

            <ResultCard result={selectedEntry.result} imageUrl={selectedEntry.thumbnailUrl} />

            <div style={{ marginTop: "20px" }}>
              <SeverityPanel result={selectedEntry.result} />
            </div>

            {selectedEntry.result.recommendations.length > 0 && (
              <div style={{ marginTop: "20px" }}>
                <RecommendationPanel recommendations={selectedEntry.result.recommendations} />
              </div>
            )}

            <div style={{ marginTop: "20px" }}>
              <DisclaimerBanner />
            </div>
          </div>
        ) : (
          /* List & Chart View */
          <>
            {history.length === 0 ? (
              <div
                className="card"
                style={{
                  padding: "64px 32px",
                  textAlign: "center",
                  display: "flex",
                  flexDirection: "column",
                  alignItems: "center",
                  justifyContent: "center"
                }}
              >
                <div style={{ width: "64px", height: "64px", borderRadius: "16px", background: "rgba(16,185,129,0.1)", display: "flex", alignItems: "center", justifyContent: "center", marginBottom: "20px" }}>
                  <BarChart2 size={32} color="#10b981" />
                </div>
                <h3 className="font-display" style={{ fontSize: "1.2rem", fontWeight: 700, marginBottom: "8px" }}>
                  {t("history.noHistoryTitle")}
                </h3>
                <p style={{ color: "var(--text-secondary)", fontSize: "0.95rem", marginBottom: "24px" }}>
                  {t("history.noHistoryText")}
                </p>
                <Link href="/analyze" className="btn-primary">
                  {t("history.analyzeNow")}
                </Link>
              </div>
            ) : (
              <div style={{ display: "grid", gridTemplateColumns: "1fr", gap: "32px" }}>
                {/* Trend Chart */}
                <div style={{ animation: "fade-in-up 0.4s ease both" }}>
                  <TrendChart history={history} />
                </div>

                {/* History List */}
                <div>
                  <h3 style={{ fontSize: "1.2rem", fontWeight: 700, color: "var(--text-primary)", marginBottom: "16px" }}>
                    {t("history.recentScans")}
                  </h3>
                  <div style={{ display: "flex", flexDirection: "column", gap: "12px" }}>
                    {history.map((entry, idx) => (
                      <div key={entry.id} style={{ animation: `fade-in-up 0.4s ease ${idx * 0.05}s both` }}>
                        <HistoryCard entry={entry} onClick={() => setSelectedEntry(entry)} />
                      </div>
                    ))}
                  </div>
                </div>
              </div>
            )}
          </>
        )}
      </div>
    </div>
  );
}
