import { useMemo } from 'react';
import { clamp } from '../../direction/anim';
import { azar } from '../../direction/azar';
import type { Paleta } from '../../esquema';
import { alfa, mezclar } from '../../estilo/color';
import { fuente } from '../../estilo/fuentes';

type Props = {
  paleta: Paleta;
  id: string;
  /** Rótulo de la barra (qué son las 100 unidades). */
  rotulo: string;
  /** Rango que se tiñe: [mínimo, máximo] de 100. Del mínimo al máximo va rayado (es un rango). */
  rango: [number, number];
  /** 0–1: aparición de las celdas. */
  aparece: number;
  /** 0–1: se tiñen las celdas del mínimo; 1–2: se rayan las del rango. */
  tinte: number;
  /** Segundos desde que las celdas teñidas se desprenden (negativo = todavía no). */
  cae: number;
  y?: number;
};

const COLS = 50, FILAS = 2, CW = 28, CH = 58, GAP = 4;

/**
 * Cien unidades de presupuesto en dos filas. Las que se lleva la corrupción se tiñen de rojo
 * (sólido hasta el mínimo, rayado hasta el máximo del rango) y se desprenden con gravedad.
 */
export const BarraUnidades: React.FC<Props> = ({ paleta, id, rotulo, rango, aparece, tinte, cae, y = 300 }) => {
  const x0 = (1920 - (COLS * (CW + GAP) - GAP)) / 2;
  const caidas = useMemo(() => {
    const r = azar(1820);
    return Array.from({ length: 100 }, () => ({ vx: r.rango(-60, 60), giro: r.rango(-200, 200), demora: r.rango(0, 0.6) }));
  }, []);
  return (
    <svg width={1920} height={1080} style={{ position: 'absolute', inset: 0, overflow: 'visible' }}>
      <defs>
        <pattern id={`${id}-raya`} width={8} height={8} patternUnits="userSpaceOnUse" patternTransform="rotate(45)">
          <rect width={8} height={8} fill={mezclar(paleta.rojo, paleta.fondo, 0.55)} />
          <line x1={0} y1={0} x2={0} y2={8} stroke={paleta.rojo} strokeWidth={4} />
        </pattern>
      </defs>
      <text x={x0} y={y - 26} fill={alfa(paleta.papel, 0.8)} fontFamily={fuente.mono} fontSize={26} letterSpacing={5} opacity={aparece}>{rotulo}</text>
      {Array.from({ length: 100 }, (_, i) => {
        const col = i % COLS, fila = Math.floor(i / COLS);
        // el orden de llenado va por columnas (como se lee una barra), no por filas
        const n = col * FILAS + fila;
        const x = x0 + col * (CW + GAP), yy = y + fila * (CH + GAP);
        const visible = clamp(aparece * 100 - n * 0.6);
        if (visible <= 0) return null;
        const solido = n < rango[0] && tinte >= n / rango[0];
        const rayado = n >= rango[0] && n < rango[1] && tinte - 1 >= (n - rango[0]) / Math.max(1, rango[1] - rango[0]);
        const rojo = solido || rayado;
        const c = caidas[n];
        const dt = rojo ? Math.max(0, cae - c.demora) : 0;
        // antes de soltarse, cada unidad se levanta apenas (anticipación: se despega); después cae en
        // parábola. Son datos: se mueven, no se deforman
        const antes = rojo ? cae - c.demora : -1;
        const despega = antes > -0.14 && antes <= 0 ? -5 * Math.sin(((antes + 0.14) / 0.14) * Math.PI * 0.5) : 0;
        const dy = 0.5 * 2400 * dt * dt + despega, dx = c.vx * dt, rot = c.giro * dt;
        return (
          <g key={i} opacity={visible * (dy > 900 ? 0 : 1)}>
            {rojo && dt > 0 ? <rect x={x} y={yy} width={CW} height={CH} rx={3} fill="none" stroke={alfa(paleta.rojo, 0.5)} strokeDasharray="3 3" /> : null}
            <g transform={`translate(${x + CW / 2 + dx} ${yy + CH / 2 + dy}) rotate(${rot})`}>
              <rect x={-CW / 2} y={-CH / 2} width={CW} height={CH} rx={3}
                fill={solido ? paleta.rojo : rayado ? `url(#${id}-raya)` : mezclar(paleta.fondo, paleta.papel, 0.72)} />
            </g>
          </g>
        );
      })}
      {tinte > 0 ? (
        <g opacity={clamp(tinte)}>
          <line x1={x0} x2={x0 + (rango[1] / FILAS) * (CW + GAP) - GAP} y1={y + 2 * CH + GAP + 22} y2={y + 2 * CH + GAP + 22} stroke={paleta.rojo} strokeWidth={2} />
          <text x={x0 + (rango[1] / FILAS / 2) * (CW + GAP)} y={y + 2 * CH + GAP + 66} textAnchor="middle" fill={paleta.rojo} fontFamily={fuente.mono} fontWeight={600} fontSize={40} letterSpacing={3}>
            {`${rango[0]}–${rango[1]}`}
          </text>
        </g>
      ) : null}
    </svg>
  );
};
