"use client";

import { Fragment, useEffect, useState } from "react";
import Image from "next/image";
import Link from "next/link";
import { AnimatePresence, useReducedMotion } from "motion/react";
import * as m from "motion/react-m";
import { ArrowRightIcon, StarIcon } from "lucide-react";
import { Button } from "@/components/ui/button";
import { IconoWhatsApp } from "@/components/iconos";
import { Contador } from "@/components/motion/Contador";
import { cn } from "@/lib/utils";

const EASE = [0.22, 1, 0.36, 1] as const;
const INTERVALO_MS = 7000;

/** "Cortinas y tapizados *a medida*" → la parte entre asteriscos va resaltada. */
function Resaltado({ texto }: { texto: string }) {
  return texto.split("*").map((parte, i) =>
    i % 2 === 1 ? (
      <span key={i} className="text-[#F0B79B]">
        {parte}
      </span>
    ) : (
      <Fragment key={i}>{parte}</Fragment>
    ),
  );
}

interface Cifra {
  valor: React.ReactNode;
  etiqueta: string;
  href?: string;
}

/**
 * Portada a todo el ancho: el mensaje queda fijo (qué hacemos, dónde y cómo pedir presupuesto),
 * atrás se suceden fotos de ambientes con un fundido lento y al pie van las cifras que dan confianza,
 * que cuentan solas al cargar.
 */
