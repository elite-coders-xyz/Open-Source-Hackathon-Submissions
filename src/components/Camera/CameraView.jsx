import { useRef } from 'react';
import { useAppStore } from '../../store';

const CATEGORY_COLORS = {
  WET:        '#059669',
  DRY:        '#6b7280',
  RECYCLABLE: '#1d4ed8',
  HAZARDOUS:  '#dc2626',
};

export function CameraView({ videoRef, canvasRef, ready, camError }) {
  const isScanning = useAppStore((s) => s.isScanning);
  const result     = useAppStore((s) => s.result);
  const hc         = useAppStore((s) => s.highContrast);

  const borderColor = result
    ? (hc ? '#ffff00' : CATEGORY_COLORS[result.category] || '#16a34a')
    : (hc ? '#ffff00' : '#16a34a');

  return (
    <div
      role="img"
      aria-label={
        ready
          ? 'Live camera feed. Point camera at waste item and press Space to scan.'
          : 'Camera loading…'
      }
      style={{
        position:     'relative',
        borderRadius: '16px',
        overflow:     'hidden',
        border:       `3px solid ${borderColor}`,
        boxShadow:    isScanning
          ? `0 0 0 4px ${borderColor}40, 0 8px 32px rgba(0,0,0,.4)`
          : `0 0 0 0px transparent, 0 4px 16px rgba(0,0,0,.3)`,
        transition:   'box-shadow 0.3s ease, border-color 0.4s ease',
        background:   '#0a0f0d',
        aspectRatio:  '4/3',
      }}
    >
      {/* Video element */}
      <video
        ref={videoRef}
        autoPlay
        playsInline
        muted
        style={{
          width:      '100%',
          height:     '100%',
          objectFit:  'cover',
          display:    'block',
          opacity:    ready ? 1 : 0,
          transition: 'opacity 0.4s ease',
        }}
        aria-hidden="true"
      />

      {/* Hidden canvas for frame capture */}
      <canvas ref={canvasRef} style={{ display: 'none' }} aria-hidden="true" />

      {/* Camera not ready */}
      {!ready && !camError && (
        <div style={overlayStyle}>
          <div style={{ textAlign: 'center', color: '#4ade80' }}>
            <div style={{ fontSize: 40, marginBottom: 8, animation: 'breathe 2s ease-in-out infinite' }}>📷</div>
            <div style={{ fontFamily: 'var(--font-mono)', fontSize: 13 }}>Initialising camera…</div>
          </div>
        </div>
      )}

      {/* Camera permission denied */}
      {camError && (
        <div style={{ ...overlayStyle, background: 'rgba(127,29,29,.9)' }}>
          <div style={{ textAlign: 'center', color: '#fca5a5', padding: '0 24px' }}>
            <div style={{ fontSize: 36, marginBottom: 8 }}>🚫</div>
            <div style={{ fontSize: 14, fontWeight: 600, marginBottom: 4 }}>Camera access denied</div>
            <div style={{ fontSize: 12, opacity: 0.8 }}>Allow camera permission and refresh</div>
          </div>
        </div>
      )}

      {/* Scanning animation overlay */}
      {isScanning && (
        <>
          {/* Dark vignette */}
          <div style={{
            position:   'absolute', inset: 0,
            background: 'rgba(5,46,22,.35)',
            pointerEvents: 'none',
          }} aria-hidden="true" />
          {/* Scan line */}
          <div style={{
            position:   'absolute', left: 0, right: 0,
            height:     '3px',
            background: 'linear-gradient(90deg, transparent 0%, #4ade80 50%, transparent 100%)',
            boxShadow:  '0 0 12px #4ade80',
            animation:  'scanLine 1.2s linear infinite',
            pointerEvents: 'none',
          }} aria-hidden="true" />
          {/* Corner brackets */}
          <ScannerCorners color="#4ade80" />
          {/* Scanning label */}
          <div style={{
            position:    'absolute', bottom: 16, left: '50%',
            transform:   'translateX(-50%)',
            background:  'rgba(5,46,22,.85)',
            backdropFilter: 'blur(8px)',
            border:      '1px solid rgba(74,222,128,.3)',
            borderRadius: 99, padding: '6px 16px',
            fontSize: 13, fontWeight: 600, color: '#4ade80',
            fontFamily: 'var(--font-mono)',
            pointerEvents: 'none',
          }} aria-hidden="true">
            ◉ SCANNING
          </div>
        </>
      )}

      {/* Bounding box overlay */}
      {result?.bbox && !isScanning && (
        <BBoxOverlay bbox={result.bbox} color={borderColor} />
      )}

      {/* Category badge on camera */}
      {result && !isScanning && (
        <div style={{
          position:   'absolute', top: 12, left: 12,
          background: 'rgba(5,46,22,.85)',
          backdropFilter: 'blur(8px)',
          border:     `1px solid ${borderColor}40`,
          borderRadius: 8, padding: '4px 10px',
          fontSize: 12, fontWeight: 700,
          color: hc ? '#ffff00' : borderColor,
          fontFamily: 'var(--font-mono)',
          pointerEvents: 'none',
        }} aria-hidden="true">
          {result.detected_object}  ·  {Math.round(result.confidence * 100)}%
        </div>
      )}
    </div>
  );
}

function ScannerCorners({ color }) {
  const corner = (pos) => ({
    position: 'absolute', width: 24, height: 24,
    pointerEvents: 'none', ...pos,
  });
  const line = { position: 'absolute', background: color, borderRadius: 2 };
  const C = ({ style }) => (
    <div style={corner(style)} aria-hidden="true">
      <div style={{ ...line, top: 0, left: 0, width: 3, height: 24 }} />
      <div style={{ ...line, top: 0, left: 0, width: 24, height: 3 }} />
    </div>
  );
  return (
    <>
      <C style={{ top: 12, left: 12 }} />
      <C style={{ top: 12, right: 12, transform: 'scaleX(-1)' }} />
      <C style={{ bottom: 12, left: 12, transform: 'scaleY(-1)' }} />
      <C style={{ bottom: 12, right: 12, transform: 'scale(-1)' }} />
    </>
  );
}

function BBoxOverlay({ bbox, color }) {
  if (!bbox) return null;
  return (
    <svg
      style={{ position: 'absolute', inset: 0, width: '100%', height: '100%', pointerEvents: 'none' }}
      aria-hidden="true"
    >
      <defs>
        <filter id="glow">
          <feGaussianBlur stdDeviation="3" result="coloredBlur" />
          <feMerge><feMergeNode in="coloredBlur" /><feMergeNode in="SourceGraphic" /></feMerge>
        </filter>
      </defs>
      <rect
        x={bbox.x1} y={bbox.y1}
        width={bbox.x2 - bbox.x1} height={bbox.y2 - bbox.y1}
        fill="none" stroke={color} strokeWidth={2.5}
        strokeDasharray="8,4" rx={6}
        filter="url(#glow)"
        style={{ animation: 'breathe 1.5s ease-in-out infinite' }}
      />
    </svg>
  );
}

const overlayStyle = {
  position:       'absolute', inset: 0,
  display:        'flex',
  alignItems:     'center',
  justifyContent: 'center',
  background:     'rgba(5,46,22,.6)',
  backdropFilter: 'blur(4px)',
};
