import "server-only";
import { and, asc, count, desc, eq, gte, like, or, sql, type SQL } from "drizzle-orm";
import { db, schema } from "@/lib/db";
import type { EstadoConsulta, EstadoPresupuesto } from "@/lib/db/schema";

const inicioDeMes = (d = new Date()) => new Date(d.getFullYear(), d.getMonth(), 1).toISOString();

/* ───────────── Inicio ───────────── */

export async function resumenInicio() {
  const mes = inicioDeMes();
  const [[nuevas], [consultasMes], presupuestosMes, [aceptadoMes], abiertos, ultimasConsultas, ultimosPresupuestos, ultimaActividad] =
    await Promise.all([
      db.select({ n: count() }).from(schema.consultas).where(eq(schema.consultas.estado, "nueva")),
      db.select({ n: count() }).from(schema.consultas).where(gte(schema.consultas.creado, mes)),
      db
        .select({ estado: schema.presupuestos.estado, n: count(), total: sql<number>`coalesce(sum(${schema.presupuestos.total}),0)` })
        .from(schema.presupuestos)
        .where(gte(schema.presupuestos.creado, mes))
        .groupBy(schema.presupuestos.estado),
      db
        .select({ total: sql<number>`coalesce(sum(${schema.presupuestos.total}),0)`, n: count() })
        .from(schema.presupuestos)
        .where(and(eq(schema.presupuestos.estado, "aceptado"), gte(schema.presupuestos.respondido, mes))),
      db
        .select({ total: sql<number>`coalesce(sum(${schema.presupuestos.total}),0)`, n: count() })
        .from(schema.presupuestos)
        .where(or(eq(schema.presupuestos.estado, "enviado"), eq(schema.presupuestos.estado, "visto"))),
      db.select().from(schema.consultas).orderBy(desc(schema.consultas.creado)).limit(6),
      db
        .select({
          id: schema.presupuestos.id,
          numero: schema.presupuestos.numero,
          titulo: schema.presupuestos.titulo,
          estado: schema.presupuestos.estado,
          total: schema.presupuestos.total,
          creado: schema.presupuestos.creado,
          cliente: schema.clientes.nombre,
        })
        .from(schema.presupuestos)
        .leftJoin(schema.clientes, eq(schema.clientes.id, schema.presupuestos.clienteId))
        .orderBy(desc(schema.presupuestos.actualizado))
        .limit(6),
      db.select().from(schema.actividad).orderBy(desc(schema.actividad.creado)).limit(8),
    ]);

  // Serie de los últimos 6 meses: consultas recibidas y presupuestos aceptados.
  const desde = new Date();
  desde.setMonth(desde.getMonth() - 5, 1);
  desde.setHours(0, 0, 0, 0);
  const [consultasSerie, aceptadosSerie] = await Promise.all([
    db
      .select({ mes: sql<string>`substr(${schema.consultas.creado},1,7)`, n: count() })
      .from(schema.consultas)
      .where(gte(schema.consultas.creado, desde.toISOString()))
      .groupBy(sql`substr(${schema.consultas.creado},1,7)`),
    db
      .select({
        mes: sql<string>`substr(${schema.presupuestos.respondido},1,7)`,
        n: count(),
        total: sql<number>`coalesce(sum(${schema.presupuestos.total}),0)`,
      })
      .from(schema.presupuestos)
      .where(and(eq(schema.presupuestos.estado, "aceptado"), gte(schema.presupuestos.respondido, desde.toISOString())))
      .groupBy(sql`substr(${schema.presupuestos.respondido},1,7)`),
  ]);
  const serie = Array.from({ length: 6 }, (_, i) => {
    const d = new Date(desde);
    d.setMonth(desde.getMonth() + i);
    const clave = `${d.getFullYear()}-${String(d.getMonth() + 1).padStart(2, "0")}`;
    return {
      mes: new Intl.DateTimeFormat("es-AR", { month: "short" }).format(d).replace(".", ""),
      consultas: consultasSerie.find((c) => c.mes === clave)?.n ?? 0,
      aceptados: aceptadosSerie.find((c) => c.mes === clave)?.n ?? 0,
      facturado: aceptadosSerie.find((c) => c.mes === clave)?.total ?? 0,
    };
  });

  const enviadosMes = presupuestosMes.filter((p) => p.estado !== "borrador").reduce((a, p) => a + p.n, 0);
  const aceptadosMes = presupuestosMes.find((p) => p.estado === "aceptado")?.n ?? 0;

  return {
    nuevas: nuevas?.n ?? 0,
    consultasMes: consultasMes?.n ?? 0,
    enviadosMes,
    aceptadosMes,
    conversion: enviadosMes ? Math.round((aceptadosMes / enviadosMes) * 100) : 0,
    aceptadoMonto: aceptadoMes?.total ?? 0,
    abiertosMonto: abiertos[0]?.total ?? 0,
    abiertosCantidad: abiertos[0]?.n ?? 0,
    serie,
    ultimasConsultas,
    ultimosPresupuestos,
    ultimaActividad,
  };
}

