import React from "react";

export function ScanButton({ onClick, isScanning, disabled }) {
  return (
    <div style={{ position: "relative" }}>
      {/* Pulse ring — only when idle and ready */}
      {!isScanning && !disabled && (
        <span
          aria-hidden="true"
          style={{
            position:     "absolute",
            inset:        -6,
            borderRadius: 20,
            border:       "2px solid #4ade80",
            animation:    "pulse-ring 2s ease-out infinite",
            pointerEvents:"none",
          }}
        />
      )}

      <button
        onClick={onClick}
        disabled={disabled || isScanning}
        aria-label={
          isScanning
            ? "Scanning in progress — please hold the item steady in front of the camera"
            : "Scan waste item — press Space or Enter to activate"
        }
        aria-busy={isScanning}
        aria-live="polite"
        style={{
          position:      "relative",
          width:         "100%",
          minHeight:     72,
          padding:       "0 2rem",
          display:       "flex",
          alignItems:    "center",
          justifyContent:"center",
          gap:           14,
          borderRadius:  16,
          border:        isScanning
            ? "2px solid rgba(74,222,128,0.3)"
            : "2px solid #4ade80",
          background:    isScanning
            ? "rgba(74,222,128,0.06)"
            : "linear-gradient(135deg, #052e16 0%, #064e3b 100%)",
          cursor:        isScanning || disabled ? "not-allowed" : "pointer",
          transition:    "all 0.25s cubic-bezier(0.16,1,0.3,1)",
          boxShadow:     isScanning
            ? "none"
            : "0 0 24px rgba(74,222,128,0.2), inset 0 1px 0 rgba(255,255,255,0.05)",
          userSelect:    "none",
          WebkitTapHighlightColor: "transparent",
        }}
        onMouseEnter={e => {
          if (!isScanning) e.currentTarget.style.transform = "scale(1.01)";
        }}
        onMouseLeave={e => { e.currentTarget.style.transform = "scale(1)"; }}
        onMouseDown={e  => { e.currentTarget.style.transform = "scale(0.99)"; }}
        onMouseUp={e    => { e.currentTarget.style.transform = "scale(1)"; }}
      >
        {/* Icon */}
        <ScanIcon spinning={isScanning} />

        {/* Text */}
        <div style={{ textAlign: "left" }}>
          <div style={{
            fontFamily: "var(--font-display)",
            fontWeight: 800,
            fontSize:   20,
            color:      isScanning ? "#4ade80" : "#e8f5ea",
            letterSpacing: "-0.02em",
            lineHeight: 1.1,
          }}>
            {isScanning ? "SCANNING…" : "SCAN WASTE"}
          </div>
          <div style={{
            fontFamily: "var(--font-mono)",
            fontSize:   11,
            color:      "#506654",
            marginTop:  2,
          }}>
            {isScanning ? "Hold item steady" : "SPACE · ENTER · tap here"}
          </div>
        </div>

        {/* Right side confidence hint */}
        {!isScanning && (
          <div style={{ marginLeft: "auto", opacity: 0.4 }} aria-hidden="true">
            <svg width="24" height="24" viewBox="0 0 24 24" fill="none">
              <path d="M9 18l6-6-6-6" stroke="#4ade80" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"/>
            </svg>
          </div>
        )}
      </button>
    </div>
  );
}

function ScanIcon({ spinning }) {
  if (spinning) {
    return (
      <div
        aria-hidden="true"
        style={{
          width: 32, height: 32,
          border: "3px solid rgba(74,222,128,0.2)",
          borderTopColor: "#4ade80",
          borderRadius: "50%",
          animation: "spin 0.8s linear infinite",
          flexShrink: 0,
        }}
      />
    );
  }
  return (
    <svg
      aria-hidden="true"
      width="32" height="32"
      viewBox="0 0 32 32"
      fill="none"
      style={{ flexShrink: 0 }}
    >
      {/* Scan frame corners */}
      <path d="M4 10V4h6"   stroke="#4ade80" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"/>
      <path d="M22 4h6v6"   stroke="#4ade80" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"/>
      <path d="M28 22v6h-6" stroke="#4ade80" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"/>
      <path d="M10 28H4v-6" stroke="#4ade80" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"/>
      {/* Center dot */}
      <circle cx="16" cy="16" r="3" fill="#4ade80" />
      {/* Inner ring */}
      <circle cx="16" cy="16" r="7" stroke="#4ade8044" strokeWidth="1.5"/>
    </svg>
  );
}
