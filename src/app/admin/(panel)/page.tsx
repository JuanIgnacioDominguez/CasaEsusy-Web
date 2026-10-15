import Link from "next/link";
import { ArrowRightIcon, BadgeDollarSignIcon, FilePlusIcon, FileTextIcon, InboxIcon, PercentIcon, SearchCheckIcon } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardAction, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Empty, EmptyDescription, EmptyHeader, EmptyTitle } from "@/components/ui/empty";
import { BadgeConsulta, BadgePresupuesto, EncabezadoPagina, Puntaje, TarjetaKpi } from "@/components/admin/comunes";
import { GraficoActividad } from "@/components/admin/GraficoActividad";
import { getAjuste } from "@/lib/ajustes";
import { crearPresupuesto } from "@/lib/acciones/ventas";
import { requerirUsuario } from "@/lib/auth/sesion";
import { listarSeoPaginas, listarServiciosAdmin, resumenInicio } from "@/lib/datos/admin";
import { ORIGENES } from "@/lib/estados";
import { haceCuanto, pesos } from "@/lib/formato";
import { todasLasPaginas } from "@/lib/paginas";
import { analizarPaginas, puntajeTotal } from "@/lib/seo-salud";

export const metadata = { title: "Inicio" };

export default async function InicioPanel() {
  const usuario = await requerirUsuario();
  const [r, seo, negocio, servicios, overrides] = await Promise.all([
    resumenInicio(),
    getAjuste("seo"),
    getAjuste("negocio"),
    listarServiciosAdmin(),
    listarSeoPaginas(),
  ]);
  const analisis = analizarPaginas(todasLasPaginas(seo, negocio, servicios), overrides, seo, servicios);
  const salud = puntajeTotal(analisis);
  const peores = [...analisis].sort((a, b) => a.puntaje - b.puntaje).slice(0, 3);
  const hora = Number(new Intl.DateTimeFormat("es-AR", { hour: "numeric", hour12: false, timeZone: "America/Argentina/Buenos_Aires" }).format(new Date()));
  const saludo = hora < 13 ? "Buen día" : hora < 20 ? "Buenas tardes" : "Buenas noches";

  return (
    <>
      <EncabezadoPagina
        titulo={`${saludo}, ${usuario.nombre.split(" ")[0]}`}
        descripcion={r.nuevas ? `Tenés ${r.nuevas} ${r.nuevas === 1 ? "consulta nueva" : "consultas nuevas"} para responder.` : "Todo al día. No hay consultas sin responder."}
      >
        {usuario.rol !== "contenido" && (
          <>
            <Button asChild variant="outline">
              <Link href="/admin/consultas">
                <InboxIcon data-icon="inline-start" /> Ver consultas
              </Link>
            </Button>
            <form action={async () => { "use server"; await crearPresupuesto(); }}>
              <Button type="submit">
                <FilePlusIcon data-icon="inline-start" /> Nuevo presupuesto
              </Button>
            </form>
          </>
        )}
      </EncabezadoPagina>

      <div className="grid gap-4 sm:grid-cols-2 xl:grid-cols-4">
        <TarjetaKpi acento titulo="Consultas del mes" valor={r.consultasMes} detalle={`${r.nuevas} sin responder`} Icono={InboxIcon} />
        <TarjetaKpi titulo="Presupuestos enviados" valor={r.enviadosMes} detalle={`${r.abiertosCantidad} esperando respuesta`} Icono={FileTextIcon} />
        <TarjetaKpi titulo="Aceptado este mes" valor={pesos(r.aceptadoMonto)} detalle={`${pesos(r.abiertosMonto)} en presupuestos abiertos`} Icono={BadgeDollarSignIcon} />
        <TarjetaKpi titulo="Conversión" valor={`${r.conversion}%`} detalle={`${r.aceptadosMes} aceptados de ${r.enviadosMes} enviados`} Icono={PercentIcon} />
      </div>

      <div className="grid gap-4 xl:grid-cols-[1.6fr_1fr]">
        <Card>
          <CardHeader>
            <CardTitle>Actividad comercial</CardTitle>
            <CardDescription>Consultas recibidas y presupuestos aceptados, últimos 6 meses</CardDescription>
          </CardHeader>
          <CardContent>
            <GraficoActividad datos={r.serie} />
          </CardContent>
        </Card>
        <Card>
          <CardHeader>
            <CardTitle>Salud SEO del sitio</CardTitle>
            <CardDescription>Qué tan listo está para Google y la IA</CardDescription>
            <CardAction>
              <Puntaje valor={salud} className="size-14" />
            </CardAction>
          </CardHeader>
          <CardContent className="flex flex-col gap-3">
            <p className="text-sm text-muted-foreground">Páginas para mejorar:</p>
            {peores.map((p) => (
              <Link key={p.ruta} href={`/admin/seo?ruta=${encodeURIComponent(p.ruta)}`} className="flex items-center gap-3 rounded-lg border p-3 hover:bg-muted">
                <Puntaje valor={p.puntaje} className="size-9" />
                <span className="flex min-w-0 flex-col">
                  <span className="truncate text-sm font-medium">{p.nombre}</span>
                  <span className="truncate text-xs text-muted-foreground">{p.chequeos.find((c) => c.nivel !== "ok")?.texto ?? "Todo en orden"}</span>
                </span>
              </Link>
            ))}
            <Button asChild variant="ghost" className="self-start">
              <Link href="/admin/seo">
                <SearchCheckIcon data-icon="inline-start" /> Abrir SEO
              </Link>
            </Button>
          </CardContent>
        </Card>
      </div>

      <div className="grid gap-4 xl:grid-cols-3">
        <Card className="xl:col-span-1">
          <CardHeader>
            <CardTitle>Últimas consultas</CardTitle>
            <CardAction>
              <Button asChild variant="ghost" size="sm">
                <Link href="/admin/consultas">
                  Todas <ArrowRightIcon data-icon="inline-end" />
                </Link>
              </Button>
            </CardAction>
          </CardHeader>
          <CardContent className="flex flex-col gap-1">
            {r.ultimasConsultas.length === 0 && <VacioCorto texto="Las consultas del formulario aparecen acá." />}
            {r.ultimasConsultas.map((c) => (
              <Link key={c.id} href={`/admin/consultas?id=${c.id}`} className="-mx-2 flex items-center justify-between gap-3 rounded-lg px-2 py-2.5 hover:bg-muted">
                <span className="flex min-w-0 flex-col">
                  <span className="truncate text-sm font-medium">{c.nombre}</span>
                  <span className="truncate text-xs text-muted-foreground">
                    {c.servicio || "Consulta general"} · {ORIGENES[c.origen]} · {haceCuanto(c.creado)}
                  </span>
                </span>
                <BadgeConsulta estado={c.estado} />
              </Link>
            ))}
          </CardContent>
        </Card>
        <Card className="xl:col-span-1">
          <CardHeader>
            <CardTitle>Presupuestos recientes</CardTitle>
            <CardAction>
              <Button asChild variant="ghost" size="sm">
                <Link href="/admin/presupuestos">
                  Todos <ArrowRightIcon data-icon="inline-end" />
                </Link>
              </Button>
            </CardAction>
          </CardHeader>
          <CardContent className="flex flex-col gap-1">
            {r.ultimosPresupuestos.length === 0 && <VacioCorto texto="Creá tu primer presupuesto con el botón de arriba." />}
            {r.ultimosPresupuestos.map((p) => (
              <Link key={p.id} href={`/admin/presupuestos/${p.id}`} className="-mx-2 flex items-center justify-between gap-3 rounded-lg px-2 py-2.5 hover:bg-muted">
                <span className="flex min-w-0 flex-col">
                  <span className="truncate text-sm font-medium">
                    {p.numero} · {p.cliente ?? "Sin cliente"}
                  </span>
                  <span className="truncate text-xs text-muted-foreground">
                    {pesos(p.total)} · {haceCuanto(p.creado)}
                  </span>
                </span>
                <BadgePresupuesto estado={p.estado} />
              </Link>
            ))}
          </CardContent>
        </Card>
        <Card className="xl:col-span-1">
          <CardHeader>
            <CardTitle>Actividad reciente</CardTitle>
            <CardDescription>Quién cambió qué</CardDescription>
          </CardHeader>
          <CardContent>
            <ol className="relative flex flex-col gap-4 border-l pl-4">
              {r.ultimaActividad.map((a) => (
                <li key={a.id} className="relative text-sm">
                  <span className="absolute top-1.5 -left-[1.3rem] size-2 rounded-full bg-border ring-4 ring-card" aria-hidden />
                  <span className="font-medium">{a.usuario}</span> <span className="text-muted-foreground">{a.accion}</span> {a.entidad}
                  {a.detalle && <span className="block truncate text-xs text-muted-foreground">{a.detalle}</span>}
                  <span className="block text-xs text-muted-foreground">{haceCuanto(a.creado)}</span>
                </li>
              ))}
            </ol>
          </CardContent>
        </Card>
      </div>
    </>
  );
}

function VacioCorto({ texto }: { texto: string }) {
  return (
    <Empty className="border py-8">
      <EmptyHeader>
        <EmptyTitle className="text-sm">Nada por acá todavía</EmptyTitle>
        <EmptyDescription>{texto}</EmptyDescription>
      </EmptyHeader>
    </Empty>
  );
}
