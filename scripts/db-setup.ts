/**
 * Prepara la base: aplica migraciones, carga el contenido inicial si está vacía
 * y crea el primer usuario administrador. Corre solo antes de `dev` y `build`.
 */
import { mkdirSync } from "node:fs";
import { count, eq } from "drizzle-orm";
import { migrate } from "drizzle-orm/libsql/migrator";
import { db, DATABASE_URL, schema } from "../src/lib/db";
import { PRECIOS, PREGUNTAS, PROYECTOS, RESENAS, SEO_INICIAL, SERVICIOS } from "../src/lib/db/semilla";
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

main().catch((e) => {
  console.error(e);
  process.exit(1);
});
