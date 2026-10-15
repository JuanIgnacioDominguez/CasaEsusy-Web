import Link from "next/link";
import { BotonLink } from "@/components/ui/Boton";
import { IconoWhatsApp } from "@/components/ui/IconoWhatsApp";
import { negocio, urlWhatsApp } from "@/content/negocio";

/** Llamado final de cada página: presupuesto sin cargo + WhatsApp. */
export function CierreContacto({
  titulo = "Contanos qué ambiente querés cambiar",
  mensaje = "Hola Casa Esusy, quiero hacer una consulta.",
}: {
  titulo?: string;
  mensaje?: string;
}) {
  return (
    <section className="contenedor mt-24">
      <div className="grid gap-8 rounded-[28px] bg-hilo px-6 py-12 text-lino sm:px-12 md:grid-cols-[1.4fr_1fr] md:items-end md:py-16">
        <div>
          <h2 className="display text-[2.4rem] sm:text-[3.2rem]">{titulo}</h2>
          <p className="mt-4 max-w-[48ch] text-lino/75">
            Vamos a tu casa a medir, llevamos muestras y te pasamos el presupuesto sin cargo.
            Atendemos Banfield y toda la zona sur.
          </p>
        </div>
        <div className="flex flex-col gap-3 sm:flex-row md:flex-col md:items-stretch">
          <Link
            href="/presupuesto"
            className="inline-flex min-h-11 items-center justify-center rounded-full bg-lino px-5 text-[0.9375rem] font-semibold text-hilo transition-colors hover:bg-white active:scale-[0.97]"
          >
            Pedir presupuesto
          </Link>
          <BotonLink href={urlWhatsApp(mensaje)} externo variante="whatsapp">
            <IconoWhatsApp className="size-5" /> {negocio.telefono.visible}
          </BotonLink>
        </div>
      </div>
    </section>
  );
}
