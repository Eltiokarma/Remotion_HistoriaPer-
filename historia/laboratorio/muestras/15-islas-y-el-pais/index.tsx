import {Composition, registerRoot} from 'remotion';
import {Muestra} from './Muestra';
import datos from './datos.json';
import tiempos from './tiempos.json';
const Root=()=> <Composition id="prueba-002-islas" component={Muestra} width={1920} height={1080} fps={tiempos.fps} durationInFrames={Math.ceil(tiempos.duracion*tiempos.fps)} defaultProps={{datos,tiempos}}/>;
registerRoot(Root);
