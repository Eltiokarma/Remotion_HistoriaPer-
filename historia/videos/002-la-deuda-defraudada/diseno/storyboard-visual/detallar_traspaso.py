"""Cuerpos, manos y cámara del intercambio de 2D."""
from math import cos, radians, sin
from random import Random
import json

from piezas import CREAM, HERE, PEOPLE, asset, circle, ellipse, gradient, group, label, path, read_svg, svg
from detallar_islas import W, H, claim_leaf, paper_light, vignette
from detallar_novoa import shading, wood
from despacho_traspaso import DEFS as ROOM_DEFS, room

DEFS = ROOM_DEFS + (
    gradient('manga-vino', '#896371', '#483043')
    + gradient('manga-azul', '#536a75', '#293c4d')
    + gradient('mano-reclamante', '#dfba93', '#b68a6c')
    + gradient('mano-comprador', '#c69772', '#986b51')
    + gradient('canto-escritorio-2d', '#8b6949', '#4b382c')
    + gradient('suelo-2d', '#615948', '#282f2b')
    + gradient('tablero-2d', '#ab8a62', '#6f5038')
    + gradient('tablero-cenital-2d', '#a08461', '#524134', True)
)

VESTUARIO = {
    'reclamante': {
        '#415b51':'#604454', '#40594f':'#5d4051', '#4e665a':'#785765',
        '#44594f':'#674759', '#465f54':'#634556', '#465e54':'#654457',
        '#698177':'#8a6473', '#768b7d':'#987181', '#2d4238':'#45333e',
        '#364e42':'#553d4b', '#b7b794':'#c29c9d', '#97a38a':'#b08c91',
        '#a8b297':'#c09ba0', '#ddd2b2':'#d9c1a0',
    },
    'comerciante': {
        '#415b51':'#354b5b', '#40594f':'#344858', '#4e665a':'#435b6a',
        '#2d4238':'#253542', '#354e41':'#33495a', '#4f6658':'#4b6270',
        '#b7b794':'#a6abb0',
    },
}

ARM_ANGLES = {'reclamante': (-9, -27, -32, -25), 'comerciante': (-18, -13, -13, -43)}
WIDE_PAPER_GRIP = (21, 234)
WIDE_ZOOM = 1.84
WIDE_LAND_Y = 345
OVERHEAD_AT = 2.50


def costume(art, role):
    for source, target in VESTUARIO[role].items():
        art = art.replace(source, target)
    return art


def position(art, x, y, scale=1, angle=0, **attrs):
    return group(art, transform=f'translate({x} {y}) rotate({angle}) scale({scale})', **attrs)


def table():
    art = group(ellipse(640, 600, 240, 42, '#212823'), opacity=.62)
    for x, lean in ((446, -23), (800, 18)):
        art += path(f'M{x} 403 h42 q-7 32 -9 69 l{lean} 113 h-25 l{-lean} -114 Z',
                    'url(#canto-escritorio-2d)', '#4e4033', 2)
        art += path(f'M{x+8} 438 q3 36 {lean+4} 137', stroke='#a68156', line=2)
    art += path('M405 391 L883 391 L871 433 L417 433 Z', 'url(#canto-escritorio-2d)', '#49392e', 2)
    art += path('M417 405 H870 M425 421 H863', stroke='#9d7851', line=1.5)
    art += path('M428 325 H847 L883 391 Q647 401 405 391 Z', 'url(#tablero-2d)', '#463b2e', 2.6)
    art += path('M420 383 Q647 390 871 383 L844 331 H433 Z',stroke='#d0a778',line=1.2)
    art += path('M432 344 H850 M426 365 Q639 369 865 365 M581 407 H711 V426 H581 Z',
                stroke='#a7855d',line=1.2)
    art += path('M637 413 Q648 420 656 413',stroke='#ccab70',line=2.8)
    art += ellipse(819,333,12,3.5,'#524432')
    art += path('M810 326 L813 320 H823 L828 327 L826 332 H811 Z','#495c4f','#35443a',1.4)
    art += path('M819 323 Q819 307 834 301 Q833 312 821 319', '#b7a782','#8e795e',1)
    return art


