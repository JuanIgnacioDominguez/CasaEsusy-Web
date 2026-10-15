"use client";

import { useRef } from "react";
import Image from "next/image";
import * as m from "motion/react-m";
import { useScroll, useTransform } from "motion/react";

/** Composición del hero: foto grande con leve parallax + foto real del Instagram flotando. */
export function HeroImagenes({ principal, secundaria, fundacion }: { principal: string; secundaria: string; fundacion: number }) {
  const ref = useRef<HTMLDivElement>(null);
  const { scrollYProgress } = useScroll({ target: ref, offset: ["start start", "end start"] });
  const y = useTransform(scrollYProgress, [0, 1], [0, 60]);
  const yFlotante = useTransform(scrollYProgress, [0, 1], [0, -40]);
  const anios = new Date().getFullYear() - fundacion;

  return (
    <div ref={ref} className="relative mx-auto w-full max-w-[36rem] lg:mr-0 lg:ml-auto">
      <m.div
        initial={{ opacity: 0, scale: 1.04 }}
        animate={{ opacity: 1, scale: 1 }}
        transition={{ duration: 1.1, ease: [0.22, 1, 0.36, 1] }}
        className="relative aspect-[4/5] overflow-hidden rounded-[2rem] bg-muted shadow-[0_40px_80px_-40px_rgb(42_47_53/0.45)] sm:aspect-[5/6]"
      >
        <m.div style={{ y }} className="absolute inset-[-6%]">
          <Image
            src={principal}
            alt="Living con sillón de lino, almohadones terracota y cortinas de gasa"
            fill
            priority
            sizes="(min-width: 1024px) 560px, 100vw"
            className="object-cover"
          />
        </m.div>
        <div className="absolute inset-x-0 bottom-0 h-1/3 bg-gradient-to-t from-black/25 to-transparent" />
      </m.div>

      {secundaria && (
        <m.figure
          style={{ y: yFlotante }}
          initial={{ opacity: 0, x: -24 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ duration: 0.9, delay: 0.5, ease: [0.22, 1, 0.36, 1] }}
          className="absolute -bottom-8 -left-3 w-[44%] rounded-[1.4rem] border-[6px] border-background bg-background shadow-2xl sm:-left-10"
        >
          <div className="relative aspect-[4/3] overflow-hidden rounded-[1rem]">
            <Image src={secundaria} alt="Cortinas de gasa colocadas por Casa Esusy" fill sizes="240px" className="object-cover" />
          </div>
          <figcaption className="px-2 pt-2 pb-1 text-[0.7rem] leading-tight font-medium text-muted-foreground">
            Trabajo real · @casa_esusy
          </figcaption>
        </m.figure>
      )}

      <m.div
        initial={{ opacity: 0, y: -12 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.8, delay: 0.7, ease: [0.22, 1, 0.36, 1] }}
        className="absolute top-6 -right-2 flex items-center gap-3 rounded-2xl border border-white/40 bg-background/85 py-3 pr-5 pl-3 shadow-xl backdrop-blur-md sm:-right-6"
      >
        <span className="grid size-12 place-items-center rounded-xl bg-pizarra text-lg font-bold text-marfil tabular-nums">
          {anios}
        </span>
        <span className="flex flex-col leading-tight">
          <span className="text-sm font-semibold text-foreground">años de oficio</span>
          <span className="text-xs text-muted-foreground">Desde {fundacion} · 3 generaciones</span>
        </span>
      </m.div>
    </div>
  );
}
