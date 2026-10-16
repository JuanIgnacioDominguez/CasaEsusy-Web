import type { PreguntaRespuesta, TipoServicio } from "./schema";

/**
 * Contenido inicial de la base. Sale del relevamiento del negocio (Instagram,
 * Google y Facebook). Todo se edita después desde el panel.
 */

interface ServicioSemilla {
  slug: string;
  nombre: string;
  titulo: string;
  bajada: string;
  descripcion: string;
  imagen: string;
  tipos: TipoServicio[];
  preguntas: PreguntaRespuesta[];
  mensajeWhatsApp: string;
}

export const SERVICIOS: ServicioSemilla[] = [
  {
    slug: "cortinas",
    nombre: "Cortinas",
    titulo: "Cortinas a medida en Banfield, Capital y zona sur",
    bajada: "Gasas, black out, roller, venecianas y bandas verticales hechas a la medida de cada ventana. Medimos, confeccionamos y colocamos.",
    descripcion:
      "Una buena cortina cambia la luz, la temperatura y el clima de un ambiente. Por eso empezamos por preguntarte cómo usás cada espacio: si querés dormir a oscuras, filtrar el sol del living o tener privacidad sin perder claridad.\n\nVamos a tu casa con muestras para que elijas viendo la luz real, tomamos las medidas exactas y te pasamos un presupuesto claro. Trabajamos telas nacionales e importadas y sistemas de primeras marcas como Flexcolor y Riel Americano, y nuestro colocador se ocupa de la instalación.",
    imagen: "/img/ambientes/cortinas-gasas-luz.jpg",
    tipos: [
      { nombre: "Gasas y voile", descripcion: "De lino y bambú. Dejan pasar la luz pareja y dan privacidad sin oscurecer." },
      { nombre: "Black out textil", descripcion: "Oscuridad total para dormir. Además aísla del frío y del calor." },
      { nombre: "Roller", descripcion: "Black out, sunscreen y screen de diseño. Ocupan poco y se manejan fácil." },
      { nombre: "Venecianas", descripcion: "Madera, PVC y aluminio, con listones de 25 o 50 mm, para regular la luz con precisión." },
      { nombre: "Romanas y bandas verticales", descripcion: "Para cocinas, oficinas, consultorios y ventanales anchos." },
      { nombre: "Rieles y barrales", descripcion: "Rectos, curvables y con accesorios. También renovamos los que ya tenés." },
    ],
    preguntas: [
      {
        pregunta: "¿Vienen a medir a casa?",
        respuesta: "Sí. Coordinamos una visita para tomar medidas y llevar muestras, en Capital, zona sur o donde estés. La visita y el presupuesto no tienen cargo.",
      },
      {
        pregunta: "¿Qué conviene para el dormitorio?",
        respuesta: "Para dormir a oscuras, black out textil o roller black out. Si querés que de día entre luz, sumá una gasa por delante: es la combinación que más hacemos.",
      },
      {
        pregunta: "¿Las cortinas de tela encogen al lavarlas?",
        respuesta: "Algunas telas pueden encoger si se lavan en caliente o en lavarropas. Con cada trabajo te indicamos cómo cuidarla: muchas se limpian en seco o se lavan a mano en agua fría.",
      },
    ],
    mensajeWhatsApp: "Hola Casa Esusy, quiero presupuesto de cortinas a medida.",
  },
  {
    slug: "tapiceria",
    nombre: "Sillones y tapizados",
    titulo: "Sillones a medida y retapizado de muebles",
    bajada: "Sillones nuevos, retapizados, fundas y respaldos de cama. Vos elegís la forma, la tela y el relleno; nosotros lo hacemos realidad.",
    descripcion:
      "Hacemos sillones a medida para aprovechar cada centímetro del living y renovamos los que ya tenés con tela y espuma nuevas. Definimos juntos la forma, la cantidad de cuerpos, la profundidad y la terminación.\n\nTrabajamos pana, chenille, velvet, lino y telas antimanchas, ideales si hay chicos o mascotas. Si querés que el sillón combine con las cortinas y la alfombra, te ayudamos a armar el conjunto.",
    imagen: "/img/ambientes/sillon-pana-oliva.jpg",
    tipos: [
      { nombre: "Sillones a medida", descripcion: "Rectos, esquineros o con chaise, en las medidas exactas de tu espacio." },
      { nombre: "Retapizado", descripcion: "Le damos una vida nueva a sillones, butacas y sillas que querés conservar." },
      { nombre: "Fundas de sillón", descripcion: "A medida y fáciles de sacar para lavar o cambiar según la temporada." },
      { nombre: "Respaldos de cama", descripcion: "Tapizados en velvet, pana o lino, con la forma que elijas." },
    ],
    preguntas: [
      {
        pregunta: "¿Qué tela conviene si tengo mascotas?",
        respuesta: "Las telas antimanchas y de trama cerrada son las más resistentes. Te mostramos muestras en el local o las llevamos a tu casa.",
      },
      {
        pregunta: "¿Puedo traer mi propia tela?",
        respuesta: "Consultanos por WhatsApp: depende del tipo de tela y del trabajo.",
      },
    ],
    mensajeWhatsApp: "Hola Casa Esusy, quiero consultar por un sillón o un retapizado.",
  },
  {
    slug: "dormitorio",
    nombre: "Acolchados y almohadones",
    titulo: "Acolchados, cubrecamas y almohadones",
    bajada: "Acolchados king, queen y twin, cubrecamas y sábanas a medida y almohadones para darle calidez a cada ambiente.",
    descripcion:
      "El dormitorio se termina de definir con los textiles. Tenemos acolchados en varias medidas y colores neutros que combinan con todo, y hacemos cubrecamas y sábanas a medida para camas especiales.\n\nTambién confeccionamos almohadones y placas de goma espuma enfundadas, en pana, lino y texturas de temporada, para sillones, camas y rincones de lectura.",
    imagen: "/img/ambientes/dormitorio-respaldo-ratan.jpg",
    tipos: [
      { nombre: "Acolchados", descripcion: "King, queen y twin en blanco, gris, beige e ivory." },
      { nombre: "Cubrecamas y sábanas a medida", descripcion: "Para camas y sommiers con medidas especiales." },
      { nombre: "Almohadones", descripcion: "Pana, lino y placas enfundadas antimanchas, en los colores que elijas." },
    ],
    preguntas: [],
    mensajeWhatsApp: "Hola Casa Esusy, quiero consultar por acolchados o almohadones.",
  },
  {
    slug: "alfombras",
    nombre: "Alfombras",
    titulo: "Alfombras y carpetas a medida",
    bajada: "Carpetas personalizadas en forma, tamaño, guardas y colores. Yute, bouclé y lisas para casas, oficinas y comercios.",
    descripcion:
      "La alfombra correcta termina de armar un ambiente: ordena el espacio, suma calidez y amortigua el ruido. Diseñamos carpetas a medida y tenemos modelos de yute natural, bouclé y lisos.\n\nUna regla que usamos siempre: la alfombra tiene que entrar, al menos, debajo de las patas delanteras del sillón. Pasanos las medidas del ambiente y te recomendamos el tamaño justo.",
    imagen: "/img/ambientes/alfombra-living.jpg",
    tipos: [
      { nombre: "Carpetas a medida", descripcion: "Diseño, forma, guardas y colores a elección." },
      { nombre: "Yute natural", descripcion: "En 120×170, 160×280 y 190×280 cm, entre otras medidas." },
      { nombre: "Bouclé y lisas", descripcion: "Para livings, dormitorios, oficinas y locales." },
    ],
    preguntas: [
      {
        pregunta: "¿Qué tamaño de alfombra necesito?",
        respuesta: "Pasanos las medidas del ambiente y del sillón y te recomendamos el tamaño justo. Como regla, tiene que entrar al menos debajo de las patas delanteras.",
      },
    ],
    mensajeWhatsApp: "Hola Casa Esusy, quiero consultar por alfombras.",
  },
  {
    slug: "empapelados",
    nombre: "Empapelados",
    titulo: "Empapelados importados y nacionales con colocación",
    bajada: "Vinílicos, texturas, infantiles y de diseño. Catálogos para elegir con calma, cálculo de rollos y colocación.",
    descripcion:
      "Un empapelado convierte una pared en el centro del ambiente. En el local tenés catálogos importados y nacionales para ver y tocar, y también podés mirarlos online en nuestra sección de catálogos.\n\nTe ayudamos a calcular cuántos rollos necesitás según el ancho, el alto y la repetición del dibujo, y nuestro colocador lo instala prolijo.",
    imagen: "/img/ambientes/empapelado-botanico.jpg",
    tipos: [
      { nombre: "Importados y nacionales", descripcion: "Catálogos para ver en el local o en la web." },
      { nombre: "Vinílicos lavables", descripcion: "Para cocinas, pasillos y cuartos de chicos." },
      { nombre: "Infantiles", descripcion: "Desde diseños para bebés hasta propuestas para los más grandes." },
    ],
    preguntas: [
      {
        pregunta: "¿Cuántos rollos necesito?",
        respuesta: "Depende del ancho de la pared, la altura y la repetición del dibujo. Pasanos las medidas y lo calculamos por vos.",
      },
    ],
    mensajeWhatsApp: "Hola Casa Esusy, quiero consultar por empapelados.",
  },
  {
    slug: "pisos",
    nombre: "Pisos",
    titulo: "Pisos SPC vinílicos y flotantes con colocación",
    bajada: "Pisos resistentes al agua, para alto tránsito y con colocación click, sin obra. Zócalos y opciones para exterior.",
    descripcion:
      "Los pisos SPC vinílicos son 100% resistentes al agua, aguantan el alto tránsito y se colocan con sistema click, sin obra húmeda ni roturas. Sirven para livings, dormitorios, cocinas y hasta baños.\n\nTambién trabajamos pisos flotantes, zócalos y cubrezócalos, y para balcones y terrazas, paneles WPC y césped sintético.",
    imagen: "/img/ambientes/piso-espiga.jpg",
    tipos: [
      { nombre: "SPC vinílico", descripcion: "100% resistente al agua: sirve para cocinas y baños." },
      { nombre: "Pisos flotantes", descripcion: "Venta y colocación, en distintos tonos de madera." },
      { nombre: "Zócalos y cubrezócalos", descripcion: "Para terminar prolijo cada ambiente." },
      { nombre: "Exterior", descripcion: "Paneles WPC y césped sintético para balcones y terrazas." },
    ],
    preguntas: [
      {
        pregunta: "¿Se pueden poner en la cocina o el baño?",
        respuesta: "Sí. Los pisos SPC son 100% resistentes al agua y se colocan sin obra.",
      },
    ],
    mensajeWhatsApp: "Hola Casa Esusy, quiero presupuesto de pisos.",
  },
  {
    slug: "diseno-de-interiores",
    nombre: "Diseño de interiores",
    titulo: "Diseño de interiores para casas, locales y oficinas",
    bajada: "Contratá el servicio de diseño: pensamos el ambiente completo para que colores, telas, luz y muebles combinen.",
    descripcion:
      "Además de vender y colocar, ofrecemos el servicio de diseño de interiores. Andrea Esusy, certificada en Diseño y Decoración de Interiores, te acompaña desde la primera idea hasta la colocación.\n\nPodés contratar una asesoría puntual para resolver un ambiente o un proyecto completo: relevamos el espacio, armamos la paleta y la propuesta de telas y materiales, y nos ocupamos de que cortinas, tapizados, alfombras y paredes conversen entre sí. Trabajamos en casas, departamentos, locales y oficinas, en Capital, zona sur o donde nos necesites.",
    imagen: "/img/ambientes/paleta-diseno.jpg",
    tipos: [
      { nombre: "Asesoría puntual", descripcion: "Una visita para resolver un ambiente, con muestras en mano." },
      { nombre: "Proyecto de ambiente", descripcion: "Paleta, telas, materiales, distribución y lista de compras." },
      { nombre: "Proyecto integral", descripcion: "Varios ambientes o la casa completa, con seguimiento hasta la colocación." },
      { nombre: "Locales y oficinas", descripcion: "Espacios comerciales, consultorios, estudios y concesionarias." },
    ],
    preguntas: [
      {
        pregunta: "¿Puedo contratar solo el diseño?",
        respuesta: "Sí. Podés contratar la asesoría o el proyecto de diseño aunque después compres en otro lado. Si hacés los trabajos con nosotros, coordinamos todo.",
      },
      {
        pregunta: "¿Trabajan fuera de zona sur?",
        respuesta: "Sí. Trabajamos en Capital Federal, en toda la zona sur y donde nos necesites. También podemos asesorarte a distancia con fotos y medidas.",
      },
    ],
    mensajeWhatsApp: "Hola Casa Esusy, quiero contratar el servicio de diseño de interiores.",
  },
];

