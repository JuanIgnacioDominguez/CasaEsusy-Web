import { AccessibilityIcon, MapPinIcon, NavigationIcon, PhoneIcon } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Aparecer } from "@/components/motion/Aparecer";
import { EstadoAbierto } from "@/components/sitio/EstadoAbierto";
import type { Negocio } from "@/lib/ajustes/esquemas";
import { rangoHorario } from "@/lib/horario";
import { Encabezado } from "./Encabezado";

export function Visitanos({ negocio }: { negocio: Negocio }) {
  const mapa = `https://www.google.com/maps?q=${negocio.lat},${negocio.lng}&z=16&hl=es&output=embed`;
  return (
    <section id="visitanos" className="py-20 lg:py-28">
      <div className="contenedor flex flex-col gap-12">
        <Encabezado
          rotulo="Visitanos"
          titulo="Vení a ver y tocar las telas"
          bajada={`Estamos en ${negocio.calle}, ${negocio.localidad}. Medimos y colocamos en toda la zona sur.`}
        />
        <div className="grid gap-4 lg:grid-cols-[1fr_24rem]">
          <Aparecer className="relative min-h-[22rem] overflow-hidden rounded-[1.75rem] border bg-muted">
            <iframe
              title={`Mapa: ${negocio.nombre}, ${negocio.calle}, ${negocio.localidad}`}
              src={mapa}
              loading="lazy"
              referrerPolicy="no-referrer-when-downgrade"
              className="absolute inset-0 size-full border-0 grayscale-[35%]"
            />
          </Aparecer>
          <Aparecer retraso={0.1} className="flex flex-col gap-6 rounded-[1.75rem] border bg-card p-7">
            <EstadoAbierto horarios={negocio.horarios} className="self-start" />
            <div className="flex gap-3">
              <MapPinIcon className="mt-1 size-5 shrink-0 text-terracota" />
              <address className="not-italic">
                <span className="block text-lg font-semibold">{negocio.calle}</span>
                <span className="text-muted-foreground">
                  {negocio.localidad}, {negocio.partido} ({negocio.codigoPostal})
                </span>
              </address>
            </div>
            <dl className="flex flex-col">
              {negocio.horarios.map((h) => (
                <div key={h.dias} className="flex items-center justify-between border-b py-3 last:border-0">
                  <dt className="text-muted-foreground">{h.dias}</dt>
                  <dd className="font-semibold tabular-nums">{rangoHorario(h)}</dd>
                </div>
              ))}
              <div className="flex items-center justify-between py-3">
                <dt className="text-muted-foreground">Domingos</dt>
                <dd className="text-muted-foreground">Cerrado</dd>
              </div>
            </dl>
            <p className="flex items-center gap-2 text-sm text-muted-foreground">
              <AccessibilityIcon className="size-4" /> Local accesible en silla de ruedas
            </p>
            <div className="mt-auto grid grid-cols-2 gap-2">
              <Button asChild size="lg" className="h-12 rounded-full">
                <a href={negocio.googleMaps} target="_blank" rel="noopener">
                  <NavigationIcon data-icon="inline-start" /> Cómo llegar
                </a>
              </Button>
              <Button asChild size="lg" variant="outline" className="h-12 rounded-full">
                <a href={`tel:+${negocio.whatsapp}`}>
                  <PhoneIcon data-icon="inline-start" /> Llamar
                </a>
              </Button>
            </div>
          </Aparecer>
        </div>
      </div>
    </section>
  );
}
