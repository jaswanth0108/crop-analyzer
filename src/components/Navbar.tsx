"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { Leaf, Menu, X, BarChart2, Database, BookOpen, Upload } from "lucide-react";

const NAV_LINKS = [
  { href: "/",                label: "Home",           icon: null },
  { href: "/analyze",         label: "Analyze",        icon: Upload },
  { href: "/history",         label: "Scan History",   icon: BarChart2 },
  { href: "/supported-crops", label: "Supported Crops", icon: BookOpen },
  { href: "/datasets",        label: "Datasets",       icon: Database },
];

export default function Navbar() {
  const pathname = usePathname();
  const [isScrolled, setIsScrolled] = useState(false);
  const [mobileOpen, setMobileOpen] = useState(false);

  useEffect(() => {
    const onScroll = () => setIsScrolled(window.scrollY > 20);
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  // Close mobile menu on route change
  useEffect(() => setMobileOpen(false), [pathname]);

  return (
    <>
      <nav
        style={{
          position: "fixed",
          top: 0,
          left: 0,
          right: 0,
          zIndex: 100,
          height: "64px",
          display: "flex",
          alignItems: "center",
          padding: "0 24px",
          transition: "background 300ms ease, border-color 300ms ease, box-shadow 300ms ease",
          background: isScrolled
            ? "rgba(8, 13, 20, 0.9)"
            : "rgba(8, 13, 20, 0.6)",
          backdropFilter: "blur(16px)",
          WebkitBackdropFilter: "blur(16px)",
          borderBottom: isScrolled
            ? "1px solid rgba(255,255,255,0.08)"
            : "1px solid transparent",
          boxShadow: isScrolled ? "0 4px 24px rgba(0,0,0,0.4)" : "none",
        }}
      >
        <div
          style={{
            maxWidth: "1200px",
            margin: "0 auto",
            width: "100%",
            display: "flex",
            alignItems: "center",
            justifyContent: "space-between",
          }}
        >
          {/* Logo */}
          <Link
            href="/"
            style={{
              display: "flex",
              alignItems: "center",
              gap: "10px",
              textDecoration: "none",
            }}
          >
            <div
              style={{
                width: "36px",
                height: "36px",
                borderRadius: "10px",
                background: "linear-gradient(135deg, #10b981, #84cc16)",
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
                boxShadow: "0 0 16px rgba(16,185,129,0.4)",
                flexShrink: 0,
              }}
            >
              <Leaf size={18} color="#050a10" strokeWidth={2.5} />
            </div>
            <span
              style={{
                fontFamily: "var(--font-outfit, Outfit, sans-serif)",
                fontWeight: 800,
                fontSize: "1.2rem",
                background: "linear-gradient(135deg, #10b981, #84cc16)",
                WebkitBackgroundClip: "text",
                WebkitTextFillColor: "transparent",
                backgroundClip: "text",
                letterSpacing: "-0.01em",
              }}
            >
              AgriShield
            </span>
          </Link>

          {/* Desktop Nav Links */}
          <div
            className="hide-mobile"
            style={{
              display: "flex",
              alignItems: "center",
              gap: "4px",
            }}
          >
            {NAV_LINKS.map((link) => {
              const isActive = pathname === link.href;
              return (
                <Link
                  key={link.href}
                  href={link.href}
                  style={{
                    display: "flex",
                    alignItems: "center",
                    gap: "6px",
                    padding: "6px 14px",
                    borderRadius: "8px",
                    textDecoration: "none",
                    fontSize: "0.875rem",
                    fontWeight: isActive ? 600 : 500,
                    color: isActive ? "#10b981" : "#8fa3bf",
                    background: isActive ? "rgba(16,185,129,0.1)" : "transparent",
                    transition: "color 150ms, background 150ms",
                  }}
                  onMouseEnter={(e) => {
                    if (!isActive) {
                      (e.target as HTMLElement).style.color = "#f0f4f8";
                      (e.target as HTMLElement).style.background = "rgba(255,255,255,0.05)";
                    }
                  }}
                  onMouseLeave={(e) => {
                    if (!isActive) {
                      (e.target as HTMLElement).style.color = "#8fa3bf";
                      (e.target as HTMLElement).style.background = "transparent";
                    }
                  }}
                >
                  {link.label}
                </Link>
              );
            })}
          </div>

          {/* CTA + Mobile Toggle */}
          <div style={{ display: "flex", alignItems: "center", gap: "12px" }}>
            <Link
              href="/analyze"
              className="btn-primary hide-mobile"
              style={{ padding: "8px 20px", fontSize: "0.875rem" }}
            >
              <Upload size={15} />
              Analyze Crop
            </Link>

            <button
              id="mobile-menu-toggle"
              onClick={() => setMobileOpen(!mobileOpen)}
              style={{
                display: "none",
                background: "none",
                border: "none",
                color: "#f0f4f8",
                cursor: "pointer",
                padding: "6px",
              }}
              className="show-mobile-only"
              aria-label="Toggle mobile menu"
            >
              {mobileOpen ? <X size={22} /> : <Menu size={22} />}
            </button>
          </div>
        </div>
      </nav>

      {/* Mobile Menu Overlay */}
      {mobileOpen && (
        <div
          style={{
            position: "fixed",
            top: "64px",
            left: 0,
            right: 0,
            zIndex: 99,
            background: "rgba(8,13,20,0.97)",
            backdropFilter: "blur(16px)",
            borderBottom: "1px solid rgba(255,255,255,0.08)",
            padding: "16px 24px 24px",
            animation: "fade-in 200ms ease both",
          }}
        >
          <div style={{ display: "flex", flexDirection: "column", gap: "4px" }}>
            {NAV_LINKS.map((link) => {
              const Icon = link.icon;
              const isActive = pathname === link.href;
              return (
                <Link
                  key={link.href}
                  href={link.href}
                  style={{
                    display: "flex",
                    alignItems: "center",
                    gap: "10px",
                    padding: "12px 16px",
                    borderRadius: "10px",
                    textDecoration: "none",
                    fontSize: "0.95rem",
                    fontWeight: isActive ? 600 : 500,
                    color: isActive ? "#10b981" : "#8fa3bf",
                    background: isActive ? "rgba(16,185,129,0.1)" : "transparent",
                  }}
                >
                  {Icon && <Icon size={18} />}
                  {link.label}
                </Link>
              );
            })}
            <div style={{ marginTop: "12px" }}>
              <Link
                href="/analyze"
                className="btn-primary"
                style={{ width: "100%", justifyContent: "center" }}
              >
                <Upload size={16} />
                Analyze a Crop
              </Link>
            </div>
          </div>
        </div>
      )}
    </>
  );
}
