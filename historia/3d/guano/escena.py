"""Islas guaneras de Chincha, hacia 1850 — escena 3D procedural (experimento).

Genera la escena desde cero y la renderiza. Todo es geometría procedural: no se carga ningún
asset externo, así que no hay licencias que registrar (ver fuentes.md).

Uso (Blender 5.2, sin interfaz):

    blender -b -P escena.py                          # clip completo + guano.mp4
    blender -b -P escena.py -- --prueba              # 3 fotogramas de prueba (1, 120, 240)
    blender -b -P escena.py -- --prueba --tag v2     # … guardados en pruebas/v2/
    blender -b -P escena.py -- --frames 1,60 --muestras 16 --escala 50
    blender -b -P escena.py -- --motor eevee         # en la laptop (Iris Xe) Eevee sí corre
    blender -b -P escena.py -- --guardar-blend       # además deja guano.blend para mirarla

Los fotogramas del clip van a out/frames/ (fuera de git); ffmpeg los junta en guano.mp4.
Aleatorio siempre con semilla: el mismo dibujo en cada render.
"""

import math
import os
import random
import shutil
import subprocess
import sys
import time

import bmesh
import bpy
from mathutils import Matrix, Vector, noise

AQUI = os.path.dirname(os.path.abspath(__file__))

# ─── Parámetros ─────────────────────────────────────────────────────────────────────────────

ANCHO, ALTO, FPS, FRAMES = 1280, 720, 24, 240


def leer_args():
    argv = sys.argv[sys.argv.index("--") + 1:] if "--" in sys.argv else []
    a = {"prueba": False, "frames": None, "tag": "", "muestras": 32, "escala": 100,
         "motor": "cycles", "guardar_blend": False}
    i = 0
    while i < len(argv):
        k = argv[i]
        if k == "--prueba":
            a["prueba"] = True
        elif k == "--guardar-blend":
            a["guardar_blend"] = True
        elif k in ("--frames", "--tag", "--muestras", "--escala", "--motor"):
            a[k[2:]] = argv[i + 1]
            i += 1
        i += 1
    a["muestras"], a["escala"] = int(a["muestras"]), int(a["escala"])
    if a["prueba"] and not a["frames"]:
        a["frames"] = "1,120,240"
    if a["frames"]:
        a["frames"] = [int(f) for f in a["frames"].split(",")]
    return a


# ─── Paleta del canal ───────────────────────────────────────────────────────────────────────
# Base: papel #EDE4D3, tinta #1C1B19, rojo #B3261E, verde óxido #5E6B4E. Lo demás sale de mezclar
# esos cuatro hacia el gris frío de la garúa.

PAPEL, TINTA, ROJO, VERDE = "#EDE4D3", "#1C1B19", "#B3261E", "#5E6B4E"
ROCA = "#3A3832"          # tinta aclarada hacia el verde
ROCA_VETA = "#D9D0BE"     # guano chorreado por los acantilados (papel apagado)
GUANO = PAPEL
GUANO_CORTE = "#CDBFA5"   # guano recién excavado: papel tostado
SACO = "#C9B48C"          # yute
MADERA = "#4A3F33"
MADERA_SAL = "#8E8270"   # tablas de la manga, blanqueadas por sal y guano
CUBIERTA = "#7A6A55"
VELA = "#DCD2BF"
MAR = "#4B5654"           # gris frío con algo de verde
CIELO_HORIZONTE = "#C9C8C0"
CIELO_ALTO = "#A9ACA8"
NIEBLA = CIELO_HORIZONTE


def lin(hexa):
    """sRGB hex → RGBA lineal (los nodos de Blender trabajan en lineal)."""
    h = hexa.lstrip("#")
    out = []
    for i in (0, 2, 4):
        c = int(h[i:i + 2], 16) / 255
        out.append(c / 12.92 if c <= 0.04045 else ((c + 0.055) / 1.055) ** 2.4)
    return (*out, 1.0)


# ─── Escena vacía ───────────────────────────────────────────────────────────────────────────

def limpiar():
    bpy.ops.wm.read_factory_settings(use_empty=True)
    esc = bpy.context.scene
    esc.name = "Chincha1850"
    esc.frame_start, esc.frame_end = 1, FRAMES
    esc.render.fps = FPS
    esc.render.resolution_x, esc.render.resolution_y = ANCHO, ALTO
    # Colores tal cual: con AgX/Filmic la paleta se lava. «Standard» respeta los hex.
    esc.view_settings.view_transform = "Standard"
    esc.view_settings.look = "None"
    return esc


def coleccion(nombre, en_escena=True):
    col = bpy.data.collections.new(nombre)
    if en_escena:
        bpy.context.scene.collection.children.link(col)
    return col


def objeto(nombre, datos, col, loc=(0, 0, 0)):
    ob = bpy.data.objects.new(nombre, datos)
    ob.location = loc
    col.objects.link(ob)
    return ob


def malla(nombre, verts, caras, col, mats=None, idx=None, loc=(0, 0, 0)):
    me = bpy.data.meshes.new(nombre)
    me.from_pydata([tuple(v) for v in verts], [], caras)
    me.validate()
    for m in mats or []:
        me.materials.append(m)
    if idx is not None:
        me.polygons.foreach_set("material_index", idx)
    return objeto(nombre, me, col, loc)


def keys_lineales(lineal=True):
    """Interpolación de las claves que se insertan a continuación (API estable entre versiones)."""
    bpy.context.preferences.edit.keyframe_new_interpolation_type = "LINEAR" if lineal else "BEZIER"


# ─── Materiales ─────────────────────────────────────────────────────────────────────────────
# Todo material pasa por el grupo «Niebla»: según la distancia a la cámara se mezcla con el color
# del horizonte. Es la garúa, y es más barata que un volumen (cero ruido extra en Cycles).

