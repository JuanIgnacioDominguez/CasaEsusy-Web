"use client";

import { useState, useTransition } from "react";
import { PlusIcon, SaveIcon, Trash2Icon } from "lucide-react";
import { toast } from "sonner";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Field, FieldDescription, FieldGroup, FieldLabel, FieldSeparator } from "@/components/ui/field";
import { Input } from "@/components/ui/input";
import { InputGroup, InputGroupAddon, InputGroupInput, InputGroupText } from "@/components/ui/input-group";
import { Spinner } from "@/components/ui/spinner";
import { Switch } from "@/components/ui/switch";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Textarea } from "@/components/ui/textarea";
import { ToggleGroup, ToggleGroupItem } from "@/components/ui/toggle-group";
import { guardarAjustes } from "@/lib/acciones/contenido";
import { cambiarMiClave } from "@/lib/acciones/usuarios";
import type { AjustesPresupuestos, AjustesWhatsApp, ClaveAjuste, Negocio, ValorAjuste } from "@/lib/ajustes/esquemas";
import { urlWhatsApp } from "@/lib/whatsapp";

const DIAS = ["Dom", "Lun", "Mar", "Mié", "Jue", "Vie", "Sáb"];

function useGuardar<K extends ClaveAjuste>(clave: K) {
  const [pendiente, iniciar] = useTransition();
  const guardar = (valor: ValorAjuste<K>) =>
    iniciar(async () => {
      const r = await guardarAjustes(clave, valor);
      if (r.ok) toast.success(r.mensaje);
      else toast.error(r.error);
    });
  return { pendiente, guardar };
}

function BotonGuardar({ pendiente, onClick }: { pendiente: boolean; onClick: () => void }) {
  return (
    <Button onClick={onClick} disabled={pendiente}>
      {pendiente ? <Spinner data-icon="inline-start" /> : <SaveIcon data-icon="inline-start" />}
      Guardar cambios
    </Button>
  );
}

export function VistaConfiguracion({
  negocio,
  whatsapp,
  presupuestos,
  puedeVentas,
  puedeContenido,
  tab,
}: {
  negocio: Negocio;
  whatsapp: AjustesWhatsApp;
  presupuestos: AjustesPresupuestos;
  puedeVentas: boolean;
  puedeContenido: boolean;
  tab?: string;
}) {
  return (
    <Tabs defaultValue={tab ?? (puedeContenido ? "negocio" : "presupuestos")} className="gap-4">
      <TabsList className="no-scrollbar max-w-full overflow-x-auto">
        {puedeContenido && <TabsTrigger value="negocio">Negocio</TabsTrigger>}
        {puedeContenido && <TabsTrigger value="horarios">Horarios y zonas</TabsTrigger>}
        {puedeContenido && <TabsTrigger value="whatsapp">WhatsApp</TabsTrigger>}
        {puedeVentas && <TabsTrigger value="presupuestos">Presupuestos</TabsTrigger>}
        <TabsTrigger value="cuenta">Mi cuenta</TabsTrigger>
      </TabsList>
      {puedeContenido && (
        <>
          <TabsContent value="negocio">
            <DatosNegocio inicial={negocio} />
          </TabsContent>
          <TabsContent value="horarios">
            <HorariosZonas inicial={negocio} />
          </TabsContent>
          <TabsContent value="whatsapp">
            <ConfigWhatsApp inicial={whatsapp} numero={negocio.whatsapp} />
          </TabsContent>
        </>
      )}
      {puedeVentas && (
        <TabsContent value="presupuestos">
          <ConfigPresupuestos inicial={presupuestos} />
        </TabsContent>
      )}
      <TabsContent value="cuenta">
        <MiCuenta />
      </TabsContent>
    </Tabs>
  );
}

