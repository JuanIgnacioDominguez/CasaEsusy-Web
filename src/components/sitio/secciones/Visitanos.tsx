import Image from "next/image";
import { AccessibilityIcon, MapPinIcon, NavigationIcon, PhoneIcon } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Aparecer } from "@/components/motion/Aparecer";
import { EstadoAbierto } from "@/components/sitio/EstadoAbierto";
import type { Negocio } from "@/lib/ajustes/esquemas";
import { rangoHorario } from "@/lib/horario";
import { Encabezado } from "./Encabezado";

/**
 * Visitanos: mapa y datos del local en un mismo bloque. Del lado de los datos va la foto real
 * del frente, la dirección, si está abierto ahora, los horarios y cómo llegar o llamar.
 */
export function Visitanos({ negocio }: { negocio: Negocio }) {
  const mapa = `https://www.google.com/maps?q=${negocio.lat},${negocio.lng}&z=16&hl=es&output=embed`;
  return (
    <section id="visitanos" className="py-16 sm:py-20 lg:py-28">
      <div className="contenedor flex flex-col gap-10 lg:gap-12">
        <Encabezado
          rotulo="Visitanos"
          titulo="Vení a ver y tocar las telas"
          bajada={`Nuestro local está en ${negocio.calle}, ${negocio.localidad}. ${negocio.cobertura}`}
        />

        <Aparecer className="grid overflow-hidden rounded-md border bg-card shadow-[0_30px_60px_-44px_rgb(20_24_28/0.4)] lg:grid-cols-[minmax(0,1.35fr)_minmax(0,1fr)]">
          {/* Mapa */}
          <div className="relative min-h-[20rem] bg-muted sm:min-h-[24rem] lg:min-h-[34rem]">
            {/* Queda debajo del mapa: se ve solo si el mapa no carga (bloqueadores, sin conexión). */}
            <a
              href={negocio.googleMaps}
              target="_blank"
              rel="noopener"
              className="absolute inset-0 flex flex-col items-center justify-center gap-3 text-center text-muted-foreground"
            >
              <span className="grid size-12 place-items-center rounded-full bg-card text-acento shadow-sm">
                <MapPinIcon className="size-6" />
              </span>
              <span className="text-sm font-medium">Ver el local en Google Maps</span>
            </a>
            <iframe
              title={`Mapa: ${negocio.nombre}, ${negocio.calle}, ${negocio.localidad}`}
              src={mapa}
              loading="lazy"
              referrerPolicy="no-referrer-when-downgrade"
              className="absolute inset-0 size-full border-0 grayscale-[30%]"
            />
          </div>

          {/* Datos del local */}
          <div className="flex flex-col gap-7 border-t p-6 sm:p-8 lg:border-t-0 lg:border-l lg:p-10">
            <div className="flex items-start gap-4">
              <div className="relative size-20 shrink-0 overflow-hidden rounded-md bg-muted ring-1 ring-black/5 sm:size-24">
                <Image src="/img/instagram/frente-local.jpg" alt="Frente del local de Casa Esusy en Banfield" fill sizes="96px" className="object-cover object-[center_40%]" />
              </div>
              <address className="flex min-w-0 flex-col gap-1 not-italic">
                <span className="text-xl leading-tight font-semibold sm:text-2xl">{negocio.calle}</span>
                <span className="text-muted-foreground">
                  {negocio.localidad}, {negocio.partido} ({negocio.codigoPostal})
                </span>
              </address>
            </div>
            <EstadoAbierto horarios={negocio.horarios} className="-mt-2 self-start" />

            <div className="flex flex-col">
              <p className="rotulo mb-1 text-[0.7rem] text-muted-foreground">Horarios</p>
              <dl className="flex flex-col">
                {negocio.horarios.map((h) => (
                  <div key={h.dias} className="flex items-center justify-between border-b py-3">
                    <dt className="text-muted-foreground">{h.dias}</dt>
                    <dd className="font-semibold tabular-nums">{rangoHorario(h)}</dd>
                  </div>
                ))}
                <div className="flex items-center justify-between py-3">
                  <dt className="text-muted-foreground">Domingos</dt>
                  <dd className="text-muted-foreground">Cerrado</dd>
                </div>
              </dl>
            </div>

            <p className="flex items-center gap-2 text-sm text-muted-foreground">
              <AccessibilityIcon className="size-4" /> Local accesible en silla de ruedas
            </p>

            <div className="mt-auto grid grid-cols-2 gap-2">
              <Button asChild size="lg" className="h-12 rounded-md px-4 has-data-[icon=inline-start]:pl-4">
                <a href={negocio.googleMaps} target="_blank" rel="noopener">
                  <NavigationIcon data-icon="inline-start" /> Cómo llegar
                </a>
              </Button>
              <Button asChild size="lg" variant="outline" className="h-12 rounded-md bg-background px-4 has-data-[icon=inline-start]:pl-4">
                <a href={`tel:+${negocio.whatsapp}`}>
                  <PhoneIcon data-icon="inline-start" /> Llamar
                </a>
              </Button>
            </div>
          </div>
        </Aparecer>
      </div>
    </section>
  );
}
