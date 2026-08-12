// ============================================================
// AgriShield — Recommendation Engine (Extended: All 15 Crops)
// Maps (species, condition, severity) → actionable recommendations
// ============================================================

import type { Recommendation, SeverityLabel } from "@/types/analysis";

const DISCLAIMER =
  "Always consult a certified agronomist before applying any chemical treatment. " +
  "Follow local pesticide regulations.";

// ── Generic utility ───────────────────────────────────────────────────────

function healthyRec(crop: string): Recommendation[] {
  return [
    {
      category: "prevention",
      title: "Maintain field hygiene",
      description: `Your ${crop} plant appears healthy. Remove crop debris regularly and rotate crops each season to reduce pathogen carryover.`,
      urgency: "low",
    },
    {
      category: "prevention",
      title: "Regular scouting",
      description: "Scout plants weekly for early signs of disease or pest damage. Early detection is the most cost-effective management strategy.",
      urgency: "low",
    },
  ];
}

function powderyMildewRec(crop: string): Recommendation[] {
  return [
    { category: "immediate",   title: "Remove heavily infected leaves",      description: `Prune and dispose of leaves with heavy powdery mildew. Do not compost infected material.`, urgency: "medium" },
    { category: "treatment",   title: "Apply sulfur-based fungicide",         description: `Sulfur dust or potassium bicarbonate spray every 7–10 days. For severe cases use myclobutanil. ${DISCLAIMER}`, urgency: "medium" },
    { category: "prevention",  title: "Improve air circulation",              description: `Avoid dense planting; prune ${crop} to allow airflow. Powdery mildew thrives in humid, stagnant conditions.`, urgency: "low" },
  ];
}

function bacterialSpotRec(crop: string): Recommendation[] {
  return [
    { category: "immediate",   title: "Remove and destroy infected tissue",   description: "Remove heavily spotted leaves and fruit. Wash hands and sterilise tools between plants.", urgency: "medium" },
    { category: "treatment",   title: "Apply copper-based bactericide",        description: `Copper hydroxide or copper oxychloride (2–3 g/L) every 7 days until symptoms stop spreading. ${DISCLAIMER}`, urgency: "medium" },
    { category: "prevention",  title: "Use certified disease-free seeds",      description: "Bacterial spot is often seed-borne. Use certified seed and treat with hot water (50°C, 25 min) before planting.", urgency: "low" },
  ];
}

function earlyBlightRec(crop: string): Recommendation[] {
  return [
    { category: "immediate",   title: "Prune lower infected leaves",          description: "Remove infected lower foliage first — early blight progresses from old to new leaves. Dispose away from field.", urgency: "medium" },
    { category: "treatment",   title: "Apply chlorothalonil or mancozeb",      description: `Chlorothalonil (0.2%) or Mancozeb (0.25%) on a 7–10 day schedule. ${DISCLAIMER}`, urgency: "medium" },
    { category: "prevention",  title: "Mulch around plant base",               description: "Mulching reduces soil splash, a primary infection pathway for early blight spores.", urgency: "low" },
  ];
}

function lateBlightRec(crop: string): Recommendation[] {
  return [
    { category: "immediate",   title: "Act immediately — late blight spreads rapidly", description: "Late blight can devastate a crop within days. Remove ALL visibly infected plant parts and destroy (burn or bury). Do NOT compost.", urgency: "high" },
    { category: "treatment",   title: "Apply systemic fungicide",              description: `Metalaxyl + Mancozeb (Ridomil Gold) or Cymoxanil (0.3%) every 5–7 days in humid conditions. ${DISCLAIMER}`, urgency: "high" },
    { category: "prevention",  title: "Improve drainage and airflow",          description: "Late blight thrives in wet conditions. Improve drainage and avoid overhead irrigation. Water at the base in the morning.", urgency: "medium" },
  ];
}

// ── Apple ─────────────────────────────────────────────────────────────────

function appleScab(): Recommendation[] {
  return [
    { category: "immediate",   title: "Remove infected leaves and fruit",     description: "Rake and destroy all fallen leaves — they are the primary source of overwintering scab spores.", urgency: "high" },
    { category: "treatment",   title: "Apply fungicide at green tip stage",    description: `Captan, myclobutanil, or propiconazole starting from bud-break through petal-fall. ${DISCLAIMER}`, urgency: "high" },
    { category: "prevention",  title: "Choose scab-resistant apple varieties", description: "Varieties like Pristine, Liberty, and Enterprise have strong scab resistance. Thin fruit clusters to improve air circulation.", urgency: "low" },
  ];
}

