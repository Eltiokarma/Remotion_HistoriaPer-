import { $, api, fmt, toast, darken, downloadFrom } from './util.js';
import { S, on, emit, changed, saveNow, recompile, readBackup, snapshot, lineText, lineStatus, timedSpan } from './store.js';
import { P, vid } from './player.js';
import { T, initTapsync, updateSyncUI, clampCursor, frameTick, goToLine, stopSync } from './tapsync.js';
import { initTimeline, drawTimeline } from './timeline.js';
import { initPreview } from './preview.js';
import { initExport } from './export.js';

let STATUS = null;

/* ---------- proyecto ---------- */
async function refreshProjectList(){
  const list = await api.get('/api/projects');
  const sel = $('#projSel'); sel.innerHTML = '';
  list.forEach(p => { const o = document.createElement('option'); o.value = p.slug; o.textContent = p.name; sel.append(o); });
  if(S.slug) sel.value = S.slug;
  return list;
}

async function loadProject(slug, updated){
  if(T.sync) stopSync();
  if(S.slug) await saveNow();
  const r = await api.get(`/api/projects/${slug}`);
  let project = r.project;
  const bk = readBackup(slug);
  const differs = bk && (JSON.stringify(bk.project.times) !== JSON.stringify(project.times) || bk.project.lyrics !== project.lyrics);
  if(differs && updated && bk.at / 1000 > updated + 2){
    project = { ...bk.project, video: project.video };
    toast('Recuperé cambios que no alcanzaron a guardarse');
  }
  S.slug = slug; S.project = project;
  const c = await api.post('/api/compile', project);
  S.lines = c.lines; S.project.chars = c.chars; S.ass = c.ass; S.size = c.size;
  T.cursor = { li: 0, si: 0 };
  $('#projSel').value = slug;
  if(project.video){
    try { await P.load(`/media/${slug}/${encodeURIComponent(project.video.file)}`); }
    catch(e){ P.unload(); toast('No pude abrir el video del proyecto; vuelve a cargarlo'); }
  } else P.unload();
  updateDemoDuration();
  syncControls(); renderAll();
  emit('project'); emit('size'); emit('ass');
  $('#saveState').textContent = 'Guardado';
}

function updateDemoDuration(){
  const ends = S.lines.map(timedSpan).filter(Boolean).map(x => x.e);
  P.setDemoDuration((ends.length ? Math.max(...ends) : 18) + 2.5);
}