def grupo_niebla(dist=1700.0, maximo=0.93):
    ng = bpy.data.node_groups.new("Niebla", "ShaderNodeTree")
    ng.interface.new_socket("Shader", in_out="INPUT", socket_type="NodeSocketShader")
    ng.interface.new_socket("Shader", in_out="OUTPUT", socket_type="NodeSocketShader")
    n, l = ng.nodes, ng.links
    gin, gout = n.new("NodeGroupInput"), n.new("NodeGroupOutput")
    cam = n.new("ShaderNodeCameraData")
    # f = maximo · (1 − e^(−d/dist)), solo para rayos de cámara (que la niebla no ilumine nada)
    div = n.new("ShaderNodeMath"); div.operation = "DIVIDE"; div.inputs[1].default_value = -dist
    exp = n.new("ShaderNodeMath"); exp.operation = "EXPONENT"
    inv = n.new("ShaderNodeMath"); inv.operation = "SUBTRACT"; inv.inputs[0].default_value = 1.0
    esc = n.new("ShaderNodeMath"); esc.operation = "MULTIPLY"; esc.inputs[1].default_value = maximo
    lp = n.new("ShaderNodeLightPath")
    solo = n.new("ShaderNodeMath"); solo.operation = "MULTIPLY"
    emi = n.new("ShaderNodeEmission"); emi.inputs["Color"].default_value = lin(NIEBLA)
    mix = n.new("ShaderNodeMixShader")
    l.new(cam.outputs["View Distance"], div.inputs[0])
    l.new(div.outputs[0], exp.inputs[0])
    l.new(exp.outputs[0], inv.inputs[1])
    l.new(inv.outputs[0], esc.inputs[0])
    l.new(esc.outputs[0], solo.inputs[0])
    l.new(lp.outputs["Is Camera Ray"], solo.inputs[1])
    l.new(solo.outputs[0], mix.inputs[0])
    l.new(gin.outputs[0], mix.inputs[1])
    l.new(emi.outputs[0], mix.inputs[2])
    l.new(mix.outputs[0], gout.inputs[0])
    return ng


NIEBLA_NG = None


def material(nombre, color, rugosidad=0.85, especular=0.2):
    m = bpy.data.materials.new(nombre)
    nt = m.node_tree
    nt.nodes.clear()
    out = nt.nodes.new("ShaderNodeOutputMaterial")
    bsdf = nt.nodes.new("ShaderNodeBsdfPrincipled")
    bsdf.inputs["Base Color"].default_value = lin(color) if isinstance(color, str) else color
    bsdf.inputs["Roughness"].default_value = rugosidad
    bsdf.inputs["Specular IOR Level"].default_value = especular
    g = nt.nodes.new("ShaderNodeGroup")
    g.node_tree = NIEBLA_NG
    nt.links.new(bsdf.outputs[0], g.inputs[0])
    nt.links.new(g.outputs[0], out.inputs["Surface"])
    m.diffuse_color = lin(color) if isinstance(color, str) else color
    return m, bsdf, nt


def material_roca():
    """Roca oscura con chorreaduras de guano desde el borde de arriba.

    Un ruido que solo depende de x, y (columnas verticales) más la altura: cerca del labio casi
    todas las columnas pasan el umbral; abajo, solo las más fuertes. Cortado en seco (rampa
    constante) para que se lea como ilustración y no como textura fotográfica."""
    m, bsdf, nt = material("roca", ROCA, rugosidad=0.95, especular=0.1)
    n, l = nt.nodes, nt.links
    geo = n.new("ShaderNodeNewGeometry")
    esc = n.new("ShaderNodeVectorMath"); esc.operation = "MULTIPLY"
    esc.inputs[1].default_value = (0.5, 0.5, 0.0)
    ruido = n.new("ShaderNodeTexNoise")
    ruido.inputs["Scale"].default_value = 1.0
    ruido.inputs["Detail"].default_value = 0.0
    sep = n.new("ShaderNodeSeparateXYZ")
    # valor = ruido + 0,04·z − 0,45 (la rampa solo acepta posiciones entre 0 y 1)
    alto = n.new("ShaderNodeMath"); alto.operation = "MULTIPLY_ADD"
    alto.inputs[1].default_value = 0.04
    alto.inputs[2].default_value = -0.45
    suma = n.new("ShaderNodeMath"); suma.operation = "ADD"
    rampa = n.new("ShaderNodeValToRGB")
    rampa.color_ramp.interpolation = "CONSTANT"
    rampa.color_ramp.elements[0].position = 0.0
    rampa.color_ramp.elements[0].color = lin(ROCA)
    rampa.color_ramp.elements[1].position = 0.70
    rampa.color_ramp.elements[1].color = lin(ROCA_VETA)
    e = rampa.color_ramp.elements.new(0.63)
    e.color = lin("#4A473F")
    l.new(geo.outputs["Position"], esc.inputs[0])
    l.new(esc.outputs[0], ruido.inputs["Vector"])
    l.new(geo.outputs["Position"], sep.inputs[0])
    l.new(sep.outputs["Z"], alto.inputs[0])
    l.new(ruido.outputs["Fac"], suma.inputs[0])
    l.new(alto.outputs[0], suma.inputs[1])
    l.new(suma.outputs[0], rampa.inputs[0])
    l.new(rampa.outputs["Color"], bsdf.inputs["Base Color"])
    return m


def material_mar():
    m, bsdf, nt = material("mar", MAR, rugosidad=0.32, especular=0.5)
    return m


