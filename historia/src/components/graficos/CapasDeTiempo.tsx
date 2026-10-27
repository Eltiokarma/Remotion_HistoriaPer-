import { useMemo } from 'react';
import { clamp } from '../../direction/anim';
import { azar } from '../../direction/azar';
import type { Paleta } from '../../esquema';
import { alfa, mezclar } from '../../estilo/color';
import { fuente } from '../../estilo/fuentes';

type Props = {
  paleta: Paleta;
  id: string;
  /** Segundos (mueve las tres capas, cada una a su velocidad). */
  t: number;
  rotulos: { rapida: string; media: string; lenta: string };
  /** Nombres que pasan nerviosos por la capa de arriba. */
  nombres: string[];
  /** 0–1: aparición de cada capa (de abajo hacia arriba no: de arriba hacia abajo, como se cuenta). */
  aparece: [number, number, number];
};

const BANDAS = { rapida: [150, 380], media: [410, 640], lenta: [670, 1010] } as const;
const X0 = 430, X1 = 1840;

/**
 * La idea de Braudel en tres capas que se mueven a velocidades distintas: arriba los
 * acontecimientos (nerviosos, cambian todo el tiempo), al medio la economía (ondas lentas),
 * abajo las estructuras (estratos que casi no se mueven).
 */
