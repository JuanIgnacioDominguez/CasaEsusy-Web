import { Camera } from "lucide-react";
import { Muestra, type Textura } from "./Muestra";

/**
 * Lugar reservado para una foto real del negocio. Muestra una textura y
 * describe qué foto va (para el relevamiento fotográfico). Se reemplaza
 * por <Image> cuando se cargue desde el panel de medios.
 */
export function FotoPendiente({
  textura,
  descripcion,
  className = "",
}: {
  textura: Textura;
  descripcion: string;
  className?: string;
}) {
  return (
    <figure className={`relative overflow-hidden rounded-[var(--radius-card)] ${className}`}>
      <Muestra textura={textura} className="absolute inset-0" />
      <figcaption className="absolute bottom-3 left-3 inline-flex max-w-[calc(100%-24px)] items-center gap-1.5 rounded-full bg-lino/85 px-3 py-1.5 text-[0.75rem] text-hilo-2 backdrop-blur">
        <Camera className="size-3.5 shrink-0" aria-hidden="true" />
        <span className="truncate">Foto: {descripcion}</span>
      </figcaption>
    </figure>
  );
}
