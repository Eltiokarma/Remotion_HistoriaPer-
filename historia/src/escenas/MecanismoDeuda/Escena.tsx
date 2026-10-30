import { getLength, getPointAtLength } from '@remotion/paths';
import { AbsoluteFill, interpolate, spring, useCurrentFrame } from 'remotion';
import type { z } from 'zod';
import { Luz } from '../../components/atmosfera/Luz';
import { Papel } from '../../components/atmosfera/Papel';
import { Sfx } from '../../components/audio/Sfx';
import { EdificioEstado } from '../../components/graficos/EdificioEstado';
import { ILUSTRACION, LibroHojeable } from '../../components/graficos/LibroHojeable';
import { Barco, GrabadoGuanero } from '../../components/graficos/GrabadoGuanero';
import { Pluma } from '../../components/graficos/Pluma';
import { PortadaLibro } from '../../components/graficos/PortadaLibro';
import { SelloFecha } from '../../components/graficos/Sello';
import { Vale } from '../../components/graficos/Vale';
import { Ficha } from '../../components/texto/Ficha';
import { MaquinaDeEscribir } from '../../components/texto/MaquinaDeEscribir';
import { Odometro } from '../../components/texto/Odometro';
import { TrazoRojo } from '../../components/texto/TrazoRojo';
import { anticipa, arqueo, asienta, beat, clamp, mix, tramo } from '../../direction/anim';
import { peso } from '../../direction/easings';
import type { EscenaProps } from '../../esquema';
import { alfa, mezclar } from '../../estilo/color';
import { fuente } from '../../estilo/fuentes';
import { PASOS, type esquema } from './esquema';

type P = z.infer<typeof esquema>;
const PILA = 7; // vales en la pila
const DUR_INFLADO = 2.4;

/** Dibujo en línea punteada (lo hipotético): se traza de izquierda a derecha, como con lápiz. */
const Punteado: React.FC<{ id: string; d: string; k: number; color: string; x0: number; x1: number; ancho?: number }> = ({ id, d, k, color, x0, x1, ancho = 3 }) => (
  <g>
    <clipPath id={id}><rect x={x0 - 20} y={0} width={(x1 - x0 + 40) * clamp(k)} height={1080} /></clipPath>
    <path d={d} clipPath={`url(#${id})`} fill="none" stroke={color} strokeWidth={ancho} strokeDasharray="2 9" strokeLinecap="round" strokeLinejoin="round" />
  </g>
);

/** Fábrica con techo de sierra, chimenea y vía: lo que se prometía. */
const FABRICA = 'M1100 760 L1100 560 L1180 500 L1180 560 L1260 500 L1260 560 L1340 500 L1340 560 L1420 500 L1420 760 Z M1460 760 L1460 380 L1500 380 L1500 760 M1130 640 L1170 640 L1170 700 L1130 700 Z M1230 640 L1270 640 L1270 700 L1230 700 Z M1330 640 L1370 640 L1370 700 L1330 700 Z M1490 360 C 1510 320, 1560 330, 1570 290 C 1580 250, 1640 260, 1650 220 M1040 800 L1720 800 M1040 820 L1720 820 M1060 800 L1060 820 M1120 800 L1120 820 M1180 800 L1180 820 M1240 800 L1240 820 M1300 800 L1300 820 M1360 800 L1360 820 M1420 800 L1420 820 M1480 800 L1480 820 M1540 800 L1540 820 M1600 800 L1600 820 M1660 800 L1660 820';
/** Araña de cristal y un coche de caballos: los lujos de la versión aceptada. */
const LUJOS = 'M1300 300 L1300 380 M1180 420 C 1220 470, 1380 470, 1420 420 M1210 400 C 1240 440, 1360 440, 1390 400 M1180 420 L1180 395 M1240 446 L1240 420 M1300 452 L1300 425 M1360 446 L1360 420 M1420 420 L1420 395 M1180 430 L1176 470 M1240 456 L1236 500 M1300 462 L1300 510 M1360 456 L1364 500 M1420 430 L1424 470 M1260 380 L1340 380 M1080 760 L1420 760 L1440 700 L1400 640 L1120 640 L1090 700 Z M1150 640 L1170 590 L1350 590 L1370 640 M1170 830 m -50 0 a 50 50 0 1 0 100 0 a 50 50 0 1 0 -100 0 M1370 830 m -50 0 a 50 50 0 1 0 100 0 a 50 50 0 1 0 -100 0 M1440 700 L1600 690 M1600 690 L1660 640';
/** Bolsillos de levita: a donde va el caudal. */
const BOLSILLOS = [
  { x: 1480, y: 300 }, { x: 1560, y: 560 }, { x: 1440, y: 800 },
];

