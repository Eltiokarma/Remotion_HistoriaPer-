import { useMemo } from 'react';
import { AbsoluteFill, spring, useCurrentFrame } from 'remotion';
import type { z } from 'zod';
import { Luz } from '../../components/atmosfera/Luz';
import { Papel } from '../../components/atmosfera/Papel';
import { Sfx } from '../../components/audio/Sfx';
import { Afiche } from '../../components/graficos/Afiche';
import { CapasDeTiempo } from '../../components/graficos/CapasDeTiempo';
import { Sello } from '../../components/graficos/Sello';
import { bordePapel } from '../../components/graficos/svg';
import { Ficha } from '../../components/texto/Ficha';
import { Renglones } from '../../components/texto/Renglones';
import { beat, clamp, mix, tramo } from '../../direction/anim';
import { azar } from '../../direction/azar';
import type { EscenaProps } from '../../esquema';
import { alfa, mezclar } from '../../estilo/color';
import { fuente } from '../../estilo/fuentes';
import type { esquema } from './esquema';

type P = z.infer<typeof esquema>;
const FILAS = 20;

/** Dónde va cada afiche en el muro (x, y, giro). */
const LUGARES = [
  { x: 250, y: 150, rot: -3.2, w: 470, h: 640 },
  { x: 700, y: 250, rot: 2.4, w: 500, h: 660 },
  { x: 1180, y: 130, rot: -1.4, w: 480, h: 650 },
  { x: 1480, y: 330, rot: 3.5, w: 380, h: 520 },
];

