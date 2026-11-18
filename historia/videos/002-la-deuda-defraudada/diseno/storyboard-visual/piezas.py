"""Piezas vectoriales para los encuadres del episodio 002."""
from copy import deepcopy
from functools import lru_cache
from html import escape
from itertools import count
from pathlib import Path
import re
import xml.etree.ElementTree as ET

HERE = Path(__file__).resolve().parent
PROJECT = HERE.parents[3]
DISENO = HERE.parent
LONG = DISENO / 'escenas-largas'
PEOPLE = DISENO / 'personajes-1850'
OPENING = PROJECT / 'laboratorio/muestras/15-islas-y-el-pais/public/prueba-002'
NOVOA = HERE / 'recursos/novoa'
NS = 'http://www.w3.org/2000/svg'
SVG = '{' + NS + '}'
ET.register_namespace('', NS)
ET.register_namespace('xlink', 'http://www.w3.org/1999/xlink')

CREAM = '#f0e6ca'
INK = '#314536'
GOLD = '#d4b574'
RUST = '#ac6452'
PALE = '#a9b698'
ids = count()


def group(content, **attrs):
    settings = ''.join(f' {key.replace("_", "-")}="{escape(str(value), quote=True)}"' for key, value in attrs.items())
    return f'<g{settings}>{content}</g>'


def rect(x, y, w, h, fill, stroke='none', line=1, radius=0):
    return f'<rect x="{x}" y="{y}" width="{w}" height="{h}" rx="{radius}" fill="{fill}" stroke="{stroke}" stroke-width="{line}"/>'


def path(points, fill='none', stroke='none', line=1):
    return f'<path d="{points}" fill="{fill}" stroke="{stroke}" stroke-width="{line}" stroke-linecap="round" stroke-linejoin="round"/>'


def circle(x, y, r, fill, stroke='none', line=1):
    return f'<circle cx="{x}" cy="{y}" r="{r}" fill="{fill}" stroke="{stroke}" stroke-width="{line}"/>'


def ellipse(x, y, rx, ry, fill):
    return f'<ellipse cx="{x}" cy="{y}" rx="{rx}" ry="{ry}" fill="{fill}"/>'


def label(text, x, y, size=26, color=CREAM, anchor='start', font='Georgia', bold=False):
    return (f'<text x="{x}" y="{y}" fill="{color}" font-size="{size}" font-family="{font}" '
            f'font-weight="{700 if bold else 400}" text-anchor="{anchor}">{escape(text)}</text>')


def arrow(x1, y1, x2, y2, color=GOLD):
    from math import atan2, cos, sin
    angle = atan2(y2-y1, x2-x1)
    a = (x2-17*cos(angle-.52), y2-17*sin(angle-.52))
    b = (x2-17*cos(angle+.52), y2-17*sin(angle+.52))
    return path(f'M{x1} {y1} L{x2} {y2} M{a[0]:.2f} {a[1]:.2f} L{x2} {y2} L{b[0]:.2f} {b[1]:.2f}', stroke=color, line=4)


def gradient(name, a, b, radial=False):
    if radial:
        return (f'<radialGradient id="{name}" cx=".48" cy=".4" r=".76"><stop stop-color="{a}"/>'
                f'<stop offset="1" stop-color="{b}"/></radialGradient>')
    return (f'<linearGradient id="{name}" x2="0" y2="1"><stop stop-color="{a}"/>'
            f'<stop offset="1" stop-color="{b}"/></linearGradient>')


def paper_defs():
    return (gradient('board', '#4d6650', '#20372f', True)
            + gradient('wood', '#7e7052', '#4c4436', True)
            + gradient('paper', '#f0e1bd', '#c4ae86')
            + gradient('folder', '#a28155', '#6c563e')
            + gradient('light', '#e4c28244', '#e4c28200', True))


def svg(body, w=960, h=540, defs=''):
    return (f'<svg xmlns="{NS}" width="{w}" height="{h}" viewBox="0 0 {w} {h}">'
            f'<defs>{paper_defs()}{defs}</defs>{body}</svg>')


@lru_cache
def read_svg(file):
    return ET.parse(file).getroot()


def is_outline(node):
    return (node.tag == SVG+'g' and not node.attrib and len(node) == 1
            and node[0].tag == SVG+'path' and set(node[0].attrib) == {'d', 'fill'})


