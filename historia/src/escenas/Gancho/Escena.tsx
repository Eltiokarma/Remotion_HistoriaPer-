import { AbsoluteFill, useCurrentFrame } from 'remotion';
import type { z } from 'zod';
import { Luz } from '../../components/atmosfera/Luz';
import { Sfx } from '../../components/audio/Sfx';
import { PortadaLibro } from '../../components/graficos/PortadaLibro';
import { Ficha } from '../../components/texto/Ficha';
import { Odometro } from '../../components/texto/Odometro';
import { asienta, beat, clamp, escala, impacto, mix, tramo } from '../../direction/anim';
import { azar } from '../../direction/azar';
import type { EscenaProps } from '../../esquema';
import { alfa, mezclar } from '../../estilo/color';
import { fuente } from '../../estilo/fuentes';
import type { esquema } from './esquema';

type P = z.infer<typeof esquema>;

// la barra de la producción
const BX = 210, BW = 1500, BY = 430, BH = 110;
// cada cuánto cae una tajada (un año que pasa, a la vista) y adónde va la pila
const PASO = 0.42, PILA_Y = 930;
// las monedas
const MD = 118, MG = 30;
// la regla de siglos
const RX0 = 170, RX1 = 1750, RY = 560;

/** Una moneda grabada, genérica (no reproduce ninguna moneda real). */
const Moneda: React.FC<{ papel: string; tinta: string; d: number; punteada?: boolean }> = ({ papel, tinta, d, punteada = false }) => {
  const plata = mezclar(papel, '#9aa3a6', 0.45);
  return (
    <svg width={d} height={d} viewBox="-60 -60 120 120" style={{ overflow: 'visible' }}>
      <defs>
        <radialGradient id="gancho-plata" cx="0.35" cy="0.3" r="0.8">
          <stop offset="0" stopColor={mezclar(plata, '#ffffff', 0.55)} />
          <stop offset="0.6" stopColor={plata} />
          <stop offset="1" stopColor={mezclar(plata, tinta, 0.35)} />
        </radialGradient>
      </defs>
      {punteada ? (
        <circle r={56} fill="none" stroke={papel} strokeWidth={2.5} strokeDasharray="7 6" opacity={0.7} />
      ) : (
        <g>
          <circle r={57} fill="url(#gancho-plata)" stroke={mezclar(plata, tinta, 0.5)} strokeWidth={2} />
          {/* el canto estriado */}
          {Array.from({ length: 60 }, (_, i) => {
            const a = (i / 60) * Math.PI * 2;
            return <line key={i} x1={Math.cos(a) * 53} y1={Math.sin(a) * 53} x2={Math.cos(a) * 57} y2={Math.sin(a) * 57} stroke={mezclar(plata, tinta, 0.45)} strokeWidth={1} />;
          })}
          <circle r={44} fill="none" stroke={mezclar(plata, tinta, 0.45)} strokeWidth={1.2} />
          {/* laureles y el valor */}
          {[-1, 1].map((l) => (
            <g key={l} transform={`scale(${l} 1)`}>
              {Array.from({ length: 5 }, (_, j) => (
                <ellipse key={j} cx={30 - j * 2} cy={18 - j * 9} rx={6} ry={2.4} transform={`rotate(${-60 + j * 12} ${30 - j * 2} ${18 - j * 9})`}
                  fill="none" stroke={mezclar(plata, tinta, 0.5)} strokeWidth={1} />
              ))}
            </g>
          ))}
          <text y={8} textAnchor="middle" fontFamily={fuente.libro} fontSize={38} fill={mezclar(plata, tinta, 0.6)}>1</text>
          <text y={30} textAnchor="middle" fontFamily={fuente.mono} fontSize={11} letterSpacing={3} fill={mezclar(plata, tinta, 0.6)}>SOL</text>
        </g>
      )}
    </svg>
  );
};

/**
 * El gancho: cinco cuadros, cada uno con su frase. Va antes de la historia del hombre: primero lo
 * que encontró, después quién era (DIRECCION_DE_VIDEO §2.5).
 */
