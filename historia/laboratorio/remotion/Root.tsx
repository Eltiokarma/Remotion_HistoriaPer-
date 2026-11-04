import { Composition, Folder } from 'remotion';
import { PrecargaTexturas } from '../../src/components/atmosfera/PrecargaTexturas';
import '../../src/estilo/fuentes';
import { CordilleraTinta } from '../muestras/02-cordillera-tinta/Muestra';
import { VientoP5 } from '../muestras/03-viento-p5/Muestra';
import { LibroTres } from '../muestras/04-libro-3d/Muestra';
import { MapaDocumento } from '../muestras/05-mapa-documento/Muestra';
import { LluviaPixi } from '../muestras/06-lluvia-pixi/Muestra';
import { ALTO, ANCHO, DURACION, FPS } from './comun';

/** Las muestras del laboratorio. Todas: 5 s exactos, 1920 × 1080, 30 fps. */
const MUESTRAS = [
  { id: 'lab-02-cordillera-tinta', componente: CordilleraTinta },
  { id: 'lab-03-viento-p5', componente: VientoP5 },
  { id: 'lab-04-libro-3d', componente: LibroTres },
  { id: 'lab-05-mapa-documento', componente: MapaDocumento },
  { id: 'lab-06-lluvia-pixi', componente: LluviaPixi },
] as const;

/** Cada muestra lleva la misma precarga de texturas que los episodios (VideoLargo). */
const conPrecarga = (C: React.FC): React.FC => {
  const Envuelta: React.FC = () => (
    <>
      <C />
      <PrecargaTexturas />
    </>
  );
  return Envuelta;
};

export const LabRoot: React.FC = () => (
  <Folder name="laboratorio">
    {MUESTRAS.map((m) => (
      <Composition key={m.id} id={m.id} component={conPrecarga(m.componente)} durationInFrames={DURACION} fps={FPS} width={ANCHO} height={ALTO} />
    ))}
  </Folder>
);
