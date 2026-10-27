import { useMemo } from 'react';
import { clamp } from '../../direction/anim';
import { azar } from '../../direction/azar';
import type { Paleta } from '../../esquema';
import { alfa } from '../../estilo/color';

type Props = {
  paleta: Paleta;
  id: string;
  /** Segundos (giro lento de los anillos). */
  t: number;
  /** 0–1: los anillos se cierran sobre sí mismos, de adentro hacia afuera. */
  cierre: number;
  /** 0–1: la red crece hacia afuera hasta salirse del cuadro. */
  red: number;
};

const CX = 960, CY = 540;
const ANILLOS = [120, 190, 260, 330, 400, 470];

/** Círculos concéntricos que se cierran sobre sí mismos, con nodos unidos en red que se expande. */
export const CirculosRed: React.FC<Props> = ({ paleta, id, t, cierre, red }) => {
  const g = useMemo(() => {
    const r = azar(2008);
    const nodos: { x: number; y: number; anillo: number; a: number }[] = [];
    ANILLOS.forEach((R, k) => {
      const n = 5 + k * 2;
      for (let i = 0; i < n; i++) nodos.push({ anillo: k, a: (i / n) * 2 * Math.PI + r.rango(-0.2, 0.2), x: 0, y: 0 });
    });
    // nodos lejanos: la red que se usa en todo el mundo
    for (let i = 0; i < 46; i++) nodos.push({ anillo: 6 + Math.floor(r.rango(0, 4)), a: r.rango(0, 2 * Math.PI), x: 0, y: 0 });
    const enlaces: [number, number][] = [];
    nodos.forEach((nd, i) => {
      const cand = nodos.map((m, j) => ({ j, d: Math.abs(m.anillo - nd.anillo) + Math.abs(((m.a - nd.a + 3 * Math.PI) % (2 * Math.PI)) - Math.PI) * 0.8 }))
        .filter((c) => c.j !== i).sort((a, b) => a.d - b.d).slice(0, 2);
      cand.forEach((c) => enlaces.push([i, c.j]));
    });
    return { nodos, enlaces };
  }, []);
  const radioDe = (anillo: number) => (anillo < ANILLOS.length ? ANILLOS[anillo] : 470 + (anillo - 5) * 150);
  const pos = g.nodos.map((n) => {
    const giro = t * (n.anillo % 2 ? 0.04 : -0.03);
    const R = radioDe(n.anillo);
    return { x: CX + Math.cos(n.a + giro) * R, y: CY + Math.sin(n.a + giro) * R * 0.92, n };
  });
  const visibleNodo = (anillo: number) => (anillo < ANILLOS.length ? clamp(cierre * ANILLOS.length - anillo) : clamp(red * 4 - (anillo - 6)));
  return (
    <svg width={1920} height={1080} style={{ position: 'absolute', inset: 0 }}>
      {ANILLOS.map((R, k) => {
        const kk = clamp(cierre * ANILLOS.length - k);
        if (kk <= 0) return null;
        const giro = (t * (k % 2 ? 9 : -7) + k * 40) % 360;
        return (
          <ellipse key={k} cx={CX} cy={CY} rx={R} ry={R * 0.92} fill="none" stroke={k === 0 ? paleta.rojo : alfa(paleta.ocre, 0.7 - k * 0.07)}
            strokeWidth={k === 0 ? 3 : 1.8} pathLength={1} strokeDasharray={1} strokeDashoffset={1 - kk} transform={`rotate(${giro} ${CX} ${CY})`} />
        );
      })}
      {g.enlaces.map(([a, b], i) => {
        const v = Math.min(visibleNodo(pos[a].n.anillo), visibleNodo(pos[b].n.anillo));
        if (v <= 0) return null;
        return <line key={i} x1={pos[a].x} y1={pos[a].y} x2={pos[a].x + (pos[b].x - pos[a].x) * v} y2={pos[a].y + (pos[b].y - pos[a].y) * v} stroke={alfa(paleta.papel, 0.28)} strokeWidth={1.2} />;
      })}
      {pos.map((p, i) => {
        const v = visibleNodo(p.n.anillo);
        if (v <= 0) return null;
        return <circle key={i} cx={p.x} cy={p.y} r={(p.n.anillo === 0 ? 7 : 5) * v} fill={p.n.anillo === 0 ? paleta.rojo : paleta.papel} opacity={0.9} />;
      })}
    </svg>
  );
};
