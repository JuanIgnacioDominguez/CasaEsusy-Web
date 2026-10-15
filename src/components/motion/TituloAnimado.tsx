"use client";

import * as m from "motion/react-m";
import { cn } from "@/lib/utils";

/** Título que aparece palabra por palabra, de desenfocado a nítido (estilo BlurText de React Bits). */
export function TituloAnimado({
  texto,
  como: Etiqueta = "h1",
  className,
  retraso = 0,
}: {
  texto: string;
  como?: "h1" | "h2" | "p";
  className?: string;
  retraso?: number;
}) {
  const palabras = texto.split(" ");
  return (
    <Etiqueta className={cn(className)} aria-label={texto}>
      {palabras.map((palabra, i) => (
        <m.span
          key={`${palabra}-${i}`}
          aria-hidden
          className="inline-block will-change-transform"
          initial={{ opacity: 0, y: 14, filter: "blur(10px)" }}
          animate={{ opacity: 1, y: 0, filter: "blur(0px)" }}
          transition={{ duration: 0.7, delay: retraso + i * 0.06, ease: [0.22, 1, 0.36, 1] }}
        >
          {palabra}
          {i < palabras.length - 1 ? " " : ""}
        </m.span>
      ))}
    </Etiqueta>
  );
}
