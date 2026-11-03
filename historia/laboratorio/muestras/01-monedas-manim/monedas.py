"""
Muestra 01 · Diez monedas: tres se separan y aparece el 30 %.

Qué se prueba: si Manim explica una proporción con claridad (una idea por cuadro, la imagen que
suma en vez de reemplazarse) y si sus tiempos se pueden atar a beats medidos en segundos, igual que
en Remotion.

Reglas que se respetan del canal (historia/CLAUDE.md):
- paleta del canal (tinta, papel, ocre, rojo de corrector) y sus tipografías (IM Fell, Playfair,
  IBM Plex Mono), registradas desde public/compartido/fuentes;
- cada movimiento declara su peso (curvas equivalentes a src/direction/easings.ts);
- el rojo es solo para lo que importa: las tres monedas separadas y la cifra;
- al final, la imagen quieta (el «sentido» y el respiro del párrafo audiovisual, §8).

Render (desde historia/laboratorio):
  previsualización: ./scripts/manim.sh previa
  final 1920x1080 30 fps: ./scripts/manim.sh final
"""

from pathlib import Path

import manimpango
from manim import (
    DOWN, LEFT, RIGHT, UP,
    AnimationGroup, Brace, Circle, DashedVMobject, FadeIn, FadeTransform, LaggedStart, Line, ManimColor, Scene,
    Text, Transform, VGroup, Write,
)

# --- identidad del canal --------------------------------------------------------------------
RAIZ = Path(__file__).resolve().parents[3]  # historia/
FUENTES = RAIZ / "public" / "compartido" / "fuentes"
for f in ("IMFeENsc28P.ttf", "PlayfairDisplay-VF.ttf", "IBMPlexMono-Regular.ttf", "EBGaramond-VF.ttf"):
    manimpango.register_font(str(FUENTES / f))

# paleta del video 001 (videos/001-el-hombre/escenas.json)
TINTA = ManimColor("#1c1b19")
PAPEL = ManimColor("#ede4d3")
OCRE = ManimColor("#c2a878")
ROJO = ManimColor("#b3261e")
TIZA = PAPEL.interpolate(TINTA, 0.25)


def bezier(x1, y1, x2, y2):
    """Curva cúbica de CSS (como Easing.bezier de Remotion) para que los pesos coincidan."""

    def curva(t: float) -> float:
        # resolver x(s) = t por Newton y devolver y(s)
        s = t
        for _ in range(8):
            x = 3 * (1 - s) ** 2 * s * x1 + 3 * (1 - s) * s ** 2 * x2 + s ** 3 - t
            dx = 3 * (1 - s) ** 2 * x1 + 6 * (1 - s) * s * (x2 - x1) + 3 * s ** 2 * (1 - x2)
            if abs(dx) < 1e-6:
                break
            s = min(1.0, max(0.0, s - x / dx))
        return 3 * (1 - s) ** 2 * s * y1 + 3 * (1 - s) * s ** 2 * y2 + s ** 3

    return curva


PESO = {
    "solemne": bezier(0.65, 0, 0.35, 1),
    "pesado": bezier(0.7, 0, 0.2, 1),
    "natural": bezier(0.33, 0, 0.2, 1),
    "ligero": bezier(0.2, 0.6, 0.3, 1),
}

# --- beats (en cuadros de 30 fps). Terminan exactamente en 150 = 5,0 s ------------------------
# Manim redondea hacia arriba los cuadros de cada animación: con beats en segundos «redondos»
# (0,1 s = 1,5 cuadros a 15 fps) la previa se alargaba a 5,13 s. Por eso cada tramo es un número
# par de cuadros: entero tanto a 30 fps (final) como a 15 fps (previa).
CUADROS = {
    "monedas": 0,        # entran las diez, en cascada
    "rotulo": 30,        # «diez monedas»
    "separan": 48,       # tres se apartan hacia la derecha; su lugar queda punteado
    "llave": 74,         # la llave marca las tres
    "fraccion": 84,      # 3 de 10
    "porcentaje": 104,   # 3 de 10 se vuelve 30 %
    "quieto": 122,       # la imagen terminada, quieta (casi 1 s de respiro)
    "fin": 150,
}
BEATS = {k: v / 30 for k, v in CUADROS.items()}

SFX = RAIZ / "public" / "compartido" / "audio" / "sfx"


def moneda(radio: float = 0.5) -> VGroup:
    """Moneda de grabado: cuerpo ocre, doble canto y un punto central. Sin cara inventada."""
    cuerpo = Circle(radius=radio, stroke_width=0, fill_color=OCRE, fill_opacity=1)
    canto = Circle(radius=radio, stroke_color=TINTA, stroke_width=3)
    interior = Circle(radius=radio * 0.78, stroke_color=TINTA, stroke_width=1.4, stroke_opacity=0.7)
    centro = Circle(radius=radio * 0.12, stroke_width=0, fill_color=TINTA, fill_opacity=0.55)
    return VGroup(cuerpo, interior, canto, centro)


