import { Footer } from "@/components/sitio/Footer";
import { Navbar } from "@/components/sitio/Navbar";
import { WhatsAppFlotante } from "@/components/sitio/WhatsAppFlotante";
import { JsonLd } from "@/components/seo/JsonLd";
import { getAjuste } from "@/lib/ajustes";
import { getServicios } from "@/lib/datos/publico";
import { schemaNegocio, schemaPersona, schemaSitio } from "@/lib/seo";
import { urlWhatsApp } from "@/lib/whatsapp";

/** Las páginas públicas se regeneran solas cada 10 minutos y al instante cuando se edita algo en el panel. */
export const revalidate = 600;

export default async function SitioLayout({ children }: { children: React.ReactNode }) {
  const [negocio, whatsapp, servicios] = await Promise.all([getAjuste("negocio"), getAjuste("whatsapp"), getServicios()]);
  const mensajesPorRuta = Object.fromEntries(
    servicios.filter((s) => s.mensajeWhatsApp).map((s) => [`/${s.slug}`, s.mensajeWhatsApp]),
  );

  return (
    <>
      <a href="#contenido" className="saltar-contenido">
        Saltar al contenido
      </a>
      <Navbar
        servicios={servicios.map(({ slug, nombre, bajada, imagen }) => ({ slug, nombre, bajada, imagen }))}
        telefono={negocio.telefonoVisible}
        telefonoHref={`tel:+${negocio.whatsapp}`}
        whatsappHref={urlWhatsApp(negocio.whatsapp, whatsapp.mensaje)}
        instagram={negocio.instagram}
      />
      <main id="contenido">{children}</main>
      <Footer negocio={negocio} servicios={servicios} />
      {whatsapp.activo && (
        <WhatsAppFlotante
          numero={negocio.whatsapp}
          mensaje={whatsapp.mensaje}
          etiqueta={whatsapp.etiqueta}
          mensajesPorRuta={mensajesPorRuta}
          horarios={negocio.horarios}
        />
      )}
      <JsonLd data={[schemaNegocio(negocio), schemaSitio(negocio), schemaPersona(negocio)]} />
    </>
  );
}
