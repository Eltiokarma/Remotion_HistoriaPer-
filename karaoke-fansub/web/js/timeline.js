// Línea de tiempo: dos carriles (filas alternas), bordes arrastrables y afinado con teclado.
import { $, fmt, isControl } from './util.js';
import { S, changed, emit, off } from './store.js';
import { P } from './player.js';
import { T } from './tapsync.js';

const tl = $('#tl'), tctx = tl.getContext('2d');
const SPAN = 9, LANE = [22, 48], LH = 22, EDGE_PX = 6, MIN_DUR = 0.03;
let drag = null;
export const sel = { li: -1, si: -1 };

function geom(){ const r = tl.getBoundingClientRect(); return { w: r.width, h: r.height, left: r.left, top: r.top }; }
function viewStart(t){ return t - SPAN * 0.3; }

export function drawTimeline(){
  const t = P.now(), dpr = window.devicePixelRatio || 1, g = geom();
  if(tl.width !== Math.round(g.w * dpr) || tl.height !== Math.round(g.h * dpr)){ tl.width = Math.round(g.w * dpr); tl.height = Math.round(g.h * dpr); }
  tctx.setTransform(dpr, 0, 0, dpr, 0, 0);
  tctx.clearRect(0, 0, g.w, g.h);
  const t0 = viewStart(t), pps = g.w / SPAN, o = off();
  tctx.strokeStyle = '#2c3144'; tctx.fillStyle = '#959bad'; tctx.font = '500 10px ui-monospace, Consolas, monospace'; tctx.lineWidth = 1;
  for(let s = Math.ceil(t0); s < t0 + SPAN; s++){
    const x = (s - t0) * pps;
    tctx.beginPath(); tctx.moveTo(x, 0); tctx.lineTo(x, 8); tctx.stroke();
    tctx.fillText(fmt(s).replace(/\.\d+$/, ''), x + 3, 10);
  }
  S.lines.forEach((l, i) => {
    const ch = S.project.chars[l.charKey] || { color: '#fff' };
    l.syls.forEach((s, k) => {
      if(s.t0 == null || s.t1 == null) return;
      const a = (s.t0 + o - t0) * pps, b = (s.t1 + o - t0) * pps;
      if(b < 0 || a > g.w) return;
      const y = LANE[i % 2];
      const active = (T.sync && i === T.cursor.li && k === T.cursor.si) || (i === sel.li && k === sel.si);
      tctx.fillStyle = ch.color; tctx.globalAlpha = active ? 1 : .8;
      tctx.fillRect(a, y, Math.max(2, b - a - 1), LH);
      tctx.globalAlpha = 1;
      if(i === sel.li && k === sel.si){ tctx.strokeStyle = '#fff'; tctx.lineWidth = 2; tctx.strokeRect(a + 1, y + 1, Math.max(2, b - a - 3), LH - 2); tctx.lineWidth = 1; }
      if(b - a > 16){
        tctx.fillStyle = '#0f1118'; tctx.font = '600 11px system-ui, sans-serif';
        tctx.save(); tctx.beginPath(); tctx.rect(a, y, b - a - 2, LH); tctx.clip();
        tctx.fillText(s.text.trim(), a + 3, y + 15); tctx.restore();
      }
    });
  });
  const px = (t - t0) * pps;
  tctx.fillStyle = '#f2b33d'; tctx.fillRect(px - 1, 0, 2, g.h);
}

function hit(clientX, clientY){
  const g = geom(), x = clientX - g.left, y = clientY - g.top, t0 = viewStart(P.now()), pps = g.w / SPAN, o = off();
  let body = null;
  for(let i = 0; i < S.lines.length; i++){
    const ly = LANE[i % 2]; if(y < ly - 4 || y > ly + LH + 4) continue;
    const syls = S.lines[i].syls;
    for(let k = 0; k < syls.length; k++){
      const s = syls[k]; if(s.t0 == null || s.t1 == null) continue;
      const a = (s.t0 + o - t0) * pps, b = (s.t1 + o - t0) * pps;
      if(Math.abs(x - a) <= EDGE_PX) return { li: i, si: k, edge: 't0' };
      if(Math.abs(x - b) <= EDGE_PX) return { li: i, si: k, edge: 't1' };
      if(x > a && x < b) body = { li: i, si: k, edge: null };
    }
  }
  return body;
}