def mundo():
    w = bpy.data.worlds.new("garua")
    bpy.context.scene.world = w
    nt = w.node_tree
    nt.nodes.clear()
    out = nt.nodes.new("ShaderNodeOutputWorld")
    bg = nt.nodes.new("ShaderNodeBackground")
    tc = nt.nodes.new("ShaderNodeTexCoord")
    sep = nt.nodes.new("ShaderNodeSeparateXYZ")
    rampa = nt.nodes.new("ShaderNodeValToRGB")
    rampa.color_ramp.elements[0].position = 0.0
    rampa.color_ramp.elements[0].color = lin(CIELO_HORIZONTE)
    rampa.color_ramp.elements[1].position = 0.45
    rampa.color_ramp.elements[1].color = lin(CIELO_ALTO)
    nt.links.new(tc.outputs["Generated"], sep.inputs[0])
    nt.links.new(sep.outputs["Z"], rampa.inputs[0])
    # estratos de garúa: ruido aplastado en horizontal, contraste muy bajo
    esc = nt.nodes.new("ShaderNodeVectorMath"); esc.operation = "MULTIPLY"
    esc.inputs[1].default_value = (1.6, 1.6, 9.0)
    ruido = nt.nodes.new("ShaderNodeTexNoise")
    ruido.inputs["Scale"].default_value = 1.4
    ruido.inputs["Detail"].default_value = 2.0
    nubes = nt.nodes.new("ShaderNodeMix"); nubes.data_type = "RGBA"; nubes.blend_type = "OVERLAY"
    nubes.inputs["Factor"].default_value = 0.22
    nt.links.new(tc.outputs["Generated"], esc.inputs[0])
    nt.links.new(esc.outputs[0], ruido.inputs["Vector"])
    nt.links.new(rampa.outputs["Color"], nubes.inputs["A"])
    nt.links.new(ruido.outputs["Fac"], nubes.inputs["B"])
    nt.links.new(nubes.outputs["Result"], bg.inputs["Color"])
    bg.inputs["Strength"].default_value = 1.0
    nt.links.new(bg.outputs[0], out.inputs["Surface"])


# ─── Islas ──────────────────────────────────────────────────────────────────────────────────

def contorno(semilla, n=64):
    """Radio relativo del contorno de la isla para cada ángulo (ruido suave + mordiscos)."""
    rnd = random.Random(semilla)
    rs = []
    for i in range(n):
        t = 2 * math.pi * i / n
        v = Vector((math.cos(t) * 1.3, math.sin(t) * 1.3, semilla * 0.37))
        r = 1 + 0.16 * noise.noise(v) + 0.07 * noise.noise(v * 3.1) + rnd.uniform(-0.025, 0.025)
        rs.append(r)
    return rs


def isla(nombre, centro, ax, ay, alto, semilla, col, m_roca, m_guano, montes):
    """Meseta de roca de acantilados casi verticales con cerros de guano encima.

    montes: lista de (dx, dy, rx, ry, h) relativos al centro: los cerros blancos."""
    rnd = random.Random(semilla)
    cx, cy = centro
    n = 64
    rs = contorno(semilla, n)
    # anillos (z, escala): pie bajo el agua, cara del acantilado con salientes, labio superior
    anillos = [(-10, 1.07), (0, 1.03), (alto * 0.22, 1.005), (alto * 0.45, 0.995),
               (alto * 0.7, 0.985), (alto * 0.9, 0.972), (alto, 0.955), (alto + 1.8, 0.90)]
    verts, caras, idx = [], [], []
    for k, (z, s) in enumerate(anillos):
        for i in range(n):
            t = 2 * math.pi * i / n
            j = 1 + (rnd.uniform(-0.018, 0.018) if 0 < k < len(anillos) - 1 else 0)
            zz = z + (rnd.uniform(-alto * 0.025, alto * 0.025) if 1 < k < len(anillos) - 2 else 0)
            verts.append((cx + ax * rs[i] * s * j * math.cos(t),
                          cy + ay * rs[i] * s * j * math.sin(t), zz))
    for k in range(len(anillos) - 1):
        for i in range(n):
            a, b = k * n + i, k * n + (i + 1) % n
            caras.append((a, b, b + n, a + n))
            idx.append(1 if k == len(anillos) - 2 else 0)  # el labio ya es costra de guano
    tapa = list(range((len(anillos) - 1) * n, len(anillos) * n))
    caras.append(tuple(tapa))
    idx.append(1)
    ob = malla(nombre, verts, caras, col, [m_roca, m_guano], idx)
    me = ob.data
    bm = bmesh.new(); bm.from_mesh(me)
    bmesh.ops.triangulate(bm, faces=bm.faces[:])
    bm.to_mesh(me); bm.free()

    for j, (dx, dy, rx, ry, h) in enumerate(montes):
        cerro(f"{nombre}_cerro{j}", (cx + dx, cy + dy, alto + 1.0), rx, ry, h,
              semilla * 10 + j, col, m_guano)
    return ob, rs


def cerro(nombre, base, rx, ry, h, semilla, col, m):
    """Cerro de guano: media icoesfera aplastada y movida con ruido. Facetas grandes = low-poly."""
    me = bpy.data.meshes.new(nombre)
    bm = bmesh.new()
    bmesh.ops.create_icosphere(bm, subdivisions=3, radius=1.0)
    borrar = [v for v in bm.verts if v.co.z < -0.15]
    bmesh.ops.delete(bm, geom=borrar, context="VERTS")
    bmesh.ops.holes_fill(bm, edges=bm.edges[:], sides=0)   # cerrado: el corte booleano lo pide
    for v in bm.verts:
        p = v.co.copy()
        d = 1 + 0.16 * noise.noise(p * 1.9 + Vector((semilla, 0, 0)))
        v.co = Vector((p.x * rx * d, p.y * ry * d, max(p.z, -0.15) * h * d))
    bm.to_mesh(me); bm.free()
    me.materials.append(m)
    return objeto(nombre, me, col, base)


def punto_borde(rs, centro, ax, ay, escala, angulo):
    n = len(rs)
    f = angulo / (2 * math.pi) * n
    i0 = int(math.floor(f)) % n
    i1 = (i0 + 1) % n
    r = rs[i0] + (rs[i1] - rs[i0]) * (f - math.floor(f))
    return Vector((centro[0] + ax * r * escala * math.cos(angulo),
                   centro[1] + ay * r * escala * math.sin(angulo)))


