import type { AjustesInicio, Negocio } from "@/lib/ajustes/esquemas";
import { urlWhatsApp } from "@/lib/whatsapp";
import { HeroCinematico } from "./HeroCinematico";

/** Fotos de la portada: horizontales, claras y del mismo estilo (ambientes con cortinas y textiles). */
const FOTOS_HERO = [
  "/img/ambientes/living-claro.jpg",
  "/img/ambientes/cortinas-gasas-luz.jpg",
  "/img/ambientes/living-sillon-gasas.jpg",
  "/img/ambientes/almohadones-sillon.jpg",
];

export function Hero({
  inicio,
  negocio,
  mensaje,
}: {
  inicio: AjustesInicio;
  negocio: Negocio;
  mensaje: string;
}) {
  // La primera es la que se elige en el panel; después rotan las de la portada.
  const imagenes = [...new Set([inicio.imagen, ...FOTOS_HERO].filter(Boolean))];

  return (
    <section>
      <HeroCinematico
        rotulo={inicio.rotulo}
        titulo={inicio.titulo}
        bajada={inicio.bajada}
        imagenes={imagenes}
        whatsappHref={urlWhatsApp(negocio.whatsapp, mensaje)}
        puntaje={negocio.googlePuntaje}
        opiniones={negocio.googleOpiniones}
        resenasHref={negocio.googleResenas}
        anios={new Date().getFullYear() - negocio.fundacion}
      />
    </section>
  );
}
