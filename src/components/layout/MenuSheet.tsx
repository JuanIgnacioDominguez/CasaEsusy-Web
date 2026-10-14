"use client";

import Link from "next/link";
import { AnimatePresence, m } from "motion/react";
import { useEffect, useRef } from "react";
import { X } from "lucide-react";
import { navCompleta } from "@/content/navegacion";
import { negocio, urlWhatsApp } from "@/content/negocio";
import { clasesBoton } from "@/components/ui/Boton";
import { IconoWhatsApp } from "@/components/ui/IconoWhatsApp";

/** Menú mobile como hoja (sheet) de iOS: sube desde abajo, se cierra con Escape o arrastrando. */
export function MenuSheet({ abierto, onCerrar }: { abierto: boolean; onCerrar: () => void }) {
  const panelRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (!abierto) return;
    const anterior = document.activeElement as HTMLElement | null;
    document.body.style.overflow = "hidden";
    panelRef.current?.querySelector<HTMLElement>("button, a")?.focus();
    const onKey = (e: KeyboardEvent) => {
      if (e.key === "Escape") onCerrar();
      if (e.key === "Tab" && panelRef.current) {
        const focos = panelRef.current.querySelectorAll<HTMLElement>("a, button");
        const primero = focos[0];
        const ultimo = focos[focos.length - 1];
        if (e.shiftKey && document.activeElement === primero) {
          e.preventDefault();
          ultimo?.focus();
        } else if (!e.shiftKey && document.activeElement === ultimo) {
          e.preventDefault();
          primero?.focus();
        }
      }
    };
    document.addEventListener("keydown", onKey);
    return () => {
      document.body.style.overflow = "";
      document.removeEventListener("keydown", onKey);
      anterior?.focus();
    };
  }, [abierto, onCerrar]);

  return (
    <AnimatePresence>
      {abierto && (
        <div className="fixed inset-0 z-50 lg:hidden" id="menu-sheet">
          <m.div
            className="absolute inset-0 bg-hilo/30"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.2 }}
            onClick={onCerrar}
          />
          <m.div
            ref={panelRef}
            role="dialog"
            aria-modal="true"
            aria-label="Menú"
            className="absolute inset-x-0 bottom-0 max-h-[88dvh] overflow-y-auto rounded-t-[var(--radius-sheet)] bg-surface pb-[max(24px,env(safe-area-inset-bottom))] shadow-2xl"
            initial={{ y: "100%" }}
            animate={{ y: 0 }}
            exit={{ y: "100%" }}
            transition={{ type: "spring", stiffness: 380, damping: 38 }}
            drag="y"
            dragConstraints={{ top: 0, bottom: 0 }}
            dragElastic={{ top: 0, bottom: 0.6 }}
            onDragEnd={(_, info) => {
              if (info.offset.y > 120 || info.velocity.y > 600) onCerrar();
            }}
          >
            <div className="sticky top-0 flex items-center justify-between bg-surface px-5 pt-3 pb-2">
              <span
                aria-hidden="true"
                className="absolute top-2 left-1/2 h-1.5 w-10 -translate-x-1/2 rounded-full bg-hilo/15"
              />
              <span className="display pt-3 text-2xl">Menú</span>
              <button
                type="button"
                onClick={onCerrar}
                className="mt-2 inline-flex size-11 items-center justify-center rounded-full bg-hilo/[0.06]"
                aria-label="Cerrar menú"
              >
                <X className="size-5" />
              </button>
            </div>

            <div className="space-y-6 px-5 pt-2">
              {navCompleta.map((g) => (
                <section key={g.grupo}>
                  <h2 className="mb-1.5 px-1 text-[0.8125rem] text-grafito">{g.grupo}</h2>
                  <ul className="divide-y divide-separator overflow-hidden rounded-[var(--radius-card)] bg-lino">
                    {g.links.map((l) => (
                      <li key={l.href}>
                        <Link
                          href={l.href}
                          className="flex min-h-12 items-center px-4 text-[1.0625rem]"
                        >
                          {l.label}
                        </Link>
                      </li>
                    ))}
                  </ul>
                </section>
              ))}
              <a
                href={urlWhatsApp("Hola Casa Esusy, quiero hacer una consulta.")}
                target="_blank"
                rel="noopener"
                className={clasesBoton("whatsapp", "w-full")}
              >
                <IconoWhatsApp className="size-5" /> Escribinos al {negocio.telefono.visible}
              </a>
            </div>
          </m.div>
        </div>
      )}
    </AnimatePresence>
  );
}
