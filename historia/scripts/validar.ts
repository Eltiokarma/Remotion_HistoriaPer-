/**
 * Revisa los videos antes de renderizar (CLAUDE.md §3–§6 y §11).
 *
 *   npm run validar                          → todos los videos
 *   npm run validar -- 000-quiroz            → uno
 *   npm run validar -- 000-quiroz --final    → además exige voz real, silencio, tres estados
 *                                              de música y fuentes.md sin [VERIFICAR]
 *
 * ✗ = error (hay que corregirlo; el render final no debería salir así)
 * ! = aviso (mirarlo; puede ser una decisión)
 * Sale con código 1 si hay algún error.
 */
import { execFileSync } from 'node:child_process';
import { existsSync, readdirSync, readFileSync } from 'node:fs';
import path from 'node:path';
import {
  curva, desviacion, DESVIACION_MINIMA, DUCKING_DB, ESTADOS_MUSICA, estadosMusica, SILENCIO_S, TOLERANCIA_DURACION, triosParejos,
} from '../src/direction/ritmo';
import { candidatosVoz, COLA_S } from '../src/direction/voz';
import { CATALOGO } from '../src/escenas/esquemas';
import type { Escena } from '../src/esquema';
import { validarVideo } from '../src/validacion';

const RAIZ = path.resolve(__dirname, '..');
const PUBLIC = path.join(RAIZ, 'public');
const VIDEOS = path.join(RAIZ, 'videos');

const args = process.argv.slice(2);
const final = args.includes('--final');
const pedidos = args.filter((a) => !a.startsWith('--'));

/** Duración de un audio en segundos, con el ffprobe del sistema o el que trae Remotion. */
const duracionAudio = (archivo: string): number | null => {
  const argsFf = ['-v', 'error', '-show_entries', 'format=duration', '-of', 'csv=p=0', archivo];
  for (const [cmd, pre] of [['ffprobe', []], ['npx', ['remotion', 'ffprobe']]] as const) {
    try {
      const salida = execFileSync(cmd, [...pre, ...argsFf], { cwd: RAIZ, encoding: 'utf8', stdio: ['ignore', 'pipe', 'ignore'], shell: process.platform === 'win32' });
      const d = parseFloat(salida.trim());
      if (Number.isFinite(d)) return d;
    } catch {
      // se prueba el siguiente
    }
  }
  return null;
};

type Medida = { duracion: number; voz: 'real' | 'provisional' | 'ninguna'; k: number };

/** Lo mismo que hace el Studio (direction/timing.ts): si hay voz, manda la voz. */
const medir = (videoId: string, e: Escena): Medida => {
  for (const [ruta, provisional] of candidatosVoz(videoId, e.id)) {
    const archivo = path.join(PUBLIC, ruta);
    if (!existsSync(archivo)) continue;
    const d = duracionAudio(archivo);
    if (d === null) continue;
    return { duracion: d + (e.cola_s ?? COLA_S), voz: provisional ? 'provisional' : 'real', k: d / e.duracion_s };
  }
  return { duracion: e.duracion_s + (e.cola_s ?? COLA_S), voz: 'ninguna', k: 1 };
};

const tinta = (codigo: number) => (t: string) => (process.stdout.isTTY ? `\x1b[${codigo}m${t}\x1b[0m` : t);
const [rojo, amarillo, verde, negrita] = [31, 33, 32, 1].map(tinta);

const mmss = (s: number) => { const r = Math.round(s); return `${Math.floor(r / 60)}:${String(r % 60).padStart(2, '0')}`; };

