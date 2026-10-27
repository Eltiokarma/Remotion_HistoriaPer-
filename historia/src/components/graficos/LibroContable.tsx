import { getLength, getPointAtLength } from '@remotion/paths';
import { useMemo } from 'react';
import { clamp } from '../../direction/anim';
import { azar } from '../../direction/azar';
import type { Paleta } from '../../esquema';
import { alfa, mezclar } from '../../estilo/color';
import { fuente } from '../../estilo/fuentes';
import { Papel } from '../atmosfera/Papel';
import { Odometro } from '../texto/Odometro';
import { Pluma } from './Pluma';
import { FiltroDesgaste, FiltroTinta, trazoManuscrito } from './svg';

type Props = {
  paleta: Paleta;
  id: string;
  fps: number;
  rotulo: string;
  columnas: [string, string];
  concepto: string;
  /** Valor actual de la cifra y cuánto cambia por segundo (para el desenfoque). */
  cifra: number;
  velocidad: number;
  digitos?: number;
  unidad?: string;
  /** La cifra ya se infló: pasa a rojo. */
  alerta?: number;
  /** Casillero del que sale la flecha. */
  casillero: string;
  /** 0–1: avance de la flecha que sale del casillero hacia afuera. */
  flecha: number;
  /** 0–1: aparición del contenido (rótulo, renglones). */
  aparece?: number;
};

const RENGLON = 64, Y_RENGLON0 = 250, X_MARGEN = 250, X_COLUMNA = 1240, X_DERECHA = 1720;
const FILA_PRINCIPAL = 3, FILA_CASILLERO = 5;
const FLECHA = 'M540 556 C 820 552, 1010 640, 1240 700 S 1700 770, 2010 760';
const base = (fila: number) => Y_RENGLON0 + fila * RENGLON;

/**
 * Libro de cuentas del siglo XIX: papel envejecido, margen rojo doble, columnas, asientos
 * escritos a mano (ilegibles a propósito: no se inventa contenido), la cifra principal en un
 * contador que gira y una flecha roja trazada con pluma.
 */
