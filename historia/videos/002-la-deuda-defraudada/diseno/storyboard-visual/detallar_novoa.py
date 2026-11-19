"""Desarrollo ilustrado de 3C con capas de movimiento reutilizables."""
from random import Random
import json

from piezas import (
    HERE, PEOPLE, NOVOA, CREAM, INK, group, rect, path,
    ellipse, label, gradient, asset, svg, read_svg,
)

OUT = HERE/'revision-novoa'
W, H = 1280, 720
DEFS = (
    gradient('nogal', '#796245', '#252e26', True)
    + gradient('canto-mesa', '#6b523a', '#302e26')
    + gradient('carton', '#9e7b4e', '#594833')
    + gradient('folio-lino', '#f2e3bb', '#c6ac80')
    + gradient('pliegue', '#f8ebca', '#bca57c')
    + gradient('nota', '#faebcb', '#cbb591')
    + gradient('tinta', '#557067', '#1c302e')
    + gradient('laton', '#d8b77a', '#715736')
    + '<radialGradient id="luz-calida"><stop stop-color="#e9c88d" stop-opacity=".29"/>'
      '<stop offset=".58" stop-color="#e9c88d" stop-opacity=".12"/>'
      '<stop offset="1" stop-color="#e9c88d" stop-opacity="0"/></radialGradient>'
    + '<radialGradient id="vineta-novoa" cx=".53" cy=".46" r=".73"><stop offset=".56" stop-color="#10211c" stop-opacity="0"/>'
      '<stop offset="1" stop-color="#10211c" stop-opacity=".55"/></radialGradient>'
)


def shading(d, dx=8, dy=9):
    layers = ''
    for offset, opacity in ((12,.065),(7,.09),(3,.14),(0,.22)):
        layers += group(path(d,'#20251e'),transform=f'translate({dx+offset} {dy+offset})',opacity=opacity)
    return layers


def wood():
    """Veta constante en los tres estados de la mesa, con líneas largas y nudos."""
    rng = Random(1852)
    result = rect(0,0,W,H,'url(#nogal)')
    for y in (149,313,486,637):
        result += path(f'M0 {y} Q620 {y-6} {W} {y+2}',stroke='#282b23',line=2.6)
        result += path(f'M0 {y+4} Q620 {y-2} {W} {y+6}',stroke='#9b8057',line=.8)
    for i in range(139):
        x = rng.randrange(-130,1230)
        y = rng.randrange(4,712)
        length = rng.randrange(70,570)
        wobble = rng.randrange(-6,7)
        color = ('#bb9864','#ac8b5d','#3a382c','#483c2c')[i%4]
        line = path(f'M{x} {y} q{length*.31:.1f} {wobble} {length*.60:.1f} {wobble*.42:.1f}'
                    f' t{length*.4:.1f} {-wobble*.46:.1f}',stroke=color,line=.55+(i%4)*.23)
        result += group(line,opacity=.20+(i%5)*.047)
    for cx,cy in ((1075,555),(103,207)):
        for i in range(1,8):
            w, h = i*9, i*2.1
            grain = path(f'M{cx-w} {cy} Q{cx} {cy-h*2.5} {cx+w} {cy} Q{cx} {cy+h*2.1} {cx-w} {cy}',
                         stroke='#a58559',line=.73)
            result += group(grain,opacity=.39-i*.033)
    return result


def ink_and_quill():
    ink = ellipse(76,128,61,15,'#242923') + ellipse(70,112,56,16,'#2b3530')
    ink += path('M20 49 Q18 71 23 108 Q70 132 117 106 L123 49 Z','url(#tinta)','#233830',2)
    ink += ellipse(71,48,52,17,'#61746a') + ellipse(71,47,39,10,'#202c26')
    ink += path('M28 68 Q30 91 36 106 M104 62 L99 104',stroke='#829689',line=2.4)
    ink += path('M26 52 Q66 69 114 53',stroke='#a7a38a',line=1.6)
    quill = path('M205 77 Q122 77 96 142 Q123 131 143 125 Q157 118 176 102 L166 105 Q191 97 205 77Z',
                 '#c5b58e','#8c805f',1.2)
    quill += path('M87 157 Q108 123 173 94 M124 121 l-4 -17 M142 110 l-1 -16 M158 100 l9 3',
                  stroke='#f0dfb3',line=1.4)
    quill += path('M85 161 L95 143',stroke='#4c4937',line=2.6)
    return group(ink+quill,transform='translate(1034 24) rotate(10 82 90)',opacity=.87)


