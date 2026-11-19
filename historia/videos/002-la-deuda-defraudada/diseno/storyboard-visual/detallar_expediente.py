"""Escena larga 3. Láminas y capas de El expediente de Novoa."""
import json
from random import Random

from piezas import HERE, LONG, PEOPLE, CREAM, INK, asset, gradient, group, label, path, read_svg, rect, svg
from detallar_islas import W, H, Panel, Sequence, clipped, folder_cover, paper_light, sheet, vignette
from detallar_novoa import folio, folio_at, ink_and_quill, overhead, ribbon, wood
from detallar_reclamo import DEFS as RECLAMO_DEFS, put, recap, ruled_leaf, vale
from despacho_traspaso import room
from detallar_traspaso import hands

OUT = HERE/'revision-novoa/escena-completa'
DEFS = (RECLAMO_DEFS + gradient('archivo-fondo','#63735b','#25342b',True)
        + gradient('manga-elias-cenital','#8d8063','#514634'))
ASSETS = {}
CONTACT_SHADOWS = ((708,466,45,13),(699,489,46,12))
ELIAS_POSES = ('bustos/busto-intermediario-atencion.svg',
               'poses-continuidad/busto-intermediario-prepara.svg',
               'bustos/busto-intermediario-senala.svg')


def piece(name, art, width, height, use):
    ASSETS[name] = (width,height,art,use)
    return art


def desk(x=635,y=345):
    return wood()+ink_and_quill()+put(ribbon(),63,606,.76,-18)+paper_light(x,y,563,397,.55)


def body(file, x, y, height, mirror=False):
    _,_,vw,vh = map(float,read_svg(file).get('viewBox').split())
    width = height*vw/vh
    art = asset(file,x,y,width,height)
    return group(art,transform=f'translate({2*x+width} 0) scale(-1 1)') if mirror else art


def estate():
    art = ruled_leaf(460,225)
    art += path('M29 119 Q88 81 134 98 T245 87 Q300 68 430 102 V193 H29 Z','#b6ad82')
    art += path('M29 132 Q146 109 249 132 T430 118 V193 H29 Z','#9c9c77')
    for y in (147,159,172,186):
        art += path(f'M29 {y} Q202 {y-18} 429 {y+1}',stroke='#7c8066',line=1.8)
    art += path('M137 130 V86 L185 63 L237 85 V130 Z','#cfb587','#777558',1.7)
    art += path('M129 88 L185 58 L245 86 L237 91 L185 69 L135 93 Z','#9a7056')
    art += rect(178,104,16,26,'#6b7057')+rect(148,103,14,13,'#7a7b5d')+rect(209,103,14,13,'#7a7b5d')
    art += path('M257 113 H422 M264 104 V124 M303 104 V124 M342 104 V124 M381 104 V124',
                stroke='#726c50',line=2)
    art += label('Hacienda expropiada',30,42,27,INK,bold=True)
    art += label('Según la solicitud',30,210,15,INK,font='Arial')
    return art


def scope():
    art = ruled_leaf(465,196)
    art += label('32 años',31,78,57,INK,bold=True)
    art += label('de ganancias reclamadas',32,113,26,INK)
    art += path('M34 152 V164 H426 V152',stroke='#a17b54',line=2)
    for i in range(32):
        x=38+i*12.45
        art += path(f'M{x:.2f} 156 v{-10 if i%8 else -17}',stroke='#80674d',line=1.55)
    return art


def request(beat):
    if beat==0:
        return recap(2)
    focus=((975,206),(430,370),(956,545))[beat-1]
    art = desk(*focus)+folio_at(103,97,-4)
    estate_art = put(ASSETS['grabado-hacienda'][2],744,137,.94,2)
    art += group(estate_art,style='filter:brightness(.78)') if beat==2 else estate_art
    if beat==2:
        art += group(path('M173 380 Q371 372 534 356',stroke='#a57759',line=2.4),opacity=.79)
    if beat==3:
        art += put(ASSETS['alcance-32-anos'][2],742,408,.97,-2)
    return art+vignette(.64)


