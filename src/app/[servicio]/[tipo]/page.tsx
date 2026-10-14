import Link from "next/link";
import { notFound } from "next/navigation";
import { Check } from "lucide-react";
import { BotonLink } from "@/components/ui/Boton";
import { IconoWhatsApp } from "@/components/ui/IconoWhatsApp";
import { Migas } from "@/components/ui/Migas";
import { Muestra } from "@/components/ui/Muestra";
import { FotoPendiente } from "@/components/ui/FotoPendiente";
import { CierreContacto } from "@/components/secciones/CierreContacto";
import { JsonLd } from "@/components/seo/JsonLd";
import { urlWhatsApp } from "@/content/negocio";
import { getServicio, servicios } from "@/content/servicios";
import { metadatos, schemaServicio } from "@/lib/seo";

type Params = Promise<{ servicio: string; tipo: string }>;

export const dynamicParams = false;

export function generateStaticParams() {
  return servicios.flatMap((s) => s.tipos.map((t) => ({ servicio: s.slug, tipo: t.slug })));
}

async function cargar(params: Params) {
  const { servicio, tipo } = await params;
  const s = getServicio(servicio);
  const t = s?.tipos.find((x) => x.slug === tipo);
  return s && t ? { s, t } : null;
}

export async function generateMetadata({ params }: { params: Params }) {
  const d = await cargar(params);
  if (!d) return {};
  return metadatos({
    titulo: `${d.t.nombre} a medida en Banfield`,
    descripcion: `${d.t.resumen} ${d.t.parrafos[0] ?? ""}`.slice(0, 158),
    ruta: `/${d.s.slug}/${d.t.slug}`,
  });
}

export default async function PaginaTipo({ params }: { params: Params }) {
  const d = await cargar(params);
  if (!d) notFound();
  const { s, t } = d;
  const ruta = `/${s.slug}/${t.slug}`;
  const otros = s.tipos.filter((x) => x.slug !== t.slug);
  const mensaje = `Hola Casa Esusy, quiero consultar por ${t.nombre.toLowerCase()}.`;

  return (
    <>
      <JsonLd data={schemaServicio(t.nombre, t.resumen, ruta)} />
      <section className="contenedor pt-6 md:pt-10">
        <Migas
          items={[
            { nombre: s.nombre, ruta: `/${s.slug}` },
            { nombre: t.nombre, ruta },
          ]}
        />
        <div className="mt-6 grid gap-10 md:grid-cols-2 md:items-center">
          <div>
            <h1 className="display text-[clamp(2.6rem,6vw,4rem)]">{t.nombre}</h1>
            <p className="mt-5 max-w-[46ch] text-[1.125rem] text-hilo-2">{t.resumen}</p>
            <div className="prose-esusy mt-6 text-hilo-2">
              {t.parrafos.map((p) => (
                <p key={p.slice(0, 24)}>{p}</p>
              ))}
            </div>
            <h2 className="mt-8 text-[1.0625rem] font-semibold">Ideal para</h2>
            <ul className="mt-3 space-y-2">
              {t.ideal.map((i) => (
                <li key={i} className="flex items-center gap-3 text-hilo-2">
                  <Check className="size-4 text-rosa" aria-hidden="true" /> {i}
                </li>
              ))}
            </ul>
            <div className="mt-8 flex flex-wrap gap-3">
              <BotonLink href={`/presupuesto?servicio=${s.slug}`}>Pedir presupuesto</BotonLink>
              <BotonLink href={urlWhatsApp(mensaje)} externo variante="secundario">
                <IconoWhatsApp className="size-5 text-[#1fb855]" /> Consultar
              </BotonLink>
            </div>
          </div>
          <FotoPendiente
            textura={t.textura}
            descripcion={`${t.nombre.toLowerCase()} colocadas en un ambiente`}
            className="aspect-[4/5]"
          />
        </div>
      </section>

      {otros.length > 0 && (
        <section className="contenedor mt-20" aria-labelledby="titulo-otros">
          <h2 id="titulo-otros" className="display text-[2rem]">
            Otras opciones de {s.nombre.toLowerCase()}
          </h2>
          <ul className="mt-6 grid grid-cols-2 gap-4 sm:grid-cols-3 lg:grid-cols-4">
            {otros.map((o) => (
              <li key={o.slug}>
                <Link href={`/${s.slug}/${o.slug}`} className="group block">
                  <Muestra textura={o.textura} className="aspect-[4/3] rounded-[10px]" />
                  <span className="mt-2 block font-semibold group-hover:text-rosa">{o.nombre}</span>
                </Link>
              </li>
            ))}
          </ul>
        </section>
      )}

      <CierreContacto mensaje={mensaje} />
    </>
  );
}
