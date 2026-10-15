"use client";

import { useState, useTransition } from "react";
import Image from "next/image";
import { ExternalLinkIcon, SaveIcon } from "lucide-react";
import { toast } from "sonner";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Field, FieldDescription, FieldGroup, FieldLabel } from "@/components/ui/field";
import { Input } from "@/components/ui/input";
import { Spinner } from "@/components/ui/spinner";
import { Textarea } from "@/components/ui/textarea";
import { SelectorImagen } from "@/components/admin/SelectorImagen";
import { guardarAjustes } from "@/lib/acciones/contenido";
import type { AjustesInicio } from "@/lib/ajustes/esquemas";

export function EditorPortada({ inicial, incluidas, subidas }: { inicial: AjustesInicio; incluidas: string[]; subidas: { url: string; alt: string }[] }) {
  const [d, setD] = useState(inicial);
  const [pendiente, iniciar] = useTransition();
  const set = <K extends keyof AjustesInicio>(k: K, v: AjustesInicio[K]) => setD((x) => ({ ...x, [k]: v }));
  return (
    <div className="grid gap-6 xl:grid-cols-[1fr_1.1fr]">
      <Card>
        <CardHeader>
          <CardTitle>Portada</CardTitle>
          <CardDescription>El primer bloque que ve cada visita. Corto, claro y con una foto que enamore.</CardDescription>
        </CardHeader>
        <CardContent>
          <FieldGroup>
            <Field>
              <FieldLabel htmlFor="p-rotulo">Rótulo</FieldLabel>
              <Input id="p-rotulo" value={d.rotulo} onChange={(e) => set("rotulo", e.target.value)} />
            </Field>
            <Field>
              <FieldLabel htmlFor="p-titulo">Título</FieldLabel>
              <Textarea id="p-titulo" value={d.titulo} onChange={(e) => set("titulo", e.target.value)} className="min-h-16 text-lg font-semibold" />
              <FieldDescription>{d.titulo.length} caracteres. Ideal: menos de 50.</FieldDescription>
            </Field>
            <Field>
              <FieldLabel htmlFor="p-bajada">Bajada</FieldLabel>
              <Textarea id="p-bajada" value={d.bajada} onChange={(e) => set("bajada", e.target.value)} />
            </Field>
            <div className="grid gap-4 sm:grid-cols-2">
              <Field>
                <FieldLabel>Foto principal</FieldLabel>
                <SelectorImagen valor={d.imagen} onCambio={(u) => set("imagen", u)} incluidas={incluidas} subidas={subidas} aspecto="aspect-[4/5]" />
              </Field>
              <Field>
                <FieldLabel>Foto chica (trabajo real)</FieldLabel>
                <SelectorImagen valor={d.imagenSecundaria} onCambio={(u) => set("imagenSecundaria", u)} incluidas={incluidas} subidas={subidas} />
              </Field>
            </div>
            <Field>
              <FieldLabel htmlFor="p-nos">Texto de “Nosotros”</FieldLabel>
              <Textarea id="p-nos" value={d.textoNosotros} onChange={(e) => set("textoNosotros", e.target.value)} className="min-h-24" />
            </Field>
            <div className="flex gap-2">
              <Button
                disabled={pendiente}
                onClick={() =>
                  iniciar(async () => {
                    const r = await guardarAjustes("inicio", d);
                    if (r.ok) toast.success(r.mensaje);
                    else toast.error(r.error);
                  })
                }
              >
                {pendiente ? <Spinner data-icon="inline-start" /> : <SaveIcon data-icon="inline-start" />}
                Guardar y publicar
              </Button>
              <Button asChild variant="outline">
                <a href="/" target="_blank" rel="noopener">
                  <ExternalLinkIcon data-icon="inline-start" /> Ver sitio
                </a>
              </Button>
            </div>
          </FieldGroup>
        </CardContent>
      </Card>

      <Card className="overflow-hidden bg-marfil text-[#23282e] xl:sticky xl:top-20 xl:self-start dark:bg-marfil">
        <CardHeader>
          <CardDescription className="text-[#646a71]">Vista previa</CardDescription>
        </CardHeader>
        <CardContent className="grid items-center gap-6 sm:grid-cols-2">
          <div className="flex flex-col gap-3">
            <span className="rotulo self-start rounded-full border border-terracota/30 px-2.5 py-1 text-[0.6rem] text-[#a65a3f]">{d.rotulo}</span>
            <p className="text-3xl leading-[1.05] font-semibold tracking-tight">{d.titulo}</p>
            <p className="text-sm leading-relaxed text-[#646a71]">{d.bajada}</p>
            <span className="self-start rounded-full bg-[#3f464e] px-4 py-2 text-xs font-medium text-[#f7f4ef]">Pedir presupuesto sin cargo</span>
          </div>
          <div className="relative">
            <div className="relative aspect-[4/5] overflow-hidden rounded-2xl bg-muted">{d.imagen && <Image src={d.imagen} alt="" fill sizes="300px" className="object-cover" />}</div>
            {d.imagenSecundaria && (
              <div className="absolute -bottom-4 -left-4 w-2/5 overflow-hidden rounded-xl border-4 border-[#f7f4ef] shadow-lg">
                <div className="relative aspect-[4/3]">
                  <Image src={d.imagenSecundaria} alt="" fill sizes="120px" className="object-cover" />
                </div>
              </div>
            )}
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
