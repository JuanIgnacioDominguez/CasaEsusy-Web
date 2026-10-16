"use client";

import { useRef, useState, useTransition } from "react";
import Image from "next/image";
import { BookOpenIcon, ExternalLinkIcon, EyeOffIcon, FileTextIcon, ImagesIcon, LinkIcon, PlusIcon, StarIcon, Trash2Icon, UploadIcon, XIcon } from "lucide-react";
import { toast } from "sonner";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Empty, EmptyContent, EmptyDescription, EmptyHeader, EmptyMedia, EmptyTitle } from "@/components/ui/empty";
import { Field, FieldDescription, FieldGroup, FieldLabel } from "@/components/ui/field";
import { Input } from "@/components/ui/input";
import { Select, SelectContent, SelectGroup, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Spinner } from "@/components/ui/spinner";
import { Switch } from "@/components/ui/switch";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Textarea } from "@/components/ui/textarea";
import { ToggleGroup, ToggleGroupItem } from "@/components/ui/toggle-group";
import { SelectorImagen } from "@/components/admin/SelectorImagen";
import { eliminarCatalogo, eliminarMarca, guardarCatalogo, guardarMarca, subirPdfCatalogo } from "@/lib/acciones/catalogos";
import { subirMedios } from "@/lib/acciones/medios";
import { CATEGORIAS_CATALOGO, type Catalogo, type Marca } from "@/lib/db/schema";

type CatalogoEditable = Omit<Catalogo, "id" | "creado" | "orden"> & { id?: string };
type MarcaEditable = Omit<Marca, "id" | "creado" | "orden"> & { id?: string };

const CATALOGO_VACIO: CatalogoEditable = {
  titulo: "",
  descripcion: "",
  categoria: "Telas",
  marcaId: null,
  tipo: "pdf",
  archivo: "",
  enlace: "",
  portada: "",
  imagenes: [],
  destacado: false,
  publicado: true,
};
const MARCA_VACIA: MarcaEditable = { nombre: "", rubro: "", descripcion: "", logo: "", sitioWeb: "", publicada: true };
const ICONO = { pdf: FileTextIcon, imagenes: ImagesIcon, enlace: LinkIcon } as const;

