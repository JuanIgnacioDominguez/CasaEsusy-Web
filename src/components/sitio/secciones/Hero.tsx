import { AwardIcon, MapPinnedIcon, RulerIcon, WrenchIcon } from "lucide-react";
import { AparecerItem, Escalonado } from "@/components/motion/Aparecer";
import type { AjustesInicio, Negocio } from "@/lib/ajustes/esquemas";
import type { Servicio } from "@/lib/db/schema";
import { urlWhatsApp } from "@/lib/whatsapp";
import { HeroCinematico, type DiapositivaHero } from "./HeroCinematico";

/** Palabra corta que se muestra en grande para cada servicio ("Cortinas a medida…"). */
const PALABRAS: Record<string, string> = {
  cortinas: "Cortinas",
  tapiceria: "Sillones",
  dormitorio: "Acolchados",
  alfombras: "Alfombras",
  empapelados: "Empapelados",
  pisos: "Pisos",
  "diseno-de-interiores": "Ambientes",
};

export function Hero({
  inicio,
  negocio,
  mensaje,
  servicios,
}: {
  inicio: AjustesInicio;
  negocio: Negocio;
  mensaje: string;
  servicios: Servicio[];
}) {
  // La primera foto es la de la portada (se cambia en el panel); el resto, la de cada servicio.
  const diapositivas: DiapositivaHero[] = servicios.map((s, i) => ({
    palabra: PALABRAS[s.slug] ?? s.nombre,
    etiqueta: s.nombre,
    imagen: i === 0 && inicio.imagen ? inicio.imagen : s.imagen,
    href: `/${s.slug}`,
  }));

  const confianza = [
    { Icono: RulerIcon, titulo: "Medición sin cargo", texto: "Vamos con muestras a tu casa" },
    { Icono: WrenchIcon, titulo: "Colocación propia", texto: "Terminaciones prolijas" },
    { Icono: MapPinnedIcon, titulo: "Sin límite de distancia", texto: "Capital, zona sur y más" },
    { Icono: AwardIcon, titulo: "Diseñadora certificada", texto: `${negocio.duenaInstitucion.split(",")[0]} · ${negocio.duenaAnio}` },
  ];

  return (
    <section className="px-2.5 pt-[4.75rem] sm:px-4">
      <HeroCinematico
        rotulo={inicio.rotulo}
        frase={inicio.titulo}
        bajada={inicio.bajada}
        diapositivas={diapositivas}
        whatsappHref={urlWhatsApp(negocio.whatsapp, mensaje)}
        puntaje={negocio.googlePuntaje}
        opiniones={negocio.googleOpiniones}
        resenasHref={negocio.googleResenas}
        anios={new Date().getFullYear() - negocio.fundacion}
      />
      <Escalonado className="contenedor grid grid-cols-2 gap-x-4 gap-y-6 py-10 lg:grid-cols-4 lg:py-12">
        {confianza.map(({ Icono, titulo, texto }) => (
          <AparecerItem key={titulo} className="flex items-center gap-3">
            <span className="grid size-11 shrink-0 place-items-center rounded-xl bg-terracota-suave text-terracota">
              <Icono className="size-5" strokeWidth={1.8} />
            </span>
            <span className="flex min-w-0 flex-col">
              <span className="text-[0.95rem] leading-tight font-semibold">{titulo}</span>
              <span className="truncate text-sm text-muted-foreground">{texto}</span>
            </span>
          </AparecerItem>
        ))}
      </Escalonado>
    </section>
  );
}
