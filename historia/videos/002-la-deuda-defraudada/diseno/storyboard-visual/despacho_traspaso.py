"""Escenografía vectorial del despacho de 2D."""
from random import Random

from piezas import circle, ellipse, gradient, group, path, rect

DEFS = (
    gradient('despacho-pared', '#65705a', '#343f34', True)
    + gradient('despacho-madera', '#866244', '#392d25')
    + gradient('despacho-panel', '#495449', '#2f3830')
    + gradient('despacho-cristal', '#bed4c8', '#6d9385')
    + gradient('despacho-cortina', '#847b5b', '#3b4639')
    + gradient('despacho-alfombra', '#806059', '#3f3939', True)
    + gradient('despacho-ventana-luz', '#f6dfaa33', '#f6dfaa00')
)


def frame(x, y, w, h):
    art = rect(x+5,y+7,w,h,'#272d26')
    art += rect(x,y,w,h,'url(#despacho-madera)','#312c24',2)
    art += rect(x+7,y+7,w-14,h-14,'#a38454','#c7a474',1)
    art += rect(x+11,y+11,w-22,h-22,'#998865','#4a4231',2)
    art += path(f'M{x+17} {y+h-22} q{w*.21:.0f} -31 {w*.36:.0f} -21 t{w*.4:.0f} 7'
                f' v14 h{-w*.76:.0f} Z','#676e55')
    art += path(f'M{x+17} {y+h-18} q{w*.22:.0f} -12 {w*.38:.0f} -8 t{w*.38:.0f} 0'
                f' v10 h{-w*.76:.0f} Z','#444f44')
    return art


def architecture():
    art = rect(-36,-25,1352,770,'url(#despacho-pared)')
    art += path('M-35 0 H1315 L1072 61 H203 Z','#353b31')
    art += path('M-35 4 L201 62 H1073 L1315 4 V19 L1073 83 H201 L-35 22 Z',
                'url(#despacho-madera)','#302a23',2)
    art += path('M-35 13 L202 71 H1073 L1315 12',stroke='#b18b5b',line=1.7)
    art += path('M-35 22 L201 83 V505 L-35 561 Z','#404e3e')
    art += path('M1315 19 L1073 83 V505 L1315 568 Z','#303d34')
    art += path('M201 83 V505 M1073 83 V505',stroke='#a48d6347',line=2)
    art += path('M-35 409 L201 384 H1073 L1315 414 V565 L1073 505 H201 L-35 561 Z',
                'url(#despacho-panel)','#272c25',2)
    art += path('M-35 406 L201 377 H1073 L1315 407 V421 L1073 392 H201 L-35 422 Z',
                'url(#despacho-madera)','#30291f',2)
    for x in range(213,1060,109):
        art += rect(x,408,91,78,'#465346','#272f27',3)
        art += rect(x+5,413,81,68,'none','#8b88623e',1.4)
    art += path('M-35 442 L180 415 V487 L-35 539 Z M1096 416 L1315 445 V544 L1096 486 Z',
                'none','#232e27',3)
    art += path('M-35 552 L201 493 H1073 L1315 553 V565 L1073 507 H201 L-35 568 Z',
                'url(#despacho-madera)','#2a2b24',2)
    return art


def floor():
    art = path('M-36 567 L201 506 H1073 L1316 566 V753 H-36 Z','url(#suelo-2d)')
    for x in range(-380,1690,137):
        far_x = 640+(x-640)*.56
        start_y = 507+max(201-far_x,far_x-1073,0)*.27
        start_x = far_x+(x-far_x)*(start_y-507)/237
        art += path(f'M{start_x:.1f} {start_y:.1f} L{x} 744',stroke='#a487615e',line=1.3)
    for y in (523,544,571,606,651,708):
        left = max(-36,201-(y-506)*3.88)
        right = min(1316,1073+(y-506)*4.05)
        art += path(f'M{left:.1f} {y} H{right:.1f}',stroke='#413b2f',line=1.4)
    outline = 'M309 535 H960 L1172 752 H93 Z'
    art += path(outline,'url(#despacho-alfombra)','#333932',2.4)
    art += path('M325 542 H944 L1132 743 H133 Z M334 548 H935 L1108 736 H157 Z',
                stroke='#b18e67',line=2.5)
    for x in range(294,1040,72):
        art += path(f'M{x} 688 l20 -13 l20 13 l-20 13 Z',stroke='#c3997055',line=1.3)
        art += circle(x+20,688,2.5,'#c3997055')
    return art