export const LibroContable: React.FC<Props> = ({
  paleta, id, fps, rotulo, columnas, concepto, cifra, velocidad, digitos = 8, unidad, alerta = 0, casillero, flecha, aparece = 1,
}) => {
  const tinta = mezclar(paleta.fondo, paleta.rojo, 0.1);
  const asientos = useMemo(() => {
    const r = azar(1850);
    return Array.from({ length: 12 }, (_, fila) => fila)
      // sin asientos en la fila del encabezado, la principal y la del casillero
      .filter((f) => f !== 0 && f !== FILA_PRINCIPAL && f !== FILA_CASILLERO)
      .map((fila) => ({
        fila,
        concepto: trazoManuscrito(300 + fila, 300, base(fila) - 12, r.rango(320, 760), 16),
        // bajo la cifra principal va la unidad: ahí no hay monto
        monto: fila === FILA_PRINCIPAL + 1 ? '' : (() => { const w = r.rango(120, 230); return trazoManuscrito(900 + fila, X_DERECHA - w, base(fila) - 12, w, 15, 0.15); })(),
      }));
  }, []);
  const largo = useMemo(() => getLength(FLECHA), []);
  const punta = getPointAtLength(FLECHA, largo * clamp(flecha)) ?? { x: 0, y: 0 };
  const antes = getPointAtLength(FLECHA, Math.max(0, largo * clamp(flecha) - 12)) ?? punta;
  const angulo = (Math.atan2(punta.y - antes.y, punta.x - antes.x) * 180) / Math.PI;

  return (
    <div style={{ position: 'absolute', inset: 0 }}>
      <Papel color={mezclar(paleta.papel, paleta.ocre, 0.12)} envejecido={0.55} />
      <svg width={1920} height={1080} style={{ position: 'absolute', inset: 0 }}>
        <defs>
          <FiltroTinta id={`${id}-tinta`} fuerza={1.4} />
          <FiltroDesgaste id={`${id}-gastado`} semilla={11} desgaste={0.3} />
        </defs>
        {/* renglones, margen rojo doble y columnas */}
        {Array.from({ length: 13 }, (_, i) => (
          <line key={i} x1={0} x2={1920} y1={base(i) + 12} y2={base(i) + 12} stroke={tinta} strokeWidth={1.2} opacity={0.16 * aparece} />
        ))}
        <line x1={X_MARGEN} x2={X_MARGEN} y1={0} y2={1080} stroke={paleta.rojo} strokeWidth={2.5} opacity={0.75} />
        <line x1={X_MARGEN + 8} x2={X_MARGEN + 8} y1={0} y2={1080} stroke={paleta.rojo} strokeWidth={1.2} opacity={0.6} />
        <line x1={X_COLUMNA} x2={X_COLUMNA} y1={190} y2={1080} stroke={paleta.rojo} strokeWidth={1.4} opacity={0.5 * aparece} />
        <line x1={X_COLUMNA + 6} x2={X_COLUMNA + 6} y1={190} y2={1080} stroke={paleta.rojo} strokeWidth={0.8} opacity={0.4 * aparece} />
        <line x1={X_DERECHA + 40} x2={X_DERECHA + 40} y1={190} y2={1080} stroke={tinta} strokeWidth={1} opacity={0.3 * aparece} />
        <line x1={X_MARGEN} x2={1920} y1={176} y2={176} stroke={tinta} strokeWidth={1.8} opacity={0.7 * aparece} />
        <line x1={X_MARGEN} x2={1920} y1={183} y2={183} stroke={tinta} strokeWidth={0.8} opacity={0.6 * aparece} />
        {/* otros asientos del libro, escritos a mano */}
        <g fill="none" stroke={tinta} strokeWidth={1.6} strokeLinecap="round" opacity={0.5 * aparece} filter={`url(#${id}-tinta)`}>
          {asientos.map((a) => (
            <g key={a.fila}>
              <path d={a.concepto} />
              <path d={a.monto} />
            </g>
          ))}
        </g>
        {/* casillero del que sale la flecha */}
        <g filter={`url(#${id}-gastado)`} transform="rotate(-2 400 560)" opacity={aparece}>
          <rect x={290} y={base(FILA_CASILLERO) - 46} width={238} height={64} fill="none" stroke={tinta} strokeWidth={3} />
          <rect x={296} y={base(FILA_CASILLERO) - 40} width={226} height={52} fill="none" stroke={tinta} strokeWidth={1} />
        </g>
        {/* la flecha: tinta roja, con su punta */}
        {flecha > 0 ? (
          <g filter={`url(#${id}-tinta)`}>
            <path d={FLECHA} pathLength={1} fill="none" stroke={paleta.rojo} strokeWidth={8} strokeLinecap="round" strokeDasharray={1} strokeDashoffset={1 - clamp(flecha)} />
            <path d="M-26 -16 L4 0 L-26 16" fill="none" stroke={paleta.rojo} strokeWidth={8} strokeLinecap="round" strokeLinejoin="round"
              transform={`translate(${punta.x} ${punta.y}) rotate(${angulo})`} />
          </g>
        ) : null}
        {flecha > 0 && flecha < 1 ? <Pluma x={punta.x} y={punta.y} paleta={paleta} id={`${id}-pluma`} escala={1.25} angulo={-32} /> : null}
      </svg>

      <div style={{ position: 'absolute', left: X_MARGEN + 46, top: 112, fontFamily: fuente.imprenta, fontSize: 46, letterSpacing: '0.12em', color: tinta, opacity: aparece }}>
        {rotulo}
      </div>
      <div style={{ position: 'absolute', left: X_MARGEN + 46, top: 196, fontFamily: fuente.imprenta, fontSize: 26, letterSpacing: '0.3em', color: alfa(tinta, 0.7), opacity: aparece }}>
        {columnas[0]}
      </div>
      <div style={{ position: 'absolute', right: 1920 - X_DERECHA, top: 196, fontFamily: fuente.imprenta, fontSize: 26, letterSpacing: '0.3em', color: alfa(tinta, 0.7), opacity: aparece }}>
        {columnas[1]}
      </div>
      <div style={{ position: 'absolute', left: 300, top: base(FILA_PRINCIPAL) - 64, fontFamily: fuente.caligrafia, fontSize: 64, color: tinta, opacity: aparece }}>
        {concepto}
      </div>
      <div style={{ position: 'absolute', right: 1920 - X_DERECHA, top: base(FILA_PRINCIPAL) - 66, opacity: aparece }}>
        <Odometro valor={cifra} digitos={digitos} velocidad={velocidad} fps={fps} fontFamily={fuente.titulo} fontSize={68}
          color={alerta > 0.5 ? paleta.rojo : tinta} />
      </div>
      {unidad ? (
        <div style={{ position: 'absolute', right: 1920 - X_DERECHA, top: base(FILA_PRINCIPAL) + 18, fontFamily: fuente.imprentaItalica, fontSize: 28, color: alfa(tinta, 0.65), opacity: aparece }}>
          {unidad}
        </div>
      ) : null}
      <div style={{ position: 'absolute', left: 290, width: 238, top: base(FILA_CASILLERO) - 46, height: 64, display: 'flex', alignItems: 'center', justifyContent: 'center',
        fontFamily: fuente.imprenta, fontSize: 38, letterSpacing: '0.16em', color: tinta, transform: 'rotate(-2deg)', opacity: aparece }}>
        {casillero}
      </div>
    </div>
  );
};
