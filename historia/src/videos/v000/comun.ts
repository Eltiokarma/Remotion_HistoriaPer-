import { useCurrentFrame } from 'remotion';
import type { EscenaResuelta, Paleta } from '../../types';

export type EscenaProps = { escena: EscenaResuelta; paleta: Paleta; fps: number };

/** Tiempo de la escena en segundos (el frame ya es local dentro de la Sequence). */
export const useSegundos = (fps: number): number => useCurrentFrame() / fps;

/** Texto de la escena desde el JSON (sin contenido escrito a mano en los componentes). */
export const texto = (e: EscenaResuelta, clave: string): string => e.textos?.[clave] ?? '';
