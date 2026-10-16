"use client";

import Image from "next/image";
import Link from "next/link";
import * as m from "motion/react-m";
import { ArrowRightIcon, AwardIcon } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Aparecer, AparecerItem, Escalonado } from "@/components/motion/Aparecer";
import { IconoWhatsApp } from "@/components/iconos";
import type { Negocio } from "@/lib/ajustes/esquemas";
import type { Servicio } from "@/lib/db/schema";
import { urlWhatsApp } from "@/lib/whatsapp";

const EASE = [0.215, 0.61, 0.355, 1] as const;

/**
 * Diseño de interiores como servicio que se contrata. Sección dividida a todo el ancho:
 * la foto ocupa una mitad de borde a borde (entra con un barrido) y la otra mitad, sobre su
 * propio fondo, cuenta qué es, las modalidades y cómo pedirlo.
 */
export function SeccionDiseno({ servicio, negocio }: { servicio: Servicio | undefined; negocio: Negocio }) {
  const opciones = servicio?.tipos.length
    ? servicio.tipos
    : [
        { nombre: "Asesoría puntual", descripcion: "Una visita para resolver un ambiente, con muestras en mano." },
        { nombre: "Proyecto de ambiente", descripcion: "Paleta, telas, materiales y lista de compras." },
      ];
  const mensaje = servicio?.mensajeWhatsApp || "Hola Casa Esusy, quiero contratar el servicio de diseño de interiores.";

  return (
    <section id="diseno-de-interiores" className="border-y bg-card">
      <div className="grid lg:grid-cols-2">
        {/* Foto a todo el alto, sin bordes redondeados */}
        <m.div
          initial={{ clipPath: "inset(0 100% 0 0)" }}
          whileInView={{ clipPath: "inset(0 0% 0 0)" }}
          viewport={{ once: true, margin: "0px 0px -15% 0px" }}
          transition={{ duration: 1.1, ease: EASE }}
          className="relative min-h-[20rem] overflow-hidden sm:min-h-[28rem] lg:min-h-[46rem]"
        >
          <m.div
            initial={{ scale: 1.12 }}
            whileInView={{ scale: 1 }}
            viewport={{ once: true }}
            transition={{ duration: 1.6, ease: EASE }}
            className="absolute inset-0"
          >
            <Image
              src="/img/ambientes/respaldo-capitone.jpg"
              alt="Dormitorio diseñado con respaldo capitoné y textiles en tonos neutros"
              fill
              sizes="(min-width: 1024px) 50vw, 100vw"
              className="object-cover"
            />
          </m.div>
          <div className="absolute bottom-0 left-0 flex items-center gap-3 bg-background/95 py-3 pr-5 pl-4 backdrop-blur sm:bottom-6 sm:left-6 sm:rounded-md sm:shadow-lg lg:bottom-10 lg:left-[max(2rem,calc((100vw-1240px)/2+2rem))]">
            <span className="grid size-10 shrink-0 place-items-center rounded-md bg-acento-suave text-acento">
              <AwardIcon className="size-5" />
            </span>
            <span className="flex flex-col leading-tight">
              <span className="text-sm font-semibold">{negocio.duenaNombre}</span>
              <span className="text-xs text-muted-foreground">Diseñadora certificada · {negocio.duenaAnio}</span>
            </span>
          </div>
        </m.div>

        {/* Contenido: alineado con el contenedor del sitio del lado derecho */}
        <div className="flex items-center px-5 py-14 sm:px-10 sm:py-20 lg:py-24 lg:pr-[max(2rem,calc((100vw-1240px)/2+2rem))] lg:pl-16 xl:pl-20">
          <div className="flex w-full max-w-xl flex-col gap-8">
            <Aparecer className="flex flex-col gap-4">
              <span className="rotulo text-acento">
                <span className="h-px w-6 bg-current" aria-hidden />
                Diseño de interiores
              </span>
              <h2 className="text-[1.95rem] leading-[1.06] font-semibold text-balance sm:text-[2.6rem] lg:text-[3rem]">
                ¿No sabés cómo combinar todo? Te lo diseñamos
              </h2>
              <p className="text-[1.0625rem] leading-relaxed text-muted-foreground sm:text-lg">
                {negocio.duenaNombre} piensa el ambiente completo con vos: colores, telas, luz y muebles. Vos decidís; nosotros nos ocupamos de que todo
                combine y quede bien colocado.
              </p>
            </Aparecer>

            <Escalonado className="grid border-t sm:grid-cols-2 sm:gap-x-8">
              {opciones.map((o, i) => (
                <AparecerItem key={o.nombre} className="flex flex-col gap-1 border-b py-5">
                  <span className="flex items-baseline gap-3">
                    <span className="text-sm font-semibold text-acento tabular-nums">{String(i + 1).padStart(2, "0")}</span>
                    <span className="font-semibold">{o.nombre}</span>
                  </span>
                  <span className="pl-8 text-sm leading-relaxed text-muted-foreground">{o.descripcion}</span>
                </AparecerItem>
              ))}
            </Escalonado>

            <Aparecer retraso={0.1} className="flex flex-col gap-3 sm:flex-row sm:items-center lg:flex-col lg:items-start xl:flex-row xl:items-center">
              <Button asChild size="lg" className="h-12 rounded-md px-6 text-base has-data-[icon=inline-start]:pl-6">
                <a href={urlWhatsApp(negocio.whatsapp, mensaje)} target="_blank" rel="noopener">
                  <IconoWhatsApp data-icon="inline-start" /> Quiero asesoramiento
                </a>
              </Button>
              <Button asChild size="lg" variant="ghost" className="group h-12 rounded-md px-4 text-base has-data-[icon=inline-end]:pr-4">
                <Link href="/diseno-de-interiores">
                  Cómo trabajamos el diseño
                  <ArrowRightIcon data-icon="inline-end" className="transition-transform group-hover:translate-x-0.5" />
                </Link>
              </Button>
            </Aparecer>
          </div>
        </div>
      </div>
    </section>
  );
}
