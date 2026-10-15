import { notFound } from "next/navigation";
import { EditorServicio } from "@/components/admin/EditorServicio";
import { requerirUsuario } from "@/lib/auth/sesion";
import { getServicioAdmin, listarMedios } from "@/lib/datos/admin";
import { IMAGENES_INCLUIDAS } from "@/lib/medios";
import { SITE_URL } from "@/lib/whatsapp";

export const metadata = { title: "Editar servicio" };

export default async function PaginaEditarServicio({ params }: { params: Promise<{ id: string }> }) {
  await requerirUsuario(["contenido"]);
  const { id } = await params;
  const [s, medios] = await Promise.all([getServicioAdmin(id), listarMedios()]);
  if (!s) notFound();
  return <EditorServicio servicio={s} incluidas={IMAGENES_INCLUIDAS} subidas={medios.map((m) => ({ url: m.url, alt: m.alt }))} sitio={SITE_URL} />;
}
