"""
AgriShield — Step 4: FastAPI Inference Server
==============================================
Serves the ONNX model via a REST API.
The Next.js frontend (INFERENCE_MODE=real) calls POST /predict.

Start:
  python 4_inference_server.py
  uvicorn 4_inference_server:app --host 0.0.0.0 --port 8000

API:
  POST /predict      — multipart/form-data: file (image)
  GET  /health       — server health check
  GET  /classes      — list of all supported classes
"""

import io
import json
import time
from pathlib import Path
from typing import List

import numpy as np
from PIL import Image

try:
    import onnxruntime as ort
    from fastapi import FastAPI, File, UploadFile, HTTPException
    from fastapi.middleware.cors import CORSMiddleware
    from pydantic import BaseModel
    import uvicorn
except ImportError:
    print("ERROR: Missing dependencies. Run: pip install -r requirements.txt")
    raise

# ── Paths & config ────────────────────────────────────────────────────────
ROOT         = Path(__file__).parent
MODELS_DIR   = ROOT / "models"
ONNX_PATH    = MODELS_DIR / "agrishield.onnx"
META_PATH    = MODELS_DIR / "model_meta.json"
CLASS_MAP    = ROOT / "class_map.json"

IMG_SIZE     = 300
IMG_MEAN     = np.array([0.485, 0.456, 0.406], dtype=np.float32)
IMG_STD      = np.array([0.229, 0.224, 0.225], dtype=np.float32)
TOP_K        = 3          # return top-3 predictions
CONF_THRESHOLD = 0.30     # below this → "low confidence"

# ── Load model & class map ────────────────────────────────────────────────

def load_resources():
    if not ONNX_PATH.exists():
        raise FileNotFoundError(
            f"Model not found at {ONNX_PATH}. "
            "Run: python 2_train.py && python 3_export.py"
        )
    with open(CLASS_MAP) as f:
        cmap = json.load(f)

    session = ort.InferenceSession(
        str(ONNX_PATH),
        providers=["CUDAExecutionProvider", "CPUExecutionProvider"],
    )
    return session, cmap


try:
    SESSION, CMAP = load_resources()
    CLASSES = CMAP["classes"]
    MODEL_LOADED = True
    print(f"  ✓ Model loaded: {ONNX_PATH.name} ({len(CLASSES)} classes)")
except FileNotFoundError as e:
    print(f"  ⚠  {e}")
    SESSION = CMAP = CLASSES = None
    MODEL_LOADED = False

# ── Image preprocessing ───────────────────────────────────────────────────

def preprocess(image_bytes: bytes) -> np.ndarray:
    img = Image.open(io.BytesIO(image_bytes)).convert("RGB")
    # Resize: slightly larger, then center-crop
    size = int(IMG_SIZE * 1.15)
    img = img.resize((size, size), Image.BILINEAR)
    left = (size - IMG_SIZE) // 2
    img = img.crop((left, left, left + IMG_SIZE, left + IMG_SIZE))

    arr = np.array(img, dtype=np.float32) / 255.0  # HWC
    arr = (arr - IMG_MEAN) / IMG_STD
    arr = arr.transpose(2, 0, 1)                    # CHW
    arr = np.expand_dims(arr, 0)                    # NCHW
    return arr


def softmax(x: np.ndarray) -> np.ndarray:
    x = x - x.max()
    e = np.exp(x)
    return e / e.sum()

# ── Response models ───────────────────────────────────────────────────────

class Prediction(BaseModel):
    species: str
    condition: str
    conditionDisplay: str
    isHealthy: bool
    confidence: float
    confidenceLevel: str  # "high" | "medium" | "low"

class PredictResponse(BaseModel):
    top1: Prediction
    topK: List[Prediction]
    analysedAt: str
    modelVersion: str
    disclaimer: str

# ── FastAPI app ───────────────────────────────────────────────────────────

app = FastAPI(
    title="AgriShield Inference API",
    version="1.0.0",
    description="Plant disease detection — EfficientNet-B3 trained on PlantVillage + PlantDoc + Paddy Doctor",
)

app.add_middleware(
    CORSMiddleware,
    allow_origins=["http://localhost:3000", "https://*.vercel.app"],
    allow_methods=["POST", "GET"],
    allow_headers=["*"],
)

DISCLAIMER = (
    "AgriShield provides AI-assisted crop health analysis. "
    "Results may be incorrect and should be confirmed by a qualified agricultural expert."
)

def conf_level(conf: float) -> str:
    if conf >= 0.70: return "high"
    if conf >= 0.45: return "medium"
    return "low"


def make_prediction(class_id: int, confidence: float) -> Prediction:
    cls = CLASSES[class_id]
    return Prediction(
        species=cls["species"],
        condition=cls["condition"],
        conditionDisplay=cls["display"],
        isHealthy=cls["healthy"],
        confidence=round(float(confidence), 4),
        confidenceLevel=conf_level(confidence),
    )


@app.get("/health")
def health():
    return {
        "status": "ok" if MODEL_LOADED else "model_not_loaded",
        "model": ONNX_PATH.name if MODEL_LOADED else None,
        "num_classes": len(CLASSES) if CLASSES else 0,
    }


@app.get("/classes")
def classes():
    if not MODEL_LOADED:
        raise HTTPException(503, detail="Model not loaded")
    return {"num_classes": len(CLASSES), "classes": CLASSES}


@app.post("/predict", response_model=PredictResponse)
async def predict(file: UploadFile = File(...)):
    if not MODEL_LOADED:
        raise HTTPException(503, detail="Model not loaded. Run training first.")

    # Validate file type
    if file.content_type not in ("image/jpeg", "image/png", "image/webp"):
        raise HTTPException(400, detail="Only JPEG, PNG, or WebP images are accepted.")

    image_bytes = await file.read()
    if len(image_bytes) > 15 * 1024 * 1024:
        raise HTTPException(413, detail="Image too large (max 15 MB).")

    try:
        inp = preprocess(image_bytes)
    except Exception as e:
        raise HTTPException(400, detail=f"Could not decode image: {e}")

    t0 = time.perf_counter()
    logits = SESSION.run(["logits"], {"image": inp})[0][0]
    probs  = softmax(logits)
    elapsed_ms = (time.perf_counter() - t0) * 1000

    top_ids = probs.argsort()[::-1][:TOP_K]
    top1_id = int(top_ids[0])
    top1_conf = float(probs[top1_id])

    top_preds = [make_prediction(int(i), float(probs[i])) for i in top_ids]

    return PredictResponse(
        top1=top_preds[0],
        topK=top_preds,
        analysedAt=time.strftime("%Y-%m-%dT%H:%M:%SZ", time.gmtime()),
        modelVersion=ONNX_PATH.name,
        disclaimer=DISCLAIMER,
    )


if __name__ == "__main__":
    uvicorn.run("4_inference_server:app", host="0.0.0.0", port=8000, reload=False)
