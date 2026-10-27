import { AbsoluteFill, Sequence } from 'remotion';
import { MezclaEscena } from '../../components/MezclaEscena';
import type { EscenaResuelta, VideoProps } from '../../types';
import { S01DiasExtra } from './S01DiasExtra';
import { S02Nadador } from './S02Nadador';
import { S03DeudaInflada } from './S03DeudaInflada';
import { S04Pregunta } from './S04Pregunta';
import { S05Serie } from './S05Serie';
import { S06Cierre } from './S06Cierre';
import type { EscenaProps } from './comun';
import { Fragment } from 'react';

const J_FRAMES = 12;
const L_FRAMES = 15;

const ESCENAS: Record<string, React.FC<EscenaProps>> = {
  s01: S01DiasExtra,
  s02: S02Nadador,
  s03: S03DeudaInflada,
  s04: S04Pregunta,
  s05: S05Serie,
  s06: S06Cierre,
};

export const Video000: React.FC<VideoProps> = ({ video, resueltas }) => {
  const escenas: EscenaResuelta[] = resueltas ?? video.escenas.map((e) => ({ ...e, frames: Math.round(e.duracion_s * video.fps), vozSrc: null, vozProvisional: false }));
  let desde = 0;
  return (
    <AbsoluteFill style={{ backgroundColor: video.paleta.fondo }}>
      {escenas.map((e, i) => {
        const Comp = ESCENAS[e.id];
        const inicio = desde;
        desde += e.frames;
        // Cortes J/L por defecto: el sonido de la escena entra antes que su imagen (J) y
        // el de la anterior se queda un poco (L). Un corte duro se declara en el JSON.
        const duro = i > 0 && escenas[i - 1].transicion_salida === 'duro';
        const j = i === 0 || duro ? 0 : J_FRAMES;
        const l = i === escenas.length - 1 || e.transicion_salida === 'duro' ? 0 : L_FRAMES;
        return (
          <Fragment key={e.id}>
            {Comp ? (
              <Sequence from={inicio} durationInFrames={e.frames} name={`${e.id} · ${e.seccion}`}>
                <Comp escena={e} paleta={video.paleta} fps={video.fps} />
              </Sequence>
            ) : null}
            <Sequence from={inicio - j} durationInFrames={e.frames + j + l} name={`${e.id} · audio`} layout="none">
              <MezclaEscena escena={e} fps={video.fps} j={j} l={l} />
            </Sequence>
          </Fragment>
        );
      })}
    </AbsoluteFill>
  );
};
