import { useAudioData } from '@remotion/media-utils';
import { useMemo } from 'react';
import { Audio, Sequence, staticFile } from 'remotion';
import type { AudioEscena, EscenaResuelta } from '../../esquema';
import { ambiente, delVideo } from '../../estilo/recursos';

type Ventana = { nivel: number; desde_beat?: string; hasta_beat?: string };

type Props = {
  escena: EscenaResuelta;
  videoId: string;
  fps: number;
  /** Frames que el audio de esta escena empieza antes que su imagen (corte J). */
  j: number;
  /** Frames que el audio sigue sonando bajo la escena siguiente (corte L). */
  l: number;
};

const FADE_MIN = 6; // ningún sonido entra ni sale en seco
const RAMPA_S = 0.5;

/** 0→1 al pasar por `desde`, 1→0 al pasar por `hasta` (con rampas, nunca en seco). */
const ventana = (t: number, desde: number | undefined, hasta: number | undefined, rampa = RAMPA_S) => {
  let v = 1;
  if (desde !== undefined) v = Math.min(v, Math.max(0, Math.min(1, (t - desde) / rampa)));
  if (hasta !== undefined) v = Math.min(v, Math.max(0, Math.min(1, (hasta - t) / rampa)));
  return v;
};

/**
 * Cuánto habla la voz en cada frame (0–1), suavizado: baja rápido antes de la palabra y
 * vuelve despacio después, como lo haría una persona en la consola de mezcla.
 */
const useActividadVoz = (src: string, fps: number, frames: number): number[] => {
  const datos = useAudioData(staticFile(src), { sampleRate: 8000 });
  return useMemo(() => {
    if (!datos) return [];
    const ch = datos.channelWaveforms[0];
    const sr = datos.sampleRate;
    const rms: number[] = [];
    for (let i = 0; i < frames; i++) {
      const a = Math.max(0, Math.floor(((i - 0.5) / fps) * sr));
      const b = Math.min(ch.length, Math.floor(((i + 1.5) / fps) * sr));
      let s = 0;
      for (let k = a; k < b; k++) s += ch[k] * ch[k];
      rms.push(b > a ? Math.sqrt(s / (b - a)) : 0);
    }
    const max = Math.max(1e-6, ...rms);
    const crudo = rms.map((r) => Math.max(0, Math.min(1, (r / max - 0.06) / 0.14)));
    const soltar = Math.exp(-1 / (0.35 * fps));
    const suave: number[] = [];
    let y = 0;
    for (const v of crudo) { y = Math.max(v, y * soltar); suave.push(y); }
    // mirar 3 frames adelante: la música baja justo antes de que empiece la palabra
    return suave.map((_, i) => Math.max(...suave.slice(i, i + 4)));
  }, [datos, fps, frames]);
};

const Mezcla: React.FC<Props & { actividad: number[] | null }> = ({ escena, videoId, fps, j, l, actividad }) => {
  const cfg: AudioEscena = escena.audio ?? {};
  const b = escena.beats;
  const total = escena.frames + j + l;
  const duck = Math.pow(10, (cfg.duck_db ?? -14) / 20);
  const sil = cfg.silencio;

  const volumen = (p: Ventana, conDuck: boolean) => (f: number): number => {
    const t = (f - j) / fps; // tiempo de la escena
    const bordes = Math.min(1, f / Math.max(FADE_MIN, j), (total - f) / Math.max(FADE_MIN, l));
    const tramo = ventana(t, p.desde_beat ? b[p.desde_beat] : undefined, p.hasta_beat ? b[p.hasta_beat] : undefined);
    const silencio = sil ? 1 - ventana(t, b[sil.desde_beat], b[sil.hasta_beat], 0.35) : 1;
    const habla = conDuck && actividad ? actividad[Math.max(0, Math.min(actividad.length - 1, f - j))] ?? 0 : 0;
    return Math.max(0, p.nivel * bordes * tramo * silencio * (1 - (1 - duck) * habla));
  };

  return (
    <>
      {cfg.musica ? <Audio src={delVideo(videoId, `musica/${cfg.musica.archivo}`)} volume={volumen(cfg.musica, true)} name={`música ${cfg.musica.archivo}`} /> : null}
      {(cfg.ambientes ?? []).map((a) => (
        <Audio key={a.nombre} src={ambiente(a.nombre)} loop volume={volumen(a, false)} name={`ambiente ${a.nombre}`} />
      ))}
      {escena.vozSrc ? (
        <Sequence from={j} durationInFrames={escena.frames} layout="none" name={escena.vozProvisional ? 'voz provisional' : 'voz'}>
          <Audio src={staticFile(escena.vozSrc)} volume={(f) => Math.min(1, f / FADE_MIN, (escena.frames - f) / FADE_MIN)} />
        </Sequence>
      ) : null}
    </>
  );
};

const ConVoz: React.FC<Props & { src: string }> = (props) => {
  const actividad = useActividadVoz(props.src, props.fps, props.escena.frames);
  return <Mezcla {...props} actividad={actividad} />;
};

/** Voz, música y ambiente de una escena, con ducking bajo la voz y cortes J/L. */
export const MezclaEscena: React.FC<Props> = (props) =>
  props.escena.vozSrc ? <ConVoz {...props} src={props.escena.vozSrc} /> : <Mezcla {...props} actividad={null} />;
