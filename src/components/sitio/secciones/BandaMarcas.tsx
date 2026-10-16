import Image from "next/image";
import Link from "next/link";
import { ArrowRightIcon } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Aparecer } from "@/components/motion/Aparecer";
import type { Marca } from "@/lib/db/schema";

/** Marcas con las que trabajamos, en una marquesina infinita que se pausa al pasar el mouse. */
export function BandaMarcas({ marcas, catalogos }: { marcas: Marca[]; catalogos: number }) {
  if (marcas.length === 0) return null;
  // Se repite la lista hasta llenar la banda, y se duplica para que el loop no tenga cortes.
  const vueltas = Math.max(1, Math.ceil(8 / marcas.length));
  const tira = Array.from({ length: vueltas }, () => marcas).flat();

  const Item = ({ m, i }: { m: Marca; i: number }) => (
    <Link
      href={`/catalogos?marca=${encodeURIComponent(m.nombre)}`}
      className="group flex shrink-0 items-center gap-4 rounded-2xl px-8 py-4 transition-colors hover:bg-card"
      aria-hidden={i >= marcas.length ? true : undefined}
      tabIndex={i >= marcas.length ? -1 : undefined}
    >
      {m.logo ? (
        <Image src={m.logo} alt={m.nombre} width={320} height={96} className="h-11 w-auto max-w-[190px] object-contain opacity-60 grayscale transition-all duration-300 group-hover:opacity-100 group-hover:grayscale-0" />
      ) : (
        <span className="flex flex-col leading-none">
          <span className="text-2xl font-bold tracking-[-0.03em] text-foreground/70 transition-colors group-hover:text-foreground sm:text-3xl">{m.nombre}</span>
          {m.rubro && <span className="rotulo mt-1.5 text-[0.62rem] text-muted-foreground">{m.rubro}</span>}
        </span>
      )}
    </Link>
  );

  return (
    <section aria-labelledby="marcas-titulo" className="border-y bg-lino/60 py-14 lg:py-16">
      <div className="contenedor mb-8 flex flex-col items-start justify-between gap-4 sm:flex-row sm:items-end">
        <Aparecer className="flex flex-col gap-2">
          <span className="rotulo text-acento">
            <span className="h-px w-6 bg-current" aria-hidden />
            Marcas con las que trabajamos
          </span>
          <h2 id="marcas-titulo" className="text-2xl font-semibold sm:text-3xl">
            Primeras marcas, con sus catálogos online
          </h2>
        </Aparecer>
        <Button asChild variant="outline" className="h-11 rounded-lg bg-card px-5 has-data-[icon=inline-end]:pr-5 has-data-[icon=inline-start]:pl-5">
          <Link href="/catalogos">
            {catalogos > 0 ? `Ver ${catalogos} ${catalogos === 1 ? "catálogo" : "catálogos"}` : "Ver catálogos"} <ArrowRightIcon data-icon="inline-end" />
          </Link>
        </Button>
      </div>
      <div className="group relative overflow-hidden [mask-image:linear-gradient(90deg,transparent,#000_8%,#000_92%,transparent)]">
        <div className="flex w-max animate-marquesina group-hover:[animation-play-state:paused] motion-reduce:animate-none">
          {[...tira, ...tira].map((m, i) => (
            <Item key={`${m.id}-${i}`} m={m} i={i} />
          ))}
        </div>
      </div>
    </section>
  );
}