def range_leaf():
    art = ruled_leaf(526,187)
    art += label('Aprobación que buscaba Elías',27,49,27,INK,bold=True)
    art += label('500.000–600.000',27,111,48,INK,bold=True)
    art += label('pesos en vales',29,150,24,INK)
    return art


def elias(beat):
    art = ASSETS['despacho-elias'][2]
    x = 836 if beat==0 else 636
    art += body(PEOPLE/ELIAS_POSES[beat],x,112,428,mirror=True)
    # La mesa oculta el cuerpo en el mismo punto durante todo el gesto.
    art += ASSETS['mesa-frontal-elias'][2]
    art += group(folio(),transform='translate(378 440) rotate(-7) scale(.66 .41)')
    art += rect(868,25,270,76,'#2b362d','#7d795c',1.2,2)
    art += label('Domingo Elías',1003,58,32,CREAM,'middle',bold=True)
    art += label('Intermediario',1003,84,20,CREAM,'middle')
    if beat==2:
        art += put(ASSETS['objetivo-elias'][2],65,182,1.04,-2)
    return art+vignette(.55)


def elias_hand(pose,x,y):
    sleeve,thumb = hands('comerciante','grip' if pose=='agarre' else 'open')
    art = (sleeve+thumb).replace('url(#manga-azul)','url(#manga-elias-cenital)')
    for before,after in (('#2c3841','#3f3a2c'),('#879aa4','#b5a586')):
        art=art.replace(before,after)
    return group(art,transform=f'translate({x+27} {y+85}) rotate(18) scale(-.92 .92)')


def amounts(kind):
    heading, number, certainty = {
        'aprobacion':('Aprobación del expediente','948.500',''),
        'recepcion':('Según Quiroz','180.000','Probablemente recibió alrededor de'),
    }[kind]
    art = ruled_leaf(555,260)
    art += label(heading,30,49,28,INK,bold=True)
    art += path('M31 65 H522',stroke='#a08861',line=1.4)
    if certainty:
        art += label(certainty,30,107,24,INK)
    art += label(number,30,173,72,INK,bold=True)
    art += label('pesos en vales',32,219,27,INK)
    return art


def approval(beat):
    art = desk(940,369)+folio_at(91,143,-5,closed=True)
    art += put(ruled_leaf(510,97)+label('Echenique · Fuera de plazo',28,58,29,'#785445',bold=True),
               723,126,.95,1)
    if beat==0:
        art += put(ASSETS['ficha-torrico'][2],723,300,.95,-2)
    else:
        art += label('Unos días después',948,297,34,CREAM,'middle')
        if beat==2:
            art += put(ASSETS['monto-aprobado'][2],691,324,.95,1)
    return art+vignette(.66)


def comparison(beat):
    focus=(390,945,650)[beat]
    art=desk(focus,315)
    art+=put(ASSETS['monto-aprobado'][2],66,133,1,-2)
    if beat==0:
        art+=put(vale(),747,170,.79,3)
    else:
        art+=put(ASSETS['monto-probable'][2],662,113,1,2)
        art+=path('M630 144 V468',stroke='#aa8d60',line=1.6)
        if beat==2:
            art+=put(vale(),485,497,.52,-1)
    return art+vignette(.65)


def shelves():
    art=rect(0,0,W,H,'url(#archivo-fondo)')
    rng=Random(1851)
    for y in (151,292,433):
        art+=rect(38,y-117,1204,112,'#3e3629')
        for x in range(61,1206,72):
            h=rng.randint(79,108)
            art+=rect(x,y-h,60,h,'url(#carton)' if x%5 else '#706750','#5d4d37',1.8,2)
            art+=rect(x+9,y-h+21,41,19,'#a4906b','#685d47',1)
            art+=path(f'M{x+16} {y-h+31} h26',stroke='#6b604a',line=1.3)
            art+=path(f'M{x+4} {y-h+6} h49 M{x+4} {y-h+11} h49',stroke='#bba27d',line=.8)
        art+=rect(24,y-4,1232,15,'url(#canto-mesa)','#a38459',1.4)
    art+=path('M0 499 Q652 512 1280 485 V720 H0 Z','url(#nogal)','#9c8058',2.6)
    art+=paper_light(622,465,582,340,.59)
    return art


