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
} from "lucide-react";
import { getInferenceService } from "@/lib/inference";
import { saveToHistory, generateThumbnail } from "@/lib/history";
import type { DiseaseResult, AnalysisError } from "@/types/analysis";
import ResultCard from "@/components/analysis/ResultCard";
import SeverityPanel from "@/components/analysis/SeverityPanel";
import HeatmapPanel from "@/components/analysis/HeatmapPanel";
import RecommendationPanel from "@/components/analysis/RecommendationPanel";
import DisclaimerBanner from "@/components/analysis/DisclaimerBanner";

type Step = "upload" | "validating" | "analyzing" | "results";

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

      // Convert to grayscale and compute variance (Laplacian proxy)
      const pixels: number[] = [];
      for (let i = 0; i < data.length; i += 4) {
        pixels.push(0.299 * data[i] + 0.587 * data[i + 1] + 0.114 * data[i + 2]);
      }
      const mean = pixels.reduce((a, b) => a + b, 0) / pixels.length;
      const variance =
        pixels.reduce((a, b) => a + (b - mean) ** 2, 0) / pixels.length;
      resolve(variance);
    };
    img.onerror = () => resolve(999); // can't check — allow it
    img.src = url;
  });
}

// ── Analysis progress messages ─────────────────────────────────────────────
const PROGRESS_STEPS = [
  { label: "Loading image...",           pct: 15 },
  { label: "Detecting crop type...",     pct: 35 },
  { label: "Identifying condition...",   pct: 60 },
  { label: "Calculating severity...",    pct: 80 },
  { label: "Generating recommendations...", pct: 95 },
];

export default function AnalyzePage() {
  const router = useRouter();
  const fileInputRef = useRef<HTMLInputElement>(null);
  const cameraInputRef = useRef<HTMLInputElement>(null);
  const dropZoneRef = useRef<HTMLDivElement>(null);

  const [step, setStep] = useState<Step>("upload");
  const [file, setFile] = useState<File | null>(null);
  const [imageUrl, setImageUrl] = useState<string | null>(null);
  const [dragActive, setDragActive] = useState(false);
  const [validationError, setValidationError] = useState<AnalysisError | null>(null);
  const [progressIdx, setProgressIdx] = useState(0);
  const [result, setResult] = useState<DiseaseResult | null>(null);

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
  }, [step]);

  // ── File validation ──────────────────────────────────────────────────────
  const validateFile = useCallback(async (f: File): Promise<AnalysisError | null> => {
    if (!ACCEPTED_TYPES.includes(f.type)) {
      return {
        type: "validation",
        message: "Unsupported file type",
        suggestion: "Please upload a JPEG, PNG, or WebP image.",
      };
    }
    if (f.size > MAX_SIZE_MB * 1024 * 1024) {
      return {
        type: "validation",
        message: `File too large (${(f.size / 1024 / 1024).toFixed(1)} MB)`,
        suggestion: `Please upload an image smaller than ${MAX_SIZE_MB} MB.`,
      };
    }
    const blurScore = await computeBlurScore(f);
    if (blurScore < 80) {
      return {
        type: "validation",
        message: "Image appears too blurry",
        suggestion:
          "Please take a clearer photo. Ensure the leaf is in focus and well-lit.",
      };
    }
    return null;
  }, []);

  // ── Handle file selection ───────────────────────────────────────────────
  const handleFile = useCallback(
    async (f: File) => {
      setValidationError(null);
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

      // Proceed to analysis
      setStep("analyzing");
      try {
        const service = getInferenceService();
        const analysisResult = await service.analyze(f, url);
        setResult(analysisResult);

        // Save to history
        const thumbnail = await generateThumbnail(f).catch(() => "");
        saveToHistory({ id: crypto.randomUUID(), result: analysisResult, thumbnailUrl: thumbnail });

        setStep("results");
      } catch (e) {
        console.error(e);
        setValidationError({
          type: "inference",
          message: "Analysis failed",
          suggestion: "Please try again with a different image.",
        });
        setStep("upload");
      }
    },
    [validateFile]
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
            <span className="gradient-text">Crop Health</span> Analyzer
          </h1>
          <p style={{ color: "var(--text-secondary)", fontSize: "1rem" }}>
            Upload or capture a leaf image to detect diseases with AI
          </p>
        </div>

        {/* ── STEP: UPLOAD ─────────────────────────────────────────── */}
        {step === "upload" && (
          <div style={{ animation: "fade-in-up 0.4s ease both" }}>
            {/* Validation error */}
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

            {/* Drop Zone */}
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
                <Upload size={28} color="#10b981" />
              </div>

              <h3
                className="font-display"
                style={{ fontSize: "1.2rem", fontWeight: 700, marginBottom: "8px", color: "var(--text-primary)" }}
              >
                {dragActive ? "Drop your image here" : "Upload a leaf image"}
              </h3>
              <p style={{ color: "var(--text-secondary)", fontSize: "0.9rem", marginBottom: "24px", maxWidth: "360px" }}>
                Drag and drop or click to browse. Supports JPEG, PNG, WebP up to 10 MB.
              </p>

              <div style={{ display: "flex", gap: "12px", flexWrap: "wrap", justifyContent: "center" }}>
                <button
                  id="browse-files-btn"
                  onClick={(e) => { e.stopPropagation(); fileInputRef.current?.click(); }}
                  className="btn-primary"
                  style={{ padding: "10px 24px" }}
                >
                  <Upload size={16} />
                  Browse Files
                </button>
                <button
                  id="camera-capture-btn"
                  onClick={(e) => { e.stopPropagation(); cameraInputRef.current?.click(); }}
                  className="btn-secondary"
                  style={{ padding: "9px 22px" }}
                >
                  <Camera size={16} />
                  Take Photo
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
                <strong style={{ color: "#3b82f6" }}>Supported crops:</strong> Rice/Paddy · Tomato · Potato.
                Upload a clear, well-lit photo of a single leaf for best results.
                Images with blurry or dark backgrounds may be rejected.
              </p>
            </div>
          </div>
        )}

        {/* ── STEP: VALIDATING ─────────────────────────────────────── */}
        {step === "validating" && (
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
            <div
              style={{
                width: "64px",
                height: "64px",
                border: "3px solid rgba(16,185,129,0.2)",
                borderTopColor: "#10b981",
                borderRadius: "50%",
                animation: "spin-slow 0.8s linear infinite",
                marginBottom: "20px",
              }}
            />
            <h3 className="font-display" style={{ fontSize: "1.2rem", fontWeight: 700, marginBottom: "8px" }}>
              Validating image...
            </h3>
            <p style={{ color: "var(--text-secondary)", fontSize: "0.9rem" }}>
              Checking quality and format
            </p>
          </div>
        )}

        {/* ── STEP: ANALYZING ──────────────────────────────────────── */}
        {step === "analyzing" && (
          <div style={{ animation: "fade-in 0.3s ease" }}>
            <div
              className="card"
              style={{ padding: "40px 32px", textAlign: "center" }}
            >
              {/* Thumbnail */}
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
                Analyzing your image
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
                {PROGRESS_STEPS[progressIdx].pct}% complete
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
                  <strong>Demo Results</strong> — These are mock results for demonstration only.
                  No real model inference was performed.
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
                Analyze Another
              </button>
              <button
                id="view-history-btn"
                onClick={() => router.push("/history")}
                className="btn-secondary"
                style={{ padding: "11px 24px" }}
              >
                View History
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
                  We could not identify this condition reliably. Please upload a clearer image
                  or consult an agricultural expert.
                </p>
              </div>
            )}
          </div>
        )}
      </div>
    </div>
  );
}
