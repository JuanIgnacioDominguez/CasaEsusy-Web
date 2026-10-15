import type { Metadata } from "next";
import Link from "next/link";
import { ArrowRightIcon, MailIcon, PhoneIcon } from "lucide-react";
import { Aparecer, AparecerItem, Escalonado } from "@/components/motion/Aparecer";
import { IconoFacebook, IconoInstagram, IconoWhatsApp } from "@/components/iconos";
import { Migas } from "@/components/sitio/Migas";
import { Visitanos } from "@/components/sitio/secciones/Visitanos";
import { getAjuste } from "@/lib/ajustes";
import { metadataFija } from "@/lib/seo";
import { urlWhatsApp } from "@/lib/whatsapp";

export function generateMetadata(): Promise<Metadata> {
  return metadataFija("/contacto");
}

export default async function Contacto() {
  const [negocio, whatsapp] = await Promise.all([getAjuste("negocio"), getAjuste("whatsapp")]);
  const canales = [
    { href: urlWhatsApp(negocio.whatsapp, whatsapp.mensaje), Icono: IconoWhatsApp, titulo: "WhatsApp", detalle: negocio.telefonoVisible, nota: "La forma más rápida", externo: true },
    { href: `tel:+${negocio.whatsapp}`, Icono: PhoneIcon, titulo: "Teléfono", detalle: negocio.telefonoVisible, nota: "En horario de atención", externo: false },
    { href: negocio.instagram, Icono: IconoInstagram, titulo: "Instagram", detalle: "@casa_esusy", nota: "Trabajos nuevos cada semana", externo: true },
    { href: negocio.facebook, Icono: IconoFacebook, titulo: "Facebook", detalle: "/Casaesusy", nota: "Novedades", externo: true },
    ...(negocio.email ? [{ href: `mailto:${negocio.email}`, Icono: MailIcon, titulo: "Email", detalle: negocio.email, nota: "Respondemos en el día", externo: false }] : []),
  ];
  return (
    <>
      <section className="pt-28 sm:pt-32 lg:pt-36">
        <div className="contenedor flex flex-col gap-10">
          <Aparecer inmediato className="flex flex-col gap-5">
            <Migas items={[{ nombre: "Contacto", ruta: "/contacto" }]} />
            <h1 className="max-w-3xl text-[2.4rem] leading-[1.04] font-semibold tracking-[-0.03em] sm:text-5xl lg:text-6xl">Hablemos</h1>
            <p className="max-w-2xl text-lg text-muted-foreground">Escribinos por donde te quede más cómodo o pasá por el local.</p>
          </Aparecer>
          <Escalonado className="grid gap-3 sm:grid-cols-2 lg:grid-cols-4">
            {canales.map(({ href, Icono, titulo, detalle, nota, externo }) => (
              <AparecerItem key={titulo}>
                <a
                  href={href}
                  {...(externo ? { target: "_blank", rel: "noopener" } : {})}
                  className="group flex h-full flex-col gap-4 rounded-[1.5rem] border bg-card p-6 transition-colors hover:border-foreground/25"
                >
                  <span className="grid size-12 place-items-center rounded-xl bg-secondary text-pizarra">
                    <Icono className="size-6" />
                  </span>
                  <span className="flex flex-col gap-0.5">
                    <span className="text-sm text-muted-foreground">{titulo}</span>
                    <span className="text-lg font-semibold break-all">{detalle}</span>
                    <span className="text-sm text-muted-foreground">{nota}</span>
                  </span>
                </a>
              </AparecerItem>
            ))}
          </Escalonado>
          <Aparecer>
            <Link
              href="/presupuesto"
              className="group flex flex-col justify-between gap-4 rounded-[1.5rem] bg-lino p-6 sm:flex-row sm:items-center sm:p-8"
            >
              <span className="flex flex-col gap-1">
                <span className="text-xl font-semibold">¿Querés un presupuesto?</span>
                <span className="text-muted-foreground">Completá el formulario en tres pasos y te contactamos.</span>
              </span>
              <span className="inline-flex items-center gap-2 font-semibold">
                Pedir presupuesto <ArrowRightIcon className="size-5 transition-transform group-hover:translate-x-1" />
              </span>
            </Link>
          </Aparecer>
        </div>
      </section>
      <Visitanos negocio={negocio} />
    </>
  );
}
