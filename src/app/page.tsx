"use client";

import { useEffect, useRef, useState } from "react";
import Link from "next/link";
import {
  Upload,
  Leaf,
  Zap,
  ShieldCheck,
  BarChart2,
  Eye,
  Database,
  ArrowRight,
  CheckCircle2,
  AlertTriangle,
  ChevronRight,
} from "lucide-react";

/* ── Particle background ─────────────────────────────────── */
function ParticleCanvas() {
  const canvasRef = useRef<HTMLCanvasElement>(null);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext("2d")!;
    let animId: number;

    const particles: {
      x: number; y: number; vx: number; vy: number;
      size: number; alpha: number; color: string;
    }[] = [];

    const COLORS = ["#10b981", "#84cc16", "#3b82f6", "#10b981"];

    const resize = () => {
      canvas.width = window.innerWidth;
      canvas.height = window.innerHeight;
    };
    resize();
    window.addEventListener("resize", resize);

    for (let i = 0; i < 60; i++) {
      particles.push({
        x: Math.random() * window.innerWidth,
        y: Math.random() * window.innerHeight,
        vx: (Math.random() - 0.5) * 0.4,
        vy: -Math.random() * 0.6 - 0.2,
        size: Math.random() * 2.5 + 0.5,
        alpha: Math.random() * 0.5 + 0.1,
        color: COLORS[Math.floor(Math.random() * COLORS.length)],
      });
    }

    const draw = () => {
      ctx.clearRect(0, 0, canvas.width, canvas.height);
      particles.forEach((p) => {
        p.x += p.vx;
        p.y += p.vy;
        p.alpha -= 0.0015;
        if (p.alpha <= 0 || p.y < -10) {
          p.y = canvas.height + 10;
          p.x = Math.random() * canvas.width;
          p.alpha = Math.random() * 0.4 + 0.1;
          p.vx = (Math.random() - 0.5) * 0.4;
          p.vy = -Math.random() * 0.6 - 0.2;
        }
        ctx.beginPath();
        ctx.arc(p.x, p.y, p.size, 0, Math.PI * 2);
        ctx.fillStyle = p.color + Math.floor(p.alpha * 255).toString(16).padStart(2, "0");
        ctx.fill();
      });
      animId = requestAnimationFrame(draw);
    };
    draw();

    return () => {
      window.removeEventListener("resize", resize);
      cancelAnimationFrame(animId);
    };
  }, []);

  return (
    <canvas
      ref={canvasRef}
      style={{
        position: "absolute",
        inset: 0,
        pointerEvents: "none",
        zIndex: 0,
      }}
    />
  );
}

