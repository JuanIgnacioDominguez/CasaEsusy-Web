"use client";

import { useState, useTransition } from "react";
import { EyeOffIcon, PencilIcon, PlusIcon, Trash2Icon } from "lucide-react";
import { toast } from "sonner";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Field, FieldDescription, FieldGroup, FieldLabel } from "@/components/ui/field";
import { Input } from "@/components/ui/input";
import { Spinner } from "@/components/ui/spinner";
import { Switch } from "@/components/ui/switch";
import { Textarea } from "@/components/ui/textarea";
import { eliminarPregunta, guardarPregunta } from "@/lib/acciones/contenido";
import type { Pregunta } from "@/lib/db/schema";

type Editable = Omit<Pregunta, "id" | "orden"> & { id?: string };

export function VistaPreguntas({ preguntas }: { preguntas: Pregunta[] }) {
  const [editando, setEditando] = useState<Editable | null>(null);
  const [pendiente, iniciar] = useTransition();
  const grupos = [...new Set(preguntas.map((p) => p.grupo))];

  return (
    <>
      <div className="flex justify-end">
        <Button onClick={() => setEditando({ pregunta: "", respuesta: "", grupo: grupos[0] ?? "General", publicada: true })}>
          <PlusIcon data-icon="inline-start" /> Agregar pregunta
        </Button>
      </div>
      {grupos.map((g) => (
        <Card key={g} className="gap-2">
          <CardHeader>
            <CardTitle className="text-base">{g}</CardTitle>
          </CardHeader>
          <CardContent className="flex flex-col divide-y">
            {preguntas
              .filter((p) => p.grupo === g)
              .map((p) => (
                <div key={p.id} className="flex items-start justify-between gap-4 py-3">
                  <div className="flex min-w-0 flex-col gap-1">
                    <span className="flex items-center gap-2 font-medium">
                      {p.pregunta}
                      {!p.publicada && (
                        <Badge variant="secondary">
                          <EyeOffIcon /> Borrador
                        </Badge>
                      )}
                    </span>
                    <span className={`text-sm ${p.respuesta.includes("[COMPLETAR") ? "text-aviso" : "text-muted-foreground"}`}>{p.respuesta}</span>
                  </div>
                  <Button size="icon-sm" variant="ghost" aria-label="Editar" onClick={() => setEditando(p)}>
                    <PencilIcon />
                  </Button>
                </div>
              ))}
          </CardContent>
        </Card>
      ))}

      <Dialog open={!!editando} onOpenChange={(o) => !o && setEditando(null)}>
        <DialogContent className="sm:max-w-lg">
          <DialogHeader>
            <DialogTitle>{editando?.id ? "Editar pregunta" : "Nueva pregunta"}</DialogTitle>
            <DialogDescription>Respuestas cortas y concretas: Google y los asistentes de IA las citan tal cual.</DialogDescription>
          </DialogHeader>
          {editando && (
            <FieldGroup>
              <Field>
                <FieldLabel htmlFor="f-grupo">Tema</FieldLabel>
                <Input id="f-grupo" list="grupos-faq" value={editando.grupo} onChange={(e) => setEditando({ ...editando, grupo: e.target.value })} />
                <datalist id="grupos-faq">
                  {grupos.map((g) => (
                    <option key={g} value={g} />
                  ))}
                </datalist>
              </Field>
              <Field>
                <FieldLabel htmlFor="f-preg">Pregunta</FieldLabel>
                <Input id="f-preg" value={editando.pregunta} onChange={(e) => setEditando({ ...editando, pregunta: e.target.value })} />
              </Field>
              <Field>
                <FieldLabel htmlFor="f-resp">Respuesta</FieldLabel>
                <Textarea id="f-resp" value={editando.respuesta} onChange={(e) => setEditando({ ...editando, respuesta: e.target.value })} className="min-h-28" />
                <FieldDescription>{editando.respuesta.length} caracteres. Ideal: 1 a 3 oraciones.</FieldDescription>
              </Field>
              <Field orientation="horizontal">
                <FieldLabel htmlFor="f-pub" className="flex-1">
                  Publicada
                </FieldLabel>
                <Switch id="f-pub" checked={editando.publicada} onCheckedChange={(v) => setEditando({ ...editando, publicada: v })} />
              </Field>
            </FieldGroup>
          )}
          <DialogFooter className="sm:justify-between">
            {editando?.id ? (
              <Button
                variant="ghost"
                className="text-destructive hover:text-destructive"
                onClick={() =>
                  confirm("¿Eliminar esta pregunta?") &&
                  iniciar(async () => {
                    const r = await eliminarPregunta(editando.id!);
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
                  const r = await guardarPregunta(editando);
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