export const PROYECTOS = [
  {
    titulo: "Gasas en ventanal",
    servicio: "cortinas",
    descripcion: "Gasa liviana de piso a techo para filtrar la luz del living sin perder claridad.",
    imagen: "/img/instagram/gasas-ventanal.jpg",
    destacado: true,
  },
  {
    titulo: "Venecianas de 50 mm en negro opaco",
    servicio: "cortinas",
    descripcion: "Venecianas de listón ancho que acompañan la chimenea y los marcos oscuros.",
    imagen: "/img/instagram/venecianas-living.jpg",
    destacado: true,
  },
  {
    titulo: "Venecianas para un living con piedra",
    servicio: "cortinas",
    descripcion: "Control de luz preciso en un ventanal de esquina.",
    imagen: "/img/instagram/venecianas-sillon-verde.jpg",
    destacado: true,
  },
  {
    titulo: "Empapelado infantil",
    servicio: "empapelados",
    descripcion: "Un mural de bosque para el cuarto del bebé.",
    imagen: "/img/instagram/empapelado-infantil.jpg",
    destacado: true,
  },
  {
    titulo: "Roller para escritorio",
    servicio: "cortinas",
    descripcion: "Roller de tela screen que corta el reflejo sobre la pantalla.",
    imagen: "/img/instagram/roller-escritorio.jpg",
    destacado: false,
  },
  {
    titulo: "Acolchados en gris",
    servicio: "dormitorio",
    descripcion: "Acolchados king, queen y twin en blanco, gris medio, gris oscuro y beige.",
    imagen: "/img/instagram/acolchado-gris.jpg",
    destacado: false,
  },
  {
    titulo: "Telas para manteles",
    servicio: "tapiceria",
    descripcion: "Cuadrillé y vichy por metro, la tendencia de la temporada.",
    imagen: "/img/instagram/telas-manteles.jpg",
    destacado: false,
  },
  {
    titulo: "Venecianas de madera New York",
    servicio: "cortinas",
    descripcion: "Vuelve la línea de madera en cuatro colores.",
    imagen: "/img/instagram/venecianas-new-york.jpg",
    destacado: false,
  },
];

