import { AbsoluteFill, Audio, Sequence, staticFile } from 'remotion';
import type { EscenaResuelta, VideoProps } from '../../types';
import { S01DiasExtra } from './S01DiasExtra';
import { S02Nadador } from './S02Nadador';
import { S03DeudaInflada } from './S03DeudaInflada';
import { S04Pregunta } from './S04Pregunta';
import { S05Serie } from './S05Serie';
import { S06Cierre } from './S06Cierre';
import type { EscenaProps } from './comun';

const ESCENAS: Record<string, React.FC<EscenaProps>> = {
  s01: S01DiasExtra,
  s02: S02Nadador,
  s03: S03DeudaInflada,
  s04: S04Pregunta,
  s05: S05Serie,
  s06: S06Cierre,
};

export const Video000: React.FC<VideoProps> = ({ video, resueltas }) => {
  const escenas: EscenaResuelta[] = resueltas ?? video.escenas.map((e) => ({ ...e, frames: Math.round(e.duracion_s * video.fps), vozOk: false }));
  let desde = 0;
  return (
    <AbsoluteFill style={{ backgroundColor: video.paleta.fondo }}>
      {escenas.map((e) => {
        const Comp = ESCENAS[e.id];
        const inicio = desde;
        desde += e.frames;
        if (!Comp) return null;
        return (
          <Sequence key={e.id} from={inicio} durationInFrames={e.frames} name={`${e.id} · ${e.seccion}`}>
            <Comp escena={e} paleta={video.paleta} fps={video.fps} />
            {/* Fade de 6 frames en la voz: nada entra ni sale en seco. */}
            {e.vozOk && e.voz ? (
              <Audio
                src={staticFile(e.voz)}
                volume={(f) => Math.min(1, f / 6, Math.max(0, (e.frames - f) / 6))}
              />
            ) : null}
          </Sequence>
        );
      })}
    </AbsoluteFill>
  );
};
