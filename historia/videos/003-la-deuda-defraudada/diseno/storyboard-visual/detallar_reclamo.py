"""El recorrido de un reclamo. Encuadres, piezas y dirección de la escena 2."""
import json

from piezas import HERE, PEOPLE, NOVOA, LONG, CREAM, INK, GOLD, group, rect, path, circle, ellipse, label, arrow, asset, gradient, svg
from detallar_novoa import wood, shading, folio as novoa_folio
from detallar_islas import (
    W, H, DEFS as ISLAS_DEFS, Panel, Sequence, sheet, paper_light, vignette,
    dossier_frame, claim_leaf, folder_cover, receipt,
)
import detallar_traspaso as traspaso

OUT = HERE/'revision-reclamo'
DEFS = ISLAS_DEFS + traspaso.DEFS + (
    gradient('tela-ley','#647563','#293d34')
    + gradient('laton-lupa','#d4bc81','#7c603d')
    + gradient('sobre-ocre','#e0c69a','#ac8c5e')
    + gradient('vale-lino','#f3e8c5','#c3b68c')
    + gradient('cristal-lupa','#b5b99a22','#718b7622')
)


def put(content,x,y,scale=1,angle=0):
    return group(content,transform=f'translate({x} {y}) rotate({angle}) scale({scale})')


def scene_desk(focus_x=630,focus_y=345):
    return wood()+paper_light(focus_x,focus_y,580,386,.41)


def ruled_leaf(width,height):
    outline=f'M3 4 Q{width*.47:.1f} 0 {width-2} 5 L{width} {height-4} Q{width*.44:.1f} {height} 4 {height-3} Z'
    return shading(outline,6,6)+path(outline,'url(#papel-hoja)','#b89f76',1.6)+rect(14,15,width-29,height-30,'none','#b59c71',1)


def law_book():
    edge='M18 9 Q193 0 360 9 L366 419 Q191 430 15 420 Z'
    art=shading(edge,8,11)+path(edge,'url(#tela-ley)','#9b9167',2.8)
    art+=path('M12 15 Q29 5 40 14 V416 Q27 427 13 417 Z','#344639','#829075',1.3)
    art+=path('M360 21 L373 22 L378 428 L360 423 Z','#c6b58b','#928362',1.4)
    for y in range(32,415,12):
        art+=path(f'M362 {y} l12 1',stroke='#978461',line=.7)
    art+=rect(48,32,293,363,'none','#ad9b6f',2.1,3)
    art+=rect(56,41,277,345,'none','#8f916b',1.1,2)
    art+=label('LEY DE CONSOLIDACIÓN',194,121,18,'#d6c49a','middle',bold=True)
    art+=label('Deuda interna',194,202,32,CREAM,'middle',bold=True)
    art+=path('M101 228 Q198 224 278 229',stroke='#a89c70',line=1.5)
    art+=label('16 de marzo de 1850',194,305,25,'#e1d1a5','middle')
    return art


def entry(beat):
    if beat==0:
        return dossier_frame(2)
    art=scene_desk(668,320)+put(claim_leaf(),75,69,.93,-2)
    if beat==1:
        art+=put(receipt('bienes'),732,86,.87,4)
        art+=put(receipt('prestamo'),750,384,.85,-4)
    else:
        art+=put(law_book(),821,133,1.07,3)
    return art+vignette(.67)


CHECKS=(
    ('Constancia de préstamo','Préstamo al gobierno','Origen'),
    ('Registro del acreedor','Titular · Comerciante','Acreedor'),
    ('Cuenta y comprobantes','Importe según el respaldo','Monto'),
)


def evidence(index):
    heading,body,field=CHECKS[index]
    art=ruled_leaf(388,135)
    art+=rect(24,-2,57,25,('#9a614e','#8d8963','#627660')[index])
    art+=label(field,52,16,13,CREAM,'middle',font='Arial')
    art+=label(heading,26,56,24,INK,bold=True)
    art+=label(body,26,91,21,INK)
    art+=path('M27 100 H359',stroke='#ab9369',line=1)
    if index==0:
        art+=circle(338,108,15,'#c7aa81','#a58560',1.3)
        art+=circle(338,108,10,'none','#a58560',.9)
        art+=path('M329 110 Q338 97 347 109 M331 113 Q338 108 344 114',
                  stroke='#a58560',line=1)
    elif index==1:
        art+=path('M192 112 H359 M281 71 V118',stroke='#a99269',line=1)
    else:
        art+=path('M296 71 V120 M330 71 V120 M360 71 V120 M296 83 H360 M296 111 H360',
                  stroke='#a99269',line=1)
    return art