export const TiempoLargo: React.FC<EscenaProps<P>> = ({ escena, props, video }) => {
  const frame = useCurrentFrame();
  const fps = video.fps;
  const t = frame / fps;
  const pal = video.paleta;
  const b = escena.beats;
  const tSello = beat(b, 'sello', 1.5), tPrimeros = beat(b, 'primeros', 5), tAfiches = beat(b, 'afiches', 10);
  const tAf = [beat(b, 'afiche1', tAfiches + 2), beat(b, 'afiche2', tAfiches + 3.4), beat(b, 'afiche3', tAfiches + 6), beat(b, 'afiche4', tAfiches + 8)];
  const tDespegue = beat(b, 'despegue', 27), tVolante = beat(b, 'volante', 33), tCapas = beat(b, 'capas', 39);
  const tBraudel = beat(b, 'braudel', 44), tBajar = beat(b, 'bajar', 51);
  const noche = mezclar(pal.fondo, '#000000', 0.3);

  const restos = useMemo(() => {
    const r = azar(74);
    return Array.from({ length: 9 }, (_, i) => ({ x: r.rango(80, 1700), y: r.rango(60, 860), w: r.rango(160, 340), h: r.rango(120, 300), rot: r.rango(-6, 6), tono: i % 3, s: i * 13 + 5 }));
  }, []);

  // —— A: lista de admisión con el sello
  const muro = tramo(t, tAfiches - 0.3, 0.6, 'natural');
  const rebote = t < tSello ? 0 : spring({ frame: frame - tSello * fps, fps, config: { damping: 8, mass: 1.1, stiffness: 170 } });
  const caidaSello = t < tSello ? 0 : mix(1.9, 1, rebote);
  const corchete = tramo(t, tPrimeros, 0.9, 'natural');
  // —— B: el muro
  // el muro quieto: lo que se mueve son los afiches que se pegan
  const pega = (tp: number) => (t < tp ? 0 : spring({ frame: frame - tp * fps, fps, config: { damping: 15, mass: 0.6, stiffness: 260 } }));
  const volante = t < tVolante ? 0 : spring({ frame: frame - tVolante * fps, fps, config: { damping: 18, mass: 1, stiffness: 90 } });
  // —— C: las capas
  const capas = tramo(t, tCapas - 0.4, 1.0, 'natural');
  const baja = tramo(t, tBajar, 2.4, 'pesado');

  return (
    <AbsoluteFill style={{ backgroundColor: noche }}>
      {/* A: la lista de admisión */}
      {muro < 1 ? (
        <AbsoluteFill style={{ opacity: 1 - muro }}>
          <Papel color={pal.papel} envejecido={0.3}>
            <AbsoluteFill>
              <div style={{ position: 'absolute', left: 300, top: 110, fontFamily: fuente.mono, fontSize: 30, letterSpacing: '0.3em', color: alfa(pal.fondo, 0.75) }}>{props.lista}</div>
              <div style={{ position: 'absolute', left: 300, top: 160, width: 1000, height: 2, background: alfa(pal.fondo, 0.5) }} />
              {Array.from({ length: FILAS }, (_, i) => (
                <div key={i} style={{ position: 'absolute', left: 300, top: 190 + i * 41, display: 'flex', alignItems: 'center', gap: 40 }}>
                  <div style={{ fontFamily: fuente.mono, fontSize: 24, color: alfa(pal.fondo, 0.7), width: 50 }}>{String(i + 1).padStart(2, '0')}.</div>
                  <Renglones ancho={560} lineas={1} interlinea={20} alto={12} color={pal.fondo} opacidad={0.42} semilla={300 + i} />
                  <div style={{ width: 120, height: 9, background: alfa(pal.fondo, 0.35), borderRadius: 3, marginLeft: 80 }} />
                </div>
              ))}
              {/* los primeros puestos, marcados con un corchete rojo */}
              <svg width={1920} height={1080} style={{ position: 'absolute', inset: 0 }}>
                <path d="M282 186 C 262 190, 262 196, 262 230 L 262 470 C 262 504, 262 510, 282 514" fill="none" stroke={pal.rojo} strokeWidth={4.5}
                  strokeLinecap="round" pathLength={1} strokeDasharray={1} strokeDashoffset={1 - corchete} opacity={0.9} />
              </svg>
            </AbsoluteFill>
            <div style={{ position: 'absolute', left: 1300, top: 170, transform: `rotate(-11deg) scale(${caidaSello})`, opacity: clamp(caidaSello * 3) }}>
              <Sello paleta={pal} id={`${escena.id}-sello`} centro={props.sello.centro} fecha={props.sello.fecha} arco={props.sello.arco} size={360} color={pal.rojo} />
            </div>
          </Papel>
        </AbsoluteFill>
      ) : null}

      {/* B: el muro de afiches */}
      {muro > 0 && capas < 1 ? (
        <AbsoluteFill style={{ opacity: muro * (1 - capas) }}>
          <AbsoluteFill>
            <Papel color={mezclar(pal.fondo, pal.ocre, 0.16)} envejecido={0.6} escala={700}>
              {/* restos de afiches viejos, arrancados */}
              <svg width={1920} height={1080} style={{ position: 'absolute', inset: 0 }}>
                {restos.map((r, i) => (
                  <g key={i} transform={`rotate(${r.rot} ${r.x + r.w / 2} ${r.y + r.h / 2})`} opacity={0.5}>
                    <path d={bordePapel(r.s, r.x, r.y, r.w, r.h, 6)} fill={[mezclar(pal.papel, pal.fondo, 0.45), mezclar(pal.rojo, pal.fondo, 0.5), mezclar(pal.ocre, pal.fondo, 0.4)][r.tono]} />
                    <rect x={r.x + 16} y={r.y + 20} width={r.w * 0.7} height={r.h * 0.18} fill={alfa(pal.fondo, 0.35)} />
                  </g>
                ))}
              </svg>
              {props.titulares.map((tx, i) => {
                const L = LUGARES[i];
                const k = pega(tAf[i]);
                if (t < tAf[i]) return null;
                const colores = [
                  { papel: pal.papel, tinta: pal.fondo, acento: pal.rojo },
                  { papel: mezclar(pal.ocre, pal.papel, 0.45), tinta: pal.rojo, acento: pal.fondo },
                  { papel: mezclar(pal.rojo, pal.papel, 0.12), tinta: pal.papel, acento: mezclar(pal.fondo, pal.rojo, 0.3) },
                  { papel: pal.papel, tinta: pal.rojo, acento: pal.fondo },
                ][i % 4];
                return (
                  <div key={i} style={{ position: 'absolute', left: L.x, top: L.y, transform: `rotate(${L.rot}deg) scale(${mix(1.1, 1, k)})`, opacity: clamp(k * 4),
                    filter: `drop-shadow(6px 10px 10px ${alfa('#000000', 0.45)})` }}>
                    <Afiche id={`${escena.id}-af${i}`} texto={tx} {...colores} ancho={L.w} alto={L.h} semilla={i * 17 + 3}
                      despegue={i === props.titulares.length - 1 ? tramo(t, tDespegue, 1.8, 'natural') * 0.85 : 0} />
                  </div>
                );
              })}
              {/* el volante encima: mimeógrafo, tinta corrida, una tachuela */}
              {volante > 0 ? (
                <div style={{ position: 'absolute', left: 1040, top: 520, transform: `translateY(${(1 - volante) * 600}px) rotate(${mix(14, 6, volante)}deg)`,
                  filter: `drop-shadow(5px 8px 8px ${alfa('#000000', 0.5)})` }}>
                  <div style={{ width: 380, height: 500, background: mezclar(pal.papel, '#ffffff', 0.1), position: 'relative', overflow: 'hidden' }}>
                    <Papel color={mezclar(pal.papel, '#ffffff', 0.1)} envejecido={0.15} escala={400}>
                      <div style={{ position: 'absolute', left: 28, top: 30, width: 324, height: 54, background: pal.rojo, opacity: 0.88 }} />
                      <div style={{ position: 'absolute', left: 28, top: 106, filter: 'blur(0.6px)' }}>
                        <Renglones ancho={324} lineas={14} interlinea={24} alto={8} color={mezclar(pal.fondo, pal.rojo, 0.25)} opacidad={0.6} semilla={1975} />
                      </div>
                    </Papel>
                  </div>
                  <div style={{ position: 'absolute', left: 182, top: -6, width: 18, height: 18, borderRadius: 9, background: `radial-gradient(circle at 35% 35%, #ddd, #555)` }} />
                </div>
              ) : null}
            </Papel>
          </AbsoluteFill>
        </AbsoluteFill>
      ) : null}

      {/* C: las tres capas del tiempo */}
      {capas > 0 ? (
        <AbsoluteFill style={{ opacity: capas }}>
          <Luz color={pal.ocre} x={55} y={70} radio={70} intensidad={0.12} />
          <AbsoluteFill style={{ transformOrigin: '6% 78%', transform: `translateY(${-300 * baja}px) scale(${1 + 0.55 * baja})` }}>
            <CapasDeTiempo paleta={pal} id={`${escena.id}-capas`} t={t} rotulos={props.capas} nombres={props.gobiernos}
              aparece={[tramo(t, tCapas + 0.2, 1, 'natural'), tramo(t, tCapas + 1.6, 1.2, 'natural'), tramo(t, tCapas + 3.0, 1.6, 'natural')]} />
          </AbsoluteFill>
          {props.ficha ? (
            <div style={{ position: 'absolute', left: 120, top: 70 }}>
              <Ficha texto={props.ficha} t={t - tBraudel} color={pal.papel} acento={pal.rojo} size={26} salida={tramo(t, tBajar, 1, 'natural')} />
            </div>
          ) : null}
        </AbsoluteFill>
      ) : null}

      <Sfx nombre="sello" en={tSello + 0.12} fps={fps} volumen={0.85} />
      <Sfx nombre="lapiz" en={tPrimeros} fps={fps} volumen={0.28} />
      {props.titulares.map((_, i) => <Sfx key={i} nombre="afiche" en={tAf[i]} fps={fps} volumen={0.7} />)}
      <Sfx nombre="hoja" en={tDespegue} fps={fps} volumen={0.55} />
      <Sfx nombre="hoja" en={tVolante} fps={fps} volumen={0.45} />
      <Sfx nombre="soplo" en={tBajar} fps={fps} volumen={0.35} />
    </AbsoluteFill>
  );
};
