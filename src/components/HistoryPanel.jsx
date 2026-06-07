import React from "react";

const CAT = {
  WET:        { icon: "🌿", color: "#22c55e", label: "Wet" },
  DRY:        { icon: "📦", color: "#f59e0b", label: "Dry" },
  RECYCLABLE: { icon: "♻️", color: "#3b82f6", label: "Recyc." },
  HAZARDOUS:  { icon: "⚠️", color: "#ef4444", label: "Hazard" },
};

function timeAgo(date) {
  const s = Math.floor((Date.now() - new Date(date)) / 1000);
  if (s < 60)  return `${s}s ago`;
  if (s < 3600) return `${Math.floor(s / 60)}m ago`;
  return `${Math.floor(s / 3600)}h ago`;
}

export function HistoryPanel({ history, onClear }) {
  if (!history.length) return null;

  return (
    <section aria-label="Recent scans history">
      <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: 10 }}>
        <h2 style={{
          fontFamily:    "var(--font-display)",
          fontWeight:    700,
          fontSize:      11,
          letterSpacing: "0.1em",
          textTransform: "uppercase",
          color:         "var(--text-muted)",
        }}>
          Recent Scans
        </h2>
        {onClear && history.length > 0 && (
          <button
            onClick={onClear}
            aria-label="Clear scan history"
            style={{
              background: "none", border: "none",
              color: "var(--text-muted)", cursor: "pointer",
              fontFamily: "var(--font-mono)", fontSize: 11,
              padding: "2px 6px", borderRadius: 4,
              transition: "color 0.15s",
            }}
            onMouseEnter={e => e.currentTarget.style.color = "var(--text-secondary)"}
            onMouseLeave={e => e.currentTarget.style.color = "var(--text-muted)"}
          >
            clear
          </button>
        )}
      </div>

      <ul
        aria-label={`${history.length} recent scans`}
        style={{ listStyle: "none", display: "flex", flexDirection: "column", gap: 6 }}
      >
        {history.slice(0, 8).map((item, i) => {
          const c = CAT[item.category] || CAT.DRY;
          const isFirst = i === 0;
          return (
            <li
              key={i}
              style={{
                display:      "flex",
                alignItems:   "center",
                gap:          10,
                padding:      "9px 12px",
                background:   isFirst ? "var(--bg-raised)" : "var(--bg-surface)",
                border:       `1px solid ${isFirst ? c.color + "44" : "var(--bg-raised)"}`,
                borderRadius: 10,
                transition:   "background 0.2s",
                animation:    isFirst ? "fade-up 0.3s ease both" : "none",
              }}
            >
              {/* Icon */}
              <span aria-hidden="true" style={{ fontSize: 18, flexShrink: 0 }}>{c.icon}</span>

              {/* Object + category */}
              <div style={{ flex: 1, minWidth: 0 }}>
                <div style={{
                  fontFamily:    "var(--font-display)",
                  fontWeight:    700,
                  fontSize:      13,
                  color:         "var(--text-primary)",
                  textTransform: "capitalize",
                  overflow:      "hidden",
                  textOverflow:  "ellipsis",
                  whiteSpace:    "nowrap",
                }}>
                  {item.detected_object}
                </div>
                <div style={{
                  fontFamily: "var(--font-mono)",
                  fontSize:   10,
                  color:      c.color,
                  opacity:    0.8,
                  marginTop:  1,
                }}>
                  {c.label} · {Math.round(item.confidence * 100)}%
                </div>
              </div>

              {/* Time */}
              <div style={{
                fontFamily: "var(--font-mono)",
                fontSize:   10,
                color:      "var(--text-muted)",
                flexShrink: 0,
              }}>
                {item.scannedAt ? timeAgo(item.scannedAt) : ""}
              </div>
            </li>
          );
        })}
      </ul>
    </section>
  );
}
