# Casa Esusy · Sitio web y panel

Sitio de **Casa Esusy**, decoración integral en Banfield desde 1967, con panel de gestión propio.

Next.js 16 (App Router) · React 19 · TypeScript estricto · Tailwind CSS 4 · shadcn/ui · Motion · Drizzle ORM + SQLite/libSQL.

## Correr el proyecto

Requiere Node.js 20 o superior.

```bash
npm install
cp .env.example .env.local   # completá ADMIN_PASSWORD
npm run dev                  # http://localhost:3000  (prepara la base sola)
npm run db:demo              # opcional: consultas, clientes y presupuestos de ejemplo
```

Panel: `http://localhost:3000/admin` con el `ADMIN_EMAIL` / `ADMIN_PASSWORD` de `.env.local`.

| Script | Qué hace |
|---|---|
| `npm run dev` | Servidor de desarrollo (antes corre `db:setup`) |
| `npm run build` / `npm start` | Build de producción `standalone` (antes corre `db:setup`) |
| `npm run db:setup` | Migraciones + contenido inicial + primer usuario admin |
| `npm run db:demo` | Carga datos de ejemplo · `npm run db:demo -- --limpiar` los borra |
| `npm run db:generate` | Genera una migración nueva después de tocar `src/lib/db/schema.ts` |
| `npm test` | Tests del motor de presupuestos |
| `npm run typecheck` | Chequeo de tipos |

## Diseño

- **Paleta** tomada de la marca: pizarra del logo `#3F464E` (texto, botones, marca), marfil `#F7F4EF` y lino de sus piezas de Instagram, y **terracota** `#A65A3F` como único acento. Tokens en `src/app/globals.css`; el panel tiene modo oscuro.
- **Tipografía**: Inter variable (alojada en el proyecto), pesos 400–700, títulos con tracking ajustado. Rótulos en mayúsculas espaciadas como “DECORACIONES” del logo.
- **Logo**: el original vectorizado (`public/marca/`), en versión oscura, clara e isotipo (favicon).
- **Animaciones** con Motion: títulos que aparecen palabra por palabra, entradas al hacer scroll, contadores, parallax suave en la portada. Respetan `prefers-reduced-motion`.

## Sitio público

Inicio · 7 páginas de servicio (`/cortinas`, `/tapiceria`, `/dormitorio`, `/alfombras`, `/empapelados`, `/pisos`, `/diseno-de-interiores`) · Trabajos · Nosotros · Presupuesto (formulario en 3 pasos que guarda la consulta y arma el WhatsApp) · Contacto · Preguntas frecuentes · Legales.

SEO: metadata y canonical por página (editables en el panel), JSON-LD (`HomeAndConstructionBusiness`, `Person` con credencial, `Service`, `FAQPage`, `BreadcrumbList`), `sitemap.xml`, `robots.txt`, `llms.txt`, imagen Open Graph generada, redirecciones 301 automáticas al cambiar la URL de un servicio.

Las páginas son estáticas y se regeneran solas cada 10 minutos y al instante cuando se guarda algo en el panel.

## Panel (`/admin`)

| Sección | Para qué |
|---|---|
| Inicio | Consultas del mes, presupuestos, monto aceptado, conversión, gráfico de 6 meses, salud SEO y actividad |
| Consultas | Bandeja de pedidos del formulario + carga manual (WhatsApp, teléfono, local). Estados, notas, “Armar presupuesto” |
| Presupuestos | Editor con calculadoras (cortina de tela, roller/veneciana por m², empapelado por rollos, piso por cajas, ítem manual), descuento, IVA, seña. Link para que el cliente lo vea y **lo acepte online**, envío por WhatsApp, PDF (imprimir), duplicar |
| Clientes | Ficha con datos fiscales e historial |
| Lista de precios | Precios que usan las calculadoras; edición en línea y **ajuste masivo por %** |
| Portada / Servicios / Trabajos / Reseñas / Preguntas | Todo el contenido del sitio |
| Imágenes | Subida con arrastre: convierte a WebP, quita EXIF, texto alternativo |
| SEO | Puntaje por página, vista previa de Google y de WhatsApp, búsquedas objetivo, redirecciones, robots y llms.txt, verificación de Search Console |
| Configuración | Datos del negocio (NAP), horarios, zonas, botón de WhatsApp, valores por defecto de presupuestos, contraseña |
| Usuarios | Roles (administración, ventas, contenido) y registro de actividad |

Seguridad: contraseñas con scrypt, sesiones en base con cookie `httpOnly`, límite de intentos de ingreso, permisos por rol verificados en el servidor en cada acción, honeypot y límite de envíos en el formulario público, `noindex` en el panel y en los presupuestos.

## Dónde está cada cosa

```
src/
  app/(sitio)/        páginas públicas
  app/admin/          panel (ingresar + (panel)/…)
  app/p/[token]/      presupuesto que ve el cliente
  app/media/          sirve las imágenes subidas
  components/sitio/   navbar, footer, secciones, formulario
  components/admin/   vistas y editores del panel
  components/ui/      shadcn/ui
  lib/db/             esquema Drizzle, cliente y contenido inicial
  lib/acciones/       server actions (validadas con Zod y con permisos)
  lib/presupuestos/   motor de cálculo (puro, con tests)
  lib/ajustes/        ajustes editables (negocio, SEO, WhatsApp…)
drizzle/              migraciones SQL
scripts/              db-setup y db-demo
_legacy/              versión anterior del sitio (se puede borrar)
```

## Deploy

- **VPS / cPanel / Docker**: `npm run build` y `node .next/standalone/server.js` (copiar `public/` y `.next/static/` junto al standalone). La base (`data/casa-esusy.db`) y `data/uploads/` tienen que estar en un volumen persistente.
- **Vercel**: usar Turso (`DATABASE_URL=libsql://…`) y un almacenamiento externo para las imágenes subidas (el disco de Vercel es efímero).

## Pendiente con el negocio

- Fotos propias en alta resolución (las de ambientes son de Unsplash, licencia libre; las de trabajos vienen del Instagram en 640 px).
- Precios reales en la lista de precios (los actuales son de ejemplo).
- Email con dominio propio, medios de pago y política de garantía (preguntas marcadas `[COMPLETAR]`), razón social y CUIT en Privacidad.
- Más reseñas reales de Google (hoy hay 3 extractos).
