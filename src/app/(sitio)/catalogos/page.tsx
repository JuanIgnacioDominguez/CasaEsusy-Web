import { Suspense } from "react";
import type { Metadata } from "next";
import Image from "next/image";
import Link from "next/link";
import { ArrowUpRightIcon, BookOpenIcon } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Aparecer, AparecerItem, Escalonado } from "@/components/motion/Aparecer";
import { IconoWhatsApp } from "@/components/iconos";
import { Migas, SchemaMigas } from "@/components/sitio/Migas";
import { Encabezado } from "@/components/sitio/secciones/Encabezado";
import { LlamadoFinal } from "@/components/sitio/secciones/LlamadoFinal";
import { VisorCatalogos } from "@/components/sitio/VisorCatalogos";
import { getAjuste } from "@/lib/ajustes";
import { getCatalogos, getMarcas } from "@/lib/datos/publico";
import { metadataFija } from "@/lib/seo";
import { urlWhatsApp } from "@/lib/whatsapp";

export function generateMetadata(): Promise<Metadata> {
  return metadataFija("/catalogos");
}

export default async function Catalogos() {
  const [negocio, catalogos, marcas] = await Promise.all([getAjuste("negocio"), getCatalogos(), getMarcas()]);
  const nombreMarca = (id: string | null) => marcas.find((m) => m.id === id)?.nombre ?? null;
  const pedido = urlWhatsApp(negocio.whatsapp, "Hola Casa Esusy, quiero ver un catálogo de telas / cortinas. ¿Me lo pueden mandar?");

  return (
    <>
      <section className="pt-28 pb-16 sm:pt-32 lg:pt-36 lg:pb-24">
        <div className="contenedor flex flex-col gap-10">
          <SchemaMigas items={[{ nombre: "Catálogos", ruta: "/catalogos" }]} />
          <Aparecer inmediato className="flex flex-col gap-5">
            <Migas items={[{ nombre: "Catálogos", ruta: "/catalogos" }]} />
            <h1 className="max-w-3xl text-[2.4rem] leading-[1.04] font-semibold tracking-[-0.03em] sm:text-5xl lg:text-6xl">Catálogos y marcas</h1>
            <p className="max-w-2xl text-lg leading-relaxed text-muted-foreground">
              Mirá desde tu casa las telas, sistemas de cortinas, rieles y empapelados de las marcas con las que trabajamos. Si algo te gusta, consultanos por WhatsApp o
              vení a verlo y tocarlo al local.
            </p>
          </Aparecer>

          {catalogos.length > 0 ? (
            <Suspense>
              <VisorCatalogos
                whatsapp={negocio.whatsapp}
                catalogos={catalogos.map((c) => ({
                  id: c.id,
                  titulo: c.titulo,
                  descripcion: c.descripcion,
                  categoria: c.categoria,
                  tipo: c.tipo,
                  archivo: c.archivo,
                  enlace: c.enlace,
                  portada: c.portada,
                  imagenes: c.imagenes,
                  marca: nombreMarca(c.marcaId),
                }))}
              />
            </Suspense>
          ) : (
            <Aparecer className="flex flex-col items-center gap-5 rounded-[2rem] border border-dashed bg-card px-6 py-16 text-center">
              <span className="grid size-14 place-items-center rounded-2xl bg-terracota-suave text-terracota">
                <BookOpenIcon className="size-7" />
              </span>
              <div className="flex max-w-md flex-col gap-2">
                <h2 className="text-2xl font-semibold">Estamos subiendo los catálogos</h2>
                <p className="text-muted-foreground">Mientras tanto, pedinos el que necesites y te lo mandamos por WhatsApp en el momento.</p>
              </div>
              <Button asChild size="lg" className="h-12 rounded-lg bg-whatsapp px-6 text-white hover:bg-[#1FB855]">
                <a href={pedido} target="_blank" rel="noopener">
                  <IconoWhatsApp data-icon="inline-start" /> Pedir un catálogo
                </a>
              </Button>
            </Aparecer>
          )}
        </div>
      </section>

      {marcas.length > 0 && (
        <section className="bg-card py-20 lg:py-24">
          <div className="contenedor flex flex-col gap-10">
            <Encabezado rotulo="Marcas" titulo="Con quiénes trabajamos" bajada="Las marcas de las que tenemos catálogos y muestrarios. Si buscás otra, preguntanos." />
            <Escalonado className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
              {marcas.map((m) => {
                const cantidad = catalogos.filter((c) => c.marcaId === m.id).length;
                return (
                  <AparecerItem key={m.id} className="flex flex-col gap-4 rounded-[1.5rem] border bg-background p-6">
                    <div className="flex h-12 items-center">
                      {m.logo ? (
                        <Image src={m.logo} alt={m.nombre} width={180} height={48} className="h-10 w-auto object-contain" />
                      ) : (
                        <span className="text-2xl font-bold tracking-[-0.03em]">{m.nombre}</span>
                      )}
                    </div>
                    <div className="flex flex-col gap-1">
                      {m.rubro && <span className="text-xs font-medium text-terracota">{m.rubro}</span>}
                      {m.descripcion && <p className="text-[0.95rem] leading-relaxed text-muted-foreground">{m.descripcion}</p>}
                    </div>
                    <div className="mt-auto flex flex-wrap gap-2 pt-2">
                      {cantidad > 0 && (
                        <Button asChild size="sm" variant="secondary" className="rounded-lg">
                          <Link href={`/catalogos?marca=${encodeURIComponent(m.nombre)}`} scroll={false}>
                            {cantidad} {cantidad === 1 ? "catálogo" : "catálogos"}
                          </Link>
                        </Button>
                      )}
                      {m.sitioWeb && (
                        <Button asChild size="sm" variant="ghost" className="rounded-lg">
                          <a href={m.sitioWeb} target="_blank" rel="noopener">
                            Sitio de la marca <ArrowUpRightIcon data-icon="inline-end" />
                          </a>
                        </Button>
                      )}
                    </div>
                  </AparecerItem>
                );
              })}
            </Escalonado>
          </div>
        </section>
      )}

      <LlamadoFinal
        whatsapp={negocio.whatsapp}
        mensaje="Hola Casa Esusy, quiero asesoramiento para elegir telas."
        titulo="¿Preferís verlos en persona?"
        bajada="En el local tenés muestrarios para ver y tocar. Y si querés, vamos a tu casa con muestras, sin cargo."
        imagen="/img/ambientes/muestrario-telas.jpg"
      />
    </>
  );
}
