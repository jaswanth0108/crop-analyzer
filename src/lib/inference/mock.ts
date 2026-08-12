// ============================================================
// AgriShield — Mock Inference Service (Extended: All 15 Crops)
// Now samples from all 48 conditions across all 4 datasets.
// Always sets isDemoData: true.
// ============================================================

import type { DiseaseResult, InferenceService, SeverityLabel } from "@/types/analysis";
import { getRecommendations } from "@/lib/recommendations";
import { percentageToSeverity } from "@/lib/severity";
import { getSpeciesEmoji } from "@/lib/supported-conditions";

const DISCLAIMER =
  "AgriShield provides AI-assisted crop health analysis. Results may be incorrect " +
  "and should be confirmed by a qualified agricultural expert before treatment decisions.";

interface MockCondition {
  species: string;
  condition: string;
  conditionDisplay: string;
  confidence: number;
  severityPercentage: number | null;
}

// Full pool: all 48 conditions across all 15 crops
const MOCK_CONDITIONS: MockCondition[] = [
  // Apple
  { species: "Apple",      condition: "apple_scab",           conditionDisplay: "Apple Scab",                    confidence: 0.87, severityPercentage: null },
  { species: "Apple",      condition: "apple_black_rot",      conditionDisplay: "Apple Black Rot",               confidence: 0.82, severityPercentage: null },
  { species: "Apple",      condition: "cedar_apple_rust",     conditionDisplay: "Cedar Apple Rust",              confidence: 0.79, severityPercentage: null },
  { species: "Apple",      condition: "healthy",              conditionDisplay: "Healthy",                       confidence: 0.95, severityPercentage: null },
  // Blueberry
  { species: "Blueberry",  condition: "healthy",              conditionDisplay: "Healthy",                       confidence: 0.93, severityPercentage: null },
  // Cherry
  { species: "Cherry",     condition: "powdery_mildew",       conditionDisplay: "Powdery Mildew",                confidence: 0.80, severityPercentage: null },
  { species: "Cherry",     condition: "healthy",              conditionDisplay: "Healthy",                       confidence: 0.94, severityPercentage: null },
  // Corn
  { species: "Corn",       condition: "cercospora_gray_leaf_spot", conditionDisplay: "Gray Leaf Spot",          confidence: 0.83, severityPercentage: null },
  { species: "Corn",       condition: "common_rust",          conditionDisplay: "Common Rust",                   confidence: 0.88, severityPercentage: null },
  { species: "Corn",       condition: "northern_leaf_blight", conditionDisplay: "Northern Leaf Blight",          confidence: 0.76, severityPercentage: null },
  { species: "Corn",       condition: "healthy",              conditionDisplay: "Healthy",                       confidence: 0.96, severityPercentage: null },
  // Grape
  { species: "Grape",      condition: "black_rot",            conditionDisplay: "Black Rot",                     confidence: 0.81, severityPercentage: null },
  { species: "Grape",      condition: "esca_black_measles",   conditionDisplay: "Esca (Black Measles)",          confidence: 0.74, severityPercentage: null },
  { species: "Grape",      condition: "leaf_blight_isariopsis", conditionDisplay: "Leaf Blight",                confidence: 0.71, severityPercentage: null },
  { species: "Grape",      condition: "healthy",              conditionDisplay: "Healthy",                       confidence: 0.92, severityPercentage: null },
  // Orange
  { species: "Orange",     condition: "haunglongbing_citrus_greening", conditionDisplay: "Citrus Greening (HLB)", confidence: 0.78, severityPercentage: null },
  // Peach
  { species: "Peach",      condition: "bacterial_spot",       conditionDisplay: "Bacterial Spot",                confidence: 0.80, severityPercentage: null },
  { species: "Peach",      condition: "healthy",              conditionDisplay: "Healthy",                       confidence: 0.93, severityPercentage: null },
  // Bell Pepper
  { species: "Bell Pepper", condition: "bacterial_spot",      conditionDisplay: "Bacterial Spot",                confidence: 0.77, severityPercentage: null },
  { species: "Bell Pepper", condition: "healthy",             conditionDisplay: "Healthy",                       confidence: 0.94, severityPercentage: null },
  // Potato
  { species: "Potato",     condition: "early_blight",         conditionDisplay: "Early Blight",                  confidence: 0.86, severityPercentage: null },
  { species: "Potato",     condition: "late_blight",          conditionDisplay: "Late Blight",                   confidence: 0.78, severityPercentage: null },
  { species: "Potato",     condition: "healthy",              conditionDisplay: "Healthy",                       confidence: 0.93, severityPercentage: null },
  // Raspberry
  { species: "Raspberry",  condition: "healthy",              conditionDisplay: "Healthy",                       confidence: 0.91, severityPercentage: null },
  // Rice — severity available
  { species: "Rice",       condition: "bacterial_leaf_blight",     conditionDisplay: "Bacterial Leaf Blight",    confidence: 0.88, severityPercentage: 22.4 },
  { species: "Rice",       condition: "bacterial_leaf_streak",     conditionDisplay: "Bacterial Leaf Streak",    confidence: 0.81, severityPercentage: 17.0 },
  { species: "Rice",       condition: "bacterial_panicle_blight",  conditionDisplay: "Bacterial Panicle Blight", confidence: 0.76, severityPercentage: 28.0 },
  { species: "Rice",       condition: "blast",                      conditionDisplay: "Blast (Leaf Blast)",       confidence: 0.84, severityPercentage: 38.2 },
  { species: "Rice",       condition: "brown_spot",                 conditionDisplay: "Brown Spot",               confidence: 0.82, severityPercentage: 14.7 },
  { species: "Rice",       condition: "downy_mildew",               conditionDisplay: "Downy Mildew",             confidence: 0.73, severityPercentage: 19.0 },
  { species: "Rice",       condition: "hispa",                      conditionDisplay: "Rice Hispa (Pest)",        confidence: 0.80, severityPercentage: null },
  { species: "Rice",       condition: "tungro",                     conditionDisplay: "Tungro Virus",             confidence: 0.77, severityPercentage: null },
  { species: "Rice",       condition: "stem_borer",                 conditionDisplay: "Stem Borer (Pest)",        confidence: 0.75, severityPercentage: null },
  { species: "Rice",       condition: "healthy",                    conditionDisplay: "Healthy",                  confidence: 0.96, severityPercentage: 0 },
  // Soybean
  { species: "Soybean",    condition: "healthy",              conditionDisplay: "Healthy",                       confidence: 0.90, severityPercentage: null },
  // Squash
  { species: "Squash",     condition: "powdery_mildew",       conditionDisplay: "Powdery Mildew",                confidence: 0.83, severityPercentage: null },
  // Strawberry
  { species: "Strawberry", condition: "leaf_scorch",          conditionDisplay: "Leaf Scorch",                   confidence: 0.79, severityPercentage: null },
  { species: "Strawberry", condition: "healthy",              conditionDisplay: "Healthy",                       confidence: 0.93, severityPercentage: null },
  // Tomato
  { species: "Tomato",     condition: "bacterial_spot",       conditionDisplay: "Bacterial Spot",                confidence: 0.82, severityPercentage: null },
  { species: "Tomato",     condition: "early_blight",         conditionDisplay: "Early Blight",                  confidence: 0.85, severityPercentage: null },
  { species: "Tomato",     condition: "late_blight",          conditionDisplay: "Late Blight",                   confidence: 0.79, severityPercentage: null },
  { species: "Tomato",     condition: "leaf_mold",            conditionDisplay: "Leaf Mold",                     confidence: 0.74, severityPercentage: null },
  { species: "Tomato",     condition: "septoria_leaf_spot",   conditionDisplay: "Septoria Leaf Spot",            confidence: 0.81, severityPercentage: null },
  { species: "Tomato",     condition: "spider_mites",         conditionDisplay: "Spider Mites",                  confidence: 0.76, severityPercentage: null },
  { species: "Tomato",     condition: "target_spot",          conditionDisplay: "Target Spot",                   confidence: 0.73, severityPercentage: null },
  { species: "Tomato",     condition: "yellow_leaf_curl_virus", conditionDisplay: "Yellow Leaf Curl Virus",      confidence: 0.85, severityPercentage: null },
  { species: "Tomato",     condition: "mosaic_virus",         conditionDisplay: "Tomato Mosaic Virus",           confidence: 0.82, severityPercentage: null },
  { species: "Tomato",     condition: "healthy",              conditionDisplay: "Healthy",                       confidence: 0.96, severityPercentage: null },
];

