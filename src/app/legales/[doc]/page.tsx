import { notFound } from "next/navigation";
import { Encabezado } from "@/components/secciones/Encabezado";
import { negocio } from "@/content/negocio";
import { metadatos } from "@/lib/seo";

/** Borradores: deben revisarse con un abogado antes de publicar (sección 20 del plan). */
const docs = {
  privacidad: {
    titulo: "Política de privacidad",
    parrafos: [
      `${negocio.nombre} usa los datos que nos dejás (nombre, teléfono, barrio y detalles del pedido) solo para responder tu consulta y preparar el presupuesto.`,
      "No vendemos ni compartimos tus datos con terceros. Podés pedir acceder, corregir o eliminar tus datos escribiéndonos por WhatsApp, conforme a la Ley 25.326 de Protección de Datos Personales.",
      "[COMPLETAR con asesoramiento legal: responsable de la base, cookies y analítica.]",
    ],
  },
  terminos: {
    titulo: "Términos y condiciones",
    parrafos: [
      "Los precios y la disponibilidad de productos pueden cambiar sin aviso. Los presupuestos tienen la validez indicada en cada uno.",
      "Los productos confeccionados a medida tienen condiciones especiales de cambio. [COMPLETAR con asesoramiento legal.]",
    ],
  },
} as const;

type Doc = keyof typeof docs;

export const dynamicParams = false;
export function generateStaticParams() {
  return Object.keys(docs).map((doc) => ({ doc }));
}

export async function generateMetadata({ params }: { params: Promise<{ doc: string }> }) {
  const d = docs[(await params).doc as Doc];
  return d
    ? {
        ...metadatos({
          titulo: d.titulo,
          descripcion: d.titulo,
          ruta: `/legales/${(await params).doc}`,
        }),
        robots: { index: false },
      }
    : {};
}

export default async function Legal({ params }: { params: Promise<{ doc: string }> }) {
  const { doc } = await params;
  const d = docs[doc as Doc];
  if (!d) notFound();
  return (
    <>
      <Encabezado nombre={d.titulo} ruta={`/legales/${doc}`} titulo={d.titulo} />
      <div className="contenedor prose-esusy mt-10 text-hilo-2">
        {d.parrafos.map((p) => (
          <p key={p.slice(0, 20)}>{p}</p>
        ))}
      </div>
    </>
  );
}
