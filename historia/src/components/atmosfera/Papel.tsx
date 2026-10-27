import { alfa, mezclar } from '../../estilo/color';
import { textura } from '../../estilo/recursos';

type Props = {
  color: string;
  /** Cuánto se oscurecen los bordes, como papel viejo (0–1). */
  envejecido?: number;
  /** Escala de la textura (más chica = fibras más finas). */
  escala?: number;
  style?: React.CSSProperties;
  children?: React.ReactNode;
};

/** Superficie de papel con fibras y bordes gastados. Base de libros, cartas y documentos. */
export const Papel: React.FC<Props> = ({ color, envejecido = 0.35, escala = 1024, style, children }) => (
  <div style={{
    position: 'absolute', inset: 0,
    backgroundColor: color,
    backgroundImage: `url(${textura.papel})`,
    backgroundSize: `${escala}px ${escala}px`,
    backgroundBlendMode: 'multiply',
    boxShadow: envejecido > 0 ? `inset 0 0 ${160 * envejecido + 40}px ${alfa(mezclar(color, '#000000', 0.7), 0.6 * envejecido)}` : undefined,
    overflow: 'hidden',
    ...style,
  }}>
    {children}
  </div>
);

/** Patrón de papel para usar dentro de un <svg> (fill="url(#id)"). */
export const PatronPapel: React.FC<{ id: string; escala?: number }> = ({ id, escala = 1024 }) => (
  <pattern id={id} patternUnits="userSpaceOnUse" width={escala} height={escala}>
    <image href={textura.papel} width={escala} height={escala} preserveAspectRatio="none" />
  </pattern>
);
