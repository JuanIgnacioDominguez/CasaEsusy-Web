# Casa Esusy · Sitio web

Sitio de **Casa Esusy**, decoración integral en Banfield desde 1967.
Next.js 16 (App Router) · TypeScript estricto · Tailwind CSS 4 · Motion · diseño basado en Apple HIG.

El plan completo está en [`docs/plan-web-casa-esusy.md`](docs/plan-web-casa-esusy.md).

## Correr el proyecto

Requiere Node.js 20 o superior.

```bash
npm install
npm run dev        # http://localhost:3000
```

| Script | Qué hace |
|---|---|
| `npm run dev` | Servidor de desarrollo |
| `npm run build` / `npm start` | Build de producción (`output: "standalone"`, listo para Vercel o Docker) |
| `npm run export` | HTML estático en `out/` (solo para previsualizar el diseño) |
| `npm run typecheck` | Chequeo de tipos |
| `npm run format` | Prettier |

## Estado (Fase 1, sitio público)

Hecho:
- Design system: tokens de color y tipografía (paleta de su Instagram), escala HIG con cuerpo de 17 px, objetivos táctiles de 44 px y safe areas.
- Motion con `LazyMotion` y `prefers-reduced-motion`. Un solo momento animado sin interacción (el muestrario del hero). El resto responde a acciones: menú en hoja, preguntas, formulario y WhatsApp.
- Botón flotante de WhatsApp (+54 9 11 5598-4126) con mensaje según la página, aviso fuera de horario y evento `click_whatsapp`.
- Páginas: inicio, 8 landings de producto con 16 subpáginas, diseño de interiores, nosotros, contacto, presupuesto (formulario en 3 pasos que arma el mensaje de WhatsApp), preguntas frecuentes, cuidado de telas, reseñas, marcas, proyectos, novedades, legales y 404.
- SEO: metadatos y canonical por página, JSON-LD (`HomeAndConstructionBusiness`, `Person` con credencial, `Service`, `FAQPage`, `BreadcrumbList`), `sitemap.xml`, `robots.txt`, `llms.txt`, manifest y `noindex` en dominios de preview (`src/proxy.ts`).
- Fuentes alojadas en el proyecto (Cormorant Garamond e Inter, licencia OFL).

Pendiente:
- **Fotos reales**: cada `FotoPendiente` indica qué foto va en ese lugar.
- Textos marcados `[COMPLETAR]` (hitos de la historia, pagos, garantía, email, marcas).
- Fase 1d: base de datos (Supabase + Drizzle), panel de administración, reseñas de Google por cron e Instagram Graph API.
- Fase 2: cotizador, CRM, órdenes de trabajo y facturación ARCA.

## Dónde está cada cosa

```
src/
  app/                 rutas (cada carpeta es una URL)
  components/
    layout/            Navbar, MenuSheet, Footer, WhatsAppFlotante
    secciones/         bloques de página (hero, reseñas, formulario, landing)
    ui/                Boton, Muestra (texturas), FotoPendiente, Preguntas, Migas, Logo
    seo/JsonLd.tsx
  content/             datos del negocio, servicios, preguntas, reseñas (pasan a la base en la Fase 1d)
  lib/                 seo, horario, validación (zod), analítica
  fonts/               fuentes locales
```

Para cambiar teléfono, horarios o dirección, editá `src/content/negocio.ts`: lo usan el sitio, el schema, el `llms.txt` y el botón de WhatsApp.
