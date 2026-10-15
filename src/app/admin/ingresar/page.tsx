import type { Metadata } from "next";
import Image from "next/image";
import { redirect } from "next/navigation";
import { FormularioIngreso } from "@/components/admin/FormularioIngreso";
import { LogoAdaptable } from "@/components/sitio/Logo";
import { obtenerUsuario } from "@/lib/auth/sesion";

export const metadata: Metadata = { title: "Ingresar al panel", robots: { index: false, follow: false } };

export default async function Ingresar() {
  if (await obtenerUsuario()) redirect("/admin");
  return (
    <main className="grid min-h-dvh bg-background lg:grid-cols-2">
      <div className="flex flex-col justify-between gap-10 p-6 sm:p-10">
        <span className="self-start"><LogoAdaptable className="h-11 w-auto" /></span>
        <div className="mx-auto flex w-full max-w-sm flex-col gap-8">
          <div className="flex flex-col gap-2">
            <h1 className="text-3xl font-semibold tracking-tight">Panel de Casa Esusy</h1>
            <p className="text-muted-foreground">Ingresá para gestionar consultas, presupuestos y el sitio.</p>
          </div>
          <FormularioIngreso />
        </div>
        <p className="text-xs text-muted-foreground">Acceso solo para el equipo de Casa Esusy.</p>
      </div>
      <div className="relative hidden p-4 lg:block">
        <div className="relative h-full overflow-hidden rounded-[2rem]">
          <Image src="/img/ambientes/muestrario-telas.jpg" alt="" fill priority sizes="50vw" className="object-cover" />
          <div className="absolute inset-0 bg-gradient-to-t from-pizarra-profundo/80 via-pizarra-profundo/10 to-transparent" />
          <p className="absolute right-10 bottom-10 left-10 text-2xl leading-snug font-semibold text-marfil text-balance">
            “Tres generaciones eligiendo telas.” Desde 1967 en Banfield.
          </p>
        </div>
      </div>
    </main>
  );
}
