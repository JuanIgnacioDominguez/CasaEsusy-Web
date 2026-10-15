import Link from "next/link";
import { ChevronRightIcon } from "lucide-react";
import { JsonLd } from "@/components/seo/JsonLd";
import { schemaMigas } from "@/lib/seo";

type Miga = { nombre: string; ruta: string };

/** BreadcrumbList en JSON-LD. Va fuera de componentes animados (cliente) para no re-renderizar el <script>. */
export function SchemaMigas({ items }: { items: Miga[] }) {
  return <JsonLd data={schemaMigas([{ nombre: "Inicio", ruta: "/" }, ...items])} />;
}

/** Migas de pan visibles. */
export function Migas({ items }: { items: Miga[] }) {
  const todas = [{ nombre: "Inicio", ruta: "/" }, ...items];
  return (
    <>
      <nav aria-label="Migas de pan" className="text-sm text-muted-foreground">
        <ol className="flex flex-wrap items-center gap-1.5">
          {todas.map((it, i) => (
            <li key={it.ruta} className="flex items-center gap-1.5">
              {i > 0 && <ChevronRightIcon className="size-3.5 opacity-60" aria-hidden />}
              {i < todas.length - 1 ? (
                <Link href={it.ruta} className="hover:text-foreground">
                  {it.nombre}
                </Link>
              ) : (
                <span aria-current="page" className="text-foreground">
                  {it.nombre}
                </span>
              )}
            </li>
          ))}
        </ol>
      </nav>
    </>
  );
}
