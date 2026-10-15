import Image from "next/image";
import { cn } from "@/lib/utils";

/** Logo original de Casa Esusy, vectorizado. Proporción 2286 × 702. */
export function Logo({
  variante = "oscuro",
  className,
  prioridad = false,
}: {
  variante?: "oscuro" | "claro";
  className?: string;
  prioridad?: boolean;
}) {
  return (
    <Image
      src={variante === "claro" ? "/marca/logo-claro.svg" : "/marca/logo.svg"}
      alt="Casa Esusy Decoraciones"
      width={2286}
      height={702}
      unoptimized
      priority={prioridad}
      className={cn("h-10 w-auto select-none", className)}
    />
  );
}

/** Logo que cambia de color con el tema (panel). */
export function LogoAdaptable({ className }: { className?: string }) {
  return (
    <>
      <Logo className={cn("dark:hidden", className)} />
      <Logo variante="claro" className={cn("hidden dark:block", className)} />
    </>
  );
}

export function Isotipo({ variante = "oscuro", className }: { variante?: "oscuro" | "claro"; className?: string }) {
  return (
    <Image
      src={variante === "claro" ? "/marca/isotipo-claro.svg" : "/marca/isotipo.svg"}
      alt=""
      width={808}
      height={808}
      unoptimized
      className={cn("size-8 select-none", className)}
    />
  );
}
