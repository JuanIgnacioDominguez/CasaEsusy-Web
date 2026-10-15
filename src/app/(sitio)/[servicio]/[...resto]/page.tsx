import { notFound, permanentRedirect, redirect } from "next/navigation";
import { buscarRedireccion } from "@/lib/datos/publico";

/** Rutas viejas de varios niveles: se resuelven con el gestor de redirecciones del panel. */
export default async function Resto({ params }: { params: Promise<{ servicio: string; resto: string[] }> }) {
  const { servicio, resto } = await params;
  const ruta = `/${[servicio, ...resto].map(decodeURIComponent).join("/")}`;
  const r = await buscarRedireccion(ruta);
  if (r) (r.codigo === 302 ? redirect : permanentRedirect)(r.hacia);
  notFound();
}
