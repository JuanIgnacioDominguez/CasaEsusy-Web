"use client";

import { useEffect, useMemo, useState, useTransition } from "react";
import Link from "next/link";
import { AnimatePresence } from "motion/react";
import * as m from "motion/react-m";
import {
  ArrowLeftIcon,
  CheckIcon,
  ChevronDownIcon,
  ChevronsUpDownIcon,
  CopyIcon,
  EllipsisIcon,
  ExternalLinkIcon,
  GripVerticalIcon,
  PlusIcon,
  SaveIcon,
  TagIcon,
  Trash2Icon,
  UserPlusIcon,
  XCircleIcon,
} from "lucide-react";
import { toast } from "sonner";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Command, CommandEmpty, CommandGroup, CommandInput, CommandItem, CommandList } from "@/components/ui/command";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuGroup,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Field, FieldGroup, FieldLabel } from "@/components/ui/field";
import { Input } from "@/components/ui/input";
import { InputGroup, InputGroupAddon, InputGroupInput, InputGroupText } from "@/components/ui/input-group";
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover";
import { Separator } from "@/components/ui/separator";
import { Spinner } from "@/components/ui/spinner";
import { Textarea } from "@/components/ui/textarea";
import { BadgePresupuesto } from "@/components/admin/comunes";
import { IconoWhatsApp } from "@/components/iconos";
import {
  cambiarEstadoPresupuesto,
  duplicarPresupuesto,
  eliminarPresupuesto,
  guardarCliente,
  guardarPresupuesto,
} from "@/lib/acciones/ventas";
import type { Cliente, Consulta, Precio, Presupuesto, PresupuestoItem, TipoItem } from "@/lib/db/schema";
import { pesos, telefonoWhatsApp } from "@/lib/formato";
import { calcularTotales } from "@/lib/presupuestos/calculos";
import { calcularItem, ENTRADAS_DEFECTO, TIPOS_ITEM, type ItemEditable } from "@/lib/presupuestos/items";
import { cn } from "@/lib/utils";
import { urlWhatsApp } from "@/lib/whatsapp";

type PresupuestoCompleto = Presupuesto & { items: PresupuestoItem[]; cliente: Cliente | null; consulta: Consulta | null };

interface CampoMedida {
  clave: string;
  etiqueta: string;
  unidad: string;
  paso?: number;
}
interface CampoPrecio {
  clave: string;
  etiqueta: string;
  categoria: string;
}

