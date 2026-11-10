import {Composition, registerRoot} from 'remotion';
import {Muestra} from './Muestra';
import datos from './datos.json';
import tiempos from './tiempos.json';
import geografia from './geografia.json';
import mapa from './mapa-inline.json';
const Root=()=> <>
 <Composition id="prueba-002-islas" component={Muestra} width={1920} height={1080} fps={tiempos.fps} durationInFrames={Math.ceil(tiempos.duracion*tiempos.fps)} defaultProps={{datos,tiempos,geografia,mapa}}/>
 <Composition id="prueba-002-recorrido" component={Muestra} width={1920} height={1080} fps={tiempos.fps} durationInFrames={geografia.camara.duracion_muestra*tiempos.fps} defaultProps={{datos,tiempos,geografia,mapa,soloIntroduccion:true}}/>
</>;
registerRoot(Root);
