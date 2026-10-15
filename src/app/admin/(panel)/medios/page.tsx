import { EncabezadoPagina } from "@/components/admin/comunes";
import { VistaMedios } from "@/components/admin/VistaMedios";
import { requerirUsuario } from "@/lib/auth/sesion";
import { listarMedios } from "@/lib/datos/admin";
import { IMAGENES_INCLUIDAS } from "@/lib/medios";

export const metadata = { title: "Imágenes" };

export default async function Medios() {
  await requerirUsuario(["contenido"]);
  const medios = await listarMedios();
  return (
    <>
      <EncabezadoPagina titulo="Imágenes" descripcion="Biblioteca de fotos del sitio. Escribí qué muestra cada foto: lo leen Google y los lectores de pantalla." />
      <VistaMedios medios={medios} incluidas={IMAGENES_INCLUIDAS} />
    </>
  );
}
