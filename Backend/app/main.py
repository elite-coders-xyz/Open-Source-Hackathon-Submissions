# from fastapi import FastAPI, UploadFile, File
# from fastapi.middleware.cors import CORSMiddleware
# from Backend.app.api.v1.detection import detect_image
# from Backend.app.services.gemma_service import get_guidance
# import uvicorn

# app = FastAPI()

# app.add_middleware(
#     CORSMiddleware,
#     allow_origins=["*"],
#     allow_credentials=True,
#     allow_methods=["*"],
#     allow_headers=["*"],
# )

# @app.get("/")
# def home():
#     return {"message": "Backend working"}

# @app.post("/detect")
# async def detect(file: UploadFile = File(...)):

#     contents = await file.read()

#     with open("temp.jpg", "wb") as f:
#         f.write(contents)

#     # YOLO
#     result = detect_image("temp.jpg")
#     object_name = result["object"]

#     # Gemma (SAFE)
#     try:
#         guidance = get_guidance(object_name)
#     except Exception as e:
#         guidance = f"AI error: {str(e)}"

#     return {
#         "object": object_name,
#         "confidence": result["confidence"],
#         "guidance": guidance
#     }

# if __name__ == "__main__":
#     uvicorn.run(app, host="127.0.0.1", port=8000)


from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
from app.api.v1 import detection, voice, health

app = FastAPI(
    title="EcoVision AI",
    description="Accessibility-first waste segregation powered by Gemma 2 via Ollama",
    version="1.0.0",
)

app.add_middleware(
    CORSMiddleware,
    allow_origins=[
        "http://localhost:3000",
        "https://ecovision-ai-eight.vercel.app"
    ],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

app.include_router(detection.router, prefix="/api/v1", tags=["detection"])
app.include_router(voice.router,     prefix="/api/v1", tags=["voice"])
app.include_router(health.router,    prefix="/api/v1", tags=["health"])

@app.get("/")
async def root():
    return {"message": "EcoVision AI — Accessibility-first waste detection", "status": "running"}
