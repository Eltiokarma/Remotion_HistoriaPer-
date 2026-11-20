# Informe · Laboratorio 16 · Animatic de la escena 3 del 0·2

20 de noviembre de 2026. Render técnico correcto y revisión visual del agente; **sin aprobación de Gerson**.

## Qué se probó

Si el storyboard versión 2 funciona sobre la voz real de la escena 3 («El expediente de Novoa», 94,9 s), y cuánto aportan sus dos decisiones de ritmo: el momento reservado de la cifra (A frente a B) y los respiros de montaje (B frente a C). Cámara quieta en las tres. Ver el [README](README.md).

## Medido

| Versión | Cuadros | Duración (ffprobe) | Render | Archivo |
|---|---:|---:|---:|---:|
| A | 2848 | 94,96 s | 128,5 s | 12,0 MB |
| B | 2848 | 94,96 s | 123,1 s | 12,1 MB |
| C | 3073 | 102,44 s | 134,9 s | 13,0 MB |

Máquina: contenedor de la sesión en la nube (Intel Xeon 2,3 GHz, 4 hilos, 16,9 GB), concurrencia 4, escala 0,5 (960 × 540), 30 fps, H.264 `veryfast`. Registros en `resultados/render-*.json`. Sonoridad de C: −16,3 LUFS integrados. En C, `silencedetect` (−45 dB, ≥ 0,9 s) encuentra los respiros de 1 s después de cada párrafo, donde los pide el storyboard.

## Observado

- La versión B se distingue de A en los cuadros: en «Días después» la mesa queda vacía y el vale aparece solo; en A la cifra entra encima de los folios de Elías y de la respuesta y compite con ellos (hoja de cuadros en `resultados/hoja.jpg`).
- Primera pasada con cuatro defectos, corregidos antes del render: el rótulo de versión tapaba el tintero; la ficha de la abolición se salía por la derecha; «500 personas esclavizadas» iba en rojo, que el canal reserva al corrector y a la culpa; los renglones de la carpeta se montaban sobre la escritura del papel.
- Queda justo: «500 personas esclavizadas» roza el borde derecho de la hoja de la carpeta.
- En C, los respiros son silencio digital y las pausas de la toma traen el aire de la sala: el fondo se corta al entrar al respiro. En el episodio, los respiros se rellenan con el aire de la toma (como hace `scripts/narracion.py`).

## Desconocido

Si la diferencia entre A, B y C se **siente** como se busca: es la pregunta para Gerson. No se probó en la laptop ni a 1080p.

## Para qué sirve

Decidir el tratamiento de la cifra y de los respiros antes de animar las demás escenas, y dejar armado el esqueleto (línea de tiempo anclada a la voz, papeles de la galería, fichas) que se puede reusar en las escenas 0, 4 y 5, que pasan sobre la misma mesa.
