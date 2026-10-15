"use client";

import { useEffect, useState } from "react";
import { usePathname, useRouter } from "next/navigation";
import { useTheme } from "next-themes";
import { FilePlusIcon, InboxIcon, MoonIcon, SearchIcon, SunIcon, UserPlusIcon } from "lucide-react";
import { Button } from "@/components/ui/button";
import {
  Command,
  CommandDialog,
  CommandEmpty,
  CommandGroup,
  CommandInput,
  CommandItem,
  CommandList,
  CommandSeparator,
  CommandShortcut,
} from "@/components/ui/command";
import { Kbd } from "@/components/ui/kbd";
import { Separator } from "@/components/ui/separator";
import { SidebarTrigger } from "@/components/ui/sidebar";
import { crearPresupuesto } from "@/lib/acciones/ventas";
import type { UsuarioSesion } from "@/lib/auth/sesion";
import { NAVEGACION, puedeVer } from "./navegacion";

export function Cabecera({ usuario }: { usuario: UsuarioSesion }) {
  const pathname = usePathname();
  const router = useRouter();
  const { resolvedTheme, setTheme } = useTheme();
  const [abierta, setAbierta] = useState(false);

  useEffect(() => {
    const onKey = (e: KeyboardEvent) => {
      if ((e.metaKey || e.ctrlKey) && e.key.toLowerCase() === "k") {
        e.preventDefault();
        setAbierta((a) => !a);
      }
    };
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, []);

  const enlaces = NAVEGACION.flatMap((g) => g.enlaces).filter((e) => puedeVer(usuario.rol, e));
  const actual =
    [...enlaces].sort((a, b) => b.href.length - a.href.length).find((e) => (e.href === "/admin" ? pathname === "/admin" : pathname.startsWith(e.href)))
      ?.titulo ?? "Panel";
  const ir = (href: string) => {
    setAbierta(false);
    router.push(href);
  };

  return (
    <header className="sticky top-0 z-20 flex h-14 shrink-0 items-center gap-2 rounded-t-xl border-b bg-background/85 px-3 backdrop-blur-md sm:px-4">
      <SidebarTrigger className="-ml-1" />
      <Separator orientation="vertical" className="mr-1 data-[orientation=vertical]:h-5" />
      <p className="truncate text-sm font-medium">{actual}</p>
      <div className="ml-auto flex items-center gap-1.5">
        <Button variant="outline" size="sm" className="hidden h-8 w-56 justify-start gap-2 text-muted-foreground sm:inline-flex" onClick={() => setAbierta(true)}>
          <SearchIcon data-icon="inline-start" />
          Buscar o ir a…
          <Kbd className="ml-auto">Ctrl K</Kbd>
        </Button>
        <Button variant="ghost" size="icon" className="sm:hidden" onClick={() => setAbierta(true)} aria-label="Buscar">
          <SearchIcon />
        </Button>
        <Button
          variant="ghost"
          size="icon"
          onClick={() => setTheme(resolvedTheme === "dark" ? "light" : "dark")}
          aria-label="Cambiar tema"
        >
          <SunIcon className="dark:hidden" />
          <MoonIcon className="hidden dark:block" />
        </Button>
      </div>

      <CommandDialog open={abierta} onOpenChange={setAbierta} title="Buscar en el panel" description="Ir a una sección o crear algo nuevo">
        <Command>
        <CommandInput placeholder="Escribí una sección o acción…" />
        <CommandList>
          <CommandEmpty>Sin resultados.</CommandEmpty>
          {usuario.rol !== "contenido" && (
            <>
              <CommandGroup heading="Acciones rápidas">
                <CommandItem
                  onSelect={() => {
                    setAbierta(false);
                    void crearPresupuesto();
                  }}
                >
                  <FilePlusIcon /> Nuevo presupuesto
                  <CommandShortcut>P</CommandShortcut>
                </CommandItem>
                <CommandItem onSelect={() => ir("/admin/consultas?nueva=1")}>
                  <InboxIcon /> Cargar consulta de WhatsApp
                </CommandItem>
                <CommandItem onSelect={() => ir("/admin/clientes?nuevo=1")}>
                  <UserPlusIcon /> Nuevo cliente
                </CommandItem>
              </CommandGroup>
              <CommandSeparator />
            </>
          )}
          {NAVEGACION.map(({ grupo, enlaces: es }) => {
            const visibles = es.filter((e) => puedeVer(usuario.rol, e));
            if (!visibles.length) return null;
            return (
              <CommandGroup key={grupo} heading={grupo}>
                {visibles.map(({ href, titulo, Icono }) => (
                  <CommandItem key={href} onSelect={() => ir(href)}>
                    <Icono /> {titulo}
                  </CommandItem>
                ))}
              </CommandGroup>
            );
          })}
        </CommandList>
        </Command>
      </CommandDialog>
    </header>
  );
}