export const MecanismoDeuda: React.FC<EscenaProps<P>> = ({ escena, props, video }) => {
  const frame = useCurrentFrame();
  const fps = video.fps;
  const t = frame / fps;
  const pal = video.paleta;
  const b = escena.beats;
  // con `hasta`, los pasos posteriores no llegan nunca
  const corte = props.hasta ? PASOS.indexOf(props.hasta) : PASOS.length;
  const T = (n: (typeof PASOS)[number], d: number) => (PASOS.indexOf(n) > corte ? Infinity : beat(b, n, d));
  const tIslas = T('islas', 0.2), tSacos = T('sacos', 9), tFlecha = T('flecha', 14), tVales = T('vales', 17), tConsol = T('consolidacion', 24);
  const tPromesa = T('promesa', 25.4), tLujos = T('lujos', 32), tExped = T('expedientes', 40), tInflado = T('inflado', 43.6), tCaudal = T('caudal', 46.6);
  const tFunc = T('funcionarios', 49.3), tFrase = T('frase', 51.3), tTachar = T('tachar', 52), tMecan = T('mecanismo', 53.4);
  const tTesis = T('tesis', 55.5), tLibro = T('libro', 59.2), tTitulo = T('titulo', 63.9);
  // el libro que se hojea hasta el grabado (no es el `libro` de la tesis)
  const conLibro = !!props.hojear;
  const tLEntra = conLibro ? beat(b, 'hoja_entra', 0.2) : 0, tHojea = conLibro ? beat(b, 'hojea', 4) : 0;
  const tPagina = conLibro ? beat(b, 'hoja_pagina', 12) : 0, tZoom = conLibro ? beat(b, 'hoja_zoom', tPagina + 0.6) : -1;
  const zoomK = conLibro ? tramo(t, tZoom, 2.2, 'solemne') : 1;
  const S_FIN = 1920 / ILUSTRACION.w;
  const escalaCam = Math.pow(S_FIN, zoomK);
  // punto fijo del zoom: el que termina en la esquina de la pantalla junto con la ilustración
  const qx = (ILUSTRACION.x * S_FIN) / (S_FIN - 1), qy = (ILUSTRACION.y * S_FIN) / (S_FIN - 1);
  const tPregunta = props.pregunta ? beat(b, 'pregunta', Infinity) : Infinity;
  // del Estado a los vales: paneo a la izquierda
  const pan = props.paneo ? tramo(t, tVales - 0.7, 1.6, 'pesado') : 0;
  const tinta = mezclar(pal.fondo, pal.rojo, 0.06);

  // fases (cortes secos o fundidos cortos según el cambio de idea)
  const fase = t < tFlecha ? 1 : t < tVales - (props.paneo ? 0.7 : 0) ? 2 : t < tExped ? 3 : t < tCaudal ? 4 : t < tFrase ? 5 : t < tTesis ? 6 : 7;
  const enPaneo = props.paneo && pan > 0 && pan < 1;
  const golpe = (tb: number, damping = 13) => (t < tb ? 0 : spring({ frame: frame - tb * fps, fps, config: { damping, mass: 1.2, stiffness: 200 } }));

  // —— flecha barco → Estado
  const FLECHA = 'M520 560 C 720 300, 1060 300, 1240 600';
  // la misma flecha, del Estado hacia los vales (a la izquierda, fuera de cuadro hasta que la cámara llega)
  const FLECHA_VALES = 'M1320 300 C 900 -60, -700 -60, -1360 330';
  const largoFlecha = getLength(FLECHA);
  const kFlecha = tramo(t, tFlecha + 0.3, 1.4, 'pesado');
  // —— vale en primer plano: monto que sube y pluma que marca
  const kInfl = tramo(t, tInflado, DUR_INFLADO, 'tenso');
  const monto = mix(props.vale.desde, props.vale.hasta, kInfl);
  const velocidad = t > tInflado && t < tInflado + DUR_INFLADO ? (props.vale.hasta - props.vale.desde) / DUR_INFLADO * 1.6 : 0;
  const RUBRICA = 'M640 352 C 690 336, 780 360, 850 340 M660 368 C 720 356, 800 372, 846 360';
  const kRubrica = tramo(t, tInflado + 0.2, DUR_INFLADO, 'natural');
  const puntaRubrica = getPointAtLength(RUBRICA, getLength(RUBRICA) * kRubrica) ?? { x: 0, y: 0 };

  return (
    <AbsoluteFill style={{ backgroundColor: mezclar(pal.fondo, '#000000', 0.3) }}>
      {/* 1: el grabado de las islas; los sacos suben al barco */}
      {fase === 1 && conLibro && zoomK < 1 ? (
        // el libro sobre la mesa: entra, se abre, se hojea; la cámara entra a la ilustración
        <AbsoluteFill style={{ transformOrigin: `${qx}px ${qy}px`, transform: `scale(${escalaCam})` }}>
          <Luz color={pal.ocre} x={55} y={45} radio={60} intensidad={0.18} />
          <LibroHojeable paleta={pal} t={t} tEntra={tLEntra} tAbre={tHojea} tPagina={tPagina} encabezado={props.hojear?.encabezado ?? ''}>
            <GrabadoGuanero paleta={pal} t={t} guano={1} id={`${escena.id}-gl`} anclado carga={t >= tSacos ? t - tSacos : undefined} />
          </LibroHojeable>
        </AbsoluteFill>
      ) : null}
      {fase === 1 && (!conLibro || zoomK >= 1) ? (
        <Papel color={pal.papel} envejecido={0.3}>
          <AbsoluteFill>
            <GrabadoGuanero paleta={pal} t={t} guano={1} id={`${escena.id}-g`} anclado={conLibro} carga={t >= tSacos ? t - tSacos : undefined} />
          </AbsoluteFill>
          {props.ficha ? (
            <div style={{ position: 'absolute', left: 150, top: 40 }}>
              <Ficha texto={props.ficha} t={t - (conLibro ? tZoom + 2.2 : tIslas) - 0.4} color={pal.fondo} acento={pal.rojo} size={24} />
            </div>
          ) : null}
        </Papel>
      ) : null}

      {/* 2 y 3 en una tira: con paneo, la cámara va del Estado a los vales siguiendo la plata */}
      <AbsoluteFill style={{ transform: props.paneo ? `translateX(${1920 * pan}px)` : undefined }}>
      {/* 2: la plata del guano va del barco al Estado */}
      {fase === 2 || (enPaneo && fase === 3) ? (
        <Papel color={pal.papel} envejecido={0.3}>
          <svg width={1920} height={1080} style={{ position: 'absolute', inset: 0 }}>
            <defs>
              <pattern id={`${escena.id}-b-rayado`} width={5} height={5} patternUnits="userSpaceOnUse" patternTransform="rotate(38)">
                <line x1={0} y1={0} x2={0} y2={5} stroke={tinta} strokeWidth={1.1} />
              </pattern>
            </defs>
            <linearGradient id={`${escena.id}-orilla-g`} x1="0" y1="0" x2="1" y2="0">
              <stop offset="0" stopColor="#fff" stopOpacity={0} />
              <stop offset="0.1" stopColor="#fff" stopOpacity={1} />
              <stop offset="0.75" stopColor="#fff" stopOpacity={1} />
              <stop offset="1" stopColor="#fff" stopOpacity={0} />
            </linearGradient>
            <mask id={`${escena.id}-orilla`}><rect x={80} y={700} width={840} height={300} fill={`url(#${escena.id}-orilla-g)`} /></mask>
            <g mask={`url(#${escena.id}-orilla)`}>
            {Array.from({ length: 14 }, (_, i) => {
              const y = 760 + i * (6 + i * 0.8);
              let d = '';
              for (let x = 80; x <= 900; x += 10) d += `${x === 80 ? 'M' : 'L'}${x} ${(y + Math.sin(x / (40 + i * 6) + t * 1.2 + i) * (0.6 + i * 0.35)).toFixed(1)} `;
              return <path key={i} d={d} fill="none" stroke={tinta} strokeWidth={0.9} opacity={0.55} />;
            })}
            <line x1={80} x2={900} y1={756} y2={756} stroke={tinta} strokeWidth={1.4} />
            </g>
            <Barco x={430} y={742} tinta={tinta} papel={pal.papel} id={`${escena.id}-b`} escala={1.25} />
            {/* la flecha de dinero, con monedas que viajan por ella */}
            <path d={FLECHA} fill="none" stroke={mezclar(pal.ocre, pal.fondo, 0.15)} strokeWidth={16} strokeLinecap="round" pathLength={1} strokeDasharray={1} strokeDashoffset={1 - kFlecha} opacity={0.55} />
            <path d={FLECHA} fill="none" stroke={pal.fondo} strokeWidth={2} strokeLinecap="round" pathLength={1} strokeDasharray={1} strokeDashoffset={1 - kFlecha} />
            {kFlecha >= 1 ? Array.from({ length: 6 }, (_, i) => {
              const u = ((t - tFlecha) * 0.45 + i / 6) % 1;
              const p = getPointAtLength(FLECHA, largoFlecha * u) ?? { x: 0, y: 0 };
              return <ellipse key={i} cx={p.x} cy={p.y} rx={11} ry={7} fill={pal.ocre} stroke={tinta} strokeWidth={1.2} />;
            }) : null}
            {kFlecha > 0.98 ? <path d="M1240 600 l -26 -10 M1240 600 l 2 -28" stroke={pal.fondo} strokeWidth={3} strokeLinecap="round" /> : null}
          </svg>
          <div style={{ position: 'absolute', left: 1040, top: 270 }}>
            <EdificioEstado paleta={pal} id={`${escena.id}-e1`} rotulo={props.estado} width={760} dibujo={tramo(t, tFlecha - 0.2, 1.2, 'pesado')} />
          </div>
        </Papel>
      ) : null}

      {/* con paneo, una flecha sale del Estado y lleva la plata hacia los vales, a la izquierda */}
      {props.paneo && (enPaneo || (fase === 3 && t < tVales + 3)) ? (
        <svg width={1920} height={1080} style={{ position: 'absolute', inset: 0, overflow: 'visible' }}>
          <path d={FLECHA_VALES} fill="none" stroke={mezclar(pal.ocre, pal.fondo, 0.15)} strokeWidth={16} strokeLinecap="round" pathLength={1} strokeDasharray={1}
            strokeDashoffset={1 - tramo(t, tVales - 0.7, 1.4, 'pesado')} opacity={0.55 * (1 - tramo(t, tVales + 2, 1, 'natural'))} />
          <path d={FLECHA_VALES} fill="none" stroke={pal.fondo} strokeWidth={2} strokeLinecap="round" pathLength={1} strokeDasharray={1}
            strokeDashoffset={1 - tramo(t, tVales - 0.7, 1.4, 'pesado')} opacity={1 - tramo(t, tVales + 2, 1, 'natural')} />
        </svg>
      ) : null}
      {/* 3: los vales se apilan y se consolidan; lo prometido y lo que se decía, en punteado */}
      {fase === 3 || (enPaneo && fase === 2) ? (
        <AbsoluteFill style={{ transform: props.paneo ? 'translateX(-1920px)' : undefined }}>
        <Papel color={pal.papel} envejecido={0.32}>
          <Luz color={pal.ocre} x={35} y={50} radio={60} intensidad={0.08} />
          {Array.from({ length: PILA }, (_, i) => {
            const ti = tVales + i * 0.75;
            const k = t < ti ? 0 : spring({ frame: frame - ti * fps, fps, config: { damping: 18, mass: 0.8, stiffness: 120 } });
            if (k <= 0) return null;
            // cada vale llega por el aire (arco) y gira un poco de más antes de quedarse (follow through)
            const giro = ((i * 53) % 9) - 4 + asienta(t, ti + 0.45, i % 2 ? 1.6 : -1.6, 11, 5);
            return (
              <div key={i} style={{ position: 'absolute', left: 180 + ((i * 37) % 50), top: 300 - i * 9, transform: `translate(${(1 - k) * -900}px, ${-arqueo(k, 70)}px) rotate(${giro}deg)`,
                filter: `drop-shadow(4px 6px 6px ${alfa('#000000', 0.35)})` }}>
                <Vale paleta={pal} id={`${escena.id}-v${i}`} width={720} edad={1 - i / PILA} semilla={i + 2} />
              </div>
            );
          })}
          {t >= tConsol ? (
            <div style={{ position: 'absolute', left: 300, top: 360, transform: `rotate(-8deg) scale(${mix(1.6, 1, golpe(tConsol))})` }}>
              <SelloFecha id={`${escena.id}-sello`} texto={props.sello} color={pal.rojo} width={480} semilla={6} />
            </div>
          ) : null}
          <svg width={1920} height={1080} style={{ position: 'absolute', inset: 0 }}>
            <g opacity={1 - tramo(t, tLujos - 0.6, 0.8, 'natural')}>
              <Punteado id={`${escena.id}-fab`} d={FABRICA} x0={1040} x1={1720} k={tramo(t, tPromesa, 3.5, 'natural')} color={pal.fondo} />
            </g>
            <Punteado id={`${escena.id}-luj`} d={LUJOS} x0={1080} x1={1670} k={tramo(t, tLujos, 4, 'natural')} color={pal.rojo} />
          </svg>
        </Papel>
        </AbsoluteFill>
      ) : null}
      </AbsoluteFill>

      {/* la pregunta que acusa: entra fuerte, palabra por palabra, en el lado vacío (§2.14) */}
      {props.pregunta && t >= tPregunta ? (() => {
        const palabras = props.pregunta.split(' ');
        const corte = [Math.ceil(palabras.length / 3), Math.ceil((2 * palabras.length) / 3)];
        const lineas = [palabras.slice(0, corte[0]), palabras.slice(corte[0], corte[1]), palabras.slice(corte[1])];
        let n = 0;
        return (
          <div style={{ position: 'absolute', left: 1010, top: 250, width: 860 }}>
            {lineas.map((l, i) => (
              <div key={i} style={{ display: 'flex', gap: 26, fontFamily: fuente.afiche, fontWeight: 700, fontSize: 128, lineHeight: 1.08, textTransform: 'uppercase' }}>
                {l.map((w) => {
                  const k = tramo(t, tPregunta + 0.12 + (n++) * 0.16, 0.22, 'tenso');
                  const ultima = i === lineas.length - 1;
                  return (
                    <span key={w + n} style={{ display: 'inline-block', color: ultima ? pal.rojo : pal.fondo, opacity: clamp(k * 3),
                      transform: `scale(${mix(1.5, 1, k)}) translateY(${(1 - k) * -18}px)`, transformOrigin: '50% 80%' }}>{w}</span>
                  );
                })}
              </div>
            ))}
          </div>
        );
      })() : null}

      {/* 4: un vale en primer plano: el monto se infla */}
      {fase === 4 ? (
        <Papel color={mezclar(pal.papel, pal.fondo, 0.08)} envejecido={0.45}>
          <AbsoluteFill style={{ alignItems: 'center', justifyContent: 'center', transform: `scale(${mix(0.92, 1.0, tramo(t, tExped, 1.2, 'pesado'))})` }}>
            <div style={{ position: 'relative', filter: `drop-shadow(10px 14px 14px ${alfa('#000000', 0.35)})` }}>
              <Vale paleta={pal} id={`${escena.id}-vale`} width={1300} edad={0.5} semilla={9}
                monto={<Odometro valor={monto} digitos={4} velocidad={velocidad} fps={fps} fontFamily={fuente.titulo} fontSize={76}
                  color={kInfl > 0 ? mezclar(pal.fondo, pal.rojo, kInfl) : pal.fondo} separacion={0.22} />} />
              <svg viewBox="0 0 900 480" width={1300} style={{ position: 'absolute', inset: 0, overflow: 'visible' }}>
                <path d={RUBRICA} fill="none" stroke={pal.rojo} strokeWidth={3.2} strokeLinecap="round" pathLength={1} strokeDasharray={1} strokeDashoffset={1 - kRubrica} />
                {kRubrica > 0 && kRubrica < 1 ? <Pluma x={puntaRubrica.x} y={puntaRubrica.y} paleta={pal} id={`${escena.id}-pluma`} escala={0.8} /> : null}
              </svg>
            </div>
            <div style={{ marginTop: 36, fontFamily: fuente.mono, fontSize: 24, letterSpacing: '0.2em', color: alfa(pal.fondo, 0.6), opacity: tramo(t, tInflado - 0.5, 0.8, 'natural') }}>
              {props.vale.rotulo}
            </div>
          </AbsoluteFill>
        </Papel>
      ) : null}

      {/* 5: el Estado, un caudal grueso hacia pocos bolsillos, y adentro los cómplices */}
      {fase === 5 ? (
        <Papel color={pal.papel} envejecido={0.3}>
          <div style={{ position: 'absolute', left: 110, top: 300 }}>
            <EdificioEstado paleta={pal} id={`${escena.id}-e2`} rotulo={props.estado} etiqueta={props.funcionario} width={820}
              siluetas={tramo(t, tFunc, 2.2, 'natural')} />
          </div>
          <svg width={1920} height={1080} style={{ position: 'absolute', inset: 0 }}>
            {BOLSILLOS.map((p, i) => {
              const d = `M760 ${770 - i * 10} C 1000 ${740 - i * 30}, ${p.x - 200} ${p.y + 20}, ${p.x + 95} ${p.y - 4}`;
              const k = tramo(t, tCaudal + 0.3 + i * 0.25, 1.4, 'pesado');
              return (
                <g key={i}>
                  <path d={d} fill="none" stroke={pal.ocre} strokeWidth={46 - i * 8} strokeLinecap="round" pathLength={1} strokeDasharray={1} strokeDashoffset={1 - k} opacity={0.5} />
                  <path d={d} fill="none" stroke={tinta} strokeWidth={2.4} strokeDasharray="3 20" strokeDashoffset={-(t * 90)} opacity={k >= 1 ? 0.8 : 0} />
                  {/* un trozo de levita de paño con raya diplomática y un bolsillo de parche cosido */}
                  <g transform={`translate(${p.x - 30} ${p.y - 60})`} opacity={tramo(t, tCaudal, 0.8, 'natural')}>
                    <clipPath id={`${escena.id}-pano${i}`}><rect x={0} y={0} width={250} height={230} rx={18} /></clipPath>
                    <rect x={0} y={0} width={250} height={230} rx={18} fill={mezclar(pal.fondo, pal.verde, 0.3)} />
                    <g clipPath={`url(#${escena.id}-pano${i})`} stroke={pal.papel} strokeWidth={1.2} opacity={0.3}>
                      {Array.from({ length: 13 }, (_, k) => <line key={k} x1={8 + k * 20} x2={8 + k * 20} y1={0} y2={230} strokeDasharray="2 3" />)}
                    </g>
                    <path d="M50 58 L200 58 L200 160 L125 200 L50 160 Z" fill={mezclar(pal.fondo, pal.verde, 0.55)} stroke={mezclar(pal.fondo, '#000000', 0.4)} strokeWidth={2} />
                    <path d="M60 68 L190 68 L190 154 L125 188 L60 154 Z" fill="none" stroke={pal.papel} strokeWidth={1.4} strokeDasharray="5 4" opacity={0.55} />
                    <path d="M50 58 L200 58" stroke={mezclar(pal.fondo, '#000000', 0.6)} strokeWidth={5} />
                    <rect x={0} y={0} width={250} height={230} rx={18} fill="none" stroke={tinta} strokeWidth={2} />
                  </g>
                </g>
              );
            })}
          </svg>
        </Papel>
      ) : null}

      {/* 6: la frase que corrige la versión aceptada */}
      {fase === 6 ? (
        <AbsoluteFill style={{ alignItems: 'center', justifyContent: 'center', gap: 40, backgroundColor: mezclar(pal.fondo, '#000000', 0.25) }}>
          <div style={{ fontFamily: fuente.libro, fontSize: 104, color: alfa(pal.papel, mix(1, 0.55, tramo(t, tTachar + 0.6, 0.6, 'natural'))) }}>
            <TrazoRojo k={tramo(t, tTachar, 0.7, 'natural')} color={pal.rojo} tipo="tachar" grosor={9}>{props.frase[0]}</TrazoRojo>
          </div>
          <div style={{ fontFamily: fuente.libro, fontStyle: 'italic', fontSize: 104, color: pal.papel, opacity: tramo(t, tMecan, 0.6, 'natural'),
            transform: `translateY(${(1 - tramo(t, tMecan, 0.8, 'natural')) * 18}px)` }}>{props.frase[1]}</div>
        </AbsoluteFill>
      ) : null}

      {/* 7: de la tesis al libro */}
      {fase === 7 ? (
        <AbsoluteFill style={{ backgroundColor: mezclar(pal.fondo, '#000000', 0.3) }}>
          <Luz color={pal.ocre} x={50} y={45} radio={55} intensidad={0.22} />
          <AbsoluteFill style={{ alignItems: 'center', justifyContent: 'center' }}>
            {/* la tesis: papel a máquina, que gira y se va */}
            {t < tLibro + 0.8 ? (
              <div style={{ position: 'absolute', transform: `perspective(1600px) rotateY(${90 * anticipa(t, tLibro, 0.8, 'pesado', 0.07, 0.3)}deg)` }}>
                <div style={{ width: 520, height: 740, position: 'relative', boxShadow: `14px 20px 36px ${alfa('#000000', 0.5)}` }}>
                  <Papel color={pal.papel} envejecido={0.2}>
                    <AbsoluteFill style={{ alignItems: 'center', paddingTop: 240, gap: 30 }}>
                      <MaquinaDeEscribir texto={props.tesis.etiqueta} t={t - tTesis} color={pal.fondo} size={56} cps={6} />
                      <div style={{ width: 120, height: 2, background: alfa(pal.fondo, 0.5) }} />
                      <MaquinaDeEscribir texto={props.tesis.anio} t={t - tTesis - 1.2} color={pal.fondo} size={40} cps={6} />
                    </AbsoluteFill>
                  </Papel>
                </div>
              </div>
            ) : null}
            {/* el libro: la tapa entra girando desde el otro lado */}
            {t >= tLibro + 0.8 ? (
              <div style={{ transform: `perspective(1600px) rotateY(${interpolate(t, [tLibro + 0.8, tLibro + 1.6], [-90, 0], { extrapolateLeft: 'clamp', extrapolateRight: 'clamp', easing: peso.pesado }) + asienta(t, tLibro + 1.6, 4, 11, 5)}deg)` }}>
                <PortadaLibro paleta={pal} titulo={props.libro.titulo} autor={props.libro.autor} anio={props.libro.anio} estampado={tramo(t, tTitulo - 1.2, 2.2, 'natural')} width={500} />
              </div>
            ) : null}
          </AbsoluteFill>
        </AbsoluteFill>
      ) : null}

      {/* sonido */}
      {Array.from({ length: 4 }, (_, i) => <Sfx key={`s${i}`} nombre="saco" en={tSacos + 0.8 + i * 1.3} fps={fps} volumen={0.35} />)}
      <Sfx nombre="monedas" en={tFlecha + 0.4} fps={fps} volumen={0.55} />
      {Array.from({ length: PILA }, (_, i) => <Sfx key={`v${i}`} nombre="hoja" en={tVales + i * 0.75} fps={fps} volumen={0.4} />)}
      <Sfx nombre="sello" en={tConsol + 0.08} fps={fps} volumen={0.85} />
      {props.pregunta ? <Sfx nombre="golpe" en={tPregunta + 0.15} fps={fps} volumen={0.55} /> : null}
      {props.pregunta ? <Sfx nombre="golpe" en={tPregunta + 0.15 + 0.16 * (props.pregunta.split(' ').length - 1)} fps={fps} volumen={0.6} /> : null}
      {props.paneo ? <Sfx nombre="soplo" en={tVales - 0.7} fps={fps} volumen={0.3} /> : null}
      <Sfx nombre="lapiz" en={tPromesa} fps={fps} volumen={0.28} />
      <Sfx nombre="lapiz" en={tLujos} fps={fps} volumen={0.28} />
      <Sfx nombre="hoja" en={tExped} fps={fps} volumen={0.45} />
      {Array.from({ length: 10 }, (_, i) => <Sfx key={`t${i}`} nombre="tic" en={tInflado + DUR_INFLADO * (1 - (1 - i / 10) ** 2)} fps={fps} volumen={0.35} />)}
      <Sfx nombre="pluma" en={tInflado + 0.2} fps={fps} volumen={0.22} />
      <Sfx nombre="monedas" en={tCaudal + 0.4} fps={fps} volumen={0.6} />
      <Sfx nombre="lapiz" en={tTachar} fps={fps} volumen={0.28} />
      {props.tesis.etiqueta.split('').map((_, i) => <Sfx key={`k${i}`} nombre={`tecla-${(i % 3) + 1}`} en={tTesis + i / 6} fps={fps} volumen={0.4} />)}
      {props.tesis.anio.split('').map((_, i) => <Sfx key={`a${i}`} nombre={`tecla-${(i % 3) + 1}`} en={tTesis + 1.2 + i / 6} fps={fps} volumen={0.4} />)}
      <Sfx nombre="hoja" en={tLibro} fps={fps} volumen={0.45} />
      <Sfx nombre="carpeta" en={tLibro + 1.5} fps={fps} volumen={0.5} />
    </AbsoluteFill>
  );
};