def folio(closed=False):
    """Un solo expediente. El borde, la cinta y los campos mantienen su identidad."""
    cover = 'M3 20 Q119 16 186 19 L232 48 L552 42 L564 489 Q389 498 29 491 Z'
    leaf = 'M26 31 Q205 26 524 28 L553 54 L548 462 Q278 469 24 461 Z'
    art = shading(cover,9,12) + path(cover,'url(#carton)','#b29266',2)
    for idx in range(5):
        offset = idx*4
        pages = path('M26 32 Q234 29 530 34 L547 455 Q282 469 25 459 Z',
                     '#bca784' if idx%2==0 else '#dfcfa7','#7d6d52',.85)
        art += group(pages,transform=f'translate({offset*.4:.2f} {14-offset})')
    art += path(leaf,'url(#folio-lino)','#bda174',1.6)
    art += path('M523 28 L552 54 L521 57 Q526 44 523 28 Z','url(#pliegue)','#ae9770',1.1)
    art += path('M43 58 L43 444 M516 72 L516 434 M46 445 Q292 449 514 440',
                stroke='#a98a62',line=1)
    for x,y,dx,dy in ((30,66,23,7),(44,424,65,1),(460,447,44,-7),(453,53,47,3),(40,118,28,3)):
        art += path(f'M{x} {y} q{dx*.45:.1f} {dy-5} {dx} {dy}',stroke='#f7e6c0',line=1.2)
    art += path('M49 24 L81 21 L82 93 L65 83 L51 92 Z','#aa6954','#c89470',1.3)
    art += path('M55 30 L57 80 M74 28 L75 80',stroke='#d59c75',line=1)
    art += label('Ignacia Novoa de Arredondo',92,89,26,INK,bold=True)
    art += label('Solicitud de compensación',53,147,26,INK)
    art += path('M53 160 Q282 162 511 159',stroke='#987d56',line=1.3)
    art += label('Hacienda expropiada',53,220,25,INK)
    art += label('500 personas esclavizadas',53,267,25,INK)
    art += label('32 años de ganancias reclamadas',53,314,25,INK)
    art += path('M55 353 Q280 351 494 353 M55 373 Q284 371 493 374 M55 391 Q234 389 428 389',
                stroke='#ab9570',line=.9)
    art += label('Resumen del reclamo',54,427,16,'#6b6850',font='Arial')
    return art + (flap() if closed else '')


def flap():
    outline = 'M12 174 Q212 163 554 175 L564 489 Q389 498 29 491 Z'
    art = path(outline,'url(#carton)','#bb986c',1.7)
    art += path('M22 181 Q218 170 546 182 M39 478 Q300 487 553 476',stroke='#c4a272',line=1.4)
    art += path('M34 194 Q47 326 51 463 M530 204 L545 466',stroke='#ad8a5e',line=.85)
    for y in (224,263,305,365,418,454):
        art += group(path(f'M53 {y} Q248 {y+7} 523 {y-4}',stroke='#bd9b70',line=.75),opacity=.22)
    return art


def ribbon():
    return (path('M9 28 C29 6 45 19 53 36 C45 53 31 53 15 51 L6 43 Z','#8c5648','#c18d70',1.2)
            + path('M31 33 C13 53 35 67 57 64 Q77 60 88 83 M34 39 Q48 51 70 39',
                   stroke='#7a5341',line=3.2)
            + path('M15 33 Q32 16 45 37 M32 49 Q48 65 70 66',
                   stroke='#c69571',line=1))


def response(with_answer=True):
    edge = 'M4 9 Q205 3 480 7 L481 242 Q242 246 7 240 Z'
    art = shading(edge,7,9)+path(edge,'url(#nota)','#c0a680',1.8)
    art += path('M22 24 H463 V222 H22 Z',stroke='#b6a078',line=1.2)
    art += path('M22 32 H463',stroke='#ac9065',line=.75)
    art += label('José Rufino Echenique',43,83,32,INK,bold=True)
    art += label('Presidente',44,117,23,INK)
    art += label('Resumen editorial',44,213,17,'#6b6550',font='Arial')
    if with_answer:
        art += label('Fuera de plazo',43,174,48,'#553f31',bold=True)
    return art


