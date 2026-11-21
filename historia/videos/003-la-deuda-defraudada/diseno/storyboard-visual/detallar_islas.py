"""Láminas de Las islas y el país. Escenografía, recursos y poses por separado."""
from dataclasses import dataclass
from math import sin
from random import Random
import json

from piezas import (
    HERE, PROJECT, DISENO, LONG, PEOPLE, OPENING, NOVOA,
    CREAM, INK, GOLD, group, rect, path, circle, ellipse,
    label, arrow, gradient, asset, svg, read_svg, coin, person,
)
from detallar_novoa import wood, shading, DEFS as DESK_DEFS

OUT = HERE/'revision-islas'
R2 = LONG/'recursos/revision-02'
KIT = DISENO/'storyboard-seccion01/revision-detallada/recursos/chincha-gran-bretana'
SAMPLE = PROJECT/'laboratorio/muestras/15-islas-y-el-pais'
W, H = 1280, 720
DEFS = DESK_DEFS + (
    gradient('cielo-costa','#9bb1a0','#466d6c')
    + gradient('agua-costa','#78a9a5','#2d5863')
    + gradient('costa-oliva','#707c59','#3d5345')
    + gradient('piedra-estrato','#a79b72','#504f3d')
    + gradient('sedimento','#e1cc99','#90764d')
    + gradient('lienzo-saco','#e8d5a0','#998057')
    + gradient('hierro-pala','#86948b','#354b46')
    + gradient('mango-madera','#c3a779','#786044')
    + gradient('madera-muelle','#b29969','#5f513a')
    + gradient('cubierta','#bda47a','#635339')
    + gradient('papel-hoja','#f7eac8','#c5ac7d')
    + gradient('papel-izq','#e7d7ac','#bda678')
    + gradient('tapa-libro','#6c664a','#344a40')
    + gradient('tapeta-folio','#a78757','#64523c')
    + '<linearGradient id="lomo-sombra" x1="0" x2="1"><stop stop-color="#514532" stop-opacity="0"/>'
      '<stop offset=".5" stop-color="#514532" stop-opacity=".53"/><stop offset="1" stop-color="#514532" stop-opacity="0"/></linearGradient>'
    + '<radialGradient id="brillo-costa"><stop stop-color="#f2e3b7" stop-opacity=".55"/>'
      '<stop offset=".52" stop-color="#f2e3b7" stop-opacity=".16"/><stop offset="1" stop-color="#f2e3b7" stop-opacity="0"/></radialGradient>'
)


@dataclass(frozen=True)
class Panel:
    title: str
    image: str
    direction: tuple[str, str]


@dataclass(frozen=True)
class Sequence:
    code: str
    title: str
    panels: tuple[Panel, ...]
    change: str
    link: str


def clipped(content, box, ident):
    x,y,w,h = box
    return (f'<defs><clipPath id="{ident}">{rect(x,y,w,h,"white")}</clipPath></defs>'
            +group(content,clip_path=f'url(#{ident})'))


def paper_light(x,y,rx,ry,opacity=.64):
    return group(ellipse(x,y,rx,ry,'url(#brillo-costa)'),opacity=opacity)


def vignette(opacity=.72):
    return group(rect(0,0,W,H,'url(#vineta-novoa)'),opacity=opacity)


def grain(seed, box, number, colors, opacity=.32):
    rng = Random(seed)
    x,y,w,h = box
    return group(''.join(ellipse(round(x+rng.random()*w,2),round(y+rng.random()*h,2),
                                 .5+rng.random()*1.75,.4+rng.random()*.9,colors[i%len(colors)])
                         for i in range(number)),opacity=opacity)


def sky():
    art = rect(0,0,W,H,'url(#cielo-costa)')
    art += paper_light(1000,216,645,340,.43)
    for x,y,scale in ((65,125,1.25),(534,139,1.05),(907,81,.9)):
        haze = path('M0 38 Q52 15 132 24 Q195 12 330 32 Q186 44 0 38 Z','#d1d2b8')
        haze += path('M16 52 Q114 45 283 48 M49 59 Q157 53 239 55',stroke='#d9dbc4',line=1.5)
        art += group(haze,transform=f'translate({x} {y}) scale({scale})',opacity=.28)
    return art


def ocean(horizon=484,phase=0):
    art = rect(0,horizon,W,H-horizon,'url(#agua-costa)')
    art += path(f'M0 {horizon} H1280',stroke='#c3d1ad',line=1.5)
    art += waves(horizon,phase)
    return art


def waves(horizon=484,phase=0):
    rng=Random(605)
    art=''
    for i in range(76):
        depth=rng.random()
        y=horizon+8+(H-horizon-11)*depth
        x=(rng.uniform(-160,W)+phase*(7+depth*22))%(W+135)-45
        length=15+rng.random()*(42+124*depth)
        height=(1.4+depth*2.8)*sin(i*.62)
        ripple=path(f'M{x:.1f} {y:.1f} q{length*.42:.1f} {height:.1f} {length:.1f} .4',
                    stroke=('#c4d3ac' if i%3 else '#abc8c1'),line=.7+depth*.9)
        art += group(ripple,opacity=.19+(i%4)*.055)
    return art


def pin(x,y,text,side='right',color=CREAM):
    sign=1 if side=='right' else -1
    return (circle(x,y,16,'none','#c7a970',2)+circle(x,y,6,GOLD,'#f2e6bd',1.6)
            +path(f'M{x+sign*18} {y} l{sign*45} -17',stroke=GOLD,line=2)
            +label(text,x+sign*75,y-12,27,color,'start' if sign>0 else 'end'))


