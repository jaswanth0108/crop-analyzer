// ============================================================
// AgriShield — Mock Inference Service
// Returns pre-scripted, realistic results for all 13 supported conditions.
// Always sets isDemoData: true.
// ============================================================

import type { DiseaseResult, InferenceService, SeverityLabel } from "@/types/analysis";
import { getRecommendations } from "@/lib/recommendations";
import { percentageToSeverity } from "@/lib/severity";

const DISCLAIMER =
  "AgriShield provides AI-assisted crop health analysis. Results may be incorrect " +
  "and should be confirmed by a qualified agricultural expert before treatment decisions.";

// Simulated conditions pool — randomly selected during mock analysis
interface MockCondition {
  crop: "rice" | "tomato" | "potato";
  cropDisplay: string;
  condition: string;
  conditionDisplay: string;
  confidence: number;
  severityPercentage: number | null; // null = unavailable for this crop
}

const MOCK_CONDITIONS: MockCondition[] = [
  // Rice
  { crop: "rice", cropDisplay: "Rice / Paddy", condition: "healthy",               conditionDisplay: "Healthy",               confidence: 0.94, severityPercentage: 0 },
  { crop: "rice", cropDisplay: "Rice / Paddy", condition: "bacterial_leaf_blight", conditionDisplay: "Bacterial Leaf Blight", confidence: 0.88, severityPercentage: 22.4 },
  { crop: "rice", cropDisplay: "Rice / Paddy", condition: "brown_spot",            conditionDisplay: "Brown Spot",            confidence: 0.81, severityPercentage: 14.7 },
  { crop: "rice", cropDisplay: "Rice / Paddy", condition: "leaf_blast",            conditionDisplay: "Leaf Blast",            confidence: 0.76, severityPercentage: 38.2 },
  { crop: "rice", cropDisplay: "Rice / Paddy", condition: "sheath_blight",         conditionDisplay: "Sheath Blight",         confidence: 0.72, severityPercentage: 51.0 },
  // Tomato
  { crop: "tomato", cropDisplay: "Tomato", condition: "healthy",          conditionDisplay: "Healthy",        confidence: 0.96, severityPercentage: null },
  { crop: "tomato", cropDisplay: "Tomato", condition: "early_blight",     conditionDisplay: "Early Blight",   confidence: 0.83, severityPercentage: null },
  { crop: "tomato", cropDisplay: "Tomato", condition: "late_blight",      conditionDisplay: "Late Blight",    confidence: 0.79, severityPercentage: null },
  { crop: "tomato", cropDisplay: "Tomato", condition: "bacterial_spot",   conditionDisplay: "Bacterial Spot", confidence: 0.74, severityPercentage: null },
  { crop: "tomato", cropDisplay: "Tomato", condition: "leaf_mold",        conditionDisplay: "Leaf Mold",      confidence: 0.68, severityPercentage: null },
  // Potato
  { crop: "potato", cropDisplay: "Potato", condition: "healthy",      conditionDisplay: "Healthy",      confidence: 0.93, severityPercentage: null },
  { crop: "potato", cropDisplay: "Potato", condition: "early_blight", conditionDisplay: "Early Blight", confidence: 0.86, severityPercentage: null },
  { crop: "potato", cropDisplay: "Potato", condition: "late_blight",  conditionDisplay: "Late Blight",  confidence: 0.78, severityPercentage: null },
];

function getConfidenceLevel(
  confidence: number
): DiseaseResult["confidenceLevel"] {
  if (confidence >= 0.7) return "high";
  if (confidence >= 0.55) return "low";
  return "unreliable";
}

function simulateDelay(min = 1500, max = 2800): Promise<void> {
  const ms = Math.random() * (max - min) + min;
  return new Promise((r) => setTimeout(r, ms));
}

export class MockInferenceService implements InferenceService {
  async analyze(_image: File, imageUrl: string): Promise<DiseaseResult> {
    await simulateDelay();

    // Pick a random condition from the pool
    const mock = MOCK_CONDITIONS[Math.floor(Math.random() * MOCK_CONDITIONS.length)];

    const severityLabel: SeverityLabel =
      mock.severityPercentage !== null
        ? percentageToSeverity(mock.severityPercentage)
        : "unavailable";

    const recommendations = getRecommendations(
      mock.crop,
      mock.condition,
      severityLabel
    );

    return {
      crop: mock.crop,
      cropDisplay: mock.cropDisplay,
      condition: mock.condition,
      conditionDisplay: mock.conditionDisplay,
      confidence: mock.confidence,
      confidenceLevel: getConfidenceLevel(mock.confidence),
      severityLabel,
      severityPercentage: mock.severityPercentage,
      recommendations,
      heatmapDataUrl: null, // generated client-side on canvas
      isDemoData: true,
      disclaimer: DISCLAIMER,
      analysedAt: new Date().toISOString(),
      imageUrl,
    };
  }
}
