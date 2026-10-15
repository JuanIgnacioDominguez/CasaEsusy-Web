"use client";

import * as m from "motion/react-m";
import type { HTMLMotionProps } from "motion/react";

const EASE = [0.22, 1, 0.36, 1] as const;

interface Props extends HTMLMotionProps<"div"> {
  retraso?: number;
  desplazamiento?: number;
  /** Animar al cargar (contenido arriba del pliegue) en vez de esperar al scroll. */
  inmediato?: boolean;
}

/** Entra con un fade-up suave la primera vez que aparece en pantalla. */
export function Aparecer({ retraso = 0, desplazamiento = 24, inmediato = false, children, ...props }: Props) {
  const disparador = inmediato
    ? { animate: { opacity: 1, y: 0 } }
    : { whileInView: { opacity: 1, y: 0 }, viewport: { once: true, margin: "0px 0px -60px 0px" } };
  return (
    <m.div
      initial={{ opacity: 0, y: desplazamiento }}
      {...disparador}
      transition={{ duration: 0.7, ease: EASE, delay: retraso }}
      {...props}
    >
      {children}
    </m.div>
  );
}

/** Contenedor que escalona la entrada de sus hijos `AparecerItem`. */
export function Escalonado({ children, retraso = 0, paso = 0.08, ...props }: HTMLMotionProps<"div"> & { retraso?: number; paso?: number }) {
  return (
    <m.div
      initial="oculto"
      whileInView="visible"
      viewport={{ once: true, margin: "0px 0px -60px 0px" }}
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
        oculto: { opacity: 0, y: 20 },
        visible: { opacity: 1, y: 0, transition: { duration: 0.6, ease: EASE } },
      }}
      {...props}
    >
      {children}
    </m.div>
  );
}
