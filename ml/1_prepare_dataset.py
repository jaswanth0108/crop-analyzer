"""
AgriShield — Step 1: Prepare & Merge All 4 Datasets
======================================================
Downloads and normalises all 4 datasets into a single unified structure:

  ml/data/merged/
    train/
      class_0/   ← Apple_Apple_scab
      class_1/   ← Apple_Black_rot
      ...
      class_47/  ← Rice_healthy
    val/
      (same structure)

Sources:
  1. PlantVillage  — via Hugging Face (free, no key needed)
  2. New Plant Diseases (Kaggle) — requires kaggle.json
  3. PlantDoc — manual download (instructions printed below)
  4. Paddy Doctor — via Kaggle competition download

Usage:
  python 1_prepare_dataset.py
  python 1_prepare_dataset.py --skip-kaggle   # Skip datasets requiring Kaggle key
  python 1_prepare_dataset.py --plantdoc-dir /path/to/plantdoc  # Use local PlantDoc
"""

import os
import sys
import shutil
import json
import argparse
import random
from pathlib import Path
from typing import Dict, List, Tuple

try:
    from PIL import Image
    from tqdm import tqdm
except ImportError:
    print("ERROR: Missing dependencies. Run: pip install -r requirements.txt")
    sys.exit(1)

# ── Paths ──────────────────────────────────────────────────────────────────
ROOT = Path(__file__).parent
DATA = ROOT / "data"
MERGED = DATA / "merged"
TRAIN = MERGED / "train"
VAL = MERGED / "val"
CLASS_MAP_PATH = ROOT / "class_map.json"

# Load class map
with open(CLASS_MAP_PATH) as f:
    CLASS_MAP = json.load(f)

LABEL_NORM: Dict[str, int] = CLASS_MAP["label_normalization"]
NUM_CLASSES = CLASS_MAP["num_classes"]

# ── Utilities ──────────────────────────────────────────────────────────────

def class_dir_name(class_id: int) -> str:
    """Return the directory name for a class id."""
    cls = CLASS_MAP["classes"][class_id]
    species = cls["species"].replace(" ", "_").lower()
    cond = cls["condition"]
    return f"{class_id:02d}_{species}_{cond}"


def setup_dirs() -> None:
    for split in [TRAIN, VAL]:
        for i in range(NUM_CLASSES):
            (split / class_dir_name(i)).mkdir(parents=True, exist_ok=True)
    print(f"✓ Created merged directory structure: {MERGED}")


def is_valid_image(path: Path) -> bool:
    try:
        with Image.open(path) as img:
            img.verify()
        return True
    except Exception:
        return False


def copy_image(src: Path, class_id: int, split: str = "train") -> bool:
    dest_dir = (TRAIN if split == "train" else VAL) / class_dir_name(class_id)
    dest_file = dest_dir / src.name
    # Avoid duplicates — append suffix if needed
    if dest_file.exists():
        stem = src.stem
        suffix = src.suffix
        n = 1
        while dest_file.exists():
            dest_file = dest_dir / f"{stem}_{n}{suffix}"
            n += 1
    try:
        shutil.copy2(src, dest_file)
        return True
    except Exception:
        return False


def normalize_label(raw_label: str) -> int | None:
    """Map raw dataset label to canonical class id. Returns None if not found."""
    # Direct lookup
    if raw_label in LABEL_NORM:
        return LABEL_NORM[raw_label]
    # Case-insensitive fallback
    lower = raw_label.lower()
    for k, v in LABEL_NORM.items():
        if k.lower() == lower:
            return v
    return None


def split_files(files: List[Path], val_ratio: float = 0.15) -> Tuple[List[Path], List[Path]]:
    """Return (train_files, val_files) with a deterministic split."""
    random.seed(42)
    shuffled = sorted(files)  # sort for reproducibility
    random.shuffle(shuffled)
    n_val = max(1, int(len(shuffled) * val_ratio))
    return shuffled[n_val:], shuffled[:n_val]


