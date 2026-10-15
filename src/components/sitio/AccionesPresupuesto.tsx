"use client";

import { useState, useTransition } from "react";
import * as m from "motion/react-m";
import { CheckIcon, DownloadIcon } from "lucide-react";
import { toast } from "sonner";
import { Button } from "@/components/ui/button";
import { Spinner } from "@/components/ui/spinner";
import { IconoWhatsApp } from "@/components/iconos";
import { responderPresupuesto } from "@/lib/acciones/ventas";

export function AccionesPresupuesto({
  token,
  estado: estadoInicial,
  whatsapp,
}: {
  token: string;
  estado: string;
  etiquetaEstado: string;
  whatsapp: string;
}) {
  const [estado, setEstado] = useState(estadoInicial);
  const [pendiente, iniciar] = useTransition();

  const responder = (acepta: boolean) => {
    if (!acepta && !confirm("¿Querés rechazar este presupuesto?")) return;
    iniciar(async () => {
      const r = await responderPresupuesto(token, acepta);
      if (r.ok) {
        setEstado(acepta ? "aceptado" : "rechazado");
        toast.success(r.mensaje);
      } else toast.error(r.error);
    });
  };

  return (
    <div className="no-imprimir flex flex-col gap-3 rounded-[1.5rem] bg-card p-5 sm:p-6">
      {estado === "abierto" && (
        <>
          <p className="text-center font-medium">¿Avanzamos?</p>
          <div className="grid gap-2 sm:grid-cols-[1fr_auto]">
            <Button size="lg" className="h-12 rounded-full text-base" onClick={() => responder(true)} disabled={pendiente}>
              {pendiente ? <Spinner data-icon="inline-start" /> : <CheckIcon data-icon="inline-start" />}
              Aceptar presupuesto
            </Button>
            <Button size="lg" variant="ghost" className="h-12 rounded-full text-muted-foreground" onClick={() => responder(false)} disabled={pendiente}>
              No, gracias
            </Button>
          </div>
        </>
      )}
      {estado === "aceptado" && (
        <m.div initial={{ opacity: 0, y: 8 }} animate={{ opacity: 1, y: 0 }} className="flex flex-col items-center gap-2 py-2 text-center">
          <span className="grid size-12 place-items-center rounded-full bg-exito-suave text-exito">
            <CheckIcon className="size-6" />
          </span>
          <p className="font-semibold">Presupuesto aceptado</p>
          <p className="text-sm text-muted-foreground">Te contactamos para coordinar la seña y la fecha.</p>
        </m.div>
      )}
      {estado === "rechazado" && <p className="text-center text-sm text-muted-foreground">Este presupuesto fue rechazado. Si querés ajustar algo, escribinos.</p>}
      {estado === "vencido" && <p className="text-center text-sm text-muted-foreground">Este presupuesto venció. Escribinos y lo actualizamos.</p>}
      <div className="grid gap-2 sm:grid-cols-2">
        <Button variant="outline" size="lg" className="h-11 rounded-full" onClick={() => window.print()}>
          <DownloadIcon data-icon="inline-start" /> Descargar PDF
        </Button>
        <Button asChild variant="outline" size="lg" className="h-11 rounded-full">
          <a href={whatsapp} target="_blank" rel="noopener">
            <IconoWhatsApp data-icon="inline-start" /> Consultar
          </a>
        </Button>
      </div>
    </div>
  );
}
