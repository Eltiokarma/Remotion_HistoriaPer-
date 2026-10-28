import { useMemo } from 'react';
import { AbsoluteFill, spring, useCurrentFrame } from 'remotion';
import type { z } from 'zod';
import { Luz } from '../../components/atmosfera/Luz';
import { Papel } from '../../components/atmosfera/Papel';
import { Sfx } from '../../components/audio/Sfx';
import { Engranaje } from '../../components/graficos/Engranaje';
import { FiltroDesgaste } from '../../components/graficos/svg';
import { Renglones } from '../../components/texto/Renglones';
import { TrazoRojo } from '../../components/texto/TrazoRojo';
import { beat, clamp, escala, estiraCon, mix, tramo } from '../../direction/anim';
import { azar } from '../../direction/azar';
import type { EscenaProps, Paleta } from '../../esquema';
import { alfa, mezclar } from '../../estilo/color';
import { fuente } from '../../estilo/fuentes';
import type { esquema } from './esquema';

type P = z.infer<typeof esquema>;
const W = 300, H = 420;

/** Respuesta 1: legajos con cintas y sellos de cancillerías. */
const Legajos: React.FC<{ pal: Paleta; sellos: string[]; ks: number[]; id: string }> = ({ pal, sellos, ks, id }) => {
  const colores = [pal.rojo, mezclar(pal.verde, pal.fondo, 0.2), pal.fondo, pal.rojo];
  return (
    <svg viewBox={`0 0 ${W} ${H}`} width={W} height={H}>
      <defs><FiltroDesgaste id={`${id}-g`} semilla={4} desgaste={0.3} /></defs>
      {[0, 1, 2].map((i) => (
        <g key={i} transform={`translate(${30 + i * 8} ${60 + i * 92}) rotate(${[-3, 2, -1][i]})`}>
          <path d="M0 14 L60 14 L72 0 L130 0 L142 14 L230 14 L230 150 L0 150 Z" fill={mezclar(pal.ocre, pal.papel, 0.45 - i * 0.08)} stroke={alfa(pal.fondo, 0.4)} />
          <line x1={0} x2={230} y1={86} y2={86} stroke={mezclar(pal.rojo, pal.fondo, 0.3)} strokeWidth={3} />
          <circle cx={115} cy={86} r={6} fill={mezclar(pal.rojo, pal.fondo, 0.3)} />
          <Renglones ancho={150} lineas={2} interlinea={13} alto={6} color={pal.fondo} opacidad={0.35} semilla={60 + i} style={{ transform: 'translate(20px, 30px)' }} />
        </g>
      ))}
      {sellos.map((s, i) => {
        const k = ks[i] ?? 0;
        if (k <= 0) return null;
        const ancho = Math.max(130, s.length * 11 + 30);
        return (
          <g key={i} transform={`translate(${150 + [-30, 20, -10, 10][i]} ${110 + i * 92}) rotate(${[-9, 6, -4, 8][i]}) scale(${mix(1.6, 1, k)})`} opacity={clamp(k * 3)}
            filter={`url(#${id}-g)`} style={{ mixBlendMode: 'multiply' }}>
            <rect x={-ancho / 2} y={-22} width={ancho} height={44} rx={4} fill="none" stroke={colores[i]} strokeWidth={3} />
            <text y={7} textAnchor="middle" fill={colores[i]} fontFamily={fuente.mono} fontWeight={600} fontSize={17} letterSpacing={2}>{s}</text>
          </g>
        );
      })}
    </svg>
  );
};