/* ── Animated scan preview ────────────────────────────────── */
function ScanPreview() {
  const [scanPos, setScanPos] = useState(0);

  useEffect(() => {
    const interval = setInterval(() => {
      setScanPos((p) => (p + 1) % 100);
    }, 30);
    return () => clearInterval(interval);
  }, []);

  return (
    <div
      style={{
        width: "280px",
        height: "280px",
        borderRadius: "20px",
        background: "linear-gradient(135deg, #0d1420, #111c2d)",
        border: "1px solid rgba(16,185,129,0.3)",
        position: "relative",
        overflow: "hidden",
        boxShadow: "0 0 40px rgba(16,185,129,0.2), 0 20px 60px rgba(0,0,0,0.5)",
        animation: "float 4s ease-in-out infinite",
      }}
    >
      {/* Grid overlay */}
      <div
        style={{
          position: "absolute",
          inset: 0,
          backgroundImage:
            "linear-gradient(rgba(16,185,129,0.07) 1px, transparent 1px), " +
            "linear-gradient(90deg, rgba(16,185,129,0.07) 1px, transparent 1px)",
          backgroundSize: "28px 28px",
        }}
      />

      {/* Leaf silhouette */}
      <div
        style={{
          position: "absolute",
          inset: 0,
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          opacity: 0.3,
        }}
      >
        <Leaf size={120} color="#10b981" />
      </div>

      {/* Scanning line */}
      <div
        style={{
          position: "absolute",
          left: 0,
          right: 0,
          height: "2px",
          top: `${scanPos}%`,
          background:
            "linear-gradient(90deg, transparent, #10b981, transparent)",
          boxShadow: "0 0 12px rgba(16,185,129,0.8)",
          transition: "top 30ms linear",
        }}
      />

      {/* Glowing corners */}
      {[
        { top: "12px", left: "12px", borderTop: "2px solid #10b981", borderLeft: "2px solid #10b981" },
        { top: "12px", right: "12px", borderTop: "2px solid #10b981", borderRight: "2px solid #10b981" },
        { bottom: "12px", left: "12px", borderBottom: "2px solid #10b981", borderLeft: "2px solid #10b981" },
        { bottom: "12px", right: "12px", borderBottom: "2px solid #10b981", borderRight: "2px solid #10b981" },
      ].map((style, i) => (
        <div
          key={i}
          style={{
            position: "absolute",
            width: "20px",
            height: "20px",
            borderRadius: "2px",
            ...style,
          }}
        />
      ))}

      {/* Status badge */}
      <div
        style={{
          position: "absolute",
          bottom: "16px",
          left: "50%",
          transform: "translateX(-50%)",
          background: "rgba(16,185,129,0.15)",
          border: "1px solid rgba(16,185,129,0.4)",
          borderRadius: "20px",
          padding: "4px 12px",
          display: "flex",
          alignItems: "center",
          gap: "6px",
          whiteSpace: "nowrap",
        }}
      >
        <div
          style={{
            width: "6px",
            height: "6px",
            borderRadius: "50%",
            background: "#10b981",
            animation: "pulse-glow 1.5s ease infinite",
          }}
        />
        <span style={{ fontSize: "0.75rem", color: "#10b981", fontWeight: 600 }}>
          Scanning...
        </span>
      </div>
    </div>
  );
}

/* ── Feature Card ─────────────────────────────────────────── */
function FeatureCard({
  icon: Icon,
  title,
  description,
  color = "#10b981",
  delay = 0,
}: {
  icon: React.ElementType;
  title: string;
  description: string;
  color?: string;
  delay?: number;
}) {
  const ref = useRef<HTMLDivElement>(null);
  const [visible, setVisible] = useState(false);

  useEffect(() => {
    const el = ref.current;
    if (!el) return;
    const obs = new IntersectionObserver(
      ([entry]) => { if (entry.isIntersecting) { setVisible(true); obs.disconnect(); } },
      { threshold: 0.15 }
    );
    obs.observe(el);
    return () => obs.disconnect();
  }, []);

  return (
    <div
      ref={ref}
      className="card card-hover"
      style={{
        padding: "28px",
        opacity: visible ? 1 : 0,
        transform: visible ? "translateY(0)" : "translateY(32px)",
        transition: `opacity 0.5s ease ${delay}ms, transform 0.5s ease ${delay}ms`,
      }}
    >
      <div
        style={{
          width: "48px",
          height: "48px",
          borderRadius: "14px",
          background: `${color}1a`,
          border: `1px solid ${color}33`,
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          marginBottom: "16px",
        }}
      >
        <Icon size={22} color={color} />
      </div>
      <h3
        style={{
          fontFamily: "var(--font-outfit, Outfit, sans-serif)",
          fontSize: "1rem",
          fontWeight: 700,
          color: "var(--text-primary)",
          marginBottom: "8px",
        }}
      >
        {title}
      </h3>
      <p style={{ fontSize: "0.875rem", color: "var(--text-secondary)", lineHeight: 1.6 }}>
        {description}
      </p>
    </div>
  );
}

