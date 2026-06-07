import React from "react";

// Category border colors for the scan frame
const CAT_GLOW = {
  WET:        "#22c55e",
  DRY:        "#f59e0b",
  RECYCLABLE: "#3b82f6",
  HAZARDOUS:  "#ef4444",
  default:    "#4ade80",
};

export function CameraView({ videoRef, canvasRef, cameraReady, cameraError, isScanning, result, onRetry }) {
  const frameColor = result ? CAT_GLOW[result.category] : CAT_GLOW.default;

  return (
    <div
      role="region"
      aria-label="Live camera feed for waste detection"
      style={{
        position:     "relative",
        borderRadius: 16,
        overflow:     "hidden",
        background:   "#000",
        aspectRatio:  "4/3",
        border:       `2px solid ${cameraReady ? frameColor : "#1a2d1e"}`,
        boxShadow:    cameraReady && result
          ? `0 0 32px ${frameColor}55, 0 0 8px ${frameColor}33`
          : "0 0 0 1px rgba(74,222,128,0.08)",
        transition:   "border-color 0.4s ease, box-shadow 0.4s ease",
      }}
    >
      {/* Live video */}
      <video
        ref={videoRef}
        autoPlay
        playsInline
        muted
        aria-hidden="true"
        style={{ width: "100%", height: "100%", objectFit: "cover", display: "block" }}
      />

      {/* Hidden canvas for frame capture */}
      <canvas ref={canvasRef} style={{ display: "none" }} aria-hidden="true" />

      {/* Camera error state */}
      {cameraError && (
        <div
          role="alert"
          style={{
            position:    "absolute", inset: 0,
            display:     "flex", flexDirection: "column", alignItems: "center", justifyContent: "center",
            background:  "#0d1a10",
            padding:     "2rem",
            textAlign:   "center",
            gap:         "1rem",
          }}
        >
          <span style={{ fontSize: 48 }} aria-hidden="true">📷</span>
          <p style={{ color: "#fca5a5", fontFamily: "var(--font-display)", fontSize: 15, fontWeight: 700 }}>
            {cameraError}
          </p>
          {onRetry && (
            <button onClick={onRetry} style={retryBtnStyle}>
              Try Again
            </button>
          )}
        </div>
      )}

      {/* Camera loading state */}
      {!cameraReady && !cameraError && (
        <div
          aria-label="Camera loading"
          style={{
            position:   "absolute", inset: 0,
            display:    "flex", alignItems: "center", justifyContent: "center",
            background: "#080f0a",
          }}
        >
          <div style={{ textAlign: "center" }}>
            <div style={spinnerStyle} aria-hidden="true" />
            <p style={{ color: "#4ade80", fontFamily: "var(--font-mono)", fontSize: 12, marginTop: 12 }}>
              initialising camera…
            </p>
          </div>
        </div>
      )}

      {/* Scan sweep animation */}
      {isScanning && (
        <div aria-hidden="true" style={{ position: "absolute", inset: 0, pointerEvents: "none" }}>
          {/* Sweep line */}
          <div style={{
            position:   "absolute", left: 0, right: 0, height: 2,
            background: "linear-gradient(90deg, transparent, #4ade80, transparent)",
            animation:  "scan-sweep 1.2s ease-in-out infinite",
            opacity:    0.9,
          }} />
          {/* Dim overlay */}
          <div style={{
            position:   "absolute", inset: 0,
            background: "rgba(8,15,10,0.35)",
          }} />
          {/* Corner brackets */}
          <ScanBrackets color="#4ade80" />
        </div>
      )}

      {/* Bounding box overlay */}
      {result?.bbox && cameraReady && (
        <BBoxOverlay bbox={result.bbox} color={frameColor} />
      )}

      {/* Category flash badge (top-left) */}
      {result && !isScanning && (
        <div
          aria-hidden="true"
          style={{
            position:     "absolute", top: 12, left: 12,
            background:   "rgba(8,15,10,0.85)",
            border:       `1px solid ${frameColor}`,
            borderRadius: 8,
            padding:      "4px 10px",
            fontFamily:   "var(--font-mono)",
            fontSize:     11,
            fontWeight:   700,
            color:        frameColor,
            backdropFilter: "blur(8px)",
            animation:    "fade-up 0.3s ease both",
          }}
        >
          {result.detected_object?.toUpperCase()}
        </div>
      )}

      {/* Confidence badge (top-right) */}
      {result && !isScanning && (
        <div
          aria-hidden="true"
          style={{
            position:     "absolute", top: 12, right: 12,
            background:   "rgba(8,15,10,0.85)",
            border:       `1px solid ${frameColor}44`,
            borderRadius: 8,
            padding:      "4px 10px",
            fontFamily:   "var(--font-mono)",
            fontSize:     11,
            fontWeight:   700,
            color:        "#8aab8e",
            backdropFilter: "blur(8px)",
          }}
        >
          {Math.round(result.confidence * 100)}%
        </div>
      )}

      {/* Offline badge */}
      {result?.offline_mode && (
        <div
          aria-hidden="true"
          style={{
            position:     "absolute", bottom: 12, right: 12,
            background:   "rgba(234,179,8,0.15)",
            border:       "1px solid rgba(234,179,8,0.5)",
            borderRadius: 6,
            padding:      "3px 8px",
            fontFamily:   "var(--font-mono)",
            fontSize:     10,
            color:        "#fcd34d",
            backdropFilter: "blur(8px)",
          }}
        >
          📡 LOCAL AI
        </div>
      )}
    </div>
  );
}