class DiezMonedas(Scene):
    def construct(self):
        self.camera.background_color = TINTA
        def hasta(beat: str, quieta: bool = False) -> float:
            """Lo que falta hasta el beat, medido contra los cuadros que Manim ya escribió.

            Manim cuenta los cuadros de una animación con np.arange(0, run_time, 1/fps) (redondea
            hacia arriba y el error de coma flotante a veces suma uno) y los de una espera quieta
            con int(duración·fps) (redondea hacia abajo). Por eso: el reloj real del renderer, y
            una diezmilésima de menos para animar o de más para esperar. Así termina en 150.
            """
            falta = BEATS[beat] - self.renderer.time
            return falta + 1e-4 if quieta else falta - 1e-4

        # dos filas de cinco: el ojo cuenta de a cinco sin esfuerzo
        monedas = VGroup(*[moneda() for _ in range(10)])
        monedas.arrange_in_grid(rows=2, cols=5, buff=0.28).move_to(LEFT * 3.2 + UP * 0.1)

        rotulo = Text("DIEZ MONEDAS", font="IM FELL English SC", color=TIZA, font_size=36)
        rotulo.next_to(monedas, UP, buff=0.6)

        # 1. entran las diez, en cascada, con un pequeño desfase (acción superpuesta)
        self.play(
            LaggedStart(*[FadeIn(m, shift=DOWN * 0.18, scale=0.92) for m in monedas], lag_ratio=0.12),
            run_time=hasta("rotulo"), rate_func=PESO["natural"],
        )
        self.play(FadeIn(rotulo, shift=UP * 0.08), run_time=hasta("separan"), rate_func=PESO["natural"])

        # 2. las tres últimas se apartan (en arco, de a una) y se vuelven rojo de corrector
        tres = VGroup(*monedas[7:])
        destino = tres.copy().arrange(DOWN, buff=0.24).move_to(RIGHT * 1.2 + UP * 0.1)
        # lo que se fue deja su hueco punteado: el diez sigue a la vista (lo que falta, punteado)
        huecos = VGroup(*[
            DashedVMobject(Circle(radius=0.5, stroke_color=TIZA, stroke_width=2, stroke_opacity=0.6), num_dashes=18)
            .move_to(m) for m in tres
        ])
        self.add(huecos)
        self.add_sound(str(SFX / "monedas.mp3"), gain=-8)
        movs = []
        # sale primero la de más a la derecha (va arriba): así las que vuelan no se cruzan entre sí.
        # El arco va por debajo y a la derecha (path_arc positivo): con -0.6 subían por encima de la
        # fila de arriba y tapaban hasta 0,29 unidades de dos monedas quietas
        # (scripts/geometria_monedas.py: distancia mínima 0,71 y 0,76; con 0.7, 1,10 > 1,0).
        for i, m in enumerate(reversed(tres)):
            fin = m.copy().move_to(destino[i])
            fin[2].set_stroke(ROJO, width=4)
            movs.append(Transform(m, fin, path_arc=0.7))
        self.play(LaggedStart(*movs, lag_ratio=0.18), run_time=hasta("llave"), rate_func=PESO["pesado"])

        # 3. la llave junta a las tres; aparece la fracción
        llave = Brace(tres, direction=RIGHT, color=ROJO, buff=0.18)
        fraccion = VGroup(
            Text("3", font="Playfair Display", color=PAPEL, font_size=84),
            Line(LEFT * 0.55, RIGHT * 0.55, color=PAPEL, stroke_width=4),
            Text("10", font="Playfair Display", color=PAPEL, font_size=84),
        ).arrange(DOWN, buff=0.16)
        fraccion.next_to(llave, RIGHT, buff=0.45)
        self.play(FadeIn(llave, shift=LEFT * 0.1), run_time=hasta("fraccion"), rate_func=PESO["ligero"])
        self.play(Write(fraccion), run_time=hasta("porcentaje"), rate_func=PESO["natural"])

        # 4. la fracción se vuelve porcentaje (la misma cifra dicha de otro modo: la imagen suma).
        #    Fundido cruzado y no Transform: Transform deshace los glifos en una sopa de trazos.
        porcentaje = Text("30 %", font="Playfair Display", color=ROJO, font_size=118, weight="BOLD")
        porcentaje.next_to(llave, RIGHT, buff=0.45)
        self.add_sound(str(SFX / "tic.mp3"), gain=-6)
        self.play(
            AnimationGroup(FadeTransform(fraccion, porcentaje), rotulo.animate.set_opacity(0.55)),
            run_time=hasta("quieto"), rate_func=PESO["solemne"],
        )

        # 5. quieto: la idea completa a la vista
        self.wait(hasta("fin", quieta=True))

