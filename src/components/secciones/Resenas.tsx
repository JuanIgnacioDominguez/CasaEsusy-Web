import { Star } from "lucide-react";
import { negocio } from "@/content/negocio";
import { resenasGoogle } from "@/content/resenas";

export function Estrellas({ puntaje }: { puntaje: number }) {
  return (
    <span className="inline-flex gap-0.5" role="img" aria-label={`${puntaje} de 5 estrellas`}>
      {[1, 2, 3, 4, 5].map((n) => (
        <Star
          key={n}
          aria-hidden="true"
          className={`size-4 ${n <= Math.round(puntaje) ? "fill-[#c98a3a] text-[#c98a3a]" : "text-arena-2"}`}
        />
      ))}
    </span>
  );
}

export function Resenas() {
  return (
    <section className="contenedor mt-24" aria-labelledby="titulo-resenas">
      <div className="grid gap-10 md:grid-cols-[1fr_2fr]">
        <div>
          <h2 id="titulo-resenas" className="display text-[2.4rem] sm:text-[2.9rem]">
            Lo que dicen en Google
          </h2>
          <p className="mt-5 flex items-baseline gap-3">
            <span className="display text-[3.5rem] leading-none">
              {negocio.google.puntaje.toLocaleString("es-AR")}
            </span>
            <span className="text-hilo-2">
              <Estrellas puntaje={negocio.google.puntaje} />
              <span className="mt-1 block text-[0.9375rem]">
                {negocio.google.opiniones} opiniones
              </span>
            </span>
          </p>
          <div className="mt-6 flex flex-wrap gap-x-5 gap-y-2 text-[0.9375rem]">
            <a
              className="text-rosa hover:underline"
              href={negocio.googleMaps}
              target="_blank"
              rel="noopener"
            >
              Ver todas en Google
            </a>
            <a
              className="text-rosa hover:underline"
              href={negocio.googleMaps}
              target="_blank"
              rel="noopener"
            >
              Dejanos tu reseña
            </a>
          </div>
        </div>

        <ul className="grid gap-x-10 gap-y-8 sm:grid-cols-2">
          {resenasGoogle.map((r, i) => (
            <li key={r.autor} className={i === 0 ? "sm:col-span-2" : ""}>
              <blockquote>
                <p
                  className={`text-pretty ${i === 0 ? "display text-[1.75rem] leading-snug" : "text-[1.0625rem]"}`}
                >
                  “{r.texto}”
                </p>
                <footer className="mt-3 text-[0.8125rem] text-grafito">
                  {r.autor}, en Google, {r.hace.toLowerCase()}
                </footer>
              </blockquote>
            </li>
          ))}
        </ul>
      </div>
    </section>
  );
}
