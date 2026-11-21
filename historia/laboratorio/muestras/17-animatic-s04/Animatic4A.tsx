import { getLength, getPointAtLength } from '@remotion/paths';
import type { CSSProperties } from 'react';
import { AbsoluteFill, Audio, Img, Sequence, staticFile, useCurrentFrame } from 'remotion';
import { Atmosfera } from '../../../src/components/atmosfera/Atmosfera';
import { PrecargaTexturas } from '../../../src/components/atmosfera/PrecargaTexturas';
import { Sfx } from '../../../src/components/audio/Sfx';
import { Mapa, arco, proyeccionDe } from '../../../src/components/graficos/Mapa';
import { mix, tramo } from '../../../src/direction/anim';
import { azar as semilla } from '../../../src/direction/azar';
import { fuente } from '../../../src/estilo/fuentes';
import {
  CAJA, EnPrimerPlano, OCRE, PAPEL, PRES_IN, PRES_LLEGA, PRES_VUELA, Papel, ROJO, Renglon, TINTA, TIRA,
  anclaEtiqueta, capasDe, img, pose, type Presentacion,
} from '../16-animatic-novoa/Animatic';
import { F, FPS, Ffin, aVideo, aVoz, tramos } from './linea';

/** Un número fijo entre 0 y 1 para cada semilla (el mismo en cada cuadro). */
const azar = (s: number) => semilla(s + 1).n();

/**
 * Animatic de la escena 4, parte A (planos 4.1–4.3): «el fraude y su nombre».
 * Sistema de la escena 3, versión F (mesa desaturada, papeles opacos con trayecto, tinta, tiras de
 * cartón, medallones y presentación solo para quien aparece por primera vez: aquí, Mendiburu).
 * Plan: videos/002-la-deuda-defraudada/diseno/plan-animatic-s04.md. Lo que progresa es la pila de
 * vales: crece (4.1), se junta en pocas manos y recibe nombre (4.2), sale a Londres y vuelve limpia (4.3).
 * Los segundos de las palabras se midieron con Scribe sobre voz/s04.mp3 (21 de noviembre de 2026).
 */

const capas = capasDe('F');
const MESA_FILTRO = 'saturate(.5) brightness(.8)';
const PALETA = { fondo: '#1d1813', papel: PAPEL, ocre: OCRE, rojo: ROJO, verde: '#5e6b4e' };

// palabras (tiempo de voz)
const P = {
  junio: 7.38, octubre: 7.9, cinco: 12.1, veinticuatro: 12.72, uno: 24.82, pocas: 28.74, docenas: 33.0,
  consolidados: 38.2, externa: 52.66, londres: 56.7, manuel: 57.34, mitad: 59.54, mercado: 62.24,
  cuarenta: 64.98, casi: 68.68, manchado: 74.56, limpio: 76.22,
};

const MENDIBURU: Presentacion = { persona: 'mendiburu', nombre: 'MANUEL DE MENDIBURU', rol: 'en Londres', t0: P.manuel - 0.1 };

// línea de 1852 y sus dos plazos
const L0 = 140, L1 = 1180, LY = 930;
const xMes = (m: number) => L0 + ((m + 0.5) / 12) * (L1 - L0);
const MARCA_J = xMes(5), MARCA_O = xMes(9);

// la pila: un vale por millón de pesos (la altura cuenta la cifra)
const PILA_X = 1430, PILA_BASE = 990, PILA_W = 300, PASO = 26;
const VALE_ASP = 1024 / 1536;

/** Texto sobre la mesa: siempre sobre su tira de cartón (regla de la escena 3). */
const Rotulo = ({ x, y, k, children, size = 22, centro = false }: { x: number; y: number; k: number; children: React.ReactNode; size?: number; centro?: boolean }) =>
  k <= 0 ? null : (
    <div style={{ position: 'absolute', left: x, top: y, transform: `translateX(${centro ? '-50%' : '0'}) rotate(-1.2deg)`, opacity: k }}>
      <div style={{ ...TIRA, transform: 'none', whiteSpace: 'nowrap', fontFamily: fuente.mono, fontSize: size, letterSpacing: '0.12em', color: PAPEL, display: 'flex', alignItems: 'center', gap: 10 }}>
        <span style={{ width: 9, height: 9, background: ROJO, display: 'inline-block' }} />{children}
      </div>
    </div>
  );