/** Extractos reales de la ficha de Google (relevados el 13/10/2026). */
export const RESENAS = [
  {
    autor: "Carina V.",
    puntaje: 5,
    texto:
      "Excelente servicio y calidad de los productos. La atención maravillosa tanto de la empleada como el colocador Victor. Super recomendable.",
    fecha: "Hace un año",
    destacada: true,
  },
  {
    autor: "Guada F.",
    puntaje: 5,
    texto: "Excelente atención! Papeles y alfombras de primera y la colocación impecable.",
    fecha: "Hace 6 años",
    destacada: true,
  },
  {
    autor: "Dafne G.",
    puntaje: 5,
    texto: "Excelente atención y precios acordes.",
    fecha: "Hace 4 años",
    destacada: true,
  },
];

export const PREGUNTAS = [
  { grupo: "Presupuesto y visita", pregunta: "¿El presupuesto tiene costo?", respuesta: "No. La visita para medir y el presupuesto son sin cargo y sin compromiso.", publicada: true },
  {
    grupo: "Presupuesto y visita",
    pregunta: "¿A qué zonas van?",
    respuesta: "No tenemos límite de distancia: trabajamos en Capital Federal, en toda la zona sur y donde nos necesites. Escribinos y coordinamos.",
    publicada: true,
  },
  {
    grupo: "Presupuesto y visita",
    pregunta: "¿Cuánto tarda un trabajo a medida?",
    respuesta: "Depende del producto y de la tela. Te damos el plazo exacto junto con el presupuesto.",
    publicada: true,
  },
  {
    grupo: "Presupuesto y visita",
    pregunta: "¿Puedo ver telas y catálogos?",
    respuesta: "Sí. En el local tenés muestrarios de telas, empapelados, alfombras y pisos, y en la sección Catálogos del sitio podés ver los de las marcas con las que trabajamos.",
    publicada: true,
  },
  {
    grupo: "Diseño de interiores",
    pregunta: "¿Puedo contratar el servicio de diseño de interiores?",
    respuesta: "Sí. Podés contratar una asesoría puntual o un proyecto completo de uno o varios ambientes, para casas, locales u oficinas.",
    publicada: true,
  },
  {
    grupo: "Colocación y cuidado",
    pregunta: "¿Ustedes hacen la colocación?",
    respuesta: "Sí, tenemos colocador propio para cortinas, empapelados y pisos.",
    publicada: true,
  },
  {
    grupo: "Colocación y cuidado",
    pregunta: "¿Cómo lavo mis cortinas sin que encojan?",
    respuesta:
      "Seguí la indicación de cada tela. Muchas se limpian en seco o se lavan a mano en agua fría, sin secarropas. Si tenés dudas, consultanos antes de lavar.",
    publicada: true,
  },
  { grupo: "Pagos y garantía", pregunta: "¿Qué medios de pago aceptan?", respuesta: "[COMPLETAR: efectivo, transferencia, tarjetas, cuotas]", publicada: false },
  { grupo: "Pagos y garantía", pregunta: "¿Los trabajos tienen garantía?", respuesta: "[COMPLETAR: garantía de confección y colocación]", publicada: false },
];