def map_frame(zoom=False):
    geo=json.loads((SAMPLE/'geografia.json').read_text(encoding='utf-8'))
    pisco,chincha=geo['pisco']['punto'],geo['chincha']['punto']
    if zoom:
        zoom_value=geo['camara']['escala_final']
        anchor=geo['camara']['ancla_pisco']
        box=f'{pisco[0]-anchor[0]/zoom_value} {pisco[1]-anchor[1]/zoom_value} {1920/zoom_value} {1080/zoom_value}'
        loc=[v*W/1920 for v in anchor]
        islands=[loc[i]+(chincha[i]-pisco[i])*zoom_value*W/1920 for i in range(2)]
    else:
        box=None
        loc=[v*W/1920 for v in pisco]
    art=rect(0,0,W,H,'url(#agua-costa)')+paper_light(477,350,720,495,.2)
    art+=asset(OPENING/'mapa-peru.svg',0,0,W,H,box=box)
    art+=pin(*loc,'Pisco',side='left' if not zoom else 'right',color=INK if zoom else CREAM)
    if zoom:
        art+=pin(*islands,'Chincha',side='left')
    else:
        art+=label('Perú',814,190,62,CREAM)
        art+=label('Hacia 1850',815,235,27,CREAM)
    art+=label('Océano Pacífico',77,603,29,'#d4ddd0')
    return art+vignette(.46)


def pisco_frame(travel=False):
    art=sky()+ocean(452,1 if travel else 0)
    shift=617 if travel else 0
    for name in ('pisco-dunas','pisco-costa','pisco-ciudad'):
        delta=shift*.53 if name=='pisco-dunas' else shift
        art+=asset(OPENING/(name+'.svg'),delta,-5,W,H)
    if travel:
        art+=island_art(-135,132,761,365)
        art+=group(path('M129 484 Q258 493 373 483 T555 488',stroke='#d5deba',line=2.2),opacity=.48)
    else:
        art+=label('Pisco',1006,293,45,CREAM,'middle')
        art+=group(path('M705 492 Q791 504 872 566 Q911 599 942 664',stroke='#d4ddbd',line=2.8),opacity=.57)
    return art+vignette(.45)


def island_art(x,y,w,h):
    # Los estratos y las aves vienen del grabado v3 en su encuadre de origen.
    return ''.join(asset(OPENING/(name+'.svg'),x,y,w,h,box='79 226 638 293')
                   for name in ('03_roca_chincha','04_aves_chincha'))


def islands_frame():
    art=sky()+ocean(481,2)
    art+=island_art(160,98,947,435)
    art+=group(path('M184 498 Q224 488 268 501 M360 515 Q405 520 473 511 M721 510 Q831 505 898 520 '
                    'M915 495 Q978 487 1039 498',stroke='#d8dfba',line=2.2),opacity=.54)
    art+=label('Islas de Chincha',123,137,44,CREAM)
    return art+vignette(.54)


def stone_ground(close=False):
    art=sky()
    backdrop=path('M0 265 Q102 247 251 222 L376 208 L509 281 L642 348 L826 331 L990 386 L1280 364 V720 H0 Z',
                  'url(#costa-oliva)')
    art+=backdrop
    art+=path('M0 443 L169 391 L330 407 Q432 423 569 490 L801 511 L1280 503 V720 H0 Z','url(#piedra-estrato)')
    art+=path('M0 564 Q249 517 546 553 Q874 575 1280 543 V720 H0 Z','url(#sedimento)')
    strata=('M0 470 L209 429 L316 433 L454 461 L565 507',
            'M0 495 L211 465 L344 469 L468 491 L524 520',
            'M0 527 L195 502 L332 499 L480 529',
            'M78 442 L89 474 L82 509 M224 414 L240 468 L231 506 M386 440 L394 475 L416 498')
    for points in strata:
        art+=group(path(points,stroke='#5f5f46',line=2.5),opacity=.83)
    art+=grain(47,(0,535,W,181),158,('#594f38','#b69464','#f0d6a1'),.55)
    art+=paper_light(802,534,570,330,.35)
    if close:
        mound='M0 491 L60 480 Q121 394 211 392 Q270 372 324 411 Q407 413 479 484 L581 545 L639 661 L0 680 Z'
        art+=path(mound,'url(#sedimento)','#c2aa78',2.4)
        art+=clipped(grain(411,(0,392,630,282),175,('#68583b','#f1daa7','#a78a5b'),.66),
                     (2,398,619,264),'granos-deposito')
        art+=path('M0 580 Q119 513 235 529 Q370 507 505 553 M0 625 Q191 578 403 590 L572 614',
                  stroke='#cdb083',line=2)
    return art


def sack(opening=True, caption=False):
    edge='M51 42 C29 103 19 198 31 260 Q50 292 112 291 Q177 292 202 266 C213 216 198 98 170 42 Z'
    art=shading(edge,5,5)+path(edge,'url(#lienzo-saco)','#a68d63',2.2)
    crease=path('M55 70 C40 120 43 186 47 228 M167 72 Q190 170 182 233 '
                'M46 258 Q110 278 183 256 M66 92 Q80 114 74 167 M154 93 Q140 137 154 190',
                stroke='#a58d60',line=2)
    art+=crease
    art+=path('M61 86 Q53 144 57 196 M159 84 Q176 139 169 201',
              stroke='#f1dfac',line=1.4)
    for x in range(54,181,8):
        yy=264+sin((x-55)/124*3.14159)*7
        art+=path(f'M{x} {yy:.1f} l3 4',stroke='#8d7954',line=1.45)
    if opening:
        art+=ellipse(112,42,61,13,'#9b8558')+ellipse(112,43,51,8,'#514d37')
        art+=path('M51 42 Q114 63 171 42',stroke='#e7d6a2',line=2.7)
    else:
        art+=path('M52 41 L66 12 Q105 27 155 11 L171 42 Q110 63 52 41 Z','url(#lienzo-saco)','#b89b69',1.6)
        art+=path('M63 36 Q108 49 158 32 M60 41 Q105 53 161 39',stroke='#836d47',line=2.8)
        art+=path('M159 41 Q181 35 174 54 Q164 55 156 46',stroke='#816e4a',line=2)
    if caption:
        art+=label('Guano',113,173,33,'#56654a','middle',bold=True)
    return art


