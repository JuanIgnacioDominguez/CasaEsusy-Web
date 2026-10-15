import { PaginaPendiente } from "@/components/secciones/PaginaPendiente";
import { metadatos } from "@/lib/seo";

export const metadata = metadatos({
  titulo: "Novedades y consejos",
  descripcion:
    "Novedades de Casa Esusy y consejos de decoración: cómo elegir alfombras, cortinas black out, empapelados y más.",
  ruta: "/novedades",
});

export default function Novedades() {
  return (
    <PaginaPendiente
      nombre="Novedades"
      ruta="/novedades"
      titulo="Novedades y consejos"
      bajada="Nuevas líneas, eventos del local y consejos para elegir bien."
      vacio="Pronto vas a encontrar acá artículos como “5 reglas para elegir el tamaño de la alfombra” y “Por qué el black out también aísla del frío”."
    />
  );
}
