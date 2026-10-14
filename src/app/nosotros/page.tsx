import { Encabezado } from "@/components/secciones/Encabezado";
import { CierreContacto } from "@/components/secciones/CierreContacto";
import { FotoPendiente } from "@/components/ui/FotoPendiente";
import { negocio } from "@/content/negocio";
import { metadatos } from "@/lib/seo";

export const metadata = metadatos({
  titulo: "Nosotros: tres generaciones desde 1967",
  descripcion:
    "Casa Esusy es una casa de decoración familiar de Banfield, fundada en 1967. Tres generaciones eligiendo telas, asesorando familias y transformando casas de la zona sur.",
  ruta: "/nosotros",
});

/* [COMPLETAR] con fechas e hitos reales que confirme la familia. */
const hitos = [
  { anio: "1967", texto: "Nace Casa Esusy en Banfield como casa de cortinas y telas." },
  {
    anio: "[año]",
    texto: "La segunda generación suma tapicería, alfombras y empapelados. [COMPLETAR]",
  },
  { anio: "[año]", texto: "Llegamos al local de Manuel Acevedo 1290. [COMPLETAR]" },
  { anio: "2023", texto: "Renovamos el local y sumamos pisos SPC, paneles y nuevas líneas." },
  {
    anio: "2025",
    texto: `${negocio.duena.nombre} se certifica en Diseño y Decoración de Interiores en DECOmobi.`,
  },
];

export default function Nosotros() {
  return (
    <>
      <Encabezado
        nombre="Nosotros"
        ruta="/nosotros"
        titulo="Hay cosas que se heredan: el oficio y el amor por los detalles"
        bajada="Desde 1967, tres generaciones eligiendo telas, asesorando familias y transformando casas de Banfield y la zona sur."
      />

      <section className="contenedor mt-16 grid gap-4 sm:grid-cols-3">
        <FotoPendiente
          textura="lino"
          descripcion="foto antigua del primer local"
          className="aspect-[3/4] sm:col-span-1"
        />
        <FotoPendiente
          textura="madera"
          descripcion="el local hoy, Manuel Acevedo 1290"
          className="aspect-[3/4] sm:col-span-2 sm:aspect-auto"
        />
      </section>

      <section
        className="contenedor mt-20 grid gap-10 md:grid-cols-[1fr_2fr]"
        aria-labelledby="titulo-historia"
      >
        <h2 id="titulo-historia" className="display text-[2.2rem]">
          Nuestra historia
        </h2>
        <ol className="relative border-l border-hilo/20 pl-8">
          {hitos.map((h) => (
            <li key={h.texto} className="relative pb-10 last:pb-0">
              <span
                aria-hidden="true"
                className="absolute top-2.5 -left-[37px] size-2.5 rounded-full bg-rosa"
              />
              <p className="display text-[1.9rem] leading-none">{h.anio}</p>
              <p className="mt-2 max-w-[52ch] text-hilo-2">{h.texto}</p>
            </li>
          ))}
        </ol>
      </section>

      <section className="contenedor mt-20 grid gap-10 md:grid-cols-[1fr_2fr]">
        <h2 className="display text-[2.2rem]">Cómo trabajamos</h2>
        <div className="prose-esusy text-[1.0625rem] text-hilo-2">
          <p>
            Somos un equipo chico: atención en el local, taller de confección y colocación propia.
            Eso nos permite seguir cada trabajo de principio a fin y responder rápido si algo
            necesita un ajuste.
          </p>
          <p>
            Hacemos proyectos para casas y también para comercios y oficinas. Muchos clientes
            vuelven, y muchos llegan porque alguien nos recomendó.
          </p>
        </div>
      </section>

      <CierreContacto />
    </>
  );
}
