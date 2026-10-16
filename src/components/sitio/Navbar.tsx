"use client";

import { useEffect, useId, useRef, useState } from "react";
import Image from "next/image";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { useMotionValueEvent, useScroll } from "motion/react";
import { ArrowRightIcon, ArrowUpRightIcon, ChevronDownIcon, MenuIcon } from "lucide-react";
import { Button } from "@/components/ui/button";
import {
  Sheet,
  SheetContent,
  SheetDescription,
  SheetHeader,
  SheetTitle,
  SheetTrigger,
} from "@/components/ui/sheet";
import { Separator } from "@/components/ui/separator";
import { PanelDesplegable } from "@/components/motion/PanelDesplegable";
import { IconoInstagram, IconoWhatsApp } from "@/components/iconos";
import { Logo } from "@/components/sitio/Logo";
import { cn } from "@/lib/utils";

export interface ServicioNav {
  slug: string;
  nombre: string;
  bajada: string;
  imagen: string;
  /** Qué incluye, corto: "Gasas y voile · Black out textil · Roller". */
  resumen: string;
}

/** Enlaces del menú de escritorio (además de Servicios). */
const ENLACES = [
  { href: "/diseno-de-interiores", texto: "Diseño de interiores" },
  { href: "/catalogos", texto: "Catálogos" },
  { href: "/proyectos", texto: "Trabajos" },
  { href: "/nosotros", texto: "Nosotros" },
];

const ENLACES_MOVIL = [
  { href: "/diseno-de-interiores", texto: "Diseño de interiores" },
  { href: "/catalogos", texto: "Catálogos y marcas" },
  { href: "/proyectos", texto: "Trabajos" },
  { href: "/nosotros", texto: "Nosotros" },
  { href: "/preguntas-frecuentes", texto: "Preguntas frecuentes" },
  { href: "/contacto", texto: "Contacto y cómo llegar" },
];

