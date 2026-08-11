// ============================================================
// AgriShield — Real Inference Service (Stub)
// Calls the /api/analyze backend route when INFERENCE_MODE=real.
// ============================================================

import type { DiseaseResult, InferenceService } from "@/types/analysis";

export class RealInferenceService implements InferenceService {
  async analyze(image: File, imageUrl: string): Promise<DiseaseResult> {
    const formData = new FormData();
    formData.append("image", image);

    const res = await fetch("/api/analyze", {
      method: "POST",
      body: formData,
    });

    if (!res.ok) {
      const err = await res.json().catch(() => ({}));
      throw new Error(err?.message ?? `Inference server returned ${res.status}`);
    }

    const result: DiseaseResult = await res.json();
    // Ensure imageUrl is set for display purposes
    return { ...result, imageUrl };
  }
}