/** Marcas con las que trabaja el negocio. Se editan y se suman más desde el panel. */
export const MARCAS = [
  {
    nombre: "Flexcolor",
    rubro: "Cortinas y sistemas",
    descripcion: "Roller, venecianas y bandas verticales.",
    logo: "/marcas/flexcolor.png",
    sitioWeb: "https://flex-color.com/",
    orden: 0,
  },
  {
    nombre: "Riel Americano",
    rubro: "Rieles y sistemas",
    descripcion: "Rieles, cortinas y automatismos.",
    logo: "/marcas/riel-americano-logotipo.png",
    sitioWeb: "https://rielamericano.com.ar/",
    orden: 1,
  },
  {
    nombre: "El Espartano",
    rubro: "Alfombras",
    descripcion: "Alfombras y carpetas.",
    logo: "/marcas/el-espartano.png",
    sitioWeb: "https://elespartano.com.ar/",
    orden: 2,
  },
  {
    nombre: "Muresco",
    rubro: "Empapelados",
    descripcion: "Empapelados, con catálogos para elegir.",
    logo: "/marcas/muresco.png",
    sitioWeb: "https://muresco.com/",
    orden: 3,
  },
  {
    nombre: "Wepel",
    rubro: "Revestimientos y adhesivos",
    descripcion: "Pinturas, adhesivos y revestimientos.",
    logo: "/marcas/wepel.png",
    sitioWeb: "https://wepel.com.ar/",
    orden: 4,
  },
  {
    nombre: "Barrales y Accesorios",
    rubro: "Barrales y rieles",
    descripcion: "Barrales, rieles y soportes para cortinas.",
    logo: "/marcas/barrales-y-accesorios.png",
    sitioWeb: "https://barralesyaccesorios.com.ar/",
    orden: 5,
  },
];

