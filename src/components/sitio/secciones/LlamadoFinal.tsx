import Image from "next/image";
import Link from "next/link";
import { ArrowRightIcon } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Aparecer } from "@/components/motion/Aparecer";
import { IconoWhatsApp } from "@/components/iconos";
import { urlWhatsApp } from "@/lib/whatsapp";

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
  return (
    <section className="contenedor pb-20 lg:pb-28">
      <Aparecer className="relative isolate overflow-hidden rounded-[2rem] bg-pizarra px-6 py-16 sm:px-12 lg:px-16 lg:py-20">
        <Image src={imagen} alt="" fill sizes="100vw" className="-z-10 object-cover opacity-25 mix-blend-luminosity" />
        <div aria-hidden className="absolute inset-0 -z-10 bg-gradient-to-r from-pizarra via-pizarra/90 to-pizarra/40" />
        <div className="flex max-w-2xl flex-col gap-6">
          <h2 className="text-[2rem] leading-[1.08] font-semibold text-marfil sm:text-5xl">{titulo}</h2>
          <p className="text-lg leading-relaxed text-marfil/75">{bajada}</p>
          <div className="flex flex-col gap-3 pt-2 sm:flex-row">
            <Button asChild size="lg" className="h-13 rounded-lg bg-marfil px-7 text-base text-pizarra hover:bg-white">
              <Link href="/presupuesto">
                Pedir presupuesto <ArrowRightIcon data-icon="inline-end" />
              </Link>
            </Button>
            <Button
              asChild
              size="lg"
              variant="outline"
              className="h-13 rounded-lg border-marfil/30 bg-transparent px-7 text-base text-marfil hover:bg-marfil/10 hover:text-marfil"
            >
              <a href={urlWhatsApp(whatsapp, mensaje)} target="_blank" rel="noopener">
                <IconoWhatsApp data-icon="inline-start" /> WhatsApp
              </a>
            </Button>
          </div>
        </div>
      </Aparecer>
    </section>
  );
}
