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
  junio: 7.7, octubre: 8.26, cinco: 12.5, veinticuatro: 13.14, estado: 18.28, diferencia: 22.16, uno: 26.1,
  pocas: 30.16, docenas: 34.5, consolidados: 39.86, forma: 44.64, nombrando: 46.96, robo: 49.12,
  externa: 54.34, externa2: 62.62, interna: 64.0, londres: 67.16, inmediato: 74.18, londres2: 79.28, intereses: 80.9,
  uribarren: 88.98, montane: 90.4, entregaba: 91.88, daba: 94.24, manuel: 98.36, lima: 103.4, mitad: 106.2,
  mercado: 108.9, cuarenta: 111.66, casi: 115.66, juntado: 119.12, ganaron: 122.04, diplomatico: 124.46,
  guano: 128.92, manchado: 137.12, limpio: 138.74,
};

const MENDIBURU: Presentacion = { persona: 'mendiburu', nombre: 'MANUEL DE MENDIBURU', rol: 'ministro plenipotenciario en Londres, 1853 (Q, p. 179)', t0: P.manuel - 0.1 };

// línea de 1852 y sus dos plazos
const L0 = 140, L1 = 1180, LY = 930;
const xMes = (m: number) => L0 + ((m + 0.5) / 12) * (L1 - L0);
const MARCA_J = xMes(5), MARCA_O = xMes(9);

// la pila: un vale por millón de pesos (la altura cuenta la cifra)
const PILA_X = 1430, PILA_BASE = 990, PILA_W = 300, PASO = 26;
const VALE_ASP = 1024 / 1536;

