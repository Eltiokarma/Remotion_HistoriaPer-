/**
 * Escaleta de un video: lo que dice la voz, lo que pasa en pantalla y lo que suena, segundo a
 * segundo, con métricas por escena. Sirve para leer el video sin verlo y encontrar dónde se
 * desincronizan guion, imagen e intención (sobre todo después de reescribir el guion).
 *
 *   npm run escaleta -- 000-quiroz      → escribe videos/000-quiroz/escaleta.md
 *
 * La voz sale de public/videos/<id>/voz-provisional/tiempos.json (lo escribe voz_provisional.py).
 * Las imágenes, de los beats de escenas.json y su descripción en src/escenas/<Escena>/esquema.ts.
 */
import { existsSync, readFileSync, writeFileSync } from 'node:fs';
import path from 'node:path';
import { ENSENAR } from '../src/direction/ritmo';
import { CATALOGO } from '../src/escenas/esquemas';
import type { Escena } from '../src/esquema';
import { validarVideo } from '../src/validacion';
import { medir, PUBLIC, VIDEOS } from './comun';

type Frase = { desde: number; hasta: number; texto: string };
type Fila = { t: number; voz?: string; imagen?: string; sonido?: string };

/** Beats que son intervalos (segundos entre cosas), no momentos. */
const INTERVALOS = new Set(['paso', 'paso_nombres']);
const PAUSA_PARRAFO = ENSENAR.pausaParrafo;

const tiempo = (s: number) => `${Math.floor(s / 60)}:${(s % 60).toFixed(1).padStart(4, '0')}`;
const palabras = (t: string) => t.split(/\s+/).filter((w) => /[\p{L}\d]/u.test(w));