def espuma(nombre, rs, centro, ax, ay, col, m, semilla):
    """Cinta de espuma al pie del acantilado: el borde de afuera mordido al azar."""
    rnd = random.Random(semilla)
    n = len(rs)
    verts, caras = [], []
    for i in range(n):
        t = 2 * math.pi * i / n
        for s in (1.03, 1.04 + rnd.uniform(0, 0.025)):
            verts.append((centro[0] + ax * rs[i] * s * math.cos(t),
                          centro[1] + ay * rs[i] * s * math.sin(t), 0.35))
    for i in range(n):
        if rnd.random() < 0.35:
            continue
        a, b = 2 * i, 2 * ((i + 1) % n)
        caras.append((a, b, b + 1, a + 1))
    return malla(nombre, verts, caras, col, [m])


# ─── Barco ──────────────────────────────────────────────────────────────────────────────────
# Fragata mercante de tres palos (buque de aparejo redondo), velas aferradas porque está fondeado.
# Medidas en metros, origen en la línea de flotación, proa hacia +x. Ver fuentes.md.

def cilindro(nombre, a, b, r0, r1, col, m, lados=6):
    a, b = Vector(a), Vector(b)
    eje = b - a
    largo = eje.length
    me = bpy.data.meshes.new(nombre)
    bm = bmesh.new()
    bmesh.ops.create_cone(bm, cap_ends=True, segments=lados, radius1=r0, radius2=r1, depth=largo)
    bm.to_mesh(me); bm.free()
    me.materials.append(m)
    ob = objeto(nombre, me, col, (a + b) / 2)
    ob.rotation_mode = "QUATERNION"
    ob.rotation_quaternion = eje.to_track_quat("Z", "Y")
    return ob


def cabo(nombre, puntos, col, m, grosor=0.05):
    cu = bpy.data.curves.new(nombre, "CURVE")
    cu.dimensions = "3D"
    cu.bevel_depth = grosor
    cu.bevel_resolution = 0
    sp = cu.splines.new("POLY")
    sp.points.add(len(puntos) - 1)
    for p, q in zip(sp.points, puntos):
        p.co = (*q, 1.0)
    cu.materials.append(m)
    return objeto(nombre, cu, col)


def caja(nombre, centro, medidas, col, m, rot=None):
    me = bpy.data.meshes.new(nombre)
    bm = bmesh.new()
    bmesh.ops.create_cube(bm, size=1.0)
    bmesh.ops.scale(bm, vec=medidas, verts=bm.verts)
    bm.to_mesh(me); bm.free()
    me.materials.append(m)
    ob = objeto(nombre, me, col, centro)
    if rot is not None:
        ob.rotation_mode = "QUATERNION"
        ob.rotation_quaternion = rot
    return ob


def construir_barco(col, M):
    secciones = [(-19.5, 3.5), (-16, 4.3), (-10, 4.9), (-4, 5.05), (2, 5.05),
                 (8, 4.75), (13, 3.9), (17, 2.5), (20.5, 0.35)]

    def cubierta_z(x):
        return 3.3 + 0.0055 * x * x  # arrufo: la cubierta sube en proa y popa

    # perfil de media sección (factor de manga, z); la franja clara va entre 2.0 y 2.5
    def perfil(x):
        d = cubierta_z(x)
        return [(1.0, d), (1.0, 2.5), (1.0, 2.0), (0.99, 0.45), (0.86, -1.5), (0.42, -3.0)]

    verts, caras, idx = [], [], []
    filas = []
    for x, w in secciones:
        p = perfil(x)
        anillo = [(x, -w * f, z) for f, z in p] + [(x, 0.0, -3.4)] + \
                 [(x, w * f, z) for f, z in reversed(p)]
        filas.append(len(verts))
        verts += anillo
    m_anillo = len(perfil(0)) * 2 + 1
    # material por tramo vertical: 0 casco negro, 1 franja papel, 2 cobre verdigris
    tramo_mat = [0, 1, 0, 2, 2, 2, 2, 2, 2, 2, 0, 1, 0]
    for s in range(len(secciones) - 1):
        for k in range(m_anillo - 1):
            a, b = filas[s] + k, filas[s + 1] + k
            caras.append((a, b, b + 1, a + 1))
            idx.append(tramo_mat[k])
    # espejo de popa y cierre de proa
    caras.append(tuple(range(filas[0], filas[0] + m_anillo))[::-1]); idx.append(0)
    caras.append(tuple(range(filas[-1], filas[-1] + m_anillo))); idx.append(0)
    # cubierta
    babor = [filas[s] for s in range(len(secciones))]
    estribor = [filas[s] + m_anillo - 1 for s in range(len(secciones))]
    caras.append(tuple(babor + estribor[::-1])); idx.append(3)
    casco = malla("casco", verts, caras, col,
                  [M["casco"], M["franja"], M["cobre"], M["cubierta"]], idx)
    bm = bmesh.new(); bm.from_mesh(casco.data)
    bmesh.ops.triangulate(bm, faces=bm.faces[:])
    bm.to_mesh(casco.data); bm.free()

    # escotilla donde caen los sacos (entre el palo mayor y el de mesana)
    caja("escotilla", (-5.0, 0, cubierta_z(-5) + 0.15), (4.0, 3.2, 0.5), col, M["tinta"])
    caja("castillo", (16.0, 0, cubierta_z(16) + 0.5), (6, 4.2, 1.0), col, M["casco"])
    caja("toldilla", (-16.5, 0, cubierta_z(-16.5) + 0.6), (6, 6.4, 1.2), col, M["casco"])

    palos = [(10.5, 27.0, 1.0), (0.5, 30.0, 1.0), (-10.5, 23.0, 0.8)]  # x, alto, escala vergas
    topes = []
    for j, (x, h, ev) in enumerate(palos):
        z0 = cubierta_z(x)
        cilindro(f"palo{j}", (x, 0, z0), (x, 0, z0 + h), 0.42, 0.13, col, M["madera"])
        topes.append(Vector((x, 0, z0 + h)))
        vergas = [(0.36, 19.0), (0.58, 15.0), (0.78, 11.0), (0.92, 7.5)]
        if j == 2:
            vergas = vergas[1:]
        for k, (fz, largo) in enumerate(vergas):
            z = z0 + h * fz
            L = largo * ev
            cilindro(f"verga{j}{k}", (x, -L / 2, z), (x, L / 2, z), 0.17, 0.17, col, M["madera"])
            # vela aferrada: un rollo claro apoyado sobre la verga
            cilindro(f"vela{j}{k}", (x + 0.15, -L * 0.44, z + 0.32), (x + 0.15, L * 0.44, z + 0.32),
                     0.34, 0.34, col, M["vela"], lados=5)
            # obenques: del palo a la borda
        for lado in (-1, 1):
            for dx in (-1.6, 0.4):
                cabo(f"obenque{j}{lado}{dx}", [(x, 0, z0 + h * 0.75), (x + dx, lado * 4.9, z0 + 0.8)],
                     col, M["tinta"], 0.045)
    # cangrejo (vela de cuchillo aferrada) del palo de mesana
    zc = cubierta_z(-10.5)
    cilindro("cangrejo", (-10.5, 0, zc + 6), (-19, 0, zc + 4.2), 0.16, 0.12, col, M["madera"])
    # bauprés y estays
    tip = Vector((31.0, 0, cubierta_z(20) + 6.0))
    cilindro("baupres", (19.5, 0, cubierta_z(19.5) + 0.6), tip, 0.36, 0.14, col, M["madera"])
    cabo("estay0", [topes[0] * 1 + Vector((0, 0, -2)), tip], col, M["tinta"], 0.05)
    cabo("estay1", [topes[1] + Vector((0, 0, -2)), Vector((10.5, 0, cubierta_z(10.5) + 18))],
         col, M["tinta"], 0.05)
    cabo("estay2", [topes[2] + Vector((0, 0, -1)), Vector((0.5, 0, cubierta_z(0.5) + 16))],
         col, M["tinta"], 0.05)
    for lado in (-1, 1):
        cabo(f"brazal{lado}", [topes[1] + Vector((0, 0, -4)), (-18, lado * 3.3, cubierta_z(-18) + 1)],
             col, M["tinta"], 0.04)
    return {"cubierta_z": cubierta_z, "tope_mayor": topes[1], "escotilla_x": -5.0}