def omit_notes(node):
    for child in list(node):
        if child.tag == SVG+'text' or is_outline(child):
            node.remove(child)
        elif child.tag == SVG+'rect' and float(child.get('y', '0')) >= 570 and float(child.get('height', '0')) <= 45:
            node.remove(child)
        elif child.tag == SVG+'rect' and child.get('fill') == '#2d4838' and child.get('width') == '420':
            node.remove(child)
        else:
            omit_notes(child)


def asset(file, x=0, y=0, w=960, h=540, *, notes=True, box=None, layers=None, named=None):
    root = deepcopy(read_svg(Path(file)))
    if layers is not None:
        for index, layer in enumerate(root.findall(SVG+'g')):
            if index not in layers:
                root.remove(layer)
    if named:
        def keep(node):
            if node.tag == SVG+'defs':
                return True
            keys = {node.get('id'), node.get('data-name')}
            if keys.intersection(named):
                return True
            for child in list(node):
                if not keep(child):
                    node.remove(child)
            return len(node) > 0

        keep(root)
    original = root.get('viewBox') or f"0 0 {root.get('width')} {root.get('height')}"
    bx, by, bw, bh = (float(value) for value in (box or original).replace(',', ' ').split())
    if not notes:
        for child in root:
            if child.tag != SVG+'defs':
                omit_notes(child)
    prefix = f'art{next(ids)}-'
    replacements = {node.get('id'): prefix+node.get('id') for node in root.iter() if node.get('id')}
    for node in root.iter():
        for key, value in list(node.attrib.items()):
            if key == 'id':
                node.set(key, replacements[value])
            elif value.startswith('#') and value[1:] in replacements:
                node.set(key, '#'+replacements[value[1:]])
            elif 'url(#' in value:
                node.set(key, re.sub(r'url\(#([^)]+)\)', lambda m: 'url(#'+replacements.get(m[1], m[1])+')', value))
    body = ''.join(ET.tostring(child, encoding='unicode') for child in root if child.tag not in (SVG+'title', SVG+'desc'))
    return group(body, transform=f'translate({x} {y}) scale({w/bw:.7f} {h/bh:.7f}) translate({-bx} {-by})')


def existing(folder, name):
    return asset(LONG/'recursos'/folder/(name+'.svg'), notes=False)


def landscape():
    return ''.join(asset(OPENING/(name+'.svg')) for name in ('02_mar_chincha','03_roca_chincha','04_aves_chincha'))


def board():
    return rect(0, 0, 960, 540, 'url(#board)') + rect(10, 10, 940, 520, 'none', '#8e8968', 2, 2)


def desk():
    grain = ''.join(path(f'M0 {y} Q260 {y-21} 530 {y+4} T960 {y-8}', stroke='#a18e60', line=.7)
                    for y in range(25, 548, 33))
    return rect(0, 0, 960, 540, 'url(#wood)') + grain + rect(0, 0, 960, 540, 'url(#light)')


def office():
    return asset(NOVOA/'oficina.svg')


def paper(x, y, w=240, h=285, *, tab=True, lines=True, angle=0, bond=False):
    body = (rect(8, 9, w, h, '#25382c', radius=2)
            + rect(0, 0, w, h, 'url(#paper)', '#ae9a71', 1.5, 2)
            + rect(9, 9, w-18, h-18, 'none', '#bca780', 1)
            + path(f'M{w-28} 0 L{w} 28 H{w-28} Z', '#f2e5c4', '#b5a57c', 1))
    if tab:
        body += rect(19, -6, 14, 43, RUST, '#d09673', 1)
    if bond:
        body += rect(15, 15, w-30, h-30, 'none', '#53674d', 2)
        body += circle(w*.5, h*.38, min(w,h)*.12, 'none', '#8e8763', 2)
    if lines:
        for i, length in enumerate((.72, .82, .60, .77)):
            yy = h*.40 + i*h*.115
            body += path(f'M{w*.11} {yy} h{w*length}', stroke='#9b8d69', line=2)
    return group(body, transform=f'translate({x} {y}) rotate({angle} {w/2} {h/2})')


