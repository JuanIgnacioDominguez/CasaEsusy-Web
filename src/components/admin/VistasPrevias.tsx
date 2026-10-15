import Image from "next/image";
import { cn } from "@/lib/utils";

/** Cómo se vería el resultado en Google. */
export function VistaGoogle({ titulo, descripcion, url, className }: { titulo: string; descripcion: string; url: string; className?: string }) {
  const host = url.replace(/^https?:\/\//, "").split("/")[0] ?? url;
  const ruta = url.replace(/^https?:\/\/[^/]+/, "").split("/").filter(Boolean);
  const cortado = (t: string, n: number) => (t.length > n ? `${t.slice(0, n - 1).trimEnd()}…` : t);
  return (
    <div className={cn("flex flex-col gap-1 rounded-xl border bg-white p-4 font-[arial,sans-serif] text-left dark:bg-[#202124]", className)}>
      <div className="flex items-center gap-2">
        <span className="grid size-7 place-items-center rounded-full bg-[#f1f3f4] dark:bg-[#303134]">
          <Image src="/marca/isotipo.svg" alt="" width={18} height={18} unoptimized />
        </span>
        <span className="flex flex-col leading-tight">
          <span className="text-[13px] text-[#202124] dark:text-[#dadce0]">Casa Esusy</span>
          <span className="text-[12px] text-[#4d5156] dark:text-[#bdc1c6]">
            {host}
            {ruta.length ? ` › ${ruta.join(" › ")}` : ""}
          </span>
        </span>
      </div>
      <p className="text-[19px] leading-snug text-[#1a0dab] dark:text-[#99c3ff]">{cortado(titulo || "Sin título", 62)}</p>
      <p className="text-[13.5px] leading-snug text-[#4d5156] dark:text-[#bdc1c6]">{cortado(descripcion || "Sin descripción", 158)}</p>
    </div>
  );
}

/** Cómo se vería el link al compartirlo por WhatsApp. */
export function VistaWhatsApp({ titulo, descripcion, imagen, host }: { titulo: string; descripcion: string; imagen: string; host: string }) {
  return (
    <div className="flex flex-col gap-1 rounded-xl bg-[#d9fdd3] p-1.5 dark:bg-[#005c4b]">
      <div className="overflow-hidden rounded-lg bg-[#f0f2f5] dark:bg-[#1d282f]">
        <div className="relative aspect-[1.91/1] bg-muted">
          {imagen ? <Image src={imagen} alt="" fill sizes="320px" className="object-cover" /> : <Image src="/opengraph-image" alt="" fill sizes="320px" unoptimized className="object-cover" />}
        </div>
        <div className="flex flex-col gap-0.5 p-2.5">
          <span className="line-clamp-2 text-[13px] font-semibold text-[#111b21] dark:text-[#e9edef]">{titulo}</span>
          <span className="line-clamp-2 text-[12px] text-[#667781] dark:text-[#8696a0]">{descripcion}</span>
          <span className="text-[11px] text-[#667781] dark:text-[#8696a0]">{host}</span>
        </div>
      </div>
    </div>
  );
}
