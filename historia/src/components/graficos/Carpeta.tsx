import type { Paleta } from '../../esquema';
import { alfa, mezclar } from '../../estilo/color';
import { textura } from '../../estilo/recursos';
import { PilaDePaginas } from './PilaDePaginas';
import { clamp } from '../../direction/anim';
import { CapaVC, DefsLamina, usePrefijo, type Lamina } from './vectorcraft/Lamina';

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
  /** Lámina aprobada (tanda05-carpeta-v2): carpeta de archivo vista de frente, con documentos, rótulo y cordón. */
  lamina?: Lamina | null;
  /** Con la lámina: 0–1, el cordón se ata después del cierre. */
  atado?: number;
};

/** Recuadro de la lámina: la carpeta con su aviso «documentos representativos, no facsímiles». */
const CAJA_CARPETA = { x: 140, y: 280, w: 1480, h: 730 };

/**
 * La carpeta de la lámina. Cerrar es guardar: los papeles bajan dentro de la carpeta detrás de la
 * tapa (lo que el `cierre` hacía con la tapa en 3D) y después se ata el cordón.
 */
const CarpetaLamina: React.FC<{ lamina: Lamina; cierre: number; atado: number; width: number }> = ({ lamina, cierre, atado, width }) => {
  const uid = usePrefijo();
  const baja = 270 * cierre;
  return (
    <svg viewBox={`${CAJA_CARPETA.x} ${CAJA_CARPETA.y} ${CAJA_CARPETA.w} ${CAJA_CARPETA.h}`} width={width} height={(width * CAJA_CARPETA.h) / CAJA_CARPETA.w} style={{ overflow: 'visible', display: 'block' }}>
      <DefsLamina lamina={lamina} uid={uid} />
      {/* el bolsillo: arriba no corta (los papeles asoman antes de guardarse); abajo, el fondo de la carpeta */}
      <defs><clipPath id={`${uid}-bolsillo`}><path d="M300 0 L1650 0 L1650 411 L1462 845 L424 826 L300 411 Z" /></clipPath></defs>
      <CapaVC lamina={lamina} uid={uid} nombre="Carpeta___volumen" />
      <g clipPath={`url(#${uid}-bolsillo)`}>
        <CapaVC lamina={lamina} uid={uid} nombre="Documentos" transform={`translate(0 ${baja})`} />
        <CapaVC lamina={lamina} uid={uid} nombre="Ficha_de_cuentas" transform={`translate(0 ${baja * 1.08})`} />
      </g>
      <CapaVC lamina={lamina} uid={uid} nombre="Tapa_frontal" />
      {/* rótulo y botón; el cordón se enrolla después del golpe */}
      <CapaVC lamina={lamina} uid={uid} nombre="Etiqueta_y_cierre" solo={(i) => i <= 6 || i === 9} />
      {atado > 0 ? (
        <g opacity={clamp(atado * 4)}>
          {(['7', '8'] as const).map((k) => {
            const html = lamina.layers.find((l) => l.name.startsWith('Etiqueta_y_cierre'))!.parts[Number(k)]
              .replace(/^<(path|line) /, `<$1 pathLength="1" stroke-dasharray="1" stroke-dashoffset="${(1 - clamp(atado)).toFixed(4)}" `);
            return <g key={k} dangerouslySetInnerHTML={{ __html: html }} />;
          })}
        </g>
      ) : null}
    </svg>
  );
};

/** Carpeta de archivo: el manuscrito terminado y una tapa de tela que se cierra en 3D. */
export const Carpeta: React.FC<Props> = ({ paleta, id, cierre, width = 480, variante, semilla, limpieza, tapaVisible = 1, lamina, atado = 0 }) => {
  if (lamina) return <CarpetaLamina lamina={lamina} cierre={cierre} atado={atado} width={width} />;
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