# ── Dataset 1: PlantVillage via GitHub ──────────────────────────────────────

def prepare_plantvillage() -> None:
    print("\n" + "="*60)
    print("Dataset 1/4: PlantVillage (via GitHub)")
    print("="*60)

    auto_dir = DATA / "plantvillage"
    if not (auto_dir / "raw" / "color").exists():
        print("  Cloning PlantVillage from GitHub…")
        ret = os.system(f"git clone --depth 1 https://github.com/spMohanty/PlantVillage-Dataset.git {auto_dir} >/dev/null 2>&1")
        if ret != 0:
            print("  ⚠  Git clone failed.")
            return

    src_root = auto_dir / "raw" / "color"
    if not src_root.exists():
        print("  ⚠  Could not find raw/color folder in PlantVillage repo.")
        return

    total = 0
    skipped = 0
    all_files: Dict[int, List[Path]] = {}
    
    for cls_folder in sorted(src_root.iterdir()):
        if not cls_folder.is_dir():
            continue
        class_id = normalize_label(cls_folder.name)
        if class_id is None:
            skipped += len(list(cls_folder.glob("*")))
            continue
        all_files.setdefault(class_id, []).extend(
            [f for f in cls_folder.glob("*") if f.suffix.lower() in (".jpg", ".jpeg", ".png", ".JPG")]
        )

    for class_id, files in tqdm(all_files.items(), desc="  PlantVillage"):
        train_files, val_files = split_files(files)
        for f in train_files:
            if copy_image(f, class_id, "train"):
                total += 1
            else:
                skipped += 1
        for f in val_files:
            if copy_image(f, class_id, "val"):
                total += 1
            else:
                skipped += 1

    print(f"  ✓ PlantVillage: {total} images copied, {skipped} skipped")


# ── Dataset 2: New Plant Diseases (Kaggle) ─────────────────────────────────

def prepare_kaggle_npd(skip: bool = False) -> None:
    print("\n" + "="*60)
    print("Dataset 2/4: New Plant Diseases Dataset (Kaggle)")
    print("="*60)
    if skip:
        print("  ⚠  Skipped (--skip-kaggle flag).")
        return

    kaggle_json = Path.home() / ".kaggle" / "kaggle.json"
    if not kaggle_json.exists():
        print("  ⚠  No Kaggle credentials found at ~/.kaggle/kaggle.json")
        print("  → Get your API key: https://www.kaggle.com/settings/account → 'Create New Token'")
        print("  → Save as ~/.kaggle/kaggle.json and re-run this script")
        return

    download_dir = DATA / "kaggle_npd"
    if not (download_dir / "New Plant Diseases Dataset(Augmented)").exists():
        print("  Downloading from Kaggle…")
        os.system(f"kaggle datasets download -d vipoooool/new-plant-diseases-dataset -p {download_dir} --unzip")
    else:
        print("  Already downloaded — using cached version")

    total = 0
    skipped = 0

    for split_folder, dest_split in [("train", "train"), ("valid", "val")]:
        src_root = download_dir / "New Plant Diseases Dataset(Augmented)" / split_folder
        if not src_root.exists():
            src_root = download_dir / split_folder  # alternate layout
        if not src_root.exists():
            print(f"  ⚠  Could not find {split_folder} folder")
            continue
        for class_folder in tqdm(sorted(src_root.iterdir()), desc=f"  Kaggle {split_folder}"):
            if not class_folder.is_dir():
                continue
            class_id = normalize_label(class_folder.name)
            if class_id is None:
                skipped += len(list(class_folder.glob("*.jpg")))
                continue
            for img_file in class_folder.glob("*"):
                if img_file.suffix.lower() in (".jpg", ".jpeg", ".png"):
                    if copy_image(img_file, class_id, dest_split):
                        total += 1
                    else:
                        skipped += 1

    print(f"  ✓ Kaggle NPD: {total} images copied, {skipped} skipped")


