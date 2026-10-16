"use client";

import { useRef } from "react";
import Image from "next/image";
import Link from "next/link";
import { useInView, useScroll, useSpring, useTransform } from "motion/react";
import * as m from "motion/react-m";
import { ArrowRightIcon, LaptopIcon, MessageCircleIcon, RulerIcon, WrenchIcon } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Aparecer } from "@/components/motion/Aparecer";
import { IconoWhatsApp } from "@/components/iconos";
import { cn } from "@/lib/utils";
import { Encabezado } from "./Encabezado";

const PASOS = [
  {
    titulo: "Nos contás tu idea",
    texto: "Por WhatsApp, por teléfono o en el local. Con un par de fotos del ambiente ya podemos orientarte.",
    Icono: MessageCircleIcon,
    detalle: "WhatsApp, teléfono o en el local",
    imagen: "/img/ambientes/alfombra-living.jpg",
    alt: "Living con sillón, alfombra y plantas, como el que nos mandás en fotos",
  },
  {
    titulo: "Medimos en tu casa",
    texto: "Vamos con muestras a tu casa, en Capital, zona sur o donde estés, para que elijas con la luz real.",
    Icono: RulerIcon,
    detalle: "Sin cargo",
    imagen: "/img/ambientes/muestrario-telas.jpg",
    alt: "Muestrario de telas que llevamos a cada visita",
  },
  {
    titulo: "Presupuesto claro",
    texto: "Te mandamos el detalle por ambiente, con plazos y condiciones, sin letra chica.",
    Icono: LaptopIcon,
    detalle: "Lo aceptás online con un clic",
    imagen: "/img/ambientes/paleta-diseno.jpg",
    alt: "Paleta de colores y materiales elegidos para el presupuesto",
  },
  {
    titulo: "Confección y colocación",
    texto: "Confeccionamos a medida y nuestro colocador lo instala prolijo, sin que tengas que ocuparte de nada.",
    Icono: WrenchIcon,
    detalle: "Con colocador propio",
    imagen: "/img/instagram/gasas-ventanal.jpg",
    alt: "Gasas colocadas por Casa Esusy en un ventanal",
  },
];

const EASE = [0.215, 0.61, 0.355, 1] as const;
const ENTRADA = {
  oculto: { opacity: 0, y: 16 },
  visible: { opacity: 1, y: 0, transition: { duration: 0.7, ease: EASE } },
};

/**
 * Un paso. En escritorio va en zigzag: texto de un lado, foto del otro y el número sobre la línea
 * del centro (los pares invierten los lados). En celular: número a la izquierda y la foto abajo.
 * Al llegar a la pantalla el número se enciende con un pulso, el texto entra escalonado y la foto
 * se desliza desde su costado; mientras se recorre, la foto se mueve apenas (parallax).
 */
