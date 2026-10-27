import { Fragment } from 'react';
import { AbsoluteFill, Sequence } from 'remotion';
import { Atmosfera } from '../components/atmosfera/Atmosfera';
import { MezclaEscena } from '../components/audio/MezclaEscena';
import { framesSinVoz } from '../direction/voz';
import { COMPONENTES } from '../escenas';
import type { EscenaResuelta, VideoData } from '../esquema';
import { fuente } from '../estilo/fuentes';

const J_FRAMES = 12; // el sonido de la escena siguiente entra antes que su imagen
const L_FRAMES = 15; // el de la anterior se queda un poco

export type PropsVideo = {
  video: VideoData;
  /** Lo completa calculateMetadata (duraciones reales según la voz). */
  resueltas?: EscenaResuelta[];
  /** Si viene, solo se dibuja esta escena (para trabajarla sola en el Studio). */
  soloEscena?: string;
};

const EscenaFaltante: React.FC<{ nombre: string; color: string }> = ({ nombre, color }) => (
  <AbsoluteFill style={{ alignItems: 'center', justifyContent: 'center', fontFamily: fuente.mono, fontSize: 40, color }}>
    No existe la escena «{nombre}»
  </AbsoluteFill>
);

/** Formato largo (16:9): arma las escenas del JSON, su audio con cortes J/L y la capa de película. */
export const VideoLargo: React.FC<PropsVideo> = ({ video, resueltas, soloEscena }) => {
  const todas: EscenaResuelta[] = resueltas ?? video.escenas.map((e) => ({ ...e, frames: framesSinVoz(e, video.fps), vozSrc: null, vozProvisional: false }));
  const escenas = soloEscena ? todas.filter((e) => e.id === soloEscena) : todas;
  let desde = 0;
  return (
    <AbsoluteFill style={{ backgroundColor: video.paleta.fondo }}>
      {escenas.map((e, i) => {
        const Comp = COMPONENTES[e.componente as keyof typeof COMPONENTES];
        const inicio = desde;
        desde += e.frames;
        // Cortes J/L por defecto; un corte duro se declara con "transicion_salida": "duro".
        const duro = i > 0 && escenas[i - 1].transicion_salida === 'duro';
        const j = i === 0 || duro ? 0 : J_FRAMES;
        const l = i === escenas.length - 1 || e.transicion_salida === 'duro' ? 0 : L_FRAMES;
        return (
          <Fragment key={e.id}>
            <Sequence from={inicio} durationInFrames={e.frames} name={`${e.id} · ${e.componente}`}>
              {Comp ? <Comp escena={e} props={e.props} video={video} /> : <EscenaFaltante nombre={e.componente} color={video.paleta.papel} />}
            </Sequence>
            <Sequence from={inicio - j} durationInFrames={e.frames + j + l} name={`${e.id} · audio`} layout="none">
              <MezclaEscena escena={e} videoId={video.id} fps={video.fps} j={j} l={l} />
            </Sequence>
          </Fragment>
        );
      })}
      <Atmosfera grano={video.atmosfera?.grano ?? 0.1} vineta={video.atmosfera?.vineta ?? 0.45} />
    </AbsoluteFill>
  );
};