function DatosNegocio({ inicial }: { inicial: Negocio }) {
  const [d, setD] = useState(inicial);
  const { pendiente, guardar } = useGuardar("negocio");
  const campo = (k: keyof Negocio, etiqueta: string, ayuda?: string, tipo = "text") => (
    <Field>
      <FieldLabel htmlFor={`n-${k}`}>{etiqueta}</FieldLabel>
      <Input
        id={`n-${k}`}
        type={tipo}
        value={String(d[k] ?? "")}
        onChange={(e) => setD({ ...d, [k]: tipo === "number" ? Number(e.target.value) : e.target.value })}
      />
      {ayuda && <FieldDescription>{ayuda}</FieldDescription>}
    </Field>
  );
  return (
    <Card>
      <CardHeader>
        <CardTitle>Datos del negocio</CardTitle>
        <CardDescription>
          Nombre, dirección y teléfono (NAP): tienen que ser idénticos en el sitio, Google, Instagram y Facebook. Alimentan el pie del sitio, los datos estructurados y el botón de WhatsApp.
        </CardDescription>
      </CardHeader>
      <CardContent>
        <FieldGroup>
          <div className="grid gap-4 md:grid-cols-3">
            {campo("nombre", "Nombre")}
            {campo("lema", "Lema")}
            {campo("fundacion", "Año de fundación", undefined, "number")}
          </div>
          <Field>
            <FieldLabel htmlFor="n-desc">Descripción</FieldLabel>
            <Textarea id="n-desc" value={d.descripcion} onChange={(e) => setD({ ...d, descripcion: e.target.value })} />
          </Field>
          <FieldSeparator>Contacto</FieldSeparator>
          <div className="grid gap-4 md:grid-cols-3">
            {campo("telefonoVisible", "Teléfono visible", "Como se muestra en el sitio")}
            {campo("whatsapp", "WhatsApp", "Solo números con 549 adelante")}
            {campo("email", "Email", "Ideal: uno con el dominio propio", "email")}
          </div>
          <div className="grid gap-4 md:grid-cols-[1.5fr_1fr_1fr_0.7fr]">
            {campo("calle", "Calle y número")}
            {campo("localidad", "Localidad")}
            {campo("partido", "Partido")}
            {campo("codigoPostal", "CP")}
          </div>
          <FieldSeparator>Redes y Google</FieldSeparator>
          <div className="grid gap-4 md:grid-cols-2">
            {campo("instagram", "Instagram")}
            {campo("facebook", "Facebook")}
            {campo("googleMaps", "Link de Google Maps")}
            {campo("googleResenas", "Link para dejar reseña")}
          </div>
          <div className="grid gap-4 md:grid-cols-4">
            {campo("googlePuntaje", "Puntaje en Google", undefined, "number")}
            {campo("googleOpiniones", "Cantidad de opiniones", undefined, "number")}
            {campo("lat", "Latitud", undefined, "number")}
            {campo("lng", "Longitud", undefined, "number")}
          </div>
          <FieldSeparator>Diseñadora</FieldSeparator>
          <div className="grid gap-4 md:grid-cols-4">
            {campo("duenaNombre", "Nombre")}
            {campo("duenaCredencial", "Certificación")}
            {campo("duenaInstitucion", "Institución")}
            {campo("duenaAnio", "Año", undefined, "number")}
          </div>
        </FieldGroup>
      </CardContent>
      <CardFooter className="border-t">
        <BotonGuardar pendiente={pendiente} onClick={() => guardar(d)} />
      </CardFooter>
    </Card>
  );
}