export const Gancho: React.FC<EscenaProps<P>> = ({ props, escena, video }) => {
  const frame = useCurrentFrame();
  const fps = video.fps;
  const t = frame / fps;
  const pal = video.paleta;
  const b = escena.beats;
  const tAnio = beat(b, 'anio', 0.3), tRojo = beat(b, 'rojo', 6.3), tSoles = beat(b, 'soles', 11.2), tCaen = beat(b, 'caen', 15.7), tCuatro = beat(b, 'cuatro', 16.2);
  const tSueltos = beat(b, 'sueltos', 18.4), tSistema = beat(b, 'sistema', 20.4), tColonia = beat(b, 'colonia', 21.6), tCalculo = beat(b, 'calculo', 24.5), tLibro = beat(b, 'libro', 27.9);
  const noche = mezclar(pal.fondo, '#000000', 0.35);
  const papel = pal.papel;
  // cada cuadro entra y sale con un fundido corto (cambia la idea, no el lugar)
  const ventana = (a: number, z: number) => tramo(t, a - 0.5, 0.5, 'natural') * (1 - tramo(t, z - 0.5, 0.5, 'natural'));

  // —— 1: los años corren y la producción pierde su tajada roja, cada año
  const [a0, a1] = props.anios;
  // el contador frena y se queda en el último año justo antes de «cada año»
  const tFinAnios = Math.min(tSoles - 1.2, tRojo + 3.8);
  const kAnio = tramo(t, tAnio + 0.4, tFinAnios - tAnio - 0.4, 'pesado');
  const anio = Math.round(mix(a0, a1, kAnio));
  const velAnio = (tramo(t + 1 / fps, tAnio + 0.4, tFinAnios - tAnio - 0.4, 'pesado') - kAnio) * (a1 - a0) * fps;
  const kRojo = tramo(t, tRojo, 0.5, 'natural');
  const wMin = (BW * props.pbi.min) / 100, wMax = (BW * props.pbi.max) / 100;
  const caidas = t < tRojo + 0.5 ? 0 : Math.min(Math.floor((tFinAnios - tRojo - 0.5) / PASO), Math.floor((t - tRojo - 0.5) / PASO) + 1);
  const pila = tajadas(caidas);

  // —— 2: diez soles
  const { total, min: mMin, max: mMax } = props.monedas;
  const x0M = 960 - (total * MD + (total - 1) * MG) / 2;

  // —— 3: la regla de siglos
  const rx = (anioR: number) => RX0 + ((anioR - props.regla.desde) / (props.regla.hasta - props.regla.desde)) * (RX1 - RX0);
  const decadas = Array.from({ length: Math.floor((props.regla.hasta - props.regla.desde) / 10) + 1 }, (_, i) => props.regla.desde + i * 10);
  const sueltos = [1700, 1760, 1850, 1920, 1990];
  const kSistema = tramo(t, tSistema, 1.0, 'pesado');
  const kColonia = tramo(t, tColonia, 1.1, 'pesado');

  // —— 5: el libro, y la luz que baja
  const luzFinal = 1 - 0.55 * tramo(t, tLibro + 1.4, 2.4, 'solemne');

  return (
    <AbsoluteFill style={{ backgroundColor: noche }}>
      <Luz color={pal.ocre} x={50} y={42} radio={70} intensidad={0.12 * luzFinal} />

      {/* 1 · la producción del país, año tras año */}
      {t < tSoles ? (
        <AbsoluteFill style={{ opacity: ventana(tAnio, tSoles - 0.3) }}>
          <div style={{ position: 'absolute', left: 0, right: 0, top: 150, display: 'flex', justifyContent: 'center' }}>
            <Odometro valor={anio} digitos={4} velocidad={velAnio} fps={fps} fontFamily={fuente.mono} fontSize={110} color={papel} separacion={0} />
          </div>
          <svg width={1920} height={1080} style={{ position: 'absolute', inset: 0 }}>
            <defs>
              <pattern id={`${escena.id}-raya`} width={8} height={8} patternUnits="userSpaceOnUse" patternTransform="rotate(45)">
                <rect width={3.5} height={8} fill={pal.rojo} />
              </pattern>
            </defs>
            {/* la barra: cien partes */}
            <rect x={BX} y={BY} width={BW} height={BH} fill={mezclar(papel, noche, 0.08)} />
            {Array.from({ length: 99 }, (_, i) => (
              <line key={i} x1={BX + ((i + 1) * BW) / 100} x2={BX + ((i + 1) * BW) / 100} y1={BY} y2={BY + BH} stroke={alfa(noche, i % 10 === 9 ? 0.4 : 0.14)} strokeWidth={1} />
            ))}
            {/* la tajada: lo seguro en rojo lleno, lo que puede llegar a ser, rayado */}
            <rect x={BX + BW - wMax} y={BY} width={(wMax - wMin) * kRojo} height={BH} fill={`url(#${escena.id}-raya)`} />
            <rect x={BX + BW - wMin} y={BY} width={wMin * kRojo} height={BH} fill={pal.rojo} />
            <rect x={BX} y={BY} width={BW} height={BH} fill="none" stroke={papel} strokeWidth={2} />
            <text x={BX} y={BY + BH + 46} fontFamily={fuente.mono} fontSize={22} letterSpacing="0.16em" fill={alfa(papel, 0.7)}>{props.pbi.rotulo}</text>
            <text x={BX + BW - wMax / 2} y={BY - 26} textAnchor="middle" fontFamily={fuente.afiche} fontSize={64} fill={pal.rojo} opacity={kRojo}>
              {`${props.pbi.min}–${props.pbi.max} %`}
            </text>
            {/* las tajadas que caen, una por año, y la pila de lo que se perdió */}
            {pila.slice(0, caidas).map((p, i) => {
              const tc = tRojo + 0.5 + i * PASO;
              const k = tramo(t, tc, 0.55, 'tenso');
              const yDestino = PILA_Y - i * 7;
              const x = mix(BX + BW - wMax, p.x, k), y = mix(BY, yDestino, k);
              const e = escala(impacto(t, tc + 0.55, 0.035));
              return (
                <g key={i} transform={`translate(${x} ${y}) rotate(${mix(0, p.giro, k)})`}>
                  <g style={{ transform: e, transformOrigin: '0px 7px' }}>
                    <rect x={0} y={0} width={wMax} height={mix(BH, 7, k)} fill={pal.rojo} opacity={0.92} />
                  </g>
                </g>
              );
            })}
          </svg>
        </AbsoluteFill>
      ) : null}

      {/* 2 · de cada diez soles */}
      {t >= tSoles - 0.6 && t < tSueltos ? (
        <AbsoluteFill style={{ opacity: ventana(tSoles, tSueltos - 0.3) }}>
          {Array.from({ length: total }, (_, i) => {
            const kEntra = tramo(t, tSoles + i * 0.12, 0.45, 'pesado');
            const segura = i >= total - mMin;
            const duda = !segura && i >= total - mMax;
            const tc = tCaen + (total - 1 - i) * 0.09;
            const kCae = segura ? tramo(t, tc, 0.7, 'tenso') : 0;
            const kDuda = duda ? tramo(t, tCuatro, 0.9, 'pesado') : 0;
            const x = x0M + i * (MD + MG);
            const y = 470 - (1 - kEntra) * 40 + kCae * 700 + kDuda * 90 + (duda ? 4 * asienta(t, tCuatro + 0.9, 1, 9, 4) : 0);
            const giro = kCae * (40 + i * 13) + kDuda * 18;
            return (
              <div key={i} style={{ position: 'absolute', left: x, top: y, opacity: kEntra * (segura ? 1 - 0.3 * kCae : duda ? 1 - 0.55 * kDuda : 1),
                transform: `rotate(${giro}deg)` }}>
                <Moneda papel={papel} tinta={pal.fondo} d={MD} />
                {duda && kDuda > 0 ? (
                  <div style={{ position: 'absolute', left: 0, top: -90 - 4, opacity: kDuda }}>
                    <Moneda papel={papel} tinta={pal.fondo} d={MD} punteada />
                  </div>
                ) : null}
              </div>
            );
          })}
          <div style={{ position: 'absolute', left: x0M, top: 650, fontFamily: fuente.mono, fontSize: 22, letterSpacing: '0.16em', color: alfa(papel, 0.7),
            opacity: tramo(t, tSoles + 0.6, 0.6, 'natural') }}>{props.monedas.rotulo}</div>
          <div style={{ position: 'absolute', right: x0M, top: 330, fontFamily: fuente.afiche, fontSize: 64, color: pal.rojo,
            opacity: tramo(t, tCaen + 0.2, 0.5, 'natural') }}>{props.monedas.cifra}</div>
        </AbsoluteFill>
      ) : null}

      {/* 3 · no son casos sueltos: la regla de siglos */}
      {t >= tSueltos - 0.6 && t < tCalculo ? (
        <AbsoluteFill style={{ opacity: ventana(tSueltos, tCalculo - 0.2) }}>
          <svg width={1920} height={1080} style={{ position: 'absolute', inset: 0 }}>
            <line x1={RX0} x2={RX1} y1={RY} y2={RY} stroke={alfa(papel, 0.6)} strokeWidth={2} />
            {decadas.map((d) => (
              <line key={d} x1={rx(d)} x2={rx(d)} y1={RY - (d % 100 === 0 ? 22 : 10)} y2={RY + (d % 100 === 0 ? 22 : 10)} stroke={alfa(papel, d % 100 === 0 ? 0.8 : 0.4)} strokeWidth={d % 100 === 0 ? 2 : 1.2} />
            ))}
            {decadas.filter((d) => d % 100 === 0).map((d) => (
              <text key={d} x={rx(d)} y={RY + 62} textAnchor="middle" fontFamily={fuente.mono} fontSize={24} fill={alfa(papel, 0.7)}>{d}</text>
            ))}
            {/* la franja: primero lo medido (desde el corte hasta el final), después hacia atrás, hasta la colonia */}
            <rect x={rx(props.regla.corte)} y={RY - 9} width={(rx(props.regla.hasta) - rx(props.regla.corte)) * kSistema} height={18} fill={pal.rojo} />
            <rect x={rx(props.regla.corte) - (rx(props.regla.corte) - rx(props.regla.desde)) * kColonia} y={RY - 9}
              width={(rx(props.regla.corte) - rx(props.regla.desde)) * kColonia} height={18} fill={pal.rojo} opacity={0.85} />
            {/* los casos sueltos: puntos que parpadean y la franja se traga */}
            {sueltos.map((d, i) => {
              const k = tramo(t, tSueltos + i * 0.18, 0.3, 'ligero');
              const parpadeo = 0.6 + 0.4 * Math.sin((t - tSueltos) * 9 + i * 1.7);
              return <circle key={d} cx={rx(d)} cy={RY} r={13 * k} fill={pal.rojo} opacity={k * parpadeo * (1 - kSistema * 0.8)} />;
            })}
            <text x={(rx(props.regla.desde) + rx(props.regla.corte)) / 2} y={RY - 46} textAnchor="middle" fontFamily={fuente.mono} fontSize={22} letterSpacing="0.3em"
              fill={papel} opacity={kColonia}>{props.regla.antes}</text>
            <text x={(rx(props.regla.corte) + rx(props.regla.hasta)) / 2} y={RY - 46} textAnchor="middle" fontFamily={fuente.mono} fontSize={22} letterSpacing="0.3em"
              fill={papel} opacity={kSistema}>{props.regla.despues}</text>
          </svg>
          {/* la frase del autor, textual */}
          <div style={{ position: 'absolute', left: 0, right: 0, top: 720, textAlign: 'center', opacity: tramo(t, tSistema + 0.4, 0.8, 'natural') }}>
            <div style={{ fontFamily: fuente.libro, fontStyle: 'italic', fontSize: 50, color: papel }}>{props.cita.texto}</div>
            <div style={{ fontFamily: fuente.mono, fontSize: 20, letterSpacing: '0.2em', color: alfa(papel, 0.6), marginTop: 18 }}>{props.cita.pie}</div>
          </div>
        </AbsoluteFill>
      ) : null}

      {/* 4 · lo calculó: la ficha con sus cifras */}
      {t >= tCalculo - 0.5 && t < tLibro + 1.2 ? (
        <AbsoluteFill style={{ opacity: tramo(t, tCalculo - 0.4, 0.5, 'natural') }}>
          <div style={{ position: 'absolute', left: 560, top: 300 + 260 * tramo(t, tLibro, 1.1, 'pesado'), width: 800, padding: '44px 56px',
            background: mezclar(papel, '#ffffff', 0.15), boxShadow: `0 18px 40px ${alfa('#000000', 0.45)}`,
            transform: `rotate(${-1.5 + 4 * tramo(t, tLibro, 1.1, 'pesado')}deg) scale(${1 - 0.35 * tramo(t, tLibro, 1.1, 'pesado')})`,
            opacity: 1 - tramo(t, tLibro + 0.5, 0.6, 'natural') }}>
            {props.ficha.map((linea, i) => (
              <div key={i} style={{ height: 52 }}>
                <Ficha texto={linea} t={t - tCalculo - i * 1.0} color={pal.fondo} acento={pal.rojo} size={30} cps={26} />
              </div>
            ))}
          </div>
        </AbsoluteFill>
      ) : null}

      {/* 5 · el libro que no llegó a ver */}
      {t >= tLibro - 0.2 ? (
        <AbsoluteFill style={{ alignItems: 'center', justifyContent: 'center', opacity: tramo(t, tLibro - 0.1, 0.7, 'natural') }}>
          <div style={{ transform: `translateY(${18 * (1 - tramo(t, tLibro, 1.2, 'pesado'))}px)`, filter: `brightness(${mix(1, 0.62, 1 - luzFinal)})`,
            boxShadow: `0 30px 70px ${alfa('#000000', 0.6)}` }}>
            <PortadaLibro paleta={pal} titulo={props.libro.titulo} autor={props.libro.autor} anio={props.libro.anio} estampado={tramo(t, tLibro + 0.5, 1.8, 'natural')} width={460} />
          </div>
        </AbsoluteFill>
      ) : null}

      {/* sonido: una tajada por año (tic), las monedas, la máquina de la ficha */}
      {Array.from({ length: caidas }, (_, i) => <Sfx key={`c${i}`} nombre="tic" en={tRojo + 0.5 + i * PASO + 0.55} fps={fps} volumen={0.18} />)}
      <Sfx nombre="monedas" en={tCaen + 0.35} fps={fps} volumen={0.55} />
      <Sfx nombre="metal" en={tCuatro + 0.85} fps={fps} volumen={0.25} />
      <Sfx nombre="lapiz" en={tSistema} fps={fps} volumen={0.25} />
      <Sfx nombre="soplo" en={tColonia} fps={fps} volumen={0.22} />
      {props.ficha.map((_, i) => <Sfx key={`f${i}`} nombre={`tecla-${(i % 3) + 1}`} en={tCalculo + i * 1.0} fps={fps} volumen={0.35} />)}
      <Sfx nombre="carpeta" en={tLibro + 0.1} fps={fps} volumen={0.4} />
    </AbsoluteFill>
  );
};

/** Dónde cae cada tajada en la pila (con semilla: siempre igual). */
const tajadas = (n: number) => {
  const r = azar(1820);
  return Array.from({ length: Math.max(n, 40) }, () => ({ x: 1320 + r.rango(-60, 60), giro: r.rango(-6, 6) })).map((p) => ({ ...p, x: clamp(p.x, 1200, 1500) }));
};