function appleBlackRot(): Recommendation[] {
  return [
    { category: "immediate",   title: "Prune infected wood and mummified fruit", description: "Remove all cankers, infected branches, and mummified fruit in winter/early spring before bud break.", urgency: "high" },
    { category: "treatment",   title: "Fungicide program from pink stage",     description: `Captan or thiophanate-methyl starting at pink, through cover sprays. ${DISCLAIMER}`, urgency: "medium" },
    { category: "prevention",  title: "Sanitation is key",                     description: "Black rot overwinters in dead wood and mummified fruit. Thorough annual pruning is the most effective control.", urgency: "medium" },
  ];
}

function cedarAppleRust(): Recommendation[] {
  return [
    { category: "treatment",   title: "Apply fungicide during infection period", description: `Myclobutanil or triadimefon from pink through first cover sprays (pink, bloom, petal-fall, first cover). ${DISCLAIMER}`, urgency: "high" },
    { category: "prevention",  title: "Remove nearby cedar/juniper trees",     description: "Cedar apple rust requires both apple and cedar/juniper hosts. Removing cedars within 300m is very effective.", urgency: "medium" },
    { category: "prevention",  title: "Plant rust-resistant varieties",         description: "Varieties like Liberty, Redfree, and Enterprise are resistant to cedar apple rust.", urgency: "low" },
  ];
}

// ── Corn ──────────────────────────────────────────────────────────────────

function cornGrayLeafSpot(): Recommendation[] {
  return [
    { category: "treatment",   title: "Apply foliar fungicide at tasseling",  description: `Strobilurin fungicides (azoxystrobin, pyraclostrobin) or triazoles at VT–R1 stage. ${DISCLAIMER}`, urgency: "medium" },
    { category: "prevention",  title: "Crop rotation and residue management",  description: "Gray leaf spot overwinters in corn residue. Rotate with non-corn crops and till residue where possible.", urgency: "medium" },
    { category: "prevention",  title: "Plant tolerant hybrids",                description: "Select hybrids with documented gray leaf spot tolerance ratings from your seed provider.", urgency: "low" },
  ];
}

function cornCommonRust(): Recommendation[] {
  return [
    { category: "treatment",   title: "Fungicide if conditions favor spread",  description: `Strobilurins or triazoles at VT if rust pustules are present on lower leaves. ${DISCLAIMER}`, urgency: "medium" },
    { category: "prevention",  title: "Plant rust-resistant hybrids",          description: "Most modern commercial corn hybrids have adequate common rust resistance. Check hybrid ratings.", urgency: "low" },
    { category: "prevention",  title: "Early season monitoring",               description: "Scout cornfields weekly from V6 onward. Rust spreads rapidly in cool, humid conditions.", urgency: "low" },
  ];
}

function cornNorthernLeafBlight(): Recommendation[] {
  return [
    { category: "immediate",   title: "Scout flag leaf and ear leaf",         description: "If NLB lesions reach the ear leaf before or at pollination, economic loss is likely. Act quickly.", urgency: "high" },
    { category: "treatment",   title: "Apply fungicide at VT stage",          description: `Propiconazole or azoxystrobin at tasseling. Multiple applications may be needed in severe cases. ${DISCLAIMER}`, urgency: "high" },
    { category: "prevention",  title: "Rotate and use resistant hybrids",     description: "NLB overwinters in residue. Crop rotation plus Ht-gene resistant hybrids is the most cost-effective strategy.", urgency: "medium" },
  ];
}

// ── Grape ─────────────────────────────────────────────────────────────────

function grapeBlackRot(): Recommendation[] {
  return [
    { category: "immediate",   title: "Remove mummified berries",             description: "Remove and destroy all mummified berries which are the primary source of overwintering spores.", urgency: "high" },
    { category: "treatment",   title: "Fungicide from early shoot growth",    description: `Myclobutanil or mancozeb starting from 2-inch shoot growth through bunch closure. ${DISCLAIMER}`, urgency: "high" },
    { category: "prevention",  title: "Canopy management for airflow",        description: "Open canopy through pruning to improve air circulation and reduce humidity around clusters.", urgency: "medium" },
  ];
}

function grapeEsca(): Recommendation[] {
  return [
    { category: "immediate",   title: "No curative treatment — manage vines", description: "Esca is a complex trunk disease with no reliable cure. Infected vines should be monitored and managed to extend their life.", urgency: "medium" },
    { category: "treatment",   title: "Protect pruning wounds",              description: "Apply wound sealants or fungicide paste (thiabendazole) immediately after pruning to prevent spore infection.", urgency: "high" },
    { category: "prevention",  title: "Double-pruning technique",             description: "Use double pruning (early rough cut + later clean cut) to allow wound drying before final cuts are made.", urgency: "medium" },
  ];
}