def archive(beat):
    if beat==0:
        art=desk(604,358)+put(folio(True),108,153,.82,-5)
        art+=put(ASSETS['rastro-funciones'][2],628,149,.99,1)
    elif beat==1:
        art=ASSETS['archivo-conjunto'][2]
        art+=clipped(body(PEOPLE/'bustos/busto-intermediario-atencion.svg',781,118,386),
                     (0,0,W,495),'elias-archivo')
        art+=put(ASSETS['elias-denuncia'][2],114,275,1.01,-3)
        art+=put(folio(True),514,466,.47,-8)
    else:
        art=ASSETS['archivo-conjunto'][2]
        art+=put(folder_cover(),175,366,.64,-7)
        art+=put(ASSETS['total-1851'][2],431,326,1.14,-2)
    return art+vignette(.67)


def build_assets():
    piece('grabado-hacienda',estate(),480,250,'Inserto editorial. Mostrar al nombrar la hacienda.')
    piece('alcance-32-anos',scope(),485,220,'Revelar la llave por secciones sin asignar fechas.')
    piece('despacho-elias',group(room(),transform='translate(-46 -95) scale(1.12)')
          +paper_light(974,270,336,296,.43),W,H,'Fondo de 3B y del primer plano de 3C.')
    piece('mesa-frontal-elias',table_front(),W,H,'Oculta la cintura con el mismo borde en las tres poses.')
    piece('objetivo-elias',range_leaf(),550,211,'Revelar el intervalo y su unidad juntos.')
    piece('elias-cenital-agarre',elias_hand('agarre',647,359),W,H,'Entrada desde abajo a la derecha. Conservar punto de agarre.')
    piece('elias-cenital-apoyo',elias_hand('apoyo',645,380),W,H,'Pose de apoyo. El codo y el puño siguen separados.')
    piece('ficha-torrico',ruled_leaf(515,187)+label('Juan Crisóstomo Torrico',30,62,34,INK,bold=True)
          +label('Ministro de Guerra',31,109,26,INK)+label('Intervino en el trámite',31,148,22,INK),
          539,211,'Entra bajo el antecedente de plazo. Sin firma ni orden.')
    piece('monto-aprobado',amounts('aprobacion'),580,286,'Mostrar 948.500 con su unidad. Sostener dos segundos.')
    piece('monto-probable',amounts('recepcion'),580,286,'Mostrar el grado de certeza desde el primer fotograma legible.')
    piece('archivo-conjunto',shelves(),W,H,'Estantes y mesa para ampliar al conjunto de la deuda.')
    roles=ruled_leaf(557,335)
    roles+=label('Recorrido del expediente',30,61,31,INK,bold=True)
    for i,(name,action) in enumerate((('Novoa','Presenta la solicitud'),('Elías','Gestiona el reconocimiento'),
                                      ('Echenique','Comunica el plazo'),('Torrico','Interviene en el trámite'))):
        y=119+52*i
        roles+=label(name,30,y,25,INK,bold=True)+label(action,181,y,23,INK)
        roles+=path(f'M30 {y+11} H520',stroke='#ab9369',line=1.1)
    piece('rastro-funciones',roles,580,360,'Recuperar las funciones por turnos.')
    piece('elias-denuncia',ruled_leaf(484,159)+label('Domingo Elías',30,60,36,INK,bold=True)
          +label('Volverá como denunciante',30,111,26,INK),510,183,'Enlace con la investigación.')
    piece('total-1851',ruled_leaf(593,246)+label('Conjunto de la deuda · 1851',29,58,30,INK,bold=True)
          +label('5 millones',29,140,65,INK,bold=True)+label('de pesos de deuda reconocida',31,191,25,INK),
          618,270,'Entrada de 4A.1. Usar la carpeta genérica.')


def table_front():
    art = path('M0 510 Q555 521 1280 484 V720 H0 Z','url(#nogal)','#9d865d',2)
    for y in range(547,698,26):
        art += path(f'M0 {y} Q635 {y+6} 1280 {y-33}',stroke='#9b7d56',line=1.2)
    return art+path('M0 676 Q656 679 1280 653 V720 H0 Z','url(#canto-mesa)','#8a6b4e',1.4)


