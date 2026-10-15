"use client";

import { useEffect, useRef } from "react";
import { animate, useInView, useReducedMotion } from "motion/react";

/** Número que cuenta hasta su valor cuando entra en pantalla. */
export function Contador({ valor, decimales = 0, prefijo = "", sufijo = "" }: { valor: number; decimales?: number; prefijo?: string; sufijo?: string }) {
  const ref = useRef<HTMLSpanElement>(null);
  const visto = useInView(ref, { once: true, margin: "-60px" });
  const reducir = useReducedMotion();
  const formato = (n: number) =>
    `${prefijo}${n.toLocaleString("es-AR", { minimumFractionDigits: decimales, maximumFractionDigits: decimales })}${sufijo}`;

  useEffect(() => {
    const nodo = ref.current;
    if (!nodo || !visto) return;
    if (reducir) {
      nodo.textContent = formato(valor);
      return;
    }
    const control = animate(0, valor, {
      duration: 1.6,
      ease: [0.22, 1, 0.36, 1],
      onUpdate: (v) => (nodo.textContent = formato(v)),
    });
    return () => control.stop();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [visto, valor, reducir]);

  return (
    <span ref={ref} className="tabular-nums">
      {formato(valor)}
    </span>
  );
}
