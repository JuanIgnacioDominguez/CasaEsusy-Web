import { EncabezadoPagina } from "@/components/admin/comunes";
import { VistaTrabajos } from "@/components/admin/VistaTrabajos";
import { requerirUsuario } from "@/lib/auth/sesion";
import { listarMedios, listarProyectosAdmin, listarServiciosAdmin } from "@/lib/datos/admin";
import { IMAGENES_INCLUIDAS } from "@/lib/medios";

export const metadata = { title: "Trabajos" };

export default async function Trabajos() {
  await requerirUsuario(["contenido"]);
  const [trabajos, servicios, medios] = await Promise.all([listarProyectosAdmin(), listarServiciosAdmin(), listarMedios()]);
  return (
    <>
      <EncabezadoPagina titulo="Trabajos realizados" descripcion="El portfolio del sitio. Los marcados “Portada” aparecen primero en el inicio." />
      <VistaTrabajos
        trabajos={trabajos}
        servicios={servicios.map(({ slug, nombre }) => ({ slug, nombre }))}
        incluidas={IMAGENES_INCLUIDAS}
        subidas={medios.map((m) => ({ url: m.url, alt: m.alt }))}
      />
    </>
  );
}
