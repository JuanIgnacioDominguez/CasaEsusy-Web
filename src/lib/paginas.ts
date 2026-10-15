import type { AjustesSeo, Negocio } from "@/lib/ajustes/esquemas";
import type { Servicio } from "@/lib/db/schema";

/** Título y descripción por defecto de cada página pública (el panel de SEO puede sobrescribirlos). */
export interface PaginaBase {
  ruta: string;
  nombre: string;
  titulo: string;
  descripcion: string;
  imagen?: string;
  tipo: "inicio" | "servicio" | "fija";
}

export function paginasFijas(n: Negocio): PaginaBase[] {
  return [
    {
      ruta: "/proyectos",
      nombre: "Trabajos",
      tipo: "fija",
      titulo: "Trabajos realizados",
      descripcion: "Cortinas, venecianas, empapelados, acolchados y más: trabajos reales de Casa Esusy en casas y comercios de zona sur.",
    },
    {
      ruta: "/catalogos",
      nombre: "Catálogos",
      tipo: "fija",
      titulo: "Catálogos de telas, cortinas y empapelados",
      descripcion: "Mirá online los catálogos de las marcas con las que trabajamos: telas, cortinas roller y venecianas, rieles, empapelados y alfombras. Consultanos por WhatsApp.",
    },
    {
      ruta: "/nosotros",
      nombre: "Nosotros",
      tipo: "fija",
      titulo: "Nuestra historia",
      descripcion: `${n.nombre}: casa de decoración familiar en ${n.localidad} desde ${n.fundacion}. Tres generaciones, colocación propia y asesoramiento de una diseñadora certificada.`,
    },
    {
      ruta: "/presupuesto",
      nombre: "Presupuesto",
      tipo: "fija",
      titulo: "Pedir presupuesto sin cargo",
      descripcion: "Contanos qué necesitás y coordinamos una visita para medir. El presupuesto de cortinas, tapizados, pisos y empapelados es sin cargo.",
    },
    {
      ruta: "/contacto",
      nombre: "Contacto",
      tipo: "fija",
      titulo: "Contacto por WhatsApp y cómo llegar",
      descripcion: `Escribinos por WhatsApp al ${n.telefonoVisible}. Local en ${n.calle}, ${n.localidad}. Trabajamos en Capital, zona sur y donde nos necesites.`,
    },
    {
      ruta: "/preguntas-frecuentes",
      nombre: "Preguntas frecuentes",
      tipo: "fija",
      titulo: "Preguntas frecuentes",
      descripcion: "Presupuesto, visitas, zonas, plazos, colocación y cuidado de telas: las preguntas que más nos hacen, respondidas.",
    },
  ];
}

export function todasLasPaginas(seo: AjustesSeo, n: Negocio, servicios: Servicio[]): PaginaBase[] {
  return [
    { ruta: "/", nombre: "Inicio", tipo: "inicio", titulo: seo.tituloSitio, descripcion: seo.descripcion },
    ...servicios.map<PaginaBase>((s) => ({
      ruta: `/${s.slug}`,
      nombre: s.nombre,
      tipo: "servicio",
      titulo: s.titulo,
      descripcion: s.bajada,
      imagen: s.imagen,
    })),
    ...paginasFijas(n),
  ];
}

export function paginaFija(n: Negocio, ruta: string): PaginaBase {
  const p = paginasFijas(n).find((x) => x.ruta === ruta);
  if (!p) throw new Error(`Página desconocida: ${ruta}`);
  return p;
}
