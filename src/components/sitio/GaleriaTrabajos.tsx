"use client";

import { useState } from "react";
import Image from "next/image";
import Link from "next/link";
import { AnimatePresence } from "motion/react";
import * as m from "motion/react-m";
import { ArrowRightIcon, ChevronLeftIcon, ChevronRightIcon } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Dialog, DialogContent, DialogDescription, DialogTitle } from "@/components/ui/dialog";
import { ToggleGroup, ToggleGroupItem } from "@/components/ui/toggle-group";

export interface TrabajoGaleria {
  id: string;
  titulo: string;
  descripcion: string;
  ubicacion: string;
  imagen: string;
  servicio: string;
}

export function GaleriaTrabajos({ trabajos, servicios }: { trabajos: TrabajoGaleria[]; servicios: { slug: string; nombre: string }[] }) {
  const [filtro, setFiltro] = useState("todos");
  const [abierto, setAbierto] = useState<number | null>(null);
  const conTrabajos = servicios.filter((s) => trabajos.some((t) => t.servicio === s.slug));
  const visibles = filtro === "todos" ? trabajos : trabajos.filter((t) => t.servicio === filtro);
  const actual = abierto !== null ? visibles[abierto] : undefined;
  const nombre = (slug: string) => servicios.find((s) => s.slug === slug)?.nombre ?? slug;
  const mover = (d: number) => setAbierto((i) => (i === null ? null : (i + d + visibles.length) % visibles.length));

  return (
    <div className="flex flex-col gap-8">
      <ToggleGroup
        type="single"
        value={filtro}
        onValueChange={(v) => v && setFiltro(v)}
        className="flex flex-wrap justify-start gap-2"
        aria-label="Filtrar por servicio"
      >
        {[{ slug: "todos", nombre: "Todos" }, ...conTrabajos].map((s) => (
          <ToggleGroupItem
            key={s.slug}
            value={s.slug}
            className="h-10 rounded-full border bg-card px-4 text-sm data-[state=on]:border-pizarra data-[state=on]:bg-pizarra data-[state=on]:text-marfil"
          >
            {s.nombre}
          </ToggleGroupItem>
        ))}
      </ToggleGroup>

      <m.ul layout className="grid grid-cols-2 gap-3 sm:gap-4 lg:grid-cols-4">
        <AnimatePresence mode="popLayout">
          {visibles.map((t, i) => (
            <m.li
              layout
              key={t.id}
              initial={{ opacity: 0, scale: 0.96 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.96 }}
              transition={{ duration: 0.35 }}
            >
              <button
                type="button"
                onClick={() => setAbierto(i)}
                className="group flex w-full flex-col gap-3 text-left focus-visible:outline-none"
                aria-label={`Ver ${t.titulo}`}
              >
                <span className="relative block aspect-[3/4] w-full overflow-hidden rounded-[1.25rem] bg-muted ring-ring/60 group-focus-visible:ring-3">
                  <Image src={t.imagen} alt={t.titulo} fill sizes="(min-width:1024px) 25vw, 50vw" className="object-cover transition-transform duration-700 group-hover:scale-105" />
                </span>
                <span className="flex flex-col gap-0.5 px-1">
                  <span className="text-xs font-medium text-acento">{nombre(t.servicio)}</span>
                  <span className="text-[0.95rem] leading-snug font-semibold">{t.titulo}</span>
                </span>
              </button>
            </m.li>
          ))}
        </AnimatePresence>
      </m.ul>

      <Dialog open={actual !== undefined} onOpenChange={(o) => !o && setAbierto(null)}>
        <DialogContent className="max-h-[92dvh] gap-0 overflow-hidden rounded-[1.75rem] p-0 sm:max-w-4xl">
          {actual && (
            <div className="grid md:grid-cols-[1.2fr_1fr]">
              <div className="relative aspect-[3/4] bg-muted md:aspect-auto md:min-h-[34rem]">
                <Image src={actual.imagen} alt={actual.titulo} fill sizes="(min-width:768px) 50vw, 100vw" className="object-contain" />
              </div>
              <div className="flex flex-col gap-4 p-6 sm:p-8">
                <span className="text-sm font-medium text-acento">{nombre(actual.servicio)}</span>
                <DialogTitle className="text-2xl leading-tight font-semibold">{actual.titulo}</DialogTitle>
                <DialogDescription className="text-base leading-relaxed">{actual.descripcion}</DialogDescription>
                {actual.ubicacion && <p className="text-sm text-muted-foreground">{actual.ubicacion}</p>}
                <div className="mt-auto flex flex-col gap-3 pt-4">
                  <Button asChild size="lg" className="h-12 rounded-lg">
                    <Link href={`/presupuesto?servicio=${actual.servicio}`}>
                      Quiero algo así <ArrowRightIcon data-icon="inline-end" />
                    </Link>
                  </Button>
                  <div className="flex justify-between">
                    <Button variant="ghost" size="lg" className="rounded-lg" onClick={() => mover(-1)}>
                      <ChevronLeftIcon data-icon="inline-start" /> Anterior
                    </Button>
                    <Button variant="ghost" size="lg" className="rounded-lg" onClick={() => mover(1)}>
                      Siguiente <ChevronRightIcon data-icon="inline-end" />
                    </Button>
                  </div>
                </div>
              </div>
            </div>
          )}
        </DialogContent>
      </Dialog>
    </div>
  );
}
