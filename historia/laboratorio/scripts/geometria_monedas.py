"""Distancia mínima entre cada moneda en vuelo y las que se quedan, para un path_arc dado.
Usa la misma disposición que monedas.py y la función de trayectoria de Manim (path_along_arc).
  MANIM_PY scripts/geometria_monedas.py -0.6 0.7"""
import sys
import numpy as np
from manim import DOWN, LEFT, RIGHT, UP, Circle, VGroup
from manim.utils.paths import path_along_arc

monedas = VGroup(*[Circle(radius=0.5) for _ in range(10)]).arrange_in_grid(rows=2, cols=5, buff=0.28).move_to(LEFT * 3.2 + UP * 0.1)
tres = VGroup(*monedas[7:])
destino = tres.copy().arrange(DOWN, buff=0.24).move_to(RIGHT * 1.2 + UP * 0.1)
quietas = [m.get_center() for m in monedas[:7]]
for arco in map(float, sys.argv[1:]):
    camino = path_along_arc(arco)
    peor = []
    for i, m in enumerate(reversed(tres)):
        a, b = m.get_center(), destino[i].get_center()
        d = min(min(np.linalg.norm(camino(np.array([a]), np.array([b]), t)[0] - q) for q in quietas) for t in np.linspace(0, 1, 400))
        peor.append(round(float(d), 3))
    print(f"path_arc={arco}: distancia mínima a una moneda quieta por moneda en vuelo = {peor} (se tocan si < 1.0)")
