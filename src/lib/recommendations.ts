// ============================================================
// AgriShield — Recommendation Engine
// Maps (crop, condition, severity) → actionable recommendations
// ============================================================

import type { Recommendation, SeverityLabel } from "@/types/analysis";

type RecommendationMap = Record<
  string, // `${crop}__${condition}__${severity}`
  Recommendation[]
>;

const BASE_DISCLAIMER =
  "Always consult a certified agronomist before applying any chemical treatment. " +
  "Follow local pesticide regulations.";

// ── Rice Recommendations ──────────────────────────────────────────────────────

function riceHealthy(): Recommendation[] {
  return [
    {
      category: "prevention",
      title: "Maintain good field hygiene",
      description:
        "Remove crop debris after harvest to reduce pathogen carryover. " +
        "Rotate crops each season where possible.",
      urgency: "low",
    },
    {
      category: "prevention",
      title: "Monitor regularly",
      description:
        "Scout fields at tillering and panicle stages for early signs of disease. " +
        "Early detection is the most effective management strategy.",
      urgency: "low",
    },
  ];
}

function riceBacterialLeafBlight(severity: SeverityLabel): Recommendation[] {
  const recs: Recommendation[] = [
    {
      category: "immediate",
      title: "Drain field water if possible",
      description:
        "Bacterial Leaf Blight thrives in flooded conditions. Draining field water temporarily " +
        "can reduce bacterial spread.",
      urgency: severity === "critical" || severity === "very_high" ? "high" : "medium",
    },
    {
      category: "treatment",
      title: "Apply copper-based bactericide",
      description:
        `Copper oxychloride (0.3%) or streptomycin sulphate (200 ppm) are commonly used. ` +
        BASE_DISCLAIMER,
      urgency: severity === "healthy" || severity === "mild" ? "low" : "high",
    },
    {
      category: "prevention",
      title: "Use certified resistant varieties",
      description:
        "Plant BLB-resistant varieties such as IR64, IR72, or IRRI-recommended local varieties. " +
        "Avoid excessive nitrogen fertilisation which promotes susceptibility.",
      urgency: "low",
    },
    {
      category: "prevention",
      title: "Clean irrigation equipment",
      description:
        "Bacteria spread through irrigation water. Disinfect channels and avoid " +
        "using water from infected fields.",
      urgency: "medium",
    },
  ];
  return recs;
}

function riceBrownSpot(severity: SeverityLabel): Recommendation[] {
  return [
    {
      category: "immediate",
      title: "Check soil nutrient levels",
      description:
        "Brown Spot is strongly associated with silicon and potassium deficiency. " +
        "Conduct a soil test and correct deficiencies before applying fungicides.",
      urgency: "high",
    },
    {
      category: "treatment",
      title: "Apply recommended fungicide",
      description:
        `Mancozeb (0.25%) or carbendazim (0.1%) at tillering stage. ` +
        (severity === "critical"
          ? "Two applications 10–14 days apart are recommended given severe infection. "
          : "") +
        BASE_DISCLAIMER,
      urgency: severity === "mild" ? "low" : "medium",
    },
    {
      category: "prevention",
      title: "Seed treatment before planting",
      description:
        "Treat seeds with Carbendazim + Thiram (1:1) at 3 g/kg of seed to prevent " +
        "seed-borne infection.",
      urgency: "low",
    },
  ];
}

function riceLeafBlast(severity: SeverityLabel): Recommendation[] {
  return [
    {
      category: "immediate",
      title: "Apply fungicide immediately",
      description:
        `Tricyclazole (0.06%) or Isoprothiolane (0.075%) sprays are first-line treatments. ` +
        (severity === "critical" || severity === "very_high"
          ? "Begin immediately and repeat in 7–10 days. "
          : "Apply at flag leaf stage. ") +
        BASE_DISCLAIMER,
      urgency: severity === "mild" ? "medium" : "high",
    },
    {
      category: "treatment",
      title: "Reduce nitrogen application",
      description:
        "Excess nitrogen increases blast susceptibility. Reduce top-dressing if infection " +
        "is detected during vegetative stage.",
      urgency: "medium",
    },
    {
      category: "prevention",
      title: "Use blast-resistant varieties",
      description:
        "Varieties like Swarna Sub1, Samba Mahsuri, and IR36 have documented blast " +
        "resistance. Source certified seeds from a registered supplier.",
      urgency: "low",
    },
  ];
}

