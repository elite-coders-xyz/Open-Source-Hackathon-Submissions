from pydantic import BaseModel, Field
from typing import Optional, List
from enum import Enum


class WasteCategory(str, Enum):
    WET        = "WET"
    DRY        = "DRY"
    RECYCLABLE = "RECYCLABLE"
    HAZARDOUS  = "HAZARDOUS"


class BoundingBox(BaseModel):
    x1: float
    y1: float
    x2: float
    y2: float


# ── Detection ────────────────────────────────────────────────────────────────

class DetectRequest(BaseModel):
    image_base64: str = Field(..., description="Base64-encoded image (JPEG/PNG), with or without data URI prefix")
    language: str     = Field("en", description="Response language: 'en' or 'hi'")
    tts: bool         = Field(True, description="Whether to include TTS audio in response")

class GuidanceResult(BaseModel):
    text:   str
    source: str   # "gemma" | "fallback"
    model:  str

class TTSResult(BaseModel):
    audio_base64: Optional[str]
    format:       Optional[str]   # "mp3" | "wav"
    source:       str             # "azure" | "local_pyttsx3" | "none"

class DetectResponse(BaseModel):
    # Detection
    detected_object: str
    category:        WasteCategory
    confidence:      float
    bin:             str
    color:           str
    bbox:            Optional[BoundingBox]
    # Guidance
    guidance:        GuidanceResult
    # Audio
    tts:             Optional[TTSResult]
    # Meta
    offline_mode:    bool = False


# ── Voice / STT ──────────────────────────────────────────────────────────────

class TranscribeRequest(BaseModel):
    audio_base64: str = Field(..., description="Base64-encoded WAV/WebM audio")
    language:     str = Field("en-IN")

class TranscribeResponse(BaseModel):
    transcript: str
    intent:     str   # "scan" | "help" | "history" | "unknown"
    confidence: float

class SynthesizeRequest(BaseModel):
    text:       str
    language:   str            = Field("en")
    voice_name: Optional[str]  = None

class SynthesizeResponse(BaseModel):
    audio_base64: Optional[str]
    format:       Optional[str]
    source:       str


# ── Health ───────────────────────────────────────────────────────────────────

class HealthResponse(BaseModel):
    status:          str
    yolo_loaded:     bool
    ollama_running:  bool
    gemma_available: bool
    tts_available:   str
    offline_capable: bool
