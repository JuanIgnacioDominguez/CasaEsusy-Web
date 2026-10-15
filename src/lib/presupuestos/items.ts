import type { LineaDesglose, TipoItem } from "@/lib/db/schema";
import {
  calcularCortina,
  calcularEmpapelado,
  calcularM2,
  calcularPiso,
  CORTINA_DEFECTO,
  EMPAPELADO_DEFECTO,
  M2_DEFECTO,
  PISO_DEFECTO,
  type EntradaCortina,
  type EntradaEmpapelado,
  type EntradaM2,
  type EntradaPiso,
} from "./calculos";

export interface ItemEditable {
  clave: string;
  ambiente: string;
  descripcion: string;
  tipo: TipoItem;
  entradas: Record<string, number>;
  cantidad: number;
  precioUnitario: number;
}

export interface ItemCalculado extends ItemEditable {
  desglose: LineaDesglose[];
  resumen: string;
  total: number;
}

export const TIPOS_ITEM: { tipo: TipoItem; nombre: string; ayuda: string }[] = [
  { tipo: "cortina", nombre: "Cortina de tela", ayuda: "Tela, confección, riel y colocación según medidas" },
  { tipo: "m2", nombre: "Roller / veneciana", ayuda: "Por m² con mínimo facturable" },
  { tipo: "empapelado", nombre: "Empapelado", ayuda: "Rollos según paredes, alto y rapport" },
  { tipo: "piso", nombre: "Piso", ayuda: "Cajas con desperdicio, zócalo y colocación" },
  { tipo: "manual", nombre: "Ítem manual", ayuda: "Texto libre con cantidad y precio" },
];

export const ENTRADAS_DEFECTO: Record<Exclude<TipoItem, "manual">, Record<string, number>> = {
  cortina: { ...CORTINA_DEFECTO },
  m2: { ...M2_DEFECTO },
  empapelado: { ...EMPAPELADO_DEFECTO },
  piso: { ...PISO_DEFECTO },
};

const num = (v: unknown, def = 0) => (typeof v === "number" && Number.isFinite(v) ? v : Number(v) || def);

function completar<T extends object>(defecto: T, entradas: Record<string, unknown>): T {
  const r = { ...defecto } as Record<string, number>;
  for (const k of Object.keys(defecto)) r[k] = num(entradas[k], (defecto as Record<string, number>)[k]);
  return r as T;
}

/** Calcula un ítem del presupuesto. Se usa igual en el navegador (vista previa) y en el servidor (al guardar). */
export function calcularItem(item: ItemEditable): ItemCalculado {
  switch (item.tipo) {
    case "cortina": {
      const r = calcularCortina(completar<EntradaCortina>(CORTINA_DEFECTO, item.entradas));
      return { ...item, cantidad: 1, precioUnitario: r.total, desglose: r.lineas, resumen: r.resumen, total: r.total };
    }
    case "m2": {
      const r = calcularM2(completar<EntradaM2>(M2_DEFECTO, item.entradas));
      return { ...item, cantidad: 1, precioUnitario: r.total, desglose: r.lineas, resumen: r.resumen, total: r.total };
    }
    case "empapelado": {
      const r = calcularEmpapelado(completar<EntradaEmpapelado>(EMPAPELADO_DEFECTO, item.entradas));
      return { ...item, cantidad: 1, precioUnitario: r.total, desglose: r.lineas, resumen: r.resumen, total: r.total };
    }
    case "piso": {
      const r = calcularPiso(completar<EntradaPiso>(PISO_DEFECTO, item.entradas));
      return { ...item, cantidad: 1, precioUnitario: r.total, desglose: r.lineas, resumen: r.resumen, total: r.total };
    }
    default: {
      const cantidad = num(item.cantidad, 1);
      const precio = num(item.precioUnitario);
      const total = Math.round(cantidad * precio * 100) / 100;
      return { ...item, cantidad, precioUnitario: precio, desglose: [], resumen: "", total };
    }
  }
}
