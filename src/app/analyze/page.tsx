"use client";

import { useState, useRef, useCallback, useEffect } from "react";
import { useRouter } from "next/navigation";
import {
  Upload,
  Camera,
  X,
  AlertTriangle,
  Leaf,
  CheckCircle2,
  RefreshCw,
  Info,
  ScanLine,
} from "lucide-react";
import { getInferenceService } from "@/lib/inference";
import { saveToHistory, generateThumbnail } from "@/lib/history";
import { validateIsPlant } from "@/lib/plant-validator";
import type { DiseaseResult, AnalysisError } from "@/types/analysis";
import ResultCard from "@/components/analysis/ResultCard";
import SeverityPanel from "@/components/analysis/SeverityPanel";
import HeatmapPanel from "@/components/analysis/HeatmapPanel";
import RecommendationPanel from "@/components/analysis/RecommendationPanel";
import DisclaimerBanner from "@/components/analysis/DisclaimerBanner";
import { useTranslation } from "@/lib/i18n/useTranslation";

type Step = "upload" | "validating" | "checking-plant" | "analyzing" | "results";

interface PlantRejection {
  reason: string;
  plantType?: string;
}

const ACCEPTED_TYPES = ["image/jpeg", "image/png", "image/webp"];
const MAX_SIZE_MB = 10;

// ── Client-side blur score via pixel-variance ──────────────────────────────
async function computeBlurScore(file: File): Promise<number> {
  return new Promise((resolve) => {
    const img = new Image();
    const url = URL.createObjectURL(file);
    img.onload = () => {
      const canvas = document.createElement("canvas");
      const SIZE = 200;
      canvas.width = SIZE;
      canvas.height = SIZE;
      const ctx = canvas.getContext("2d")!;
      ctx.drawImage(img, 0, 0, SIZE, SIZE);
      const data = ctx.getImageData(0, 0, SIZE, SIZE).data;
      URL.revokeObjectURL(url);

      const pixels: number[] = [];
      for (let i = 0; i < data.length; i += 4) {
        pixels.push(0.299 * data[i] + 0.587 * data[i + 1] + 0.114 * data[i + 2]);
      }
      const mean = pixels.reduce((a, b) => a + b, 0) / pixels.length;
      const variance =
        pixels.reduce((a, b) => a + (b - mean) ** 2, 0) / pixels.length;
      resolve(variance);
    };
    img.onerror = () => resolve(999);
    img.src = url;
  });
}

