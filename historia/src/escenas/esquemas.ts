/**
 * Catálogo de escenas: nombre → qué props acepta y qué beats usa.
 * Este archivo no importa React, así que también lo usan los scripts (npm run validar).
 * Para agregar una escena nueva: crea su carpeta con esquema.ts (esquema, beats y ejemplo)
 * + Escena.tsx y regístrala aquí y en ./index.ts. En `beats`, una descripción que empieza
 * con «(condición)» es un beat que solo hace falta en esa variante. Si la escena acepta `hasta` (el
 * último paso que se muestra), los beats que vienen después en `beats` tampoco hacen falta; y si
 * acepta `parte` y exporta `partes`, solo los de la parte elegida.
 */
import * as DiasYManuscrito from './DiasYManuscrito/esquema';
import * as Presentacion from './Presentacion/esquema';
import * as PaisajeALibro from './PaisajeALibro/esquema';
import * as SerieCapitulos from './SerieCapitulos/esquema';
import * as Cierre from './Cierre/esquema';
import * as MapaRutas from './MapaRutas/esquema';
import * as PruebasDeImprenta from './PruebasDeImprenta/esquema';
import * as TiempoLargo from './TiempoLargo/esquema';
import * as MecanismoDeuda from './MecanismoDeuda/esquema';
import * as AprenderAMedir from './AprenderAMedir/esquema';
import * as LaPregunta from './LaPregunta/esquema';
import * as Objeciones from './Objeciones/esquema';
import * as LaCuenta from './LaCuenta/esquema';
import * as CirculosCorruptos from './CirculosCorruptos/esquema';
import * as Denunciantes from './Denunciantes/esquema';
import * as Marcador from './Marcador/esquema';
import * as Gancho from './Gancho/esquema';

export const CATALOGO = {
  DiasYManuscrito,
  Presentacion,
  PaisajeALibro,
  MapaRutas,
  SerieCapitulos,
  Cierre,
  PruebasDeImprenta,
  TiempoLargo,
  MecanismoDeuda,
  AprenderAMedir,
  LaPregunta,
  Objeciones,
  LaCuenta,
  CirculosCorruptos,
  Denunciantes,
  Marcador,
  Gancho,
} as const;

export type NombreEscena = keyof typeof CATALOGO;