def sequences():
    return (
        Sequence('3A','Lo que pedía compensar',(
            Panel('El mismo expediente',request(0),('Retomar el encuadre exacto con que termina 2F.','Dar tiempo al nombre y la comisión antes del corte.')),
            Panel('La hacienda expropiada',request(1),('Acercarse al folio y descubrir el grabado editorial.','Asentar el papel y concentrar luz en la hacienda.')),
            Panel('La solicitud incluía a 500 personas esclavizadas',request(2),('Volver al renglón con cámara quieta.','Retirar la música. Sostener la lectura.')),
            Panel('Treinta y dos años reclamados',request(3),('Abrir espacio bajo el grabado para la extensión.','Dibujar la llave. Mantener la expresión «reclamadas».')),
        ),'La solicitud y su alcance.','Seguir el mismo folio hacia la gestión de Elías.'),
        Sequence('3B','Elías hace la gestión',(
            Panel('Domingo Elías, intermediario',elias(0),('Situarlo a la derecha con el expediente a su alcance.','Ventana tenue. Sostener nombre y función.')),
            Panel('Elías prepara el gesto',elias(1),('Mantener cabeza y torso en el mismo lugar.','Flexionar hombro y codo con longitud fija.')),
            Panel('El intervalo que buscaba',elias(2),('El gesto termina hacia el expediente.','Roce de hoja al entrar el intervalo completo.')),
        ),'De la solicitud al intento de conseguir aprobación.','Conservar el lado de Elías al llegar la respuesta.'),
        Sequence('3C','El trámite se detiene',(
            Panel('Continuidad con la gestión',elias(2),('Retomar el mismo plano medio al terminar el gesto.','Mantener la luz lateral.')),
            Panel('Llega la respuesta',overhead(1,elias_hand,CONTACT_SHADOWS),('Conservar el folio a la izquierda y la mano a la derecha.','Identificar a Echenique antes de revelar el resultado.')),
            Panel('Fuera de plazo',overhead(2,elias_hand,CONTACT_SHADOWS),('La mano pasa de agarre a apoyo y la tapa se asienta.','Tras la quietud, iluminar y subrayar «Fuera de plazo».')),
            Panel('El antecedente queda visible',overhead(3),('La mano se retira. El expediente queda quieto.','Sostener dos segundos y bajar el foco antes de 3D.')),
        ),'Echenique comunica que el reclamo estaba fuera de plazo.','Mantener la respuesta al presentar a Torrico.'),
        Sequence('3D','Intervención y aprobación',(
            Panel('Entra la ficha de Torrico',approval(0),('Mantener el antecedente y presentar al ministro.','Deslizar la ficha con roce y sombra de contacto.')),
            Panel('Unos días después',approval(1),('Dejar el expediente quieto al salir la ficha de Torrico.','Dar un pulso de silencio para marcar el paso de días.')),
            Panel('948.500 pesos en vales',approval(2),('Sostener el encuadre al entrar la ficha de aprobación.','Revelar cifra y unidad juntas. Pausa de 2 s.')),
        ),'Del antecedente a la intervención y al monto aprobado.','Conservar la cifra y recuperar el vale de la escena 2.'),
        Sequence('3E','Lo aprobado y lo probablemente recibido',(
            Panel('Recuperar el significado del vale',comparison(0),('Mantener el monto aprobado al lado del vale conocido.','Dar un foco leve al derecho de cobro.')),
            Panel('La estimación de Quiroz',comparison(1),('La segunda ficha entra a la derecha en bloque.','«Probablemente» y «en vales» entran con 180.000.')),
            Panel('Leer ambas fichas juntas',comparison(2),('Cámara fija. Sostener ambas cifras y sus unidades.','Igualar luz. Dejar el vale como referencia común.')),
        ),'Distinguir la aprobación de lo que Novoa habría recibido.','Volver a las personas y pasar del caso al conjunto.'),
        Sequence('3F','Del expediente al conjunto de la deuda',(
            Panel('Recuperar las funciones',archive(0),('Volver a la carpeta de Novoa y leer las funciones por turno.','Un foco discreto por renglón.')),
            Panel('Volver a Elías',archive(1),('Abrir al archivo y recuperar a Elías como enlace.','Cerrar la carpeta y retirarla antes del dato general.')),
            Panel('Conjunto de la deuda en 1851',archive(2),('Abrir con la carpeta general y un encuadre estable.','Presentar cinco millones y conservar el plano para 4A.1.')),
        ),'Cambiar de escala sin arrastrar el expediente particular.','Reutilizar este plano en 4A.1.'),
    )


