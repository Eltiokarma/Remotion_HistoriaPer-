"""Texturas procedurales compartidas (papel, grano de película, cáusticas de agua).

Se generan con ruido filtrado por FFT, así que todas se repiten sin costuras (tileables).
Material propio: no hay licencias que rastrear.

Uso: python scripts/generar_texturas.py      (necesita numpy y Pillow)
Escribe en public/compartido/texturas/.
"""
from pathlib import Path

import numpy as np
from PIL import Image

ROOT = Path(__file__).resolve().parent.parent
OUT = ROOT / "public" / "compartido" / "texturas"
rng = np.random.default_rng(1956)


def ruido(n, filtro):
    """Ruido blanco filtrado en frecuencia: periódico por construcción (se repite sin costura)."""
    f = np.fft.fftfreq(n)
    fx, fy = np.meshgrid(f, f)
    X = np.fft.fft2(rng.standard_normal((n, n))) * filtro(fx, fy)
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


def main():
    guardar(papel(), "papel.jpg", 88)
    for i in range(6):
        guardar(grano(), f"grano-{i}.png")
    guardar(caustica(), "caustica.png")


if __name__ == "__main__":
    main()
