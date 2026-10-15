import { Accessibility, Mail, MapPin, Phone } from "lucide-react";
import { BotonLink } from "@/components/ui/Boton";
import { IconoWhatsApp } from "@/components/ui/IconoWhatsApp";
import { FotoPendiente } from "@/components/ui/FotoPendiente";
import { Encabezado } from "@/components/secciones/Encabezado";
import { EstadoHorario } from "@/components/secciones/EstadoHorario";
import { direccionCompleta, negocio, urlWhatsApp, hora } from "@/content/negocio";
import { metadatos } from "@/lib/seo";

export const metadata = metadatos({
  titulo: "Contacto y horarios",
  descripcion: `Casa Esusy: ${direccionCompleta}. Lunes a viernes de 9 a 13 h y sábados de 10 a 14 h. WhatsApp ${negocio.telefono.visible}.`,
  ruta: "/contacto",
});

export default function Contacto() {
  return (
    <>
      <Encabezado
        nombre="Contacto"
        ruta="/contacto"
        titulo="Visitanos o escribinos"
        bajada="Respondemos por WhatsApp en el horario del local."
      />

      <section className="contenedor mt-12 grid gap-10 md:grid-cols-2">
        <div className="space-y-8">
          <ul className="divide-y divide-separator overflow-hidden rounded-[var(--radius-card)] bg-surface">
            <li>
              <a
                href={urlWhatsApp("Hola Casa Esusy, quiero hacer una consulta.")}
                target="_blank"
                rel="noopener"
                className="flex min-h-16 items-center gap-4 px-5"
              >
                <IconoWhatsApp className="size-6 text-[#1fb855]" />
                <span>
                  <span className="block font-semibold">WhatsApp</span>
                  <span className="text-hilo-2">{negocio.telefono.visible}</span>
                </span>
              </a>
            </li>
            <li>
              <a
                href={`tel:${negocio.telefono.e164}`}
                className="flex min-h-16 items-center gap-4 px-5"
              >
                <Phone className="size-5 text-rosa" aria-hidden="true" />
                <span>
                  <span className="block font-semibold">Llamar</span>
                  <span className="text-hilo-2">{negocio.telefono.visible}</span>
                </span>
              </a>
            </li>
            <li>
              <a
                href={negocio.googleMaps}
                target="_blank"
                rel="noopener"
                className="flex min-h-16 items-center gap-4 px-5"
              >
                <MapPin className="size-5 text-rosa" aria-hidden="true" />
                <span>
                  <span className="block font-semibold">Cómo llegar</span>
                  <span className="text-hilo-2">{direccionCompleta}</span>
                </span>
              </a>
            </li>
            <li className="flex min-h-16 items-center gap-4 px-5 text-hilo-2">
              <Mail className="size-5 text-rosa" aria-hidden="true" />
              <span>{negocio.email}</span>
            </li>
          </ul>

          <div>
            <div className="flex items-center gap-3">
              <h2 className="text-[1.25rem] font-semibold">Horarios</h2>
              <EstadoHorario />
            </div>
            <dl className="mt-4 divide-y divide-separator border-y border-separator">
              {negocio.horarios.map((h) => (
                <div key={h.dias} className="flex justify-between py-3">
                  <dt>{h.dias}</dt>
                  <dd className="text-hilo-2">
                    {hora(h.desde)} a {hora(h.hasta)} h
                  </dd>
                </div>
              ))}
              <div className="flex justify-between py-3">
                <dt>Domingos y feriados</dt>
                <dd className="text-hilo-2">Cerrado</dd>
              </div>
            </dl>
            <p className="mt-4 flex items-center gap-3 text-[0.9375rem] text-hilo-2">
              <Accessibility className="size-5 text-rosa" aria-hidden="true" /> Entrada accesible
              para silla de ruedas
            </p>
          </div>

          <div>
            <h2 className="text-[1.25rem] font-semibold">Zona de atención</h2>
            <p className="mt-2 text-hilo-2">
              Medimos y colocamos en {negocio.zonas.join(", ")} y alrededores.
            </p>
          </div>

          <BotonLink href="/presupuesto">Pedir presupuesto</BotonLink>
        </div>

        <FotoPendiente
          textura="madera"
          descripcion="frente del local (acá va también el mapa de Google)"
          className="aspect-[4/5] md:aspect-auto"
        />
      </section>
    </>
  );
}
