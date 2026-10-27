import type { Paleta } from '../../esquema';
import { mezclar } from '../../estilo/color';
import { fuente } from '../../estilo/fuentes';

type Props = { x: number; y: number; radio: number; paleta: Paleta; opacidad?: number };

/** Rosa de los vientos de carta antigua (va dentro de un <svg>). */
export const RosaDeLosVientos: React.FC<Props> = ({ x, y, radio: r, paleta, opacidad = 0.85 }) => {
  const claro = paleta.ocre, oscuro = mezclar(paleta.fondo, paleta.ocre, 0.25);
  const punta = (ang: number, largo: number, ancho: number) => {
    const a = (ang * Math.PI) / 180;
    const px = Math.sin(a) * largo, py = -Math.cos(a) * largo;
    const lx = Math.sin(a - Math.PI / 2) * ancho, ly = -Math.cos(a - Math.PI / 2) * ancho;
    // cada punta en dos mitades, una clara y una oscura: así se ve "en relieve"
    return (
      <g key={ang}>
        <path d={`M0 0 L${lx} ${ly} L${px} ${py} Z`} fill={claro} />
        <path d={`M0 0 L${-lx} ${-ly} L${px} ${py} Z`} fill={oscuro} stroke={claro} strokeWidth={0.6} />
      </g>
    );
  };
  return (
    <g transform={`translate(${x} ${y})`} opacity={opacidad}>
      <circle r={r} fill="none" stroke={claro} strokeWidth={1.4} />
      <circle r={r * 0.92} fill="none" stroke={claro} strokeWidth={0.6} />
      {Array.from({ length: 72 }, (_, i) => {
        const a = (i * 5 * Math.PI) / 180, l = i % 2 ? 0.04 : 0.08;
        return <line key={i} x1={Math.sin(a) * r * 0.92} y1={-Math.cos(a) * r * 0.92} x2={Math.sin(a) * r * (0.92 - l)} y2={-Math.cos(a) * r * (0.92 - l)} stroke={claro} strokeWidth={0.7} />;
      })}
      {[45, 135, 225, 315].map((a) => punta(a, r * 0.55, r * 0.09))}
      {[0, 90, 180, 270].map((a) => punta(a, r * 0.86, r * 0.13))}
      <circle r={r * 0.07} fill={paleta.fondo} stroke={claro} strokeWidth={1} />
      <text y={-r - 12} textAnchor="middle" fill={claro} fontFamily={fuente.imprenta} fontSize={r * 0.36}>N</text>
    </g>
  );
};