export default function AnalyzePage() {
  const router = useRouter();
  const fileInputRef = useRef<HTMLInputElement>(null);
  const cameraInputRef = useRef<HTMLInputElement>(null);
  const dropZoneRef = useRef<HTMLDivElement>(null);
  const { t } = useTranslation();

  const [step, setStep] = useState<Step>("upload");
  const [file, setFile] = useState<File | null>(null);
  const [imageUrl, setImageUrl] = useState<string | null>(null);
  const [dragActive, setDragActive] = useState(false);
  const [validationError, setValidationError] = useState<AnalysisError | null>(null);
  const [plantRejection, setPlantRejection] = useState<PlantRejection | null>(null);
  const [progressIdx, setProgressIdx] = useState(0);
  const [result, setResult] = useState<DiseaseResult | null>(null);

  // Derive progress steps from translations
  const PROGRESS_STEPS = [
    { label: t("analyze.progress1"), pct: 10 },
    { label: t("analyze.progress2"), pct: 28 },
    { label: t("analyze.progress3"), pct: 50 },
    { label: t("analyze.progress4"), pct: 70 },
    { label: t("analyze.progress5"), pct: 85 },
    { label: t("analyze.progress6"), pct: 97 },
  ];

  // Cleanup object URLs on unmount
  useEffect(() => {
    return () => {
      if (imageUrl) URL.revokeObjectURL(imageUrl);
    };
  }, [imageUrl]);

  // Progress animation during analysis
  useEffect(() => {
    if (step !== "analyzing") return;
    setProgressIdx(0);
    const timings = [300, 700, 600, 600, 400];
    let idx = 0;
    const advance = () => {
      if (idx < PROGRESS_STEPS.length - 1) {
        idx++;
        setProgressIdx(idx);
        setTimeout(advance, timings[idx]);
      }
    };
    setTimeout(advance, timings[0]);
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [step]);

  // ── File validation ──────────────────────────────────────────────────────
  const validateFile = useCallback(async (f: File): Promise<AnalysisError | null> => {
    if (!ACCEPTED_TYPES.includes(f.type)) {
      return {
        type: "validation",
        message: t("analyze.errorUnsupportedType"),
        suggestion: t("analyze.errorUnsupportedTypeSuggest"),
      };
    }
    if (f.size > MAX_SIZE_MB * 1024 * 1024) {
      return {
        type: "validation",
        message: t("analyze.errorFileTooLarge"),
        suggestion: t("analyze.errorFileTooLargeSuggest"),
      };
    }
    const blurScore = await computeBlurScore(f);
    if (blurScore < 80) {
      return {
        type: "validation",
        message: t("analyze.errorBlurry"),
        suggestion: t("analyze.errorBlurrySuggest"),
      };
    }
    return null;
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [t]);

  // ── Handle file selection ───────────────────────────────────────────────
  const handleFile = useCallback(
    async (f: File) => {
      setValidationError(null);
      setPlantRejection(null);
      setStep("validating");

      const url = URL.createObjectURL(f);
      setFile(f);
      setImageUrl(url);

      const err = await validateFile(f);
      if (err) {
        setValidationError(err);
        setStep("upload");
        return;
      }

      setStep("checking-plant");
      try {
        const plantCheck = await validateIsPlant(f);
        if (!plantCheck.isPlant) {
          setPlantRejection({
            reason: plantCheck.reason ?? t("analyze.noPlantTitle"),
            plantType: plantCheck.plantType ?? undefined,
          });
          setStep("upload");
          return;
        }
      } catch (e) {
        console.warn("Plant validation check failed, proceeding anyway:", e);
      }

      setStep("analyzing");
      try {
        const service = getInferenceService();
        const analysisResult = await service.analyze(f, url);
        setResult(analysisResult);

        const thumbnail = await generateThumbnail(f).catch(() => "");
        saveToHistory({ id: crypto.randomUUID(), result: analysisResult, thumbnailUrl: thumbnail });

        setStep("results");
      } catch (e) {
        console.error(e);
        setValidationError({
          type: "inference",
          message: t("analyze.errorFailed"),
          suggestion: t("analyze.errorFailedSuggest"),
        });
        setStep("upload");
      }
    },
    [validateFile, t]
  );

  // ── Drag and Drop ───────────────────────────────────────────────────────
  const onDrop = useCallback(
    (e: React.DragEvent) => {
      e.preventDefault();
      setDragActive(false);
      const f = e.dataTransfer.files[0];
      if (f) handleFile(f);
    },
    [handleFile]
  );

  const onDragOver = (e: React.DragEvent) => {
    e.preventDefault();
    setDragActive(true);
  };
  const onDragLeave = () => setDragActive(false);

  const reset = () => {
    setStep("upload");
    setFile(null);
    setResult(null);
    setValidationError(null);
    setPlantRejection(null);
    setProgressIdx(0);
    if (imageUrl) { URL.revokeObjectURL(imageUrl); setImageUrl(null); }
  };

  // ── RENDER ───────────────────────────────────────────────────────────────
  return (
    <div style={{ minHeight: "calc(100vh - 64px)", background: "var(--bg-base)", padding: "48px 0 80px" }}>
      <div className="section-container" style={{ maxWidth: "900px" }}>

        {/* Page Header */}
        <div style={{ textAlign: "center", marginBottom: "48px" }}>
          <h1
            className="font-display"
            style={{ fontSize: "clamp(1.8rem, 3vw, 2.5rem)", fontWeight: 900, marginBottom: "12px" }}
          >
            <span className="gradient-text">{t("analyze.title1")}</span> {t("analyze.titleHighlight")}
          </h1>
          <p style={{ color: "var(--text-secondary)", fontSize: "1rem" }}>
            {t("analyze.subtitle")}
          </p>
        </div>

        {/* ── STEP: UPLOAD ─────────────────────────────────────── */}
        {step === "upload" && (
          <div style={{ animation: "fade-in-up 0.4s ease both" }}>

            {/* ── Plant Rejection Error ─────────────────────────────── */}
            {plantRejection && (
              <div
                style={{
                  padding: "28px",
                  background: "rgba(239,68,68,0.06)",
                  border: "1px solid rgba(239,68,68,0.3)",
                  borderRadius: "16px",
                  marginBottom: "24px",
                  animation: "fade-in-up 0.4s ease both",
                }}
              >
                <div style={{ display: "flex", alignItems: "center", gap: "12px", marginBottom: "12px" }}>
                  <div style={{ width: "48px", height: "48px", borderRadius: "12px", background: "rgba(239,68,68,0.12)", display: "flex", alignItems: "center", justifyContent: "center", flexShrink: 0 }}>
                    <Leaf size={24} color="#ef4444" />
                  </div>
                  <div>
                    <h3 style={{ fontSize: "1.05rem", fontWeight: 700, color: "#ef4444", marginBottom: "2px" }}>
                      {t("analyze.noPlantTitle")}
                    </h3>
                    <p style={{ fontSize: "0.85rem", color: "var(--text-secondary)" }}>
                      {plantRejection.reason}
                    </p>
                  </div>
                  <button
                    onClick={() => setPlantRejection(null)}
                    style={{ marginLeft: "auto", background: "none", border: "none", cursor: "pointer", color: "var(--text-muted)", flexShrink: 0 }}
                  >
                    <X size={18} />
                  </button>
                </div>
                <div style={{ background: "rgba(16,185,129,0.06)", border: "1px solid rgba(16,185,129,0.2)", borderRadius: "10px", padding: "12px 16px", marginTop: "8px" }}>
                  <p style={{ fontSize: "0.85rem", color: "var(--text-secondary)", lineHeight: 1.6 }}>
                    {t("analyze.noPlantHint")}
                  </p>
                </div>
              </div>
            )}

            {/* ── Standard Validation Error ──────────────────────────── */}
            {validationError && (
              <div
                style={{
                  display: "flex",
                  gap: "12px",
                  alignItems: "flex-start",
                  padding: "16px 20px",
                  background: "rgba(239,68,68,0.08)",
                  border: "1px solid rgba(239,68,68,0.25)",
                  borderRadius: "12px",
                  marginBottom: "24px",
                }}
              >
                <AlertTriangle size={18} color="#ef4444" style={{ flexShrink: 0, marginTop: "2px" }} />
                <div>
                  <p style={{ color: "#ef4444", fontWeight: 600, fontSize: "0.9rem", marginBottom: "2px" }}>
                    {validationError.message}
                  </p>
                  <p style={{ color: "var(--text-secondary)", fontSize: "0.85rem" }}>
                    {validationError.suggestion}
                  </p>
                </div>
                <button
                  onClick={() => setValidationError(null)}
                  style={{ marginLeft: "auto", background: "none", border: "none", cursor: "pointer", color: "#ef4444" }}
                >
                  <X size={16} />
                </button>
              </div>
            )}

            {/* ── Drop Zone ─────────────────────────────────────────── */}
            <div
              ref={dropZoneRef}
              id="drop-zone"
              className={`drop-zone${dragActive ? " drag-active" : ""}`}
              onDrop={onDrop}
              onDragOver={onDragOver}
              onDragLeave={onDragLeave}
              onClick={() => fileInputRef.current?.click()}
              style={{
                padding: "64px 32px",
                display: "flex",
                flexDirection: "column",
                alignItems: "center",
                justifyContent: "center",
                cursor: "pointer",
                background: dragActive ? "rgba(16,185,129,0.05)" : "var(--bg-card)",
                textAlign: "center",
                transition: "all 250ms ease",
              }}
            >
              <div
                style={{
                  width: "72px",
                  height: "72px",
                  borderRadius: "20px",
                  background: dragActive ? "rgba(16,185,129,0.2)" : "rgba(16,185,129,0.1)",
                  border: `1px solid ${dragActive ? "rgba(16,185,129,0.5)" : "rgba(16,185,129,0.25)"}`,
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "center",
                  marginBottom: "20px",
                  transition: "all 250ms ease",
                }}
              >
                {dragActive ? <Leaf size={28} color="#10b981" /> : <Upload size={28} color="#10b981" />}
              </div>

              <h3
                className="font-display"
                style={{ fontSize: "1.2rem", fontWeight: 700, marginBottom: "8px", color: "var(--text-primary)" }}
              >
                {dragActive ? t("analyze.dropTitleDrag") : t("analyze.dropTitle")}
              </h3>
              <p style={{ color: "var(--text-secondary)", fontSize: "0.9rem", marginBottom: "24px", maxWidth: "380px" }}>
                {t("analyze.dropSubtitle")}
                <br />
                <span style={{ color: "var(--text-muted)", fontSize: "0.82rem" }}>{t("analyze.dropSubtitleNote")}</span>
              </p>

              <div style={{ display: "flex", gap: "12px", flexWrap: "wrap", justifyContent: "center" }}>
                <button
                  id="browse-files-btn"
                  onClick={(e) => { e.stopPropagation(); fileInputRef.current?.click(); }}
                  className="btn-primary"
                  style={{ padding: "10px 24px" }}
                >
                  <Upload size={16} />
                  {t("analyze.browseFiles")}
                </button>
                <button
                  id="camera-capture-btn"
                  onClick={(e) => { e.stopPropagation(); cameraInputRef.current?.click(); }}
                  className="btn-secondary"
                  style={{ padding: "9px 22px" }}
                >
                  <Camera size={16} />
                  {t("analyze.takePhoto")}
                </button>
              </div>

              <input
                ref={fileInputRef}
                type="file"
                accept="image/jpeg,image/png,image/webp"
                onChange={(e) => { const f = e.target.files?.[0]; if (f) handleFile(f); }}
                style={{ display: "none" }}
                id="file-input"
              />
              <input
                ref={cameraInputRef}
                type="file"
                accept="image/*"
                capture="environment"
                onChange={(e) => { const f = e.target.files?.[0]; if (f) handleFile(f); }}
                style={{ display: "none" }}
                id="camera-input"
              />
            </div>

            {/* Info callout */}
            <div
              style={{
                display: "flex",
                gap: "12px",
                alignItems: "flex-start",
                padding: "14px 18px",
                background: "rgba(59,130,246,0.07)",
                border: "1px solid rgba(59,130,246,0.2)",
                borderRadius: "12px",
                marginTop: "20px",
              }}
            >
              <Info size={16} color="#3b82f6" style={{ flexShrink: 0, marginTop: "2px" }} />
              <p style={{ fontSize: "0.83rem", color: "var(--text-secondary)", lineHeight: 1.6 }}>
                <strong style={{ color: "#3b82f6" }}>{t("analyze.howTitle")}</strong>{" "}
                {t("analyze.howText")}
              </p>
            </div>
          </div>
        )}


        {/* ── STEP: VALIDATING ─────────────────────────────────────── */}
        {(step === "validating" || step === "checking-plant") && (
          <div
            style={{
              display: "flex",
              flexDirection: "column",
              alignItems: "center",
              justifyContent: "center",
              padding: "80px 32px",
              animation: "fade-in 0.3s ease",
              textAlign: "center",
            }}
          >
            {imageUrl && (
              <div style={{ width: "80px", height: "80px", borderRadius: "16px", overflow: "hidden", marginBottom: "24px", border: "2px solid rgba(16,185,129,0.3)", position: "relative" }}>
                {/* eslint-disable-next-line @next/next/no-img-element */}
                <img src={imageUrl} alt="Uploaded" style={{ width: "100%", height: "100%", objectFit: "cover" }} />
                <div style={{ position: "absolute", inset: 0, background: "linear-gradient(to bottom, transparent 60%, rgba(0,0,0,0.4))" }} />
              </div>
            )}
            <div
              style={{
                width: "48px",
                height: "48px",
                border: "3px solid rgba(16,185,129,0.2)",
                borderTopColor: "#10b981",
                borderRadius: "50%",
                animation: "spin-slow 0.8s linear infinite",
                marginBottom: "16px",
              }}
            />
            <h3 className="font-display" style={{ fontSize: "1.2rem", fontWeight: 700, marginBottom: "8px" }}>
              {step === "checking-plant" ? t("analyze.checkingPlant") : t("analyze.checkingQuality")}
            </h3>
            <p style={{ color: "var(--text-secondary)", fontSize: "0.9rem" }}>
              {step === "checking-plant"
                ? t("analyze.checkingPlantNote")
                : t("analyze.checkingQualityNote")}
            </p>
            {step === "checking-plant" && (
              <div style={{ display: "flex", alignItems: "center", gap: "6px", marginTop: "16px", color: "var(--text-muted)", fontSize: "0.8rem" }}>
                <ScanLine size={14} color="#10b981" />
                <span>{t("analyze.poweredBy")}</span>
              </div>
            )}
          </div>
        )}

        {/* ── STEP: ANALYZING ──────────────────────────────────────── */}
        {step === "analyzing" && (
          <div style={{ animation: "fade-in 0.3s ease" }}>
            <div
              className="card"
              style={{ padding: "40px 32px", textAlign: "center" }}
            >
              {imageUrl && (
                <div
                  style={{
                    width: "100px",
                    height: "100px",
                    borderRadius: "16px",
                    overflow: "hidden",
                    margin: "0 auto 24px",
                    border: "2px solid rgba(16,185,129,0.3)",
                    position: "relative",
                  }}
                >
                  {/* eslint-disable-next-line @next/next/no-img-element */}
                  <img
                    src={imageUrl}
                    alt="Uploaded leaf"
                    style={{ width: "100%", height: "100%", objectFit: "cover" }}
                  />
                  <div
                    style={{
                      position: "absolute",
                      inset: 0,
                      background: "linear-gradient(to bottom, transparent 60%, rgba(16,185,129,0.3))",
                    }}
                  />
                </div>
              )}

              <h3
                className="font-display"
                style={{ fontSize: "1.2rem", fontWeight: 700, marginBottom: "8px" }}
              >
                {t("analyze.analyzingTitle")}
              </h3>
              <p style={{ color: "var(--text-secondary)", fontSize: "0.9rem", marginBottom: "32px" }}>
                {PROGRESS_STEPS[progressIdx].label}
              </p>

              {/* Progress bar */}
              <div
                style={{
                  height: "6px",
                  background: "rgba(16,185,129,0.15)",
                  borderRadius: "3px",
                  overflow: "hidden",
                  marginBottom: "12px",
                }}
              >
                <div
                  style={{
                    height: "100%",
                    width: `${PROGRESS_STEPS[progressIdx].pct}%`,
                    background: "linear-gradient(90deg, #10b981, #84cc16)",
                    borderRadius: "3px",
                    transition: "width 600ms ease",
                    boxShadow: "0 0 8px rgba(16,185,129,0.5)",
                  }}
                />
              </div>
              <p style={{ fontSize: "0.8rem", color: "var(--text-muted)" }}>
                {PROGRESS_STEPS[progressIdx].pct}{t("analyze.progressComplete")}
              </p>

              {/* Skeleton shimmer cards */}
              <div style={{ marginTop: "32px", display: "flex", flexDirection: "column", gap: "12px" }}>
                {[80, 60, 40].map((w, i) => (
                  <div
                    key={i}
                    className="skeleton"
                    style={{ height: "16px", width: `${w}%`, margin: "0 auto" }}
                  />
                ))}
              </div>
            </div>
          </div>
        )}

        {/* ── STEP: RESULTS ────────────────────────────────────────── */}
        {step === "results" && result && (
          <div style={{ animation: "fade-in-up 0.5s ease both" }}>
            {/* Demo banner */}
            {result.isDemoData && (
              <div className="demo-banner" style={{ marginBottom: "20px" }}>
                <AlertTriangle size={16} />
                <span>
                  <strong>{t("analyze.demoBanner")}</strong>
                </span>
              </div>
            )}

            {/* Main result */}
            <ResultCard result={result} imageUrl={imageUrl ?? undefined} />

            {/* Severity */}
            <div style={{ marginTop: "20px" }}>
              <SeverityPanel result={result} />
            </div>

            {/* Heatmap */}
            <div style={{ marginTop: "20px" }}>
              <HeatmapPanel imageUrl={imageUrl ?? undefined} isDemoData={result.isDemoData} />
            </div>

            {/* Recommendations */}
            {result.recommendations.length > 0 && (
              <div style={{ marginTop: "20px" }}>
                <RecommendationPanel recommendations={result.recommendations} />
              </div>
            )}

            {/* Disclaimer */}
            <div style={{ marginTop: "20px" }}>
              <DisclaimerBanner />
            </div>

            {/* Actions */}
            <div style={{ display: "flex", gap: "12px", marginTop: "28px", flexWrap: "wrap" }}>
              <button
                id="analyze-another-btn"
                onClick={reset}
                className="btn-primary"
                style={{ padding: "12px 28px" }}
              >
                <RefreshCw size={16} />
                {t("analyze.analyzeAnother")}
              </button>
              <button
                id="view-history-btn"
                onClick={() => router.push("/history")}
                className="btn-secondary"
                style={{ padding: "11px 24px" }}
              >
                {t("analyze.viewHistory")}
              </button>
            </div>

            {/* Low-confidence message */}
            {(result.confidenceLevel === "unreliable" || result.confidenceLevel === "unsupported") && (
              <div
                style={{
                  display: "flex",
                  gap: "12px",
                  alignItems: "flex-start",
                  padding: "16px 20px",
                  background: "rgba(239,68,68,0.07)",
                  border: "1px solid rgba(239,68,68,0.2)",
                  borderRadius: "12px",
                  marginTop: "20px",
                }}
              >
                <AlertTriangle size={18} color="#ef4444" style={{ flexShrink: 0, marginTop: "2px" }} />
                <p style={{ color: "var(--text-secondary)", fontSize: "0.875rem", lineHeight: 1.6 }}>
                  {t("analyze.lowConfidence")}
                </p>
              </div>
            )}
          </div>
        )}
      </div>
    </div>
  );
}