/* ── Crop Badge ───────────────────────────────────────────── */
function CropCard({
  emoji,
  name,
  conditions,
  color,
  delay,
}: {
  emoji: string;
  name: string;
  conditions: string[];
  color: string;
  delay: number;
}) {
  const ref = useRef<HTMLDivElement>(null);
  const [visible, setVisible] = useState(false);

  useEffect(() => {
    const el = ref.current;
    if (!el) return;
    const obs = new IntersectionObserver(
      ([entry]) => { if (entry.isIntersecting) { setVisible(true); obs.disconnect(); } },
      { threshold: 0.1 }
    );
    obs.observe(el);
    return () => obs.disconnect();
  }, []);

  return (
    <div
      ref={ref}
      className="card card-hover"
      style={{
        padding: "24px",
        opacity: visible ? 1 : 0,
        transform: visible ? "translateY(0)" : "translateY(24px)",
        transition: `opacity 0.5s ease ${delay}ms, transform 0.5s ease ${delay}ms`,
      }}
    >
      <div style={{ display: "flex", alignItems: "center", gap: "12px", marginBottom: "16px" }}>
        <span style={{ fontSize: "2rem" }}>{emoji}</span>
        <h3
          style={{
            fontFamily: "var(--font-outfit, Outfit, sans-serif)",
            fontSize: "1.1rem",
            fontWeight: 700,
          }}
        >
          {name}
        </h3>
      </div>
      <div style={{ display: "flex", flexWrap: "wrap", gap: "6px" }}>
        {conditions.map((c) => (
          <span
            key={c}
            style={{
              display: "inline-flex",
              alignItems: "center",
              gap: "4px",
              padding: "3px 10px",
              borderRadius: "20px",
              fontSize: "0.75rem",
              fontWeight: 500,
              background: `${color}18`,
              color: color,
              border: `1px solid ${color}30`,
            }}
          >
            {c}
          </span>
        ))}
      </div>
    </div>
  );
}

