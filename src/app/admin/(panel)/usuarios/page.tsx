import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { EncabezadoPagina } from "@/components/admin/comunes";
import { VistaUsuarios } from "@/components/admin/VistaUsuarios";
import { requerirUsuario } from "@/lib/auth/sesion";
import { listarActividad, listarUsuarios } from "@/lib/datos/admin";
import { fechaHora } from "@/lib/formato";

export const metadata = { title: "Usuarios" };

export default async function Usuarios() {
  const yo = await requerirUsuario(["admin"]);
  const [usuarios, actividad] = await Promise.all([listarUsuarios(), listarActividad(40)]);
  return (
    <>
      <EncabezadoPagina titulo="Usuarios y actividad" descripcion="Quién puede entrar al panel y qué puede hacer. Abajo, el registro de cambios." />
      <VistaUsuarios usuarios={usuarios} yo={yo.id} />
      <Card>
        <CardHeader>
          <CardTitle>Registro de actividad</CardTitle>
          <CardDescription>Últimos 40 cambios</CardDescription>
        </CardHeader>
        <CardContent>
          <ol className="flex flex-col divide-y text-sm">
            {actividad.map((a) => (
              <li key={a.id} className="flex flex-col gap-0.5 py-2.5 sm:flex-row sm:items-center sm:justify-between">
                <span>
                  <span className="font-medium">{a.usuario}</span> <span className="text-muted-foreground">{a.accion}</span> {a.entidad}
                  {a.detalle && <span className="text-muted-foreground"> · {a.detalle}</span>}
                </span>
                <span className="text-xs text-muted-foreground tabular-nums">{fechaHora(a.creado)}</span>
              </li>
            ))}
          </ol>
        </CardContent>
      </Card>
    </>
  );
}
