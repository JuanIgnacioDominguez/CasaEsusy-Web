import type { Metadata } from "next";
import Image from "next/image";
import Link from "next/link";
import { notFound, permanentRedirect, redirect } from "next/navigation";
import { ArrowRightIcon, CheckIcon } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Aparecer, AparecerItem, Escalonado } from "@/components/motion/Aparecer";
import { IconoWhatsApp } from "@/components/iconos";
import { JsonLd } from "@/components/seo/JsonLd";
import { ListaPreguntas } from "@/components/sitio/ListaPreguntas";
import { Migas, SchemaMigas } from "@/components/sitio/Migas";
import { Encabezado } from "@/components/sitio/secciones/Encabezado";
import { LlamadoFinal } from "@/components/sitio/secciones/LlamadoFinal";
import { getAjuste } from "@/lib/ajustes";
import { buscarRedireccion, getProyectos, getServicio, getServicios } from "@/lib/datos/publico";
import { metadataPara, schemaPreguntas, schemaServicio } from "@/lib/seo";
import { urlWhatsApp } from "@/lib/whatsapp";

interface Props {
  params: Promise<{ servicio: string }>;
}

export async function generateStaticParams() {
  const servicios = await getServicios();
  return servicios.map((s) => ({ servicio: s.slug }));
}

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { servicio: slug } = await params;
  const s = await getServicio(slug);
  if (!s) return {};
  return metadataPara(`/${s.slug}`, { titulo: s.titulo, descripcion: s.bajada, imagen: s.imagen });
}

const VENTAJAS = [
  "Medición y presupuesto sin cargo",
  "Muestras en tu casa para elegir con la luz real",
  "Confección a medida y colocación propia",
  "Trabajamos en Capital, zona sur y donde nos necesites",
  "Más de medio siglo de oficio, desde 1967",
];

