import { Aparecer } from "@/components/motion/Aparecer";
import { cn } from "@/lib/utils";

export function Encabezado({
  rotulo,
  titulo,
  bajada,
  alineacion = "izquierda",
  className,
  claro = false,
  children,
}: {
  rotulo?: string;
  titulo: string;
  bajada?: string;
  alineacion?: "izquierda" | "centro";
  className?: string;
  claro?: boolean;
  children?: React.ReactNode;
}) {
  return (
    <Aparecer
      className={cn(
        "flex flex-col gap-4",
        alineacion === "centro" ? "mx-auto max-w-2xl items-center text-center" : "max-w-2xl",
        className,
      )}
    >
      {rotulo && (
        <span className={cn("rotulo", claro ? "text-marfil/60" : "text-terracota")}>
          <span className="h-px w-6 bg-current" aria-hidden />
          {rotulo}
        </span>
      )}
      <h2
        className={cn(
          "text-[2rem] leading-[1.08] font-semibold sm:text-[2.6rem] lg:text-[3rem]",
          claro ? "text-marfil" : "text-foreground",
        )}
      >
        {titulo}
      </h2>
      {bajada && (
        <p className={cn("text-[1.0625rem] leading-relaxed sm:text-lg", claro ? "text-marfil/70" : "text-muted-foreground")}>
          {bajada}
        </p>
      )}
      {children}
    </Aparecer>
  );
}
