// Estado del proyecto abierto. El backend es la fuente de verdad del parser y del .ass:
// aquí solo se guardan los tiempos (que cambian en tiempo real al marcar) y se pide
// al servidor que vuelva a compilar.
import { api, $ } from './util.js';

export const S = {
  slug: null,
  project: null,   // {name, lyrics, chars, style, times, video, output, ...}
  lines: [],       // [{charKey, syls:[{text,t0,t1}]}] — los tiempos viven aquí
  ass: '',
  size: [1280, 720],
};

const listeners = {};
export function on(ev, fn){ (listeners[ev] ||= []).push(fn); }
export function emit(ev, data){ (listeners[ev] || []).forEach(fn => fn(data)); }

export function snapshot(){
  return { ...S.project, times: S.lines.map(l => l.syls.map(s => [s.t0, s.t1])) };
}

export const off = () => (S.project?.style.offset || 0) / 1000;

/* ---------- compilar (letra → versos, tiempos → .ass) ---------- */
let compileTimer = null, busy = false, again = false;

export function recompile(delay = 120){
  clearTimeout(compileTimer);
  compileTimer = setTimeout(runCompile, delay);
}

function sameShape(a, b){
  return a.length === b.length && a.every((l, i) => l.syls.length === b[i].syls.length && l.charKey === b[i].charKey &&
    l.syls.every((s, k) => s.text === b[i].syls[k].text));
}

async function runCompile(){
  if(busy){ again = true; return; }
  busy = true;
  const snap = snapshot();
  try {
    const r = await api.post('/api/compile', snap);
    if(snap.lyrics === S.project.lyrics){
      // Si la estructura no cambió, los tiempos locales mandan: pudieron cambiar
      // mientras esperábamos la respuesta (se sigue marcando).
      const shapeChanged = !sameShape(S.lines, r.lines);
      if(shapeChanged) S.lines = r.lines;
      S.project.chars = r.chars;
      S.ass = r.ass;
      const sizeChanged = r.size[0] !== S.size[0] || r.size[1] !== S.size[1];
      S.size = r.size;
      if(shapeChanged) emit('lines');
      if(sizeChanged) emit('size');
      emit('ass');
    } else again = true;
  } catch(e){
    emit('error', e);
  } finally {
    busy = false;
    if(again){ again = false; runCompile(); }
  }
}

/* ---------- autoguardado ---------- */
let saveTimer = null;
export function changed({ compile = true, delay } = {}){
  if(compile) recompile(delay);
  backupLocal();
  setSaveState('Sin guardar…');
  clearTimeout(saveTimer);
  saveTimer = setTimeout(saveNow, 1000);
}

export async function saveNow(){
  clearTimeout(saveTimer);
  if(!S.slug) return;
  try {
    await api.put(`/api/projects/${S.slug}`, snapshot());
    setSaveState('Guardado');
  } catch(e){
    setSaveState('No se pudo guardar');
    emit('error', e);
  }
}

function backupLocal(){
  try { localStorage.setItem('kf-backup-' + S.slug, JSON.stringify({ at: Date.now(), project: snapshot() })); } catch(e){}
}

export function readBackup(slug){
  try { return JSON.parse(localStorage.getItem('kf-backup-' + slug) || 'null'); } catch(e){ return null; }
}

function setSaveState(t){ const el = $('#saveState'); if(el) el.textContent = t; }

window.addEventListener('beforeunload', () => {
  if(saveTimer && S.slug){
    navigator.sendBeacon?.(`/api/projects/${S.slug}/beacon`, new Blob([JSON.stringify(snapshot())], { type:'application/json' }));
  }
});

/* ---------- utilidades de versos ---------- */
export function lineText(l){ return l.syls.map(s => s.text).join('').trimEnd(); }
export function lineStatus(l){
  const n = l.syls.filter(s => s.t0 != null && s.t1 != null).length;
  return n === 0 ? 'none' : n === l.syls.length ? 'ok' : 'part';
}
export function timedSpan(l){
  const t = l.syls.filter(s => s.t0 != null && s.t1 != null);
  if(!t.length) return null;
  return { s: Math.min(...t.map(x => x.t0)) + off(), e: Math.max(...t.map(x => x.t1)) + off() };
}