def turn_point(x, y, angle):
    a = radians(angle)
    return x*cos(a)-y*sin(a), x*sin(a)+y*cos(a)


def wide_paper(reach):
    # La mano y el folio comparten el punto de pinza en coordenadas del rig.
    shoulder, shoulder_delta, elbow, elbow_delta = ARM_ANGLES['reclamante']
    dx, dy = turn_point(618-572, 714-519, elbow+elbow_delta*reach)
    dx, dy = turn_point(572-526+dx, 519-391+dy, shoulder+shoulder_delta*reach)
    grip_x, grip_y = 85+.485*(526+dx), 78+.485*(391+dy)
    angle = -9+6*reach
    offset_x, offset_y = turn_point(*WIDE_PAPER_GRIP, angle)
    folio = position(claim_leaf(), -offset_x*.23, -offset_y*.23, .23, angle)
    thumb = path('M-10 -4 Q-3 -10 5 -8 Q11 -6 9 -2 Q5 2 -3 1', '#cba782', '#866650', .95)
    return position(folio+thumb, grip_x, grip_y, data_motion='folio-plano-general')


def actor(role, reaching):
    """La silueta se conserva y se articula el brazo más cercano a la mesa."""
    source = PEOPLE/role/(role+'.svg')
    near = {'_12_brazo_cercano', '_13_antebrazo_cercano', '_14_mano_cercana'}
    all_layers = {n.get('id') for n in read_svg(source).iter() if (n.get('id') or '').startswith('_')}
    body = costume(asset(source, 0, 0, 900, 1200, named=all_layers-near), role)
    upper = costume(asset(source, 0, 0, 900, 1200, named={'_12_brazo_cercano'}), role)
    lower = costume(asset(source, 0, 0, 900, 1200, named=near-{'_12_brazo_cercano'}), role)
    shoulder, shoulder_delta, elbow, elbow_delta = ARM_ANGLES[role]
    elbow += elbow_delta*reaching
    shoulder += shoulder_delta*reaching
    lower = group(lower, transform=f'rotate({elbow} 572 519)', data_motion=f'{role}-codo')
    arm = group(upper+lower, transform=f'rotate({shoulder} 526 391)', data_motion=f'{role}-hombro')
    return body+arm


def wide(exchange_envelope, progress, live=False):
    # A la entrada se ve el suelo; al avanzar se conserva el centro entre ambos actores.
    zoom = 1+(WIDE_ZOOM-1)*progress
    center_y = 376+(WIDE_LAND_Y-376)*progress
    backdrop = f'translate({-13*progress:.2f} {-8*progress:.2f}) scale({1+.027*progress:.4f})'
    art = group(room(), transform=backdrop, data_motion='fondo')+table()
    art += position(actor('reclamante', progress), 85, 78, .485)
    buyer = group(actor('comerciante', progress), transform='translate(1190 61) scale(-.51 .51)')
    art += buyer
    art += wide_paper(progress)
    art += position(exchange_envelope, 756, 340, .23, -6)
    rng = Random(29)
    dust = ''
    for _ in range(19):
        cx, cy = rng.randint(530, 792), rng.randint(176, 416)
        dust += circle(cx, cy, rng.choice((.9, 1.2, 1.7)), '#f1dbab')
    art += group(dust, opacity=.35, data_motion='motas')
    camera = f'translate(640 376) scale({zoom:.4f}) translate(-640 {-center_y:.2f})'
    body = group(art, transform=camera, data_motion='camara')
    body += vignette(.57)
    if live or progress < .1:
        body += group(label('Antes del reconocimiento', 640, 66, 34, CREAM, 'middle', bold=True),
                      data_motion='retroceso')
        body += group(label('Reclamante', 305, 670, 27, CREAM, 'middle')
                      +label('Comprador', 957, 670, 27, CREAM, 'middle'),
                      opacity=1-progress, data_motion='nombres')
    return body


