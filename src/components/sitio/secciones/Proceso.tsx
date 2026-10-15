import { CalendarCheckIcon, MessageCircleIcon, RulerIcon, SparklesIcon } from "lucide-react";
import { AparecerItem, Escalonado } from "@/components/motion/Aparecer";
import { Encabezado } from "./Encabezado";

const PASOS = [
  {
    Icono: MessageCircleIcon,
    titulo: "Nos contás tu idea",
    texto: "Por WhatsApp, por teléfono o en el local. Con un par de fotos del ambiente ya podemos orientarte.",
  },
  {
    Icono: RulerIcon,
    titulo: "Medimos en tu casa",
    texto: "Vamos con muestras a tu casa, en Capital, zona sur o donde estés, para que elijas con la luz real. Sin cargo.",
  },
  {
    Icono: CalendarCheckIcon,
    titulo: "Presupuesto claro",
    texto: "Te mandamos el detalle por ambiente, con plazos y condiciones, y lo aceptás online con un clic.",
  },
  {
    Icono: SparklesIcon,
    titulo: "Confección y colocación",
    texto: "Confeccionamos a medida y nuestro colocador lo instala prolijo, sin que tengas que ocuparte de nada.",
  },
];

export function Proceso() {
  return (
    <section className="py-20 lg:py-28">
      <div className="contenedor flex flex-col gap-14">
        <Encabezado
          alineacion="centro"
          rotulo="Cómo trabajamos"
          titulo="De la primera charla a la colocación"
          bajada="Un proceso simple, sin sorpresas, con una persona que te acompaña de punta a punta."
        />
        <Escalonado className="relative grid gap-7 sm:grid-cols-2 sm:gap-6 lg:grid-cols-4" paso={0.12}>
          <div aria-hidden className="absolute top-8 right-[12%] left-[12%] hidden h-px bg-[linear-gradient(90deg,transparent,var(--border)_15%,var(--border)_85%,transparent)] lg:block" />
          {PASOS.map(({ Icono, titulo, texto }, i) => (
            <AparecerItem key={titulo} className="relative flex items-start gap-4 text-left sm:flex-col sm:items-center sm:text-center">
              <span className="relative grid size-14 shrink-0 place-items-center rounded-2xl border bg-card text-pizarra shadow-sm sm:size-16">
                <Icono className="size-7" strokeWidth={1.6} />
                <span className="absolute -top-2 -right-2 grid size-6 place-items-center rounded-full bg-terracota text-[0.7rem] font-bold text-white">
                  {i + 1}
                </span>
              </span>
              <span className="flex flex-col gap-1.5 sm:items-center">
                <h3 className="text-lg font-semibold">{titulo}</h3>
                <p className="text-[0.95rem] leading-relaxed text-muted-foreground sm:max-w-[16rem]">{texto}</p>
              </span>
            </AparecerItem>
          ))}
        </Escalonado>
      </div>
    </section>
  );
}
