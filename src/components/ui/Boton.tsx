import Link from "next/link";
import type { ComponentProps, ReactNode } from "react";

type Variante = "primario" | "secundario" | "texto" | "whatsapp";

const base =
  "inline-flex min-h-11 items-center justify-center gap-2 rounded-full px-5 text-[0.9375rem] font-semibold transition-[background-color,color,transform] duration-200 active:scale-[0.97] select-none";

const variantes: Record<Variante, string> = {
  primario: "bg-rosa text-white hover:bg-rosa-hover",
  secundario: "bg-hilo/[0.07] text-hilo hover:bg-hilo/[0.12]",
  texto: "px-1 text-rosa underline-offset-4 hover:underline",
  whatsapp: "bg-[var(--whatsapp)] text-[#0b2a17] hover:bg-[var(--whatsapp-hover)]",
};

export function clasesBoton(variante: Variante = "primario", extra = "") {
  return `${base} ${variantes[variante]} ${extra}`;
}

export function BotonLink({
  href,
  variante = "primario",
  className = "",
  children,
  externo,
  ...rest
}: {
  href: string;
  variante?: Variante;
  className?: string;
  children: ReactNode;
  externo?: boolean;
} & Omit<ComponentProps<"a">, "href">) {
  if (externo) {
    return (
      <a
        href={href}
        target="_blank"
        rel="noopener"
        className={clasesBoton(variante, className)}
        {...rest}
      >
        {children}
      </a>
    );
  }
  return (
    <Link href={href} className={clasesBoton(variante, className)} {...rest}>
      {children}
    </Link>
  );
}
