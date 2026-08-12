// ============================================================
// AgriShield — Real Inference Service
// Calls the FastAPI inference server (ml/4_inference_server.py)
// Set NEXT_PUBLIC_INFERENCE_MODE=real and
//     INFERENCE_SERVER_URL=http://localhost:8000 in .env.local
// ============================================================

import type { DiseaseResult, InferenceService, SeverityLabel } from "@/types/analysis";
import { getRecommendations } from "@/lib/recommendations";
import { percentageToSeverity } from "@/lib/severity";
import { getSpeciesEmoji } from "@/lib/supported-conditions";

const DISCLAIMER =
  "AgriShield provides AI-assisted crop health analysis. Results may be incorrect " +
  "and should be confirmed by a qualified agricultural expert before treatment decisions.";

export class RealInferenceService implements InferenceService {
  private readonly apiUrl: string;

  constructor() {
    this.apiUrl = process.env.INFERENCE_SERVER_URL ?? "http://localhost:8000";
  }

  async analyze(image: File, imageUrl: string): Promise<DiseaseResult> {
    const form = new FormData();
    form.append("file", image);

    const res = await fetch(`/api/analyze`, {
      method: "POST",
      body: form,
    });

    if (!res.ok) {
      const errText = await res.text().catch(() => "Unknown error");
      throw new Error(`Inference API error ${res.status}: ${errText}`);
    }

    const data = await res.json();
    const top1 = data.top1;

    const severity: SeverityLabel = "unavailable";

    const recommendations = getRecommendations(
      top1.species,
      top1.condition,
      severity
    );

    return {
      crop: top1.species,
      cropDisplay: `${getSpeciesEmoji(top1.species)} ${top1.species}`,
      condition: top1.condition,
      conditionDisplay: top1.conditionDisplay,
      confidence: top1.confidence,
      confidenceLevel: top1.confidenceLevel,
      topPredictions: (data.topK ?? []).map((p: { species: string; conditionDisplay: string; confidence: number }) => ({
        species: p.species,
        conditionDisplay: p.conditionDisplay,
        confidence: p.confidence,
      })),
      severityLabel: top1.isHealthy ? "healthy" : severity,
      severityPercentage: null,
      recommendations,
      heatmapDataUrl: null,
      isDemoData: false,
      disclaimer: DISCLAIMER,
      analysedAt: data.analysedAt ?? new Date().toISOString(),
      imageUrl,
    };
  }
}
