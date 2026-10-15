import { Suspense } from "react";
import { Encabezado } from "@/components/secciones/Encabezado";
import { FormularioPresupuesto } from "@/components/secciones/FormularioPresupuesto";
import { metadatos } from "@/lib/seo";

export const metadata = metadatos({
  titulo: "Pedir presupuesto sin cargo",
  descripcion:
    "Pedí presupuesto sin cargo para cortinas a medida, sillones, alfombras, empapelados, pisos o diseño de interiores en Banfield y zona sur. Medimos en tu casa.",
  ruta: "/presupuesto",
});

export default function Presupuesto() {
  return (
    <>
      <Encabezado
        nombre="Presupuesto"
        ruta="/presupuesto"
        titulo="Pedí tu presupuesto sin cargo"
        bajada="Tres pasos y listo. Te respondemos para coordinar una visita: medimos, llevamos muestras y te pasamos el presupuesto."
      />
      <section className="contenedor mt-10 grid gap-10 md:grid-cols-[1.4fr_1fr]">
        <Suspense>
          <FormularioPresupuesto />
        </Suspense>
        <aside className="space-y-6 text-hilo-2 md:pt-4">
          <div>
            <h2 className="text-[1.0625rem] font-semibold text-hilo">¿Qué pasa después?</h2>
            <p className="mt-2">
              Te escribimos dentro del horario del local para coordinar la visita. La medición y el
              presupuesto no tienen costo.
            </p>
          </div>
          <div>
            <h2 className="text-[1.0625rem] font-semibold text-hilo">¿Tenés fotos?</h2>
            <p className="mt-2">
              Mandalas por WhatsApp después de enviar el pedido: nos ayudan a llevar las muestras
              justas.
            </p>
          </div>
        </aside>
      </section>
    </>
  );
}