function riceSheathBlight(severity: SeverityLabel): Recommendation[] {
  return [
    {
      category: "immediate",
      title: "Reduce plant density if possible",
      description:
        "Sheath Blight spreads rapidly in dense canopies. If detected early, thinning and " +
        "ensuring good air circulation can slow spread.",
      urgency: severity === "critical" ? "high" : "medium",
    },
    {
      category: "treatment",
      title: "Apply hexaconazole or propiconazole",
      description:
        `Hexaconazole (0.1%) or Propiconazole (0.1%) sprays at the base of plants. ` +
        BASE_DISCLAIMER,
      urgency: "high",
    },
    {
      category: "prevention",
      title: "Balanced fertilisation",
      description:
        "Avoid excessive nitrogen which promotes dense, susceptible growth. Use split " +
        "applications of nitrogen across the growing season.",
      urgency: "low",
    },
  ];
}

// ── Tomato Recommendations ────────────────────────────────────────────────────

function tomatoHealthy(): Recommendation[] {
  return [
    {
      category: "prevention",
      title: "Maintain plant spacing",
      description:
        "Adequate spacing (45–60 cm between plants) improves air circulation and " +
        "reduces fungal disease risk.",
      urgency: "low",
    },
    {
      category: "prevention",
      title: "Regular scouting",
      description:
        "Check undersides of leaves weekly for early signs of blight, spots, or pests.",
      urgency: "low",
    },
  ];
}

function tomatoEarlyBlight(): Recommendation[] {
  return [
    {
      category: "immediate",
      title: "Remove infected leaves",
      description:
        "Prune and dispose of infected leaves away from the field. Do not compost " +
        "diseased plant material.",
      urgency: "high",
    },
    {
      category: "treatment",
      title: "Apply chlorothalonil or mancozeb",
      description:
        `Chlorothalonil (0.2%) or Mancozeb (0.25%) on a 7–10 day schedule. ` +
        BASE_DISCLAIMER,
      urgency: "medium",
    },
    {
      category: "prevention",
      title: "Mulch around plant base",
      description:
        "Mulching reduces soil splash, which is a primary infection pathway for Early Blight.",
      urgency: "low",
    },
  ];
}

function tomatoLateBlight(): Recommendation[] {
  return [
    {
      category: "immediate",
      title: "Act immediately — Late Blight spreads fast",
      description:
        "Late Blight (P. infestans) can devastate a crop within days. Remove all visibly " +
        "infected plant parts and destroy them (burn or bury deeply). Do not compost.",
      urgency: "high",
    },
    {
      category: "treatment",
      title: "Apply systemic fungicide",
      description:
        `Metalaxyl + Mancozeb (Ridomil Gold) or Cymoxanil (0.3%) are effective. ` +
        `Apply every 5–7 days in humid conditions. ` +
        BASE_DISCLAIMER,
      urgency: "high",
    },
    {
      category: "prevention",
      title: "Improve field drainage",
      description:
        "Late Blight thrives in wet conditions. Improve drainage and avoid overhead " +
        "irrigation. Water at the base of plants in the morning.",
      urgency: "medium",
    },
  ];
}

function tomatoBacterialSpot(): Recommendation[] {
  return [
    {
      category: "immediate",
      title: "Remove infected plant tissue",
      description:
        "Remove and destroy heavily infected leaves and fruit. Wash hands and tools " +
        "between plants to avoid mechanical spread.",
      urgency: "medium",
    },
    {
      category: "treatment",
      title: "Apply copper-based bactericide",
      description:
        `Copper hydroxide or copper oxychloride (2–3 g/L) every 7 days. ` +
        BASE_DISCLAIMER,
      urgency: "medium",
    },
    {
      category: "prevention",
      title: "Use certified disease-free seeds",
      description:
        "Bacterial Spot is seed-borne. Source certified seed and treat with hot water " +
        "(50°C for 25 minutes) before planting.",
      urgency: "low",
    },
  ];
}

