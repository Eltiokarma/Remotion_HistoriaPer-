// Separa en piezas animables las láminas aprobadas de VectorCraft de un video.
//
// Uso (desde historia/):  node scripts/vectorcraft-piezas.mjs 001-el-hombre
//
// Lee videos/<id>/diseno/recursos-aprobados/<nombre>.svg para cada nombre de LAMINAS y escribe
// public/videos/<id>/vectorcraft/<nombre>.json con:
//   defs   — degradados y filtros de la lámina (el componente les cambia el id)
//   layers — una por grupo de primer nivel del SVG, en orden de pintura:
//            { name, box: [x, y, w, h], parts: [html…], boxes: [[x, y, w, h]…] }
// Las cajas se miden en Chromium (coordenadas de la lámina de 1920 × 1080), así un componente
// puede girar o mover una pieza sobre su propio centro sin adivinarlo.
//
// Los textos ya vienen trazados desde VectorCraft. Si se reexporta una lámina, correr esto de nuevo
// y revisar que los nombres de capa sigan iguales: los componentes las buscan por nombre.
import { readFileSync, writeFileSync, mkdirSync } from 'node:fs';
import { createRequire } from 'node:module';
import { dirname, join } from 'node:path';
import { fileURLToPath } from 'node:url';

const require = createRequire(import.meta.url);
const { chromium } = require('playwright');

const RAIZ = join(dirname(fileURLToPath(import.meta.url)), '..');
const video = process.argv[2] ?? '001-el-hombre';
const LAMINAS = {
  '001-el-hombre': [
    'tanda03-libro', 'tanda03-monedas', 'tanda03-pruebas', 'tanda05-tiempo-v2', 'tanda04-piscina',
    'tanda05-ingreso-v2', 'panfletos-contenido-v2', 'tanda04-fichero', 'balanza-video01',
    'biblioteca-video01', 'brujula-video01', 'islas-guaneras-v3', 'edificio-estado-video01',
    'vale-video01', 'tanda05-carpeta-v2', 'larga-duracion-pizarra',
  ],
}[video];
if (!LAMINAS) throw new Error(`Sin lista de láminas para ${video}`);

const origen = join(RAIZ, 'videos', video, 'diseno', 'recursos-aprobados');
const destino = join(RAIZ, 'public', 'videos', video, 'vectorcraft');
mkdirSync(destino, { recursive: true });

const r = (n) => Math.round(n * 10) / 10;
const browser = await chromium.launch();
const page = await browser.newPage({ viewport: { width: 1920, height: 1080 } });
for (const nombre of LAMINAS) {
  const svg = readFileSync(join(origen, `${nombre}.svg`), 'utf8');
  await page.setContent(`<!doctype html><html><body style="margin:0">${svg}</body></html>`);
  const data = await page.evaluate(() => {
    const raiz = document.querySelector('svg');
    raiz.setAttribute('width', '1920');
    raiz.setAttribute('height', '1080');
    raiz.style.display = 'block';
    const o = raiz.getBoundingClientRect();
    const caja = (el) => {
      const b = el.getBoundingClientRect();
      return [b.x - o.x, b.y - o.y, b.width, b.height];
    };
    const ser = new XMLSerializer();
    const limpio = (el) => ser.serializeToString(el).replace(/ xmlns="http:\/\/www\.w3\.org\/2000\/svg"/g, '');
    const defs = [...raiz.querySelectorAll(':scope > defs')].map((d) => [...d.children].map(limpio).join('')).join('');
    const layers = [...raiz.children].filter((g) => g.tagName === 'g' && g.children.length > 0).map((g) => ({
      name: g.id,
      transform: g.getAttribute('transform') ?? undefined,
      box: caja(g),
      parts: [...g.children].map(limpio),
      boxes: [...g.children].map(caja),
    }));
    // Lo que cuelga suelto de la raíz (fuera de un grupo) se junta en una capa propia.
    const sueltos = [...raiz.children].filter((c) => !['g', 'defs', 'title', 'desc', 'metadata'].includes(c.tagName));
    if (sueltos.length) layers.unshift({ name: '_sueltos', box: [0, 0, 1920, 1080], parts: sueltos.map(limpio), boxes: sueltos.map(caja) });
    return { defs, layers };
  });
  for (const l of data.layers) {
    l.box = l.box.map(r);
    l.boxes = l.boxes.map((b) => b.map(r));
  }
  const salida = join(destino, `${nombre}.json`);
  writeFileSync(salida, JSON.stringify(data));
  const peso = (JSON.stringify(data).length / 1024).toFixed(0);
  console.log(`${nombre}: ${data.layers.map((l) => `${l.name}(${l.parts.length})`).join(' · ')}  [${peso} KB]`);
}
await browser.close();
