import type { Textura } from "@/components/ui/Muestra";

export type Tipo = {
  slug: string;
  nombre: string;
  resumen: string;
  parrafos: string[];
  ideal: string[];
  textura: Textura;
};

export type Pregunta = { pregunta: string; respuesta: string };

export type Servicio = {
  slug: string;
  nombre: string;
  /** H1 de la landing: claro y con la zona, pensado para SEO local. */
  titulo: string;
  bajada: string;
  metaDescripcion: string;
  textura: Textura;
  intro: string[];
  tipos: Tipo[];
  preguntas: Pregunta[];
  mensajeWhatsApp: string;
};

export const servicios: Servicio[] = [
  {
    slug: "cortinas",
    nombre: "Cortinas",
    titulo: "Cortinas a medida en Banfield",
    bajada:
      "Gasas, black out textil, roller, venecianas y romanas. Medimos en tu casa, confeccionamos y colocamos.",
    metaDescripcion:
      "Cortinas a medida en Banfield y zona sur: gasas de lino, black out textil, roller sunscreen, venecianas de madera y aluminio, romanas y bandas verticales. Medición y colocación propia.",
    textura: "gasa",
    intro: [
      "Una cortina bien elegida cambia la luz, la temperatura y el clima de un ambiente. Por eso empezamos por entender cómo usás cada espacio: si buscás oscuridad total para dormir, luz tamizada para el living o privacidad sin perder claridad.",
      "Trabajamos con telas nacionales e importadas y con sistemas de primeras marcas. Medimos en tu casa, te asesoramos con muestras y nuestro colocador hace la instalación.",
    ],
    tipos: [
      {
        slug: "de-tela",
        nombre: "Cortinas de tela",
        resumen:
          "Confección tradicional con rieles o barrales, en la caída y el fruncido que elijas.",
        parrafos: [
          "Las cortinas de tela visten la ventana y suavizan el ambiente. Elegís la tela, el tipo de cabezal y si van con riel o barral.",
          "Combinan muy bien con un roller black out por detrás: de día, luz natural filtrada; de noche, oscuridad total.",
        ],
        ideal: [
          "Livings y comedores",
          "Dormitorios con doble cortina",
          "Ventanales de piso a techo",
        ],
        textura: "lino",
      },
      {
        slug: "gasas-y-voile",
        nombre: "Gasas y voile",
        resumen: "Gasas de lino y bambú que filtran la luz y dan privacidad sin oscurecer.",
        parrafos: [
          "Las gasas dejan pasar la luz de forma pareja y le dan movimiento a la ventana. Trabajamos gasas de lino, de bambú y voiles en tonos naturales.",
          "Son la elección habitual para livings luminosos y para combinar con black out en dormitorios.",
        ],
        ideal: ["Livings luminosos", "Ventanales al jardín", "Capa liviana sobre black out"],
        textura: "gasa",
      },
      {
        slug: "black-out-textil",
        nombre: "Black out textil",
        resumen: "Oscuridad total que además aísla el frío y el calor.",
        parrafos: [
          "El black out textil bloquea la luz exterior y ayuda a regular la temperatura del ambiente: en verano frena el sol y en invierno retiene el calor.",
          "Se puede confeccionar como cortina de tela o como roller, y combinar con un visillo por delante.",
        ],
        ideal: ["Dormitorios", "Salas de TV", "Ambientes con mucho sol de tarde"],
        textura: "pana",
      },
      {
        slug: "roller",
        nombre: "Roller",
        resumen: "Black out, sunscreen y tela screen de diseño, a medida de cada ventana.",
        parrafos: [
          "El roller ocupa poco espacio y es fácil de usar. Lo hacemos en black out, en screen con distintos niveles de apertura (por ejemplo 3%) y en telas de diseño.",
          "Una combinación muy pedida: roller black out por detrás y gasa con rieles por delante.",
        ],
        ideal: ["Oficinas y estudios", "Cocinas", "Ventanas en serie"],
        textura: "screen",
      },
      {
        slug: "venecianas",
        nombre: "Venecianas",
        resumen: "De madera, PVC y aluminio, con listones de 25 o 50 mm.",
        parrafos: [
          "Las venecianas regulan la luz con precisión inclinando los listones. Las hacemos en madera natural o laqueada, en PVC y en aluminio, en varios anchos y colores.",
          "Trabajamos líneas de marcas como Flexcolor.",
        ],
        ideal: ["Livings modernos", "Escritorios", "Ambientes con ventanas angostas"],
        textura: "listones",
      },
      {
        slug: "romanas",
        nombre: "Romanas",
        resumen: "Pliegues horizontales en tela, prolijas y fáciles de manejar.",
        parrafos: [
          "La cortina romana se recoge en pliegues al subir. Tiene la calidez de la tela con la prolijidad de un sistema enrollable.",
        ],
        ideal: ["Cocinas", "Dormitorios infantiles", "Ventanas medianas"],
        textura: "lino",
      },
      {
        slug: "bandas-verticales",
        nombre: "Bandas verticales",
        resumen: "Luz tamizada y privacidad para ventanales y oficinas.",
        parrafos: [
          "Las bandas verticales giran y se corren para controlar la luz y la vista hacia afuera. Son prácticas en ventanales anchos y en espacios de trabajo.",
        ],
        ideal: ["Oficinas", "Ventanales anchos", "Consultorios"],
        textura: "listones",
      },
      {
        slug: "paneles-orientales",
        nombre: "Paneles orientales",
        resumen: "Paños lisos que se deslizan sobre rieles paralelos.",
        parrafos: [
          "Los paneles orientales cubren grandes superficies con una estética limpia y pueden funcionar como divisores de ambientes.",
        ],
        ideal: ["Ventanales", "Puertas balcón", "Divisores de ambiente"],
        textura: "lino",
      },
      {
        slug: "rieles-y-barrales",
        nombre: "Rieles y barrales",
        resumen: "Rieles rectos y curvables, barrales y accesorios.",
        parrafos: [
          "El sistema de colgado define cómo cae y cómo se mueve la cortina. Colocamos rieles rectos y curvables, barrales en distintas terminaciones y todos los accesorios.",
        ],
        ideal: ["Bow windows", "Ventanales en esquina", "Renovar cortinas existentes"],
        textura: "listones",
      },
    ],
    preguntas: [
      {
        pregunta: "¿Vienen a medir a casa?",
        respuesta:
          "Sí. Coordinamos una visita para tomar medidas y llevar muestras. El presupuesto no tiene cargo.",
      },
      {
        pregunta: "¿Las cortinas de tela encogen al lavarlas?",
        respuesta:
          "Algunas telas pueden encoger si se lavan en caliente o en lavarropas. En cada trabajo te indicamos cómo cuidarla: muchas se limpian en seco o se lavan a mano en agua fría. Tenés la guía completa en Cuidado de telas.",
      },
      {
        pregunta: "¿Qué conviene para el dormitorio?",
        respuesta:
          "Para dormir a oscuras, black out textil o roller black out. Si querés que de día entre luz, sumá una gasa por delante.",
      },
    ],
    mensajeWhatsApp: "Hola Casa Esusy, quiero presupuesto de cortinas a medida.",
  },
  {
    slug: "tapiceria",
    nombre: "Sillones y tapizados",
    titulo: "Sillones a medida y retapizado",
    bajada:
      "Sillones nuevos, retapizados, fundas y respaldos de cama. Elegís la tela, el color y el relleno.",
    metaDescripcion:
      "Sillones a medida, retapizado, fundas de sillón y respaldos de cama en Banfield. Pana, chenille, velvet y telas antimanchas.",
    textura: "terciopelo",
    intro: [
      "Hacemos sillones a medida y renovamos los que ya tenés. Vos elegís la tela, el color, el relleno y la terminación; nosotros nos ocupamos de que el resultado sea exactamente lo que imaginaste.",
      "Trabajamos pana, chenille, velvet, lino y telas antimanchas, ideales si hay chicos o mascotas.",
    ],
    tipos: [
      {
        slug: "sillones-a-medida",
        nombre: "Sillones a medida",
        resumen: "Diseñados para tu espacio: medidas, módulos, tela y relleno a elección.",
        parrafos: [
          "Un sillón a medida aprovecha cada centímetro del living. Definimos juntos la forma, la cantidad de cuerpos, la profundidad y la tela.",
        ],
        ideal: ["Livings con medidas especiales", "Rincones de lectura", "Esquineros"],
        textura: "terciopelo",
      },
      {
        slug: "retapizado",
        nombre: "Retapizado",
        resumen: "Le damos una vida nueva a tu sillón con otra tela y relleno renovado.",
        parrafos: [
          "Si la estructura está bien, retapizar es la forma de renovar el ambiente sin cambiar el mueble. Cambiamos tela y, si hace falta, la goma espuma.",
        ],
        ideal: ["Sillones de familia", "Butacas", "Sillas de comedor"],
        textura: "pana",
      },
      {
        slug: "fundas-de-sillon",
        nombre: "Fundas de sillón",
        resumen: "Fundas a medida en pana chenille y otras telas, fáciles de sacar.",
        parrafos: [
          "Una funda a medida protege el sillón y te permite cambiar el estilo según la temporada.",
        ],
        ideal: ["Casas con mascotas", "Sillones claros", "Cambios de temporada"],
        textura: "pana",
      },
      {
        slug: "respaldos-de-cama",
        nombre: "Respaldos de cama",
        resumen: "Respaldos tapizados a medida: forma, tela y terminación elegidas por vos.",
        parrafos: [
          "Un respaldo tapizado le cambia la energía al dormitorio. Lo hacemos a medida de tu cama, en velvet, pana, lino o la tela que elijas, y podemos combinarlo con pie de cama y cortinas.",
        ],
        ideal: ["Dormitorios principales", "Cuartos de huéspedes", "Dormitorios juveniles"],
        textura: "terciopelo",
      },
    ],
    preguntas: [
      {
        pregunta: "¿Puedo traer mi propia tela?",
        respuesta: "Consultanos por WhatsApp; depende del tipo de tela y del trabajo.",
      },
      {
        pregunta: "¿Qué tela conviene si tengo mascotas?",
        respuesta:
          "Las telas antimanchas y de trama cerrada son las más resistentes. Te mostramos muestras en el local.",
      },
    ],
    mensajeWhatsApp: "Hola Casa Esusy, quiero consultar por un sillón o retapizado.",
  },
  {
    slug: "dormitorio",
    nombre: "Dormitorio",
    titulo: "Acolchados, cubrecamas y almohadones",
    bajada:
      "Acolchados king, queen y twin, cubrecamas y sábanas a medida, almohadones en distintas texturas.",
    metaDescripcion:
      "Acolchados king, queen y twin, cubrecamas y sábanas a medida y almohadones decorativos en Banfield.",
    textura: "boucle",
    intro: [
      "El dormitorio se termina de definir con los textiles. Tenemos acolchados en varias medidas y colores, hacemos cubrecamas y sábanas a medida, y almohadones en pana, lino y texturas de temporada.",
    ],
    tipos: [
      {
        slug: "acolchados",
        nombre: "Acolchados",
        resumen: "King, queen y twin en blanco, gris, beige e ivory.",
        parrafos: [
          "Acolchados para todo el año, en las medidas de cama más comunes y en colores neutros que combinan con todo.",
        ],
        ideal: ["Dormitorios principales", "Cuartos de chicos", "Casas de fin de semana"],
        textura: "boucle",
      },
      {
        slug: "cubrecamas-a-medida",
        nombre: "Cubrecamas y sábanas a medida",
        resumen: "Para camas con medidas especiales o un diseño propio.",
        parrafos: [
          "Si tu cama no tiene una medida estándar o querés una caída especial, lo confeccionamos a medida.",
        ],
        ideal: ["Camas especiales", "Sommiers altos", "Dormitorios coordinados"],
        textura: "lino",
      },
      {
        slug: "almohadones",
        nombre: "Almohadones",
        resumen: "Pana, lino, texturas y placas enfundadas antimanchas.",
        parrafos: [
          "Almohadones decorativos y placas de goma espuma enfundadas, en tonos tierra, neutros y de temporada.",
        ],
        ideal: ["Sillones", "Camas", "Rincones de lectura"],
        textura: "pana",
      },
    ],
    preguntas: [],
    mensajeWhatsApp: "Hola Casa Esusy, quiero consultar por acolchados o almohadones.",
  },
  {
    slug: "empapelados",
    nombre: "Empapelados",
    titulo: "Empapelados importados y nacionales",
    bajada:
      "Catálogos para ver en el local: vinílicos, texturas, infantiles y de diseño. Con colocación.",
    metaDescripcion:
      "Empapelados importados y nacionales en Banfield: vinílicos, texturas, infantiles y de diseño. Catálogos en el local y colocación.",
    textura: "papel",
    intro: [
      "Un empapelado transforma una pared en el punto focal del ambiente. En el local tenés catálogos importados y nacionales para elegir con calma, y te ayudamos a calcular cuántos rollos necesitás.",
    ],
    tipos: [],
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
    bajada:
      "Pisos 100% resistentes al agua, para alto tránsito y con colocación click. Zócalos y cubrezócalos.",
    metaDescripcion:
      "Pisos SPC vinílicos 100% resistentes al agua y pisos flotantes en Banfield. Alto tránsito, colocación click, zócalos y cubrezócalos.",
    textura: "madera",
    intro: [
      "Los pisos SPC vinílicos son resistentes al agua, aguantan el alto tránsito y se colocan con sistema click, sin obra húmeda. También trabajamos pisos flotantes, zócalos y cubrezócalos.",
    ],
    tipos: [],
    preguntas: [
      {
        pregunta: "¿Se pueden poner en la cocina o el baño?",
        respuesta:
          "Los pisos SPC son 100% resistentes al agua, así que funcionan en cocinas y baños.",
      },
    ],
    mensajeWhatsApp: "Hola Casa Esusy, quiero presupuesto de pisos.",
  },
  {
    slug: "alfombras",
    nombre: "Alfombras",
    titulo: "Alfombras y carpetas a medida",
    bajada: "Carpetas personalizadas en forma, tamaño, guardas y colores. Yute, bouclé y lisas.",
    metaDescripcion:
      "Alfombras y carpetas a medida en Banfield: diseño, tamaño, forma, guardas y colores a elección. Yute natural, bouclé y lisas.",
    textura: "yute",
    intro: [
      "La alfombra correcta termina de definir un ambiente. Diseñamos carpetas a medida —forma, tamaño, guardas y colores a elección— y tenemos modelos de yute natural, bouclé y lisos.",
      "Una regla que usamos siempre: la alfombra tiene que entrar, al menos, debajo de las patas delanteras del sillón.",
    ],
    tipos: [],
    preguntas: [
      {
        pregunta: "¿Qué medidas tienen las alfombras de yute?",
        respuesta:
          "Tenemos 120 × 170, 160 × 280 y 190 × 280 cm, y algunos diseños en más medidas. Si necesitás otra, la hacemos a medida.",
      },
    ],
    mensajeWhatsApp: "Hola Casa Esusy, quiero consultar por alfombras.",
  },
  {
    slug: "telas",
    nombre: "Telas",
    titulo: "Telas por metro",
    bajada: "Tapicería, cortinas, manteles y telas outdoor impermeables Aqua Block.",
    metaDescripcion:
      "Telas por metro en Banfield: tapicería, cortinas, manteles y telas outdoor impermeables Aqua Block para galerías y reposeras.",
    textura: "vichy",
    intro: [
      "Vendemos telas por metro para tapicería, cortinas y manteles, y telas outdoor Aqua Block, impermeables, para galerías, reposeras y almohadones de exterior.",
    ],
    tipos: [],
    preguntas: [],
    mensajeWhatsApp: "Hola Casa Esusy, quiero consultar por telas.",
  },
  {
    slug: "exterior",
    nombre: "Exterior",
    titulo: "Balcones, galerías y terrazas",
    bajada: "Telas outdoor, paneles WPC y césped sintético.",
    metaDescripcion:
      "Telas outdoor impermeables, paneles WPC resistentes al sol y césped sintético para balcones, galerías y terrazas en Banfield.",
    textura: "rayado",
    intro: [
      "Para los espacios de afuera trabajamos telas outdoor impermeables, paneles WPC co-extruidos —resistentes al sol y a la intemperie, de bajo mantenimiento— y césped sintético para balcones y terrazas.",
    ],
    tipos: [],
    preguntas: [],
    mensajeWhatsApp: "Hola Casa Esusy, quiero consultar por productos para exterior.",
  },
];

