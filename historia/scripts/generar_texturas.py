"""Texturas procedurales compartidas (papel, grano de película, cáusticas de agua, madera).

Se generan con ruido filtrado por FFT, así que todas se repiten sin costuras (tileables).
Material propio: no hay licencias que rastrear.

Uso: python scripts/generar_texturas.py [madera ...]   (necesita numpy y Pillow; sin nombres, todas)
Escribe en public/compartido/texturas/.
"""
import sys
from pathlib import Path

import numpy as np
from PIL import Image

ROOT = Path(__file__).resolve().parent.parent
OUT = ROOT / "public" / "compartido" / "texturas"
rng = np.random.default_rng(1956)


def ruido(n, filtro, gen=None):
    """Ruido blanco filtrado en frecuencia: periódico por construcción (se repite sin costura)."""
    f = np.fft.fftfreq(n)
    fx, fy = np.meshgrid(f, f)
    X = np.fft.fft2((gen or rng).standard_normal((n, n))) * filtro(fx, fy)
    r = np.real(np.fft.ifft2(X))
    return (r - r.mean()) / (r.std() + 1e-9)


def banda(centro, ancho):
    return lambda fx, fy: np.exp(-((np.hypot(fx, fy) - centro) ** 2) / (2 * ancho ** 2))


def fibras(angulo, largo=0.018, grosor=0.22):
    """Ruido alargado en una dirección: las fibras del papel."""
    c, s = np.cos(angulo), np.sin(angulo)

    def f(fx, fy):
        u, v = fx * c + fy * s, -fx * s + fy * c
        return np.exp(-(u ** 2) / (2 * largo ** 2) - (v ** 2) / (2 * grosor ** 2))
    return f


def guardar(arr, nombre, calidad=90):
    OUT.mkdir(parents=True, exist_ok=True)
    img = Image.fromarray((np.clip(arr, 0, 1) * 255).astype(np.uint8), "L")
    ruta = OUT / nombre
    if nombre.endswith(".jpg"):
        img.save(ruta, quality=calidad, optimize=True)
    else:
        img.save(ruta, optimize=True)
    print("ok", ruta.relative_to(ROOT), f"{ruta.stat().st_size // 1024} KB")


def papel(n=1024):
    """Papel: fibras en varias direcciones, manchas suaves y grano fino. Gris claro (para multiply)."""
    fib = sum(ruido(n, fibras(a)) for a in rng.uniform(0, np.pi, 9)) / 3
    manchas = ruido(n, lambda fx, fy: np.exp(-(fx ** 2 + fy ** 2) / (2 * 0.006 ** 2)))
    nubes = ruido(n, lambda fx, fy: np.exp(-(fx ** 2 + fy ** 2) / (2 * 0.02 ** 2)))
    fino = ruido(n, banda(0.35, 0.12))
    v = 0.95 + 0.016 * fib + 0.014 * manchas + 0.008 * nubes + 0.012 * fino
    # puntitos sueltos (impurezas de la pasta de papel)
    for _ in range(140):
        x, y = rng.integers(0, n, 2)
        r = rng.uniform(0.6, 1.8)
        yy, xx = np.ogrid[-4:5, -4:5]
        m = np.exp(-(xx ** 2 + yy ** 2) / (2 * r ** 2)) * rng.uniform(0.03, 0.08)
        v[np.ix_((y + np.arange(-4, 5)) % n, (x + np.arange(-4, 5)) % n)] -= m
    return v


def grano(n=256):
    """Grano de película: ruido alrededor de gris medio (para soft-light/overlay)."""
    g = ruido(n, lambda fx, fy: np.exp(-(fx ** 2 + fy ** 2) / (2 * 0.32 ** 2)))
    return 0.5 + 0.16 * g


def caustica(n=512):
    """Cáusticas de piscina: una red de líneas brillantes (ruido 'crestado')."""
    a = ruido(n, banda(0.012, 0.004))
    b = ruido(n, banda(0.024, 0.008))
    cresta = (1 - np.minimum(1, np.abs(a) / 1.2)) ** 7 + 0.5 * (1 - np.minimum(1, np.abs(b) / 1.2)) ** 9
    return np.clip(cresta / np.percentile(cresta, 99.7), 0, 1)


def madera(n=1024):
    """Madera de mesa: vetas a lo largo de x, deformadas, con fibra fina. Gris claro (para multiply).
    Usa su propio generador: agregarla no cambia las demás texturas."""
    g = np.random.default_rng(1979)
    y = np.arange(n)[:, None] / n
    # deformación lenta de las vetas (larga en x, más corta en y): periódica, así que no hay costura
    onda = ruido(n, lambda fx, fy: np.exp(-(fx ** 2) / (2 * 0.002 ** 2) - (fy ** 2) / (2 * 0.006 ** 2)), g)
    anillos = 0.5 + 0.5 * np.sin(2 * np.pi * 11 * y + 2.4 * onda)
    tardia = anillos ** 6  # la madera tardía: líneas finas y oscuras
    fibra = ruido(n, fibras(0, largo=0.003, grosor=0.25), g)
    nubes = ruido(n, lambda fx, fy: np.exp(-(fx ** 2) / (2 * 0.004 ** 2) - (fy ** 2) / (2 * 0.02 ** 2)), g)
    return 0.86 - 0.16 * tardia + 0.035 * fibra + 0.03 * nubes - 0.04 * anillos


def main():
    todas = {
        "papel": lambda: guardar(papel(), "papel.jpg", 88),
        "grano": lambda: [guardar(grano(), f"grano-{i}.png") for i in range(6)],
        "caustica": lambda: guardar(caustica(), "caustica.png"),
        "madera": lambda: guardar(madera(), "madera.jpg", 86),
    }
    for nombre in sys.argv[1:] or list(todas):
        todas[nombre]()


if __name__ == "__main__":
    main()
