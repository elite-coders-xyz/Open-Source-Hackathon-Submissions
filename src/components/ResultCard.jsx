import React from "react";

const CATEGORY_CONFIG = {
  WET:        { label: "Wet Waste",       icon: "🌿", bgVar: "--wet-bg",  borderVar: "--wet-border",  textVar: "--wet-text",  strongVar: "--wet-strong",  bin: "Green Bin",   binIcon: "🟢", tip: "Becomes compost — great for gardens!" },
  DRY:        { label: "Dry Waste",       icon: "📦", bgVar: "--dry-bg",  borderVar: "--dry-border",  textVar: "--dry-text",  strongVar: "--dry-strong",  bin: "Brown Bin",   binIcon: "🟤", tip: "Keep it clean and dry before disposal." },
  RECYCLABLE: { label: "Recyclable",      icon: "♻️", bgVar: "--rec-bg",  borderVar: "--rec-border",  textVar: "--rec-text",  strongVar: "--rec-strong",  bin: "Blue Bin",    binIcon: "🔵", tip: "Rinse it out — recycling loves clean items." },
  HAZARDOUS:  { label: "Hazardous Waste", icon: "⚠️", bgVar: "--haz-bg",  borderVar: "--haz-border",  textVar: "--haz-text",  strongVar: "--haz-strong",  bin: "Red Bin",     binIcon: "🔴", tip: "Never mix with other waste — handle carefully." },
};