def shovel():
    art=path('M-123 32 L288 58 L286 72 L-125 48 Z','url(#mango-madera)','#8e7550',2)
    art+=path('M-117 37 L283 64',stroke='#d6ba87',line=1.8)
    blade='M267 47 L317 41 Q337 50 369 54 L432 83 Q420 124 360 125 Q311 111 277 81 Z'
    art+=path(blade,'url(#hierro-pala)','#42574b',2.5)
    art+=path('M283 56 Q329 102 401 106 M301 47 Q335 71 408 93',stroke='#c0c7ad',line=1.8)
    art+=circle(281,61,4.4,'#b1b197','#46584c',1.4)
    art+=path('M300 73 Q334 61 374 85 L412 98 Q369 107 321 95 Z','url(#sedimento)','#c6ac79',1.3)
    art+=grain(88,(324,78,66,19),25,('#dbbf86','#9f7d51'),.71)
    return art


def shovel_hand():
    sleeve=path('M-466 -149 L-109 -24 L-34 15 L-63 66 L-164 25 L-486 -77 Z',
                '#d5cda8','#899372',2.2)
    sleeve+=path('M-456 -107 L-148 3 L-64 44 M-109 -24 L-125 21',stroke='#f0e3bb',line=2)
    cuff=path('M-63 -1 L-30 15 L-48 56 L-81 39 Z','#ece2bc','#a79c77',1.8)
    grip=path('M-33 15 L10 27 Q32 20 41 35 Q49 50 41 64 L17 68 L7 60 L-46 55 Z',
              '#c7a074','#78664d',2)
    grip+=path('M5 34 Q24 36 35 45 M10 45 Q24 47 35 53 M12 55 Q25 56 34 61',
               stroke='#997858',line=1.65)
    return sleeve+cuff+grip


def falling_grain():
    rng=Random(328)
    art=''
    for i in range(26):
        progress=i/25
        x=5+progress*64+rng.uniform(-11,11)
        y=2+progress*120
        art+=ellipse(round(x,2),round(y,2),rng.uniform(1.3,3.7),rng.uniform(.9,2.7),
                     ('#ead3a0','#ae9463','#c8ad78')[i%3])
    return art


def extraction_frame(beat):
    if beat==0:
        art=stone_ground()
        face='M0 192 L111 195 L219 281 L282 440 L262 556 L0 599 Z'
        art+=path(face,'url(#sedimento)','#b39d6f',2.4)
        art+=path('M0 413 L137 379 L238 400 M0 473 L144 436 L260 461 M0 517 L168 480 L264 507',
                  stroke='#9a8054',line=2.4)
        art+=grain(62,(8,407,231,126),89,('#e0c98c','#a78a53','#7c704e'),.62)
        art+=asset(R2/'extraccion.svg',0,0,W,H,named=('trabajador_postura_3','saco_testigo',
                   'boca_abierta','material_bajo_pala','guano_desprendido'))
        return art+vignette(.68)
    if beat==1:
        art=stone_ground(True)+paper_light(890,431,372,300,.54)
        art+=group(shovel()+shovel_hand(),transform='translate(425 51) rotate(14 0 50) scale(1.17)')
        art+=group(sack(),transform='translate(797 349) scale(1.13)')
        art+=group(falling_grain(),transform='translate(890 277) scale(.98)')
        return art+vignette(.66)
    art=sky()
    art+=path('M0 325 Q195 231 430 312 T1280 310 V720 H0 Z','#627853')
    art+=path('M0 398 Q356 297 1280 378 V720 H0 Z','#7d885b')
    for i in range(10):
        left=248+i*80
        art+=path(f'M{left} 381 Q{left-20} 533 {left*1.52-502:.1f} 720',stroke='#b2a577',line=4)
        for j in range(4):
            x=left-j*(140-i*12)/3
            y=422+j*67
            art+=group(path(f'M{x:.1f} {y} q-6 -14 -16 -18 m16 18 q5 -14 17 -19',
                            stroke='#c3c99a',line=2.2),opacity=.55)
    art+=ellipse(280,613,120,26,'#506448')
    art+=group(sack(False,True),transform='translate(173 325) scale(.97)')
    return art+vignette(.6)


def timber_support(w=228,h=100):
    top=f'M0 0 H{w} L{w-24} 23 H17 Z'
    art=shading(top,7,7)+path(top,'url(#madera-muelle)','#bcab7b',2)
    art+=path(f'M17 23 H{w-24} V39 H17 Z M23 37 H42 L36 {h} H17 Z M{w-54} 37 H{w-34} L{w-37} {h} H{w-60} Z',
              'url(#cubierta)','#594e38',2)
    for offset in (6,11,16):
        art+=path(f'M{8+offset} {offset} H{w-11-offset}',stroke='#776245',line=.8)
    art+=circle(26,12,2.5,'#5e553d')+circle(w-32,12,2.5,'#5e553d')
    return art


def weight_frame(beat):
    name=f'carga-{beat}'
    art=stone_ground()
    art+=group(timber_support(174,87),transform='translate(311 514) scale(.91)')
    art+=asset(R2/(name+'.svg'),0,0,W,H,named=(f'trabajador_postura_{beat}',))
    art+=paper_light(385+beat*54,408,410,279,.23)
    return art+vignette(.77)


def grip_closeup():
    x,y=211*W/1120,269*H/630
    art=group(weight_frame(1),transform=f'scale({1120/292:.7f}) translate({-x:.4f} {-y:.4f})')
    art+=grain(130,(411,291,161,354),95,('#e6cf9d','#ad986f','#b79e73'),.55)
    art+=paper_light(506,366,560,334,.21)
    return art+vignette(.76)


