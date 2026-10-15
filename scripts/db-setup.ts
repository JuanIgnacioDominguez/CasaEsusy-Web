/**
 * Prepara la base: aplica migraciones, carga el contenido inicial si está vacía
 * y crea el primer usuario administrador. Corre solo antes de `dev` y `build`.
 */
import { mkdirSync } from "node:fs";
import { count, eq } from "drizzle-orm";
import { migrate } from "drizzle-orm/libsql/migrator";
import { db, DATABASE_URL, schema } from "../src/lib/db";
import { MARCAS, PRECIOS, PREGUNTAS, PROYECTOS, RESENAS, SEO_INICIAL, SERVICIOS } from "../src/lib/db/semilla";
import { NEGOCIO_DEFECTO } from "../src/lib/ajustes/esquemas";
import { hashearClave } from "../src/lib/auth/clave";

async function main() {
  if (DATABASE_URL.startsWith("file:")) mkdirSync("data", { recursive: true });
  await migrate(db, { migrationsFolder: "drizzle" });

  const hayServicios = (await db.select({ n: count() }).from(schema.servicios))[0]?.n ?? 0;
  if (hayServicios === 0) {
    await db.insert(schema.servicios).values(SERVICIOS.map((s, i) => ({ ...s, orden: i })));
    await db.insert(schema.proyectos).values(PROYECTOS.map((p, i) => ({ ...p, orden: i })));
    await db.insert(schema.resenas).values(RESENAS);
    await db.insert(schema.preguntas).values(PREGUNTAS.map((p, i) => ({ ...p, orden: i })));
    await db.insert(schema.precios).values(PRECIOS);
    console.log("✓ Contenido inicial cargado");
  }

  const haySeo = (await db.select({ n: count() }).from(schema.seoPaginas))[0]?.n ?? 0;
  if (haySeo === 0) {
    await db.insert(schema.seoPaginas).values(SEO_INICIAL);
    console.log("✓ Descripciones SEO iniciales cargadas");
  }

  const hayMarcas = (await db.select({ n: count() }).from(schema.marcas))[0]?.n ?? 0;
  if (hayMarcas === 0) {
    await db.insert(schema.marcas).values(MARCAS);
    console.log("✓ Marcas cargadas");
  }

  await actualizarContenido(hayServicios > 0);

  const hayUsuarios = (await db.select({ n: count() }).from(schema.usuarios))[0]?.n ?? 0;
  if (hayUsuarios === 0) {
    const email = (process.env.ADMIN_EMAIL ?? "admin@casaesusy.com.ar").toLowerCase();
    const clave = process.env.ADMIN_PASSWORD;
    if (!clave) {
      console.warn("! No hay usuarios. Definí ADMIN_EMAIL y ADMIN_PASSWORD en .env.local y volvé a correr.");
    } else {
      await db.insert(schema.usuarios).values({
        email,
        nombre: process.env.ADMIN_NAME ?? "Andrea Esusy",
        hash: await hashearClave(clave),
        rol: "admin",
      });
      console.log(`✓ Usuario administrador creado: ${email}`);
    }
  } else if (process.env.ADMIN_RESET === "1" && process.env.ADMIN_EMAIL && process.env.ADMIN_PASSWORD) {
    await db
      .update(schema.usuarios)
      .set({ hash: await hashearClave(process.env.ADMIN_PASSWORD) })
      .where(eq(schema.usuarios.email, process.env.ADMIN_EMAIL.toLowerCase()));
    console.log("✓ Contraseña restablecida");
  }
  console.log("✓ Base lista:", DATABASE_URL);
}

/**
 * Actualizaciones de contenido entre versiones del sitio. Se aplican una sola vez
 * (clave `version_contenido`). Pensado para antes del lanzamiento: pisa los textos iniciales.
 */
const VERSION_CONTENIDO = 3;

async function actualizarContenido(baseExistente: boolean) {
  const [fila] = await db.select().from(schema.ajustes).where(eq(schema.ajustes.clave, "version_contenido"));
  const actual = Number(fila?.valor ?? 1);
  if (actual >= VERSION_CONTENIDO) return;

  if (baseExistente && actual < 2) {
    // v2: cobertura sin límite (Capital, zona sur y donde se necesite), textos nuevos y diseño de interiores.
    for (const s of SERVICIOS) {
      await db
        .update(schema.servicios)
        .set({ titulo: s.titulo, bajada: s.bajada, descripcion: s.descripcion, tipos: s.tipos, preguntas: s.preguntas, mensajeWhatsApp: s.mensajeWhatsApp })
        .where(eq(schema.servicios.slug, s.slug));
    }
    await db.delete(schema.preguntas);
    await db.insert(schema.preguntas).values(PREGUNTAS.map((p, i) => ({ ...p, orden: i })));
    for (const seo of SEO_INICIAL) {
      await db
        .insert(schema.seoPaginas)
        .values(seo)
        .onConflictDoUpdate({ target: schema.seoPaginas.ruta, set: { descripcion: seo.descripcion } });
    }
    const [negocio] = await db.select().from(schema.ajustes).where(eq(schema.ajustes.clave, "negocio"));
    if (negocio) {
      await db
        .update(schema.ajustes)
        .set({ valor: { ...(negocio.valor as object), zonas: NEGOCIO_DEFECTO.zonas, cobertura: NEGOCIO_DEFECTO.cobertura } })
        .where(eq(schema.ajustes.clave, "negocio"));
    }
    console.log("✓ Contenido actualizado a la versión 2");
  }

  if (baseExistente && actual < 3) {
    // v3: logos y sitios web oficiales de las marcas (solo si no se cargaron a mano).
    for (const m of MARCAS) {
      const [fila] = await db.select().from(schema.marcas).where(eq(schema.marcas.nombre, m.nombre));
      if (fila && !fila.logo) {
        await db.update(schema.marcas).set({ logo: m.logo, sitioWeb: fila.sitioWeb || m.sitioWeb, rubro: m.rubro, descripcion: m.descripcion }).where(eq(schema.marcas.id, fila.id));
      }
    }
    console.log("✓ Logos de marcas cargados");
  }

  await db
    .insert(schema.ajustes)
    .values({ clave: "version_contenido", valor: VERSION_CONTENIDO })
    .onConflictDoUpdate({ target: schema.ajustes.clave, set: { valor: VERSION_CONTENIDO } });
}

main().catch((e) => {
  console.error(e);
  process.exit(1);
});