# ─── Sacos y aves ────────────────────────────────────────────────────────────────────────────

def saco_malla(m):
    me = bpy.data.meshes.new("saco")
    bm = bmesh.new()
    bmesh.ops.create_icosphere(bm, subdivisions=1, radius=1.0)
    for v in bm.verts:
        v.co = Vector((v.co.x * 0.55, v.co.y * 0.85, v.co.z * 0.38))
    bm.to_mesh(me); bm.free()
    me.materials.append(m)
    return me


def ave_malla(m):
    """Guanay visto de lejos: una V de dos triángulos, 1.3 m de punta a punta."""
    me = bpy.data.meshes.new("guanay")
    me.from_pydata([(0, 0.3, 0), (0, -0.3, 0), (-0.65, -0.05, 0.12), (0.65, -0.05, 0.12)],
                   [], [(0, 2, 1), (0, 1, 3)])
    me.materials.append(m)
    return me


def bandada(nombre, col, me, n, inicio, vel, largo, ancho, alto, semilla, ondula=6.0):
    """Cinta de aves que cruza el cielo. Cada una con su desfase y un leve sube-y-baja."""
    rnd = random.Random(semilla)
    inicio, vel = Vector(inicio), Vector(vel)
    direc = vel.normalized()
    lado = Vector((-direc.y, direc.x, 0))
    keys_lineales(True)
    for i in range(n):
        ob = objeto(f"{nombre}{i:02d}", me, col)
        ob.rotation_euler = (0, 0, math.atan2(direc.y, direc.x) - math.pi / 2)
        u = rnd.random()
        base = inicio - direc * (u * largo) + lado * (rnd.gauss(0, ancho) +
                                                        ondula * math.sin(u * 9.0)) \
            + Vector((0, 0, rnd.gauss(0, alto) + 4 * math.sin(u * 5.0)))
        fase, amp = rnd.uniform(0, 6.28), rnd.uniform(0.3, 1.2)
        v = vel * rnd.uniform(0.93, 1.07)
        for f in range(-12, FRAMES + 13, 6):
            ob.location = base + v * f + Vector((0, 0, amp * math.sin(f * 0.16 + fase)))
            ob.keyframe_insert("location", frame=f)
        s = rnd.uniform(0.8, 1.25)
        ob.scale = (s, s, s)


# ─── Montaje ────────────────────────────────────────────────────────────────────────────────

