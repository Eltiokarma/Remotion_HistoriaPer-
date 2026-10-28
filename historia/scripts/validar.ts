/**
 * Revisa los videos antes de renderizar (CLAUDE.md §1.2, §3–§6 y §12).
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
import { existsSync, readdirSync, readFileSync } from 'node:fs';
import path from 'node:path';
import {
  curva, desviacion, DESVIACION_MINIMA, DUCKING_DB, ESTADOS_MUSICA, estadosMusica, SILENCIO_S, TOLERANCIA_DURACION, triosParejos,
} from '../src/direction/ritmo';
import { CATALOGO } from '../src/escenas/esquemas';
import { COLA_S } from '../src/direction/voz';
import type { ReglaDeOficio } from '../src/esquema';
import { validarVideo } from '../src/validacion';
import { medir, mmss, PUBLIC, RAIZ, VIDEOS } from './comun';

const args = process.argv.slice(2);
const final = args.includes('--final');
const pedidos = args.filter((a) => !a.startsWith('--'));

const tinta = (codigo: number) => (t: string) => (process.stdout.isTTY ? `\x1b[${codigo}m${t}\x1b[0m` : t);
const [rojo, amarillo, verde, negrita] = [31, 33, 32, 1].map(tinta);

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
  // una regla de oficio rota a propósito (declarada en "excepciones") es una decisión, no un error
  const decisiones: string[] = [];
  const oficio = (regla: ReglaDeOficio, escenas: string[], mensaje: string, destino: string[]) => {
    const ex = (video.excepciones ?? []).find((x) => x.regla === regla && (!x.escenas || escenas.length === 0 || escenas.some((id) => x.escenas!.includes(id))));
    if (ex) decisiones.push(`${mensaje} — ${ex.motivo}`);
    else destino.push(mensaje);
  };

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
      // «(condición) …» = beat que solo hace falta en una variante de la escena; con `hasta` (el
      // último paso que se muestra), los beats que vienen después tampoco hacen falta
      const orden = Object.keys(entrada.beats);
      const hasta = (e.props as { hasta?: unknown } | undefined)?.hasta;
      const despues = (b: string) => typeof hasta === 'string' && orden.includes(hasta) && orden.indexOf(b) > orden.indexOf(hasta);
      for (const b of usados) if (!(b in e.beats) && !que(b).startsWith('(') && !despues(b)) avisos.push(`${e.id}: falta el beat "${b}" (${que(b)}); se usa el valor por defecto`);
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
      oficio('ducking', [e.id], `${e.id}: duck_db ${audio.duck_db} fuera del rango del canal (${DUCKING_DB[0]} a ${DUCKING_DB[1]} dB)`, avisos);
    }
    if (audio?.silencio && e.beats[audio.silencio.desde_beat] !== undefined && e.beats[audio.silencio.hasta_beat] !== undefined) {
      const s = (e.beats[audio.silencio.hasta_beat] - e.beats[audio.silencio.desde_beat]) * (e.beats_ajustados ? 1 : m.k);
      if (s < SILENCIO_S[0] || s > SILENCIO_S[1]) oficio('largo-silencio', [e.id], `${e.id}: el silencio dura ${s.toFixed(1)} s (el canal pide ${SILENCIO_S[0]}–${SILENCIO_S[1]} s)`, avisos);
    }
    if (final && m.voz !== 'real') errores.push(`${e.id}: ${m.voz === 'provisional' ? 'suena la voz provisional' : 'no hay voz'}; graba public/videos/${video.id}/voz/${e.id}.wav`);
  });

  // —— ritmo del video completo
  const duraciones = medidas.map((m) => m.duracion);
  for (const i of triosParejos(duraciones)) {
    const ids = video.escenas.slice(i, i + 3).map((e) => e.id).join(', ');
    oficio('duraciones-parejas', video.escenas.slice(i, i + 3).map((e) => e.id), `${ids} duran casi lo mismo (±${TOLERANCIA_DURACION * 100}%): tres planos parejos se sienten robóticos`, errores);
  }
  const intensidades = video.escenas.map((e) => e.intensidad);
  const desv = desviacion(intensidades);
  if (video.escenas.length > 1 && desv < DESVIACION_MINIMA) oficio('intensidad-plana', [], `la curva de intensidad es plana (desviación ${desv.toFixed(2)}, mínimo ${DESVIACION_MINIMA})`, errores);
  const pico = intensidades.indexOf(Math.max(...intensidades));
  if (video.escenas.length >= 3 && pico < video.escenas.length / 3) oficio('pico-temprano', [], `el pico de intensidad está en ${video.escenas[pico].id}, muy al principio: la curva debería subir hacia el clímax`, avisos);
  const conSilencio = video.escenas.some((e) => e.audio?.silencio);
  if (!conSilencio) oficio('sin-silencio', [], 'no hay ningún silencio deliberado (audio.silencio en alguna escena)', final ? errores : avisos);
  const estados = estadosMusica(video.escenas.map((e) => e.estado_musica));
  if (estados.size < 3) oficio('estados-musica', [], `la música pasa por ${estados.size} estado(s) (${[...estados].join(', ') || 'ninguno anotado'}); el canal pide ${ESTADOS_MUSICA.join(', ')}`, final ? errores : avisos);
  if (!video.escenas.some((e) => e.intencion)) avisos.push('ninguna escena anota su "intencion" (al menos una yuxtaposición deliberada por video)');

  const porCompletar = (readFileSync(archivo, 'utf8').match(/\[POR COMPLETAR/g) ?? []).length;
  if (porCompletar) (final ? errores : avisos).push(`escenas.json tiene ${porCompletar} «[POR COMPLETAR…]» de la plantilla`);

  // —— fuentes y glosario
  const fuentes = path.join(VIDEOS, carpeta, 'fuentes.md');
  if (!existsSync(fuentes)) errores.push('falta fuentes.md');
  else {
    // lo que va entre comillas invertidas es la explicación de la marca, no un dato pendiente
    const pendientes = (readFileSync(fuentes, 'utf8').replace(/`[^`\n]*`/g, '').match(/\[VERIFICAR\]/g) ?? []).length;
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
  for (const d of decisiones) console.log(`  · decisión: ${d}`);
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
