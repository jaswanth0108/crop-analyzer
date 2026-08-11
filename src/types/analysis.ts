// ============================================================
// AgriShield — Core Type Definitions
// ============================================================

export type CropType = "rice" | "tomato" | "potato";

export type ConfidenceLevel =
  | "high"        // >= 0.70
  | "low"         // 0.55 – 0.69
  | "unreliable"  // < 0.55
  | "unsupported"; // unrecognised crop / unrelated image

export type SeverityLabel =
  | "healthy"
  | "mild"
  | "moderate"
  | "high"
  | "very_high"
  | "critical"
  | "unavailable"; // Severity not supported for this crop/condition

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
  severityLabel: SeverityLabel;
  severityPercentage: number | null; // null when unavailable
  recommendations: Recommendation[];
  heatmapDataUrl: string | null;    // canvas data URL or null
  isDemoData: boolean;
  disclaimer: string;
  analysedAt: string; // ISO 8601 timestamp
  imageUrl?: string;  // object URL for display
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
