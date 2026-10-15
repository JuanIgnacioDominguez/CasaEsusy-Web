"use client";

import { useState, useTransition } from "react";
import Image from "next/image";
import Link from "next/link";
import { AnimatePresence } from "motion/react";
import * as m from "motion/react-m";
import { ArrowLeftIcon, ArrowRightIcon, CheckIcon, HelpCircleIcon } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Field, FieldDescription, FieldError, FieldGroup, FieldLabel } from "@/components/ui/field";
import { Input } from "@/components/ui/input";
import { Select, SelectContent, SelectGroup, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Spinner } from "@/components/ui/spinner";
import { Switch } from "@/components/ui/switch";
import { Textarea } from "@/components/ui/textarea";
import { ToggleGroup, ToggleGroupItem } from "@/components/ui/toggle-group";
import { IconoWhatsApp } from "@/components/iconos";
import { enviarConsulta, type DatosConsulta } from "@/lib/acciones/publicas";
import { cn } from "@/lib/utils";

const AMBIENTES = ["Living", "Comedor", "Dormitorio", "Cuarto de chicos", "Cocina", "Baño", "Oficina o comercio", "Exterior"];
const PASOS = ["Servicio", "Detalles", "Contacto"];

export function FormularioPresupuesto({
  servicios,
  zonas,
  inicial,
}: {
  servicios: { slug: string; nombre: string; imagen: string }[];
  zonas: string[];
  inicial?: string;
}) {
  const nombreInicial = servicios.find((s) => s.slug === inicial)?.nombre ?? "";
  const [paso, setPaso] = useState(nombreInicial ? 1 : 0);
  const [direccion, setDireccion] = useState(1);
  const [datos, setDatos] = useState<DatosConsulta>({
    servicio: nombreInicial,
    ambientes: [],
    medidas: "",
    mensaje: "",
    conVisita: true,
    nombre: "",
    telefono: "",
    email: "",
    zona: "",
    web: "",
  });
  const [errores, setErrores] = useState<Partial<Record<keyof DatosConsulta, string>>>({});
  const [errorGeneral, setErrorGeneral] = useState("");
  const [whatsapp, setWhatsapp] = useState<string | null>(null);
  const [enviando, iniciar] = useTransition();

  const set = <K extends keyof DatosConsulta>(k: K, v: DatosConsulta[K]) => {
    setDatos((d) => ({ ...d, [k]: v }));
    setErrores((e) => ({ ...e, [k]: undefined }));
  };
  const ir = (n: number) => {
    setDireccion(n > paso ? 1 : -1);
    setPaso(n);
    if (typeof window !== "undefined") window.scrollTo({ top: 0, behavior: "smooth" });
  };

  const validarContacto = () => {
    const e: typeof errores = {};
    if (datos.nombre.trim().length < 2) e.nombre = "Ingresá tu nombre";
    if (datos.telefono.replace(/\D/g, "").length < 8) e.telefono = "Ingresá un teléfono con código de área";
    if (datos.email && !/^\S+@\S+\.\S+$/.test(datos.email)) e.email = "Revisá el email";
    setErrores(e);
    return Object.keys(e).length === 0;
  };

  const enviar = () => {
    if (!validarContacto()) return;
    setErrorGeneral("");
    iniciar(async () => {
      const r = await enviarConsulta(datos);
      if (r.ok) {
        setWhatsapp(r.whatsapp);
        ir(3);
      } else {
        setErrorGeneral(r.error);
        if (r.campos) setErrores(r.campos);
      }
    });
  };

  const variantes = {
    entra: (d: number) => ({ opacity: 0, x: d * 28 }),
    centro: { opacity: 1, x: 0 },
    sale: (d: number) => ({ opacity: 0, x: d * -28 }),
  };

  return (
    <div className="grid gap-8 lg:grid-cols-[1fr_21rem] lg:gap-12">
      <div className="flex flex-col gap-8 rounded-[2rem] border bg-card p-5 shadow-[0_30px_60px_-40px_rgb(42_47_53/0.35)] sm:p-9">
        {paso < 3 && (
          <ol className="grid grid-cols-3 gap-2" aria-label="Progreso">
            {PASOS.map((p, i) => (
              <li key={p} className="flex flex-col gap-2">
                <span className="h-1.5 overflow-hidden rounded-full bg-muted">
                  <m.span
                    className="block h-full rounded-full bg-terracota"
                    initial={false}
                    animate={{ width: i < paso ? "100%" : i === paso ? "50%" : "0%" }}
                    transition={{ duration: 0.5, ease: [0.22, 1, 0.36, 1] }}
                  />
                </span>
                <span className={cn("text-xs font-medium sm:text-sm", i <= paso ? "text-foreground" : "text-muted-foreground")}>
                  {i + 1}. {p}
                </span>
              </li>
            ))}
          </ol>
        )}

        <div className="relative min-h-[26rem]">
          <AnimatePresence mode="wait" custom={direccion} initial={false}>
            <m.div
              key={paso}
              custom={direccion}
              variants={variantes}
              initial="entra"
              animate="centro"
              exit="sale"
              transition={{ duration: 0.3, ease: [0.22, 1, 0.36, 1] }}
              className="flex flex-col gap-7"
            >
              {paso === 0 && (
                <>
                  <div className="flex flex-col gap-2">
                    <h2 className="text-2xl font-semibold sm:text-3xl">¿Qué necesitás?</h2>
                    <p className="text-muted-foreground">Elegí una opción. Si es más de una cosa, contanos en el paso siguiente.</p>
                  </div>
                  <div className="grid grid-cols-2 gap-3 sm:grid-cols-3">
                    {servicios.map((s) => (
                      <button
                        key={s.slug}
                        type="button"
                        onClick={() => {
                          set("servicio", s.nombre);
                          ir(1);
                        }}
                        aria-pressed={datos.servicio === s.nombre}
                        className={cn(
                          "group relative flex aspect-[4/3.4] items-end overflow-hidden rounded-2xl p-3 text-left ring-offset-2 ring-offset-card focus-visible:ring-3 focus-visible:ring-ring/60 focus-visible:outline-none",
                          datos.servicio === s.nombre && "ring-3 ring-terracota",
                        )}
                      >
                        <Image src={s.imagen} alt="" fill sizes="(min-width:640px) 220px, 45vw" className="object-cover transition-transform duration-500 group-hover:scale-105" />
                        <span className="absolute inset-0 bg-gradient-to-t from-black/70 via-black/15 to-transparent" />
                        <span className="relative text-[0.95rem] leading-tight font-semibold text-white">{s.nombre}</span>
                        {datos.servicio === s.nombre && (
                          <span className="absolute top-2.5 right-2.5 grid size-7 place-items-center rounded-full bg-terracota text-white">
                            <CheckIcon className="size-4" strokeWidth={3} />
                          </span>
                        )}
                      </button>
                    ))}
                    <button
                      type="button"
                      onClick={() => {
                        set("servicio", "Otro / no estoy seguro");
                        ir(1);
                      }}
                      className="flex aspect-[4/3.4] flex-col items-start justify-end gap-2 rounded-2xl border border-dashed bg-muted/40 p-3 text-left hover:bg-muted"
                    >
                      <HelpCircleIcon className="size-6 text-muted-foreground" />
                      <span className="text-[0.95rem] leading-tight font-semibold">Otro o no sé bien</span>
                    </button>
                  </div>
                </>
              )}

              {paso === 1 && (
                <>
                  <div className="flex flex-col gap-2">
                    <span className="text-sm font-medium text-terracota">{datos.servicio}</span>
                    <h2 className="text-2xl font-semibold sm:text-3xl">Contanos un poco más</h2>
                    <p className="text-muted-foreground">Nada es obligatorio: con una idea general ya podemos orientarte.</p>
                  </div>
                  <FieldGroup>
                    <Field>
                      <FieldLabel>¿En qué ambientes?</FieldLabel>
                      <ToggleGroup
                        type="multiple"
                        value={datos.ambientes}
                        onValueChange={(v) => set("ambientes", v)}
                        className="flex flex-wrap justify-start gap-2"
                      >
                        {AMBIENTES.map((a) => (
                          <ToggleGroupItem
                            key={a}
                            value={a}
                            className="h-10 rounded-full border bg-background px-4 data-[state=on]:border-pizarra data-[state=on]:bg-pizarra data-[state=on]:text-marfil"
                          >
                            {a}
                          </ToggleGroupItem>
                        ))}
                      </ToggleGroup>
                    </Field>
                    <Field>
                      <FieldLabel htmlFor="medidas">Medidas aproximadas</FieldLabel>
                      <Input
                        id="medidas"
                        value={datos.medidas}
                        onChange={(e) => set("medidas", e.target.value)}
                        placeholder="Ej.: ventana de 2 × 2,40 m"
                        className="h-12 rounded-xl text-base"
                      />
                    </Field>
                    <Field>
                      <FieldLabel htmlFor="mensaje">¿Qué tenés en mente?</FieldLabel>
                      <Textarea
                        id="mensaje"
                        value={datos.mensaje}
                        onChange={(e) => set("mensaje", e.target.value)}
                        placeholder="Colores, estilo, si querés oscurecer, si tenés mascotas…"
                        className="min-h-28 rounded-xl text-base"
                      />
                    </Field>
                    <Field orientation="horizontal" className="rounded-2xl border bg-background p-4">
                      <div className="flex flex-1 flex-col gap-1">
                        <FieldLabel htmlFor="visita">Quiero que vengan a medir</FieldLabel>
                        <FieldDescription>La visita y el presupuesto son sin cargo.</FieldDescription>
                      </div>
                      <Switch id="visita" checked={datos.conVisita} onCheckedChange={(v) => set("conVisita", v)} />
                    </Field>
                  </FieldGroup>
                </>
              )}

              {paso === 2 && (
                <>
                  <div className="flex flex-col gap-2">
                    <h2 className="text-2xl font-semibold sm:text-3xl">¿Cómo te contactamos?</h2>
                    <p className="text-muted-foreground">Te respondemos en el día hábil, por WhatsApp o por teléfono.</p>
                  </div>
                  <FieldGroup>
                    <Field data-invalid={!!errores.nombre || undefined}>
                      <FieldLabel htmlFor="nombre">Nombre</FieldLabel>
                      <Input
                        id="nombre"
                        autoComplete="name"
                        value={datos.nombre}
                        onChange={(e) => set("nombre", e.target.value)}
                        aria-invalid={!!errores.nombre || undefined}
                        className="h-12 rounded-xl text-base"
                      />
                      <FieldError>{errores.nombre}</FieldError>
                    </Field>
                    <div className="grid gap-5 sm:grid-cols-2">
                      <Field data-invalid={!!errores.telefono || undefined}>
                        <FieldLabel htmlFor="telefono">WhatsApp o teléfono</FieldLabel>
                        <Input
                          id="telefono"
                          type="tel"
                          inputMode="tel"
                          autoComplete="tel"
                          placeholder="11 2345-6789"
                          value={datos.telefono}
                          onChange={(e) => set("telefono", e.target.value)}
                          aria-invalid={!!errores.telefono || undefined}
                          className="h-12 rounded-xl text-base"
                        />
                        <FieldError>{errores.telefono}</FieldError>
                      </Field>
                      <Field data-invalid={!!errores.email || undefined}>
                        <FieldLabel htmlFor="email">
                          Email <span className="font-normal text-muted-foreground">(opcional)</span>
                        </FieldLabel>
                        <Input
                          id="email"
                          type="email"
                          autoComplete="email"
                          value={datos.email}
                          onChange={(e) => set("email", e.target.value)}
                          aria-invalid={!!errores.email || undefined}
                          className="h-12 rounded-xl text-base"
                        />
                        <FieldError>{errores.email}</FieldError>
                      </Field>
                    </div>
                    <Field>
                      <FieldLabel htmlFor="zona">Zona</FieldLabel>
                      <Select value={datos.zona} onValueChange={(v) => set("zona", v)}>
                        <SelectTrigger id="zona" className="h-12 w-full rounded-xl text-base">
                          <SelectValue placeholder="Elegí tu zona" />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectGroup>
                            {[...zonas, "Otra zona"].map((z) => (
                              <SelectItem key={z} value={z}>
                                {z}
                              </SelectItem>
                            ))}
                          </SelectGroup>
                        </SelectContent>
                      </Select>
                    </Field>
                    <input
                      type="text"
                      name="web"
                      tabIndex={-1}
                      autoComplete="off"
                      aria-hidden
                      className="absolute -left-[9999px] size-px opacity-0"
                      value={datos.web}
                      onChange={(e) => set("web", e.target.value)}
                    />
                    {errorGeneral && (
                      <p role="alert" className="rounded-xl bg-destructive/10 px-4 py-3 text-sm text-destructive">
                        {errorGeneral}
                      </p>
                    )}
                    <p className="text-xs leading-relaxed text-muted-foreground">
                      Usamos tus datos solo para responder esta consulta. Ver{" "}
                      <Link href="/legales/privacidad" className="underline underline-offset-2">
                        política de privacidad
                      </Link>
                      .
                    </p>
                  </FieldGroup>
                </>
              )}

              {paso === 3 && (
                <div className="flex flex-col items-center gap-6 py-8 text-center">
                  <m.span
                    initial={{ scale: 0.4, opacity: 0 }}
                    animate={{ scale: 1, opacity: 1 }}
                    transition={{ type: "spring", stiffness: 260, damping: 18 }}
                    className="grid size-20 place-items-center rounded-full bg-exito-suave text-exito"
                  >
                    <CheckIcon className="size-10" strokeWidth={2.5} />
                  </m.span>
                  <div className="flex max-w-md flex-col gap-3">
                    <h2 className="text-3xl font-semibold">¡Listo, {datos.nombre.split(" ")[0]}!</h2>
                    <p className="text-lg text-muted-foreground">
                      Recibimos tu consulta. Te escribimos en el día hábil para coordinar{datos.conVisita ? " la visita" : ""}.
                    </p>
                  </div>
                  {whatsapp && (
                    <div className="flex w-full max-w-sm flex-col gap-3">
                      <Button asChild size="lg" className="h-13 rounded-full bg-whatsapp text-base text-white hover:bg-[#1FB855]">
                        <a href={whatsapp} target="_blank" rel="noopener">
                          <IconoWhatsApp data-icon="inline-start" /> Enviar también por WhatsApp
                        </a>
                      </Button>
                      <p className="text-sm text-muted-foreground">Si querés una respuesta más rápida, mandanos el resumen por WhatsApp.</p>
                    </div>
                  )}
                  <Button asChild variant="ghost" className="rounded-full">
                    <Link href="/">Volver al inicio</Link>
                  </Button>
                </div>
              )}
            </m.div>
          </AnimatePresence>
        </div>

        {paso > 0 && paso < 3 && (
          <div className="flex items-center justify-between gap-3 border-t pt-6">
            <Button variant="ghost" size="lg" className="h-12 rounded-full" onClick={() => ir(paso - 1)}>
              <ArrowLeftIcon data-icon="inline-start" /> Atrás
            </Button>
            {paso === 1 ? (
              <Button size="lg" className="h-12 rounded-full px-7" onClick={() => ir(2)}>
                Continuar <ArrowRightIcon data-icon="inline-end" />
              </Button>
            ) : (
              <Button size="lg" className="h-12 rounded-full px-7" onClick={enviar} disabled={enviando}>
                {enviando ? <Spinner data-icon="inline-start" /> : null}
                {enviando ? "Enviando…" : "Enviar consulta"}
              </Button>
            )}
          </div>
        )}
      </div>

      <aside className="flex flex-col gap-4 lg:sticky lg:top-28 lg:self-start">
        <div className="flex flex-col gap-4 rounded-[1.75rem] bg-pizarra p-7 text-marfil">
          <p className="text-lg font-semibold">Qué pasa después</p>
          <ol className="flex flex-col gap-4 text-sm text-marfil/80">
            {[
              "Te escribimos para entender bien lo que buscás.",
              "Coordinamos una visita para medir y llevar muestras.",
              "Te mandamos el presupuesto detallado por WhatsApp.",
            ].map((t, i) => (
              <li key={t} className="flex gap-3">
                <span className="grid size-6 shrink-0 place-items-center rounded-full bg-marfil/10 text-xs font-bold text-marfil">{i + 1}</span>
                {t}
              </li>
            ))}
          </ol>
        </div>
        <p className="px-2 text-sm text-muted-foreground">Sin cargo y sin compromiso. Trabajamos en Banfield y toda la zona sur.</p>
      </aside>
    </div>
  );
}
