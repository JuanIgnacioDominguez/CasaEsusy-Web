import Link from "next/link";
import { MapPinIcon, PhoneIcon } from "lucide-react";
import { IconoFacebook, IconoInstagram, IconoWhatsApp } from "@/components/iconos";
import { Logo } from "@/components/sitio/Logo";
import type { Negocio } from "@/lib/ajustes/esquemas";
import { rangoHorario } from "@/lib/horario";
import { urlWhatsApp } from "@/lib/whatsapp";

export function Footer({ negocio, servicios }: { negocio: Negocio; servicios: { slug: string; nombre: string }[] }) {
  const anio = new Date().getFullYear();
  return (
    <footer className="bg-pizarra-profundo text-marfil/80">
      <div className="contenedor grid gap-12 py-16 md:grid-cols-2 lg:grid-cols-[1.3fr_1fr_1fr_1.2fr] lg:py-20">
        <div className="flex flex-col gap-5">
          <Logo variante="claro" className="h-12 w-auto self-start" />
          <p className="max-w-xs text-sm leading-relaxed text-marfil/65">{negocio.lema}. {negocio.cobertura}</p>
          <div className="flex gap-2">
            {[
              { href: negocio.instagram, label: "Instagram", Icono: IconoInstagram },
              { href: negocio.facebook, label: "Facebook", Icono: IconoFacebook },
              { href: urlWhatsApp(negocio.whatsapp), label: "WhatsApp", Icono: IconoWhatsApp },
            ].map(({ href, label, Icono }) => (
              <a
                key={label}
                href={href}
                target="_blank"
                rel="noopener"
                aria-label={label}
                className="grid size-11 place-items-center rounded-full border border-marfil/15 text-marfil/80 transition-colors hover:border-marfil/40 hover:bg-marfil/5 hover:text-marfil"
              >
                <Icono className="size-5" />
              </a>
            ))}
          </div>
        </div>

        <nav aria-label="Servicios" className="flex flex-col gap-3">
          <p className="rotulo text-marfil/45">Servicios</p>
          {servicios.map((s) => (
            <Link key={s.slug} href={`/${s.slug}`} className="text-sm transition-colors hover:text-marfil">
              {s.nombre}
            </Link>
          ))}
        </nav>

        <nav aria-label="Casa Esusy" className="flex flex-col gap-3">
          <p className="rotulo text-marfil/45">Casa Esusy</p>
          {[
            ["/proyectos", "Trabajos realizados"],
            ["/catalogos", "Catálogos y marcas"],
            ["/nosotros", "Nuestra historia"],
            ["/presupuesto", "Pedir presupuesto"],
            ["/preguntas-frecuentes", "Preguntas frecuentes"],
            ["/contacto", "Contacto"],
          ].map(([href, texto]) => (
            <Link key={href} href={href!} className="text-sm transition-colors hover:text-marfil">
              {texto}
            </Link>
          ))}
        </nav>

        <div className="flex flex-col gap-4">
          <p className="rotulo text-marfil/45">Visitanos</p>
          <a href={negocio.googleMaps} target="_blank" rel="noopener" className="flex gap-3 text-sm hover:text-marfil">
            <MapPinIcon className="mt-0.5 size-4 shrink-0 text-acento" />
            <span>
              {negocio.calle}
              <br />
              {negocio.localidad}, {negocio.partido}
            </span>
          </a>
          <a href={`tel:+${negocio.whatsapp}`} className="flex gap-3 text-sm hover:text-marfil">
            <PhoneIcon className="mt-0.5 size-4 shrink-0 text-acento" />
            {negocio.telefonoVisible}
          </a>
          <dl className="grid gap-1 text-sm">
            {negocio.horarios.map((h) => (
              <div key={h.dias} className="flex justify-between gap-4 border-b border-marfil/10 py-1.5">
                <dt className="text-marfil/60">{h.dias}</dt>
                <dd className="tabular-nums">{rangoHorario(h)}</dd>
              </div>
            ))}
          </dl>
        </div>
      </div>
      <div className="border-t border-marfil/10">
        <div className="contenedor flex flex-col gap-3 py-6 text-xs text-marfil/50 sm:flex-row sm:items-center sm:justify-between">
          <p>
            © {anio} {negocio.nombre} · Desde {negocio.fundacion}
          </p>
          <div className="flex gap-5">
            <Link href="/legales/privacidad" className="hover:text-marfil">
              Privacidad
            </Link>
            <Link href="/legales/terminos" className="hover:text-marfil">
              Términos
            </Link>
          </div>
        </div>
      </div>
    </footer>
  );
}