function revisar(carpeta: string): { errores: number; avisos: number } {
  const errores: string[] = [];
  const avisos: string[] = [];
  const archivo = path.join(VIDEOS, carpeta, 'escenas.json');
  const titulo = (t: string) => console.log(`\n${negrita(t)}`);

  let datos: unknown;
  try {
    datos = JSON.parse(readFileSync(archivo, 'utf8'));
  } catch (err) {
    titulo(carpeta);
    console.log(`  ✗ escenas.json no se puede leer: ${(err as Error).message}`);
    return { errores: 1, avisos: 0 };
  }
  const { video, errores: deEsquema } = validarVideo(datos);
  errores.push(...deEsquema);
  if (!video) {
    titulo(carpeta);
    for (const e of errores) console.log(`  ✗ ${e}`);
    return { errores: errores.length, avisos: 0 };
  }
  titulo(`${video.id} · ${video.titulo}`);

  // —— el video en el repo
  if (video.id !== carpeta) errores.push(`el id "${video.id}" no coincide con la carpeta videos/${carpeta}/`);
  const registro = readFileSync(path.join(RAIZ, 'src', 'registro.ts'), 'utf8');
  if (!registro.includes(`videos/${carpeta}/escenas.json`)) errores.push('no está en src/registro.ts: no aparece en el Studio (npm run nuevo-video lo hace solo)');

  // —— cada escena
  const medidas = video.escenas.map((e) => medir(video.id, e));
  video.escenas.forEach((e, i) => {
    const m = medidas[i];
    const entrada = CATALOGO[e.componente as keyof typeof CATALOGO];
    const usados = new Set(Object.keys(entrada?.beats ?? {}));
    const audio = e.audio;
    const deAudio = [
      audio?.musica?.desde_beat, audio?.musica?.hasta_beat,
      ...(audio?.ambientes ?? []).flatMap((a) => [a.desde_beat, a.hasta_beat]),
      audio?.silencio?.desde_beat, audio?.silencio?.hasta_beat,
    ].filter((b): b is string => !!b);

    for (const b of deAudio) if (!(b in e.beats)) errores.push(`${e.id}: el audio usa el beat "${b}", que no está en beats`);
    for (const c of e.camara ?? []) if (!(c.beat in e.beats)) errores.push(`${e.id}: el movimiento de cámara «${c.movimiento}» usa el beat "${c.beat}", que no está en beats`);
    if (entrada) {
      const que = (b: string) => String(entrada.beats[b as keyof typeof entrada.beats]);
      // «(condición) …» = beat que solo hace falta en una variante de la escena
      for (const b of usados) if (!(b in e.beats) && !que(b).startsWith('(')) avisos.push(`${e.id}: falta el beat "${b}" (${que(b)}); se usa el valor por defecto`);
      for (const b of Object.keys(e.beats)) if (!usados.has(b) && !deAudio.includes(b)) avisos.push(`${e.id}: ${e.componente} no usa el beat "${b}"`);
    }
    // los beats están en el tiempo de duracion_s (se escalan con la voz), salvo que estén ajustados
    const tope = e.beats_ajustados ? m.duracion : e.duracion_s + (e.cola_s ?? COLA_S);
    for (const [b, v] of Object.entries(e.beats)) {
      if (b === 'paso') continue; // es un intervalo, no un momento
      if (v > tope) errores.push(`${e.id}: el beat "${b}" (${v} s) cae después del final de la escena (${tope.toFixed(1)} s)`);
    }

    if (audio?.musica && !existsSync(path.join(PUBLIC, 'videos', video.id, 'musica', audio.musica.archivo))) {
      errores.push(`${e.id}: no existe la música public/videos/${video.id}/musica/${audio.musica.archivo}`);
    }
    for (const a of audio?.ambientes ?? []) {
      if (!existsSync(path.join(PUBLIC, 'compartido', 'audio', 'ambiente', `${a.nombre}.mp3`))) {
        errores.push(`${e.id}: no existe el ambiente "${a.nombre}" (public/compartido/audio/ambiente/${a.nombre}.mp3)`);
      }
    }
    if (audio?.duck_db !== undefined && (audio.duck_db < DUCKING_DB[0] || audio.duck_db > DUCKING_DB[1])) {
      avisos.push(`${e.id}: duck_db ${audio.duck_db} fuera del rango del canal (${DUCKING_DB[0]} a ${DUCKING_DB[1]} dB)`);
    }
    if (audio?.silencio && e.beats[audio.silencio.desde_beat] !== undefined && e.beats[audio.silencio.hasta_beat] !== undefined) {
      const s = (e.beats[audio.silencio.hasta_beat] - e.beats[audio.silencio.desde_beat]) * (e.beats_ajustados ? 1 : m.k);
      if (s < SILENCIO_S[0] || s > SILENCIO_S[1]) avisos.push(`${e.id}: el silencio dura ${s.toFixed(1)} s (el canal pide ${SILENCIO_S[0]}–${SILENCIO_S[1]} s)`);
    }
    if (final && m.voz !== 'real') errores.push(`${e.id}: ${m.voz === 'provisional' ? 'suena la voz provisional' : 'no hay voz'}; graba public/videos/${video.id}/voz/${e.id}.wav`);
  });

  // —— ritmo del video completo
  const duraciones = medidas.map((m) => m.duracion);
  for (const i of triosParejos(duraciones)) {
    const ids = video.escenas.slice(i, i + 3).map((e) => e.id).join(', ');
    errores.push(`${ids} duran casi lo mismo (±${TOLERANCIA_DURACION * 100}%): tres planos parejos se sienten robóticos`);
  }
  const intensidades = video.escenas.map((e) => e.intensidad);
  const desv = desviacion(intensidades);
  if (video.escenas.length > 1 && desv < DESVIACION_MINIMA) errores.push(`la curva de intensidad es plana (desviación ${desv.toFixed(2)}, mínimo ${DESVIACION_MINIMA})`);
  const pico = intensidades.indexOf(Math.max(...intensidades));
  if (video.escenas.length >= 3 && pico < video.escenas.length / 3) avisos.push(`el pico de intensidad está en ${video.escenas[pico].id}, muy al principio: la curva debería subir hacia el clímax`);
  const conSilencio = video.escenas.some((e) => e.audio?.silencio);
  if (!conSilencio) (final ? errores : avisos).push('no hay ningún silencio deliberado (audio.silencio en alguna escena)');
  const estados = estadosMusica(video.escenas.map((e) => e.estado_musica));
  if (estados.size < 3) (final ? errores : avisos).push(`la música pasa por ${estados.size} estado(s) (${[...estados].join(', ') || 'ninguno anotado'}); el canal pide ${ESTADOS_MUSICA.join(', ')}`);
  if (!video.escenas.some((e) => e.intencion)) avisos.push('ninguna escena anota su "intencion" (al menos una yuxtaposición deliberada por video)');

  const porCompletar = (readFileSync(archivo, 'utf8').match(/\[POR COMPLETAR/g) ?? []).length;
  if (porCompletar) (final ? errores : avisos).push(`escenas.json tiene ${porCompletar} «[POR COMPLETAR…]» de la plantilla`);

  // —— fuentes y glosario
  const fuentes = path.join(VIDEOS, carpeta, 'fuentes.md');
  if (!existsSync(fuentes)) errores.push('falta fuentes.md');
  else {
    const pendientes = (readFileSync(fuentes, 'utf8').match(/\[VERIFICAR\]/g) ?? []).length;
    if (pendientes) (final ? errores : avisos).push(`fuentes.md tiene ${pendientes} [VERIFICAR] pendiente(s)`);
  }
  if (!existsSync(path.join(VIDEOS, carpeta, 'glosario.txt'))) avisos.push('falta glosario.txt (nombres propios para los subtítulos)');

  // —— resumen
  const voces = new Set(medidas.map((m) => m.voz));
  const total = duraciones.reduce((a, d) => a + d, 0);
  console.log(`  duraciones (voz ${[...voces].join(' + ')}): ${video.escenas.map((e, i) => `${e.id} ${duraciones[i].toFixed(1)}`).join(' · ')}  → ${mmss(total)}`);
  console.log(`  intensidad: ${curva(intensidades)}  ${intensidades.join(' ')}  (desviación ${desv.toFixed(2)})`);
  console.log(`  música: ${video.escenas.map((e) => e.estado_musica ?? '—').join(' · ')}`);
  for (const e of errores) console.log(`  ${rojo('✗')} ${e}`);
  for (const a of avisos) console.log(`  ${amarillo('!')} ${a}`);
  if (!errores.length) console.log(`  ${verde('✓')} ${final ? 'listo para el render final' : 'sin errores'}`);
  return { errores: errores.length, avisos: avisos.length };
}

/** Efectos que piden las escenas y no están en public/compartido/audio/sfx/ (se revisa el código de cada escena). */
const efectosFaltantes = (): string[] => {
  const dir = path.join(RAIZ, 'src', 'escenas');
  const pedidos = new Set<string>();
  for (const escena of readdirSync(dir, { withFileTypes: true }).filter((d) => d.isDirectory())) {
    const archivo = path.join(dir, escena.name, 'Escena.tsx');
    if (!existsSync(archivo)) continue;
    for (const m of readFileSync(archivo, 'utf8').matchAll(/nombre="([a-z0-9-]+)"/g)) pedidos.add(m[1]);
  }
  return [...pedidos].filter((n) => !existsSync(path.join(PUBLIC, 'compartido', 'audio', 'sfx', `${n}.mp3`)));
};

const carpetas = readdirSync(VIDEOS, { withFileTypes: true })
  .filter((d) => d.isDirectory() && !d.name.startsWith('_') && existsSync(path.join(VIDEOS, d.name, 'escenas.json')))
  .map((d) => d.name);
const elegidas = pedidos.length ? pedidos : carpetas;
let errores = 0;
const sinEfecto = efectosFaltantes();
if (sinEfecto.length) {
  console.log(`\n${rojo('✗')} faltan efectos de sonido: ${sinEfecto.join(', ')} (npm run generar:audio -- compartido)`);
  errores += sinEfecto.length;
}
for (const c of elegidas) {
  if (!carpetas.includes(c)) {
    console.log(`\n✗ no existe videos/${c}/escenas.json. Hay: ${carpetas.join(', ')}`);
    errores++;
    continue;
  }
  errores += revisar(c).errores;
}
console.log(errores ? `\n${errores} error(es).` : '\nTodo en orden.');
process.exit(errores ? 1 : 0);
