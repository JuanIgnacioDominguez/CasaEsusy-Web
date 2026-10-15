"use client";

import { useEffect, useState } from "react";
import { usePathname } from "next/navigation";
import { AnimatePresence, useReducedMotion } from "motion/react";
import * as m from "motion/react-m";
import { XIcon } from "lucide-react";
import { IconoWhatsApp } from "@/components/iconos";
import type { Horario } from "@/lib/ajustes/esquemas";
import { estadoHorario } from "@/lib/horario";
import { urlWhatsApp } from "@/lib/whatsapp";

/** Cada cuánto aparece la burbuja de ayuda (y cuántas veces como máximo por visita). */
const PRIMERA_MS = 9_000;
const DURACION_MS = 7_000;
const INTERVALO_MS = 45_000;
const MAXIMO_POR_VISITA = 3;
const CLAVE_SESION = "ce-burbuja-wa";

function leerSesion(): { veces: number; cerrada: boolean } {
  try {
    return JSON.parse(sessionStorage.getItem(CLAVE_SESION) ?? "") as { veces: number; cerrada: boolean };
  } catch {
    return { veces: 0, cerrada: false };
  }
}
function guardarSesion(valor: { veces: number; cerrada: boolean }) {
  try {
    sessionStorage.setItem(CLAVE_SESION, JSON.stringify(valor));
  } catch {
    /* sin almacenamiento (modo privado): la burbuja igual funciona en esta página */
  }
}

