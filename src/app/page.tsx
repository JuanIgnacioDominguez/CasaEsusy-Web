import Link from "next/link";
import { Accessibility, MapPin } from "lucide-react";
import { BotonLink } from "@/components/ui/Boton";
import { IconoWhatsApp } from "@/components/ui/IconoWhatsApp";
import { Muestra } from "@/components/ui/Muestra";
import { FotoPendiente } from "@/components/ui/FotoPendiente";
import { HeroMuestras } from "@/components/secciones/HeroMuestras";
import { Resenas } from "@/components/secciones/Resenas";
import { EstadoHorario } from "@/components/secciones/EstadoHorario";
import { CierreContacto } from "@/components/secciones/CierreContacto";
import { direccionCompleta, negocio, urlWhatsApp, hora } from "@/content/negocio";
import { muestrario } from "@/content/servicios";
import { metadatos } from "@/lib/seo";

export const metadata = metadatos({ descripcion: negocio.descripcion, ruta: "/" });

const pasos = [
  {
    titulo: "Nos contás",
    texto: "Por WhatsApp, en el local o con el formulario. Si podés, mandanos fotos del ambiente.",
  },
  {
    titulo: "Medimos en tu casa",
    texto: "Vamos con muestras de telas y materiales, tomamos medidas y te asesoramos.",
  },
  {
    titulo: "Presupuesto sin cargo",
    texto: "Te pasamos el detalle de cada ítem y los plazos de confección.",
  },
  {
    titulo: "Confección y colocación",
    texto: "Lo hacemos a medida y nuestro colocador lo instala.",
  },
];

