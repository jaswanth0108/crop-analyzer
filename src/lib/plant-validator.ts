// ============================================================
// AgriShield — Plant Validator
// Uses Gemini Vision API ONLY to determine if the uploaded
// image contains a plant, leaf, or crop.
// Disease detection is handled separately by the inference model.
// ============================================================

export interface PlantValidationResult {
  isPlant: boolean;
  confidence: "high" | "medium" | "low";
  plantType?: string;       // e.g. "rice leaf", "tomato plant", "mango leaf"
  reason?: string;          // Only populated if NOT a plant
}

const GEMINI_API_URL =
  "https://generativelanguage.googleapis.com/v1beta/models/gemini-2.0-flash:generateContent";

const VALIDATION_PROMPT = `You are an agricultural image classifier. Your ONLY job is to determine if the uploaded image contains a plant, leaf, crop, or any part of a plant.

Analyze the image carefully and respond ONLY with a valid JSON object in this exact format (no markdown, no explanation):
{
  "isPlant": true or false,
  "confidence": "high" or "medium" or "low",
  "plantType": "brief description if it is a plant, e.g. rice leaf, tomato plant, or null if not a plant",
  "reason": "brief reason only if it is NOT a plant, otherwise null"
}

Rules:
- Set "isPlant" to true ONLY if the image clearly shows a plant, leaf, crop, stem, root, flower, or fruit still attached to a plant.
- Set "isPlant" to false for: people, animals, food items not on a plant, objects, landscapes without plants, blurry unidentifiable images, screenshots, etc.
- Do NOT analyze diseases. That is not your job. Just determine if it is a plant.`;

export async function validateIsPlant(
  imageFile: File
): Promise<PlantValidationResult> {
  const apiKey = process.env.NEXT_PUBLIC_GEMINI_API_KEY;

  if (!apiKey) {
    // No API key configured — fail open (allow analysis to proceed)
    console.warn("NEXT_PUBLIC_GEMINI_API_KEY not set — skipping plant validation.");
    return { isPlant: true, confidence: "low", plantType: "unknown (validation skipped)" };
  }

  // Convert file to base64
  const base64 = await fileToBase64(imageFile);
  const mimeType = imageFile.type as "image/jpeg" | "image/png" | "image/webp";

  const requestBody = {
    contents: [
      {
        parts: [
          { text: VALIDATION_PROMPT },
          {
            inline_data: {
              mime_type: mimeType,
              data: base64,
            },
          },
        ],
      },
    ],
    generationConfig: {
      temperature: 0.1,
      maxOutputTokens: 200,
    },
  };

  const response = await fetch(`${GEMINI_API_URL}?key=${apiKey}`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(requestBody),
  });

  if (!response.ok) {
    const errText = await response.text();
    console.error("Gemini API error:", errText);
    // Fail open — let the inference model handle it
    return { isPlant: true, confidence: "low", plantType: "unknown (validation error)" };
  }

  const data = await response.json();

  try {
    const rawText: string =
      data?.candidates?.[0]?.content?.parts?.[0]?.text ?? "";

    // Strip any markdown code fences if present
    const jsonText = rawText
      .replace(/```json\n?/g, "")
      .replace(/```\n?/g, "")
      .trim();

    const parsed: PlantValidationResult = JSON.parse(jsonText);
    return parsed;
  } catch (e) {
    console.error("Failed to parse Gemini response:", e);
    // Fail open
    return { isPlant: true, confidence: "low" };
  }
}

function fileToBase64(file: File): Promise<string> {
  return new Promise((resolve, reject) => {
    const reader = new FileReader();
    reader.onload = () => {
      const result = reader.result as string;
      // Strip the data URL prefix (e.g. "data:image/jpeg;base64,")
      const base64 = result.split(",")[1];
      resolve(base64);
    };
    reader.onerror = reject;
    reader.readAsDataURL(file);
  });
}
