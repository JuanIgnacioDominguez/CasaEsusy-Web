import { randomBytes, scrypt, timingSafeEqual, type ScryptOptions } from "node:crypto";

/** Hash de contraseñas con scrypt (sin dependencias nativas). Formato: scrypt$N$r$p$sal$hash */
const N = 16384;
const R = 8;
const P = 1;
const LARGO = 64;

function scryptAsync(clave: string, sal: Buffer, opciones: ScryptOptions): Promise<Buffer> {
  return new Promise((resolve, reject) =>
    scrypt(clave, sal, LARGO, opciones, (err, derivada) => (err ? reject(err) : resolve(derivada))),
  );
}

export async function hashearClave(clave: string): Promise<string> {
  const sal = randomBytes(16);
  const derivada = await scryptAsync(clave.normalize("NFKC"), sal, { N, r: R, p: P });
  return `scrypt$${N}$${R}$${P}$${sal.toString("base64url")}$${derivada.toString("base64url")}`;
}

export async function verificarClave(clave: string, guardado: string): Promise<boolean> {
  const [algoritmo, n, r, p, sal, hash] = guardado.split("$");
  if (algoritmo !== "scrypt" || !n || !r || !p || !sal || !hash) return false;
  const esperado = Buffer.from(hash, "base64url");
  const derivada = await scryptAsync(clave.normalize("NFKC"), Buffer.from(sal, "base64url"), {
    N: Number(n),
    r: Number(r),
    p: Number(p),
  });
  return derivada.length === esperado.length && timingSafeEqual(derivada, esperado);
}