def underline():
    return (path('M39 184 Q176 180 381 183',stroke='#9a5848',line=3.8)
            + path('M54 189 Q167 185 328 187',stroke='#b16e58',line=1.2))


def arm(pose, x, y):
    # Los cortes de manga y puño proceden de la misma variante de Elías.
    file = PEOPLE/'detalles-manos'/f'detalle-intermediario-{pose}.svg'
    dimensions = read_svg(file).get('viewBox').split()
    width = 680
    height = round(width*float(dimensions[3])/float(dimensions[2]),2)
    return group(asset(file,x,y,width,height),transform=f'translate({2*x+width} 0) scale(-1 1)')


def folio_at(x=121, y=128, tilt=-5, closed=False):
    return group(folio(closed),transform=f'translate({x} {y}) rotate({tilt} 283 251)')


def note_at(answer, line=False):
    content = response(answer)
    if line:
        content += underline()
    return group(content,transform='translate(734 115) rotate(2 240 121)')


def overhead(beat, hand_art=arm, contact_shadows=((691,415,69,22),(690,441,77,21))):
    scene = wood()+ink_and_quill()
    scene += group(ribbon(),transform='translate(61 632) rotate(-24)',opacity=.78)
    if beat == 1:
        scene += ellipse(410,320,540,345,'url(#luz-calida)')
        scene += folio_at(124,121,-7)
        scene += group(ellipse(*contact_shadows[0],'#3e382b'),opacity=.28)
        scene += hand_art('agarre',647,359)
        scene += note_at(False)
    else:
        scene += ellipse(961,255,421,280,'url(#luz-calida)')
        scene += folio_at(closed=True)
        if beat == 2:
            scene += group(ellipse(*contact_shadows[1],'#3e382b'),opacity=.28)
            scene += hand_art('apoyo',645,380)
        scene += note_at(True,True)
    return scene+rect(0,0,W,H,'url(#vineta-novoa)')


def front():
    art = asset(NOVOA/'oficina.svg',0,0,W,H)
    rays = path('M944 109 L1118 107 L987 479 L405 600 Z','#e1ce90')
    art += group(rays,opacity=.086)
    art += ellipse(976,290,424,326,'url(#luz-calida)')
    art += group(asset(PEOPLE/'bustos/busto-intermediario-senala.svg',490,137,642,487),
                 transform='translate(1622 0) scale(-1 1)')
    art += path('M0 524 Q699 533 1280 474 V720 H0 Z','url(#nogal)','#9d865d',2)
    for row in range(556,720,21):
        art += group(path(f'M0 {row} Q512 {row+3} 1280 {row-39}',stroke='#b79967',line=.92),opacity=.45)
    art += rect(0,686,1280,34,'url(#canto-mesa)')
    art += path('M0 687 H1280',stroke='#9f8057',line=3)
    art += group(folio(True),transform='translate(192 487) scale(.87 .35) rotate(-7 283 240)')
    art += label('Domingo Elías',1041,84,37,CREAM,'middle',bold=True)
    art += label('Intermediario',1041,117,24,'#dfd0aa','middle')
    return art+rect(0,0,W,H,'url(#vineta-novoa)')


BEATS = (
    ('01','Continuidad con la gestión','Elías queda a la derecha. El expediente ocupa la mesa en primer término.'),
    ('02','Acercarse al expediente','La mano conserva el contacto al reencuadrar. El nombre y la solicitud identifican el folio.'),
    ('03','La respuesta','La mano apoya la tapa. La luz pasa a la respuesta y el trazo señala el plazo.'),
    ('04','El expediente queda detenido','Elías retira la mano. La respuesta queda legible antes de pasar a la intervención de Torrico.'),
)