const CAMPOS: Record<Exclude<TipoItem, "manual">, { medidas: CampoMedida[]; precios: CampoPrecio[] }> = {
  cortina: {
    medidas: [
      { clave: "ancho", etiqueta: "Ancho ventana", unidad: "m", paso: 0.01 },
      { clave: "alto", etiqueta: "Alto", unidad: "m", paso: 0.01 },
      { clave: "panos", etiqueta: "Paños", unidad: "u", paso: 1 },
      { clave: "fruncido", etiqueta: "Fruncido", unidad: "×", paso: 0.1 },
      { clave: "anchoRollo", etiqueta: "Ancho del rollo", unidad: "m", paso: 0.01 },
      { clave: "cantidad", etiqueta: "Ventanas iguales", unidad: "u", paso: 1 },
    ],
    precios: [
      { clave: "precioTela", etiqueta: "Tela por metro", categoria: "Telas" },
      { clave: "precioConfeccion", etiqueta: "Confección por metro", categoria: "Confección" },
      { clave: "precioRiel", etiqueta: "Riel / barral por metro", categoria: "Rieles y barrales" },
      { clave: "colocacion", etiqueta: "Colocación por ventana", categoria: "Colocación" },
    ],
  },
  m2: {
    medidas: [
      { clave: "ancho", etiqueta: "Ancho", unidad: "m", paso: 0.01 },
      { clave: "alto", etiqueta: "Alto", unidad: "m", paso: 0.01 },
      { clave: "minimoM2", etiqueta: "Mínimo facturable", unidad: "m²", paso: 0.1 },
      { clave: "cantidad", etiqueta: "Unidades", unidad: "u", paso: 1 },
    ],
    precios: [
      { clave: "precioM2", etiqueta: "Precio por m²", categoria: "Roller y venecianas" },
      { clave: "colocacion", etiqueta: "Colocación por unidad", categoria: "Colocación" },
    ],
  },
  empapelado: {
    medidas: [
      { clave: "anchoParedes", etiqueta: "Ancho de paredes", unidad: "m", paso: 0.01 },
      { clave: "alto", etiqueta: "Alto", unidad: "m", paso: 0.01 },
      { clave: "anchoRollo", etiqueta: "Ancho del rollo", unidad: "m", paso: 0.01 },
      { clave: "largoRollo", etiqueta: "Largo del rollo", unidad: "m", paso: 0.01 },
      { clave: "rapport", etiqueta: "Rapport", unidad: "m", paso: 0.01 },
    ],
    precios: [
      { clave: "precioRollo", etiqueta: "Precio por rollo", categoria: "Empapelados" },
      { clave: "colocacionRollo", etiqueta: "Colocación por rollo", categoria: "Colocación" },
    ],
  },
  piso: {
    medidas: [
      { clave: "superficie", etiqueta: "Superficie", unidad: "m²", paso: 0.01 },
      { clave: "desperdicioPct", etiqueta: "Desperdicio", unidad: "%", paso: 1 },
      { clave: "m2PorCaja", etiqueta: "m² por caja", unidad: "m²", paso: 0.01 },
      { clave: "zocaloMetros", etiqueta: "Zócalo", unidad: "m", paso: 0.1 },
    ],
    precios: [
      { clave: "precioM2", etiqueta: "Piso por m²", categoria: "Pisos" },
      { clave: "precioZocalo", etiqueta: "Zócalo por metro", categoria: "Pisos" },
      { clave: "colocacionM2", etiqueta: "Colocación por m²", categoria: "Colocación" },
    ],
  },
};

const nuevaClave = () => Math.random().toString(36).slice(2, 10);
const aNumero = (v: string) => {
  const n = Number(v.replace(/\./g, "").replace(",", "."));
  return Number.isFinite(n) ? n : 0;
};

function desdeBase(i: PresupuestoItem): ItemEditable {
  return {
    clave: i.id,
    ambiente: i.ambiente,
    descripcion: i.descripcion,
    tipo: i.tipo,
    entradas: Object.fromEntries(Object.entries(i.entradas).map(([k, v]) => [k, Number(v) || 0])),
    cantidad: i.cantidad,
    precioUnitario: i.precioUnitario,
  };
}

