"use client";

import { AnimatePresence, m } from "motion/react";
import { useSearchParams } from "next/navigation";
import { useState } from "react";
import { Check, ChevronLeft } from "lucide-react";
import { clasesBoton } from "@/components/ui/Boton";
import { IconoWhatsApp } from "@/components/ui/IconoWhatsApp";
import { urlWhatsApp } from "@/content/negocio";
import { pedidoPresupuesto, type PedidoPresupuesto } from "@/lib/validacion";
import { registrarEvento } from "@/lib/analitica";

const opciones = [
  { valor: "cortinas", nombre: "Cortinas" },
  { valor: "tapiceria", nombre: "Sillón o retapizado" },
  { valor: "dormitorio", nombre: "Acolchados o cubrecamas" },
  { valor: "alfombras", nombre: "Alfombras" },
  { valor: "empapelados", nombre: "Empapelados" },
  { valor: "pisos", nombre: "Pisos" },
  { valor: "diseno", nombre: "Diseño de un ambiente" },
  { valor: "otro", nombre: "Otra cosa" },
];

const pasos = ["Qué necesitás", "Detalles", "Tus datos"] as const;

const inputClase =
  "mt-1.5 block min-h-12 w-full rounded-[12px] border border-separator bg-surface px-4 text-[1.0625rem] text-hilo placeholder:text-grafito/70 focus:border-rosa focus:outline-none";

type Errores = Partial<Record<keyof PedidoPresupuesto, string>>;

