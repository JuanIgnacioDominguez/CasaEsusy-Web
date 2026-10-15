/**
 * Motor de cálculo de presupuestos. Funciones puras: reciben medidas y precios,
 * devuelven un desglose línea por línea. Medidas en metros.
 */

export interface Linea {
  concepto: string;
  cantidad: number;
  unidad: string;
  precio: number;
  subtotal: number;
}

export interface Resultado {
  lineas: Linea[];
  total: number;
  /** Resumen legible para mostrar debajo del ítem ("4,2 m de tela · 2 paños"). */
  resumen: string;
}

const redondear = (n: number, decimales = 2): number => {
  const f = 10 ** decimales;
  return Math.round((n + Number.EPSILON) * f) / f;
};

const linea = (concepto: string, cantidad: number, unidad: string, precio: number): Linea => ({
  concepto,
  cantidad: redondear(cantidad),
  unidad,
  precio: redondear(precio),
  subtotal: redondear(cantidad * precio),
});

const cerrar = (lineas: Linea[], resumen: string): Resultado => {
  const validas = lineas.filter((l) => l.cantidad > 0 && l.precio > 0);
  return {
    lineas: validas,
    total: redondear(validas.reduce((acc, l) => acc + l.subtotal, 0)),
    resumen,
  };
};

const fmt = (n: number) => n.toLocaleString("es-AR", { maximumFractionDigits: 2 });

/* ─────────── Cortina de tela ─────────── */

export interface EntradaCortina {
  ancho: number;
  alto: number;
  panos: number;
  /** Factor de fruncido: 2 = el doble del ancho de la ventana. */
  fruncido: number;
  /** Ancho útil del rollo de tela. */
  anchoRollo: number;
  precioTela: number;
  precioConfeccion: number;
  precioRiel: number;
  colocacion: number;
  cantidad: number;
}

export const CORTINA_DEFECTO: EntradaCortina = {
  ancho: 2,
  alto: 2.4,
  panos: 2,
  fruncido: 2,
  anchoRollo: 2.8,
  precioTela: 0,
  precioConfeccion: 0,
  precioRiel: 0,
  colocacion: 0,
  cantidad: 1,
};

/** Dobladillos: 10 cm por lateral de cada paño, 30 cm entre ruedo y cabezal. */
const DOBLADILLO_LATERAL = 0.1;
const DOBLADILLO_ALTO = 0.3;

export function calcularCortina(e: EntradaCortina): Resultado {
  const panos = Math.max(1, Math.round(e.panos));
  const cantidad = Math.max(1, Math.round(e.cantidad));
  const anchoTerminado = e.ancho * e.fruncido;
  const anchoCorte = anchoTerminado + DOBLADILLO_LATERAL * 2 * panos;
  const altoCorte = e.alto + DOBLADILLO_ALTO;

  // Si el alto entra en el ancho del rollo, la tela se usa "a la francesa" (sin uniones).
  const sinUniones = altoCorte <= e.anchoRollo;
  const metrosTela = sinUniones
    ? anchoCorte
    : Math.ceil(anchoCorte / e.anchoRollo) * altoCorte;

  const lineas = [
    linea("Tela", metrosTela * cantidad, "m", e.precioTela),
    linea("Confección", anchoTerminado * cantidad, "m", e.precioConfeccion),
    linea("Riel / barral", (e.ancho + 0.2) * cantidad, "m", e.precioRiel),
    linea("Colocación", cantidad, "u", e.colocacion),
  ];

  return cerrar(
    lineas,
    `${fmt(redondear(metrosTela * cantidad))} m de tela · ${panos} ${panos === 1 ? "paño" : "paños"}${
      sinUniones ? " · sin uniones" : ""
    }${cantidad > 1 ? ` · ${cantidad} ventanas` : ""}`,
  );
}

/* ─────────── Roller y venecianas (por m²) ─────────── */

export interface EntradaM2 {
  ancho: number;
  alto: number;
  precioM2: number;
  /** Superficie mínima facturable por unidad. */
  minimoM2: number;
  colocacion: number;
  cantidad: number;
}

export const M2_DEFECTO: EntradaM2 = {
  ancho: 1.2,
  alto: 1.5,
  precioM2: 0,
  minimoM2: 1,
  colocacion: 0,
  cantidad: 1,
};

