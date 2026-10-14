"use client";

import { LazyMotion, MotionConfig, domAnimation } from "motion/react";
import type { ReactNode } from "react";

/**
 * Carga diferida de Motion (bundle mínimo) y respeto global de
 * `prefers-reduced-motion`. Usar el componente `m` en vez de `motion`.
 */
export function MotionProvider({ children }: { children: ReactNode }) {
  return (
    <LazyMotion features={domAnimation} strict>
      <MotionConfig
        reducedMotion="user"
        transition={{ type: "spring", stiffness: 320, damping: 32 }}
      >
        {children}
      </MotionConfig>
    </LazyMotion>
  );
}
