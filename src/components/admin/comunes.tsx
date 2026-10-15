import type { LucideIcon } from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import type { EstadoConsulta, EstadoPresupuesto } from "@/lib/db/schema";
import { ESTADO_CONSULTA, ESTADO_PRESUPUESTO } from "@/lib/estados";
import { cn } from "@/lib/utils";

export function EncabezadoPagina({
  titulo,
  descripcion,
  children,
}: {
  titulo: string;
  descripcion?: React.ReactNode;
  children?: React.ReactNode;
}) {
  return (
    <div className="flex flex-col gap-4 sm:flex-row sm:items-end sm:justify-between">
      <div className="flex min-w-0 flex-col gap-1">
        <h1 className="text-2xl font-semibold tracking-tight sm:text-[1.75rem]">{titulo}</h1>
        {descripcion && <p className="text-sm text-muted-foreground sm:text-[0.95rem]">{descripcion}</p>}
      </div>
      {children && <div className="flex shrink-0 flex-wrap items-center gap-2">{children}</div>}
    </div>
  );
}

export function BadgeConsulta({ estado }: { estado: EstadoConsulta }) {
  const m = ESTADO_CONSULTA[estado];
  return (
    <Badge variant="secondary" className={cn("gap-1.5 border-0", m.clase)}>
      <span className={cn("size-1.5 rounded-full", m.punto)} aria-hidden />
      {m.etiqueta}
    </Badge>
  );
}

export function BadgePresupuesto({ estado }: { estado: EstadoPresupuesto }) {
  const m = ESTADO_PRESUPUESTO[estado];
  return (
    <Badge variant="secondary" className={cn("gap-1.5 border-0", m.clase)}>
      <span className={cn("size-1.5 rounded-full", m.punto)} aria-hidden />
      {m.etiqueta}
    </Badge>
  );
}

export function TarjetaKpi({
  titulo,
  valor,
  detalle,
  Icono,
  acento = false,
}: {
  titulo: string;
  valor: React.ReactNode;
  detalle?: React.ReactNode;
  Icono: LucideIcon;
  acento?: boolean;
}) {
  return (
    <Card className={cn("gap-3", acento && "bg-pizarra text-marfil ring-0 dark:bg-card dark:text-card-foreground")}>
      <CardHeader className="flex flex-row items-center justify-between gap-2">
        <CardDescription className={cn("text-sm font-medium", acento && "text-marfil/70 dark:text-muted-foreground")}>{titulo}</CardDescription>
        <span className={cn("grid size-8 place-items-center rounded-lg bg-muted text-muted-foreground", acento && "bg-marfil/10 text-marfil dark:bg-muted dark:text-muted-foreground")}>
          <Icono className="size-4" />
        </span>
      </CardHeader>
      <CardContent className="flex flex-col gap-1">
        <CardTitle className="text-[1.75rem] leading-none font-semibold tracking-tight tabular-nums">{valor}</CardTitle>
        {detalle && <p className={cn("text-xs text-muted-foreground", acento && "text-marfil/60 dark:text-muted-foreground")}>{detalle}</p>}
      </CardContent>
    </Card>
  );
}

export function Puntaje({ valor, className }: { valor: number; className?: string }) {
  const color = valor >= 85 ? "text-exito" : valor >= 60 ? "text-aviso" : "text-destructive";
  const trazo = valor >= 85 ? "stroke-exito" : valor >= 60 ? "stroke-aviso" : "stroke-destructive";
  const c = 2 * Math.PI * 16;
  return (
    <span className={cn("relative inline-grid size-11 place-items-center", className)} role="img" aria-label={`Puntaje ${valor} de 100`}>
      <svg viewBox="0 0 40 40" className="absolute inset-0 -rotate-90">
        <circle cx="20" cy="20" r="16" fill="none" strokeWidth="4" className="stroke-muted" />
        <circle cx="20" cy="20" r="16" fill="none" strokeWidth="4" strokeLinecap="round" className={trazo} strokeDasharray={c} strokeDashoffset={c * (1 - valor / 100)} />
      </svg>
      <span className={cn("text-xs font-semibold tabular-nums", color)}>{valor}</span>
    </span>
  );
}
