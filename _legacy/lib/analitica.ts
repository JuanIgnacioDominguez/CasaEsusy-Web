type Datos = Record<string, string | number | boolean>;

declare global {
  interface Window {
    dataLayer?: unknown[];
    gtag?: (...args: unknown[]) => void;
  }
}

/**
 * Eventos de conversión (sección 21 del plan). Envía a GA4 si está cargado
 * (con consentimiento) y si no, no hace nada.
 */
export function registrarEvento(nombre: string, datos: Datos = {}) {
  if (typeof window === "undefined") return;
  if (window.gtag) window.gtag("event", nombre, datos);
  else window.dataLayer?.push({ event: nombre, ...datos });
}
