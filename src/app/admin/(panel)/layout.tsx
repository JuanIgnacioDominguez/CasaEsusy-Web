import type { Metadata } from "next";
import { cookies } from "next/headers";
import { SidebarInset, SidebarProvider } from "@/components/ui/sidebar";
import { BarraLateral } from "@/components/admin/BarraLateral";
import { Cabecera } from "@/components/admin/Cabecera";
import { requerirUsuario } from "@/lib/auth/sesion";
import { contarConsultasNuevas } from "@/lib/datos/admin";

export const metadata: Metadata = {
  title: { default: "Panel", template: "%s · Panel Casa Esusy" },
  robots: { index: false, follow: false },
};

export default async function PanelLayout({ children }: { children: React.ReactNode }) {
  const usuario = await requerirUsuario();
  const [nuevas, jar] = await Promise.all([contarConsultasNuevas(), cookies()]);
  const abierta = jar.get("sidebar_state")?.value !== "false";
  return (
    <SidebarProvider defaultOpen={abierta}>
      <BarraLateral usuario={usuario} nuevas={nuevas} />
      <SidebarInset className="min-w-0">
        <Cabecera usuario={usuario} />
        <div className="flex flex-1 flex-col gap-6 p-4 sm:p-6 lg:p-8">{children}</div>
      </SidebarInset>
    </SidebarProvider>
  );
}