export function EditorPresupuesto({
  presupuesto: p,
  clientes: clientesIniciales,
  precios,
  nombreNegocio,
  sitio,
}: {
  presupuesto: PresupuestoCompleto;
  clientes: { id: string; nombre: string; telefono: string }[];
  precios: Precio[];
  nombreNegocio: string;
  sitio: string;
}) {
  const [clientes, setClientes] = useState(clientesIniciales);
  const [datos, setDatos] = useState({
    titulo: p.titulo,
    clienteId: p.clienteId,
    validoHasta: p.validoHasta,
    descuentoPct: p.descuentoPct,
    ivaPct: p.ivaPct,
    senaPct: p.senaPct,
    notas: p.notas,
    condiciones: p.condiciones,
  });
  const [items, setItems] = useState<ItemEditable[]>(() => p.items.map(desdeBase));
  const [sucio, setSucio] = useState(false);
  const [guardando, iniciar] = useTransition();
  const [estado, setEstado] = useState(p.estado);

  const calculados = useMemo(() => items.map(calcularItem), [items]);
  const totales = calcularTotales(calculados.map((i) => i.total), datos.descuentoPct, datos.ivaPct, datos.senaPct);
  const cliente = clientes.find((c) => c.id === datos.clienteId);
  const linkPublico = `${sitio || (typeof window !== "undefined" ? window.location.origin : "")}/p/${p.token}`;

  const setDato = <K extends keyof typeof datos>(k: K, v: (typeof datos)[K]) => {
    setDatos((d) => ({ ...d, [k]: v }));
    setSucio(true);
  };
  const setItem = (clave: string, cambios: Partial<ItemEditable>) => {
    setItems((lista) => lista.map((i) => (i.clave === clave ? { ...i, ...cambios } : i)));
    setSucio(true);
  };
  const agregar = (tipo: TipoItem) => {
    const ultimo = items.at(-1);
    setItems((lista) => [
      ...lista,
      {
        clave: nuevaClave(),
        ambiente: ultimo?.ambiente ?? "",
        descripcion: tipo === "manual" ? "" : (TIPOS_ITEM.find((t) => t.tipo === tipo)?.nombre ?? ""),
        tipo,
        entradas: tipo === "manual" ? {} : { ...ENTRADAS_DEFECTO[tipo] },
        cantidad: 1,
        precioUnitario: 0,
      },
    ]);
    setSucio(true);
  };

  const guardar = (despues?: () => void) =>
    iniciar(async () => {
      const r = await guardarPresupuesto(p.id, { ...datos, items });
      if (!r.ok) return void toast.error(r.error);
      setSucio(false);
      toast.success(r.mensaje);
      despues?.();
    });

  useEffect(() => {
    const onKey = (e: KeyboardEvent) => {
      if ((e.metaKey || e.ctrlKey) && e.key.toLowerCase() === "s") {
        e.preventDefault();
        guardar();
      }
    };
    const antesDeSalir = (e: BeforeUnloadEvent) => {
      if (sucio) e.preventDefault();
    };
    window.addEventListener("keydown", onKey);
    window.addEventListener("beforeunload", antesDeSalir);
    return () => {
      window.removeEventListener("keydown", onKey);
      window.removeEventListener("beforeunload", antesDeSalir);
    };
  });

  const cambiarEstado = (nuevo: typeof estado) =>
    iniciar(async () => {
      const r = await cambiarEstadoPresupuesto(p.id, nuevo);
      if (r.ok) {
        setEstado(nuevo);
        toast.success("Estado actualizado");
      } else toast.error(r.error);
    });

  const enviarWhatsApp = () => {
    if (!cliente?.telefono) return void toast.error("El cliente no tiene teléfono cargado");
    const texto = `Hola ${cliente.nombre.split(" ")[0]}, te paso el presupuesto ${p.numero} de ${nombreNegocio}${datos.titulo ? ` (${datos.titulo})` : ""}: ${linkPublico}\nDesde ese link lo podés ver completo y aceptarlo. Cualquier duda, escribinos.`;
    const abrir = () => {
      window.open(urlWhatsApp(telefonoWhatsApp(cliente.telefono), texto), "_blank", "noopener");
      if (estado === "borrador") cambiarEstado("enviado");
    };
    if (sucio) guardar(abrir);
    else abrir();
  };

  const ambientes = [...new Set(items.map((i) => i.ambiente).filter(Boolean))];

  return (
    <div className="flex flex-col gap-6">
      {/* Barra superior */}
      <div className="flex flex-col gap-4 lg:flex-row lg:items-center lg:justify-between">
        <div className="flex items-center gap-3">
          <Button asChild variant="ghost" size="icon" aria-label="Volver a presupuestos">
            <Link href="/admin/presupuestos">
              <ArrowLeftIcon />
            </Link>
          </Button>
          <div className="flex flex-col">
            <div className="flex items-center gap-2">
              <h1 className="text-2xl font-semibold tracking-tight tabular-nums">{p.numero}</h1>
              <BadgePresupuesto estado={estado} />
              {sucio && <span className="text-xs text-aviso">Cambios sin guardar</span>}
            </div>
            <p className="text-sm text-muted-foreground">{cliente?.nombre ?? "Sin cliente"}{datos.titulo ? ` · ${datos.titulo}` : ""}</p>
          </div>
        </div>
        <div className="flex flex-wrap items-center gap-2">
          <Button variant="outline" asChild>
            <a href={`/p/${p.token}`} target="_blank" rel="noopener">
              <ExternalLinkIcon data-icon="inline-start" /> Ver como cliente
            </a>
          </Button>
          <Button variant="outline" className="border-whatsapp/40 text-[#128C4B] hover:bg-whatsapp/10 dark:text-whatsapp" onClick={enviarWhatsApp}>
            <IconoWhatsApp data-icon="inline-start" /> Enviar
          </Button>
          <Button onClick={() => guardar()} disabled={guardando}>
            {guardando ? <Spinner data-icon="inline-start" /> : <SaveIcon data-icon="inline-start" />}
            Guardar
          </Button>
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button variant="outline" size="icon" aria-label="Más acciones">
                <EllipsisIcon />
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="end" className="w-56">
              <DropdownMenuLabel>Marcar como</DropdownMenuLabel>
              <DropdownMenuGroup>
                <DropdownMenuItem onSelect={() => cambiarEstado("aceptado")}>
                  <CheckIcon /> Aceptado
                </DropdownMenuItem>
                <DropdownMenuItem onSelect={() => cambiarEstado("rechazado")}>
                  <XCircleIcon /> Rechazado
                </DropdownMenuItem>
                <DropdownMenuItem onSelect={() => cambiarEstado("enviado")}>Enviado</DropdownMenuItem>
                <DropdownMenuItem onSelect={() => cambiarEstado("borrador")}>Borrador</DropdownMenuItem>
              </DropdownMenuGroup>
              <DropdownMenuSeparator />
              <DropdownMenuGroup>
                <DropdownMenuItem
                  onSelect={() => {
                    void navigator.clipboard.writeText(linkPublico);
                    toast.success("Link copiado");
                  }}
                >
                  <CopyIcon /> Copiar link para el cliente
                </DropdownMenuItem>
                <DropdownMenuItem onSelect={() => iniciar(() => duplicarPresupuesto(p.id))}>
                  <CopyIcon /> Duplicar
                </DropdownMenuItem>
                <DropdownMenuItem
                  variant="destructive"
                  onSelect={() => confirm(`¿Eliminar el presupuesto ${p.numero}?`) && iniciar(() => eliminarPresupuesto(p.id))}
                >
                  <Trash2Icon /> Eliminar
                </DropdownMenuItem>
              </DropdownMenuGroup>
            </DropdownMenuContent>
          </DropdownMenu>
        </div>
      </div>

      <div className="grid gap-6 xl:grid-cols-[1fr_22rem]">
        <div className="flex min-w-0 flex-col gap-6">
          <Card>
            <CardHeader>
              <CardTitle>Datos</CardTitle>
            </CardHeader>
            <CardContent>
              <FieldGroup className="grid gap-4 md:grid-cols-[1.2fr_1.5fr_0.8fr]">
                <Field>
                  <FieldLabel>Cliente</FieldLabel>
                  <SelectorCliente
                    clientes={clientes}
                    valor={datos.clienteId}
                    onCambio={(id) => setDato("clienteId", id)}
                    onCreado={(c) => {
                      setClientes((l) => [...l, c].sort((a, b) => a.nombre.localeCompare(b.nombre)));
                      setDato("clienteId", c.id);
                    }}
                  />
                </Field>
                <Field>
                  <FieldLabel htmlFor="titulo">Título</FieldLabel>
                  <Input id="titulo" value={datos.titulo} onChange={(e) => setDato("titulo", e.target.value)} placeholder="Ej.: Cortinas living y dormitorio" />
                </Field>
                <Field>
                  <FieldLabel htmlFor="valido">Válido hasta</FieldLabel>
                  <Input id="valido" type="date" value={datos.validoHasta} onChange={(e) => setDato("validoHasta", e.target.value)} />
                </Field>
              </FieldGroup>
              {p.consulta && (
                <p className="mt-4 rounded-lg bg-muted px-3 py-2 text-sm text-muted-foreground">
                  Desde la consulta de <span className="font-medium text-foreground">{p.consulta.nombre}</span>
                  {p.consulta.detalles.medidas ? ` · Medidas: ${p.consulta.detalles.medidas}` : ""}
                  {p.consulta.mensaje ? ` · “${p.consulta.mensaje.slice(0, 120)}”` : ""}
                </p>
              )}
            </CardContent>
          </Card>

          <div className="flex flex-col gap-3">
            <div className="flex items-center justify-between">
              <h2 className="text-lg font-semibold">Ítems</h2>
              <MenuAgregar onAgregar={agregar} />
            </div>
            <datalist id="ambientes">
              {[...new Set([...ambientes, "Living", "Comedor", "Dormitorio principal", "Dormitorio", "Cocina", "Baño", "Escritorio"])].map((a) => (
                <option key={a} value={a} />
              ))}
            </datalist>
            <AnimatePresence initial={false}>
              {calculados.map((it, idx) => (
                <m.div
                  key={it.clave}
                  layout
                  initial={{ opacity: 0, y: 12 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, scale: 0.98 }}
                  transition={{ duration: 0.25 }}
                >
                  <Card className="gap-4 py-5">
                    <CardContent className="flex flex-col gap-4">
                      <div className="flex items-start gap-2">
                        <GripVerticalIcon className="mt-2.5 size-4 shrink-0 text-muted-foreground/50" aria-hidden />
                        <div className="grid flex-1 gap-2 sm:grid-cols-[11rem_1fr]">
                          <Input list="ambientes" value={it.ambiente} onChange={(e) => setItem(it.clave, { ambiente: e.target.value })} placeholder="Ambiente" aria-label="Ambiente" />
                          <Input value={it.descripcion} onChange={(e) => setItem(it.clave, { descripcion: e.target.value })} placeholder="Descripción del ítem" aria-label="Descripción" className="font-medium" />
                        </div>
                        <div className="flex items-center gap-1">
                          <span className="hidden rounded-md bg-muted px-2 py-1 text-xs text-muted-foreground sm:inline">{TIPOS_ITEM.find((t) => t.tipo === it.tipo)?.nombre}</span>
                          <Button
                            variant="ghost"
                            size="icon-sm"
                            aria-label="Quitar ítem"
                            onClick={() => {
                              setItems((l) => l.filter((x) => x.clave !== it.clave));
                              setSucio(true);
                            }}
                          >
                            <Trash2Icon />
                          </Button>
                        </div>
                      </div>

                      {it.tipo === "manual" ? (
                        <div className="grid gap-3 pl-6 sm:grid-cols-3">
                          <CampoNumero etiqueta="Cantidad" unidad="u" valor={it.cantidad} onCambio={(v) => setItem(it.clave, { cantidad: v })} />
                          <CampoNumero etiqueta="Precio unitario" unidad="$" valor={it.precioUnitario} onCambio={(v) => setItem(it.clave, { precioUnitario: v })} precios={precios} />
                        </div>
                      ) : (
                        <div className="flex flex-col gap-4 pl-6">
                          <div className="grid grid-cols-2 gap-3 sm:grid-cols-3 lg:grid-cols-6">
                            {CAMPOS[it.tipo].medidas.map((c) => (
                              <CampoNumero
                                key={c.clave}
                                etiqueta={c.etiqueta}
                                unidad={c.unidad}
                                valor={it.entradas[c.clave] ?? 0}
                                onCambio={(v) => setItem(it.clave, { entradas: { ...it.entradas, [c.clave]: v } })}
                              />
                            ))}
                          </div>
                          <div className="grid gap-3 sm:grid-cols-2 lg:grid-cols-4">
                            {CAMPOS[it.tipo].precios.map((c) => (
                              <CampoNumero
                                key={c.clave}
                                etiqueta={c.etiqueta}
                                unidad="$"
                                valor={it.entradas[c.clave] ?? 0}
                                onCambio={(v) => setItem(it.clave, { entradas: { ...it.entradas, [c.clave]: v } })}
                                precios={precios.filter((x) => x.categoria === c.categoria)}
                              />
                            ))}
                          </div>
                        </div>
                      )}

                      <div className="ml-6 flex flex-col gap-2 rounded-xl bg-muted/60 p-3 text-sm">
                        {it.desglose.length > 0 && (
                          <ul className="flex flex-col gap-1">
                            {it.desglose.map((l) => (
                              <li key={l.concepto} className="flex justify-between gap-3 text-muted-foreground">
                                <span>
                                  {l.concepto} · {l.cantidad.toLocaleString("es-AR")} {l.unidad} × {pesos(l.precio)}
                                </span>
                                <span className="tabular-nums">{pesos(l.subtotal)}</span>
                              </li>
                            ))}
                          </ul>
                        )}
                        <div className="flex items-center justify-between gap-3">
                          <span className="text-xs text-muted-foreground">{it.resumen || (it.tipo === "manual" ? `${it.cantidad} × ${pesos(it.precioUnitario)}` : "Cargá precios para calcular")}</span>
                          <span className="text-base font-semibold tabular-nums">{pesos(it.total)}</span>
                        </div>
                      </div>
                    </CardContent>
                  </Card>
                  {idx < calculados.length - 1 && <div className="h-0" />}
                </m.div>
              ))}
            </AnimatePresence>
            {items.length === 0 && (
              <div className="flex flex-col items-center gap-4 rounded-2xl border border-dashed bg-card px-6 py-12 text-center">
                <p className="font-medium">Agregá el primer ítem</p>
                <p className="max-w-md text-sm text-muted-foreground">Las calculadoras sacan metros de tela, m², rollos y cajas a partir de las medidas y la lista de precios.</p>
                <div className="flex flex-wrap justify-center gap-2">
                  {TIPOS_ITEM.map((t) => (
                    <Button key={t.tipo} variant="outline" size="sm" onClick={() => agregar(t.tipo)}>
                      <PlusIcon data-icon="inline-start" /> {t.nombre}
                    </Button>
                  ))}
                </div>
              </div>
            )}
          </div>

          <Card>
            <CardHeader>
              <CardTitle>Notas y condiciones</CardTitle>
              <CardDescription>Aparecen en el presupuesto que ve el cliente.</CardDescription>
            </CardHeader>
            <CardContent>
              <FieldGroup className="grid gap-4 md:grid-cols-2">
                <Field>
                  <FieldLabel htmlFor="notas">Notas para el cliente</FieldLabel>
                  <Textarea id="notas" value={datos.notas} onChange={(e) => setDato("notas", e.target.value)} className="min-h-32" placeholder="Plazo estimado, telas elegidas, observaciones…" />
                </Field>
                <Field>
                  <FieldLabel htmlFor="condiciones">Condiciones</FieldLabel>
                  <Textarea id="condiciones" value={datos.condiciones} onChange={(e) => setDato("condiciones", e.target.value)} className="min-h-32" />
                </Field>
              </FieldGroup>
            </CardContent>
          </Card>
        </div>

        <div className="flex flex-col gap-4 xl:sticky xl:top-20 xl:self-start">
          <Card>
            <CardHeader>
              <CardTitle>Totales</CardTitle>
            </CardHeader>
            <CardContent className="flex flex-col gap-3 text-sm">
              <Fila titulo="Subtotal" valor={pesos(totales.subtotal)} />
              <div className="grid grid-cols-2 gap-2">
                <CampoNumero etiqueta="Descuento" unidad="%" valor={datos.descuentoPct} onCambio={(v) => setDato("descuentoPct", v)} />
                <CampoNumero etiqueta="IVA" unidad="%" valor={datos.ivaPct} onCambio={(v) => setDato("ivaPct", v)} />
              </div>
              {totales.descuento > 0 && <Fila titulo="Descuento" valor={`− ${pesos(totales.descuento)}`} />}
              {totales.iva > 0 && <Fila titulo="IVA" valor={pesos(totales.iva)} />}
              <Separator />
              <div className="flex items-end justify-between">
                <span className="font-medium">Total</span>
                <span className="text-3xl font-semibold tracking-tight tabular-nums">{pesos(totales.total)}</span>
              </div>
              <Separator />
              <CampoNumero etiqueta="Seña" unidad="%" valor={datos.senaPct} onCambio={(v) => setDato("senaPct", v)} />
              <Fila titulo="Seña para empezar" valor={pesos(totales.sena)} />
              <Fila titulo="Saldo contra entrega" valor={pesos(totales.saldo)} />
            </CardContent>
          </Card>
          {ambientes.length > 1 && (
            <Card>
              <CardHeader>
                <CardTitle className="text-base">Por ambiente</CardTitle>
              </CardHeader>
              <CardContent className="flex flex-col gap-2 text-sm">
                {ambientes.map((a) => (
                  <Fila key={a} titulo={a} valor={pesos(calculados.filter((i) => i.ambiente === a).reduce((s, i) => s + i.total, 0))} />
                ))}
              </CardContent>
            </Card>
          )}
          <p className="px-1 text-xs text-muted-foreground">
            Atajo: <kbd className="rounded border px-1">Ctrl</kbd> + <kbd className="rounded border px-1">S</kbd> para guardar.
          </p>
        </div>
      </div>
    </div>
  );
}

