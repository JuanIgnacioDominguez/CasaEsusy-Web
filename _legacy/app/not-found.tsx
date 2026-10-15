import { BotonLink } from "@/components/ui/Boton";
import { Muestra } from "@/components/ui/Muestra";

export default function NoEncontrada() {
  return (
    <section className="contenedor grid min-h-[60vh] items-center gap-10 py-16 md:grid-cols-2">
      <div>
        <h1 className="display text-[clamp(2.6rem,6vw,4rem)]">Esta página no existe</h1>
        <p className="mt-4 max-w-[44ch] text-hilo-2">
          Puede que el enlace haya cambiado. Volvé al inicio o mirá lo que hacemos.
        </p>
        <div className="mt-8 flex flex-wrap gap-3">
          <BotonLink href="/">Ir al inicio</BotonLink>
          <BotonLink href="/cortinas" variante="secundario">
            Ver cortinas
          </BotonLink>
        </div>
      </div>
      <Muestra textura="vichy" className="aspect-[4/3] rounded-[var(--radius-card)]" />
    </section>
  );
}
