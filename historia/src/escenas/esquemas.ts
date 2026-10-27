/**
 * Catálogo de escenas: nombre → qué props acepta y qué beats usa.
 * Este archivo no importa React, así que también lo usan los scripts (npm run validar).
 * Para agregar una escena nueva: crea su carpeta con esquema.ts (esquema, beats y ejemplo)
 * + Escena.tsx y regístrala aquí y en ./index.ts. En `beats`, una descripción que empieza
 * con «(condición)» es un beat que solo hace falta en esa variante.
 */
import * as DiasYManuscrito from './DiasYManuscrito/esquema';
import * as Presentacion from './Presentacion/esquema';
import * as PaisajeALibro from './PaisajeALibro/esquema';
import * as SerieCapitulos from './SerieCapitulos/esquema';
import * as Cierre from './Cierre/esquema';
import * as MapaRutas from './MapaRutas/esquema';

export const CATALOGO = {
  DiasYManuscrito,
  Presentacion,
  PaisajeALibro,
  MapaRutas,
  SerieCapitulos,
  Cierre,
} as const;

export type NombreEscena = keyof typeof CATALOGO;