const sombra = (p: number) => `drop-shadow(1px 2px 1.5px rgba(0,0,0,${0.6 * p})) drop-shadow(5px 7px 8px rgba(0,0,0,${0.28 * p}))`;

/** Un vale chico de la pila o de las manos. */
const ValeChico = ({ x, y, w, giro = 0 }: { x: number; y: number; w: number; giro?: number }) => (
  <Img src={img('obj-04-vale')} style={{ position: 'absolute', left: x, top: y, width: w, height: w * VALE_ASP, transform: `rotate(${giro}deg)`, filter: sombra(1) }} />
);

export const Animatic4A: React.FC = () => {
  const frame = useCurrentFrame();
  const t = frame / FPS;
  const { voz, plano } = aVoz('A', t);
  const k = (a: number, d = 0.5, peso: 'natural' | 'pesado' | 'tenso' | 'solemne' | 'ligero' = 'pesado') => tramo(voz, a, d, peso);

  // ── 4.1 · el archivo y la bajada a la mesa
  const baja = k(F(1) - 0.5, 1.3, 'solemne');            // la cámara baja del estante a la mesa
  const guarda = k(0.9, 1.1, 'pesado');                  // la carpeta de Novoa entra en su estante
  const novoa = pose(mix(560, 1262, guarda), mix(330, 214, guarda), mix(800, 112, guarda));

  // la línea de 1852
  const linea = k(F(1) + 0.9, 1.2, 'natural');
  const mJ = k(P.junio - 0.05, 0.4), mO = k(P.octubre - 0.05, 0.4);
  // los expedientes se apilan antes de cada plazo
  const pilaA = 5, pilaB = 7;
  const carpetas = [
    ...Array.from({ length: pilaA }, (_, i) => ({ x: MARCA_J - 210 + azar(i * 3) * 18, y: LY - 150 - i * 24, t0: Ffin(1) - 1.4 + i * 0.13, g: (azar(i * 7) - 0.5) * 8 })),
    ...Array.from({ length: pilaB }, (_, i) => ({ x: MARCA_O - 210 + azar(i * 5 + 1) * 18, y: LY - 150 - i * 24, t0: Ffin(1) - 1.0 + i * 0.11, g: (azar(i * 11 + 2) - 0.5) * 8 })),
  ];
  // con «uno por uno», la carpeta de arriba de la segunda pila se abre
  const abre = carpetas[carpetas.length - 1];
  const sacaUna = k(P.uno - 0.5, 0.7, 'pesado');
  const abierta = k(P.uno + 0.35, 0.35, 'natural');

  // 4.2 · todo lo de 4.1 sale por la izquierda, opaco
  const sale41 = k(F(5) - 0.2, 0.8, 'tenso');

  // la pila: 5 vales con «cinco», 24 con «veinticuatro»
  const nPila = voz < P.cinco ? 0 : voz < P.veinticuatro ? 5 : 5 + Math.min(19, Math.floor((voz - P.veinticuatro) / 0.045));
  const pilaEntra = k(P.cinco - 0.25, 0.5, 'pesado');
  // con «pocas manos», la pila se reparte y se vuelve a juntar en tres manos (12, 7 y 5 vales)
  const MANOS = [{ x: 330, n: 12 }, { x: 830, n: 7 }, { x: 1300, n: 5 }];
  const destinoMano = (i: number) => {
    let j = i, m = 0;
    while (j >= MANOS[m].n) { j -= MANOS[m].n; m++; }
    return { x: MANOS[m].x + (azar(i * 13) - 0.5) * 10, y: 760 - j * 20, m };
  };

  // la red: varias docenas de fichas de papel alrededor de las tres manos
  const red = Array.from({ length: 36 }, (_, i) => {
    const m = i % 3, ang = azar(i * 17 + 3) * Math.PI * 2, r = 190 + azar(i * 19) * 130;
    const cx = MANOS[m].x + 140, cy = 640;
    return { x: cx + Math.cos(ang) * r, y: Math.max(120, Math.min(1000, cy + Math.sin(ang) * r * 0.8)), cx, cy, t0: P.docenas - 0.1 + i * 0.04 };
  });
  const palabra = voz >= P.consolidados - 0.1 && voz < F(8);   // excepción reservada: pantalla completa
  const sale42 = k(F(9) + 0.1, 0.9, 'tenso');

  // ── 4.3 · el vale viaja a Londres y vuelve bono
  const levanta = k(F(9) + 0.3, 0.8, 'pesado');
  const mapa = k(P.externa + 0.6, 0.7, 'natural') * (1 - k(P.mercado - 0.3, 0.6, 'natural'));
  const ENC: [number, number, number, number] = [-100, -32, 20, 62];
  const proy = proyeccionDe(ENC);
  const lima = proy([-77.04, -12.05]) ?? [0, 0];
  const londres = proy([-0.13, 51.51]) ?? [0, 0];
  const ruta = arco(lima as [number, number], londres as [number, number]);
  const viaje = k(P.externa + 1.2, P.londres - P.externa - 1.2, 'solemne');
  const punto = getPointAtLength(ruta, getLength(ruta) * viaje) ?? { x: lima[0], y: lima[1] };
  const llega = k(P.londres - 0.05, 0.25, 'natural');
  // el vale chico sobre el mapa, y al llegar, el bono que crece sobre Londres
  const creceBono = k(P.londres + 0.05, 0.7, 'pesado');
  const bonoMapa = pose(mix(londres[0] - 50, 1000, creceBono), mix(londres[1] - 33, 330, creceBono), mix(100, 680, creceBono));
  // en el mercado: vuelta a la mesa, vale a la izquierda, bono a la derecha (el 46 % se retira: nunca dos porcentajes a la vez, CLAUDE §8)
  const mesa43 = k(P.mercado - 0.3, 0.8, 'pesado');
  const bono = capas.fisica ? { x: mix(bonoMapa.x, 1030, mesa43), y: mix(bonoMapa.y, 260, mesa43), w: mix(bonoMapa.w, 640, mesa43), o: 1 } : bonoMapa;
  const valeVuelve = k(P.mercado - 0.1, 0.8, 'pesado');
  const lava = k(P.limpio - 0.05, 0.9, 'pesado');        // con «limpio», el vale manchado queda debajo del bono
  const vale43 = pose(mix(mix(-700, 250, valeVuelve), 760, lava), mix(260, 300, lava), mix(640, 560, lava));
  const barraVale = k(P.cuarenta - 0.1, 0.9, 'pesado') * 0.4 * (1 - lava);
  const barraBono = k(P.casi, 1.0, 'pesado') * 0.97;
  const mancha = k(P.manchado, 1.1, 'natural');
  const anclaBono = anclaEtiqueta(bono, VALE_ASP, 0);
  const etiqBono = voz < MENDIBURU.t0 + PRES_LLEGA ? 0 : tramo(voz, MENDIBURU.t0 + PRES_LLEGA, 0.3, 'natural') || 0.001;
  const foco = tramo(voz, MENDIBURU.t0, PRES_IN, 'natural') * (1 - tramo(voz, MENDIBURU.t0 + PRES_VUELA, PRES_LLEGA - PRES_VUELA, 'natural'));

  const enMapa = voz >= P.externa + 0.6 && voz < P.mercado + 0.4;

  return (
    <AbsoluteFill style={{ background: '#1d1813' }}>
      <AbsoluteFill style={{ filter: foco > 0.001 ? `blur(${9 * foco}px) brightness(${1 - 0.35 * foco})` : undefined }}>
        {/* el archivo, que sube cuando la cámara baja */}
        {baja < 1 ? (
          <AbsoluteFill style={{ transform: `translateY(${-1080 * baja}px)` }}>
            <Img src={img('fondo-archivo')} style={{ position: 'absolute', inset: 0, width: 1920, height: 1080, filter: MESA_FILTRO }} />
            <Papel src={img('obj-07-carpeta-cerrada')} p={novoa} aspecto={VALE_ASP} capas={capas} etiqueta={1 - k(0.9, 0.35, 'natural')} dueno="NOVOA · RECLAMO" persona="novoa" />
          </AbsoluteFill>
        ) : null}

        {/* la mesa */}
        <AbsoluteFill style={{ transform: `translateY(${1080 * (1 - baja)}px)` }}>
          <Img src={img('fondo-mesa-expediente')} style={{ position: 'absolute', inset: 0, width: 1920, height: 1080, filter: MESA_FILTRO }} />

          {/* 4.1 · línea de 1852, plazos y expedientes */}
          <div style={{ position: 'absolute', inset: 0, transform: `translateX(${-1500 * sale41}px)` }}>
            <svg width={1920} height={1080} style={{ position: 'absolute', inset: 0 }}>
              <line x1={L0} y1={LY} x2={mix(L0, L1, linea)} y2={LY} stroke={PAPEL} strokeWidth={3} opacity={0.85} />
              {Array.from({ length: 13 }, (_, m) => {
                const x = L0 + (m / 12) * (L1 - L0);
                return x <= mix(L0, L1, linea) + 1 ? <line key={m} x1={x} y1={LY - 10} x2={x} y2={LY + 10} stroke={PAPEL} strokeWidth={2} opacity={0.7} /> : null;
              })}
              {[{ x: MARCA_J, k: mJ }, { x: MARCA_O, k: mO }].map((m) => (
                <line key={m.x} x1={m.x} y1={LY + 14} x2={m.x} y2={LY + 14 - 70 * m.k} stroke={PAPEL} strokeWidth={5} />
              ))}
            </svg>
            <Rotulo x={L0 - 10} y={LY + 26} k={linea} size={20}>1852</Rotulo>
            <Rotulo x={MARCA_J} y={LY + 26} k={mJ} size={20} centro>JUNIO</Rotulo>
            <Rotulo x={MARCA_O} y={LY + 26} k={mO} size={20} centro>OCTUBRE</Rotulo>
            {carpetas.map((c, i) => {
              const cae = tramo(voz, c.t0, 0.32, 'tenso');
              if (cae <= 0) return null;
              const esLa = c === abre;
              const x = esLa ? mix(c.x, 470, sacaUna) : c.x;
              const y = esLa ? mix(c.y, 120, sacaUna) : mix(c.y - 260, c.y, cae);
              const w = esLa ? mix(170, 640, sacaUna) : 170;
              const src = esLa && abierta > 0.5 ? 'obj-07-carpeta-abierta' : 'obj-07-carpeta-cerrada';
              const flip = esLa ? Math.abs(1 - 2 * abierta) : 1;   // se abre: se angosta y vuelve
              return (
                <Img key={i} src={img(src)} style={{ position: 'absolute', left: x, top: y, width: w, height: w * VALE_ASP, transform: `rotate(${esLa ? mix(c.g, 0, sacaUna) : c.g}deg) scaleX(${Math.max(0.04, flip)})`, filter: sombra(1) }} />
              );
            })}
          </div>

          {/* la pila de vales: crece, se reparte y se junta en tres manos */}
          {voz < F(9) + 1.2
            ? Array.from({ length: nPila }, (_, i) => {
                const enPila = { x: PILA_X + (azar(i * 23) - 0.5) * 8, y: PILA_BASE - PILA_W * VALE_ASP - i * PASO };
                const suelto = { x: 160 + azar(i * 29 + 4) * 1500, y: 140 + azar(i * 31 + 9) * 700 };
                const mano = destinoMano(i);
                const d = tramo(voz, F(5) + 0.1 + azar(i * 37) * 0.35, 0.8, 'natural');
                const j = tramo(voz, P.pocas - 0.2 + azar(i * 41) * 0.35, 0.9, 'pesado');
                const x = mix(mix(mix(1940, enPila.x, pilaEntra), suelto.x, d), mano.x, j) - 1500 * sale42;
                const y = mix(mix(enPila.y, suelto.y, d), mano.y, j);
                const giro = mix((azar(i * 43) - 0.5) * 30 * d, (azar(i * 47) - 0.5) * 5, j);
                const w = mix(PILA_W, 230, j);
                return <ValeChico key={i} x={x} y={y} w={w} giro={giro} />;
              })
            : null}
          {/* la red: fichas de papel unidas a su mano */}
          {voz < F(9) + 1.2 ? (
            <svg width={1920} height={1080} style={{ position: 'absolute', inset: 0, transform: `translateX(${-1500 * sale42}px)` }}>
              {red.map((r, i) => {
                const a = tramo(voz, r.t0, 0.35, 'natural');
                return a <= 0 ? null : (
                  <g key={i} opacity={a}>
                    <line x1={r.cx} y1={r.cy} x2={mix(r.cx, r.x, a)} y2={mix(r.cy, r.y, a)} stroke={PAPEL} strokeWidth={1.4} opacity={0.45} />
                    <circle cx={r.x} cy={r.y} r={11} fill={PAPEL} stroke={TINTA} strokeWidth={2} />
                  </g>
                );
              })}
            </svg>
          ) : null}
          {voz >= F(8) && voz < F(9) + 1.2 ? (
            <div style={{ position: 'absolute', left: 0, top: 0, transform: `translateX(${-1500 * sale42}px)` }}>
              <Rotulo x={760} y={70} k={tramo(voz, F(8), 0.4, 'natural')} size={30}>LOS CONSOLIDADOS</Rotulo>
            </div>
          ) : null}

          {/* 4.3 · el vale que se levanta de la primera mano */}
          {voz >= F(9) && !enMapa && voz < P.mercado ? (
            <Papel src={img('obj-04-vale')} p={pose(mix(MANOS[0].x, 640, levanta), mix(520, 300, levanta), mix(230, 640, levanta))} aspecto={VALE_ASP} capas={capas} />
          ) : null}
        </AbsoluteFill>

        {/* 4.3 · el mapa de la escena 1: el viaje a Londres */}
        {mapa > 0.001 ? (
          <AbsoluteFill style={{ opacity: mapa }}>
            <Mapa paleta={PALETA} id="m4" origen={{ nombre: 'Lima', lon: -77.04, lat: -12.05 }} destinos={[{ nombre: 'Londres', lon: -0.13, lat: 51.51 }]}
              rutas={[viaje]} llegadas={[llega]} encuadre={ENC} adelante={[0.6]} faro={[k(P.externa + 1.2, 1.5, 'natural') * (1 - llega)]} t={t} />
            {llega < 1 ? <ValeChico x={punto.x - 50} y={punto.y - 33} w={100} /> : null}
          </AbsoluteFill>
        ) : null}

        {/* el vale de vuelta en la mesa: barra del mercado y la mancha */}
        {voz >= P.mercado - 0.1 ? (
          <>
            <Papel src={img('obj-04-vale')} p={vale43} aspecto={VALE_ASP} capas={capas} etiqueta={1 - tramo(voz, P.limpio - 0.05, 0.3, 'natural')} dueno="VALE DE CONSOLIDACIÓN · LIMA">
              {mancha > 0
                ? [
                    { x: 30, y: 30, w: 34, h: 40, d: 0 }, { x: 46, y: 24, w: 26, h: 30, d: 0.15 }, { x: 40, y: 48, w: 30, h: 28, d: 0.3 },
                    { x: 22, y: 46, w: 18, h: 20, d: 0.45 }, { x: 60, y: 44, w: 14, h: 16, d: 0.55 },
                  ].map((m, i) => {
                    const a = tramo(voz, P.manchado + m.d, 0.9, 'natural');
                    return a <= 0 ? null : (
                      <div key={i} style={{ position: 'absolute', left: `${m.x}%`, top: `${m.y}%`, width: `${m.w}%`, height: `${m.h}%`, borderRadius: '46% 54% 41% 59% / 52% 44% 56% 48%',
                        background: `radial-gradient(ellipse at 50% 50%, rgba(140,36,30,${0.78 * a}) 0%, rgba(150,40,32,${0.55 * a}) 55%, rgba(163,50,42,0) 72%)`,
                        mixBlendMode: 'multiply', transform: `scale(${mix(0.3, 1, a)})` }} />
                    );
                  })
                : null}
            </Papel>
          </>
        ) : null}
        {voz >= P.londres - 0.05 ? (
          <Papel src={img('obj-10-bono-deuda-externa')} p={bono} aspecto={VALE_ASP} capas={capas} etiqueta={etiqBono} dueno="MENDIBURU · LONDRES" persona="mendiburu">
            <Renglon x={10} y={30} size={6.4} k={tramo(voz, P.mitad - 0.1, 0.4) * (1 - mesa43)} ancho={80} centro familia={fuente.libro} peso={600} tinta>≈ 46 %</Renglon>
            <Renglon x={10} y={44} size={3.8} k={tramo(voz, P.mitad + 0.3, 0.4) * (1 - mesa43)} ancho={80} centro tinta>de toda la deuda consolidada,<br />convertida en bonos</Renglon>
          </Papel>
        ) : null}
        {/* barras del mercado: lo que se pagaba por cada papel, en % de lo que decía */}
        {voz >= P.cuarenta - 0.2 ? (
          <>
            {[{ x: 250, v: barraVale, rot: 'PRECIO EN PLAZA ≈ 40 % DE LO QUE DICE', k0: P.cuarenta, sale: lava }, { x: 1030, v: barraBono, rot: 'PRECIO: CASI EL 100 %', k0: P.casi, sale: 0 }].map((b) =>
              voz < b.k0 - 0.2 || b.sale >= 1 ? null : (
                <div key={b.x} style={{ position: 'absolute', left: b.x, top: 0, opacity: 1 - b.sale }}>
                  <div style={{ position: 'absolute', left: 0, top: 770, width: 640, height: 34, border: `2px dashed rgba(239,230,207,.55)` }}>
                    <div style={{ position: 'absolute', left: 0, top: 0, bottom: 0, width: `${b.v * 100}%`, background: PAPEL, boxShadow: '1px 2px 2px rgba(0,0,0,.5)' }} />
                  </div>
                  <Rotulo x={0} y={826} k={tramo(voz, b.k0 + 0.3, 0.4, 'natural')} size={22}>{b.rot}</Rotulo>
                </div>
              ),
            )}
          </>
        ) : null}

        <Atmosfera grano={0} vineta={0.5} />
      </AbsoluteFill>

      {/* excepción reservada: la palabra del episodio, a pantalla completa y quieta */}
      {palabra ? (
        <AbsoluteFill style={{ background: PAPEL, alignItems: 'center', justifyContent: 'center' }}>
          <div style={{ fontFamily: fuente.libro, fontSize: 170, color: TINTA, letterSpacing: '0.01em' }}>los consolidados</div>
          <div style={{ fontFamily: fuente.mono, fontSize: 26, color: TINTA, opacity: 0.7, marginTop: 24, letterSpacing: '0.12em' }}>Q, p. 174</div>
          <Atmosfera grano={0} vineta={0.25} />
        </AbsoluteFill>
      ) : null}

      <EnPrimerPlano pr={MENDIBURU} voz={voz} destino={anclaBono} capas={capas} />

      <div style={{ position: 'absolute', right: 40, bottom: 26, fontFamily: fuente.mono, fontSize: 20, letterSpacing: '0.12em', color: 'rgba(239,230,207,.7)', textAlign: 'right', ...CAJA } as CSSProperties}>
        ANIMATIC · ESCENA 4 · PARTE A<br />plano {plano}
      </div>

      {tramos('A').map((tr) => (
        <Sequence key={tr.id} from={Math.round(tr.video0 * FPS)} durationInFrames={Math.max(1, Math.round((tr.voz1 - tr.voz0) * FPS))} layout="none" name={`voz ${tr.id}`}>
          <Audio src={staticFile('voz/s04.mp3')} trimBefore={Math.round(tr.voz0 * FPS)} />
        </Sequence>
      ))}
      {[Ffin(1) - 1.4, Ffin(1) - 0.9].map((s) => <Sfx key={s} nombre="carpeta" en={aVideo('A', s)} fps={FPS} volumen={0.18} />)}
      <Sfx nombre="golpe" en={aVideo('A', P.veinticuatro + 0.9)} fps={FPS} volumen={0.22} />
      <Sfx nombre="hoja" en={aVideo('A', P.uno + 0.35)} fps={FPS} dura={1} volumen={0.16} />
      {[0.25, 0.55, 0.85].map((f) => <Sfx key={f} nombre="tic" en={aVideo('A', P.externa + 1.2 + f * (P.londres - P.externa - 1.2))} fps={FPS} volumen={0.16} />)}
      <Sfx nombre="soplo" en={aVideo('A', MENDIBURU.t0)} fps={FPS} dura={1} volumen={0.1} />
      <Sfx nombre="tic" en={aVideo('A', MENDIBURU.t0 + PRES_LLEGA)} fps={FPS} volumen={0.16} />
      <Sfx nombre="hoja" en={aVideo('A', P.mercado - 0.1)} fps={FPS} dura={1} volumen={0.16} />
      <PrecargaTexturas />
    </AbsoluteFill>
  );
};
