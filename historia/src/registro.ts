/**
 * Videos del canal. Cada uno es una carpeta videos/NNN-nombre/ con su escenas.json.
 * `npm run nuevo-video` agrega la línea sola; también se puede agregar a mano.
 */
import v000 from '../videos/000-quiroz/escenas.json';
// ↑ nuevos videos aquí (no borres esta marca: la usa scripts/nuevo-video.ts)

export const VIDEOS: unknown[] = [
  v000,
  // ↑ y aquí
];
