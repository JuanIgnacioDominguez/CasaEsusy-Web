import Link from "next/link";
import { notFound } from "next/navigation";
import { ArrowLeftIcon, FilePlusIcon, MailIcon, PhoneIcon } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { BadgeConsulta, BadgePresupuesto, TarjetaKpi } from "@/components/admin/comunes";
import { FormularioCliente } from "@/components/admin/FormularioCliente";
import { IconoWhatsApp } from "@/components/iconos";
import { crearPresupuesto } from "@/lib/acciones/ventas";
import { requerirUsuario } from "@/lib/auth/sesion";
import { getCliente } from "@/lib/datos/admin";
import { fechaCorta, pesos, telefonoWhatsApp } from "@/lib/formato";
import { urlWhatsApp } from "@/lib/whatsapp";
import { BadgeDollarSignIcon, FileTextIcon, InboxIcon } from "lucide-react";

export default async function Cliente({ params }: { params: Promise<{ id: string }> }) {
  await requerirUsuario(["ventas"]);
  const { id } = await params;
  const c = await getCliente(id);
  if (!c) notFound();
  const aceptado = c.presupuestos.filter((p) => p.estado === "aceptado").reduce((a, p) => a + p.total, 0);
  const nuevo = async () => {
    "use server";
    await crearPresupuesto({ clienteId: id });
  };

  return (
    <>
      <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
        <div className="flex items-center gap-3">
          <Button asChild variant="ghost" size="icon" aria-label="Volver">
            <Link href="/admin/clientes">
              <ArrowLeftIcon />
            </Link>
          </Button>
          <div>
            <h1 className="text-2xl font-semibold tracking-tight">{c.nombre}</h1>
            <p className="text-sm text-muted-foreground">Cliente desde {fechaCorta(c.creado)}</p>
          </div>
        </div>
        <div className="flex flex-wrap gap-2">
          {c.telefono && (
            <>
              <Button asChild variant="outline">
                <a href={urlWhatsApp(telefonoWhatsApp(c.telefono))} target="_blank" rel="noopener">
                  <IconoWhatsApp data-icon="inline-start" /> WhatsApp
                </a>
              </Button>
              <Button asChild variant="outline" size="icon" aria-label="Llamar">
                <a href={`tel:${c.telefono}`}>
                  <PhoneIcon />
                </a>
              </Button>
            </>
          )}
          {c.email && (
            <Button asChild variant="outline" size="icon" aria-label="Email">
              <a href={`mailto:${c.email}`}>
                <MailIcon />
              </a>
            </Button>
          )}
          <form action={nuevo}>
            <Button type="submit">
              <FilePlusIcon data-icon="inline-start" /> Nuevo presupuesto
            </Button>
          </form>
        </div>
      </div>

      <div className="grid gap-4 sm:grid-cols-3">
        <TarjetaKpi titulo="Presupuestos" valor={c.presupuestos.length} Icono={FileTextIcon} />
        <TarjetaKpi titulo="Aceptado" valor={pesos(aceptado)} Icono={BadgeDollarSignIcon} acento />
        <TarjetaKpi titulo="Consultas" valor={c.consultas.length} Icono={InboxIcon} />
      </div>

      <div className="grid gap-6 xl:grid-cols-[1.1fr_1fr]">
        <Card>
          <CardHeader>
            <CardTitle>Datos del cliente</CardTitle>
          </CardHeader>
          <CardContent>
            <FormularioCliente inicial={c} />
          </CardContent>
        </Card>
        <div className="flex flex-col gap-6">
          <Card>
            <CardHeader>
              <CardTitle>Presupuestos</CardTitle>
              <CardDescription>Historial completo</CardDescription>
            </CardHeader>
            <CardContent className="flex flex-col gap-1">
              {c.presupuestos.length === 0 && <p className="text-sm text-muted-foreground">Sin presupuestos todavía.</p>}
              {c.presupuestos.map((p) => (
                <Link key={p.id} href={`/admin/presupuestos/${p.id}`} className="-mx-2 flex items-center justify-between gap-3 rounded-lg px-2 py-2.5 hover:bg-muted">
                  <span className="flex flex-col">
                    <span className="text-sm font-medium tabular-nums">
                      {p.numero} · {pesos(p.total)}
                    </span>
                    <span className="text-xs text-muted-foreground">
                      {p.titulo || "Sin título"} · {fechaCorta(p.creado)}
                    </span>
                  </span>
                  <BadgePresupuesto estado={p.estado} />
                </Link>
              ))}
            </CardContent>
          </Card>
          <Card>
            <CardHeader>
              <CardTitle>Consultas</CardTitle>
            </CardHeader>
            <CardContent className="flex flex-col gap-1">
              {c.consultas.length === 0 && <p className="text-sm text-muted-foreground">Sin consultas asociadas.</p>}
              {c.consultas.map((q) => (
                <Link key={q.id} href={`/admin/consultas?id=${q.id}`} className="-mx-2 flex items-center justify-between gap-3 rounded-lg px-2 py-2.5 hover:bg-muted">
                  <span className="flex flex-col">
                    <span className="text-sm font-medium">{q.servicio || "Consulta general"}</span>
                    <span className="text-xs text-muted-foreground">{fechaCorta(q.creado)}</span>
                  </span>
                  <BadgeConsulta estado={q.estado} />
                </Link>
              ))}
            </CardContent>
          </Card>
        </div>
      </div>
    </>
  );
}
