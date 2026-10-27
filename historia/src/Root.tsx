import { Composition, type CalculateMetadataFunction } from 'remotion';
import datos000 from '../videos/000-quiroz/escenas.json';
import { resolverEscenas } from './direction/timing';
import type { VideoData, VideoProps } from './types';
import { Video000 } from './videos/v000/Video000';

const calcular: CalculateMetadataFunction<VideoProps> = async ({ props }) => {
  const resueltas = await resolverEscenas(props.video.escenas, props.video.fps);
  return {
    durationInFrames: resueltas.reduce((a, e) => a + e.frames, 0),
    fps: props.video.fps,
    width: props.video.ancho,
    height: props.video.alto,
    props: { ...props, resueltas },
  };
};

const video000 = datos000 as unknown as VideoData;

export const RemotionRoot: React.FC = () => (
  <Composition
    id="v000-quiroz"
    component={Video000}
    defaultProps={{ video: video000 }}
    calculateMetadata={calcular}
    // valores provisionales: calculateMetadata los reemplaza
    durationInFrames={30}
    fps={video000.fps}
    width={video000.ancho}
    height={video000.alto}
  />
);