// ── Orange ────────────────────────────────────────────────────────────────

function orangeHLB(): Recommendation[] {
  return [
    { category: "immediate",   title: "There is no cure — focus on vector control", description: "HLB (Citrus Greening) is caused by a bacterium spread by the Asian citrus psyllid. Once infected, trees cannot be cured. Remove severely infected trees to protect neighbors.", urgency: "high" },
    { category: "treatment",   title: "Control Asian citrus psyllid",         description: `Apply systemic insecticides (imidacloprid, dinotefuran) to control psyllid populations. ${DISCLAIMER}`, urgency: "high" },
    { category: "prevention",  title: "Use certified disease-free nursery stock", description: "Only plant certified HLB-free trees. Quarantine newly purchased trees for 3–4 months before introducing to your grove.", urgency: "high" },
  ];
}

// ── Peach ─────────────────────────────────────────────────────────────────

function peachBacterialSpot(): Recommendation[] {
  return [
    { category: "immediate",   title: "Apply copper spray at leaf fall",      description: "Apply copper bactericide at leaf fall (50% drop) to protect wood from infection sites. Critical timing.", urgency: "high" },
    { category: "treatment",   title: "Oxytetracycline during growing season", description: `Oxytetracycline sprays every 3–5 days during wet weather in the growing season. ${DISCLAIMER}`, urgency: "medium" },
    { category: "prevention",  title: "Plant tolerant varieties",             description: "Varieties like Redhaven and Reliance have moderate bacterial spot tolerance. Discuss with your local extension service.", urgency: "low" },
  ];
}

// ── Potato (already covered by earlyBlightRec / lateBlightRec) ────────────

// ── Rice ──────────────────────────────────────────────────────────────────

function riceBacterialLeafBlight(severity: SeverityLabel): Recommendation[] {
  return [
    { category: "immediate",   title: "Drain field water if possible",        description: "Bacterial Leaf Blight thrives in flooded conditions. Draining temporarily can reduce bacterial spread.", urgency: severity === "critical" ? "high" : "medium" },
    { category: "treatment",   title: "Apply copper-based bactericide",        description: `Copper oxychloride (0.3%) or streptomycin sulphate (200 ppm). ${DISCLAIMER}`, urgency: "high" },
    { category: "prevention",  title: "Use certified BLB-resistant varieties", description: "Plant BLB-resistant varieties such as IR64, IR72 or IRRI-recommended local varieties. Avoid excessive nitrogen.", urgency: "low" },
  ];
}

function riceBlast(severity: SeverityLabel): Recommendation[] {
  return [
    { category: "immediate",   title: "Apply fungicide immediately",           description: `Tricyclazole (0.06%) or Isoprothiolane (0.075%). ${severity === "critical" ? "Begin immediately — repeat in 7–10 days." : "Apply at flag leaf stage."} ${DISCLAIMER}`, urgency: "high" },
    { category: "treatment",   title: "Reduce nitrogen application",           description: "Excess nitrogen increases blast susceptibility. Reduce top-dressing if infection is detected during vegetative stage.", urgency: "medium" },
    { category: "prevention",  title: "Use blast-resistant varieties",         description: "Varieties like Swarna Sub1, Samba Mahsuri, and IR36 have documented blast resistance.", urgency: "low" },
  ];
}

function riceBrownSpot(): Recommendation[] {
  return [
    { category: "immediate",   title: "Check soil nutrient levels",           description: "Brown Spot is strongly associated with silicon and potassium deficiency. Conduct a soil test before applying fungicides.", urgency: "high" },
    { category: "treatment",   title: "Apply recommended fungicide",           description: `Mancozeb (0.25%) or carbendazim (0.1%) at tillering stage. ${DISCLAIMER}`, urgency: "medium" },
    { category: "prevention",  title: "Seed treatment before planting",       description: "Treat seeds with Carbendazim + Thiram (1:1) at 3 g/kg of seed to prevent seed-borne infection.", urgency: "low" },
  ];
}

