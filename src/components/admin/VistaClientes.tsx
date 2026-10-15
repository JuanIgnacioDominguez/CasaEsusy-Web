"use client";

import { useEffect, useState } from "react";
import { usePathname, useRouter } from "next/navigation";
import { SearchIcon, UserPlusIcon, UsersIcon } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Empty, EmptyDescription, EmptyHeader, EmptyMedia, EmptyTitle } from "@/components/ui/empty";
import { InputGroup, InputGroupAddon, InputGroupInput } from "@/components/ui/input-group";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { CLIENTE_VACIO, FormularioCliente } from "@/components/admin/FormularioCliente";
import { pesos } from "@/lib/formato";

interface Fila {
  id: string;
  nombre: string;
  telefono: string;
  email: string;
  localidad: string;
  presupuestos: number;
  facturado: number;
}

export function VistaClientes({ filas, busqueda, nuevo }: { filas: Fila[]; busqueda: string; nuevo: boolean }) {
  const router = useRouter();
  const pathname = usePathname();
  const [q, setQ] = useState(busqueda);
  const [creando, setCreando] = useState(nuevo);
  useEffect(() => {
    const t = setTimeout(() => q !== busqueda && router.replace(q ? `${pathname}?q=${encodeURIComponent(q)}` : pathname, { scroll: false }), 350);
    return () => clearTimeout(t);
  }, [q, busqueda, pathname, router]);

  return (
    <div className="flex flex-col gap-4">
      <div className="flex flex-col gap-2 sm:flex-row sm:justify-between">
        <InputGroup className="sm:w-80">
          <InputGroupAddon>
            <SearchIcon />
          </InputGroupAddon>
          <InputGroupInput value={q} onChange={(e) => setQ(e.target.value)} placeholder="Buscar por nombre, teléfono o email" />
        </InputGroup>
        <Button onClick={() => setCreando(true)}>
          <UserPlusIcon data-icon="inline-start" /> Nuevo cliente
        </Button>
      </div>
      {filas.length === 0 ? (
        <Empty className="border bg-card py-16">
          <EmptyHeader>
            <EmptyMedia variant="icon">
              <UsersIcon />
            </EmptyMedia>
            <EmptyTitle>{busqueda ? "Sin resultados" : "Todavía no hay clientes"}</EmptyTitle>
            <EmptyDescription>Se crean solos al armar un presupuesto desde una consulta, o cargalos a mano.</EmptyDescription>
          </EmptyHeader>
        </Empty>
      ) : (
        <Card className="gap-0 overflow-hidden py-0">
          <Table>
            <TableHeader>
              <TableRow className="bg-muted/50 hover:bg-muted/50">
                <TableHead className="pl-4">Cliente</TableHead>
                <TableHead className="hidden md:table-cell">Localidad</TableHead>
                <TableHead className="text-right">Presupuestos</TableHead>
                <TableHead className="hidden pr-4 text-right sm:table-cell">Aceptado</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {filas.map((c) => (
                <TableRow key={c.id} className="cursor-pointer" onClick={() => router.push(`/admin/clientes/${c.id}`)}>
                  <TableCell className="pl-4">
                    <span className="flex flex-col">
                      <span className="font-medium">{c.nombre}</span>
                      <span className="text-xs text-muted-foreground">{c.telefono || c.email || "Sin contacto"}</span>
                    </span>
                  </TableCell>
                  <TableCell className="hidden text-muted-foreground md:table-cell">{c.localidad || "—"}</TableCell>
                  <TableCell className="text-right tabular-nums">{c.presupuestos}</TableCell>
                  <TableCell className="hidden pr-4 text-right font-medium tabular-nums sm:table-cell">{pesos(c.facturado)}</TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </Card>
      )}
      <Dialog open={creando} onOpenChange={setCreando}>
        <DialogContent className="sm:max-w-xl">
          <DialogHeader>
            <DialogTitle>Nuevo cliente</DialogTitle>
            <DialogDescription>Los datos fiscales son opcionales; sirven para facturar.</DialogDescription>
          </DialogHeader>
          <FormularioCliente inicial={CLIENTE_VACIO} onGuardado={(id) => router.push(`/admin/clientes/${id}`)} />
        </DialogContent>
      </Dialog>
    </div>
  );
}
