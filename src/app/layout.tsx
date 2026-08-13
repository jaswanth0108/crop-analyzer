import type { Metadata } from "next";
import { Inter, Outfit } from "next/font/google";
import "./globals.css";
import Navbar from "@/components/Navbar";
import { LanguageProvider } from "@/lib/i18n/LanguageContext";

const inter = Inter({
  variable: "--font-inter",
  subsets: ["latin"],
  display: "swap",
});

const outfit = Outfit({
  variable: "--font-outfit",
  subsets: ["latin"],
  display: "swap",
});

export const metadata: Metadata = {
  title: "AgriShield — AI Crop Health Analyzer",
  description:
    "AI-powered crop disease detection for Rice, Tomato, and Potato. " +
    "Upload a leaf image to get instant health analysis, severity estimation, and treatment recommendations.",
  keywords: ["crop disease", "AI agriculture", "plant health", "rice disease", "tomato blight", "potato blight"],
  openGraph: {
    title: "AgriShield — AI Crop Health Analyzer",
    description: "Detect crop diseases instantly with AI-powered image analysis.",
    type: "website",
  },
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en" className={`${inter.variable} ${outfit.variable}`}>
      <body>
        <LanguageProvider>
          <Navbar />
          <main style={{ paddingTop: "64px" }}>{children}</main>
        </LanguageProvider>
      </body>
    </html>
  );
}
