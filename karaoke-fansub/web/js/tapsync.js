// Marcado de tiempos (tap-sync): mantener Espacio mientras suena cada sílaba.
// Lógica portada del prototipo.
import { $, toast, typingIn } from './util.js';
import { S, emit, changed, lineStatus, timedSpan, off } from './store.js';
import { P } from './player.js';

export const T = { sync: false, tapping: false, cursor: { li: 0, si: 0 } };

export function curSyl(){ const l = S.lines[T.cursor.li]; return l ? l.syls[T.cursor.si] : null; }

export function clampCursor(){
  const c = T.cursor;
  if(c.li > S.lines.length) c.li = S.lines.length;
  if(S.lines[c.li] && c.si >= S.lines[c.li].syls.length) c.si = 0;
  if(c.li < 0) c.li = 0;
}

function advance(){
  const l = S.lines[T.cursor.li]; if(!l) return;
  if(T.cursor.si < l.syls.length - 1) T.cursor.si++;
  else if(T.cursor.li < S.lines.length - 1) T.cursor = { li: T.cursor.li + 1, si: 0 };
  else T.cursor = { li: S.lines.length, si: 0 };
}

export function retreat(){
  if(!S.lines.length) return;
  if(T.cursor.li >= S.lines.length){ const li = S.lines.length - 1; T.cursor = { li, si: S.lines[li].syls.length - 1 }; return; }
  if(T.cursor.si > 0) T.cursor.si--;
  else if(T.cursor.li > 0){ T.cursor.li--; T.cursor.si = S.lines[T.cursor.li].syls.length - 1; }
}

export function lineCueTime(li){
  const l = S.lines[li]; if(!l) return 0;
  if(l.syls[0].t0 != null) return l.syls[0].t0;
  for(let j = li - 1; j >= 0; j--){ const sp = timedSpan(S.lines[j]); if(sp) return sp.e - off(); }
  return 0;
}

export function startSync(li){
  if(!S.lines.length) return toast('Primero escribe la letra');
  if(document.activeElement) document.activeElement.blur();
  T.sync = true;
  if(li != null) T.cursor = { li, si: 0 };
  else { const f = S.lines.findIndex(l => lineStatus(l) !== 'ok'); T.cursor = { li: f < 0 ? 0 : f, si: 0 }; }
  P.seek(Math.max(0, lineCueTime(T.cursor.li) - 1.8)); P.play();
  updateSyncUI();
}

export function stopSync(){ if(T.tapping) tapUp(); T.sync = false; P.pause(); updateSyncUI(); }

function tapDown(){
  if(!T.sync || T.tapping) return;
  const s = curSyl(); if(!s){ toast('Listo, marcaste todas las sílabas'); return; }
  if(!P.isPlaying()) P.play();
  s.t0 = P.now(); s.t1 = s.t0 + 0.02; T.tapping = true;
  $('#tapBtn').classList.add('down');
}

export function tapUp(){
  if(!T.tapping) return;
  const s = curSyl(); if(s) s.t1 = Math.max(P.now(), s.t0 + 0.03);
  T.tapping = false; $('#tapBtn').classList.remove('down');
  advance(); changed({ delay: 0 }); emit('times'); updateSyncUI();
}

/** Se llama en cada cuadro: mientras se mantiene Espacio, la sílaba crece en vivo. */
let lastLive = 0;
export function frameTick(ts){
  if(!T.tapping) return;
  const s = curSyl(); if(s) s.t1 = Math.max(s.t0 + 0.02, P.now());
  if(ts - lastLive > 150){ lastLive = ts; changed({ delay: 0 }); }
}

export function replayLine(){
  if(!T.sync || !S.lines.length) return;
  T.cursor.si = 0;
  if(T.cursor.li >= S.lines.length) T.cursor.li = S.lines.length - 1;
  P.seek(Math.max(0, lineCueTime(T.cursor.li) - 1.8)); P.play(); updateSyncUI();
}

export function goToLine(i){
  T.cursor = { li: i, si: 0 };
  if(T.sync) replayLine();
  else { P.seek(Math.max(0, lineCueTime(i) - 1)); updateSyncUI(); }
}

export function updateSyncUI(){
  $('#syncBtn').textContent = T.sync ? 'Dejar de marcar' : 'Empezar a marcar';
  $('#syncBtn').classList.toggle('primary', !T.sync);
  $('#tapBtn').disabled = !T.sync;
  $('#syncState').innerHTML = T.sync ? '<span class="rec-dot"></span> Marcando: mantén apretado mientras suena cada sílaba' : 'Elige un verso en la lista para marcar desde ahí.';
  const l = S.lines[T.cursor.li], s = curSyl();
  const ns = $('#nextSyl'), nc = $('#nextCtx');
  if(!l || !s){ ns.textContent = S.lines.length ? '¡Terminado!' : '—'; ns.style.color = ''; nc.textContent = S.lines.length ? 'Revisa la vista previa o exporta.' : ''; return; }
  const ch = S.project.chars[l.charKey] || { color: '#fff', name: '' };
  ns.textContent = s.text.trim(); ns.style.color = ch.color;
  nc.innerHTML = '';
  nc.append(`Verso ${T.cursor.li + 1} · ${ch.name} · `);
  l.syls.forEach((x, k) => { if(k === T.cursor.si){ const mk = document.createElement('mark'); mk.textContent = x.text; nc.append(mk); } else nc.append(x.text); });
  emit('cursor');
}

export function initTapsync(){
  $('#syncBtn').addEventListener('click', () => {
    if(T.sync) return stopSync();
    const l = S.lines[T.cursor.li];
    startSync(l && lineStatus(l) !== 'ok' ? T.cursor.li : null);
  });
  const tapBtn = $('#tapBtn');
  tapBtn.addEventListener('pointerdown', e => { e.preventDefault(); tapBtn.setPointerCapture(e.pointerId); tapDown(); });
  ['pointerup', 'pointercancel'].forEach(ev => tapBtn.addEventListener(ev, () => tapUp()));
  tapBtn.addEventListener('contextmenu', e => e.preventDefault());

  window.addEventListener('keydown', e => {
    if(typingIn(e.target) || e.ctrlKey || e.metaKey || e.altKey) return;
    if(e.code === 'Space'){
      // Espacio sobre un botón con foco no debe "hacer clic": aquí manda el karaoke.
      e.preventDefault(); if(e.repeat) return;
      T.sync ? tapDown() : P.toggle();
    }
    else if(e.shiftKey && e.key.startsWith('Arrow')) return; // Shift+flechas: afinar en la línea de tiempo
    else if(e.key === 'ArrowLeft' && !e.target.closest?.('.tabs')){ e.preventDefault(); P.seek(P.now() - 2); }
    else if(e.key === 'ArrowRight' && !e.target.closest?.('.tabs')){ e.preventDefault(); P.seek(P.now() + 2); }
    else if(T.sync && (e.key === 'r' || e.key === 'R')) replayLine();
    else if(T.sync && e.key === 'Backspace'){ e.preventDefault(); retreat(); updateSyncUI(); }
    else if(T.sync && e.key === 'Escape') stopSync();
  });
  window.addEventListener('keyup', e => {
    if(e.code === 'Space' && !typingIn(e.target)){ e.preventDefault(); if(T.sync) tapUp(); }
  });
  window.addEventListener('blur', () => tapUp());
}