def hands(role, pose):
    """Dibuja la muñeca con el punto de contacto en (0, 0)."""
    is_claimant = role == 'reclamante'
    skin = 'url(#mano-reclamante)' if is_claimant else 'url(#mano-comprador)'
    sleeve = 'url(#manga-vino)' if is_claimant else 'url(#manga-azul)'
    seam = '#aa8791' if is_claimant else '#879aa4'
    edge = '#4c3540' if is_claimant else '#2c3841'
    upper = 'M-562 138 L-346 9 Q-326 -3 -301 11 L-276 60 Q-274 82 -302 101 L-527 222 Z'
    forearm = 'M-333 11 Q-317 0 -293 -1 L-123 -37 L-110 50 L-286 93 Q-313 98 -329 78 Z'
    art = shading(upper,0,6)+path(upper,sleeve,edge,3)
    art += path('M-535 154 L-345 47',stroke=seam,line=2.1)
    art += shading(forearm,0,5)+path(forearm,sleeve,edge,3)
    art += path('M-299 22 L-145 -10 M-295 73 L-146 36',stroke=seam,line=2)
    if is_claimant:
        cuff = 'M-138 -37 Q-118 -50 -104 -37 L-91 40 Q-105 57 -127 52 Z'
        art += path(cuff, '#ceb28f', '#74554f', 2)
        art += path('M-131 -34 Q-113 -31 -105 -38 M-122 46 Q-108 47 -95 35',
                    stroke='#f0d8b5', line=2)
        for y in (-25, -11, 3, 17, 31):
            art += ellipse(-113+(y+25)*.11, y, 4, 3, '#b08f7d')
    else:
        art += path('M-147 -30 L-101 -41 L-86 38 L-132 49 Z', '#e4d7bd', '#6c6f67', 2)
        art += path('M-138 -20 L-127 39', stroke='#b5aa91', line=1.7)
        for x, y in ((-155, 19), (-178, 26)):
            art += circle(x, y, 6, '#bd9b60', '#6e573d', 1.6)
            art += circle(x-1, y-2, 1.4, '#e9ca8e')
    if pose=='open':
        outline = (
            'M-108 -32 Q-84 -39 -69 -50 L-43 -78 Q-36 -84 -30 -79 Q-26 -75 -32 -66 L-43 -48 '
            'L-6 -77 Q4 -84 10 -75 Q13 -68 4 -60 L-24 -34 L11 -55 Q22 -60 26 -51 Q29 -43 19 -36 '
            'L-17 -14 L11 -26 Q23 -30 26 -20 Q27 -13 17 -7 L-34 23 Q-48 43 -74 45 L-97 38 Z'
        )
        art += path(outline, skin, edge, 2.7)
        art += path('M-70 34 Q-78 10 -61 -13 M-60 0 Q-38 -1 -31 -16', stroke='#8f654d', line=2)
        return art, ''
    outline = (
        'M-107 -31 Q-87 -32 -70 -41 Q-48 -51 -33 -36 L-6 -16 '
        'Q10 -7 6 7 L1 26 Q-5 37 -16 32 Q-26 44 -37 37 Q-50 45 -61 35 Q-82 42 -97 34 Z'
        if is_claimant else
        'M-103 -32 L-72 -37 Q-56 -46 -39 -37 Q-15 -30 1 -13 Q18 2 9 15 Q4 27 -8 26 '
        'Q-9 42 -23 38 Q-36 50 -51 38 Q-68 48 -91 37 L-95 36 Z'
    )
    art += path(outline, skin, edge, 2.7)
    art += path('M-75 23 Q-55 12 -49 -11 M-38 32 L-31 18 M-18 28 L-11 13',
                stroke='#956a50', line=1.8)
    thumb = 'M-59 22 Q-48 0 -30 -12 Q-18 -21 1 -15 Q12 -11 11 -4 Q8 7 -7 6 L-25 8 Q-37 17 -43 30'
    if not is_claimant:
        thumb = 'M-60 16 Q-51 -9 -31 -17 Q-9 -26 5 -14 Q14 -7 10 2 Q4 9 -9 4 Q-23 1 -31 13 L-41 29'
    top = path(thumb, skin, '#825a48', 2.25)
    top += path('M-7 -12 Q1 -14 5 -8', stroke='#edd0aa', line=1.75)
    return art, top


