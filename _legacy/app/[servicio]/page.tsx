import { notFound } from "next/navigation";
import { LandingServicio } from "@/components/secciones/LandingServicio";
import { getServicio, servicios } from "@/content/servicios";
import { metadatos } from "@/lib/seo";

export const dynamicParams = false;

export function generateStaticParams() {
  return servicios.map((s) => ({ servicio: s.slug }));
}

export async function generateMetadata({ params }: { params: Promise<{ servicio: string }> }) {
  const s = getServicio((await params).servicio);
  if (!s) return {};
  return metadatos({ titulo: s.titulo, descripcion: s.metaDescripcion, ruta: `/${s.slug}` });
}

export default async function PaginaServicio({
  params,
}: {
  params: Promise<{ servicio: string }>;
}) {
  const s = getServicio((await params).servicio);
  if (!s) notFound();
  return <LandingServicio s={s} />;
}
