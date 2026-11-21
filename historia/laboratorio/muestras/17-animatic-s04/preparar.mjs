// Copia a public/ de la muestra (fuera de git) lo que usa el animatic de la escena 4: imágenes de la
// galería (fuera de git), la voz de la escena 4, los medallones, fuentes, texturas y efectos.
import fs from 'node:fs';
import path from 'node:path';
import { fileURLToPath } from 'node:url';

const aqui = path.dirname(fileURLToPath(import.meta.url));
const proyecto = path.resolve(aqui, '../../..');
const salida = path.join(aqui, 'public');
const copiar = (a, b) => { fs.mkdirSync(path.dirname(b), { recursive: true }); fs.copyFileSync(a, b); };

const galeria = path.join(proyecto, 'public/videos/003-la-deuda-defraudada/imagenes/chatgpt');
for (const n of ['fondo-mesa-expediente', 'fondo-archivo', 'obj-07-carpeta-cerrada', 'obj-07-carpeta-abierta', 'obj-04-vale', 'obj-10-bono-deuda-externa', 'obj01-08-estado', 'obj-09-folio-sencillo', 'obj-02-saco-guano-cerrado']) {
  const a = path.join(galeria, `${n}.png`);
  if (!fs.existsSync(a)) throw new Error(`Falta ${a}: extraer el zip de la galería (videos/003-la-deuda-defraudada/galeria.md)`);
  copiar(a, path.join(salida, 'img', `${n}.png`));
}
copiar(path.join(proyecto, 'public/videos/003-la-deuda-defraudada/voz/s04.mp3'), path.join(salida, 'voz/s04.mp3'));
// medallones (redibujos de retratos de Commons; registro en fuentes.md). Los que faltan van en silueta.
for (const n of ['elias', 'echenique', 'torrico', 'novoa', 'mendiburu', 'castilla']) {
  const a = path.join(proyecto, `public/videos/003-la-deuda-defraudada/imagenes/retratos/medallon-${n}.png`);
  if (fs.existsSync(a)) copiar(a, path.join(salida, 'img', `medallon-${n}.png`));
  else console.log(`(sin medallon-${n}.png: va en silueta)`);
}
for (const carpeta of ['fuentes', 'texturas']) {
  fs.cpSync(path.join(proyecto, 'public/compartido', carpeta), path.join(salida, 'compartido', carpeta), { recursive: true });
}
for (const n of ['hoja', 'carpeta', 'tic', 'soplo', 'golpe', 'saco']) {
  copiar(path.join(proyecto, `public/compartido/audio/sfx/${n}.mp3`), path.join(salida, `compartido/audio/sfx/${n}.mp3`));
}
console.log('Recursos del animatic preparados en', path.relative(proyecto, salida));
