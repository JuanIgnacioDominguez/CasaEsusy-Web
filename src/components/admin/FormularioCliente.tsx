"use client";

import { useState, useTransition } from "react";
import { useRouter } from "next/navigation";
import { toast } from "sonner";
import { Button } from "@/components/ui/button";
import { Field, FieldGroup, FieldLabel } from "@/components/ui/field";
import { Input } from "@/components/ui/input";
import { Select, SelectContent, SelectGroup, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Spinner } from "@/components/ui/spinner";
import { Textarea } from "@/components/ui/textarea";
import { guardarCliente } from "@/lib/acciones/ventas";

export interface DatosCliente {
  id?: string;
  nombre: string;
  telefono: string;
  email: string;
  direccion: string;
  localidad: string;
  documento: string;
  condicionIva: string;
  notas: string;
}

export const CLIENTE_VACIO: DatosCliente = {
  nombre: "",
  telefono: "",
  email: "",
  direccion: "",
  localidad: "",
  documento: "",
  condicionIva: "Consumidor final",
  notas: "",
};

const CONDICIONES = ["Consumidor final", "Monotributista", "Responsable inscripto", "Exento"];

export function FormularioCliente({ inicial, onGuardado }: { inicial: DatosCliente; onGuardado?: (id: string) => void }) {
  const router = useRouter();
  const [d, setD] = useState(inicial);
  const [pendiente, iniciar] = useTransition();
  const set = (k: keyof DatosCliente, v: string) => setD((x) => ({ ...x, [k]: v }));
  return (
    <form
      onSubmit={(e) => {
        e.preventDefault();
        iniciar(async () => {
          const r = await guardarCliente(d);
          if (!r.ok) return void toast.error(r.error);
          toast.success(r.mensaje);
          if (r.datos) onGuardado?.(r.datos.id);
          router.refresh();
        });
      }}
    >
      <FieldGroup>
        <Field>
          <FieldLabel htmlFor="c-nombre">Nombre o razón social</FieldLabel>
          <Input id="c-nombre" required value={d.nombre} onChange={(e) => set("nombre", e.target.value)} />
        </Field>
        <div className="grid gap-4 sm:grid-cols-2">
          <Field>
            <FieldLabel htmlFor="c-tel">Teléfono / WhatsApp</FieldLabel>
            <Input id="c-tel" type="tel" value={d.telefono} onChange={(e) => set("telefono", e.target.value)} />
          </Field>
          <Field>
            <FieldLabel htmlFor="c-email">Email</FieldLabel>
            <Input id="c-email" type="email" value={d.email} onChange={(e) => set("email", e.target.value)} />
          </Field>
        </div>
        <div className="grid gap-4 sm:grid-cols-[1.5fr_1fr]">
          <Field>
            <FieldLabel htmlFor="c-dir">Dirección</FieldLabel>
            <Input id="c-dir" value={d.direccion} onChange={(e) => set("direccion", e.target.value)} />
          </Field>
          <Field>
            <FieldLabel htmlFor="c-loc">Localidad</FieldLabel>
            <Input id="c-loc" value={d.localidad} onChange={(e) => set("localidad", e.target.value)} />
          </Field>
        </div>
        <div className="grid gap-4 sm:grid-cols-2">
          <Field>
            <FieldLabel htmlFor="c-doc">DNI / CUIT</FieldLabel>
            <Input id="c-doc" inputMode="numeric" value={d.documento} onChange={(e) => set("documento", e.target.value)} />
          </Field>
          <Field>
            <FieldLabel>Condición frente al IVA</FieldLabel>
            <Select value={d.condicionIva} onValueChange={(v) => set("condicionIva", v)}>
              <SelectTrigger className="w-full">
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                <SelectGroup>
                  {CONDICIONES.map((c) => (
                    <SelectItem key={c} value={c}>
                      {c}
                    </SelectItem>
                  ))}
                </SelectGroup>
              </SelectContent>
            </Select>
          </Field>
        </div>
        <Field>
          <FieldLabel htmlFor="c-notas">Notas</FieldLabel>
          <Textarea id="c-notas" value={d.notas} onChange={(e) => set("notas", e.target.value)} placeholder="Medidas guardadas, preferencias, cómo llegar…" />
        </Field>
        <Button type="submit" disabled={pendiente} className="self-start">
          {pendiente && <Spinner data-icon="inline-start" />}
          Guardar cliente
        </Button>
      </FieldGroup>
    </form>
  );
}
