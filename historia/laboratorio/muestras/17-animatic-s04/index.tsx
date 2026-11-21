import { Composition, registerRoot } from 'remotion';
import { Animatic4A } from './Animatic4A';
import { FPS, duracion } from './linea';

const Root = () => (
  <>
    <Composition id="animatic-s04-A" component={Animatic4A} width={1920} height={1080} fps={FPS} durationInFrames={Math.ceil(duracion('A') * FPS)} />
  </>
);

registerRoot(Root);
