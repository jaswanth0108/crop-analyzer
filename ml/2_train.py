"""
AgriShield — Step 2: Train EfficientNet-B3 on merged dataset
==============================================================
Architecture : EfficientNet-B3 (pretrained on ImageNet) via timm
Loss         : CrossEntropyLoss with label smoothing (0.1)
Optimizer    : AdamW with cosine LR schedule
Augmentation : RandomHFlip, RandomRotate, ColorJitter, RandomErasing
Mixed-prec   : torch.cuda.amp (FP16 on GPU, falls back to FP32)
Output       : ml/models/agrishield_efficientnet_b3_best.pth

Usage:
  python 2_train.py
  python 2_train.py --epochs 30 --batch-size 32
  python 2_train.py --resume ml/models/checkpoint_epoch_5.pth
"""

import os
import sys
import json
import argparse
import time
from pathlib import Path

import torch
import torch.nn as nn
from torch.utils.data import DataLoader
from torchvision import transforms, datasets
from torch.optim import AdamW
from torch.optim.lr_scheduler import CosineAnnealingLR
from torch.cuda.amp import GradScaler, autocast

try:
    import timm
    from tqdm import tqdm
except ImportError:
    print("ERROR: Missing dependencies. Run: pip install -r requirements.txt")
    sys.exit(1)

# ── Paths ──────────────────────────────────────────────────────────────────
ROOT     = Path(__file__).parent
DATA     = ROOT / "data" / "merged"
MODELS   = ROOT / "models"
LOG_DIR  = ROOT / "logs"
CLASS_MAP_PATH = ROOT / "class_map.json"

MODELS.mkdir(parents=True, exist_ok=True)
LOG_DIR.mkdir(parents=True, exist_ok=True)

with open(CLASS_MAP_PATH) as f:
    CLASS_MAP = json.load(f)
NUM_CLASSES = CLASS_MAP["num_classes"]

# ── Config ─────────────────────────────────────────────────────────────────
DEFAULT_CFG = {
    "model_name"   : "efficientnet_b3",
    "pretrained"   : True,
    "img_size"     : 300,
    "batch_size"   : 32,
    "epochs"       : 25,
    "lr"           : 3e-4,
    "weight_decay" : 1e-4,
    "label_smooth" : 0.1,
    "num_workers"  : 4,
    "val_freq"     : 1,      # validate every N epochs
    "save_freq"    : 5,      # save checkpoint every N epochs
}

# ── Transforms ─────────────────────────────────────────────────────────────

def get_transforms(img_size: int):
    mean = [0.485, 0.456, 0.406]
    std  = [0.229, 0.224, 0.225]

    train_tf = transforms.Compose([
        transforms.RandomResizedCrop(img_size, scale=(0.7, 1.0)),
        transforms.RandomHorizontalFlip(),
        transforms.RandomVerticalFlip(p=0.1),
        transforms.RandomRotation(15),
        transforms.ColorJitter(brightness=0.3, contrast=0.3, saturation=0.2, hue=0.05),
        transforms.ToTensor(),
        transforms.Normalize(mean, std),
        transforms.RandomErasing(p=0.1),
    ])

    val_tf = transforms.Compose([
        transforms.Resize(int(img_size * 1.15)),
        transforms.CenterCrop(img_size),
        transforms.ToTensor(),
        transforms.Normalize(mean, std),
    ])

    return train_tf, val_tf


# ── Model ──────────────────────────────────────────────────────────────────

def build_model(model_name: str, num_classes: int, pretrained: bool) -> nn.Module:
    model = timm.create_model(model_name, pretrained=pretrained, num_classes=num_classes)
    return model


# ── Training loop ──────────────────────────────────────────────────────────

def run_epoch(model, loader, criterion, optimizer, scaler, device, is_train: bool):
    model.train() if is_train else model.eval()
    total_loss = 0.0
    correct = 0
    total = 0

    ctx = torch.enable_grad() if is_train else torch.no_grad()
    with ctx:
        for imgs, labels in tqdm(loader, leave=False, desc="train" if is_train else "val"):
            imgs   = imgs.to(device, non_blocking=True)
            labels = labels.to(device, non_blocking=True)

            with autocast(device_type="cuda", enabled=device.type == "cuda"):
                logits = model(imgs)
                loss   = criterion(logits, labels)

            if is_train:
                optimizer.zero_grad(set_to_none=True)
                scaler.scale(loss).backward()
                scaler.unscale_(optimizer)
                nn.utils.clip_grad_norm_(model.parameters(), 1.0)
                scaler.step(optimizer)
                scaler.update()

            total_loss += loss.item() * imgs.size(0)
            preds = logits.argmax(1)
            correct += (preds == labels).sum().item()
            total   += imgs.size(0)

    return total_loss / total, correct / total


# ── Main ───────────────────────────────────────────────────────────────────