export async function contarConsultasNuevas(): Promise<number> {
  const [r] = await db.select({ n: count() }).from(schema.consultas).where(eq(schema.consultas.estado, "nueva"));
  return r?.n ?? 0;
}

/* ───────────── Consultas ───────────── */

export async function listarConsultas(estado?: EstadoConsulta | "todas", q?: string) {
  const filtros: SQL[] = [];
  if (estado && estado !== "todas") filtros.push(eq(schema.consultas.estado, estado));
  if (q) {
    const t = `%${q}%`;
    filtros.push(or(like(schema.consultas.nombre, t), like(schema.consultas.telefono, t), like(schema.consultas.servicio, t), like(schema.consultas.mensaje, t))!);
  }
  const [filas, conteos] = await Promise.all([
    db
      .select()
      .from(schema.consultas)
      .where(filtros.length ? and(...filtros) : undefined)
      .orderBy(desc(schema.consultas.creado))
      .limit(200),
    db.select({ estado: schema.consultas.estado, n: count() }).from(schema.consultas).groupBy(schema.consultas.estado),
  ]);
  const presupuestosPorConsulta = await db
    .select({ consultaId: schema.presupuestos.consultaId, id: schema.presupuestos.id, numero: schema.presupuestos.numero })
    .from(schema.presupuestos)
    .where(sql`${schema.presupuestos.consultaId} is not null`);
  return { filas, conteos, presupuestosPorConsulta };
}

/* ───────────── Presupuestos ───────────── */

export async function listarPresupuestos(estado?: EstadoPresupuesto | "todos", q?: string) {
  const filtros: SQL[] = [];
  if (estado && estado !== "todos") filtros.push(eq(schema.presupuestos.estado, estado));
  if (q) {
    const t = `%${q}%`;
    filtros.push(or(like(schema.presupuestos.numero, t), like(schema.presupuestos.titulo, t), like(schema.clientes.nombre, t))!);
  }
  const [filas, conteos] = await Promise.all([
    db
      .select({
        id: schema.presupuestos.id,
        numero: schema.presupuestos.numero,
        titulo: schema.presupuestos.titulo,
        estado: schema.presupuestos.estado,
        total: schema.presupuestos.total,
        validoHasta: schema.presupuestos.validoHasta,
        creado: schema.presupuestos.creado,
        actualizado: schema.presupuestos.actualizado,
        token: schema.presupuestos.token,
        cliente: schema.clientes.nombre,
        telefono: schema.clientes.telefono,
      })
      .from(schema.presupuestos)
      .leftJoin(schema.clientes, eq(schema.clientes.id, schema.presupuestos.clienteId))
      .where(filtros.length ? and(...filtros) : undefined)
      .orderBy(desc(schema.presupuestos.creado))
      .limit(300),
    db
      .select({ estado: schema.presupuestos.estado, n: count(), total: sql<number>`coalesce(sum(${schema.presupuestos.total}),0)` })
      .from(schema.presupuestos)
      .groupBy(schema.presupuestos.estado),
  ]);
  return { filas, conteos };
}

export async function getPresupuesto(id: string) {
  const [p] = await db.select().from(schema.presupuestos).where(eq(schema.presupuestos.id, id));
  if (!p) return null;
  const [items, cliente, consulta] = await Promise.all([
    db.select().from(schema.presupuestoItems).where(eq(schema.presupuestoItems.presupuestoId, id)).orderBy(asc(schema.presupuestoItems.orden)),
    p.clienteId ? db.select().from(schema.clientes).where(eq(schema.clientes.id, p.clienteId)).then((r) => r[0] ?? null) : null,
    p.consultaId ? db.select().from(schema.consultas).where(eq(schema.consultas.id, p.consultaId)).then((r) => r[0] ?? null) : null,
  ]);
  return { ...p, items, cliente, consulta };
}

