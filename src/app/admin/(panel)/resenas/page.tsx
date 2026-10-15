import { ExternalLinkIcon } from "lucide-react";
import { Button } from "@/components/ui/button";
import { EncabezadoPagina } from "@/components/admin/comunes";
import { VistaResenas } from "@/components/admin/VistaResenas";
import { getAjuste } from "@/lib/ajustes";
import { requerirUsuario } from "@/lib/auth/sesion";
import { listarResenasAdmin } from "@/lib/datos/admin";

export const metadata = { title: "Reseñas" };

export default async function Resenas() {
  await requerirUsuario(["contenido"]);
  const [resenas, negocio] = await Promise.all([listarResenasAdmin(), getAjuste("negocio")]);
  return (
    <>
      <EncabezadoPagina
        titulo="Reseñas"
        descripcion={`Elegí qué opiniones de Google mostrar. Puntaje actual: ${negocio.googlePuntaje.toLocaleString("es-AR")} ★ con ${negocio.googleOpiniones} opiniones (se edita en Configuración).`}
      >
        <Button asChild variant="outline">
          <a href={negocio.googleResenas} target="_blank" rel="noopener">
            <ExternalLinkIcon data-icon="inline-start" /> Abrir ficha de Google
          </a>
        </Button>
      </EncabezadoPagina>
      <VistaResenas resenas={resenas} />
    </>
  );
}
