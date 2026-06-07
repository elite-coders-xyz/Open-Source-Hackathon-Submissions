import { useAppStore } from '../../store';

const ICONS = { WET: '🌿', DRY: '📦', RECYCLABLE: '♻️', HAZARDOUS: '⚠️' };
const LABELS = { WET: 'Wet', DRY: 'Dry', RECYCLABLE: 'Recyclable', HAZARDOUS: 'Hazardous' };
const COLORS = { WET: '#059669', DRY: '#6b7280', RECYCLABLE: '#1d4ed8', HAZARDOUS: '#dc2626' };

export function ScanHistory({ onReplay }) {
  const history = useAppStore((s) => s.history);
  const hc      = useAppStore((s) => s.highContrast);

  if (!history.length) return null;

  return (
    <section aria-label="Recent scan history">
      <h2 style={{
        fontSize:      '11px', fontWeight: 700,
        letterSpacing: '0.08em', textTransform: 'uppercase',
        color:         hc ? '#ffff00' : 'var(--ash)',
        marginBottom:  '10px', fontFamily: 'var(--font-mono)',
      }}>
        Recent scans ({history.length})
      </h2>

      <ol style={{ listStyle: 'none', display: 'flex', flexDirection: 'column', gap: '6px' }}>
        {history.slice(0, 5).map((item, i) => {
          const color = hc ? '#ffff00' : COLORS[item.category];
          return (
            <li key={i}>
              <button
                onClick={() => onReplay?.(item)}
                aria-label={`Scan ${i + 1}: ${item.detected_object}, ${LABELS[item.category]}. Click to replay guidance.`}
                style={{
                  width:        '100%',
                  display:      'flex',
                  alignItems:   'center',
                  gap:          '10px',
                  padding:      '8px 12px',
                  background:   hc ? '#111' : 'rgba(255,255,255,.04)',
                  border:       `1px solid ${hc ? '#ffff00' : color + '40'}`,
                  borderRadius: '10px',
                  cursor:       'pointer',
                  textAlign:    'left',
                  color:        hc ? '#ffff00' : 'var(--paper)',
                  transition:   'background 0.15s, border-color 0.15s',
                }}
                onMouseEnter={(e) => { e.currentTarget.style.background = hc ? '#222' : `${color}15`; }}
                onMouseLeave={(e) => { e.currentTarget.style.background = hc ? '#111' : 'rgba(255,255,255,.04)'; }}
              >
                <span aria-hidden="true" style={{ fontSize: '18px', flexShrink: 0 }}>
                  {ICONS[item.category]}
                </span>
                <span style={{ flex: 1, fontSize: '13px', fontWeight: 500, textTransform: 'capitalize' }}>
                  {item.detected_object}
                </span>
                <span style={{
                  fontSize: '10px', fontWeight: 700, padding: '2px 7px',
                  borderRadius: '99px', background: color + '20',
                  color, fontFamily: 'var(--font-mono)',
                }}>
                  {LABELS[item.category]}
                </span>
                <span aria-hidden="true" style={{ fontSize: '11px', color: 'var(--ash)', fontFamily: 'var(--font-mono)' }}>
                  {Math.round(item.confidence * 100)}%
                </span>
              </button>
            </li>
          );
        })}
      </ol>
    </section>
  );
}
