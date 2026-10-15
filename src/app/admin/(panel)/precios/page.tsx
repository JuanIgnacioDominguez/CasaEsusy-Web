import { InfoIcon } from "lucide-react";
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";
import { EncabezadoPagina } from "@/components/admin/comunes";
import { VistaPrecios } from "@/components/admin/VistaPrecios";
import { requerirUsuario } from "@/lib/auth/sesion";
import { listarPrecios } from "@/lib/datos/admin";

export const metadata = { title: "Lista de precios" };

export default async function Precios() {
  await requerirUsuario(["ventas"]);
  const precios = await listarPrecios();
  return (
    <>
      <EncabezadoPagina titulo="Lista de precios" descripcion="Los precios que usan las calculadoras de presupuestos. Editá un valor y se guarda solo." />
      <Alert>
        <InfoIcon />
        <AlertTitle>Valores de ejemplo</AlertTitle>
        <AlertDescription>Los precios cargados de inicio son orientativos. Reemplazalos por los reales; con “Ajustar” podés subir varios a la vez por inflación.</AlertDescription>
      </Alert>
      <VistaPrecios precios={precios} />
    </>
  );
}
