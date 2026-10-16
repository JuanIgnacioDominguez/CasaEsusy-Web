import { join } from "node:path";

/** Carpeta de imágenes subidas desde el panel (fuera de /public: se sirven con /media/[...]). */
export const DIR_SUBIDAS = process.env.UPLOADS_DIR ?? join(process.cwd(), "data", "uploads");

/** Imágenes que vienen con el sitio (fotos de ambientes e Instagram) para elegir en los formularios. */
export const IMAGENES_INCLUIDAS = [
  "/img/ambientes/living-sillon-gasas.jpg",
  "/img/ambientes/cortinas-gasas-luz.jpg",
  "/img/ambientes/sillon-pana-oliva.jpg",
  "/img/ambientes/dormitorio-respaldo-ratan.jpg",
  "/img/ambientes/respaldo-capitone.jpg",
  "/img/ambientes/alfombra-living.jpg",
  "/img/ambientes/empapelado-botanico.jpg",
  "/img/ambientes/piso-espiga.jpg",
  "/img/ambientes/venecianas-madera.jpg",
  "/img/ambientes/venecianas-detalle.jpg",
  "/img/ambientes/paleta-diseno.jpg",
  "/img/ambientes/muestrario-telas.jpg",
  "/img/ambientes/almohadones-lino.jpg",
  "/img/ambientes/almohadones-sillon.jpg",
  "/img/ambientes/living-claro.jpg",
  "/img/instagram/gasas-ventanal.jpg",
  "/img/instagram/venecianas-living.jpg",
  "/img/instagram/venecianas-sillon-verde.jpg",
  "/img/instagram/empapelado-infantil.jpg",
  "/img/instagram/roller-escritorio.jpg",
  "/img/instagram/acolchado-gris.jpg",
  "/img/instagram/telas-manteles.jpg",
  "/img/instagram/venecianas-new-york.jpg",
  "/img/instagram/frente-local.jpg",
  "/img/instagram/pieza-desde-1967.jpg",
  "/marcas/flexcolor.png",
  "/marcas/riel-americano-logotipo.png",
  "/marcas/el-espartano.png",
  "/marcas/muresco.png",
  "/marcas/wepel.png",
  "/marcas/barrales-y-accesorios.png",
];
