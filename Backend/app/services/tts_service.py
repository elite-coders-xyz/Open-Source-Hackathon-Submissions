"""
Text-to-Speech service.
Primary:  Azure Cognitive Services TTS (natural voices, Hindi/English)
Fallback: pyttsx3 local TTS — works 100% offline, no API key needed
For demo: if no Azure key set, falls back to pyttsx3 automatically.
"""
import io
import os
import asyncio
from typing import Optional

from app.core.config import settings


class TTSService:
    """
    Generates spoken audio from guidance text.
    Returns audio bytes (MP3 or WAV) that the frontend plays.
    """

    async def synthesize(
        self,
        text: str,
        language: str = "en",
        voice_name: Optional[str] = None,
    ) -> dict:
        """
        Convert text to speech audio.
        Returns: { audio_base64, format, source }
        """
        # Try Azure first if key is configured
        if settings.AZURE_TTS_KEY and settings.AZURE_TTS_REGION:
            try:
                result = await self._azure_tts(text, language, voice_name)
                return result
            except Exception:
                pass  # Fall through to local TTS

        # Local pyttsx3 fallback (fully offline)
        try:
            result = await self._local_tts(text)
            return result
        except Exception as e:
            return {
                "audio_base64": None,
                "format":       None,
                "source":       "none",
                "error":        str(e),
                "text":         text,  # Frontend uses Web Speech API as last resort
            }

    async def _azure_tts(
        self,
        text: str,
        language: str,
        voice_name: Optional[str],
    ) -> dict:
        import azure.cognitiveservices.speech as speechsdk
        import base64

        voice_map = {
            "en": voice_name or "en-IN-NeerjaNeural",
            "hi": voice_name or "hi-IN-SwaraNeural",
        }
        voice = voice_map.get(language, "en-IN-NeerjaNeural")

        speech_config = speechsdk.SpeechConfig(
            subscription=settings.AZURE_TTS_KEY,
            region=settings.AZURE_TTS_REGION,
        )
        speech_config.speech_synthesis_voice_name = voice
        speech_config.set_speech_synthesis_output_format(
            speechsdk.SpeechSynthesisOutputFormat.Audio16Khz32KBitRateMonoMp3
        )

        synthesizer = speechsdk.SpeechSynthesizer(
            speech_config=speech_config, audio_config=None
        )
        result = synthesizer.speak_text_async(text).get()

        if result.reason.name == "SynthesizingAudioCompleted":
            audio_b64 = base64.b64encode(result.audio_data).decode("utf-8")
            return {"audio_base64": audio_b64, "format": "mp3", "source": "azure"}

        raise RuntimeError(f"Azure TTS failed: {result.reason}")

    async def _local_tts(self, text: str) -> dict:
        """pyttsx3 offline TTS — returns WAV bytes."""
        import pyttsx3
        import tempfile
        import base64

        def _synth():
            engine = pyttsx3.init()
            engine.setProperty("rate", 150)
            engine.setProperty("volume", 1.0)
            with tempfile.NamedTemporaryFile(suffix=".wav", delete=False) as f:
                tmp_path = f.name
            engine.save_to_file(text, tmp_path)
            engine.runAndWait()
            engine.stop()
            with open(tmp_path, "rb") as f:
                audio_bytes = f.read()
            os.unlink(tmp_path)
            return audio_bytes

        loop = asyncio.get_event_loop()
        audio_bytes = await loop.run_in_executor(None, _synth)
        audio_b64 = __import__("base64").b64encode(audio_bytes).decode("utf-8")
        return {"audio_base64": audio_b64, "format": "wav", "source": "local_pyttsx3"}


# Singleton
tts_service = TTSService()
