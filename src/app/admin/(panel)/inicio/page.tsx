import { EditorPortada } from "@/components/admin/EditorPortada";
import { EncabezadoPagina } from "@/components/admin/comunes";
import { getAjuste } from "@/lib/ajustes";
import { requerirUsuario } from "@/lib/auth/sesion";
import { listarMedios } from "@/lib/datos/admin";
import { IMAGENES_INCLUIDAS } from "@/lib/medios";

export const metadata = { title: "Portada" };

export default async function Portada() {
  await requerirUsuario(["contenido"]);
  const [inicio, medios] = await Promise.all([getAjuste("inicio"), listarMedios()]);
  return (
    <>
      <EncabezadoPagina titulo="Portada del sitio" descripcion="Textos y fotos del inicio. Los cambios se publican al guardar." />
      <EditorPortada inicial={inicio} incluidas={IMAGENES_INCLUIDAS} subidas={medios.map((m) => ({ url: m.url, alt: m.alt }))} />
    </>
  );
}
