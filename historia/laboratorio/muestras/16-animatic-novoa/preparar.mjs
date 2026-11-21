// Copia a public/ de la muestra solo lo que usa el animatic: cuatro imágenes de la galería (fuera de
// git), la voz de la escena 3, fuentes, texturas y dos efectos. La carpeta public/ queda fuera de git.
import fs from 'node:fs';
import path from 'node:path';
import { fileURLToPath } from 'node:url';

const aqui = path.dirname(fileURLToPath(import.meta.url));
const proyecto = path.resolve(aqui, '../../..');
const salida = path.join(aqui, 'public');
const copiar = (a, b) => { fs.mkdirSync(path.dirname(b), { recursive: true }); fs.copyFileSync(a, b); };

const galeria = path.join(proyecto, 'public/videos/003-la-deuda-defraudada/imagenes/chatgpt');
for (const n of ['fondo-mesa-expediente', 'obj-07-carpeta-abierta', 'obj-09-folio-sencillo', 'obj-04-vale', 'obj-13-carta-elias', 'obj-14-oficio-echenique', 'obj-15-recibo-novoa', 'obj-16-sello-papel-sellado']) {
  const a = path.join(galeria, `${n}.png`);
  if (!fs.existsSync(a)) throw new Error(`Falta ${a}: extraer el zip de la galería (videos/003-la-deuda-defraudada/galeria.md)`);
  copiar(a, path.join(salida, 'img', `${n}.png`));
}
copiar(path.join(proyecto, 'public/videos/003-la-deuda-defraudada/voz/s03.mp3'), path.join(salida, 'voz/s03.mp3'));
// retratos de época en dominio público (Wikimedia Commons; registro en videos/003-la-deuda-defraudada/fuentes.md)
for (const n of ['elias', 'echenique', 'torrico', 'novoa']) {
  copiar(path.join(proyecto, `public/videos/003-la-deuda-defraudada/imagenes/retratos/medallon-${n}.png`), path.join(salida, 'img', `medallon-${n}.png`));
}
for (const carpeta of ['fuentes', 'texturas']) {
  fs.cpSync(path.join(proyecto, 'public/compartido', carpeta), path.join(salida, 'compartido', carpeta), { recursive: true });
}
for (const n of ['hoja', 'pluma', 'soplo', 'tic']) {
  copiar(path.join(proyecto, `public/compartido/audio/sfx/${n}.mp3`), path.join(salida, `compartido/audio/sfx/${n}.mp3`));
}
console.log('Recursos del animatic preparados en', path.relative(proyecto, salida));
