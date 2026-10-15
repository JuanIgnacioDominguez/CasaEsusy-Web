import { Contador } from "@/components/motion/Contador";
import { AparecerItem, Escalonado } from "@/components/motion/Aparecer";
import type { Negocio } from "@/lib/ajustes/esquemas";

/** Franja de confianza con datos reales del negocio. */
export function BandaCifras({ negocio }: { negocio: Negocio }) {
  const anios = new Date().getFullYear() - negocio.fundacion;
  const cifras = [
    { valor: <Contador valor={anios} />, titulo: "años de oficio", detalle: `Desde ${negocio.fundacion}, en Banfield` },
    { valor: <Contador valor={3} />, titulo: "generaciones", detalle: "Una casa de familia" },
    {
      valor: <Contador valor={negocio.googlePuntaje} decimales={1} sufijo="★" />,
      titulo: "en Google",
      detalle: `${negocio.googleOpiniones} opiniones de clientes`,
    },
    { valor: <Contador valor={100} prefijo="+" />, titulo: "opciones de telas", detalle: "Para ver y tocar en el local" },
  ];
  return (
    <section aria-label="Casa Esusy en números" className="contenedor">
      <Escalonado className="grid grid-cols-2 gap-px overflow-hidden rounded-[1.75rem] border bg-border lg:grid-cols-4">
        {cifras.map((c) => (
          <AparecerItem key={c.titulo} className="flex flex-col gap-1 bg-card p-6 sm:p-8">
            <span className="text-4xl font-semibold tracking-tight text-foreground sm:text-5xl">{c.valor}</span>
            <span className="mt-1 text-[0.95rem] font-semibold text-foreground">{c.titulo}</span>
            <span className="text-sm text-muted-foreground">{c.detalle}</span>
          </AparecerItem>
        ))}
      </Escalonado>
    </section>
  );
}
