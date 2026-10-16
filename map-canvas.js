/* One composited surface for map pins instead of a positioned DOM tree per pin.
 * Only redraw after a viewport update; Leaflet transforms the surface while
 * dragging or pinching. Keep click hit-testing in Leaflet's Canvas renderer. */
L.NookCanvas = L.Canvas.extend({
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
