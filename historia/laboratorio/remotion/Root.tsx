import { Composition, Folder } from 'remotion';
import { PrecargaTexturas } from '../../src/components/atmosfera/PrecargaTexturas';
import '../../src/estilo/fuentes';
import { CordilleraTinta } from '../muestras/02-cordillera-tinta/Muestra';
import { VientoP5 } from '../muestras/03-viento-p5/Muestra';
import { LibroTres } from '../muestras/04-libro-3d/Muestra';
import { MapaDocumento } from '../muestras/05-mapa-documento/Muestra';
import { MesaConVolumen } from '../muestras/06-mesa-con-volumen/Muestra';
import { ALTO, ANCHO, DURACION, FPS } from './comun';

/**
 * Las muestras del laboratorio: 1920 × 1080, 30 fps, 5 s exactos salvo que declaren su duración
 * (la 06 dura 10 s porque Gerson pidió un ejemplo de 10 s, 2026-11-04).
 */
const MUESTRAS: { id: string; componente: React.FC; duracion?: number }[] = [
  { id: 'lab-02-cordillera-tinta', componente: CordilleraTinta },
  { id: 'lab-03-viento-p5', componente: VientoP5 },
  { id: 'lab-04-libro-3d', componente: LibroTres },
  { id: 'lab-05-mapa-documento', componente: MapaDocumento },
  { id: 'lab-06-mesa-con-volumen', componente: MesaConVolumen, duracion: 300 },
];

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
      <Composition key={m.id} id={m.id} component={conPrecarga(m.componente)} durationInFrames={m.duracion ?? DURACION} fps={FPS} width={ANCHO} height={ALTO} />
    ))}
  </Folder>
);