def dock():
    art=path('M36 533 L521 529 L534 549 L47 551 Z','url(#madera-muelle)','#ccb886',1.8)
    art+=path('M47 551 L534 549 V568 L47 570 Z','url(#cubierta)','#65563c',2)
    for x,y in ((104,559),(237,558),(402,557)):
        art+=path(f'M{x} {y} L{x+15} {y} L{x+27} 706 L{x+12} 708 Z',
                  'url(#madera-muelle)','#66563b',1.75)
    for x in range(67,521,27):
        art+=path(f'M{x} 533 l9 18',stroke='#807052',line=1.35)
        art+=circle(x+7,545,1.65,'#64583f')
    art+=asset(R2/'embarque-0.svg',0,0,W,H,named=('pasarela_editorial',))
    for step in range(12):
        xx=(455+step*17)*W/1120
        yy=(460-step*2.9)*H/630
        art+=group(path(f'M{xx:.1f} {yy:.1f} l6 19',stroke='#8b7951',line=1.55),opacity=.76)
    return art


def embark_frame(beat):
    file=R2/f'embarque-{beat}.svg'
    actor=('trabajador_postura_2','trabajador_postura_0')[beat]
    x,y=((391.36,465.27),(711.36,425.27))[beat]
    x,y=x*W/1120,y*H/630
    art=sky()+ocean(275,beat)
    art+=group(island_art(-192,40,680,314),opacity=.41)
    art+=asset(file,0,0,W,H,named=('chincha-kit-07_barco.svg',))
    art+=dock()
    art+=group(asset(file,0,0,W,H,named=(actor,)),
               transform=f'translate({x:.1f} {y:.1f}) scale(.48) translate({-x:.1f} {-y:.1f})')
    return art+vignette(.61)


def deck():
    art=path('M0 300 L1280 253 V720 H0 Z','url(#cubierta)','#8e7953',2)
    for i in range(12):
        y=301+i*37
        art+=path(f'M0 {y} L1280 {y-45}',stroke='#574a34',line=2.2)
        art+=path(f'M0 {y+4} L1280 {y-40}',stroke='#b79a6c',line=1)
    for x in (91,335,887,1121):
        art+=path(f'M{x} 248 v80 h16 v-81 Z','url(#madera-muelle)','#67583b',1.7)
    art+=path('M0 259 Q268 271 574 248 T1280 215',stroke='#b39768',line=13)
    art+=path('M0 252 Q268 264 574 241 T1280 208',stroke='#d9bf8d',line=2)
    return art


def rope_coil():
    art=ellipse(81,92,68,22,'#4c4533')
    for i in range(6):
        w=62-i*7
        h=20-i*2.1
        art+=path(f'M{81-w} 81 C{81-w} {81-h} {81+w} {81-h} {81+w} 81 '
                  f'C{81+w} {81+h} {81-w} {81+h} {81-w} 81',stroke='#c5a76e',line=2.4)
    art+=path('M83 82 Q145 124 186 92 Q225 61 248 99',stroke='#c6a875',line=3.5)
    return art


def ship_deposit():
    art=sky()+ocean(173,2)+deck()+group(rope_coil(),transform='translate(914 527) rotate(-5 80 80)')
    art+=group(timber_support(292,89),transform='translate(480 529)')
    art+=group(sack(False),transform='translate(519 241) scale(.995)')
    art+=paper_light(643,478,484,261,.31)
    return art+vignette(.65)


def trade_board():
    # El esquema anterior da las relaciones. Las capas se mantienen como piezas independientes.
    art=rect(0,0,W,H,'url(#board)')
    art+=rect(33,36,1214,650,'none','#868b6c',2,5)
    art+=paper_light(618,336,702,442,.17)
    art+=asset(KIT/'origen-detalle.svg',61,138,479,493,notes=False)
    art+=asset(KIT/'destino-detalle.svg',742,135,482,461,notes=False)
    art+=group(sack(False,True),transform='translate(549 253) scale(.65)')
    art+=arrow(533,511,732,511)
    art+=label('Chincha',281,114,35,CREAM,'middle')
    art+=label('Gran Bretaña',986,114,35,CREAM,'middle')
    return art+vignette(.53)


def ledger(named=False):
    cover='M125 152 Q392 98 634 151 Q878 108 1137 147 L1168 608 Q920 579 644 626 Q400 575 118 619 Z'
    cover_art=shading(cover,10,14)+path(cover,'url(#tapa-libro)','#847750',2.7)
    pages=''
    for i in range(7):
        dy=19-i*3
        left='M150 145 Q396 108 637 154 L638 599 Q399 553 145 594 Z'
        right='M637 154 Q898 104 1116 143 L1143 585 Q897 551 638 599 Z'
        pages+=group(path(left,'#d5c093','#9f8b65',1)+path(right,'#d1bc91','#9f8b65',1),
                     transform=f'translate(0 {dy})')
    pages+=path(left,'url(#papel-izq)','#c5af83',1.7)+path(right,'url(#papel-hoja)','#c5af83',1.7)
    spine=rect(609,153,59,445,'url(#lomo-sombra)')
    spine+=path('M637 156 L638 594 M167 151 Q411 116 609 156 M666 155 Q868 116 1103 148',
                stroke='#8d7b58',line=1.5)
    ruling=''
    for x in (181,678):
        for i in range(7):
            y=278+i*37
            ruling+=path(f'M{x} {y} Q{x+210} {y-13} {x+410} {y+1}',stroke='#a9956f',line=.9)
    ruling+=label('Casa consignataria',184,203,24,INK)
    ruling+=label('Antony Gibbs & Sons',183,240,33,INK,bold=True)
    ruling+=label('Cuenta de la venta',683,205,31,INK,bold=True)
    ruling+=path('M683 226 Q880 216 1091 225',stroke='#947e5a',line=1.6)
    parts=(('cubierta-libro',cover_art),('paginas-libro',pages),('lomo-libro',spine),('rayado-y-rotulos',ruling))
    return ''.join(group(content,id=name) if named else content for name,content in parts)


