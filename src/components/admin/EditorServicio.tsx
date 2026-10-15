"use client";

import { useState, useTransition } from "react";
import Link from "next/link";
import { ArrowLeftIcon, ExternalLinkIcon, PlusIcon, SaveIcon, Trash2Icon } from "lucide-react";
import { toast } from "sonner";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Field, FieldDescription, FieldGroup, FieldLabel } from "@/components/ui/field";
import { Input } from "@/components/ui/input";
import { InputGroup, InputGroupAddon, InputGroupInput, InputGroupText } from "@/components/ui/input-group";
import { Spinner } from "@/components/ui/spinner";
import { Switch } from "@/components/ui/switch";
import { Textarea } from "@/components/ui/textarea";
import { SelectorImagen } from "@/components/admin/SelectorImagen";
import { VistaGoogle } from "@/components/admin/VistasPrevias";
import { guardarServicio } from "@/lib/acciones/contenido";
import type { Servicio } from "@/lib/db/schema";
import { analizarDescripcion, analizarTitulo } from "@/lib/seo-salud";
import { cn } from "@/lib/utils";

export function EditorServicio({
  servicio: s,
  incluidas,
  subidas,
  sitio,
}: {
  servicio: Servicio;
  incluidas: string[];
  subidas: { url: string; alt: string }[];
  sitio: string;
}) {
  const [d, setD] = useState({
    slug: s.slug,
    nombre: s.nombre,
    titulo: s.titulo,
    bajada: s.bajada,
    descripcion: s.descripcion,
    imagen: s.imagen,
    tipos: s.tipos,
    preguntas: s.preguntas,
    mensajeWhatsApp: s.mensajeWhatsApp,
    publicado: s.publicado,
  });
  const [pendiente, iniciar] = useTransition();
  const set = <K extends keyof typeof d>(k: K, v: (typeof d)[K]) => setD((x) => ({ ...x, [k]: v }));
  const chequeoTitulo = analizarTitulo(d.titulo, " | Casa Esusy".length);
  const chequeoDesc = analizarDescripcion(d.bajada);

  const guardar = () =>
    iniciar(async () => {
      const r = await guardarServicio(s.id, d);
      if (r.ok) toast.success(r.mensaje);
      else toast.error(r.error);
    });

  return (
    <div className="flex flex-col gap-6">
      <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
        <div className="flex items-center gap-3">
          <Button asChild variant="ghost" size="icon" aria-label="Volver">
            <Link href="/admin/servicios">
              <ArrowLeftIcon />
            </Link>
          </Button>
          <div>
            <h1 className="text-2xl font-semibold tracking-tight">{d.nombre || "Servicio"}</h1>
            <p className="text-sm text-muted-foreground">/{d.slug}</p>
          </div>
        </div>
        <div className="flex gap-2">
          <Button asChild variant="outline">
            <a href={`/${s.slug}`} target="_blank" rel="noopener">
              <ExternalLinkIcon data-icon="inline-start" /> Ver página
            </a>
          </Button>
          <Button onClick={guardar} disabled={pendiente}>
            {pendiente ? <Spinner data-icon="inline-start" /> : <SaveIcon data-icon="inline-start" />}
            Guardar
          </Button>
        </div>
      </div>

      <div className="grid gap-6 xl:grid-cols-[1fr_24rem]">
        <div className="flex min-w-0 flex-col gap-6">
          <Card>
            <CardHeader>
              <CardTitle>Encabezado</CardTitle>
              <CardDescription>Lo primero que se ve en la página y en Google.</CardDescription>
            </CardHeader>
            <CardContent>
              <FieldGroup>
                <div className="grid gap-4 sm:grid-cols-2">
                  <Field>
                    <FieldLabel htmlFor="s-nombre">Nombre corto</FieldLabel>
                    <Input id="s-nombre" value={d.nombre} onChange={(e) => set("nombre", e.target.value)} />
                    <FieldDescription>En el menú y las tarjetas.</FieldDescription>
                  </Field>
                  <Field>
                    <FieldLabel htmlFor="s-slug">Dirección (URL)</FieldLabel>
                    <InputGroup>
                      <InputGroupAddon>
                        <InputGroupText>/</InputGroupText>
                      </InputGroupAddon>
                      <InputGroupInput id="s-slug" value={d.slug} onChange={(e) => set("slug", e.target.value.toLowerCase().replace(/[^a-z0-9-]/g, "-"))} />
                    </InputGroup>
                    {d.slug !== s.slug && <FieldDescription className="text-aviso">Se va a crear una redirección 301 desde /{s.slug}.</FieldDescription>}
                  </Field>
                </div>
                <Field>
                  <FieldLabel htmlFor="s-titulo">Título principal (H1)</FieldLabel>
                  <Input id="s-titulo" value={d.titulo} onChange={(e) => set("titulo", e.target.value)} />
                  <FieldDescription className={cn(chequeoTitulo.nivel !== "ok" && "text-aviso")}>{chequeoTitulo.texto}. Incluí la zona: ayuda al SEO local.</FieldDescription>
                </Field>
                <Field>
                  <FieldLabel htmlFor="s-bajada">Bajada / meta descripción</FieldLabel>
                  <Textarea id="s-bajada" value={d.bajada} onChange={(e) => set("bajada", e.target.value)} className="min-h-20" />
                  <FieldDescription className={cn(chequeoDesc.nivel !== "ok" && "text-aviso")}>{chequeoDesc.texto}</FieldDescription>
                </Field>
              </FieldGroup>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle>Texto de la página</CardTitle>
              <CardDescription>Separá los párrafos con una línea en blanco. Más texto útil = mejor posicionamiento.</CardDescription>
            </CardHeader>
            <CardContent>
              <Textarea value={d.descripcion} onChange={(e) => set("descripcion", e.target.value)} className="min-h-48 leading-relaxed" />
              <p className="mt-2 text-xs text-muted-foreground">{d.descripcion.length} caracteres</p>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="flex flex-row items-start justify-between gap-4">
              <div className="flex flex-col gap-1.5">
                <CardTitle>Opciones</CardTitle>
                <CardDescription>Tipos de producto o servicio. Se muestran como tarjetas numeradas.</CardDescription>
              </div>
              <Button size="sm" variant="outline" onClick={() => set("tipos", [...d.tipos, { nombre: "", descripcion: "" }])}>
                <PlusIcon data-icon="inline-start" /> Agregar
              </Button>
            </CardHeader>
            <CardContent className="flex flex-col gap-3">
              {d.tipos.map((t, i) => (
                <div key={i} className="grid gap-2 rounded-xl border p-3 sm:grid-cols-[14rem_1fr_auto]">
                  <Input value={t.nombre} placeholder="Nombre" aria-label="Nombre de la opción" onChange={(e) => set("tipos", d.tipos.map((x, j) => (j === i ? { ...x, nombre: e.target.value } : x)))} />
                  <Input value={t.descripcion} placeholder="Descripción breve" aria-label="Descripción de la opción" onChange={(e) => set("tipos", d.tipos.map((x, j) => (j === i ? { ...x, descripcion: e.target.value } : x)))} />
                  <Button variant="ghost" size="icon" aria-label="Quitar" onClick={() => set("tipos", d.tipos.filter((_, j) => j !== i))}>
                    <Trash2Icon />
                  </Button>
                </div>
              ))}
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="flex flex-row items-start justify-between gap-4">
              <div className="flex flex-col gap-1.5">
                <CardTitle>Preguntas frecuentes</CardTitle>
                <CardDescription>Se publican con datos estructurados (FAQ): ayudan a Google y a los asistentes de IA.</CardDescription>
              </div>
              <Button size="sm" variant="outline" onClick={() => set("preguntas", [...d.preguntas, { pregunta: "", respuesta: "" }])}>
                <PlusIcon data-icon="inline-start" /> Agregar
              </Button>
            </CardHeader>
            <CardContent className="flex flex-col gap-3">
              {d.preguntas.length === 0 && <p className="text-sm text-muted-foreground">Sin preguntas. Sumá 2 o 3 de las que más te hacen.</p>}
              {d.preguntas.map((p, i) => (
                <div key={i} className="flex flex-col gap-2 rounded-xl border p-3">
                  <div className="flex gap-2">
                    <Input value={p.pregunta} placeholder="Pregunta" aria-label="Pregunta" onChange={(e) => set("preguntas", d.preguntas.map((x, j) => (j === i ? { ...x, pregunta: e.target.value } : x)))} />
                    <Button variant="ghost" size="icon" aria-label="Quitar" onClick={() => set("preguntas", d.preguntas.filter((_, j) => j !== i))}>
                      <Trash2Icon />
                    </Button>
                  </div>
                  <Textarea value={p.respuesta} placeholder="Respuesta" aria-label="Respuesta" onChange={(e) => set("preguntas", d.preguntas.map((x, j) => (j === i ? { ...x, respuesta: e.target.value } : x)))} />
                </div>
              ))}
            </CardContent>
          </Card>
        </div>

        <div className="flex flex-col gap-6 xl:sticky xl:top-20 xl:self-start">
          <Card>
            <CardHeader>
              <CardTitle className="text-base">Publicación</CardTitle>
            </CardHeader>
            <CardContent className="flex flex-col gap-4">
              <Field orientation="horizontal">
                <FieldLabel htmlFor="s-pub" className="flex-1">
                  Visible en el sitio
                </FieldLabel>
                <Switch id="s-pub" checked={d.publicado} onCheckedChange={(v) => set("publicado", v)} />
              </Field>
              <Field>
                <FieldLabel>Foto principal</FieldLabel>
                <SelectorImagen valor={d.imagen} onCambio={(u) => set("imagen", u)} incluidas={incluidas} subidas={subidas} />
              </Field>
              <Field>
                <FieldLabel htmlFor="s-wa">Mensaje de WhatsApp</FieldLabel>
                <Textarea id="s-wa" value={d.mensajeWhatsApp} onChange={(e) => set("mensajeWhatsApp", e.target.value)} className="min-h-20" />
                <FieldDescription>Se precarga al tocar WhatsApp desde esta página.</FieldDescription>
              </Field>
            </CardContent>
          </Card>
          <Card>
            <CardHeader>
              <CardTitle className="text-base">Así se ve en Google</CardTitle>
            </CardHeader>
            <CardContent>
              <VistaGoogle titulo={`${d.titulo} | Casa Esusy`} descripcion={d.bajada} url={`${sitio}/${d.slug}`} />
            </CardContent>
          </Card>
          <Alert>
            <AlertDescription>Para cambiar solo el título o la descripción que ve Google sin tocar la página, usá la sección SEO.</AlertDescription>
          </Alert>
        </div>
      </div>
    </div>
  );
}