function HorariosZonas({ inicial }: { inicial: Negocio }) {
  const [d, setD] = useState(inicial);
  const [zona, setZona] = useState("");
  const { pendiente, guardar } = useGuardar("negocio");
  const setH = (i: number, cambios: Partial<Negocio["horarios"][number]>) =>
    setD({ ...d, horarios: d.horarios.map((h, j) => (j === i ? { ...h, ...cambios } : h)) });
  return (
    <div className="grid gap-4 xl:grid-cols-2">
      <Card>
        <CardHeader>
          <CardTitle>Horarios de atención</CardTitle>
          <CardDescription>Se usan para el “Abierto ahora”, el aviso del botón de WhatsApp y Google.</CardDescription>
        </CardHeader>
        <CardContent className="flex flex-col gap-4">
          {d.horarios.map((h, i) => (
            <div key={i} className="flex flex-col gap-3 rounded-xl border p-4">
              <div className="flex gap-2">
                <Input value={h.dias} onChange={(e) => setH(i, { dias: e.target.value })} aria-label="Etiqueta" />
                <Button variant="ghost" size="icon" aria-label="Quitar" onClick={() => setD({ ...d, horarios: d.horarios.filter((_, j) => j !== i) })}>
                  <Trash2Icon />
                </Button>
              </div>
              <ToggleGroup
                type="multiple"
                variant="outline"
                size="sm"
                value={h.diasSemana.map(String)}
                onValueChange={(v) => setH(i, { diasSemana: v.map(Number).sort() })}
                className="flex-wrap justify-start"
              >
                {DIAS.map((dia, n) => (
                  <ToggleGroupItem key={dia} value={String(n)}>
                    {dia}
                  </ToggleGroupItem>
                ))}
              </ToggleGroup>
              <div className="grid grid-cols-2 gap-3">
                <Input type="time" value={h.desde} onChange={(e) => setH(i, { desde: e.target.value })} aria-label="Desde" />
                <Input type="time" value={h.hasta} onChange={(e) => setH(i, { hasta: e.target.value })} aria-label="Hasta" />
              </div>
            </div>
          ))}
          <Button
            variant="outline"
            className="self-start"
            onClick={() => setD({ ...d, horarios: [...d.horarios, { dias: "Nuevo horario", desde: "09:00", hasta: "13:00", diasSemana: [] }] })}
          >
            <PlusIcon data-icon="inline-start" /> Agregar franja
          </Button>
        </CardContent>
      </Card>
      <Card>
        <CardHeader>
          <CardTitle>Zonas de trabajo</CardTitle>
          <CardDescription>Dónde medís y colocás. Aparecen en el formulario y en los datos para Google.</CardDescription>
        </CardHeader>
        <CardContent className="flex flex-col gap-3">
          <div className="flex flex-wrap gap-2">
            {d.zonas.map((z) => (
              <span key={z} className="inline-flex items-center gap-1 rounded-full border bg-muted/50 py-1 pr-1 pl-3 text-sm">
                {z}
                <Button variant="ghost" size="icon-xs" aria-label={`Quitar ${z}`} onClick={() => setD({ ...d, zonas: d.zonas.filter((x) => x !== z) })}>
                  <Trash2Icon />
                </Button>
              </span>
            ))}
          </div>
          <form
            className="flex gap-2"
            onSubmit={(e) => {
              e.preventDefault();
              if (zona.trim() && !d.zonas.includes(zona.trim())) setD({ ...d, zonas: [...d.zonas, zona.trim()] });
              setZona("");
            }}
          >
            <Input value={zona} onChange={(e) => setZona(e.target.value)} placeholder="Ej.: Temperley" />
            <Button type="submit" variant="outline">
              Agregar
            </Button>
          </form>
        </CardContent>
      </Card>
      <div>
        <BotonGuardar pendiente={pendiente} onClick={() => guardar(d)} />
      </div>
    </div>
  );
}

function ConfigWhatsApp({ inicial, numero }: { inicial: AjustesWhatsApp; numero: string }) {
  const [d, setD] = useState(inicial);
  const { pendiente, guardar } = useGuardar("whatsapp");
  return (
    <Card className="max-w-2xl">
      <CardHeader>
        <CardTitle>Botón de WhatsApp</CardTitle>
        <CardDescription>El botón verde flotante del sitio. Cada servicio tiene además su propio mensaje.</CardDescription>
      </CardHeader>
      <CardContent>
        <FieldGroup>
          <Field orientation="horizontal" className="rounded-xl border p-4">
            <FieldLabel htmlFor="w-act" className="flex-1">
              Mostrar el botón flotante
            </FieldLabel>
            <Switch id="w-act" checked={d.activo} onCheckedChange={(v) => setD({ ...d, activo: v })} />
          </Field>
          <Field>
            <FieldLabel htmlFor="w-msg">Mensaje precargado</FieldLabel>
            <Textarea id="w-msg" value={d.mensaje} onChange={(e) => setD({ ...d, mensaje: e.target.value })} />
          </Field>
          <Field>
            <FieldLabel htmlFor="w-et">Etiqueta al pasar el mouse</FieldLabel>
            <Input id="w-et" value={d.etiqueta} onChange={(e) => setD({ ...d, etiqueta: e.target.value })} />
          </Field>
          <Button asChild variant="link" className="h-auto self-start px-0">
            <a href={urlWhatsApp(numero, d.mensaje)} target="_blank" rel="noopener">
              Probar el link
            </a>
          </Button>
        </FieldGroup>
      </CardContent>
      <CardFooter className="border-t">
        <BotonGuardar pendiente={pendiente} onClick={() => guardar(d)} />
      </CardFooter>
    </Card>
  );
}

