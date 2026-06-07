import { useState, useRef, useCallback, useEffect } from "react";

/**
 * useVoice — all audio-related logic for EcoVision AI.
 * Handles:
 *   - TTS via backend audio blob OR browser SpeechSynthesis fallback
 *   - STT via Web Speech API (voice commands)
 *   - Adjustable speech rate
 *   - Global keyboard shortcuts
 */
export function useVoice({ onScanCommand, onRepeatCommand, onHistoryCommand, onHelpCommand }) {
  const audioRef       = useRef(new Audio());
  const recognitionRef = useRef(null);
  const lastTextRef    = useRef("");

  const [speechRate,    setSpeechRate]    = useState(1.0);
  const [isListening,   setIsListening]   = useState(false);
  const [voiceSupported, setVoiceSupported] = useState(false);

  // ── Speak: backend audio blob first, Web Speech API fallback ─────────────
  const speak = useCallback((text, audioBase64 = null, format = null) => {
    if (!text) return;
    lastTextRef.current = text;

    // Try backend TTS audio (Azure or pyttsx3)
    if (audioBase64) {
      try {
        const mime = format === "mp3" ? "audio/mpeg" : "audio/wav";
        const bytes = Uint8Array.from(atob(audioBase64), c => c.charCodeAt(0));
        const blob  = new Blob([bytes], { type: mime });
        const url   = URL.createObjectURL(blob);
        const audio = audioRef.current;
        audio.src           = url;
        audio.playbackRate  = speechRate;
        audio.play()
          .then(() => URL.revokeObjectURL(url))
          .catch(() => speakBrowser(text)); // fallback
        return;
      } catch {
        // fall through
      }
    }
    speakBrowser(text);
  }, [speechRate]);

  const speakBrowser = useCallback((text) => {
    if (!window.speechSynthesis || !text) return;
    window.speechSynthesis.cancel();
    const utt   = new SpeechSynthesisUtterance(text);
    utt.rate    = speechRate;
    utt.lang    = "en-IN";
    utt.volume  = 1;
    // Pick a natural voice if available
    const voices = window.speechSynthesis.getVoices();
    const preferred = voices.find(v => v.lang.startsWith("en") && v.name.includes("Female"))
                   || voices.find(v => v.lang.startsWith("en"))
                   || voices[0];
    if (preferred) utt.voice = preferred;
    window.speechSynthesis.speak(utt);
  }, [speechRate]);

  const repeatLast = useCallback(() => {
    if (lastTextRef.current) speakBrowser(lastTextRef.current);
  }, [speakBrowser]);

  const stopSpeaking = useCallback(() => {
    window.speechSynthesis?.cancel();
    audioRef.current.pause();
    audioRef.current.currentTime = 0;
  }, []);

  // ── Speech rate change — re-apply on existing audio ───────────────────────
  const changeSpeechRate = useCallback((delta) => {
    setSpeechRate(r => {
      const next = Math.min(Math.max(r + delta, 0.5), 2.0);
      audioRef.current.playbackRate = next;
      speakBrowser(`Speech speed: ${next.toFixed(1)} times`);
      return next;
    });
  }, [speakBrowser]);

  // ── Voice command recognition (Web Speech API) ────────────────────────────
  const startListening = useCallback(() => {
    const SR = window.SpeechRecognition || window.webkitSpeechRecognition;
    if (!SR) return;

    const rec = new SR();
    rec.lang       = "en-IN";
    rec.continuous = false;
    rec.interimResults = false;

    rec.onstart  = () => setIsListening(true);
    rec.onend    = () => setIsListening(false);
    rec.onerror  = () => setIsListening(false);

    rec.onresult = (e) => {
      const transcript = e.results[0]?.[0]?.transcript?.toLowerCase() || "";
      if (transcript.match(/scan|detect|check|identify|what is/))  onScanCommand?.();
      else if (transcript.match(/repeat|again|say again/))          onRepeatCommand?.();
      else if (transcript.match(/history|last|previous/))           onHistoryCommand?.();
      else if (transcript.match(/help|commands|what can/))          onHelpCommand?.();
      else if (transcript.match(/faster|speed up/))                 changeSpeechRate(0.25);
      else if (transcript.match(/slower|slow down/))                changeSpeechRate(-0.25);
    };

    recognitionRef.current = rec;
    try { rec.start(); } catch { setIsListening(false); }
  }, [onScanCommand, onRepeatCommand, onHistoryCommand, onHelpCommand, changeSpeechRate]);

  // ── Global keyboard shortcuts ─────────────────────────────────────────────
  useEffect(() => {
    const handleKey = (e) => {
      // Don't fire in inputs
      if (["INPUT","TEXTAREA","SELECT"].includes(e.target.tagName)) return;

      switch (e.code) {
        case "Space":
        case "Enter":
          if (e.code === "Space") e.preventDefault(); // prevent page scroll
          onScanCommand?.();
          break;
        case "KeyR": repeatLast();          break;
        case "KeyH": onHistoryCommand?.();  break;
        case "F1":   e.preventDefault(); onHelpCommand?.(); break;
        case "KeyV": startListening();      break;
        default:
          if (e.key === "+" || e.key === "=") changeSpeechRate( 0.25);
          if (e.key === "-" || e.key === "_") changeSpeechRate(-0.25);
          break;
      }
    };
    window.addEventListener("keydown", handleKey);
    return () => window.removeEventListener("keydown", handleKey);
  }, [onScanCommand, repeatLast, onHistoryCommand, onHelpCommand, startListening, changeSpeechRate]);

  // ── Detect browser STT support ────────────────────────────────────────────
  useEffect(() => {
    setVoiceSupported(!!(window.SpeechRecognition || window.webkitSpeechRecognition));
    // Pre-load voices (Chrome async)
    window.speechSynthesis?.getVoices();
    window.speechSynthesis?.addEventListener("voiceschanged", () => window.speechSynthesis.getVoices());
  }, []);

  return {
    speak,
    speakBrowser,
    repeatLast,
    stopSpeaking,
    speechRate,
    setSpeechRate,
    changeSpeechRate,
    isListening,
    startListening,
    voiceSupported,
    audioRef,
  };
}
