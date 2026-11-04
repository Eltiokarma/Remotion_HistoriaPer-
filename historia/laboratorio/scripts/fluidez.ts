// ¿Se mueve con fluidez? Mide las trayectorias de una muestra sin renderizar (funciones puras del tiempo).
//
//   npx tsx laboratorio/scripts/fluidez.ts laboratorio/muestras/06-mesa-con-volumen/movimiento.ts [--json salida.json]
//
// El módulo exporta FPS y TRAYECTORIAS: [{ nombre, pos(t) → número[], contactos, desde, hasta }], y
// opcionalmente ANTES con la misma forma (la versión anterior, para comparar). Por trayectoria:
//   - paso máx: lo más que avanza en un cuadro (px/cuadro). Por encima de ~25 sin desenfoque, se ve a saltos.
//   - frenazo máx: el mayor cambio de velocidad entre dos cuadros (px/cuadro²) fuera de los contactos
//     declarados. Algo que se clava da un frenazo grande. Ojo: una caída que acelera también lo sube.
//   - sacudida máx: el mayor cambio de aceleración (px/cuadro³) fuera de los contactos: separa el
//     frenazo en seco (grande) de la aceleración pareja de una caída (chica).
//   - en contacto: el frenazo en los golpes declarados (ahí sí se espera grande).
//   - colgado: cuadros quietos (< 0,5 px) entre cuadros que se mueven: la hoja que flota antes de caer.
//     No se cuenta en lo que se queda quieto por decisión (la cámara: `quietaPorDecision`).
// No mide: lo que se ve en pantalla (las unidades son de la escena, antes de la perspectiva), el desenfoque.
import { writeFileSync } from 'node:fs';
import { resolve } from 'node:path';
import { pathToFileURL } from 'node:url';

type Trayectoria = { nombre: string; pos: (t: number) => number[]; contactos: number[]; desde: number; hasta: number; quietaPorDecision?: boolean };

const [ruta] = process.argv.slice(2);
const iJson = process.argv.indexOf('--json');
type Modulo = { FPS: number; TRAYECTORIAS: Trayectoria[]; ANTES?: Trayectoria[] };

const medir = (tr: Trayectoria, fps: number) => {
  const a = Math.round(tr.desde * fps);
  const b = Math.round(tr.hasta * fps);
  const p = Array.from({ length: b - a + 1 }, (_, k) => tr.pos((a + k) / fps));
  const v = p.slice(1).map((q, k) => q.map((x, i) => x - p[k][i]));
  const norma = (x: number[]) => Math.hypot(...x);
  const enContacto = (cuadro: number) => tr.contactos.some((c) => Math.abs(cuadro - c * fps) <= 1.5);
  let paso = 0;
  let pasoCuadro = a;
  let tiron = 0;
  let tironCuadro = a;
  let contacto = 0;
  let sacudida = 0;
  let sacudidaCuadro = a;
  v.forEach((x, k) => {
    if (norma(x) > paso) [paso, pasoCuadro] = [norma(x), a + k + 1];
  });
  for (let k = 1; k < v.length; k++) {
    const j = norma(v[k].map((x, i) => x - v[k - 1][i]));
    const cuadro = a + k;
    if (enContacto(cuadro)) contacto = Math.max(contacto, j);
    else if (j > tiron) [tiron, tironCuadro] = [j, cuadro];
  }
  for (let k = 2; k < v.length; k++) {
    const cuadro = a + k;
    if (enContacto(cuadro) || enContacto(cuadro - 1)) continue;
    const s = norma(v[k].map((x, i) => x - 2 * v[k - 1][i] + v[k - 2][i]));
    if (s > sacudida) [sacudida, sacudidaCuadro] = [s, cuadro];
  }
  // colgado: tramos quietos entre movimiento (la hoja que flota en el aire antes de caer)
  const quieto = v.map((x) => norma(x) < 0.5);
  const primero = quieto.findIndex((q) => !q);
  const ultimo = quieto.length - 1 - [...quieto].reverse().findIndex((q) => !q);
  let colgado = 0;
  for (let k = primero; k <= ultimo; k++) if (quieto[k]) colgado++;
  const r = (x: number) => Math.round(x * 10) / 10;
  return { trayectoria: tr.nombre, paso_max: r(paso), en_cuadro: pasoCuadro, frenazo_max: r(tiron), frenazo_en: tironCuadro, sacudida_max: r(sacudida), sacudida_en: sacudidaCuadro, en_contacto: r(contacto), colgado: tr.quietaPorDecision ? null : colgado };
};

const tabla = (titulo: string, trs: Trayectoria[], fps: number) => {
  const filas = trs.map((tr) => medir(tr, fps));
  console.log(`\n${titulo}`);
  console.log('trayectoria   paso máx (px/c)  frenazo máx (px/c²)  sacudida máx (px/c³)  en contacto  colgado (c)');
  for (const f of filas) {
    console.log(`${f.trayectoria.padEnd(13)} ${String(f.paso_max).padStart(8)} @${String(f.en_cuadro).padEnd(5)} ${String(f.frenazo_max).padStart(9)} @${String(f.frenazo_en).padEnd(7)} ${String(f.sacudida_max).padStart(10)} @${String(f.sacudida_en).padEnd(8)} ${String(f.en_contacto).padStart(9)}  ${String(f.colgado ?? '—').padStart(8)}`);
  }
  return filas;
};

// tsx compila los scripts como CommonJS: sin await en el nivel superior
void import(pathToFileURL(resolve(ruta)).href).then((m: Modulo) => {
  const resultado = { modulo: ruta, fps: m.FPS, ahora: tabla('Ahora', m.TRAYECTORIAS, m.FPS), antes: m.ANTES ? tabla('Antes', m.ANTES, m.FPS) : null };
  if (iJson > 0) writeFileSync(process.argv[iJson + 1], JSON.stringify(resultado, null, 2) + '\n');
});
