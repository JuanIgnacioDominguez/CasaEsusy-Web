"use client";

import { useEffect, useMemo, useState } from "react";
import { useSearchParams } from "next/navigation";
import Image from "next/image";
import { AnimatePresence } from "motion/react";
import * as m from "motion/react-m";
import { ArrowUpRightIcon, BookOpenIcon, ChevronLeftIcon, ChevronRightIcon, DownloadIcon, ExternalLinkIcon, FileTextIcon, ImagesIcon, LinkIcon } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Dialog, DialogContent, DialogDescription, DialogTitle } from "@/components/ui/dialog";
import { ToggleGroup, ToggleGroupItem } from "@/components/ui/toggle-group";
import { TarjetaSpotlight } from "@/components/motion/TarjetaSpotlight";
import { IconoWhatsApp } from "@/components/iconos";
import type { Catalogo } from "@/lib/db/schema";
import { cn } from "@/lib/utils";
import { urlWhatsApp } from "@/lib/whatsapp";

type CatalogoVista = Pick<Catalogo, "id" | "titulo" | "descripcion" | "categoria" | "tipo" | "archivo" | "enlace" | "portada" | "imagenes"> & {
  marca: string | null;
};

const ICONO_TIPO = { pdf: FileTextIcon, imagenes: ImagesIcon, enlace: LinkIcon } as const;
const ETIQUETA_TIPO = { pdf: "PDF", imagenes: "Fotos", enlace: "Online" } as const;

/** Portada generada cuando el catálogo no tiene imagen: nombre de la marca sobre un fondo de la paleta. */
function PortadaGenerada({ c }: { c: CatalogoVista }) {
  const tonos = ["from-pizarra to-pizarra-profundo", "from-terracota to-[#7d3f2a]", "from-[#8c9a83] to-[#5f6c58]", "from-[#c8b496] to-[#9c8566]"];
  const tono = tonos[(c.titulo.length + (c.marca?.length ?? 0)) % tonos.length];
  return (
    <span className={cn("absolute inset-0 flex flex-col justify-between bg-gradient-to-br p-6 text-white", tono)}>
      <BookOpenIcon className="size-7 opacity-70" />
      <span className="flex flex-col gap-1">
        {c.marca && <span className="rotulo text-[0.65rem] text-white/70">{c.marca}</span>}
        <span className="text-2xl leading-tight font-semibold">{c.titulo}</span>
      </span>
    </span>
  );
}

