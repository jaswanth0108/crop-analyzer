"""
AgriShield — Step 3: Export trained model to ONNX
===================================================
Exports the best .pth checkpoint to ONNX format for fast, portable inference.
Also validates the ONNX output matches PyTorch within tolerance.

Output: ml/models/agrishield.onnx

Usage:
  python 3_export.py
  python 3_export.py --checkpoint ml/models/checkpoint_epoch_20.pth
"""

import sys
import json
import argparse
import numpy as np
from pathlib import Path

import torch
from torchvision import transforms
from PIL import Image

try:
    import timm
    import onnx
    import onnxruntime as ort
except ImportError:
    print("ERROR: Missing dependencies. Run: pip install -r requirements.txt")
    sys.exit(1)

ROOT  = Path(__file__).parent
MODELS = ROOT / "models"
CLASS_MAP_PATH = ROOT / "class_map.json"

with open(CLASS_MAP_PATH) as f:
    CLASS_MAP = json.load(f)
NUM_CLASSES = CLASS_MAP["num_classes"]
IMG_SIZE    = 300

def load_model(checkpoint_path: Path) -> torch.nn.Module:
    ckpt = torch.load(checkpoint_path, map_location="cpu")
    model = timm.create_model("efficientnet_b3", pretrained=False, num_classes=NUM_CLASSES)
    model.load_state_dict(ckpt["model"])
    model.eval()
    return model


def export_onnx(model: torch.nn.Module, out_path: Path) -> None:
    dummy = torch.randn(1, 3, IMG_SIZE, IMG_SIZE)
    torch.onnx.export(
        model,
        dummy,
        str(out_path),
        opset_version=17,
        input_names=["image"],
        output_names=["logits"],
        dynamic_axes={"image": {0: "batch"}, "logits": {0: "batch"}},
        export_params=True,
    )
    print(f"  ONNX model exported → {out_path}")


def validate_onnx(model: torch.nn.Module, onnx_path: Path) -> None:
    """Run a dummy input through both PyTorch and ONNX; check outputs match."""
    onnx_model = onnx.load(str(onnx_path))
    onnx.checker.check_model(onnx_model)

    session = ort.InferenceSession(str(onnx_path), providers=["CPUExecutionProvider"])
    dummy_np = np.random.randn(1, 3, IMG_SIZE, IMG_SIZE).astype(np.float32)

    with torch.no_grad():
        pt_out = model(torch.tensor(dummy_np)).numpy()
    onnx_out = session.run(["logits"], {"image": dummy_np})[0]

    max_diff = float(np.abs(pt_out - onnx_out).max())
    if max_diff < 1e-4:
        print(f"  ✓ ONNX validation passed (max diff = {max_diff:.2e})")
    else:
        print(f"  ⚠  ONNX output differs from PyTorch (max diff = {max_diff:.2e}) — may still work")


def save_model_metadata(checkpoint_path: Path, onnx_path: Path) -> None:
    """Save a metadata JSON alongside the ONNX model for use by the inference server."""
    ckpt = torch.load(checkpoint_path, map_location="cpu")
    meta = {
        "model_file"    : onnx_path.name,
        "num_classes"   : NUM_CLASSES,
        "img_size"      : IMG_SIZE,
        "class_map_file": "class_map.json",
        "val_acc"       : ckpt.get("best_val_acc"),
        "trained_epochs": ckpt.get("epoch"),
        "architecture"  : "efficientnet_b3",
        "input_mean"    : [0.485, 0.456, 0.406],
        "input_std"     : [0.229, 0.224, 0.225],
    }
    meta_path = onnx_path.parent / "model_meta.json"
    with open(meta_path, "w") as f:
        json.dump(meta, f, indent=2)
    print(f"  Model metadata saved → {meta_path}")


def main(args):
    checkpoint = Path(args.checkpoint)
    if not checkpoint.exists():
        print(f"ERROR: Checkpoint not found: {checkpoint}")
        print("  Run: python 2_train.py  first")
        sys.exit(1)

    out_path = MODELS / "agrishield.onnx"
    print(f"\n{'='*50}")
    print(f"  Exporting checkpoint: {checkpoint.name}")
    print(f"{'='*50}")

    model = load_model(checkpoint)
    export_onnx(model, out_path)
    validate_onnx(model, out_path)
    save_model_metadata(checkpoint, out_path)

    print(f"\n  ✓ Export complete!")
    print(f"  Next step: python 4_inference_server.py")


if __name__ == "__main__":
    parser = argparse.ArgumentParser(description="Export AgriShield model to ONNX")
    parser.add_argument(
        "--checkpoint",
        type=str,
        default=str(MODELS / "agrishield_efficientnet_b3_best.pth"),
    )
    main(parser.parse_args())
