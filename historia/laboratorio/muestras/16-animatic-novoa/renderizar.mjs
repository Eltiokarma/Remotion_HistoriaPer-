// Render del animatic de la escena 3 (versiones A, B y C).
//   node laboratorio/muestras/16-animatic-novoa/renderizar.mjs                 → cuadros de revisión y las tres versiones
//   node laboratorio/muestras/16-animatic-novoa/renderizar.mjs --solo-cuadros  → solo cuadros
//   node laboratorio/muestras/16-animatic-novoa/renderizar.mjs B               → solo esa versión
// Salida (fuera de git): laboratorio/out/16-animatic-novoa/. Registro de tiempos: resultados/.
import fs from 'node:fs';
import os from 'node:os';
import path from 'node:path';
import { fileURLToPath } from 'node:url';
import { bundle } from '@remotion/bundler';
import { openBrowser, renderMedia, renderStill, selectComposition } from '@remotion/renderer';

const aqui = path.dirname(fileURLToPath(import.meta.url));
const proyecto = path.resolve(aqui, '../../..');
process.chdir(proyecto);
const out = path.join(proyecto, 'laboratorio/out/16-animatic-novoa');
const res = path.join(aqui, 'resultados');
fs.mkdirSync(out, { recursive: true });
fs.mkdirSync(res, { recursive: true });

const args = process.argv.slice(2);
const versiones = args.filter((a) => ['A', 'B', 'C', 'D', 'E1', 'E2', 'E3', 'E4', 'E5', 'E6', 'F'].includes(a));
const lista = versiones.length ? versiones : ['A', 'B', 'C', 'D'];
const soloCuadros = args.includes('--solo-cuadros');

const t0 = performance.now();
const serveUrl = await bundle({ entryPoint: path.join(aqui, 'index.tsx'), outDir: path.join(out, 'bundle'), publicDir: path.join(aqui, 'public'), enableCaching: false });
const browser = await openBrowser('chrome', { logLevel: 'error' });
try {
  for (const v of lista) {
    const composition = await selectComposition({ serveUrl, id: `animatic-s03-${v}`, puppeteerInstance: browser, logLevel: 'error' });
    // segundos de video para revisar: entrada, gestión, plazo, cifra, comparación, estimación, cierre
    for (const s of [3, 12, 24, 40, 51.5, 56.5, 59, 66, 80, 92]) {
      const f = Math.min(composition.durationInFrames - 1, Math.round(s * composition.fps));
      await renderStill({ serveUrl, composition, frame: f, output: path.join(out, `cuadros-${v}`, `${s}.jpg`), imageFormat: 'jpeg', jpegQuality: 80, scale: 0.5, puppeteerInstance: browser, logLevel: 'error' });
    }
    if (soloCuadros) continue;
    const inicio = performance.now();
    const destino = path.join(out, `animatic-s03-${v}.mp4`);
    await renderMedia({ serveUrl, composition, codec: 'h264', outputLocation: destino, scale: 0.5, concurrency: 4, imageFormat: 'jpeg', jpegQuality: 85,
      videoBitrate: '900k', audioBitrate: '128k', x264Preset: 'veryfast', pixelFormat: 'yuv420p', puppeteerInstance: browser, logLevel: 'error' });
    const registro = {
      fecha: new Date().toISOString(), version: v, maquina: 'contenedor', cpu: os.cpus()[0].model, hilos: os.cpus().length,
      ram_gb: Math.round(os.totalmem() / 1e9 * 10) / 10, concurrencia: 4, escala: 0.5, ancho: 960, alto: 540, fps: composition.fps,
      cuadros: composition.durationInFrames, duracion_s: Math.round(composition.durationInFrames / composition.fps * 100) / 100,
      render_s: Math.round((performance.now() - inicio) / 100) / 10, bytes: fs.statSync(destino).size,
      voz: 'Joder Jolines, eleven_v4 (voz/s03.mp3)', aprobacion_gerson: 'pendiente',
    };
    fs.writeFileSync(path.join(res, `render-${v}.json`), JSON.stringify(registro, null, 2) + '\n');
    console.log(JSON.stringify(registro));
  }
} finally {
  await browser.close({ silent: true });
}
console.log(`Listo en ${Math.round((performance.now() - t0) / 1000)} s · ${path.relative(proyecto, out)}`);
