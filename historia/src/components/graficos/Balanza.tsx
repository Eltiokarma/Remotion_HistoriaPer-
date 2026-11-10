import type { Paleta } from '../../esquema';
import { alfa, mezclar } from '../../estilo/color';
import { fuente } from '../../estilo/fuentes';
import { CapaVC, DefsLamina, usePrefijo, type Lamina } from './vectorcraft/Lamina';

type Props = {
  paleta: Paleta;
  id: string;
  /** Grados que se inclina la cruz (negativo: baja el platillo izquierdo). */
  angulo: number;
  izquierda: string;
  derecha: string;
  /** 0–1: caída de cada palabra sobre su platillo. */
  cae: [number, number];
  /** Lámina aprobada (balanza-video01): mismo pivote y mismos brazos; las palabras vienen trazadas en ella. */
  lamina?: Lamina | null;
};

const CX = 960, CY = 330, BRAZO = 430;

/** Balanza de dos platillos, de bronce, con una palabra en cada uno. */
export const Balanza: React.FC<Props> = ({ lamina, ...props }) => {
  const uid = usePrefijo();
  if (lamina) return <BalanzaLamina {...props} lamina={lamina} uid={uid} />;
  return <BalanzaDibujada {...props} />;
};

/** La lámina aprobada, pieza por pieza: la cruz gira sobre (960, 330), los platillos cuelgan
 * verticales de cada extremo y cada palabra cae con su tarjeta sobre el platillo. */
const BalanzaLamina: React.FC<Omit<Props, 'lamina'> & { lamina: Lamina; uid: string }> = ({ angulo, cae, lamina, uid }) => {
  const a = (angulo * Math.PI) / 180;
  const extremo = (lado: -1 | 1) => ({ x: CX + lado * BRAZO * Math.cos(a), y: CY + lado * BRAZO * Math.sin(a) });
  // En la lámina los extremos están en (530, 330) y (1390, 330): el platillo se traslada lo que se movió su gancho.
  const desplaza = (lado: -1 | 1) => { const e = extremo(lado); return { dx: e.x - (CX + lado * BRAZO), dy: e.y - CY }; };
  const iz = desplaza(-1), de = desplaza(1);
  const tarjeta = (lado: -1 | 1, k: number) => {
    const d = lado < 0 ? iz : de;
    // La tarjeta con su palabra cae desde arriba sobre el platillo (la misma caída de 420 px que el texto dibujado).
    return { transform: `translate(${d.dx} ${d.dy - (1 - k) * 420})`, opacity: Math.min(1, k * 3) };
  };
  return (
    <svg width={1920} height={1080} viewBox="0 0 1920 1080" style={{ position: 'absolute', inset: 0 }}>
      <DefsLamina lamina={lamina} uid={uid} />
      <CapaVC lamina={lamina} uid={uid} nombre="Base_fija" />
      <CapaVC lamina={lamina} uid={uid} nombre="Columna_fija" />
      <CapaVC lamina={lamina} uid={uid} nombre="Platillo_izquierdo" transform={`translate(${iz.dx} ${iz.dy})`} />
      <CapaVC lamina={lamina} uid={uid} nombre="Platillo_derecho" transform={`translate(${de.dx} ${de.dy})`} />
      <CapaVC lamina={lamina} uid={uid} nombre="Brazo_móvil" transform={`rotate(${angulo} ${CX} ${CY})`} />
      {/* el fiel: la aguja (pieza 0) gira con la cruz; la escala y el eje quedan quietos */}
      <CapaVC lamina={lamina} uid={uid} nombre="Fiel" pieza={(i) => (i === 0 ? { transform: `rotate(${angulo} ${CX} ${CY})` } : undefined)} />
      {cae[0] > 0 ? <CapaVC lamina={lamina} uid={uid} nombre="Rótulos_legibles" solo={(i) => i < 2} {...tarjeta(-1, cae[0])} /> : null}
      {cae[1] > 0 ? <CapaVC lamina={lamina} uid={uid} nombre="Rótulos_legibles" solo={(i) => i >= 2} {...tarjeta(1, cae[1])} /> : null}
    </svg>
  );
};

