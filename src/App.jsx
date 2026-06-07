import { useState, useEffect, useRef, useCallback } from "react";
import { useCamera }     from "./hooks/useCamera";
import { useVoice }      from "./hooks/useVoice";
import { useDetection }  from "./hooks/useDetection";
import { CameraView }    from "./components/CameraView";
import { ScanButton }    from "./components/ScanButton";
import { ResultCard }    from "./components/ResultCard";
import { StatusBar }     from "./components/StatusBar";
import { HistoryPanel }  from "./components/HistoryPanel";
import { AccessibilityControls } from "./components/AccessibilityControls";

// ── ARIA live region announcer (screen readers) ───────────────────────────────
function LiveRegion({ message }) {
  return (
    <div
      role="status"
      aria-live="assertive"
      aria-atomic="true"
      style={{ position: "absolute", left: -9999, width: 1, height: 1, overflow: "hidden" }}
    >
      {message}
    </div>
  );
}

export default function App() {
  // const liveRef   = useRef(null);
  const mainRef   = useRef(null);

  // ── A11y state ────────────────────────────────────────────────────────────
  const [highContrast, setHighContrast] = useState(false);
  const [largeText,    setLargeText]    = useState(false);
  const [liveMsg,      setLiveMsg]      = useState("");
  const [isOnline,     setIsOnline]     = useState(navigator.onLine);

  // ── Announce to screen reader ─────────────────────────────────────────────
  const announce = useCallback((msg) => {
    setLiveMsg("");
    setTimeout(() => setLiveMsg(msg), 60); // force re-read
  }, []);

  // ── Detection hook ────────────────────────────────────────────────────────
  const {
    detect, result, isScanning, error,
    history, systemStatus, checkHealth,
    clearError, clearHistory, clearResult,
  } = useDetection();

  // ── Camera hook ───────────────────────────────────────────────────────────
  const { videoRef, canvasRef, cameraReady, cameraError, captureFrame, flipCamera, startCamera } = useCamera();

  // ── Voice hook (depends on scan/history/help callbacks) ──────────────────
  const handleRepeat  = useCallback(() => {
    if (!result) { announce("No previous result to repeat."); return; }
    announce(result.guidance?.text || "");
    voice.speakBrowser(result.guidance?.text);
  }, [result]); // eslint-disable-line

  const handleHistory = useCallback(() => {
    if (!history.length) { announce("No scan history yet."); return; }
    const msg = history.slice(0, 5)
      .map((h, i) => `${i + 1}: ${h.detected_object}, ${h.category.toLowerCase()} waste`)
      .join(". ");
    announce(msg);
    voice.speakBrowser(msg); // eslint-disable-line
  }, [history]); // eslint-disable-line

  const handleHelp = useCallback(() => {
    const msg = "EcoVision AI commands: Space to scan. R to repeat. H to hear history. C for high contrast. V for voice command. Plus and minus to change speech speed. F1 for this help.";
    announce(msg);
    voice.speakBrowser(msg); // eslint-disable-line
  }, []); // eslint-disable-line

  const voice = useVoice({
    onScanCommand:    () => handleScan(),
    onRepeatCommand:  handleRepeat,
    onHistoryCommand: handleHistory,
    onHelpCommand:    handleHelp,
  });

  // ── Main scan action ──────────────────────────────────────────────────────
  const handleScan = useCallback(async () => {
    if (isScanning) return;
    if (!cameraReady) {
      announce("Camera not ready. Please allow camera access.");
      voice.speakBrowser("Camera not ready. Please allow camera access.");
      return;
    }

    announce("Scanning. Please hold the item steady.");
    voice.stopSpeaking();

    const frame = captureFrame();
    if (!frame) { announce("Could not capture frame. Try again."); return; }

    const data = await detect(frame);

    if (data) {
      const msg = `Detected: ${data.detected_object}. ${data.guidance?.text}`;
      announce(msg);
      voice.speak(data.guidance?.text, data.tts?.audio_base64, data.tts?.format);
    }
  }, [isScanning, cameraReady, captureFrame, detect, voice, announce]);

  // ── Apply body classes for a11y modes ────────────────────────────────────
  useEffect(() => {
    document.body.classList.toggle("high-contrast", highContrast);
    document.body.classList.toggle("large-text",    largeText);
  }, [highContrast, largeText]);

  // ── Online/offline ────────────────────────────────────────────────────────
  useEffect(() => {
    const on  = () => { setIsOnline(true);  announce("Connection restored."); };
    const off = () => { setIsOnline(false); announce("You are offline. Gemma continues running locally."); };
    window.addEventListener("online",  on);
    window.addEventListener("offline", off);
    return () => { window.removeEventListener("online", on); window.removeEventListener("offline", off); };
  }, [announce]);

  // ── Health check on mount ─────────────────────────────────────────────────
  useEffect(() => {
    checkHealth();
    const interval = setInterval(checkHealth, 30_000);
    return () => clearInterval(interval);
  }, [checkHealth]);

  // ── Welcome announcement ──────────────────────────────────────────────────
  useEffect(() => {
    const msg = "EcoVision AI ready. Press Space or tap Scan to detect waste. Press F1 for help.";
    setTimeout(() => announce(msg), 800);
  }, []); // eslint-disable-line

  // ── Error announcement ────────────────────────────────────────────────────
  useEffect(() => {
    if (error) announce(error);
  }, [error, announce]);

  return (
    <div style={{ minHeight: "100vh", background: "var(--bg-void)" }}>
      {/* ── Screen reader live region ─────────────────────────────────────── */}
      <LiveRegion message={liveMsg} />

      {/* ── Skip link ────────────────────────────────────────────────────── */}
      <a href="#main-content" className="skip-link">Skip to main content</a>

      {/* ── Header ───────────────────────────────────────────────────────── */}
      <Header
        isOnline={isOnline}
        highContrast={highContrast}
        onFlipCamera={flipCamera}
      />

      {/* ── Two-column layout ─────────────────────────────────────────────── */}
      <div style={{
        maxWidth:           1100,
        margin:             "0 auto",
        padding:            "1.5rem 1rem",
        display:            "grid",
        gridTemplateColumns:"minmax(0,1fr) minmax(0,380px)",
        gap:                "1.25rem",
        alignItems:         "start",
      }}>

        {/* ── LEFT: Camera + scan ─────────────────────────────────────────── */}
        <main id="main-content" ref={mainRef} style={{ display: "flex", flexDirection: "column", gap: "1rem" }}>

          {/* Status badges */}
          <StatusBar status={systemStatus} isOnline={isOnline} />

          {/* Camera */}
          <CameraView
            videoRef={videoRef}
            canvasRef={canvasRef}
            cameraReady={cameraReady}
            cameraError={cameraError}
            isScanning={isScanning}
            result={result}
            onRetry={() => startCamera("environment")}
          />

          {/* Scan button */}
          <ScanButton
            onClick={handleScan}
            isScanning={isScanning}
            disabled={!!cameraError}
          />

          {/* Error alert */}
          {error && (
            <div
              role="alert"
              aria-live="assertive"
              className="animate-fade-up"
              style={{
                background:   "rgba(220,38,38,0.08)",
                border:       "1.5px solid rgba(220,38,38,0.4)",
                borderRadius: 12,
                padding:      "12px 16px",
                display:      "flex",
                alignItems:   "flex-start",
                gap:          10,
              }}
            >
              <span aria-hidden="true" style={{ fontSize: 18, flexShrink: 0 }}>⚠️</span>
              <div style={{ flex: 1 }}>
                <p style={{ color: "#fca5a5", fontSize: 14, margin: 0, fontFamily: "var(--font-body)" }}>
                  {error}
                </p>
              </div>
              <button
                onClick={clearError}
                aria-label="Dismiss error"
                style={{ background: "none", border: "none", color: "#ef4444", cursor: "pointer", fontSize: 18, lineHeight: 1, padding: 0 }}
              >
                ×
              </button>
            </div>
          )}

          {/* Detection result */}
          {result && (
            <ResultCard
              result={result}
              onRepeat={() => {
                announce(result.guidance?.text);
                voice.speak(result.guidance?.text, result.tts?.audio_base64, result.tts?.format);
              }}
              onDismiss={clearResult}
            />
          )}
        </main>

        {/* ── RIGHT: Controls + history ────────────────────────────────────── */}
        <aside aria-label="Controls and scan history" style={{ display: "flex", flexDirection: "column", gap: "1rem" }}>

          {/* Accessibility controls */}
          <AccessibilityControls
            speechRate={voice.speechRate}
            onRateChange={voice.changeSpeechRate}
            highContrast={highContrast}
            onToggleContrast={() => setHighContrast(h => {
              const next = !h;
              announce(next ? "High contrast mode enabled." : "High contrast mode disabled.");
              return next;
            })}
            largeText={largeText}
            onToggleLargeText={() => setLargeText(t => !t)}
            isListening={voice.isListening}
            onStartListening={voice.startListening}
            voiceSupported={voice.voiceSupported}
          />

          {/* Gemma branding card */}
          <GemmaCard status={systemStatus} />

          {/* History */}
          <HistoryPanel history={history} onClear={clearHistory} />
        </aside>
      </div>

      {/* ── Responsive: stack on mobile ───────────────────────────────────── */}
      <style>{`
        @media (max-width: 720px) {
          div[style*="grid-template-columns"] {
            grid-template-columns: 1fr !important;
          }
        }
      `}</style>
    </div>
  );
}

