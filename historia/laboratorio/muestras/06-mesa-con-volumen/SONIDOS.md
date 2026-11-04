# Sonidos de la muestra 06: lo que hay que conseguir

Veredicto de Gerson (2026-11-04): «los efectos de sonido son malazos». Hoy suenan los sintetizados
de `public/compartido/audio/sfx/` (los hace `scripts/generar_audio.py`). Decidió reemplazarlos por
sonidos **CC0 de Freesound** (dominio público: se pueden usar en un video monetizado sin atribución;
igual se registra el origen).

## Estado

**Bloqueado:** Freesound rechaza las conexiones automáticas desde el contenedor de la sesión (403 en
la web, la API y el CDN; 2026-11-04). No se intentó saltar el bloqueo. Dos caminos:

1. **Una clave de la API de Freesound** (gratis, con cuenta: freesound.org/apiv2/apply). Se guarda en
   la configuración del entorno de la nube como variable `FREESOUND_API_KEY` (nunca en el chat ni en
   git). Con ella, una sesión nueva busca solo CC0, baja las vistas previas y registra todo.
2. **Bajarlos a mano** desde freesound.org (filtro de licencia «Creative Commons 0») y subirlos a
   `public/compartido/audio/sfx/cc0/` con el enlace de cada uno.

## Prueba con la clave (2026-11-04, 12:1x UTC)

Gerson puso `FREESOUND_API_KEY` en el entorno. Una búsqueda autenticada
(`GET /apiv2/search/text/` con `Authorization: Token …`) también devolvió **403, sin cuerpo**: el
bloqueo no es por falta de clave, sino a las conexiones desde este entorno de nube (probablemente por
la IP). Queda el camino 2 (bajarlos a mano). Si en otra sesión se quiere reintentar, es una sola
llamada; si vuelve 403, no insistir.

## La lista

| # | Sonido | Momento (s) | Para qué | Buscar en Freesound |
|---|---|---|---|---|
| 1 | Cadenita de la lámpara: un tirón y el clic | 0,15 | La lámpara se enciende (se ve la cadenita) | `pull chain lamp`, `lamp chain switch` |
| 2 | Tono de cuarto: silencio de una habitación, de noche | 0–10 | El cuarto (hoy, `ambiente/cuarto`) | `room tone`, `quiet room night` |
| 3 | Una hoja que cae y se desliza sobre madera | 4,3 | La hoja apoya y se desliza por roce | `paper slide wood`, `paper sheet drop table` |
| 4 | Un libro de tapa dura que cae plano sobre una mesa de madera | 6,15 | El golpe | `book drop table`, `hardcover book thud` |
| 5 | Pluma estilográfica que raspa el papel, un trazo corto | 7,15–7,75 | El subrayado | `fountain pen writing`, `nib scratch paper` |
| 6 | (opcional) La pluma que se apoya en el papel, un toque | 7,1 | La punta toca | `pen tap paper` |

Que sean secos (sin eco de baño ni de cocina), de cerca y sin música ni voces. Si hay varias tomas,
mejor: se elige en el montaje.

## Qué se hace con ellos

- Se guardan en `public/compartido/audio/sfx/cc0/`, con `LICENCIAS.md` al lado: nombre, autor, enlace,
  licencia y fecha. Son cortos (decenas de kB): no son «archivos pesados» (regla 1.1·5).
- Se recortan, con fundido de entrada y salida (mínimo 6 cuadros, §6) y se nivelan con ffmpeg.
- La muestra los usa en los mismos momentos; los sintetizados quedan para los episodios hasta que se
  decida reemplazarlos también.
