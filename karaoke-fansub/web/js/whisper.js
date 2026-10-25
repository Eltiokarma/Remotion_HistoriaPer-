// Pestaña Automático: faster-whisper transcribe un video hablado o alinea la letra de una canción.
import { $, api, toast } from './util.js';
import { S, on, changed, saveNow, snapshot } from './store.js';
import { T, stopSync } from './tapsync.js';

let job = null, pollT = null, result = null;
const MODEL_INFO = {
  tiny: 'el más rápido, se equivoca más',
  base: 'rápido',
  small: 'recomendado: buen equilibrio',
  medium: 'más preciso pero lento en CPU (varios minutos por minuto de video)',
};

function installHelp(){
  $('#autoBox').innerHTML = `
    <div class="card">
      <strong>Modo automático (Whisper)</strong>
      <p class="help">No está instalado. Es opcional: el resto del programa funciona sin él. Para instalarlo, cierra el programa y en la carpeta <code>karaoke-fansub</code> ejecuta:</p>
      <div class="help"><code>.venv\\Scripts\\python -m pip install -r requirements-whisper.txt</code></div>
      <p class="help">(En Linux: <code>.venv/bin/python -m pip install -r requirements-whisper.txt</code>.) Luego vuelve a abrir el programa. La primera vez que lo uses descargará el modelo (unos 460 MB para «small»).</p>
    </div>`;
}

function render(status){
  const w = status.whisper;
  if(!w.installed) return installHelp();
  $('#autoBox').innerHTML = `
    <div class="card">
      <strong>¿Qué quieres hacer?</strong>
      <label class="row"><input type="radio" name="aMode" value="transcribe" checked> Video hablado: transcribir y sincronizar todo</label>
      <label class="row"><input type="radio" name="aMode" value="align"> Canción: alinear la letra que ya pegué</label>
      <p class="help" id="aModeHelp"></p>
    </div>
    <div class="card">
      <div class="field"><label for="aModel">Modelo</label><select id="aModel"></select><span></span></div>
      <p class="help" id="aModelHelp"></p>
      <div class="field"><label for="aLang">Idioma</label>
        <select id="aLang"><option value="es" selected>Español</option><option value="auto">Detectar solo</option><option value="en">Inglés</option><option value="pt">Portugués</option></select><span></span></div>
      <div class="field" id="aSpeakerRow"><label for="aSpeaker">Personaje</label><input id="aSpeaker" type="text" placeholder="Narrador (opcional)"><span></span></div>
      <label class="help" for="aGlossary">Glosario: nombres propios y palabras en quechua o aymara, separados por comas. Ayuda a que Whisper las escriba bien.</label>
      <textarea id="aGlossary" class="short" spellcheck="false" placeholder="Choquehuanca, Titicaca, Qhapaq Ñan, jallalla, sulpayki"></textarea>
    </div>
    <div class="card">
      <div class="row">
        <button class="btn primary" id="aGo" type="button">Empezar</button>
        <button class="btn danger" id="aCancel" type="button" hidden>Cancelar</button>
      </div>
      <progress id="aProg" max="1" value="0" hidden></progress>
      <span class="help" id="aMsg" aria-live="polite">Corre en segundo plano: puedes seguir usando el programa mientras tanto.</span>
      <div id="aResult" hidden></div>
    </div>`;
  const sel = $('#aModel');
  w.models.forEach(m => {
    const o = document.createElement('option'); o.value = m;
    o.textContent = m + (w.downloaded.includes(m) ? '' : ' (se descarga)');
    sel.append(o);
  });
  sel.value = S.project?.whisperModel || w.default;
  const modelHelp = () => { $('#aModelHelp').textContent = 'Modelo ' + sel.value + ': ' + MODEL_INFO[sel.value] + '.'; };
  const modeHelp = () => {
    const m = mode();
    $('#aModeHelp').textContent = m === 'align'
      ? 'Usa los tiempos de cada palabra que reconozca Whisper como punto de partida. Con música fuerte reconoce menos: si la confianza sale baja, te lo digo y no invento tiempos.'
      : 'Reemplaza la letra por lo que se escucha, con versos y tiempos por palabra (repartidos entre sus sílabas). Después corriges lo que haga falta.';
    $('#aSpeakerRow').hidden = m === 'align';
  };
  modelHelp(); modeHelp();
  sel.addEventListener('change', () => { modelHelp(); S.project.whisperModel = sel.value; changed({ compile: false }); });
  document.querySelectorAll('input[name=aMode]').forEach(r => r.addEventListener('change', modeHelp));
  const gl = $('#aGlossary');
  const syncGl = () => { if(S.project) gl.value = S.project.glossary || ''; };
  syncGl(); on('project', () => { syncGl(); if(S.project?.whisperModel) sel.value = S.project.whisperModel; });
  gl.addEventListener('input', () => { S.project.glossary = gl.value; changed({ compile: false }); });
  $('#aGo').addEventListener('click', start);
  $('#aCancel').addEventListener('click', async () => {
    if(!job) return;
    $('#aCancel').hidden = true; $('#aMsg').textContent = 'Cancelando… (termina el trozo de audio que está escuchando)';
    await api.post(`/api/jobs/${job.id}/cancel`).catch(() => {});
  });
}