function Paso({ paso, i }: { paso: (typeof PASOS)[number]; i: number }) {
  const ref = useRef<HTMLLIElement>(null);
  const encendido = useInView(ref, { once: true, margin: "0px 0px -25% 0px" });
  const { scrollYProgress } = useScroll({ target: ref, offset: ["start end", "end start"] });
  const parallax = useTransform(scrollYProgress, [0, 1], [-28, 28]);
  const invertido = i % 2 === 1;
  const { Icono } = paso;

  return (
    <li
      ref={ref}
      className="relative grid grid-cols-[3rem_1fr] gap-5 sm:grid-cols-[3.5rem_1fr] sm:gap-7 lg:grid-cols-[minmax(0,1fr)_4.5rem_minmax(0,1fr)] lg:items-center lg:gap-12 xl:gap-16"
    >
      {/* Número sobre la línea */}
      <span
        className={cn(
          "relative z-10 grid size-12 place-items-center rounded-full border text-base font-semibold tabular-nums ring-8 ring-[var(--fondo-proceso)] transition-[background-color,border-color,color,box-shadow] duration-500 sm:size-14 sm:text-lg lg:col-start-2 lg:row-start-1 lg:size-[4.5rem] lg:text-xl",
          encendido
            ? "border-acento bg-acento text-white shadow-[0_12px_28px_-12px_var(--acento)]"
            : "border-border bg-card text-muted-foreground",
        )}
      >
        {encendido && (
          <m.span
            aria-hidden
            className="absolute inset-0 rounded-full border-2 border-acento"
            initial={{ opacity: 0.7, scale: 1 }}
            animate={{ opacity: 0, scale: 1.7 }}
            transition={{ duration: 1.3, ease: "easeOut" }}
          />
        )}
        {String(i + 1).padStart(2, "0")}
      </span>

      {/* Texto */}
      <m.div
        initial="oculto"
        animate={encendido ? "visible" : "oculto"}
        variants={{ oculto: {}, visible: { transition: { staggerChildren: 0.08 } } }}
        className={cn(
          "flex flex-col gap-2 pt-2 sm:pt-3 lg:row-start-1 lg:gap-3 lg:pt-0",
          invertido ? "lg:col-start-3" : "lg:col-start-1 lg:items-end lg:text-right",
        )}
      >
        <m.span variants={ENTRADA} className="rotulo hidden text-acento lg:inline-flex">
          Paso {i + 1}
        </m.span>
        <m.h3 variants={ENTRADA} className="text-xl leading-tight font-semibold sm:text-2xl lg:text-[2.1rem] lg:tracking-[-0.03em]">
          {paso.titulo}
        </m.h3>
        <m.p variants={ENTRADA} className="max-w-md text-[1.0625rem] leading-relaxed text-muted-foreground lg:max-w-[26rem] lg:text-lg">
          {paso.texto}
        </m.p>
        {/* Celular y tablet: el detalle va bajo el texto y la foto debajo */}
        <m.span variants={ENTRADA} className="mt-2 inline-flex items-center gap-2.5 text-sm font-semibold text-foreground lg:hidden">
          <span className="grid size-8 place-items-center rounded-full bg-acento-suave text-acento">
            <Icono className="size-4" aria-hidden />
          </span>
          {paso.detalle}
        </m.span>
        <m.div variants={ENTRADA} className="relative mt-4 aspect-[16/10] overflow-hidden rounded-2xl bg-muted lg:hidden">
          <Image src={paso.imagen} alt={paso.alt} fill sizes="(min-width: 640px) 80vw, 90vw" className="object-cover" />
        </m.div>
      </m.div>

      {/* Escritorio: la foto del otro lado, con un marco desplazado detrás y el detalle encima */}
      <m.div
        initial={{ opacity: 0, x: invertido ? -48 : 48 }}
        animate={encendido ? { opacity: 1, x: 0 } : undefined}
        transition={{ duration: 0.9, ease: EASE, delay: 0.1 }}
        className={cn("group/foto relative hidden lg:row-start-1 lg:block", invertido ? "lg:col-start-1" : "lg:col-start-3")}
      >
        <span
          aria-hidden
          className={cn(
            "absolute inset-0 rounded-[2rem] border border-acento/30 bg-acento-suave/40 transition-[translate] duration-700 ease-[var(--ease-suave)]",
            invertido
              ? "-translate-x-4 translate-y-4 group-hover/foto:-translate-x-5 group-hover/foto:translate-y-5"
              : "translate-x-4 translate-y-4 group-hover/foto:translate-x-5 group-hover/foto:translate-y-5",
          )}
        />
        <div className="relative aspect-[4/3] overflow-hidden rounded-[2rem] bg-muted shadow-[0_30px_60px_-36px_rgb(20_24_28/0.55)] ring-1 ring-black/5">
          <m.div style={{ y: parallax }} className="absolute inset-x-0 -inset-y-8">
            <Image
              src={paso.imagen}
              alt={paso.alt}
              fill
              sizes="(min-width: 1280px) 480px, 40vw"
              className="object-cover transition-transform duration-[1.2s] ease-[var(--ease-suave)] group-hover/foto:scale-[1.04]"
            />
          </m.div>
          <div aria-hidden className="absolute inset-x-0 bottom-0 h-1/3 bg-gradient-to-t from-black/30 to-transparent" />
          <span
            className={cn(
              "absolute bottom-4 inline-flex items-center gap-2.5 rounded-full bg-background/92 py-1.5 pr-4 pl-1.5 text-sm font-semibold shadow-lg backdrop-blur",
              invertido ? "right-4" : "left-4",
            )}
          >
            <span className="grid size-8 place-items-center rounded-full bg-acento text-white">
              <Icono className="size-4" aria-hidden />
            </span>
            {paso.detalle}
          </span>
        </div>
      </m.div>
    </li>
  );
}

