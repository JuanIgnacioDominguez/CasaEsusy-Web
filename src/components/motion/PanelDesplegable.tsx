"use client";

/**
 * Panel que se abre con un resorte y hace entrar su contenido escalonado (cada elemento con
 * `data-panel-item`). Basado en el motor de "Card Nav" de React Bits
 * (https://reactbits.dev/c/components/card-nav, licencia MIT), sin GSAP y respetando
 * prefers-reduced-motion. Cerrado, el contenido queda `inert`: no se puede tabular ni leer.
 */

import { useEffect, useLayoutEffect, useRef, useState } from "react";
import { cn } from "@/lib/utils";

const clamp = (v: number, min: number, max: number) => Math.min(max, Math.max(min, v));
const easeOut = (t: number) => 1 - (1 - t) ** 3;

export function PanelDesplegable({
  id,
  abierto,
  children,
  escalonado = 0.06,
  rebote = 0.18,
  className,
  ref,
}: {
  id: string;
  abierto: boolean;
  children: React.ReactNode;
  escalonado?: number;
  rebote?: number;
  className?: string;
  ref?: React.Ref<HTMLDivElement>;
}) {
  const panelRef = useRef<HTMLDivElement>(null);
  const contenidoRef = useRef<HTMLDivElement>(null);
  const motorRef = useRef<{ despertar: () => void; medir: () => void } | null>(null);
  const abiertoRef = useRef(abierto);
  abiertoRef.current = abierto;
  const [visible, setVisible] = useState(false);

  useEffect(() => {
    const panel = panelRef.current;
    const contenido = contenidoRef.current;
    if (!panel || !contenido) return;
    const reducir = window.matchMedia?.("(prefers-reduced-motion: reduce)").matches ?? false;
    const estado = { p: abiertoRef.current ? 1 : 0, v: 0, alto: contenido.offsetHeight };
    let items = Array.from(contenido.querySelectorAll<HTMLElement>("[data-panel-item]"));
    let raf = 0;
    let ultimo = 0;

    const pintar = () => {
      panel.style.height = `${Math.max(0, estado.p) * estado.alto}px`;
      const n = items.length;
      const retraso = n > 1 ? Math.min(clamp(escalonado, 0, 0.3), 0.6 / (n - 1)) : 0;
      const tramo = 1 - retraso * (n - 1);
      items.forEach((nodo, i) => {
        const local = clamp((estado.p - i * retraso) / Math.max(tramo, 0.05), 0, 1);
        const e = easeOut(local);
        nodo.style.transform = `translateY(${(1 - e) * 22}px) scale(${0.97 + 0.03 * e})`;
        nodo.style.opacity = `${e}`;
      });
    };

    const tick = (ahora: number) => {
      raf = 0;
      const dt = ultimo ? Math.min(0.05, (ahora - ultimo) / 1000) : 1 / 60;
      ultimo = ahora;
      const objetivo = abiertoRef.current ? 1 : 0;
      if (reducir) {
        estado.p = objetivo;
        estado.v = 0;
      } else {
        const k = 170;
        const zeta = abiertoRef.current ? 1 - 0.68 * clamp(rebote, 0, 1) : 1;
        const pasos = Math.ceil(dt / (1 / 240));
        const h = dt / pasos;
        for (let i = 0; i < pasos; i++) {
          estado.v += (-k * (estado.p - objetivo) - 2 * zeta * Math.sqrt(k) * estado.v) * h;
          estado.p += estado.v * h;
        }
      }
      const listo = Math.abs(estado.p - objetivo) < 0.0005 && Math.abs(estado.v) < 0.002;
      if (listo) {
        estado.p = objetivo;
        estado.v = 0;
      }
      pintar();
      if (listo && objetivo === 0) setVisible(false);
      if (!listo) raf = requestAnimationFrame(tick);
    };

    motorRef.current = {
      despertar: () => {
        if (!raf) {
          ultimo = 0;
          raf = requestAnimationFrame(tick);
        }
      },
      medir: () => {
        estado.alto = contenido.offsetHeight;
        items = Array.from(contenido.querySelectorAll<HTMLElement>("[data-panel-item]"));
        pintar();
      },
    };
    pintar();
    const obs = new ResizeObserver(() => motorRef.current?.medir());
    obs.observe(contenido);
    return () => {
      cancelAnimationFrame(raf);
      obs.disconnect();
      motorRef.current = null;
    };
  }, [escalonado, rebote]);

  useLayoutEffect(() => {
    if (abierto) setVisible(true);
    motorRef.current?.medir();
    motorRef.current?.despertar();
  }, [abierto]);

  return (
    <div ref={ref} className={cn(visible || abierto ? "visible" : "invisible", className)}>
      <div
        ref={panelRef}
        className="relative h-0 overflow-hidden rounded-[1.75rem] border border-border/80 bg-background shadow-[0_40px_80px_-36px_rgb(20_24_28/0.5),0_10px_24px_-16px_rgb(20_24_28/0.25)]"
      >
        <div ref={contenidoRef} id={id} inert={!abierto} className="absolute inset-x-0 top-0">
          {children}
        </div>
      </div>
    </div>
  );
}