def window():
    arch = 'M528 361 V174 Q532 101 641 91 Q748 101 752 174 V361 Z'
    art = path('M514 375 V170 Q516 86 641 77 Q766 87 769 170 V375 Z',
               'url(#despacho-madera)','#2d3028',4)
    art += path(arch,'url(#despacho-cristal)','#b29c73',3)
    art += path('M530 285 Q571 255 617 281 T750 267 V359 H530 Z','#758f7f')
    art += path('M529 321 L554 310 V292 H572 V304 L593 297 V310 L626 310 L651 299 L679 316'
                ' V295 H700 L718 313 L750 306 V360 H529 Z','#537565')
    art += path('M641 93 V360 M532 177 H749 M530 236 H750 M530 298 H751',
                stroke='#6c543d',line=7)
    art += path('M638 96 V359 M531 174 H750 M530 233 H751',stroke='#d0ae7b',line=1.7)
    art += path('M511 360 H772 L779 374 H502 Z','url(#despacho-madera)','#4b3929',2.5)
    art += path('M480 88 Q640 72 803 88',stroke='#312e25',line=7)
    for x in (480,803):
        art += circle(x,88,7,'#aa8a58','#3a3428',2)
    for mirror in (False,True):
        curtain = path('M493 88 Q512 78 552 83 Q541 163 531 231 Q524 253 506 270 '
                       'Q508 312 527 370 Q503 379 479 371 Q493 306 488 265 Q475 180 493 88 Z',
                       'url(#despacho-cortina)','#303b32',2.8)
        curtain += path('M502 89 Q485 186 499 261 Q494 321 489 365 M524 88 Q516 188 502 260',
                        stroke='#c0aa78',line=1.7)
        curtain += path('M484 264 Q497 270 510 260 M488 265 L479 290',stroke='#b39764',line=3.5)
        art += group(curtain, transform='translate(1283 0) scale(-1 1)' if mirror else '')
    return art


def bookcase():
    art = rect(33,123,233,365,'#312e25','#242a23',3)
    art += rect(41,143,217,334,'url(#despacho-madera)','#573f2d',2)
    art += rect(55,153,188,210,'#363129','#9b7d55',1.6)
    rng = Random(1850)
    for bottom in (218,287,352):
        x = 61
        while x < 228:
            w = min(rng.randint(12,22),236-x)
            h = rng.randint(31,54)
            color = rng.choice(('#656850','#7f6950','#6d5149','#536761','#8d7856'))
            art += rect(x,bottom-h,w,h,color,'#392f28',1.6,1)
            art += path(f'M{x+3} {bottom-h+8} h{w-6} M{x+3} {bottom-10} h{w-6}',
                        stroke='#b69560',line=1)
            x += w+1
        art += path(f'M51 {bottom} H248 v7 H51 Z','#936d48','#4c392c',2)
    art += path('M26 119 H269 L278 128 L264 143 H35 L25 133 Z',
                'url(#despacho-madera)','#392c24',2.5)
    art += path('M31 126 H272 M37 138 H263',stroke='#b08a5d',line=1.8)
    for x in (55,150):
        art += rect(x,376,89,94,'#735439','#4e382a',2)
        art += rect(x+6,382,77,81,'none','#a78357',1.4)
    for x in (132,161):
        art += circle(x,420,3.5,'#c9a773','#543c28',1)
    return art


def cabinet():
    art = path('M1039 343 L1263 328 V499 L1044 523 Z','#4b3a2b','#252b22',3)
    art += path('M1045 357 L1255 340 V487 L1048 510 Z','url(#despacho-madera)','#58412f',2)
    for left, right in ((1057,1146),(1158,1242)):
        art += path(f'M{left} 369 L{right} 357 V479 L{left} 489 Z',
                    '#604632','#a38357',1.9)
    for x in (1132,1172):
        art += circle(x,417,3.5,'#c3a46f','#483a2b',1.2)
    art += path('M1028 341 L1246 320 L1275 329 L1267 343 L1035 364 Z',
                '#8c6947','#422f26',2.5)
    art += path('M1051 357 L1264 338',stroke='#be9864',line=1.4)
    for x,y,w,color in ((1166,326,62,'#665c49'),(1171,317,54,'#8b6954'),(1163,307,60,'#546553')):
        art += rect(x,y,w,10,color,'#3f342a',1.4,1)
        art += path(f'M{x+8} {y+4} h{w-12}',stroke='#c2ab78',line=1)
    return art


def room():
    architecture_layer = group(architecture()+floor(),data_name='Paredes y suelo')
    furnishing = group(bookcase()+frame(345,152,109,112)+frame(840,139,93,83)
                       +frame(955,154,81,97)+cabinet(),data_name='Mobiliario')
    opening = group(window(),data_name='Ventana y cortinas')
    ray = path('M523 284 L738 280 L949 667 L454 667 Z','url(#despacho-ventana-luz)')
    shadow = path('M569 360 L614 360 L593 632 L520 632 Z M651 350 H676 L761 634 H716 Z',
                  '#293a2c26')
    return architecture_layer+furnishing+opening+group(ray+shadow,data_name='Luz lateral')
