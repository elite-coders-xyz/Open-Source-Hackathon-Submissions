"""
Voice router.
POST /api/v1/voice/synthesize   — text → speech audio
POST /api/v1/voice/transcribe   — audio → text + intent
GET  /api/v1/voice/commands     — list of supported voice commands
"""
import base64
import tempfile
import os

from fastapi import APIRouter, HTTPException

from app.schemas.schemas import (
    SynthesizeRequest, SynthesizeResponse,
    TranscribeRequest, TranscribeResponse,
)
from app.services.tts_service import tts_service

router = APIRouter()

# Supported voice commands — shown in help screen + spoken on "help" command
VOICE_COMMANDS = [
    {"command": "scan",         "description": "Scan the object in front of the camera",    "keys": ["Space", "Enter"]},
    {"command": "what bin",     "description": "Ask which bin the last item belongs to",     "keys": []},
    {"command": "read history", "description": "Hear your last 5 detected items",            "keys": ["H"]},
    {"command": "help",         "description": "List all available voice commands",          "keys": ["F1"]},
    {"command": "high contrast","description": "Toggle high-contrast accessibility mode",    "keys": ["C"]},
    {"command": "faster",       "description": "Increase speech playback speed",             "keys": ["+"]},
    {"command": "slower",       "description": "Decrease speech playback speed",             "keys": ["-"]},
    {"command": "repeat",       "description": "Repeat the last spoken guidance",            "keys": ["R"]},
]


@router.post("/voice/synthesize", response_model=SynthesizeResponse, summary="Convert text to speech audio")
async def synthesize(req: SynthesizeRequest):
    """
    Convert any text to speech.
    Used by frontend for on-demand TTS (e.g. help text, error messages).
    """
    result = await tts_service.synthesize(
        text=req.text,
        language=req.language,
        voice_name=req.voice_name,
    )
    return SynthesizeResponse(
        audio_base64=result.get("audio_base64"),
        format=result.get("format"),
        source=result.get("source", "none"),
    )


@router.post("/voice/transcribe", response_model=TranscribeResponse, summary="Transcribe speech to text + parse intent")
async def transcribe(req: TranscribeRequest):
    """
    Convert audio to text and parse user intent.
    Uses faster-whisper for local STT (fully offline).
    Falls back to simple keyword matching if Whisper unavailable.
    """
    transcript = ""
    try:
        transcript = await _whisper_transcribe(req.audio_base64, req.language)
    except Exception:
        # If Whisper not available, frontend uses Web Speech API natively
        raise HTTPException(
            status_code=503,
            detail="STT service unavailable — use browser Web Speech API",
        )

    intent   = _parse_intent(transcript)
    return TranscribeResponse(
        transcript=transcript,
        intent=intent,
        confidence=0.9 if intent != "unknown" else 0.3,
    )


@router.get("/voice/commands", summary="List all supported voice commands")
async def get_commands():
    return {"commands": VOICE_COMMANDS}


# ── Helpers ──────────────────────────────────────────────────────────────────

async def _whisper_transcribe(audio_b64: str, language: str) -> str:
    """Transcribe audio using faster-whisper (runs locally, no API key needed)."""
    from faster_whisper import WhisperModel
    import asyncio

    audio_bytes = base64.b64decode(audio_b64)
    with tempfile.NamedTemporaryFile(suffix=".webm", delete=False) as f:
        f.write(audio_bytes)
        tmp_path = f.name

    def _run():
        model = WhisperModel("tiny", device="cpu", compute_type="int8")
        segments, _ = model.transcribe(tmp_path, language=language[:2])
        return " ".join(s.text for s in segments).strip()

    loop = asyncio.get_event_loop()
    try:
        result = await loop.run_in_executor(None, _run)
    finally:
        os.unlink(tmp_path)

    return result


def _parse_intent(transcript: str) -> str:
    """Simple keyword-based intent parser."""
    t = transcript.lower()
    if any(w in t for w in ["scan", "detect", "check", "what is", "identify"]):
        return "scan"
    if any(w in t for w in ["bin", "where", "put", "place", "throw"]):
        return "bin_query"
    if any(w in t for w in ["history", "last", "previous", "before"]):
        return "history"
    if any(w in t for w in ["help", "commands", "what can"]):
        return "help"
    if any(w in t for w in ["repeat", "again", "say again"]):
        return "repeat"
    if any(w in t for w in ["faster", "speed up", "quicker"]):
        return "speed_up"
    if any(w in t for w in ["slower", "slow down"]):
        return "speed_down"
    return "unknown"
