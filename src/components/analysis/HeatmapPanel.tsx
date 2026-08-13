"use client";

import { useEffect, useRef, useState } from "react";
import { Eye, AlertTriangle } from "lucide-react";
import { useTranslation } from "@/lib/i18n/useTranslation";

interface Props {
  imageUrl?: string;
  isDemoData: boolean;
}

export default function HeatmapPanel({ imageUrl, isDemoData }: Props) {
  const { t } = useTranslation();
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const containerRef = useRef<HTMLDivElement>(null);
  const [loading, setLoading] = useState(true);

  // Generate a mock heatmap overlay
  useEffect(() => {
    if (!imageUrl) return;

    const img = new Image();
    img.crossOrigin = "anonymous";
    img.src = imageUrl;

    img.onload = () => {
      const canvas = canvasRef.current;
      const container = containerRef.current;
      if (!canvas || !container) return;

      const width = container.clientWidth;
      const scale = width / img.width;
      const height = img.height * scale;

      canvas.width = width;
      canvas.height = height;

      const ctx = canvas.getContext("2d");
      if (!ctx) return;

      ctx.drawImage(img, 0, 0, width, height);

      if (isDemoData) {
        ctx.globalCompositeOperation = "multiply";
        for (let i = 0; i < 5; i++) {
          const cx = Math.random() * width;
          const cy = Math.random() * height;
          const r = (Math.random() * 0.2 + 0.1) * Math.min(width, height);

          const grad = ctx.createRadialGradient(cx, cy, 0, cx, cy, r);
          grad.addColorStop(0, "rgba(239, 68, 68, 0.8)");
          grad.addColorStop(0.5, "rgba(245, 158, 11, 0.5)");
          grad.addColorStop(1, "rgba(16, 185, 129, 0)");

          ctx.fillStyle = grad;
          ctx.beginPath();
          ctx.arc(cx, cy, r, 0, Math.PI * 2);
          ctx.fill();
        }
        ctx.globalCompositeOperation = "source-over";
      }

      setLoading(false);
    };
  }, [imageUrl, isDemoData]);

  if (!imageUrl) return null;

  return (
    <div className="card" style={{ padding: "24px" }}>
      <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", marginBottom: "16px" }}>
        <div style={{ display: "flex", alignItems: "center", gap: "8px" }}>
          <Eye size={18} color="var(--text-secondary)" />
          <h3 style={{ fontSize: "1rem", fontWeight: 700, color: "var(--text-primary)" }}>
            {t("heatmap.title")}
          </h3>
        </div>
      </div>

      <div style={{ position: "relative", borderRadius: "12px", overflow: "hidden", background: "var(--bg-elevated)" }} ref={containerRef}>
        {loading && (
          <div style={{ position: "absolute", inset: 0, display: "flex", alignItems: "center", justifyContent: "center" }}>
            <div className="skeleton" style={{ width: "100%", height: "300px" }} />
          </div>
        )}
        <canvas ref={canvasRef} style={{ width: "100%", height: "auto", display: "block", opacity: loading ? 0 : 1, transition: "opacity 0.5s ease" }} />

        {isDemoData && (
          <div style={{ position: "absolute", top: "12px", right: "12px", background: "rgba(0,0,0,0.6)", backdropFilter: "blur(4px)", padding: "6px 12px", borderRadius: "20px", display: "flex", alignItems: "center", gap: "6px", border: "1px solid rgba(255,255,255,0.1)" }}>
            <AlertTriangle size={14} color="#f59e0b" />
            <span style={{ fontSize: "0.75rem", color: "#f0f4f8", fontWeight: 600 }}>{t("heatmap.demoLabel")}</span>
          </div>
        )}
      </div>

      <p style={{ fontSize: "0.85rem", color: "var(--text-muted)", marginTop: "12px", lineHeight: 1.5 }}>
        {isDemoData ? t("heatmap.demoText") : t("heatmap.realText")}
      </p>
    </div>
  );
}
