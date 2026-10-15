"use client";

import { useRef, useState, useTransition } from "react";
import Image from "next/image";
import { CopyIcon, ImagesIcon, Trash2Icon, UploadCloudIcon } from "lucide-react";
import { toast } from "sonner";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Empty, EmptyDescription, EmptyHeader, EmptyMedia, EmptyTitle } from "@/components/ui/empty";
import { Input } from "@/components/ui/input";
import { Spinner } from "@/components/ui/spinner";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { actualizarAlt, eliminarMedio, subirMedios } from "@/lib/acciones/medios";
import type { Medio } from "@/lib/db/schema";
import { cn } from "@/lib/utils";

export function VistaMedios({ medios, incluidas }: { medios: Medio[]; incluidas: string[] }) {
  const [arrastrando, setArrastrando] = useState(false);
  const [subiendo, iniciar] = useTransition();
  const input = useRef<HTMLInputElement>(null);
  const sinAlt = medios.filter((m) => m.alt.trim().length < 5).length;

  const subir = (archivos: FileList | null) => {
    if (!archivos?.length) return;
    const form = new FormData();
    for (const a of Array.from(archivos)) form.append("archivos", a);
    iniciar(async () => {
      const r = await subirMedios(form);
      if (r.ok) toast.success(r.mensaje);
      else toast.error(r.error);
    });
  };

  return (
    <div className="flex flex-col gap-6">
      <button
        type="button"
        onClick={() => input.current?.click()}
        onDragOver={(e) => {
          e.preventDefault();
          setArrastrando(true);
        }}
        onDragLeave={() => setArrastrando(false)}
        onDrop={(e) => {
          e.preventDefault();
          setArrastrando(false);
          subir(e.dataTransfer.files);
        }}
        className={cn(
          "flex flex-col items-center gap-3 rounded-2xl border-2 border-dashed bg-card px-6 py-10 text-center transition-colors",
          arrastrando ? "border-terracota bg-terracota-suave/40" : "hover:bg-muted/50",
        )}
      >
        <span className="grid size-12 place-items-center rounded-xl bg-muted">{subiendo ? <Spinner /> : <UploadCloudIcon className="size-6" />}</span>
        <span className="font-medium">{subiendo ? "Subiendo y optimizando…" : "Arrastrá fotos acá o tocá para elegir"}</span>
        <span className="text-sm text-muted-foreground">JPG, PNG o WebP hasta 12 MB. Las convertimos a WebP, quitamos los datos de ubicación y las achicamos.</span>
      </button>
      <input ref={input} type="file" accept="image/jpeg,image/png,image/webp,image/avif" multiple hidden onChange={(e) => subir(e.target.files)} />

      <Tabs defaultValue="subidas">
        <TabsList>
          <TabsTrigger value="subidas">Subidas · {medios.length}</TabsTrigger>
          <TabsTrigger value="incluidas">Incluidas en el sitio · {incluidas.length}</TabsTrigger>
        </TabsList>
        <TabsContent value="subidas" className="mt-4 flex flex-col gap-4">
          {sinAlt > 0 && <p className="text-sm text-aviso">{sinAlt} imágenes necesitan un texto alternativo descriptivo (accesibilidad y SEO).</p>}
          {medios.length === 0 ? (
            <Empty className="border bg-card py-14">
              <EmptyHeader>
                <EmptyMedia variant="icon">
                  <ImagesIcon />
                </EmptyMedia>
                <EmptyTitle>Todavía no subiste fotos</EmptyTitle>
                <EmptyDescription>Subí fotos de trabajos terminados para usarlas en servicios, trabajos y la portada.</EmptyDescription>
              </EmptyHeader>
            </Empty>
          ) : (
            <div className="grid grid-cols-2 gap-4 md:grid-cols-3 xl:grid-cols-4">
              {medios.map((m) => (
                <TarjetaMedio key={m.id} m={m} />
              ))}
            </div>
          )}
        </TabsContent>
        <TabsContent value="incluidas" className="mt-4">
          <p className="mb-4 text-sm text-muted-foreground">Fotos de ambientes (Unsplash, licencia libre) y del Instagram del negocio. Reemplazalas por fotos propias cuando las tengas.</p>
          <div className="grid grid-cols-3 gap-3 md:grid-cols-4 xl:grid-cols-6">
            {incluidas.map((u) => (
              <div key={u} className="relative aspect-square overflow-hidden rounded-lg bg-muted">
                <Image src={u} alt="" fill sizes="200px" className="object-cover" />
              </div>
            ))}
          </div>
        </TabsContent>
      </Tabs>
    </div>
  );
}

function TarjetaMedio({ m }: { m: Medio }) {
  const [alt, setAlt] = useState(m.alt);
  const [pendiente, iniciar] = useTransition();
  return (
    <Card className="gap-0 overflow-hidden py-0">
      <div className="relative aspect-[4/3] bg-muted">
        <Image src={m.url} alt={m.alt} fill sizes="(min-width:1280px) 25vw, 33vw" className="object-cover" />
      </div>
      <CardContent className="flex flex-col gap-2 p-3">
        <Input
          value={alt}
          onChange={(e) => setAlt(e.target.value)}
          onBlur={() =>
            alt !== m.alt &&
            iniciar(async () => {
              const r = await actualizarAlt(m.id, alt);
              if (r.ok) toast.success(r.mensaje);
              else toast.error(r.error);
            })
          }
          placeholder="Describí la foto"
          aria-label="Texto alternativo"
          className={cn("h-8 text-sm", alt.trim().length < 5 && "border-aviso")}
        />
        <div className="flex items-center justify-between text-xs text-muted-foreground">
          <span>
            {m.ancho}×{m.alto} · {Math.round((m.peso ?? 0) / 1024)} KB
          </span>
          <span className="flex">
            <Button
              size="icon-xs"
              variant="ghost"
              aria-label="Copiar dirección"
              onClick={() => {
                void navigator.clipboard.writeText(m.url);
                toast.success("Dirección copiada");
              }}
            >
              <CopyIcon />
            </Button>
            <Button
              size="icon-xs"
              variant="ghost"
              aria-label="Eliminar"
              disabled={pendiente}
              onClick={() =>
                confirm("¿Eliminar la imagen? Si se usa en alguna página, dejará de verse.") &&
                iniciar(async () => {
                  const r = await eliminarMedio(m.id);
                  if (r.ok) toast.success(r.mensaje);
                  else toast.error(r.error);
                })
              }
            >
              <Trash2Icon />
            </Button>
          </span>
        </div>
      </CardContent>
    </Card>
  );
}
