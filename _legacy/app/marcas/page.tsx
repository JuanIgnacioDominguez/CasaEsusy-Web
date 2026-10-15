import { Encabezado } from "@/components/secciones/Encabezado";
import { CierreContacto } from "@/components/secciones/CierreContacto";
import { metadatos } from "@/lib/seo";

export const metadata = metadatos({
  titulo: "Marcas con las que trabajamos",
  descripcion:
    "Casa Esusy trabaja con marcas como Flexcolor (venecianas y bandas verticales) y El Espartano (alfombras).",
  ruta: "/marcas",
});

const marcas = [
  { nombre: "Flexcolor", detalle: "Venecianas, bandas verticales y sistemas de cortinas" },
  { nombre: "El Espartano", detalle: "Alfombras" },
  { nombre: "[COMPLETAR]", detalle: "Telas, empapelados y pisos" },
];

export default function Marcas() {
  return (
    <>
      <Encabezado
        nombre="Marcas"
        ruta="/marcas"
        titulo="Marcas con las que trabajamos"
        bajada="Elegimos proveedores que conocemos hace años."
      />
      <ul className="contenedor mt-12 divide-y divide-separator border-y border-separator">
        {marcas.map((m) => (
          <li key={m.nombre} className="grid gap-1 py-6 sm:grid-cols-[1fr_2fr]">
            <span className="display text-[1.9rem]">{m.nombre}</span>
            <span className="text-hilo-2 sm:self-center">{m.detalle}</span>
          </li>
        ))}
      </ul>
      <CierreContacto />
    </>
  );
}
