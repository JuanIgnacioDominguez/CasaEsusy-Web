export type Textura =
  | "lino"
  | "gasa"
  | "pana"
  | "terciopelo"
  | "boucle"
  | "yute"
  | "papel"
  | "madera"
  | "vichy"
  | "listones"
  | "screen"
  | "rayado";

/**
 * Muestra de tela/material dibujada con CSS. Reemplaza la foto mientras
 * no estén las fotos profesionales del negocio, y funciona como el
 * motivo visual del sitio (el muestrario).
 */
export function Muestra({
  textura,
  className = "",
  etiqueta,
}: {
  textura: Textura;
  className?: string;
  /** Texto para lectores de pantalla; si no se pasa, es decorativa. */
  etiqueta?: string;
}) {
  return (
    <div
      className={`tx tx-${textura} ${className}`}
      role={etiqueta ? "img" : undefined}
      aria-label={etiqueta}
      aria-hidden={etiqueta ? undefined : true}
    />
  );
}