/** Texto sobre la mesa: siempre sobre su tira de cartón (regla de la escena 3). */
const Rotulo = ({ x, y, k, children, size = 22, centro = false, derecha = false }: { x: number; y: number; k: number; children: React.ReactNode; size?: number; centro?: boolean; derecha?: boolean }) =>
  k <= 0 ? null : (
    <div style={{ position: 'absolute', left: x, top: y, transform: `translateX(${centro ? '-50%' : derecha ? '-100%' : '0'}) rotate(-1.2deg)`, opacity: k }}>
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

  // ── 4.3a · qué es un bono (párrafo revisado por el Escribano, 21 de noviembre de 2026; Q, pp. 136–139, 178–181)
  // en la mesa, el vale a la izquierda y, con «deuda externa», el bono a la derecha
  const levanta = k(F(9) + 0.3, 0.8, 'pesado');
  const bonoIn = k(P.externa - 0.1, 0.8, 'pesado');
  // con «Londres», el mapa de la escena 1 (cubre la mesa hasta «En el mercado»)
  const mapa = k(P.londres - 0.3, 0.7, 'natural') * (1 - k(P.mercado - 0.3, 0.6, 'natural'));
  const ENC: [number, number, number, number] = [-100, -32, 25, 62];
  const proy = proyeccionDe(ENC);
  const xy = (lon: number, lat: number): [number, number] => (proy([lon, lat]) as [number, number] | null) ?? [0, 0];
  const lima = xy(-77.04, -12.05), paris = xy(2.35, 48.86), londres = xy(-0.13, 51.51);
  // los préstamos de 1822 y 1825: la plata vino de Londres a Lima (Q, pp. 137 y 139)
  const rutaPrest = arco(londres, lima), largoPrest = getLength(rutaPrest);
  const prest = k(P.londres + 0.1, 1.8, 'solemne');
  const r1822 = k(P.londres + 0.9, 0.4, 'natural'), r1825 = k(P.londres + 1.8, 0.4, 'natural');
  // los pagos hacia Londres: se cortan «casi de inmediato» (✕ roja) y vuelven en 1849 (Q, pp. 136 y 178)
  // la ruta de los pagos va por otro arco (hacia el sur del Atlántico), para no confundirse con la de los préstamos
  const rutaPago = `M${lima[0]} ${lima[1]} Q ${(lima[0] + londres[0]) / 2 + 240} ${(lima[1] + londres[1]) / 2 + 100} ${londres[0]} ${londres[1]}`, largoPago = getLength(rutaPago);
  const pago1 = k(F(12) + 0.2, 1.4, 'natural') * 0.42;
  const corte = k(P.inmediato, 0.35, 'ligero');
  const pago2 = k(P.londres2 - 1.4, 1.8, 'solemne');
  const r1849 = k(P.intereses - 0.2, 0.4, 'natural');
  const puntoCorte = getPointAtLength(rutaPago, largoPago * 0.42) ?? { x: lima[0], y: lima[1] };
  const saleHistoria = k(F(14) - 0.6, 0.6, 'natural');
  // ── 4.3b · las dos casas, el cambio y los dos contratos
  const rUri = k(P.uribarren - 0.1, 0.4, 'natural'), rMon = k(P.montane - 0.1, 0.4, 'natural');
  const rutaIda = arco(paris, lima), rutaVuelta = arco(lima, paris);
  const ida = k(P.entregaba - 0.2, 1.4, 'solemne'), vuelta = k(P.daba - 0.15, 1.4, 'solemne');
  const pIda = getPointAtLength(rutaIda, getLength(rutaIda) * ida) ?? { x: paris[0], y: paris[1] };
  const pVuelta = getPointAtLength(rutaVuelta, getLength(rutaVuelta) * vuelta) ?? { x: lima[0], y: lima[1] };
  const FOLIO = 1448 / 1086;
  const c1In = tramo(voz, MENDIBURU.t0 + PRES_VUELA, PRES_LLEGA - PRES_VUELA, 'pesado');
  const contrato1 = pose(mix(1960, 1360, c1In), 300, 250);
  const c2In = k(F(17) + 0.2, 0.6, 'pesado');
  const contrato2 = pose(mix(-400, lima[0] + 60, c2In), lima[1] - 380, 260);
  const rMitad = k(P.mitad - 0.1, 0.5, 'natural');
  // acercamiento lento que junta los dos contratos antes de «la mitad»
  const junta2 = k(P.lima, P.mitad - P.lima, 'solemne') * (1 - k(P.mercado - 0.3, 0.6, 'natural'));
  const mapaCam = { s: 1 + 0.05 * junta2, ox: 1000, oy: 520 };
  // ── 4.3c · el mercado, la ganancia, el guano comprometido y el lavado
  const bono = pose(mix(1960, 1030, bonoIn), 260, 640);
  const lava = k(P.limpio - 0.05, 0.9, 'pesado');        // con «limpios», el vale manchado queda debajo del bono
  const vale43 = pose(mix(mix(MANOS[0].x, 250, levanta), 760, lava), mix(mix(520, 260, levanta), 300, lava), mix(mix(230, 640, levanta), 560, lava));
  // con «un informe de un diplomático», un saco de guano se ata al bono
  const sacoIn = k(P.diplomatico - 0.2, 0.8, 'pesado'), cuerda = k(P.guano - 0.3, 0.9, 'natural'), saleSaco = k(F(23) - 0.3, 0.6, 'tenso');
  const rCita = k(P.diplomatico + 0.3, 0.5, 'natural') * (1 - saleSaco);
  const barraVale = k(P.cuarenta - 0.1, 0.9, 'pesado') * 0.4 * (1 - lava);
  const barraBono = k(P.casi, 1.0, 'pesado') * 0.97;
  const mancha = k(P.manchado, 1.1, 'natural');
  const anclaContrato = anclaEtiqueta(contrato1, FOLIO, 0);
  const etiqC1 = voz < MENDIBURU.t0 + PRES_LLEGA ? 0 : tramo(voz, MENDIBURU.t0 + PRES_LLEGA, 0.3, 'natural') || 0.001;
  const foco = tramo(voz, MENDIBURU.t0, PRES_IN, 'natural') * (1 - tramo(voz, MENDIBURU.t0 + PRES_VUELA, PRES_LLEGA - PRES_VUELA, 'natural'));


  // ── más información en pantalla (Gerson, 21 de noviembre de 2026: «en partes tiene poco movimiento»)
  // 4.1: los años de la pila (Q, p. 170: 5 millones en 1851, 24 en 1852), su valor en soles de hoy y la diferencia
  const top = (i: number) => PILA_BASE - PILA_W * VALE_ASP - i * PASO;
  const sale41der = k(F(5) - 0.2, 0.8, 'tenso');
  const r5 = k(P.cinco + 0.3, 0.4, 'natural'), r24 = k(P.veinticuatro + 1.1, 0.4, 'natural'), rSoles = k(Ffin(2) - 0.2, 0.4, 'natural');
  const llave = k(P.diferencia - 0.1, 0.7, 'pesado');
  // 4.1: la deuda la tendría que pagar el Estado: el edificio entra y la flecha roja (la culpa: la deuda inflada hacia el Estado)
  const estadoIn = k(P.estado - 0.3, 0.7, 'pesado'), estadoSale = k(P.uno - 0.8, 0.6, 'tenso');
  const flecha = k(P.estado + 0.1, 1.0, 'natural') * (1 - estadoSale);
  // 4.2: de la ley a las personas; con «robo político», la red se vuelve roja
  const rLey = k(P.forma - 0.1, 0.4, 'natural'), rFlecha = k(P.nombrando - 0.1, 0.6, 'natural');
  // 4.3: con «habían juntado vales», cuánto ganaba quien tenía vales (40 → casi 100: ≈ 2,5 veces)
  const veces = k(P.juntado - 0.1, 0.9, 'natural') * (1 - lava);

  // cámara (A3): un acercamiento lento hacia lo que la voz examina, solo en los tramos de «sentido» que en A2 quedaban
  // quietos; vuelve a 1 con la salida de cada plano. Motivo anotado en el INFORME. Los respiros siguen quietos.
  const acerca = (a: number, b: number, s: number, vuelve: number) => 1 + s * tramo(voz, a, b - a, 'solemne') * (1 - vuelve);
  const cam = voz < F(5) + 1 ? { s: acerca(F(3), P.uno - 0.6, 0.06, sale41der), ox: 1150, oy: 520 }
    : voz < F(9) + 1.2 ? { s: acerca(F(8), F(9), 0.07, sale42), ox: 960, oy: 600 }
    : voz < P.mercado - 0.3 ? { s: 1, ox: 960, oy: 540 }
    : { s: acerca(P.cuarenta, Ffin(23), 0.05, 0), ox: 960, oy: 720 };

  return (
    <AbsoluteFill style={{ background: '#1d1813' }}>
      <AbsoluteFill style={{ filter: foco > 0.001 ? `blur(${9 * foco}px) brightness(${1 - 0.35 * foco})` : undefined, transform: `scale(${cam.s})`, transformOrigin: `${cam.ox}px ${cam.oy}px` }}>
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
              const x = esLa ? mix(c.x, 240, sacaUna) : c.x;
              const y = esLa ? mix(c.y, 110, sacaUna) : mix(c.y - 260, c.y, cae);
              const w = esLa ? mix(170, 700, sacaUna) : 170;
              const src = esLa && abierta > 0.5 ? 'obj-07-carpeta-abierta' : 'obj-07-carpeta-cerrada';
              const flip = esLa ? Math.abs(1 - 2 * abierta) : 1;   // se abre: se angosta y vuelve
              return (
                <Img key={i} src={img(src)} style={{ position: 'absolute', left: x, top: y, width: w, height: w * VALE_ASP, transform: `rotate(${esLa ? mix(c.g, 0, sacaUna) : c.g}deg) scaleX(${Math.max(0.04, flip)})`, filter: sombra(1) }} />
              );
            })}
          </div>

          {/* 4.1 · el Estado deudor y la flecha de la deuda */}
          {estadoIn > 0 && estadoSale < 1 ? (
            <>
              <Papel src={img('obj01-08-estado')} p={pose(mix(-600, 120, estadoIn) - 800 * estadoSale, 150, 430)} aspecto={1024 / 1536} capas={capas} dueno="ESTADO PERUANO · DEUDOR" />
              <svg width={1920} height={1080} style={{ position: 'absolute', inset: 0 }}>
                <path d="M 1410 400 Q 1000 330 590 300" fill="none" stroke={ROJO} strokeWidth={6} strokeDasharray="1000" strokeDashoffset={1000 * (1 - flecha)} strokeLinecap="round" />
                {flecha > 0.95 ? <path d="M 614 280 L 590 300 L 616 316" fill="none" stroke={ROJO} strokeWidth={6} strokeLinecap="round" strokeLinejoin="round" /> : null}
              </svg>
            </>
          ) : null}
          {/* 4.1 · la pila con sus años, su valor de hoy y la diferencia */}
          {voz < F(5) + 1 ? (
            <div style={{ position: 'absolute', inset: 0, transform: `translateX(${900 * sale41der}px)` }}>
              <Rotulo x={PILA_X - 24} y={top(4) - 6} k={r5} derecha size={20}>5 MILLONES · 1851</Rotulo>
              <Rotulo x={PILA_X - 24} y={top(23) - 18} k={r24} derecha size={20}>24 MILLONES · 1852</Rotulo>
              <Rotulo x={PILA_X - 24} y={top(23) + 32} k={rSoles} derecha size={18}>≈ 3 400 MILLONES DE SOLES DE HOY*</Rotulo>
              <Rotulo x={PILA_X - 24} y={PILA_BASE - 30} k={rSoles} derecha size={14}>* CONVERSIÓN APROXIMADA</Rotulo>
              {llave > 0 ? (
                <svg width={1920} height={1080} style={{ position: 'absolute', inset: 0 }}>
                  <path d={`M ${PILA_X - 8} ${top(4)} h -22 V ${mix(top(4), top(23), llave)} h 22`} fill="none" stroke={PAPEL} strokeWidth={3} />
                </svg>
              ) : null}
              <Rotulo x={PILA_X - 44} y={(top(4) + top(23)) / 2 + 30} k={k(P.diferencia + 0.4, 0.4, 'natural')} derecha size={20}>LA DIFERENCIA: 19 MILLONES</Rotulo>
            </div>
          ) : null}

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
                    <circle cx={r.x} cy={r.y} r={11} fill={tramo(voz, P.robo + i * 0.03, 0.3, 'natural') > 0.5 ? ROJO : PAPEL} stroke={TINTA} strokeWidth={2} />
                  </g>
                );
              })}
            </svg>
          ) : null}
          {voz >= F(8) && voz < F(9) + 1.2 ? (
            <div style={{ position: 'absolute', left: 0, top: 0, transform: `translateX(${-1500 * sale42}px)` }}>
              <Rotulo x={760} y={70} k={tramo(voz, F(8), 0.4, 'natural')} size={30}>LOS CONSOLIDADOS</Rotulo>
              <Rotulo x={130} y={76} k={rLey} size={22}>CONSOLIDACIÓN · LEY DE 1850</Rotulo>
              {rFlecha > 0 ? (
                <svg width={1920} height={200} style={{ position: 'absolute', left: 0, top: 0 }}>
                  <path d={`M 590 98 L ${mix(590, 735, rFlecha)} 98`} stroke={PAPEL} strokeWidth={3} />
                  {rFlecha > 0.95 ? <path d="M 722 88 L 737 98 L 722 108" fill="none" stroke={PAPEL} strokeWidth={3} /> : null}
                </svg>
              ) : null}
            </div>
          ) : null}

        </AbsoluteFill>

        {/* el vale de vuelta en la mesa: barra del mercado y la mancha */}
        {voz >= F(9) ? (
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
              <Renglon x={10} y={36} size={6.6} k={tramo(voz, P.interna - 0.1, 0.4)} ancho={80} centro familia={fuente.libro} peso={600} tinta>deuda interna</Renglon>
            </Papel>
          </>
        ) : null}
        {bonoIn > 0 ? (
          <Papel src={img('obj-10-bono-deuda-externa')} p={bono} aspecto={VALE_ASP} capas={capas} dueno="BONO DE DEUDA EXTERNA">
            <Renglon x={10} y={30} size={6.6} k={tramo(voz, P.externa2 - 0.1, 0.4)} ancho={80} centro familia={fuente.libro} peso={600} tinta>deuda externa</Renglon>
          </Papel>
        ) : null}
        {/* 4.3c · el guano, atado al bono (Q, n. 108) */}
        {sacoIn > 0 && saleSaco < 1 ? (
          <>
            <svg width={1920} height={1080} style={{ position: 'absolute', inset: 0 }}>
              <path d="M 1710 745 Q 1690 710 1655 690" fill="none" stroke={PAPEL} strokeWidth={4} strokeDasharray={`${90 * cuerda} 200`} opacity={1 - saleSaco} />
            </svg>
            <Papel src={img('obj-02-saco-guano-cerrado')} p={pose(mix(1960, 1700, sacoIn) + 400 * saleSaco, 730, 170)} aspecto={1} capas={capas} dueno="GUANO" />
            <div style={{ position: 'absolute', left: 0, top: 0, opacity: rCita }}>
              <Rotulo x={960} y={40} k={rCita > 0 ? 1 : 0} centro size={20}>«EL INGRESO GUANERO YA ESTABA HIPOTECADO A LOS ACREEDORES EXTRANJEROS»</Rotulo>
              <Rotulo x={960} y={92} k={rCita > 0 ? 1 : 0} centro size={15}>QUIROZ, N. 108, SOBRE UN DESPACHO DE J. R. CLAY, DIPLOMÁTICO DE EE. UU., 1855</Rotulo>
            </div>
          </>
        ) : null}
        {/* barras del mercado: lo que se pagaba por cada papel, en % de lo que decía */}
        {voz >= P.cuarenta - 0.2 ? (
          <>
            {[{ x: 250, v: barraVale, rot: 'PRECIO EN PLAZA ≈ 40 % DE LO QUE DICE', k0: P.cuarenta, sale: lava }, { x: 1030, v: barraBono, rot: 'PRECIO: PRONTO, CASI EL 100 %', k0: P.casi, sale: 0 }].map((b) =>
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
        {veces > 0 ? (
          <>
            <svg width={1920} height={1080} style={{ position: 'absolute', inset: 0 }}>
              <path d="M 506 880 Q 1078 1010 1651 880" fill="none" stroke={PAPEL} strokeWidth={3} strokeDasharray="1300" strokeDashoffset={1300 * (1 - veces)} />
              {veces > 0.95 ? <path d="M 1632 872 L 1652 880 L 1638 896" fill="none" stroke={PAPEL} strokeWidth={3} /> : null}
            </svg>
            <Rotulo x={1078} y={952} k={k(P.ganaron - 0.2, 0.4, 'natural') * (1 - lava)} centro size={22}>QUIEN TENÍA VALES, AL CAMBIARLOS: ≈ 2,5 VECES MÁS</Rotulo>
          </>
        ) : null}

        {/* 4.3 · el mapa de la escena 1: las casas del guano, el cambio y los dos contratos */}
        {mapa > 0.001 ? (
          <AbsoluteFill style={{ opacity: mapa, background: '#1d1813', transform: `scale(${mapaCam.s})`, transformOrigin: `${mapaCam.ox}px ${mapaCam.oy}px` }}>
            <Mapa paleta={PALETA} id="m4" origen={{ nombre: 'Lima', lon: -77.04, lat: -12.05 }}
              destinos={[{ nombre: 'París', lon: 2.35, lat: 48.86 }, { nombre: 'Londres', lon: -0.13, lat: 51.51 }]}
              rutas={[0, 0]} llegadas={[rUri, k(P.londres - 0.1, 0.4, 'natural')]} encuadre={ENC} t={t} />
            {/* 4.3a · los préstamos de Londres, el corte de pagos y el arreglo de 1849 */}
            {saleHistoria < 1 ? (
              <div style={{ position: 'absolute', inset: 0, opacity: 1 - saleHistoria }}>
                <svg width={1920} height={1080} style={{ position: 'absolute', inset: 0 }}>
                  <path d={rutaPrest} fill="none" stroke={OCRE} strokeWidth={4} strokeDasharray={`${largoPrest * prest} ${largoPrest}`} />
                  <path d={rutaPago} fill="none" stroke={PAPEL} strokeWidth={3} opacity={0.75} strokeDasharray={`${largoPago * Math.max(pago1, pago2)} ${largoPago}`} />
                  {corte > 0 && pago2 < 0.5 ? (
                    <g stroke={ROJO} strokeWidth={7} strokeLinecap="round" opacity={corte * (1 - 2 * pago2)}>
                      <line x1={puntoCorte.x - 22} y1={puntoCorte.y - 22} x2={puntoCorte.x + 22} y2={puntoCorte.y + 22} />
                      <line x1={puntoCorte.x + 22} y1={puntoCorte.y - 22} x2={puntoCorte.x - 22} y2={puntoCorte.y + 22} />
                    </g>
                  ) : null}
                </svg>
                <Rotulo x={londres[0] - 40} y={londres[1] + 60} k={r1822} derecha size={22}>PRÉSTAMO DE 1822 · 1,2 MILLONES DE LIBRAS</Rotulo>
                <Rotulo x={londres[0] - 40} y={londres[1] + 110} k={r1825} derecha size={22}>PRÉSTAMO DE 1825 · 616 000 LIBRAS</Rotulo>
                <Rotulo x={960} y={40} k={r1849} centro size={24}>1849 · BONOS NUEVOS AL 4 % DE INTERÉS</Rotulo>
              </div>
            ) : null}
            {/* el Estado, en Lima */}
            <Papel src={img('obj01-08-estado')} p={pose(mix(-400, lima[0] - 330, k(F(11) - 0.2, 0.8, 'pesado')), lima[1] - 110, 230, 1)} aspecto={1024 / 1536} capas={capas} dueno="ESTADO PERUANO" />
            <Rotulo x={paris[0] - 30} y={paris[1] + 18} k={rUri} derecha size={22}>URIBARREN ET CIE. · PARÍS</Rotulo>
            <Rotulo x={120} y={110} k={rMon} size={22}>MONTANÉ ET CIE.</Rotulo>
            <Rotulo x={120} y={160} k={rMon} size={16}>CASAS A LAS QUE EL ESTADO ENCARGABA LA VENTA DEL GUANO</Rotulo>
            {ida > 0 && ida < 1 ? <ValeChico x={pIda.x - 50} y={pIda.y - 33} w={100} /> : null}
            {vuelta > 0 && vuelta < 1 ? <Img src={img('obj-10-bono-deuda-externa')} style={{ position: 'absolute', left: pVuelta.x - 50, top: pVuelta.y - 33, width: 100, height: 67, filter: sombra(1) }} /> : null}
            {voz >= MENDIBURU.t0 + PRES_VUELA ? (
              <Papel src={img('obj-09-folio-sencillo')} p={contrato1} aspecto={FOLIO} giro={1.5} capas={capas} etiqueta={etiqC1} dueno="CONTRATO CON URIBARREN" persona="mendiburu">
                <Renglon x={10} y={50} size={8.2} k={tramo(voz, MENDIBURU.t0 + PRES_LLEGA + 0.3, 0.4)} ancho={84} tinta>hasta 6 millones</Renglon>
                <Renglon x={10} y={62} size={6.2} k={tramo(voz, MENDIBURU.t0 + PRES_LLEGA + 0.5, 0.4)} ancho={84} tinta>de pesos en vales</Renglon>
              </Papel>
            ) : null}
            {c2In > 0 ? (
              <Papel src={img('obj-09-folio-sencillo')} p={contrato2} aspecto={FOLIO} giro={-1.5} capas={capas} dueno="CONTRATO CON MONTANÉ">
                <Renglon x={10} y={50} size={8.2} k={tramo(voz, P.lima, 0.4)} ancho={84} tinta>3 millones</Renglon>
                <Renglon x={10} y={62} size={6.2} k={tramo(voz, P.lima + 0.2, 0.4)} ancho={84} tinta>de pesos en vales</Renglon>
              </Papel>
            ) : null}
            <Rotulo x={960} y={40} k={rMitad} centro size={26}>CON LOS DOS CONTRATOS: ≈ 46 % DE TODA LA DEUDA CONSOLIDADA</Rotulo>
          </AbsoluteFill>
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

      <EnPrimerPlano pr={MENDIBURU} voz={voz} destino={anclaContrato} capas={capas} />

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
      {[P.entregaba - 0.2, P.daba - 0.15].map((s) => <Sfx key={s} nombre="tic" en={aVideo('A', s)} fps={FPS} volumen={0.16} />)}
      <Sfx nombre="hoja" en={aVideo('A', F(17) + 0.2)} fps={FPS} dura={1} volumen={0.16} />
      <Sfx nombre="hoja" en={aVideo('A', P.externa - 0.1)} fps={FPS} dura={1} volumen={0.16} />
      <Sfx nombre="tic" en={aVideo('A', P.londres + 1.9)} fps={FPS} volumen={0.16} />
      <Sfx nombre="saco" en={aVideo('A', P.diplomatico + 0.4)} fps={FPS} dura={1.2} volumen={0.18} />
      <Sfx nombre="soplo" en={aVideo('A', MENDIBURU.t0)} fps={FPS} dura={1} volumen={0.1} />
      <Sfx nombre="tic" en={aVideo('A', MENDIBURU.t0 + PRES_LLEGA)} fps={FPS} volumen={0.16} />
      <PrecargaTexturas />
    </AbsoluteFill>
  );
};
