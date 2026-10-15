import Link from "next/link";
import { ArrowRightIcon } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Aparecer } from "@/components/motion/Aparecer";
import { TituloAnimado } from "@/components/motion/TituloAnimado";
import { Estrellas, IconoGoogle, IconoWhatsApp } from "@/components/iconos";
import type { AjustesInicio, Negocio } from "@/lib/ajustes/esquemas";
import { urlWhatsApp } from "@/lib/whatsapp";
import { HeroImagenes } from "./HeroImagenes";

export function Hero({ inicio, negocio, mensaje }: { inicio: AjustesInicio; negocio: Negocio; mensaje: string }) {
  return (
    <section className="relative overflow-hidden pt-28 pb-20 sm:pt-32 lg:pt-36 lg:pb-28">
      <div
        aria-hidden
        className="pointer-events-none absolute -top-40 right-[-20%] size-[46rem] rounded-full bg-[radial-gradient(closest-side,var(--terracota-suave),transparent)] opacity-70"
      />
      <div className="contenedor relative grid items-center gap-14 lg:grid-cols-12 lg:gap-10">
        <div className="flex flex-col gap-7 lg:col-span-6 lg:pr-6">
          <Aparecer inmediato desplazamiento={10}>
            <span className="rotulo rounded-full border border-terracota/25 bg-card/70 px-3.5 py-1.5 text-terracota backdrop-blur">
              <span className="size-1.5 rounded-full bg-terracota" aria-hidden />
              {inicio.rotulo}
            </span>
          </Aparecer>
          <TituloAnimado
            texto={inicio.titulo}
            className="text-[2.6rem] leading-[1.02] font-semibold tracking-[-0.035em] text-foreground sm:text-6xl lg:text-[4.4rem]"
          />
          <Aparecer inmediato retraso={0.3}>
            <p className="max-w-xl text-lg leading-relaxed text-muted-foreground sm:text-xl">{inicio.bajada}</p>
          </Aparecer>
          <Aparecer inmediato retraso={0.4} className="flex flex-col gap-3 sm:flex-row">
            <Button asChild size="lg" className="group h-13 rounded-lg px-7 text-base">
              <Link href="/presupuesto">
                Pedir presupuesto sin cargo
                <ArrowRightIcon data-icon="inline-end" className="transition-transform group-hover:translate-x-0.5" />
              </Link>
            </Button>
            <Button asChild size="lg" variant="outline" className="h-13 rounded-lg bg-card/60 px-7 text-base backdrop-blur">
              <a href={urlWhatsApp(negocio.whatsapp, mensaje)} target="_blank" rel="noopener">
                <IconoWhatsApp data-icon="inline-start" className="text-[#1FA855]" />
                Escribinos
              </a>
            </Button>
          </Aparecer>
          <Aparecer inmediato retraso={0.5}>
            <a
              href={negocio.googleResenas}
              target="_blank"
              rel="noopener"
              className="group inline-flex items-center gap-3 rounded-2xl py-1 text-sm text-muted-foreground"
            >
              <span className="grid size-10 place-items-center rounded-full border bg-card">
                <IconoGoogle className="size-5" />
              </span>
              <span className="flex flex-col">
                <span className="flex items-center gap-2 font-semibold text-foreground">
                  {negocio.googlePuntaje.toLocaleString("es-AR")}
                  <Estrellas puntaje={negocio.googlePuntaje} className="text-[0.95rem] text-foreground" />
                </span>
                <span className="group-hover:text-foreground">{negocio.googleOpiniones} opiniones en Google</span>
              </span>
            </a>
          </Aparecer>
        </div>

        <div className="lg:col-span-6">
          <HeroImagenes principal={inicio.imagen} secundaria={inicio.imagenSecundaria} fundacion={negocio.fundacion} />
        </div>
      </div>
    </section>
  );
}