/** Cómo trabajamos: cuatro pasos en una línea que se va llenando al bajar, cada uno con su foto. */
export function Proceso({ whatsappHref }: { whatsappHref: string }) {
  const listaRef = useRef<HTMLOListElement>(null);
  const { scrollYProgress } = useScroll({ target: listaRef, offset: ["start 70%", "end 55%"] });
  const progreso = useSpring(scrollYProgress, { stiffness: 140, damping: 30, restDelta: 0.001 });
  const linea =
    "absolute top-6 bottom-6 left-6 w-0.5 -translate-x-1/2 sm:top-7 sm:bottom-7 sm:left-7 lg:top-0 lg:bottom-0 lg:left-1/2 lg:[mask-image:linear-gradient(transparent,black_10%,black_90%,transparent)]";

  return (
    <section
      id="como-trabajamos"
      className="border-y bg-[var(--fondo-proceso)] py-16 [--fondo-proceso:color-mix(in_oklab,var(--lino)_50%,var(--background))] sm:py-20 lg:py-28"
    >
      <div className="contenedor flex flex-col gap-12 lg:gap-20">
        <Encabezado
          alineacion="centro"
          rotulo="Cómo trabajamos"
          titulo="De la primera charla a la colocación"
          bajada="Un proceso simple y sin sorpresas, con una persona que te acompaña de punta a punta."
        />

        <ol ref={listaRef} className="relative flex flex-col gap-14 sm:gap-16 lg:gap-24">
          {/* Línea de base y línea que se llena al bajar */}
          <span aria-hidden className={cn(linea, "bg-foreground/12")} />
          <m.span aria-hidden style={{ scaleY: progreso }} className={cn(linea, "origin-top bg-acento")} />
          {PASOS.map((p, i) => (
            <Paso key={p.titulo} paso={p} i={i} />
          ))}
        </ol>

        {/* Cierre: el primer paso, a un clic */}
        <Aparecer className="mx-auto flex w-full max-w-3xl flex-col items-center gap-4 rounded-[2rem] border bg-card px-6 py-9 text-center shadow-[0_30px_60px_-40px_rgb(20_24_28/0.4)] sm:px-10 sm:py-11">
          <p className="text-2xl leading-tight font-semibold tracking-[-0.02em] text-balance sm:text-3xl">¿Arrancamos por el paso 1?</p>
          <p className="max-w-lg leading-relaxed text-muted-foreground">
            Contanos qué tenés en mente. Te respondemos en el día y coordinamos la visita, sin cargo.
          </p>
          <div className="mt-2 flex w-full flex-col gap-3 sm:w-auto sm:flex-row">
            <Button asChild size="lg" className="group h-12 rounded-lg px-6 text-base has-data-[icon=inline-end]:pr-6">
              <Link href="/presupuesto">
                Pedir presupuesto sin cargo
                <ArrowRightIcon data-icon="inline-end" className="transition-transform group-hover:translate-x-0.5" />
              </Link>
            </Button>
            <Button asChild size="lg" variant="outline" className="h-12 rounded-lg px-6 text-base has-data-[icon=inline-start]:pl-6">
              <a href={whatsappHref} target="_blank" rel="noopener">
                <IconoWhatsApp data-icon="inline-start" className="text-[#1FA855]" /> Escribinos por WhatsApp
              </a>
            </Button>
          </div>
        </Aparecer>
      </div>
    </section>
  );
}
