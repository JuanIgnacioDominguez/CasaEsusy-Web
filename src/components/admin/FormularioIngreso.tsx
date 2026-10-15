"use client";

import { useActionState, useState } from "react";
import { EyeIcon, EyeOffIcon } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Field, FieldError, FieldGroup, FieldLabel } from "@/components/ui/field";
import { Input } from "@/components/ui/input";
import { InputGroup, InputGroupAddon, InputGroupButton, InputGroupInput } from "@/components/ui/input-group";
import { Spinner } from "@/components/ui/spinner";
import { ingresar, type EstadoIngreso } from "@/lib/acciones/sesion";

export function FormularioIngreso() {
  const [estado, accion, pendiente] = useActionState<EstadoIngreso, FormData>(ingresar, {});
  const [ver, setVer] = useState(false);
  return (
    <form action={accion}>
      <FieldGroup>
        <Field>
          <FieldLabel htmlFor="email">Email</FieldLabel>
          <Input id="email" name="email" type="email" autoComplete="username" required className="h-11" />
        </Field>
        <Field data-invalid={!!estado.error || undefined}>
          <FieldLabel htmlFor="clave">Contraseña</FieldLabel>
          <InputGroup className="h-11">
            <InputGroupInput
              id="clave"
              name="clave"
              type={ver ? "text" : "password"}
              autoComplete="current-password"
              required
              aria-invalid={!!estado.error || undefined}
            />
            <InputGroupAddon align="inline-end">
              <InputGroupButton size="icon-xs" onClick={() => setVer((v) => !v)} aria-label={ver ? "Ocultar contraseña" : "Mostrar contraseña"}>
                {ver ? <EyeOffIcon /> : <EyeIcon />}
              </InputGroupButton>
            </InputGroupAddon>
          </InputGroup>
          <FieldError>{estado.error}</FieldError>
        </Field>
        <Button type="submit" size="lg" className="h-11" disabled={pendiente}>
          {pendiente && <Spinner data-icon="inline-start" />}
          Ingresar
        </Button>
      </FieldGroup>
    </form>
  );
}