def account_entry(part):
    if part=='venta':
        return (label('Venta del guano',187,330,37,INK,bold=True)
                +path('M188 348 Q370 337 561 347',stroke='#a5885c',line=2.5)
                +label('Consignación',188,381,24,INK))
    if part=='descuentos':
        return (label('Gastos',683,304,35,INK,bold=True)+label('Comisión',683,356,35,INK,bold=True)
                +path('M684 382 Q880 368 1084 381',stroke='#9a8056',line=1.8))
    return (label('Ingreso del Estado',682,471,38,INK,bold=True)
            +path('M682 493 Q866 478 1081 490',stroke='#a66650',line=3.3))


def accounts_frame(beat):
    focus_xy=((334,333),(893,329),(895,461))[beat]
    art=wood()+ledger()+paper_light(*focus_xy,350,191,.51)
    art+=account_entry('venta')
    if beat>0:
        art+=account_entry('descuentos')
    if beat>1:
        art+=account_entry('ingreso')
    return art+vignette(.84)


def receipt(kind,x=0,y=0):
    leaf='M4 5 Q242 0 533 7 L542 259 Q258 264 6 257 Z'
    art=shading(leaf,6,6)+path(leaf,'url(#papel-hoja)','#bca277',1.8)
    art+=path('M23 23 H513 V237 H23 Z',stroke='#ac9569',line=1.1)
    art+=rect(30,-3,19,56,'#a56851','#c79770',1)
    if kind=='prestamo':
        art+=label('Préstamo al gobierno',56,73,37,INK,bold=True)
        art+=label('Un comerciante reclama el cobro',56,133,25,INK)
        art+=label('Solicitud por sustentar',56,197,26,INK)
    else:
        art+=label('Bienes para la tropa',56,73,37,INK,bold=True)
        art+=label('Ganado y cosechas utilizados',56,133,25,INK)
        art+=label('Solicitud de compensación',56,197,26,INK)
    return group(art,transform=f'translate({x} {y})')


def wheat_bundle():
    art=''
    for i in range(9):
        x=24+i*11
        y=26+(i%3)*13
        art+=path(f'M{x} {y} Q{x-17} 96 67 162',stroke='#ad9c67',line=3)
        for n in range(3):
            art+=ellipse(x-7-n*.8,y+n*7,6,3.5,'#d2b77c')
            art+=ellipse(x+5-n*.8,y+n*7+3,5.7,3.3,'#bb9e65')
    art+=path('M52 130 Q66 144 83 131 M51 136 Q72 150 85 136 M74 138 l27 17',
              stroke='#8d7050',line=3.7)
    return art


def basket():
    shape='M18 71 Q141 44 265 70 L247 238 Q146 269 35 234 Z'
    art=shading(shape,5,8)+path(shape,'url(#madera-muelle)','#9c8054',2.3)
    art+=ellipse(142,69,125,22,'#5c5039')
    wheat=group(wheat_bundle(),transform='translate(63 -25) rotate(-12 62 80) scale(1.22)')
    art+=clipped(wheat,(0,-60,279,156),'cosecha-sobre-borde')
    art+=path('M17 68 Q142 111 265 70 L262 89 Q148 129 23 88 Z','#ac9164','#d1b684',1.8)
    for i in range(9):
        y=100+i*15
        art+=path(f'M{28+i*1.5:.1f} {y} Q138 {y+28} {257-i*1.5:.1f} {y+2}',
                  stroke=('#d5b580' if i%2 else '#7f694b'),line=2.4)
    for i in range(15):
        x=34+i*15
        art+=path(f'M{x} 95 Q{x+6} 173 {x+4} 235',stroke='#a78d63',line=1.2)
    return art


def revenue_frame():
    art=rect(0,0,W,H,'url(#board)')
    art+=asset(OPENING/'estado.svg',642,191,537,305)
    art+=paper_light(917,323,490,292,.37)
    art+=label('Ingresos públicos',100,147,42,CREAM)
    for i,name in enumerate(('Guano','Aduanas','Contribución indígena')):
        y=247+i*78
        art+=label(name,102,y,35,CREAM)
        art+=path(f'M425 {y-10} Q488 {y-12} 519 320',stroke='#bca06e',line=2.3)
    art+=arrow(519,320,636,320)+label('Estado peruano',908,556,38,CREAM,'middle')
    return art+vignette(.69)


def obligation_frame(beat):
    if beat==0:
        return revenue_frame()
    art=wood()+paper_light(780,405,559,379,.38)
    if beat==1:
        art=asset(NOVOA/'oficina.svg',0,0,W,H)
        art+=paper_light(498,314,591,370,.33)
        art+=person('comerciante',122,83,329,468)
        art+=path('M0 466 Q619 481 1280 397 V720 H0 Z','url(#nogal)','#a0865c',2)
        for y in range(491,712,25):
            art+=group(path(f'M0 {y} Q628 {y+14} 1280 {y-67}',stroke='#a58c60',line=1.1),opacity=.47)
        art+=group(receipt('prestamo'),transform='translate(594 431) rotate(-4 271 136) scale(.91)')
        art+=coin(177,590,39)+coin(253,599,31)+coin(320,577,35)
    elif beat==2:
        art+=group(basket(),transform='translate(125 255) scale(1.35)')
        art+=receipt('bienes',562,219)
    else:
        art+=group(receipt('bienes',0,0),transform='translate(184 260) rotate(-12 250 140) scale(.69)')
        art+=group(receipt('prestamo',0,0),transform='translate(273 334) rotate(5 250 140) scale(.72)')
        art+=group(folder_cover(),transform='translate(673 191) scale(.68)')
        art+=group(claim_leaf(),transform='translate(722 198) scale(.62)')
    return art+vignette(.66)