export function HeroCinematico({
  rotulo,
  titulo,
  bajada,
  imagenes,
  whatsappHref,
  puntaje,
  opiniones,
  resenasHref,
  anios,
}: {
  rotulo: string;
  titulo: string;
  bajada: string;
  imagenes: string[];
  whatsappHref: string;
  puntaje: number;
  opiniones: number;
  resenasHref: string;
  anios: number;
}) {
  const [indice, setIndice] = useState(0);
  const reducir = useReducedMotion();
  const total = imagenes.length;

  useEffect(() => {
    if (reducir || total < 2) return;
    const t = setTimeout(() => setIndice((i) => (i + 1) % total), INTERVALO_MS);
    return () => clearTimeout(t);
  }, [indice, reducir, total]);

  const actual = imagenes[indice] ?? imagenes[0];
  if (!actual) return null;
  const siguiente = imagenes[(indice + 1) % total];

  const cifras: Cifra[] = [
    { valor: <Contador valor={anios} />, etiqueta: "años de oficio" },
    {
      valor: (
        <span className="inline-flex items-center gap-2">
          <Contador valor={puntaje} decimales={1} />
          <StarIcon className="size-[0.6em] fill-[#E3A33B] text-[#E3A33B]" aria-hidden />
        </span>
      ),
      etiqueta: `${opiniones} opiniones en Google`,
      href: resenasHref,
    },
    { valor: <Contador valor={3} />, etiqueta: "generaciones de la familia" },
    { valor: "Sin cargo", etiqueta: "medición y presupuesto" },
  ];

  return (
    <div className="relative isolate flex min-h-[100svh] flex-col overflow-hidden bg-pizarra-profundo text-white lg:min-h-[min(100svh,60rem)]">
      {/* Fondos con fundido y zoom lento. La primera viene renderizada desde el servidor (mejor LCP). */}
      <AnimatePresence initial={false}>
        <m.div
          key={indice}
          className="absolute inset-0 -z-20"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          transition={{ duration: 1.6, ease: EASE }}
        >
          <m.div
            className="absolute inset-0"
            initial={reducir ? false : { scale: 1.06 }}
            animate={{ scale: 1 }}
            transition={{ duration: INTERVALO_MS / 1000 + 1.6, ease: "linear" }}
          >
            <Image src={actual} alt="" fill preload={indice === 0} sizes="100vw" quality={85} className="object-cover" />
          </m.div>
        </m.div>
      </AnimatePresence>
      {siguiente && siguiente !== actual && (
        <div className="hidden" aria-hidden>
          <Image src={siguiente} alt="" width={16} height={16} sizes="100vw" quality={85} />
        </div>
      )}
      {/* Velos en el tono pizarra de la marca: las fotos son claras y el texto blanco necesita apoyo. */}
      <div aria-hidden className="absolute inset-0 -z-10 bg-pizarra-profundo/15 lg:bg-transparent" />
      <div
        aria-hidden
        className="absolute inset-0 -z-10 hidden bg-gradient-to-r from-pizarra-profundo/85 from-10% via-pizarra-profundo/45 via-45% to-transparent to-75% lg:block"
      />
      <div aria-hidden className="absolute inset-x-0 top-0 -z-10 h-40 bg-gradient-to-b from-pizarra-profundo/60 to-transparent" />
      <div
        aria-hidden
        className="absolute inset-x-0 bottom-0 -z-10 h-3/4 bg-gradient-to-t from-pizarra-profundo/95 via-pizarra-profundo/60 to-transparent lg:h-1/2 lg:from-pizarra-profundo/85 lg:via-pizarra-profundo/35"
      />

      <div className="contenedor flex flex-1 flex-col justify-end gap-6 pt-28 pb-10 lg:justify-center lg:pt-32 lg:pb-14">
        <m.p
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, ease: EASE }}
          className="text-[0.95rem] font-medium text-white/80 sm:text-base"
        >
          {rotulo}
        </m.p>

        <m.h1
          initial={{ opacity: 0, y: 18 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, delay: 0.1, ease: EASE }}
          className="-mt-2 max-w-[15ch] text-[clamp(2.4rem,9vw,5.4rem)] leading-[1.02] font-semibold tracking-[-0.04em] [text-shadow:0_2px_30px_rgb(0_0_0/0.25)]"
        >
          <Resaltado texto={titulo} />
        </m.h1>

        <m.p
          initial={{ opacity: 0, y: 14 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.7, delay: 0.25, ease: EASE }}
          className="max-w-xl text-[1.0625rem] leading-relaxed text-white/90 sm:text-xl"
        >
          {bajada}
        </m.p>

        <m.div
          initial={{ opacity: 0, y: 14 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.7, delay: 0.35, ease: EASE }}
          className="flex flex-col gap-3 pt-1 sm:flex-row"
        >
          <Button asChild size="lg" className="group h-13 rounded-lg px-7 text-base shadow-[0_12px_32px_-12px_rgb(0_0_0/0.6)] has-data-[icon=inline-end]:pr-7">
            <Link href="/presupuesto">
              Pedir presupuesto sin cargo
              <ArrowRightIcon data-icon="inline-end" className="transition-transform group-hover:translate-x-0.5" />
            </Link>
          </Button>
          <Button
            asChild
            size="lg"
            variant="outline"
            className="h-13 rounded-lg border-white/35 bg-white/10 px-7 text-base text-white backdrop-blur-md hover:bg-white/20 hover:text-white has-data-[icon=inline-start]:pl-7"
          >
            <a href={whatsappHref} target="_blank" rel="noopener">
              <IconoWhatsApp data-icon="inline-start" /> Escribinos por WhatsApp
            </a>
          </Button>
        </m.div>
      </div>

      {/* Cifras al pie: una línea fina las separa del mensaje; entran escalonadas y los números cuentan. */}
      <div className="contenedor pb-6 sm:pb-8">
        <m.ul
          initial="oculto"
          animate="visible"
          variants={{ oculto: {}, visible: { transition: { staggerChildren: 0.1, delayChildren: 0.55 } } }}
          className="grid grid-cols-2 border-t border-white/20 lg:grid-cols-4"
        >
          {cifras.map((c, i) => {
            const contenido = (
              <>
                <span className="text-[1.75rem] leading-none font-semibold tracking-tight sm:text-4xl">{c.valor}</span>
                <span className="text-sm leading-snug text-white/75">{c.etiqueta}</span>
              </>
            );
            return (
              <m.li
                key={c.etiqueta}
                variants={{ oculto: { opacity: 0, y: 16 }, visible: { opacity: 1, y: 0, transition: { duration: 0.7, ease: EASE } } }}
                className={cn(
                  "relative py-5 sm:py-7",
                  i % 2 === 1 ? "pl-5 sm:pl-8" : "pr-5",
                  i % 2 === 1 && "border-l border-white/15",
                  i >= 2 && "border-t border-white/15 lg:border-t-0",
                  i === 2 && "lg:border-l lg:pl-8",
                  i === 1 && "lg:pr-5",
                )}
              >
                {c.href ? (
                  <a href={c.href} target="_blank" rel="noopener" className="flex flex-col gap-2 rounded-md transition-opacity hover:opacity-85">
                    {contenido}
                  </a>
                ) : (
                  <div className="flex flex-col gap-2">{contenido}</div>
                )}
              </m.li>
            );
          })}
        </m.ul>
      </div>
    </div>
  );
}
