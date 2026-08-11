"use client";

import { useEffect, useState } from "react";
import { CheckCircle2, AlertTriangle, XCircle, HelpCircle } from "lucide-react";
import type { DiseaseResult, ConfidenceLevel } from "@/types/analysis";
import { CROP_EMOJIS, CROP_COLORS } from "@/lib/supported-conditions";

interface Props {
  result: DiseaseResult;
  imageUrl?: string;
}

const CONFIDENCE_CONFIG: Record<
  ConfidenceLevel,
  { icon: React.ElementType; color: string; label: string }
> = {
  high: { icon: CheckCircle2, color: "#10b981", label: "High Confidence" },
  low: { icon: AlertTriangle, color: "#f59e0b", label: "Low Confidence" },
  unreliable: { icon: XCircle, color: "#ef4444", label: "Unreliable" },
  unsupported: { icon: HelpCircle, color: "#9ca3af", label: "Unsupported Image" },
};

export default function ResultCard({ result, imageUrl }: Props) {
  const conf = CONFIDENCE_CONFIG[result.confidenceLevel];
  const ConfIcon = conf.icon;
  const pct = Math.round(result.confidence * 100);

  // Animation for the ring
  const [dashOffset, setDashOffset] = useState(283); // 2 * PI * 45
  useEffect(() => {
    // slight delay for animation
    const t = setTimeout(() => {
      setDashOffset(283 - (283 * pct) / 100);
    }, 100);
    return () => clearTimeout(t);
  }, [pct]);

  const cropEmoji = result.crop ? CROP_EMOJIS[result.crop] : "🌱";
  const cropColor = result.crop ? CROP_COLORS[result.crop] : "#10b981";

  return (
    <div className="card" style={{ padding: "32px", display: "flex", gap: "32px", alignItems: "flex-start", flexWrap: "wrap" }}>
      
      {/* Thumbnail */}
      {imageUrl && (
        <div
          style={{
            width: "120px",
            height: "120px",
            borderRadius: "16px",
            overflow: "hidden",
            flexShrink: 0,
            border: `2px solid ${cropColor}33`,
            position: "relative",
          }}
        >
          {/* eslint-disable-next-line @next/next/no-img-element */}
          <img src={imageUrl} alt="Uploaded leaf" style={{ width: "100%", height: "100%", objectFit: "cover" }} />
          <div style={{ position: "absolute", bottom: "8px", right: "8px", fontSize: "1.5rem", filter: "drop-shadow(0 2px 4px rgba(0,0,0,0.5))" }}>
            {cropEmoji}
          </div>
        </div>
      )}

      {/* Main Info */}
      <div style={{ flex: 1, minWidth: "200px" }}>
        <div style={{ display: "flex", alignItems: "center", gap: "8px", marginBottom: "8px" }}>
          <span style={{ fontSize: "0.85rem", fontWeight: 600, color: "var(--text-muted)", textTransform: "uppercase", letterSpacing: "0.05em" }}>
            Detected Condition
          </span>
          {result.crop && (
            <span
              style={{
                fontSize: "0.75rem",
                padding: "2px 8px",
                borderRadius: "12px",
                background: `${cropColor}15`,
                color: cropColor,
                fontWeight: 600,
              }}
            >
              {result.crop.charAt(0).toUpperCase() + result.crop.slice(1)}
            </span>
          )}
        </div>

        <h2 className="font-display" style={{ fontSize: "2rem", fontWeight: 800, marginBottom: "16px", lineHeight: 1.1 }}>
          {result.conditionDisplay}
        </h2>

        {/* Confidence Badge */}
        <div
          style={{
            display: "inline-flex",
            alignItems: "center",
            gap: "6px",
            padding: "6px 12px",
            borderRadius: "20px",
            background: `${conf.color}15`,
            border: `1px solid ${conf.color}30`,
          }}
        >
          <ConfIcon size={16} color={conf.color} />
          <span style={{ fontSize: "0.85rem", fontWeight: 600, color: conf.color }}>
            {conf.label}
          </span>
        </div>
      </div>

      {/* Gauge */}
      <div style={{ position: "relative", width: "100px", height: "100px", flexShrink: 0 }}>
        <svg width="100" height="100" viewBox="0 0 100 100" style={{ transform: "rotate(-90deg)" }} className="confidence-ring">
          <circle cx="50" cy="50" r="45" fill="none" stroke="var(--bg-elevated)" strokeWidth="8" />
          <circle
            cx="50"
            cy="50"
            r="45"
            fill="none"
            stroke={conf.color}
            strokeWidth="8"
            strokeLinecap="round"
            strokeDasharray="283"
            strokeDashoffset={dashOffset}
          />
        </svg>
        <div
          style={{
            position: "absolute",
            inset: 0,
            display: "flex",
            flexDirection: "column",
            alignItems: "center",
            justifyContent: "center",
          }}
        >
          <span style={{ fontSize: "1.2rem", fontWeight: 800, color: "var(--text-primary)", lineHeight: 1 }}>
            {pct}%
          </span>
          <span style={{ fontSize: "0.6rem", color: "var(--text-muted)", fontWeight: 600, textTransform: "uppercase", marginTop: "2px" }}>
            Match
          </span>
        </div>
      </div>
    </div>
  );
}
