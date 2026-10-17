import { readFile } from "node:fs/promises";
import { join } from "node:path";
import { ImageResponse } from "next/og";

export const alt = "Casa Esusy · Cortinas, tapizados y decoración a medida en Banfield desde 1967";
export const size = { width: 1200, height: 630 };
export const contentType = "image/png";

/** Imagen para compartir en WhatsApp, Instagram y redes. */
export default async function Imagen() {
  const [logo, foto] = await Promise.all([
    readFile(join(process.cwd(), "public/marca/logo.png")),
    readFile(join(process.cwd(), "public/img/ambientes/living-sillon-gasas.jpg")),
  ]);
  const logoSrc = `data:image/png;base64,${logo.toString("base64")}`;
  const fotoSrc = `data:image/jpeg;base64,${foto.toString("base64")}`;

  return new ImageResponse(
    (
      <div style={{ display: "flex", width: "100%", height: "100%", background: "#FBFBFB" }}>
        <div style={{ display: "flex", flexDirection: "column", justifyContent: "space-between", width: "58%", padding: "64px 56px" }}>
          {/* eslint-disable-next-line @next/next/no-img-element */}
          <img src={logoSrc} width={330} height={101} alt="" />
          <div style={{ display: "flex", flexDirection: "column", gap: 20 }}>
            <div style={{ fontSize: 62, fontWeight: 700, lineHeight: 1.04, color: "#23282E", letterSpacing: -2 }}>
              Cortinas, tapizados y decoración a medida
            </div>
            <div style={{ fontSize: 28, color: "#646A71" }}>Banfield · Desde 1967 · Presupuesto sin cargo</div>
          </div>
          <div style={{ display: "flex", width: 96, height: 8, borderRadius: 8, background: "#A65A3F" }} />
        </div>
        <div style={{ display: "flex", width: "42%", height: "100%", padding: 24 }}>
          {/* eslint-disable-next-line @next/next/no-img-element */}
          <img src={fotoSrc} alt="" style={{ width: "100%", height: "100%", objectFit: "cover", borderRadius: 32 }} />
        </div>
      </div>
    ),
    size,
  );
}
