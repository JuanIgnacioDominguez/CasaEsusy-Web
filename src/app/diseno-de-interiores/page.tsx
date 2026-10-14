import { BotonLink } from "@/components/ui/Boton";
import { IconoWhatsApp } from "@/components/ui/IconoWhatsApp";
import { FotoPendiente } from "@/components/ui/FotoPendiente";
import { Encabezado } from "@/components/secciones/Encabezado";
import { CierreContacto } from "@/components/secciones/CierreContacto";
import { JsonLd } from "@/components/seo/JsonLd";
import { negocio, urlWhatsApp } from "@/content/negocio";
import { metadatos, schemaServicio } from "@/lib/seo";

const descripcion =
  "Diseño de interiores en Banfield con Andrea Esusy, certificada por DECOmobi. Proyectos de ambientes completos: paleta, cortinas, sillones, alfombras y empapelados coordinados.";

export const metadata = metadatos({
  titulo: "Diseño de interiores en Banfield",
  descripcion,
  ruta: "/diseno-de-interiores",
});

const modalidades = [
  {
    nombre: "Asesoramiento puntual",
    texto:
      "Una visita para resolver un ambiente: qué cortina, qué alfombra, qué tela para el sillón.",
  },
  {
    nombre: "Proyecto de un ambiente",
    texto:
      "Living, dormitorio o comedor completo, con propuesta de materiales y presupuesto de cada pieza.",
  },
  {
    nombre: "Proyecto integral",
    texto: "Varios ambientes o toda la casa, coordinando estilo, textiles, pisos y revestimientos.",
  },
  {
    nombre: "Proyectos comerciales",
    texto: "Locales, oficinas y showrooms. Ya trabajamos con empresas que volvieron a elegirnos.",
  },
];

const entregables = [
  "Paleta de colores y texturas",
  "Selección de telas y materiales con muestras",
  "Plano de ubicación de muebles y alfombras",
  "Presupuesto detallado por ítem",
  "Confección, colocación y seguimiento",
];

export default function DisenoInteriores() {
  return (
    <>
      <JsonLd data={schemaServicio("Diseño de interiores", descripcion, "/diseno-de-interiores")} />
      <Encabezado
        nombre="Diseño de interiores"
        ruta="/diseno-de-interiores"
        titulo="Diseño de interiores, del boceto a la colocación"
        bajada="Te ayudamos a pensar el ambiente completo y lo hacemos realidad en el mismo lugar: diseñamos, confeccionamos y colocamos."
      >
        <div className="mt-8 flex flex-wrap gap-3">
          <BotonLink href="/presupuesto?servicio=diseno">Contanos tu proyecto</BotonLink>
          <BotonLink
            href={urlWhatsApp(
              "Hola Andrea, quiero consultar por un proyecto de diseño de interiores.",
            )}
            externo
            variante="secundario"
          >
            <IconoWhatsApp className="size-5 text-[#1fb855]" /> Hablar con Andrea
          </BotonLink>
        </div>
      </Encabezado>

      <section className="contenedor mt-20 grid items-center gap-10 md:grid-cols-2">
        <FotoPendiente
          textura="lino"
          descripcion="Andrea con su certificado de DECOmobi"
          className="aspect-[4/5]"
        />
        <div>
          <h2 className="display text-[2.2rem]">{negocio.duena.nombre}</h2>
          <p className="mt-2 text-[0.9375rem] text-grafito">
            {negocio.duena.credencial}, {negocio.duena.institucion}
          </p>
          <div className="prose-esusy mt-6 text-hilo-2">
            <p>
              Tercera generación de Casa Esusy. A la experiencia de toda una vida eligiendo telas y
              resolviendo ventanas difíciles le sumó la formación en diseño y decoración de
              interiores.
            </p>
            <p>
              Su forma de trabajar es simple: escuchar cómo vivís el espacio, proponer pocas piezas
              bien elegidas y cuidar cada terminación.
            </p>
          </div>
        </div>
      </section>

      <section className="contenedor mt-20" aria-labelledby="titulo-modalidades">
        <h2 id="titulo-modalidades" className="display text-[2.2rem]">
          Formas de trabajar juntos
        </h2>
        <dl className="mt-8 grid gap-x-10 gap-y-8 sm:grid-cols-2">
          {modalidades.map((mo) => (
            <div key={mo.nombre} className="border-t border-hilo/20 pt-5">
              <dt className="text-[1.1875rem] font-semibold">{mo.nombre}</dt>
              <dd className="mt-2 text-hilo-2">{mo.texto}</dd>
            </div>
          ))}
        </dl>
      </section>

      <section className="contenedor mt-20 grid gap-8 md:grid-cols-[1fr_2fr]">
        <h2 className="display text-[2.2rem]">Qué incluye un proyecto</h2>
        <ul className="divide-y divide-separator border-y border-separator">
          {entregables.map((e) => (
            <li key={e} className="py-4 text-[1.0625rem]">
              {e}
            </li>
          ))}
        </ul>
      </section>

      <CierreContacto
        titulo="¿Qué ambiente querés transformar?"
        mensaje="Hola Andrea, quiero consultar por un proyecto de diseño de interiores."
      />
    </>
  );
}
