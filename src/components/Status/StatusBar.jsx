import { useEffect } from 'react';
import { useAppStore } from '../../store';
import { fetchHealth } from '../../services/api';

export function StatusBar() {
  const status = useAppStore((s) => s.systemStatus);
  const setStatus = useAppStore((s) => s.setStatus);
  const hc = useAppStore((s) => s.highContrast);

  useEffect(() => {
    fetchHealth().then(setStatus).catch(() => {});
    const interval = setInterval(() => {
      fetchHealth().then(setStatus).catch(() => {});
    }, 30_000);
    return () => clearInterval(interval);
  }, [setStatus]);

  if (!status) return null;

  const items = [
    { label: 'YOLOv8',   ok: status.yolo_loaded,     icon: '👁' },
    { label: 'Gemma',  ok: status.gemma_available,  icon: '🤖' },
    { label: 'Ollama',   ok: status.ollama_running,   icon: '⚡' },
    { label: 'Offline ✓',ok: status.offline_capable,  icon: '📡' },
  ];

  return (
    <div
      role="status"
      aria-label={`System status: ${status.status}`}
      style={{
        display:      'flex',
        gap:          '6px',
        flexWrap:     'wrap',
        marginBottom: '16px',
      }}
    >
      {items.map(({ label, ok, icon }) => (
        <div
          key={label}
          aria-label={`${label}: ${ok ? 'active' : 'unavailable'}`}
          style={{
            display:      'flex',
            alignItems:   'center',
            gap:          '5px',
            padding:      '4px 10px',
            borderRadius: '99px',
            fontSize:     '11px',
            fontWeight:   700,
            fontFamily:   'var(--font-mono)',
            background:   hc ? '#000' : (ok ? 'rgba(20,83,45,.6)' : 'rgba(127,29,29,.4)'),
            border:       `1px solid ${hc ? '#ffff00' : (ok ? 'rgba(74,222,128,.3)' : 'rgba(252,165,165,.3)')}`,
            color:        hc ? '#ffff00' : (ok ? '#4ade80' : '#fca5a5'),
          }}
        >
          <span aria-hidden="true">{ok ? '●' : '○'}</span>
          <span aria-hidden="true">{icon}</span>
          {label}
        </div>
      ))}
    </div>
  );
}
