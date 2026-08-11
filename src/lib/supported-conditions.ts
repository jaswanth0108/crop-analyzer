// ============================================================
// AgriShield — Supported Conditions Registry
// Single source of truth for all crops, diseases, severity support, and dataset attribution.
// ============================================================

export interface ConditionInfo {
  crop: string;
  cropDisplay: string;
  condition: string;
  conditionDisplay: string;
  severityAvailable: boolean;
  status: "trained" | "validated" | "demo-only";
  datasetSource: string;
}

export const SUPPORTED_CONDITIONS: ConditionInfo[] = [
  // ── Rice / Paddy ──────────────────────────────────────────
  {
    crop: "rice",
    cropDisplay: "Rice / Paddy",
    condition: "healthy",
    conditionDisplay: "Healthy",
    severityAvailable: false,
    status: "demo-only",
    datasetSource: "Paddy Doctor",
  },
  {
    crop: "rice",
    cropDisplay: "Rice / Paddy",
    condition: "bacterial_leaf_blight",
    conditionDisplay: "Bacterial Leaf Blight",
    severityAvailable: true,
    status: "demo-only",
    datasetSource: "Paddy Doctor + Rice Segmentation Dataset",
  },
  {
    crop: "rice",
    cropDisplay: "Rice / Paddy",
    condition: "brown_spot",
    conditionDisplay: "Brown Spot",
    severityAvailable: true,
    status: "demo-only",
    datasetSource: "Paddy Doctor + Rice Segmentation Dataset",
  },
  {
    crop: "rice",
    cropDisplay: "Rice / Paddy",
    condition: "leaf_blast",
    conditionDisplay: "Leaf Blast",
    severityAvailable: true,
    status: "demo-only",
    datasetSource: "Paddy Doctor + Rice Segmentation Dataset",
  },
  {
    crop: "rice",
    cropDisplay: "Rice / Paddy",
    condition: "sheath_blight",
    conditionDisplay: "Sheath Blight",
    severityAvailable: true,
    status: "demo-only",
    datasetSource: "Paddy Doctor",
  },

  // ── Tomato ────────────────────────────────────────────────
  {
    crop: "tomato",
    cropDisplay: "Tomato",
    condition: "healthy",
    conditionDisplay: "Healthy",
    severityAvailable: false,
    status: "demo-only",
    datasetSource: "PlantVillage",
  },
  {
    crop: "tomato",
    cropDisplay: "Tomato",
    condition: "early_blight",
    conditionDisplay: "Early Blight",
    severityAvailable: false,
    status: "demo-only",
    datasetSource: "PlantVillage",
  },
  {
    crop: "tomato",
    cropDisplay: "Tomato",
    condition: "late_blight",
    conditionDisplay: "Late Blight",
    severityAvailable: false,
    status: "demo-only",
    datasetSource: "PlantVillage",
  },
  {
    crop: "tomato",
    cropDisplay: "Tomato",
    condition: "bacterial_spot",
    conditionDisplay: "Bacterial Spot",
    severityAvailable: false,
    status: "demo-only",
    datasetSource: "PlantVillage",
  },
  {
    crop: "tomato",
    cropDisplay: "Tomato",
    condition: "leaf_mold",
    conditionDisplay: "Leaf Mold",
    severityAvailable: false,
    status: "demo-only",
    datasetSource: "PlantVillage",
  },

  // ── Potato ────────────────────────────────────────────────
  {
    crop: "potato",
    cropDisplay: "Potato",
    condition: "healthy",
    conditionDisplay: "Healthy",
    severityAvailable: false,
    status: "demo-only",
    datasetSource: "PlantVillage",
  },
  {
    crop: "potato",
    cropDisplay: "Potato",
    condition: "early_blight",
    conditionDisplay: "Early Blight",
    severityAvailable: false,
    status: "demo-only",
    datasetSource: "PlantVillage",
  },
  {
    crop: "potato",
    cropDisplay: "Potato",
    condition: "late_blight",
    conditionDisplay: "Late Blight",
    severityAvailable: false,
    status: "demo-only",
    datasetSource: "PlantVillage",
  },
];

export const CROP_COLORS: Record<string, string> = {
  rice: "#10b981",
  tomato: "#ef4444",
  potato: "#f59e0b",
};

export const CROP_EMOJIS: Record<string, string> = {
  rice: "🌾",
  tomato: "🍅",
  potato: "🥔",
};

/** Returns supported condition info for a given crop+condition key, or null */
export function getConditionInfo(
  crop: string,
  condition: string
): ConditionInfo | null {
  return (
    SUPPORTED_CONDITIONS.find(
      (c) => c.crop === crop && c.condition === condition
    ) ?? null
  );
}