def lens():
    art=circle(85,86,64,'none','#242d2538',9)
    art+=path('M123 118 L207 202 Q219 219 205 228 Q196 233 187 220 L106 134 Z',
              'url(#laton-lupa)','#584a35',2.8)
    art+=path('M140 151 L198 212',stroke='#d8c18a',line=2.4)
    art+=circle(78,76,65,'none','#574d37',3)
    art+=circle(78,76,60,'none','url(#laton-lupa)',9)
    art+=circle(78,76,55,'url(#cristal-lupa)','#818666',1.7)
    art+=path('M29 76 Q30 41 61 25 M103 28 Q120 36 129 53',
              stroke='#efe1b0',line=3)
    return art


def check_frame(active):
    art=scene_desk(792,322)+put(claim_leaf(recognized=active==3),65,64,1.045,-1)
    for i in range(3):
        yy=95+i*161
        light=1 if i==active or active==3 else .82
        art+=group(put(evidence(i),817,yy,1,(2,-1,1)[i]),style=f'filter:brightness({light})')
    if active<3:
        # Las filas del folio se conservan. El orden de lectura lo lleva el foco.
        y=(355,284,424)[active]
        end_y=95+active*161+55
        art+=group(paper_light(470,y-14,335,68,.70),opacity=.63)
        art+=path(f'M548 {y+5} Q658 {y+6} 714 {y+5} Q755 {y+4} 813 {end_y}',
                  stroke='#d8bb7b',line=2.5)
        art+=circle(813,end_y,4,GOLD)
        art+=put(lens(),686,y-73,.74)
    return art+vignette(.77)


def vale():
    edge='M3 4 Q282 1 566 5 L571 329 Q282 337 4 330 Z'
    art=shading(edge,7,8)+path(edge,'url(#vale-lino)','#aa9e70',2)
    art+=rect(16,16,538,299,'none','#63745a',2.8)
    art+=rect(25,24,520,282,'none','#a59467',1.3)
    for xx in (48,521):
        for i in range(8):
            art+=group(ellipse(xx,48,19,6,'none').replace(' fill="none"',' fill="none" stroke="#9b966d" stroke-width=".9"'),
                       transform=f'rotate({i*22.5} {xx} 48)')
    art+=label('Estado peruano',284,58,21,INK,'middle')
    art+=label('Vale de deuda interna',284,124,40,INK,'middle',bold=True)
    art+=path('M69 144 Q285 138 499 144',stroke='#8e936b',line=1.9)
    art+=label('Deuda reconocida del Estado',284,195,27,INK,'middle')
    art+=label('Derecho de cobro',284,244,35,INK,'middle',bold=True)
    art+=label('Modelo editorial',284,287,16,'#696d51','middle',font='Arial')
    return art


def title_frame(beat):
    art=scene_desk(876,352)+put(claim_leaf(recognized=True),90,94,.88,-4)
    if beat==0:
        art+=put(law_book(),840,181,.75,5)
    else:
        if beat==1:
            art+=arrow(666,357,758,357)
        art+=put(vale(),755,183 if beat==1 else 171,.82 if beat==1 else .86,3 if beat==1 else 0)
    if beat==2:
        art+=label('Cobro pendiente',991,539,34,CREAM,'middle')
    return art+vignette(.7)


def envelope():
    edge='M4 13 Q180 9 369 14 L374 197 Q173 203 5 198 Z'
    art=shading(edge,5,7)+path(edge,'url(#sobre-ocre)','#b99a66',2.0)
    art+=path('M7 18 L183 121 L369 18 M7 194 L122 100 M373 194 L240 100',
              stroke='#967a53',line=1.8)
    art+=path('M7 17 Q183 7 369 17 L183 117 Z','url(#papel-hoja)','#b39262',1.7)
    art+=path('M34 143 Q187 139 346 144 M34 150 Q187 145 346 151',
              stroke='#8d7653',line=2.3)
    art+=path('M170 145 Q153 125 169 123 Q190 124 188 145 Q219 124 224 140 Q217 159 189 150 Q212 166 231 181 M186 150 Q180 169 166 174',
              stroke='#8c7251',line=2.8)
    return art


ROLES=(('comerciante','Comprador',226),('intermediario','Intermediario',641),('funcionario','Funcionario',1054))