def folder_cover():
    shape='M0 53 Q3 14 17 12 H215 L280 62 L647 61 L664 535 L15 549 Z'
    art=shading(shape,10,11)+path(shape,'url(#tapeta-folio)','#bda074',2.3)
    art+=path('M18 68 L628 75 L644 514 L32 530 Z',stroke='#bc9a6b',line=1.6)
    art+=path('M22 81 Q158 90 266 72 M17 534 L655 524',stroke='#a17d53',line=1.2)
    return art


def claim_leaf(recognized=False):
    leaf='M21 27 Q284 20 593 25 L632 62 L625 531 Q324 542 16 535 Z'
    art=shading(leaf,7,7)
    for i in range(5):
        art+=group(path(leaf,'#d4c39b','#9b8968',1),transform=f'translate({i*2} {19-i*3})')
    art+=path(leaf,'url(#papel-hoja)','#c8ac79',1.9)
    art+=path('M594 25 L633 62 L596 64 Z','url(#pliegue)','#b29667',1.15)
    art+=path('M43 51 H585 V503 H41 Z',stroke='#b09970',line=1.05)
    art+=path('M52 15 L82 14 L84 93 L66 84 L53 94 Z','#a86a54','#cc9571',1.4)
    art+=label('Reclamo de deuda interna',93,96,34,INK,bold=True)
    art+=label('Ejemplo de trámite',94,128,23,INK)
    amount='Sustentado' if recognized else 'Por sustentar'
    for i,(name,info) in enumerate((('Reclamante','Comerciante'),('Origen','Préstamo al gobierno'),('Monto',amount))):
        y=216+i*67
        art+=label(name,65,y,25,INK,bold=True)+label(info,249,y,28,INK)
        art+=path(f'M65 {y+17} Q330 {y+19} 583 {y+16}',stroke='#aa9369',line=1.15)
    if recognized:
        art+=label('Reconocido en el ejemplo',66,460,34,INK,bold=True)
        art+=path('M66 474 Q286 469 496 473',stroke='#778969',line=2.4)
    else:
        art+=label('Por revisar',66,460,41,'#8f5745',bold=True)
        art+=path('M66 474 Q170 469 274 473',stroke='#a46a53',line=2.4)
    return art


def filing_hand(x,y,w):
    file=PEOPLE/'detalles-manos/detalle-comerciante-agarre.svg'
    _,_,vw,vh=(float(v) for v in read_svg(file).get('viewBox').split())
    return group(asset(file,x,y,w,w*vh/vw),transform=f'translate({2*x+w} 0) scale(-1 1)')


def dossier_frame(beat):
    art=wood()+paper_light(577,368,529,348,.64)
    if beat==0:
        art+=group(folder_cover(),transform='translate(190 101) rotate(-9 321 275) scale(.91)')
        art+=group(claim_leaf(),transform='translate(254 124) rotate(-4 321 275) scale(.88)')
        art+=filing_hand(747,336,588)
    elif beat==1:
        art+=group(folder_cover(),transform='translate(151 98) rotate(-9 321 275) scale(.91)')
        art+=group(claim_leaf(),transform='translate(328 91) rotate(-2 321 275) scale(.99)')
        art+=filing_hand(900,338,540)
    else:
        art+=group(claim_leaf(),transform='translate(288 68) scale(1.11)')
    return art+vignette(.7)


