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
          <CardDescription>El primer bloque que ve cada visita. La palabra grande cambia sola con la foto de cada servicio (Cortinas, Sillones, Alfombras…).</CardDescription>
        </CardHeader>
        <CardContent>
          <FieldGroup>
            <Field>
              <FieldLabel htmlFor="p-rotulo">Rótulo</FieldLabel>
              <Input id="p-rotulo" value={d.rotulo} onChange={(e) => set("rotulo", e.target.value)} />
            </Field>
            <Field>
              <FieldLabel htmlFor="p-titulo">Frase</FieldLabel>
              <Input id="p-titulo" value={d.titulo} onChange={(e) => set("titulo", e.target.value)} className="text-lg font-semibold" />
              <FieldDescription>Acompaña a la palabra que va cambiando: “Cortinas {d.titulo}”. Ideal: menos de 30 caracteres.</FieldDescription>
            </Field>
            <Field>
              <FieldLabel htmlFor="p-bajada">Bajada</FieldLabel>
              <Textarea id="p-bajada" value={d.bajada} onChange={(e) => set("bajada", e.target.value)} />
            </Field>
            <Field>
              <FieldLabel>Primera foto</FieldLabel>
              <SelectorImagen valor={d.imagen} onCambio={(u) => set("imagen", u)} incluidas={incluidas} subidas={subidas} aspecto="aspect-[16/7]" />
              <FieldDescription>Después rotan las fotos de cada servicio (se cambian en Servicios).</FieldDescription>
            </Field>
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

      <Card className="overflow-hidden p-0 xl:sticky xl:top-20 xl:self-start">
        <div className="relative isolate flex aspect-[4/3] flex-col justify-end gap-3 p-6 text-white sm:aspect-[16/11]">
          {d.imagen && <Image src={d.imagen} alt="" fill sizes="600px" className="-z-20 object-cover" />}
          <div className="absolute inset-0 -z-10 bg-gradient-to-t from-black/80 via-black/30 to-black/10" />
          <span className="rotulo self-start rounded-full border border-white/30 bg-white/10 px-2.5 py-1 text-[0.6rem] text-white/90">{d.rotulo}</span>
          <p className="text-4xl leading-[0.95] font-semibold tracking-tight">
            <span className="block text-[#F0B79B]">Cortinas</span>
            {d.titulo}
          </p>
          <p className="max-w-sm text-sm leading-relaxed text-white/80">{d.bajada}</p>
          <span className="self-start rounded-lg bg-[#a65a3f] px-4 py-2 text-xs font-medium text-white">Pedir presupuesto sin cargo</span>
        </div>
      </Card>
    </div>
  );
}
