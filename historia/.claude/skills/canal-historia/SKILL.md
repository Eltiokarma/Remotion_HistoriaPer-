---
name: canal-historia
description: Cómo trabajar en el canal de historia del altiplano (historia/) — escenas, episodios, muestras del laboratorio, renders, revisión visual y roadmap. Úsalo antes de escribir o cambiar una escena, una muestra o un render, y antes de dar algo por terminado. Reúne el orden de autoridad, las trampas ya encontradas, el procedimiento de una muestra, la verificación y cómo informar.
---

# Canal de historia del altiplano: cómo trabajar

Versión 0 (2026-11-03). Hecha con lo aprendido en el laboratorio (tanda 1). Falta lo más importante:
los criterios con los que Gerson aprueba o rechaza ([`criterios.md`](criterios.md), vacío hasta su
revisión). Cuando estén, este skill se actualiza.

## 1. Quién manda

1. Lo que pide el usuario en la conversación. Si rompe una regla del canal, se avisa cuál.
2. `historia/CLAUDE.md` (reglas del canal) y `DIRECCION_DE_VIDEO.md`; las notas de revisión del
   video (`videos/NNN-slug/revision_*.md`) para ese video.
3. Este skill.
4. Los skills oficiales de Remotion (`remotion-*`): técnica de Remotion. Sus choques conocidos con el
   canal están en `historia/CLAUDE.md` §15. Si aparece uno nuevo, se agrega a esa tabla.

No se copian reglas de `CLAUDE.md` aquí: se leen allá. Este skill dice **cómo** trabajar con ellas.

## 2. Antes de escribir código

- Leer en `historia/CLAUDE.md` las secciones que toca la tarea: §4 movimiento, §5 composición,
  §8 enseñar, §11 código. Para un dato histórico, §1.1·2: fuente o `[VERIFICAR]`, nunca inventar.
- Buscar si una pieza del catálogo ya lo resuelve (`src/components/`, `src/escenas/`, carpeta
  «catalogo» del Studio).
- Una prueba de herramienta va en `laboratorio/`, nunca dentro de un episodio.
- Decidir los beats y el peso de cada movimiento **antes** de animar: qué entra, cuándo, con qué peso
  (`solemne`, `pesado`, `natural`, `ligero`, `tenso`) y por qué.

## 3. Trampas conocidas

Cada una costó una vuelta en el laboratorio. Detalle, síntoma y arreglo en [`trampas.md`](trampas.md).

- Manim redondea los cuadros de cada animación: los beats van en cuadros.
- Remotion no espera las imágenes de fondo CSS: `<Img>` o `PrecargaTexturas`.
- `ThreeCanvas` solo redibuja al cambiar el cuadro: lo que llega tarde (texturas) no se ve.
- No mutar geometría compartida leyendo valores ya mutados (se acumula entre cuadros).
- `--scale` no achica WebGL (R3F) ni p5: la previa barata es un tramo (`--frames`) o el Studio.
- El primer render en una máquina baja Chrome Headless Shell: no medir ese tiempo como «frío».
- `world-atlas` no tiene lagos: no nombrar en pantalla lo que el mapa no muestra.

## 4. Procedimiento de una muestra o escena nueva

Pasos y comandos en [`procedimiento.md`](procedimiento.md). En corto:

1. Código con beats en cuadros, pesos del canal y azar con semilla.
2. `npm run typecheck` y `npm run reglas`.
3. Previa barata; mirar la hoja de contactos **y** cuadros a tamaño real en los tramos de movimiento.
4. Corregir y repetir. Guardar «antes» de cada defecto corregido (recorte o cuadros), en `resultados/`.
5. Final medida (`scripts/medir.py` vía `remotion.sh` o `manim.sh`), `scripts/revisar.py`.
6. Informe: qué demuestra, qué salió mal, qué costó, para qué escenas sirve.
7. Roadmap: actualizar `roadmap/roadmap.json` y correr `node roadmap/generar.mjs`.

## 5. Verificar antes de decir «listo»

- Duración y formato contados con ffprobe, no supuestos.
- El revisor automático no ve todo: solapes, textos equivocados, contenido incorrecto y cambios de
  color con el mismo brillo los ve una persona. Mirar los recortes.
- Si algo era intermitente, varios renders limpios no lo descartan: decirlo así.
- Si una afirmación anterior resultó inexacta, corregirla en el informe y en la conversación (pasó
  con el «roce» de las monedas, que era un solape de 39 px).

## 6. Cómo informar

- Etiquetar: **medido** (instrumento con registro), **observado** (lo vio el agente),
  **inferido** (deducido) y **desconocido** (no medido). No estimar lo desconocido.
- Tiempos de escenas distintas no son un ranking de herramientas.
- Nombrar la máquina donde se midió. Nada se traslada a otra máquina.
- Tokens y costo solo de registros reales de la sesión; costo API con tarifa y fórmula.
- Separar «render técnico correcto», «revisión visual del agente» y «aprobado por Gerson».

## 7. Git y roadmap

- Commits en español, revisables, uno por idea.
- Conflicto en `ROADMAP.md`: resolver `roadmap.json` conservando las dos ramas, regenerar y comprobar.
- Antes de fusionar: traer `main`, correr typecheck, reglas y validar sobre el resultado, esperar la CI.
- No fusionar ni empezar una tanda nueva sin pedido explícito.