function Fila({ titulo, valor }: { titulo: string; valor: string }) {
  return (
    <div className="flex items-center justify-between gap-3">
      <span className="text-muted-foreground">{titulo}</span>
      <span className="font-medium tabular-nums">{valor}</span>
    </div>
  );
}

function CampoNumero({
  etiqueta,
  unidad,
  valor,
  onCambio,
  precios,
}: {
  etiqueta: string;
  unidad: string;
  valor: number;
  onCambio: (v: number) => void;
  precios?: Precio[];
}) {
  const [texto, setTexto] = useState(String(valor ?? 0));
  const [foco, setFoco] = useState(false);
  useEffect(() => {
    if (!foco) setTexto(String(valor ?? 0));
  }, [valor, foco]);
  return (
    <div className="flex flex-col gap-1.5">
      <span className="text-xs font-medium text-muted-foreground">{etiqueta}</span>
      <InputGroup>
        {unidad === "$" && (
          <InputGroupAddon>
            <InputGroupText>$</InputGroupText>
          </InputGroupAddon>
        )}
        <InputGroupInput
          inputMode="decimal"
          value={texto}
          onFocus={(e) => {
            setFoco(true);
            e.currentTarget.select();
          }}
          onBlur={() => setFoco(false)}
          onChange={(e) => {
            setTexto(e.target.value);
            onCambio(aNumero(e.target.value));
          }}
          className="tabular-nums"
          aria-label={etiqueta}
        />
        {unidad !== "$" && (
          <InputGroupAddon align="inline-end">
            <InputGroupText>{unidad}</InputGroupText>
          </InputGroupAddon>
        )}
        {precios && precios.length > 0 && (
          <InputGroupAddon align="inline-end">
            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <Button variant="ghost" size="icon-xs" aria-label="Elegir de la lista de precios">
                  <TagIcon />
                </Button>
              </DropdownMenuTrigger>
              <DropdownMenuContent align="end" className="max-h-72 w-64 overflow-y-auto">
                <DropdownMenuLabel>Lista de precios</DropdownMenuLabel>
                <DropdownMenuGroup>
                  {precios.map((pr) => (
                    <DropdownMenuItem key={pr.id} onSelect={() => onCambio(pr.precio)} className="justify-between gap-3">
                      <span className="truncate">{pr.nombre}</span>
                      <span className="text-xs text-muted-foreground tabular-nums">
                        {pesos(pr.precio)}/{pr.unidad}
                      </span>
                    </DropdownMenuItem>
                  ))}
                </DropdownMenuGroup>
              </DropdownMenuContent>
            </DropdownMenu>
          </InputGroupAddon>
        )}
      </InputGroup>
    </div>
  );
}

