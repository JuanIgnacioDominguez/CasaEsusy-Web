"use client";

import { useState, useTransition } from "react";
import { EyeOffIcon, PencilIcon, PlusIcon, StarIcon, Trash2Icon } from "lucide-react";
import { toast } from "sonner";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Field, FieldGroup, FieldLabel } from "@/components/ui/field";
import { Input } from "@/components/ui/input";
import { Spinner } from "@/components/ui/spinner";
import { Switch } from "@/components/ui/switch";
import { Textarea } from "@/components/ui/textarea";
import { ToggleGroup, ToggleGroupItem } from "@/components/ui/toggle-group";
import { Estrellas } from "@/components/iconos";
import { eliminarResena, guardarResena } from "@/lib/acciones/contenido";
import type { Resena } from "@/lib/db/schema";

type Editable = Omit<Resena, "id" | "creado"> & { id?: string };
const VACIA: Editable = { autor: "", puntaje: 5, texto: "", fecha: "", origen: "Google", destacada: true, visible: true };

export function VistaResenas({ resenas }: { resenas: Resena[] }) {
  const [editando, setEditando] = useState<Editable | null>(null);
  const [pendiente, iniciar] = useTransition();
  const rapido = (r: Resena, cambios: Partial<Resena>) =>
    iniciar(async () => {
      const res = await guardarResena({ ...r, ...cambios });
      if (res.ok) toast.success(res.mensaje);
      else toast.error(res.error);
    });

  return (
    <>
      <div className="flex justify-end">
        <Button onClick={() => setEditando(VACIA)}>
          <PlusIcon data-icon="inline-start" /> Agregar reseña
        </Button>
      </div>
      <div className="grid gap-4 md:grid-cols-2 xl:grid-cols-3">
        {resenas.map((r) => (
          <Card key={r.id} className={r.visible ? undefined : "opacity-60"}>
            <CardContent className="flex h-full flex-col gap-3">
              <div className="flex items-center justify-between">
                <Estrellas puntaje={r.puntaje} className="text-base text-foreground" />
                <div className="flex gap-1">
                  {r.destacada && <Badge className="bg-terracota text-white">Destacada</Badge>}
                  {!r.visible && (
                    <Badge variant="secondary">
                      <EyeOffIcon /> Oculta
                    </Badge>
                  )}
                </div>
              </div>
              <p className="flex-1 text-sm leading-relaxed">“{r.texto}”</p>
              <p className="text-xs text-muted-foreground">
                {r.autor} · {r.origen}
                {r.fecha ? ` · ${r.fecha}` : ""}
              </p>
              <div className="flex gap-1 border-t pt-3">
                <Button size="sm" variant="ghost" onClick={() => setEditando(r)}>
                  <PencilIcon data-icon="inline-start" /> Editar
                </Button>
                <Button size="sm" variant="ghost" disabled={pendiente} onClick={() => rapido(r, { destacada: !r.destacada })}>
                  <StarIcon data-icon="inline-start" /> {r.destacada ? "Quitar destacada" : "Destacar"}
                </Button>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>

      <Dialog open={!!editando} onOpenChange={(o) => !o && setEditando(null)}>
        <DialogContent className="sm:max-w-lg">
          <DialogHeader>
            <DialogTitle>{editando?.id ? "Editar reseña" : "Nueva reseña"}</DialogTitle>
            <DialogDescription>Copiá reseñas reales de Google tal como están. Nunca inventes ni modifiques opiniones.</DialogDescription>
          </DialogHeader>
          {editando && (
            <FieldGroup>
              <div className="grid gap-4 sm:grid-cols-2">
                <Field>
                  <FieldLabel htmlFor="r-autor">Autor</FieldLabel>
                  <Input id="r-autor" value={editando.autor} onChange={(e) => setEditando({ ...editando, autor: e.target.value })} placeholder="Nombre e inicial" />
                </Field>
                <Field>
                  <FieldLabel htmlFor="r-fecha">Fecha</FieldLabel>
                  <Input id="r-fecha" value={editando.fecha} onChange={(e) => setEditando({ ...editando, fecha: e.target.value })} placeholder="Hace 2 meses" />
                </Field>
              </div>
              <Field>
                <FieldLabel>Puntaje</FieldLabel>
                <ToggleGroup type="single" variant="outline" value={String(editando.puntaje)} onValueChange={(v) => v && setEditando({ ...editando, puntaje: Number(v) })}>
                  {[1, 2, 3, 4, 5].map((n) => (
                    <ToggleGroupItem key={n} value={String(n)} aria-label={`${n} estrellas`}>
                      {n} ★
                    </ToggleGroupItem>
                  ))}
                </ToggleGroup>
              </Field>
              <Field>
                <FieldLabel htmlFor="r-texto">Texto</FieldLabel>
                <Textarea id="r-texto" value={editando.texto} onChange={(e) => setEditando({ ...editando, texto: e.target.value })} className="min-h-28" />
              </Field>
              <Field orientation="horizontal">
                <FieldLabel htmlFor="r-dest" className="flex-1">
                  Destacada en la portada
                </FieldLabel>
                <Switch id="r-dest" checked={editando.destacada} onCheckedChange={(v) => setEditando({ ...editando, destacada: v })} />
              </Field>
              <Field orientation="horizontal">
                <FieldLabel htmlFor="r-vis" className="flex-1">
                  Visible
                </FieldLabel>
                <Switch id="r-vis" checked={editando.visible} onCheckedChange={(v) => setEditando({ ...editando, visible: v })} />
              </Field>
            </FieldGroup>
          )}
          <DialogFooter className="sm:justify-between">
            {editando?.id ? (
              <Button
                variant="ghost"
                className="text-destructive hover:text-destructive"
                onClick={() =>
                  confirm("¿Eliminar esta reseña del sitio?") &&
                  iniciar(async () => {
                    const r = await eliminarResena(editando.id!);
                    if (!r.ok) return void toast.error(r.error);
                    toast.success(r.mensaje);
                    setEditando(null);
                  })
                }
              >
                <Trash2Icon data-icon="inline-start" /> Eliminar
              </Button>
            ) : (
              <span />
            )}
            <Button
              disabled={pendiente}
              onClick={() =>
                editando &&
                iniciar(async () => {
                  const r = await guardarResena(editando);
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