export const getServicio = (slug: string) => servicios.find((s) => s.slug === slug);

/** Orden y textos cortos del muestrario de la home. */
export const muestrario: {
  slug: string;
  href: string;
  nombre: string;
  detalle: string;
  textura: Textura;
}[] = [
  {
    slug: "cortinas",
    href: "/cortinas",
    nombre: "Cortinas",
    detalle: "Gasas, black out, roller, venecianas",
    textura: "gasa",
  },
  {
    slug: "tapiceria",
    href: "/tapiceria",
    nombre: "Sillones",
    detalle: "A medida, retapizado, respaldos",
    textura: "terciopelo",
  },
  {
    slug: "dormitorio",
    href: "/dormitorio",
    nombre: "Dormitorio",
    detalle: "Acolchados, cubrecamas, almohadones",
    textura: "boucle",
  },
  {
    slug: "alfombras",
    href: "/alfombras",
    nombre: "Alfombras",
    detalle: "Carpetas a medida, yute, bouclé",
    textura: "yute",
  },
  {
    slug: "empapelados",
    href: "/empapelados",
    nombre: "Empapelados",
    detalle: "Importados y nacionales",
    textura: "papel",
  },
  {
    slug: "pisos",
    href: "/pisos",
    nombre: "Pisos",
    detalle: "SPC vinílico y flotantes",
    textura: "madera",
  },
  {
    slug: "telas",
    href: "/telas",
    nombre: "Telas",
    detalle: "Por metro y outdoor",
    textura: "vichy",
  },
  {
    slug: "diseno",
    href: "/diseno-de-interiores",
    nombre: "Diseño",
    detalle: "Ambientes completos",
    textura: "lino",
  },
];