/** Respuesta 2: un medidor de opinión que tiembla sin control contra un libro de cuentas quieto. */
const MedidorYLibro: React.FC<{ pal: Paleta; t: number; frame: number }> = ({ pal, t, frame }) => {
  const r = azar(frame * 13 + 7);
  const aguja = 18 * Math.sin(t * 11) + 26 * Math.sin(t * 27 + 1.3) + 14 * Math.sin(t * 53) + r.rango(-8, 8);
  const cx = 150, cy = 170, R = 100;
  return (
    <svg viewBox={`0 0 ${W} ${H}`} width={W} height={H}>
      <path d={`M${cx - R} ${cy} A ${R} ${R} 0 0 1 ${cx + R} ${cy}`} fill={mezclar(pal.papel, pal.fondo, 0.06)} stroke={pal.fondo} strokeWidth={2} />
      <path d={`M${cx - R * 0.72} ${cy - R * 0.69} A ${R} ${R} 0 0 1 ${cx + R * 0.72} ${cy - R * 0.69}`} fill="none" stroke={pal.rojo} strokeWidth={6} opacity={0.5} transform={`translate(0 ${R * 0.08})`} />
      {Array.from({ length: 21 }, (_, i) => {
        const a = Math.PI * (1 + i / 20), l = i % 5 === 0 ? 16 : 8;
        return <line key={i} x1={cx + Math.cos(a) * (R - 4)} y1={cy + Math.sin(a) * (R - 4)} x2={cx + Math.cos(a) * (R - 4 - l)} y2={cy + Math.sin(a) * (R - 4 - l)} stroke={pal.fondo} strokeWidth={i % 5 === 0 ? 2 : 1} />;
      })}
      <g transform={`rotate(${aguja} ${cx} ${cy})`}>
        <line x1={cx} y1={cy} x2={cx} y2={cy - R * 0.86} stroke={pal.rojo} strokeWidth={3.5} strokeLinecap="round" />
      </g>
      <circle cx={cx} cy={cy} r={8} fill={pal.fondo} />
      {/* el libro de cuentas: abierto, sereno */}
      <g transform="translate(30 236)">
        <path d="M0 6 Q 60 -6, 120 6 L120 150 Q 60 138, 0 150 Z" fill={mezclar(pal.papel, '#ffffff', 0.1)} stroke={alfa(pal.fondo, 0.5)} />
        <path d="M120 6 Q 180 -6, 240 6 L240 150 Q 180 138, 120 150 Z" fill={mezclar(pal.papel, '#ffffff', 0.05)} stroke={alfa(pal.fondo, 0.5)} />
        {Array.from({ length: 9 }, (_, i) => (
          <g key={i} stroke={alfa(pal.fondo, 0.3)} strokeWidth={1}>
            <line x1={10} x2={112} y1={24 + i * 13} y2={24 + i * 13} />
            <line x1={128} x2={232} y1={24 + i * 13} y2={24 + i * 13} />
          </g>
        ))}
        <line x1={92} x2={92} y1={10} y2={145} stroke={pal.rojo} strokeWidth={1.2} opacity={0.6} />
        <line x1={210} x2={210} y1={10} y2={145} stroke={pal.rojo} strokeWidth={1.2} opacity={0.6} />
      </g>
    </svg>
  );
};

/** Respuesta 3: página de diccionario antiguo con sus entradas (las definiciones son texto simulado). */
const Diccionario: React.FC<{ pal: Paleta; anio: string; entradas: string[]; ks: number[] }> = ({ pal, anio, entradas, ks }) => (
  <div style={{ width: W, height: H, padding: '26px 26px', boxSizing: 'border-box', display: 'flex', flexDirection: 'column', alignItems: 'stretch', gap: 10 }}>
    <div style={{ textAlign: 'center', fontFamily: fuente.imprenta, fontSize: 30, letterSpacing: '0.2em', color: pal.fondo }}>{anio}</div>
    <div style={{ height: 1, background: alfa(pal.fondo, 0.5), marginBottom: 6 }} />
    {entradas.map((e, i) => (
      <div key={i} style={{ display: 'flex', flexDirection: 'column', gap: 6 }}>
        <div style={{ fontFamily: fuente.imprentaItalica, fontSize: 30, color: pal.fondo }}>
          <TrazoRojo k={ks[i] ?? 0} color={pal.rojo} grosor={3}>{`${e.charAt(0).toUpperCase()}${e.slice(1)}.`}</TrazoRojo>
        </div>
        <Renglones ancho={248} lineas={3} interlinea={14} alto={6} color={pal.fondo} opacidad={0.4} semilla={90 + i} />
      </div>
    ))}
  </div>
);

