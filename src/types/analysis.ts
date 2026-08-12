// ============================================================
// AgriShield — Core Type Definitions
// Updated: CropType is now open string (any species the model detects)
// ============================================================

// CropType is now any string species name returned by the model
// Examples: "Apple", "Corn", "Rice", "Tomato", "Grape", etc.
export type CropType = string;

export type ConfidenceLevel =
  | "high"        // >= 0.70
  | "medium"      // 0.45 – 0.69
  | "low"         // 0.30 – 0.44
  | "unreliable"  // < 0.30
  | "unsupported"; // unrecognised crop / unrelated image

export type SeverityLabel =
  | "healthy"
  | "mild"
  | "moderate"
  | "high"
  | "very_high"
  | "critical"
  | "unavailable"; // Severity estimation not available for this condition

export interface Recommendation {
  category: "immediate" | "treatment" | "prevention";
  title: string;
  description: string;
  urgency: "low" | "medium" | "high";
}

export interface DiseaseResult {
  crop: CropType | null;
  cropDisplay: string;
  condition: string;
  conditionDisplay: string;
  confidence: number;          // 0.0 – 1.0
  confidenceLevel: ConfidenceLevel;
  topPredictions?: TopPrediction[]; // Top-3 from model (real mode only)
  severityLabel: SeverityLabel;
  severityPercentage: number | null; // null when unavailable
  recommendations: Recommendation[];
  heatmapDataUrl: string | null;    // canvas data URL or null
  isDemoData: boolean;
  disclaimer: string;
  analysedAt: string; // ISO 8601 timestamp
  imageUrl?: string;  // object URL for display
}

export interface TopPrediction {
  species: string;
  conditionDisplay: string;
  confidence: number;
}

export interface AnalysisError {
  type: "validation" | "inference" | "unsupported";
  message: string;
  suggestion: string;
}

// Inference service interface — implemented by Mock and Real services
export interface InferenceService {
  analyze(image: File, imageUrl: string): Promise<DiseaseResult>;
}

// History entry stored in localStorage
export interface HistoryEntry {
  id: string;
  result: DiseaseResult;
  thumbnailUrl: string; // small base64 thumbnail
}