// ── Sub-components ────────────────────────────────────────────────────────────

function ScanBrackets({ color }) {
  const corner = { position: "absolute", width: 24, height: 24, borderColor: color, borderStyle: "solid", opacity: 0.9 };
  return (
    <>
      <div style={{ ...corner, top: 16, left: 16,  borderWidth: "2px 0 0 2px" }} />
      <div style={{ ...corner, top: 16, right: 16, borderWidth: "2px 2px 0 0" }} />
      <div style={{ ...corner, bottom: 16, left: 16,  borderWidth: "0 0 2px 2px" }} />
      <div style={{ ...corner, bottom: 16, right: 16, borderWidth: "0 2px 2px 0" }} />
    </>
  );
}

function BBoxOverlay({ bbox, color }) {
  const { x1, y1, x2, y2 } = bbox;
  return (
    <svg
      style={{ position: "absolute", inset: 0, width: "100%", height: "100%", pointerEvents: "none" }}
      aria-hidden="true"
      viewBox={`0 0 640 480`}
      preserveAspectRatio="xMidYMid meet"
    >
      <defs>
        <filter id="glow">
          <feGaussianBlur stdDeviation="3" result="blur" />
          <feMerge><feMergeNode in="blur"/><feMergeNode in="SourceGraphic"/></feMerge>
        </filter>
      </defs>
      <rect
        x={x1} y={y1} width={x2 - x1} height={y2 - y1}
        fill={`${color}18`}
        stroke={color}
        strokeWidth={2.5}
        strokeDasharray="8 4"
        rx={6}
        filter="url(#glow)"
        style={{ animation: "category-flash 2s ease infinite" }}
      />
    </svg>
  );
}

const retryBtnStyle = {
  padding:      "10px 20px",
  background:   "transparent",
  border:       "1.5px solid #4ade80",
  borderRadius: 8,
  color:        "#4ade80",
  fontFamily:   "var(--font-display)",
  fontWeight:   700,
  fontSize:     14,
  cursor:       "pointer",
};

const spinnerStyle = {
  width:          40, height: 40,
  border:         "3px solid rgba(74,222,128,0.15)",
  borderTopColor: "#4ade80",
  borderRadius:   "50%",
  margin:         "0 auto",
  animation:      "spin 1s linear infinite",
};
