const API_URL = process.env.REACT_APP_API_URL || "https://api.aivisionpro.xyz";
const WS_URL  = process.env.REACT_APP_WS_URL  || "wss://api.aivisionpro.xyz";

// ── Waste detection ──────────────────────────────────────────────────────────
export async function detectWaste({ imageBase64, language = 'en', tts = true }) {
  const res = await fetch(`${API_URL}/api/v1/detect`, {
    method:  'POST',
    headers: { 'Content-Type': 'application/json' },
    body:    JSON.stringify({ image_base64: imageBase64, language, tts }),
  });
  if (!res.ok) {
    const err = await res.json().catch(() => ({}));
    throw new Error(err.detail || `Detection failed (${res.status})`);
  }
  return res.json();
}

// ── System health ────────────────────────────────────────────────────────────
export async function fetchHealth() {
  const res = await fetch(`${API_URL}/api/v1/health`);
  if (!res.ok) throw new Error('Health check failed');
  return res.json();
}

// ── Voice synthesis ──────────────────────────────────────────────────────────
export async function synthesizeText({ text, language = 'en', voiceName }) {
  const res = await fetch(`${API_URL}/api/v1/voice/synthesize`, {
    method:  'POST',
    headers: { 'Content-Type': 'application/json' },
    body:    JSON.stringify({ text, language, voice_name: voiceName }),
  });
  if (!res.ok) return null;
  return res.json();
}

// ── Voice commands list ──────────────────────────────────────────────────────
export async function fetchVoiceCommands() {
  const res = await fetch(`${API_URL}/api/v1/voice/commands`);
  if (!res.ok) return [];
  const data = await res.json();
  return data.commands || [];
}

// ── WebSocket stream ─────────────────────────────────────────────────────────
export function createDetectionStream(onMessage, onError) {
  const ws = new WebSocket(`${WS_URL}/api/v1/detect/stream`);
  ws.onmessage = (e) => { try { onMessage(JSON.parse(e.data)); } catch {} };
  ws.onerror   = (e) => onError?.(e);
  return ws;
}

// ── Audio helpers ────────────────────────────────────────────────────────────
export function b64ToAudioBlob(b64, format) {
  const bytes = Uint8Array.from(atob(b64), (c) => c.charCodeAt(0));
  const mime  = format === 'mp3' ? 'audio/mpeg' : 'audio/wav';
  return new Blob([bytes], { type: mime });
}