def save():
    build_assets()
    parts=OUT/'capas'
    parts.mkdir(parents=True,exist_ok=True)
    for name,(w,h,art,use) in ASSETS.items():
        (parts/f'{name}.svg').write_text(svg(group(art,id=name),w,h,DEFS),encoding='utf-8')
    seq=sequences()
    prior=json.loads((LONG/'escena-03/secuencia.json').read_text(encoding='utf-8'))['desarrollo']
    assert [x.code for x in seq]==[x['id'] for x in prior]
    pieces_by_moment={
        '3A':['grabado-hacienda','alcance-32-anos'],
        '3B':['despacho-elias','mesa-frontal-elias','objetivo-elias'],
        '3C':['despacho-elias','mesa-frontal-elias','objetivo-elias','elias-cenital-agarre','elias-cenital-apoyo'],
        '3D':['ficha-torrico','monto-aprobado'],
        '3E':['monto-aprobado','monto-probable'],
        '3F':['rastro-funciones','archivo-conjunto','elias-denuncia','total-1851'],
    }
    people='../../../personajes-1850'
    folio_ref='../capas/expediente-novoa.svg'
    shared={
        '3A':['../../revision-reclamo/apertura-novoa.svg',folio_ref],
        '3B':[folio_ref,*[f'{people}/{name}' for name in ELIAS_POSES]],
        '3C':[folio_ref,f'{people}/{ELIAS_POSES[-1]}','../capas/mesa-cenital.svg','../capas/tapa-expediente.svg',
              '../capas/respuesta-base.svg','../capas/fuera-de-plazo.svg','../capas/trazo-corrector.svg',
              '../capas/foco-respuesta.svg'],
        '3D':[folio_ref,'../capas/tapa-expediente.svg','../capas/mesa-cenital.svg'],
        '3E':['../../revision-reclamo/capas/vale-deuda-interna.svg','../capas/mesa-cenital.svg'],
        '3F':[folio_ref,f'{people}/{ELIAS_POSES[0]}','../../revision-islas/capas/tapa-carpeta.svg'],
    }
    timeline=[]
    for number,block in enumerate(seq,1):
        name=f'lamina-{number:02}.svg'
        (OUT/name).write_text(sheet(block,number,heading='El expediente de Novoa',definitions=DEFS),encoding='utf-8')
        assert all((OUT/ref).is_file() for ref in shared[block.code]),block.code
        timeline.append({'id':block.code,'lamina':name,'cambio':block.change,'enlace':block.link,
                         'piezas':pieces_by_moment[block.code],'recursos_reutilizados':shared[block.code],
                         'encuadres':[{'plano':p.title,'camara_y_accion':p.direction[0],'efecto_y_pausa':p.direction[1]}
                                      for p in block.panels]})
    for name,image in [('entrada-3a',seq[0].panels[0].image),('gestion-elias',seq[1].panels[-1].image),
                       ('aprobacion-948500',seq[3].panels[-1].image),('comparacion-vales',seq[4].panels[-1].image),
                       ('enlace-4a-1851',seq[-1].panels[-1].image)]:
        (OUT/f'{name}.svg').write_text(svg(image,W,H,DEFS),encoding='utf-8')
    (OUT/'secuencia.json').write_text(json.dumps(timeline,ensure_ascii=False,indent=2)+'\n',encoding='utf-8')
    inventory=[{'id':n,'archivo':f'capas/{n}.svg','lienzo':[w,h],'uso':use} for n,(w,h,art,use) in ASSETS.items()]
    (OUT/'piezas.json').write_text(json.dumps(inventory,ensure_ascii=False,indent=2)+'\n',encoding='utf-8')
    print(f'{len(seq)} laminas, {sum(len(b.panels) for b in seq)} encuadres, {len(ASSETS)} piezas.')


if __name__=='__main__':
    save()
