import "server-only";
import type { Metadata } from "next";
import { getAjuste } from "@/lib/ajustes";
import type { Negocio } from "@/lib/ajustes/esquemas";
import { getSeoPagina } from "@/lib/datos/publico";
import { paginaFija } from "@/lib/paginas";
import type { PreguntaRespuesta, Servicio } from "@/lib/db/schema";
import { SITE_URL } from "@/lib/whatsapp";

interface Base {
  titulo: string;
  descripcion: string;
  imagen?: string;
}

/** Metadata de una página pública: valores por defecto + lo que se cargue en el panel de SEO. */
export async function metadataPara(ruta: string, base: Base): Promise<Metadata> {
  const [override, seo] = await Promise.all([getSeoPagina(ruta), getAjuste("seo")]);
  const titulo = override?.titulo || base.titulo;
  const descripcion = override?.descripcion || base.descripcion;
  const imagen = override?.imagen || base.imagen || seo.imagen || undefined;
  const noindex = override?.noindex || !seo.indexar;
  return {
    title: ruta === "/" ? { absolute: titulo } : titulo,
    description: descripcion,
    alternates: { canonical: ruta },
    openGraph: {
      title: titulo,
      description: descripcion,
      url: ruta,
      ...(imagen ? { images: [{ url: imagen, width: 1200, height: 630 }] } : {}),
    },
    robots: noindex ? { index: false, follow: true } : undefined,
  };
}

/** Metadata de una página fija (Trabajos, Nosotros, Contacto…) con sus textos por defecto. */
export async function metadataFija(ruta: string): Promise<Metadata> {
  const negocio = await getAjuste("negocio");
  const p = paginaFija(negocio, ruta);
  return metadataPara(ruta, { titulo: p.titulo, descripcion: p.descripcion });
}

const direccionPostal = (n: Negocio) => ({
  "@type": "PostalAddress",
  streetAddress: n.calle,
  addressLocality: n.localidad,
  addressRegion: n.provincia,
  postalCode: n.codigoPostal,
  addressCountry: "AR",
});

const DIAS = ["Sunday", "Monday", "Tuesday", "Wednesday", "Thursday", "Friday", "Saturday"];

export function schemaNegocio(n: Negocio) {
  return {
    "@context": "https://schema.org",
    "@type": "HomeAndConstructionBusiness",
    "@id": `${SITE_URL}/#negocio`,
    name: n.nombre,
    description: n.descripcion,
    slogan: n.lema,
    url: SITE_URL,
    logo: `${SITE_URL}/marca/logo.svg`,
    image: `${SITE_URL}/opengraph-image`,
    telephone: `+${n.whatsapp}`,
    ...(n.email ? { email: n.email } : {}),
    foundingDate: String(n.fundacion),
    address: direccionPostal(n),
    geo: { "@type": "GeoCoordinates", latitude: n.lat, longitude: n.lng },
    hasMap: n.googleMaps,
    areaServed: n.zonas.map((z) => ({ "@type": "City", name: z })),
    openingHoursSpecification: n.horarios.map((h) => ({
      "@type": "OpeningHoursSpecification",
      dayOfWeek: h.diasSemana.map((d) => DIAS[d]),
      opens: h.desde,
      closes: h.hasta,
    })),
    founder: { "@id": `${SITE_URL}/#duena` },
    sameAs: [n.instagram, n.facebook, n.googleMaps].filter(Boolean),
    priceRange: "$$",
  };
}

export function schemaPersona(n: Negocio) {
  return {
    "@context": "https://schema.org",
    "@type": "Person",
    "@id": `${SITE_URL}/#duena`,
    name: n.duenaNombre,
    jobTitle: "Diseñadora de interiores",
    worksFor: { "@id": `${SITE_URL}/#negocio` },
    hasCredential: {
      "@type": "EducationalOccupationalCredential",
      name: n.duenaCredencial,
      credentialCategory: "certificate",
      recognizedBy: { "@type": "Organization", name: n.duenaInstitucion },
      dateCreated: String(n.duenaAnio),
    },
  };
}

export function schemaSitio(n: Negocio) {
  return {
    "@context": "https://schema.org",
    "@type": "WebSite",
    "@id": `${SITE_URL}/#sitio`,
    name: n.nombre,
    url: SITE_URL,
    inLanguage: "es-AR",
    publisher: { "@id": `${SITE_URL}/#negocio` },
  };
}

export function schemaServicio(s: Servicio, n: Negocio) {
  return {
    "@context": "https://schema.org",
    "@type": "Service",
    name: s.titulo,
    serviceType: s.nombre,
    description: s.bajada,
    url: `${SITE_URL}/${s.slug}`,
    image: `${SITE_URL}${s.imagen}`,
    provider: { "@id": `${SITE_URL}/#negocio` },
    areaServed: n.zonas.map((z) => ({ "@type": "City", name: z })),
    hasOfferCatalog: {
      "@type": "OfferCatalog",
      name: s.nombre,
      itemListElement: s.tipos.map((t) => ({
        "@type": "Offer",
        itemOffered: { "@type": "Service", name: t.nombre, description: t.descripcion },
      })),
    },
  };
}

export function schemaPreguntas(items: PreguntaRespuesta[]) {
  return {
    "@context": "https://schema.org",
    "@type": "FAQPage",
    mainEntity: items.map((p) => ({
      "@type": "Question",
      name: p.pregunta,
      acceptedAnswer: { "@type": "Answer", text: p.respuesta },
    })),
  };
}

export function schemaMigas(items: { nombre: string; ruta: string }[]) {
  return {
    "@context": "https://schema.org",
    "@type": "BreadcrumbList",
    itemListElement: items.map((it, i) => ({
      "@type": "ListItem",
      position: i + 1,
      name: it.nombre,
      item: `${SITE_URL}${it.ruta}`,
    })),
  };
}
