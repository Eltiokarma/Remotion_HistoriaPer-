import { AbsoluteFill, interpolateColors, spring, useCurrentFrame } from 'remotion';
import type { z } from 'zod';
import { Papel } from '../../components/atmosfera/Papel';
import { Sfx } from '../../components/audio/Sfx';
import { MapaLugar } from '../../components/graficos/MapaLugar';
import { cubierto, Piscina } from '../../components/graficos/Piscina';
import { Sello } from '../../components/graficos/Sello';
import { Ficha } from '../../components/texto/Ficha';
import { Ornamento } from '../../components/texto/Ornamento';
import { asienta, beat, clamp, mix, tramo } from '../../direction/anim';
import type { EscenaProps } from '../../esquema';
import { alfa, mezclar } from '../../estilo/color';
import { fuente } from '../../estilo/fuentes';
import type { esquema } from './esquema';

type P = z.infer<typeof esquema>;
const V = 620, FRENO = 1.6; // velocidad de la cámara sobre el agua (px/s) y segundos de frenado

export const Presentacion: React.FC<EscenaProps<P>> = ({ escena, props, video }) => {
  const frame = useCurrentFrame();
  const fps = video.fps;
  const t = frame / fps;
  const pal = video.paleta;
  const b = escena.beats;
  const piscina = props.fondo === 'piscina';
  const tNombre = beat(b, 'nombre', 1), tFrenar = beat(b, 'frenar', 4), tRenglon = beat(b, 'renglon', 5), tSello = beat(b, 'sello', 10);
  const tPalabra = beat(b, 'palabra', Infinity), tFicha = beat(b, 'ficha', Infinity), tLugar = beat(b, 'lugar', Infinity);
  const comoCita = props.palabra_como === 'cita';
  // al final puede quedar una sola palabra: todo lo demás se retira (como cita, no se retira nada)
  const queda = props.palabra && !comoCita ? tramo(t, tPalabra - 0.3, 0.9, 'natural') : 0;

  // Frenado parejo que arranca a la velocidad que traía (sin tirón): x = v·F/2·(1-(1-u)²).
  const u = clamp((t - tFrenar) / FRENO);
  const dx = -(V * Math.min(t, tFrenar) + V * (FRENO / 2) * (1 - (1 - u) ** 2));
  // con beat `piscina`, la escena empieza en la página y el agua la cubre con «nadador»; después se
  // vuelve a secar en papel (página → piscina → página)
  const tPiscina = typeof b.piscina === 'number' ? b.piscina : undefined;
  const renglon = !piscina ? 1
    : tPiscina === undefined ? tramo(t, tRenglon, 1.4, 'solemne')
      : Math.max(1 - tramo(t, tPiscina, 1.4, 'natural'), tramo(t, tRenglon, 1.4, 'solemne'));
  // La tinta de cada letra cambia cuando el papel pasa por debajo de ella.
  const tintaEn = (x: number) => interpolateColors(piscina ? cubierto(x, renglon) : 1, [0, 1], [pal.papel, pal.fondo]);
  const tinta = tintaEn(960);
  const ANCHO_NOMBRE = props.nombre.length * 62; // aproximado, para ubicar cada letra
  const margen = piscina ? tramo(t, tRenglon + 0.8, 0.9, 'pesado') : 1;

  const golpe = spring({ frame: frame - tSello * fps, fps, config: { damping: 14, mass: 1.4, stiffness: 200 } });
  const escalaSello = t < tSello ? 0 : mix(1.7, 1, golpe);
  const temblor = t > tSello + 0.1 && t < tSello + 0.28 ? Math.sin(frame * 3.1) * 2.5 : 0;

  return (
    <AbsoluteFill style={{ transform: `translateY(${temblor}px)` }}>
      {piscina ? <Piscina paleta={pal} t={t} dx={dx} renglon={renglon} colorAgua={props.agua} /> : <Papel color={pal.papel} envejecido={0.3} />}
      {/* dónde y cuándo: el país en tinta sobre la página y la cámara que se acerca a la ciudad; el agua lo cubre */}
      {props.lugar && t >= tLugar - 0.1 && renglon > 0.02 ? (
        <AbsoluteFill style={{ opacity: renglon }}>
          <MapaLugar id={`${escena.id}-lugar`} codigo={props.lugar.codigo} lon={props.lugar.lon} lat={props.lugar.lat} caja={[1440, 630, 340, 370]} acerca={1.8}
            zoom={tramo(t, tLugar + 1.2, 2.4, 'solemne')} aparece={tramo(t, tLugar, 0.8, 'natural')} tinta={pal.fondo} acento={pal.rojo} papel={pal.papel}
            nombre={props.lugar.nombre} mar={props.lugar.mar} cordillera={props.lugar.cordillera} />
          <div style={{ position: 'absolute', right: 520, top: 860, textAlign: 'right', opacity: tramo(t, tLugar + 1.2, 0.8, 'natural') }}>
            <Ficha texto={props.lugar.ficha} t={t - tLugar - 1.2} color={pal.fondo} acento={pal.rojo} size={30} />
            {props.lugar.dato ? (
              <div style={{ marginTop: 14, marginLeft: 34, fontFamily: fuente.mono, fontSize: 24, letterSpacing: '0.12em', color: alfa(pal.fondo, 0.75),
                opacity: tramo(t, tLugar + 2.4, 0.8, 'natural') }}>{props.lugar.dato}</div>
            ) : null}
          </div>
        </AbsoluteFill>
      ) : null}
      {/* margen rojo doble del libro contable */}
      <svg width={1920} height={1080} style={{ position: 'absolute' }}>
        <line x1={250} x2={250} y1={0} y2={1080 * margen} stroke={pal.rojo} strokeWidth={2.5} opacity={0.75} />
        <line x1={258} x2={258} y1={0} y2={1080 * margen} stroke={pal.rojo} strokeWidth={1.2} opacity={0.6} />
      </svg>

      <AbsoluteFill style={{ alignItems: 'center', justifyContent: 'center', paddingBottom: 40, opacity: 1 - queda }}>
        <div style={{ fontFamily: fuente.titulo, fontWeight: 700, fontSize: 118, letterSpacing: '0.02em', display: 'flex' }}>
          {props.nombre.split('').map((ch, i) => {
            // cada letra se asienta con 2 frames de desfase: nada se detiene a la vez; al llegar se pasa
            // apenas hacia arriba y vuelve (follow through; sin deformarse: es texto)
            const k = tramo(t, tNombre + (i * 2) / fps, 0.9, 'solemne');
            const pasa = asienta(t, tNombre + (i * 2) / fps + 0.82, -2.5, 15, 8);
            const x = 960 + (i / Math.max(1, props.nombre.length - 1) - 0.5) * ANCHO_NOMBRE;
            const agua = piscina ? 1 - cubierto(x, renglon) : 0;
            return (
              <span key={i} style={{ display: 'inline-block', whiteSpace: 'pre', opacity: k, transform: `translateY(${(1 - k) * 46 + pasa}px)`, color: tintaEn(x),
                textShadow: agua > 0 ? `0 0 28px ${alfa(pal.fondo, 0.9 * agua)}, 0 2px 4px ${alfa(pal.fondo, 0.6 * agua)}` : 'none' }}>{ch}</span>
            );
          })}
        </div>
        {props.anios ? (
          <div style={{ marginTop: 22, display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 14 }}>
            <Ornamento color={tinta} ancho={560} k={tramo(t, tNombre + 1.2, 1.0, 'natural')} opacidad={0.8} />
            <div style={{ fontFamily: fuente.mono, fontSize: 40, letterSpacing: '0.3em', marginRight: '-0.3em', color: tinta,
              opacity: 0.85 * tramo(t, tNombre + 1.6, 0.8, 'natural') }}>
              {props.anios}
            </div>
          </div>
        ) : null}
      </AbsoluteFill>

      {props.palabra && !comoCita && t >= tPalabra - 0.3 ? (
        <AbsoluteFill style={{ alignItems: 'center', justifyContent: 'center' }}>
          {/* la palabra sola; el espaciado se abre despacio, como si respirara */}
          <div style={{ fontFamily: fuente.titulo, fontWeight: 600, fontSize: 120, color: tintaEn(960), opacity: tramo(t, tPalabra, 1.2, 'natural'),
            letterSpacing: `${mix(0.04, 0.42, tramo(t, tPalabra, 7, 'natural'))}em`, marginRight: `-${mix(0.04, 0.42, tramo(t, tPalabra, 7, 'natural'))}em` }}>
            {props.palabra}
          </div>
        </AbsoluteFill>
      ) : null}

      {props.ficha && t >= tFicha ? (
        // en la piscina va entre dos corcheras (las filas de boyas están en y = 130 + 92·k)
        <div style={{ position: 'absolute', left: 120, top: piscina ? 158 : 90 }}>
          {/* sobre el agua, un velo oscuro detrás para que se lea entre las boyas; sobre el papel, nada */}
          {piscina ? (
            <div style={{ position: 'absolute', left: -22, top: -16, width: props.ficha.length * 30 * 0.66 + 70, height: 64, borderRadius: 4,
              background: alfa(pal.fondo, 0.92 * (1 - cubierto(300, renglon))), boxShadow: `0 0 24px 12px ${alfa(pal.fondo, 0.6 * (1 - cubierto(300, renglon)))}` }} />
          ) : null}
          {/* la tinta de la ficha cambia con lo que tiene debajo (agua o papel), como el nombre */}
          <div style={{ position: 'relative' }}>
            <Ficha texto={props.ficha} t={t - tFicha} color={tintaEn(300)} acento={pal.rojo} size={30} />
          </div>
          {props.palabra && comoCita ? (
            <div style={{ marginTop: 26, marginLeft: 34, fontFamily: fuente.libro, fontStyle: 'italic', fontSize: 64, color: tintaEn(400),
              opacity: tramo(t, tPalabra, 1.0, 'natural'), transform: `translateY(${8 * (1 - tramo(t, tPalabra, 1.0, 'natural'))}px)` }}>
              {`«${props.palabra.toLowerCase()}»`}
            </div>
          ) : null}
        </div>
      ) : null}
      {props.ficha ? props.ficha.split('').map((ch, i) => (ch === ' ' ? null : <Sfx key={`k${i}`} nombre={`tecla-${(i % 3) + 1}`} en={tFicha + i / 18} fps={fps} volumen={0.28} />)) : null}

      {props.sello ? (
        <>
          <div style={{ position: 'absolute', left: 1330, top: 640, transform: `rotate(-12deg) scale(${escalaSello})`, opacity: clamp(escalaSello * 3) * (1 - queda) }}>
            <Sello paleta={pal} id={`${escena.id}-sello`} centro={props.sello.centro} fecha={props.sello.fecha} arco={props.sello.arco} size={340}
              color={mezclar(pal.rojo, pal.fondo, 0.1)} />
          </div>
          {/* el golpe suena cuando el sello toca el papel, no cuando empieza a caer */}
          <Sfx nombre="sello" en={tSello + 0.1} fps={fps} volumen={0.9} />
        </>
      ) : null}
    </AbsoluteFill>
  );
};