def save_layers():
    parts = OUT/'capas'
    parts.mkdir(parents=True,exist_ok=True)
    assets = {
        'mesa-cenital': wood()+ink_and_quill()+group(ribbon(),transform='translate(61 632) rotate(-24)',opacity=.78),
        'expediente-novoa': folio_at(),
        'tapa-expediente': group(flap(),transform='translate(121 128) rotate(-5 283 251)'),
        'mano-agarre': arm('agarre',647,359),
        'mano-apoyo': arm('apoyo',645,380),
        'respuesta-base': note_at(False),
        'fuera-de-plazo': group(label('Fuera de plazo',43,174,48,'#553f31',bold=True),
                                transform='translate(734 115) rotate(2 240 121)'),
        'trazo-corrector': group(underline(),transform='translate(734 115) rotate(2 240 121)'),
        'foco-respuesta': ellipse(961,255,421,280,'url(#luz-calida)'),
        'vineta': rect(0,0,W,H,'url(#vineta-novoa)'),
    }
    for name,content in assets.items():
        (parts/f'{name}.svg').write_text(svg(group(content,id=name),W,H,DEFS),encoding='utf-8')


def main():
    OUT.mkdir(exist_ok=True)
    art = (front(),overhead(1),overhead(2),overhead(3))
    body = rect(0,0,1920,1350,'#e8dec3')
    body += label('Episodio 02 · Escena 3C',45,43,23,'#536252',font='Arial')
    body += label('El expediente de Novoa · el plazo',45,101,55,INK)
    clips = ''
    for index, ((ident,title,note),drawing) in enumerate(zip(BEATS,art,strict=True)):
        x, y = 45+(index%2)*931, 150+(index//2)*589
        body += label(f'{ident}  {title}',x,y,29,INK,font='Arial',bold=True)
        clip = f'cuadro-{ident}'
        clips += f'<clipPath id="{clip}">{rect(0,0,W,H,"white")}</clipPath>'
        body += group(group(drawing,clip_path=f'url(#{clip})'),id=f'plano-{ident}',
                      transform=f'translate({x} {y+20}) scale(.7)')
        # Las indicaciones se leen debajo del encuadre, fuera del dibujo.
        body += label(note,x,y+552,16,INK,font='Arial')
    (OUT/'novoa-plazo-detalle.svg').write_text(svg(body,1920,1350,DEFS+clips),encoding='utf-8')
    (OUT/'03-respuesta.svg').write_text(svg(art[2],W,H,DEFS),encoding='utf-8')
    save_layers()
    manifest = {
        'encuadre':[W,H],
        'estado':'Storyboard ilustrado para revisión',
        'continuidad':{'desde':'3B · La gestión de Elías','hacia':'3D · Torrico y la aprobación'},
        'beats':[
            {'plano':'01','camara':'Plano medio a la derecha. El expediente ancla el reencuadre.',
             'movimiento':'quietud','luz':'Ventana lateral tenue. La atención está en Elías y el folio.'},
            {'plano':'02','camara':'Acercamiento cenital que conserva la pestaña y el borde del expediente.',
             'movimiento':'Cámara pesada. Mano y folio quietos durante el acercamiento.',
             'contacto':'La mano apoya desde la derecha sobre el mismo borde del folio.'},
            {'plano':'03','camara':'Cenital fijo. Quietud de 24 cuadros a 30 fps antes de la revelación.',
             'movimiento':'Asentamiento de la tapa. Trazo ligero al oír fuera de plazo.',
             'luz':'Foco cálido breve en la respuesta. Sombra de contacto debajo del antebrazo.'},
            {'plano':'04','camara':'Cenital fijo. Mantener juntos la respuesta y el folio.',
             'movimiento':'Retiro natural de la mano en arco. El folio permanece apoyado.',
             'pausa':'Probar dos segundos de lectura después del retiro. Paneo a 3D con el folio quieto.'},
        ],
        'capas':{
            'fijas':['mesa-cenital','vineta'],
            'moviles':['expediente-novoa','tapa-expediente','mano-agarre','mano-apoyo','respuesta-base'],
            'revelacion':['fuera-de-plazo','trazo-corrector','foco-respuesta'],
            'contacto_mano_derecha':[686,451],
            'contacto_folio':[675,452],
            'origen_del_trazo':[773,299],
        },
        'fuente':'Quiroz, Historia de la corrupción en el Perú, ed. 2013, p. 171. Cotejo registrado en fuentes.md.',
    }
    (OUT/'planos-y-capas.json').write_text(json.dumps(manifest,ensure_ascii=False,indent=2)+'\n',encoding='utf-8')
    print('Cuatro planos, un cuadro de detalle y diez capas SVG.')


if __name__ == '__main__':
    main()