function riceTungro(): Recommendation[] {
  return [
    { category: "immediate",   title: "Control green leafhopper vector",       description: "Tungro is spread by the green leafhopper. Apply imidacloprid or thiamethoxam to control vector populations. Remove infected plants.", urgency: "high" },
    { category: "prevention",  title: "Synchronise planting in an area",       description: "Staggered planting creates a reservoir of susceptible young plants. Area-wide synchronised planting reduces Tungro pressure.", urgency: "medium" },
    { category: "prevention",  title: "Use Tungro-resistant varieties",        description: "Plant varieties with Tungro resistance — consult your local agricultural department for recommended varieties.", urgency: "low" },
  ];
}

function riceHispa(): Recommendation[] {
  return [
    { category: "immediate",   title: "Clip and destroy infested leaf tips",   description: "Cut and destroy the white, blotchy leaf tips where hispa larvae are mining. This directly reduces pest population.", urgency: "medium" },
    { category: "treatment",   title: "Apply appropriate insecticide",         description: `Chlorpyrifos (2 mL/L) or quinalphos (2 mL/L) spray. Avoid broad-spectrum insecticides that kill natural predators. ${DISCLAIMER}`, urgency: "medium" },
    { category: "prevention",  title: "Avoid excessive nitrogen",              description: "High nitrogen promotes lush growth that attracts hispa. Use balanced fertilisation.", urgency: "low" },
  ];
}

function riceStemBorer(): Recommendation[] {
  return [
    { category: "immediate",   title: "Remove dead hearts / white ears",       description: "Physically remove and destroy dead heart tillers (from larval feeding) to reduce the local pest population.", urgency: "high" },
    { category: "treatment",   title: "Apply carbofuran granules",             description: `Carbofuran 3G (1 kg/10 cents) at early booting. Cartap hydrochloride is an alternative. ${DISCLAIMER}`, urgency: "high" },
    { category: "prevention",  title: "Light trap and pheromone traps",        description: "Use pheromone traps (1/ha) to monitor adult stem borer population. High catches indicate need for treatment.", urgency: "low" },
  ];
}

// ── Strawberry ────────────────────────────────────────────────────────────

function strawberryLeafScorch(): Recommendation[] {
  return [
    { category: "immediate",   title: "Remove severely scorched leaves",       description: "Remove and destroy heavily infected leaves to reduce the source of fungal spores.", urgency: "medium" },
    { category: "treatment",   title: "Apply captan or myclobutanil",          description: `Captan (0.2%) or myclobutanil as protectant and curative fungicide. ${DISCLAIMER}`, urgency: "medium" },
    { category: "prevention",  title: "Use certified disease-free transplants", description: "Source certified strawberry plants. Leaf scorch (Diplocarpon earlianum) is commonly introduced via infected transplants.", urgency: "low" },
  ];
}

// ── Tomato (virus diseases) ───────────────────────────────────────────────

function tomatoVirusRec(virusName: string): Recommendation[] {
  return [
    { category: "immediate",   title: "Remove and destroy infected plants",    description: `${virusName} has no cure. Remove infected plants immediately to prevent spread to healthy plants.`, urgency: "high" },
    { category: "treatment",   title: "Control insect vectors",               description: "Tomato viruses are typically spread by whiteflies (TYLCV) or aphids (TMV). Apply imidacloprid or reflective mulches to deter insects.", urgency: "high" },
    { category: "prevention",  title: "Use resistant varieties and certified seed", description: `Plant varieties with resistance genes (e.g., Ty-1, Ty-3 for TYLCV). Use certified virus-free seed.`, urgency: "medium" },
  ];
}

function tomatoTargetSpot(): Recommendation[] {
  return [
    { category: "immediate",   title: "Remove affected lower leaves",          description: "Target spot starts on lower leaves. Remove and dispose of early-infected foliage promptly.", urgency: "medium" },
    { category: "treatment",   title: "Apply azoxystrobin or chlorothalonil",  description: `Azoxystrobin (0.1%) or chlorothalonil (0.2%) every 7–14 days. ${DISCLAIMER}`, urgency: "medium" },
    { category: "prevention",  title: "Reduce humidity in canopy",             description: "Stake and prune tomatoes to improve airflow. Avoid overhead irrigation — water at the base of plants.", urgency: "low" },
  ];
}

function tomatoSpiderMites(): Recommendation[] {
  return [
    { category: "immediate",   title: "Water stress promotes mites — irrigate adequately", description: "Spider mites thrive on drought-stressed plants. Ensure consistent irrigation.", urgency: "medium" },
    { category: "treatment",   title: "Apply miticide or insecticidal soap",   description: `Abamectin (0.019%) or bifenazate. Insecticidal soap (2%) can also knock down populations. ${DISCLAIMER}`, urgency: "medium" },
    { category: "prevention",  title: "Preserve natural predators",            description: "Avoid broad-spectrum insecticides that kill predatory mites (Phytoseiidae) — natural enemies are your best long-term defence.", urgency: "low" },
  ];
}

