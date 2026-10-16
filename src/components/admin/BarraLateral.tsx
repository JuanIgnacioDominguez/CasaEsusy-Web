"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { useTheme } from "next-themes";
import { ChevronsUpDownIcon, ExternalLinkIcon, LogOutIcon, MonitorIcon, MoonIcon, SunIcon } from "lucide-react";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuGroup,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuRadioGroup,
  DropdownMenuRadioItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import {
  Sidebar,
  SidebarContent,
  SidebarFooter,
  SidebarGroup,
  SidebarGroupContent,
  SidebarGroupLabel,
  SidebarHeader,
  SidebarMenu,
  SidebarMenuBadge,
  SidebarMenuButton,
  SidebarMenuItem,
  SidebarRail,
  useSidebar,
} from "@/components/ui/sidebar";
import { Isotipo } from "@/components/sitio/Logo";
import { salir } from "@/lib/acciones/sesion";
import type { UsuarioSesion } from "@/lib/auth/sesion";
import { iniciales } from "@/lib/formato";
import { NAVEGACION, puedeVer } from "./navegacion";

const ROLES = { admin: "Administración", ventas: "Ventas", contenido: "Contenido" } as const;

export function BarraLateral({ usuario, nuevas }: { usuario: UsuarioSesion; nuevas: number }) {
  const pathname = usePathname();
  const { theme, setTheme } = useTheme();
  const { isMobile, setOpenMobile } = useSidebar();
  const activo = (href: string) => (href === "/admin" ? pathname === "/admin" : pathname.startsWith(href));

  return (
    <Sidebar collapsible="icon" variant="inset">
      <SidebarHeader>
        <SidebarMenu>
          <SidebarMenuItem>
            <SidebarMenuButton size="lg" asChild tooltip="Casa Esusy">
              <Link href="/admin">
                <span className="grid size-8 shrink-0 place-items-center rounded-lg bg-white ring-1 ring-sidebar-border dark:bg-marfil">
                  <Isotipo className="size-6" />
                </span>
                <span className="flex flex-col leading-tight">
                  <span className="font-semibold">Casa Esusy</span>
                  <span className="text-xs text-sidebar-foreground/60">Panel de gestión</span>
                </span>
              </Link>
            </SidebarMenuButton>
          </SidebarMenuItem>
        </SidebarMenu>
      </SidebarHeader>

      <SidebarContent>
        {NAVEGACION.map(({ grupo, enlaces }) => {
          const visibles = enlaces.filter((e) => puedeVer(usuario.rol, e));
          if (!visibles.length) return null;
          return (
            <SidebarGroup key={grupo}>
              <SidebarGroupLabel>{grupo}</SidebarGroupLabel>
              <SidebarGroupContent>
                <SidebarMenu>
                  {visibles.map(({ href, titulo, Icono, clave }) => (
                    <SidebarMenuItem key={href}>
                      <SidebarMenuButton asChild isActive={activo(href)} tooltip={titulo}>
                        <Link href={href} onClick={() => isMobile && setOpenMobile(false)}>
                          <Icono />
                          <span>{titulo}</span>
                        </Link>
                      </SidebarMenuButton>
                      {clave === "consultas" && nuevas > 0 && (
                        <SidebarMenuBadge className="bg-acento text-white peer-data-active/menu-button:text-white">{nuevas}</SidebarMenuBadge>
                      )}
                    </SidebarMenuItem>
                  ))}
                </SidebarMenu>
              </SidebarGroupContent>
            </SidebarGroup>
          );
        })}
      </SidebarContent>

      <SidebarFooter>
        <SidebarMenu>
          <SidebarMenuItem>
            <SidebarMenuButton asChild tooltip="Ver el sitio">
              <a href="/" target="_blank" rel="noopener">
                <ExternalLinkIcon />
                <span>Ver el sitio</span>
              </a>
            </SidebarMenuButton>
          </SidebarMenuItem>
          <SidebarMenuItem>
            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <SidebarMenuButton size="lg" className="data-[state=open]:bg-sidebar-accent">
                  <Avatar className="size-8 rounded-lg">
                    <AvatarFallback className="rounded-lg bg-pizarra text-xs font-semibold text-marfil dark:bg-marfil dark:text-pizarra">
                      {iniciales(usuario.nombre)}
                    </AvatarFallback>
                  </Avatar>
                  <span className="flex min-w-0 flex-1 flex-col leading-tight">
                    <span className="truncate font-medium">{usuario.nombre}</span>
                    <span className="truncate text-xs text-sidebar-foreground/60">{ROLES[usuario.rol]}</span>
                  </span>
                  <ChevronsUpDownIcon className="ml-auto" />
                </SidebarMenuButton>
              </DropdownMenuTrigger>
              <DropdownMenuContent side={isMobile ? "bottom" : "right"} align="end" className="w-60">
                <DropdownMenuLabel className="flex flex-col">
                  <span>{usuario.nombre}</span>
                  <span className="text-xs font-normal text-muted-foreground">{usuario.email}</span>
                </DropdownMenuLabel>
                <DropdownMenuSeparator />
                <DropdownMenuGroup>
                  <DropdownMenuLabel className="text-xs font-normal text-muted-foreground">Tema</DropdownMenuLabel>
                  <DropdownMenuRadioGroup value={theme} onValueChange={setTheme}>
                    <DropdownMenuRadioItem value="light">
                      <SunIcon /> Claro
                    </DropdownMenuRadioItem>
                    <DropdownMenuRadioItem value="dark">
                      <MoonIcon /> Oscuro
                    </DropdownMenuRadioItem>
                    <DropdownMenuRadioItem value="system">
                      <MonitorIcon /> Automático
                    </DropdownMenuRadioItem>
                  </DropdownMenuRadioGroup>
                </DropdownMenuGroup>
                <DropdownMenuSeparator />
                <DropdownMenuGroup>
                  <DropdownMenuItem asChild>
                    <Link href="/admin/configuracion?tab=cuenta">Mi cuenta</Link>
                  </DropdownMenuItem>
                  <DropdownMenuItem onSelect={() => salir()}>
                    <LogOutIcon /> Cerrar sesión
                  </DropdownMenuItem>
                </DropdownMenuGroup>
              </DropdownMenuContent>
            </DropdownMenu>
          </SidebarMenuItem>
        </SidebarMenu>
      </SidebarFooter>
      <SidebarRail />
    </Sidebar>
  );
}
