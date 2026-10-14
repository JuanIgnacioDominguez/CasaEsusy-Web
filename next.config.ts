import type { NextConfig } from "next";

/**
 * - Producción (Vercel o VPS DonWeb): output "standalone" → corre en Docker sin cambios.
 * - STATIC_EXPORT=1 → exporta HTML estático (solo para previsualizar el diseño).
 */
const isStaticExport = process.env.STATIC_EXPORT === "1";

const securityHeaders = [
  { key: "X-Content-Type-Options", value: "nosniff" },
  { key: "Referrer-Policy", value: "strict-origin-when-cross-origin" },
  { key: "Permissions-Policy", value: "camera=(), microphone=(), geolocation=()" },
  { key: "X-Frame-Options", value: "SAMEORIGIN" },
];

const nextConfig: NextConfig = {
  output: isStaticExport ? "export" : "standalone",
  trailingSlash: isStaticExport,
  poweredByHeader: false,
  images: isStaticExport
    ? { unoptimized: true }
    : { formats: ["image/avif", "image/webp"] },
  ...(isStaticExport
    ? {}
    : {
        async headers() {
          return [{ source: "/:path*", headers: securityHeaders }];
        },
      }),
};

export default nextConfig;