export const CapasDeTiempo: React.FC<Props> = ({ paleta, id, t, rotulos, nombres, aparece }) => {
  const g = useMemo(() => {
    const r = azar(1949);
    // estratos: capas de roca onduladas, cada una con su tono y su rayado
    const estratos = Array.from({ length: 7 }, (_, i) => ({
      y: BANDAS.lenta[0] + 40 + i * 44, amp: r.rango(6, 16), largo: r.rango(500, 900), fase: r.rango(0, 6), tono: r.rango(0.05, 0.3), raya: i % 3,
    }));
    const piedras = Array.from({ length: 70 }, () => ({ x: r.rango(X0, X1 + 400), y: r.rango(BANDAS.lenta[0] + 50, BANDAS.lenta[1] - 10), r: r.rango(1.5, 5) }));
    return { estratos, piedras };
  }, []);

  // capa rápida: un nombre nuevo cada 0.22 s, en un lugar al azar, que vive 0.7 s
  const PASO = 0.15, VIDA = 0.62;
  const ahora = Math.floor(t / PASO);
  const vivos = Array.from({ length: Math.ceil(VIDA / PASO) + 1 }, (_, k) => ahora - k).filter((n) => n >= 0).map((n) => {
    const r = azar(n * 7919 + 13);
    const edad = t - n * PASO;
    return { n, nombre: nombres[(n * 5) % nombres.length], x: r.rango(X0 + 40, X1 - 260), y: r.rango(BANDAS.rapida[0] + 50, BANDAS.rapida[1] - 30), edad, temblor: r.rango(-3, 3) };
  }).filter((v) => v.edad >= 0 && v.edad < VIDA);

  // capa media: una onda larga (ciclos económicos) que corre despacio
  const dxMedia = t * 38;
  const onda = (x: number) => {
    const u = x + dxMedia;
    return (BANDAS.media[0] + BANDAS.media[1]) / 2 + 52 * Math.sin(u / 260) + 22 * Math.sin(u / 97 + 1.3) + 8 * Math.sin(u / 31);
  };
  let dOnda = '';
  for (let x = X0; x <= X1; x += 6) dOnda += `${x === X0 ? 'M' : 'L'}${x} ${onda(x).toFixed(1)} `;
  const dxLenta = t * 2.5; // casi quieta

  const rotulo = (texto: string, y: number, k: number, velocidad: string) => (
    <g opacity={k}>
      <text x={120} y={y} fill={paleta.ocre} fontFamily={fuente.imprenta} fontSize={34} letterSpacing={4}>{texto.toUpperCase()}</text>
      <text x={120} y={y + 36} fill={alfa(paleta.ocre, 0.6)} fontFamily={fuente.mono} fontSize={18} letterSpacing={3}>{velocidad}</text>
    </g>
  );

  return (
    <svg width={1920} height={1080} style={{ position: 'absolute', inset: 0, overflow: 'visible' }}>
      <defs>
        <clipPath id={`${id}-zona`}><rect x={X0} y={0} width={X1 - X0} height={1080} /></clipPath>
        {[0, 1, 2].map((i) => (
          <pattern key={i} id={`${id}-raya${i}`} width={7 + i * 3} height={7 + i * 3} patternUnits="userSpaceOnUse" patternTransform={`rotate(${[30, -20, 75][i]})`}>
            <line x1={0} y1={0} x2={0} y2={7 + i * 3} stroke={paleta.ocre} strokeWidth={0.8} opacity={0.35} />
          </pattern>
        ))}
        <linearGradient id={`${id}-bajo`} x1="0" y1="0" x2="0" y2="1">
          <stop offset="0" stopColor={paleta.ocre} stopOpacity={0.22} />
          <stop offset="1" stopColor={paleta.ocre} stopOpacity={0} />
        </linearGradient>
      </defs>

      {/* separadores entre capas */}
      {[BANDAS.rapida, BANDAS.media, BANDAS.lenta].map(([a, b], i) => (
        <g key={i} opacity={aparece[i]}>
          <line x1={X0} x2={X1} y1={a} y2={a} stroke={alfa(paleta.ocre, 0.45)} strokeWidth={1} />
          <line x1={X0} x2={X1} y1={b} y2={b} stroke={alfa(paleta.ocre, 0.2)} strokeWidth={1} strokeDasharray="3 6" />
        </g>
      ))}
      {rotulo(rotulos.rapida, BANDAS.rapida[0] + 70, aparece[0], 'DÍAS · AÑOS')}
      {rotulo(rotulos.media, BANDAS.media[0] + 70, aparece[1], 'DÉCADAS')}
      {rotulo(rotulos.lenta, BANDAS.lenta[0] + 70, aparece[2], 'SIGLOS')}

      <g clipPath={`url(#${id}-zona)`}>
        {/* arriba: marcas de tiempo que pasan rápido y nombres que aparecen y se van */}
        <g opacity={aparece[0]}>
          {Array.from({ length: 40 }, (_, i) => {
            const x = X1 - (((t * 420 + i * 48) % (X1 - X0 + 60)));
            return <line key={i} x1={x} x2={x} y1={BANDAS.rapida[1] - 18} y2={BANDAS.rapida[1]} stroke={alfa(paleta.papel, 0.35)} strokeWidth={1} />;
          })}
          {vivos.map((v) => {
            const k = clamp(v.edad / 0.08) * clamp((VIDA - v.edad) / 0.25);
            return (
              <text key={v.n} x={v.x + v.temblor * Math.sin(t * 40 + v.n)} y={v.y} fill={paleta.papel} fontFamily={fuente.mono} fontSize={34} letterSpacing={3}
                opacity={0.85 * k}>{v.nombre}</text>
            );
          })}
        </g>
        {/* medio: la onda económica y su área */}
        <g opacity={aparece[1]}>
          <path d={`${dOnda} L${X1} ${BANDAS.media[1]} L${X0} ${BANDAS.media[1]} Z`} fill={`url(#${id}-bajo)`} />
          <path d={dOnda} fill="none" stroke={paleta.ocre} strokeWidth={2.4} />
          {Array.from({ length: 16 }, (_, i) => {
            const x = X0 + ((i * 100 - dxMedia) % 1600 + 1600) % 1600;
            return <line key={i} x1={x} x2={x} y1={BANDAS.media[1] - 10} y2={BANDAS.media[1]} stroke={alfa(paleta.ocre, 0.5)} />;
          })}
        </g>
        {/* abajo: estratos de roca que casi no se mueven */}
        <g opacity={aparece[2]} transform={`translate(${-dxLenta} 0)`}>
          {g.estratos.map((e, i) => {
            let d = '';
            for (let x = X0 - 40; x <= X1 + 440; x += 10) d += `${x === X0 - 40 ? 'M' : 'L'}${x} ${(e.y + e.amp * Math.sin(x / e.largo * 6.28 + e.fase)).toFixed(1)} `;
            const sig = g.estratos[i + 1];
            const yb = sig ? sig.y : BANDAS.lenta[1];
            return (
              <g key={i}>
                <path d={`${d} L${X1 + 440} ${yb + 20} L${X0 - 40} ${yb + 20} Z`} fill={mezclar(paleta.fondo, paleta.ocre, e.tono)} />
                <path d={`${d} L${X1 + 440} ${yb + 20} L${X0 - 40} ${yb + 20} Z`} fill={`url(#${id}-raya${e.raya})`} />
                <path d={d} fill="none" stroke={paleta.ocre} strokeWidth={1.4} opacity={0.6} />
              </g>
            );
          })}
          {g.piedras.map((p, i) => <ellipse key={i} cx={p.x} cy={p.y} rx={p.r * 1.4} ry={p.r} fill={mezclar(paleta.fondo, paleta.ocre, 0.45)} opacity={0.5} />)}
        </g>
      </g>
    </svg>
  );
};
