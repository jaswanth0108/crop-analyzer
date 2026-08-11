// ============================================================
// AgriShield — Scan History (localStorage)
// ============================================================

import type { HistoryEntry } from "@/types/analysis";

const STORAGE_KEY = "agrishield_scan_history";
const MAX_ENTRIES = 50;

export function getHistory(): HistoryEntry[] {
  if (typeof window === "undefined") return [];
  try {
    const raw = localStorage.getItem(STORAGE_KEY);
    return raw ? (JSON.parse(raw) as HistoryEntry[]) : [];
  } catch {
    return [];
  }
}

export function saveToHistory(entry: HistoryEntry): void {
  if (typeof window === "undefined") return;
  try {
    const history = getHistory();
    // Prepend newest first, cap at MAX_ENTRIES
    const updated = [entry, ...history].slice(0, MAX_ENTRIES);
    localStorage.setItem(STORAGE_KEY, JSON.stringify(updated));
  } catch {
    // Quota exceeded or private mode — silently ignore
  }
}

export function clearHistory(): void {
  if (typeof window === "undefined") return;
  localStorage.removeItem(STORAGE_KEY);
}

/** Generate a tiny thumbnail (80×80 base64) from a File for history display */
export async function generateThumbnail(file: File): Promise<string> {
  return new Promise((resolve, reject) => {
    const img = new Image();
    const url = URL.createObjectURL(file);
    img.onload = () => {
      const canvas = document.createElement("canvas");
      const SIZE = 80;
      canvas.width = SIZE;
      canvas.height = SIZE;
      const ctx = canvas.getContext("2d")!;
      // centre-crop
      const scale = Math.max(SIZE / img.width, SIZE / img.height);
      const w = img.width * scale;
      const h = img.height * scale;
      ctx.drawImage(img, (SIZE - w) / 2, (SIZE - h) / 2, w, h);
      URL.revokeObjectURL(url);
      resolve(canvas.toDataURL("image/jpeg", 0.6));
    };
    img.onerror = () => reject(new Error("Thumbnail failed"));
    img.src = url;
  });
}
