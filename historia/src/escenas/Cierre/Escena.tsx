import { AbsoluteFill, useCurrentFrame } from 'remotion';
import type { z } from 'zod';
import { Luz } from '../../components/atmosfera/Luz';
import { Sfx } from '../../components/audio/Sfx';
import { Carpeta } from '../../components/graficos/Carpeta';
import { Tarjeta } from '../../components/texto/Tarjeta';
import { beat, mix, tramo } from '../../direction/anim';
import type { EscenaProps } from '../../esquema';
import { mezclar } from '../../estilo/color';
import type { esquema } from './esquema';

type P = z.infer<typeof esquema>;

export const Cierre: React.FC<EscenaProps<P>> = ({ escena, props, video }) => {
  const t = useCurrentFrame() / video.fps;
  const fps = video.fps;
  const pal = video.paleta;
  const b = escena.beats;
  const tCerrar = beat(b, 'cerrar', 1), tNegro = beat(b, 'negro', 4.5), tTarjeta = beat(b, 'tarjeta', 5.4);
  const negro = tramo(t, tNegro, 0.9, 'solemne');
  return (
    <AbsoluteFill style={{ backgroundColor: mezclar(pal.fondo, '#000000', 0.25) }}>
      {/* La misma pila del inicio, ya corregida entera, se cierra: el libro está terminado. */}
      <AbsoluteFill style={{ opacity: mix(1, 0, negro) }}>
        <Luz color={pal.ocre} x={50} y={36} radio={60} intensidad={0.2} />
        <AbsoluteFill style={{ alignItems: 'center', justifyContent: 'center' }}>
          <Carpeta paleta={pal} id={`${escena.id}-carpeta`} cierre={tramo(t, tCerrar, 1.6, 'pesado')} width={500} />
        </AbsoluteFill>
      </AbsoluteFill>
      <AbsoluteFill style={{ alignItems: 'center', justifyContent: 'center' }}>
        <Tarjeta paleta={pal} etiqueta={props.proximo.etiqueta} destacado={props.proximo.anio} titulo={props.proximo.titulo} k={tramo(t, tTarjeta, 1.6, 'natural')} />
      </AbsoluteFill>
      <Sfx nombre="carpeta" en={tCerrar + 1.1} fps={fps} volumen={0.8} />
      <Sfx nombre="nota-final" en={tTarjeta} fps={fps} volumen={0.6} />
    </AbsoluteFill>
  );
};
