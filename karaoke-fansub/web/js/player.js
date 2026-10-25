// Reloj único: el <video> si hay uno cargado; si no, un reloj de demostración
// (como el prototipo) para poder ver y marcar la letra sin video.
import { $ } from './util.js';

export const vid = $('#vid');
let hasVideo = false;
let demoT = 0, demoPlaying = false, demoDur = 20, lastPerf = performance.now();
let rate = 1;

export const P = {
  get hasVideo(){ return hasVideo; },
  now(){ return hasVideo ? vid.currentTime : demoT; },
  duration(){ return hasVideo ? (vid.duration || 0) : demoDur; },
  isPlaying(){ return hasVideo ? !vid.paused && !vid.ended : demoPlaying; },
  rate(){ return rate; },
  seek(t){
    t = Math.max(0, Math.min(P.duration() || 0, t));
    if(hasVideo) vid.currentTime = t; else demoT = t;
  },
  play(){
    if(hasVideo){ vid.playbackRate = rate; vid.play().catch(() => {}); }
    else { if(demoT >= demoDur) demoT = 0; demoPlaying = true; }
  },
  pause(){ if(hasVideo) vid.pause(); else demoPlaying = false; },
  toggle(){ P.isPlaying() ? P.pause() : P.play(); },
  setRate(r){ rate = r; if(hasVideo) vid.playbackRate = r; },
  setDemoDuration(d){ demoDur = Math.max(10, d); },
  /** Avanza el reloj de demostración; se llama una vez por cuadro. */
  tick(ts){
    const dt = Math.min(0.1, (ts - lastPerf) / 1000); lastPerf = ts;
    if(!hasVideo && demoPlaying){ demoT += dt * rate; if(demoT >= demoDur){ demoT = demoDur; demoPlaying = false; } }
  },
  /** Carga un video. ``expectVideo``: si el archivo tiene imagen, exige poder decodificarla
   *  (Chrome lee el contenedor de un HEVC aunque no pueda mostrar ningún cuadro). */
  load(url, expectVideo = true){
    return new Promise((resolve, reject) => {
      const fail = () => { cleanup(); hasVideo = false; reject(new Error('Ese archivo no se puede reproducir en el navegador')); };
      const ok = () => {
        if(expectVideo && !vid.videoWidth) return fail();
        cleanup(); hasVideo = true; vid.playbackRate = rate;
        resolve({ width: vid.videoWidth, height: vid.videoHeight, duration: vid.duration });
      };
      const timer = setTimeout(() => (vid.readyState >= 2 ? ok() : fail()), 8000);
      const cleanup = () => { clearTimeout(timer); vid.onloadeddata = vid.onerror = null; };
      vid.onloadeddata = ok;
      vid.onerror = fail;
      vid.src = url;
    });
  },
  unload(){ hasVideo = false; vid.removeAttribute('src'); vid.load(); demoT = 0; },
};
