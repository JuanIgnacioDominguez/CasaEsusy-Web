import { ExternalLinkIcon } from "lucide-react";
import { Button } from "@/components/ui/button";
import { EncabezadoPagina } from "@/components/admin/comunes";
import { VistaCatalogos } from "@/components/admin/VistaCatalogos";
import { requerirUsuario } from "@/lib/auth/sesion";
import { listarCatalogosAdmin, listarMarcasAdmin, listarMedios } from "@/lib/datos/admin";
import { IMAGENES_INCLUIDAS } from "@/lib/medios";

export const metadata = { title: "Catálogos" };

export default async function Catalogos() {
  await requerirUsuario(["contenido"]);
  const [catalogos, marcas, medios] = await Promise.all([listarCatalogosAdmin(), listarMarcasAdmin(), listarMedios()]);
  return (
    <>
      <EncabezadoPagina titulo="Catálogos y marcas" descripcion="Subí los catálogos de telas, cortinas, rieles y empapelados (PDF, fotos o link) para que los clientes los vean online.">
        <Button asChild variant="outline">
          <a href="/catalogos" target="_blank" rel="noopener">
            <ExternalLinkIcon data-icon="inline-start" /> Ver en el sitio
          </a>
        </Button>
      </EncabezadoPagina>
      <VistaCatalogos catalogos={catalogos} marcas={marcas} incluidas={IMAGENES_INCLUIDAS} subidas={medios.map((m) => ({ url: m.url, alt: m.alt }))} />
    </>
  );
}
