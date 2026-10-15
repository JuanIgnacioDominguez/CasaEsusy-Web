"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { useEffect, useState } from "react";
import { Menu } from "lucide-react";
import { Logo } from "@/components/ui/Logo";
import { clasesBoton } from "@/components/ui/Boton";
import { navPrincipal } from "@/content/navegacion";
import { MenuSheet } from "./MenuSheet";

export function Navbar() {
  const pathname = usePathname();
  const [compacta, setCompacta] = useState(false);
  const [menuAbierto, setMenuAbierto] = useState(false);

  useEffect(() => {
    const onScroll = () => setCompacta(window.scrollY > 24);
    onScroll();
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  useEffect(() => setMenuAbierto(false), [pathname]);

  return (
    <>
      <header
        className={`sticky top-0 z-40 transition-[background-color,box-shadow] duration-300 ${
          compacta
            ? "bg-lino/80 shadow-[0_1px_0_var(--color-separator)] backdrop-blur-xl backdrop-saturate-150"
            : "bg-lino"
        }`}
      >
        <nav
          aria-label="Principal"
          className={`contenedor flex items-center justify-between transition-[height] duration-300 ${
            compacta ? "h-14" : "h-[72px]"
          }`}
        >
          <Link href="/" aria-label="Casa Esusy, ir al inicio" className="-ml-1 rounded-lg p-1">
            <Logo />
          </Link>

          <ul className="hidden items-center gap-1 lg:flex">
            {navPrincipal.map((l) => {
              const activo = pathname === l.href || pathname.startsWith(`${l.href}/`);
              return (
                <li key={l.href}>
                  <Link
                    href={l.href}
                    aria-current={activo ? "page" : undefined}
                    className={`inline-flex min-h-11 items-center rounded-full px-3.5 text-[0.9375rem] transition-colors ${
                      activo ? "text-hilo font-semibold" : "text-hilo-2 hover:text-hilo"
                    }`}
                  >
                    {l.label}
                  </Link>
                </li>
              );
            })}
          </ul>

          <div className="flex items-center gap-2">
            <span className="hidden sm:block">
              <Link href="/presupuesto" className={clasesBoton("primario")}>
                Pedir presupuesto
              </Link>
            </span>
            <button
              type="button"
              onClick={() => setMenuAbierto(true)}
              className="inline-flex size-11 items-center justify-center rounded-full text-hilo hover:bg-hilo/[0.06] lg:hidden"
              aria-label="Abrir menú"
              aria-expanded={menuAbierto}
              aria-controls="menu-sheet"
            >
              <Menu className="size-6" strokeWidth={1.75} />
            </button>
          </div>
        </nav>
      </header>
      <MenuSheet abierto={menuAbierto} onCerrar={() => setMenuAbierto(false)} />
    </>
  );
}
