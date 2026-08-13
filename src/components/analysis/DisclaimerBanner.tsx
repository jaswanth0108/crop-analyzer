"use client";

import { AlertTriangle } from "lucide-react";
import { useTranslation } from "@/lib/i18n/useTranslation";

export default function DisclaimerBanner() {
  const { t } = useTranslation();

  return (
    <div
      style={{
        display: "flex",
        gap: "12px",
        alignItems: "flex-start",
        padding: "16px 20px",
        background: "rgba(245,158,11,0.08)",
        border: "1px solid rgba(245,158,11,0.25)",
        borderRadius: "12px",
      }}
    >
      <AlertTriangle size={18} color="#f59e0b" style={{ flexShrink: 0, marginTop: "2px" }} />
      <div>
        <p style={{ color: "#f59e0b", fontWeight: 700, fontSize: "0.9rem", marginBottom: "4px" }}>
          {t("disclaimer.title")}
        </p>
        <p style={{ color: "var(--text-secondary)", fontSize: "0.85rem", lineHeight: 1.6, margin: 0 }}>
          {t("disclaimer.text")}
        </p>
      </div>
    </div>
  );
}