def office_roles():
    art=office_backdrop()
    people=''
    for role,title,x in ROLES:
        bust=asset(PEOPLE/'bustos'/f'busto-{role}-atencion.svg',x-108,117,216,333)
        people+=traspaso.costume(bust,role) if role=='comerciante' else bust
        people+=label(title,x,53,32,CREAM,'middle')
    return art+f'<svg width="{W}" height="400" viewBox="0 0 {W} 400" overflow="hidden">{people}</svg>'


def office_backdrop():
    art=asset(NOVOA/'oficina.svg',0,0,W,H)
    art+=path('M0 400 H1280 V720 H0 Z','url(#nogal)','#a3875c',2)
    for y in range(441,720,29):
        art+=group(path(f'M0 {y} Q641 {y-13} 1280 {y-4}',stroke='#a38961',line=1.2),opacity=.47)
    return art


def slip(title,body,width=420):
    art=ruled_leaf(width,140)
    art+=label(title,29,61,29,INK,bold=True)
    art+=label(body,29,106,22,INK)
    return art


def bypass():
    return (path('M322 554 Q451 626 604 614 Q797 606 954 504',
                 stroke='#ad6954',line=5)
            +path('M925 512 L954 504 L947 531',stroke='#ad6954',line=5))


def privilege(beat):
    if beat<3:
        art=office_roles()
        if beat==0:
            art+=put(claim_leaf(),217,448,.414,-4)
            art+=arrow(489,547,558,547)
            art+=put(slip('Gestión por comisión','Presentar el reclamo',375),597,461,.91,2)
        elif beat==1:
            art+=put(slip('Cotejo pendiente','Soportes por revisar',330),473,441,.93,-3)
            art+=put(lens(),747,453,.56)
            art+=put(claim_leaf(),102,453,.41,-6)
            art+=bypass()
        else:
            art+=put(slip('Sustento pendiente','Ejemplo de trámite',325),173,454,.90,-4)
            art+=bypass()
            art+=put(slip('Reconocimiento favorecido','Ejemplo de comprobación eludida',467),790,444,.94,1)
        return art+vignette(.77)
    art=scene_desk(684,344)
    art+=put(envelope(),167,276,1.18,-3)
    art+=put(vale(),669,231,.93,2)
    art+=label('Precio pagado',365,193,42,CREAM,'middle',bold=True)
    art+=label('Valor reconocido',925,193,42,CREAM,'middle',bold=True)
    art+=path('M621 166 Q610 370 622 578',stroke='#a18a61',line=2)
    return art+vignette(.76)


def novoa_note():
    art=ruled_leaf(452,161)
    art+=label('Comisión acordada con Elías',27,58,26,INK,bold=True)
    art+=label('Acuerdo legítimo según Quiroz',27,101,24,INK)
    art+=label('Nota editorial',27,134,15,'#66694f',font='Arial')
    return art


def recap(beat):
    if beat==0:
        art=scene_desk()
        art+=put(claim_leaf(),77,199,.47,-3)
        art+=put(envelope(),482,286,.64,3)
        art+=put(vale(),810,215,.69,-2)
        art+=arrow(385,318,462,318)+arrow(733,318,796,318)
        art+=label('Reclamo',219,515,32,CREAM,'middle')
        art+=label('Compra',606,515,32,CREAM,'middle')
        art+=label('Reconocimiento',1004,515,32,CREAM,'middle')
        return art+vignette(.69)
    if beat==1:
        art=scene_desk(491,360)
        art+=put(folder_cover(),197,125,.86,-8)
        art+=put(slip('Ejemplo de trámite','Préstamo al gobierno',415),282,327,.91,-7)
        return art+vignette(.72)
    art=asset(NOVOA/'oficina.svg',0,0,W,H)
    art+=asset(PEOPLE/'bustos/busto-reclamante-atencion.svg',135,135,429*410/570,429)
    art+=path('M0 514 Q567 509 1280 487 V720 H0 Z','url(#nogal)','#a78a61',2)
    art+=put(novoa_folio(),608,137,1.0,-4)
    art+=put(novoa_note(),83,531,.99)
    return art+vignette(.72)


