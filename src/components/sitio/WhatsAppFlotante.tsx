"use client";

import { useEffect, useState } from "react";
import { usePathname } from "next/navigation";
import { AnimatePresence } from "motion/react";
import * as m from "motion/react-m";
import { IconoWhatsApp } from "@/components/iconos";
import type { Horario } from "@/lib/ajustes/esquemas";
import { estadoHorario } from "@/lib/horario";
import { urlWhatsApp } from "@/lib/whatsapp";

/**
 * Botón flotante de WhatsApp (abajo a la derecha). El mensaje cambia según la página
 * y fuera de horario avisa que se responde al abrir.
 */
export function WhatsAppFlotante({
  numero,
  mensaje,
  etiqueta,
  mensajesPorRuta,
  horarios,
}: {
  numero: string;
  mensaje: string;
  etiqueta: string;
  mensajesPorRuta: Record<string, string>;
  horarios: Horario[];
}) {
  const pathname = usePathname();
  const [visible, setVisible] = useState(false);
  const [hover, setHover] = useState(false);
  const [cerrado, setCerrado] = useState(false);

  useEffect(() => {
    const t = setTimeout(() => setVisible(true), 1200);
    setCerrado(!estadoHorario(horarios).abierto);
    return () => clearTimeout(t);
  }, [horarios]);

  if (pathname.startsWith("/presupuesto")) return null;

  const texto = mensajesPorRuta[pathname] ?? mensaje;
  const href = urlWhatsApp(numero, texto);

  return (
    <AnimatePresence>
      {visible && (
        <m.a
          href={href}
          target="_blank"
          rel="noopener"
          aria-label="Escribinos por WhatsApp"
          onMouseEnter={() => setHover(true)}
          onMouseLeave={() => setHover(false)}
          onFocus={() => setHover(true)}
          onBlur={() => setHover(false)}
          initial={{ opacity: 0, scale: 0.8, y: 12 }}
          animate={{ opacity: 1, scale: 1, y: 0 }}
          exit={{ opacity: 0, scale: 0.8 }}
          whileTap={{ scale: 0.94 }}
          className="no-imprimir fixed z-40 flex items-center gap-3 focus-visible:outline-none"
          style={{
            right: "max(1rem, env(safe-area-inset-right))",
            bottom: "max(1rem, env(safe-area-inset-bottom))",
          }}
        >
          <AnimatePresence>
            {hover && (
              <m.span
                initial={{ opacity: 0, x: 8 }}
                animate={{ opacity: 1, x: 0 }}
                exit={{ opacity: 0, x: 8 }}
                className="hidden flex-col rounded-2xl border bg-card px-4 py-2.5 text-right shadow-lg md:flex"
              >
                <span className="text-sm font-semibold text-foreground">{etiqueta}</span>
                <span className="text-xs text-muted-foreground">
                  {cerrado ? "Te respondemos al abrir" : "Respondemos en el día"}
                </span>
              </m.span>
            )}
          </AnimatePresence>
          <span className="relative grid size-14 place-items-center rounded-full bg-whatsapp text-white shadow-[0_10px_30px_-8px_rgb(37_211_102/0.6)] ring-offset-2 ring-offset-background transition-shadow focus-visible:ring-3 md:size-[3.75rem]">
            <IconoWhatsApp className="size-7" />
            {!cerrado && (
              <span className="absolute top-0.5 right-0.5 size-3 rounded-full border-2 border-white bg-[#7CF29C]" aria-hidden />
            )}
          </span>
        </m.a>
      )}
    </AnimatePresence>
  );
}