// ── Header ────────────────────────────────────────────────────────────────────
function Header({ isOnline, onFlipCamera }) {
  return (
    <header
      role="banner"
      style={{
        background:     "var(--bg-surface)",
        borderBottom:   "1px solid var(--bg-raised)",
        padding:        "0 1.5rem",
        height:         64,
        display:        "flex",
        alignItems:     "center",
        justifyContent: "space-between",
        position:       "sticky",
        top:            0,
        zIndex:         100,
        backdropFilter: "blur(12px)",
      }}
    >
      {/* Logo + name */}
      <div style={{ display: "flex", alignItems: "center", gap: 12 }}>
        <div
          aria-hidden="true"
          style={{
            width: 36, height: 36, borderRadius: 10,
            background:  "linear-gradient(135deg, #052e16, #065f46)",
            border:      "1px solid rgba(74,222,128,0.3)",
            display:     "flex", alignItems: "center", justifyContent: "center",
            fontSize:    18,
            boxShadow:   "0 0 12px rgba(74,222,128,0.15)",
          }}
        >
          🌿
        </div>
        <div>
          <h1 style={{
            fontFamily:    "var(--font-display)",
            fontWeight:    800,
            fontSize:      17,
            color:         "var(--text-primary)",
            letterSpacing: "-0.03em",
            margin:        0,
            lineHeight:    1,
          }}>
            EcoVision AI
          </h1>
          <p style={{
            fontFamily: "var(--font-mono)",
            fontSize:   10,
            color:      "var(--text-muted)",
            margin:     0,
            marginTop:  2,
          }}>
            Waste Segregation · Gemma · Ollama
          </p>
        </div>
      </div>

      {/* Right actions */}
      <div style={{ display: "flex", alignItems: "center", gap: 8 }}>
        {/* Online/offline pill */}
        <span
          role="status"
          aria-label={isOnline ? "Online" : "Offline — AI running locally"}
          style={{
            fontFamily:  "var(--font-mono)",
            fontSize:    11,
            fontWeight:  700,
            padding:     "3px 10px",
            borderRadius: 99,
            background:  isOnline ? "rgba(74,222,128,0.08)" : "rgba(245,158,11,0.08)",
            border:      isOnline ? "1px solid rgba(74,222,128,0.25)" : "1px solid rgba(245,158,11,0.3)",
            color:       isOnline ? "#4ade80" : "#f59e0b",
          }}
        >
          {isOnline ? "● ONLINE" : "▲ OFFLINE"}
        </span>

        {/* Flip camera */}
        <button
          onClick={onFlipCamera}
          aria-label="Flip camera — switch between front and rear"
          style={{
            background:  "var(--bg-raised)",
            border:      "1px solid rgba(255,255,255,0.06)",
            borderRadius: 8,
            color:       "var(--text-secondary)",
            cursor:      "pointer",
            padding:     "6px 10px",
            fontSize:    16,
            lineHeight:  1,
          }}
          title="Flip camera"
        >
          🔄
        </button>
      </div>
    </header>
  );
}