function ConfigPresupuestos({ inicial }: { inicial: AjustesPresupuestos }) {
  const [d, setD] = useState(inicial);
  const { pendiente, guardar } = useGuardar("presupuestos");
  const num = (k: "validezDias" | "ivaPct" | "senaPct", etiqueta: string, unidad: string) => (
    <Field>
      <FieldLabel htmlFor={`p-${k}`}>{etiqueta}</FieldLabel>
      <InputGroup>
        <InputGroupInput id={`p-${k}`} inputMode="decimal" value={String(d[k])} onChange={(e) => setD({ ...d, [k]: Number(e.target.value.replace(",", ".")) || 0 })} />
        <InputGroupAddon align="inline-end">
          <InputGroupText>{unidad}</InputGroupText>
        </InputGroupAddon>
      </InputGroup>
    </Field>
  );
  return (
    <Card className="max-w-3xl">
      <CardHeader>
        <CardTitle>Valores por defecto</CardTitle>
        <CardDescription>Se aplican a cada presupuesto nuevo (después se pueden cambiar en cada uno).</CardDescription>
      </CardHeader>
      <CardContent>
        <FieldGroup>
          <div className="grid gap-4 sm:grid-cols-4">
            <Field>
              <FieldLabel htmlFor="p-pref">Prefijo</FieldLabel>
              <Input id="p-pref" value={d.prefijo} onChange={(e) => setD({ ...d, prefijo: e.target.value.toUpperCase().slice(0, 4) })} />
              <FieldDescription>{d.prefijo}-2026-0001</FieldDescription>
            </Field>
            {num("validezDias", "Validez", "días")}
            {num("senaPct", "Seña", "%")}
            {num("ivaPct", "IVA", "%")}
          </div>
          <Field>
            <FieldLabel htmlFor="p-cond">Condiciones</FieldLabel>
            <Textarea id="p-cond" value={d.condiciones} onChange={(e) => setD({ ...d, condiciones: e.target.value })} className="min-h-28" />
          </Field>
        </FieldGroup>
      </CardContent>
      <CardFooter className="border-t">
        <BotonGuardar pendiente={pendiente} onClick={() => guardar(d)} />
      </CardFooter>
    </Card>
  );
}

function MiCuenta() {
  const [actual, setActual] = useState("");
  const [nueva, setNueva] = useState("");
  const [pendiente, iniciar] = useTransition();
  return (
    <Card className="max-w-md">
      <CardHeader>
        <CardTitle>Cambiar contraseña</CardTitle>
        <CardDescription>Al cambiarla se cierran tus otras sesiones abiertas.</CardDescription>
      </CardHeader>
      <CardContent>
        <form
          onSubmit={(e) => {
            e.preventDefault();
            iniciar(async () => {
              const r = await cambiarMiClave(actual, nueva);
              if (!r.ok) return void toast.error(r.error);
              toast.success(r.mensaje);
              setActual("");
              setNueva("");
            });
          }}
        >
          <FieldGroup>
            <Field>
              <FieldLabel htmlFor="mc-actual">Contraseña actual</FieldLabel>
              <Input id="mc-actual" type="password" autoComplete="current-password" value={actual} onChange={(e) => setActual(e.target.value)} />
            </Field>
            <Field>
              <FieldLabel htmlFor="mc-nueva">Nueva contraseña</FieldLabel>
              <Input id="mc-nueva" type="password" autoComplete="new-password" value={nueva} onChange={(e) => setNueva(e.target.value)} />
              <FieldDescription>Mínimo 10 caracteres.</FieldDescription>
            </Field>
            <Button type="submit" disabled={pendiente} className="self-start">
              {pendiente && <Spinner data-icon="inline-start" />}
              Actualizar
            </Button>
          </FieldGroup>
        </form>
      </CardContent>
    </Card>
  );
}
