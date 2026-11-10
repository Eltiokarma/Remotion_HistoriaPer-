# Reglas para prompts de Suno (v5 / v5.5), canciones instrumentales

Dictadas por Gerson el 2026-11-10. Toda pista de Suno del canal se pide así. Ejemplo aplicado:
[`historia/videos/001-el-hombre/musicalizacion.md`](../historia/videos/001-el-hombre/musicalizacion.md) §3.

## Estructura

1. Siempre dos campos separados: **STYLE** y **LYRICS**.
2. **STYLE:** máximo 1000 caracteres, prosa descriptiva conversacional (no lista plana de tags).
   Incluye: género/subgénero, modo y tonalidad, BPM, instrumentación, descriptores de
   producción/mezcla, atmósfera/ambiente y arco emocional.
3. Negative prompts al final del STYLE: `no vocals, no singing, no humming, no voice, no choir,
   no autotune` (+ exclusiones específicas que pida, ej. `no saxophone, no sax`).

## Lyrics

4. La primera línea es `[Instrumental]` como ancla global.
5. Todo va entre corchetes: acordes `[Dm9]`, secciones, instrumentos, efectos, cambios de BPM.
   **Nunca paréntesis** para describir (Suno no los respeta).
6. Cada sección lleva el sufijo «- Instrumental»: `[Verse 1 - Instrumental]`, `[Bridge - Instrumental]`.
7. Estructura completa: intro, versos, pre-coro, coro, puentes, solos, breaks, outro. BPM por
   sección y cambios de tempo explícitos (ej. `[BPM 85 → 82]`).
8. Indica qué instrumentos entran y salen en cada sección.

## Teoría musical

9. Fundamentar con teoría: modo (dórico, frigio, lidio, mixolidio…), progresiones con extensiones
   jazz (9, 11, 13, alteraciones), voicings (ej. cuartales), escalas (pentatónicas, escala
   japonesa In, etc.). Explicar brevemente por qué cada decisión.

## Copyright y filtros de Suno

10. Nunca nombres de artistas en el STYLE (describir el estilo, no citarlo).
11. Evitar marcas y términos registrados en el LYRICS (ej. «electric piano» en vez de Rhodes, nada
    de MPC), y tags de sección simples para no gatillar el *content matching*.

## Flujo

12. Iterativo: Gerson da notas cortas («más alegre», «más oscuro», «sin sax») y Claude resuelve la
    teoría y la arquitectura del prompt por su cuenta.

## Además, en el canal de historia

- La quena y la pentatónica andina se reservan para el tema del canal (gramática de la serie).
- Antes de generar: plan de pago de Suno (uso comercial); cada pista se anota en `fuentes.md` con
  plan, fecha y enlace.
