import type { ReactNode } from "react";
import { Migas } from "@/components/ui/Migas";

export function Encabezado({
  titulo,
  bajada,
  ruta,
  nombre,
  children,
}: {
  titulo: string;
  bajada?: string;
  ruta: string;
  nombre: string;
  children?: ReactNode;
}) {
  return (
    <section className="contenedor pt-6 md:pt-10">
      <Migas items={[{ nombre, ruta }]} />
      <h1 className="display mt-6 max-w-[18ch] text-[clamp(2.6rem,6vw,4.25rem)]">{titulo}</h1>
      {bajada && <p className="mt-5 max-w-[56ch] text-[1.125rem] text-hilo-2">{bajada}</p>}
      {children}
    </section>
  );
}