function MenuAgregar({ onAgregar }: { onAgregar: (t: TipoItem) => void }) {
  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <Button variant="outline">
          <PlusIcon data-icon="inline-start" /> Agregar ítem <ChevronDownIcon data-icon="inline-end" />
        </Button>
      </DropdownMenuTrigger>
      <DropdownMenuContent align="end" className="w-72">
        <DropdownMenuGroup>
          {TIPOS_ITEM.map((t) => (
            <DropdownMenuItem key={t.tipo} onSelect={() => onAgregar(t.tipo)} className="flex-col items-start gap-0.5">
              <span className="font-medium">{t.nombre}</span>
              <span className="text-xs text-muted-foreground">{t.ayuda}</span>
            </DropdownMenuItem>
          ))}
        </DropdownMenuGroup>
      </DropdownMenuContent>
    </DropdownMenu>
  );
}

function SelectorCliente({
  clientes,
  valor,
  onCambio,
  onCreado,
}: {
  clientes: { id: string; nombre: string; telefono: string }[];
  valor: string | null;
  onCambio: (id: string | null) => void;
  onCreado: (c: { id: string; nombre: string; telefono: string }) => void;
}) {
  const [abierto, setAbierto] = useState(false);
  const [busqueda, setBusqueda] = useState("");
  const [creando, iniciar] = useTransition();
  const actual = clientes.find((c) => c.id === valor);
  return (
    <Popover open={abierto} onOpenChange={setAbierto}>
      <PopoverTrigger asChild>
        <Button variant="outline" role="combobox" aria-expanded={abierto} className={cn("w-full justify-between font-normal", !actual && "text-muted-foreground")}>
          <span className="truncate">{actual?.nombre ?? "Elegir cliente"}</span>
          <ChevronsUpDownIcon data-icon="inline-end" className="opacity-50" />
        </Button>
      </PopoverTrigger>
      <PopoverContent className="w-72 p-0" align="start">
        <Command>
          <CommandInput placeholder="Buscar o escribir un nombre nuevo…" value={busqueda} onValueChange={setBusqueda} />
          <CommandList>
            <CommandEmpty className="p-2">
              <Button
                variant="ghost"
                className="w-full justify-start"
                disabled={creando || busqueda.trim().length < 2}
                onClick={() =>
                  iniciar(async () => {
                    const r = await guardarCliente({ nombre: busqueda.trim() });
                    if (!r.ok || !r.datos) return void toast.error(r.ok ? "No se pudo crear" : r.error);
                    onCreado({ id: r.datos.id, nombre: busqueda.trim(), telefono: "" });
                    toast.success("Cliente creado. Completá su teléfono en Clientes.");
                    setAbierto(false);
                  })
                }
              >
                <UserPlusIcon data-icon="inline-start" /> Crear “{busqueda.trim()}”
              </Button>
            </CommandEmpty>
            <CommandGroup>
              {clientes.map((c) => (
                <CommandItem
                  key={c.id}
                  value={`${c.nombre} ${c.telefono}`}
                  onSelect={() => {
                    onCambio(c.id);
                    setAbierto(false);
                  }}
                >
                  <CheckIcon className={cn(valor === c.id ? "opacity-100" : "opacity-0")} />
                  <span className="flex flex-col">
                    <span>{c.nombre}</span>
                    {c.telefono && <span className="text-xs text-muted-foreground">{c.telefono}</span>}
                  </span>
                </CommandItem>
              ))}
            </CommandGroup>
          </CommandList>
        </Command>
      </PopoverContent>
    </Popover>
  );
}
