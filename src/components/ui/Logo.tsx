/**
 * Versión dibujada del monograma de Casa Esusy (líneas geométricas en gris).
 * Reemplazar por el SVG original del logo cuando lo tengamos.
 */
export function Logo({ className = "" }: { className?: string }) {
  return (
    <span className={`inline-flex items-center gap-2.5 ${className}`}>
      <svg viewBox="0 0 40 40" className="size-9 shrink-0" aria-hidden="true">
        <g fill="none" stroke="var(--grafito)" strokeWidth="2.2" strokeLinecap="square">
          <path d="M8 6v28M13 6v20h8M27 14v20M32 14v20M19 14h13" />
          <path d="M13 31h8" />
        </g>
      </svg>
      <span className="leading-none whitespace-nowrap">
        <span className="display block text-[1.45rem] tracking-[0.02em] text-hilo">Casa Esusy</span>
        <span className="mt-0.5 block text-[0.6875rem] tracking-[0.08em] text-grafito">
          Decoraciones
        </span>
      </span>
    </span>
  );
}