export const Objeciones: React.FC<EscenaProps<P>> = ({ escena, props, video }) => {
  const frame = useCurrentFrame();
  const fps = video.fps;
  const t = frame / fps;
  const pal = video.paleta;
  const b = escena.beats;
  const T = (n: string, d: number) => beat(b, n, d);
  const tTarjetas = T('tarjetas', 3), tExcusa = T('excusa', 10);
  const tFoco = [T('t1', 11), T('t2', 30), T('t3', 44), T('t4', 62)];
  const tResp = [T('r1', 17), T('r2', 36), T('r3', 49.5), T('r4', 69)];
  const tSellos = T('sellos', 25), tEntradas = T('entradas', 56);
  const tEngranaje = T('engranaje', 70), tAceite = T('aceite', 74), tCorte = T('corte', 78), tGrava = T('grava', 81.4), tTraba = T('traba', 82.4);
  const noche = mezclar(pal.fondo, '#000000', 0.32);

  // —— el tablero
  const focos = tFoco.map((tf, i) => tramo(t, tf, 0.8, 'pesado') * (1 - tramo(t, (tFoco[i + 1] ?? tEngranaje + 10) - 0.15, 0.8, 'pesado')));
  const vueltas = tResp.map((tr, i) => (i < 3 ? (t < tr ? 0 : spring({ frame: frame - tr * fps, fps, config: { damping: 16, mass: 1, stiffness: 120 } })) : 0));
  // la tarjeta se echa un poco atrás antes de darse vuelta (anticipación); el resorte la pasa y la trae (follow through)
  const giroTarjeta = (i: number) => (i >= 3 ? 0 : t < tResp[i] ? -9 * tramo(t, tResp[i] - 0.3, 0.3, 'natural') : mix(-9, 180, vueltas[i]));
  const orden = [0, 1, 2, 3].sort((a, c) => focos[a] - focos[c]); // la enfocada se dibuja encima
  const separa = tramo(t, tExcusa, 0.8, 'natural');

  // —— el engranaje: gira, se aceita, corte, grava, se traba
  const W1 = 18; // grados por segundo
  const angulo = useMemo(() => (tt: number) => {
    if (tt < tTraba) return W1 * (tt - tEngranaje);
    const base = W1 * (tTraba - tEngranaje);
    const dt = tt - tTraba;
    return base + 2.2 * Math.exp(-dt * 7) * Math.sin(dt * 34) - 1.2 * (1 - Math.exp(-dt * 9)); // tirón y rebote hacia atrás
  }, [tEngranaje, tTraba]);
  const ang = angulo(t);
  const G1 = { x: 800, y: 560, r: 330, n: 36 }, G2 = { x: 800 + 330 + 196 - 20, y: 560, r: 196, n: 21 };
  const contacto = { x: G1.x + G1.r - 8, y: G1.y - 40 };
  const caeGota = (tt: number) => mix(150, contacto.y - 10, clamp((tt - tAceite) / 0.55) ** 2);
  const gotaY = caeGota(t);
  // el aceite es líquido: se alarga al caer (comprimir y estirar a la medida del material)
  const estiroGota = estiraCon((caeGota(t + 1 / fps) - caeGota(t - 1 / fps)) * (fps / 2), 0.22);
  const grava = useMemo(() => {
    const r = azar(1729);
    return Array.from({ length: 46 }, (_, i) => ({ t0: r.rango(0, 1.0), dx: r.rango(-70, 70), lado: r.rango(4, 11), rot: r.rango(0, 360), cae: r.n() < 0.35, i }));
  }, []);
  const temblor = t > tTraba && t < tTraba + 0.35 ? Math.sin(frame * 2.7) * 9 * (1 - (t - tTraba) / 0.35) : 0;

  return (
    <AbsoluteFill style={{ backgroundColor: noche }}>
      {t < tEngranaje ? (
        <AbsoluteFill>
          <Luz color={pal.ocre} x={50} y={50} radio={65} intensidad={0.18} />
          {orden.map((i) => {
            const card = props.tarjetas[i];
            const k = t < tTarjetas + i * 0.5 ? 0 : spring({ frame: frame - (tTarjetas + i * 0.5) * fps, fps, config: { damping: 15, mass: 0.8, stiffness: 120 } });
            if (k <= 0) return null;
            const fila = { x: 960 + (i - 1.5) * 390 + (i === 3 ? 50 * separa : -12 * separa), y: 560 };
            const f = focos[i];
            const otro = Math.max(...focos.filter((_, j) => j !== i));
            const x = mix(fila.x, 960, f) + (1 - f) * otro * (fila.x > 960 ? 120 : -120);
            // suben a su lugar abriéndose en abanico (en arco, no en línea recta)
            const y = mix(fila.y, 540, f) + (1 - k) * 700;
            const xArco = (1 - k) ** 2 * (i - 1.5) * 90;
            const escala = mix(1, 1.95, f);
            const tachado = i === 3 ? tramo(t, tResp[3], 0.8, 'natural') : 0;
            return (
              <div key={i} style={{ position: 'absolute', left: x - W / 2 + xArco, top: y - H / 2, width: W, height: H, perspective: 1800,
                transform: `scale(${escala}) rotate(${(1 - k) * (i - 1.5) * 8}deg)`, opacity: mix(1, 0.35, otro * (1 - f)) }}>
                <div style={{ position: 'absolute', inset: 0, transformStyle: 'preserve-3d', transform: `rotateY(${giroTarjeta(i)}deg)` }}>
                  {/* frente */}
                  <div style={{ position: 'absolute', inset: 0, backfaceVisibility: 'hidden', boxShadow: `8px 14px 24px ${alfa('#000000', 0.5)}`, borderRadius: 6, overflow: 'hidden',
                    outline: i === 3 ? `3px solid ${alfa(pal.rojo, 0.7 * separa)}` : undefined, outlineOffset: -10 }}>
                    <Papel color={pal.papel} envejecido={0.25} escala={500}>
                      <div style={{ position: 'absolute', left: 30, top: 30, fontFamily: fuente.titulo, fontWeight: 700, fontSize: 120, lineHeight: 1, color: i === 3 ? pal.rojo : pal.fondo }}>{card.numero}</div>
                      <div style={{ position: 'absolute', left: 30, right: 30, top: 190, height: 2, background: alfa(pal.fondo, 0.6) }} />
                      <div style={{ position: 'absolute', left: 30, top: 214, fontFamily: fuente.mono, fontWeight: 600, fontSize: card.nombre.length > 10 ? 25 : 30, letterSpacing: '0.12em', color: pal.fondo }}>
                        <TrazoRojo k={tachado} color={pal.rojo} tipo="tachar" grosor={5}>{card.nombre}</TrazoRojo>
                      </div>
                      <div style={{ position: 'absolute', left: 30, top: 290 }}>
                        <Renglones ancho={240} lineas={5} interlinea={18} alto={6} color={pal.fondo} opacidad={0.22} semilla={140 + i} />
                      </div>
                    </Papel>
                  </div>
                  {/* dorso: la respuesta */}
                  {i < 3 ? (
                    <div style={{ position: 'absolute', inset: 0, backfaceVisibility: 'hidden', transform: 'rotateY(180deg)', borderRadius: 6, overflow: 'hidden',
                      boxShadow: `8px 14px 24px ${alfa('#000000', 0.5)}` }}>
                      <Papel color={mezclar(pal.papel, pal.ocre, i === 2 ? 0.18 : 0.06)} envejecido={0.3} escala={500}>
                        {i === 0 ? <Legajos pal={pal} sellos={props.sellos} id={`${escena.id}-leg`} ks={props.sellos.map((_, j) => (t < tSellos + j * 0.7 ? 0 : spring({ frame: frame - (tSellos + j * 0.7) * fps, fps, config: { damping: 13, mass: 1, stiffness: 200 } })))} /> : null}
                        {i === 1 ? <MedidorYLibro pal={pal} t={t} frame={frame} /> : null}
                        {i === 2 ? <Diccionario pal={pal} anio={props.diccionario.anio} entradas={props.diccionario.entradas} ks={[0, 0.9, 2.1, 3].map((d) => tramo(t, tEntradas + d, 0.6, 'natural'))} /> : null}
                      </Papel>
                    </div>
                  ) : null}
                </div>
              </div>
            );
          })}
        </AbsoluteFill>
      ) : (
        <AbsoluteFill style={{ transform: `translate(${temblor}px, ${temblor * 0.6}px)` }}>
          <Luz color={pal.ocre} x={48} y={46} radio={60} intensidad={0.22} />
          <svg width={1920} height={1080} style={{ position: 'absolute', inset: 0 }}>
            <Engranaje paleta={pal} id={`${escena.id}-g1`} x={G1.x} y={G1.y} radio={G1.r} dientes={G1.n} angulo={ang} />
            <Engranaje paleta={pal} id={`${escena.id}-g2`} x={G2.x} y={G2.y} radio={G2.r} dientes={G2.n} angulo={-ang * (G1.n / G2.n) + 360 / G2.n / 2} rayos={5} />
            {/* el aceitero y su gota (hasta el corte) */}
            {t < tCorte ? (
              <g opacity={tramo(t, tAceite - 1.2, 0.8, 'natural')}>
                <path d={`M${contacto.x - 150} 40 L${contacto.x - 40} 40 L${contacto.x - 30} 110 L${contacto.x - 160} 110 Z`} fill={mezclar(pal.fondo, pal.ocre, 0.45)} stroke={mezclar(pal.fondo, '#000000', 0.5)} strokeWidth={2} />
                <path d={`M${contacto.x - 40} 80 L${contacto.x + 4} 136 L${contacto.x - 2} 140 L${contacto.x - 48} 92 Z`} fill={mezclar(pal.fondo, pal.ocre, 0.35)} />
                {t >= tAceite && t < tAceite + 0.6 ? (
                  <g transform={`translate(${contacto.x} ${gotaY}) ${escala(estiroGota)}`}>
                    <path d="M0 -18 C 8 -4, 9 8, 0 9 C -9 8, -8 -4, 0 -18 Z" fill={mezclar(pal.ocre, '#ffd88a', 0.4)} />
                  </g>
                ) : null}
                {t >= tAceite + 0.55 ? <ellipse cx={contacto.x} cy={contacto.y} rx={mix(6, 26, clamp((t - tAceite - 0.55) / 0.4))} ry={6} fill={mezclar(pal.ocre, '#ffd88a', 0.4)} opacity={0.7} /> : null}
              </g>
            ) : null}
            {/* la grava: cae, se mete entre los dientes; algunas piedras siguen de largo */}
            {grava.map((g) => {
              const t0 = tGrava + g.t0;
              if (t < t0) return null;
              const dt = t - t0;
              const tope = g.cae ? 1200 : contacto.y - 6 - (g.i % 5) * 7;
              // piedra: rígida, no se deforma; al chocar con los dientes rebota un poco antes de quedarse
              const tChoque = Math.sqrt((2 * (tope + 20)) / 2600);
              const rebota = dt > tChoque && !g.cae ? 16 * Math.exp(-(dt - tChoque) * 8) * Math.abs(Math.sin((dt - tChoque) * 16)) : 0;
              const y = Math.min(tope, -20 + 0.5 * 2600 * dt * dt) - rebota;
              const x = contacto.x + g.dx * (y > contacto.y - 80 && !g.cae ? 0.35 : 1);
              return <path key={g.i} d={`M${-g.lado} 0 L${-g.lado * 0.3} ${-g.lado * 0.8} L${g.lado * 0.7} ${-g.lado * 0.5} L${g.lado} ${g.lado * 0.3} L${0} ${g.lado * 0.8} Z`}
                transform={`translate(${x} ${y}) rotate(${g.rot + dt * 200 * (y < tope ? 1 : 0)})`} fill={mezclar(pal.papel, pal.fondo, 0.45 + (g.i % 3) * 0.12)} stroke={mezclar(pal.fondo, '#000000', 0.3)} strokeWidth={1} />;
            })}
          </svg>
          {/* rótulos */}
          <AbsoluteFill style={{ alignItems: 'center', justifyContent: 'flex-end', paddingBottom: 70 }}>
            {t < tCorte ? (
              <div style={{ fontFamily: fuente.mono, fontSize: 42, letterSpacing: '0.2em', color: alfa(pal.papel, 0.85), opacity: tramo(t, tAceite + 0.4, 0.6, 'natural') }}>{props.engranaje.antes}</div>
            ) : (
              <div style={{ fontFamily: fuente.mono, fontWeight: 600, fontSize: 42, letterSpacing: '0.2em', color: pal.rojo, opacity: tramo(t, tTraba + 0.15, 0.4, 'ligero') }}>{props.engranaje.despues}</div>
            )}
          </AbsoluteFill>
        </AbsoluteFill>
      )}

      {/* sonido */}
      {props.tarjetas.map((_, i) => <Sfx key={`c${i}`} nombre="carta" en={tTarjetas + i * 0.5} fps={fps} volumen={0.5} />)}
      {tFoco.map((tf, i) => <Sfx key={`f${i}`} nombre="soplo" en={tf} fps={fps} volumen={0.2} />)}
      {tResp.slice(0, 3).map((tr, i) => <Sfx key={`r${i}`} nombre="carta" en={tr} fps={fps} volumen={0.6} />)}
      {props.sellos.map((_, j) => <Sfx key={`s${j}`} nombre="sello" en={tSellos + j * 0.7 + 0.08} fps={fps} volumen={0.5} />)}
      {[0, 0.9, 2.1].map((d, j) => <Sfx key={`e${j}`} nombre="lapiz" en={tEntradas + d} fps={fps} volumen={0.28} />)}
      <Sfx nombre="lapiz" en={tResp[3]} fps={fps} volumen={0.28} />
      <Sfx nombre="engranaje" en={tEngranaje} fps={fps} volumen={0.3} bucle dura={tCorte - tEngranaje} />
      <Sfx nombre="gota" en={tAceite + 0.55} fps={fps} volumen={0.6} />
      <Sfx nombre="engranaje" en={tCorte} fps={fps} volumen={0.3} bucle dura={tTraba - tCorte + 0.05} />
      <Sfx nombre="grava" en={tGrava} fps={fps} volumen={0.55} />
      <Sfx nombre="traba" en={tTraba} fps={fps} volumen={1} />
    </AbsoluteFill>
  );
};
