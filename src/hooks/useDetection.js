import { useState, useCallback, useRef } from "react";

const API = process.env.REACT_APP_API_URL;

export function useDetection() {
  const [result,       setResult]       = useState(null);
  const [isScanning,   setIsScanning]   = useState(false);
  const [error,        setError]        = useState(null);
  const [history,      setHistory]      = useState([]);
  const [systemStatus, setSystemStatus] = useState(null);
  const abortRef = useRef(null);

  const detect = useCallback(async (imageBase64, language = "en") => {
    if (isScanning || !imageBase64) return null;
    setIsScanning(true);
    setError(null);
    abortRef.current?.abort();
    abortRef.current = new AbortController();

    try {
      const res = await fetch(`${API}/api/v1/detect`, {
        method:  "POST",
        headers: { "Content-Type": "application/json" },
        "ngrok-skip-browser-warning": "true",
        signal:  abortRef.current.signal,
        body:    JSON.stringify({ image_base64: imageBase64, language, tts: true }),
      });
      if (!res.ok) {
        const body = await res.json().catch(() => ({}));
        throw new Error(body.detail || `Server error: ${res.status}`);
      }
      const data = await res.json();
      const stamped = { ...data, scannedAt: new Date() };
      setResult(stamped);
      setHistory(h => [stamped, ...h].slice(0, 20));
      return stamped;
    } catch (err) {
      if (err.name === "AbortError") return null;
      setError(navigator.onLine
        ? `Detection failed: ${err.message}`
        : "You are offline. Gemma is still running locally — results will sync when reconnected.");
      return null;
    } finally {
      setIsScanning(false);
    }
  }, [isScanning]);

  const checkHealth = useCallback(async () => {
    try {
      const res = await fetch(`${API}/api/v1/health`, { signal: AbortSignal.timeout(5000), headers: { "ngrok-skip-browser-warning": "true" }, });
      if (res.ok) { const s = await res.json(); setSystemStatus(s); return s; }
    } catch {
      setSystemStatus({ status: "unreachable", yolo_loaded: false, gemma_available: false, ollama_running: false, offline_capable: true });
    }
    return null;
  }, []);

  return {
    detect, result, isScanning, error, history, systemStatus,
    checkHealth,
    clearError:   () => setError(null),
    clearHistory: () => setHistory([]),
    clearResult:  () => setResult(null),
  };
}
