import type { Metadata, Viewport } from "next";
import localFont from "next/font/local";
import "./globals.css";
import { Proveedores } from "@/components/providers/Proveedores";
import { getAjuste } from "@/lib/ajustes";
import { SITE_URL } from "@/lib/whatsapp";

/* Inter variable alojada en el proyecto (licencia OFL). Pesos 400–700, nada finito. */
const inter = localFont({
  src: "../fonts/inter-latin-wght-normal.woff2",
  weight: "100 900",
  variable: "--font-inter",
  display: "swap",
});

export async function generateMetadata(): Promise<Metadata> {
  const [seo, negocio] = await Promise.all([getAjuste("seo"), getAjuste("negocio")]);
  return {
    metadataBase: new URL(SITE_URL),
    title: { default: seo.tituloSitio, template: seo.plantilla },
    description: seo.descripcion,
    applicationName: negocio.nombre,
    formatDetection: { telephone: false },
    openGraph: { locale: "es_AR", siteName: negocio.nombre, type: "website" },
    twitter: { card: "summary_large_image" },
    verification: {
      ...(seo.googleVerificacion ? { google: seo.googleVerificacion } : {}),
      ...(seo.bingVerificacion ? { other: { "msvalidate.01": seo.bingVerificacion } } : {}),
    },
  };
}

export const viewport: Viewport = {
  themeColor: "#fbfbfb",
  width: "device-width",
  initialScale: 1,
  viewportFit: "cover",
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="es-AR" className={inter.variable} suppressHydrationWarning>
      <body>
        <Proveedores>{children}</Proveedores>
      </body>
    </html>
  );
}
