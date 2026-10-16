"use client";

import Image from "next/image";
import Link from "next/link";
import * as m from "motion/react-m";
import { ArrowRightIcon, ArrowUpRightIcon, ClipboardListIcon, MapPinIcon } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Aparecer, AparecerItem, Escalonado } from "@/components/motion/Aparecer";
import { IconoWhatsApp } from "@/components/iconos";
import { urlWhatsApp } from "@/lib/whatsapp";

const EASE = [0.215, 0.61, 0.355, 1] as const;

/**
 * Cierre de página a todo el ancho: foto de fondo con un zoom lento y velo pizarra,
 * el llamado a la izquierda y, a la derecha, las tres formas de arrancar.
 */
export function LlamadoFinal({
  whatsapp,
  mensaje,
  titulo = "¿Arrancamos con tu proyecto?",
  bajada = "Contanos qué tenés en mente. Medimos sin cargo en Capital, zona sur o donde estés, y te pasamos un presupuesto claro y sin compromiso.",
  imagen = "/img/ambientes/living-claro.jpg",
}: {
  whatsapp: string;
  mensaje: string;
  titulo?: string;
  bajada?: string;
  imagen?: string;
}) {
  const opciones = [
    {
      Icono: IconoWhatsApp,
      titulo: "Escribinos por WhatsApp",
      texto: "Te respondemos en el día",
      href: urlWhatsApp(whatsapp, mensaje),
      externo: true,
    },
    {
      Icono: ClipboardListIcon,
      titulo: "Pedí tu presupuesto online",
      texto: "Tres pasos, menos de un minuto",
      href: "/presupuesto",
      externo: false,
    },
    {
      Icono: MapPinIcon,
      titulo: "Visitá el local",
      texto: "Vení a ver y tocar las telas",
      href: "/contacto",
      externo: false,
    },
  ];

  return (
    <section id="llamado-final" className="no-imprimir relative isolate overflow-hidden bg-pizarra-profundo text-white">
      <m.div
        initial={{ scale: 1.12 }}
        whileInView={{ scale: 1 }}
        viewport={{ once: true }}
        transition={{ duration: 2.2, ease: EASE }}
        className="absolute inset-0 -z-20"
      >
        <Image src={imagen} alt="" fill sizes="100vw" className="object-cover" />
      </m.div>
      <div aria-hidden className="absolute inset-0 -z-10 bg-pizarra-profundo/55 lg:bg-transparent" />
      <div
        aria-hidden
        className="absolute inset-0 -z-10 hidden bg-gradient-to-r from-pizarra-profundo/95 from-15% via-pizarra-profundo/75 via-55% to-pizarra-profundo/40 lg:block"
      />
      <div aria-hidden className="absolute inset-x-0 bottom-0 -z-10 h-1/2 bg-gradient-to-t from-pizarra-profundo/80 to-transparent" />

      <div className="contenedor grid items-center gap-12 py-20 sm:py-24 lg:grid-cols-[minmax(0,1.15fr)_minmax(0,0.85fr)] lg:gap-20 lg:py-32">
        <Aparecer className="flex flex-col gap-6">
          <span className="rotulo text-[#F0B79B]">
            <span className="h-px w-6 bg-current" aria-hidden />
            Medición y presupuesto sin cargo
          </span>
          <h2 className="max-w-[16ch] text-[2.4rem] leading-[1.02] font-semibold tracking-[-0.035em] text-balance sm:text-5xl lg:text-[4rem]">
            {titulo}
          </h2>
          <p className="max-w-xl text-[1.0625rem] leading-relaxed text-white/80 sm:text-lg">{bajada}</p>
          <Button
            asChild
            size="lg"
            className="group mt-2 h-13 self-start rounded-md px-7 text-base shadow-[0_14px_34px_-14px_rgb(0_0_0/0.6)] has-data-[icon=inline-end]:pr-7"
          >
            <Link href="/presupuesto">
              Pedir presupuesto sin cargo
              <ArrowRightIcon data-icon="inline-end" className="transition-transform group-hover:translate-x-0.5" />
            </Link>
          </Button>
        </Aparecer>

        <Escalonado retraso={0.15} className="flex flex-col border-t border-white/15">
          {opciones.map(({ Icono, titulo: t, texto, href, externo }) => {
            const contenido = (
              <>
                <span className="grid size-12 shrink-0 place-items-center rounded-md bg-white/10 text-white ring-1 ring-white/15 transition-colors group-hover:bg-white group-hover:text-pizarra-profundo">
                  <Icono className="size-5" />
                </span>
                <span className="flex min-w-0 flex-1 flex-col">
                  <span className="text-lg leading-tight font-semibold">{t}</span>
                  <span className="text-sm text-white/65">{texto}</span>
                </span>
                <ArrowUpRightIcon className="size-5 shrink-0 text-white/50 transition-all duration-300 group-hover:translate-x-0.5 group-hover:-translate-y-0.5 group-hover:text-white" />
              </>
            );
            const clase = "group flex items-center gap-4 border-b border-white/15 py-5 transition-colors hover:bg-white/[0.04] sm:gap-5 sm:py-6";
            return (
              <AparecerItem key={t}>
                {externo ? (
                  <a href={href} target="_blank" rel="noopener" className={clase}>
                    {contenido}
                  </a>
                ) : (
                  <Link href={href} className={clase}>
                    {contenido}
                  </Link>
                )}
              </AparecerItem>
            );
          })}
        </Escalonado>
      </div>
    </section>
  );
}
