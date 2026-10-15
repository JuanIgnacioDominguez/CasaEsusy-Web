import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from "@/components/ui/accordion";
import type { PreguntaRespuesta } from "@/lib/db/schema";

export function ListaPreguntas({ items, prefijo }: { items: PreguntaRespuesta[]; prefijo: string }) {
  return (
    <Accordion type="single" collapsible className="flex flex-col gap-3">
      {items.map((p, i) => (
        <AccordionItem
          key={`${prefijo}-${i}`}
          value={`${prefijo}-${i}`}
          className="overflow-hidden rounded-2xl border bg-card px-5 last:border-b data-[state=open]:shadow-sm"
        >
          <AccordionTrigger className="py-5 text-left text-[1.0625rem] font-semibold hover:no-underline">
            {p.pregunta}
          </AccordionTrigger>
          <AccordionContent className="pb-5 text-[1rem] leading-relaxed text-muted-foreground">{p.respuesta}</AccordionContent>
        </AccordionItem>
      ))}
    </Accordion>
  );
}
