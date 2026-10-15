import { EncabezadoPagina } from "@/components/admin/comunes";
import { VistaConsultas } from "@/components/admin/VistaConsultas";
import { requerirUsuario } from "@/lib/auth/sesion";
import { getServicios } from "@/lib/datos/publico";
import { listarConsultas } from "@/lib/datos/admin";
import { ESTADOS_CONSULTA, type EstadoConsulta } from "@/lib/db/schema";

export const metadata = { title: "Consultas" };

export default async function Consultas({ searchParams }: { searchParams: Promise<{ estado?: string; q?: string; id?: string; nueva?: string }> }) {
  await requerirUsuario(["ventas"]);
  const sp = await searchParams;
  const estado = (ESTADOS_CONSULTA as readonly string[]).includes(sp.estado ?? "") ? (sp.estado as EstadoConsulta) : "todas";
  const [{ filas, conteos, presupuestosPorConsulta }, servicios] = await Promise.all([listarConsultas(estado, sp.q), getServicios()]);
  const total = conteos.reduce((a, c) => a + c.n, 0);
  return (
    <>
      <EncabezadoPagina
        titulo="Consultas"
        descripcion="Pedidos del formulario web y consultas que cargás desde WhatsApp, teléfono o el local."
      />
      <VistaConsultas
        filas={filas}
        conteos={Object.fromEntries(conteos.map((c) => [c.estado, c.n]))}
        total={total}
        estado={estado}
        busqueda={sp.q ?? ""}
        abiertaId={sp.id}
        crearAbierto={sp.nueva === "1"}
        servicios={servicios.map((s) => s.nombre)}
        presupuestos={presupuestosPorConsulta}
      />
    </>
  );
}