def sequences():
    return (
        Sequence('1A','Del Perú a las islas de Chincha',(
            Panel('El país',map_frame(),('Dejar el punto de Pisco quieto para orientar.','Entra el mar antes de la voz.')),
            Panel('Acercamiento a Pisco',map_frame(True),('Acercamiento pesado con Pisco como ancla.','Mostrar Chincha al oeste-noroeste.')),
            Panel('Pisco en 2D',pisco_frame(),('Igualar ancla al pasar de mapa a ciudad lateral.','Pausa con las fachadas y la costa a la vista.')),
            Panel('Sobre el mar',pisco_frame(True),('La ciudad sale a la derecha y Chincha entra a la izquierda.','Desplazar dunas más lento. Mar con fase continua.')),
            Panel('Llegada a Chincha',islands_frame(),('Asentar el encuadre en el grabado y sostenerlo.','Aves, espuma y destellos discretos en el agua.')),
        ),'De ubicar el país a reconocer el lugar de donde sale el guano.',
           'Entrar al depósito desde los estratos y las aves del mismo grabado.'),
        Sequence('1B.1','La pala, el saco y el abono',(
            Panel('Cortar el depósito',extraction_frame(0),('Fijar cámara cuando la pala entra en el material.','Polvo escaso y sonido de raspado al contacto.')),
            Panel('Llenar el saco',extraction_frame(1),('Seguir el arco de la pala hasta la boca abierta.','Granos con semilla. Caen una vez y se asientan.')),
            Panel('El uso agrícola',extraction_frame(2),('Abrir a los surcos por la forma del saco apoyado.','Luz suave sobre el terreno. Dejar respirar el plano.')),
        ),'De ver el depósito a entender qué compraba el mercado.',
           'Volver al saco lleno en las islas para seguir su carga.'),
        Sequence('1B.2','Preparar, sujetar y llevar',(
            Panel('Preparar el agarre',weight_frame(0),('Bajar rodillas y acercar las manos con cámara fija.','Mantener el saco apoyado y la sombra bajo los pies.')),
            Panel('Sujetar ambos lados',weight_frame(1),('Cerrar los dos agarres antes de mover el saco.','Roce breve de tela. La carga conserva forma y volumen.')),
            Panel('Contacto en los dos bordes',grip_closeup(),('Acercar con las manos quietas sobre el saco.','Leer pulgares, costura y presión sobre la tela.')),
            Panel('Cargar y dar el paso',weight_frame(2),('Levantar con peso y dejar que la pierna tome apoyo.','El soporte queda en su sitio. Sombra pegada al pie.')),
        ),'De una carga apoyada al esfuerzo de llevarla.',
           'Entrar a la pasarela con el mismo saco. La voz sitúa las formas de trabajo.'),
        Sequence('1C.1','Embarque y mercado británico',(
            Panel('Llegar a la pasarela',embark_frame(0),
                  ('Seguir el saco hacia la borda. Estabilizar al pisar.','El mar sigue vivo detrás del casco.')),
            Panel('Recibir en cubierta',embark_frame(1),
                  ('Cámara fija durante la recepción. Mantener el agarre.','Heredar balanceo cuando el pie ya está a bordo.')),
            Panel('Apoyar el saco',ship_deposit(),
                  ('Detalle del saco asentado sobre el apoyo de cubierta.','Roce al contacto. La cuerda queda en segundo plano.')),
            Panel('Abrir el esquema comercial',trade_board(),
                  ('Abrir del barco a Chincha, producto y mercado.','Trazar la relación comercial y sostener el destino.')),
        ),'De seguir un cargamento a entender hacia dónde se vendía.',
           'El saco y el mercado conducen al libro de la casa consignataria.'),
        Sequence('1C.2','La cuenta de la venta',(
            Panel('Registrar la venta',accounts_frame(0),('Abrir el libro con peso y detener la cámara.','Sombra en el lomo. Luz sobre la venta.')),
            Panel('Separar gastos y comisión',accounts_frame(1),('Conservar página y venta. Revelar descuentos por turno.','Apagar la venta al trasladar el foco. Roce de hoja.')),
            Panel('Identificar el ingreso del Estado',accounts_frame(2),('Revelar la partida completa al llegar a la consecuencia.','Sostener el ingreso antes del paneo al Estado.')),
        ),'De la venta comercial a los recursos públicos.',
           'Seguir el ingreso del Estado al edificio y las obligaciones pendientes.'),
        Sequence('1D.1','Ingresos y deudas pendientes',(
            Panel('Los ingresos del Estado',obligation_frame(0),('El Estado ancla el encuadre. Revelar las tres fuentes.','Un solo recorrido iluminado por vez.')),
            Panel('Un préstamo',obligation_frame(1),('Abrir el primer ejemplo en la mesa del comerciante.','Foco sobre el papel del préstamo. Monedas como utilería.')),
            Panel('Bienes para sostener tropas',obligation_frame(2),('Presentar el segundo ejemplo en su propio encuadre.','Pasar de los bienes al reclamo. Sostener la lectura.')),
            Panel('De las obligaciones al expediente',obligation_frame(3),('Reunir las hojas y seguir la pestaña roja.','Sombra entre folios. Roce al separar el expediente.')),
        ),'De las entradas del Estado a las personas que esperaban cobrar.',
           'Apartar los ejemplos y seguir el folio del préstamo.'),
        Sequence('1D.2','El reclamo que pasa a la escena 2',(
            Panel('Abrir la carpeta',dossier_frame(0),('Acercarse al folio de pestaña roja.','Separar sombra de tapa y papel.')),
            Panel('Extraer el folio',dossier_frame(1),('La mano conserva el agarre al deslizarlo.','Roce de papel y asentamiento breve.')),
            Panel('Reclamo por revisar',dossier_frame(2),('Encuadre fijo. Nombre del trámite y campos completos.','Sostener Por revisar. El ambiente del despacho entra antes del enlace.')),
        ),'De una carpeta entre muchas al reclamo que vamos a seguir.',
           'Mantener este folio y su posición como entrada a 2A.'),
    )


def layer_files():
    return {
        'cielo-pisco': (W,H,sky(),'Fondo fijo. Desplazamiento menor que la costa.'),
        'mar-pacifico': (W,H,rect(0,452,W,268,'url(#agua-costa)'),'Plano fijo desde el horizonte.'),
        'reflejos-mar': (W,H,waves(452),'Fase continua en Pisco y travesía.'),
        'frente-deposito': (W,H,stone_ground(True),'Superficie de extracción en primer plano.'),
        'pala-llena': (572,148,group(shovel(),transform='translate(131 0)'),'Origen de giro [410,64] en el empalme del mango.'),
        'mano-y-manga-pala': (548,234,group(shovel_hand(),transform='translate(494 156)'),'La pinza se coloca sobre el mango y lo acompaña.'),
        'saco-abierto': (238,317,group(sack(),transform='translate(8 8)'),'Boca [120,50]. Base [120,300].'),
        'saco-cerrado': (238,317,group(sack(False,True),transform='translate(8 8)'),'Base [120,300]. Cambiar a pose de carga con el mismo saco testigo.'),
        'granos-vertido': (94,131,group(falling_grain(),transform='translate(14 0)'),'Emitir una vez desde el filo de la pala hacia la boca.'),
        'apoyo-cubierta': (316,115,group(timber_support(292,89),transform='translate(5 6)'),'Fijo en el sistema del barco. Contacto del saco en el canto superior.'),
        'muelle-pasarela': (W,H,dock(),'La pasarela une la orilla con el borde de cubierta en la ilustración.'),
        'cubierta': (W,H,deck(),'Vincular a casco y tripulación una vez a bordo.'),
        'cuerda-cubierta': (280,146,rope_coil(),'Pieza fija de cubierta.'),
        'libro-contable': (W,H,ledger(named=True),'Cubierta, páginas, lomo y rótulos en grupos separados.'),
        'partida-venta': (W,H,account_entry('venta'),'Primera revelación del libro.'),
        'partida-gastos-comision': (W,H,account_entry('descuentos'),'Segunda revelación del libro.'),
        'partida-ingreso-estado': (W,H,account_entry('ingreso'),'Última revelación. Ancla del paneo al Estado.'),
        'documento-prestamo': (568,287,group(receipt('prestamo'),transform='translate(5 8)'),'Ejemplo editorial sin importe.'),
        'documento-bienes': (568,287,group(receipt('bienes'),transform='translate(5 8)'),'Ejemplo editorial de bienes utilizados para tropas.'),
        'cesta-cosechas': (292,322,group(basket(),transform='translate(5 30)'),'Objeto del ejemplo de bienes. Foco previo al papel.'),
        'tapa-carpeta': (692,574,group(folder_cover(),transform='translate(8 8)'),'Pieza fija mientras sale el folio.'),
        'folio-reclamo': (659,568,group(claim_leaf(),transform='translate(5 5)'),'Sostener la pestaña y el campo Por revisar al enlazar a 2A.'),
    }


