import type { Metadata } from "next";
import Link from "next/link";
import { ArrowRightIcon, ClockIcon, MailIcon, MapPinnedIcon, PhoneIcon } from "lucide-react";
import { Aparecer, AparecerItem, Escalonado } from "@/components/motion/Aparecer";
import { IconoFacebook, IconoInstagram } from "@/components/iconos";
import { EstadoAbierto } from "@/components/sitio/EstadoAbierto";
import { FormularioContacto } from "@/components/sitio/FormularioContacto";
import { Migas, SchemaMigas } from "@/components/sitio/Migas";
import { Visitanos } from "@/components/sitio/secciones/Visitanos";
import { getAjuste } from "@/lib/ajustes";
import { getServicios } from "@/lib/datos/publico";
import { rangoHorario } from "@/lib/horario";
import { metadataFija } from "@/lib/seo";

export function generateMetadata(): Promise<Metadata> {
  return metadataFija("/contacto");
}

export default async function Contacto() {
  const [negocio, servicios] = await Promise.all([getAjuste("negocio"), getServicios()]);
  const temas = [...servicios.map((s) => s.nombre), "Otro tema"];
  const canales = [
    { href: `tel:+${negocio.whatsapp}`, Icono: PhoneIcon, titulo: "Teléfono", detalle: negocio.telefonoVisible, externo: false },
    { href: negocio.instagram, Icono: IconoInstagram, titulo: "Instagram", detalle: "@casa_esusy", externo: true },
    { href: negocio.facebook, Icono: IconoFacebook, titulo: "Facebook", detalle: "/Casaesusy", externo: true },
    ...(negocio.email ? [{ href: `mailto:${negocio.email}`, Icono: MailIcon, titulo: "Email", detalle: negocio.email, externo: false }] : []),
  ];

  return (
    <>
      <section className="pt-28 pb-8 sm:pt-32 lg:pt-36">
        <div className="contenedor grid gap-10 lg:grid-cols-[1fr_1.1fr] lg:gap-16">
          <SchemaMigas items={[{ nombre: "Contacto", ruta: "/contacto" }]} />
          <Aparecer inmediato className="flex flex-col gap-6">
            <Migas items={[{ nombre: "Contacto", ruta: "/contacto" }]} />
            <h1 className="text-[2.4rem] leading-[1.04] font-semibold tracking-[-0.03em] sm:text-5xl lg:text-6xl">Escribinos por WhatsApp</h1>
            <p className="max-w-xl text-lg leading-relaxed text-muted-foreground">
              Completá tu nombre y el tema, y te abrimos el chat con el mensaje listo para enviar. Respondemos en el día, de lunes a sábado.
            </p>
            <div className="flex flex-col gap-3 rounded-[1.5rem] border bg-card p-5">
              <EstadoAbierto horarios={negocio.horarios} className="self-start" />
              <p className="flex items-start gap-3 text-[0.95rem]">
                <MapPinnedIcon className="mt-0.5 size-5 shrink-0 text-terracota" />
                <span>
                  <span className="font-semibold">{negocio.cobertura}</span>{" "}
                  <span className="text-muted-foreground">Vamos a medir y a colocar sin límite de distancia.</span>
                </span>
              </p>
              <p className="flex items-start gap-3 text-[0.95rem] text-muted-foreground">
                <ClockIcon className="mt-0.5 size-5 shrink-0 text-terracota" />
                {negocio.horarios.map((h) => `${h.dias} de ${rangoHorario(h)}`).join(" · ")}
              </p>
            </div>
            <Escalonado className="grid grid-cols-2 gap-3">
              {canales.map(({ href, Icono, titulo, detalle, externo }) => (
                <AparecerItem key={titulo}>
                  <a
                    href={href}
                    {...(externo ? { target: "_blank", rel: "noopener" } : {})}
                    className="flex h-full items-center gap-3 rounded-2xl border bg-card p-4 transition-colors hover:border-foreground/25"
                  >
                    <span className="grid size-10 shrink-0 place-items-center rounded-xl bg-secondary text-pizarra">
                      <Icono className="size-5" />
                    </span>
                    <span className="flex min-w-0 flex-col">
                      <span className="text-xs text-muted-foreground">{titulo}</span>
                      <span className="truncate text-sm font-semibold">{detalle}</span>
                    </span>
                  </a>
                </AparecerItem>
              ))}
            </Escalonado>
          </Aparecer>

          <Aparecer inmediato retraso={0.1} className="rounded-[2rem] border bg-card p-6 shadow-[0_30px_60px_-40px_rgb(42_47_53/0.35)] sm:p-9">
            <FormularioContacto temas={temas} />
          </Aparecer>
        </div>
      </section>

      <section className="contenedor">
        <Aparecer>
          <Link href="/presupuesto" className="group flex flex-col justify-between gap-4 rounded-[1.5rem] bg-lino p-6 sm:flex-row sm:items-center sm:p-8">
            <span className="flex flex-col gap-1">
              <span className="text-xl font-semibold">¿Ya sabés lo que necesitás?</span>
              <span className="text-muted-foreground">Pedí tu presupuesto en tres pasos y coordinamos la visita para medir.</span>
            </span>
            <span className="inline-flex items-center gap-2 font-semibold">
              Pedir presupuesto <ArrowRightIcon className="size-5 transition-transform group-hover:translate-x-1" />
            </span>
          </Link>
        </Aparecer>
      </section>
      <Visitanos negocio={negocio} />
    </>
  );
}
