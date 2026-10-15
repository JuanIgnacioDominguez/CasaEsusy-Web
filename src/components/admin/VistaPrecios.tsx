"use client";

import { useMemo, useState, useTransition } from "react";
import { PercentIcon, PlusIcon, SearchIcon, Trash2Icon } from "lucide-react";
import { toast } from "sonner";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Checkbox } from "@/components/ui/checkbox";
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Field, FieldDescription, FieldGroup, FieldLabel } from "@/components/ui/field";
import { Input } from "@/components/ui/input";
import { InputGroup, InputGroupAddon, InputGroupInput, InputGroupText } from "@/components/ui/input-group";
import { Spinner } from "@/components/ui/spinner";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { ajustarPrecios, eliminarPrecio, guardarPrecio } from "@/lib/acciones/contenido";
import type { Precio } from "@/lib/db/schema";
import { CATEGORIAS_PRECIO } from "@/lib/db/schema";
import { haceCuanto, pesos } from "@/lib/formato";

export function VistaPrecios({ precios }: { precios: Precio[] }) {
  const [q, setQ] = useState("");
  const [seleccion, setSeleccion] = useState<Set<string>>(new Set());
  const [ajusteAbierto, setAjusteAbierto] = useState(false);
  const [nuevoAbierto, setNuevoAbierto] = useState(false);
  const [pendiente, iniciar] = useTransition();

  const filtrados = precios.filter((p) => !q || `${p.nombre} ${p.categoria}`.toLowerCase().includes(q.toLowerCase()));
  const categorias = useMemo(() => [...new Set([...CATEGORIAS_PRECIO, ...precios.map((p) => p.categoria)])], [precios]);
  const porCategoria = categorias.map((c) => ({ categoria: c, items: filtrados.filter((p) => p.categoria === c) })).filter((g) => g.items.length);

  const alternar = (ids: string[], marcar: boolean) =>
    setSeleccion((s) => {
      const n = new Set(s);
      for (const id of ids) (marcar ? n.add(id) : n.delete(id));
      return n;
    });

  return (
    <div className="flex flex-col gap-4">
      <div className="flex flex-col gap-2 sm:flex-row sm:items-center sm:justify-between">
        <InputGroup className="sm:w-80">
          <InputGroupAddon>
            <SearchIcon />
          </InputGroupAddon>
          <InputGroupInput value={q} onChange={(e) => setQ(e.target.value)} placeholder="Buscar material o servicio" />
        </InputGroup>
        <div className="flex gap-2">
          <Button variant="outline" disabled={!seleccion.size} onClick={() => setAjusteAbierto(true)}>
            <PercentIcon data-icon="inline-start" /> Ajustar {seleccion.size ? `(${seleccion.size})` : ""}
          </Button>
          <Button onClick={() => setNuevoAbierto(true)}>
            <PlusIcon data-icon="inline-start" /> Agregar
          </Button>
        </div>
      </div>

      {porCategoria.map(({ categoria, items }) => {
        const todos = items.every((i) => seleccion.has(i.id));
        return (
          <Card key={categoria} className="gap-0 overflow-hidden pb-0">
            <CardHeader className="flex flex-row items-center gap-3 border-b pb-4">
              <Checkbox checked={todos} onCheckedChange={(v) => alternar(items.map((i) => i.id), !!v)} aria-label={`Seleccionar ${categoria}`} />
              <CardTitle className="text-base">{categoria}</CardTitle>
              <span className="text-xs text-muted-foreground">{items.length}</span>
            </CardHeader>
            <CardContent className="px-0">
              <Table>
                <TableHeader>
                  <TableRow className="hover:bg-transparent">
                    <TableHead className="w-10 pl-6" />
                    <TableHead>Nombre</TableHead>
                    <TableHead className="w-24">Unidad</TableHead>
                    <TableHead className="w-48 text-right">Precio</TableHead>
                    <TableHead className="hidden w-32 md:table-cell">Actualizado</TableHead>
                    <TableHead className="w-12 pr-6" />
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {items.map((p) => (
                    <FilaPrecio key={p.id} p={p} marcado={seleccion.has(p.id)} onMarcar={(v) => alternar([p.id], v)} />
                  ))}
                </TableBody>
              </Table>
            </CardContent>
          </Card>
        );
      })}

      <DialogoAjuste
        abierto={ajusteAbierto}
        onCambio={setAjusteAbierto}
        cantidad={seleccion.size}
        pendiente={pendiente}
        onAplicar={(pct) =>
          iniciar(async () => {
            const r = await ajustarPrecios([...seleccion], pct);
            if (!r.ok) return void toast.error(r.error);
            toast.success(r.mensaje);
            setSeleccion(new Set());
            setAjusteAbierto(false);
          })
        }
      />
      <DialogoNuevo abierto={nuevoAbierto} onCambio={setNuevoAbierto} categorias={categorias} />
    </div>
  );
}