/* ── Main Page ────────────────────────────────────────────── */
export default function HomePage() {
  const heroRef = useRef<HTMLDivElement>(null);

  return (
    <div style={{ minHeight: "100vh", background: "var(--bg-base)" }}>

      {/* ──────────────────── HERO SECTION ──────────────────── */}
      <section
        ref={heroRef}
        style={{
          position: "relative",
          minHeight: "100vh",
          display: "flex",
          alignItems: "center",
          overflow: "hidden",
        }}
      >
        {/* Background radial gradient */}
        <div
          style={{
            position: "absolute",
            inset: 0,
            background:
              "radial-gradient(ellipse 80% 60% at 50% 30%, rgba(16,185,129,0.12) 0%, transparent 60%), " +
              "radial-gradient(ellipse 60% 40% at 80% 70%, rgba(132,204,22,0.06) 0%, transparent 50%)",
            zIndex: 0,
          }}
        />

        <ParticleCanvas />

        <div
          className="section-container"
          style={{
            position: "relative",
            zIndex: 1,
            display: "grid",
            gridTemplateColumns: "1fr auto",
            gap: "64px",
            alignItems: "center",
            padding: "80px 24px",
            width: "100%",
          }}
        >
          {/* Left: Text */}
          <div style={{ maxWidth: "640px" }}>
            {/* Status pill */}
            <div
              style={{
                display: "inline-flex",
                alignItems: "center",
                gap: "8px",
                padding: "6px 16px",
                borderRadius: "20px",
                background: "rgba(16,185,129,0.1)",
                border: "1px solid rgba(16,185,129,0.25)",
                marginBottom: "28px",
                animation: "fade-in-up 0.4s ease both",
              }}
            >
              <div
                style={{
                  width: "7px",
                  height: "7px",
                  borderRadius: "50%",
                  background: "#10b981",
                  animation: "pulse-glow 2s ease infinite",
                }}
              />
              <span style={{ fontSize: "0.8rem", color: "#10b981", fontWeight: 600, letterSpacing: "0.03em" }}>
                Demo Mode Active — Hackathon Build 2026
              </span>
            </div>

            <h1
              className="font-display"
              style={{
                fontSize: "clamp(2.5rem, 5vw, 4rem)",
                fontWeight: 900,
                lineHeight: 1.1,
                marginBottom: "20px",
                animation: "fade-in-up 0.5s ease 0.1s both",
              }}
            >
              Detect Crop Diseases{" "}
              <span className="gradient-text">Instantly</span>{" "}
              with AI
            </h1>

            <p
              style={{
                fontSize: "1.1rem",
                color: "var(--text-secondary)",
                lineHeight: 1.7,
                marginBottom: "36px",
                maxWidth: "520px",
                animation: "fade-in-up 0.5s ease 0.2s both",
              }}
            >
              Upload a leaf image and AgriShield will detect diseases in Rice, Tomato,
              and Potato crops — with severity estimation, treatment recommendations,
              and full transparency about what the AI can and cannot do.
            </p>

            <div
              style={{
                display: "flex",
                gap: "14px",
                flexWrap: "wrap",
                animation: "fade-in-up 0.5s ease 0.3s both",
              }}
            >
              <Link href="/analyze" className="btn-primary" style={{ fontSize: "1rem", padding: "14px 32px" }}>
                <Upload size={18} />
                Analyze a Crop
                <ArrowRight size={16} />
              </Link>
              <Link href="/supported-crops" className="btn-secondary" style={{ fontSize: "1rem", padding: "13px 28px" }}>
                <BookOpen size={16} />
                Supported Crops
              </Link>
            </div>

            {/* Quick stats */}
            <div
              style={{
                display: "flex",
                gap: "32px",
                marginTop: "48px",
                animation: "fade-in-up 0.5s ease 0.4s both",
                flexWrap: "wrap",
              }}
            >
              {[
                { value: "3", label: "Crops Supported" },
                { value: "13", label: "Conditions Detected" },
                { value: "100%", label: "Transparent Data" },
              ].map((stat) => (
                <div key={stat.label}>
                  <div
                    className="gradient-text font-display"
                    style={{ fontSize: "2rem", fontWeight: 800 }}
                  >
                    {stat.value}
                  </div>
                  <div style={{ fontSize: "0.8rem", color: "var(--text-muted)", fontWeight: 500 }}>
                    {stat.label}
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Right: Scan Preview */}
          <div className="hide-mobile" style={{ flexShrink: 0 }}>
            <ScanPreview />
          </div>
        </div>

        {/* Scroll indicator */}
        <div
          style={{
            position: "absolute",
            bottom: "32px",
            left: "50%",
            transform: "translateX(-50%)",
            display: "flex",
            flexDirection: "column",
            alignItems: "center",
            gap: "8px",
            opacity: 0.4,
            animation: "float 2.5s ease-in-out infinite",
          }}
        >
          <span style={{ fontSize: "0.7rem", color: "var(--text-muted)", letterSpacing: "0.1em" }}>
            SCROLL
          </span>
          <div
            style={{
              width: "1px",
              height: "32px",
              background: "linear-gradient(to bottom, var(--text-muted), transparent)",
            }}
          />
        </div>
      </section>

      {/* ──────────────────── FEATURES SECTION ─────────────── */}
      <section style={{ padding: "100px 0", background: "var(--bg-surface)" }}>
        <div className="section-container">
          <div style={{ textAlign: "center", marginBottom: "60px" }}>
            <h2
              className="font-display"
              style={{ fontSize: "clamp(1.8rem, 3vw, 2.6rem)", fontWeight: 800, marginBottom: "14px" }}
            >
              Everything you need for{" "}
              <span className="gradient-text">smart crop protection</span>
            </h2>
            <p style={{ color: "var(--text-secondary)", fontSize: "1.05rem", maxWidth: "520px", margin: "0 auto" }}>
              Built for real-world agricultural conditions, with transparency at every step.
            </p>
          </div>

          <div
            style={{
              display: "grid",
              gridTemplateColumns: "repeat(auto-fit, minmax(280px, 1fr))",
              gap: "20px",
            }}
          >
            <FeatureCard
              icon={Upload}
              title="Upload or Capture"
              description="Drag-and-drop any leaf image or use your device camera directly. Supports JPEG, PNG, and WebP up to 10 MB."
              color="#10b981"
              delay={0}
            />
            <FeatureCard
              icon={Zap}
              title="Instant AI Detection"
              description="Our classifier identifies crop conditions across 13 supported disease states in seconds, with confidence scoring."
              color="#84cc16"
              delay={80}
            />
            <FeatureCard
              icon={Eye}
              title="Grad-CAM Heatmaps"
              description="Visual explanations showing which regions of the leaf influenced the AI decision (demo visualization in mock mode)."
              color="#3b82f6"
              delay={160}
            />
            <FeatureCard
              icon={BarChart2}
              title="Severity Estimation"
              description="Rice diseases include lesion-pixel-based severity from Healthy to Critical. Tomato and Potato show condition only."
              color="#f59e0b"
              delay={240}
            />
            <FeatureCard
              icon={ShieldCheck}
              title="Safe Recommendations"
              description="Severity-aware treatment guidance with agronomist disclaimers. We never suggest treatments outside our knowledge."
              color="#10b981"
              delay={320}
            />
            <FeatureCard
              icon={Database}
              title="Transparent Datasets"
              description="Full disclosure of every dataset used — Paddy Doctor, PlantVillage, PlantDoc, and more. No hidden data sources."
              color="#a855f7"
              delay={400}
            />
          </div>
        </div>
      </section>

      {/* ──────────────────── SUPPORTED CROPS PREVIEW ──────── */}
      <section style={{ padding: "100px 0" }}>
        <div className="section-container">
          <div
            style={{
              display: "flex",
              alignItems: "center",
              justifyContent: "space-between",
              marginBottom: "40px",
              flexWrap: "wrap",
              gap: "16px",
            }}
          >
            <h2
              className="font-display"
              style={{ fontSize: "clamp(1.6rem, 2.5vw, 2.2rem)", fontWeight: 800 }}
            >
              Supported Crops &{" "}
              <span className="gradient-text">Conditions</span>
            </h2>
            <Link
              href="/supported-crops"
              style={{
                display: "flex",
                alignItems: "center",
                gap: "6px",
                color: "#10b981",
                textDecoration: "none",
                fontSize: "0.9rem",
                fontWeight: 600,
              }}
            >
              View all <ChevronRight size={16} />
            </Link>
          </div>

          <div
            style={{
              display: "grid",
              gridTemplateColumns: "repeat(auto-fit, minmax(280px, 1fr))",
              gap: "20px",
            }}
          >
            <CropCard
              emoji="🌾"
              name="Rice / Paddy"
              color="#10b981"
              delay={0}
              conditions={["Healthy", "Bacterial Leaf Blight", "Brown Spot", "Leaf Blast", "Sheath Blight"]}
            />
            <CropCard
              emoji="🍅"
              name="Tomato"
              color="#ef4444"
              delay={100}
              conditions={["Healthy", "Early Blight", "Late Blight", "Bacterial Spot", "Leaf Mold"]}
            />
            <CropCard
              emoji="🥔"
              name="Potato"
              color="#f59e0b"
              delay={200}
              conditions={["Healthy", "Early Blight", "Late Blight"]}
            />
          </div>
        </div>
      </section>

      {/* ──────────────────── DISCLAIMER ──────────────────── */}
      <section style={{ padding: "0 0 80px" }}>
        <div className="section-container">
          <div
            style={{
              background: "rgba(245,158,11,0.07)",
              border: "1px solid rgba(245,158,11,0.2)",
              borderRadius: "16px",
              padding: "24px 28px",
              display: "flex",
              gap: "16px",
              alignItems: "flex-start",
            }}
          >
            <AlertTriangle size={20} color="#f59e0b" style={{ flexShrink: 0, marginTop: "2px" }} />
            <div>
              <p style={{ color: "#f59e0b", fontWeight: 600, fontSize: "0.9rem", marginBottom: "4px" }}>
                Important Disclaimer
              </p>
              <p style={{ color: "#8fa3bf", fontSize: "0.875rem", lineHeight: 1.6 }}>
                AgriShield provides AI-assisted crop health analysis. Results may be incorrect and should be
                confirmed by a qualified agricultural expert before treatment decisions. Mock mode results
                are randomly generated for demonstration only and do not reflect real model inference.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* ──────────────────── CTA SECTION ──────────────────── */}
      <section
        style={{
          padding: "80px 0 120px",
          background: "var(--bg-surface)",
          textAlign: "center",
          position: "relative",
          overflow: "hidden",
        }}
      >
        <div
          style={{
            position: "absolute",
            inset: 0,
            background:
              "radial-gradient(ellipse 60% 80% at 50% 50%, rgba(16,185,129,0.08) 0%, transparent 70%)",
            pointerEvents: "none",
          }}
        />
        <div className="section-container" style={{ position: "relative", zIndex: 1 }}>
          <Leaf size={48} color="#10b981" style={{ marginBottom: "20px", opacity: 0.6, animation: "float 3s ease-in-out infinite" }} />
          <h2
            className="font-display"
            style={{ fontSize: "clamp(1.8rem, 3vw, 2.8rem)", fontWeight: 900, marginBottom: "16px" }}
          >
            Ready to analyze your first crop?
          </h2>
          <p style={{ color: "var(--text-secondary)", fontSize: "1.05rem", marginBottom: "36px", maxWidth: "480px", margin: "0 auto 36px" }}>
            Upload a leaf image and get instant AI-assisted disease detection with
            recommendations in seconds.
          </p>
          <div style={{ display: "flex", gap: "14px", justifyContent: "center", flexWrap: "wrap" }}>
            <Link href="/analyze" className="btn-primary" style={{ fontSize: "1rem", padding: "14px 36px" }}>
              <Upload size={18} />
              Start Analyzing
              <ArrowRight size={16} />
            </Link>
            <Link href="/datasets" className="btn-secondary" style={{ fontSize: "1rem", padding: "13px 28px" }}>
              <Database size={16} />
              View Datasets
            </Link>
          </div>

          {/* Checklist */}
          <div
            style={{
              display: "flex",
              gap: "32px",
              justifyContent: "center",
              marginTop: "48px",
              flexWrap: "wrap",
            }}
          >
            {[
              "Free to use",
              "No account required",
              "Results in seconds",
              "Fully transparent",
            ].map((item) => (
              <div key={item} style={{ display: "flex", alignItems: "center", gap: "8px", color: "var(--text-secondary)", fontSize: "0.875rem" }}>
                <CheckCircle2 size={15} color="#10b981" />
                {item}
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ──────────────────── FOOTER ──────────────────── */}
      <footer
        style={{
          padding: "32px 24px",
          borderTop: "1px solid var(--border-subtle)",
          textAlign: "center",
        }}
      >
        <div className="section-container">
          <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", flexWrap: "wrap", gap: "16px" }}>
            <div style={{ display: "flex", alignItems: "center", gap: "8px" }}>
              <Leaf size={16} color="#10b981" />
              <span className="gradient-text" style={{ fontFamily: "var(--font-outfit)", fontWeight: 700, fontSize: "0.95rem" }}>
                AgriShield
              </span>
            </div>
            <p style={{ fontSize: "0.8rem", color: "var(--text-muted)" }}>
              Built for the 2026 Hackathon · Demo Mode · Not for commercial use
            </p>
            <div style={{ display: "flex", gap: "20px" }}>
              {[
                { href: "/datasets", label: "Datasets" },
                { href: "/supported-crops", label: "Supported Crops" },
              ].map((l) => (
                <Link key={l.href} href={l.href} style={{ color: "var(--text-muted)", fontSize: "0.8rem", textDecoration: "none" }}>
                  {l.label}
                </Link>
              ))}
            </div>
          </div>
        </div>
      </footer>
    </div>
  );
}

// Temporary inline icon to avoid import conflicts
function BookOpen({ size, color }: { size: number; color?: string }) {
  return (
    <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke={color ?? "currentColor"} strokeWidth={2} strokeLinecap="round" strokeLinejoin="round">
      <path d="M2 3h6a4 4 0 0 1 4 4v14a3 3 0 0 0-3-3H2z" />
      <path d="M22 3h-6a4 4 0 0 0-4 4v14a3 3 0 0 1 3-3h7z" />
    </svg>
  );
}
