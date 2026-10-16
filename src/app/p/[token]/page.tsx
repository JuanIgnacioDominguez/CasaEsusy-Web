import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { eq } from "drizzle-orm";
import { CalendarIcon, MapPinIcon, PhoneIcon } from "lucide-react";
import { AccionesPresupuesto } from "@/components/sitio/AccionesPresupuesto";
import { Logo } from "@/components/sitio/Logo";
import { getAjuste } from "@/lib/ajustes";
import { obtenerUsuario } from "@/lib/auth/sesion";
import { getPresupuestoPorToken } from "@/lib/datos/admin";
import { db, schema } from "@/lib/db";
import { ESTADO_PRESUPUESTO } from "@/lib/estados";
import { fechaLarga, pesos } from "@/lib/formato";
import { calcularTotales } from "@/lib/presupuestos/calculos";
import { cn } from "@/lib/utils";
import { urlWhatsApp } from "@/lib/whatsapp";

export const dynamic = "force-dynamic";
export const metadata: Metadata = { title: "Presupuesto", robots: { index: false, follow: false } };

export default async function PresupuestoPublico({ params }: { params: Promise<{ token: string }> }) {
  const { token } = await params;
  if (!/^[a-f0-9]{32}$/.test(token)) notFound();
  const [p, negocio, usuario] = await Promise.all([getPresupuestoPorToken(token), getAjuste("negocio"), obtenerUsuario()]);
  if (!p) notFound();

  // Primera vez que lo abre el cliente (no alguien del equipo): queda como "visto".
  if (p.estado === "enviado" && !usuario) {
    await db.update(schema.presupuestos).set({ estado: "visto", visto: new Date().toISOString() }).where(eq(schema.presupuestos.id, p.id));
  }

  const t = calcularTotales(p.items.map((i) => i.total), p.descuentoPct, p.ivaPct, p.senaPct);
  const hoy = new Date().toISOString().slice(0, 10);
  const vencido = p.validoHasta < hoy && p.estado !== "aceptado" && p.estado !== "rechazado";
  const grupos = new Map<string, typeof p.items>();
  for (const it of p.items) grupos.set(it.ambiente || "General", [...(grupos.get(it.ambiente || "General") ?? []), it]);
  const consulta = urlWhatsApp(negocio.whatsapp, `Hola, tengo una consulta sobre el presupuesto ${p.numero}.`);

  return (
    <main className="min-h-dvh bg-lino py-6 sm:py-12 print:bg-white print:py-0">
      <div className="mx-auto flex max-w-3xl flex-col gap-4 px-3 sm:px-6">
        <article className="overflow-hidden rounded-[1.75rem] bg-card shadow-[0_30px_60px_-40px_rgb(42_47_53/0.35)] print:rounded-none print:shadow-none">
          <header className="flex flex-col gap-6 border-b p-6 sm:flex-row sm:items-start sm:justify-between sm:p-10">
            <div className="flex flex-col gap-3">
              <Logo className="h-11" />
              <div className="flex flex-col gap-1 text-xs text-muted-foreground">
                <span className="flex items-center gap-1.5">
                  <MapPinIcon className="size-3.5" /> {negocio.calle}, {negocio.localidad}
                </span>
                <span className="flex items-center gap-1.5">
                  <PhoneIcon className="size-3.5" /> {negocio.telefonoVisible}
                </span>
              </div>
            </div>
            <div className="flex flex-col gap-1 sm:text-right">
              <span className="rotulo text-acento">Presupuesto</span>
              <span className="text-2xl font-semibold tabular-nums">{p.numero}</span>
              <span className="text-sm text-muted-foreground">Emitido el {fechaLarga(p.creado)}</span>
              <span className={cn("flex items-center gap-1.5 text-sm sm:justify-end", vencido ? "text-destructive" : "text-muted-foreground")}>
                <CalendarIcon className="size-3.5" /> {vencido ? "Venció" : "Válido hasta"} el {fechaLarga(`${p.validoHasta}T12:00:00`)}
              </span>
            </div>
          </header>

          <section className="grid gap-6 border-b p-6 sm:grid-cols-2 sm:p-10">
            <div className="flex flex-col gap-1">
              <span className="text-xs font-medium text-muted-foreground">Para</span>
              <span className="text-lg font-semibold">{p.cliente?.nombre ?? "Cliente"}</span>
              {p.cliente?.direccion && <span className="text-sm text-muted-foreground">{[p.cliente.direccion, p.cliente.localidad].filter(Boolean).join(", ")}</span>}
            </div>
            {p.titulo && (
              <div className="flex flex-col gap-1">
                <span className="text-xs font-medium text-muted-foreground">Trabajo</span>
                <span className="text-lg font-semibold">{p.titulo}</span>
              </div>
            )}
          </section>

          <section className="flex flex-col gap-8 p-6 sm:p-10">
            {[...grupos.entries()].map(([ambiente, items]) => (
              <div key={ambiente} className="flex flex-col gap-3">
                {grupos.size > 1 && <h2 className="rotulo text-muted-foreground">{ambiente}</h2>}
                <ul className="flex flex-col divide-y">
                  {items.map((it) => (
                    <li key={it.id} className="flex flex-col gap-1 py-3 first:pt-0">
                      <div className="flex items-start justify-between gap-4">
                        <span className="font-medium">{it.descripcion}</span>
                        <span className="font-semibold whitespace-nowrap tabular-nums">{pesos(it.total)}</span>
                      </div>
                      {it.desglose.length > 0 ? (
                        <span className="text-sm text-muted-foreground">
                          {it.desglose.map((l) => `${l.concepto} (${l.cantidad.toLocaleString("es-AR")} ${l.unidad})`).join(" · ")}
                        </span>
                      ) : (
                        it.cantidad !== 1 && (
                          <span className="text-sm text-muted-foreground">
                            {it.cantidad.toLocaleString("es-AR")} × {pesos(it.precioUnitario)}
                          </span>
                        )
                      )}
                    </li>
                  ))}
                </ul>
              </div>
            ))}
            {p.items.length === 0 && <p className="text-muted-foreground">Este presupuesto todavía no tiene ítems.</p>}
          </section>

          <section className="flex flex-col gap-2 border-t bg-muted/40 p-6 text-sm sm:p-10 print:bg-white">
            <Linea titulo="Subtotal" valor={pesos(t.subtotal)} />
            {t.descuento > 0 && <Linea titulo={`Descuento (${p.descuentoPct}%)`} valor={`− ${pesos(t.descuento)}`} />}
            {t.iva > 0 && <Linea titulo={`IVA (${p.ivaPct}%)`} valor={pesos(t.iva)} />}
            <div className="mt-2 flex items-end justify-between border-t pt-4">
              <span className="text-base font-semibold">Total</span>
              <span className="text-3xl font-semibold tracking-tight tabular-nums">{pesos(t.total)}</span>
            </div>
            {p.senaPct > 0 && (
              <p className="text-muted-foreground">
                Seña del {p.senaPct}% para empezar: <span className="font-medium text-foreground">{pesos(t.sena)}</span> · Saldo contra entrega:{" "}
                <span className="font-medium text-foreground">{pesos(t.saldo)}</span>
              </p>
            )}
          </section>

          {(p.notas || p.condiciones) && (
            <section className="grid gap-6 border-t p-6 text-sm sm:grid-cols-2 sm:p-10">
              {p.notas && (
                <div className="flex flex-col gap-1.5">
                  <span className="text-xs font-medium text-muted-foreground">Notas</span>
                  <p className="leading-relaxed whitespace-pre-line">{p.notas}</p>
                </div>
              )}
              {p.condiciones && (
                <div className="flex flex-col gap-1.5">
                  <span className="text-xs font-medium text-muted-foreground">Condiciones</span>
                  <p className="leading-relaxed whitespace-pre-line text-muted-foreground">{p.condiciones}</p>
                </div>
              )}
            </section>
          )}
        </article>

        <AccionesPresupuesto
          token={token}
          estado={vencido ? "vencido" : p.estado === "visto" || p.estado === "enviado" || p.estado === "borrador" ? "abierto" : p.estado}
          etiquetaEstado={ESTADO_PRESUPUESTO[p.estado].etiqueta}
          whatsapp={consulta}
        />
        <p className="no-imprimir pb-6 text-center text-xs text-muted-foreground">
          {negocio.nombre} · {negocio.lema}
        </p>
      </div>
    </main>
  );
}

function Linea({ titulo, valor }: { titulo: string; valor: string }) {
  return (
    <div className="flex justify-between gap-3">
      <span className="text-muted-foreground">{titulo}</span>
      <span className="tabular-nums">{valor}</span>
    </div>
  );
}
