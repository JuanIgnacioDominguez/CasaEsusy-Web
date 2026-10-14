"use client";

import { useEffect, useState } from "react";
import { estaAbierto } from "@/lib/horario";

/** "Abierto ahora / Cerrado" calculado en el navegador con la hora de Argentina. */
export function EstadoHorario() {
  const [abierto, setAbierto] = useState<boolean | null>(null);
  useEffect(() => setAbierto(estaAbierto()), []);
  if (abierto === null) return null;
  return (
    <span
      className={`inline-flex items-center gap-2 rounded-full px-3 py-1 text-[0.8125rem] font-medium ${
        abierto ? "bg-[#e3f1e6] text-[#1d5a2e]" : "bg-hilo/[0.06] text-hilo-2"
      }`}
    >
      <span
        className={`size-2 rounded-full ${abierto ? "bg-[#2f8a49]" : "bg-grafito"}`}
        aria-hidden="true"
      />
      {abierto ? "Abierto ahora" : "Cerrado ahora"}
    </span>
  );
}
