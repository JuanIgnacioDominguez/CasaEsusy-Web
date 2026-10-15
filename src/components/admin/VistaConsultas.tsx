"use client";

import { useEffect, useState, useTransition } from "react";
import Link from "next/link";
import { usePathname, useRouter, useSearchParams } from "next/navigation";
import { FilePlusIcon, InboxIcon, MailIcon, PhoneIcon, PlusIcon, SearchIcon, Trash2Icon } from "lucide-react";
import { toast } from "sonner";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Empty, EmptyDescription, EmptyHeader, EmptyMedia, EmptyTitle } from "@/components/ui/empty";
import { Field, FieldGroup, FieldLabel } from "@/components/ui/field";
import { Input } from "@/components/ui/input";
import { InputGroup, InputGroupAddon, InputGroupInput } from "@/components/ui/input-group";
import { Select, SelectContent, SelectGroup, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Separator } from "@/components/ui/separator";
import { Sheet, SheetContent, SheetDescription, SheetFooter, SheetHeader, SheetTitle } from "@/components/ui/sheet";
import { Spinner } from "@/components/ui/spinner";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Tabs, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Textarea } from "@/components/ui/textarea";
import { BadgeConsulta } from "@/components/admin/comunes";
import { IconoWhatsApp } from "@/components/iconos";
import { actualizarConsulta, crearConsulta, crearPresupuesto, eliminarConsulta } from "@/lib/acciones/ventas";
import { ESTADOS_CONSULTA, type Consulta, type EstadoConsulta } from "@/lib/db/schema";
import { ESTADO_CONSULTA, ORIGENES } from "@/lib/estados";
import { fechaHora, haceCuanto, telefonoWhatsApp } from "@/lib/formato";
import { urlWhatsApp } from "@/lib/whatsapp";