/** El texto de la voz de cada escena en el guion (secciones "## ESC n" con un párrafo "**VO:**"). */
const vozDelGuion = (guion: string): Map<string, string> => {
  const out = new Map<string, string>();
  const partes = guion.split(/^## ESC (\d+)/m);
  for (let i = 1; i < partes.length; i += 2) {
    const m = partes[i + 1].match(/\*\*VO:\*\*\s*\n([\s\S]*?)(\n\s*\n|$)/);
    if (m) out.set(`s${partes[i].padStart(2, '0')}`, m[1].trim());
  }
  return out;
};

/** Palabras que abren una frase sin ser parte de un nombre. */
const FUNCION = /^(El|La|Los|Las|Lo|Un|Una|Para|Por|Y|En|Con|De|Del|Ahí|Este|Esta|Esa|Ese|Pero|Él|Su|Sus)$/;
const NUMEROS = 'dos|tres|cuatro|cinco|seis|siete|ocho|nueve|diez|veinte|treinta|cuarenta|cincuenta|sesenta|setenta|ochenta|noventa|cien|ciento|cientos|mil|mitad|millones';

/** Nombres propios (palabras con mayúscula que no abren frase) y cifras escritas con números. */
const datos = (texto: string): { nombres: string[]; cifras: string[] } => {
  const nombres: string[] = [];
  const cierra = () => {
    if (actual.length) nombres.push(actual.join(' ').replace(/\s+(de|del|la|las|los|y)$/, ''));
    actual = [];
  };
  let actual: string[] = [];
  for (const f of texto.split(/(?<=[.!?])\s+/)) {
    const ws = f.split(/\s+/);
    ws.forEach((w, i) => {
      const limpia = w.replace(/^[«"(¿¡*]+|[»"),.;:!?*]+$/g, '');
      const mayus = /^\p{Lu}/u.test(limpia);
      // la primera palabra de la frase cuenta solo si la sigue otra con mayúscula ("Nueva York")
      const abre = i === 0 && mayus && !FUNCION.test(limpia) && /^[«"(¿¡]*\p{Lu}/u.test(ws[1] ?? '');
      const conector = /^(de|del|la|las|los|y)$/.test(limpia) && actual.length > 0;
      if ((mayus && (i > 0 || abre)) || conector) actual.push(limpia);
      else cierra();
      if (/[,;:.!?]$/.test(w)) cierra(); // una coma separa nombres de una lista
    });
    cierra();
  }
  // cifras con números o con letras ("entre el treinta y el cuarenta por ciento" cuenta)
  const enNumeros = (texto.match(/\d+(?:[.,]\d+)*/g) ?? []);
  const enLetras = texto.toLowerCase().match(new RegExp(`\\b(?:${NUMEROS})(?:\\s+(?:y\\s+)?(?:${NUMEROS}))*(?:\\s+por\\s+ciento)?\\b`, 'g')) ?? [];
  return { nombres: [...new Set(nombres)], cifras: [...new Set([...enNumeros, ...enLetras])] };
};

const video = process.argv[2];
if (!video) throw new Error('uso: npm run escaleta -- 000-quiroz');
const { video: v, errores } = validarVideo(JSON.parse(readFileSync(path.join(VIDEOS, video, 'escenas.json'), 'utf8')));
if (!v) throw new Error(errores.join('\n'));
const archivoTiempos = path.join(PUBLIC, 'videos', video, 'voz-provisional', 'tiempos.json');
const tiempos: Record<string, { duracion: number; frases: Frase[] }> = existsSync(archivoTiempos) ? JSON.parse(readFileSync(archivoTiempos, 'utf8')) : {};
const archivoGuion = path.join(VIDEOS, video, 'guion.md');
const guion = existsSync(archivoGuion) ? vozDelGuion(readFileSync(archivoGuion, 'utf8')) : new Map<string, string>();

const md: string[] = [];
const resumen: string[] = [];
let inicio = 0;
md.push(`# Escaleta — ${v.id} · ${v.titulo}`, '');
md.push('Generada con `npm run escaleta` a partir de `escenas.json`, la voz provisional (`tiempos.json`) y el guion. No se edita a mano: se vuelve a generar cada vez que cambia algo.', '');
md.push('Columnas: **t** = minuto del video · **Voz** = cada frase cuando empieza · **Imagen** = cada beat (lo que cambia en pantalla) · **Sonido** = música, ambientes y silencios. Las palabras de la voz están escritas como las lee el TTS (números en letras, nombres extranjeros como suenan).', '');

for (const e of v.escenas as Escena[]) {
  const m = medir(v.id, e);
  const entrada = CATALOGO[e.componente as keyof typeof CATALOGO];
  const descr = (entrada?.beats ?? {}) as Record<string, string>;
  const frases = tiempos[e.id]?.frases ?? [];
  const filas: Fila[] = [];
  for (const f of frases) filas.push({ t: inicio + f.desde, voz: f.texto });
  for (const [b, s] of Object.entries(e.beats)) {
    if (INTERVALOS.has(b)) continue;
    filas.push({ t: inicio + s * m.k, imagen: `**${b}** — ${descr[b] ?? '(beat propio)'}` });
  }
  const a = e.audio ?? {};
  const enBeat = (b?: string) => (b && e.beats[b] !== undefined ? inicio + e.beats[b] * m.k : undefined);
  if (a.musica) filas.push({ t: enBeat(a.musica.desde_beat) ?? inicio, sonido: `música ${a.musica.archivo} (nivel ${a.musica.nivel})` });
  if (a.musica?.hasta_beat) filas.push({ t: enBeat(a.musica.hasta_beat)!, sonido: 'se va la música' });
  for (const am of a.ambientes ?? []) {
    filas.push({ t: enBeat(am.desde_beat) ?? inicio, sonido: `ambiente ${am.nombre} (${am.nivel})` });
    if (am.hasta_beat) filas.push({ t: enBeat(am.hasta_beat)!, sonido: `se va el ambiente ${am.nombre}` });
  }
  if (a.silencio) {
    filas.push({ t: enBeat(a.silencio.desde_beat)!, sonido: '**silencio deliberado**' });
    filas.push({ t: enBeat(a.silencio.hasta_beat)!, sonido: 'vuelve el sonido' });
  }
  for (const c of e.camara ?? []) filas.push({ t: enBeat(c.beat)!, imagen: `_cámara: ${c.movimiento}_ (${c.motivo})` });
  filas.sort((x, y) => x.t - y.t || (x.voz ? -1 : 1));

  // métricas
  const textoVoz = frases.map((f) => f.texto).join(' ');
  const nPal = palabras(textoVoz).length;
  const durVoz = tiempos[e.id]?.duracion ?? e.duracion_s;
  const largos = frases.map((f) => palabras(f.texto).length);
  const pausas = frases.slice(1).filter((f, i) => f.desde - frases[i].hasta >= PAUSA_PARRAFO).length;
  const imagenes = Object.keys(e.beats).filter((b) => !INTERVALOS.has(b)).length;
  const textoGuion = guion.get(e.id) ?? '';
  const { nombres, cifras } = datos(textoGuion);
  const porMin = (n: number) => (n / (durVoz / 60)).toFixed(1);
  const maxFrase = Math.max(0, ...largos);
  // tramos de voz sin una pausa de párrafo
  const tramos: number[] = [];
  frases.forEach((f, i) => {
    if (i === 0 || f.desde - frases[i - 1].hasta >= PAUSA_PARRAFO) tramos.push(0);
    tramos[tramos.length - 1] += f.hasta - f.desde + (i > 0 && f.desde - frases[i - 1].hasta < PAUSA_PARRAFO ? f.desde - frases[i - 1].hasta : 0);
  });
  const tramoMax = Math.max(0, ...tramos);
  const vozPct = (frases.reduce((a, f) => a + f.hasta - f.desde, 0) / m.duracion) * 100;
  const datosMin = (nombres.length + cifras.length) / (durVoz / 60);
  const alertas = [
    tramoMax > ENSENAR.tramoVozMax ? `voz seguida ${tramoMax.toFixed(0)} s` : '',
    maxFrase > ENSENAR.palabrasFraseMax ? `frase de ${maxFrase} palabras` : '',
    datosMin > ENSENAR.datosPorMinutoMax ? `${datosMin.toFixed(1)} datos/min` : '',
    vozPct > ENSENAR.vozMaxPct ? `voz ${vozPct.toFixed(0)} %` : '',
  ].filter(Boolean);
  const decidida = (v.excepciones ?? []).find((x) => x.regla === 'ensenar' && (!x.escenas || x.escenas.includes(e.id)));
  const semaforo = alertas.length === 0 ? '🟢' : decidida ? `⚪ decisión: ${decidida.motivo} (${alertas.join(' · ')})`
    : alertas.length <= 2 ? `🟡 ${alertas.join(' · ')}` : `🔴 ${alertas.join(' · ')}`;
  resumen.push(`| ${e.id} | ${e.componente} | ${tiempo(inicio)} | ${m.duracion.toFixed(0)} s | ${vozPct.toFixed(0)} % | ${tramoMax.toFixed(0)} s | ${Math.round(nPal / (durVoz / 60))} | ${largos.length ? (nPal / largos.length).toFixed(1) : '—'} | ${maxFrase} | ${pausas} | ${nombres.length + cifras.length} (${porMin(nombres.length + cifras.length)}/min) | ${imagenes} (${porMin(imagenes)}/min) | ${semaforo} |`);

  md.push(`## ${e.id} · ${e.seccion} — \`${e.componente}\` · ${tiempo(inicio)}–${tiempo(inicio + m.duracion)} (${m.duracion.toFixed(1)} s)`, '');
  md.push(`- **Cambio:** ${e.cambio}`);
  if (e.intencion) md.push(`- **Intención:** ${e.intencion}`);
  md.push(`- **Intensidad:** ${e.intensidad} · **Música:** ${e.estado_musica ?? '—'}`);
  md.push(`- **Semáforo para enseñar:** ${semaforo}`);
  md.push(`- **Métricas:** voz el ${vozPct.toFixed(0)} % del tiempo · tramo más largo sin pausa de párrafo: ${tramoMax.toFixed(1)} s · ${nPal} palabras · ${Math.round(nPal / (durVoz / 60))} por minuto · ${largos.length} frases de ${largos.length ? (nPal / largos.length).toFixed(1) : '—'} palabras en promedio (la más larga: ${maxFrase}) · ${pausas} pausa(s) de párrafo (≥ ${PAUSA_PARRAFO} s) · ${imagenes} cambios de imagen`);
  if (textoGuion) md.push(`- **Nombres y cifras que se dicen (${nombres.length + cifras.length}):** ${[...nombres, ...cifras].join(' · ')}`);
  md.push('', '| t | Voz | Imagen | Sonido |', '|---|---|---|---|');
  for (const f of filas) md.push(`| ${tiempo(f.t)} | ${f.voz ?? ''} | ${f.imagen ?? ''} | ${f.sonido ?? ''} |`);
  md.push('');
  inicio += m.duracion;
}

md.splice(5, 0, '', '## Resumen por escena', '',
  '| Escena | Componente | Empieza | Dura | Voz | Voz seguida máx. | Palabras/min | Palabras por frase | Frase más larga | Pausas de párrafo | Nombres y cifras | Cambios de imagen | Semáforo |',
  '|---|---|---|---|---|---|---|---|---|---|---|---|---|', ...resumen, '',
  `Total: ${tiempo(inicio)}. Semáforo (src/direction/ritmo.ts → ENSENAR): voz seguida ≤ ${ENSENAR.tramoVozMax} s, frases ≤ ${ENSENAR.palabrasFraseMax} palabras, ≤ ${ENSENAR.datosPorMinutoMax} nombres y cifras por minuto, voz ≤ ${ENSENAR.vozMaxPct} % de la escena. 🟢 cumple · 🟡 una o dos alertas · 🔴 tres o más · ⚪ fuera del semáforo a propósito (excepción declarada).`, '');
const destino = path.join(VIDEOS, video, 'escaleta.md');
writeFileSync(destino, md.join('\n') + '\n');
console.log(`✓ ${path.relative(process.cwd(), destino)} (${tiempo(inicio)})`);
