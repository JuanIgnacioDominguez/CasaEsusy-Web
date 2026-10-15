"use client";

import { useState, useTransition } from "react";
import { PencilIcon, UserPlusIcon } from "lucide-react";
import { toast } from "sonner";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Field, FieldDescription, FieldGroup, FieldLabel } from "@/components/ui/field";
import { Input } from "@/components/ui/input";
import { Select, SelectContent, SelectGroup, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Spinner } from "@/components/ui/spinner";
import { Switch } from "@/components/ui/switch";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { guardarUsuario } from "@/lib/acciones/usuarios";
import { haceCuanto, iniciales } from "@/lib/formato";

type Rol = "admin" | "ventas" | "contenido";
interface Fila {
  id: string;
  email: string;
  nombre: string;
  rol: Rol;
  activo: boolean;
  ultimoIngreso: string | null;
}

const ROLES: Record<Rol, { nombre: string; detalle: string }> = {
  admin: { nombre: "Administración", detalle: "Todo, incluidos usuarios" },
  ventas: { nombre: "Ventas", detalle: "Consultas, presupuestos, clientes y precios" },
  contenido: { nombre: "Contenido", detalle: "Servicios, trabajos, reseñas, imágenes y SEO" },
};

export function VistaUsuarios({ usuarios, yo }: { usuarios: Fila[]; yo: string }) {
  const [editando, setEditando] = useState<(Omit<Fila, "id" | "ultimoIngreso"> & { id?: string; clave: string }) | null>(null);
  const [pendiente, iniciar] = useTransition();
  return (
    <>
      <div className="flex justify-end">
        <Button onClick={() => setEditando({ email: "", nombre: "", rol: "ventas", activo: true, clave: "" })}>
          <UserPlusIcon data-icon="inline-start" /> Invitar usuario
        </Button>
      </div>
      <Card className="gap-0 overflow-hidden py-0">
        <Table>
          <TableHeader>
            <TableRow className="bg-muted/50 hover:bg-muted/50">
              <TableHead className="pl-4">Usuario</TableHead>
              <TableHead>Rol</TableHead>
              <TableHead className="hidden md:table-cell">Último ingreso</TableHead>
              <TableHead className="w-12 pr-4" />
            </TableRow>
          </TableHeader>
          <TableBody>
            {usuarios.map((u) => (
              <TableRow key={u.id} className={u.activo ? undefined : "opacity-50"}>
                <TableCell className="pl-4">
                  <span className="flex items-center gap-3">
                    <Avatar className="size-8">
                      <AvatarFallback className="text-xs">{iniciales(u.nombre)}</AvatarFallback>
                    </Avatar>
                    <span className="flex flex-col">
                      <span className="font-medium">
                        {u.nombre} {u.id === yo && <span className="text-xs font-normal text-muted-foreground">(vos)</span>}
                      </span>
                      <span className="text-xs text-muted-foreground">{u.email}</span>
                    </span>
                  </span>
                </TableCell>
                <TableCell>
                  <Badge variant="secondary">{ROLES[u.rol].nombre}</Badge>
                  {!u.activo && <Badge variant="outline" className="ml-1">Sin acceso</Badge>}
                </TableCell>
                <TableCell className="hidden text-muted-foreground md:table-cell">{u.ultimoIngreso ? haceCuanto(u.ultimoIngreso) : "Nunca"}</TableCell>
                <TableCell className="pr-4">
                  <Button size="icon-sm" variant="ghost" aria-label="Editar" onClick={() => setEditando({ ...u, clave: "" })}>
                    <PencilIcon />
                  </Button>
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </Card>

      <Dialog open={!!editando} onOpenChange={(o) => !o && setEditando(null)}>
        <DialogContent className="sm:max-w-md">
          <DialogHeader>
            <DialogTitle>{editando?.id ? "Editar usuario" : "Nuevo usuario"}</DialogTitle>
            <DialogDescription>Pasale la contraseña por un canal seguro y pedile que la cambie en “Mi cuenta”.</DialogDescription>
          </DialogHeader>
          {editando && (
            <FieldGroup>
              <Field>
                <FieldLabel htmlFor="u-nombre">Nombre</FieldLabel>
                <Input id="u-nombre" value={editando.nombre} onChange={(e) => setEditando({ ...editando, nombre: e.target.value })} />
              </Field>
              <Field>
                <FieldLabel htmlFor="u-email">Email</FieldLabel>
                <Input id="u-email" type="email" value={editando.email} onChange={(e) => setEditando({ ...editando, email: e.target.value })} />
              </Field>
              <Field>
                <FieldLabel>Rol</FieldLabel>
                <Select value={editando.rol} onValueChange={(v) => setEditando({ ...editando, rol: v as Rol })}>
                  <SelectTrigger className="w-full">
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectGroup>
                      {(Object.keys(ROLES) as Rol[]).map((r) => (
                        <SelectItem key={r} value={r}>
                          {ROLES[r].nombre} · {ROLES[r].detalle}
                        </SelectItem>
                      ))}
                    </SelectGroup>
                  </SelectContent>
                </Select>
              </Field>
              <Field>
                <FieldLabel htmlFor="u-clave">{editando.id ? "Nueva contraseña (opcional)" : "Contraseña"}</FieldLabel>
                <Input id="u-clave" type="password" autoComplete="new-password" value={editando.clave} onChange={(e) => setEditando({ ...editando, clave: e.target.value })} />
                <FieldDescription>Mínimo 10 caracteres.</FieldDescription>
              </Field>
              <Field orientation="horizontal">
                <FieldLabel htmlFor="u-act" className="flex-1">
                  Acceso habilitado
                </FieldLabel>
                <Switch id="u-act" checked={editando.activo} onCheckedChange={(v) => setEditando({ ...editando, activo: v })} />
              </Field>
            </FieldGroup>
          )}
          <DialogFooter>
            <Button
              disabled={pendiente}
              onClick={() =>
                editando &&
                iniciar(async () => {
                  const r = await guardarUsuario({ ...editando, clave: editando.clave || undefined });
                  if (!r.ok) return void toast.error(r.error);
                  toast.success(r.mensaje);
                  setEditando(null);
                })
              }
            >
              {pendiente && <Spinner data-icon="inline-start" />}
              Guardar
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </>
  );
}
