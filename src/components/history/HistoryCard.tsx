"use client";

import { CheckCircle2, AlertTriangle, XCircle, HelpCircle, ChevronRight, Activity } from "lucide-react";
import type { HistoryEntry, ConfidenceLevel } from "@/types/analysis";
import { CROP_EMOJIS, CROP_COLORS } from "@/lib/supported-conditions";

interface Props {
  entry: HistoryEntry;
  onClick: () => void;
}

const CONFIDENCE_CONFIG: Record<
  ConfidenceLevel,
  { icon: React.ElementType; color: string }
> = {
  high: { icon: CheckCircle2, color: "#10b981" },
  low: { icon: AlertTriangle, color: "#f59e0b" },
  unreliable: { icon: XCircle, color: "#ef4444" },
  unsupported: { icon: HelpCircle, color: "#9ca3af" },
};

export default function HistoryCard({ entry, onClick }: Props) {
  const { result, thumbnailUrl } = entry;
  const conf = CONFIDENCE_CONFIG[result.confidenceLevel];
  const ConfIcon = conf.icon;
  
  const date = new Date(result.analysedAt);
  const timeStr = date.toLocaleTimeString(undefined, { hour: "2-digit", minute: "2-digit" });
  const dateStr = date.toLocaleDateString(undefined, { month: "short", day: "numeric" });
  
  const cropEmoji = result.crop ? CROP_EMOJIS[result.crop] : "🌱";
  const cropColor = result.crop ? CROP_COLORS[result.crop] : "#10b981";

  return (
    <div
      className="card card-hover"
      onClick={onClick}
      style={{
        padding: "16px",
        cursor: "pointer",
        display: "flex",
        alignItems: "center",
        gap: "16px",
        position: "relative",
        overflow: "hidden",
      }}
    >
      {/* Thumbnail */}
      <div
        style={{
          width: "64px",
          height: "64px",
          borderRadius: "12px",
          overflow: "hidden",
          flexShrink: 0,
          border: `1px solid ${cropColor}40`,
          position: "relative",
          background: "var(--bg-elevated)",
        }}
      >
        {thumbnailUrl ? (
          // eslint-disable-next-line @next/next/no-img-element
          <img src={thumbnailUrl} alt="Scan thumbnail" style={{ width: "100%", height: "100%", objectFit: "cover" }} />
        ) : (
          <div style={{ display: "flex", alignItems: "center", justifyContent: "center", height: "100%", fontSize: "1.5rem" }}>
            {cropEmoji}
          </div>
        )}
      </div>

      {/* Content */}
      <div style={{ flex: 1, minWidth: 0 }}>
        <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", marginBottom: "4px" }}>
          <span
            style={{
              fontSize: "0.7rem",
              fontWeight: 600,
              color: cropColor,
              textTransform: "uppercase",
              letterSpacing: "0.05em",
            }}
          >
            {result.cropDisplay || "Unknown"}
          </span>
          <span style={{ fontSize: "0.75rem", color: "var(--text-muted)", whiteSpace: "nowrap" }}>
            {dateStr} • {timeStr}
          </span>
        </div>
        
        <h4 style={{ fontSize: "1rem", fontWeight: 700, color: "var(--text-primary)", margin: "0 0 6px 0", whiteSpace: "nowrap", overflow: "hidden", textOverflow: "ellipsis" }}>
          {result.conditionDisplay}
        </h4>
        
        <div style={{ display: "flex", alignItems: "center", gap: "12px" }}>
          <div style={{ display: "flex", alignItems: "center", gap: "4px", color: conf.color, fontSize: "0.8rem", fontWeight: 600 }}>
            <ConfIcon size={14} />
            {Math.round(result.confidence * 100)}%
          </div>
          
          {result.severityPercentage !== null && (
            <div style={{ display: "flex", alignItems: "center", gap: "4px", color: "var(--text-secondary)", fontSize: "0.8rem", fontWeight: 500 }}>
              <Activity size={14} />
              {result.severityPercentage.toFixed(1)}%
            </div>
          )}
        </div>
      </div>
      
      <ChevronRight size={20} color="var(--text-muted)" style={{ flexShrink: 0 }} />
      
      {/* Demo indicator */}
      {result.isDemoData && (
        <div
          style={{
            position: "absolute",
            top: 0,
            right: 0,
            background: "rgba(245,158,11,0.2)",
            color: "#f59e0b",
            fontSize: "0.6rem",
            fontWeight: 800,
            padding: "2px 16px",
            transform: "rotate(45deg) translate(12px, -12px)",
            letterSpacing: "0.05em",
          }}
        >
          DEMO
        </div>
      )}
    </div>
  );
}
