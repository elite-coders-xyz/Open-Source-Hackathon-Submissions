# import requests

# def get_guidance(object_name):

#     prompt = f"""
# You are a smart AI assistant.

# Object detected: {object_name}

# IMPORTANT RULES:
# - Do NOT repeat same sentence structure
# - Give specific real-world advice
# - Make response different every time
# - Keep it 2 lines max
# - Be natural and human-like
# """

#     response = requests.post(
#         "http://localhost:11434/api/generate",
#         json={
#             "model": "gemma2:2b",
#             "prompt": prompt,
#             "stream": False
#         }
#     )

#     data = response.json()

#     if "response" in data:
#         return data["response"]
#     elif "message" in data:
#         return data["message"]
#     elif "error" in data:
#         return f"Error: {data['error']}"
#     else:
#         return str(data) 





"""
Gemma 2 guidance service via Ollama.
This is the CORE of the Ollama track prize entry.
Generates accessible, emotionally clear disposal guidance for blind users.
"""
import httpx
import asyncio
from app.core.config import settings

# ── Prompt templates ────────────────────────────────────────────────────────

SYSTEM_PROMPT = """You are EcoVision AI, a compassionate waste disposal guide designed specifically for visually impaired users.

Your role: When given a detected waste item, generate clear, warm, and actionable disposal guidance.

Rules:
- Keep response under 40 words — it will be spoken aloud via text-to-speech
- Start with the item name and category
- Tell the user exactly which bin to use
- Add one helpful tip (rinse it, remove cap, flatten it, etc.)
- Use simple, kind language — no jargon
- Never use visual references like "you can see" or "look at"
- Sound like a friendly, knowledgeable neighbour

Respond with ONLY the spoken guidance text. No markdown, no labels, no quotes."""

GUIDANCE_PROMPT_TEMPLATE = """Detected item: {detected_object}
Waste category: {category}
Correct bin: {bin}

Generate spoken disposal guidance for a visually impaired user."""

# Fallback guidance when Ollama is unavailable
FALLBACK_GUIDANCE = {
    "WET":        "This is organic wet waste. Please place it in the green compost bin. It will become valuable compost.",
    "DRY":        "This is dry waste. Please place it in the brown bin. Make sure it is clean and dry before disposal.",
    "RECYCLABLE": "This is recyclable waste. Please rinse it and place it in the blue recycling bin. Remove any caps or lids first.",
    "HAZARDOUS":  "This is hazardous waste. Please handle it carefully and place it in the red hazardous waste bin. Do not mix with other waste.",
}


class GemmaGuidanceService:
    """
    Calls Gemma 2 running locally via Ollama.
    Falls back to pre-written guidance if Ollama is unreachable.
    This makes the system work 100% offline.
    """

    def __init__(self):
        self.ollama_url = f"{settings.OLLAMA_BASE_URL}/api/generate"
        self.model = settings.GEMMA_MODEL

    async def generate_guidance(
        self,
        detected_object: str,
        category: str,
        bin_name: str,
        language: str = "en",
    ) -> dict:
        """
        Generate disposal guidance via Gemma 2.
        Returns: { text, source, model }
        source = "gemma" | "fallback"
        """
        prompt = GUIDANCE_PROMPT_TEMPLATE.format(
            detected_object=detected_object,
            category=category,
            bin=bin_name,
        )

        if language == "hi":
            prompt += "\n\nPlease respond in simple Hindi (Devanagari script)."

        try:
            guidance_text = await self._call_ollama(prompt)
            return {
                "text":   guidance_text,
                "source": "gemma",
                "model":  self.model,
            }
        except Exception as e:
            # Graceful fallback — system still works offline
            fallback = FALLBACK_GUIDANCE.get(category, FALLBACK_GUIDANCE["DRY"])
            return {
                "text":   fallback,
                "source": "fallback",
                "model":  "static",
                "error":  str(e),
            }

    async def _call_ollama(self, prompt: str) -> str:
        """Call Ollama REST API (non-streaming)."""
        payload = {
            "model":  self.model,
            "prompt": prompt,
            "system": SYSTEM_PROMPT,
            "stream": False,
            "options": {
                "temperature": 0.4,   # Consistent, reliable guidance
                "top_p":       0.9,
                "num_predict": 80,    # Short — it's spoken aloud
            },
        }

        async with httpx.AsyncClient(timeout=30.0) as client:
            response = await client.post(self.ollama_url, json=payload)
            response.raise_for_status()
            data = response.json()
            return data.get("response", "").strip()

    async def check_ollama_health(self) -> dict:
        """Check if Ollama is running and Gemma 2 is available."""
        try:
            async with httpx.AsyncClient(timeout=5.0) as client:
                r = await client.get(f"{settings.OLLAMA_BASE_URL}/api/tags")
                r.raise_for_status()
                models = [m["name"] for m in r.json().get("models", [])]
                gemma_available = any(self.model in m for m in models)
                return {
                    "ollama_running":   True,
                    "gemma_available":  gemma_available,
                    "available_models": models,
                }
        except Exception as e:
            return {
                "ollama_running":  False,
                "gemma_available": False,
                "error":           str(e),
            }


# Singleton
gemma_service = GemmaGuidanceService()