export function calcularM2(e: EntradaM2): Resultado {
  const cantidad = Math.max(1, Math.round(e.cantidad));
  const real = e.ancho * e.alto;
  const facturable = Math.max(real, e.minimoM2);
  const lineas = [
    linea("Sistema a medida", facturable * cantidad, "m²", e.precioM2),
    linea("Colocación", cantidad, "u", e.colocacion),
  ];
  return cerrar(
    lineas,
    `${fmt(redondear(real))} m² por unidad${facturable > real ? ` (se factura el mínimo de ${fmt(e.minimoM2)} m²)` : ""}${
      cantidad > 1 ? ` · ${cantidad} unidades` : ""
    }`,
  );
}

/* ─────────── Empapelado ─────────── */

export interface EntradaEmpapelado {
  /** Suma del ancho de las paredes a empapelar. */
  anchoParedes: number;
  alto: number;
  anchoRollo: number;
  largoRollo: number;
  /** Repetición vertical del dibujo. 0 si es liso. */
  rapport: number;
  precioRollo: number;
  colocacionRollo: number;
}

export const EMPAPELADO_DEFECTO: EntradaEmpapelado = {
  anchoParedes: 4,
  alto: 2.6,
  anchoRollo: 0.53,
  largoRollo: 10.05,
  rapport: 0,
  precioRollo: 0,
  colocacionRollo: 0,
};

export function calcularEmpapelado(e: EntradaEmpapelado): Resultado {
  const largoPano = e.alto + e.rapport + 0.1;
  const panosPorRollo = Math.max(1, Math.floor(e.largoRollo / largoPano));
  const panos = Math.ceil(e.anchoParedes / e.anchoRollo);
  const rollos = Math.ceil(panos / panosPorRollo);
  const lineas = [
    linea("Rollos de empapelado", rollos, "rollo", e.precioRollo),
    linea("Colocación", rollos, "rollo", e.colocacionRollo),
  ];
  return cerrar(lineas, `${panos} paños · ${panosPorRollo} paños por rollo · ${rollos} rollos`);
}

/* ─────────── Pisos ─────────── */

export interface EntradaPiso {
  superficie: number;
  desperdicioPct: number;
  m2PorCaja: number;
  precioM2: number;
  zocaloMetros: number;
  precioZocalo: number;
  colocacionM2: number;
}

export const PISO_DEFECTO: EntradaPiso = {
  superficie: 15,
  desperdicioPct: 8,
  m2PorCaja: 2.2,
  precioM2: 0,
  zocaloMetros: 0,
  precioZocalo: 0,
  colocacionM2: 0,
};

export function calcularPiso(e: EntradaPiso): Resultado {
  const necesario = e.superficie * (1 + e.desperdicioPct / 100);
  const cajas = Math.ceil(necesario / e.m2PorCaja);
  const m2Material = cajas * e.m2PorCaja;
  const lineas = [
    linea(`Piso (${cajas} cajas)`, m2Material, "m²", e.precioM2),
    linea("Zócalo", e.zocaloMetros, "m", e.precioZocalo),
    linea("Colocación", e.superficie, "m²", e.colocacionM2),
  ];
  return cerrar(
    lineas,
    `${fmt(e.superficie)} m² + ${fmt(e.desperdicioPct)}% de desperdicio · ${cajas} cajas de ${fmt(e.m2PorCaja)} m²`,
  );
}

/* ─────────── Totales del presupuesto ─────────── */

export interface Totales {
  subtotal: number;
  descuento: number;
  neto: number;
  iva: number;
  total: number;
  sena: number;
  saldo: number;
}

export function calcularTotales(
  itemsTotal: number[],
  descuentoPct: number,
  ivaPct: number,
  senaPct: number,
): Totales {
  const subtotal = redondear(itemsTotal.reduce((a, b) => a + b, 0));
  const descuento = redondear((subtotal * descuentoPct) / 100);
  const neto = redondear(subtotal - descuento);
  const iva = redondear((neto * ivaPct) / 100);
  const total = redondear(neto + iva);
  const sena = redondear((total * senaPct) / 100);
  return { subtotal, descuento, neto, iva, total, sena, saldo: redondear(total - sena) };
}

export const formatoPesos = (n: number): string =>
  new Intl.NumberFormat("es-AR", { style: "currency", currency: "ARS", maximumFractionDigits: 0 }).format(n);