export function FormularioPresupuesto() {
  const params = useSearchParams();
  const inicial = opciones.some((o) => o.valor === params.get("servicio"))
    ? params.get("servicio")!
    : "";
  const [paso, setPaso] = useState(inicial ? 1 : 0);
  const [datos, setDatos] = useState<PedidoPresupuesto>({
    servicio: inicial,
    nombre: "",
    telefono: "",
  });
  const [errores, setErrores] = useState<Errores>({});
  const [enviado, setEnviado] = useState(false);

  const set = (k: keyof PedidoPresupuesto) => (e: { target: { value: string } }) =>
    setDatos((d) => ({ ...d, [k]: e.target.value }));

  function validar(campos: (keyof PedidoPresupuesto)[]) {
    const r = pedidoPresupuesto.safeParse(datos);
    if (r.success) {
      setErrores({});
      return true;
    }
    const nuevos: Errores = {};
    for (const issue of r.error.issues) {
      const k = issue.path[0] as keyof PedidoPresupuesto;
      if (campos.includes(k) && !nuevos[k]) nuevos[k] = issue.message;
    }
    setErrores(nuevos);
    return Object.keys(nuevos).length === 0;
  }

  function enviar() {
    if (!validar(["nombre", "telefono", "servicio"])) return;
    if (datos.web) return;
    const servicio = opciones.find((o) => o.valor === datos.servicio)?.nombre ?? datos.servicio;
    const texto = [
      `Hola Casa Esusy, soy ${datos.nombre}. Quiero pedir presupuesto.`,
      `• Servicio: ${servicio}`,
      datos.ambiente && `• Ambiente: ${datos.ambiente}`,
      datos.medidas && `• Medidas aproximadas: ${datos.medidas}`,
      datos.detalle && `• Detalle: ${datos.detalle}`,
      datos.zona && `• Zona: ${datos.zona}`,
      `• Teléfono: ${datos.telefono}`,
    ]
      .filter(Boolean)
      .join("\n");
    // Fase 1d: además se guarda como lead en el panel (Server Action + Turnstile + rate limit).
    registrarEvento("envio_presupuesto", { servicio: datos.servicio });
    window.open(urlWhatsApp(texto), "_blank", "noopener");
    setEnviado(true);
  }

  if (enviado) {
    return (
      <m.div
        initial={{ opacity: 0, scale: 0.97 }}
        animate={{ opacity: 1, scale: 1 }}
        className="rounded-[var(--radius-sheet)] bg-surface p-8 text-center shadow-[0_1px_0_var(--color-separator)]"
        role="status"
      >
        <m.span
          initial={{ scale: 0 }}
          animate={{ scale: 1 }}
          transition={{ type: "spring", stiffness: 300, damping: 16, delay: 0.1 }}
          className="mx-auto flex size-14 items-center justify-center rounded-full bg-[#e3f1e6] text-[#2f8a49]"
        >
          <Check className="size-7" />
        </m.span>
        <h2 className="display mt-5 text-[2rem]">Listo, {datos.nombre.split(" ")[0]}</h2>
        <p className="mx-auto mt-3 max-w-[40ch] text-hilo-2">
          Abrimos WhatsApp con tu pedido armado. Envialo y te respondemos en el horario del local
          para coordinar la medición.
        </p>
        <button
          type="button"
          onClick={() => setEnviado(false)}
          className={clasesBoton("texto", "mt-4")}
        >
          No se abrió WhatsApp, volver a intentar
        </button>
      </m.div>
    );
  }

  return (
    <form
      noValidate
      onSubmit={(e) => {
        e.preventDefault();
        if (paso < 2) {
          if (paso === 0 && !validar(["servicio"])) return;
          setPaso(paso + 1);
        } else enviar();
      }}
      className="rounded-[var(--radius-sheet)] bg-surface p-5 shadow-[0_1px_0_var(--color-separator)] sm:p-8"
    >
      {/* Progreso */}
      <ol className="flex gap-2" aria-label="Pasos">
        {pasos.map((p, i) => (
          <li key={p} className="flex-1">
            <span className={`block h-1 rounded-full ${i <= paso ? "bg-rosa" : "bg-hilo/10"}`} />
            <span
              className={`mt-2 block text-[0.8125rem] ${i === paso ? "text-hilo" : "text-grafito"}`}
            >
              {i + 1}. {p}
            </span>
          </li>
        ))}
      </ol>

      <AnimatePresence mode="wait" initial={false}>
        <m.fieldset
          key={paso}
          initial={{ opacity: 0, x: 24 }}
          animate={{ opacity: 1, x: 0 }}
          exit={{ opacity: 0, x: -24 }}
          transition={{ duration: 0.2 }}
          className="mt-8"
        >
          {paso === 0 && (
            <>
              <legend className="text-[1.25rem] font-semibold">¿Qué querés hacer?</legend>
              <div className="mt-4 grid grid-cols-2 gap-2.5">
                {opciones.map((o) => {
                  const activo = datos.servicio === o.valor;
                  return (
                    <label
                      key={o.valor}
                      className={`flex min-h-14 cursor-pointer items-center rounded-[12px] border px-4 text-[1rem] transition-colors ${
                        activo
                          ? "border-rosa bg-rosa-suave font-semibold"
                          : "border-separator hover:border-hilo/30"
                      }`}
                    >
                      <input
                        type="radio"
                        name="servicio"
                        value={o.valor}
                        checked={activo}
                        onChange={set("servicio")}
                        className="sr-only"
                      />
                      {o.nombre}
                    </label>
                  );
                })}
              </div>
              {errores.servicio && (
                <p className="mt-3 text-[0.9375rem] text-rosa">{errores.servicio}</p>
              )}
            </>
          )}

          {paso === 1 && (
            <div className="space-y-5">
              <legend className="text-[1.25rem] font-semibold">Contanos un poco más</legend>
              <label className="block">
                <span className="text-[0.9375rem] font-medium">Ambiente</span>
                <input
                  className={inputClase}
                  value={datos.ambiente ?? ""}
                  onChange={set("ambiente")}
                  placeholder="Living, dormitorio, oficina…"
                />
              </label>
              <label className="block">
                <span className="text-[0.9375rem] font-medium">Medidas aproximadas (opcional)</span>
                <input
                  className={inputClase}
                  value={datos.medidas ?? ""}
                  onChange={set("medidas")}
                  placeholder="Ej.: ventana de 2 × 2,20 m"
                />
                <span className="mt-1.5 block text-[0.8125rem] text-grafito">
                  Si no las sabés, no hay problema: medimos nosotros.
                </span>
              </label>
              <label className="block">
                <span className="text-[0.9375rem] font-medium">
                  ¿Algo más que tengamos que saber?
                </span>
                <textarea
                  className={`${inputClase} min-h-28 py-3`}
                  value={datos.detalle ?? ""}
                  onChange={set("detalle")}
                  placeholder="Colores que te gustan, si hay mascotas, si buscás oscuridad total…"
                />
              </label>
            </div>
          )}

          {paso === 2 && (
            <div className="space-y-5">
              <legend className="text-[1.25rem] font-semibold">¿Cómo te contactamos?</legend>
              <label className="block">
                <span className="text-[0.9375rem] font-medium">Nombre</span>
                <input
                  className={inputClase}
                  value={datos.nombre}
                  onChange={set("nombre")}
                  autoComplete="name"
                  aria-invalid={!!errores.nombre}
                  aria-describedby={errores.nombre ? "err-nombre" : undefined}
                />
                {errores.nombre && (
                  <span id="err-nombre" className="mt-1.5 block text-[0.875rem] text-rosa">
                    {errores.nombre}
                  </span>
                )}
              </label>
              <label className="block">
                <span className="text-[0.9375rem] font-medium">Teléfono o WhatsApp</span>
                <input
                  className={inputClase}
                  type="tel"
                  inputMode="tel"
                  autoComplete="tel"
                  value={datos.telefono}
                  onChange={set("telefono")}
                  aria-invalid={!!errores.telefono}
                  aria-describedby={errores.telefono ? "err-telefono" : undefined}
                />
                {errores.telefono && (
                  <span id="err-telefono" className="mt-1.5 block text-[0.875rem] text-rosa">
                    {errores.telefono}
                  </span>
                )}
              </label>
              <label className="block">
                <span className="text-[0.9375rem] font-medium">Barrio o localidad (opcional)</span>
                <input
                  className={inputClase}
                  value={datos.zona ?? ""}
                  onChange={set("zona")}
                  autoComplete="address-level2"
                  placeholder="Banfield, Temperley, Lomas…"
                />
              </label>
              <label className="sr-only" aria-hidden="true">
                No completar
                <input
                  tabIndex={-1}
                  autoComplete="off"
                  value={datos.web ?? ""}
                  onChange={set("web")}
                />
              </label>
            </div>
          )}
        </m.fieldset>
      </AnimatePresence>

      <div className="mt-8 flex items-center justify-between gap-3">
        {paso > 0 ? (
          <button
            type="button"
            onClick={() => setPaso(paso - 1)}
            className={clasesBoton("secundario", "pl-3")}
          >
            <ChevronLeft className="size-5" aria-hidden="true" /> Atrás
          </button>
        ) : (
          <span />
        )}
        {paso < 2 ? (
          <button type="submit" className={clasesBoton("primario")}>
            Continuar
          </button>
        ) : (
          <button type="submit" className={clasesBoton("whatsapp")}>
            <IconoWhatsApp className="size-5" /> Enviar por WhatsApp
          </button>
        )}
      </div>
    </form>
  );
}
