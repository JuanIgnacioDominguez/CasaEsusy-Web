export function urlWhatsApp(numero: string, texto?: string): string {
  return `https://wa.me/${numero}${texto ? `?text=${encodeURIComponent(texto)}` : ""}`;
}

export const SITE_URL = (process.env.NEXT_PUBLIC_SITE_URL ?? "https://www.casaesusy.com.ar").replace(/\/$/, "");