# ── Dataset 3: PlantDoc ───────────────────────────────────────────────────

def prepare_plantdoc(plantdoc_dir: Path | None = None) -> None:
    print("\n" + "="*60)
    print("Dataset 3/4: PlantDoc")
    print("="*60)

    # Try to auto-download from GitHub
    if plantdoc_dir is None:
        auto_dir = DATA / "plantdoc"
        if not (auto_dir / "train").exists():
            print("  Cloning PlantDoc from GitHub (2,569 images)…")
            ret = os.system(f"git clone --depth 1 https://github.com/pratikkayal/PlantDoc-Dataset.git {auto_dir}")
            if ret != 0:
                print("  ⚠  Git clone failed. Manual steps:")
                print("     1. Go to https://github.com/pratikkayal/PlantDoc-Dataset")
                print("     2. Download ZIP → extract to ml/data/plantdoc/")
                print("     3. Re-run: python 1_prepare_dataset.py --plantdoc-dir ml/data/plantdoc")
                return
        plantdoc_dir = auto_dir

    # PlantDoc has train/ and test/ with class-name subdirectories
    # Class names use spaces — we map them to our canonical IDs
    PLANTDOC_MAP = {
        "Apple Scab Leaf": 0, "Apple leaf": 3, "Apple rust leaf": 2,
        "Bell_pepper leaf spot": 18, "Bell_pepper leaf": 19,
        "Blueberry leaf": 4,
        "Cherry leaf": 6,
        "Corn Gray leaf spot": 7, "Corn leaf blight": 9, "Corn rust leaf": 8,
        "Grape leaf black rot": 11, "Grape leaf": 14,
        "Peach leaf": 17,
        "Potato leaf early blight": 20, "Potato leaf late blight": 21, "Potato leaf": 22,
        "Raspberry leaf": 23,
        "Soyabean leaf": 24,
        "Squash Powdery mildew leaf": 25,
        "Strawberry leaf": 27,
        "Tomato Early blight leaf": 29, "Tomato Septoria leaf spot": 32,
        "Tomato leaf bacterial spot": 28, "Tomato leaf late blight": 30,
        "Tomato leaf mosaic virus": 36, "Tomato leaf yellow virus": 35,
        "Tomato leaf": 37, "Tomato mold leaf": 31, "Tomato two spotted spider mites leaf": 33,
    }

    total = 0
    skipped = 0
    for split_folder, dest_split in [("train", "train"), ("test", "val")]:
        src_root = plantdoc_dir / split_folder
        if not src_root.exists():
            continue
        for cls_folder in tqdm(sorted(src_root.iterdir()), desc=f"  PlantDoc {split_folder}"):
            if not cls_folder.is_dir():
                continue
            class_id = PLANTDOC_MAP.get(cls_folder.name)
            if class_id is None:
                skipped += len(list(cls_folder.glob("*")))
                continue
            for img_file in cls_folder.glob("*"):
                if img_file.suffix.lower() in (".jpg", ".jpeg", ".png", ".JPG"):
                    if copy_image(img_file, class_id, dest_split):
                        total += 1
                    else:
                        skipped += 1

    print(f"  ✓ PlantDoc: {total} images copied, {skipped} skipped")


# ── Dataset 4: Paddy Doctor ───────────────────────────────────────────────

