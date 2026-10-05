/*
  Draws a simplified South Indian gopuram (temple tower) silhouette as an
  SVG, tier by tier, with a zig-zag "crenellation" pattern along each tier
  edge. Built programmatically so the markup in index.html stays clean.
*/
(function () {
  const svg = document.getElementById('gopuramSvg');
  if (!svg) return;

  const NS = 'http://www.w3.org/2000/svg';
  const W = 400;

  function el(name, attrs) {
    const node = document.createElementNS(NS, name);
    for (const k in attrs) node.setAttribute(k, attrs[k]);
    return node;
  }

  // Zig-zag crenellation strip between two widths at a given y, height h
  function crenellation(yTop, halfWidthTop, teeth, h) {
    const step = (halfWidthTop * 2) / teeth;
    let d = `M ${W / 2 - halfWidthTop} ${yTop}`;
    for (let i = 0; i < teeth; i++) {
      const xStart = W / 2 - halfWidthTop + i * step;
      const xMid = xStart + step / 2;
      const xEnd = xStart + step;
      d += ` L ${xMid} ${yTop - h} L ${xEnd} ${yTop}`;
    }
    return el('path', { d });
  }

  // One tapering tier: a trapezoid body + crenellation on top + small arch dots
  function tier(yTop, yBottom, halfTop, halfBottom, teeth) {
    const g = el('g', {});
    const body = el('path', {
      d: `M ${W / 2 - halfBottom} ${yBottom}
          L ${W / 2 - halfTop} ${yTop}
          L ${W / 2 + halfTop} ${yTop}
          L ${W / 2 + halfBottom} ${yBottom} Z`
    });
    g.appendChild(body);
    g.appendChild(crenellation(yTop, halfTop, teeth, (yBottom - yTop) * 0.35));

    // small arch niches along the tier
    const niches = Math.max(3, teeth - 2);
    const span = halfBottom * 2 * 0.82;
    for (let i = 0; i < niches; i++) {
      const cx = W / 2 - span / 2 + (span / niches) * (i + 0.5);
      const cy = yBottom - (yBottom - yTop) * 0.35;
      g.appendChild(el('circle', { cx, cy, r: 3.2, class: 'filled' }));
    }
    return g;
  }

  const root = el('g', {});

  // Finial / kalasha at the very top
  root.appendChild(el('path', { d: 'M 200 8 L 196 24 L 204 24 Z', class: 'filled' }));
  root.appendChild(el('circle', { cx: 200, cy: 30, r: 5, class: 'filled' }));

  // Tiers, tapering from narrow top to wide base
  const tiers = [
    { yTop: 40,  yBottom: 78,  halfTop: 34,  halfBottom: 52,  teeth: 5 },
    { yTop: 78,  yBottom: 122, halfTop: 52,  halfBottom: 74,  teeth: 6 },
    { yTop: 122, yBottom: 172, halfTop: 74,  halfBottom: 100, teeth: 7 },
    { yTop: 172, yBottom: 228, halfTop: 100, halfBottom: 128, teeth: 8 },
    { yTop: 228, yBottom: 290, halfTop: 128, halfBottom: 158, teeth: 9 },
  ];
  tiers.forEach(t => root.appendChild(tier(t.yTop, t.yBottom, t.halfTop, t.halfBottom, t.teeth)));

  // Grand archway (the sculpted entrance arch above the doors)
  root.appendChild(el('path', {
    d: `M 128 340 Q 128 292 168 288 Q 200 286 232 288 Q 272 292 272 340 L 272 400 L 128 400 Z`
  }));
  root.appendChild(el('path', {
    d: `M 148 340 Q 148 306 172 302 Q 200 300 228 302 Q 252 306 252 340 L 252 400 L 148 400 Z`
  }));

  // Base plinth / steps
  root.appendChild(el('rect', { x: 60, y: 400, width: 280, height: 14 }));
  root.appendChild(el('rect', { x: 44, y: 414, width: 312, height: 14 }));
  root.appendChild(el('rect', { x: 28, y: 428, width: 344, height: 14 }));

  // Pillars flanking the doorway
  for (const side of [-1, 1]) {
    const cx = 200 + side * 118;
    root.appendChild(el('line', { x1: cx, y1: 300, x2: cx, y2: 400, }));
    root.appendChild(el('circle', { cx, cy: 300, r: 6 }));
  }

  svg.appendChild(root);
})();
