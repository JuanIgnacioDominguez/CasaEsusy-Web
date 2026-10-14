import { Encabezado } from "@/components/secciones/Encabezado";
import { CierreContacto } from "@/components/secciones/CierreContacto";
import { Preguntas } from "@/components/ui/Preguntas";
import { JsonLd } from "@/components/seo/JsonLd";
import { preguntasGenerales } from "@/content/preguntas";
import { metadatos, schemaFaq } from "@/lib/seo";

export const metadata = metadatos({
  titulo: "Preguntas frecuentes",
  descripcion:
    "Respuestas sobre presupuesto, medición, zonas de atención, plazos, cortinas, sillones, empapelados, pisos y alfombras en Casa Esusy, Banfield.",
  ruta: "/preguntas-frecuentes",
});

export default function PreguntasFrecuentes() {
  const todas = preguntasGenerales
    .flatMap((g) => g.preguntas)
    .filter((p) => !p.respuesta.includes("[COMPLETAR"));
  return (
    <>
      <JsonLd data={schemaFaq(todas)} />
      <Encabezado
        nombre="Preguntas frecuentes"
        ruta="/preguntas-frecuentes"
        titulo="Preguntas frecuentes"
      />
      <div className="contenedor mt-12 space-y-14">
        {preguntasGenerales.map((g) => (
          <section key={g.grupo} className="grid gap-6 md:grid-cols-[1fr_2fr]">
            <h2 className="display text-[1.9rem]">{g.grupo}</h2>
            <Preguntas preguntas={g.preguntas} />
          </section>
        ))}
      </div>
      <CierreContacto titulo="¿No encontraste tu respuesta?" />
    </>
  );
}
