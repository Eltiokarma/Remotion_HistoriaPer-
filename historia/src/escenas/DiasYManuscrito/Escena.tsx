import { AbsoluteFill, spring, useCurrentFrame } from 'remotion';
import { Luz } from '../../components/atmosfera/Luz';
import { Sfx } from '../../components/audio/Sfx';
import { Calendario } from '../../components/graficos/Calendario';
import { PilaDePaginas } from '../../components/graficos/PilaDePaginas';
import { MaquinaDeEscribir } from '../../components/texto/MaquinaDeEscribir';
import { beat, tramo } from '../../direction/anim';
import type { EscenaProps } from '../../esquema';
import { mezclar } from '../../estilo/color';
import type { z } from 'zod';
import type { esquema } from './esquema';

type P = z.infer<typeof esquema>;
const CPS = 11, DUR_CORR = 5, TRAZOS = 8;

/** Momentos en que cae cada hoja: cada vez más espaciados, hasta la que se queda. */
const caidas = (inicio: number, ultima: number): number[] => {
  const out: number[] = [];
  let t = inicio, gap = 0.3;
  while (t < ultima - 0.2) { out.push(t); t += gap; gap *= 1.3; }
  return out;
};

export const DiasYManuscrito: React.FC<EscenaProps<P>> = ({ escena, props, video }) => {
  const frame = useCurrentFrame();
  const fps = video.fps;
  const t = frame / fps;
  const pal = video.paleta;
  const b = escena.beats;
  const ultima = beat(b, 'ultima_hoja', 11), tFecha = beat(b, 'fecha', 0.4), tCorr = beat(b, 'correcciones', 5.5);
  const tiempos = caidas(1.2, ultima);
  const cayendo = tiempos.findIndex((tc) => t >= tc && t < tc + 1.0);
  const hechas = tiempos.filter((tc) => t >= tc + 1.0).length;
  const visible = hechas + (cayendo >= 0 ? 1 : 0);
  // La última hoja tira, se levanta de una esquina y vuelve: se queda pegada.
  const vuelve = t >= ultima ? spring({ frame: frame - ultima * fps, fps, config: { damping: 7, mass: 0.7, stiffness: 120 } }) : 0;
  const tiron = t >= ultima ? 14 * Math.sin(Math.min(1, (t - ultima) / 0.25) * Math.PI / 2) * (1 - vuelve) : 0;
  const aparece = tramo(t, 0, 1.0, 'natural');

  return (
    <AbsoluteFill style={{ backgroundColor: mezclar(pal.fondo, '#000000', 0.25) }}>
      <Luz color={pal.ocre} x={34} y={30} radio={70} intensidad={0.2} />
      <AbsoluteFill style={{ alignItems: 'center', paddingTop: 120 }}>
        <MaquinaDeEscribir texto={props.fecha} t={t - tFecha} cps={CPS} color={pal.papel} size={48} />
      </AbsoluteFill>

      <div style={{ position: 'absolute', left: 300, top: 300, opacity: aparece }}>
        <Calendario paleta={pal} dia={visible + 1} etiqueta={props.etiqueta_dia} arrancadas={hechas}
          cayendo={cayendo >= 0 ? { dia: cayendo + 1, k: tramo(t, tiempos[cayendo], 1.0, 'tenso') } : null}
          tiron={hechas === tiempos.length ? tiron : 0} />
      </div>

      <div style={{ position: 'absolute', left: 1050, top: 236, opacity: aparece, transform: 'rotate(2.5deg)' }}>
        <PilaDePaginas paleta={pal} id="s01-pila" width={560} correcciones={tramo(t, tCorr, DUR_CORR, 'natural')} />
      </div>

      {props.fecha.split('').map((_, i) => (
        <Sfx key={`k${i}`} nombre={`tecla-${(i % 3) + 1}`} en={tFecha + i / CPS} fps={fps} volumen={0.45} />
      ))}
      {tiempos.map((tc, i) => <Sfx key={`h${i}`} nombre="hoja" en={tc} fps={fps} volumen={0.5} />)}
      <Sfx nombre="hoja" en={ultima} fps={fps} volumen={0.25} />
      {Array.from({ length: TRAZOS }, (_, i) => (
        <Sfx key={`p${i}`} nombre="pluma" en={tCorr + (i * DUR_CORR) / TRAZOS} fps={fps} volumen={0.22} />
      ))}
    </AbsoluteFill>
  );
};
