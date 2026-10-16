function preventBrowserZoom(event) {
  // Leaflet handles pinch and double tap itself. Cancelling these gestures on
  // document also cancels rapid map/control clicks, especially on iOS.
  if (event.target.closest?.(".leaflet-container")) return;
  event.preventDefault();
}

["gesturestart", "gesturechange", "gestureend"].forEach((eventName) => {
  document.addEventListener(eventName, preventBrowserZoom, { passive: false });
});

let lastTouchEnd = 0;
document.addEventListener("touchend", (event) => {
  if (event.target.closest?.(".leaflet-container")) {
    lastTouchEnd = 0;
    return;
  }
  const now = Date.now();
  if (now - lastTouchEnd <= 300) event.preventDefault();
  lastTouchEnd = now;
}, { passive: false });

if ("serviceWorker" in navigator && window.isSecureContext) {
  window.addEventListener("load", () => {
    navigator.serviceWorker.register("./service-worker.js").catch((error) => {
      console.warn("Offline ondersteuning kon niet worden gestart.", error);
    });
  });
}
