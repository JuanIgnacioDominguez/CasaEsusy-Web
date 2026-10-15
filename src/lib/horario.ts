import type { Horario } from "@/lib/ajustes/esquemas";

/** Hora actual en Argentina (UTC-3, sin horario de verano). */
function ahoraArgentina(fecha = new Date()) {
  const partes = new Intl.DateTimeFormat("en-US", {
    timeZone: "America/Argentina/Buenos_Aires",
    weekday: "short",
    hour: "2-digit",
    minute: "2-digit",
    hourCycle: "h23",
  }).formatToParts(fecha);
  const dias = ["Sun", "Mon", "Tue", "Wed", "Thu", "Fri", "Sat"];
  const get = (t: string) => partes.find((p) => p.type === t)?.value ?? "0";
  return { dia: dias.indexOf(get("weekday")), minutos: Number(get("hour")) * 60 + Number(get("minute")) };
}

const aMinutos = (hhmm: string) => {
  const [h = "0", m = "0"] = hhmm.split(":");
  return Number(h) * 60 + Number(m);
};

export interface EstadoHorario {
  abierto: boolean;
  texto: string;
}

export function estadoHorario(horarios: Horario[], fecha = new Date()): EstadoHorario {
  const { dia, minutos } = ahoraArgentina(fecha);
  const hoy = horarios.find((h) => h.diasSemana.includes(dia));
  if (hoy && minutos >= aMinutos(hoy.desde) && minutos < aMinutos(hoy.hasta)) {
    return { abierto: true, texto: `Abierto hasta las ${hora(hoy.hasta)}` };
  }
  if (hoy && minutos < aMinutos(hoy.desde)) {
    return { abierto: false, texto: `Abrimos hoy a las ${hora(hoy.desde)}` };
  }
  for (let i = 1; i <= 7; i++) {
    const d = (dia + i) % 7;
    const h = horarios.find((x) => x.diasSemana.includes(d));
    if (h) {
      const nombre = i === 1 ? "mañana" : ["el domingo", "el lunes", "el martes", "el miércoles", "el jueves", "el viernes", "el sábado"][d];
      return { abierto: false, texto: `Abrimos ${nombre} a las ${hora(h.desde)}` };
    }
  }
  return { abierto: false, texto: "Cerrado" };
}

/** "09:00" → "9", "13:30" → "13:30" */
export const hora = (hhmm: string): string => hhmm.replace(/^0/, "").replace(":00", "");

export const rangoHorario = (h: Horario): string => `${hora(h.desde)} a ${hora(h.hasta)} h`;
