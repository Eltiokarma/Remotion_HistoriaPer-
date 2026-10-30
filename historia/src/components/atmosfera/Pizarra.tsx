import { AbsoluteFill } from 'remotion';
import { textura } from '../../estilo/recursos';

type Props = {
  /** 0–1: aparición. */
  aparece?: number;
  children?: React.ReactNode;
};

const VERDE = '#2b4337';

/**
 * La pizarra verde de un aula (DIRECCION_DE_VIDEO §2.3: la casa del formato). Verde de tiza con el
 * polvo de lo que se borró, marco de madera y la repisa de las tizas.
 */
export const Pizarra: React.FC<Props> = ({ aparece = 1, children }) => (
  <AbsoluteFill style={{ opacity: aparece, backgroundColor: '#3a2a1c' }}>
    {/* el tablero dentro del marco */}
    <div style={{ position: 'absolute', left: 34, top: 30, right: 34, bottom: 58, borderRadius: 4, overflow: 'hidden',
      background: `radial-gradient(ellipse 85% 75% at 50% 42%, #35513f 0%, ${VERDE} 60%, #1f3229 100%)`,
      boxShadow: 'inset 0 0 60px rgba(0,0,0,0.55), 0 0 0 3px #22180f' }}>
      {/* polvo de tiza de lo que se borró: manchas anchas y claras */}
      <div style={{ position: 'absolute', inset: 0, background:
        'radial-gradient(ellipse 30% 12% at 28% 30%, rgba(255,255,255,0.05), rgba(255,255,255,0) 70%),' +
        'radial-gradient(ellipse 26% 10% at 70% 62%, rgba(255,255,255,0.045), rgba(255,255,255,0) 70%),' +
        'radial-gradient(ellipse 40% 9% at 48% 84%, rgba(255,255,255,0.035), rgba(255,255,255,0) 70%)' }} />
      <div style={{ position: 'absolute', inset: 0, backgroundImage: `url(${textura.grano(3)})`, backgroundSize: '512px 512px',
        mixBlendMode: 'screen', opacity: 0.08 }} />
      {children}
    </div>
    {/* la repisa con dos tizas */}
    <div style={{ position: 'absolute', left: 20, right: 20, bottom: 22, height: 30, background: 'linear-gradient(#5a4128, #2e2014)', borderRadius: 3,
      boxShadow: '0 6px 10px rgba(0,0,0,0.5)' }} />
    <div style={{ position: 'absolute', left: 1360, bottom: 46, width: 90, height: 12, borderRadius: 6, background: '#e9e6dc', opacity: 0.9 }} />
    <div style={{ position: 'absolute', left: 1480, bottom: 46, width: 54, height: 12, borderRadius: 6, background: '#e8d9a8', opacity: 0.85 }} />
  </AbsoluteFill>
);