export function VistaConsultas({
  filas,
  conteos,
  total,
  estado,
  busqueda,
  abiertaId,
  crearAbierto,
  servicios,
  presupuestos,
}: {
  filas: Consulta[];
  conteos: Record<string, number>;
  total: number;
  estado: string;
  busqueda: string;
  abiertaId?: string;
  crearAbierto: boolean;
  servicios: string[];
  presupuestos: { consultaId: string | null; id: string; numero: string }[];
}) {
  const router = useRouter();
  const pathname = usePathname();
  const params = useSearchParams();
  const [q, setQ] = useState(busqueda);
  const [seleccion, setSeleccion] = useState<string | null>(abiertaId ?? null);
  const [creando, setCreando] = useState(crearAbierto);
  const actual = filas.find((f) => f.id === seleccion);

  const navegar = (cambios: Record<string, string | null>) => {
    const p = new URLSearchParams(params.toString());
    for (const [k, v] of Object.entries(cambios)) (v ? p.set(k, v) : p.delete(k));
    router.replace(`${pathname}?${p.toString()}`, { scroll: false });
  };

  useEffect(() => {
    const t = setTimeout(() => q !== busqueda && navegar({ q: q || null }), 350);
    return () => clearTimeout(t);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [q]);

  return (
    <div className="flex flex-col gap-4">
      <div className="flex flex-col gap-3 lg:flex-row lg:items-center lg:justify-between">
        <Tabs value={estado} onValueChange={(v) => navegar({ estado: v === "todas" ? null : v })} className="no-scrollbar max-w-full overflow-x-auto">
          <TabsList>
            <TabsTrigger value="todas">Todas · {total}</TabsTrigger>
            {ESTADOS_CONSULTA.map((e) => (
              <TabsTrigger key={e} value={e}>
                {ESTADO_CONSULTA[e].etiqueta} · {conteos[e] ?? 0}
              </TabsTrigger>
            ))}
          </TabsList>
        </Tabs>
        <div className="flex gap-2">
          <InputGroup className="sm:w-64">
            <InputGroupAddon>
              <SearchIcon />
            </InputGroupAddon>
            <InputGroupInput value={q} onChange={(e) => setQ(e.target.value)} placeholder="Buscar nombre, teléfono…" />
          </InputGroup>
          <Button onClick={() => setCreando(true)}>
            <PlusIcon data-icon="inline-start" /> Cargar
          </Button>
        </div>
      </div>

      {filas.length === 0 ? (
        <Empty className="border bg-card py-16">
          <EmptyHeader>
            <EmptyMedia variant="icon">
              <InboxIcon />
            </EmptyMedia>
            <EmptyTitle>{busqueda || estado !== "todas" ? "Sin resultados" : "Todavía no hay consultas"}</EmptyTitle>
            <EmptyDescription>
              Las consultas del formulario del sitio llegan acá automáticamente. También podés cargar las que te llegan por WhatsApp.
            </EmptyDescription>
          </EmptyHeader>
        </Empty>
      ) : (
        <Card className="gap-0 overflow-hidden py-0">
          <Table>
            <TableHeader>
              <TableRow className="bg-muted/50 hover:bg-muted/50">
                <TableHead className="pl-4">Contacto</TableHead>
                <TableHead className="hidden md:table-cell">Servicio</TableHead>
                <TableHead className="hidden lg:table-cell">Origen</TableHead>
                <TableHead className="hidden sm:table-cell">Recibida</TableHead>
                <TableHead className="pr-4 text-right">Estado</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {filas.map((c) => (
                <TableRow key={c.id} className="cursor-pointer" onClick={() => setSeleccion(c.id)} data-state={c.id === seleccion ? "selected" : undefined}>
                  <TableCell className="pl-4">
                    <span className="flex flex-col">
                      <span className="font-medium">{c.nombre}</span>
                      <span className="text-xs text-muted-foreground">{c.telefono || c.email}</span>
                    </span>
                  </TableCell>
                  <TableCell className="hidden max-w-56 truncate md:table-cell">{c.servicio || "—"}</TableCell>
                  <TableCell className="hidden text-muted-foreground lg:table-cell">{ORIGENES[c.origen]}</TableCell>
                  <TableCell className="hidden text-muted-foreground sm:table-cell">{haceCuanto(c.creado)}</TableCell>
                  <TableCell className="pr-4 text-right">
                    <BadgeConsulta estado={c.estado} />
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </Card>
      )}

      <Sheet open={!!actual} onOpenChange={(o) => !o && setSeleccion(null)}>
        <SheetContent className="w-full gap-0 overflow-y-auto sm:max-w-lg">
          {actual && <DetalleConsulta key={actual.id} c={actual} presupuestos={presupuestos.filter((p) => p.consultaId === actual.id)} onCerrar={() => setSeleccion(null)} />}
        </SheetContent>
      </Sheet>

      <NuevaConsulta abierta={creando} onCambio={setCreando} servicios={servicios} />
    </div>
  );
}

function DetalleConsulta({ c, presupuestos, onCerrar }: { c: Consulta; presupuestos: { id: string; numero: string }[]; onCerrar: () => void }) {
  const [notas, setNotas] = useState(c.notas);
  const [pendiente, iniciar] = useTransition();
  const wa = c.telefono ? urlWhatsApp(telefonoWhatsApp(c.telefono), `Hola ${c.nombre.split(" ")[0]}, te escribimos de Casa Esusy por tu consulta${c.servicio ? ` de ${c.servicio.toLowerCase()}` : ""}.`) : null;
  const d = c.detalles;

  const cambiarEstado = (estado: EstadoConsulta) =>
    iniciar(async () => {
      const r = await actualizarConsulta(c.id, { estado });
      if (r.ok) toast.success(`Marcada como ${ESTADO_CONSULTA[estado].etiqueta.toLowerCase()}`);
      else toast.error(r.error);
    });

  return (
    <>
      <SheetHeader className="gap-3 border-b p-6">
        <div className="flex items-center gap-2">
          <BadgeConsulta estado={c.estado} />
          <span className="text-xs text-muted-foreground">
            {ORIGENES[c.origen]} · {fechaHora(c.creado)}
          </span>
        </div>
        <SheetTitle className="text-xl">{c.nombre}</SheetTitle>
        <SheetDescription>{c.servicio || "Consulta general"}</SheetDescription>
        <div className="flex flex-wrap gap-2">
          {wa && (
            <Button asChild size="sm" className="bg-whatsapp text-white hover:bg-[#1FB855]">
              <a href={wa} target="_blank" rel="noopener">
                <IconoWhatsApp data-icon="inline-start" /> WhatsApp
              </a>
            </Button>
          )}
          {c.telefono && (
            <Button asChild size="sm" variant="outline">
              <a href={`tel:${c.telefono}`}>
                <PhoneIcon data-icon="inline-start" /> Llamar
              </a>
            </Button>
          )}
          {c.email && (
            <Button asChild size="sm" variant="outline">
              <a href={`mailto:${c.email}`}>
                <MailIcon data-icon="inline-start" /> Email
              </a>
            </Button>
          )}
        </div>
      </SheetHeader>
      <div className="flex flex-col gap-6 p-6">
        <dl className="grid grid-cols-2 gap-4 text-sm">
          <Dato titulo="Teléfono" valor={c.telefono} />
          <Dato titulo="Email" valor={c.email} />
          <Dato titulo="Ambientes" valor={d.ambientes} />
          <Dato titulo="Zona" valor={d.zona} />
          <Dato titulo="Medidas" valor={d.medidas} />
          <Dato titulo="Visita" valor={d.conVisita === undefined ? "" : d.conVisita ? "Quiere que vayan a medir" : "No por ahora"} />
        </dl>
        {c.mensaje && (
          <div className="flex flex-col gap-1.5">
            <p className="text-xs font-medium text-muted-foreground">Mensaje</p>
            <p className="rounded-xl bg-muted p-4 text-sm leading-relaxed whitespace-pre-line">{c.mensaje}</p>
          </div>
        )}
        <Separator />
        <FieldGroup>
          <Field>
            <FieldLabel>Estado</FieldLabel>
            <Select value={c.estado} onValueChange={(v) => cambiarEstado(v as EstadoConsulta)} disabled={pendiente}>
              <SelectTrigger className="w-full">
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                <SelectGroup>
                  {ESTADOS_CONSULTA.map((e) => (
                    <SelectItem key={e} value={e}>
                      {ESTADO_CONSULTA[e].etiqueta}
                    </SelectItem>
                  ))}
                </SelectGroup>
              </SelectContent>
            </Select>
          </Field>
          <Field>
            <FieldLabel htmlFor="notas">Notas internas</FieldLabel>
            <Textarea
              id="notas"
              value={notas}
              onChange={(e) => setNotas(e.target.value)}
              onBlur={() =>
                notas !== c.notas &&
                iniciar(async () => {
                  const r = await actualizarConsulta(c.id, { notas });
                  if (r.ok) toast.success("Notas guardadas");
                  else toast.error(r.error);
                })
              }
              placeholder="Ej.: pasa el sábado por el local a ver telas"
              className="min-h-24"
            />
          </Field>
        </FieldGroup>
        {presupuestos.length > 0 && (
          <div className="flex flex-col gap-2">
            <p className="text-xs font-medium text-muted-foreground">Presupuestos</p>
            {presupuestos.map((p) => (
              <Link key={p.id} href={`/admin/presupuestos/${p.id}`} className="rounded-lg border px-3 py-2 text-sm font-medium hover:bg-muted">
                {p.numero}
              </Link>
            ))}
          </div>
        )}
      </div>
      <SheetFooter className="mt-auto flex-row border-t p-4">
        <Button
          variant="ghost"
          className="text-destructive hover:text-destructive"
          disabled={pendiente}
          onClick={() => {
            if (!confirm("¿Eliminar esta consulta? No se puede deshacer.")) return;
            iniciar(async () => {
              const r = await eliminarConsulta(c.id);
              if (r.ok) {
                toast.success(r.mensaje);
                onCerrar();
              } else toast.error(r.error);
            });
          }}
        >
          <Trash2Icon data-icon="inline-start" /> Eliminar
        </Button>
        <Button className="ml-auto" disabled={pendiente} onClick={() => iniciar(() => crearPresupuesto({ consultaId: c.id }))}>
          {pendiente ? <Spinner data-icon="inline-start" /> : <FilePlusIcon data-icon="inline-start" />}
          Armar presupuesto
        </Button>
      </SheetFooter>
    </>
  );
}

function Dato({ titulo, valor }: { titulo: string; valor?: string }) {
  return (
    <div className="flex flex-col gap-0.5">
      <dt className="text-xs text-muted-foreground">{titulo}</dt>
      <dd className="font-medium break-words">{valor || "—"}</dd>
    </div>
  );
}

function NuevaConsulta({ abierta, onCambio, servicios }: { abierta: boolean; onCambio: (v: boolean) => void; servicios: string[] }) {
  const [pendiente, iniciar] = useTransition();
  const [datos, setDatos] = useState({ nombre: "", telefono: "", email: "", servicio: "", mensaje: "", origen: "whatsapp" as const });
  const set = (k: keyof typeof datos, v: string) => setDatos((d) => ({ ...d, [k]: v }));
  return (
    <Dialog open={abierta} onOpenChange={onCambio}>
      <DialogContent className="sm:max-w-lg">
        <DialogHeader>
          <DialogTitle>Cargar consulta</DialogTitle>
          <DialogDescription>Para registrar consultas que llegan por WhatsApp, teléfono, Instagram o en el local.</DialogDescription>
        </DialogHeader>
        <form
          id="nueva-consulta"
          onSubmit={(e) => {
            e.preventDefault();
            iniciar(async () => {
              const r = await crearConsulta(datos);
              if (r.ok) {
                toast.success(r.mensaje);
                onCambio(false);
                setDatos({ nombre: "", telefono: "", email: "", servicio: "", mensaje: "", origen: "whatsapp" });
              } else toast.error(r.error);
            });
          }}
        >
          <FieldGroup>
            <div className="grid gap-4 sm:grid-cols-2">
              <Field>
                <FieldLabel htmlFor="nc-nombre">Nombre</FieldLabel>
                <Input id="nc-nombre" required value={datos.nombre} onChange={(e) => set("nombre", e.target.value)} />
              </Field>
              <Field>
                <FieldLabel htmlFor="nc-tel">Teléfono</FieldLabel>
                <Input id="nc-tel" type="tel" value={datos.telefono} onChange={(e) => set("telefono", e.target.value)} />
              </Field>
            </div>
            <div className="grid gap-4 sm:grid-cols-2">
              <Field>
                <FieldLabel>Servicio</FieldLabel>
                <Select value={datos.servicio} onValueChange={(v) => set("servicio", v)}>
                  <SelectTrigger className="w-full">
                    <SelectValue placeholder="Elegí" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectGroup>
                      {servicios.map((s) => (
                        <SelectItem key={s} value={s}>
                          {s}
                        </SelectItem>
                      ))}
                    </SelectGroup>
                  </SelectContent>
                </Select>
              </Field>
              <Field>
                <FieldLabel>Origen</FieldLabel>
                <Select value={datos.origen} onValueChange={(v) => set("origen", v)}>
                  <SelectTrigger className="w-full">
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectGroup>
                      {Object.entries(ORIGENES).map(([k, v]) => (
                        <SelectItem key={k} value={k}>
                          {v}
                        </SelectItem>
                      ))}
                    </SelectGroup>
                  </SelectContent>
                </Select>
              </Field>
            </div>
            <Field>
              <FieldLabel htmlFor="nc-msg">Detalle</FieldLabel>
              <Textarea id="nc-msg" value={datos.mensaje} onChange={(e) => set("mensaje", e.target.value)} placeholder="Qué necesita, medidas, cuándo…" />
            </Field>
          </FieldGroup>
        </form>
        <DialogFooter>
          <Button variant="outline" onClick={() => onCambio(false)}>
            Cancelar
          </Button>
          <Button type="submit" form="nueva-consulta" disabled={pendiente}>
            {pendiente && <Spinner data-icon="inline-start" />}
            Guardar
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
