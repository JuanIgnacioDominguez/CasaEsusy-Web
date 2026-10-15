import Image from "next/image";
import Link from "next/link";
import { ExternalLinkIcon, PencilIcon } from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { EncabezadoPagina, Puntaje } from "@/components/admin/comunes";
import { getAjuste } from "@/lib/ajustes";
import { requerirUsuario } from "@/lib/auth/sesion";
import { listarSeoPaginas, listarServiciosAdmin } from "@/lib/datos/admin";
import { todasLasPaginas } from "@/lib/paginas";
import { analizarPaginas } from "@/lib/seo-salud";

export const metadata = { title: "Servicios" };

export default async function Servicios() {
  await requerirUsuario(["contenido"]);
  const [servicios, seo, negocio, overrides] = await Promise.all([listarServiciosAdmin(), getAjuste("seo"), getAjuste("negocio"), listarSeoPaginas()]);
  const analisis = analizarPaginas(todasLasPaginas(seo, negocio, servicios), overrides, seo, servicios);
  return (
    <>
      <EncabezadoPagina titulo="Servicios" descripcion="Cada servicio es una página del sitio (por ejemplo /cortinas). Editá textos, fotos, opciones y preguntas." />
      <div className="grid gap-4 sm:grid-cols-2 xl:grid-cols-3">
        {servicios.map((s) => {
          const puntaje = analisis.find((a) => a.ruta === `/${s.slug}`)?.puntaje ?? 0;
          return (
            <Card key={s.id} className="group gap-0 overflow-hidden pt-0">
              <div className="relative aspect-[16/9] bg-muted">
                <Image src={s.imagen} alt="" fill sizes="(min-width:1280px) 33vw, 50vw" className="object-cover" />
                {!s.publicado && <Badge className="absolute top-3 left-3">Oculto</Badge>}
              </div>
              <div className="flex flex-col gap-3 p-5">
                <div className="flex items-start justify-between gap-3">
                  <div className="flex min-w-0 flex-col">
                    <span className="font-semibold">{s.nombre}</span>
                    <span className="truncate text-xs text-muted-foreground">/{s.slug}</span>
                  </div>
                  <Puntaje valor={puntaje} />
                </div>
                <p className="line-clamp-2 text-sm text-muted-foreground">{s.bajada}</p>
                <div className="flex gap-2 pt-1">
                  <Button asChild size="sm">
                    <Link href={`/admin/servicios/${s.id}`}>
                      <PencilIcon data-icon="inline-start" /> Editar
                    </Link>
                  </Button>
                  <Button asChild size="sm" variant="ghost">
                    <a href={`/${s.slug}`} target="_blank" rel="noopener">
                      <ExternalLinkIcon data-icon="inline-start" /> Ver
                    </a>
                  </Button>
                </div>
              </div>
            </Card>
          );
        })}
      </div>
    </>
  );
}
