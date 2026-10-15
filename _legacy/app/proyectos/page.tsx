import { BotonLink } from "@/components/ui/Boton";
import { PaginaPendiente } from "@/components/secciones/PaginaPendiente";
import { negocio } from "@/content/negocio";
import { metadatos } from "@/lib/seo";

export const metadata = metadatos({
  titulo: "Proyectos",
  descripcion:
    "Trabajos de Casa Esusy en casas, departamentos, comercios y oficinas de Banfield y la zona sur: antes y después.",
  ruta: "/proyectos",
});

export default function Proyectos() {
  return (
    <PaginaPendiente
      nombre="Proyectos"
      ruta="/proyectos"
      titulo="Proyectos"
      bajada="Casas, departamentos, comercios y oficinas de la zona sur. Antes y después, con los materiales que usamos."
      vacio="Estamos armando el portfolio con los trabajos que publicamos en Instagram. Mientras tanto, podés verlos ahí."
    >
      <BotonLink href={negocio.instagram} externo variante="secundario">
        Ver trabajos en Instagram
      </BotonLink>
    </PaginaPendiente>
  );
}