function getConfidenceLevel(confidence: number): DiseaseResult["confidenceLevel"] {
  if (confidence >= 0.70) return "high";
  if (confidence >= 0.45) return "medium";
  if (confidence >= 0.30) return "low";
  return "unreliable";
}

function simulateDelay(min = 1800, max = 3200): Promise<void> {
  const ms = Math.random() * (max - min) + min;
  return new Promise((r) => setTimeout(r, ms));
}

export class MockInferenceService implements InferenceService {
  async analyze(_image: File, imageUrl: string): Promise<DiseaseResult> {
    await simulateDelay();

    // Pick a random condition from the full 48-class pool
    const mock = MOCK_CONDITIONS[Math.floor(Math.random() * MOCK_CONDITIONS.length)];

    const severityLabel: SeverityLabel =
      mock.severityPercentage !== null
        ? percentageToSeverity(mock.severityPercentage)
        : "unavailable";

    const recommendations = getRecommendations(
      mock.species,
      mock.condition,
      severityLabel
    );

    return {
      crop: mock.species,
      cropDisplay: `${getSpeciesEmoji(mock.species)} ${mock.species}`,
      condition: mock.condition,
      conditionDisplay: mock.conditionDisplay,
      confidence: mock.confidence,
      confidenceLevel: getConfidenceLevel(mock.confidence),
      severityLabel,
      severityPercentage: mock.severityPercentage,
      recommendations,
      heatmapDataUrl: null,
      isDemoData: true,
      disclaimer: DISCLAIMER,
      analysedAt: new Date().toISOString(),
      imageUrl,
    };
  }
}