// ── Public API ────────────────────────────────────────────────────────────

export function getRecommendations(
  species: string,
  condition: string,
  severity: SeverityLabel
): Recommendation[] {
  const key = `${species.toLowerCase()}::${condition.toLowerCase()}`;

  const map: Record<string, (s: SeverityLabel) => Recommendation[]> = {
    // Healthy (generic)
    "apple::healthy":       () => healthyRec("Apple"),
    "blueberry::healthy":   () => healthyRec("Blueberry"),
    "cherry::healthy":      () => healthyRec("Cherry"),
    "corn::healthy":        () => healthyRec("Corn"),
    "grape::healthy":       () => healthyRec("Grape"),
    "peach::healthy":       () => healthyRec("Peach"),
    "bell pepper::healthy": () => healthyRec("Bell Pepper"),
    "potato::healthy":      () => healthyRec("Potato"),
    "raspberry::healthy":   () => healthyRec("Raspberry"),
    "rice::healthy":        () => healthyRec("Rice"),
    "soybean::healthy":     () => healthyRec("Soybean"),
    "squash::healthy":      () => healthyRec("Squash"),
    "strawberry::healthy":  () => healthyRec("Strawberry"),
    "tomato::healthy":      () => healthyRec("Tomato"),

    // Apple
    "apple::apple_scab":             () => appleScab(),
    "apple::apple_black_rot":        () => appleBlackRot(),
    "apple::cedar_apple_rust":       () => cedarAppleRust(),

    // Cherry
    "cherry::powdery_mildew":        () => powderyMildewRec("Cherry"),

    // Corn
    "corn::cercospora_gray_leaf_spot": () => cornGrayLeafSpot(),
    "corn::common_rust":             () => cornCommonRust(),
    "corn::northern_leaf_blight":    () => cornNorthernLeafBlight(),

    // Grape
    "grape::black_rot":              () => grapeBlackRot(),
    "grape::esca_black_measles":     () => grapeEsca(),
    "grape::leaf_blight_isariopsis": () => grapeBlackRot(), // similar approach

    // Orange
    "orange::haunglongbing_citrus_greening": () => orangeHLB(),

    // Peach
    "peach::bacterial_spot":         () => peachBacterialSpot(),

    // Bell Pepper
    "bell pepper::bacterial_spot":   () => bacterialSpotRec("Bell Pepper"),

    // Potato
    "potato::early_blight":          () => earlyBlightRec("Potato"),
    "potato::late_blight":           () => lateBlightRec("Potato"),

    // Rice
    "rice::bacterial_leaf_blight":   riceBacterialLeafBlight,
    "rice::bacterial_leaf_streak":   () => riceBacterialLeafBlight(severity),
    "rice::bacterial_panicle_blight": () => riceBacterialLeafBlight(severity),
    "rice::blast":                   riceBlast,
    "rice::brown_spot":              () => riceBrownSpot(),
    "rice::downy_mildew":            () => powderyMildewRec("Rice"),
    "rice::hispa":                   () => riceHispa(),
    "rice::tungro":                  () => riceTungro(),
    "rice::stem_borer":              () => riceStemBorer(),

    // Squash
    "squash::powdery_mildew":        () => powderyMildewRec("Squash"),

    // Strawberry
    "strawberry::leaf_scorch":       () => strawberryLeafScorch(),

    // Tomato
    "tomato::bacterial_spot":        () => bacterialSpotRec("Tomato"),
    "tomato::early_blight":          () => earlyBlightRec("Tomato"),
    "tomato::late_blight":           () => lateBlightRec("Tomato"),
    "tomato::leaf_mold":             () => powderyMildewRec("Tomato"),
    "tomato::septoria_leaf_spot":    () => earlyBlightRec("Tomato"),
    "tomato::spider_mites":          () => tomatoSpiderMites(),
    "tomato::target_spot":           () => tomatoTargetSpot(),
    "tomato::yellow_leaf_curl_virus": () => tomatoVirusRec("Tomato Yellow Leaf Curl Virus"),
    "tomato::mosaic_virus":          () => tomatoVirusRec("Tomato Mosaic Virus"),
  };

  return map[key]?.(severity) ?? [
    {
      category: "prevention",
      title: "Consult an agricultural expert",
      description: `No specific recommendation is available for this condition (${species}: ${condition}). Please consult a certified agronomist for guidance.`,
      urgency: "medium",
    },
  ];
}