export default function Inicio() {
  const anios = new Date().getFullYear() - negocio.fundacion;
  return (
    <>
      {/* Hero */}
      <section className="contenedor grid items-center gap-10 pt-8 pb-12 md:grid-cols-[1.05fr_1fr] md:pt-14 md:pb-20">
        <div>
          <h1 className="display text-[clamp(2.75rem,7vw,4.75rem)]">
            Cortinas, sillones y ambientes completos, hechos a medida en Banfield
          </h1>
          <p className="mt-6 max-w-[46ch] text-[1.125rem] text-hilo-2">
            Somos una casa de decoración familiar: hace {anios} años que elegimos telas, medimos
            ventanas y transformamos casas de la zona sur. El presupuesto es sin cargo.
          </p>
          <div className="mt-8 flex flex-wrap gap-3">
            <BotonLink href="/presupuesto">Pedir presupuesto</BotonLink>
            <BotonLink
              href={urlWhatsApp("Hola Casa Esusy, quiero hacer una consulta.")}
              externo
              variante="secundario"
            >
              <IconoWhatsApp className="size-5 text-[#1fb855]" /> Escribinos
            </BotonLink>
          </div>
        </div>
        <HeroMuestras />
      </section>

      {/* Franja de confianza */}
      <section aria-label="Por qué Casa Esusy" className="border-y border-separator bg-surface">
        <dl className="contenedor grid grid-cols-2 divide-separator md:grid-cols-4 md:divide-x">
          {[
            { dato: "Desde 1967", detalle: "Tres generaciones en el oficio" },
            {
              dato: `${negocio.google.puntaje.toLocaleString("es-AR")} en Google`,
              detalle: `${negocio.google.opiniones} opiniones de clientes`,
            },
            { dato: "Sin cargo", detalle: "Medición y presupuesto" },
            { dato: "Colocación propia", detalle: "Instalamos lo que hacemos" },
          ].map((f) => (
            <div key={f.dato} className="py-6 md:px-6 md:first:pl-0">
              <dt className="display text-[1.6rem] leading-tight">{f.dato}</dt>
              <dd className="mt-1 text-[0.9375rem] text-hilo-2">{f.detalle}</dd>
            </div>
          ))}
        </dl>
      </section>

      {/* Muestrario */}
      <section className="contenedor mt-24" aria-labelledby="titulo-muestrario">
        <div className="flex flex-wrap items-end justify-between gap-4">
          <h2
            id="titulo-muestrario"
            className="display max-w-[16ch] text-[2.4rem] sm:text-[2.9rem]"
          >
            Todo para vestir tu casa, en un solo lugar
          </h2>
          <p className="max-w-[40ch] text-hilo-2">
            Elegí por dónde empezar. En el local tenés los muestrarios y catálogos completos.
          </p>
        </div>
        <ul className="mt-10 grid grid-cols-2 gap-x-4 gap-y-8 sm:grid-cols-3 lg:grid-cols-4">
          {muestrario.map((mu) => (
            <li key={mu.slug}>
              <Link href={mu.href} className="group block rounded-[var(--radius-card)]">
                <div className="relative overflow-hidden rounded-[var(--radius-card)] bg-surface p-2 shadow-[0_1px_0_var(--color-separator)] transition-transform duration-300 group-hover:-translate-y-1">
                  <Muestra textura={mu.textura} className="aspect-[4/5] rounded-[8px]" />
                  {/* Ojal de la etiqueta de muestra */}
                  <span
                    aria-hidden="true"
                    className="absolute top-4 left-1/2 size-3 -translate-x-1/2 rounded-full bg-lino shadow-inner"
                  />
                </div>
                <p className="mt-3 text-[1.0625rem] font-semibold group-hover:text-rosa">
                  {mu.nombre}
                </p>
                <p className="text-[0.9375rem] text-hilo-2">{mu.detalle}</p>
              </Link>
            </li>
          ))}
        </ul>
      </section>

      {/* Proceso */}
      <section className="contenedor mt-24" aria-labelledby="titulo-proceso">
        <h2 id="titulo-proceso" className="display text-[2.4rem] sm:text-[2.9rem]">
          Cómo trabajamos
        </h2>
        <ol className="mt-10 grid gap-8 sm:grid-cols-2 lg:grid-cols-4">
          {pasos.map((p, i) => (
            <li key={p.titulo} className="border-t border-hilo/25 pt-5">
              <span className="display text-[2rem] text-rosa">{i + 1}</span>
              <h3 className="mt-2 text-[1.125rem] font-semibold">{p.titulo}</h3>
              <p className="mt-2 text-hilo-2">{p.texto}</p>
            </li>
          ))}
        </ol>
      </section>

      {/* Andrea y el diseño */}
      <section
        className="contenedor mt-24 grid items-center gap-10 md:grid-cols-2"
        aria-labelledby="titulo-andrea"
      >
        <FotoPendiente
          textura="lino"
          descripcion="Andrea en el local, entre los muestrarios"
          className="aspect-[4/5] md:order-2"
        />
        <div>
          <h2 id="titulo-andrea" className="display text-[2.4rem] sm:text-[2.9rem]">
            Diseño de interiores con oficio de taller
          </h2>
          <div className="prose-esusy mt-6 text-hilo-2">
            <p>
              {negocio.duena.nombre} creció entre telas. Hoy lleva adelante Casa Esusy, la tercera
              generación de una familia que decora casas desde {negocio.fundacion}.
            </p>
            <p>
              Tiene el {negocio.duena.credencial.toLowerCase()} de {negocio.duena.institucion}. Eso
              le permite acompañarte en un proyecto completo: elegir la paleta, coordinar cortinas,
              sillón, alfombra y empapelado, y que todo se haga en un mismo lugar.
            </p>
          </div>
          <div className="mt-8 flex flex-wrap gap-3">
            <BotonLink href="/diseno-de-interiores" variante="secundario">
              Ver el servicio de diseño
            </BotonLink>
            <BotonLink href="/nosotros" variante="texto">
              Nuestra historia
            </BotonLink>
          </div>
        </div>
      </section>

      <Resenas />

      {/* Visitanos */}
      <section
        className="contenedor mt-24 grid gap-10 md:grid-cols-[1fr_1.2fr]"
        aria-labelledby="titulo-visitanos"
      >
        <div>
          <h2 id="titulo-visitanos" className="display text-[2.4rem] sm:text-[2.9rem]">
            Visitá el local
          </h2>
          <p className="mt-4 text-hilo-2">
            Vení a ver telas, catálogos de empapelados y alfombras en persona.
          </p>
          <div className="mt-6 space-y-4">
            <p className="flex items-start gap-3">
              <MapPin className="mt-0.5 size-5 shrink-0 text-rosa" aria-hidden="true" />
              <span>{direccionCompleta}</span>
            </p>
            <div>
              <EstadoHorario />
              <ul className="mt-3 space-y-1 text-hilo-2">
                {negocio.horarios.map((h) => (
                  <li key={h.dias}>
                    {h.dias}, de {hora(h.desde)} a {hora(h.hasta)} h
                  </li>
                ))}
              </ul>
            </div>
            <p className="flex items-center gap-3 text-[0.9375rem] text-hilo-2">
              <Accessibility className="size-5 text-rosa" aria-hidden="true" /> Entrada accesible
              para silla de ruedas
            </p>
          </div>
          <div className="mt-8 flex flex-wrap gap-3">
            <BotonLink href={negocio.googleMaps} externo>
              Cómo llegar
            </BotonLink>
            <BotonLink href="/contacto" variante="secundario">
              Contacto
            </BotonLink>
          </div>
        </div>
        <FotoPendiente
          textura="madera"
          descripcion="frente del local en Manuel Acevedo 1290"
          className="aspect-[4/3]"
        />
      </section>

      {/* Instagram */}
      <section className="contenedor mt-24">
        <div className="flex flex-col gap-4 border-y border-separator py-10 sm:flex-row sm:items-center sm:justify-between">
          <p className="display text-[2rem] leading-tight">
            Trabajos nuevos todas las semanas en {negocio.instagramUsuario}
          </p>
          <BotonLink href={negocio.instagram} externo variante="secundario">
            Seguinos en Instagram
          </BotonLink>
        </div>
      </section>

      <CierreContacto />
    </>
  );
}