const mode = () => document.querySelector('input[name=aMode]:checked').value;

async function start(){
  if(T.sync) stopSync();
  if(!S.project.video) return toast('Primero carga un video');
  $('#aResult').hidden = true; result = null;
  await saveNow();
  try {
    job = await api.post(`/api/projects/${S.slug}/whisper`, {
      project: snapshot(), mode: mode(), model: $('#aModel').value, language: $('#aLang').value, speaker: $('#aSpeaker').value,
    });
  } catch(e){ $('#aMsg').textContent = e.message; return; }
  $('#aGo').disabled = true; $('#aCancel').hidden = false; $('#aProg').hidden = false; $('#aProg').value = 0;
  poll();
}

async function poll(){
  clearTimeout(pollT);
  try { job = await api.get(`/api/jobs/${job.id}`); }
  catch(e){ $('#aMsg').textContent = e.message; return finish(); }
  $('#aProg').value = job.progress;
  const mins = Math.floor(job.elapsed / 60), secs = Math.round(job.elapsed % 60);
  $('#aMsg').textContent = job.message + (job.status === 'running' ? ` · ${mins ? mins + ' min ' : ''}${secs} s` : '');
  if(job.status === 'running'){ pollT = setTimeout(poll, 700); return; }
  if(job.status === 'done') showResult(job.result);
  else if(job.status === 'error') $('#aMsg').textContent = 'No se pudo: ' + job.error;
  else $('#aMsg').textContent = 'Cancelado.';
  finish();
}

function finish(){ $('#aGo').disabled = false; $('#aCancel').hidden = true; $('#aProg').hidden = true; }

const pct = x => Math.round(x * 100) + ' %';

function showResult(r){
  result = r;
  const box = $('#aResult'); box.hidden = false;
  $('#aMsg').textContent = `Listo: ${r.words} palabras reconocidas.`;
  if(r.error){ box.innerHTML = `<p class="help warn">${r.error}</p>`; return; }
  if(r.mode === 'transcribe'){
    box.innerHTML = `
      <p class="help">Confianza media de Whisper: <b>${pct(r.confidence)}</b>. Revisa nombres propios y el silabeo.</p>
      <textarea class="short" readonly></textarea>
      <div class="row"><button class="btn primary" id="aApply" type="button">Reemplazar letra y tiempos</button><button class="btn" id="aDiscard" type="button">Descartar</button></div>`;
    box.querySelector('textarea').value = r.lyrics;
  } else {
    const weak = r.weakLines.map(w => `verso ${w.line + 1} (${w.matched} de ${w.words} palabras)`).join(', ');
    const msg = {
      alta: `Confianza <b>alta</b> (${pct(r.confidence)}): reconocí ${pct(r.coverage)} de tus palabras.`,
      media: `Confianza <b>media</b> (${pct(r.confidence)}): reconocí ${pct(r.coverage)} de tus palabras. Los tiempos son un punto de partida; revisa con la línea de tiempo.`,
      baja: `Confianza <b>baja</b> (${pct(r.confidence)}): solo reconocí ${pct(r.coverage)} de tus palabras, así que no aplico los tiempos para no inventar. Puedes aplicar solo las palabras seguras y marcar el resto con Espacio.`,
    }[r.level];
    box.innerHTML = `
      <p class="help ${r.level === 'alta' ? '' : 'warn'}">${msg}</p>
      ${weak ? `<p class="help">Versos dudosos: ${weak}.</p>` : ''}
      <details><summary class="help">Lo que escuchó Whisper</summary><p class="help"></p></details>
      <div class="row">
        ${r.level !== 'baja' ? '<button class="btn primary" id="aApply" type="button">Aplicar tiempos</button>' : ''}
        <button class="btn" id="aApplySafe" type="button">Aplicar solo palabras seguras</button>
        <button class="btn" id="aDiscard" type="button">Descartar</button>
      </div>`;
    box.querySelector('details p').textContent = r.heard || '(nada)';
    box.querySelector('#aApplySafe').addEventListener('click', () => apply(r.safeTimes));
  }
  box.querySelector('#aApply')?.addEventListener('click', () => apply(r.times));
  box.querySelector('#aDiscard').addEventListener('click', () => { box.hidden = true; result = null; });
}

async function apply(times){
  if(!result) return;
  if(result.mode === 'transcribe'){
    if(S.project.lyrics.trim() && !confirm('Esto reemplaza la letra y los tiempos actuales. ¿Seguir?')) return;
    S.project.lyrics = result.lyrics;
    $('#lyrics').value = result.lyrics;
  }
  // Se recompila con los tiempos nuevos: el backend arma los versos y los aplica.
  const r = await api.post('/api/compile', { ...snapshot(), lyrics: S.project.lyrics, times });
  const { applyCompiled } = await import('./app.js');
  applyCompiled(r);
  $('#aResult').hidden = true; result = null;
  toast('Tiempos aplicados. Revisa la vista previa y afina en la línea de tiempo.', 4000);
}

export function initWhisper(status){ render(status); }