def prepare_paddy_doctor(skip: bool = False) -> None:
    print("\n" + "="*60)
    print("Dataset 4/4: Paddy Doctor")
    print("="*60)

    auto_dir = DATA / "paddy_doctor"
    # Try Kaggle download
    kaggle_json = Path.home() / ".kaggle" / "kaggle.json"
    if not (auto_dir / "train_images").exists() and not skip and kaggle_json.exists():
        print("  Downloading Paddy Doctor via Kaggle…")
        os.system(f"kaggle competitions download -c paddy-disease-classification -p {auto_dir} --unzip 2>/dev/null || "
                  f"kaggle datasets download -d jaswanth0108/paddy-doctor-extended -p {auto_dir} --unzip 2>/dev/null")

    if not auto_dir.exists() or not any(auto_dir.iterdir()):
        print("  ⚠  Paddy Doctor not available automatically. Manual steps:")
        print("     1. Go to https://paddydoc.github.io/dataset/")
        print("     2. Request access and download the dataset")
        print("     3. Extract to ml/data/paddy_doctor/ with structure:")
        print("        ml/data/paddy_doctor/train_images/<class_name>/<image>.jpg")
        print("     4. Re-run this script")
        return

    PADDY_MAP = {
        "bacterial_leaf_blight": 38,
        "bacterial_leaf_streak": 39,
        "bacterial_panicle_blight": 40,
        "blast": 41,
        "brown_spot": 42,
        "downy_mildew": 43,
        "hispa": 44,
        "leaf_roller": 44,  # merged with hispa (pest)
        "tungro": 45,
        "black_stem_borer": 46,
        "white_stem_borer": 46,
        "yellow_stem_borer": 46,
        "normal": 47,
        "healthy": 47,
    }

    total = 0
    skipped = 0

    src_root = auto_dir / "train_images"
    if not src_root.exists():
        src_root = auto_dir

    all_files: Dict[int, List[Path]] = {}
    for cls_folder in sorted(src_root.iterdir()):
        if not cls_folder.is_dir():
            continue
        class_id = PADDY_MAP.get(cls_folder.name.lower())
        if class_id is None:
            skipped += len(list(cls_folder.glob("*")))
            continue
        all_files.setdefault(class_id, []).extend(
            [f for f in cls_folder.glob("*") if f.suffix.lower() in (".jpg", ".jpeg", ".png")]
        )

    for class_id, files in tqdm(all_files.items(), desc="  Paddy Doctor"):
        train_files, val_files = split_files(files)
        for f in train_files:
            if copy_image(f, class_id, "train"):
                total += 1
        for f in val_files:
            if copy_image(f, class_id, "val"):
                total += 1

    print(f"  ✓ Paddy Doctor: {total} images copied, {skipped} skipped")


# ── Summary ───────────────────────────────────────────────────────────────

def print_summary() -> None:
    print("\n" + "="*60)
    print("DATASET MERGE SUMMARY")
    print("="*60)
    total_train = total_val = 0
    for cls in CLASS_MAP["classes"]:
        cls_dir_train = TRAIN / class_dir_name(cls["id"])
        cls_dir_val = VAL / class_dir_name(cls["id"])
        n_train = len(list(cls_dir_train.glob("*"))) if cls_dir_train.exists() else 0
        n_val = len(list(cls_dir_val.glob("*"))) if cls_dir_val.exists() else 0
        total_train += n_train
        total_val += n_val
        status = "✓" if n_train > 0 else "⚠"
        print(f"  {status} [{cls['id']:02d}] {cls['species']:15s} | {cls['display']:45s} | train: {n_train:5d} | val: {n_val:4d}")

    print(f"\n  TOTAL  train: {total_train:,}  |  val: {total_val:,}")
    print(f"\n  Merged data ready at: {MERGED}")
    print("\n  Next step: python 2_train.py")


# ── Entry Point ────────────────────────────────────────────────────────────

if __name__ == "__main__":
    parser = argparse.ArgumentParser(description="Prepare AgriShield merged dataset")
    parser.add_argument("--skip-kaggle", action="store_true", help="Skip datasets requiring Kaggle API key")
    parser.add_argument("--plantdoc-dir", type=str, help="Path to already-downloaded PlantDoc directory")
    args = parser.parse_args()

    DATA.mkdir(parents=True, exist_ok=True)
    setup_dirs()

    prepare_plantvillage()
    prepare_kaggle_npd(skip=args.skip_kaggle)
    prepare_plantdoc(plantdoc_dir=Path(args.plantdoc_dir) if args.plantdoc_dir else None)
    prepare_paddy_doctor(skip=args.skip_kaggle)

    print_summary()
