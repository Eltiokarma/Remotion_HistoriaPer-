type Props = { color: string; ancho: number; opacidad?: number; k?: number };

/** Filete de imprenta: dos líneas que salen de un rombo central. `k` (0–1) lo dibuja desde el centro. */
export const Ornamento: React.FC<Props> = ({ color, ancho, opacidad = 1, k = 1 }) => {
  const m = ancho / 2;
  return (
    <svg width={ancho} height={16} viewBox={`0 0 ${ancho} 16`} style={{ overflow: 'visible', opacity: opacidad, display: 'block' }}>
      <line x1={m - 14} x2={m - 14 - (m - 20) * k} y1={8} y2={8} stroke={color} strokeWidth={1.5} />
      <line x1={m + 14} x2={m + 14 + (m - 20) * k} y1={8} y2={8} stroke={color} strokeWidth={1.5} />
      <line x1={m - 18} x2={m - 18 - (m - 40) * k * 0.8} y1={12} y2={12} stroke={color} strokeWidth={0.75} opacity={0.6} />
      <line x1={m + 18} x2={m + 18 + (m - 40) * k * 0.8} y1={12} y2={12} stroke={color} strokeWidth={0.75} opacity={0.6} />
      <polygon points={`${m},1 ${m + 7},8 ${m},15 ${m - 7},8`} fill={color} opacity={k > 0 ? 1 : 0} />
    </svg>
  );
};
