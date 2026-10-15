"use client";

import { useState } from "react";
import Image from "next/image";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { useMotionValueEvent, useScroll } from "motion/react";
import { ArrowRightIcon, MenuIcon, PhoneIcon } from "lucide-react";
import { Button } from "@/components/ui/button";
import {
  NavigationMenu,
  NavigationMenuContent,
  NavigationMenuItem,
  NavigationMenuLink,
  NavigationMenuList,
  NavigationMenuTrigger,
} from "@/components/ui/navigation-menu";
import { Sheet, SheetContent, SheetDescription, SheetHeader, SheetTitle, SheetTrigger } from "@/components/ui/sheet";
import { Separator } from "@/components/ui/separator";
import { IconoInstagram, IconoWhatsApp } from "@/components/iconos";
import { Logo } from "@/components/sitio/Logo";
import { cn } from "@/lib/utils";

export interface ServicioNav {
  slug: string;
  nombre: string;
  bajada: string;
  imagen: string;
}

const ENLACES = [
  { href: "/proyectos", texto: "Trabajos" },
  { href: "/nosotros", texto: "Nosotros" },
  { href: "/preguntas-frecuentes", texto: "Preguntas" },
  { href: "/contacto", texto: "Contacto" },
];

export function Navbar({
  servicios,
  telefono,
  telefonoHref,
  whatsappHref,
  instagram,
}: {
  servicios: ServicioNav[];
  telefono: string;
  telefonoHref: string;
  whatsappHref: string;
  instagram: string;
}) {
  const pathname = usePathname();
  const { scrollY } = useScroll();
  const [compacto, setCompacto] = useState(false);
  const [abierto, setAbierto] = useState(false);
  useMotionValueEvent(scrollY, "change", (y) => setCompacto(y > 24));

  const activo = (href: string) => pathname === href || pathname.startsWith(`${href}/`);
  const servicioActivo = servicios.some((s) => activo(`/${s.slug}`));

  return (
    <header
      className={cn(
        "fixed inset-x-0 top-0 z-50 transition-[background-color,box-shadow,border-color] duration-300",
        compacto
          ? "border-b border-border/70 bg-background/80 shadow-[0_1px_24px_-12px_rgb(42_47_53/0.25)] backdrop-blur-xl backdrop-saturate-150"
          : "border-b border-transparent bg-transparent",
      )}
    >
      <div
        className={cn(
          "contenedor flex items-center justify-between gap-6 transition-[height] duration-300",
          compacto ? "h-16" : "h-[4.75rem]",
        )}
      >
        <Link href="/" aria-label="Casa Esusy, ir al inicio" className="shrink-0 rounded-md focus-visible:ring-3 focus-visible:ring-ring/50 focus-visible:outline-none">
          <Logo prioridad className={cn("transition-[height] duration-300", compacto ? "h-9" : "h-10 sm:h-11")} />
        </Link>

        <NavigationMenu viewport={false} className="hidden lg:flex">
          <NavigationMenuList className="gap-1">
            <NavigationMenuItem>
              <NavigationMenuTrigger
                className={cn("h-10 rounded-full bg-transparent px-4 text-[0.95rem]", servicioActivo && "text-terracota")}
              >
                Servicios
              </NavigationMenuTrigger>
              <NavigationMenuContent className="!w-[min(92vw,760px)] !rounded-3xl !p-3">
                <div className="grid grid-cols-[1fr_15rem] gap-3">
                  <ul className="grid grid-cols-2 gap-1">
                    {servicios.map((s) => (
                      <li key={s.slug}>
                        <NavigationMenuLink asChild>
                          <Link
                            href={`/${s.slug}`}
                            className="group/item flex flex-row items-center gap-3 rounded-2xl p-2 hover:bg-muted"
                          >
                            <span className="relative size-12 shrink-0 overflow-hidden rounded-xl bg-muted">
                              <Image src={s.imagen} alt="" fill sizes="48px" className="object-cover transition-transform duration-500 group-hover/item:scale-110" />
                            </span>
                            <span className="flex min-w-0 flex-col">
                              <span className="text-sm font-semibold text-foreground">{s.nombre}</span>
                              <span className="line-clamp-1 text-xs text-muted-foreground">{s.bajada}</span>
                            </span>
                          </Link>
                        </NavigationMenuLink>
                      </li>
                    ))}
                  </ul>
                  <NavigationMenuLink asChild>
                    <Link
                      href="/presupuesto"
                      className="flex flex-col justify-end gap-2 rounded-2xl bg-pizarra p-5 text-marfil hover:bg-pizarra-profundo"
                    >
                      <span className="rotulo text-[0.65rem] text-marfil/70">Sin cargo</span>
                      <span className="text-lg leading-snug font-semibold text-balance text-marfil">
                        Medimos en tu casa y te pasamos el presupuesto
                      </span>
                      <span className="mt-1 inline-flex items-center gap-1 text-sm font-medium text-marfil/90">
                        Pedir presupuesto <ArrowRightIcon className="size-4" />
                      </span>
                    </Link>
                  </NavigationMenuLink>
                </div>
              </NavigationMenuContent>
            </NavigationMenuItem>
            {ENLACES.map((e) => (
              <NavigationMenuItem key={e.href}>
                <NavigationMenuLink asChild active={activo(e.href)}>
                  <Link
                    href={e.href}
                    className={cn(
                      "inline-flex h-10 items-center rounded-full px-4 text-[0.95rem] font-medium transition-colors hover:bg-muted",
                      activo(e.href) && "text-terracota",
                    )}
                  >
                    {e.texto}
                  </Link>
                </NavigationMenuLink>
              </NavigationMenuItem>
            ))}
          </NavigationMenuList>
        </NavigationMenu>

        <div className="flex items-center gap-2">
          <a
            href={telefonoHref}
            className="hidden items-center gap-2 rounded-full px-3 py-2 text-sm font-medium text-muted-foreground transition-colors hover:text-foreground xl:inline-flex"
          >
            <PhoneIcon className="size-4" />
            {telefono}
          </a>
          <Button asChild size="lg" className="hidden h-11 rounded-full px-5 text-[0.95rem] sm:inline-flex">
            <Link href="/presupuesto">Pedir presupuesto</Link>
          </Button>

          <Sheet open={abierto} onOpenChange={setAbierto}>
            <SheetTrigger asChild>
              <Button variant="ghost" size="icon-lg" className="size-11 rounded-full lg:hidden" aria-label="Abrir menú">
                <MenuIcon className="size-6" />
              </Button>
            </SheetTrigger>
            <SheetContent side="right" className="w-full gap-0 overflow-y-auto border-none bg-background p-0 sm:max-w-md">
              <SheetHeader className="px-6 pt-6 pb-2">
                <SheetTitle className="sr-only">Menú</SheetTitle>
                <SheetDescription className="sr-only">Navegación del sitio</SheetDescription>
                <Logo className="h-10" />
              </SheetHeader>
              <nav className="flex flex-col gap-1 px-4 py-4" aria-label="Principal">
                <p className="rotulo px-2 pb-2 text-muted-foreground">Servicios</p>
                <div className="grid grid-cols-2 gap-2">
                  {servicios.map((s) => (
                    <Link
                      key={s.slug}
                      href={`/${s.slug}`}
                      onClick={() => setAbierto(false)}
                      className="group/item relative flex aspect-[4/3] items-end overflow-hidden rounded-2xl p-3"
                    >
                      <Image src={s.imagen} alt="" fill sizes="50vw" className="object-cover" />
                      <span className="absolute inset-0 bg-gradient-to-t from-black/65 via-black/15 to-transparent" />
                      <span className="relative text-sm leading-tight font-semibold text-white">{s.nombre}</span>
                    </Link>
                  ))}
                </div>
                <Separator className="my-4" />
                {ENLACES.map((e) => (
                  <Link
                    key={e.href}
                    href={e.href}
                    onClick={() => setAbierto(false)}
                    className={cn(
                      "flex items-center justify-between rounded-xl px-2 py-3 text-lg font-medium",
                      activo(e.href) && "text-terracota",
                    )}
                  >
                    {e.texto}
                    <ArrowRightIcon className="size-4 text-muted-foreground" />
                  </Link>
                ))}
              </nav>
              <div className="mt-auto flex flex-col gap-2 border-t bg-muted/50 p-4">
                <Button asChild size="lg" className="h-12 rounded-full text-base">
                  <Link href="/presupuesto" onClick={() => setAbierto(false)}>
                    Pedir presupuesto sin cargo
                  </Link>
                </Button>
                <div className="grid grid-cols-2 gap-2">
                  <Button asChild variant="outline" size="lg" className="h-12 rounded-full">
                    <a href={whatsappHref} target="_blank" rel="noopener">
                      <IconoWhatsApp data-icon="inline-start" /> WhatsApp
                    </a>
                  </Button>
                  <Button asChild variant="outline" size="lg" className="h-12 rounded-full">
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
    </header>
  );
}
