import { AbsoluteFill, useCurrentFrame } from 'remotion';
import type { z } from 'zod';
import { Luz } from '../../components/atmosfera/Luz';
import { Sfx } from '../../components/audio/Sfx';
import { Carpeta } from '../../components/graficos/Carpeta';
import { GotaMercurio } from '../../components/graficos/GotaMercurio';
import { Ficha } from '../../components/texto/Ficha';
import { Tarjeta } from '../../components/texto/Tarjeta';
import { beat, mix, tramo } from '../../direction/anim';
import type { EscenaProps } from '../../esquema';
import { mezclar } from '../../estilo/color';
import type { esquema } from './esquema';

type P = z.infer<typeof esquema>;
const CPS = 18;

export const Cierre: React.FC<EscenaProps<P>> = ({ escena, props, video }) => {
  const t = useCurrentFrame() / video.fps;
  const fps = video.fps;
  const pal = video.paleta;
  const b = escena.beats;
  const tCerrar = beat(b, 'cerrar', 1), tNegro = beat(b, 'negro', 4.5), tTarjeta = beat(b, 'tarjeta', 5.4);
  const tLimpiar = beat(b, 'limpiar', 0.5), tFicha = beat(b, 'ficha', 1.5);
  const negro = tramo(t, tNegro, 0.9, 'solemne');
  // con las pruebas del inicio, la tapa aparece recién antes de cerrarse
  const tapa = props.limpiar ? tramo(t, tCerrar - 1.2, 1, 'natural') : 1;
  return (
    <AbsoluteFill style={{ backgroundColor: mezclar(pal.fondo, '#000000', 0.3) }}>
      {/* La misma pila del inicio, ya corregida entera, se cierra: el libro está terminado. */}
      <AbsoluteFill style={{ opacity: mix(1, 0, negro) }}>
        <Luz color={pal.ocre} x={50} y={40} radio={62} intensidad={0.22} />
        <AbsoluteFill style={{ alignItems: 'center', justifyContent: 'center' }}>
          <div style={{ marginTop: 60 }}>
            <Carpeta paleta={pal} id={`${escena.id}-carpeta`} cierre={tramo(t, tCerrar, 1.6, 'pesado')} width={props.limpiar ? 620 : 500}
              variante={props.limpiar ? 'pruebas' : undefined} semilla={props.limpiar ? 2013 : undefined}
              limpieza={props.limpiar ? tramo(t, tLimpiar, 4, 'natural') : 0} tapaVisible={tapa} />
          </div>
        </AbsoluteFill>
        {props.ficha ? (
          <div style={{ position: 'absolute', left: 120, top: 96 }}>
            <Ficha texto={props.ficha} t={t - tFicha} color={pal.papel} acento={pal.rojo} size={28} cps={CPS} />
          </div>
        ) : null}
      </AbsoluteFill>
      <AbsoluteFill style={{ alignItems: 'center', justifyContent: 'center' }}>
        {props.emblema === 'mercurio' ? (
          <div style={{ marginBottom: 30, opacity: tramo(t, tTarjeta + 0.5, 1.2, 'natural') }}>
            <GotaMercurio id={`${escena.id}-gota`} size={150} latido={t - tTarjeta} caida={tramo(t, tTarjeta + 0.5, 0.7, 'ligero')} />
          </div>
        ) : null}
        <Tarjeta paleta={pal} etiqueta={props.proximo.etiqueta} destacado={props.proximo.anio} titulo={props.proximo.titulo} k={tramo(t, tTarjeta, 1.6, 'natural')} />
      </AbsoluteFill>
      {props.ficha ? props.ficha.split('').map((ch, i) => (ch === ' ' ? null : <Sfx key={`k${i}`} nombre={`tecla-${(i % 3) + 1}`} en={tFicha + i / CPS} fps={fps} volumen={0.3} />)) : null}
      <Sfx nombre="carpeta" en={tCerrar + 1.1} fps={fps} volumen={0.8} />
      <Sfx nombre="nota-final" en={tTarjeta} fps={fps} volumen={0.4} />
    </AbsoluteFill>
  );
};