export async function getPresupuestoPorToken(token: string) {
  const [p] = await db.select({ id: schema.presupuestos.id }).from(schema.presupuestos).where(eq(schema.presupuestos.token, token));
  return p ? getPresupuesto(p.id) : null;
}

/* ───────────── Clientes ───────────── */

export async function listarClientes(q?: string) {
  const t = q ? `%${q}%` : null;
  const filas = await db
    .select({
      id: schema.clientes.id,
      nombre: schema.clientes.nombre,
      telefono: schema.clientes.telefono,
      email: schema.clientes.email,
      localidad: schema.clientes.localidad,
      creado: schema.clientes.creado,
      presupuestos: sql<number>`(select count(*) from presupuestos p where p.cliente_id = ${schema.clientes.id})`,
      facturado: sql<number>`(select coalesce(sum(p.total),0) from presupuestos p where p.cliente_id = ${schema.clientes.id} and p.estado = 'aceptado')`,
    })
    .from(schema.clientes)
    .where(t ? or(like(schema.clientes.nombre, t), like(schema.clientes.telefono, t), like(schema.clientes.email, t)) : undefined)
    .orderBy(desc(schema.clientes.creado))
    .limit(300);
  return filas;
}

export async function getCliente(id: string) {
  const [c] = await db.select().from(schema.clientes).where(eq(schema.clientes.id, id));
  if (!c) return null;
  const [presupuestos, consultas] = await Promise.all([
    db.select().from(schema.presupuestos).where(eq(schema.presupuestos.clienteId, id)).orderBy(desc(schema.presupuestos.creado)),
    db.select().from(schema.consultas).where(eq(schema.consultas.clienteId, id)).orderBy(desc(schema.consultas.creado)),
  ]);
  return { ...c, presupuestos, consultas };
}

export const todosLosClientes = () =>
  db.select({ id: schema.clientes.id, nombre: schema.clientes.nombre, telefono: schema.clientes.telefono }).from(schema.clientes).orderBy(asc(schema.clientes.nombre));

/* ───────────── Catálogo de precios y contenido ───────────── */

export const listarPrecios = () =>
  db.select().from(schema.precios).orderBy(asc(schema.precios.categoria), asc(schema.precios.nombre));

export const listarServiciosAdmin = () => db.select().from(schema.servicios).orderBy(asc(schema.servicios.orden));
export const getServicioAdmin = async (id: string) => (await db.select().from(schema.servicios).where(eq(schema.servicios.id, id)))[0] ?? null;
export const listarProyectosAdmin = () => db.select().from(schema.proyectos).orderBy(asc(schema.proyectos.orden), desc(schema.proyectos.creado));
export const listarResenasAdmin = () => db.select().from(schema.resenas).orderBy(desc(schema.resenas.destacada), desc(schema.resenas.creado));
export const listarPreguntasAdmin = () => db.select().from(schema.preguntas).orderBy(asc(schema.preguntas.orden));
export const listarMedios = () => db.select().from(schema.medios).orderBy(desc(schema.medios.creado));
export const listarSeoPaginas = () => db.select().from(schema.seoPaginas);
export const listarRedirecciones = () => db.select().from(schema.redirecciones).orderBy(desc(schema.redirecciones.creado));
export const listarUsuarios = () =>
  db
    .select({
      id: schema.usuarios.id,
      email: schema.usuarios.email,
      nombre: schema.usuarios.nombre,
      rol: schema.usuarios.rol,
      activo: schema.usuarios.activo,
      ultimoIngreso: schema.usuarios.ultimoIngreso,
      creado: schema.usuarios.creado,
    })
    .from(schema.usuarios)
    .orderBy(asc(schema.usuarios.creado));

export const listarActividad = (limite = 50) => db.select().from(schema.actividad).orderBy(desc(schema.actividad.creado)).limit(limite);

export const listarMarcasAdmin = () => db.select().from(schema.marcas).orderBy(asc(schema.marcas.orden), asc(schema.marcas.nombre));
export const listarCatalogosAdmin = () => db.select().from(schema.catalogos).orderBy(asc(schema.catalogos.orden), desc(schema.catalogos.creado));
