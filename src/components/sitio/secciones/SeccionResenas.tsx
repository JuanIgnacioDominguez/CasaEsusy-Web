import { QuoteIcon } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Aparecer, AparecerItem, Escalonado } from "@/components/motion/Aparecer";
import { Estrellas, IconoGoogle } from "@/components/iconos";
import type { Negocio } from "@/lib/ajustes/esquemas";
import type { Resena } from "@/lib/db/schema";

export function SeccionResenas({ resenas, negocio }: { resenas: Resena[]; negocio: Negocio }) {
  if (resenas.length === 0) return null;
  return (
    <section className="py-20 lg:py-28">
      <div className="contenedor grid gap-10 lg:grid-cols-[22rem_1fr] lg:gap-14">
        <Aparecer className="flex flex-col gap-6 rounded-[1.75rem] bg-pizarra p-8 text-marfil lg:sticky lg:top-28 lg:self-start">
          <span className="rotulo text-marfil/60">Lo que dicen</span>
          <div className="flex items-end gap-3">
            <span className="text-7xl leading-none font-semibold tracking-tight">{negocio.googlePuntaje.toLocaleString("es-AR")}</span>
            <span className="pb-2 text-marfil/60">/ 5</span>
          </div>
          <Estrellas puntaje={negocio.googlePuntaje} className="text-2xl text-marfil" />
          <p className="flex items-center gap-2 text-sm text-marfil/75">
            <IconoGoogle className="size-4" /> {negocio.googleOpiniones} opiniones en Google
          </p>
          <div className="flex flex-col gap-2 pt-2">
            <Button asChild size="lg" className="h-12 rounded-full bg-marfil text-pizarra hover:bg-marfil/90">
              <a href={negocio.googleResenas} target="_blank" rel="noopener">
                Ver opiniones en Google
              </a>
            </Button>
          </div>
        </Aparecer>
        <Escalonado className="grid gap-4 md:grid-cols-2">
          {resenas.slice(0, 6).map((r, i) => (
            <AparecerItem
              key={r.id}
              className={i === 0 ? "md:col-span-2" : undefined}
            >
              <figure className="flex h-full flex-col gap-5 rounded-[1.75rem] border bg-card p-7">
                <div className="flex items-center justify-between">
                  <Estrellas puntaje={r.puntaje} className="text-lg text-foreground" />
                  <QuoteIcon className="size-7 text-terracota/30" />
                </div>
                <blockquote className={i === 0 ? "text-xl leading-relaxed font-medium text-foreground sm:text-2xl" : "text-[1.0625rem] leading-relaxed text-foreground"}>
                  “{r.texto}”
                </blockquote>
                <figcaption className="mt-auto flex items-center gap-3 text-sm">
                  <span className="grid size-10 place-items-center rounded-full bg-secondary font-semibold text-secondary-foreground">
                    {r.autor.charAt(0)}
                  </span>
                  <span className="flex flex-col">
                    <span className="font-semibold">{r.autor}</span>
                    <span className="text-muted-foreground">
                      {r.origen}
                      {r.fecha ? ` · ${r.fecha}` : ""}
                    </span>
                  </span>
                </figcaption>
              </figure>
            </AparecerItem>
          ))}
        </Escalonado>
      </div>
    </section>
  );
}
