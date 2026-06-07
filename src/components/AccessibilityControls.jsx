import React from "react";

export function AccessibilityControls({
  speechRate, onRateChange,
  highContrast, onToggleContrast,
  largeText, onToggleLargeText,
  isListening, onStartListening, voiceSupported,
}) {
  return (
    <section
      aria-label="Accessibility controls"
      style={{
        background:   "var(--bg-surface)",
        border:       "1px solid var(--bg-raised)",
        borderRadius: 14,
        padding:      "14px 16px",
      }}
    >
      <h2 style={{
        fontFamily:    "var(--font-display)",
        fontSize:      11,
        fontWeight:    700,
        letterSpacing: "0.1em",
        textTransform: "uppercase",
        color:         "var(--text-muted)",
        marginBottom:  12,
      }}>
        Accessibility
      </h2>

      <div style={{ display: "flex", flexDirection: "column", gap: 12 }}>

        {/* ── Speech Rate ─────────────────────────────────────────────────── */}
        <div>
          <div style={{ display: "flex", justifyContent: "space-between", marginBottom: 6 }}>
            <label
              htmlFor="speech-rate-slider"
              style={{ fontFamily: "var(--font-mono)", fontSize: 12, color: "var(--text-secondary)" }}
            >
              🎚 Speech Speed
            </label>
            <span
              aria-live="polite"
              aria-label={`Speech speed: ${speechRate.toFixed(1)} times`}
              style={{ fontFamily: "var(--font-mono)", fontSize: 12, fontWeight: 700, color: "#4ade80" }}
            >
              {speechRate.toFixed(1)}×
            </span>
          </div>
          <div style={{ display: "flex", alignItems: "center", gap: 8 }}>
            <button
              onClick={() => onRateChange(-0.25)}
              aria-label="Decrease speech speed (minus key)"
              style={rateBtn}
            >
              −
            </button>
            <input
              id="speech-rate-slider"
              type="range"
              min="0.5" max="2.0" step="0.25"
              value={speechRate}
              onChange={e => onRateChange(parseFloat(e.target.value) - speechRate)}
              aria-label={`Speech speed: ${speechRate.toFixed(1)} times. Use plus and minus keys to adjust.`}
              style={{ flex: 1, accentColor: "#4ade80", cursor: "pointer" }}
            />
            <button
              onClick={() => onRateChange(0.25)}
              aria-label="Increase speech speed (plus key)"
              style={rateBtn}
            >
              +
            </button>
          </div>
          <div style={{ display: "flex", justifyContent: "space-between", marginTop: 3 }}>
            <span style={{ fontFamily: "var(--font-mono)", fontSize: 9, color: "var(--text-muted)" }}>0.5×  Slow</span>
            <span style={{ fontFamily: "var(--font-mono)", fontSize: 9, color: "var(--text-muted)" }}>Fast  2.0×</span>
          </div>
        </div>

        {/* ── Toggle row ──────────────────────────────────────────────────── */}
        <div style={{ display: "flex", gap: 8, flexWrap: "wrap" }}>
          <ToggleButton
            label="High Contrast"
            icon="⊞"
            shortcut="C"
            active={highContrast}
            onClick={onToggleContrast}
            ariaLabel="Toggle high contrast mode — press C"
            ariaPressed={highContrast}
          />
          <ToggleButton
            label="Large Text"
            icon="Aa"
            active={largeText}
            onClick={onToggleLargeText}
            ariaLabel="Toggle large text mode"
            ariaPressed={largeText}
          />
          {voiceSupported && (
            <ToggleButton
              label={isListening ? "Listening…" : "Voice Cmd"}
              icon="🎙"
              shortcut="V"
              active={isListening}
              onClick={onStartListening}
              ariaLabel={isListening ? "Listening for voice command" : "Activate voice command — press V"}
              ariaPressed={isListening}
              pulse={isListening}
            />
          )}
        </div>

        {/* ── Keyboard shortcuts ───────────────────────────────────────────── */}
        <details style={{ borderTop: "1px solid var(--bg-raised)", paddingTop: 10 }}>
          <summary
            style={{
              cursor:     "pointer",
              fontFamily: "var(--font-mono)",
              fontSize:   11,
              color:      "var(--text-muted)",
              userSelect: "none",
            }}
          >
            ⌨ Keyboard Shortcuts
          </summary>
          <div
            style={{
              display:             "grid",
              gridTemplateColumns: "repeat(auto-fill, minmax(160px,1fr))",
              gap:                 6,
              marginTop:           10,
            }}
          >
            {SHORTCUTS.map(([key, action]) => (
              <div key={key} style={{ display: "flex", gap: 6, alignItems: "center" }}>
                <kbd style={kbdStyle}>{key}</kbd>
                <span style={{ fontFamily: "var(--font-body)", fontSize: 12, color: "var(--text-secondary)" }}>
                  {action}
                </span>
              </div>
            ))}
          </div>
        </details>
      </div>
    </section>
  );
}

// ── Sub-components ────────────────────────────────────────────────────────────

function ToggleButton({ label, icon, shortcut, active, onClick, ariaLabel, ariaPressed, pulse }) {
  return (
    <button
      onClick={onClick}
      aria-label={ariaLabel}
      aria-pressed={ariaPressed}
      style={{
        display:    "inline-flex",
        alignItems: "center",
        gap:        5,
        padding:    "7px 12px",
        borderRadius: 8,
        border:     `1.5px solid ${active ? "#4ade80" : "var(--bg-raised)"}`,
        background: active ? "rgba(74,222,128,0.08)" : "var(--bg-raised)",
        color:      active ? "#4ade80" : "var(--text-secondary)",
        fontFamily: "var(--font-display)",
        fontWeight: 700,
        fontSize:   12,
        cursor:     "pointer",
        transition: "all 0.2s",
        animation:  pulse ? "pulse-ring 1.5s ease infinite" : "none",
        outline:    "none",
      }}
    >
      <span aria-hidden="true">{icon}</span>
      {label}
      {shortcut && (
        <kbd style={{ ...kbdStyle, fontSize: 9, padding: "0 3px" }}>{shortcut}</kbd>
      )}
    </button>
  );
}

const SHORTCUTS = [
  ["Space", "Scan item"],
  ["R",     "Repeat guidance"],
  ["H",     "Hear history"],
  ["C",     "High contrast"],
  ["V",     "Voice command"],
  ["+",     "Faster speech"],
  ["−",     "Slower speech"],
  ["F1",    "Help"],
];

const rateBtn = {
  width:      30, height: 30,
  borderRadius: 6,
  border:     "1.5px solid var(--bg-raised)",
  background: "var(--bg-raised)",
  color:      "var(--text-secondary)",
  fontFamily: "var(--font-mono)",
  fontWeight: 700,
  fontSize:   18,
  cursor:     "pointer",
  display:    "flex", alignItems: "center", justifyContent: "center",
  flexShrink: 0,
  lineHeight: 1,
};

const kbdStyle = {
  background:   "var(--bg-raised)",
  border:       "1px solid rgba(255,255,255,0.08)",
  borderRadius: 4,
  padding:      "1px 6px",
  fontFamily:   "var(--font-mono)",
  fontSize:     10,
  color:        "var(--text-muted)",
  flexShrink:   0,
};
