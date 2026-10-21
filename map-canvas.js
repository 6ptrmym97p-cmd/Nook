/* One composited surface for map pins instead of a positioned DOM tree per pin.
 * Only redraw after a viewport update; Leaflet transforms the surface while
 * dragging or pinching. Keep click hit-testing in Leaflet's Canvas renderer. */
L.NookCanvas = L.Canvas.extend({
  options: { maxBackingPixels: 6000000 },

  _update() {
    if (this._map._animatingZoom && this._bounds) return;
    L.Renderer.prototype._update.call(this);
    const bounds = this._bounds;
    const size = bounds.getSize();
    const canvas = this._container;
    // Large Retina viewports otherwise create a 15–30 megapixel pin surface.
    // Keep native sharpness on small screens and at least one pixel per CSS
    // pixel on desktop. Geometry and hit testing remain in Leaflet CSS pixels.
    const nativeRatio = L.Browser.retina ? 2 : 1;
    const ratio = Math.min(nativeRatio, Math.max(1, Math.sqrt(this.options.maxBackingPixels / Math.max(1, size.x * size.y))));
    L.DomUtil.setPosition(canvas, bounds.min);
    canvas.width = Math.round(size.x * ratio);
    canvas.height = Math.round(size.y * ratio);
    canvas.style.width = `${size.x}px`;
    canvas.style.height = `${size.y}px`;
    this._ctx.scale(ratio, ratio);
    this._ctx.translate(-bounds.min.x, -bounds.min.y);
    this.fire("update");
  },

  _updateCircle(layer) {
    L.Canvas.prototype._updateCircle.call(this, layer);
    if (!this._drawing || layer._empty() || !layer.options.pinLabel) return;
    const context = this._ctx;
    context.save();
    context.globalAlpha = 1;
    context.fillStyle = "#fffdf8";
    context.font = `700 ${layer.options.pinFontSize || 12}px system-ui, sans-serif`;
    context.textAlign = "center";
    context.textBaseline = "middle";
    context.fillText(layer.options.pinLabel, layer._point.x, layer._point.y + 0.5);
    context.restore();
  },
});

L.nookPin = function (latlng, options) {
  return L.circleMarker(latlng, {
    color: "#fffdf8", weight: 2, fillOpacity: 1, opacity: 1,
    bubblingMouseEvents: false,
    ...options,
  });
};
