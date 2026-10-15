import Link from "next/link";
import { ArrowLeftIcon } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Logo } from "@/components/sitio/Logo";

export default function NoEncontrada() {
  return (
    <main className="grid min-h-dvh place-items-center bg-background px-6 py-16">
      <div className="flex max-w-md flex-col items-center gap-6 text-center">
        <Link href="/" aria-label="Inicio">
          <Logo className="h-12" />
        </Link>
        <p className="text-8xl font-semibold tracking-tight text-terracota/80">404</p>
        <h1 className="text-3xl font-semibold">Esta página no existe</h1>
        <p className="text-lg text-muted-foreground">Puede que el enlace haya cambiado. Te dejamos algunos caminos:</p>
        <div className="flex flex-wrap justify-center gap-2">
          <Button asChild size="lg" className="h-12 rounded-full px-6">
            <Link href="/">
              <ArrowLeftIcon data-icon="inline-start" /> Ir al inicio
            </Link>
          </Button>
          <Button asChild size="lg" variant="outline" className="h-12 rounded-full px-6">
            <Link href="/presupuesto">Pedir presupuesto</Link>
          </Button>
        </div>
      </div>
    </main>
  );
}
