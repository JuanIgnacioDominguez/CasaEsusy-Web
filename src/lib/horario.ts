import { negocio } from "@/content/negocio";

/** Hora actual en Argentina (UTC-3, sin horario de verano). */
function ahoraEnArgentina(fecha = new Date()) {
  const utc = fecha.getTime() + fecha.getTimezoneOffset() * 60_000;
  return new Date(utc - 3 * 60 * 60_000);
}

const aMinutos = (hhmm: string) => {
  const [h = 0, m = 0] = hhmm.split(":").map(Number);
  return h * 60 + m;
};

export function estaAbierto(fecha = new Date()) {
  const ar = ahoraEnArgentina(fecha);
  const dia = ar.getDay();
  const minutos = ar.getHours() * 60 + ar.getMinutes();
  return negocio.horarios.some(
    (h) =>
      (h.diasSemana as readonly number[]).includes(dia) &&
      minutos >= aMinutos(h.desde) &&
      minutos < aMinutos(h.hasta),
  );
}
