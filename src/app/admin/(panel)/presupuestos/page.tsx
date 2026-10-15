import Link from "next/link";
import { CheckCircle2Icon, ClockIcon, FilePenLineIcon, FilePlusIcon, FileTextIcon } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Empty, EmptyContent, EmptyDescription, EmptyHeader, EmptyMedia, EmptyTitle } from "@/components/ui/empty";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { BadgePresupuesto, EncabezadoPagina, TarjetaKpi } from "@/components/admin/comunes";
import { FiltrosPresupuestos } from "@/components/admin/FiltrosPresupuestos";
import { crearPresupuesto } from "@/lib/acciones/ventas";
import { requerirUsuario } from "@/lib/auth/sesion";
import { listarPresupuestos } from "@/lib/datos/admin";
import { ESTADOS_PRESUPUESTO, type EstadoPresupuesto } from "@/lib/db/schema";
import { fechaCorta, pesos } from "@/lib/formato";

export const metadata = { title: "Presupuestos" };

export default async function Presupuestos({ searchParams }: { searchParams: Promise<{ estado?: string; q?: string }> }) {
  await requerirUsuario(["ventas"]);
  const sp = await searchParams;
  const estado = (ESTADOS_PRESUPUESTO as readonly string[]).includes(sp.estado ?? "") ? (sp.estado as EstadoPresupuesto) : "todos";
  const { filas, conteos } = await listarPresupuestos(estado, sp.q);
  const c = (e: EstadoPresupuesto) => conteos.find((x) => x.estado === e);
  const abiertos = (c("enviado")?.n ?? 0) + (c("visto")?.n ?? 0);
  const montoAbierto = (c("enviado")?.total ?? 0) + (c("visto")?.total ?? 0);
  const hoy = new Date().toISOString().slice(0, 10);
  const nuevo = async () => {
    "use server";
    await crearPresupuesto();
  };

  return (
    <>
      <EncabezadoPagina titulo="Presupuestos" descripcion="Armá presupuestos con las calculadoras, mandalos por WhatsApp y que el cliente los acepte online.">
        <form action={nuevo}>
          <Button type="submit">
            <FilePlusIcon data-icon="inline-start" /> Nuevo presupuesto
          </Button>
        </form>
      </EncabezadoPagina>

      <div className="grid gap-4 sm:grid-cols-2 xl:grid-cols-4">
        <TarjetaKpi titulo="Borradores" valor={c("borrador")?.n ?? 0} detalle="Sin enviar todavía" Icono={FilePenLineIcon} />
        <TarjetaKpi titulo="Esperando respuesta" valor={abiertos} detalle={pesos(montoAbierto)} Icono={ClockIcon} />
        <TarjetaKpi acento titulo="Aceptados" valor={pesos(c("aceptado")?.total ?? 0)} detalle={`${c("aceptado")?.n ?? 0} presupuestos`} Icono={CheckCircle2Icon} />
        <TarjetaKpi titulo="Total emitidos" valor={conteos.reduce((a, x) => a + x.n, 0)} detalle="Desde el inicio" Icono={FileTextIcon} />
      </div>

      <FiltrosPresupuestos estado={estado} busqueda={sp.q ?? ""} conteos={Object.fromEntries(conteos.map((x) => [x.estado, x.n]))} />

      {filas.length === 0 ? (
        <Empty className="border bg-card py-16">
          <EmptyHeader>
            <EmptyMedia variant="icon">
              <FileTextIcon />
            </EmptyMedia>
            <EmptyTitle>No hay presupuestos {estado !== "todos" ? "con este estado" : "todavía"}</EmptyTitle>
            <EmptyDescription>Creá uno desde cero o desde una consulta con “Armar presupuesto”.</EmptyDescription>
          </EmptyHeader>
          <EmptyContent>
            <form action={nuevo}>
              <Button type="submit">
                <FilePlusIcon data-icon="inline-start" /> Nuevo presupuesto
              </Button>
            </form>
          </EmptyContent>
        </Empty>
      ) : (
        <Card className="gap-0 overflow-hidden py-0">
          <Table>
            <TableHeader>
              <TableRow className="bg-muted/50 hover:bg-muted/50">
                <TableHead className="pl-4">Número</TableHead>
                <TableHead>Cliente</TableHead>
                <TableHead className="hidden lg:table-cell">Detalle</TableHead>
                <TableHead className="hidden md:table-cell">Validez</TableHead>
                <TableHead className="text-right">Total</TableHead>
                <TableHead className="pr-4 text-right">Estado</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {filas.map((p) => {
                const vencido = p.validoHasta < hoy && (p.estado === "enviado" || p.estado === "visto");
                return (
                  <TableRow key={p.id} className="relative">
                    <TableCell className="pl-4 font-medium tabular-nums">
                      <Link href={`/admin/presupuestos/${p.id}`} className="after:absolute after:inset-0">
                        {p.numero}
                      </Link>
                    </TableCell>
                    <TableCell>{p.cliente ?? <span className="text-muted-foreground">Sin cliente</span>}</TableCell>
                    <TableCell className="hidden max-w-64 truncate text-muted-foreground lg:table-cell">{p.titulo || "—"}</TableCell>
                    <TableCell className={`hidden md:table-cell ${vencido ? "text-destructive" : "text-muted-foreground"}`}>
                      {fechaCorta(`${p.validoHasta}T12:00:00`)}
                    </TableCell>
                    <TableCell className="text-right font-medium tabular-nums">{pesos(p.total)}</TableCell>
                    <TableCell className="pr-4 text-right">
                      <BadgePresupuesto estado={vencido ? "vencido" : p.estado} />
                    </TableCell>
                  </TableRow>
                );
              })}
            </TableBody>
          </Table>
        </Card>
      )}
    </>
  );
}
