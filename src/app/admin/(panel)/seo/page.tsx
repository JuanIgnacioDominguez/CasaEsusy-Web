import { EncabezadoPagina, Puntaje } from "@/components/admin/comunes";
import { VistaSeo } from "@/components/admin/VistaSeo";
import { getAjuste } from "@/lib/ajustes";
import { requerirUsuario } from "@/lib/auth/sesion";
import { listarMedios, listarRedirecciones, listarSeoPaginas, listarServiciosAdmin } from "@/lib/datos/admin";
import { IMAGENES_INCLUIDAS } from "@/lib/medios";
import { todasLasPaginas } from "@/lib/paginas";
import { analizarPaginas, chequeosGenerales, puntajeTotal } from "@/lib/seo-salud";
import { SITE_URL } from "@/lib/whatsapp";

export const metadata = { title: "SEO" };

export default async function Seo({ searchParams }: { searchParams: Promise<{ ruta?: string; tab?: string }> }) {
  await requerirUsuario(["contenido"]);
  const sp = await searchParams;
  const [seo, negocio, servicios, overrides, redirecciones, medios] = await Promise.all([
    getAjuste("seo"),
    getAjuste("negocio"),
    listarServiciosAdmin(),
    listarSeoPaginas(),
    listarRedirecciones(),
    listarMedios(),
  ]);
  const analisis = analizarPaginas(todasLasPaginas(seo, negocio, servicios), overrides, seo, servicios);
  const generales = chequeosGenerales(seo, negocio, SITE_URL);
  const total = puntajeTotal(analisis);

  return (
    <>
      <EncabezadoPagina
        titulo="SEO y visibilidad"
        descripcion="Cómo aparece Casa Esusy en Google, al compartir por WhatsApp y en asistentes de IA."
      >
        <div className="flex items-center gap-3 rounded-xl border bg-card px-4 py-2">
          <Puntaje valor={total} className="size-12" />
          <span className="flex flex-col text-sm">
            <span className="font-semibold">Puntaje general</span>
            <span className="text-muted-foreground">{analisis.length} páginas analizadas</span>
          </span>
        </div>
      </EncabezadoPagina>
      <VistaSeo
        analisis={analisis}
        generales={generales}
        seo={seo}
        redirecciones={redirecciones}
        sitio={SITE_URL}
        rutaInicial={sp.ruta}
        tabInicial={sp.tab}
        incluidas={IMAGENES_INCLUIDAS}
        subidas={medios.map((m) => ({ url: m.url, alt: m.alt }))}
        servicios={servicios.map((s) => ({ nombre: s.nombre, slug: s.slug }))}
      />
    </>
  );
}
