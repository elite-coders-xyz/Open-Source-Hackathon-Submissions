"""
YOLOv8 detection service.
Uses pre-trained COCO weights — no custom training needed for demo.
Maps COCO classes to 4 waste categories (wet/dry/recyclable/hazardous).
"""
import io
import base64
from pathlib import Path
from typing import Optional

import numpy as np
from PIL import Image

from app.core.config import settings

# ── Waste category mappings from COCO classes ──────────────────────────────
# COCO has 80 classes; we map the most common ones to waste categories.
# This works well for demo items: bottles, cups, food, bags, etc.

WASTE_CATEGORY_MAP = {
    # Recyclable — plastics, metals, glass
    "bottle":        ("RECYCLABLE", "plastic bottle"),
    "wine glass":    ("RECYCLABLE", "glass"),
    "cup":           ("RECYCLABLE", "cup"),
    "fork":          ("DRY",        "metal cutlery"),
    "knife":         ("DRY",        "metal cutlery"),
    "spoon":         ("DRY",        "metal cutlery"),
    "bowl":          ("RECYCLABLE", "bowl"),
    "can":           ("RECYCLABLE", "metal can"),
    "cell phone":    ("HAZARDOUS",  "electronic device"),
    "laptop":        ("HAZARDOUS",  "electronic device"),
    "keyboard":      ("HAZARDOUS",  "electronic device"),
    "mouse":         ("HAZARDOUS",  "electronic device"),
    "tv":            ("HAZARDOUS",  "electronic device"),
    "remote":        ("HAZARDOUS",  "electronic device"),
    # Wet — food and organic
    "banana":        ("WET",        "banana"),
    "apple":         ("WET",        "fruit"),
    "orange":        ("WET",        "fruit"),
    "broccoli":      ("WET",        "vegetable"),
    "carrot":        ("WET",        "vegetable"),
    "hot dog":       ("WET",        "food"),
    "pizza":         ("WET",        "food"),
    "donut":         ("WET",        "food"),
    "cake":          ("WET",        "food"),
    "sandwich":      ("WET",        "food"),
    "mango":         ("WET",        "fruit"),
    "chappati":      ("WET",        "food"),
    "cucumber":      ("WET",        "vegetable"),
    "potted plant":  ("WET",        "plant material"),
    "coldrink":       ("WET",        "beverage"),
    "water":          ("WET",        "beverage"),
    # Dry — paper, cardboard, cloth
    "book":          ("DRY",        "paper/book"),
    "backpack":      ("DRY",        "fabric item"),
    "handbag":       ("DRY",        "fabric bag"),
    "suitcase":      ("DRY",        "large bag"),
    "umbrella":      ("DRY",        "fabric item"),
    "cloth":         ("DRY",        "fabric item"),
    # Hazardous
    "scissors":      ("HAZARDOUS",  "sharp object"),
}

CATEGORY_COLORS = {
    "WET":        "#4caf7d",
    "DRY":        "#888780",
    "RECYCLABLE": "#185FA5",
    "HAZARDOUS":  "#D85A30",
}

CATEGORY_BINS = {
    "WET":        "green bin (organic/compost)",
    "DRY":        "brown bin (dry waste)",
    "RECYCLABLE": "blue bin (recyclable)",
    "HAZARDOUS":  "red bin (hazardous waste)",
}


class YOLODetectionService:
    def __init__(self):
        self._model = None

    def _load_model(self):
        if self._model is None:
            try:
                from ultralytics import YOLO
                self._model = YOLO(settings.YOLO_MODEL_PATH)
            except Exception as e:
                raise RuntimeError(f"Failed to load YOLOv8 model: {e}")
        return self._model

    def decode_image(self, image_data: str) -> Image.Image:
        """Accept base64 string (with or without data URI prefix)."""
        if "," in image_data:
            image_data = image_data.split(",")[1]
        image_bytes = base64.b64decode(image_data)
        return Image.open(io.BytesIO(image_bytes)).convert("RGB")

    def detect(self, image_data: str) -> dict:
        """
        Run YOLOv8 on image, return best waste detection result.
        Returns dict with: detected_object, category, confidence, bin, color.
        """
        model = self._load_model()
        image = self.decode_image(image_data)
        img_array = np.array(image)

        results = model(img_array, conf=settings.YOLO_CONFIDENCE_THRESHOLD, verbose=False)

        best_detection = None
        best_conf = 0.0

        for result in results:
            for box in result.boxes:
                conf = float(box.conf[0])
                cls_id = int(box.cls[0])
                class_name = model.names[cls_id].lower()

                if class_name in WASTE_CATEGORY_MAP and conf > best_conf:
                    best_conf = conf
                    category, label = WASTE_CATEGORY_MAP[class_name]
                    best_detection = {
                        "detected_object": label,
                        "raw_class":       class_name,
                        "category":        category,
                        "confidence":      round(conf, 3),
                        "bin":             CATEGORY_BINS[category],
                        "color":           CATEGORY_COLORS[category],
                        "bbox": {
                            "x1": float(box.xyxy[0][0]),
                            "y1": float(box.xyxy[0][1]),
                            "x2": float(box.xyxy[0][2]),
                            "y2": float(box.xyxy[0][3]),
                        }
                    }

        if best_detection is None:
            return {
                "detected_object": "unknown item",
                "raw_class":       "unknown",
                "category":        "DRY",
                "confidence":      0.0,
                "bin":             CATEGORY_BINS["DRY"],
                "color":           CATEGORY_COLORS["DRY"],
                "bbox":            None,
            }

        return best_detection


# Singleton
detection_service = YOLODetectionService()
