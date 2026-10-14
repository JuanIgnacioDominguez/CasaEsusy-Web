import type { Pregunta } from "./servicios";
import { servicios } from "./servicios";

export const preguntasGenerales: { grupo: string; preguntas: Pregunta[] }[] = [
  {
    grupo: "Presupuesto y medición",
    preguntas: [
      {
        pregunta: "¿El presupuesto tiene costo?",
        respuesta: "No. La visita para medir y el presupuesto son sin cargo.",
      },
      {
        pregunta: "¿A qué zonas van?",
        respuesta:
          "Banfield, Lomas de Zamora, Temperley, Adrogué, Lanús, Remedios de Escalada, Turdera y alrededores. Si estás en otra zona, consultanos.",
      },
      {
        pregunta: "¿Cuánto tarda un trabajo a medida?",
        respuesta:
          "Depende del producto y de la tela. Te damos el plazo exacto junto con el presupuesto. [COMPLETAR plazos típicos]",
      },
    ],
  },
  {
    grupo: "Pagos y garantía",
    preguntas: [
      {
        pregunta: "¿Qué medios de pago aceptan?",
        respuesta: "[COMPLETAR: efectivo, transferencia, tarjetas, cuotas]",
      },
      {
        pregunta: "¿Los trabajos tienen garantía?",
        respuesta: "[COMPLETAR: política de garantía de confección y colocación]",
      },
    ],
  },
  ...servicios
    .filter((s) => s.preguntas.length > 0)
    .map((s) => ({ grupo: s.nombre, preguntas: s.preguntas })),
];
