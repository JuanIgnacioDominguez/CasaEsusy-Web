import assert from "node:assert/strict";
import { describe, it } from "node:test";
import {
  CORTINA_DEFECTO,
  calcularCortina,
  calcularEmpapelado,
  calcularM2,
  calcularPiso,
  calcularTotales,
  EMPAPELADO_DEFECTO,
  M2_DEFECTO,
  PISO_DEFECTO,
} from "./calculos";

describe("calcularCortina", () => {
  it("usa la tela a la francesa cuando el alto entra en el rollo", () => {
    const r = calcularCortina({ ...CORTINA_DEFECTO, ancho: 2, alto: 2.4, panos: 2, fruncido: 2, precioTela: 1000 });
    // 2 × 2 + 0,1 × 2 × 2 = 4,4 m
    assert.equal(r.lineas[0]?.cantidad, 4.4);
    assert.equal(r.total, 4400);
    assert.match(r.resumen, /sin uniones/);
  });

  it("calcula paños con uniones cuando la cortina es más alta que el rollo", () => {
    const r = calcularCortina({ ...CORTINA_DEFECTO, ancho: 3, alto: 2.8, panos: 2, fruncido: 2, anchoRollo: 1.5, precioTela: 100 });
    // ancho de corte 6,4 → 5 paños de 1,5 m × 3,1 m de alto = 15,5 m
    assert.equal(r.lineas[0]?.cantidad, 15.5);
  });

  it("multiplica por la cantidad de ventanas e ignora líneas sin precio", () => {
    const r = calcularCortina({ ...CORTINA_DEFECTO, cantidad: 3, precioTela: 10, colocacion: 500 });
    assert.equal(r.lineas.length, 2);
    assert.equal(r.lineas[1]?.subtotal, 1500);
  });
});

describe("calcularM2", () => {
  it("aplica la superficie mínima facturable", () => {
    const r = calcularM2({ ...M2_DEFECTO, ancho: 0.6, alto: 1, minimoM2: 1, precioM2: 1000 });
    assert.equal(r.total, 1000);
    assert.match(r.resumen, /mínimo/);
  });

  it("factura la superficie real si supera el mínimo", () => {
    const r = calcularM2({ ...M2_DEFECTO, ancho: 1.5, alto: 2, cantidad: 2, precioM2: 100, colocacion: 50 });
    assert.equal(r.total, 3 * 2 * 100 + 2 * 50);
  });
});

describe("calcularEmpapelado", () => {
  it("calcula rollos según paños por rollo", () => {
    const r = calcularEmpapelado({ ...EMPAPELADO_DEFECTO, anchoParedes: 4, alto: 2.6, precioRollo: 100 });
    // 8 paños, 3 paños por rollo (10,05 / 2,7) → 3 rollos
    assert.equal(r.lineas[0]?.cantidad, 3);
  });

  it("el rapport reduce los paños por rollo", () => {
    const sin = calcularEmpapelado({ ...EMPAPELADO_DEFECTO, anchoParedes: 6, alto: 2.4, precioRollo: 1 });
    const con = calcularEmpapelado({ ...EMPAPELADO_DEFECTO, anchoParedes: 6, alto: 2.4, rapport: 0.64, precioRollo: 1 });
    assert.ok((con.lineas[0]?.cantidad ?? 0) > (sin.lineas[0]?.cantidad ?? 0));
  });
});

describe("calcularPiso", () => {
  it("redondea a cajas completas con desperdicio", () => {
    const r = calcularPiso({ ...PISO_DEFECTO, superficie: 15, desperdicioPct: 8, m2PorCaja: 2.2, precioM2: 100 });
    // 16,2 m² → 8 cajas → 17,6 m²
    assert.equal(r.lineas[0]?.cantidad, 17.6);
    assert.equal(r.lineas[0]?.concepto, "Piso (8 cajas)");
  });
});

describe("calcularTotales", () => {
  it("aplica descuento, IVA y seña", () => {
    const t = calcularTotales([1000, 500], 10, 21, 50);
    assert.equal(t.subtotal, 1500);
    assert.equal(t.descuento, 150);
    assert.equal(t.neto, 1350);
    assert.equal(t.iva, 283.5);
    assert.equal(t.total, 1633.5);
    assert.equal(t.sena, 816.75);
    assert.equal(t.saldo, 816.75);
  });
});
