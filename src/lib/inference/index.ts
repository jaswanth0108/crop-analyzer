// ============================================================
// AgriShield — Inference Service Factory
// ============================================================

import type { InferenceService } from "@/types/analysis";
import { MockInferenceService } from "./mock";
import { RealInferenceService } from "./real";

/**
 * Returns the appropriate InferenceService based on the environment variable.
 * NEXT_PUBLIC_INFERENCE_MODE=mock (default) | real
 */
export function getInferenceService(): InferenceService {
  const mode = process.env.NEXT_PUBLIC_INFERENCE_MODE ?? "mock";
  if (mode === "real") {
    return new RealInferenceService();
  }
  return new MockInferenceService();
}