export function ResultCard({ result, onRepeat, onDismiss }) {
  if (!result) return null;

  const cfg = CATEGORY_CONFIG[result.category] || CATEGORY_CONFIG.DRY;
  const pct = Math.round(result.confidence * 100);

  return (
    <section
      aria-label={`Detection result: ${result.detected_object}, ${cfg.label}`}
      aria-live="polite"
      className="animate-fade-up"
      style={{
        background:   `var(${cfg.bgVar})`,
        border:       `1.5px solid var(${cfg.borderVar})`,
        borderRadius: 16,
        padding:      "1.25rem",
        position:     "relative",
        overflow:     "hidden",
      }}
    >
      {/* Decorative background glow */}
      <div
        aria-hidden="true"
        style={{
          position:   "absolute", top: -40, right: -40,
          width:      140, height: 140,
          borderRadius: "50%",
          background: `var(${cfg.strongVar})`,
          opacity:    0.06,
          pointerEvents: "none",
        }}
      />

      {/* ── Header row ──────────────────────────────────────────────────────── */}
      <div style={{ display: "flex", alignItems: "flex-start", gap: 14, marginBottom: 14 }}>
        {/* Category icon */}
        <div
          aria-hidden="true"
          style={{
            width: 52, height: 52,
            borderRadius: 14,
            background: `var(${cfg.borderVar})22`,
            border: `1px solid var(${cfg.borderVar})44`,
            display: "flex", alignItems: "center", justifyContent: "center",
            fontSize: 26, flexShrink: 0,
          }}
        >
          {cfg.icon}
        </div>

        <div style={{ flex: 1, minWidth: 0 }}>
          {/* Object name */}
          <h2 style={{
            fontFamily:    "var(--font-display)",
            fontWeight:    800,
            fontSize:      22,
            color:         `var(${cfg.strongVar})`,
            letterSpacing: "-0.03em",
            lineHeight:    1.1,
            textTransform: "capitalize",
            marginBottom:  4,
          }}>
            {result.detected_object}
          </h2>

          {/* Category + bin row */}
          <div style={{ display: "flex", alignItems: "center", gap: 8, flexWrap: "wrap" }}>
            <span style={{
              fontFamily: "var(--font-mono)",
              fontSize:   11,
              fontWeight: 700,
              color:      `var(${cfg.textVar})`,
              background: `var(${cfg.borderVar})22`,
              border:     `1px solid var(${cfg.borderVar})44`,
              borderRadius: 6,
              padding:    "2px 8px",
            }}>
              {cfg.label.toUpperCase()}
            </span>
            <span style={{ color: "#506654", fontSize: 12 }} aria-hidden="true">→</span>
            <span style={{
              fontFamily: "var(--font-mono)",
              fontSize:   12,
              fontWeight: 600,
              color:      `var(${cfg.textVar})`,
            }}>
              {cfg.binIcon} {cfg.bin}
            </span>
          </div>
        </div>

        {/* Confidence meter */}
        <div style={{ textAlign: "right", flexShrink: 0 }}>
          <div
            role="meter"
            aria-label={`Detection confidence: ${pct} percent`}
            aria-valuenow={pct}
            aria-valuemin={0}
            aria-valuemax={100}
            style={{
              fontFamily:    "var(--font-mono)",
              fontSize:      28,
              fontWeight:    700,
              color:         `var(${cfg.strongVar})`,
              lineHeight:    1,
            }}
          >
            {pct}
            <span style={{ fontSize: 14, color: `var(${cfg.textVar})` }}>%</span>
          </div>
          <div style={{ fontSize: 10, color: "#506654", fontFamily: "var(--font-mono)", marginTop: 2 }}>
            CONFIDENCE
          </div>
        </div>
      </div>

      {/* ── Gemma guidance text ──────────────────────────────────────────────── */}
      <div
        role="note"
        aria-label="Disposal guidance from Gemma AI"
        style={{
          background:   "rgba(0,0,0,0.25)",
          border:       `1px solid var(${cfg.borderVar})33`,
          borderRadius: 10,
          padding:      "12px 14px",
          marginBottom: 14,
        }}
      >
        {/* Source badge */}
        <div style={{ display: "flex", alignItems: "center", gap: 6, marginBottom: 8 }}>
          <span style={{
            fontFamily:  "var(--font-mono)",
            fontSize:    10,
            fontWeight:  700,
            color:       result.guidance?.source === "gemma" ? "#4ade80" : "#f59e0b",
            background:  result.guidance?.source === "gemma" ? "rgba(74,222,128,0.1)" : "rgba(245,158,11,0.1)",
            border:      result.guidance?.source === "gemma" ? "1px solid rgba(74,222,128,0.3)" : "1px solid rgba(245,158,11,0.3)",
            borderRadius: 4,
            padding:     "1px 6px",
          }}>
            {result.guidance?.source === "gemma" ? "✦ GEMMA 2" : "📦 OFFLINE"}
          </span>
          <span style={{ fontFamily: "var(--font-mono)", fontSize: 10, color: "#506654" }}>
            {result.guidance?.model}
          </span>
        </div>

        {/* Guidance text — the most important element */}
        <p style={{
          fontFamily:  "var(--font-body)",
          fontSize:    16,
          fontStyle:   "italic",
          color:       `var(${cfg.textVar})`,
          lineHeight:  1.65,
          margin:      0,
        }}>
          "{result.guidance?.text}"
        </p>
      </div>

      {/* ── Tip row ─────────────────────────────────────────────────────────── */}
      <div style={{
        display:     "flex",
        alignItems:  "center",
        gap:         8,
        padding:     "8px 10px",
        background:  "rgba(0,0,0,0.15)",
        borderRadius: 8,
        marginBottom: 14,
      }}>
        <span aria-hidden="true" style={{ fontSize: 14 }}>💡</span>
        <span style={{ fontSize: 13, color: `var(${cfg.textVar})`, opacity: 0.8, fontFamily: "var(--font-body)" }}>
          {cfg.tip}
        </span>
      </div>

      {/* ── Action buttons ───────────────────────────────────────────────────── */}
      <div style={{ display: "flex", gap: 8, flexWrap: "wrap" }}>
        <button
          onClick={onRepeat}
          aria-label="Repeat spoken guidance — press R"
          style={actionBtnStyle(`var(${cfg.borderVar})`)}
        >
          <svg width="14" height="14" viewBox="0 0 24 24" fill="none" aria-hidden="true">
            <path d="M1 4v6h6M23 20v-6h-6" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
            <path d="M20.49 9A9 9 0 0 0 5.64 5.64L1 10m22 4l-4.64 4.36A9 9 0 0 1 3.51 15" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
          </svg>
          Repeat  <kbd style={kbdStyle}>R</kbd>
        </button>

        {onDismiss && (
          <button
            onClick={onDismiss}
            aria-label="Dismiss result and scan again"
            style={actionBtnStyle("rgba(80,102,84,0.5)", true)}
          >
            <svg width="14" height="14" viewBox="0 0 24 24" fill="none" aria-hidden="true">
              <path d="M18 6L6 18M6 6l12 12" stroke="currentColor" strokeWidth="2" strokeLinecap="round"/>
            </svg>
            Dismiss
          </button>
        )}
      </div>
    </section>
  );
}

const actionBtnStyle = (borderColor, ghost = false) => ({
  display:      "inline-flex",
  alignItems:   "center",
  gap:          6,
  padding:      "8px 14px",
  borderRadius: 8,
  border:       `1.5px solid ${borderColor}`,
  background:   ghost ? "transparent" : "rgba(0,0,0,0.2)",
  color:        "#8aab8e",
  fontFamily:   "var(--font-display)",
  fontWeight:   700,
  fontSize:     12,
  cursor:       "pointer",
  transition:   "background 0.2s",
});

const kbdStyle = {
  background:   "rgba(255,255,255,0.08)",
  border:       "1px solid rgba(255,255,255,0.12)",
  borderRadius: 3,
  padding:      "0 4px",
  fontSize:     10,
  fontFamily:   "var(--font-mono)",
  color:        "#506654",
};
