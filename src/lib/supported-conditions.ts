// ============================================================
// AgriShield — Supported Conditions Registry
// Generated from class_map.json (all 4 datasets combined)
// 15 crop species · 48 disease conditions
// ============================================================

export interface ConditionInfo {
  species: string;
  condition: string;
  conditionDisplay: string;
  isHealthy: boolean;
  sources: string[];
  emoji: string;
}

export const SUPPORTED_CONDITIONS: ConditionInfo[] = [
  // ── Apple ────────────────────────────────────────────────
  { species: "Apple",       condition: "apple_scab",           conditionDisplay: "Apple Scab",                         isHealthy: false, sources: ["PlantVillage", "New Plant Diseases"],              emoji: "🍎" },
  { species: "Apple",       condition: "apple_black_rot",      conditionDisplay: "Apple Black Rot",                    isHealthy: false, sources: ["PlantVillage", "New Plant Diseases"],              emoji: "🍎" },
  { species: "Apple",       condition: "cedar_apple_rust",     conditionDisplay: "Cedar Apple Rust",                   isHealthy: false, sources: ["PlantVillage", "New Plant Diseases"],              emoji: "🍎" },
  { species: "Apple",       condition: "healthy",              conditionDisplay: "Healthy",                            isHealthy: true,  sources: ["PlantVillage", "PlantDoc", "New Plant Diseases"],  emoji: "🍎" },
  // ── Blueberry ────────────────────────────────────────────
  { species: "Blueberry",   condition: "healthy",              conditionDisplay: "Healthy",                            isHealthy: true,  sources: ["PlantVillage", "New Plant Diseases"],              emoji: "🫐" },
  // ── Cherry ───────────────────────────────────────────────
  { species: "Cherry",      condition: "powdery_mildew",       conditionDisplay: "Powdery Mildew",                     isHealthy: false, sources: ["PlantVillage", "New Plant Diseases"],              emoji: "🍒" },
  { species: "Cherry",      condition: "healthy",              conditionDisplay: "Healthy",                            isHealthy: true,  sources: ["PlantVillage", "New Plant Diseases"],              emoji: "🍒" },
  // ── Corn ─────────────────────────────────────────────────
  { species: "Corn",        condition: "cercospora_gray_leaf_spot", conditionDisplay: "Cercospora / Gray Leaf Spot",   isHealthy: false, sources: ["PlantVillage", "PlantDoc", "New Plant Diseases"],  emoji: "🌽" },
  { species: "Corn",        condition: "common_rust",          conditionDisplay: "Common Rust",                        isHealthy: false, sources: ["PlantVillage", "PlantDoc", "New Plant Diseases"],  emoji: "🌽" },
  { species: "Corn",        condition: "northern_leaf_blight", conditionDisplay: "Northern Leaf Blight",               isHealthy: false, sources: ["PlantVillage", "PlantDoc", "New Plant Diseases"],  emoji: "🌽" },
  { species: "Corn",        condition: "healthy",              conditionDisplay: "Healthy",                            isHealthy: true,  sources: ["PlantVillage", "New Plant Diseases"],              emoji: "🌽" },
  // ── Grape ────────────────────────────────────────────────
  { species: "Grape",       condition: "black_rot",            conditionDisplay: "Black Rot",                          isHealthy: false, sources: ["PlantVillage", "PlantDoc", "New Plant Diseases"],  emoji: "🍇" },
  { species: "Grape",       condition: "esca_black_measles",   conditionDisplay: "Esca (Black Measles)",               isHealthy: false, sources: ["PlantVillage", "New Plant Diseases"],              emoji: "🍇" },
  { species: "Grape",       condition: "leaf_blight_isariopsis", conditionDisplay: "Leaf Blight (Isariopsis)",         isHealthy: false, sources: ["PlantVillage", "New Plant Diseases"],              emoji: "🍇" },
  { species: "Grape",       condition: "healthy",              conditionDisplay: "Healthy",                            isHealthy: true,  sources: ["PlantVillage", "New Plant Diseases"],              emoji: "🍇" },
  // ── Orange ───────────────────────────────────────────────
  { species: "Orange",      condition: "haunglongbing_citrus_greening", conditionDisplay: "Huanglongbing (Citrus Greening)", isHealthy: false, sources: ["PlantVillage", "New Plant Diseases"], emoji: "🍊" },
  // ── Peach ────────────────────────────────────────────────
  { species: "Peach",       condition: "bacterial_spot",       conditionDisplay: "Bacterial Spot",                     isHealthy: false, sources: ["PlantVillage", "New Plant Diseases"],              emoji: "🍑" },
  { species: "Peach",       condition: "healthy",              conditionDisplay: "Healthy",                            isHealthy: true,  sources: ["PlantVillage", "New Plant Diseases"],              emoji: "🍑" },
  // ── Bell Pepper ──────────────────────────────────────────
  { species: "Bell Pepper", condition: "bacterial_spot",       conditionDisplay: "Bacterial Spot",                     isHealthy: false, sources: ["PlantVillage", "PlantDoc", "New Plant Diseases"],  emoji: "🌶️" },
  { species: "Bell Pepper", condition: "healthy",              conditionDisplay: "Healthy",                            isHealthy: true,  sources: ["PlantVillage", "New Plant Diseases"],              emoji: "🌶️" },
  // ── Potato ───────────────────────────────────────────────
  { species: "Potato",      condition: "early_blight",         conditionDisplay: "Early Blight",                       isHealthy: false, sources: ["PlantVillage", "PlantDoc", "New Plant Diseases"],  emoji: "🥔" },
  { species: "Potato",      condition: "late_blight",          conditionDisplay: "Late Blight",                        isHealthy: false, sources: ["PlantVillage", "PlantDoc", "New Plant Diseases"],  emoji: "🥔" },
  { species: "Potato",      condition: "healthy",              conditionDisplay: "Healthy",                            isHealthy: true,  sources: ["PlantVillage", "New Plant Diseases"],              emoji: "🥔" },
  // ── Raspberry ────────────────────────────────────────────
  { species: "Raspberry",   condition: "healthy",              conditionDisplay: "Healthy",                            isHealthy: true,  sources: ["PlantVillage", "New Plant Diseases"],              emoji: "🍓" },
  // ── Rice ─────────────────────────────────────────────────
  { species: "Rice",        condition: "bacterial_leaf_blight",     conditionDisplay: "Bacterial Leaf Blight",         isHealthy: false, sources: ["Paddy Doctor"],                                    emoji: "🌾" },
  { species: "Rice",        condition: "bacterial_leaf_streak",     conditionDisplay: "Bacterial Leaf Streak",         isHealthy: false, sources: ["Paddy Doctor"],                                    emoji: "🌾" },
  { species: "Rice",        condition: "bacterial_panicle_blight",  conditionDisplay: "Bacterial Panicle Blight",      isHealthy: false, sources: ["Paddy Doctor"],                                    emoji: "🌾" },
  { species: "Rice",        condition: "blast",                      conditionDisplay: "Blast (Leaf Blast)",            isHealthy: false, sources: ["Paddy Doctor"],                                    emoji: "🌾" },
  { species: "Rice",        condition: "brown_spot",                 conditionDisplay: "Brown Spot",                    isHealthy: false, sources: ["Paddy Doctor"],                                    emoji: "🌾" },
  { species: "Rice",        condition: "downy_mildew",               conditionDisplay: "Downy Mildew",                  isHealthy: false, sources: ["Paddy Doctor"],                                    emoji: "🌾" },
  { species: "Rice",        condition: "hispa",                      conditionDisplay: "Rice Hispa (Pest)",             isHealthy: false, sources: ["Paddy Doctor"],                                    emoji: "🌾" },
  { species: "Rice",        condition: "tungro",                     conditionDisplay: "Tungro Virus",                  isHealthy: false, sources: ["Paddy Doctor"],                                    emoji: "🌾" },
  { species: "Rice",        condition: "stem_borer",                 conditionDisplay: "Stem Borer (Pest)",             isHealthy: false, sources: ["Paddy Doctor"],                                    emoji: "🌾" },
  { species: "Rice",        condition: "healthy",                    conditionDisplay: "Healthy",                       isHealthy: true,  sources: ["Paddy Doctor"],                                    emoji: "🌾" },
  // ── Soybean ──────────────────────────────────────────────
  { species: "Soybean",     condition: "healthy",              conditionDisplay: "Healthy",                            isHealthy: true,  sources: ["PlantVillage", "New Plant Diseases"],              emoji: "🌿" },
  // ── Squash ───────────────────────────────────────────────
  { species: "Squash",      condition: "powdery_mildew",       conditionDisplay: "Powdery Mildew",                     isHealthy: false, sources: ["PlantVillage", "New Plant Diseases"],              emoji: "🥒" },
  // ── Strawberry ───────────────────────────────────────────
  { species: "Strawberry",  condition: "leaf_scorch",          conditionDisplay: "Leaf Scorch",                        isHealthy: false, sources: ["PlantVillage", "New Plant Diseases"],              emoji: "🍓" },
  { species: "Strawberry",  condition: "healthy",              conditionDisplay: "Healthy",                            isHealthy: true,  sources: ["PlantVillage", "New Plant Diseases"],              emoji: "🍓" },
  // ── Tomato ───────────────────────────────────────────────
  { species: "Tomato",      condition: "bacterial_spot",       conditionDisplay: "Bacterial Spot",                     isHealthy: false, sources: ["PlantVillage", "PlantDoc", "New Plant Diseases"],  emoji: "🍅" },
  { species: "Tomato",      condition: "early_blight",         conditionDisplay: "Early Blight",                       isHealthy: false, sources: ["PlantVillage", "PlantDoc", "New Plant Diseases"],  emoji: "🍅" },
  { species: "Tomato",      condition: "late_blight",          conditionDisplay: "Late Blight",                        isHealthy: false, sources: ["PlantVillage", "PlantDoc", "New Plant Diseases"],  emoji: "🍅" },
  { species: "Tomato",      condition: "leaf_mold",            conditionDisplay: "Leaf Mold",                          isHealthy: false, sources: ["PlantVillage", "New Plant Diseases"],              emoji: "🍅" },
  { species: "Tomato",      condition: "septoria_leaf_spot",   conditionDisplay: "Septoria Leaf Spot",                 isHealthy: false, sources: ["PlantVillage", "PlantDoc", "New Plant Diseases"],  emoji: "🍅" },
  { species: "Tomato",      condition: "spider_mites",         conditionDisplay: "Spider Mites (Two-spotted)",         isHealthy: false, sources: ["PlantVillage", "New Plant Diseases"],              emoji: "🍅" },
  { species: "Tomato",      condition: "target_spot",          conditionDisplay: "Target Spot",                        isHealthy: false, sources: ["PlantVillage", "New Plant Diseases"],              emoji: "🍅" },
  { species: "Tomato",      condition: "yellow_leaf_curl_virus", conditionDisplay: "Yellow Leaf Curl Virus",           isHealthy: false, sources: ["PlantVillage", "New Plant Diseases"],              emoji: "🍅" },
  { species: "Tomato",      condition: "mosaic_virus",         conditionDisplay: "Tomato Mosaic Virus",                isHealthy: false, sources: ["PlantVillage", "New Plant Diseases"],              emoji: "🍅" },
  { species: "Tomato",      condition: "healthy",              conditionDisplay: "Healthy",                            isHealthy: true,  sources: ["PlantVillage", "PlantDoc", "New Plant Diseases"],  emoji: "🍅" },
];

export const UNIQUE_SPECIES = [...new Set(SUPPORTED_CONDITIONS.map(c => c.species))].sort();

export function getConditionInfo(species: string, condition: string): ConditionInfo | undefined {
  return SUPPORTED_CONDITIONS.find(
    c => c.species.toLowerCase() === species.toLowerCase() &&
         c.condition.toLowerCase() === condition.toLowerCase()
  );
}

export function getSpeciesEmoji(species: string): string {
  const found = SUPPORTED_CONDITIONS.find(c => c.species.toLowerCase() === species.toLowerCase());
  return found?.emoji ?? "🌱";
}

export function getConditionsForSpecies(species: string): ConditionInfo[] {
  return SUPPORTED_CONDITIONS.filter(c => c.species.toLowerCase() === species.toLowerCase());
}
