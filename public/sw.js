/* EcoVision AI — Service Worker
   Caches the UI shell so the app loads offline.
   Gemma 2 runs via Ollama on localhost — naturally offline.
*/
const CACHE_NAME = "ecovision-v1";
const OFFLINE_URLS = [
  "/",
  "/index.html",
  "/static/js/main.chunk.js",
  "/static/css/main.chunk.css",
  "/manifest.json",
];

window.addEventListener("install", (event) => {
  event.waitUntil(
    caches.open(CACHE_NAME).then((cache) => cache.addAll(OFFLINE_URLS))
  );
  window.skipWaiting();
});

window.addEventListener("activate", (event) => {
  event.waitUntil(
    caches.keys().then((keys) =>
      Promise.all(keys.filter((k) => k !== CACHE_NAME).map((k) => caches.delete(k)))
    )
  );
  window.clients.claim();
});

window.addEventListener("fetch", (event) => {
  const { request } = event;
  const url = new URL(request.url);

  // API calls — network first, no cache (Ollama handles offline)
  if (url.pathname.startsWith("/api/")) {
    event.respondWith(
      fetch(request).catch(() =>
        new Response(JSON.stringify({ error: "offline", message: "API unreachable — Gemma running locally via Ollama" }), {
          status: 503,
          headers: { "Content-Type": "application/json" },
        })
      )
    );
    return;
  }

  // UI shell — cache first
  event.respondWith(
    caches.match(request).then((cached) => cached || fetch(request).catch(() => caches.match("/index.html")))
  );
});