const BalanzaDibujada: React.FC<Omit<Props, 'lamina'>> = ({ paleta, id, angulo, izquierda, derecha, cae }) => {
  const bronce = mezclar(paleta.ocre, paleta.fondo, 0.15);
  const a = (angulo * Math.PI) / 180;
  const extremo = (lado: -1 | 1) => ({ x: CX + lado * BRAZO * Math.cos(a), y: CY + lado * BRAZO * Math.sin(a) });
  const plato = (lado: -1 | 1, palabra: string, k: number) => {
    const e = extremo(lado);
    const py = e.y + 250;
    return (
      <g>
        <line x1={e.x} y1={e.y} x2={e.x - 120} y2={py} stroke={bronce} strokeWidth={1.6} />
        <line x1={e.x} y1={e.y} x2={e.x + 120} y2={py} stroke={bronce} strokeWidth={1.6} />
        <line x1={e.x} y1={e.y} x2={e.x} y2={py - 6} stroke={bronce} strokeWidth={1.2} opacity={0.7} />
        <path d={`M${e.x - 150} ${py} Q ${e.x} ${py + 60}, ${e.x + 150} ${py} Z`} fill={`url(#${id}-bronce)`} stroke={mezclar(bronce, '#000000', 0.4)} strokeWidth={1.5} />
        <ellipse cx={e.x} cy={py} rx={150} ry={10} fill={mezclar(bronce, '#ffffff', 0.25)} opacity={0.6} />
        {k > 0 ? (
          <text x={e.x} y={py - 14 - (1 - k) * 420} textAnchor="middle" fill={paleta.papel} fontFamily={fuente.titulo} fontWeight={700} fontSize={46} letterSpacing={4}
            opacity={Math.min(1, k * 3)}>{palabra}</text>
        ) : null}
      </g>
    );
  };
  return (
    <svg width={1920} height={1080} style={{ position: 'absolute', inset: 0 }}>
      <defs>
        <linearGradient id={`${id}-bronce`} x1="0" y1="0" x2="0" y2="1">
          <stop offset="0" stopColor={mezclar(bronce, '#ffffff', 0.3)} />
          <stop offset="1" stopColor={mezclar(bronce, '#000000', 0.45)} />
        </linearGradient>
        <linearGradient id={`${id}-columna`} x1="0" y1="0" x2="1" y2="0">
          <stop offset="0" stopColor={mezclar(bronce, '#000000', 0.4)} />
          <stop offset="0.4" stopColor={mezclar(bronce, '#ffffff', 0.25)} />
          <stop offset="1" stopColor={mezclar(bronce, '#000000', 0.5)} />
        </linearGradient>
      </defs>
      {/* base y columna */}
      <path d={`M${CX - 170} 950 L${CX + 170} 950 L${CX + 120} 905 L${CX - 120} 905 Z`} fill={`url(#${id}-columna)`} />
      <rect x={CX - 14} y={CY} width={28} height={580} fill={`url(#${id}-columna)`} />
      <circle cx={CX} cy={CY - 46} r={14} fill={`url(#${id}-columna)`} />
      {/* fiel: la aguja que dice si está equilibrada */}
      <line x1={CX} y1={CY} x2={CX + Math.sin(-a) * -110} y2={CY - Math.cos(a) * 110} stroke={paleta.rojo} strokeWidth={4} strokeLinecap="round" />
      <path d={`M${CX - 30} ${CY - 120} A 40 40 0 0 1 ${CX + 30} ${CY - 120}`} fill="none" stroke={alfa(paleta.papel, 0.5)} strokeWidth={1.5} />
      {/* la cruz */}
      <g transform={`rotate(${angulo} ${CX} ${CY})`}>
        <rect x={CX - BRAZO} y={CY - 8} width={BRAZO * 2} height={16} rx={8} fill={`url(#${id}-bronce)`} stroke={mezclar(bronce, '#000000', 0.4)} />
        {[-1, 1].map((l) => <circle key={l} cx={CX + l * BRAZO} cy={CY} r={11} fill={`url(#${id}-columna)`} />)}
      </g>
      <circle cx={CX} cy={CY} r={22} fill={`url(#${id}-columna)`} stroke={mezclar(bronce, '#000000', 0.4)} />
      {plato(-1, izquierda, cae[0])}
      {plato(1, derecha, cae[1])}
    </svg>
  );
};
