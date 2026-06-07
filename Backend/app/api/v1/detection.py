# from ultralytics import YOLO

# model = YOLO("yolov8n.pt")

# def detect_image(image_path):
#     results = model(image_path)

#     best = None

#     for r in results:
#         for box in r.boxes:
#             cls_id = int(box.cls[0])
#             conf = float(box.conf[0])
#             label = r.names[cls_id]

#             if best is None or conf > best["confidence"]:
#                 best = {
#                     "object": label,
#                     "confidence": conf
#                 }

#     if best:
#         return best

#     return {"object": "unknown", "confidence": 0.0}




"""
Detection router — the heart of EcoVision AI.
POST /api/v1/detect  →  YOLOv8 + Gemma24 + TTS in one call.
WS   /api/v1/detect/stream  →  real-time webcam streaming.
"""
import asyncio
import base64
import json
from typing import Optional

from fastapi import APIRouter, HTTPException, WebSocket, WebSocketDisconnect
from fastapi.responses import JSONResponse

from app.schemas.schemas import DetectRequest, DetectResponse, GuidanceResult, TTSResult, BoundingBox
from app.services.yolo_service import detection_service
from app.services.gemma_service import gemma_service
from app.services.tts_service import tts_service

router = APIRouter()


@router.post("/detect", response_model=DetectResponse, summary="Detect waste + get Gemma guidance + TTS")
async def detect_waste(req: DetectRequest):
    """
    Full pipeline in one endpoint:
    1. Decode base64 image
    2. YOLOv8 object detection
    3. Gemma 2 (Ollama) generates spoken guidance
    4. TTS converts guidance to audio
    Returns everything the frontend needs to guide a blind user.
    """
    # ── Step 1: YOLOv8 Detection ──────────────────────────────────────────
    try:
        detection = detection_service.detect(req.image_base64)
    except Exception as e:
        raise HTTPException(status_code=422, detail=f"Detection failed: {str(e)}")

    # ── Step 2: Gemma 2 Guidance (parallel with TTS prep) ────────────────
    guidance_task = gemma_service.generate_guidance(
        detected_object=detection["detected_object"],
        category=detection["category"],
        bin_name=detection["bin"],
        language=req.language,
    )

    guidance_data = await guidance_task

    # ── Step 3: TTS Audio ─────────────────────────────────────────────────
    tts_data = None
    if req.tts:
        tts_raw = await tts_service.synthesize(
            text=guidance_data["text"],
            language=req.language,
        )
        tts_data = TTSResult(
            audio_base64=tts_raw.get("audio_base64"),
            format=tts_raw.get("format"),
            source=tts_raw.get("source", "none"),
        )

    # ── Step 4: Build Response ────────────────────────────────────────────
    bbox = None
    if detection.get("bbox"):
        bbox = BoundingBox(**detection["bbox"])

    return DetectResponse(
        detected_object=detection["detected_object"],
        category=detection["category"],
        confidence=detection["confidence"],
        bin=detection["bin"],
        color=detection["color"],
        bbox=bbox,
        guidance=GuidanceResult(
            text=guidance_data["text"],
            source=guidance_data["source"],
            model=guidance_data["model"],
        ),
        tts=tts_data,
        offline_mode=(guidance_data["source"] == "fallback"),
    )


@router.websocket("/detect/stream")
async def detect_stream(websocket: WebSocket):
    """
    WebSocket endpoint for real-time webcam streaming.
    Client sends: { "image": "<base64>", "language": "en" }
    Server sends: DetectResponse JSON every frame.
    
    Frontend sends frames at ~2fps — server processes and pushes results.
    """
    await websocket.accept()
    await websocket.send_json({"type": "connected", "message": "EcoVision stream ready"})

    try:
        while True:
            raw = await websocket.receive_text()
            data = json.loads(raw)

            if data.get("type") == "ping":
                await websocket.send_json({"type": "pong"})
                continue

            image_b64  = data.get("image", "")
            language   = data.get("language", "en")
            include_tts = data.get("tts", True)

            if not image_b64:
                continue

            # Run detection pipeline
            try:
                detection = detection_service.detect(image_b64)
                guidance  = await gemma_service.generate_guidance(
                    detected_object=detection["detected_object"],
                    category=detection["category"],
                    bin_name=detection["bin"],
                    language=language,
                )

                tts_data = None
                if include_tts and guidance.get("text"):
                    tts_raw  = await tts_service.synthesize(guidance["text"], language)
                    tts_data = {
                        "audio_base64": tts_raw.get("audio_base64"),
                        "format":       tts_raw.get("format"),
                        "source":       tts_raw.get("source"),
                    }

                await websocket.send_json({
                    "type":             "detection",
                    "detected_object":  detection["detected_object"],
                    "category":         detection["category"],
                    "confidence":       detection["confidence"],
                    "bin":              detection["bin"],
                    "color":            detection["color"],
                    "bbox":             detection.get("bbox"),
                    "guidance_text":    guidance["text"],
                    "guidance_source":  guidance["source"],
                    "tts":              tts_data,
                    "offline_mode":     (guidance["source"] == "fallback"),
                })

            except Exception as e:
                await websocket.send_json({"type": "error", "message": str(e)})

    except WebSocketDisconnect:
        pass
    except Exception as e:
        try:
            await websocket.send_json({"type": "error", "message": str(e)})
        except Exception:
            pass
