import { EncabezadoPagina } from "@/components/admin/comunes";
import { VistaConfiguracion } from "@/components/admin/VistaConfiguracion";
import { getAjuste } from "@/lib/ajustes";
import { requerirUsuario } from "@/lib/auth/sesion";

export const metadata = { title: "Configuración" };

export default async function Configuracion({ searchParams }: { searchParams: Promise<{ tab?: string }> }) {
  const usuario = await requerirUsuario();
  const [{ tab }, negocio, whatsapp, presupuestos] = await Promise.all([searchParams, getAjuste("negocio"), getAjuste("whatsapp"), getAjuste("presupuestos")]);
  return (
    <>
      <EncabezadoPagina titulo="Configuración" descripcion="Datos del negocio, horarios, WhatsApp y valores por defecto de los presupuestos." />
      <VistaConfiguracion
        negocio={negocio}
        whatsapp={whatsapp}
        presupuestos={presupuestos}
        puedeVentas={usuario.rol !== "contenido"}
        puedeContenido={usuario.rol !== "ventas"}
        tab={tab}
      />
    </>
  );
}
