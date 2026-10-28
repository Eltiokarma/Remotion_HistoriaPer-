import { AbsoluteFill, useCurrentFrame } from 'remotion';
import type { z } from 'zod';
import { Luz } from '../../components/atmosfera/Luz';
import { Sfx } from '../../components/audio/Sfx';
import { CartelObra } from '../../components/graficos/CartelObra';
import { CirculosRed } from '../../components/graficos/CirculosRed';
import { asienta, beat, escala, estiraCon, impacto, tramo, velocidad } from '../../direction/anim';
import type { EscenaProps } from '../../esquema';
import { alfa, mezclar } from '../../estilo/color';
import { fuente } from '../../estilo/fuentes';
import type { esquema } from './esquema';

type P = z.infer<typeof esquema>;

export const CirculosCorruptos: React.FC<EscenaProps<P>> = ({ escena, props, video }) => {
  const frame = useCurrentFrame();
  const fps = video.fps;
  const t = frame / fps;
  const pal = video.paleta;
  const b = escena.beats;
  const tCirculos = beat(b, 'circulos', 0.2), tTitulo = beat(b, 'titulo', 1.8), tRed = beat(b, 'red', 5), tCartel = beat(b, 'cartel', 17);
  const tFrase = beat(b, 'frase', 22), tTachar = beat(b, 'tachar', 23.5), tRoba = beat(b, 'roba', 25);
  const noche = mezclar(pal.fondo, '#000000', 0.3);
  const cartel = t >= tCartel - 0.4;
  const letras = props.frase.replace(/\s/g, '').length;
  // el cartel cae con peso (acelera hasta el piso, no flota) y al clavarse se aplasta apenas desde los
  // postes y se cimbra (lámina y fierro: poco); el piso acusa el golpe
  const CAIDA = 0.85;
  const planta = (tt: number) => tramo(tt, tCartel, CAIDA, 'tenso');
  const tClava = tCartel + CAIDA;
  const deformaCartel = t < tClava ? estiraCon(velocidad((tt) => 900 * planta(tt), t, fps), 0.025) : impacto(t, tClava, 0.035);
  const cimbra = asienta(t, tClava, 0.9, 13, 4.5);
  const golpePiso = asienta(t, tClava, 3, 40, 14);

  return (
    <AbsoluteFill style={{ backgroundColor: noche }}>
      {!cartel || t < tCartel + 0.6 ? (
        <AbsoluteFill style={{ opacity: 1 - tramo(t, tCartel - 0.4, 0.8, 'natural') }}>
          <Luz color={pal.ocre} x={50} y={50} radio={60} intensidad={0.16} />
          <CirculosRed paleta={pal} id={`${escena.id}-red`} t={t} cierre={tramo(t, tCirculos, 4, 'natural')} red={tramo(t, tRed, 6, 'natural')} />
          <AbsoluteFill style={{ alignItems: 'center', justifyContent: 'center', gap: 18 }}>
            <div style={{ padding: '18px 40px', background: alfa(noche, 0.85), display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 14,
              opacity: tramo(t, tTitulo, 1, 'natural') }}>
              <div style={{ fontFamily: fuente.libro, fontStyle: 'italic', fontSize: 92, color: pal.papel, lineHeight: 1 }}>{props.titulo}</div>
              <div style={{ fontFamily: fuente.mono, fontSize: 34, letterSpacing: '0.4em', marginRight: '-0.4em', color: pal.ocre, opacity: tramo(t, tTitulo + 2.4, 0.8, 'natural') }}>{props.anio}</div>
            </div>
          </AbsoluteFill>
        </AbsoluteFill>
      ) : null}

      {cartel ? (
        <AbsoluteFill style={{ alignItems: 'center', justifyContent: 'center', opacity: tramo(t, tCartel - 0.4, 0.6, 'natural') }}>
          <Luz color={pal.ocre} x={50} y={30} radio={70} intensidad={0.18} />
          {/* piso de tierra */}
          <div style={{ position: 'absolute', left: 0, right: 0, bottom: 0, height: 170, background: `linear-gradient(180deg, ${mezclar(pal.fondo, pal.ocre, 0.18)}, ${mezclar(pal.fondo, '#000000', 0.4)})` }} />
          <div style={{ transform: `scale(0.92) translateY(${golpePiso}px)`, marginTop: 60 }}>
            <div style={{ transformOrigin: '50% 100%', transform: `${escala(deformaCartel)} rotate(${cimbra}deg)` }}>
            <CartelObra paleta={pal} frase={props.frase} tachar={props.tachar} queda={props.queda} color={props.color_cartel}
              planta={planta(t)} letras={tramo(t, tFrase, 1.4, 'natural')} tachado={tramo(t, tTachar, 0.7, 'natural')} soloQueda={tramo(t, tRoba, 1.2, 'natural')} />
            </div>
          </div>
        </AbsoluteFill>
      ) : null}

      <Sfx nombre="soplo" en={tCirculos} fps={fps} volumen={0.25} />
      <Sfx nombre="campana" en={tTitulo} fps={fps} volumen={0.25} />
      <Sfx nombre="soplo" en={tRed} fps={fps} volumen={0.3} />
      <Sfx nombre="cartel" en={tClava} fps={fps} volumen={0.75} />
      {Array.from({ length: Math.min(12, letras) }, (_, i) => <Sfx key={i} nombre="tic" en={tFrase + (i * 1.4) / 12} fps={fps} volumen={0.35} />)}
      <Sfx nombre="lapiz" en={tTachar} fps={fps} volumen={0.28} />
    </AbsoluteFill>
  );
};