/** Meta descripciones iniciales (140–160 caracteres, con la zona). Se editan en el panel de SEO. */
export const SEO_INICIAL: { ruta: string; descripcion: string }[] = [
  {
    ruta: "/cortinas",
    descripcion: "Cortinas a medida en Banfield, Capital y zona sur: gasas, black out, roller, venecianas y bandas verticales. Medimos sin cargo y colocamos con equipo propio.",
  },
  {
    ruta: "/tapiceria",
    descripcion: "Sillones a medida, retapizado, fundas y respaldos de cama en Banfield. Pana, chenille, velvet y telas antimanchas. Presupuesto sin cargo en Capital y zona sur.",
  },
  {
    ruta: "/dormitorio",
    descripcion: "Acolchados king, queen y twin, cubrecamas y sábanas a medida y almohadones en Banfield. Textiles para el dormitorio en colores neutros, desde 1967.",
  },
  {
    ruta: "/alfombras",
    descripcion: "Alfombras y carpetas a medida en Banfield: forma, tamaño, guardas y colores a elección. Yute natural, bouclé y lisas para casas, oficinas y comercios.",
  },
  {
    ruta: "/empapelados",
    descripcion: "Empapelados importados y nacionales en Banfield: vinílicos, texturas e infantiles. Catálogos en el local, cálculo de rollos y colocación en Capital y zona sur.",
  },
  {
    ruta: "/pisos",
    descripcion: "Pisos SPC vinílicos 100% resistentes al agua y pisos flotantes en Banfield y Lomas de Zamora. Colocación click, zócalos y opciones para exterior.",
  },
  {
    ruta: "/diseno-de-interiores",
    descripcion: "Contratá diseño de interiores en Banfield, Capital y zona sur con una diseñadora certificada: asesorías, proyectos de ambientes completos y espacios comerciales.",
  },
];

