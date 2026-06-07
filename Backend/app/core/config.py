from pydantic_settings import BaseSettings
from typing import Optional

class Settings(BaseSettings):
    # Ollama / Gemma 2
    OLLAMA_BASE_URL: str = "http://localhost:11434"
    GEMMA_MODEL: str     = "ecovision"

    # YOLOv8
    YOLO_MODEL_PATH: str = "app/ml/yolov8n.pt"
    YOLO_CONFIDENCE_THRESHOLD: float = 0.35

    # Azure TTS (optional — pyttsx3 used as offline fallback if blank)
    AZURE_TTS_KEY:    Optional[str] = None
    AZURE_TTS_REGION: Optional[str] = None

    #Frontend
    REACT_APP_API_URL: str = "https://api.aivisionpro.xyz"
    REACT_APP_WS_URL: str = "wss://api.aivisionpro.xyz"

    # App
    APP_ENV: str          = "development"
    MAX_IMAGE_SIZE_MB: int = 10

    class Config:
        env_file = ".env"

settings = Settings()
