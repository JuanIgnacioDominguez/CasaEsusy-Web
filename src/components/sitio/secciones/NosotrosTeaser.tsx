import Image from "next/image";
import Link from "next/link";
import { ArrowRightIcon, AwardIcon } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Aparecer } from "@/components/motion/Aparecer";
import type { Negocio } from "@/lib/ajustes/esquemas";

export function NosotrosTeaser({ negocio, texto }: { negocio: Negocio; texto: string }) {
  return (
    <section className="bg-lino py-20 lg:py-28">
      <div className="contenedor grid items-center gap-12 lg:grid-cols-2 lg:gap-20">
        <Aparecer className="relative">
          <div className="grid grid-cols-5 gap-4">
            <div className="relative col-span-3 aspect-[3/4] overflow-hidden rounded-[1.75rem]">
              <Image src="/img/ambientes/muestrario-telas.jpg" alt="Muestrario de telas en el local" fill sizes="(min-width:1024px) 30vw, 60vw" className="object-cover" />
            </div>
            <div className="col-span-2 flex flex-col gap-4 pt-12">
              <div className="relative aspect-[9/16] overflow-hidden rounded-[1.5rem]">
                <Image src="/img/instagram/frente-local.jpg" alt={`Frente del local de Casa Esusy en ${negocio.calle}`} fill sizes="(min-width:1024px) 20vw, 40vw" className="object-cover" />
              </div>
            </div>
          </div>
        </Aparecer>
        <Aparecer retraso={0.1} className="flex flex-col gap-6">
          <span className="rotulo text-terracota">
            <span className="h-px w-6 bg-current" aria-hidden />
            Desde {negocio.fundacion}
          </span>
          <h2 className="text-[2rem] leading-[1.08] font-semibold sm:text-[2.6rem] lg:text-[3rem]">Tres generaciones eligiendo telas</h2>
          <p className="text-lg leading-relaxed text-muted-foreground">{texto}</p>
          <div className="flex items-start gap-4 rounded-2xl border bg-card p-5">
            <span className="grid size-11 shrink-0 place-items-center rounded-xl bg-terracota-suave text-terracota">
              <AwardIcon className="size-5" />
            </span>
            <p className="text-[0.95rem] leading-relaxed">
              <span className="font-semibold">{negocio.duenaNombre}</span>, a cargo de la casa, está certificada en {negocio.duenaCredencial} ({negocio.duenaInstitucion}, {negocio.duenaAnio}).
            </p>
          </div>
          <Button asChild variant="outline" size="lg" className="h-12 self-start rounded-full px-6">
            <Link href="/nosotros">
              Conocé nuestra historia <ArrowRightIcon data-icon="inline-end" />
            </Link>
          </Button>
        </Aparecer>
      </div>
    </section>
  );
}
