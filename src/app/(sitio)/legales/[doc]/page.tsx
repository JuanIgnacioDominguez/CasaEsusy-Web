import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { Migas } from "@/components/sitio/Migas";
import { getAjuste } from "@/lib/ajustes";
import type { Negocio } from "@/lib/ajustes/esquemas";
import { metadataPara } from "@/lib/seo";

const DOCS = {
  privacidad: {
    titulo: "Política de privacidad",
    secciones: (n: Negocio) => [
      ["Quién es responsable", `${n.nombre}, ${n.calle}, ${n.localidad}, ${n.provincia}. Razón social y CUIT: [COMPLETAR].`],
      ["Qué datos pedimos", "Nombre, teléfono, email (opcional), zona y los detalles que nos cuentes sobre tu proyecto cuando completás el formulario de presupuesto."],
      ["Para qué los usamos", "Únicamente para responder tu consulta, coordinar visitas y enviarte presupuestos. No los vendemos ni los compartimos con terceros con fines comerciales."],
      ["Tus derechos", "Podés pedir acceso, rectificación o supresión de tus datos en cualquier momento escribiéndonos por WhatsApp o al email de contacto, según la Ley 25.326 de Protección de Datos Personales. La Agencia de Acceso a la Información Pública es el órgano de control."],
      ["Cookies", "El sitio solo usa cookies técnicas necesarias para funcionar. No usamos cookies de publicidad."],
    ],
  },
  terminos: {
    titulo: "Términos y condiciones",
    secciones: (n: Negocio) => [
      ["Información del sitio", `El contenido de este sitio es informativo. Los precios y plazos se confirman en cada presupuesto que emite ${n.nombre}.`],
      ["Presupuestos", "Los presupuestos tienen la validez indicada en cada uno. Las medidas definitivas se toman en la visita técnica."],
      ["Trabajos a medida", "Los productos confeccionados a medida no admiten cambios una vez iniciada la confección. [COMPLETAR política de cambios y garantía]"],
      ["Imágenes", "Algunas fotos de ambientes son ilustrativas. Las fotos de trabajos realizados corresponden a clientes que autorizaron su publicación."],
    ],
  },
} as const;

type Doc = keyof typeof DOCS;

export function generateStaticParams() {
  return Object.keys(DOCS).map((doc) => ({ doc }));
}

export async function generateMetadata({ params }: { params: Promise<{ doc: string }> }): Promise<Metadata> {
  const { doc } = await params;
  if (!(doc in DOCS)) return {};
  const d = DOCS[doc as Doc];
  return metadataPara(`/legales/${doc}`, { titulo: d.titulo, descripcion: `${d.titulo} de Casa Esusy.` });
}

export default async function Legal({ params }: { params: Promise<{ doc: string }> }) {
  const { doc } = await params;
  if (!(doc in DOCS)) notFound();
  const d = DOCS[doc as Doc];
  const negocio = await getAjuste("negocio");
  return (
    <section className="pt-28 pb-24 sm:pt-32 lg:pt-36">
      <div className="contenedor flex max-w-3xl flex-col gap-8">
        <Migas items={[{ nombre: d.titulo, ruta: `/legales/${doc}` }]} />
        <h1 className="text-4xl font-semibold tracking-tight sm:text-5xl">{d.titulo}</h1>
        {d.secciones(negocio).map(([titulo, texto]) => (
          <div key={titulo} className="flex flex-col gap-2">
            <h2 className="text-xl font-semibold">{titulo}</h2>
            <p className="leading-relaxed text-muted-foreground">{texto}</p>
          </div>
        ))}
      </div>
    </section>
  );
}
