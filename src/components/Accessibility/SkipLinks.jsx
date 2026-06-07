/**
 * Skip navigation links — first focusable elements on page.
 * Keyboard users (and screen reader users) use these to jump past
 * repeated header content directly to the action.
 */
export function SkipLinks() {
  const handleClick = (e, targetId) => {
    e.preventDefault();
    const el = document.getElementById(targetId);
    if (el) { el.focus(); el.scrollIntoView(); }
  };

  return (
    <nav aria-label="Skip navigation" style={{ position: 'absolute', top: 0, left: 0, zIndex: 9999 }}>
      <a href="#scan-button"   onClick={(e) => handleClick(e, 'scan-button')}   style={style}>Skip to scan button</a>
      <a href="#result-panel"  onClick={(e) => handleClick(e, 'result-panel')}  style={style}>Skip to results</a>
      <a href="#shortcut-help" onClick={(e) => handleClick(e, 'shortcut-help')} style={style}>Skip to keyboard shortcuts</a>
    </nav>
  );
}

const style = {
  position:        'absolute',
  left:            '-9999px',
  top:             '0',
  background:      '#16a34a',
  color:           '#fff',
  padding:         '10px 18px',
  borderRadius:    '0 0 8px 0',
  fontWeight:      700,
  fontSize:        '14px',
  textDecoration:  'none',
  transition:      'left 0.1s',
  ':focus': { left: '0' },
  // CSS-in-JS workaround for :focus
  outline:         'none',
};

// Add :focus rule via a style tag trick
if (typeof document !== 'undefined') {
  const s = document.createElement('style');
  s.textContent = `
    nav[aria-label="Skip navigation"] a:focus {
      left: 0 !important;
      outline: 3px solid #fff;
    }
  `;
  document.head.appendChild(s);
}
