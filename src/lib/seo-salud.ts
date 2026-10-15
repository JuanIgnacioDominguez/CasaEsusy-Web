import type { AjustesSeo, Negocio } from "@/lib/ajustes/esquemas";
import type { Servicio, SeoPagina } from "@/lib/db/schema";
import type { PaginaBase } from "@/lib/paginas";

export type Nivel = "ok" | "aviso" | "error";

export interface Chequeo {
  nivel: Nivel;
  texto: string;
}

export interface AnalisisPagina {
  ruta: string;
  nombre: string;
  tipo: PaginaBase["tipo"];
  titulo: string;
  descripcion: string;
  imagen: string;
  noindex: boolean;
  personalizado: boolean;
  puntaje: number;
  chequeos: Chequeo[];
}

const PESO: Record<Nivel, number> = { ok: 1, aviso: 0.5, error: 0 };

/** Largo ideal: títulos 30–60 caracteres; descripciones 110–160. */
export function analizarTitulo(t: string, plantillaExtra = 0): Chequeo {
  const largo = t.length + plantillaExtra;
  if (!t) return { nivel: "error", texto: "Falta el título" };
  if (largo > 65) return { nivel: "aviso", texto: `Título largo (${largo} caracteres): Google lo va a cortar` };
  if (largo < 25) return { nivel: "aviso", texto: `Título corto (${largo} caracteres)` };
  return { nivel: "ok", texto: `Título de ${largo} caracteres` };
}

export function analizarDescripcion(d: string): Chequeo {
  if (!d) return { nivel: "error", texto: "Falta la meta descripción" };
  if (d.length > 165) return { nivel: "aviso", texto: `Descripción larga (${d.length} caracteres)` };
  if (d.length < 100) return { nivel: "aviso", texto: `Descripción corta (${d.length} caracteres)` };
  return { nivel: "ok", texto: `Descripción de ${d.length} caracteres` };
}

export function analizarPaginas(
  paginas: PaginaBase[],
  overrides: SeoPagina[],
  seo: AjustesSeo,
  servicios: Servicio[],
): AnalisisPagina[] {
  const extraPlantilla = seo.plantilla.replace("%s", "").length;
  return paginas.map((p) => {
    const o = overrides.find((x) => x.ruta === p.ruta);
    const titulo = o?.titulo || p.titulo;
    const descripcion = o?.descripcion || p.descripcion;
    const imagen = o?.imagen || p.imagen || seo.imagen || "";
    const noindex = !!o?.noindex;
    const chequeos: Chequeo[] = [
      analizarTitulo(titulo, p.tipo === "inicio" ? 0 : extraPlantilla),
      analizarDescripcion(descripcion),
      imagen
        ? { nivel: "ok", texto: "Tiene imagen para compartir" }
        : { nivel: "ok", texto: "Usa la imagen automática con el logo al compartir" },
      noindex ? { nivel: "aviso", texto: "Oculta para Google (noindex)" } : { nivel: "ok", texto: "Indexable" },
    ];
    if (p.tipo === "servicio") {
      const s = servicios.find((x) => `/${x.slug}` === p.ruta);
      if (s) {
        chequeos.push(
          s.descripcion.length >= 280
            ? { nivel: "ok", texto: "Texto suficiente para posicionar" }
            : { nivel: "aviso", texto: `Poco texto (${s.descripcion.length} caracteres): sumá detalle` },
          s.tipos.length >= 3
            ? { nivel: "ok", texto: `${s.tipos.length} opciones descriptas` }
            : { nivel: "aviso", texto: "Describí al menos 3 opciones" },
          s.preguntas.length > 0
            ? { nivel: "ok", texto: `${s.preguntas.length} preguntas frecuentes (FAQ)` }
            : { nivel: "aviso", texto: "Sin preguntas frecuentes: ayudan a Google y a la IA" },
          titulo.toLowerCase().includes("banfield") || descripcion.toLowerCase().includes("banfield") || descripcion.toLowerCase().includes("zona sur")
            ? { nivel: "ok", texto: "Menciona la zona (SEO local)" }
            : { nivel: "aviso", texto: "No menciona Banfield ni zona sur" },
        );
      }
    }
    const puntaje = Math.round((chequeos.reduce((a, c) => a + PESO[c.nivel], 0) / chequeos.length) * 100);
    return { ruta: p.ruta, nombre: p.nombre, tipo: p.tipo, titulo, descripcion, imagen, noindex, personalizado: !!o, puntaje, chequeos };
  });
}

export function chequeosGenerales(seo: AjustesSeo, n: Negocio, sitio: string): Chequeo[] {
  return [
    sitio.includes("localhost")
      ? { nivel: "error", texto: "Configurá NEXT_PUBLIC_SITE_URL con el dominio real" }
      : { nivel: "ok", texto: `Dominio: ${sitio}` },
    seo.indexar ? { nivel: "ok", texto: "El sitio está visible para buscadores" } : { nivel: "error", texto: "El sitio entero está oculto para buscadores" },
    seo.googleVerificacion ? { nivel: "ok", texto: "Google Search Console verificado" } : { nivel: "aviso", texto: "Falta verificar Google Search Console" },
    seo.bingVerificacion ? { nivel: "ok", texto: "Bing Webmaster verificado" } : { nivel: "aviso", texto: "Falta verificar Bing Webmaster Tools" },
    seo.imagen ? { nivel: "ok", texto: "Imagen general para compartir cargada" } : { nivel: "ok", texto: "Imagen para compartir generada automáticamente" },
    n.email ? { nivel: "ok", texto: "Email de contacto cargado" } : { nivel: "aviso", texto: "Falta el email de contacto (NAP)" },
    n.horarios.length ? { nivel: "ok", texto: "Horarios en los datos estructurados" } : { nivel: "error", texto: "Faltan horarios" },
    { nivel: "ok", texto: "sitemap.xml, robots.txt y llms.txt automáticos" },
    { nivel: "ok", texto: "Datos estructurados: LocalBusiness, Service, FAQ, Breadcrumb y Person" },
  ];
}

export const puntajeTotal = (items: { puntaje: number }[]): number =>
  items.length ? Math.round(items.reduce((a, i) => a + i.puntaje, 0) / items.length) : 0;
