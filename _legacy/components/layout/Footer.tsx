import Link from "next/link";
import { navCompleta } from "@/content/navegacion";
import { direccionCompleta, negocio, urlWhatsApp, hora } from "@/content/negocio";
import { Logo } from "@/components/ui/Logo";

export function Footer() {
  const anio = new Date().getFullYear();
  return (
    <footer className="mt-24 border-t border-separator bg-arena/60 pb-28 md:pb-16">
      <div className="contenedor grid gap-12 pt-14 md:grid-cols-[1.3fr_2fr]">
        <div className="space-y-5">
          <Logo />
          <address className="space-y-1 text-[0.9375rem] not-italic text-hilo-2">
            <p>{direccionCompleta}</p>
            <p>
              <a className="hover:text-hilo" href={`tel:${negocio.telefono.e164}`}>
                {negocio.telefono.visible}
              </a>
            </p>
            {negocio.horarios.map((h) => (
              <p key={h.dias}>
                {h.dias}, de {hora(h.desde)} a {hora(h.hasta)} h
              </p>
            ))}
          </address>
          <div className="flex flex-wrap gap-x-5 gap-y-2 text-[0.9375rem]">
            <a
              className="text-rosa hover:underline"
              href={urlWhatsApp()}
              target="_blank"
              rel="noopener"
            >
              WhatsApp
            </a>
            <a
              className="text-rosa hover:underline"
              href={negocio.instagram}
              target="_blank"
              rel="noopener"
            >
              Instagram
            </a>
            <a
              className="text-rosa hover:underline"
              href={negocio.facebook}
              target="_blank"
              rel="noopener"
            >
              Facebook
            </a>
            <a
              className="text-rosa hover:underline"
              href={negocio.googleMaps}
              target="_blank"
              rel="noopener"
            >
              Cómo llegar
            </a>
          </div>
        </div>

        <nav aria-label="Pie de página" className="grid grid-cols-2 gap-8 sm:grid-cols-3">
          {navCompleta.map((g) => (
            <div key={g.grupo}>
              <h2 className="mb-3 text-[0.8125rem] text-grafito">{g.grupo}</h2>
              <ul className="space-y-2 text-[0.9375rem]">
                {g.links.map((l) => (
                  <li key={l.href}>
                    <Link className="text-hilo-2 hover:text-hilo" href={l.href}>
                      {l.label}
                    </Link>
                  </li>
                ))}
              </ul>
            </div>
          ))}
        </nav>
      </div>

      <div className="contenedor mt-14">
        <div className="flex flex-col gap-3 border-t border-separator pt-6 text-[0.8125rem] text-grafito sm:flex-row sm:justify-between">
          <p>
            © {anio} {negocio.nombre}. Decoración integral en {negocio.direccion.localidad} desde{" "}
            {negocio.fundacion}.
          </p>
          <p className="flex gap-4">
            <Link href="/legales/privacidad" className="hover:text-hilo">
              Privacidad
            </Link>
            <Link href="/legales/terminos" className="hover:text-hilo">
              Términos
            </Link>
          </p>
        </div>
      </div>
    </footer>
  );
}
