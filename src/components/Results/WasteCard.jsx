import { useAppStore } from '../../store';

const CATEGORY_META = {
  WET: {
    label:   'Wet Waste',
    icon:    '🌿',
    bin:     'Green Bin',
    tip:     'Biodegradable · becomes compost',
    cssVar:  { bg: 'var(--wet-bg)', border: 'var(--wet-border)', text: 'var(--wet-text)', glow: 'var(--wet-glow)' },
  },
  DRY: {
    label:   'Dry Waste',
    icon:    '📦',
    bin:     'Brown Bin',
    tip:     'Keep clean and dry',
    cssVar:  { bg: 'var(--dry-bg)', border: 'var(--dry-border)', text: 'var(--dry-text)', glow: 'var(--dry-glow)' },
  },
  RECYCLABLE: {
    label:   'Recyclable',
    icon:    '♻️',
    bin:     'Blue Bin',
    tip:     'Rinse before disposing',
    cssVar:  { bg: 'var(--rec-bg)', border: 'var(--rec-border)', text: 'var(--rec-text)', glow: 'var(--rec-glow)' },
  },
  HAZARDOUS: {
    label:   'Hazardous Waste',
    icon:    '⚠️',
    bin:     'Red Bin',
    tip:     'Handle with care · do not mix',
    cssVar:  { bg: 'var(--haz-bg)', border: 'var(--haz-border)', text: 'var(--haz-text)', glow: 'var(--haz-glow)' },
  },
};

export function WasteCard({ result, onRepeat }) {
  const hc = useAppStore((s) => s.highContrast);
  if (!result) return null;

  const meta = CATEGORY_META[result.category] || CATEGORY_META.DRY;
  const { bg, border, text } = hc
    ? { bg: '#000', border: '#ffff00', text: '#ffff00' }
    : meta.cssVar;

  const confPct = Math.round(result.confidence * 100);

  return (
    <section
      id="result-panel"
      aria-label={`Detection result: ${result.detected_object}, ${meta.label}`}
      tabIndex={-1}
      style={{
        background:   bg,
        border:       `2px solid ${border}`,
        borderRadius: '16px',
        padding:      '1.25rem 1.5rem',
        animation:    'fadeSlideUp 0.35s cubic-bezier(.16,1,.3,1)',
        boxShadow:    `0 4px 24px ${meta.cssVar.glow}`,
      }}
    >
      {/* Header row */}
      <div style={{ display: 'flex', alignItems: 'flex-start', gap: '14px', marginBottom: '14px' }}>
        <div
          aria-hidden="true"
          style={{
            fontSize:   '44px', lineHeight: 1,
            flexShrink: 0,
            filter:     'drop-shadow(0 2px 8px rgba(0,0,0,.2))',
          }}
        >
          {meta.icon}
        </div>

        <div style={{ flex: 1 }}>
          <h2 style={{
            fontFamily: 'var(--font-display)',
            fontSize:   '22px', fontWeight: 400,
            color:      text, marginBottom: '2px',
            textTransform: 'capitalize',
          }}>
            {result.detected_object}
          </h2>
          <div style={{ display: 'flex', gap: 8, flexWrap: 'wrap', alignItems: 'center' }}>
            <span style={{
              fontSize: '12px', fontWeight: 700, fontFamily: 'var(--font-mono)',
              padding: '2px 8px', borderRadius: '99px',
              background: border, color: '#fff',
            }}>
              {meta.label}
            </span>
            <span style={{ fontSize: '13px', color: text, fontWeight: 500 }}>
              {meta.bin}
            </span>
          </div>
        </div>

        {/* Confidence meter */}
        <div
          aria-label={`Detection confidence: ${confPct} percent`}
          style={{ textAlign: 'right', flexShrink: 0 }}
        >
          <div style={{
            fontFamily: 'var(--font-mono)', fontSize: '28px', fontWeight: 700,
            color: text, lineHeight: 1,
          }}>
            {confPct}<span style={{ fontSize: 14 }}>%</span>
          </div>
          <div style={{ fontSize: '10px', color: text, opacity: 0.6, fontFamily: 'var(--font-mono)', marginTop: 2 }}>
            confidence
          </div>
          <ConfBar pct={confPct} color={border} />
        </div>
      </div>

      {/* Gemma guidance text */}
      <div
        role="note"
        aria-label="Disposal guidance from Gemma AI"
        style={{
          background:   'rgba(255,255,255,0.55)',
          backdropFilter: 'blur(4px)',
          border:       `1px solid ${border}40`,
          borderRadius: '10px',
          padding:      '12px 14px',
          fontSize:     '15px', lineHeight: 1.65,
          color:        hc ? '#000' : '#1a1a1a',
          marginBottom: '12px',
          fontStyle:    'italic',
        }}
      >
        <span aria-hidden="true" style={{ marginRight: 8, opacity: 0.6 }}>💬</span>
        {result.guidance.text}
      </div>

      {/* Footer: action buttons + source badges */}
      <div style={{ display: 'flex', gap: '8px', flexWrap: 'wrap', alignItems: 'center' }}>
        <button
          onClick={onRepeat}
          aria-label="Repeat the guidance (keyboard: R)"
          style={{
            padding:      '7px 14px',
            border:       `1.5px solid ${border}`,
            borderRadius: '8px',
            background:   'transparent',
            cursor:       'pointer',
            fontSize:     '13px', fontWeight: 600,
            color:        hc ? '#ffff00' : text,
            display:      'flex', alignItems: 'center', gap: 6,
          }}
        >
          🔁 Repeat <Kbd>R</Kbd>
        </button>

        <div style={{ marginLeft: 'auto', display: 'flex', gap: 6 }}>
          <GuidanceBadge source={result.guidance.source} model={result.guidance.model} hc={hc} />
          {result.offline_mode && <OfflineBadge hc={hc} />}
        </div>
      </div>

      {/* Bin colour legend */}
      <div style={{
        marginTop: '12px', paddingTop: '12px',
        borderTop: `1px solid ${border}30`,
        fontSize: '12px', color: hc ? '#ffff00' : text, opacity: hc ? 1 : 0.7,
        fontFamily: 'var(--font-mono)',
      }}>
        💡 {meta.tip}
      </div>
    </section>
  );
}

