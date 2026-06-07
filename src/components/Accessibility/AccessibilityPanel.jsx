import { useAppStore } from '../../store';

export function AccessibilityPanel() {
  const { speechRate, setSpeechRate, highContrast, setHighContrast,
          fontSize, setFontSize, language, setLanguage } = useAppStore();

  const hc = highContrast;

  const panelStyle = {
    background:   hc ? '#111' : 'rgba(255,255,255,.04)',
    border:       `1px solid ${hc ? '#ffff00' : 'rgba(255,255,255,.1)'}`,
    borderRadius: '14px',
    padding:      '14px 16px',
    marginBottom: '14px',
  };

  const labelStyle = {
    fontSize:    '11px', fontWeight: 700, fontFamily: 'var(--font-mono)',
    letterSpacing: '0.06em', textTransform: 'uppercase',
    color:       hc ? '#ffff00' : 'var(--cloud)',
    display:     'block', marginBottom: '8px',
  };

  return (
    <section aria-label="Accessibility controls" style={panelStyle}>
      <h2 style={{ ...labelStyle, marginBottom: '14px', fontSize: '12px' }}>
        ♿ Accessibility Controls
      </h2>

      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))', gap: '14px' }}>

        {/* Speech Rate */}
        <div>
          <label htmlFor="speech-rate" style={labelStyle}>
            🎚 Speech Speed: <span style={{ color: hc ? '#ffff00' : '#4ade80' }}>{speechRate.toFixed(2)}×</span>
          </label>
          <input
            id="speech-rate"
            type="range" min="0.5" max="2.0" step="0.25"
            value={speechRate}
            onChange={(e) => setSpeechRate(parseFloat(e.target.value))}
            aria-label={`Speech speed: ${speechRate.toFixed(2)} times. Use Plus or Minus keys to adjust.`}
            aria-valuemin={0.5} aria-valuemax={2.0} aria-valuenow={speechRate}
            style={{ width: '100%', accentColor: '#4ade80', cursor: 'pointer' }}
          />
          <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '10px', color: 'var(--ash)', fontFamily: 'var(--font-mono)', marginTop: 3 }}>
            <span>0.5× slow</span><span>1.0× normal</span><span>2.0× fast</span>
          </div>
        </div>

        {/* Font Size */}
        <div>
          <label htmlFor="font-size" style={labelStyle}>
            🔤 Text Size: <span style={{ color: hc ? '#ffff00' : '#4ade80' }}>{fontSize}%</span>
          </label>
          <div style={{ display: 'flex', gap: 6 }}>
            {[100, 125, 150, 175, 200].map((size) => (
              <button
                key={size}
                onClick={() => { setFontSize(size); document.documentElement.style.fontSize = `${size}%`; }}
                aria-label={`Set text size to ${size} percent`}
                aria-pressed={fontSize === size}
                style={{
                  flex:         1, padding: '5px 0',
                  borderRadius: '6px',
                  border:       `1.5px solid ${fontSize === size ? '#4ade80' : (hc ? '#ffff00' : 'rgba(255,255,255,.15)')}`,
                  background:   fontSize === size ? 'rgba(74,222,128,.15)' : 'transparent',
                  cursor:       'pointer',
                  fontSize:     '11px', fontWeight: fontSize === size ? 700 : 400,
                  color:        hc ? '#ffff00' : (fontSize === size ? '#4ade80' : 'var(--cloud)'),
                  fontFamily:   'var(--font-mono)',
                }}
              >
                {size === 100 ? 'A' : size === 150 ? 'A+' : size === 200 ? 'A++' : `${size}%`}
              </button>
            ))}
          </div>
        </div>

        {/* High Contrast + Language */}
        <div style={{ display: 'flex', flexDirection: 'column', gap: '8px' }}>
          <ToggleButton
            id="high-contrast-toggle"
            label="⊞ High Contrast"
            shortcut="C"
            checked={highContrast}
            onChange={setHighContrast}
            hc={hc}
          />
          <div>
            <label htmlFor="language-select" style={{ ...labelStyle, marginBottom: 4 }}>🌐 Language</label>
            <select
              id="language-select"
              value={language}
              onChange={(e) => setLanguage(e.target.value)}
              aria-label="Select guidance language"
              style={{
                width:        '100%', padding: '6px 10px',
                borderRadius: '7px', fontSize: '13px',
                background:   hc ? '#000' : 'rgba(255,255,255,.08)',
                border:       `1px solid ${hc ? '#ffff00' : 'rgba(255,255,255,.2)'}`,
                color:        hc ? '#ffff00' : 'var(--paper)',
                cursor:       'pointer',
                fontFamily:   'var(--font-body)',
              }}
            >
              <option value="en">English</option>
              <option value="hi">हिंदी (Hindi)</option>
            </select>
          </div>
        </div>
      </div>

      {/* Keyboard speed hint */}
      <div style={{ marginTop: 12, fontSize: '11px', color: 'var(--ash)', fontFamily: 'var(--font-mono)' }}>
        Press <Kbd hc={hc}>+</Kbd> to speed up · <Kbd hc={hc}>-</Kbd> to slow down · <Kbd hc={hc}>C</Kbd> for high contrast
      </div>
    </section>
  );
}

function ToggleButton({ id, label, shortcut, checked, onChange, hc }) {
  return (
    <div style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
      <button
        id={id}
        role="switch"
        aria-checked={checked}
        aria-label={`${label} (keyboard: ${shortcut})`}
        onClick={() => onChange(!checked)}
        style={{
          width: 40, height: 22, borderRadius: 11,
          background:  checked ? '#16a34a' : (hc ? '#333' : 'rgba(255,255,255,.15)'),
          border:      `2px solid ${checked ? '#4ade80' : (hc ? '#ffff00' : 'rgba(255,255,255,.3)')}`,
          cursor:      'pointer',
          position:    'relative',
          flexShrink:  0,
          transition:  'all 0.2s ease',
        }}
      >
        <div style={{
          position:   'absolute', top: 2, width: 14, height: 14, borderRadius: '50%',
          background: '#fff', transition: 'left 0.2s ease',
          left:       checked ? 20 : 2,
        }} />
      </button>
      <label htmlFor={id} style={{ fontSize: '12px', fontWeight: 600, color: hc ? '#ffff00' : 'var(--cloud)', cursor: 'pointer', userSelect: 'none' }}>
        {label} <span style={{ fontFamily: 'var(--font-mono)', fontSize: 10 }}>({shortcut})</span>
      </label>
    </div>
  );
}

function Kbd({ children, hc }) {
  return (
    <kbd style={{
      background: hc ? '#333' : 'rgba(255,255,255,.12)',
      border: `1px solid ${hc ? '#ffff00' : 'rgba(255,255,255,.2)'}`,
      borderRadius: '4px', padding: '1px 5px',
      fontSize: '10px', fontFamily: 'var(--font-mono)',
      color: hc ? '#ffff00' : 'var(--cloud)',
    }}>
      {children}
    </kbd>
  );
}
