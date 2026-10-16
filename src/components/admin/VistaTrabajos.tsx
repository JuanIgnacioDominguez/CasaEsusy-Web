"use client";

import { useState, useTransition } from "react";
import Image from "next/image";
import { EyeOffIcon, PencilIcon, PlusIcon, StarIcon, Trash2Icon } from "lucide-react";
import { toast } from "sonner";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Field, FieldGroup, FieldLabel } from "@/components/ui/field";
import { Input } from "@/components/ui/input";
import { Select, SelectContent, SelectGroup, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Spinner } from "@/components/ui/spinner";
import { Switch } from "@/components/ui/switch";
import { Textarea } from "@/components/ui/textarea";
import { SelectorImagen } from "@/components/admin/SelectorImagen";
import { eliminarProyecto, guardarProyecto } from "@/lib/acciones/contenido";
import type { Proyecto } from "@/lib/db/schema";

type Editable = Omit<Proyecto, "id" | "creado" | "galeria" | "orden"> & { id?: string };
const VACIO: Editable = { titulo: "", servicio: "cortinas", ubicacion: "", descripcion: "", imagen: "", destacado: false, publicado: true };

export function VistaTrabajos({
  trabajos,
  servicios,
  incluidas,
  subidas,
}: {
  trabajos: Proyecto[];
  servicios: { slug: string; nombre: string }[];
  incluidas: string[];
  subidas: { url: string; alt: string }[];
}) {
  const [editando, setEditando] = useState<Editable | null>(null);
  const [pendiente, iniciar] = useTransition();
  const nombre = (slug: string) => servicios.find((s) => s.slug === slug)?.nombre ?? slug;

  return (
    <>
      <div className="flex justify-end">
        <Button onClick={() => setEditando({ ...VACIO, servicio: servicios[0]?.slug ?? "cortinas" })}>
          <PlusIcon data-icon="inline-start" /> Agregar trabajo
        </Button>
      </div>
      <div className="grid grid-cols-2 gap-4 md:grid-cols-3 xl:grid-cols-4">
        {trabajos.map((t) => (
          <div key={t.id} className="group flex flex-col gap-2">
            <button type="button" onClick={() => setEditando(t)} className="relative aspect-[3/4] overflow-hidden rounded-xl bg-muted text-left">
              <Image src={t.imagen} alt={t.titulo} fill sizes="(min-width:1280px) 25vw, 33vw" className="object-cover transition-transform duration-500 group-hover:scale-105" />
              <span className="absolute top-2 left-2 flex gap-1">
                {t.destacado && (
                  <Badge className="gap-1 bg-acento text-white">
                    <StarIcon /> Portada
                  </Badge>
                )}
                {!t.publicado && (
                  <Badge variant="secondary" className="gap-1">
                    <EyeOffIcon /> Oculto
                  </Badge>
                )}
              </span>
              <span className="absolute inset-x-2 bottom-2 flex justify-end opacity-0 transition-opacity group-hover:opacity-100">
                <span className="rounded-full bg-background/90 px-3 py-1 text-xs font-medium shadow">
                  <PencilIcon className="mr-1 inline size-3" /> Editar
                </span>
              </span>
            </button>
            <span className="flex flex-col px-0.5">
              <span className="text-xs text-acento">{nombre(t.servicio)}</span>
              <span className="text-sm leading-snug font-medium">{t.titulo}</span>
            </span>
          </div>
        ))}
      </div>

      <Dialog open={!!editando} onOpenChange={(o) => !o && setEditando(null)}>
        <DialogContent className="sm:max-w-2xl">
          <DialogHeader>
            <DialogTitle>{editando?.id ? "Editar trabajo" : "Nuevo trabajo"}</DialogTitle>
            <DialogDescription>Usá fotos reales de trabajos terminados (con permiso del cliente).</DialogDescription>
          </DialogHeader>
          {editando && (
            <div className="grid gap-5 sm:grid-cols-[14rem_1fr]">
              <SelectorImagen valor={editando.imagen} onCambio={(u) => setEditando({ ...editando, imagen: u })} incluidas={incluidas} subidas={subidas} aspecto="aspect-[3/4]" />
              <FieldGroup>
                <Field>
                  <FieldLabel htmlFor="t-titulo">Título</FieldLabel>
                  <Input id="t-titulo" value={editando.titulo} onChange={(e) => setEditando({ ...editando, titulo: e.target.value })} />
                </Field>
                <div className="grid gap-4 sm:grid-cols-2">
                  <Field>
                    <FieldLabel>Servicio</FieldLabel>
                    <Select value={editando.servicio} onValueChange={(v) => setEditando({ ...editando, servicio: v })}>
                      <SelectTrigger className="w-full">
                        <SelectValue />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectGroup>
                          {servicios.map((s) => (
                            <SelectItem key={s.slug} value={s.slug}>
                              {s.nombre}
                            </SelectItem>
                          ))}
                        </SelectGroup>
                      </SelectContent>
                    </Select>
                  </Field>
                  <Field>
                    <FieldLabel htmlFor="t-ubic">Barrio / localidad</FieldLabel>
                    <Input id="t-ubic" value={editando.ubicacion} onChange={(e) => setEditando({ ...editando, ubicacion: e.target.value })} placeholder="Opcional" />
                  </Field>
                </div>
                <Field>
                  <FieldLabel htmlFor="t-desc">Descripción</FieldLabel>
                  <Textarea id="t-desc" value={editando.descripcion} onChange={(e) => setEditando({ ...editando, descripcion: e.target.value })} />
                </Field>
                <Field orientation="horizontal">
                  <FieldLabel htmlFor="t-dest" className="flex-1">
                    Mostrar en la portada
                  </FieldLabel>
                  <Switch id="t-dest" checked={editando.destacado} onCheckedChange={(v) => setEditando({ ...editando, destacado: v })} />
                </Field>
                <Field orientation="horizontal">
                  <FieldLabel htmlFor="t-pub" className="flex-1">
                    Publicado
                  </FieldLabel>
                  <Switch id="t-pub" checked={editando.publicado} onCheckedChange={(v) => setEditando({ ...editando, publicado: v })} />
                </Field>
              </FieldGroup>
            </div>
          )}
          <DialogFooter className="sm:justify-between">
            {editando?.id ? (
              <Button
                variant="ghost"
                className="text-destructive hover:text-destructive"
                disabled={pendiente}
                onClick={() =>
                  confirm("¿Eliminar este trabajo?") &&
                  iniciar(async () => {
                    const r = await eliminarProyecto(editando.id!);
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
                  const r = await guardarProyecto(editando);
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