export default async function PaginaServicio({ params }: Props) {
  const { servicio: slug } = await params;
  const servicio = await getServicio(slug);
  if (!servicio) {
    const r = await buscarRedireccion(`/${slug}`);
    if (r) (r.codigo === 302 ? redirect : permanentRedirect)(r.hacia);
    notFound();
  }

  const [negocio, servicios, proyectos] = await Promise.all([getAjuste("negocio"), getServicios(), getProyectos()]);
  const relacionados = proyectos.filter((p) => p.servicio === servicio.slug).slice(0, 4);
  const otros = servicios.filter((s) => s.slug !== servicio.slug);
  const parrafos = servicio.descripcion.split(/\n{2,}/).filter(Boolean);
  const mensaje = servicio.mensajeWhatsApp || `Hola Casa Esusy, quiero consultar por ${servicio.nombre.toLowerCase()}.`;

  return (
    <>
      <section className="pt-28 pb-16 sm:pt-32 lg:pt-36 lg:pb-24">
        <div className="contenedor grid items-center gap-12 lg:grid-cols-2 lg:gap-16">
          <div className="flex flex-col gap-6">
            <SchemaMigas items={[{ nombre: servicio.nombre, ruta: `/${servicio.slug}` }]} />
            <Aparecer inmediato desplazamiento={8}>
              <Migas items={[{ nombre: servicio.nombre, ruta: `/${servicio.slug}` }]} />
            </Aparecer>
            <Aparecer inmediato retraso={0.05} className="flex flex-col gap-5">
              <span className="rotulo text-terracota">
                <span className="h-px w-6 bg-current" aria-hidden />
                {servicio.nombre}
              </span>
              <h1 className="text-[2.4rem] leading-[1.04] font-semibold tracking-[-0.03em] sm:text-5xl lg:text-[3.6rem]">
                {servicio.titulo}
              </h1>
              <p className="max-w-xl text-lg leading-relaxed text-muted-foreground sm:text-xl">{servicio.bajada}</p>
            </Aparecer>
            <Aparecer inmediato retraso={0.15} className="flex flex-col gap-3 sm:flex-row">
              <Button asChild size="lg" className="h-13 rounded-lg px-7 text-base">
                <Link href={`/presupuesto?servicio=${servicio.slug}`}>
                  Pedir presupuesto <ArrowRightIcon data-icon="inline-end" />
                </Link>
              </Button>
              <Button asChild size="lg" variant="outline" className="h-13 rounded-lg bg-card/60 px-7 text-base">
                <a href={urlWhatsApp(negocio.whatsapp, mensaje)} target="_blank" rel="noopener">
                  <IconoWhatsApp data-icon="inline-start" className="text-[#1FA855]" /> Consultar por WhatsApp
                </a>
              </Button>
            </Aparecer>
          </div>
          <Aparecer inmediato retraso={0.1} className="relative aspect-[4/3] overflow-hidden rounded-[2rem] bg-muted shadow-[0_40px_80px_-40px_rgb(42_47_53/0.45)] lg:aspect-[5/5.2]">
            <Image src={servicio.imagen} alt={servicio.titulo} fill priority sizes="(min-width:1024px) 50vw, 100vw" className="object-cover" />
          </Aparecer>
        </div>
      </section>

      {servicio.tipos.length > 0 && (
        <section className="bg-card py-20 lg:py-24">
          <div className="contenedor flex flex-col gap-12">
            <Encabezado rotulo="Opciones" titulo={`Qué hacemos en ${servicio.nombre.toLowerCase()}`} />
            <Escalonado className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
              {servicio.tipos.map((t, i) => (
                <AparecerItem key={t.nombre} className="flex flex-col gap-3 rounded-[1.5rem] border bg-background p-7 transition-colors hover:border-terracota/40">
                  <span className="text-sm font-semibold text-terracota tabular-nums">{String(i + 1).padStart(2, "0")}</span>
                  <h3 className="text-xl font-semibold">{t.nombre}</h3>
                  <p className="leading-relaxed text-muted-foreground">{t.descripcion}</p>
                </AparecerItem>
              ))}
            </Escalonado>
          </div>
        </section>
      )}

      <section className="py-20 lg:py-24">
        <div className="contenedor grid gap-12 lg:grid-cols-[1.3fr_1fr] lg:gap-20">
          <Aparecer className="flex flex-col gap-5">
            <h2 className="text-[2rem] leading-tight font-semibold sm:text-[2.4rem]">Cómo lo trabajamos</h2>
            {parrafos.map((p) => (
              <p key={p.slice(0, 32)} className="text-lg leading-relaxed text-muted-foreground">
                {p}
              </p>
            ))}
          </Aparecer>
          <Aparecer retraso={0.1} className="flex flex-col gap-4 self-start rounded-[1.75rem] bg-lino p-7 sm:p-8">
            <p className="text-lg font-semibold">Con Casa Esusy</p>
            <ul className="flex flex-col gap-3">
              {VENTAJAS.map((v) => (
                <li key={v} className="flex gap-3">
                  <span className="mt-0.5 grid size-6 shrink-0 place-items-center rounded-full bg-pizarra text-marfil">
                    <CheckIcon className="size-3.5" strokeWidth={3} />
                  </span>
                  <span className="leading-relaxed">{v}</span>
                </li>
              ))}
            </ul>
          </Aparecer>
        </div>
      </section>

      {relacionados.length > 0 && (
        <section className="pb-20 lg:pb-24">
          <div className="contenedor flex flex-col gap-10">
            <div className="flex items-end justify-between gap-6">
              <Encabezado rotulo="Trabajos reales" titulo="Algunos trabajos recientes" />
              <Button asChild variant="link" className="hidden h-auto px-0 text-base text-foreground sm:inline-flex">
                <Link href="/proyectos">
                  Ver todos <ArrowRightIcon data-icon="inline-end" />
                </Link>
              </Button>
            </div>
            <Escalonado className="grid grid-cols-2 gap-4 lg:grid-cols-4">
              {relacionados.map((p) => (
                <AparecerItem key={p.id} className="group flex flex-col gap-3">
                  <div className="relative aspect-[3/4] overflow-hidden rounded-[1.25rem] bg-muted">
                    <Image src={p.imagen} alt={p.titulo} fill sizes="(min-width:1024px) 25vw, 50vw" className="object-cover transition-transform duration-700 group-hover:scale-105" />
                  </div>
                  <p className="text-sm leading-snug font-semibold sm:text-[0.95rem]">{p.titulo}</p>
                </AparecerItem>
              ))}
            </Escalonado>
          </div>
        </section>
      )}

      {servicio.preguntas.length > 0 && (
        <section className="pb-20 lg:pb-24">
          <div className="contenedor grid gap-10 lg:grid-cols-[1fr_1.4fr] lg:gap-16">
            <Encabezado rotulo="Preguntas" titulo="Lo que más nos consultan" bajada="Si te queda alguna duda, escribinos y te respondemos en el día." />
            <Aparecer retraso={0.1}>
              <ListaPreguntas items={servicio.preguntas} prefijo={servicio.slug} />
            </Aparecer>
          </div>
          <JsonLd data={schemaPreguntas(servicio.preguntas)} />
        </section>
      )}

      <section className="pb-16">
        <div className="contenedor flex flex-col gap-4">
          <p className="rotulo text-muted-foreground">También hacemos</p>
          <div className="flex flex-wrap gap-2">
            {otros.map((o) => (
              <Link
                key={o.slug}
                href={`/${o.slug}`}
                className="rounded-full border bg-card px-4 py-2.5 text-sm font-medium transition-colors hover:border-foreground/30 hover:bg-muted"
              >
                {o.nombre}
              </Link>
            ))}
          </div>
        </div>
      </section>

      <LlamadoFinal
        whatsapp={negocio.whatsapp}
        mensaje={mensaje}
        titulo={`¿Hablamos de tu proyecto de ${servicio.nombre.toLowerCase()}?`}
        imagen={servicio.imagen}
      />
      <JsonLd data={schemaServicio(servicio, negocio)} />
    </>
  );
}
