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
    titulo: "Cortinas a medida en Banfield",
    bajada: "Gasas, black out, roller y venecianas. Medimos en tu casa, confeccionamos y colocamos.",
    descripcion:
      "Una cortina bien elegida cambia la luz, la temperatura y el clima de un ambiente. Empezamos por entender cómo usás cada espacio: si buscás oscuridad para dormir, luz tamizada para el living o privacidad sin perder claridad.\n\nTrabajamos telas nacionales e importadas y sistemas de primeras marcas. Te asesoramos con muestras y nuestro colocador hace la instalación.",
    imagen: "/img/ambientes/cortinas-gasas-luz.jpg",
    tipos: [
      { nombre: "Gasas y voile", descripcion: "De lino y bambú. Filtran la luz y dan privacidad sin oscurecer." },
      { nombre: "Black out textil", descripcion: "Oscuridad total que además aísla del frío y del calor." },
      { nombre: "Roller", descripcion: "Black out, sunscreen y screen de diseño, a medida de cada ventana." },
      { nombre: "Venecianas", descripcion: "Madera, PVC y aluminio, con listones de 25 o 50 mm." },
      { nombre: "Romanas y bandas verticales", descripcion: "Para cocinas, oficinas y ventanales anchos." },
      { nombre: "Rieles y barrales", descripcion: "Rectos, curvables y accesorios para renovar lo que ya tenés." },
    ],
    preguntas: [
      {
        pregunta: "¿Vienen a medir a casa?",
        respuesta: "Sí. Coordinamos una visita para tomar medidas y llevar muestras. El presupuesto no tiene cargo.",
      },
      {
        pregunta: "¿Qué conviene para el dormitorio?",
        respuesta:
          "Para dormir a oscuras, black out textil o roller black out. Si querés que de día entre luz, sumá una gasa por delante.",
      },
      {
        pregunta: "¿Las cortinas de tela encogen al lavarlas?",
        respuesta:
          "Algunas telas pueden encoger si se lavan en caliente o en lavarropas. En cada trabajo te indicamos cómo cuidarla: muchas se limpian en seco o se lavan a mano en agua fría.",
      },
    ],
    mensajeWhatsApp: "Hola Casa Esusy, quiero presupuesto de cortinas a medida.",
  },
  {
    slug: "tapiceria",
    nombre: "Sillones y tapizados",
    titulo: "Sillones a medida y retapizado",
    bajada: "Sillones nuevos, retapizados, fundas y respaldos de cama. Vos elegís tela, color y relleno.",
    descripcion:
      "Hacemos sillones a medida y renovamos los que ya tenés. Definimos juntos la forma, la cantidad de cuerpos, la tela y el relleno.\n\nTrabajamos pana, chenille, velvet, lino y telas antimanchas, ideales si hay chicos o mascotas.",
    imagen: "/img/ambientes/sillon-pana-oliva.jpg",
    tipos: [
      { nombre: "Sillones a medida", descripcion: "Para aprovechar cada centímetro del living." },
      { nombre: "Retapizado", descripcion: "Tela nueva y, si hace falta, goma espuma renovada." },
      { nombre: "Fundas de sillón", descripcion: "A medida y fáciles de sacar para lavar." },
      { nombre: "Respaldos de cama", descripcion: "Tapizados en velvet, pana o lino, con la forma que elijas." },
    ],
    preguntas: [
      {
        pregunta: "¿Qué tela conviene si tengo mascotas?",
        respuesta: "Las telas antimanchas y de trama cerrada son las más resistentes. Te mostramos muestras en el local.",
      },
      {
        pregunta: "¿Puedo traer mi propia tela?",
        respuesta: "Consultanos por WhatsApp: depende del tipo de tela y del trabajo.",
      },
    ],
    mensajeWhatsApp: "Hola Casa Esusy, quiero consultar por un sillón o retapizado.",
  },
  {
    slug: "dormitorio",
    nombre: "Acolchados y almohadones",
    titulo: "Acolchados, cubrecamas y almohadones",
    bajada: "Acolchados king, queen y twin, cubrecamas y sábanas a medida, almohadones en varias texturas.",
    descripcion:
      "El dormitorio se termina de definir con los textiles. Tenemos acolchados en varias medidas y colores, hacemos cubrecamas y sábanas a medida y almohadones en pana, lino y texturas de temporada.",
    imagen: "/img/ambientes/dormitorio-respaldo-ratan.jpg",
    tipos: [
      { nombre: "Acolchados", descripcion: "King, queen y twin en blanco, gris, beige e ivory." },
      { nombre: "Cubrecamas y sábanas a medida", descripcion: "Para camas con medidas especiales." },
      { nombre: "Almohadones", descripcion: "Pana, lino y placas de goma espuma enfundadas antimanchas." },
    ],
    preguntas: [],
    mensajeWhatsApp: "Hola Casa Esusy, quiero consultar por acolchados o almohadones.",
  },
  {
    slug: "alfombras",
    nombre: "Alfombras",
    titulo: "Alfombras y carpetas a medida",
    bajada: "Carpetas personalizadas en forma, tamaño, guardas y colores. Yute, bouclé y lisas.",
    descripcion:
      "La alfombra correcta termina de armar un ambiente. Diseñamos carpetas a medida y tenemos modelos de yute natural, bouclé y lisos.\n\nUna regla que usamos siempre: la alfombra tiene que entrar, al menos, debajo de las patas delanteras del sillón.",
    imagen: "/img/ambientes/alfombra-living.jpg",
    tipos: [
      { nombre: "Carpetas a medida", descripcion: "Diseño, forma, guardas y colores a elección." },
      { nombre: "Yute natural", descripcion: "En 120×170, 160×280 y 190×280 cm." },
      { nombre: "Bouclé y lisas", descripcion: "Para livings, dormitorios y espacios comerciales." },
    ],
    preguntas: [
      {
        pregunta: "¿Qué tamaño de alfombra necesito?",
        respuesta: "Pasanos las medidas del ambiente y del sillón y te recomendamos el tamaño justo.",
      },
    ],
    mensajeWhatsApp: "Hola Casa Esusy, quiero consultar por alfombras.",
  },
  {
    slug: "empapelados",
    nombre: "Empapelados",
    titulo: "Empapelados importados y nacionales",
    bajada: "Catálogos para ver en el local: vinílicos, texturas, infantiles y de diseño. Con colocación.",
    descripcion:
      "Un empapelado convierte una pared en el centro del ambiente. En el local tenés catálogos importados y nacionales para elegir con calma, y te ayudamos a calcular cuántos rollos necesitás.",
    imagen: "/img/ambientes/empapelado-botanico.jpg",
    tipos: [
      { nombre: "Importados y nacionales", descripcion: "Catálogos para ver y tocar en el local." },
      { nombre: "Vinílicos lavables", descripcion: "Para cocinas, pasillos y cuartos de chicos." },
      { nombre: "Infantiles", descripcion: "Desde diseños para bebés hasta propuestas para más grandes." },
    ],
    preguntas: [
      {
        pregunta: "¿Cuántos rollos necesito?",
        respuesta:
          "Depende del ancho de la pared, la altura y la repetición del dibujo. Pasanos las medidas y lo calculamos por vos.",
      },
    ],
    mensajeWhatsApp: "Hola Casa Esusy, quiero consultar por empapelados.",
  },
  {
    slug: "pisos",
    nombre: "Pisos",
    titulo: "Pisos SPC vinílicos y flotantes",
    bajada: "Pisos resistentes al agua, para alto tránsito y con colocación click. Zócalos y exterior.",
    descripcion:
      "Los pisos SPC vinílicos son 100% resistentes al agua, aguantan el alto tránsito y se colocan con sistema click, sin obra húmeda. También trabajamos pisos flotantes, zócalos y, para balcones y terrazas, paneles WPC y césped sintético.",
    imagen: "/img/ambientes/piso-espiga.jpg",
    tipos: [
      { nombre: "SPC vinílico", descripcion: "Resistente al agua: sirve para cocinas y baños." },
      { nombre: "Pisos flotantes", descripcion: "Venta y colocación." },
      { nombre: "Zócalos y cubrezócalos", descripcion: "Para terminar prolijo cada ambiente." },
      { nombre: "Exterior", descripcion: "Paneles WPC y césped sintético para balcones y terrazas." },
    ],
    preguntas: [
      {
        pregunta: "¿Se pueden poner en la cocina o el baño?",
        respuesta: "Sí. Los pisos SPC son 100% resistentes al agua.",
      },
    ],
    mensajeWhatsApp: "Hola Casa Esusy, quiero presupuesto de pisos.",
  },
  {
    slug: "diseno-de-interiores",
    nombre: "Diseño de interiores",
    titulo: "Diseño de interiores en zona sur",
    bajada: "Te ayudamos a pensar el ambiente completo: colores, telas, luz y muebles.",
    descripcion:
      "Andrea Esusy, certificada en Diseño y Decoración de Interiores, acompaña cada proyecto desde la primera idea hasta la colocación. Pensamos el ambiente completo para que cortinas, tapizados, alfombras y paredes conversen entre sí.\n\nHacemos proyectos para casas y también para comercios y oficinas.",
    imagen: "/img/ambientes/paleta-diseno.jpg",
    tipos: [
      { nombre: "Asesoría", descripcion: "En el local o en tu casa, con muestras en mano." },
      { nombre: "Proyecto de ambiente", descripcion: "Paleta, materiales, telas y lista de compras." },
      { nombre: "Proyectos comerciales", descripcion: "Locales, oficinas y concesionarias." },
    ],
    preguntas: [],
    mensajeWhatsApp: "Hola Casa Esusy, quiero consultar por diseño de interiores.",
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
  { grupo: "Presupuesto y visita", pregunta: "¿El presupuesto tiene costo?", respuesta: "No. La visita para medir y el presupuesto son sin cargo.", publicada: true },
  {
    grupo: "Presupuesto y visita",
    pregunta: "¿A qué zonas van?",
    respuesta:
      "Banfield, Lomas de Zamora, Temperley, Adrogué, Lanús, Remedios de Escalada, Turdera y alrededores. Si estás en otra zona, consultanos.",
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
    pregunta: "¿Puedo ver telas y muestras?",
    respuesta: "Sí. En el local tenés muestrarios de telas, empapelados, alfombras y pisos para ver y tocar.",
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

/** Meta descripciones iniciales (140–160 caracteres, con la zona). Se editan en el panel de SEO. */
export const SEO_INICIAL: { ruta: string; descripcion: string }[] = [
  {
    ruta: "/cortinas",
    descripcion: "Cortinas a medida en Banfield y zona sur: gasas, black out textil, roller y venecianas. Medimos en tu casa sin cargo y colocamos con equipo propio.",
  },
  {
    ruta: "/tapiceria",
    descripcion: "Sillones a medida, retapizado, fundas y respaldos de cama en Banfield. Pana, chenille, velvet y telas antimanchas. Presupuesto sin cargo en zona sur.",
  },
  {
    ruta: "/dormitorio",
    descripcion: "Acolchados king, queen y twin, cubrecamas y sábanas a medida y almohadones en Banfield. Textiles para el dormitorio en colores neutros, desde 1967.",
  },
  {
    ruta: "/alfombras",
    descripcion: "Alfombras y carpetas a medida en Banfield: forma, tamaño, guardas y colores a elección. Yute natural, bouclé y lisas para casas y comercios de zona sur.",
  },
  {
    ruta: "/empapelados",
    descripcion: "Empapelados importados y nacionales en Banfield: vinílicos, texturas e infantiles. Catálogos en el local, cálculo de rollos y colocación en zona sur.",
  },
  {
    ruta: "/pisos",
    descripcion: "Pisos SPC vinílicos 100% resistentes al agua y pisos flotantes en Banfield y Lomas de Zamora. Colocación click, zócalos y opciones para exterior.",
  },
  {
    ruta: "/diseno-de-interiores",
    descripcion: "Diseño y decoración de interiores en Banfield y zona sur con una diseñadora certificada. Asesoría, proyectos de ambientes completos y comerciales.",
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