/** Lista de precios de ejemplo para que funcionen las calculadoras. Reemplazar por los reales. */
export const PRECIOS: { categoria: string; nombre: string; unidad: string; precio: number }[] = [
  { categoria: "Telas", nombre: "Gasa de lino", unidad: "m", precio: 18000 },
  { categoria: "Telas", nombre: "Black out textil", unidad: "m", precio: 22000 },
  { categoria: "Telas", nombre: "Lino natural", unidad: "m", precio: 24000 },
  { categoria: "Telas", nombre: "Pana para tapicería", unidad: "m", precio: 26000 },
  { categoria: "Confección", nombre: "Confección tradicional", unidad: "m", precio: 9000 },
  { categoria: "Confección", nombre: "Confección con ollaos", unidad: "m", precio: 11000 },
  { categoria: "Rieles y barrales", nombre: "Riel de aluminio", unidad: "m", precio: 12000 },
  { categoria: "Rieles y barrales", nombre: "Barral 28 mm", unidad: "m", precio: 15000 },
  { categoria: "Roller y venecianas", nombre: "Roller black out", unidad: "m²", precio: 48000 },
  { categoria: "Roller y venecianas", nombre: "Roller sunscreen 3%", unidad: "m²", precio: 52000 },
  { categoria: "Roller y venecianas", nombre: "Veneciana aluminio 25 mm", unidad: "m²", precio: 45000 },
  { categoria: "Roller y venecianas", nombre: "Veneciana madera 50 mm", unidad: "m²", precio: 95000 },
  { categoria: "Empapelados", nombre: "Rollo nacional", unidad: "rollo", precio: 45000 },
  { categoria: "Empapelados", nombre: "Rollo importado", unidad: "rollo", precio: 85000 },
  { categoria: "Pisos", nombre: "SPC vinílico", unidad: "m²", precio: 32000 },
  { categoria: "Pisos", nombre: "Piso flotante", unidad: "m²", precio: 26000 },
  { categoria: "Pisos", nombre: "Zócalo", unidad: "m", precio: 6000 },
  { categoria: "Tapicería", nombre: "Retapizado sillón 1 cuerpo", unidad: "u", precio: 180000 },
  { categoria: "Colocación", nombre: "Colocación por ventana", unidad: "u", precio: 25000 },
  { categoria: "Colocación", nombre: "Colocación de empapelado", unidad: "rollo", precio: 15000 },
  { categoria: "Colocación", nombre: "Colocación de piso", unidad: "m²", precio: 9000 },
];
