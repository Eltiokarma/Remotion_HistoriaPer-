import { AbsoluteFill, Img, useCurrentFrame } from 'remotion';
import type { z } from 'zod';
import { Luz } from '../../components/atmosfera/Luz';
import { Sfx } from '../../components/audio/Sfx';
import { LomosDeLibro } from '../../components/graficos/LomosDeLibro';
import { beat, tramo } from '../../direction/anim';
import type { EscenaProps } from '../../esquema';
import { delVideo } from '../../estilo/recursos';
import type { esquema } from './esquema';

type P = z.infer<typeof esquema>;

export const SerieCapitulos: React.FC<EscenaProps<P>> = ({ escena, props, video }) => {
  const t = useCurrentFrame() / video.fps;
  const fps = video.fps;
  const pal = video.paleta;
  const b = escena.beats;
  const tLinea = beat(b, 'linea', 0), tCaps = beat(b, 'capitulos', 2), paso = beat(b, 'paso', 1.5), tPregunta = beat(b, 'pregunta', 15);
  const encendido = props.capitulos.map((_, i) => tramo(t, tCaps + i * paso, 0.8, 'pesado'));
  const asentado = props.capitulos.map((_, i) => tramo(t, tCaps + i * paso + paso, 0.7, 'natural'));

  return (
    <AbsoluteFill style={{ backgroundColor: pal.fondo }}>
      {props.fondo_asset ? (
        <Img src={delVideo(video.id, `imagenes/${props.fondo_asset}`)}
          style={{ position: 'absolute', inset: 0, width: '100%', height: '100%', objectFit: 'cover', opacity: 0.1, filter: 'grayscale(1) sepia(0.4)' }} />
      ) : null}
      <Luz color={pal.ocre} x={50} y={18} radio={75} intensidad={0.16} />
      <LomosDeLibro paleta={pal} id={`${escena.id}-lomos`} capitulos={props.capitulos} encendido={encendido} asentado={asentado}
        hoy={tramo(t, tPregunta, 1.6, 'pesado')} etiquetaHoy={props.etiqueta_hoy} aparece={tramo(t, tLinea, 1.0, 'natural')} />
      {props.capitulos.map((_, i) => <Sfx key={i} nombre="tic" en={tCaps + i * paso} fps={fps} volumen={0.4} />)}
      <Sfx nombre="soplo" en={tPregunta} fps={fps} volumen={0.3} />
    </AbsoluteFill>
  );
};
