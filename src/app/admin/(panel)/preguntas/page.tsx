import { EncabezadoPagina } from "@/components/admin/comunes";
import { VistaPreguntas } from "@/components/admin/VistaPreguntas";
import { requerirUsuario } from "@/lib/auth/sesion";
import { listarPreguntasAdmin } from "@/lib/datos/admin";

export const metadata = { title: "Preguntas frecuentes" };

export default async function Preguntas() {
  await requerirUsuario(["contenido"]);
  const preguntas = await listarPreguntasAdmin();
  return (
    <>
      <EncabezadoPagina
        titulo="Preguntas frecuentes"
        descripcion="Las preguntas generales del sitio. Las específicas de cada servicio se editan dentro del servicio. Las marcadas en amarillo tienen datos por completar."
      />
      <VistaPreguntas preguntas={preguntas} />
    </>
  );
}
