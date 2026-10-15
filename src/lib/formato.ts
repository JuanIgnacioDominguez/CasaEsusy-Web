const TZ = "America/Argentina/Buenos_Aires";

export const pesos = (n: number): string =>
  new Intl.NumberFormat("es-AR", { style: "currency", currency: "ARS", maximumFractionDigits: 0 }).format(n);

export const numero = (n: number, decimales = 0): string =>
  n.toLocaleString("es-AR", { minimumFractionDigits: decimales, maximumFractionDigits: decimales });

export const fechaCorta = (iso: string): string =>
  new Intl.DateTimeFormat("es-AR", { day: "numeric", month: "short", timeZone: TZ }).format(new Date(iso));

export const fechaLarga = (iso: string): string =>
  new Intl.DateTimeFormat("es-AR", { day: "numeric", month: "long", year: "numeric", timeZone: TZ }).format(new Date(iso));

export const fechaHora = (iso: string): string =>
  new Intl.DateTimeFormat("es-AR", { day: "numeric", month: "short", hour: "2-digit", minute: "2-digit", timeZone: TZ }).format(
    new Date(iso),
  );

export function haceCuanto(iso: string, ahora = new Date()): string {
  const seg = Math.round((ahora.getTime() - new Date(iso).getTime()) / 1000);
  if (seg < 60) return "recién";
  const min = Math.round(seg / 60);
  if (min < 60) return `hace ${min} min`;
  const h = Math.round(min / 60);
  if (h < 24) return `hace ${h} h`;
  const d = Math.round(h / 24);
  if (d < 7) return d === 1 ? "ayer" : `hace ${d} días`;
  return fechaCorta(iso);
}

/** "5491155984126" o "11 5598-4126" → número para wa.me con código de país. */
export function telefonoWhatsApp(telefono: string): string {
  let d = telefono.replace(/\D/g, "");
  if (d.startsWith("00")) d = d.slice(2);
  if (d.startsWith("54")) return d.startsWith("549") ? d : `549${d.slice(2)}`;
  if (d.startsWith("0")) d = d.slice(1);
  if (d.startsWith("15")) d = `11${d.slice(2)}`;
  return `549${d}`;
}

export const iniciales = (nombre: string): string =>
  nombre
    .split(/\s+/)
    .filter(Boolean)
    .slice(0, 2)
    .map((p) => p[0]?.toUpperCase())
    .join("");
