"use client";

import { useState, useTransition } from "react";
import { ArrowUpRightIcon } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Field, FieldError, FieldGroup, FieldLabel } from "@/components/ui/field";
import { Input } from "@/components/ui/input";
import { Spinner } from "@/components/ui/spinner";
import { Textarea } from "@/components/ui/textarea";
import { ToggleGroup, ToggleGroupItem } from "@/components/ui/toggle-group";
import { IconoWhatsApp } from "@/components/iconos";
import { enviarContacto } from "@/lib/acciones/publicas";

/** Contacto rápido: completa nombre y tema, y abre WhatsApp con el mensaje armado. */
export function FormularioContacto({ temas }: { temas: string[] }) {
  const [nombre, setNombre] = useState("");
  const [tema, setTema] = useState("");
  const [mensaje, setMensaje] = useState("");
  const [web, setWeb] = useState("");
  const [error, setError] = useState("");
  const [pendiente, iniciar] = useTransition();

  const vistaPrevia = [
    `Hola Casa Esusy, soy ${nombre.trim() || "[tu nombre]"}.`,
    tema ? `Les escribo por ${tema.toLowerCase()}.` : "Quiero hacer una consulta.",
    mensaje.trim(),
  ]
    .filter(Boolean)
    .join(" ");

  return (
    <form
      className="flex flex-col gap-6"
      onSubmit={(e) => {
        e.preventDefault();
        if (nombre.trim().length < 2) return setError("Ingresá tu nombre");
        setError("");
        iniciar(async () => {
          const r = await enviarContacto({ nombre, tema, mensaje, web });
          if (!r.ok) return setError(r.error);
          window.location.assign(r.whatsapp);
        });
      }}
    >
      <FieldGroup>
        <Field data-invalid={!!error || undefined}>
          <FieldLabel htmlFor="ct-nombre">Tu nombre</FieldLabel>
          <Input
            id="ct-nombre"
            autoComplete="name"
            value={nombre}
            onChange={(e) => setNombre(e.target.value)}
            aria-invalid={!!error || undefined}
            className="h-12 rounded-xl text-base"
          />
          <FieldError>{error}</FieldError>
        </Field>
        <Field>
          <FieldLabel>¿Sobre qué querés consultar?</FieldLabel>
          <ToggleGroup type="single" value={tema} onValueChange={setTema} className="flex flex-wrap justify-start gap-2">
            {temas.map((t) => (
              <ToggleGroupItem
                key={t}
                value={t}
                className="h-10 rounded-full border bg-background px-4 data-[state=on]:border-pizarra data-[state=on]:bg-pizarra data-[state=on]:text-marfil"
              >
                {t}
              </ToggleGroupItem>
            ))}
          </ToggleGroup>
        </Field>
        <Field>
          <FieldLabel htmlFor="ct-mensaje">
            Mensaje <span className="font-normal text-muted-foreground">(opcional)</span>
          </FieldLabel>
          <Textarea
            id="ct-mensaje"
            value={mensaje}
            onChange={(e) => setMensaje(e.target.value)}
            placeholder="Contanos qué necesitás, para qué ambiente o en qué zona estás"
            className="min-h-24 rounded-xl text-base"
          />
        </Field>
        <input
          type="text"
          tabIndex={-1}
          autoComplete="off"
          aria-hidden
          className="absolute -left-[9999px] size-px opacity-0"
          value={web}
          onChange={(e) => setWeb(e.target.value)}
        />
      </FieldGroup>

      <div className="flex flex-col gap-2 rounded-2xl bg-[#e7f8ec] p-4 dark:bg-[#0b3d2a]">
        <span className="text-xs font-medium text-[#1f7a45]">Así nos va a llegar tu mensaje</span>
        <p className="text-sm leading-relaxed text-[#173d29] dark:text-[#d9f5e3]">{vistaPrevia}</p>
      </div>

      <Button type="submit" size="lg" disabled={pendiente} className="h-13 rounded-lg bg-whatsapp text-base text-white hover:bg-[#1FB855]">
        {pendiente ? <Spinner data-icon="inline-start" /> : <IconoWhatsApp data-icon="inline-start" />}
        Continuar en WhatsApp
        <ArrowUpRightIcon data-icon="inline-end" />
      </Button>
    </form>
  );
}
