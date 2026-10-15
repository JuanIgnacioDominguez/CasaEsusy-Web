/**
 * Carga datos de demostración en el panel (consultas, clientes y presupuestos) para probarlo.
 * Todos usan emails @demo.casaesusy y se borran con: npm run db:demo -- --limpiar
 */
import { eq, inArray, like } from "drizzle-orm";
import { db, schema } from "../src/lib/db";
import { calcularTotales } from "../src/lib/presupuestos/calculos";
import { calcularItem, ENTRADAS_DEFECTO, type ItemEditable } from "../src/lib/presupuestos/items";

const DOMINIO = "@demo.casaesusy";

async function limpiar() {
  const clientes = await db.select({ id: schema.clientes.id }).from(schema.clientes).where(like(schema.clientes.email, `%${DOMINIO}`));
  const ids = clientes.map((c) => c.id);
  if (ids.length) await db.delete(schema.presupuestos).where(inArray(schema.presupuestos.clienteId, ids));
  await db.delete(schema.consultas).where(like(schema.consultas.email, `%${DOMINIO}`));
  if (ids.length) await db.delete(schema.clientes).where(inArray(schema.clientes.id, ids));
  console.log(`✓ Datos de demo eliminados (${ids.length} clientes)`);
}

const haceDias = (d: number) => new Date(Date.now() - d * 864e5).toISOString();

const PERSONAS = [
  { nombre: "Laura Gómez", telefono: "11 4523-8890", localidad: "Banfield" },
  { nombre: "Martín Ferreyra", telefono: "11 6011-2234", localidad: "Lomas de Zamora" },
  { nombre: "Sofía Benítez", telefono: "11 5876-1102", localidad: "Temperley" },
  { nombre: "Carlos Ruiz", telefono: "11 3345-7781", localidad: "Adrogué" },
  { nombre: "Valeria Paz", telefono: "11 2290-4456", localidad: "Lanús" },
  { nombre: "Estudio Contable Ríos", telefono: "11 4400-1200", localidad: "Lomas de Zamora" },
  { nombre: "Julieta Moreno", telefono: "11 6789-0012", localidad: "Banfield" },
  { nombre: "Diego Acosta", telefono: "11 5123-6677", localidad: "Remedios de Escalada" },
];

