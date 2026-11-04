#!/usr/bin/env node
// Cuadros sueltos de una muestra, para revisarla sin renderizar el clip entero.
//
//   node laboratorio/scripts/cuadros.mjs <composición> <cuadros> [--escala 0.5] [--salida dir] [--columnas 2]
//                                        [--recorte x,y,w,h]
//   node laboratorio/scripts/cuadros.mjs lab-06-mesa-con-volumen 20,107,186-190 --escala 0.5
//
// Arma el bundle una sola vez y abre un solo navegador para todos los cuadros (`npx remotion still`
// vuelve a armar el bundle en cada llamada). Escribe NNN-cuadro.png y una hoja de contactos
// (hoja.jpg, en el orden pedido) en --salida. --recorte corta cada cuadro en coordenadas del
// cuadro completo (1920×1080) antes de escalar: sirve para mirar un detalle a tamaño real.
// Se corre desde historia/.
import { execFileSync } from 'node:child_process';
import { mkdirSync, rmSync } from 'node:fs';
import { join, resolve } from 'node:path';
import { bundle } from '@remotion/bundler';
import { openBrowser, renderStill, selectComposition } from '@remotion/renderer';

const args = process.argv.slice(2);
const opcion = (nombre, porDefecto) => {
  const i = args.indexOf(`--${nombre}`);
  return i >= 0 ? args[i + 1] : porDefecto;
};
const [id, lista] = args;
if (!id || !lista) {
  console.error('uso: cuadros.mjs <composición> <cuadros: 20,107,186-190> [--escala 0.5] [--salida dir] [--columnas 2] [--recorte x,y,w,h]');
  process.exit(2);
}
const cuadros = lista.split(',').flatMap((p) => {
  const [a, b] = p.split('-').map(Number);
  return b === undefined ? [a] : Array.from({ length: b - a + 1 }, (_, k) => a + k);
});
const escala = Number(opcion('escala', '0.5'));
const columnas = Number(opcion('columnas', '2'));
const recorte = opcion('recorte', null);
const salida = resolve(opcion('salida', join('laboratorio', 'out', 'cuadros', id)));
rmSync(salida, { recursive: true, force: true });
mkdirSync(salida, { recursive: true });

const t0 = performance.now();
const serveUrl = await bundle({ entryPoint: resolve('laboratorio/remotion/index.ts') });
const t1 = performance.now();
const navegador = await openBrowser('chrome');
const composicion = await selectComposition({ serveUrl, id, puppeteerInstance: navegador, logLevel: 'error' });
const archivos = [];
const msPorCuadro = {};
for (const [i, frame] of cuadros.entries()) {
  const tc = performance.now();
  const archivo = join(salida, `${String(i).padStart(3, '0')}-${frame}.png`);
  // con recorte se renderiza a tamaño real y se corta después; sin recorte, a la escala pedida
  await renderStill({ serveUrl, composition: composicion, frame, output: archivo, scale: recorte ? 1 : escala, puppeteerInstance: navegador, overwrite: true, logLevel: 'error' });
  archivos.push(archivo);
  msPorCuadro[frame] = Math.round(performance.now() - tc);
}
await navegador.close({ silent: true });
const t2 = performance.now();

// hoja de contactos en el orden pedido
const filtro = [
  ...(recorte ? [`crop=${recorte.split(',').slice(2).join(':')}:${recorte.split(',').slice(0, 2).join(':')}`, `scale=iw*${escala}:-1`] : []),
  `tile=${columnas}x${Math.ceil(archivos.length / columnas)}:padding=4:color=0x000000`,
].join(',');
execFileSync('ffmpeg', ['-v', 'error', '-y', '-pattern_type', 'glob', '-i', join(salida, '*.png'), '-vf', filtro, '-frames:v', '1', '-q:v', '3', join(salida, 'hoja.jpg')]);

console.log(JSON.stringify({
  composicion: id, cuadros, escala, recorte, hoja: join(salida, 'hoja.jpg'),
  segundos: { bundle: +((t1 - t0) / 1000).toFixed(1), cuadros: +((t2 - t1) / 1000).toFixed(1), por_cuadro: +((t2 - t1) / 1000 / cuadros.length).toFixed(2) },
  ms_por_cuadro: msPorCuadro, // incluye la captura y el PNG: sirve para comparar cuadros, no para sumar un render
}));
