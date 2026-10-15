import type { SVGProps } from "react";

/** Íconos de marcas (lucide ya no los incluye). Trazos simples, heredan el color. */

export function IconoWhatsApp(props: SVGProps<SVGSVGElement>) {
  return (
    <svg viewBox="0 0 24 24" fill="currentColor" aria-hidden {...props}>
      <path d="M17.47 14.38c-.3-.15-1.75-.86-2.02-.96-.27-.1-.47-.15-.67.15-.2.3-.77.96-.94 1.16-.17.2-.35.22-.64.07-.3-.15-1.25-.46-2.38-1.47-.88-.79-1.47-1.76-1.64-2.05-.17-.3-.02-.46.13-.6.13-.14.3-.35.44-.52.15-.18.2-.3.3-.5.1-.2.05-.37-.02-.52-.08-.15-.67-1.6-.92-2.2-.24-.58-.49-.5-.67-.5h-.57c-.2 0-.52.07-.79.37-.27.3-1.04 1.02-1.04 2.48s1.07 2.88 1.21 3.08c.15.2 2.1 3.2 5.08 4.49.71.3 1.26.49 1.7.62.71.23 1.36.2 1.87.12.57-.08 1.75-.72 2-1.41.25-.7.25-1.29.17-1.41-.07-.13-.27-.2-.57-.35M12.05 21.5h-.01a9.4 9.4 0 0 1-4.8-1.31l-.34-.2-3.56.93.95-3.47-.22-.36a9.4 9.4 0 0 1-1.44-5.01c0-5.2 4.23-9.42 9.43-9.42 2.52 0 4.88.98 6.66 2.76a9.36 9.36 0 0 1 2.76 6.67c0 5.2-4.23 9.42-9.43 9.42m8.02-17.43A11.27 11.27 0 0 0 12.05.75C5.8.75.72 5.83.72 12.08c0 2 .52 3.95 1.52 5.66L.62 23.25l5.65-1.48a11.3 11.3 0 0 0 5.78 1.47c6.24 0 11.32-5.08 11.33-11.33 0-3.03-1.18-5.87-3.32-8.01" />
    </svg>
  );
}

export function IconoInstagram(props: SVGProps<SVGSVGElement>) {
  return (
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={1.8} strokeLinecap="round" strokeLinejoin="round" aria-hidden {...props}>
      <rect x="3" y="3" width="18" height="18" rx="5" />
      <circle cx="12" cy="12" r="4.2" />
      <circle cx="17.4" cy="6.6" r="0.6" fill="currentColor" stroke="none" />
    </svg>
  );
}

export function IconoFacebook(props: SVGProps<SVGSVGElement>) {
  return (
    <svg viewBox="0 0 24 24" fill="currentColor" aria-hidden {...props}>
      <path d="M13.5 21.9v-7.6h2.6l.4-3h-3V9.4c0-.87.24-1.46 1.49-1.46h1.6V5.26a21 21 0 0 0-2.33-.12c-2.3 0-3.88 1.4-3.88 3.98v2.2H7.75v3h2.63v7.58A10 10 0 1 1 13.5 21.9" />
    </svg>
  );
}

export function IconoGoogle(props: SVGProps<SVGSVGElement>) {
  return (
    <svg viewBox="0 0 24 24" aria-hidden {...props}>
      <path fill="#4285F4" d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92a5.06 5.06 0 0 1-2.2 3.32v2.77h3.57c2.08-1.92 3.27-4.74 3.27-8.1" />
      <path fill="#34A853" d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84A11 11 0 0 0 12 23" />
      <path fill="#FBBC05" d="M5.84 14.1A6.6 6.6 0 0 1 5.5 12c0-.73.13-1.44.35-2.1V7.06H2.18A11 11 0 0 0 1 12c0 1.78.43 3.45 1.18 4.94z" />
      <path fill="#EA4335" d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1A11 11 0 0 0 2.18 7.06l3.66 2.84C6.71 7.3 9.14 5.38 12 5.38" />
    </svg>
  );
}

export function Estrellas({ puntaje, className }: { puntaje: number; className?: string }) {
  return (
    <span className={className} role="img" aria-label={`${puntaje.toLocaleString("es-AR")} de 5 estrellas`}>
      {Array.from({ length: 5 }, (_, i) => {
        const relleno = Math.max(0, Math.min(1, puntaje - i));
        return (
          <svg key={i} viewBox="0 0 20 20" className="inline-block size-[1em]" aria-hidden>
            <defs>
              <linearGradient id={`e-${i}-${relleno}`}>
                <stop offset={`${relleno * 100}%`} stopColor="#E3A33B" />
                <stop offset={`${relleno * 100}%`} stopColor="currentColor" stopOpacity="0.2" />
              </linearGradient>
            </defs>
            <path
              fill={`url(#e-${i}-${relleno})`}
              d="M10 1.5l2.6 5.6 6.1.7-4.5 4.2 1.2 6-5.4-3.1-5.4 3.1 1.2-6L1.3 7.8l6.1-.7z"
            />
          </svg>
        );
      })}
    </span>
  );
}