def sequences():
    return (
        Sequence('2A','Un reclamo y una ley',(
            Panel('El mismo folio',entry(0),('Retomar la posición exacta del cierre anterior.','Dar tiempo a la pestaña y al estado Por revisar.')),
            Panel('Volver a las obligaciones',entry(1),('Abrir el encuadre hacia los dos ejemplos ya vistos.','Iluminar préstamo y bienes por turnos.')),
            Panel('La ley de 1850',entry(2),('Entrar la ley junto al mismo papel.','Pausa para leer la fecha y el propósito en la voz.')),
        ),'De una solicitud particular a la regla que organiza el reconocimiento.',
           'Volver al folio para contrastar los campos.'),
        Sequence('2B','Cotejar el reclamo',(
            Panel('Origen del reclamo',check_frame(0),('Cenital fijo. Unir el origen con su respaldo.','Foco cálido en la relación. El resto baja.')),
            Panel('Quién es el acreedor',check_frame(1),('Mover la lupa al nombre del acreedor.','Desplazar luz y línea al segundo soporte.')),
            Panel('Qué monto se sustenta',check_frame(2),('Pasar al campo del monto y sus comprobantes.','Pausa en la comparación, con cámara quieta.')),
            Panel('El reclamo queda reconocido',check_frame(3),('Revelar el cambio de estado después del cotejo.','Asentar el folio. Mantener legible el resultado.')),
        ),'De lo pedido a lo reconocido tras revisar los respaldos.',
           'Conservar la pestaña roja al presentar el título separado.'),
        Sequence('2C','El vale y el derecho de cobro',(
            Panel('Primero se reconoce la deuda',title_frame(0),('Sostener el folio reconocido.','Retomar el libro de la ley como referencia.')),
            Panel('Aparece el vale',title_frame(1),('Desplazar el título hacia el lado del acreedor.','Sombra al asentarse. Marco doble legible.')),
            Panel('El cobro queda pendiente',title_frame(2),('Mantener juntos el folio y el vale.','Foco en derecho de cobro y pausa de lectura.')),
        ),'Del reclamo comprobado al derecho de cobro documentado.',
           'Volver al momento anterior al reconocimiento para ver la compra.'),
        Sequence('2D','El papel y el pago cambian de manos',(
            Panel('Presentar a ambos de cuerpo entero',traspaso.wide(envelope(),0),('El folio a la izquierda y el sobre a la derecha.','Luz de ventana sobre la madera y las figuras.')),
            Panel('Acercarse con el gesto',traspaso.wide(envelope(),.56),('Empujar la cámara mientras levantan los brazos.','La mesa avanza por delante de los muebles.')),
            Panel('Reencuadrar la mesa',traspaso.wide(envelope(),1),('Cerrar el plano con el zoom de la misma toma.','Conservar la longitud del brazo al flexionar el codo.')),
            Panel('La palma se acerca al borde',traspaso.close(envelope(),1),('Pasar al cenital conservando los lados.','El foco sigue el papel hacia la mano.')),
            Panel('El agarre compartido',traspaso.close(envelope(),4),('Ambos pulgares quedan sobre el folio.','Sostener el contacto antes de la retirada.')),
            Panel('El papel llega al comprador',traspaso.close(envelope(),5),('La reclamante suelta y retira el brazo.','El sobre arranca en sentido contrario.')),
            Panel('El pago llega a la reclamante',traspaso.close(envelope(),7),('La mano entra en diagonal para recibir el sobre.','El rastro se desvanece al frenarse el pago.')),
        ),'De una solicitud en manos del reclamante a un papel comprado por otro.',
           'Seguir al comprador hacia la gestión del reconocimiento.'),
        Sequence('2E','Gestión y reconocimiento favorecido',(
            Panel('Presentar las tres funciones',privilege(0),('Comprador, intermediario y funcionario conservan su lugar.','Iluminar cada función cuando se la nombra.')),
            Panel('La comprobación queda pendiente',privilege(1),('Mostrar la revisión que se elude en el ejemplo.','El trazo rojo se dibuja por fuera del cotejo.')),
            Panel('El trámite recibe trato favorecido',privilege(2),('Mantener visible el sustento pendiente.','El foco pasa al resultado, con cámara quieta.')),
            Panel('Precio y valor reconocido',privilege(3),('Comparar sobre y vale en el mismo encuadre.','Dos focos de igual intensidad y tiempo de lectura.')),
        ),'De una gestión que puede ser legítima a una decisión favorecida.',
           'Reunir lo aprendido antes de abrir un expediente distinto.'),
        Sequence('2F','Cerrar el ejemplo y abrir Novoa',(
            Panel('Reunir el recorrido',recap(0),('Abrir para ver reclamo, compra y reconocimiento.','Recorrer los tres objetos con un foco por vez.')),
            Panel('Guardar el ejemplo',recap(1),('Cerrar y desplazar la carpeta genérica.','Sombra de la tapa y pausa breve al cerrarla.')),
            Panel('Otro expediente',recap(2),('Abrir la carpeta de Ignacia Novoa.','Separar el acuerdo legítimo de comisión con Elías.')),
        ),'Del ejemplo del trámite a la investigación de un caso histórico.',
           'Conservar la nueva carpeta y la identificación de Novoa al entrar a 3A.'),
    )