def folder(x, y, w=280, h=190, *, angle=0, open=False):
    tab = path(f'M0 30 V12 Q0 2 12 2 H{w*.36} L{w*.43} 30 H{w} V{h} H0 Z',
               '#9c7b50', '#c6a578', 2)
    interior = paper(w*.09, 21, w*.82, h*.83, angle=-2) if open else ''
    front = path(f'M0 {h*.24 if open else 30} H{w} L{w-12} {h} H10 Z',
                 'url(#folder)', '#c09e6c', 2)
    if open:
        front = path(f'M0 {h*.67} H{w} L{w-12} {h} H10 Z', 'url(#folder)', '#c09e6c', 2)
    return group(rect(8, 15, w, h, '#2e3428', radius=3)+tab+interior+front,
                 transform=f'translate({x} {y}) rotate({angle} {w/2} {h/2})')


def stack(x, y, n=4, w=220, h=140):
    return ''.join(folder(x+i*5, y-i*13, w, h, angle=(-1)**i*2) for i in range(n))


def book(x, y, w=360, h=220, closed=False):
    if closed:
        return (rect(x+9,y+9,w,h,'#20352d',radius=8)
                + rect(x,y,w,h,'#465645','#b29a68',2,8)
                + rect(x+15,y+13,w-30,h-26,'none','#b29a68',2,3)
                + path(f'M{x+29} {y+6} V{y+h-7}', stroke='#a19364',line=3))
    return asset(OPENING/'libro.svg',x,y,w,h)


def person(role, x, y, w=285, h=350, pose='atencion'):
    return asset(PEOPLE/'bustos'/f'busto-{role}-{pose}.svg', x, y, w, h)


def building(x=570, y=166, w=330, h=188):
    return asset(OPENING/'estado.svg', x, y, w, h)


def tray(x=654, y=135, w=253, h=300):
    return (rect(x+8,y+9,w,h,'#403b2e',radius=13)
            + rect(x,y,w,h,'#ad9161','#d8ba87',2,13)
            + rect(x+14,y+13,w-28,h-28,'#66583c','#b09764',2,10)
            + path(f'M{x+18} {y+h-16} H{x+w-18}',stroke='#e1bf88',line=4))


def hand(x, y, *, mirror=False, tone='#bd9069', sleeve='#405948', point=False):
    """Mano y puño en vista cenital. El origen se sitúa en el borde del folio."""
    cuff = path('M-730 40 L-54 -11 L-49 43 L-730 104 Z', sleeve, '#2b4238', 2)
    cuff += path('M-62 -8 L-30 -6 L-24 42 L-57 47 Z', '#ded2aa', '#a9976f', 1)
    fingers = ('M-34 2 C-22 -4 -13 -4 -4 -7 L44 -12 Q53 -10 48 -4 L9 9 '
               'Q25 11 26 18 L25 32 Q21 47 2 45 L-32 36 Z') if point else (
               'M-34 1 Q-18 -9 -4 -7 L26 -11 Q38 -10 33 -2 L15 5 L34 4 Q43 5 38 13 '
               'L19 20 L30 19 Q38 23 31 30 L13 37 Q16 43 6 47 L-32 36 Z')
    skin = path(fingers,tone,'#745b47',2)+path('M-13 11 Q0 9 10 10 M-14 22 Q-4 19 5 21',stroke='#9c7456',line=1.4)
    return group(cuff+skin, transform=f'translate({x} {y}) scale({-1 if mirror else 1} 1)')


def focus(x, y, r, color=GOLD):
    return circle(x,y,r,'none',color,3) + circle(x,y,r+9,'none',color,1)


def seal(x, y, size=28):
    return circle(x,y,size,'none','#627c5b',4) + path(
        f'M{x-size*.52} {y} l{size*.36} {size*.34} l{size*.67} {-size*.74}',stroke='#627c5b',line=5)


def calendar(x, y, w=250, h=175, count=12, index=6):
    body = rect(x,y,w,h,'url(#paper)','#bca780',1.5,3)+rect(x,y,w,24,'#805346')
    for i in range(count):
        px=x+20+(i%6)*(w-30)/6
        py=y+42+(i//6)*(h-46)/2
        body += rect(px,py,22,21,'#a08059' if i<=index else '#d5c097',radius=2)
    return body


def coin(x, y, size=27):
    return (ellipse(x+4,y+6,size,size*.37,'#846643')
            + ellipse(x,y,size,size*.37,'#c8a462')
            + ellipse(x,y,size*.75,size*.25,'#d9b77a'))


def magnifier(x, y, r=58):
    return circle(x,y,r,'#a6b89225','#d1b483',8) + path(
        f'M{x+r*.68} {y+r*.69} l53 55', stroke='#bb9664', line=13)
