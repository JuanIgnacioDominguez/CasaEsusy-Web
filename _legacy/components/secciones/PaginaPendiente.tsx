import type { ReactNode } from "react";
import { Encabezado } from "./Encabezado";
import { CierreContacto } from "./CierreContacto";

/** Página con estado vacío: el contenido se carga desde el panel en la Fase 1d. */
export function PaginaPendiente({
  nombre,
  ruta,
  titulo,
  bajada,
  vacio,
  children,
}: {
  nombre: string;
  ruta: string;
  titulo: string;
  bajada: string;
  vacio: string;
  children?: ReactNode;
}) {
  return (
    <>
      <Encabezado nombre={nombre} ruta={ruta} titulo={titulo} bajada={bajada} />
      <section className="contenedor mt-12">
        <div className="rounded-[var(--radius-card)] border border-dashed border-hilo/20 px-6 py-14 text-center">
          <p className="mx-auto max-w-[46ch] text-hilo-2">{vacio}</p>
          {children && <div className="mt-6 flex justify-center gap-3">{children}</div>}
        </div>
      </section>
      <CierreContacto />
    </>
  );
}
