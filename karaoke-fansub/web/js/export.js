// Pestaña Exportar: formato (original / vertical), quemar con ffmpeg y subtítulos sueltos.
import { $, api, toast, downloadFrom } from './util.js';
import { S, on, emit, changed, saveNow, snapshot } from './store.js';
import { T, stopSync } from './tapsync.js';

const FORMATS = [
  ['original', 'Original', 'Mismo tamaño que tu video.'],
  ['vertical-crop', 'Vertical 1080×1920 · recortar', 'Para TikTok/Shorts. Recorta los costados de un video horizontal.'],
  ['vertical-blur', 'Vertical 1080×1920 · fondo difuminado', 'Para TikTok/Shorts. El video entero al centro, con su copia borrosa de fondo.'],
];

let job = null, pollT = null;

function render(status){
  const box = $('#exportBox');
  box.innerHTML = `
    <div class="card">
      <strong>Formato</strong>
      <div class="field"><label for="xFormat">Salida</label><select id="xFormat"></select><span></span></div>
      <p class="help" id="xFormatHelp"></p>
    </div>
    <div class="card">
      <strong>Exportar video</strong>
      <p class="help">Quema la letra con ffmpeg (H.264, calidad <code>crf 18</code>, el audio se copia tal cual). El archivo sale en la carpeta <code>exportados/</code>.</p>
      <div class="field"><label for="xPreset">Velocidad</label>
        <select id="xPreset">
          <option value="rapida">Rápida (archivo más pesado)</option>
          <option value="equilibrada" selected>Equilibrada</option>
          <option value="maxima">Lenta (archivo más liviano)</option>
        </select><span></span></div>
      <div class="row">
        <button class="btn primary" id="xGo" type="button">Exportar video</button>
        <button class="btn danger" id="xCancel" type="button" hidden>Cancelar</button>
      </div>
      <progress id="xProg" max="1" value="0" hidden></progress>
      <span class="help" id="xMsg" aria-live="polite"></span>
      <div class="row" id="xDone" hidden>
        <a class="btn" id="xLink" href="#" download>Descargar el video</a>
        <button class="btn" id="xOpen" type="button">Abrir carpeta</button>
      </div>
      <div class="err" id="xErr" hidden></div>
    </div>
    <div class="card">
      <strong>Subtítulos sueltos</strong>
      <p class="help"><code>.ass</code>: karaoke completo con colores, se abre en Aegisub para retoques finos. <code>.srt</code>: un verso por línea, sin colores (para subir como subtítulos a YouTube).</p>
      <div class="row">
        <button class="btn" id="xAss" type="button">Descargar .ass</button>
        <button class="btn" id="xSrt" type="button">Descargar .srt</button>
      </div>
    </div>`;

  const sel = $('#xFormat');
  FORMATS.forEach(([v, label]) => { const o = document.createElement('option'); o.value = v; o.textContent = label; sel.append(o); });
  const syncFmt = () => { if(!S.project) return; sel.value = S.project.output.format; $('#xFormatHelp').textContent = FORMATS.find(f => f[0] === sel.value)[2]; };
  syncFmt();
  on('project', syncFmt);
  sel.addEventListener('change', () => { S.project.output.format = sel.value; syncFmt(); changed({ delay: 0 }); emit('format'); });

  if(!status.ffmpeg.ffmpeg){
    $('#xGo').disabled = true;
    $('#xMsg').innerHTML = `Necesitas ffmpeg para exportar el video. <a href="${status.ffmpeg.downloadUrl}" target="_blank" rel="noopener">Descárgalo aquí</a> (mira el README). El .ass y el .srt sí funcionan.`;
  } else if(!status.ffmpeg.assFilter){
    $('#xMsg').textContent = 'Tu ffmpeg no trae el filtro "ass" (libass). Descarga la versión "essentials" o "full" de gyan.dev.';
  }

  $('#xGo').addEventListener('click', start);
  $('#xCancel').addEventListener('click', async () => {
    if(!job) return;
    $('#xCancel').hidden = true; $('#xMsg').textContent = 'Cancelando…';
    await api.post(`/api/jobs/${job.id}/cancel`).catch(() => {});
  });
  $('#xOpen').addEventListener('click', () => api.post('/api/open-exports').catch(e => toast(e.message)));
  $('#xAss').addEventListener('click', () => downloadFrom('/api/download/ass', snapshot(), 'karaoke.ass').catch(e => toast(e.message)));
  $('#xSrt').addEventListener('click', () => downloadFrom('/api/download/srt', snapshot(), 'karaoke.srt').catch(e => toast(e.message)));
}

async function start(){
  if(T.sync) stopSync();
  $('#xErr').hidden = true; $('#xDone').hidden = true;
  await saveNow();
  try {
    job = await api.post(`/api/projects/${S.slug}/export`, { project: snapshot(), preset: $('#xPreset').value });
  } catch(e){ $('#xMsg').textContent = e.message; return; }
  $('#xGo').disabled = true; $('#xCancel').hidden = false; $('#xProg').hidden = false; $('#xProg').value = 0;
  poll();
}

async function poll(){
  clearTimeout(pollT);
  try { job = await api.get(`/api/jobs/${job.id}`); }
  catch(e){ $('#xMsg').textContent = e.message; return finish(); }
  $('#xProg').value = job.progress;
  $('#xMsg').textContent = job.message + (job.status === 'running' ? ` · ${Math.round(job.elapsed)} s` : '');
  if(job.status === 'running'){ pollT = setTimeout(poll, 500); return; }
  if(job.status === 'done'){
    $('#xMsg').textContent = `Listo en ${Math.round(job.elapsed)} s: ${job.result.file}`;
    $('#xLink').href = job.result.url; $('#xLink').setAttribute('download', job.result.file);
    $('#xDone').hidden = false;
    toast('Video exportado');
  } else if(job.status === 'error'){
    $('#xMsg').textContent = 'No se pudo exportar.';
    $('#xErr').textContent = job.error; $('#xErr').hidden = false;
  } else $('#xMsg').textContent = 'Exportación cancelada.';
  finish();
}

function finish(){ $('#xGo').disabled = false; $('#xCancel').hidden = true; $('#xProg').hidden = true; }

export function initExport(status){ render(status); }
