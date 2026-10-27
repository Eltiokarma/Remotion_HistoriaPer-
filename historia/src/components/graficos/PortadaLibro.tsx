import type { Paleta } from '../../esquema';
import { alfa, mezclar } from '../../estilo/color';
import { fuente } from '../../estilo/fuentes';
import { textura } from '../../estilo/recursos';
import { Ornamento } from '../texto/Ornamento';

type Props = {
  paleta: Paleta;
  titulo: string;
  autor?: string;
  anio?: string;
  /** Color de la tela de la tapa. */
  tela?: string;
  /** 0–1: las letras doradas aparecen (como si se estamparan). */
  estampado?: number;
  width?: number;
};

/**
 * Portada tipográfica propia (no copia carátulas reales): tela con textura, doble filete
 * dorado, autor en versalitas, título en cursiva de libro y el año abajo.
 */
export const PortadaLibro: React.FC<Props> = ({ paleta, titulo, autor, anio, tela, estampado = 1, width = 520 }) => {
  const k = width / 520;
  const oro = mezclar(paleta.ocre, '#ffffff', 0.12);
  const fondo = tela ?? mezclar(paleta.rojo, paleta.fondo, 0.42);
  const paso = (i: number) => Math.max(0, Math.min(1, (estampado - i * 0.2) / 0.5));
  return (
    <div style={{ position: 'relative', width, height: 760 * k, background: fondo, backgroundImage: `url(${textura.papel})`, backgroundSize: '260px 260px',
      backgroundBlendMode: 'multiply', borderRadius: 4 * k, boxShadow: `inset 0 0 ${60 * k}px ${alfa('#000000', 0.5)}, ${16 * k}px ${22 * k}px ${40 * k}px ${alfa('#000000', 0.55)}` }}>
      {/* lomo: una franja más oscura a la izquierda */}
      <div style={{ position: 'absolute', left: 0, top: 0, bottom: 0, width: 26 * k, background: alfa('#000000', 0.28), borderRight: `1px solid ${alfa('#000000', 0.35)}` }} />
      <div style={{ position: 'absolute', inset: 36 * k, left: 54 * k, border: `${2 * k}px solid ${alfa(oro, 0.8 * paso(0))}` }} />
      <div style={{ position: 'absolute', inset: 46 * k, left: 64 * k, border: `${1 * k}px solid ${alfa(oro, 0.6 * paso(0))}` }} />
      <div style={{ position: 'absolute', left: 64 * k, right: 46 * k, top: 120 * k, bottom: 120 * k, display: 'flex', flexDirection: 'column', alignItems: 'center',
        justifyContent: 'space-between', textAlign: 'center', color: oro }}>
        {autor ? <div style={{ fontFamily: fuente.libro, fontSize: 26 * k, letterSpacing: '0.32em', marginRight: '-0.32em', fontVariant: 'small-caps', opacity: paso(0) }}>{autor.toLowerCase()}</div> : <div />}
        <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 26 * k }}>
          <Ornamento color={oro} ancho={200 * k} k={paso(1)} opacidad={0.9} />
          <div style={{ fontFamily: fuente.libro, fontStyle: 'italic', fontSize: 64 * k, lineHeight: 1.12, padding: `0 ${20 * k}px`, opacity: paso(1),
            textShadow: `0 ${1 * k}px 0 ${alfa('#000000', 0.5)}` }}>{titulo}</div>
          <Ornamento color={oro} ancho={200 * k} k={paso(1)} opacidad={0.9} />
        </div>
        {anio ? <div style={{ fontFamily: fuente.mono, fontSize: 30 * k, letterSpacing: '0.3em', marginRight: '-0.3em', opacity: paso(2) }}>{anio}</div> : <div />}
      </div>
    </div>
  );
};
