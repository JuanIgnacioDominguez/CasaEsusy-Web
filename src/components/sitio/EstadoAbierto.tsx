"use client";

import { useEffect, useState } from "react";
import type { Horario } from "@/lib/ajustes/esquemas";
import { estadoHorario, type EstadoHorario } from "@/lib/horario";
import { cn } from "@/lib/utils";

/** "Abierto ahora / Cerrado": se calcula en el navegador para que nunca quede desactualizado en la página estática. */
export function EstadoAbierto({ horarios, className }: { horarios: Horario[]; className?: string }) {
  const [estado, setEstado] = useState<EstadoHorario | null>(null);
  useEffect(() => {
    const actualizar = () => setEstado(estadoHorario(horarios));
    actualizar();
    const t = setInterval(actualizar, 60_000);
    return () => clearInterval(t);
  }, [horarios]);

  if (!estado) return <span className={cn("inline-block h-7 w-40 animate-pulse rounded-full bg-muted", className)} aria-hidden />;
  return (
    <span
      className={cn(
        "inline-flex items-center gap-2 rounded-full px-3 py-1 text-sm font-medium",
        estado.abierto ? "bg-exito-suave text-exito" : "bg-muted text-muted-foreground",
        className,
      )}
    >
      <span className={cn("relative size-2 rounded-full", estado.abierto ? "bg-exito" : "bg-muted-foreground/60")}>
        {estado.abierto && <span className="absolute inset-0 animate-ping rounded-full bg-exito/60" />}
      </span>
      {estado.abierto ? "Abierto ahora" : "Cerrado"} · {estado.texto}
    </span>
  );
}
