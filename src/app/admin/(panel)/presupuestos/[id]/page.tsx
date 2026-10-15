import { notFound } from "next/navigation";
import { EditorPresupuesto } from "@/components/admin/EditorPresupuesto";
import { getAjuste } from "@/lib/ajustes";
import { requerirUsuario } from "@/lib/auth/sesion";
import { getPresupuesto, listarPrecios, todosLosClientes } from "@/lib/datos/admin";

export async function generateMetadata({ params }: { params: Promise<{ id: string }> }) {
  const p = await getPresupuesto((await params).id);
  return { title: p ? `Presupuesto ${p.numero}` : "Presupuesto" };
}

export default async function PaginaPresupuesto({ params }: { params: Promise<{ id: string }> }) {
  await requerirUsuario(["ventas"]);
  const { id } = await params;
  const [p, clientes, precios, negocio] = await Promise.all([getPresupuesto(id), todosLosClientes(), listarPrecios(), getAjuste("negocio")]);
  if (!p) notFound();
  return (
    <EditorPresupuesto
      presupuesto={p}
      clientes={clientes}
      precios={precios.filter((x) => x.activo)}
      nombreNegocio={negocio.nombre}
      sitio={process.env.NEXT_PUBLIC_SITE_URL ?? ""}
    />
  );
}
