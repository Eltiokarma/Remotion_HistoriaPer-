import { AbsoluteFill, useCurrentFrame } from 'remotion';
import type { z } from 'zod';
import { Luz } from '../../components/atmosfera/Luz';
import { Sfx } from '../../components/audio/Sfx';
import { Carpeta } from '../../components/graficos/Carpeta';
import { useLamina } from '../../components/graficos/vectorcraft/Lamina';
import { GotaMercurio } from '../../components/graficos/GotaMercurio';
import { Ficha } from '../../components/texto/Ficha';
import { Tarjeta } from '../../components/texto/Tarjeta';
import { beat, escala, impacto, mix, tramo } from '../../direction/anim';
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
  const lCarpeta = useLamina(props.laminas?.carpeta ? { videoId: video.id, archivo: props.laminas.carpeta } : undefined);
  // la tapa se levanta despacio y cae sola (acelera hasta el golpe, no frena antes); al golpear rebota
  // unos grados y la pila de papel se aplasta apenas
  const CIERRA = 1.1;
  const tGolpe = tCerrar + CIERRA;
  const dt = t - tGolpe;
  const rebote = dt > 0 ? 0.035 * Math.exp(-dt * 8) * Math.abs(Math.sin(dt * 18)) : 0;
  const cierre = tramo(t, tCerrar, CIERRA, 'tenso') - rebote;
  const pila = impacto(t, tGolpe, 0.025);
  // con las pruebas del inicio, la tapa aparece recién antes de cerrarse
  const tapa = props.limpiar ? tramo(t, tCerrar - 1.2, 1, 'natural') : 1;
  return (
    <AbsoluteFill style={{ backgroundColor: mezclar(pal.fondo, '#000000', 0.3) }}>
      {/* La misma pila del inicio, ya corregida entera, se cierra: el libro está terminado. */}
      <AbsoluteFill style={{ opacity: mix(1, 0, negro) }}>
        <Luz color={pal.ocre} x={50} y={40} radio={62} intensidad={0.22} />
        <AbsoluteFill style={{ alignItems: 'center', justifyContent: 'center' }}>
          <div style={{ marginTop: 60, transformOrigin: '50% 100%', transform: escala(pila) }}>
            <Carpeta paleta={pal} id={`${escena.id}-carpeta`} cierre={cierre} width={lCarpeta ? 1080 : props.limpiar ? 620 : 500}
              lamina={lCarpeta} atado={tramo(t, tGolpe + 0.1, 0.7, 'natural')}
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
      {/* la tarjeta queda mientras suena el tema: la cámara se acerca muy despacio (el plano respira, no se congela) */}
      <AbsoluteFill style={{ alignItems: 'center', justifyContent: 'center', transform: `scale(${1 + 0.05 * tramo(t, tTarjeta + 1, 13, 'solemne')})` }}>
        {props.emblema === 'mercurio' ? (
          <div style={{ marginBottom: 30, opacity: tramo(t, tTarjeta + 0.5, 1.2, 'natural') }}>
            <GotaMercurio id={`${escena.id}-gota`} size={150} latido={t - tTarjeta} caida={tramo(t, tTarjeta + 0.5, 0.7, 'tenso')} tras={t - (tTarjeta + 1.2)} />
          </div>
        ) : null}
        <Tarjeta paleta={pal} etiqueta={props.proximo.etiqueta} destacado={props.proximo.anio} titulo={props.proximo.titulo} k={tramo(t, tTarjeta, 1.6, 'natural')} destacarTitulo={props.proximo.destacar === 'titulo'} />
      </AbsoluteFill>
      {props.ficha ? props.ficha.split('').map((ch, i) => (ch === ' ' ? null : <Sfx key={`k${i}`} nombre={`tecla-${(i % 3) + 1}`} en={tFicha + i / CPS} fps={fps} volumen={0.3} />)) : null}
      <Sfx nombre="carpeta" en={tGolpe} fps={fps} volumen={0.8} />
      <Sfx nombre="nota-final" en={tTarjeta} fps={fps} volumen={0.4} />
    </AbsoluteFill>
  );
};