export function VistaCatalogos({
  catalogos,
  marcas,
  incluidas,
  subidas,
}: {
  catalogos: Catalogo[];
  marcas: Marca[];
  incluidas: string[];
  subidas: { url: string; alt: string }[];
}) {
  const [catalogo, setCatalogo] = useState<CatalogoEditable | null>(null);
  const [marca, setMarca] = useState<MarcaEditable | null>(null);
  const nombreMarca = (id: string | null) => marcas.find((m) => m.id === id)?.nombre;

  return (
    <Tabs defaultValue="catalogos" className="gap-4">
      <div className="flex flex-col justify-between gap-3 sm:flex-row sm:items-center">
        <TabsList>
          <TabsTrigger value="catalogos">Catálogos · {catalogos.length}</TabsTrigger>
          <TabsTrigger value="marcas">Marcas · {marcas.length}</TabsTrigger>
        </TabsList>
        <div className="flex gap-2">
          <Button variant="outline" onClick={() => setMarca(MARCA_VACIA)}>
            <PlusIcon data-icon="inline-start" /> Marca
          </Button>
          <Button onClick={() => setCatalogo(CATALOGO_VACIO)}>
            <UploadIcon data-icon="inline-start" /> Subir catálogo
          </Button>
        </div>
      </div>

      <TabsContent value="catalogos">
        {catalogos.length === 0 ? (
          <Empty className="border bg-card py-16">
            <EmptyHeader>
              <EmptyMedia variant="icon">
                <BookOpenIcon />
              </EmptyMedia>
              <EmptyTitle>Todavía no hay catálogos</EmptyTitle>
              <EmptyDescription>Subí el PDF que te pasa la marca, fotos del muestrario o el link a su catálogo online. Aparecen en /catalogos.</EmptyDescription>
            </EmptyHeader>
            <EmptyContent>
              <Button onClick={() => setCatalogo(CATALOGO_VACIO)}>
                <UploadIcon data-icon="inline-start" /> Subir el primero
              </Button>
            </EmptyContent>
          </Empty>
        ) : (
          <div className="grid gap-4 sm:grid-cols-2 xl:grid-cols-4">
            {catalogos.map((c) => {
              const Icono = ICONO[c.tipo];
              return (
                <button key={c.id} type="button" onClick={() => setCatalogo(c)} className="group flex flex-col gap-2 text-left">
                  <span className="relative aspect-[4/3] overflow-hidden rounded-xl border bg-muted">
                    {c.portada ? (
                      <Image src={c.portada} alt="" fill sizes="300px" className="object-cover transition-transform duration-500 group-hover:scale-105" />
                    ) : (
                      <span className="absolute inset-0 flex flex-col justify-end bg-gradient-to-br from-pizarra to-pizarra-profundo p-4 text-marfil">
                        <span className="text-xs text-marfil/60">{nombreMarca(c.marcaId)}</span>
                        <span className="font-semibold">{c.titulo}</span>
                      </span>
                    )}
                    <span className="absolute top-2 left-2 flex gap-1">
                      <Badge variant="secondary" className="gap-1 bg-background/90">
                        <Icono /> {c.tipo === "pdf" ? "PDF" : c.tipo === "imagenes" ? `${c.imagenes.length} fotos` : "Link"}
                      </Badge>
                      {c.destacado && (
                        <Badge className="bg-acento text-white">
                          <StarIcon />
                        </Badge>
                      )}
                      {!c.publicado && (
                        <Badge variant="secondary">
                          <EyeOffIcon /> Oculto
                        </Badge>
                      )}
                    </span>
                  </span>
                  <span className="flex flex-col px-0.5">
                    <span className="text-xs text-acento">
                      {c.categoria}
                      {nombreMarca(c.marcaId) ? ` · ${nombreMarca(c.marcaId)}` : ""}
                    </span>
                    <span className="text-sm leading-snug font-medium">{c.titulo}</span>
                  </span>
                </button>
              );
            })}
          </div>
        )}
      </TabsContent>

      <TabsContent value="marcas">
        <div className="grid gap-4 sm:grid-cols-2 xl:grid-cols-3">
          {marcas.map((m) => (
            <Card key={m.id} className={m.publicada ? undefined : "opacity-60"}>
              <CardContent className="flex items-start justify-between gap-4">
                <div className="flex min-w-0 flex-col gap-1">
                  {m.logo ? <Image src={m.logo} alt={m.nombre} width={140} height={40} className="h-8 w-auto object-contain" /> : <span className="text-xl font-bold tracking-tight">{m.nombre}</span>}
                  <span className="text-xs text-acento">{m.rubro}</span>
                  <span className="text-sm text-muted-foreground">{m.descripcion}</span>
                  <span className="text-xs text-muted-foreground">{catalogos.filter((c) => c.marcaId === m.id).length} catálogos</span>
                </div>
                <Button size="sm" variant="ghost" onClick={() => setMarca(m)}>
                  Editar
                </Button>
              </CardContent>
            </Card>
          ))}
        </div>
      </TabsContent>

      <DialogoCatalogo valor={catalogo} onCambio={setCatalogo} marcas={marcas} incluidas={incluidas} subidas={subidas} />
      <DialogoMarca valor={marca} onCambio={setMarca} incluidas={incluidas} subidas={subidas} />
    </Tabs>
  );
}

