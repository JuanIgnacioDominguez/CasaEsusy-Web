"use client";

import { useState } from "react";
import Image from "next/image";
import Link from "next/link";
import { AnimatePresence, useReducedMotion } from "motion/react";
import * as m from "motion/react-m";
import { ArrowRightIcon } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Estrellas, IconoGoogle, IconoWhatsApp } from "@/components/iconos";
import { cn } from "@/lib/utils";

export interface DiapositivaHero {
  palabra: string;
  etiqueta: string;
  imagen: string;
  href: string;
}

const EASE = [0.22, 1, 0.36, 1] as const;

/**
 * Portada inmersiva: fotos que se suceden con un zoom lento, la palabra grande cambia con cada una
 * y abajo hay indicadores tipo historias (se pausan al pasar el mouse y se pueden tocar).
 */
export function HeroCinematico({
  rotulo,
  frase,
  bajada,
  diapositivas,
  whatsappHref,
  puntaje,
  opiniones,
  resenasHref,
  anios,
}: {
  rotulo: string;
  frase: string;
  bajada: string;
  diapositivas: DiapositivaHero[];
  whatsappHref: string;
  puntaje: number;
  opiniones: number;
  resenasHref: string;
  anios: number;
}) {
  const [indice, setIndice] = useState(0);
  const [pausa, setPausa] = useState(false);
  const reducir = useReducedMotion();
  const actual = diapositivas[indice] ?? diapositivas[0];
  const siguiente = () => setIndice((i) => (i + 1) % diapositivas.length);
  if (!actual) return null;

  return (
    <div
      className="relative isolate h-[86svh] max-h-[56rem] min-h-[36rem] overflow-hidden rounded-[1.75rem] bg-pizarra-profundo text-white sm:rounded-[2.25rem]"
      onMouseEnter={() => setPausa(true)}
      onMouseLeave={() => setPausa(false)}
    >
      {/* Fondos que se suceden con fundido y zoom lento. La primera viene visible desde el servidor (mejor LCP). */}
      <AnimatePresence initial={false}>
        <m.div
          key={indice}
          className="absolute inset-0 -z-20"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          transition={{ duration: 1.2, ease: EASE }}
        >
          <m.div className="absolute inset-0" initial={{ scale: 1.14 }} animate={{ scale: 1.02 }} transition={{ duration: 8, ease: "linear" }}>
            <Image src={actual.imagen} alt="" fill priority={indice === 0} sizes="100vw" className="object-cover" />
          </m.div>
        </m.div>
      </AnimatePresence>
      {/* Precarga la siguiente para que el cambio sea instantáneo */}
      <div className="hidden" aria-hidden>
        <Image src={diapositivas[(indice + 1) % diapositivas.length]!.imagen} alt="" width={16} height={16} sizes="100vw" />
      </div>
      <div aria-hidden className="absolute inset-0 -z-10 bg-gradient-to-t from-black/85 via-black/45 to-black/25" />
      <div aria-hidden className="absolute inset-0 -z-10 bg-gradient-to-r from-black/60 via-black/15 to-transparent" />

      <div className="contenedor flex h-full flex-col justify-end gap-5 pb-24 sm:gap-6 sm:pb-28">
        <m.span
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, ease: EASE }}
          className="rotulo self-start rounded-full border border-white/25 bg-white/10 px-3.5 py-1.5 text-white/90 backdrop-blur-md"
        >
          <span className="size-1.5 rounded-full bg-[#F0B79B]" aria-hidden />
          {rotulo}
        </m.span>

        <h1 className="max-w-5xl text-[clamp(2.75rem,min(10vw,8.5svh),6.25rem)] leading-[0.95] font-semibold tracking-[-0.045em] [text-shadow:0_2px_30px_rgb(0_0_0/0.35)] sm:text-[clamp(3.5rem,min(7.6vw,10.5svh),6.25rem)]">
          <span className="sr-only">{diapositivas.map((d) => d.palabra).join(", ")} </span>
          <span aria-hidden className="relative block h-[1.02em] overflow-hidden">
            <AnimatePresence mode="popLayout" initial={false}>
              <m.span
                key={actual.palabra}
                className="block text-[#F0B79B]"
                initial={{ y: "105%", opacity: 0, filter: "blur(8px)" }}
                animate={{ y: "0%", opacity: 1, filter: "blur(0px)" }}
                exit={{ y: "-105%", opacity: 0, filter: "blur(8px)" }}
                transition={{ duration: 0.75, ease: EASE }}
              >
                {actual.palabra}
              </m.span>
            </AnimatePresence>
          </span>
          <m.span
            className="block text-white"
            initial={{ opacity: 0, y: 16, filter: "blur(10px)" }}
            animate={{ opacity: 1, y: 0, filter: "blur(0px)" }}
            transition={{ duration: 0.8, delay: 0.15, ease: EASE }}
          >
            {frase}
          </m.span>
        </h1>

        <m.p
          initial={{ opacity: 0, y: 14 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.7, delay: 0.3, ease: EASE }}
          className="max-w-xl text-lg leading-relaxed text-white/80 sm:text-xl"
        >
          {bajada}
        </m.p>

        <m.div
          initial={{ opacity: 0, y: 14 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.7, delay: 0.4, ease: EASE }}
          className="flex flex-col gap-3 sm:flex-row"
        >
          <Button asChild size="lg" className="group h-13 rounded-lg px-7 text-base shadow-[0_12px_32px_-12px_rgb(166_90_63/0.8)]">
            <Link href="/presupuesto">
              Pedir presupuesto sin cargo
              <ArrowRightIcon data-icon="inline-end" className="transition-transform group-hover:translate-x-0.5" />
            </Link>
          </Button>
          <Button asChild size="lg" variant="outline" className="h-13 rounded-lg border-white/30 bg-white/10 px-7 text-base text-white backdrop-blur-md hover:bg-white/20 hover:text-white">
            <a href={whatsappHref} target="_blank" rel="noopener">
              <IconoWhatsApp data-icon="inline-start" /> Escribinos
            </a>
          </Button>
        </m.div>
      </div>

      {/* Tarjeta de confianza (escritorio) */}
      <m.a
        href={resenasHref}
        target="_blank"
        rel="noopener"
        initial={{ opacity: 0, x: 20 }}
        animate={{ opacity: 1, x: 0 }}
        transition={{ duration: 0.8, delay: 0.6, ease: EASE }}
        className="absolute right-8 bottom-28 hidden w-72 flex-col gap-4 rounded-2xl border border-white/20 bg-white/10 p-5 backdrop-blur-xl transition-colors hover:bg-white/15 lg:flex"
      >
        <span className="flex items-center gap-3">
          <span className="grid size-10 place-items-center rounded-full bg-white">
            <IconoGoogle className="size-5" />
          </span>
          <span className="flex flex-col">
            <span className="flex items-center gap-2 text-lg font-semibold">
              {puntaje.toLocaleString("es-AR")} <Estrellas puntaje={puntaje} className="text-sm text-white" />
            </span>
            <span className="text-xs text-white/70">{opiniones} opiniones en Google</span>
          </span>
        </span>
        <span className="h-px bg-white/15" />
        <span className="flex items-baseline gap-2">
          <span className="text-3xl font-semibold tracking-tight tabular-nums">{anios}</span>
          <span className="text-sm text-white/75">años de oficio · 3 generaciones</span>
        </span>
      </m.a>

      {/* Indicadores tipo historias */}
      <div className="absolute inset-x-0 bottom-0">
        <div className="contenedor grid gap-2 pb-6 sm:gap-3 sm:pb-8" style={{ gridTemplateColumns: `repeat(${diapositivas.length}, minmax(0, 1fr))` }}>
          {diapositivas.map((d, k) => (
            <button
              key={d.href + k}
              type="button"
              onClick={() => setIndice(k)}
              aria-label={`Ver ${d.etiqueta}`}
              aria-current={k === indice}
              className="group flex flex-col gap-2 py-2 text-left focus-visible:outline-none"
            >
              <span className="relative h-[3px] w-full overflow-hidden rounded-full bg-white/25 group-focus-visible:ring-2 group-focus-visible:ring-white">
                <span
                  key={k === indice ? `activo-${indice}` : "quieto"}
                  onAnimationEnd={k === indice && !reducir ? siguiente : undefined}
                  className={cn(
                    "absolute inset-0 origin-left rounded-full bg-white",
                    k < indice && "scale-x-100",
                    k > indice && "scale-x-0",
                    k === indice && (reducir ? "scale-x-100" : "animate-llenar"),
                    k === indice && pausa && "[animation-play-state:paused]",
                  )}
                />
              </span>
              <span className={cn("hidden truncate text-xs font-medium transition-colors sm:block", k === indice ? "text-white" : "text-white/55 group-hover:text-white/80")}>
                {d.etiqueta}
              </span>
            </button>
          ))}
        </div>
      </div>
    </div>
  );
}
