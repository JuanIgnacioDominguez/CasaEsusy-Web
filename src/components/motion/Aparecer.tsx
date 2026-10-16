"use client";

import * as m from "motion/react-m";
import type { HTMLMotionProps } from "motion/react";

/**
 * Entradas al hacer scroll, con la misma sensación que "Animated Content" de React Bits
 * (desplazamiento, desenfoque que se aclara y una escala leve, con curva power3.out),
 * pero hechas con Motion, que ya está en el proyecto, en vez de sumar GSAP.
 */
const POWER3_OUT = [0.215, 0.61, 0.355, 1] as const;
const VIEWPORT = { once: true, margin: "0px 0px -10% 0px" } as const;

interface Props extends HTMLMotionProps<"div"> {
  retraso?: number;
  /** Cuánto se desplaza al entrar, en px. */
  desplazamiento?: number;
  direccion?: "vertical" | "horizontal";
  /** Escala inicial (1 = sin escala). */
  escala?: number;
  /** Desenfoque inicial en px (0 = sin desenfoque). */
  desenfoque?: number;
  duracion?: number;
  /** Animar al cargar (contenido arriba del pliegue) en vez de esperar al scroll. */
  inmediato?: boolean;
}

/** Entra la primera vez que aparece en pantalla. */
export function Aparecer({
  retraso = 0,
  desplazamiento = 40,
  direccion = "vertical",
  escala = 0.98,
  desenfoque = 6,
  duracion = 0.9,
  inmediato = false,
  children,
  ...props
}: Props) {
  const eje = direccion === "horizontal" ? "x" : "y";
  const final = { opacity: 1, [eje]: 0, scale: 1, filter: "blur(0px)" };
  const disparador = inmediato ? { animate: final } : { whileInView: final, viewport: VIEWPORT };
  return (
    <m.div
      initial={{ opacity: 0, [eje]: desplazamiento, scale: escala, filter: `blur(${desenfoque}px)` }}
      {...disparador}
      transition={{ duration: duracion, ease: POWER3_OUT, delay: retraso }}
      {...props}
    >
      {children}
    </m.div>
  );
}

/** Contenedor que escalona la entrada de sus hijos `AparecerItem`. */
export function Escalonado({ children, retraso = 0, paso = 0.09, ...props }: HTMLMotionProps<"div"> & { retraso?: number; paso?: number }) {
  return (
    <m.div
      initial="oculto"
      whileInView="visible"
      viewport={VIEWPORT}
      variants={{ oculto: {}, visible: { transition: { staggerChildren: paso, delayChildren: retraso } } }}
      {...props}
    >
      {children}
    </m.div>
  );
}

export function AparecerItem({ children, ...props }: HTMLMotionProps<"div">) {
  return (
    <m.div
      variants={{
        oculto: { opacity: 0, y: 32, scale: 0.97, filter: "blur(6px)" },
        visible: { opacity: 1, y: 0, scale: 1, filter: "blur(0px)", transition: { duration: 0.8, ease: POWER3_OUT } },
      }}
      {...props}
    >
      {children}
    </m.div>
  );
}