function DialogoCatalogo({
  valor,
  onCambio,
  marcas,
  incluidas,
  subidas,
}: {
  valor: CatalogoEditable | null;
  onCambio: (v: CatalogoEditable | null) => void;
  marcas: Marca[];
  incluidas: string[];
  subidas: { url: string; alt: string }[];
}) {
  const [pendiente, iniciar] = useTransition();
  const [subiendo, iniciarSubida] = useTransition();
  const [nombrePdf, setNombrePdf] = useState("");
  const inputPdf = useRef<HTMLInputElement>(null);
  const inputFotos = useRef<HTMLInputElement>(null);
  if (!valor) return <Dialog open={false} />;
  const set = <K extends keyof CatalogoEditable>(k: K, v: CatalogoEditable[K]) => onCambio({ ...valor, [k]: v });

  const subirPdf = (archivo: File | undefined) => {
    if (!archivo) return;
    const form = new FormData();
    form.append("archivo", archivo);
    iniciarSubida(async () => {
      const r = await subirPdfCatalogo(form);
      if (!r.ok || !r.datos) return void toast.error(r.ok ? "No se pudo subir" : r.error);
      onCambio({ ...valor, archivo: r.datos.url, titulo: valor.titulo || r.datos.nombre.replace(/\.pdf$/i, "") });
      setNombrePdf(r.datos.nombre);
      toast.success("PDF subido");
    });
  };

  const subirFotos = (archivos: FileList | null) => {
    if (!archivos?.length) return;
    const form = new FormData();
    for (const a of Array.from(archivos)) form.append("archivos", a);
    iniciarSubida(async () => {
      const r = await subirMedios(form);
      if (!r.ok) return void toast.error(r.error);
      onCambio({ ...valor, imagenes: [...valor.imagenes, ...(r.datos ?? []).map((m) => m.url)] });
      toast.success(r.mensaje);
    });
  };

  return (
    <Dialog open onOpenChange={(o) => !o && onCambio(null)}>
      <DialogContent className="max-h-[92dvh] overflow-y-auto sm:max-w-2xl">
        <DialogHeader>
          <DialogTitle>{valor.id ? "Editar catálogo" : "Subir catálogo"}</DialogTitle>
          <DialogDescription>Los clientes lo ven en /catalogos y pueden consultar por WhatsApp desde ahí.</DialogDescription>
        </DialogHeader>
        <FieldGroup>
          <Field>
            <FieldLabel>Formato</FieldLabel>
            <ToggleGroup type="single" variant="outline" value={valor.tipo} onValueChange={(v) => v && set("tipo", v as CatalogoEditable["tipo"])} className="w-full">
              <ToggleGroupItem value="pdf" className="flex-1">
                <FileTextIcon /> PDF
              </ToggleGroupItem>
              <ToggleGroupItem value="imagenes" className="flex-1">
                <ImagesIcon /> Fotos
              </ToggleGroupItem>
              <ToggleGroupItem value="enlace" className="flex-1">
                <LinkIcon /> Link online
              </ToggleGroupItem>
            </ToggleGroup>
          </Field>

          {valor.tipo === "pdf" && (
            <Field>
              <FieldLabel>Archivo PDF</FieldLabel>
              <input ref={inputPdf} type="file" accept="application/pdf" hidden onChange={(e) => subirPdf(e.target.files?.[0])} />
              <div className="flex flex-wrap items-center gap-2 rounded-xl border border-dashed p-3">
                <Button type="button" variant="outline" size="sm" onClick={() => inputPdf.current?.click()} disabled={subiendo}>
                  {subiendo ? <Spinner data-icon="inline-start" /> : <UploadIcon data-icon="inline-start" />}
                  {valor.archivo ? "Reemplazar PDF" : "Elegir PDF"}
                </Button>
                {valor.archivo && (
                  <a href={valor.archivo} target="_blank" rel="noopener" className="inline-flex items-center gap-1 text-sm text-muted-foreground hover:text-foreground">
                    <FileTextIcon className="size-4" /> {nombrePdf || valor.archivo.split("/").pop()} <ExternalLinkIcon className="size-3" />
                  </a>
                )}
              </div>
              <FieldDescription>Hasta 40 MB. Si pesa más, comprimilo (por ejemplo con ilovepdf.com).</FieldDescription>
            </Field>
          )}

          {valor.tipo === "imagenes" && (
            <Field>
              <FieldLabel>Fotos del catálogo o muestrario</FieldLabel>
              <input ref={inputFotos} type="file" accept="image/jpeg,image/png,image/webp" multiple hidden onChange={(e) => subirFotos(e.target.files)} />
              <div className="grid grid-cols-4 gap-2 sm:grid-cols-6">
                {valor.imagenes.map((u, i) => (
                  <div key={u} className="group relative aspect-square overflow-hidden rounded-lg bg-muted">
                    <Image src={u} alt={`Página ${i + 1}`} fill sizes="100px" className="object-cover" />
                    <button
                      type="button"
                      onClick={() => set("imagenes", valor.imagenes.filter((x) => x !== u))}
                      className="absolute top-1 right-1 grid size-6 place-items-center rounded-full bg-background/90 opacity-0 shadow group-hover:opacity-100"
                      aria-label="Quitar foto"
                    >
                      <XIcon className="size-3.5" />
                    </button>
                  </div>
                ))}
                <button
                  type="button"
                  onClick={() => inputFotos.current?.click()}
                  disabled={subiendo}
                  className="grid aspect-square place-items-center rounded-lg border border-dashed text-muted-foreground hover:bg-muted"
                  aria-label="Agregar fotos"
                >
                  {subiendo ? <Spinner /> : <PlusIcon className="size-5" />}
                </button>
              </div>
              <FieldDescription>Subí varias a la vez. Se muestran en orden, como un libro.</FieldDescription>
            </Field>
          )}

          {valor.tipo === "enlace" && (
            <Field>
              <FieldLabel htmlFor="cat-enlace">Link del catálogo online</FieldLabel>
              <Input id="cat-enlace" type="url" placeholder="https://…" value={valor.enlace} onChange={(e) => set("enlace", e.target.value)} />
              <FieldDescription>Por ejemplo, el catálogo digital que publica la marca en su web.</FieldDescription>
            </Field>
          )}

          <Field>
            <FieldLabel htmlFor="cat-titulo">Título</FieldLabel>
            <Input id="cat-titulo" value={valor.titulo} onChange={(e) => set("titulo", e.target.value)} placeholder="Ej.: Telas de tapicería otoño 2026" />
          </Field>
          <div className="grid gap-4 sm:grid-cols-2">
            <Field>
              <FieldLabel>Rubro</FieldLabel>
              <Select value={valor.categoria} onValueChange={(v) => set("categoria", v)}>
                <SelectTrigger className="w-full">
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectGroup>
                    {CATEGORIAS_CATALOGO.map((c) => (
                      <SelectItem key={c} value={c}>
                        {c}
                      </SelectItem>
                    ))}
                  </SelectGroup>
                </SelectContent>
              </Select>
            </Field>
            <Field>
              <FieldLabel>Marca</FieldLabel>
              <Select value={valor.marcaId ?? "ninguna"} onValueChange={(v) => set("marcaId", v === "ninguna" ? null : v)}>
                <SelectTrigger className="w-full">
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectGroup>
                    <SelectItem value="ninguna">Sin marca</SelectItem>
                    {marcas.map((m) => (
                      <SelectItem key={m.id} value={m.id}>
                        {m.nombre}
                      </SelectItem>
                    ))}
                  </SelectGroup>
                </SelectContent>
              </Select>
            </Field>
          </div>
          <Field>
            <FieldLabel htmlFor="cat-desc">Descripción</FieldLabel>
            <Textarea id="cat-desc" value={valor.descripcion} onChange={(e) => set("descripcion", e.target.value)} placeholder="Qué incluye: colores, tipos de tela, usos…" />
          </Field>
          <Field>
            <FieldLabel>Portada</FieldLabel>
            <SelectorImagen valor={valor.portada} onCambio={(u) => set("portada", u)} incluidas={incluidas} subidas={subidas} aspecto="aspect-[16/7]" />
            <FieldDescription>Opcional. Si no elegís, usamos la primera foto o una portada con el nombre.</FieldDescription>
          </Field>
          <div className="grid gap-3 sm:grid-cols-2">
            <Field orientation="horizontal" className="rounded-xl border p-3">
              <FieldLabel htmlFor="cat-dest" className="flex-1">
                Destacado
              </FieldLabel>
              <Switch id="cat-dest" checked={valor.destacado} onCheckedChange={(v) => set("destacado", v)} />
            </Field>
            <Field orientation="horizontal" className="rounded-xl border p-3">
              <FieldLabel htmlFor="cat-pub" className="flex-1">
                Publicado
              </FieldLabel>
              <Switch id="cat-pub" checked={valor.publicado} onCheckedChange={(v) => set("publicado", v)} />
            </Field>
          </div>
        </FieldGroup>
        <DialogFooter className="sm:justify-between">
          {valor.id ? (
            <Button
              variant="ghost"
              className="text-destructive hover:text-destructive"
              disabled={pendiente}
              onClick={() =>
                confirm("¿Eliminar este catálogo del sitio?") &&
                iniciar(async () => {
                  const r = await eliminarCatalogo(valor.id!);
                  if (!r.ok) return void toast.error(r.error);
                  toast.success(r.mensaje);
                  onCambio(null);
                })
              }
            >
              <Trash2Icon data-icon="inline-start" /> Eliminar
            </Button>
          ) : (
            <span />
          )}
          <Button
            disabled={pendiente || subiendo}
            onClick={() =>
              iniciar(async () => {
                const r = await guardarCatalogo(valor);
                if (!r.ok) return void toast.error(r.error);
                toast.success(r.mensaje);
                onCambio(null);
              })
            }
          >
            {pendiente && <Spinner data-icon="inline-start" />}
            {valor.id ? "Guardar" : "Publicar"}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}

function DialogoMarca({
  valor,
  onCambio,
  incluidas,
  subidas,
}: {
  valor: MarcaEditable | null;
  onCambio: (v: MarcaEditable | null) => void;
  incluidas: string[];
  subidas: { url: string; alt: string }[];
}) {
  const [pendiente, iniciar] = useTransition();
  if (!valor) return <Dialog open={false} />;
  const set = <K extends keyof MarcaEditable>(k: K, v: MarcaEditable[K]) => onCambio({ ...valor, [k]: v });
  return (
    <Dialog open onOpenChange={(o) => !o && onCambio(null)}>
      <DialogContent className="sm:max-w-lg">
        <DialogHeader>
          <DialogTitle>{valor.id ? "Editar marca" : "Nueva marca"}</DialogTitle>
          <DialogDescription>Aparece en la banda de marcas de la portada y en /catalogos.</DialogDescription>
        </DialogHeader>
        <FieldGroup>
          <div className="grid gap-4 sm:grid-cols-2">
            <Field>
              <FieldLabel htmlFor="m-nombre">Nombre</FieldLabel>
              <Input id="m-nombre" value={valor.nombre} onChange={(e) => set("nombre", e.target.value)} />
            </Field>
            <Field>
              <FieldLabel htmlFor="m-rubro">Rubro</FieldLabel>
              <Input id="m-rubro" value={valor.rubro} onChange={(e) => set("rubro", e.target.value)} placeholder="Ej.: Telas" />
            </Field>
          </div>
          <Field>
            <FieldLabel htmlFor="m-desc">Descripción corta</FieldLabel>
            <Input id="m-desc" value={valor.descripcion} onChange={(e) => set("descripcion", e.target.value)} />
          </Field>
          <Field>
            <FieldLabel htmlFor="m-web">Sitio web</FieldLabel>
            <Input id="m-web" type="url" value={valor.sitioWeb} onChange={(e) => set("sitioWeb", e.target.value)} placeholder="https://…" />
          </Field>
          <Field>
            <FieldLabel>Logo</FieldLabel>
            <SelectorImagen valor={valor.logo} onCambio={(u) => set("logo", u)} incluidas={incluidas} subidas={subidas} aspecto="aspect-[3/1]" />
            <FieldDescription>Opcional, ideal en PNG con fondo transparente. Sin logo mostramos el nombre.</FieldDescription>
          </Field>
          <Field orientation="horizontal">
            <FieldLabel htmlFor="m-pub" className="flex-1">
              Visible en el sitio
            </FieldLabel>
            <Switch id="m-pub" checked={valor.publicada} onCheckedChange={(v) => set("publicada", v)} />
          </Field>
        </FieldGroup>
        <DialogFooter className="sm:justify-between">
          {valor.id ? (
            <Button
              variant="ghost"
              className="text-destructive hover:text-destructive"
              onClick={() =>
                confirm("¿Eliminar la marca? Sus catálogos quedan sin marca.") &&
                iniciar(async () => {
                  const r = await eliminarMarca(valor.id!);
                  if (!r.ok) return void toast.error(r.error);
                  toast.success(r.mensaje);
                  onCambio(null);
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
              iniciar(async () => {
                const r = await guardarMarca(valor);
                if (!r.ok) return void toast.error(r.error);
                toast.success(r.mensaje);
                onCambio(null);
              })
            }
          >
            {pendiente && <Spinner data-icon="inline-start" />}
            Guardar
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
