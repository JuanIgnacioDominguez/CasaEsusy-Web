import { Encabezado } from "@/components/secciones/Encabezado";
import { CierreContacto } from "@/components/secciones/CierreContacto";
import { Muestra, type Textura } from "@/components/ui/Muestra";
import { metadatos } from "@/lib/seo";

export const metadata = metadatos({
  titulo: "Cuidado de telas y cortinas",
  descripcion:
    "Cómo lavar y cuidar cortinas de tela, gasas, black out, roller, venecianas, sillones y alfombras para que no encojan ni se dañen.",
  ruta: "/cuidado-de-telas",
});

/* Validar cada recomendación con Andrea antes de publicar. */
const guias: { titulo: string; textura: Textura; consejos: string[] }[] = [
  {
    titulo: "Cortinas de tela y gasas",
    textura: "gasa",
    consejos: [
      "Revisá la etiqueta: muchas telas naturales encogen con agua caliente.",
      "Si se pueden lavar, a mano o en ciclo delicado, con agua fría y jabón neutro.",
      "No uses secarropas: colgalas húmedas para que tomen la caída sola.",
      "Ante la duda, limpieza en seco.",
    ],
  },
  {
    titulo: "Black out y roller",
    textura: "screen",
    consejos: [
      "Pasá un plumero o la aspiradora con cepillo suave.",
      "Para manchas, un paño húmedo con jabón neutro, sin frotar fuerte.",
      "No los sumerjas ni los dobles: se marca el revestimiento.",
    ],
  },
  {
    titulo: "Venecianas",
    textura: "listones",
    consejos: [
      "Cerralas y limpiá los listones con un paño seco o apenas húmedo.",
      "En las de madera, evitá el exceso de agua.",
    ],
  },
  {
    titulo: "Sillones y almohadones",
    textura: "terciopelo",
    consejos: [
      "Aspirá una vez por semana con el accesorio de tapizados.",
      "Ante una mancha, secá primero con papel, sin frotar.",
      "En pana y velvet, cepillá en el sentido del pelo.",
    ],
  },
  {
    titulo: "Alfombras",
    textura: "yute",
    consejos: [
      "Aspirá seguido y girala cada tanto para que se gaste parejo.",
      "El yute no se lava con agua: limpieza en seco o con paño apenas húmedo.",
    ],
  },
];

export default function CuidadoDeTelas() {
  return (
    <>
      <Encabezado
        nombre="Cuidado de telas"
        ruta="/cuidado-de-telas"
        titulo="Cómo cuidar tus cortinas y tapizados"
        bajada="Con el cuidado justo, una tela dura muchos años. Si tenés dudas sobre un trabajo nuestro, escribinos y te decimos qué hacer."
      />
      <div className="contenedor mt-12 divide-y divide-separator border-y border-separator">
        {guias.map((g) => (
          <section
            key={g.titulo}
            className="grid gap-6 py-10 md:grid-cols-[120px_1fr_2fr] md:items-start"
          >
            <Muestra textura={g.textura} className="hidden aspect-square rounded-[12px] md:block" />
            <h2 className="display text-[1.9rem] leading-tight">{g.titulo}</h2>
            <ul className="list-disc space-y-2 pl-5 text-hilo-2 marker:text-rosa">
              {g.consejos.map((c) => (
                <li key={c}>{c}</li>
              ))}
            </ul>
          </section>
        ))}
      </div>
      <CierreContacto
        titulo="¿Dudas con una tela?"
        mensaje="Hola Casa Esusy, tengo una consulta sobre el cuidado de una tela."
      />
    </>
  );
}