def construir(args):
    global NIEBLA_NG
    esc = limpiar()
    NIEBLA_NG = grupo_niebla()
    mundo()

    M = {
        "roca": material_roca(),
        "guano": material("guano", GUANO, 0.9, 0.15)[0],
        "corte": material("guano_corte", GUANO_CORTE, 0.95, 0.1)[0],
        "mar": material_mar(),
        "espuma": material("espuma", PAPEL, 0.9, 0.1)[0],
        "casco": material("casco", TINTA, 0.6, 0.3)[0],
        "franja": material("franja", PAPEL, 0.7, 0.2)[0],
        "cobre": material("cobre", VERDE, 0.5, 0.4)[0],
        "cubierta": material("cubierta", CUBIERTA, 0.9, 0.1)[0],
        "madera": material("madera", MADERA, 0.8, 0.2)[0],
        "madera_sal": material("madera_sal", MADERA_SAL, 0.9, 0.1)[0],
        "vela": material("vela", VELA, 0.95, 0.1)[0],
        "tinta": material("tinta", TINTA, 0.9, 0.1)[0],
        "rojo": material("rojo", ROJO, 0.8, 0.1)[0],
        "saco": material("saco", SACO, 0.95, 0.05)[0],
        "ave": material("ave", TINTA, 1.0, 0.0)[0],
    }
    M["rojo"].node_tree.nodes["Principled BSDF"].inputs["Emission Color"].default_value = lin(ROJO)
    M["rojo"].node_tree.nodes["Principled BSDF"].inputs["Emission Strength"].default_value = 0.25

    c_islas = coleccion("islas")
    c_mar = coleccion("mar")
    c_barco = coleccion("barco", en_escena=False)   # se instancia: el principal y los lejanos
    c_flota = coleccion("flota")
    c_carga = coleccion("carga")
    c_aves = coleccion("aves")

    # ── Mar: cuadrícula facetada con olas que derivan + un plano lejano liso
    me = bpy.data.meshes.new("mar")
    bm = bmesh.new()
    bmesh.ops.create_grid(bm, x_segments=300, y_segments=300, size=1300)
    bm.to_mesh(me); bm.free()
    me.materials.append(M["mar"])
    mar = objeto("mar", me, c_mar, (0, -250, 0))
    deriva = bpy.data.objects.new("deriva_olas", None)
    c_mar.objects.link(deriva)
    deriva.scale = (22, 30, 22)
    tex = bpy.data.textures.new("olas", "CLOUDS")
    tex.noise_scale = 1.0
    tex.noise_depth = 1
    dsp = mar.modifiers.new("olas", "DISPLACE")
    dsp.texture = tex
    dsp.texture_coords = "OBJECT"
    dsp.texture_coords_object = deriva
    dsp.strength = 1.9
    dsp.mid_level = 0.5
    mar.modifiers.new("facetas", "TRIANGULATE")
    keys_lineales(True)
    deriva.location = (0, 0, 0); deriva.keyframe_insert("location", frame=1)
    deriva.location = (14, 22, 0); deriva.keyframe_insert("location", frame=FRAMES)
    lejos = bpy.data.meshes.new("mar_lejos")
    lejos.from_pydata([(-9000, -9000, -0.2), (9000, -9000, -0.2), (9000, 9000, -0.2),
                       (-9000, 9000, -0.2)], [], [(0, 1, 2, 3)])
    lejos.materials.append(M["mar"])
    objeto("mar_lejos", lejos, c_mar)

    # ── Islas. La principal (Chincha Norte) al frente; Centro y Sur al fondo, en la garúa.
    C1, AX1, AY1, H1 = (0.0, 330.0), 330.0, 210.0, 24.0
    _, rs1 = isla("isla_norte", C1, AX1, AY1, H1, 3, c_islas, M["roca"], M["guano"], [
        (-70, 50, 190, 140, 58), (110, 0, 130, 100, 44), (-200, -20, 100, 85, 34),
        (-40, -85, 110, 60, 26), (210, 70, 80, 75, 30), (70, -112, 80, 52, 30)])
    espuma("espuma_norte", rs1, C1, AX1, AY1, c_islas, M["espuma"], 31)
    for nombre, c, ax, ay, h, sem, montes in [
        ("isla_centro", (820.0, 1150.0), 300.0, 200.0, 28.0, 7,
         [(-40, 20, 200, 140, 40), (120, -30, 120, 90, 26)]),
        ("isla_sur", (1650.0, 2050.0), 240.0, 150.0, 24.0, 11,
         [(0, 10, 170, 110, 34)]),
    ]:
        _, rs = isla(nombre, c, ax, ay, h, sem, c_islas, M["roca"], M["guano"], montes)
        espuma(f"espuma_{nombre}", rs, c, ax, ay, c_islas, M["espuma"], sem + 1)

    # ── Dónde está el acantilado frente al barco: el borde sur de la isla, un poco al este
    ang = math.radians(-78)
    borde_agua = punto_borde(rs1, C1, AX1, AY1, 1.03, ang)
    borde_alto = punto_borde(rs1, C1, AX1, AY1, 0.955, ang)

    # ── Barco principal, fondeado a ~28 m del pie del acantilado, de costado a la isla
    info = construir_barco(c_barco, M)
    eje_x = Vector((1, 0.18, 0)).normalized()     # paralelo aproximado al acantilado
    # corrido al oeste de la plataforma: la manga baja en diagonal y cruza el cuadro final
    barco_pos = Vector((borde_agua.x - 24, borde_agua.y - 33, 0))
    barco = bpy.data.objects.new("barco_principal", None)
    barco.instance_type = "COLLECTION"
    barco.instance_collection = c_barco
    c_flota.objects.link(barco)
    barco.location = barco_pos
    giro = math.atan2(eje_x.y, eje_x.x)
    # cabeceo leve de barco fondeado (±0,6°, ~5 s): acción secundaria, no protagonista
    keys_lineales(False)
    for f in range(1, FRAMES + 1, 30):
        barco.rotation_euler = (math.radians(0.6) * math.sin(f / FPS * 2 * math.pi / 5.0),
                                math.radians(0.25) * math.sin(f / FPS * 2 * math.pi / 7.0), giro)
        barco.keyframe_insert("rotation_euler", frame=f)
    # gallardete rojo en el tope del mayor, solo en este barco: el único rojo del cuadro
    me = bpy.data.meshes.new("gallardete")
    me.from_pydata([(0, 0, 0), (0, 0, -0.9), (-6.5, 0.2, -0.75)], [], [(0, 1, 2)])
    me.materials.append(M["rojo"])
    g = objeto("gallardete", me, c_flota, info["tope_mayor"] + Vector((0, 0, 0.2)))
    g.parent = barco
    # flota que espera turno, lejos y en la niebla
    for i, (x, y, rot) in enumerate([(-330, 60, 0.3), (-560, 180, -0.4), (420, -40, 0.9),
                                     (-140, -260, 0.1), (650, 380, 0.5), (-900, 420, 0.2)]):
        e = bpy.data.objects.new(f"barco_lejano{i}", None)
        e.instance_type = "COLLECTION"
        e.instance_collection = c_barco
        e.location = (x, y, 0)
        e.rotation_euler = (0, 0, rot)
        c_flota.objects.link(e)

    def en_barco(local):
        return barco_pos + Matrix.Rotation(giro, 3, "Z") @ Vector(local)

    # ── Plataforma en el borde del acantilado y manga de madera hasta la escotilla
    top = Vector((borde_alto.x, borde_alto.y, H1 + 2.3)) + Vector((0, 6, 0))
    caja("plataforma", top + Vector((0, -2, 0.0)), (8, 7, 0.6), c_carga, M["madera"])
    for dx in (-3.5, 3.5):
        cilindro(f"poste{dx}", top + Vector((dx, -5.2, -1.5)), top + Vector((dx, -5.2, 4.0)),
                 0.18, 0.15, c_carga, M["madera"])
    cilindro("travesano", top + Vector((-3.8, -5.2, 3.8)), top + Vector((3.8, -5.2, 3.8)),
             0.14, 0.14, c_carga, M["madera"])
    rnd = random.Random(5)
    me_saco = saco_malla(M["saco"])
    for i in range(14):   # ruma de sacos esperando
        p = top + Vector((rnd.uniform(-3.2, 3.2), rnd.uniform(-1.5, 2.5), 0.6 + (i // 6) * 0.55))
        s = objeto(f"ruma{i}", me_saco, c_carga, p)
        s.rotation_euler = (0, 0, rnd.uniform(-0.4, 0.4))
    p0 = top + Vector((0, -5.5, 0.5))
    hx = info["escotilla_x"]
    p1 = en_barco((hx, 0, info["cubierta_z"](hx) + 3.0))
    eje = p1 - p0
    q = eje.to_track_quat("Y", "Z")
    caja("manga", (p0 + p1) / 2, (1.6, eje.length, 0.25), c_carga, M["madera_sal"], q)
    # vientos de la manga: del travesaño a la borda del barco
    for lado in (-1, 1):
        cabo(f"viento{lado}", [top + Vector((lado * 3.6, -5.2, 3.8)),
                               en_barco((hx + lado * 3.5, 4.8, info["cubierta_z"](hx) + 1))],
             c_carga, M["tinta"], 0.05)

    # ── Sacos que bajan: uno cada 8 frames. Arrancan despacio, toman velocidad en el primer
    # cuarto y siguen parejo (el roce de la manga los frena); al final caen por la escotilla.
    normal = q @ Vector((0, 0, 1))
    abajo = en_barco((hx, 0, -1.0))
    keys_lineales(True)
    paso, viaje = 8, 40

    def recorrido(t):            # 0..1 → 0..1: arranque cuadrático, después velocidad constante
        a = 0.25
        return (t * t / (2 * a)) / (1 - a / 2) if t < a else (t - a / 2) / (1 - a / 2)
    for i, k in enumerate(range(-(viaje // paso) - 1, FRAMES // paso + 2)):
        s = objeto(f"saco{i:02d}", me_saco, c_carga)
        s.rotation_mode = "QUATERNION"
        s.rotation_quaternion = q
        t0 = 1 + k * paso
        s.location = p0 + normal * 0.5
        s.keyframe_insert("location", frame=t0 - 200)
        s.keyframe_insert("location", frame=t0)
        for f in range(1, viaje + 1, 2):
            u = recorrido(f / viaje)
            s.location = p0 + eje * u + normal * 0.5
            s.keyframe_insert("location", frame=t0 + f)
        s.location = p1 + Vector((0, 0, -1.2))
        s.keyframe_insert("location", frame=t0 + viaje + 3)
        s.location = abajo
        s.keyframe_insert("location", frame=t0 + viaje + 7)
        s.keyframe_insert("location", frame=t0 + 400)

    # ── El corte: la cara vertical que deja la excavación en el cerro más cercano. Guano tostado
    # adentro, blanco afuera. Es lo que dice que esto es una mina, no un paisaje.
    cerro_cerca = bpy.data.objects["isla_norte_cerro5"]
    corte = caja("cortador", top + Vector((-14, 22, 10)), (44, 40, 60), c_carga, M["corte"],
                 Matrix.Rotation(math.radians(8), 3, "Z").to_quaternion())
    corte.hide_render = True
    corte.hide_viewport = True
    bo = cerro_cerca.modifiers.new("corte", "BOOLEAN")
    bo.operation, bo.solver, bo.object = "DIFFERENCE", "EXACT", corte
    bo.material_mode = "TRANSFER"
    cerro_cerca.data.materials.append(M["corte"])

    # ── Aves: una cinta baja frente al acantilado y otra alta sobre los cerros
    me_ave = ave_malla(M["ave"])
    # (inicio = dónde está la cabeza de la cinta en el frame 0; cruzan a ~15 m/s)
    va, vb, vc = Vector((-0.62, 0.05, 0)), Vector((0.66, -0.05, 0)), Vector((-0.6, 0.1, 0))
    cc = (p0 + p1) / 2
    bandada("guanay_a", c_aves, me_ave, 70, cc + Vector((40, -45, 26)) - va * 150, va,
            200, 6, 4, 11)
    bandada("guanay_b", c_aves, me_ave, 110, Vector((C1[0] - 40, C1[1] - 60, 105)) - vb * 70, vb,
            420, 16, 10, 23)
    bandada("guanay_c", c_aves, me_ave, 45, Vector((-60, -380, 32)) - vc * 40, vc,
            160, 5, 3, 37)

    # ── Luz: cielo nublado (el mundo) + un sol pálido y difuso alto a la izquierda
    sol = bpy.data.lights.new("sol", "SUN")
    sol.energy = 2.6
    sol.angle = math.radians(20)
    sol.color = lin("#F1ECE2")[:3]
    s = objeto("sol", sol, c_islas)
    s.rotation_mode = "QUATERNION"
    # la luz viaja hacia el noreste y abajo: viene de atrás a la izquierda de la cámara, alta
    s.rotation_quaternion = Vector((0.55, 0.45, -0.7)).to_track_quat("-Z", "Y")

    # ── Cámara: entra desde el mar hacia la isla y cierra sobre el barco y la manga
    camd = bpy.data.cameras.new("camara")
    camd.lens = 35
    camd.shift_y = 0.12   # horizonte en el tercio de abajo sin inclinar la cámara (palos rectos)
    camd.clip_start, camd.clip_end = 1, 12000
    cam = objeto("camara", camd, c_flota)
    esc.camera = cam
    oleaje = bpy.data.objects.new("oleaje_camara", None)
    c_flota.objects.link(oleaje)
    cam.parent = oleaje
    mira = bpy.data.objects.new("mira", None)
    c_flota.objects.link(mira)
    tc = cam.constraints.new("TRACK_TO")
    tc.target = mira
    tc.track_axis, tc.up_axis = "TRACK_NEGATIVE_Z", "UP_Y"

    centro_carga = (p0 + p1) / 2
    cam_ini = Vector((-60, -720, 9))
    cam_fin = centro_carga + Vector((66, -98, 0))
    cam_fin.z = 14
    mira_ini = Vector((C1[0] - 10, C1[1] - 120, 12))
    mira_fin = (centro_carga + barco_pos) / 2 + Vector((-4, 0, 7))
    # una sola curva de peso «solemne»: arranca despacio, viaja, frena (Bézier auto-clamped)
    keys_lineales(False)
    cam.location = cam_ini; cam.keyframe_insert("location", frame=1)
    cam.location = cam_fin; cam.keyframe_insert("location", frame=FRAMES)
    mira.location = mira_ini; mira.keyframe_insert("location", frame=1)
    mira.location = mira_ini.lerp(mira_fin, 0.15); mira.keyframe_insert("location", frame=70)
    mira.location = mira_fin; mira.keyframe_insert("location", frame=FRAMES)
    # el horizonte baja al tercio inferior al principio (mar abierto, cielo grande) y vuelve
    # cerca del centro al final, para que entren el casco y la manga enteros
    camd.shift_y = 0.12; camd.keyframe_insert("shift_y", frame=1)
    camd.shift_y = 0.02; camd.keyframe_insert("shift_y", frame=FRAMES)
    # vaivén de bote: 12 cm, muy lento; da cuerpo sin sacudir
    for f in range(-24, FRAMES + 25, 12):
        oleaje.location = (0, 0, 0.12 * math.sin(f / FPS * 2 * math.pi / 4.5))
        oleaje.keyframe_insert("location", frame=f)

    # ── Render
    r = esc.render
    r.resolution_percentage = args["escala"]
    if args["motor"] == "eevee":
        r.engine = "BLENDER_EEVEE"
    else:
        r.engine = "CYCLES"
        c = esc.cycles
        c.device = "CPU"
        c.samples = args["muestras"]
        c.use_adaptive_sampling = True
        c.adaptive_threshold = 0.03
        c.use_denoising = True
        c.denoiser = "OPENIMAGEDENOISE"
        c.max_bounces, c.diffuse_bounces, c.glossy_bounces = 4, 2, 2
        c.transmission_bounces = c.volume_bounces = c.transparent_max_bounces = 0
        c.caustics_reflective = c.caustics_refractive = False
        r.use_persistent_data = True
    r.image_settings.file_format = "PNG"
    r.image_settings.color_mode = "RGB"
    return esc


def renderizar(esc, args):
    t0 = time.time()
    if args["frames"]:
        carpeta = os.path.join(AQUI, "pruebas", args["tag"]) if args["prueba"] else \
            os.path.join(AQUI, "out", "sueltos")
        os.makedirs(carpeta, exist_ok=True)
        for f in args["frames"]:
            esc.frame_set(f)
            esc.render.filepath = os.path.join(carpeta, f"f{f:03d}.png")
            t = time.time()
            bpy.ops.render.render(write_still=True)
            print(f"[escena] frame {f}: {time.time() - t:.1f} s")
    else:
        carpeta = os.path.join(AQUI, "out", "frames")
        os.makedirs(carpeta, exist_ok=True)
        esc.render.filepath = os.path.join(carpeta, "f_")
        bpy.ops.render.render(animation=True)
        juntar(carpeta)
    print(f"[escena] render total: {time.time() - t0:.1f} s")


def juntar(carpeta):
    ff = shutil.which("ffmpeg")
    if not ff:
        print("[escena] ffmpeg no está en el PATH; los frames quedaron en", carpeta)
        return
    salida = os.path.join(AQUI, "guano.mp4")
    subprocess.run([ff, "-y", "-framerate", str(FPS), "-i", os.path.join(carpeta, "f_%04d.png"),
                    "-c:v", "libx264", "-preset", "slow", "-crf", "16", "-pix_fmt", "yuv420p",
                    "-movflags", "+faststart", salida], check=True)
    print("[escena] listo:", salida)


if __name__ == "__main__":
    args = leer_args()
    t = time.time()
    esc = construir(args)
    print(f"[escena] construcción: {time.time() - t:.1f} s")
    if args["guardar_blend"]:
        bpy.ops.wm.save_as_mainfile(filepath=os.path.join(AQUI, "out", "guano.blend"))
    renderizar(esc, args)