/* ---------- video ---------- */
function uploadVideo(file){
  if(!file) return;
  if(!/^(video|audio)\//.test(file.type) && !/\.(mp4|mkv|mov|webm|avi|m4v|mp3|wav|m4a|ogg)$/i.test(file.name)) return toast('Ese archivo no parece un video');
  if(T.sync) stopSync();
  const probe = document.createElement('video');
  const local = URL.createObjectURL(file);
  probe.preload = 'metadata'; probe.src = local;
  const meta = new Promise(res => { probe.onloadedmetadata = () => res(probe); probe.onerror = () => res(null); setTimeout(() => res(null), 4000); });
  meta.then(async m => {
    URL.revokeObjectURL(local);
    await saveNow();
    const fd = new FormData();
    fd.append('file', file);
    if(m){ fd.append('width', m.videoWidth || 0); fd.append('height', m.videoHeight || 0); fd.append('duration', isFinite(m.duration) ? m.duration : 0); }
    const box = $('#upload'), prog = $('#uploadProg');
    box.hidden = false; $('#uploadTxt').textContent = `Copiando ${file.name}…`; prog.value = 0;
    const xhr = new XMLHttpRequest();
    xhr.open('POST', `/api/projects/${S.slug}/video`);
    xhr.upload.onprogress = e => { if(e.lengthComputable) prog.value = e.loaded / e.total; };
    xhr.onload = async () => {
      box.hidden = true;
      let data = {}; try { data = JSON.parse(xhr.responseText); } catch(e){}
      if(xhr.status !== 200) return toast(data.error || 'No se pudo cargar el video');
      S.project.video = data.video;
      try { await P.load(`/media/${S.slug}/${encodeURIComponent(data.video.file)}`); } catch(e){ return toast(e.message); }
      emit('format');
      changed({ delay: 0 });
      toast(`Video cargado: ${file.name}`);
    };
    xhr.onerror = () => { box.hidden = true; toast('Se cortó la conexión con el programa'); };
    xhr.send(fd);
  });
}

/* ---------- lista de versos y personajes ---------- */
function renderLines(){
  const ul = $('#lineList'); ul.innerHTML = '';
  S.lines.forEach((l, i) => {
    const li = document.createElement('li');
    const ch = S.project.chars[l.charKey] || { color: '#fff' };
    const st = lineStatus(l);
    li.innerHTML = `<span class="n">${String(i + 1).padStart(2, '0')}</span><span class="dot"></span><span class="txt"></span><span class="st ${st}">${st === 'ok' ? 'sincronizado' : st === 'part' ? 'a medias' : 'pendiente'}</span>`;
    li.querySelector('.dot').style.background = ch.color;
    li.querySelector('.txt').textContent = lineText(l);
    li.title = 'Clic o Enter: ir a este verso y marcar desde aquí';
    li.tabIndex = 0;
    li.addEventListener('click', () => goToLine(i));
    li.addEventListener('keydown', e => { if(e.key === 'Enter'){ e.preventDefault(); goToLine(i); } });
    ul.append(li);
  });
  lastCurLine = -2;
}

function renderChars(){
  const box = $('#charList'); box.innerHTML = '';
  Object.entries(S.project.chars).forEach(([key, c]) => {
    const row = document.createElement('div'); row.className = 'char';
    row.innerHTML = `<input type="color"><span class="swatch-demo"></span><span class="auto"></span>`;
    const col = row.querySelector('input'), demo = row.querySelector('.swatch-demo');
    col.setAttribute('aria-label', `Color de ${c.name}`);
    const paint = () => { demo.style.color = c.color; demo.style.webkitTextStroke = `1px ${darken(c.color, .72)}`; };
    col.value = c.color; demo.textContent = c.name; paint();
    row.querySelector('.auto').textContent = c.auto ? 'color automático' : '';
    col.addEventListener('input', () => { c.color = col.value; c.auto = false; paint(); row.querySelector('.auto').textContent = ''; changed(); renderLines(); });
    box.append(row);
  });
  if(!Object.keys(S.project.chars).length) box.innerHTML = '<p class="help">Escribe <code>Nombre:</code> al inicio de un verso para crear un personaje.</p>';
}

function renderAll(){ clampCursor(); renderLines(); renderChars(); updateSyncUI(); }

/* ---------- estilo ---------- */
const STYLE_FIELDS = [
  ['#sFont', 'font', null, null, false],
  ['#sSize', 'size', '#oSize', v => v + '%'],
  ['#sOutline', 'outline', '#oOutline', v => v + '%'],
  ['#sUnsung', 'unsung', null, null, false],
  ['#sPos', 'pos', null, null, false],
  ['#sMargin', 'margin', '#oMargin', v => (+v).toFixed(1) + '%'],
  ['#sLead', 'lead', '#oLead', v => (+v).toFixed(1) + ' s'],
  ['#sGlow', 'glow', '#oGlow', v => v ? String(v) : 'no'],
  ['#sOffset', 'offset', '#oOffset', v => (v > 0 ? '+' : '') + v + ' ms'],
  ['#sBounce', 'bounce', null, null, 'bool'],
];
function updateTiktokHint(){
  const st = S.project.style;
  $('#tiktokHint').hidden = S.size[1] <= S.size[0] || st.pos === 'top' || st.margin >= 15;
}
function bindStyle(){
  STYLE_FIELDS.forEach(([id, key, outId, f, kind = true]) => {
    const el = $(id);
    const handler = () => {
      S.project.style[key] = kind === 'bool' ? el.value === '1' : kind ? +el.value : el.value;
      if(outId) $(outId).textContent = f(S.project.style[key]);
      changed({ delay: 60 });
      if(key === 'offset') updateDemoDuration();
      if(key === 'margin' || key === 'pos') updateTiktokHint();
    };
    el.addEventListener('input', handler);
    if(el.tagName === 'SELECT') el.addEventListener('change', handler);
  });
}
export function syncControls(){
  $('#lyrics').value = S.project.lyrics;
  STYLE_FIELDS.forEach(([id, key, outId, f, kind = true]) => {
    const v = S.project.style[key];
    $(id).value = kind === 'bool' ? (v ? '1' : '0') : String(v);
    if(outId) $(outId).textContent = f(v);
  });
}

/* ---------- pestañas (con flechas, como un tablist accesible) ---------- */
function initTabs(){
  const tabs = [...document.querySelectorAll('.tabs button')];
  const show = b => {
    tabs.forEach(x => { x.setAttribute('aria-selected', x === b); x.tabIndex = x === b ? 0 : -1; });
    document.querySelectorAll('.pane').forEach(p => p.hidden = p.dataset.pane !== b.dataset.tab);
    if(b.dataset.tab === 'chars') renderChars();
    emit('tab', b.dataset.tab);
  };
  tabs.forEach((b, i) => {
    b.addEventListener('click', () => show(b));
    b.addEventListener('keydown', e => {
      if(e.key !== 'ArrowLeft' && e.key !== 'ArrowRight') return;
      e.preventDefault(); e.stopPropagation();
      const n = tabs[(i + (e.key === 'ArrowRight' ? 1 : tabs.length - 1)) % tabs.length];
      n.focus(); show(n);
    });
  });
}

/* ---------- bucle principal ---------- */
let lastCurLine = -1, lastSeekUpdate = 0, seekDragging = false;
const frameHooks = [];
export function onFrame(fn){ frameHooks.push(fn); }

function frame(ts){
  P.tick(ts);
  frameTick(ts);
  const t = P.now();
  frameHooks.forEach(fn => fn(t, ts));
  drawTimeline();
  $('#timeTxt').innerHTML = `<b>${fmt(t)}</b> / ${fmt(P.duration())}`;
  if(ts - lastSeekUpdate > 120 && !seekDragging){ $('#seek').value = P.duration() ? Math.round(t / P.duration() * 1000) : 0; lastSeekUpdate = ts; }
  const playing = P.isPlaying();
  const pb = $('#playBtn'); const label = playing ? '❚❚ Pausa' : '▶ Play';
  if(pb.textContent !== label){ pb.textContent = label; pb.setAttribute('aria-label', playing ? 'Pausar' : 'Reproducir'); }
  const cur = T.sync ? T.cursor.li : S.lines.findIndex(l => { const sp = timedSpan(l); return sp && t >= sp.s - 0.2 && t <= sp.e + 0.2; });
  if(cur !== lastCurLine){ lastCurLine = cur; document.querySelectorAll('#lineList li').forEach((li, i) => li.classList.toggle('cur', i === cur)); }
  requestAnimationFrame(frame);
}

/* ---------- arranque ---------- */
function showBanner(html){ const b = $('#banner'); b.innerHTML = html; b.hidden = false; }

async function boot(){
  initTabs(); initTapsync(); initTimeline(); bindStyle();

  $('#playBtn').addEventListener('click', () => P.toggle());
  $('#rate').addEventListener('change', e => P.setRate(+e.target.value));
  const seekEl = $('#seek');
  seekEl.addEventListener('input', () => { seekDragging = true; P.seek(seekEl.value / 1000 * P.duration()); });
  seekEl.addEventListener('change', () => { seekDragging = false; });
  $('#stage').addEventListener('click', () => { if(!T.sync) P.toggle(); });

  $('#fileVideo').addEventListener('change', e => { uploadVideo(e.target.files[0]); e.target.value = ''; });
  const wrap = $('#stageWrap'), hint = $('#dropHint');
  ['dragenter', 'dragover'].forEach(ev => wrap.addEventListener(ev, e => { e.preventDefault(); wrap.classList.add('drag'); hint.hidden = false; }));
  ['dragleave', 'drop'].forEach(ev => wrap.addEventListener(ev, e => { e.preventDefault(); wrap.classList.remove('drag'); hint.hidden = true; }));
  wrap.addEventListener('drop', e => uploadVideo(e.dataTransfer.files[0]));

  $('#projSel').addEventListener('change', async e => {
    const list = await refreshProjectList();
    const p = list.find(x => x.slug === e.target.value);
    loadProject(e.target.value, p?.updated).catch(err => toast(err.message));
  });
  $('#newProj').addEventListener('click', async () => {
    const name = prompt('Nombre del proyecto nuevo:', 'Mi canción');
    if(!name) return;
    await saveNow();
    const r = await api.post('/api/projects', { name });
    await refreshProjectList(); await loadProject(r.slug);
    toast('Proyecto creado. Pega la letra y carga el video.');
  });
  $('#fileProj').addEventListener('change', async e => {
    const f = e.target.files[0]; e.target.value = ''; if(!f) return;
    try {
      const data = JSON.parse(await f.text());
      await saveNow();
      const r = await api.post('/api/projects', { name: data.name || f.name.replace(/\.json$/i, '').replace(/_karaoke$/, ''), project: data });
      await refreshProjectList(); await loadProject(r.slug);
      toast('Proyecto importado. Carga el video para seguir.');
    } catch(err){ toast(err instanceof SyntaxError ? 'Ese archivo no es un proyecto de Karaoke Fansub' : err.message); }
  });
  $('#saveProj').addEventListener('click', () => downloadFrom('/api/download/json', snapshot(), 'proyecto.json').catch(e => toast(e.message)));

  let parseTimer;
  $('#lyrics').addEventListener('input', e => {
    S.project.lyrics = e.target.value;
    clearTimeout(parseTimer);
    parseTimer = setTimeout(() => changed({ delay: 0 }), 250);
  });
  $('#silabear').addEventListener('click', async () => {
    const ta = $('#lyrics');
    const r = await api.post('/api/syllabify', { text: ta.value });
    ta.value = S.project.lyrics = r.text; changed({ delay: 0 });
    toast('Sílabas separadas. Revisa nombres propios y palabras en quechua o aymara.', 4000);
  });
  let clearArmed = false;
  $('#clearTimes').addEventListener('click', e => {
    if(!clearArmed){ clearArmed = true; e.target.textContent = '¿Seguro? Clic otra vez'; setTimeout(() => { clearArmed = false; e.target.textContent = 'Borrar tiempos'; }, 2500); return; }
    clearArmed = false; e.target.textContent = 'Borrar tiempos';
    S.lines.forEach(l => l.syls.forEach(s => { s.t0 = s.t1 = null; }));
    T.cursor = { li: 0, si: 0 }; changed({ delay: 0 }); renderAll(); toast('Tiempos borrados');
  });

  on('lines', () => { renderAll(); updateDemoDuration(); });
  on('times', () => { renderLines(); updateDemoDuration(); });
  on('error', e => toast(e.message || String(e), 4000));
  on('size', () => {
    $('#stage').style.setProperty('--ar', (S.size[0] / S.size[1]).toFixed(4));
    updateTiktokHint();
  });

  STATUS = await api.get('/api/status');
  const fs = $('#sFont'); fs.innerHTML = '';
  STATUS.fonts.forEach(f => { const o = document.createElement('option'); o.value = o.textContent = f.label; fs.append(o); });
  if(!STATUS.ffmpeg.ffmpeg){
    showBanner(`<strong>No encuentro ffmpeg.</strong> Puedes editar y marcar tiempos, pero para exportar el video necesitas ffmpeg.
      Descárgalo de <a href="${STATUS.ffmpeg.downloadUrl}" target="_blank" rel="noopener">${STATUS.ffmpeg.downloadUrl}</a>
      (el archivo <code>ffmpeg-release-essentials.zip</code>), descomprímelo y copia la carpeta <code>bin</code> dentro de
      <code>karaoke-fansub/ffmpeg/</code>, o agrégala al PATH. Luego reinicia el programa.`);
  }
  initPreview(STATUS, onFrame);
  initExport(STATUS);
  const list = await refreshProjectList();
  const slug = STATUS.last || list[0]?.slug;
  if(slug) await loadProject(slug, list.find(x => x.slug === slug)?.updated);
  else { const r = await api.post('/api/projects', { name: 'Mi canción' }); await refreshProjectList(); await loadProject(r.slug); }
  requestAnimationFrame(frame);
}

export { STATUS, loadProject, refreshProjectList, renderAll };
boot().catch(e => { console.error(e); showBanner('No pude arrancar: ' + e.message); });