def main(args):
    cfg = {**DEFAULT_CFG}
    cfg["batch_size"] = args.batch_size
    cfg["epochs"]     = args.epochs

    device = torch.device("cuda" if torch.cuda.is_available() else "cpu")
    print(f"\n{'='*60}")
    print(f"  AgriShield Training — EfficientNet-B3")
    print(f"  Device  : {device} {'(GPU ✓)' if device.type == 'cuda' else '(CPU — consider using Colab GPU)'}")
    print(f"  Classes : {NUM_CLASSES}")
    print(f"  Epochs  : {cfg['epochs']}  |  Batch: {cfg['batch_size']}  |  LR: {cfg['lr']}")
    print(f"{'='*60}\n")

    # Datasets
    train_tf, val_tf = get_transforms(cfg["img_size"])
    train_ds = datasets.ImageFolder(DATA / "train", transform=train_tf)
    val_ds   = datasets.ImageFolder(DATA / "val",   transform=val_tf)

    assert len(train_ds.classes) == NUM_CLASSES, (
        f"Expected {NUM_CLASSES} classes, found {len(train_ds.classes)}. "
        f"Re-run 1_prepare_dataset.py first."
    )

    # Save class-to-index map (needed by inference server)
    idx2class = {v: k for k, v in train_ds.class_to_idx.items()}
    with open(MODELS / "idx_to_folder.json", "w") as f:
        json.dump(idx2class, f, indent=2)
    print(f"  Class index map saved → {MODELS / 'idx_to_folder.json'}")

    train_loader = DataLoader(train_ds, batch_size=cfg["batch_size"], shuffle=True,
                              num_workers=cfg["num_workers"], pin_memory=True)
    val_loader   = DataLoader(val_ds,   batch_size=cfg["batch_size"] * 2, shuffle=False,
                              num_workers=cfg["num_workers"], pin_memory=True)

    # Model
    model = build_model(cfg["model_name"], NUM_CLASSES, cfg["pretrained"])
    model = model.to(device)

    # Resume if requested
    start_epoch = 0
    best_val_acc = 0.0
    if args.resume and Path(args.resume).exists():
        ckpt = torch.load(args.resume, map_location=device)
        model.load_state_dict(ckpt["model"])
        start_epoch = ckpt.get("epoch", 0)
        best_val_acc = ckpt.get("best_val_acc", 0.0)
        print(f"  Resumed from {args.resume} (epoch {start_epoch})")

    # Training components
    criterion = nn.CrossEntropyLoss(label_smoothing=cfg["label_smooth"])
    optimizer = AdamW(model.parameters(), lr=cfg["lr"], weight_decay=cfg["weight_decay"])
    scheduler = CosineAnnealingLR(optimizer, T_max=cfg["epochs"])
    scaler    = GradScaler(enabled=device.type == "cuda")

    log_rows = []
    for epoch in range(start_epoch, cfg["epochs"]):
        t0 = time.time()
        train_loss, train_acc = run_epoch(model, train_loader, criterion, optimizer, scaler, device, is_train=True)
        scheduler.step()

        val_loss = val_acc = None
        if (epoch + 1) % cfg["val_freq"] == 0:
            val_loss, val_acc = run_epoch(model, val_loader, criterion, optimizer, scaler, device, is_train=False)

        elapsed = time.time() - t0
        row = {
            "epoch": epoch + 1,
            "train_loss": round(train_loss, 4),
            "train_acc":  round(train_acc * 100, 2),
            "val_loss":   round(val_loss, 4) if val_loss else None,
            "val_acc":    round(val_acc * 100, 2) if val_acc else None,
            "lr":         round(scheduler.get_last_lr()[0], 6),
            "time_s":     round(elapsed, 1),
        }
        log_rows.append(row)

        print(
            f"  Epoch {epoch+1:3d}/{cfg['epochs']} | "
            f"train_loss={train_loss:.4f} acc={train_acc*100:.1f}% | "
            + (f"val_loss={val_loss:.4f} val_acc={val_acc*100:.1f}%" if val_acc else "")
            + f" | {elapsed:.0f}s"
        )

        # Save best model
        if val_acc and val_acc > best_val_acc:
            best_val_acc = val_acc
            torch.save({
                "model": model.state_dict(),
                "epoch": epoch + 1,
                "best_val_acc": best_val_acc,
                "cfg": cfg,
                "class_to_idx": train_ds.class_to_idx,
            }, MODELS / "agrishield_efficientnet_b3_best.pth")
            print(f"    ★ New best model saved (val_acc={best_val_acc*100:.2f}%)")

        # Periodic checkpoint
        if (epoch + 1) % cfg["save_freq"] == 0:
            torch.save({
                "model": model.state_dict(),
                "epoch": epoch + 1,
                "best_val_acc": best_val_acc,
                "cfg": cfg,
                "class_to_idx": train_ds.class_to_idx,
            }, MODELS / f"checkpoint_epoch_{epoch+1:03d}.pth")

    # Save training log
    with open(LOG_DIR / "train_log.json", "w") as f:
        json.dump(log_rows, f, indent=2)

    print(f"\n{'='*60}")
    print(f"  Training complete. Best val accuracy: {best_val_acc*100:.2f}%")
    print(f"  Best model: {MODELS / 'agrishield_efficientnet_b3_best.pth'}")
    print(f"  Next step : python 3_export.py")
    print(f"{'='*60}\n")


if __name__ == "__main__":
    parser = argparse.ArgumentParser(description="Train AgriShield EfficientNet-B3")
    parser.add_argument("--epochs",     type=int, default=DEFAULT_CFG["epochs"])
    parser.add_argument("--batch-size", type=int, default=DEFAULT_CFG["batch_size"])
    parser.add_argument("--resume",     type=str, default=None, help="Path to checkpoint .pth")
    main(parser.parse_args())
