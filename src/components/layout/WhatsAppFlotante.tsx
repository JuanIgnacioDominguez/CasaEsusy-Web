"use client";

import { usePathname } from "next/navigation";
import { AnimatePresence, m } from "motion/react";
import { useEffect, useState } from "react";
import { urlWhatsApp } from "@/content/negocio";
import { servicios } from "@/content/servicios";
import { estaAbierto } from "@/lib/horario";
import { IconoWhatsApp } from "@/components/ui/IconoWhatsApp";
import { registrarEvento } from "@/lib/analitica";

/** /presupuesto: el formulario ya envía por WhatsApp y el botón taparía "Continuar". */
const RUTAS_EXCLUIDAS = ["/admin", "/checkout", "/p/", "/presupuesto"];

/** Mensaje prellenado según la página (sección 3 del plan). En la Fase 1d se edita desde el admin. */
function mensajePara(pathname: string) {
  const servicio = servicios.find(
    (s) => pathname === `/${s.slug}` || pathname.startsWith(`/${s.slug}/`),
  );
  if (servicio) {
    const tipo = servicio.tipos.find((t) => pathname.endsWith(`/${t.slug}`));
    return tipo
      ? `Hola Casa Esusy, quiero consultar por ${tipo.nombre.toLowerCase()}.`
      : servicio.mensajeWhatsApp;
  }
  if (pathname.startsWith("/diseno-de-interiores"))
    return "Hola Andrea, quiero consultar por un proyecto de diseño de interiores.";
  if (pathname.startsWith("/presupuesto")) return "Hola Casa Esusy, quiero pedir un presupuesto.";
  return "Hola Casa Esusy, quiero hacer una consulta.";
}

export function WhatsAppFlotante() {
  const pathname = usePathname();
  const [visible, setVisible] = useState(false);
  const [abierto, setAbierto] = useState(true);

  useEffect(() => {
    setAbierto(estaAbierto());
    const t = setTimeout(() => setVisible(true), 1200);
    return () => clearTimeout(t);
  }, []);

  if (RUTAS_EXCLUIDAS.some((r) => pathname.startsWith(r))) return null;

  return (
    <AnimatePresence>
      {visible && (
        <m.div
          className="fixed z-30 flex items-end gap-3"
          style={{
            right: "max(16px, env(safe-area-inset-right))",
            bottom: "max(16px, env(safe-area-inset-bottom))",
          }}
          initial={{ opacity: 0, scale: 0.8 }}
          animate={{ opacity: 1, scale: 1 }}
          exit={{ opacity: 0, scale: 0.8 }}
        >
          <a
            href={urlWhatsApp(mensajePara(pathname))}
            target="_blank"
            rel="noopener"
            aria-label="Escribinos por WhatsApp"
            onClick={() => registrarEvento("click_whatsapp", { origen: pathname })}
            className="group flex items-center gap-3"
          >
            <span className="pointer-events-none hidden translate-x-2 rounded-full bg-surface px-4 py-2 text-[0.9375rem] text-hilo opacity-0 shadow-[0_6px_24px_rgb(46_38_34/0.14)] transition-all duration-200 group-hover:translate-x-0 group-hover:opacity-100 group-focus-visible:translate-x-0 group-focus-visible:opacity-100 md:block">
              {abierto ? "¿Te asesoramos?" : "Te respondemos al abrir"}
            </span>
            <span className="relative inline-flex size-14 items-center justify-center rounded-full bg-[var(--whatsapp)] text-white shadow-[0_8px_24px_rgb(37_211_102/0.35)] transition-transform duration-200 group-hover:scale-105 group-active:scale-95">
              <IconoWhatsApp className="size-7" />
              {!abierto && (
                <span
                  className="absolute -top-0.5 -right-0.5 size-3.5 rounded-full border-2 border-lino bg-grafito"
                  aria-hidden="true"
                />
              )}
            </span>
          </a>
        </m.div>
      )}
    </AnimatePresence>
  );
}