function tomatoLeafMold(): Recommendation[] {
  return [
    {
      category: "immediate",
      title: "Improve greenhouse ventilation",
      description:
        "Leaf Mold is primarily a greenhouse disease. Reduce humidity below 85% " +
        "and increase air circulation.",
      urgency: "high",
    },
    {
      category: "treatment",
      title: "Apply mancozeb or chlorothalonil",
      description:
        `Mancozeb (0.25%) or Chlorothalonil (0.2%) at 7-day intervals. ` +
        BASE_DISCLAIMER,
      urgency: "medium",
    },
    {
      category: "prevention",
      title: "Choose resistant varieties",
      description:
        "Modern hybrid tomato varieties (e.g., Heinz series) often carry Cf resistance genes " +
        "against Leaf Mold.",
      urgency: "low",
    },
  ];
}

// ── Potato Recommendations ────────────────────────────────────────────────────

function potatoHealthy(): Recommendation[] {
  return [
    {
      category: "prevention",
      title: "Hilling and earthing-up",
      description:
        "Keep tubers covered with soil to prevent greening and reduce late blight entry points.",
      urgency: "low",
    },
    {
      category: "prevention",
      title: "Monitor weekly",
      description:
        "Scout for early blight and late blight symptoms at canopy closure stage. " +
        "Early detection is critical for both diseases.",
      urgency: "low",
    },
  ];
}

function potatoEarlyBlight(): Recommendation[] {
  return [
    {
      category: "immediate",
      title: "Remove and destroy infected foliage",
      description:
        "Prune lower, heavily infected leaves and destroy them. Avoid spreading " +
        "infected material across the field.",
      urgency: "medium",
    },
    {
      category: "treatment",
      title: "Apply protectant fungicide",
      description:
        `Mancozeb (0.25%) or Chlorothalonil (0.2%) every 7–10 days. ` +
        BASE_DISCLAIMER,
      urgency: "medium",
    },
    {
      category: "prevention",
      title: "Adequate potassium nutrition",
      description:
        "Potassium deficiency increases susceptibility to Early Blight. Ensure " +
        "balanced K nutrition throughout the growing season.",
      urgency: "low",
    },
  ];
}

function potatoLateBlight(): Recommendation[] {
  return [
    {
      category: "immediate",
      title: "Urgent: apply systemic fungicide",
      description:
        "Late Blight in potato can destroy a crop within 7–14 days. Apply Metalaxyl " +
        "(Ridomil) or Dimethomorph immediately and repeat every 5 days. " + BASE_DISCLAIMER,
      urgency: "high",
    },
    {
      category: "immediate",
      title: "Consider haum destruction if severe",
      description:
        "In cases of severe infection, destroying foliage (haulm killing) 2 weeks before " +
        "harvest can protect tubers from late blight entry.",
      urgency: "high",
    },
    {
      category: "prevention",
      title: "Plant certified disease-free seed potatoes",
      description:
        "Use certified seed potatoes from a registered supplier. Inspect tubers at planting " +
        "and reject any showing rot or blight symptoms.",
      urgency: "medium",
    },
  ];
}

// ── Public API ────────────────────────────────────────────────────────────────

export function getRecommendations(
  crop: string,
  condition: string,
  severity: SeverityLabel
): Recommendation[] {
  const key = `${crop}__${condition}`;

  const map: Record<string, (s: SeverityLabel) => Recommendation[]> = {
    "rice__healthy": () => riceHealthy(),
    "rice__bacterial_leaf_blight": riceBacterialLeafBlight,
    "rice__brown_spot": riceBrownSpot,
    "rice__leaf_blast": riceLeafBlast,
    "rice__sheath_blight": riceSheathBlight,
    "tomato__healthy": () => tomatoHealthy(),
    "tomato__early_blight": () => tomatoEarlyBlight(),
    "tomato__late_blight": () => tomatoLateBlight(),
    "tomato__bacterial_spot": () => tomatoBacterialSpot(),
    "tomato__leaf_mold": () => tomatoLeafMold(),
    "potato__healthy": () => potatoHealthy(),
    "potato__early_blight": () => potatoEarlyBlight(),
    "potato__late_blight": () => potatoLateBlight(),
  };

  return map[key]?.(severity) ?? [];
}
