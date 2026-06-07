import { useState, useRef, useCallback, useEffect } from "react";

export function useCamera() {
  const videoRef  = useRef(null);
  const canvasRef = useRef(null);
  const streamRef = useRef(null);

  const [cameraReady, setCameraReady] = useState(false);
  const [cameraError, setCameraError] = useState(null);
  const [facingMode,  setFacingMode]  = useState("environment");

  const startCamera = useCallback(async (mode = "environment") => {
    setCameraError(null);
    streamRef.current?.getTracks().forEach(t => t.stop());

    try {
      const s = await navigator.mediaDevices.getUserMedia({
        video: { width: { ideal: 1280 }, height: { ideal: 720 }, facingMode: { ideal: mode } },
        audio: false,
      });
      streamRef.current = s;
      if (videoRef.current) {
        videoRef.current.srcObject = s;
        await new Promise(r => { videoRef.current.onloadedmetadata = r; });
        await videoRef.current.play();
      }
      setCameraReady(true);
    } catch (err) {
      const msg = err.name === "NotAllowedError"
        ? "Camera permission denied — please allow camera access in browser settings."
        : err.name === "NotFoundError"
        ? "No camera found on this device."
        : `Camera error: ${err.message}`;
      setCameraError(msg);
      setCameraReady(false);
    }
  }, []);

  const stopCamera = useCallback(() => {
    streamRef.current?.getTracks().forEach(t => t.stop());
    streamRef.current = null;
    setCameraReady(false);
  }, []);

  const captureFrame = useCallback((quality = 0.85) => {
    const video = videoRef.current;
    const canvas = canvasRef.current;
    if (!video || !canvas || video.readyState < 2) return null;
    canvas.width  = video.videoWidth  || 640;
    canvas.height = video.videoHeight || 480;
    canvas.getContext("2d").drawImage(video, 0, 0);
    return canvas.toDataURL("image/jpeg", quality);
  }, []);

  const flipCamera = useCallback(() => {
    const next = facingMode === "environment" ? "user" : "environment";
    setFacingMode(next);
    startCamera(next);
  }, [facingMode, startCamera]);

  // Start on mount
  useEffect(() => { startCamera("environment"); }, [startCamera]);
  useEffect(() => () => stopCamera(), [stopCamera]);

  return { videoRef, canvasRef, cameraReady, cameraError, captureFrame, flipCamera, startCamera };
}
