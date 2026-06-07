import { create } from 'zustand';

export const useAppStore = create((set, get) => ({
  // ── Detection result ──────────────────────────────────────────────
  result:       null,
  history:      [],       // last 10 scans
  isScanning:   false,
  error:        null,

  // ── AI / system status ────────────────────────────────────────────
  systemStatus: null,

  // ── Accessibility preferences ─────────────────────────────────────
  speechRate:   1.0,
  highContrast: false,
  fontSize:     100,      // percentage: 100 | 125 | 150 | 175 | 200
  language:     'en',     // 'en' | 'hi'

  // ── Voice ─────────────────────────────────────────────────────────
  lastGuidanceText: null,

  // ── Actions ───────────────────────────────────────────────────────
  setResult: (result) =>
    set((s) => ({
      result,
      history:          result ? [result, ...s.history].slice(0, 10) : s.history,
      error:            null,
      lastGuidanceText: result?.guidance?.text ?? s.lastGuidanceText,
    })),

  setScanning: (v)     => set({ isScanning: v }),
  setError:    (e)     => set({ error: e, isScanning: false }),
  setStatus:   (s)     => set({ systemStatus: s }),

  setSpeechRate:   (r) => set({ speechRate:   Math.max(0.5, Math.min(2.0, r)) }),
  setHighContrast: (v) => set({ highContrast: v }),
  setFontSize:     (s) => set({ fontSize:     s }),
  setLanguage:     (l) => set({ language:     l }),
  clearError:      ()  => set({ error: null }),
}));
