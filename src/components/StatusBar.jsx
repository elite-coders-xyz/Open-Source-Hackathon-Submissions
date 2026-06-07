import React from "react";

export function StatusBar({ status, isOnline }) {
  if (!status) return null;

  const indicators = [
    { key: "yolo_loaded",     label: "YOLOv8",  ok: status.yolo_loaded },
    { key: "ollama_running",  label: "Ollama",  ok: status.ollama_running },
    { key: "gemma_available", label: "Gemma", ok: status.gemma_available },
    { key: "offline",         label: "Offline ✓", ok: status.offline_capable },
    { key: "net",             label: isOnline ? "Online" : "Offline", ok: true, warn: !isOnline },
  ];

  return (
    <div
      role="status"
      aria-label="AI system status"
      aria-live="polite"
      style={{
        display:      "flex",
        flexWrap:     "wrap",
        gap:          6,
        padding:      "10px 14px",
        background:   "var(--bg-surface)",
        border:       "1px solid var(--bg-raised)",
        borderRadius: 12,
      }}
    >
      {indicators.map(({ key, label, ok, warn }) => (
        <span
          key={key}
          role="status"
          aria-label={`${label}: ${ok ? (warn ? "warning" : "active") : "unavailable"}`}
          style={{
            display:      "inline-flex",
            alignItems:   "center",
            gap:          5,
            padding:      "3px 10px",
            borderRadius: 99,
            fontFamily:   "var(--font-mono)",
            fontWeight:   700,
            fontSize:     11,
            background:   ok
              ? warn ? "rgba(245,158,11,0.1)" : "rgba(74,222,128,0.08)"
              : "rgba(239,68,68,0.08)",
            border: ok
              ? warn ? "1px solid rgba(245,158,11,0.3)" : "1px solid rgba(74,222,128,0.2)"
              : "1px solid rgba(239,68,68,0.2)",
            color: ok
              ? warn ? "#f59e0b" : "#4ade80"
              : "#ef4444",
          }}
        >
          <span aria-hidden="true" style={{ fontSize: 8 }}>
            {ok ? (warn ? "▲" : "●") : "●"}
          </span>
          {label}
        </span>
      ))}
    </div>
  );
}
