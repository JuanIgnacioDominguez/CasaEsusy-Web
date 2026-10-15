"use client";

import { useEffect, useState } from "react";
import { usePathname, useRouter } from "next/navigation";
import { SearchIcon } from "lucide-react";
import { InputGroup, InputGroupAddon, InputGroupInput } from "@/components/ui/input-group";
import { Tabs, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { ESTADOS_PRESUPUESTO } from "@/lib/db/schema";
import { ESTADO_PRESUPUESTO } from "@/lib/estados";

export function FiltrosPresupuestos({ estado, busqueda, conteos }: { estado: string; busqueda: string; conteos: Record<string, number> }) {
  const router = useRouter();
  const pathname = usePathname();
  const [q, setQ] = useState(busqueda);
  const ir = (e: string, texto: string) => {
    const p = new URLSearchParams();
    if (e !== "todos") p.set("estado", e);
    if (texto) p.set("q", texto);
    router.replace(`${pathname}${p.size ? `?${p}` : ""}`, { scroll: false });
  };
  useEffect(() => {
    const t = setTimeout(() => q !== busqueda && ir(estado, q), 350);
    return () => clearTimeout(t);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [q]);

  return (
    <div className="flex flex-col gap-3 lg:flex-row lg:items-center lg:justify-between">
      <Tabs value={estado} onValueChange={(v) => ir(v, q)} className="no-scrollbar max-w-full overflow-x-auto">
        <TabsList>
          <TabsTrigger value="todos">Todos</TabsTrigger>
          {ESTADOS_PRESUPUESTO.filter((e) => e !== "vencido").map((e) => (
            <TabsTrigger key={e} value={e}>
              {ESTADO_PRESUPUESTO[e].etiqueta} · {conteos[e] ?? 0}
            </TabsTrigger>
          ))}
        </TabsList>
      </Tabs>
      <InputGroup className="sm:w-72">
        <InputGroupAddon>
          <SearchIcon />
        </InputGroupAddon>
        <InputGroupInput value={q} onChange={(e) => setQ(e.target.value)} placeholder="Buscar número, cliente…" />
      </InputGroup>
    </div>
  );
}
