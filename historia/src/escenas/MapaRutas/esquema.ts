import { z } from 'zod';
import type { Ejemplo } from '../ejemplo';

const lugar = z.object({ nombre: z.string(), lon: z.number().min(-180).max(180), lat: z.number().min(-90).max(90) });

/** Mapa con rutas desde un origen; luego todo se apaga y queda una pregunta y, opcional, una barra. */
export const esquema = z.object({
  origen: lugar,
  destinos: z.array(lugar).min(1),
  /** Encuadre en grados: [oeste, sur, este, norte]. */
  encuadre: z.tuple([z.number(), z.number(), z.number(), z.number()]).default([-125, -45, 30, 62]),
  /** Pregunta en cursiva grande (sale con la voz y vuelve sola en el silencio). */
  pregunta: z.string().optional(),
  /** Barra de proporción: hasta dónde se llena y su etiqueta. */
  barra: z.object({ valor: z.number().min(0).max(1), etiqueta: z.string().optional() }).optional(),
});

export const beats = {
  pregunta: '(con pregunta) aparece la pregunta, cuando la voz la hace',
  arcos: 'sale la primera ruta (la pregunta se va)',
  paso: 'segundos entre una ruta y la siguiente',
  apagar: 'el mapa se apaga y la pregunta vuelve sola',
  barra: '(con barra) aparece la barra y empieza a llenarse',
  barra_llena: '(con barra) la barra llega a su valor (golpe de sonido)',
};

/** Como se usó en la primera versión de 000-quiroz (6 escenas). */
export const ejemplo: Ejemplo<typeof esquema> = {
  duracion_s: 26,
  beats: { pregunta: 5.6, arcos: 8.7, paso: 0.95, apagar: 15.9, barra: 18, barra_llena: 22.6 },
  props: {
    origen: { nombre: 'Lima', lon: -77.04, lat: -12.05 },
    destinos: [
      { nombre: 'Sevilla', lon: -5.98, lat: 37.39 },
      { nombre: 'Madrid', lon: -3.7, lat: 40.42 },
      { nombre: 'París', lon: 2.35, lat: 48.86 },
      { nombre: 'Londres', lon: -0.13, lat: 51.51 },
      { nombre: 'Washington', lon: -77.04, lat: 38.9 },
    ],
    pregunta: '¿Es factible su estudio?',
    barra: { valor: 0.5, etiqueta: 'la mitad' },
  },
};
