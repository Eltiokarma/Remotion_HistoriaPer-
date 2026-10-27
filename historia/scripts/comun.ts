/** Lo que comparten los scripts: rutas, duración de audios y cómo se mide cada escena. */
import { execFileSync } from 'node:child_process';
import { existsSync } from 'node:fs';
import path from 'node:path';
import { candidatosVoz, COLA_S } from '../src/direction/voz';
import type { Escena } from '../src/esquema';

export const RAIZ = path.resolve(__dirname, '..');
export const PUBLIC = path.join(RAIZ, 'public');
export const VIDEOS = path.join(RAIZ, 'videos');

/** Duración de un audio en segundos, con el ffprobe del sistema o el que trae Remotion. */
export const duracionAudio = (archivo: string): number | null => {
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

export type Medida = { duracion: number; voz: 'real' | 'provisional' | 'ninguna'; k: number };

/** Lo mismo que hace el Studio (direction/timing.ts): si hay voz, manda la voz. */
export const medir = (videoId: string, e: Escena): Medida => {
  for (const [ruta, provisional] of candidatosVoz(videoId, e.id)) {
    const archivo = path.join(PUBLIC, ruta);
    if (!existsSync(archivo)) continue;
    const d = duracionAudio(archivo);
    if (d === null) continue;
    return { duracion: d + (e.cola_s ?? COLA_S), voz: provisional ? 'provisional' : 'real', k: e.beats_ajustados ? 1 : d / e.duracion_s };
  }
  return { duracion: e.duracion_s + (e.cola_s ?? COLA_S), voz: 'ninguna', k: 1 };
};

export const mmss = (s: number) => { const r = Math.round(s); return `${Math.floor(r / 60)}:${String(r % 60).padStart(2, '0')}`; };
