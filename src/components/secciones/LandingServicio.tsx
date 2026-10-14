import Link from "next/link";
import { BotonLink } from "@/components/ui/Boton";
import { IconoWhatsApp } from "@/components/ui/IconoWhatsApp";
import { Migas } from "@/components/ui/Migas";
import { Muestra } from "@/components/ui/Muestra";
import { FotoPendiente } from "@/components/ui/FotoPendiente";
import { Preguntas } from "@/components/ui/Preguntas";
import { CierreContacto } from "@/components/secciones/CierreContacto";
import { JsonLd } from "@/components/seo/JsonLd";
import { urlWhatsApp } from "@/content/negocio";
import type { Servicio } from "@/content/servicios";
import { schemaFaq, schemaServicio } from "@/lib/seo";

/**
 * Landing de servicio (sección 6): qué es · opciones · proceso · galería ·
 * preguntas · llamado a presupuesto. En la Fase 1d el contenido viene
 * de `pages`/`products` y se edita por bloques desde el panel.
 */
export function LandingServicio({ s }: { s: Servicio }) {
  const ruta = `/${s.slug}`;
  return (
    <>
      <JsonLd
        data={[
          schemaServicio(s.titulo, s.metaDescripcion, ruta),
          ...(s.preguntas.length ? [schemaFaq(s.preguntas)] : []),
        ]}
      />

      <section className="contenedor pt-6 md:pt-10">
        <Migas items={[{ nombre: s.nombre, ruta }]} />
        <div className="mt-6 grid gap-10 md:grid-cols-[1.2fr_1fr] md:items-end">
          <div>
            <h1 className="display text-[clamp(2.6rem,6vw,4.25rem)]">{s.titulo}</h1>
            <p className="mt-5 max-w-[50ch] text-[1.125rem] text-hilo-2">{s.bajada}</p>
            <div className="mt-8 flex flex-wrap gap-3">
              <BotonLink href={`/presupuesto?servicio=${s.slug}`}>Pedir presupuesto</BotonLink>
              <BotonLink href={urlWhatsApp(s.mensajeWhatsApp)} externo variante="secundario">
                <IconoWhatsApp className="size-5 text-[#1fb855]" /> Consultar por WhatsApp
              </BotonLink>
            </div>
          </div>
          <Muestra
            textura={s.textura}
            className="aspect-[5/4] rounded-[var(--radius-card)]"
            etiqueta={`Textura de ${s.nombre.toLowerCase()}`}
          />
        </div>
      </section>

      <section className="contenedor mt-20 grid gap-10 md:grid-cols-[1fr_2fr]">
        <h2 className="display text-[2.2rem]">Cómo lo hacemos</h2>
        <div className="prose-esusy text-[1.0625rem] text-hilo-2">
          {s.intro.map((p) => (
            <p key={p.slice(0, 24)}>{p}</p>
          ))}
        </div>
      </section>

      {s.tipos.length > 0 && (
        <section className="contenedor mt-20" aria-labelledby="titulo-tipos">
          <h2 id="titulo-tipos" className="display text-[2.2rem]">
            Opciones
          </h2>
          <ul className="mt-8 divide-y divide-separator border-y border-separator">
            {s.tipos.map((t) => (
              <li key={t.slug}>
                <Link
                  href={`${ruta}/${t.slug}`}
                  className="group grid grid-cols-[64px_1fr] items-center gap-5 py-5 sm:grid-cols-[88px_1fr_auto]"
                >
                  <Muestra textura={t.textura} className="aspect-square rounded-[10px]" />
                  <span>
                    <span className="block text-[1.1875rem] font-semibold group-hover:text-rosa">
                      {t.nombre}
                    </span>
                    <span className="mt-1 block text-hilo-2">{t.resumen}</span>
                  </span>
                  <span className="hidden text-[0.9375rem] text-rosa sm:block">Ver detalle</span>
                </Link>
              </li>
            ))}
          </ul>
        </section>
      )}

      <section className="contenedor mt-20" aria-labelledby="titulo-trabajos">
        <h2 id="titulo-trabajos" className="display text-[2.2rem]">
          Trabajos recientes
        </h2>
        <div className="mt-8 grid gap-4 sm:grid-cols-3">
          <FotoPendiente
            textura={s.textura}
            descripcion={`${s.nombre.toLowerCase()} en un living`}
            className="aspect-[4/5] sm:col-span-2 sm:aspect-auto"
          />
          <div className="grid gap-4">
            <FotoPendiente
              textura="lino"
              descripcion="detalle de terminación"
              className="aspect-[4/3]"
            />
            <FotoPendiente
              textura="boucle"
              descripcion="ambiente terminado"
              className="aspect-[4/3]"
            />
          </div>
        </div>
      </section>

      {s.preguntas.length > 0 && (
        <section
          className="contenedor mt-20 grid gap-8 md:grid-cols-[1fr_2fr]"
          aria-labelledby="titulo-preguntas"
        >
          <h2 id="titulo-preguntas" className="display text-[2.2rem]">
            Preguntas frecuentes
          </h2>
          <Preguntas preguntas={s.preguntas} />
        </section>
      )}

      <CierreContacto mensaje={s.mensajeWhatsApp} />
    </>
  );
}
