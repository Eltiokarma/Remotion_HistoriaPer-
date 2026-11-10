# 12 · El título, editable en el Studio: la línea de tiempo que faltaba

**Herramienta:** Remotion Studio 4.0.539, con edición visual (`Interactive`, desde 4.0.475).
**Código:** [`Muestra.tsx`](Muestra.tsx).
**Pregunta:** después de la 11 faltaba lo que After Effects sí tiene: ajustar tiempos y posiciones a
mano, sin tocar código. ¿Lo da Remotion?

**Respuesta: sí, y ya lo teníamos instalado.** La edición visual del Studio escribe los cambios de
vuelta en el archivo. Se probó aquí con un navegador automático (Playwright) sobre el Studio corriendo.

## Qué se comprobó

| Acción en el Studio | Qué escribió en `Muestra.tsx` | Evidencia |
|---|---|---|
| Desplegar «le sacó la cuenta» en la línea de tiempo | — (muestra sus claves de posición y opacidad en los cuadros 42 y 70, las del código) | `resultados/12-titulo-editable/studio-2.jpg` |
| Arrastrar la primera clave de posición unos 9 cuadros | `translate: interpolate(frame, [51, 70], …)` (antes 42) | `edicion-1-clave.diff`, `studio-3.jpg` |
| Seleccionar el subrayado y arrastrarlo en el lienzo | `translate: '0px 31.7px'` | `edicion-2-lienzo.diff` |

Después de cada edición, `npm run reglas` y `npm run typecheck` siguieron pasando. Las dos ediciones
fueron pruebas: el archivo volvió a su versión limpia y los cambios quedan en los `.diff`.

## Cómo hay que escribir una escena para que sea editable

Lo dice el skill oficial `remotion-interactivity`:

- Cada pieza que se quiera tocar es un `Interactive.Div` (o `Interactive.Path`, etc.) con `name` escrito a mano.
- Las claves van en línea, en la propiedad que cambia: `interpolate(frame, [42, 70], [0, 1], { easing: … })`
  con números, no variables ni cálculos.
- Se usan `translate`, `scale` y `rotate`, no `transform`.

## El choque con el canal, y cómo se resolvió

- **Las curvas.** El canal manda usar los cinco pesos con nombre (`tramo(t, desde, dura, 'solemne')`),
  pero el Studio solo edita curvas escritas como `Easing.bezier(a, b, c, d)` en línea.
  **Arreglo:** `npm run reglas` ahora acepta un `Easing.bezier` en línea solo si sus números son
  exactamente un peso, leído de `src/direction/easings.ts`. Si alguien cambia la curva en el Studio a
  otra cosa, la regla lo marca, y se elige el peso más cercano o se declara la excepción. Pruebas
  agregadas a `npm run reglas -- --probar` (22 casos).
- **El Studio reescribe el formato.** Parte la llamada en varias líneas y pasa la curva a una lista por
  tramo (`easing: [Easing.bezier(…)]`). Sigue siendo el mismo peso, y la regla lo acepta.
- **El contenido en línea.** El canal manda que el texto de un video venga de `escenas.json`, y el
  Studio solo edita lo que está escrito en el JSX. En el laboratorio no importa. Para un episodio hay
  dos caminos: hacer editables solo los **tiempos y posiciones** (los datos siguen en `escenas.json`),
  o editar en el Studio y pasar el resultado a `escenas.json`. **Lo decide Gerson** (anotado en
  `historia/CLAUDE.md` §15).

## Qué costó

Render final en el contenedor: 32,8 s en frío y 11,7 s en caliente. El Studio arranca en unos 8 s.
**Agente:** 2026-11-07; tiempo de sesión no registrado. **Humano:** desconocido.

## Frente a las alternativas investigadas

| Opción | Estado (2026-11) | Para nosotros |
|---|---|---|
| **Remotion Studio, edición visual** | Ya instalado (4.0.539); probado aquí | **Lo que falta:** línea de tiempo y lienzo que escriben en el mismo código |
| Theatre.js | Repositorio público sin cambios desde 2024; el desarrollo pasó a uno privado | Habría que integrarlo a mano con Remotion; no hace falta |
| Glaxnimate (KDE) | 0.6.0 en marzo de 2026 | Editor de animación vectorial aparte; exporta Lottie o SVG, no se integra con el código |
| Friction | Sin datos recientes en la búsqueda | — |

## Cómo lo usa Gerson

En su laptop, desde `historia/`:

```bash
npx remotion studio laboratorio/remotion/index.ts
```

Elige `lab-12-titulo-editable`, despliega una fila de la línea de tiempo, arrastra las claves o mueve
las piezas en el lienzo. El archivo cambia solo y Ctrl+Z deshace.