function FilaPrecio({ p, marcado, onMarcar }: { p: Precio; marcado: boolean; onMarcar: (v: boolean) => void }) {
  const [precio, setPrecio] = useState(String(p.precio));
  const [pendiente, iniciar] = useTransition();
  const guardar = () => {
    const valor = Number(precio.replace(/\./g, "").replace(",", "."));
    if (!Number.isFinite(valor) || valor === p.precio) return setPrecio(String(p.precio));
    iniciar(async () => {
      const r = await guardarPrecio({ ...p, precio: valor });
      if (r.ok) toast.success(`${p.nombre}: ${pesos(valor)}`);
      else toast.error(r.error);
    });
  };
  return (
    <TableRow data-state={marcado ? "selected" : undefined}>
      <TableCell className="pl-6">
        <Checkbox checked={marcado} onCheckedChange={(v) => onMarcar(!!v)} aria-label={`Seleccionar ${p.nombre}`} />
      </TableCell>
      <TableCell className="font-medium">{p.nombre}</TableCell>
      <TableCell className="text-muted-foreground">{p.unidad}</TableCell>
      <TableCell className="text-right">
        <InputGroup className="ml-auto h-8 w-40">
          <InputGroupAddon>
            <InputGroupText>$</InputGroupText>
          </InputGroupAddon>
          <InputGroupInput
            inputMode="decimal"
            value={precio}
            onChange={(e) => setPrecio(e.target.value)}
            onBlur={guardar}
            onKeyDown={(e) => e.key === "Enter" && e.currentTarget.blur()}
            className="text-right tabular-nums"
            aria-label={`Precio de ${p.nombre}`}
          />
          {pendiente && (
            <InputGroupAddon align="inline-end">
              <Spinner />
            </InputGroupAddon>
          )}
        </InputGroup>
      </TableCell>
      <TableCell className="hidden text-xs text-muted-foreground md:table-cell">{haceCuanto(p.actualizado)}</TableCell>
      <TableCell className="pr-6">
        <Button
          variant="ghost"
          size="icon-sm"
          aria-label={`Eliminar ${p.nombre}`}
          onClick={() =>
            confirm(`¿Eliminar "${p.nombre}"?`) &&
            iniciar(async () => {
              const r = await eliminarPrecio(p.id);
              if (r.ok) toast.success(r.mensaje);
              else toast.error(r.error);
            })
          }
        >
          <Trash2Icon />
        </Button>
      </TableCell>
    </TableRow>
  );
}

function DialogoAjuste({
  abierto,
  onCambio,
  cantidad,
  pendiente,
  onAplicar,
}: {
  abierto: boolean;
  onCambio: (v: boolean) => void;
  cantidad: number;
  pendiente: boolean;
  onAplicar: (pct: number) => void;
}) {
  const [pct, setPct] = useState("10");
  return (
    <Dialog open={abierto} onOpenChange={onCambio}>
      <DialogContent className="sm:max-w-sm">
        <DialogHeader>
          <DialogTitle>Ajustar precios</DialogTitle>
          <DialogDescription>Se aplica a {cantidad} precios y se redondea a la centena.</DialogDescription>
        </DialogHeader>
        <Field>
          <FieldLabel htmlFor="pct">Porcentaje</FieldLabel>
          <InputGroup>
            <InputGroupInput id="pct" inputMode="decimal" value={pct} onChange={(e) => setPct(e.target.value)} />
            <InputGroupAddon align="inline-end">
              <InputGroupText>%</InputGroupText>
            </InputGroupAddon>
          </InputGroup>
          <FieldDescription>Usá un número negativo para bajar precios.</FieldDescription>
        </Field>
        <DialogFooter>
          <Button disabled={pendiente} onClick={() => onAplicar(Number(pct.replace(",", ".")))}>
            {pendiente && <Spinner data-icon="inline-start" />}
            Aplicar
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}

function DialogoNuevo({ abierto, onCambio, categorias }: { abierto: boolean; onCambio: (v: boolean) => void; categorias: string[] }) {
  const [d, setD] = useState({ categoria: categorias[0] ?? "Telas", nombre: "", unidad: "m", precio: "" });
  const [pendiente, iniciar] = useTransition();
  return (
    <Dialog open={abierto} onOpenChange={onCambio}>
      <DialogContent className="sm:max-w-md">
        <DialogHeader>
          <DialogTitle>Agregar precio</DialogTitle>
          <DialogDescription>Aparece en las calculadoras del presupuesto según su categoría.</DialogDescription>
        </DialogHeader>
        <form
          id="nuevo-precio"
          onSubmit={(e) => {
            e.preventDefault();
            iniciar(async () => {
              const r = await guardarPrecio({ ...d, precio: Number(d.precio.replace(",", ".")) || 0 });
              if (!r.ok) return void toast.error(r.error);
              toast.success(r.mensaje);
              setD((x) => ({ ...x, nombre: "", precio: "" }));
              onCambio(false);
            });
          }}
        >
          <FieldGroup>
            <Field>
              <FieldLabel htmlFor="np-cat">Categoría</FieldLabel>
              <Input id="np-cat" list="categorias-precio" value={d.categoria} onChange={(e) => setD({ ...d, categoria: e.target.value })} />
              <datalist id="categorias-precio">
                {categorias.map((c) => (
                  <option key={c} value={c} />
                ))}
              </datalist>
            </Field>
            <Field>
              <FieldLabel htmlFor="np-nombre">Nombre</FieldLabel>
              <Input id="np-nombre" required value={d.nombre} onChange={(e) => setD({ ...d, nombre: e.target.value })} placeholder="Ej.: Lino lavado premium" />
            </Field>
            <div className="grid grid-cols-2 gap-4">
              <Field>
                <FieldLabel htmlFor="np-unidad">Unidad</FieldLabel>
                <Input id="np-unidad" value={d.unidad} onChange={(e) => setD({ ...d, unidad: e.target.value })} placeholder="m, m², rollo, u" />
              </Field>
              <Field>
                <FieldLabel htmlFor="np-precio">Precio</FieldLabel>
                <Input id="np-precio" inputMode="decimal" required value={d.precio} onChange={(e) => setD({ ...d, precio: e.target.value })} />
              </Field>
            </div>
          </FieldGroup>
        </form>
        <DialogFooter>
          <Button type="submit" form="nuevo-precio" disabled={pendiente}>
            {pendiente && <Spinner data-icon="inline-start" />}
            Guardar
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
