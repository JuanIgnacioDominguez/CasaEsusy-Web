import type { Metadata, Viewport } from "next";
import localFont from "next/font/local";
import "./globals.css";
import { Navbar } from "@/components/layout/Navbar";
import { Footer } from "@/components/layout/Footer";
import { WhatsAppFlotante } from "@/components/layout/WhatsAppFlotante";
import { MotionProvider } from "@/components/motion/MotionProvider";
import { JsonLd } from "@/components/seo/JsonLd";
import { SITE_URL, negocio } from "@/content/negocio";
import { schemaDuena, schemaNegocio } from "@/lib/seo";

/* Fuentes alojadas en el proyecto (más rápido, sin depender de Google Fonts). Licencia OFL. */
const cormorant = localFont({
  src: [
    { path: "../fonts/cormorant-garamond-latin-500-normal.woff2", weight: "500", style: "normal" },
    { path: "../fonts/cormorant-garamond-latin-500-italic.woff2", weight: "500", style: "italic" },
    { path: "../fonts/cormorant-garamond-latin-600-normal.woff2", weight: "600", style: "normal" },
  ],
  variable: "--font-cormorant",
  display: "swap",
});

const inter = localFont({
  src: "../fonts/inter-latin-wght-normal.woff2",
  weight: "100 900",
  variable: "--font-inter",
  display: "swap",
});

export const metadata: Metadata = {
  metadataBase: new URL(SITE_URL),
  title: {
    default: `${negocio.nombre} · Cortinas a medida, sillones y decoración en Banfield`,
    template: `%s | ${negocio.nombre}`,
  },
  description: negocio.descripcion,
  applicationName: negocio.nombre,
  formatDetection: { telephone: false },
  openGraph: { locale: "es_AR", siteName: negocio.nombre, type: "website" },
};

export const viewport: Viewport = {
  themeColor: "#f6f2ec",
  width: "device-width",
  initialScale: 1,
  viewportFit: "cover",
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="es-AR" className={`${cormorant.variable} ${inter.variable}`}>
      <body>
        <a href="#contenido" className="skip-link">
          Saltar al contenido
        </a>
        <MotionProvider>
          <Navbar />
          <main id="contenido">{children}</main>
          <Footer />
          <WhatsAppFlotante />
        </MotionProvider>
        <JsonLd data={[schemaNegocio(), schemaDuena()]} />
      </body>
    </html>
  );
}
