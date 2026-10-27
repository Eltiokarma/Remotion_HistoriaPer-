import { Composition, Folder, type CalculateMetadataFunction } from 'remotion';
import { resolverEscenas } from './direction/timing';
import { CATALOGO, type NombreEscena } from './escenas/esquemas';
import type { VideoData } from './esquema';
import './estilo/fuentes';
import { VIDEOS } from './registro';
import { calcularCatalogo, EscenaDeCatalogo, esquemaCatalogo, muestraDe } from './templates/Catalogo';
import { VideoLargo, type PropsVideo } from './templates/VideoLargo';
import { validarVideo } from './validacion';

/** Valida el JSON, mide la voz de cada escena y calcula la duración total. */
const calcular: CalculateMetadataFunction<PropsVideo> = async ({ props }) => {
  const { video, errores } = validarVideo(props.video, props.soloEscena);
  if (!video || errores.length) {
    throw new Error(`Hay que corregir videos/${(props.video as VideoData)?.id ?? '?'}/escenas.json:\n- ${errores.join('\n- ')}`);
  }
  const todas = await resolverEscenas(video.id, video.escenas, video.fps);
  const usadas = props.soloEscena ? todas.filter((e) => e.id === props.soloEscena) : todas;
  return {
    durationInFrames: Math.max(1, usadas.reduce((a, e) => a + e.frames, 0)),
    fps: video.fps,
    width: video.ancho,
    height: video.alto,
    props: { ...props, video, resueltas: todas },
  };
};

const compId = (v: VideoData) => `v${v.id}`;

export const RemotionRoot: React.FC = () => (
  <>
    {(VIDEOS as VideoData[]).map((v) => (
      <Folder key={v.id} name={compId(v)}>
        <Composition id={compId(v)} component={VideoLargo} defaultProps={{ video: v }} calculateMetadata={calcular}
          durationInFrames={30} fps={v.fps} width={v.ancho} height={v.alto} />
        {/* cada escena sola, para trabajarla sin renderizar todo el video */}
        {v.escenas.map((e) => (
          <Composition key={e.id} id={`${compId(v)}-${e.id}`} component={VideoLargo} defaultProps={{ video: v, soloEscena: e.id }}
            calculateMetadata={calcular} durationInFrames={30} fps={v.fps} width={v.ancho} height={v.alto} />
        ))}
      </Folder>
    ))}
    {/* todas las escenas reutilizables con datos de muestra, editables desde el panel de props */}
    <Folder name="catalogo">
      {(Object.keys(CATALOGO) as NombreEscena[]).map((nombre) => (
        <Composition key={nombre} id={`catalogo-${nombre}`} component={EscenaDeCatalogo} schema={esquemaCatalogo(nombre)}
          defaultProps={muestraDe(nombre)} calculateMetadata={calcularCatalogo} durationInFrames={30} fps={30} width={1920} height={1080} />
      ))}
    </Folder>
  </>
);
