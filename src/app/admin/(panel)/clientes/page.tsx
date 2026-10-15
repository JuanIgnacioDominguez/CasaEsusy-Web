import { EncabezadoPagina } from "@/components/admin/comunes";
import { VistaClientes } from "@/components/admin/VistaClientes";
import { requerirUsuario } from "@/lib/auth/sesion";
import { listarClientes } from "@/lib/datos/admin";

export const metadata = { title: "Clientes" };

export default async function Clientes({ searchParams }: { searchParams: Promise<{ q?: string; nuevo?: string }> }) {
  await requerirUsuario(["ventas"]);
  const sp = await searchParams;
  const filas = await listarClientes(sp.q);
  return (
    <>
      <EncabezadoPagina titulo="Clientes" descripcion="Datos de contacto, historial de presupuestos y consultas de cada cliente." />
      <VistaClientes filas={filas} busqueda={sp.q ?? ""} nuevo={sp.nuevo === "1"} />
    </>
  );
}
