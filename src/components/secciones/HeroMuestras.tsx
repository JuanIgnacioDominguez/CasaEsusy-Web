"use client";

import { m } from "motion/react";
import { Muestra, type Textura } from "@/components/ui/Muestra";

const muestras: { textura: Textura; nombre: string; rot: number }[] = [
  { textura: "lino", nombre: "Lino natural", rot: -7 },
  { textura: "terciopelo", nombre: "Velvet rosa antiguo", rot: -2 },
  { textura: "vichy", nombre: "Vichy azul", rot: 4 },
  { textura: "gasa", nombre: "Gasa off white", rot: 9 },
];

/**
 * El único momento animado sin interacción del sitio: las muestras de tela
 * se abren como un muestrario sobre el año de fundación.
 */
export function HeroMuestras() {
  return (
    <div className="relative mx-auto aspect-[5/4] w-full max-w-[560px]">
      <m.p
        aria-hidden="true"
        className="display pointer-events-none absolute inset-x-0 top-[2%] text-center text-[clamp(6.5rem,24vw,13rem)] leading-none text-arena-2"
        initial={{ opacity: 0, y: 12 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.9, ease: [0.22, 1, 0.36, 1] }}
      >
        1967
      </m.p>
      <div className="absolute inset-x-0 bottom-0 flex h-[72%] items-end justify-center px-5 sm:px-6">
        {muestras.map((mu, i) => (
          <m.div
            key={mu.nombre}
            className="relative -mx-3 w-[30%] origin-bottom sm:-mx-4"
            style={{ zIndex: i }}
            initial={{ opacity: 0, y: 60, rotate: 0 }}
            animate={{ opacity: 1, y: 0, rotate: mu.rot }}
            transition={{ type: "spring", stiffness: 140, damping: 18, delay: 0.25 + i * 0.12 }}
          >
            <div className="overflow-hidden rounded-[10px] bg-surface p-1.5 shadow-[0_14px_30px_rgb(46_38_34/0.16)]">
              <Muestra textura={mu.textura} className="aspect-[3/4] rounded-[6px]" />
              <p className="px-1 pt-2 pb-1 text-[0.6875rem] leading-tight text-hilo-2">
                {mu.nombre}
              </p>
            </div>
          </m.div>
        ))}
      </div>
    </div>
  );
}