function select(li, si){ sel.li = li; sel.si = si; emit('select'); }

/** Mueve un borde sin pisar la sílaba vecina del mismo verso. */
function setEdge(li, si, edge, t){
  const syls = S.lines[li].syls, s = syls[si];
  const prev = syls[si - 1], next = syls[si + 1];
  if(edge === 't0'){
    let v = Math.min(t, s.t1 - MIN_DUR);
    if(prev && prev.t1 != null) v = Math.max(v, prev.t1);
    s.t0 = Math.max(0, v);
  } else {
    let v = Math.max(t, s.t0 + MIN_DUR);
    if(next && next.t0 != null) v = Math.min(v, next.t0);
    s.t1 = v;
  }
}

export function initTimeline(){
  tl.addEventListener('pointerdown', e => {
    tl.setPointerCapture(e.pointerId);
    const h = hit(e.clientX, e.clientY);
    if(h) select(h.li, h.si);
    drag = h && h.edge ? { mode: 'edge', ...h } : { mode: 'pan', x: e.clientX, t: P.now() };
    tl.classList.add('dragging');
  });
  tl.addEventListener('pointermove', e => {
    if(!drag){ const h = hit(e.clientX, e.clientY); tl.style.cursor = h && h.edge ? 'ew-resize' : ''; return; }
    const g = geom(), pps = g.w / SPAN;
    if(drag.mode === 'pan'){ P.seek(drag.t - (e.clientX - drag.x) / pps); return; }
    const tt = viewStart(P.now()) + (e.clientX - g.left) / pps - off();
    setEdge(drag.li, drag.si, drag.edge, tt);
    changed({ delay: 60 });
  });
  const end = () => {
    if(!drag) return;
    if(drag.mode === 'edge'){ changed({ delay: 0 }); emit('times'); }
    drag = null; tl.classList.remove('dragging');
  };
  tl.addEventListener('pointerup', end); tl.addEventListener('pointercancel', end);

  // Teclado: , . eligen sílaba; Shift+←/→ mueven el inicio; Ctrl+←/→ el final (10 ms).
  // (Alt+← no se usa: en el navegador es "Atrás".)
  window.addEventListener('keydown', e => {
    if(isControl(e.target)) return;  // Shift/Ctrl+flechas en la letra o en un slider son suyas
    const onTl = document.activeElement === tl;
    const fine = (e.shiftKey || e.ctrlKey) && (e.key === 'ArrowLeft' || e.key === 'ArrowRight');
    if(!onTl && !fine) return;
    if(onTl && (e.key === ',' || e.key === '.')){
      e.preventDefault();
      const flat = [];
      S.lines.forEach((l, i) => l.syls.forEach((s, k) => { if(s.t0 != null) flat.push([i, k]); }));
      if(!flat.length) return;
      let idx = flat.findIndex(([i, k]) => i === sel.li && k === sel.si);
      if(idx < 0){ const t = P.now() - off(); idx = Math.max(0, flat.findIndex(([i, k]) => S.lines[i].syls[k].t1 >= t)); }
      else idx = Math.max(0, Math.min(flat.length - 1, idx + (e.key === '.' ? 1 : -1)));
      select(...flat[idx]);
      const s = S.lines[sel.li].syls[sel.si];
      if(!P.isPlaying()) P.seek(s.t0 + off());
      return;
    }
    if(fine && sel.li >= 0 && S.lines[sel.li]?.syls[sel.si]){
      e.preventDefault();
      const s = S.lines[sel.li].syls[sel.si]; if(s.t0 == null) return;
      const d = (e.key === 'ArrowRight' ? 1 : -1) * 0.01, edge = e.ctrlKey ? 't1' : 't0';
      setEdge(sel.li, sel.si, edge, s[edge] + d);
      if(!P.isPlaying()) P.seek(s[edge] + off());
      changed({ delay: 80 }); emit('times');
    }
  });
}
