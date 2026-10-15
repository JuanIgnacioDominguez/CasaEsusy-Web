import type { Metadata } from "next";
import { Aparecer } from "@/components/motion/Aparecer";
import { JsonLd } from "@/components/seo/JsonLd";
import { ListaPreguntas } from "@/components/sitio/ListaPreguntas";
import { Migas } from "@/components/sitio/Migas";
import { LlamadoFinal } from "@/components/sitio/secciones/LlamadoFinal";
import { getAjuste } from "@/lib/ajustes";
import { getPreguntas, getServicios } from "@/lib/datos/publico";
import type { PreguntaRespuesta } from "@/lib/db/schema";
import { metadataFija, schemaPreguntas } from "@/lib/seo";

export function generateMetadata(): Promise<Metadata> {
  return metadataFija("/preguntas-frecuentes");
}

export default async function Preguntas() {
  const [negocio, whatsapp, generales, servicios] = await Promise.all([getAjuste("negocio"), getAjuste("whatsapp"), getPreguntas(), getServicios()]);
  const grupos = new Map<string, PreguntaRespuesta[]>();
  for (const p of generales) grupos.set(p.grupo, [...(grupos.get(p.grupo) ?? []), { pregunta: p.pregunta, respuesta: p.respuesta }]);
  for (const s of servicios) if (s.preguntas.length) grupos.set(s.nombre, [...(grupos.get(s.nombre) ?? []), ...s.preguntas]);
  const todas = [...grupos.values()].flat();

  return (
    <>
      <section className="pt-28 pb-20 sm:pt-32 lg:pt-36">
        <div className="contenedor grid gap-12 lg:grid-cols-[18rem_1fr] lg:gap-16">
          <Aparecer inmediato className="flex flex-col gap-5 lg:sticky lg:top-28 lg:self-start">
            <Migas items={[{ nombre: "Preguntas frecuentes", ruta: "/preguntas-frecuentes" }]} />
            <h1 className="text-[2.4rem] leading-[1.04] font-semibold tracking-[-0.03em] sm:text-5xl">Preguntas frecuentes</h1>
            <nav aria-label="Temas" className="hidden flex-col gap-1 lg:flex">
              {[...grupos.keys()].map((g) => (
                <a key={g} href={`#${encodeURIComponent(g)}`} className="rounded-lg px-3 py-2 text-sm text-muted-foreground hover:bg-muted hover:text-foreground">
                  {g}
                </a>
              ))}
            </nav>
          </Aparecer>
          <div className="flex flex-col gap-12">
            {[...grupos.entries()].map(([grupo, items]) => (
              <Aparecer key={grupo} id={encodeURIComponent(grupo)} className="flex scroll-mt-28 flex-col gap-4">
                <h2 className="text-2xl font-semibold">{grupo}</h2>
                <ListaPreguntas items={items} prefijo={grupo} />
              </Aparecer>
            ))}
          </div>
        </div>
      </section>
      <LlamadoFinal whatsapp={negocio.whatsapp} mensaje={whatsapp.mensaje} titulo="¿No encontraste tu respuesta?" bajada="Escribinos y te respondemos en el día." />
      <JsonLd data={schemaPreguntas(todas)} />
    </>
  );
}
