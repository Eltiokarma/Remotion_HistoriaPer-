import { AbsoluteFill } from 'remotion';
import { alfa } from '../../estilo/color';

type Props = {
  color: string;
  /** Centro de la luz en % del cuadro. */
  x: number;
  y: number;
  /** Radio en % del ancho. */
  radio?: number;
  intensidad?: number;
};

/** Un charco de luz cálida (lámpara de escritorio, ventana). Da profundidad a fondos oscuros. */
export const Luz: React.FC<Props> = ({ color, x, y, radio = 55, intensidad = 0.22 }) => (
  <AbsoluteFill style={{
    background: `radial-gradient(circle at ${x}% ${y}%, ${alfa(color, intensidad)} 0%, ${alfa(color, intensidad * 0.4)} ${radio * 0.45}%, rgba(0,0,0,0) ${radio}%)`,
    mixBlendMode: 'screen',
    pointerEvents: 'none',
  }} />
);
