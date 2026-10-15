"use client";

import { useRef } from "react";
import { cn } from "@/lib/utils";

/** Tarjeta con un halo de luz que sigue al cursor (estilo SpotlightCard de React Bits). */
export function TarjetaSpotlight({
  children,
  className,
  color = "rgb(212 144 111 / 0.18)",
}: {
  children: React.ReactNode;
  className?: string;
  color?: string;
}) {
  const ref = useRef<HTMLDivElement>(null);
  return (
    <div
      ref={ref}
      onPointerMove={(e) => {
        const nodo = ref.current;
        if (!nodo) return;
        const r = nodo.getBoundingClientRect();
        nodo.style.setProperty("--sx", `${e.clientX - r.left}px`);
        nodo.style.setProperty("--sy", `${e.clientY - r.top}px`);
      }}
      style={{ ["--spot" as string]: color }}
      className={cn(
        "group/spot relative overflow-hidden",
        "before:pointer-events-none before:absolute before:inset-0 before:opacity-0 before:transition-opacity before:duration-500 hover:before:opacity-100",
        "before:bg-[radial-gradient(420px_circle_at_var(--sx,50%)_var(--sy,50%),var(--spot),transparent_45%)]",
        className,
      )}
    >
      {children}
    </div>
  );
}