async function cargar() {
  const precios = await db.select().from(schema.precios);
  const precio = (nombre: string) => precios.find((p) => p.nombre === nombre)?.precio ?? 0;

  const clientes = await db
    .insert(schema.clientes)
    .values(
      PERSONAS.map((p, i) => ({
        nombre: p.nombre,
        telefono: p.telefono,
        email: `${p.nombre.split(" ")[0]!.toLowerCase()}${i}${DOMINIO}`,
        localidad: p.localidad,
        creado: haceDias(150 - i * 18),
      })),
    )
    .returning();

  type NuevaConsulta = typeof schema.consultas.$inferInsert;
  const base: Omit<NuevaConsulta, "email">[] = [
    { nombre: "Romina Díaz", telefono: "11 6543-2109", servicio: "Cortinas", mensaje: "Quiero black out para el dormitorio y una gasa por delante.", estado: "nueva", origen: "web", detalles: { ambientes: "Dormitorio", medidas: "2,20 × 2,40 m", zona: "Banfield", conVisita: true }, creado: haceDias(0.2) },
    { nombre: "Pablo Sosa", telefono: "11 3456-7890", servicio: "Pisos", mensaje: "Cocina de 12 m², ¿el SPC sirve?", estado: "nueva", origen: "whatsapp", detalles: { zona: "Lanús" }, creado: haceDias(1) },
    { nombre: "Ana Quiroga", telefono: "11 2233-4455", servicio: "Sillones y tapizados", mensaje: "Retapizar un sillón de 3 cuerpos, tengo gatos.", estado: "contactada", origen: "instagram", detalles: { zona: "Temperley" }, creado: haceDias(3) },
    { nombre: "Lucas Medina", telefono: "11 9988-7766", servicio: "Empapelados", mensaje: "Pared de 3,5 m para el cuarto de mi hija.", estado: "nueva", origen: "web", detalles: { ambientes: "Cuarto de chicos", medidas: "3,5 m de ancho", zona: "Adrogué", conVisita: false }, creado: haceDias(4) },
    { nombre: "Gabriela Torres", telefono: "11 5566-7788", servicio: "Alfombras", mensaje: "Alfombra para living de 4 × 5 m.", estado: "perdida", origen: "local", detalles: {}, creado: haceDias(40) },
  ];
  const consultas: NuevaConsulta[] = base.map((c, i) => ({ ...c, email: `consulta${i}${DOMINIO}` }));

  const ligadas = clientes.slice(0, 5).map((c, i) => ({
    nombre: c.nombre,
    telefono: c.telefono,
    email: c.email,
    servicio: ["Cortinas", "Cortinas", "Pisos", "Empapelados", "Sillones y tapizados"][i]!,
    mensaje: "Consulta inicial",
    estado: (["ganada", "ganada", "presupuestada", "ganada", "presupuestada"] as const)[i],
    origen: (["web", "whatsapp", "web", "instagram", "telefono"] as const)[i],
    clienteId: c.id,
    detalles: { zona: c.localidad },
    creado: haceDias(140 - i * 25),
  }));
  const insertadas = await db.insert(schema.consultas).values([...consultas, ...ligadas]).returning();

  const cortina = (ancho: number, alto: number, tela: string): ItemEditable => ({
    clave: "x",
    ambiente: "",
    descripcion: `Cortina ${tela.toLowerCase()} con riel`,
    tipo: "cortina",
    entradas: { ...ENTRADAS_DEFECTO.cortina, ancho, alto, precioTela: precio(tela), precioConfeccion: precio("Confección tradicional"), precioRiel: precio("Riel de aluminio"), colocacion: precio("Colocación por ventana") },
    cantidad: 1,
    precioUnitario: 0,
  });
  const roller = (ancho: number, alto: number): ItemEditable => ({
    clave: "x",
    ambiente: "",
    descripcion: "Roller black out",
    tipo: "m2",
    entradas: { ...ENTRADAS_DEFECTO.m2, ancho, alto, precioM2: precio("Roller black out"), colocacion: precio("Colocación por ventana") },
    cantidad: 1,
    precioUnitario: 0,
  });
  const piso = (m2: number): ItemEditable => ({
    clave: "x",
    ambiente: "Cocina",
    descripcion: "Piso SPC vinílico roble claro",
    tipo: "piso",
    entradas: { ...ENTRADAS_DEFECTO.piso, superficie: m2, precioM2: precio("SPC vinílico"), zocaloMetros: 14, precioZocalo: precio("Zócalo"), colocacionM2: precio("Colocación de piso") },
    cantidad: 1,
    precioUnitario: 0,
  });
  const empapelado = (ancho: number): ItemEditable => ({
    clave: "x",
    ambiente: "Cuarto de chicos",
    descripcion: "Empapelado infantil importado",
    tipo: "empapelado",
    entradas: { ...ENTRADAS_DEFECTO.empapelado, anchoParedes: ancho, precioRollo: precio("Rollo importado"), colocacionRollo: precio("Colocación de empapelado") },
    cantidad: 1,
    precioUnitario: 0,
  });
  const manual = (descripcion: string, monto: number): ItemEditable => ({ clave: "x", ambiente: "Living", descripcion, tipo: "manual", entradas: {}, cantidad: 1, precioUnitario: monto });

  const planes: { cliente: number; titulo: string; estado: (typeof schema.presupuestos.$inferInsert)["estado"]; dias: number; items: ItemEditable[] }[] = [
    { cliente: 0, titulo: "Cortinas living y dormitorio", estado: "aceptado", dias: 130, items: [{ ...cortina(3.2, 2.5, "Gasa de lino"), ambiente: "Living" }, { ...roller(1.6, 1.8), ambiente: "Dormitorio" }] },
    { cliente: 1, titulo: "Black out dormitorios", estado: "aceptado", dias: 100, items: [{ ...cortina(2.2, 2.4, "Black out textil"), ambiente: "Dormitorio principal" }, { ...cortina(1.6, 2.2, "Black out textil"), ambiente: "Dormitorio" }] },
    { cliente: 2, titulo: "Piso SPC cocina", estado: "visto", dias: 12, items: [piso(12)] },
    { cliente: 3, titulo: "Empapelado cuarto de chicos", estado: "aceptado", dias: 60, items: [empapelado(3.5)] },
    { cliente: 4, titulo: "Retapizado sillón 3 cuerpos", estado: "enviado", dias: 5, items: [manual("Retapizado sillón 3 cuerpos en tela antimanchas", precio("Retapizado sillón 1 cuerpo") * 2.6)] },
    { cliente: 5, titulo: "Bandas verticales oficina", estado: "aceptado", dias: 25, items: [{ ...roller(2.4, 1.6), descripcion: "Bandas verticales PVC", ambiente: "Oficina" }, { ...roller(2.4, 1.6), descripcion: "Bandas verticales PVC", ambiente: "Sala de reuniones" }] },
    { cliente: 6, titulo: "Cortinas comedor", estado: "borrador", dias: 1, items: [{ ...cortina(2.8, 2.6, "Lino natural"), ambiente: "Comedor" }] },
    { cliente: 7, titulo: "Venecianas de madera", estado: "rechazado", dias: 45, items: [{ ...roller(1.2, 1.5), descripcion: "Veneciana madera 50 mm", entradas: { ...ENTRADAS_DEFECTO.m2, ancho: 1.2, alto: 1.5, precioM2: precio("Veneciana madera 50 mm"), colocacion: precio("Colocación por ventana"), cantidad: 3 }, ambiente: "Living" }] },
  ];

  const anio = new Date().getFullYear();
  for (const [i, plan] of planes.entries()) {
    const calculados = plan.items.map((it, j) => calcularItem({ ...it, clave: String(j) }));
    const t = calcularTotales(calculados.map((c) => c.total), 0, 0, 50);
    const creado = haceDias(plan.dias);
    const cliente = clientes[plan.cliente]!;
    const consulta = insertadas.find((c) => c.clienteId === cliente.id);
    const respondido = plan.estado === "aceptado" || plan.estado === "rechazado" ? haceDias(Math.max(plan.dias - 3, 0)) : null;
    const [p] = await db
      .insert(schema.presupuestos)
      .values({
        numero: `P-${anio}-${String(900 + i).padStart(4, "0")}`,
        clienteId: cliente.id,
        consultaId: consulta?.id ?? null,
        titulo: plan.titulo,
        estado: plan.estado,
        validoHasta: new Date(new Date(creado).getTime() + 15 * 864e5).toISOString().slice(0, 10),
        senaPct: 50,
        condiciones: "Seña del 50% para iniciar la confección y saldo contra entrega.",
        subtotal: t.subtotal,
        total: t.total,
        creado,
        enviado: plan.estado === "borrador" ? null : creado,
        respondido,
      })
      .returning({ id: schema.presupuestos.id });
    await db.insert(schema.presupuestoItems).values(
      calculados.map((c, orden) => ({
        presupuestoId: p!.id,
        ambiente: c.ambiente,
        descripcion: c.descripcion,
        tipo: c.tipo,
        entradas: c.entradas,
        desglose: c.desglose,
        cantidad: c.cantidad,
        precioUnitario: c.precioUnitario,
        total: c.total,
        orden,
      })),
    );
  }
  await db.update(schema.consultas).set({ estado: "nueva" }).where(eq(schema.consultas.email, `consulta0${DOMINIO}`));
  console.log(`✓ Demo cargada: ${clientes.length} clientes, ${insertadas.length} consultas, ${planes.length} presupuestos`);
}

(process.argv.includes("--limpiar") ? limpiar() : limpiar().then(cargar)).catch((e) => {
  console.error(e);
  process.exit(1);
});
