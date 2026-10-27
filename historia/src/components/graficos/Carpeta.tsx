import type { Paleta } from '../../esquema';
import { alfa, mezclar } from '../../estilo/color';
import { textura } from '../../estilo/recursos';
import { PilaDePaginas } from './PilaDePaginas';

type Props = {
  paleta: Paleta;
  id: string;
  /** 0 = abierta (la tapa a la izquierda), 1 = cerrada sobre el manuscrito. */
  cierre: number;
  width?: number;
  /** Las hojas de adentro (ver PilaDePaginas). */
  variante?: 'manuscrito' | 'pruebas';
  semilla?: number;
  limpieza?: number;
  /** 0–1: aparición de la tapa (si la pila venía sola). */
  tapaVisible?: number;
};

/** Carpeta de archivo: el manuscrito terminado y una tapa de tela que se cierra en 3D. */
export const Carpeta: React.FC<Props> = ({ paleta, id, cierre, width = 480, variante, semilla, limpieza, tapaVisible = 1 }) => {
  const k = width / 420; // escala del viewBox de la pila
  const tapa = { left: 22 * k, top: 22 * k, width: 376 * k, height: 516 * k };
  const angulo = -172 + 172 * cierre;
  const tela = mezclar(paleta.ocre, paleta.fondo, 0.25);
  const sombra = Math.sin(Math.PI * cierre) * 0.5;
  return (
    <div style={{ position: 'relative', width, height: width * (560 / 420), perspective: 2200 }}>
      <PilaDePaginas paleta={paleta} id={`${id}-pila`} width={width} correcciones={1} conPluma={false} variante={variante} semilla={semilla} limpieza={limpieza} />
      {/* sombra de la tapa sobre las hojas mientras se cierra */}
      <div style={{ position: 'absolute', ...tapa, background: `linear-gradient(90deg, rgba(0,0,0,${sombra}) 0%, rgba(0,0,0,0) ${40 + 60 * cierre}%)` }} />
      <div style={{ position: 'absolute', ...tapa, transformOrigin: '0% 50%', transformStyle: 'preserve-3d', transform: `rotateY(${angulo}deg)`, opacity: tapaVisible }}>
        {/* frente: tela con un rótulo pegado */}
        <div style={{ position: 'absolute', inset: 0, backfaceVisibility: 'hidden', backgroundColor: tela, backgroundImage: `url(${textura.papel})`,
          backgroundSize: '300px 300px', backgroundBlendMode: 'multiply', boxShadow: `inset 0 0 40px ${alfa('#000000', 0.45)}, 4px 6px 14px ${alfa('#000000', 0.5)}`,
          borderRadius: 4 }}>
          <div style={{ position: 'absolute', left: '22%', right: '22%', top: '18%', height: '17%', background: paleta.papel, border: `1.5px solid ${alfa(paleta.fondo, 0.5)}`,
            boxShadow: `0 1px 2px ${alfa('#000000', 0.3)}`, display: 'flex', flexDirection: 'column', justifyContent: 'center', gap: 10, padding: '0 14%' }}>
            {[1, 0.7, 0.45].map((w, i) => <div key={i} style={{ height: 5, width: `${w * 100}%`, background: alfa(paleta.fondo, 0.55), borderRadius: 2 }} />)}
          </div>
          <div style={{ position: 'absolute', left: 14, top: 0, bottom: 0, width: 3, background: alfa('#000000', 0.25) }} />
        </div>
        {/* dorso: el interior de la tapa, más claro */}
        <div style={{ position: 'absolute', inset: 0, backfaceVisibility: 'hidden', transform: 'rotateY(180deg)', borderRadius: 4,
          backgroundColor: mezclar(tela, paleta.papel, 0.35), backgroundImage: `url(${textura.papel})`, backgroundSize: '300px 300px', backgroundBlendMode: 'multiply' }} />
      </div>
    </div>
  );
};