function ConfBar({ pct, color }) {
  return (
    <div style={{
      width: '52px', height: '4px',
      background: 'rgba(0,0,0,.15)', borderRadius: '2px',
      marginTop: '6px', overflow: 'hidden',
    }} aria-hidden="true">
      <div style={{
        width:      `${pct}%`, height: '100%',
        background: color, borderRadius: '2px',
        transition: 'width 0.5s ease',
      }} />
    </div>
  );
}

function GuidanceBadge({ source, model, hc }) {
  const isGemma = source === 'gemma';
  return (
    <span style={{
      fontSize: '11px', padding: '3px 8px', borderRadius: '99px',
      fontWeight: 700, fontFamily: 'var(--font-mono)',
      background: hc ? '#111' : (isGemma ? '#d1fae5' : '#fef3c7'),
      color:      hc ? '#ffff00' : (isGemma ? '#065f46' : '#92400e'),
      border:     hc ? '1px solid #ffff00' : 'none',
    }}>
      {isGemma ? `✨ ${model}` : '📦 Offline'}
    </span>
  );
}

function OfflineBadge({ hc }) {
  return (
    <span style={{
      fontSize: '11px', padding: '3px 8px', borderRadius: '99px',
      fontWeight: 700, fontFamily: 'var(--font-mono)',
      background: hc ? '#111' : '#fef3c7', color: hc ? '#ffff00' : '#92400e',
      border: hc ? '1px solid #ffff00' : 'none',
    }}>
      📡 Local AI
    </span>
  );
}

function Kbd({ children }) {
  return (
    <kbd style={{
      background: 'rgba(0,0,0,.12)', border: '1px solid rgba(0,0,0,.2)',
      borderRadius: '4px', padding: '0px 5px', fontSize: '10px',
      fontFamily: 'var(--font-mono)',
    }}>
      {children}
    </kbd>
  );
}
