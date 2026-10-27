import { Fragment } from 'react';
import { AbsoluteFill, spring, useCurrentFrame } from 'remotion';
import type { z } from 'zod';
import { Luz } from '../../components/atmosfera/Luz';
import { Sfx } from '../../components/audio/Sfx';
import { Barra } from '../../components/graficos/Barra';
import { Mapa } from '../../components/graficos/Mapa';
import { Ornamento } from '../../components/texto/Ornamento';
import { beat, mix, tramo } from '../../direction/anim';
import type { EscenaProps } from '../../esquema';
import { fuente } from '../../estilo/fuentes';
import type { esquema } from './esquema';

type P = z.infer<typeof esquema>;

export const MapaRutas: React.FC<EscenaProps<P>> = ({ escena, props, video }) => {
  const frame = useCurrentFrame();
  const fps = video.fps;
  const t = frame / fps;
  const pal = video.paleta;
  const b = escena.beats;
  const tArcos = beat(b, 'arcos', 1), PASO = beat(b, 'paso', 1.9), DUR = Math.min(1.3, PASO + 0.25);
  const tApagar = beat(b, 'apagar', 12), tPregunta = beat(b, 'pregunta', 12.6), tBarra = beat(b, 'barra', 17);
  const tLlena = beat(b, 'barra_llena', tBarra + 2);
  const apagado = tramo(t, tApagar, 0.9, 'solemne');

  const rutas = props.destinos.map((_, i) => tramo(t, tArcos + i * PASO, DUR, 'natural'));
  const llegadas = props.destinos.map((_, i) => {
    const t0 = tArcos + i * PASO + DUR;
    return t >= t0 ? spring({ frame: frame - t0 * fps, fps, config: { damping: 9, mass: 0.5 } }) : 0;
  });
  // La pregunta aparece cuando la voz la hace, se va mientras se viaja por los archivos
  // y vuelve sola, en el silencio, cuando el mapa se apaga.
  const pregunta = Math.max(
    tramo(t, tPregunta, 1.0, 'solemne') * (1 - tramo(t, tArcos - 0.2, 0.6, 'natural')),
    tramo(t, tApagar + 0.3, 1.2, 'solemne'),
  ) * mix(1, 0.4, tramo(t, tBarra, 0.8, 'natural'));
  const conBarra = props.barra && t >= tBarra - 0.3;

  return (
    <AbsoluteFill style={{ backgroundColor: pal.fondo }}>
      <Luz color={pal.ocre} x={48} y={42} radio={80} intensidad={0.1 * (1 - apagado)} />
      <AbsoluteFill style={{ opacity: mix(1, 0.08, apagado) }}>
        <Mapa paleta={pal} id={`${escena.id}-mapa`} origen={props.origen} destinos={props.destinos} encuadre={props.encuadre}
          rutas={rutas} llegadas={llegadas} aparece={tramo(t, 0, 1.2, 'natural')} />
      </AbsoluteFill>

      {props.pregunta ? (
        <AbsoluteFill style={{ alignItems: 'center', justifyContent: 'center', paddingBottom: props.barra ? 220 : 0 }}>
          <div style={{ opacity: pregunta, transform: `translateY(${(1 - pregunta) * 14}px)`, display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 26 }}>
            <div style={{ fontFamily: fuente.titulo, fontStyle: 'italic', fontWeight: 400, fontSize: 108, color: pal.papel, textShadow: `0 0 40px ${pal.fondo}` }}>
              <span style={{ color: pal.ocre }}>«</span>{props.pregunta}<span style={{ color: pal.ocre }}>»</span>
            </div>
            <Ornamento color={pal.ocre} ancho={420} opacidad={0.8} />
          </div>
        </AbsoluteFill>
      ) : null}

      {conBarra && props.barra ? (
        <div style={{ position: 'absolute', left: 440, top: 600, opacity: tramo(t, tBarra - 0.3, 0.5, 'natural') }}>
          <Barra paleta={pal} id={`${escena.id}-barra`} marca={props.barra.valor} etiqueta={props.barra.etiqueta}
            llenado={props.barra.valor * tramo(t, tBarra + 0.4, Math.max(0.8, tLlena - tBarra - 0.4), 'pesado')}
            etiquetaK={tramo(t, tLlena + 0.5, 0.8, 'natural')} />
        </div>
      ) : null}

      {props.destinos.map((_, i) => (
        <Fragment key={i}>
          <Sfx nombre="soplo" en={tArcos + i * PASO} fps={fps} volumen={0.3} />
          <Sfx nombre="campana" en={tArcos + i * PASO + DUR} fps={fps} volumen={0.22} />
        </Fragment>
      ))}
      {/* el golpe cae justo cuando la barra se detiene en su valor */}
      {props.barra ? <Sfx nombre="golpe" en={tLlena} fps={fps} volumen={0.85} /> : null}
    </AbsoluteFill>
  );
};
