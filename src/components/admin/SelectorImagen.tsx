"use client";

import { useRef, useState, useTransition } from "react";
import Image from "next/image";
import { CheckIcon, ImageIcon, UploadIcon } from "lucide-react";
import { toast } from "sonner";
import { Button } from "@/components/ui/button";
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Spinner } from "@/components/ui/spinner";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { subirMedios } from "@/lib/acciones/medios";
import { cn } from "@/lib/utils";

/** Elegir una imagen: de las incluidas, de las subidas o subir una nueva. */
export function SelectorImagen({
  valor,
  onCambio,
  incluidas,
  subidas,
  aspecto = "aspect-[4/3]",
}: {
  valor: string;
  onCambio: (url: string) => void;
  incluidas: string[];
  subidas: { url: string; alt: string }[];
  aspecto?: string;
}) {
  const [abierto, setAbierto] = useState(false);
  const [propias, setPropias] = useState(subidas);
  const [subiendo, iniciar] = useTransition();
  const input = useRef<HTMLInputElement>(null);

  const subir = (archivos: FileList | null) => {
    if (!archivos?.length) return;
    const form = new FormData();
    for (const a of Array.from(archivos)) form.append("archivos", a);
    iniciar(async () => {
      const r = await subirMedios(form);
      if (!r.ok) return void toast.error(r.error);
      const nuevos = (r.datos ?? []).map((m) => ({ url: m.url, alt: m.alt }));
      setPropias((p) => [...nuevos, ...p]);
      if (nuevos[0]) {
        onCambio(nuevos[0].url);
        setAbierto(false);
      }
      toast.success(r.mensaje);
    });
  };

  const Grilla = ({ urls }: { urls: string[] }) => (
    <div className="grid grid-cols-3 gap-2 sm:grid-cols-4">
      {urls.map((u) => (
        <button
          key={u}
          type="button"
          onClick={() => {
            onCambio(u);
            setAbierto(false);
          }}
          className={cn("relative aspect-square overflow-hidden rounded-lg bg-muted ring-offset-2 ring-offset-background focus-visible:ring-2 focus-visible:ring-ring", valor === u && "ring-2 ring-terracota")}
        >
          <Image src={u} alt="" fill sizes="160px" className="object-cover" />
          {valor === u && (
            <span className="absolute top-1.5 right-1.5 grid size-6 place-items-center rounded-full bg-terracota text-white">
              <CheckIcon className="size-3.5" />
            </span>
          )}
        </button>
      ))}
    </div>
  );

  return (
    <>
      <button
        type="button"
        onClick={() => setAbierto(true)}
        className={cn("group relative w-full overflow-hidden rounded-xl border bg-muted text-left", aspecto)}
      >
        {valor ? (
          <Image src={valor} alt="" fill sizes="400px" className="object-cover transition-opacity group-hover:opacity-80" />
        ) : (
          <span className="absolute inset-0 grid place-items-center text-muted-foreground">
            <ImageIcon className="size-8" />
          </span>
        )}
        <span className="absolute right-2 bottom-2 rounded-full bg-background/90 px-3 py-1 text-xs font-medium shadow-sm backdrop-blur">Cambiar imagen</span>
      </button>
      <Dialog open={abierto} onOpenChange={setAbierto}>
        <DialogContent className="sm:max-w-3xl">
          <DialogHeader>
            <DialogTitle>Elegir imagen</DialogTitle>
            <DialogDescription>Usá una foto incluida, una que hayas subido o subí una nueva.</DialogDescription>
          </DialogHeader>
          <Tabs defaultValue={propias.length ? "subidas" : "incluidas"}>
            <div className="flex items-center justify-between gap-2">
              <TabsList>
                <TabsTrigger value="incluidas">Incluidas</TabsTrigger>
                <TabsTrigger value="subidas">Subidas ({propias.length})</TabsTrigger>
              </TabsList>
              <input ref={input} type="file" accept="image/jpeg,image/png,image/webp,image/avif" multiple hidden onChange={(e) => subir(e.target.files)} />
              <Button size="sm" onClick={() => input.current?.click()} disabled={subiendo}>
                {subiendo ? <Spinner data-icon="inline-start" /> : <UploadIcon data-icon="inline-start" />}
                Subir
              </Button>
            </div>
            <ScrollArea className="mt-3 h-[55vh] pr-3">
              <TabsContent value="incluidas">
                <Grilla urls={incluidas} />
              </TabsContent>
              <TabsContent value="subidas">
                {propias.length ? (
                  <Grilla urls={propias.map((p) => p.url)} />
                ) : (
                  <p className="py-16 text-center text-sm text-muted-foreground">Todavía no subiste imágenes.</p>
                )}
              </TabsContent>
            </ScrollArea>
          </Tabs>
        </DialogContent>
      </Dialog>
    </>
  );
}
