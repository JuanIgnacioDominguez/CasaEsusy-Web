import "server-only";
import { db, schema } from "@/lib/db";

export { getServicios } from "./publico";

export function getSeoPaginaTodas() {
  return db.select().from(schema.seoPaginas);
}