def pieces():
    return {
        'mesa-cenital-reclamo':(W,H,wood(),'Base común de 2A–2F. Mover el foco y los papeles sobre la madera fija.'),
        'oficina-reclamo':(W,H,office_backdrop(),'Fondo de las tres funciones. Montar los bustos sobre el borde de la mesa, con base en y=400.'),
        'libro-ley-consolidacion':(390,451,law_book(),'Cubierta y canto. Revelar la fecha en 2A.'),
        'soporte-origen':(419,161,evidence(0),'Desplazar el foco del origen al respaldo.'),
        'soporte-acreedor':(419,161,evidence(1),'Aparear acreedor y soporte.'),
        'soporte-monto':(419,161,evidence(2),'Aparear monto y comprobantes.'),
        'lupa-cotejo':(232,242,lens(),'Mover por el mango. Mantener los campos legibles.'),
        'folio-reconocido':(656,568,claim_leaf(recognized=True),'Mismo folio de pestaña roja con el estado del ejemplo.'),
        'vale-deuda-interna':(603,363,vale(),'Desplazar como documento independiente del folio.'),
        'sobre-simbolico-pago':(401,228,envelope(),'Pago de derecha a izquierda. Ancla de base en el centro.'),
        'oficina-traspaso':(W,H,traspaso.room(),'Paredes, muebles, ventana y luz en grupos separados para el acercamiento.'),
        'escritorio-traspaso':(W,H,traspaso.table(),'Mesa de perspectiva del plano general. Colocar folio y sobre encima.'),
        'reclamante-cuerpo-entero':(900,1200,traspaso.character_piece('reclamante'),'Vestido vino y chal. El brazo cercano conserva grupos de hombro y codo.'),
        'comprador-cuerpo-entero':(900,1200,traspaso.character_piece('comerciante'),'Casaca azul. Reflejar al colocar a la derecha. El brazo cercano conserva hombro y codo.'),
        'reclamante-puno-bordado-agarre':(645,345,traspaso.hand_piece('reclamante','grip'),'Contacto en (603,92). Montar base detrás del folio y pulgar delante.'),
        'reclamante-puno-bordado-abierto':(645,345,traspaso.hand_piece('reclamante','open'),'Mano abierta que recibe el sobre.'),
        'comprador-puno-botones-agarre':(645,345,traspaso.hand_piece('comerciante','grip'),'Contacto en (603,92). Reflejar y montar base detrás del folio y pulgar delante.'),
        'comprador-puno-botones-abierto':(645,345,traspaso.hand_piece('comerciante','open'),'Reflejar. Mantener muñeca al alternar con el agarre.'),
        'mesa-cenital-traspaso':(W,H,traspaso.overhead_desk(),'Vista superior con el mismo tintero para el cruce del sobre.'),
        'trazo-revision-eludida':(W,H,bypass(),'Revelar de izquierda a derecha durante 2E.'),
        'ficha-comision-gestion':(405,165,slip('Gestión por comisión','Presentar el reclamo',375),'Primera gestión en 2E.'),
        'ficha-cotejo-pendiente':(360,166,slip('Cotejo pendiente','Soportes por revisar',330),'Mantener visible antes del trazo.'),
        'ficha-reconocimiento-favorecido':(497,166,slip('Reconocimiento favorecido','Ejemplo de comprobación eludida',467),'Resultado del ejemplo.'),
        'nota-comision-novoa':(480,189,novoa_note(),'Aparece con la carpeta distinta de Novoa.'),
    }


