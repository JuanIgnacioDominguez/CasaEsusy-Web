import type { Metadata } from "next";
import { SITE_URL, negocio } from "@/content/negocio";

/**
 * Metadatos por página (sección 13). En la Fase 1d, título/descripcion/OG
 * vienen de `seo_meta` y se editan desde el panel.
 */
export function metadatos({
  titulo,
  descripcion,
  ruta,
}: {
  titulo?: string;
  descripcion: string;
  ruta: string;
}): Metadata {
  const url = `${SITE_URL}${ruta === "/" ? "" : ruta}`;
  return {
    title: titulo,
    description: descripcion,
    alternates: { canonical: url },
    openGraph: {
      title: titulo ? `${titulo} | ${negocio.nombre}` : negocio.nombreCompleto,
      description: descripcion,
      url,
      siteName: negocio.nombre,
      locale: "es_AR",
      type: "website",
    },
  };
}

/* ───────────────────────── JSON-LD ───────────────────────── */

export function schemaNegocio() {
  return {
    "@context": "https://schema.org",
    "@type": "HomeAndConstructionBusiness",
    "@id": `${SITE_URL}/#negocio`,
    name: negocio.nombre,
    alternateName: "Casa Esusy decoraciones",
    description: negocio.descripcion,
    url: SITE_URL,
    telephone: negocio.telefono.e164,
    foundingDate: String(negocio.fundacion),
    address: {
      "@type": "PostalAddress",
      streetAddress: negocio.direccion.calle,
      addressLocality: negocio.direccion.localidad,
      addressRegion: negocio.direccion.provincia,
      postalCode: negocio.direccion.cp,
      addressCountry: negocio.direccion.pais,
    },
    geo: { "@type": "GeoCoordinates", latitude: negocio.geo.lat, longitude: negocio.geo.lng },
    hasMap: negocio.googleMaps,
    areaServed: negocio.zonas.map((z) => ({ "@type": "City", name: z })),
    openingHoursSpecification: [
      {
        "@type": "OpeningHoursSpecification",
        dayOfWeek: ["Monday", "Tuesday", "Wednesday", "Thursday", "Friday"],
        opens: "09:00",
        closes: "13:00",
      },
      {
        "@type": "OpeningHoursSpecification",
        dayOfWeek: "Saturday",
        opens: "10:00",
        closes: "14:00",
      },
    ],
    sameAs: [negocio.instagram, negocio.facebook, negocio.googleMaps],
    founder: { "@id": `${SITE_URL}/#andrea-esusy` },
    // Sin AggregateRating propio: las estrellas las muestra Google desde su ficha (sección 12).
  };
}

export function schemaDuena() {
  return {
    "@context": "https://schema.org",
    "@type": "Person",
    "@id": `${SITE_URL}/#andrea-esusy`,
    name: negocio.duena.nombre,
    jobTitle: "Diseñadora de interiores",
    worksFor: { "@id": `${SITE_URL}/#negocio` },
    hasCredential: {
      "@type": "EducationalOccupationalCredential",
      name: negocio.duena.credencial,
      credentialCategory: "certificate",
      recognizedBy: { "@type": "Organization", name: negocio.duena.institucion },
    },
  };
}

export function schemaServicio(nombre: string, descripcion: string, ruta: string) {
  return {
    "@context": "https://schema.org",
    "@type": "Service",
    name: nombre,
    description: descripcion,
    url: `${SITE_URL}${ruta}`,
    provider: { "@id": `${SITE_URL}/#negocio` },
    areaServed: negocio.zonas.map((z) => ({ "@type": "City", name: z })),
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

export function schemaFaq(preguntas: { pregunta: string; respuesta: string }[]) {
  return {
    "@context": "https://schema.org",
    "@type": "FAQPage",
    mainEntity: preguntas.map((p) => ({
      "@type": "Question",
      name: p.pregunta,
      acceptedAnswer: { "@type": "Answer", text: p.respuesta },
    })),
  };
}
