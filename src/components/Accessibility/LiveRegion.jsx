import { useRef, useCallback, useEffect } from 'react';

/**
 * ARIA live region — the #1 accessibility feature.
 * Every detection result, error, and status change is announced here.
 * Screen readers (NVDA, JAWS, VoiceOver) pick this up automatically.
 */
export function useLiveRegion() {
  const assertiveRef = useRef(null);
  const politeRef    = useRef(null);

  // Assertive: interrupts screen reader immediately (detections, errors)
  const announce = useCallback((text) => {
    const el = assertiveRef.current;
    if (!el) return;
    el.textContent = '';
    // Tiny delay forces screen readers to re-announce even same text
    requestAnimationFrame(() => {
      requestAnimationFrame(() => { el.textContent = text; });
    });
  }, []);

  // Polite: waits for screen reader to finish (status updates)
  const announcePolite = useCallback((text) => {
    const el = politeRef.current;
    if (!el) return;
    el.textContent = '';
    requestAnimationFrame(() => {
      requestAnimationFrame(() => { el.textContent = text; });
    });
  }, []);

  return { assertiveRef, politeRef, announce, announcePolite };
}

export function LiveRegion({ assertiveRef, politeRef }) {
  return (
    <>
      {/* Assertive: detections, errors — interrupts immediately */}
      <div
        ref={assertiveRef}
        role="alert"
        aria-live="assertive"
        aria-atomic="true"
        aria-relevant="all"
        style={srOnly}
      />
      {/* Polite: status updates — waits for current speech to finish */}
      <div
        ref={politeRef}
        role="status"
        aria-live="polite"
        aria-atomic="true"
        style={srOnly}
      />
    </>
  );
}

const srOnly = {
  position:   'absolute',
  left:       '-9999px',
  width:      '1px',
  height:     '1px',
  overflow:   'hidden',
  clip:       'rect(0,0,0,0)',
  whiteSpace: 'nowrap',
  border:     '0',
};