// ── Gemma branding card ───────────────────────────────────────────────────────
function GemmaCard({ status }) {
  return (
    <div
      style={{
        background:   "var(--bg-surface)",
        border:       "1px solid var(--bg-raised)",
        borderRadius: 14,
        padding:      "14px 16px",
        position:     "relative",
        overflow:     "hidden",
      }}
    >
      {/* Background glow */}
      <div
        aria-hidden="true"
        style={{
          position:  "absolute", top: -30, right: -30,
          width:     100, height: 100, borderRadius: "50%",
          background:"#4ade80", opacity: 0.04,
          pointerEvents: "none",
        }}
      />

      <div style={{ display: "flex", alignItems: "center", gap: 10, marginBottom: 10 }}>
        <span aria-hidden="true" style={{ fontSize: 22 }}>✦</span>
        <div>
          <div style={{
            fontFamily:    "var(--font-display)",
            fontWeight:    700,
            fontSize:      13,
            color:         "var(--text-primary)",
            letterSpacing: "-0.02em",
          }}>
            Gemma · Local AI
          </div>
          <div style={{ fontFamily: "var(--font-mono)", fontSize: 10, color: "var(--text-muted)", marginTop: 1 }}>
            via Ollama · offline capable
          </div>
        </div>
        <div style={{ marginLeft: "auto" }}>
          <span style={{
            fontFamily:  "var(--font-mono)",
            fontSize:    10,
            fontWeight:  700,
            padding:     "2px 7px",
            borderRadius: 4,
            background:  status?.gemma_available ? "rgba(74,222,128,0.1)" : "rgba(107,114,128,0.1)",
            color:       status?.gemma_available ? "#4ade80" : "var(--text-muted)",
            border:      status?.gemma_available ? "1px solid rgba(74,222,128,0.25)" : "1px solid var(--bg-raised)",
          }}>
            {status?.gemma_available ? "READY" : "LOADING"}
          </span>
        </div>
      </div>

      <p style={{
        fontFamily: "var(--font-body)",
        fontStyle:  "italic",
        fontSize:   13,
        color:      "var(--text-secondary)",
        lineHeight: 1.55,
        margin:     0,
      }}>
        Generates spoken waste disposal guidance entirely on your device — no internet, no cloud, no data sent anywhere.
      </p>
    </div>
  );
}