/**
 * Botón flotante de WhatsApp (abajo a la derecha). El mensaje cambia según la página.
 * Cada tanto muestra una burbuja tipo chat ("¿Necesitás ayuda?") con un "escribiendo…" previo.
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
  const reducir = useReducedMotion();
  const [visible, setVisible] = useState(false);
  const [hover, setHover] = useState(false);
  const [burbuja, setBurbuja] = useState(false);
  const [escribiendo, setEscribiendo] = useState(false);
  const [saludo, setSaludo] = useState(0);
  const [cerrado, setCerrado] = useState(false);

  useEffect(() => {
    const t = setTimeout(() => setVisible(true), 1200);
    setCerrado(!estadoHorario(horarios).abierto);
    return () => clearTimeout(t);
  }, [horarios]);

  // Burbuja periódica: aparece, "escribe", muestra el mensaje y se va sola.
  useEffect(() => {
    if (!visible) return;
    const timers: ReturnType<typeof setTimeout>[] = [];
    const mostrar = () => {
      const sesion = leerSesion();
      if (sesion.cerrada || sesion.veces >= MAXIMO_POR_VISITA) return;
      guardarSesion({ ...sesion, veces: sesion.veces + 1 });
      setBurbuja(true);
      setEscribiendo(!reducir);
      setSaludo((s) => s + 1);
      timers.push(setTimeout(() => setEscribiendo(false), 1100));
      timers.push(setTimeout(() => setBurbuja(false), DURACION_MS));
      timers.push(setTimeout(mostrar, INTERVALO_MS));
    };
    timers.push(setTimeout(mostrar, PRIMERA_MS));
    return () => timers.forEach(clearTimeout);
  }, [visible, reducir]);

  if (pathname.startsWith("/presupuesto") || pathname.startsWith("/contacto")) return null;

  const href = urlWhatsApp(numero, mensajesPorRuta[pathname] ?? mensaje);
  const subtitulo = cerrado ? "Dejanos tu mensaje y te respondemos al abrir." : "Escribinos y te respondemos en el día.";
  const mostrarBurbuja = burbuja || hover;

  const cerrarBurbuja = () => {
    setBurbuja(false);
    guardarSesion({ ...leerSesion(), cerrada: true });
  };

  return (
    <AnimatePresence>
      {visible && (
        <m.div
          initial={{ opacity: 0, scale: 0.8, y: 12 }}
          animate={{ opacity: 1, scale: 1, y: 0 }}
          exit={{ opacity: 0, scale: 0.8 }}
          className="no-imprimir fixed z-40 flex items-end gap-3"
          style={{ right: "max(1rem, env(safe-area-inset-right))", bottom: "max(1rem, env(safe-area-inset-bottom))" }}
          onMouseEnter={() => setHover(true)}
          onMouseLeave={() => setHover(false)}
        >
          <AnimatePresence>
            {mostrarBurbuja && (
              <m.div
                key="burbuja"
                initial={{ opacity: 0, scale: 0.6, x: 24, y: 8 }}
                animate={{ opacity: 1, scale: 1, x: 0, y: 0 }}
                exit={{ opacity: 0, scale: 0.85, x: 12 }}
                transition={{ type: "spring", stiffness: 380, damping: 26 }}
                style={{ transformOrigin: "bottom right" }}
                className="relative mb-2 w-[min(17rem,calc(100vw-6.5rem))]"
                role="status"
                aria-live="polite"
              >
                <a
                  href={href}
                  target="_blank"
                  rel="noopener"
                  className="block rounded-2xl rounded-br-md border bg-card p-4 pr-9 text-left shadow-[0_18px_40px_-18px_rgb(42_47_53/0.45)] transition-colors hover:bg-muted"
                >
                  <AnimatePresence mode="wait" initial={false}>
                    {escribiendo ? (
                      <m.span key="escribiendo" exit={{ opacity: 0 }} className="flex h-10 items-center gap-1.5" aria-label="Escribiendo">
                        {[0, 1, 2].map((i) => (
                          <m.span
                            key={i}
                            className="size-2 rounded-full bg-muted-foreground/60"
                            animate={{ y: [0, -5, 0] }}
                            transition={{ duration: 0.6, repeat: Infinity, delay: i * 0.12, ease: "easeInOut" }}
                          />
                        ))}
                      </m.span>
                    ) : (
                      <m.span key="mensaje" initial={{ opacity: 0, y: 4 }} animate={{ opacity: 1, y: 0 }} className="flex flex-col gap-0.5">
                        <span className="text-[0.95rem] font-semibold text-foreground">{etiqueta}</span>
                        <span className="text-sm leading-snug text-muted-foreground">{subtitulo}</span>
                      </m.span>
                    )}
                  </AnimatePresence>
                </a>
                {burbuja && (
                  <button
                    type="button"
                    onClick={cerrarBurbuja}
                    aria-label="Cerrar mensaje"
                    className="absolute top-2 right-2 grid size-6 place-items-center rounded-full text-muted-foreground transition-colors hover:bg-muted hover:text-foreground"
                  >
                    <XIcon className="size-3.5" />
                  </button>
                )}
              </m.div>
            )}
          </AnimatePresence>

          <m.a
            href={href}
            target="_blank"
            rel="noopener"
            aria-label="Escribinos por WhatsApp"
            onFocus={() => setHover(true)}
            onBlur={() => setHover(false)}
            whileTap={{ scale: 0.94 }}
            className="relative shrink-0 rounded-full focus-visible:outline-none"
          >
            {/* Onda que acompaña cada aparición de la burbuja */}
            <AnimatePresence>
              {burbuja && !reducir && (
                <m.span
                  key={`onda-${saludo}`}
                  aria-hidden
                  className="absolute inset-0 rounded-full bg-whatsapp"
                  initial={{ opacity: 0.5, scale: 1 }}
                  animate={{ opacity: 0, scale: 1.7 }}
                  exit={{ opacity: 0 }}
                  transition={{ duration: 1.4, repeat: 2, ease: "easeOut" }}
                />
              )}
            </AnimatePresence>
            <m.span
              key={`saludo-${saludo}`}
              animate={saludo > 0 && !reducir ? { rotate: [0, -14, 12, -8, 6, 0] } : undefined}
              transition={{ duration: 0.9, ease: "easeInOut" }}
              className="relative grid size-14 place-items-center rounded-full bg-whatsapp text-white shadow-[0_10px_30px_-8px_rgb(37_211_102/0.6)] ring-offset-2 ring-offset-background md:size-[3.75rem]"
            >
              <IconoWhatsApp className="size-7" />
              {!cerrado && <span className="absolute top-0.5 right-0.5 size-3 rounded-full border-2 border-white bg-[#7CF29C]" aria-hidden />}
            </m.span>
          </m.a>
        </m.div>
      )}
    </AnimatePresence>
  );
}