# El folio tiene una sola posición por estado. Los puntos de contacto se derivan de ella.
# t, x, y, inclinación, x del sobre, y del sobre, giro del sobre
CLOSE = [
    (1.8, 224, 169, -8, 920, 510, 2),
    (2.65, 355, 179, -4, 920, 510, 2),
    (3.43, 455, 180, 0, 919, 510, 2),
    (3.60, 460, 182, 1.2, 919, 510, 2),
    (4.06, 460, 180, 0, 910, 510, 2),
    (5.20, 711, 180, 3, 676, 513, -1),
    (6.57, 752, 182, 3, 280, 512, -4),
    (6.80, 752, 182, 3, 269, 512, -2),
    (7.40, 752, 182, 3, 269, 512, -2),
]


def grip_point(x, y, angle, side):
    a = radians(angle)
    dx, dy = ((21 if side=='left' else 627)*.56, 284*.56)
    return x+dx*cos(a)-dy*sin(a), y+dx*sin(a)+dy*cos(a)


def hand_transform(x, y, side, tilt=0):
    scale = '1 1' if side=='left' else '-1 1'
    return f'translate({x:.2f} {y:.2f}) rotate({tilt}) scale({scale})'


def hand_groups(role, pose, x, y, side, key, tilt=0):
    back, front = hands(role, pose)
    transform = hand_transform(x, y, side, tilt)
    return (group(back, transform=transform, data_motion=f'{key}-base'),
            group(front, transform=transform, data_motion=f'{key}-pulgar'))


def close(exchange_envelope, index, live=False):
    _,x,y,angle,sx,sy,sa = CLOSE[index]
    art = overhead_desk()+group(paper_light(665, 357, 596, 395, .50), data_motion='luz-cenital')
    lp = grip_point(x, y, angle, 'left')
    rp = grip_point(x, y, angle, 'right')
    bases, fingers = '', ''
    if index <= 4 or live:
        back, top = hand_groups('reclamante', 'grip', *lp, 'left', 'izquierda')
        bases += back
        fingers += top
    if index >= 2 or live:
        back, top = hand_groups('comerciante', 'grip', *rp, 'right', 'derecha')
        bases += back
        fingers += top
    if index <= 1 or live:
        back, _ = hand_groups('comerciante', 'open', 1040 if not index else 846, 365, 'right', 'receptora')
        bases += back
    art += bases+position(claim_leaf(), x, y, .56, angle, data_motion='folio')
    art += fingers+position(exchange_envelope, sx, sy, .64, sa, data_motion='sobre')
    if index >= 6 or live:
        back, _ = hand_groups('reclamante', 'open', 286, 571, 'left', 'pago', -28)
        art += back
    if index >= 5 or live:
        trace = path('M827 671 Q667 676 461 665 M476 656 L461 665 L477 676',
                     stroke='#dfc080', line=2.8)
        art += group(trace, opacity=.65, data_motion='rastro')
    art += vignette(.63)
    return art


def overhead_desk():
    art = wood().replace('url(#nogal)','url(#tablero-cenital-2d)')
    art += ellipse(1127,85,37,28,'#40362c')
    art += ellipse(1119,78,35,28,'#3f5145')+ellipse(1119,78,20,16,'#25342d')
    art += path('M1117 80 Q1145 33 1207 21 Q1208 37 1196 44 L1151 63 L1121 84',
                '#b7a17b','#7e674c',1.9)
    art += path('M1118 85 Q1154 47 1203 26',stroke='#e4ce9e',line=1.45)
    return art


def character_piece(role):
    return actor(role, 0)


def hand_piece(role, pose):
    back, thumb = hands(role, pose)
    return position(group(back,id='base')+group(thumb,id='pulgar'),603,92)


def preview(exchange_envelope, definitions):
    scene = group(wide(exchange_envelope, 0, live=True), id='general')
    scene += group(close(exchange_envelope, 0, live=True), id='cenital', display='none')
    art = svg(scene, W, H, definitions)
    template = (HERE/'traspaso-reclamo.html').read_text(encoding='utf-8')
    return (template.replace('{{ESCENA}}', art)
            .replace('{{TIEMPOS}}', json.dumps(CLOSE))
            .replace('{{CAMARA}}', json.dumps({'cenital':OVERHEAD_AT,'zoom':WIDE_ZOOM,'centro_y':WIDE_LAND_Y}))
            .replace('{{BRAZOS}}', json.dumps(ARM_ANGLES)))
