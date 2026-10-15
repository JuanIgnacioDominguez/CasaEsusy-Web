import Link from "next/link";
import { JsonLd } from "@/components/seo/JsonLd";
import { schemaMigas } from "@/lib/seo";

export function Migas({ items }: { items: { nombre: string; ruta: string }[] }) {
  const todos = [{ nombre: "Inicio", ruta: "/" }, ...items];
  return (
    <>
      <nav aria-label="Ruta de navegación" className="text-[0.8125rem] text-grafito">
        <ol className="flex flex-wrap items-center gap-x-1.5">
          {todos.map((it, i) => {
            const ultimo = i === todos.length - 1;
            return (
              <li key={it.ruta} className="flex items-center gap-1.5">
                {ultimo ? (
                  <span aria-current="page" className="text-hilo-2">
                    {it.nombre}
                  </span>
                ) : (
                  <>
                    <Link href={it.ruta} className="hover:text-hilo">
                      {it.nombre}
                    </Link>
                    <span aria-hidden="true">/</span>
                  </>
                )}
              </li>
            );
          })}
        </ol>
      </nav>
      <JsonLd data={schemaMigas(todos)} />
    </>
  );
}