export function Navbar({
  servicios,
  whatsappHref,
  instagram,
}: {
  servicios: ServicioNav[];
  whatsappHref: string;
  instagram: string;
}) {
  const pathname = usePathname();
  const { scrollY } = useScroll();
  const [compacto, setCompacto] = useState(false);
  const [abierto, setAbierto] = useState(false);
  const [serviciosAbierto, setServiciosAbierto] = useState(false);
  const idServicios = useId();
  const disparadorRef = useRef<HTMLButtonElement>(null);
  const panelRef = useRef<HTMLDivElement>(null);
  useMotionValueEvent(scrollY, "change", (y) => setCompacto(y > 24));

  const activo = (href: string) => pathname === href || pathname.startsWith(`${href}/`);
  const servicioActivo = servicios.some((s) => activo(`/${s.slug}`));
  // Diseño de interiores tiene su propio enlace: no se repite en la lista de servicios.
  const productos = servicios.filter((s) => s.slug !== "diseno-de-interiores");
  // En la portada, arriba de todo, el menú va en blanco sobre la foto del hero.
  const claro = pathname === "/" && !compacto && !serviciosAbierto;

  // Al cambiar de página se cierra el panel de servicios.
  useEffect(() => setServiciosAbierto(false), [pathname]);

  // El panel de servicios se cierra con Escape o tocando afuera.
  useEffect(() => {
    if (!serviciosAbierto) return;
    const alTocar = (e: PointerEvent) => {
      const t = e.target;
      if (
        t instanceof Node &&
        (disparadorRef.current?.contains(t) || panelRef.current?.contains(t))
      )
        return;
      setServiciosAbierto(false);
    };
    const alTeclear = (e: KeyboardEvent) => {
      if (e.key !== "Escape") return;
      setServiciosAbierto(false);
      disparadorRef.current?.focus();
    };
    document.addEventListener("pointerdown", alTocar);
    document.addEventListener("keydown", alTeclear);
    return () => {
      document.removeEventListener("pointerdown", alTocar);
      document.removeEventListener("keydown", alTeclear);
    };
  }, [serviciosAbierto]);

  const cerrarServicios = () => setServiciosAbierto(false);

  return (
    <>
      {/* Velo sobre la página mientras el menú de Servicios está abierto (tocarlo lo cierra). */}
      <div
        aria-hidden
        className={cn(
          "fixed inset-0 z-40 hidden bg-pizarra-profundo/30 transition-opacity duration-300 lg:block",
          serviciosAbierto ? "opacity-100" : "pointer-events-none opacity-0",
        )}
      />
      <header
        className={cn(
          "fixed inset-x-0 top-0 z-50 transition-[background-color,box-shadow,border-color] duration-300",
          compacto || serviciosAbierto
            ? "border-b border-border/70 bg-background/80 shadow-[0_1px_24px_-12px_rgb(42_47_53/0.25)] backdrop-blur-xl backdrop-saturate-150"
            : "border-b border-transparent bg-transparent",
        )}
      >
        <div
          className={cn(
            "contenedor grid grid-cols-[1fr_auto] items-center gap-6 transition-[height] duration-300 lg:grid-cols-[1fr_auto_1fr]",
            compacto ? "h-16" : "h-[4.75rem]",
          )}
        >
          <Link
            href="/"
            aria-label="Casa Esusy, ir al inicio"
            className="shrink-0 justify-self-start rounded-md focus-visible:ring-3 focus-visible:ring-ring/50 focus-visible:outline-none"
          >
            <Logo
              prioridad
              variante={claro ? "claro" : "oscuro"}
              className={cn("transition-[height] duration-300", compacto ? "h-9" : "h-10 sm:h-11")}
            />
          </Link>

          <nav aria-label="Principal" className="hidden justify-self-center lg:block">
            <ul className="flex items-center gap-0.5">
              <li>
                <button
                  ref={disparadorRef}
                  type="button"
                  aria-expanded={serviciosAbierto}
                  aria-controls={idServicios}
                  onClick={(e) => {
                    const abrir = !serviciosAbierto;
                    setServiciosAbierto(abrir);
                    // Abierto con teclado (Enter o espacio): el foco pasa al primer servicio del panel.
                    if (abrir && e.detail === 0)
                      setTimeout(
                        () => panelRef.current?.querySelector<HTMLElement>("a")?.focus(),
                        60,
                      );
                  }}
                  className={cn(
                    "inline-flex h-10 items-center gap-1 rounded-lg px-3.5 text-[0.95rem] font-medium transition-colors hover:bg-muted focus-visible:ring-3 focus-visible:ring-ring/50 focus-visible:outline-none",
                    (servicioActivo || serviciosAbierto) && "text-acento",
                    claro && "text-white hover:bg-white/10",
                  )}
                >
                  Servicios
                  <ChevronDownIcon
                    className={cn(
                      "size-4 transition-transform duration-300",
                      serviciosAbierto && "rotate-180",
                    )}
                    aria-hidden
                  />
                </button>
              </li>
              {ENLACES.map((e) => (
                <li key={e.href}>
                  <Link
                    href={e.href}
                    aria-current={activo(e.href) ? "page" : undefined}
                    className={cn(
                      "inline-flex h-10 items-center rounded-lg px-3.5 text-[0.95rem] font-medium whitespace-nowrap transition-colors hover:bg-muted focus-visible:ring-3 focus-visible:ring-ring/50 focus-visible:outline-none",
                      activo(e.href) && "text-acento",
                      claro && "text-white hover:bg-white/10",
                    )}
                  >
                    {e.texto}
                  </Link>
                </li>
              ))}
            </ul>
          </nav>

          <div className="flex items-center gap-2 justify-self-end">
            {pathname !== "/presupuesto" && (
              <Button
                asChild
                size="lg"
                className="h-10 rounded-lg px-3.5 text-sm sm:h-11 sm:px-5 sm:text-[0.95rem]"
              >
                <Link href="/presupuesto">
                  <span className="sm:hidden">Presupuesto</span>
                  <span className="hidden sm:inline">Pedir presupuesto</span>
                </Link>
              </Button>
            )}

            <Sheet open={abierto} onOpenChange={setAbierto}>
              <SheetTrigger asChild>
                <Button
                  variant="ghost"
                  size="icon-lg"
                  className={cn(
                    "size-11 rounded-lg lg:hidden",
                    claro && "text-white hover:bg-white/10 hover:text-white",
                  )}
                  aria-label="Abrir menú"
                >
                  <MenuIcon className="size-6" />
                </Button>
              </SheetTrigger>
              <SheetContent
                side="right"
                className="w-full gap-0 overflow-y-auto border-none bg-background p-0 sm:max-w-md"
              >
                <SheetHeader className="px-6 pt-6 pb-2">
                  <SheetTitle className="sr-only">Menú</SheetTitle>
                  <SheetDescription className="sr-only">Navegación del sitio</SheetDescription>
                  <Logo className="h-10" />
                </SheetHeader>
                <nav className="flex flex-col gap-1 px-4 py-4" aria-label="Principal">
                  <p className="rotulo px-2 pb-2 text-muted-foreground">Servicios</p>
                  <div className="grid grid-cols-2 gap-2">
                    {productos.map((s) => (
                      <Link
                        key={s.slug}
                        href={`/${s.slug}`}
                        onClick={() => setAbierto(false)}
                        className="group/item relative flex aspect-[4/3] items-end overflow-hidden rounded-2xl p-3"
                      >
                        <Image src={s.imagen} alt="" fill sizes="50vw" className="object-cover" />
                        <span className="absolute inset-0 bg-gradient-to-t from-black/65 via-black/15 to-transparent" />
                        <span className="relative text-sm leading-tight font-semibold text-white">
                          {s.nombre}
                        </span>
                      </Link>
                    ))}
                  </div>
                  <Separator className="my-4" />
                  {ENLACES_MOVIL.map((e) => (
                    <Link
                      key={e.href}
                      href={e.href}
                      onClick={() => setAbierto(false)}
                      className={cn(
                        "flex items-center justify-between rounded-xl px-2 py-3 text-lg font-medium",
                        activo(e.href) && "text-acento",
                      )}
                    >
                      {e.texto}
                      <ArrowRightIcon className="size-4 text-muted-foreground" />
                    </Link>
                  ))}
                </nav>
                <div className="mt-auto flex flex-col gap-2 border-t bg-muted/50 p-4">
                  <Button asChild size="lg" className="h-12 rounded-lg text-base">
                    <Link href="/presupuesto" onClick={() => setAbierto(false)}>
                      Pedir presupuesto sin cargo
                    </Link>
                  </Button>
                  <div className="grid grid-cols-2 gap-2">
                    <Button asChild variant="outline" size="lg" className="h-12 rounded-lg">
                      <a href={whatsappHref} target="_blank" rel="noopener">
                        <IconoWhatsApp data-icon="inline-start" /> WhatsApp
                      </a>
                    </Button>
                    <Button asChild variant="outline" size="lg" className="h-12 rounded-lg">
                      <a href={instagram} target="_blank" rel="noopener">
                        <IconoInstagram data-icon="inline-start" /> Instagram
                      </a>
                    </Button>
                  </div>
                </div>
              </SheetContent>
            </Sheet>
          </div>
        </div>

        {/* Menú de Servicios (escritorio): se abre bajo la barra con un resorte y cada tarjeta entra escalonada. */}
        <div className="contenedor relative hidden lg:block">
          <PanelDesplegable
            ref={panelRef}
            id={idServicios}
            abierto={serviciosAbierto}
            className="absolute inset-x-8 top-2"
          >
            <div className="grid grid-cols-[minmax(0,1fr)_16.5rem] gap-3 p-3 xl:grid-cols-[minmax(0,1fr)_18.5rem]">
              <ul className="grid grid-cols-3 gap-1">
                {productos.map((s) => (
                  <li key={s.slug} data-panel-item>
                    <Link
                      href={`/${s.slug}`}
                      onClick={cerrarServicios}
                      aria-current={activo(`/${s.slug}`) ? "page" : undefined}
                      className="group/s flex h-full flex-col gap-3 rounded-2xl p-2 transition-colors hover:bg-muted focus-visible:ring-3 focus-visible:ring-ring/50 focus-visible:outline-none aria-[current=page]:bg-muted"
                    >
                      <span className="relative aspect-[16/9] overflow-hidden rounded-xl bg-muted">
                        <Image
                          src={s.imagen}
                          alt=""
                          fill
                          sizes="(min-width: 1280px) 280px, 220px"
                          className="object-cover transition-transform duration-700 ease-[var(--ease-suave)] group-hover/s:scale-[1.06]"
                        />
                      </span>
                      <span className="flex flex-col gap-1 px-1.5 pb-1">
                        <span className="flex items-center justify-between gap-2 font-semibold text-foreground">
                          {s.nombre}
                          <ArrowUpRightIcon
                            aria-hidden
                            className="size-4 shrink-0 -translate-x-1 text-acento opacity-0 transition-all duration-300 group-hover/s:translate-x-0 group-hover/s:opacity-100"
                          />
                        </span>
                        <span className="text-[0.8125rem] leading-snug text-muted-foreground">
                          {s.resumen}
                        </span>
                      </span>
                    </Link>
                  </li>
                ))}
              </ul>

              <div className="flex flex-col gap-3">
                <Link
                  data-panel-item
                  href="/diseno-de-interiores"
                  onClick={cerrarServicios}
                  className="group/d relative isolate flex flex-1 flex-col justify-end gap-1.5 overflow-hidden rounded-2xl p-5 text-white focus-visible:ring-3 focus-visible:ring-ring/50 focus-visible:outline-none"
                >
                  <Image
                    src="/img/ambientes/paleta-diseno.jpg"
                    alt=""
                    fill
                    sizes="300px"
                    className="-z-10 object-cover transition-transform duration-700 ease-[var(--ease-suave)] group-hover/d:scale-[1.06]"
                  />
                  <span
                    aria-hidden
                    className="absolute inset-0 -z-10 bg-gradient-to-t from-pizarra-profundo/95 via-pizarra-profundo/55 to-pizarra-profundo/10"
                  />
                  <span className="text-xl leading-tight font-semibold">Diseño de interiores</span>
                  <span className="text-sm leading-snug text-white/80">
                    Te ayudamos a que todo combine: colores, telas, luz y muebles.
                  </span>
                  <span className="mt-2 inline-flex items-center gap-1.5 text-sm font-semibold">
                    Conocé el servicio
                    <ArrowRightIcon className="size-4 transition-transform group-hover/d:translate-x-0.5" />
                  </span>
                </Link>
                <div
                  data-panel-item
                  className="flex flex-col gap-1 rounded-2xl bg-acento-suave p-5"
                >
                  <span className="font-semibold">¿No sabés qué elegir?</span>
                  <span className="text-sm leading-snug text-muted-foreground">
                    Vamos a tu casa con muestras y medimos sin cargo.
                  </span>
                  <Button asChild className="mt-3 h-10 rounded-lg">
                    <Link href="/presupuesto" onClick={cerrarServicios}>
                      Pedir presupuesto
                    </Link>
                  </Button>
                </div>
              </div>
            </div>
          </PanelDesplegable>
        </div>
      </header>
    </>
  );
}
