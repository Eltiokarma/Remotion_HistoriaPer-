// Vista previa con libass (JASSUB): dibuja el MISMO .ass que después quema ffmpeg.
//
// JASSUB se usa en modo "canvas" y no pegado al <video>: así el lienzo de la letra
// siempre tiene el tamaño del video final (por ejemplo 1080×1920 en formato vertical,
// aunque el video original sea horizontal) y el reloj lo manejamos nosotros (sirve
// también para el reloj de demostración sin video).
import JASSUB from '../vendor/jassub/jassub.es.js';
import { $ } from './util.js';
import { S, on } from './store.js';
import { P, vid } from './player.js';

const V = '/vendor/jassub/';
const stage = $('#stage'), canvas = $('#subs'), bg = $('#bgBlur');
let jas = null, lastAss = null, lastSent = -1, lastSentAt = 0, lastBg = 0;

function setStorageSize(){
  // libass necesita el tamaño "del video" para escalar bordes y blur igual que ffmpeg.
  jas._videoWidth = S.size[0];
  jas._videoHeight = S.size[1];
}

function resize(){
  if(!jas) return;
  const r = stage.getBoundingClientRect(), dpr = window.devicePixelRatio || 1;
  const w = Math.max(2, Math.round(r.width * dpr)), h = Math.max(2, Math.round(r.height * dpr));
  setStorageSize();
  jas.resize(w, h, 0, 0);
  lastSent = -1;
}

function applyFormat(){
  const fmt = S.project?.output?.format || 'original';
  stage.classList.toggle('fit-cover', fmt === 'vertical-crop');
  stage.classList.toggle('fit-contain', fmt === 'vertical-blur');
  bg.hidden = fmt !== 'vertical-blur' || !P.hasVideo;
  $('#demoBg').hidden = P.hasVideo;
}

/** Fondo difuminado del formato vertical: una copia pequeña del cuadro, borrosa por CSS. */
function drawBg(ts){
  if(bg.hidden || ts - lastBg < 80 || vid.readyState < 2) return;
  lastBg = ts;
  if(bg.width !== 72){ bg.width = 72; bg.height = 128; }
  const c = bg.getContext('2d'), vw = vid.videoWidth, vh = vid.videoHeight;
  const k = Math.max(72 / vw, 128 / vh), w = vw * k, h = vh * k;
  c.drawImage(vid, (72 - w) / 2, (128 - h) / 2, w, h);
}

export function initPreview(status, onFrame){
  const fonts = { 'liberation sans': V + 'default.woff2' };
  status.fonts.forEach(f => { fonts[f.family.toLowerCase()] = '/fonts/' + encodeURIComponent(f.file); });
  canvas.width = 2; canvas.height = 2;
  try {
    jas = new JASSUB({
      canvas,
      subContent: S.ass || '[Script Info]\nScriptType: v4.00+\n',
      workerUrl: V + 'jassub-worker.js',
      wasmUrl: V + 'jassub-worker.wasm',
      modernWasmUrl: V + 'jassub-worker-modern.wasm',
      availableFonts: fonts,
      fallbackFont: 'liberation sans',
      useLocalFonts: false,   // no pedir permiso de fuentes del sistema: solo fonts/
      onDemandRender: false,
      prescaleHeightLimit: 1080,
    });
  } catch(e){
    console.error(e);
    $('#banner').hidden = false;
    $('#banner').textContent = 'Este navegador no puede mostrar la vista previa (necesita WebAssembly y Workers). Usa Chrome, Edge o Firefox actualizados.';
    return;
  }
  lastAss = S.ass;
  jas.addEventListener('error', e => console.error('JASSUB', e));
  new ResizeObserver(resize).observe(stage);
  resize();

  on('ass', () => {
    if(!jas || S.ass === lastAss) return;
    lastAss = S.ass;
    jas.setTrack(S.ass);
    lastSent = -1;
  });
  on('size', resize);
  on('project', applyFormat);
  on('format', () => { applyFormat(); resize(); });
  vid.addEventListener('loadeddata', applyFormat);

  // Cada cuadro le decimos a libass qué tiempo dibujar (máx. ~30 por segundo para no
  // fundir la CPU en laptops modestas). Siempre "en pausa": el reloj es nuestro.
  onFrame((t, ts) => {
    drawBg(ts);
    // En pausa se redibuja de vez en cuando: las fuentes llegan después (pesan
    // varios MB) y libass solo las usa en el siguiente dibujo.
    const stale = ts - lastSentAt > 400;
    if((t === lastSent && !stale) || ts - lastSentAt < 30) return;
    lastSent = t; lastSentAt = ts;
    jas.setCurrentTime(true, t);
  });
  applyFormat();
}