def save():
    OUT.mkdir(exist_ok=True)
    layers=OUT/'capas'
    layers.mkdir(exist_ok=True)
    blocks=sequences()
    old=json.loads((LONG/'escena-02/secuencia.json').read_text(encoding='utf-8'))
    assert [x.code for x in blocks]==[x['id'] for x in old['desarrollo']]
    references={
        '2A':['../revision-islas/folio-salida.svg','../revision-islas/capas/documento-prestamo.svg','../revision-islas/capas/documento-bienes.svg'],
        '2B':['../revision-islas/capas/folio-reclamo.svg'],
        '2C':['../revision-islas/capas/folio-reclamo.svg'],
        '2D':['../revision-islas/capas/folio-reclamo.svg',
              '../../personajes-1850/reclamante/rig.json',
              '../../personajes-1850/comerciante/rig.json'],
        '2E':['../../personajes-1850/bustos/busto-comerciante-atencion.svg',
              '../../personajes-1850/bustos/busto-intermediario-atencion.svg',
              '../../personajes-1850/bustos/busto-funcionario-atencion.svg',
              '../revision-islas/capas/folio-reclamo.svg'],
        '2F':['../revision-islas/capas/tapa-carpeta.svg','../revision-novoa/capas/expediente-novoa.svg',
              '../recursos/novoa/oficina.svg',
              '../revision-islas/capas/folio-reclamo.svg',
              '../../personajes-1850/bustos/busto-reclamante-atencion.svg'],
    }
    used={
        '2A':['libro-ley-consolidacion'],
        '2B':['soporte-origen','soporte-acreedor','soporte-monto','lupa-cotejo','folio-reconocido'],
        '2C':['libro-ley-consolidacion','folio-reconocido','vale-deuda-interna'],
        '2D':['sobre-simbolico-pago','oficina-traspaso','escritorio-traspaso',
              'reclamante-cuerpo-entero','comprador-cuerpo-entero','reclamante-puno-bordado-agarre',
              'reclamante-puno-bordado-abierto','comprador-puno-botones-agarre','comprador-puno-botones-abierto',
              'mesa-cenital-traspaso'],
        '2E':['oficina-reclamo','ficha-comision-gestion','ficha-cotejo-pendiente','trazo-revision-eludida',
              'ficha-reconocimiento-favorecido','sobre-simbolico-pago','vale-deuda-interna','lupa-cotejo'],
        '2F':['sobre-simbolico-pago','vale-deuda-interna','nota-comision-novoa'],
    }
    data=[]
    for number,block in enumerate(blocks,1):
        name=f'lamina-{number:02}.svg'
        (OUT/name).write_text(sheet(block,number,heading='El recorrido de un reclamo',definitions=DEFS),encoding='utf-8')
        assert all((OUT/ref).exists() for ref in references[block.code]), block.code
        data.append({'id':block.code,'lamina':name,'cambio':block.change,'enlace':block.link,
                     'piezas_nuevas':['mesa-cenital-reclamo']+used[block.code],
                     'recursos_reutilizados':references[block.code],
                     'encuadres':[{'plano':p.title,'camara_y_accion':p.direction[0],'efecto_y_pausa':p.direction[1]}
                                  for p in block.panels]})
    library=pieces()
    inventory=[]
    for name,(width,height,content,note) in library.items():
        filename=f'capas/{name}.svg'
        (OUT/filename).write_text(svg(group(content,id=name),width,height,DEFS),encoding='utf-8')
        inventory.append({'id':name,'archivo':filename,'lienzo':[width,height],'uso':note})
    (OUT/'secuencia.json').write_text(json.dumps(data,ensure_ascii=False,indent=2)+'\n',encoding='utf-8')
    (OUT/'piezas.json').write_text(json.dumps(inventory,ensure_ascii=False,indent=2)+'\n',encoding='utf-8')
    (OUT/'prueba-movimiento-2d.html').write_text(traspaso.preview(envelope(),DEFS),encoding='utf-8')
    for name,panel in [('entrada-desde-1D2',blocks[0].panels[0]),('cotejo-origen',blocks[1].panels[0]),
                       ('vale-derecho-de-cobro',blocks[2].panels[2]),('agarre-cenital',blocks[3].panels[4]),
                       ('intercambio-cuerpo-entero',blocks[3].panels[0]),('acercamiento-mesa',blocks[3].panels[2]),
                       ('pago-cenital',blocks[3].panels[6]),
                       ('apertura-novoa',blocks[5].panels[2])]:
        (OUT/f'{name}.svg').write_text(svg(panel.image,W,H,DEFS),encoding='utf-8')
    print(f'{len(blocks)} láminas, {sum(len(x.panels) for x in blocks)} encuadres, {len(library)} piezas nuevas.')


if __name__=='__main__':
    save()