def sheet(seq, number, heading='Las islas y el país', definitions=DEFS):
    count=len(seq.panels)
    cols=2 if count==4 else 3
    tile_w=896 if cols==2 else 794
    tile_h=tile_w*9/16
    gap,margin=23,42
    width=margin*2+tile_w*cols+gap*(cols-1)
    row_h=tile_h+114
    rows=(count+cols-1)//cols
    height=round(144+rows*row_h+20)
    art=rect(0,0,width,height,'#e8dec3')
    art+=label(f'Episodio 02 · {heading} · {seq.code}',margin,43,23,'#566a59',font='Arial')
    art+=label(seq.title,margin,100,54,INK)
    defs=''
    for i, panel in enumerate(seq.panels):
        row,col=divmod(i,cols)
        actual=min(cols,count-row*cols)
        offset=(cols-actual)*(tile_w+gap)*.5
        x,y=margin+col*(tile_w+gap)+offset,143+row*row_h
        art+=label(f'{i+1:02}  {panel.title}',x,y+25,27,INK,font='Arial',bold=True)
        clip=f'cuadro-{number}-{i+1}'
        defs+=f'<clipPath id="{clip}">{rect(0,0,W,H,"white")}</clipPath>'
        art+=group(group(panel.image,clip_path=f'url(#{clip})'),id=f'plano-{number:02}-{i+1:02}',
                   transform=f'translate({x:.1f} {y+39:.1f}) scale({tile_w/W:.7f})')
        for j,line in enumerate(panel.direction):
            art+=label(line,x,y+tile_h+67+j*24,17,'#42574a',font='Arial')
    return svg(art,width,height,definitions+defs)


def save():
    OUT.mkdir(exist_ok=True)
    parts=OUT/'capas'
    parts.mkdir(exist_ok=True)
    data=[]
    items=sequences()
    old=json.loads((LONG/'escena-01/secuencia.json').read_text(encoding='utf-8'))
    assert [s.code for s in items]==[s['id'] for s in old['desarrollo']]
    resources = {
        '1A':['cielo-pisco','mar-pacifico','reflejos-mar'],
        '1B.1':['frente-deposito','pala-llena','mano-y-manga-pala','saco-abierto','saco-cerrado','granos-vertido'],
        '1B.2':['frente-deposito','saco-cerrado'],
        '1C.1':['mar-pacifico','reflejos-mar','saco-cerrado','muelle-pasarela','apoyo-cubierta','cubierta','cuerda-cubierta'],
        '1C.2':['libro-contable','partida-venta','partida-gastos-comision','partida-ingreso-estado'],
        '1D.1':['documento-prestamo','documento-bienes','cesta-cosechas','tapa-carpeta','folio-reclamo'],
        '1D.2':['tapa-carpeta','folio-reclamo'],
    }
    for i, seq in enumerate(items,1):
        (OUT/f'lamina-{i:02}.svg').write_text(sheet(seq,i),encoding='utf-8')
        data.append({'id':seq.code,'lamina':f'lamina-{i:02}.svg','cambio':seq.change,'enlace':seq.link,
                     'piezas_nuevas':resources[seq.code],
                     'encuadres':[{'plano':p.title,'camara_y_accion':p.direction[0],'efecto_y_pausa':p.direction[1]}
                                  for p in seq.panels]})
    layers=layer_files()
    inventory=[]
    offsets={'pala-llena':[131,0], 'mano-y-manga-pala':[494,156], 'granos-vertido':[14,0],
             'saco-abierto':[8,8], 'saco-cerrado':[8,8], 'apoyo-cubierta':[5,6],
             'documento-prestamo':[5,8], 'documento-bienes':[5,8], 'cesta-cosechas':[5,30],
             'tapa-carpeta':[8,8], 'folio-reclamo':[5,5]}
    for name,(width,height,content,action) in layers.items():
        file=parts/f'{name}.svg'
        file.write_text(svg(group(content,id=name),width,height,DEFS),encoding='utf-8')
        inventory.append({'id':name,'archivo':f'capas/{name}.svg','lienzo':[width,height],
                          'origen_del_dibujo':offsets.get(name,[0,0]),'uso':action})
    (OUT/'secuencia.json').write_text(json.dumps(data,ensure_ascii=False,indent=2)+'\n',encoding='utf-8')
    (OUT/'piezas.json').write_text(json.dumps(inventory,ensure_ascii=False,indent=2)+'\n',encoding='utf-8')
    for name,panel in [('llegada-chincha',items[0].panels[4]),('contacto-pala',items[1].panels[1]),
                       ('libro-ingreso',items[4].panels[2]),('folio-salida',items[6].panels[2])]:
        (OUT/f'{name}.svg').write_text(svg(panel.image,W,H,DEFS),encoding='utf-8')
    print(f'{len(items)} láminas, {sum(len(s.panels) for s in items)} encuadres y {len(layers)} piezas vectoriales.')


if __name__=='__main__':
    save()
