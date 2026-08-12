# ============================================================
# AgriShield Colab Training Script
# Copy this entire file into a Google Colab cell and run it.
# Uses a FREE T4 GPU — training takes ~60-90 minutes.
# ============================================================

# ── Cell 1: Install dependencies ──────────────────────────────────────────
"""
!pip install -q timm datasets huggingface_hub kaggle
!pip install -q torch torchvision --index-url https://download.pytorch.org/whl/cu118
"""

# ── Cell 2: Mount Google Drive (to save model) ────────────────────────────
"""
from google.colab import drive
drive.mount('/content/drive')
SAVE_DIR = '/content/drive/MyDrive/AgriShield'
import os; os.makedirs(SAVE_DIR, exist_ok=True)
"""

# ── Cell 3: Set up Kaggle (optional — for Kaggle datasets) ────────────────
"""
import json, os
# Paste your kaggle.json contents here:
kaggle_creds = {"username": "YOUR_USERNAME", "key": "YOUR_API_KEY"}
os.makedirs('/root/.kaggle', exist_ok=True)
with open('/root/.kaggle/kaggle.json', 'w') as f:
    json.dump(kaggle_creds, f)
!chmod 600 /root/.kaggle/kaggle.json
"""

# ── Cell 4: Clone AgriShield repo & prepare dataset ───────────────────────
"""
!git clone --depth 1 https://github.com/jaswanth0108/crop-analyzer.git /content/agrishield
%cd /content/agrishield/agrishield/ml
!pip install -q -r requirements.txt
!python 1_prepare_dataset.py
"""

# ── Cell 5: Train ─────────────────────────────────────────────────────────
"""
!python 2_train.py --epochs 25 --batch-size 64
"""

# ── Cell 6: Export to ONNX ────────────────────────────────────────────────
"""
!python 3_export.py
"""

# ── Cell 7: Copy model to Google Drive ───────────────────────────────────
"""
import shutil
shutil.copy('models/agrishield.onnx',        f'{SAVE_DIR}/agrishield.onnx')
shutil.copy('models/model_meta.json',        f'{SAVE_DIR}/model_meta.json')
shutil.copy('../ml/class_map.json',           f'{SAVE_DIR}/class_map.json')
print("✓ Model files saved to Google Drive!")
print(f"  Download them from: {SAVE_DIR}")
"""

# ── Cell 8: Quick test ────────────────────────────────────────────────────
"""
import onnxruntime as ort
import numpy as np, json

session = ort.InferenceSession('models/agrishield.onnx')
dummy = np.random.randn(1, 3, 300, 300).astype(np.float32)
out = session.run(['logits'], {'image': dummy})[0]
with open('../ml/class_map.json') as f:
    cm = json.load(f)

probs = np.exp(out[0]) / np.exp(out[0]).sum()
top3 = probs.argsort()[::-1][:3]
print("Top-3 predictions (random input — just sanity check):")
for i in top3:
    cls = cm['classes'][int(i)]
    print(f"  {cls['species']:15s} | {cls['display']:40s} | {probs[i]*100:.1f}%")
"""

# ── After training: deploy instructions ───────────────────────────────────
"""
# 1. Download agrishield.onnx and class_map.json from your Google Drive
# 2. Place them in: agrishield/ml/models/
# 3. Start the inference server:
#      pip install -r ml/requirements.txt
#      python ml/4_inference_server.py
# 4. Update .env.local:
#      NEXT_PUBLIC_INFERENCE_MODE=real
#      INFERENCE_SERVER_URL=http://localhost:8000
# 5. npm run dev
"""
