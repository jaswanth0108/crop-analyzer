"use client";

// ============================================================
// AgriShield — LanguageSelector Component
// Globe icon dropdown in the Navbar to switch languages.
// ============================================================

import { useState, useRef, useEffect } from "react";
import { Globe } from "lucide-react";
import { useTranslation } from "@/lib/i18n/useTranslation";
import { LANGUAGE_LABELS, type AppLang } from "@/lib/i18n/translations";

const LANGS: AppLang[] = ["en-IN", "hi-IN", "te-IN"];

interface Props {
  /** If true, render a full-width list for the mobile menu */
  mobile?: boolean;
}

export default function LanguageSelector({ mobile = false }: Props) {
  const { lang, setLang, t } = useTranslation();
  const [open, setOpen] = useState(false);
  const ref = useRef<HTMLDivElement>(null);

  // Close on outside click
  useEffect(() => {
    const handler = (e: MouseEvent) => {
      if (ref.current && !ref.current.contains(e.target as Node)) {
        setOpen(false);
      }
    };
    document.addEventListener("mousedown", handler);
    return () => document.removeEventListener("mousedown", handler);
  }, []);

  // ── Mobile version: inline pill list ──────────────────────────────────────
  if (mobile) {
    return (
      <div
        style={{
          padding: "12px 16px",
          borderRadius: "10px",
          background: "rgba(255,255,255,0.03)",
          border: "1px solid rgba(255,255,255,0.07)",
        }}
      >
        <p
          style={{
            fontSize: "0.72rem",
            color: "var(--text-muted)",
            fontWeight: 600,
            textTransform: "uppercase",
            letterSpacing: "0.08em",
            marginBottom: "10px",
          }}
        >
          <Globe
            size={12}
            style={{ display: "inline", marginRight: "5px", verticalAlign: "middle" }}
          />
          {t("lang.label")}
        </p>
        <div style={{ display: "flex", gap: "8px" }}>
          {LANGS.map((l) => {
            const info = LANGUAGE_LABELS[l];
            const isActive = lang === l;
            return (
              <button
                key={l}
                onClick={() => { setLang(l); }}
                style={{
                  flex: 1,
                  padding: "8px 4px",
                  borderRadius: "8px",
                  border: isActive
                    ? "1px solid rgba(16,185,129,0.5)"
                    : "1px solid rgba(255,255,255,0.1)",
                  background: isActive
                    ? "rgba(16,185,129,0.12)"
                    : "rgba(255,255,255,0.03)",
                  color: isActive ? "#10b981" : "var(--text-secondary)",
                  fontWeight: isActive ? 700 : 500,
                  fontSize: "0.9rem",
                  cursor: "pointer",
                  textAlign: "center",
                  transition: "all 150ms ease",
                  fontFamily: "inherit",
                  lineHeight: 1.3,
                }}
              >
                <div style={{ fontSize: "1rem" }}>{info.flag}</div>
                <div style={{ fontSize: "0.75rem" }}>{info.short}</div>
              </button>
            );
          })}
        </div>
      </div>
    );
  }

  // ── Desktop version: compact dropdown ─────────────────────────────────────
  const current = LANGUAGE_LABELS[lang];

  return (
    <div ref={ref} style={{ position: "relative" }}>
      <button
        id="language-selector-btn"
        onClick={() => setOpen((o) => !o)}
        title={t("lang.select")}
        style={{
          display: "flex",
          alignItems: "center",
          gap: "5px",
          padding: "6px 10px",
          borderRadius: "8px",
          background: open ? "rgba(16,185,129,0.1)" : "rgba(255,255,255,0.05)",
          border: open
            ? "1px solid rgba(16,185,129,0.4)"
            : "1px solid rgba(255,255,255,0.1)",
          color: open ? "#10b981" : "var(--text-secondary)",
          cursor: "pointer",
          fontSize: "0.82rem",
          fontWeight: 600,
          transition: "all 150ms ease",
          fontFamily: "inherit",
          whiteSpace: "nowrap",
        }}
        onMouseEnter={(e) => {
          if (!open) {
            (e.currentTarget as HTMLButtonElement).style.background = "rgba(255,255,255,0.08)";
            (e.currentTarget as HTMLButtonElement).style.color = "#f0f4f8";
          }
        }}
        onMouseLeave={(e) => {
          if (!open) {
            (e.currentTarget as HTMLButtonElement).style.background = "rgba(255,255,255,0.05)";
            (e.currentTarget as HTMLButtonElement).style.color = "var(--text-secondary)";
          }
        }}
      >
        <Globe size={14} />
        <span>{current.short}</span>
      </button>

      {open && (
        <div
          style={{
            position: "absolute",
            top: "calc(100% + 8px)",
            right: 0,
            zIndex: 200,
            background: "rgba(8,13,20,0.97)",
            backdropFilter: "blur(16px)",
            WebkitBackdropFilter: "blur(16px)",
            border: "1px solid rgba(255,255,255,0.1)",
            borderRadius: "12px",
            padding: "8px",
            minWidth: "160px",
            boxShadow: "0 8px 32px rgba(0,0,0,0.5)",
            animation: "fade-in 150ms ease both",
          }}
        >
          <p
            style={{
              fontSize: "0.68rem",
              color: "var(--text-muted)",
              fontWeight: 600,
              textTransform: "uppercase",
              letterSpacing: "0.08em",
              padding: "4px 8px 8px",
            }}
          >
            {t("lang.select")}
          </p>
          {LANGS.map((l) => {
            const info = LANGUAGE_LABELS[l];
            const isActive = lang === l;
            return (
              <button
                key={l}
                id={`lang-option-${l}`}
                onClick={() => { setLang(l); setOpen(false); }}
                style={{
                  display: "flex",
                  alignItems: "center",
                  gap: "10px",
                  width: "100%",
                  padding: "9px 12px",
                  borderRadius: "8px",
                  background: isActive ? "rgba(16,185,129,0.1)" : "transparent",
                  border: "none",
                  color: isActive ? "#10b981" : "var(--text-secondary)",
                  fontWeight: isActive ? 700 : 500,
                  fontSize: "0.88rem",
                  cursor: "pointer",
                  textAlign: "left",
                  transition: "all 150ms ease",
                  fontFamily: "inherit",
                }}
                onMouseEnter={(e) => {
                  if (!isActive) {
                    (e.currentTarget as HTMLButtonElement).style.background = "rgba(255,255,255,0.05)";
                    (e.currentTarget as HTMLButtonElement).style.color = "#f0f4f8";
                  }
                }}
                onMouseLeave={(e) => {
                  if (!isActive) {
                    (e.currentTarget as HTMLButtonElement).style.background = "transparent";
                    (e.currentTarget as HTMLButtonElement).style.color = "var(--text-secondary)";
                  }
                }}
              >
                <span style={{ fontSize: "1.1rem" }}>{info.flag}</span>
                <span>{info.label}</span>
                {isActive && (
                  <span
                    style={{
                      marginLeft: "auto",
                      width: "6px",
                      height: "6px",
                      borderRadius: "50%",
                      background: "#10b981",
                    }}
                  />
                )}
              </button>
            );
          })}
        </div>
      )}
    </div>
  );
}
