import { Composition, registerRoot } from 'remotion';
import { Animatic } from './Animatic';
import { FPS, duracion, type Version } from './linea';

const versiones: Version[] = ['A', 'B', 'C'];

const Root = () => (
  <>
    {versiones.map((v) => (
      <Composition key={v} id={`animatic-s03-${v}`} component={Animatic} width={1920} height={1080} fps={FPS}
        durationInFrames={Math.ceil(duracion(v) * FPS)} defaultProps={{ version: v }} />
    ))}
  </>
);

registerRoot(Root);