export function VisorCatalogos({
  catalogos,
  whatsapp,
}: {
  catalogos: CatalogoVista[];
  whatsapp: string;
}) {
  const marcaInicial = useSearchParams().get("marca") ?? undefined;
  const categorias = useMemo(() => [...new Set(catalogos.map((c) => c.categoria))], [catalogos]);
  const marcas = useMemo(() => [...new Set(catalogos.map((c) => c.marca).filter(Boolean))] as string[], [catalogos]);
  const [categoria, setCategoria] = useState("todas");
  const [marca, setMarca] = useState(marcaInicial && marcas.includes(marcaInicial) ? marcaInicial : "todas");
  const [abierto, setAbierto] = useState<CatalogoVista | null>(null);
  useEffect(() => {
    if (marcaInicial && marcas.includes(marcaInicial)) setMarca(marcaInicial);
  }, [marcaInicial, marcas]);
  const [foto, setFoto] = useState(0);

  const visibles = catalogos.filter((c) => (categoria === "todas" || c.categoria === categoria) && (marca === "todas" || c.marca === marca));

  const abrir = (c: CatalogoVista) => {
    if (c.tipo === "enlace") return void window.open(c.enlace, "_blank", "noopener");
    setFoto(0);
    setAbierto(c);
  };

  const consulta = (c: CatalogoVista) =>
    urlWhatsApp(whatsapp, `Hola Casa Esusy, vi el catálogo "${c.titulo}"${c.marca ? ` de ${c.marca}` : ""} en la web y quiero hacer una consulta.`);

  return (
    <div className="flex flex-col gap-8">
      <div className="flex flex-col gap-3">
        <ToggleGroup type="single" value={categoria} onValueChange={(v) => v && setCategoria(v)} className="flex flex-wrap justify-start gap-2" aria-label="Filtrar por rubro">
          {["todas", ...categorias].map((c) => (
            <ToggleGroupItem
              key={c}
              value={c}
              className="h-10 rounded-full border bg-card px-4 text-sm data-[state=on]:border-pizarra data-[state=on]:bg-pizarra data-[state=on]:text-marfil"
            >
              {c === "todas" ? "Todos" : c}
            </ToggleGroupItem>
          ))}
        </ToggleGroup>
        {marcas.length > 1 && (
          <ToggleGroup type="single" value={marca} onValueChange={(v) => v && setMarca(v)} className="flex flex-wrap justify-start gap-2" aria-label="Filtrar por marca">
            {["todas", ...marcas].map((mk) => (
              <ToggleGroupItem key={mk} value={mk} className="h-8 rounded-full px-3 text-xs text-muted-foreground data-[state=on]:bg-secondary data-[state=on]:text-foreground">
                {mk === "todas" ? "Todas las marcas" : mk}
              </ToggleGroupItem>
            ))}
          </ToggleGroup>
        )}
      </div>

      <m.ul layout className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3">
        <AnimatePresence mode="popLayout">
          {visibles.map((c) => {
            const Icono = ICONO_TIPO[c.tipo];
            return (
              <m.li layout key={c.id} initial={{ opacity: 0, scale: 0.97 }} animate={{ opacity: 1, scale: 1 }} exit={{ opacity: 0, scale: 0.97 }} transition={{ duration: 0.3 }}>
                <TarjetaSpotlight className="h-full rounded-[1.5rem] border bg-card transition-shadow hover:shadow-[0_24px_48px_-32px_rgb(42_47_53/0.45)]">
                  <button type="button" onClick={() => abrir(c)} className="group flex h-full w-full flex-col text-left focus-visible:outline-none">
                    <span className="relative m-2 block aspect-[4/3] overflow-hidden rounded-[1.15rem] bg-muted ring-ring/60 group-focus-visible:ring-3">
                      {c.portada ? (
                        <Image src={c.portada} alt="" fill sizes="(min-width:1024px) 33vw, (min-width:640px) 50vw, 100vw" className="object-cover transition-transform duration-700 group-hover:scale-105" />
                      ) : (
                        <PortadaGenerada c={c} />
                      )}
                      <span className="absolute top-3 right-3 inline-flex items-center gap-1.5 rounded-full bg-background/90 px-2.5 py-1 text-xs font-medium text-foreground shadow-sm backdrop-blur">
                        <Icono className="size-3.5" /> {ETIQUETA_TIPO[c.tipo]}
                      </span>
                    </span>
                    <span className="flex flex-1 flex-col gap-1 px-5 pt-2 pb-5">
                      <span className="text-xs font-medium text-terracota">
                        {c.categoria}
                        {c.marca ? ` · ${c.marca}` : ""}
                      </span>
                      <span className="text-lg leading-snug font-semibold">{c.titulo}</span>
                      {c.descripcion && <span className="line-clamp-2 text-sm text-muted-foreground">{c.descripcion}</span>}
                      <span className="mt-auto inline-flex items-center gap-1 pt-3 text-sm font-medium">
                        {c.tipo === "enlace" ? "Abrir catálogo online" : "Ver catálogo"}
                        <ArrowUpRightIcon className="size-4 transition-transform group-hover:translate-x-0.5 group-hover:-translate-y-0.5" />
                      </span>
                    </span>
                  </button>
                </TarjetaSpotlight>
              </m.li>
            );
          })}
        </AnimatePresence>
      </m.ul>
      {visibles.length === 0 && <p className="py-10 text-center text-muted-foreground">No hay catálogos con este filtro.</p>}

      <Dialog open={!!abierto} onOpenChange={(o) => !o && setAbierto(null)}>
        <DialogContent className="flex h-[92dvh] max-h-[92dvh] flex-col gap-0 overflow-hidden rounded-[1.5rem] p-0 sm:max-w-5xl">
          {abierto && (
            <>
              <div className="flex flex-col gap-3 border-b p-4 pr-14 sm:flex-row sm:items-center sm:justify-between sm:p-5 sm:pr-14">
                <div className="flex min-w-0 flex-col">
                  <DialogTitle className="truncate text-lg font-semibold">{abierto.titulo}</DialogTitle>
                  <DialogDescription className="truncate">
                    {abierto.categoria}
                    {abierto.marca ? ` · ${abierto.marca}` : ""}
                  </DialogDescription>
                </div>
                <div className="flex shrink-0 gap-2">
                  {abierto.tipo === "pdf" && (
                    <>
                      <Button asChild variant="outline" size="sm" className="rounded-lg">
                        <a href={abierto.archivo} target="_blank" rel="noopener">
                          <ExternalLinkIcon data-icon="inline-start" /> Pantalla completa
                        </a>
                      </Button>
                      <Button asChild variant="outline" size="sm" className="rounded-lg">
                        <a href={abierto.archivo} download>
                          <DownloadIcon data-icon="inline-start" /> Descargar
                        </a>
                      </Button>
                    </>
                  )}
                  <Button asChild size="sm" className="rounded-lg bg-whatsapp text-white hover:bg-[#1FB855]">
                    <a href={consulta(abierto)} target="_blank" rel="noopener">
                      <IconoWhatsApp data-icon="inline-start" /> Consultar
                    </a>
                  </Button>
                </div>
              </div>
              <div className="relative min-h-0 flex-1 bg-muted">
                {abierto.tipo === "pdf" ? (
                  <>
                    <iframe title={abierto.titulo} src={`${abierto.archivo}#view=FitH`} className="hidden size-full border-0 sm:block" />
                    <div className="flex size-full flex-col items-center justify-center gap-4 p-8 text-center sm:hidden">
                      <FileTextIcon className="size-12 text-muted-foreground" />
                      <p className="text-muted-foreground">En el celular el catálogo se abre en una pestaña nueva.</p>
                      <Button asChild size="lg" className="h-12 rounded-lg">
                        <a href={abierto.archivo} target="_blank" rel="noopener">
                          Abrir el PDF
                        </a>
                      </Button>
                    </div>
                  </>
                ) : (
                  <div className="relative size-full">
                    <AnimatePresence mode="wait" initial={false}>
                      <m.div key={foto} initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} transition={{ duration: 0.25 }} className="absolute inset-0">
                        {abierto.imagenes[foto] && (
                          <Image src={abierto.imagenes[foto]!} alt={`${abierto.titulo}, página ${foto + 1}`} fill sizes="(min-width:1024px) 960px, 100vw" className="object-contain" />
                        )}
                      </m.div>
                    </AnimatePresence>
                    {abierto.imagenes.length > 1 && (
                      <>
                        <Button
                          variant="outline"
                          size="icon-lg"
                          className="absolute top-1/2 left-3 -translate-y-1/2 rounded-full bg-background/90"
                          onClick={() => setFoto((f) => (f - 1 + abierto.imagenes.length) % abierto.imagenes.length)}
                          aria-label="Anterior"
                        >
                          <ChevronLeftIcon />
                        </Button>
                        <Button
                          variant="outline"
                          size="icon-lg"
                          className="absolute top-1/2 right-3 -translate-y-1/2 rounded-full bg-background/90"
                          onClick={() => setFoto((f) => (f + 1) % abierto.imagenes.length)}
                          aria-label="Siguiente"
                        >
                          <ChevronRightIcon />
                        </Button>
                        <span className="absolute bottom-3 left-1/2 -translate-x-1/2 rounded-full bg-background/90 px-3 py-1 text-xs font-medium tabular-nums">
                          {foto + 1} / {abierto.imagenes.length}
                        </span>
                      </>
                    )}
                  </div>
                )}
              </div>
            </>
          )}
        </DialogContent>
      </Dialog>
    </div>
  );
}
