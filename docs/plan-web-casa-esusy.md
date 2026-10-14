# Plan Maestro — Sitio Web Casa Esusy · Decoración Integral desde 1967

> Documento de planificación integral para el desarrollo del sitio web y panel de administración de **Casa Esusy** (Banfield, zona sur del GBA): **cortinas a medida, sillones y tapizados, acolchados, almohadones, alfombras, empapelados, pisos y diseño de interiores** (dueña con certificación profesional).
>
> **Versión 2** — actualizada con el relevamiento de Instagram, Facebook y Google Maps (ver sección 0).
>
> **Stack:** Next.js (App Router) · TypeScript · Motion (ex Framer Motion) · Supabase (PostgreSQL) en Vercel → migración futura a VPS DonWeb con PostgreSQL.
> **Guía de diseño:** Apple Human Interface Guidelines (HIG), adaptada a web.

---

## Índice

0. [Relevamiento del negocio (redes y Google)](#0-relevamiento-del-negocio-redes-y-google)
1. [Visión, objetivos y KPIs](#1-visión-objetivos-y-kpis)
2. [Stack técnico y principio de portabilidad](#2-stack-técnico-y-principio-de-portabilidad)
3. [Sistema de diseño basado en Apple HIG](#3-sistema-de-diseño-basado-en-apple-hig)
4. [Animaciones con Motion](#4-animaciones-con-motion)
5. [Mapa del sitio y estructura de URLs](#5-mapa-del-sitio-y-estructura-de-urls)
6. [Páginas públicas en detalle](#6-páginas-públicas-en-detalle)
7. [Catálogo](#7-catálogo)
8. [Cotizador público (lead) y cotizador interno](#8-cotizador-público-lead-y-cotizador-interno)
9. [Panel de administrador](#9-panel-de-administrador)
10. [Modelo de datos](#10-modelo-de-datos)
11. [Facturación electrónica (ARCA, ex AFIP)](#11-facturación-electrónica-arca-ex-afip)
12. [Reseñas de Google](#12-reseñas-de-google) · [12b. Integración con Instagram](#12b-integración-con-instagram)
13. [SEO técnico](#13-seo-técnico)
14. [SEO local y GEO](#14-seo-local-y-geo)
15. [Indexación](#15-indexación)
16. [Responsive y mobile-first](#16-responsive-y-mobile-first)
17. [Performance y Core Web Vitals](#17-performance-y-core-web-vitals)
18. [Accesibilidad](#18-accesibilidad)
19. [Seguridad](#19-seguridad)
20. [Legales (Argentina)](#20-legales-argentina)
21. [Analítica y medición](#21-analítica-y-medición)
22. [Migración Vercel + Supabase → VPS DonWeb](#22-migración-vercel--supabase--vps-donweb)
23. [Estructura de carpetas del proyecto](#23-estructura-de-carpetas-del-proyecto)
24. [Roadmap por fases](#24-roadmap-por-fases)
25. [Contenido que debe preparar el negocio](#25-contenido-que-debe-preparar-el-negocio)
26. [Checklist de lanzamiento](#26-checklist-de-lanzamiento)
27. [Prompt maestro para el agente de desarrollo](#27-prompt-maestro-para-el-agente-de-desarrollo)
28. [Decisiones pendientes](#28-decisiones-pendientes)

---

## 0. Relevamiento del negocio (redes y Google)

Relevado el 13/10/2026 en Instagram (@casa_esusy), Facebook (/Casaesusy) y la ficha de Google Maps.

### Datos del negocio
| Dato | Valor encontrado | Fuente |
|---|---|---|
| Nombre comercial | **Casa Esusy** · "Decoración Integral" / "Cortinas y Decoración" | Instagram, Google |
| Trayectoria | **Desde 1967** (más de 58 años) | Bio y posteos de Instagram |
| Dirección | **Manuel Acevedo 1290, B1828 Banfield, Lomas de Zamora, Prov. de Buenos Aires** | Google Maps, Facebook, Instagram |
| Coordenadas | -34.7453042, -58.3980594 (Plus Code 7J32+VQ) | Google Maps |
| Teléfono / WhatsApp | **+54 9 11 5598-4126** (en Google figura como 011 5598-4126) | Usuario, Google Maps |
| Horarios | **Lunes a viernes 9–13 h · Sábados 10–14 h** | Bio de Instagram |
| Propuesta destacada | **Presupuesto sin cargo** · asesoramiento por DM/WhatsApp · "más de 100 opciones" | Instagram |
| Google | **4,5 ★ con 26 opiniones** · categoría "Tienda de cortinas" · accesible en silla de ruedas · se identifica como empresa liderada por una mujer · **sin sitio web cargado** | Google Maps |
| Instagram | ~1.590 seguidores · ~2.400 publicaciones · activo (varias publicaciones por semana) | Instagram |
| Facebook | ~360 seguidores · poca actividad · 1 opinión | Facebook |

### Productos y servicios que aparecen en las redes (más amplio que el plan v1)
- **Cortinas**: de tela a medida, gasas/voile, **black out textil**, **roller**, **venecianas** (madera, PVC y aluminio; p. ej. listones de 50 mm), **rieles** y accesorios.
- **Sillones y tapizados** a medida.
- **Acolchados y cubrecamas a medida** (king, queen, twin; colores como blanco, gris, beige, ivory), ropa de "dormitorio".
- **Almohadones**.
- **Alfombras**.
- **Empapelados** (incluye líneas infantiles/kids).
- **Pisos flotantes** (venta y colocación).
- **Telas por metro**: tapicería, manteles (cuadrillé/vichy), **telas Aqua Block impermeables para exterior**.
- **Ambientes completos / diseño de interiores**.
- **Colocación** propia (las reseñas mencionan al colocador y la prolijidad de la instalación).

### Historias destacadas de Instagram (sirven como mapa de contenidos)
Black out textil · Eventos fábrica · Nuestro local · Empapelados · Pisos · Dormitorio · Alfombras · Cortinas · Nosotros · Acolchados. → Cada una se convierte en una sección o landing del sitio (ver sección 5).

### Identidad visual detectada
- Logo con monograma geométrico gris y la leyenda "Casa Esusy · Decoraciones".
- Piezas recientes con estética editorial: **fondo crema/marfil, tipografía serif clásica y un acento terracota/rosado**, texto "Banfield · desde 1967 · Decoración Integral". → Esta paleta encaja perfecto con el enfoque Apple HIG (neutros cálidos + un único acento). Usarla como base del design system (sección 3).
- Fotografía real de ambientes terminados: cortinas de gasa, venecianas oscuras, sillones con almohadones, empapelados infantiles, el frente del local.

### Hallazgos del perfil completo de Instagram (relevado con sesión iniciada)
**Historia y equipo**
- **Tres generaciones desde 1967** (posteo: "57 años eligiendo telas"; "hay cosas que se heredan: el oficio, la dedicación").
- **Dueña: Andrea Esusy** (@andrea_esusy), con **Certificado en Diseño y Decoración de Interiores de DECOmobi** (sede Lomas de Zamora; egreso 2025, acto en la Sociedad Italiana de Lomas de Zamora). Aparece mencionada en la **revista DECOmobi, edición especial 2026** entre los diseñadores destacados. → Usar en `/nosotros`, `/diseno-de-interiores` y en el schema `Person` con `hasCredential`. *Confirmar con ella cómo quiere figurar.*
- Visitas a **ferias del sector** (historia "Nosotros") → contenido para Novedades.
- Colocador propio (las reseñas nombran a Víctor).
- **Proyectos comerciales**: p. ej. un proyecto para un concesionario Hyundai (alfombra bouclé gris), cliente que repitió. → Abrir la categoría **"Proyectos comerciales / empresas"** en el portfolio.
- Sorteos (Navidad) y "Eventos fábrica" → sección de **novedades y promociones**.

**Productos y servicios adicionales detectados**
- Cortinas: **romanas**, **bandas verticales**, **paneles orientales**, roller **sunscreen 3%**, combinaciones **roller black out + gasa con rieles**, **riel curvable**, **barrales**, venecianas de madera, PVC y aluminio, gasas de lino y bambú, **cortinas de baño de diseño**.
- **Respaldos/respaldares de cama a medida** (muy presentes), pie de cama y butacas.
- **Fundas de sillón** a medida, sillones en pana, chenille, velvet; almohadones y **placas de goma espuma enfundadas** (antimanchas).
- **Sábanas a medida**, frazadas.
- **Carpetas de alfombra personalizadas** (diseño, tamaño, forma, guardas y colores a elección), alfombras de yute (120×170, 160×280, 190×280).
- **Pisos SPC vinílicos 100% impermeables** (alto tránsito, colocación click), pisos flotantes, **zócalos y cubrezócalos**.
- **Paneles WPC** (exterior co-extruido, resistente al sol) y **césped sintético** para balcones y terrazas.
- **Empapelados importados y nacionales** (catálogos en el local), vinílicos, infantiles.
- **Telas outdoor** (Aqua Block), **pantallas de lámparas**.
- Marcas/proveedores que mencionan: **Flexcolor** (venecianas, bandas verticales), **El Espartano** (alfombras). → Página "Marcas con las que trabajamos" (buena señal de confianza y SEO).

**Contenido editorial que ya producen (base para Novedades/GEO)**
- "5 reglas para elegir el tamaño de la alfombra", "Las cortinas black out también aíslan frío y calor", "Blackout + visillo: tres momentos, una ventana", antes/después de livings y dormitorios, proyectos en Lomas de Zamora y Las Lomitas.
- Muchos posteos solo tienen hashtags: la web debe darles **texto real** para que Google y los asistentes de IA los entiendan.

**Contacto visto en historias**: aparecen el 11 5598-4126 y también el 6088-9505 → confirmar si siguen los dos.

### Lo que dicen las reseñas de Google (insumos para el sitio)
- **Puntos fuertes repetidos**: excelente atención, calidad de productos, precios acordes, papeles y alfombras de calidad, colocación impecable.
- **Punto débil**: una reseña negativa sobre **cortinas que encogieron** y la respuesta posventa. → Agregar en el sitio: guía de **cuidado y lavado de telas**, FAQ sobre encogimiento (y recomendación de limpieza en seco o lavado en frío según tela), y una **política de garantía** clara. Responder públicamente esa reseña desde Google Business Profile.

### Problemas encontrados que el proyecto debe corregir
| Problema | Impacto | Acción |
|---|---|---|
| Google Business Profile **sin sitio web** | Se pierde tráfico y autoridad local | Cargar el dominio nuevo apenas se lance |
| Facebook enlaza a **casaesusydecoraciones.simdif.com**, que ya **no está publicado** | Link roto, mala señal de confianza | Reemplazar por el dominio nuevo |
| Facebook muestra el teléfono **011 6088-9505**, distinto al de Google/WhatsApp | **NAP inconsistente** (penaliza el SEO local) | Unificar en +54 9 11 5598-4126 en todos lados |
| El nombre de la página de Facebook incluye el número ("CASA ESUSY decoraciones.#1555984126") | Poco profesional, inconsistente con Google/Instagram | Renombrar a "Casa Esusy · Decoración Integral" (o el nombre que se elija) |
| Email de contacto en Yahoo | Menos profesional | Crear email con dominio propio (p. ej. hola@[dominio]) |
| Categoría de Google solo "Tienda de cortinas" | No aparece en búsquedas de empapelados, pisos, alfombras, tapicería | Agregar categorías secundarias (sección 14) |
| Pocos textos en los posteos (muchos solo hashtags) | Poco contenido indexable | El sitio y las "Novedades" cubren esa carencia con texto propio |

---

## 1. Visión, objetivos y KPIs

### Visión
Un sitio que transmita **calma, calidad artesanal, criterio profesional y casi 60 años de oficio familiar en Banfield**. "Desde 1967" es el principal diferencial frente a la competencia y debe estar presente en el hero, en Nosotros y en los datos estructurados. La web debe sentirse como entrar al showroom: mucho aire, fotografía protagonista, texto breve y claro, y un camino obvio hacia "pedir presupuesto".

### Objetivos de negocio
| Objetivo | Cómo lo resuelve la web |
|---|---|
| Generar consultas de cortinas y tapicería a medida | Cotizador orientativo + formulario de presupuesto + WhatsApp |
| Vender almohadones | Catálogo con stock, carrito y (fase 2) pago online |
| Posicionar el servicio de diseño de interiores | Página dedicada, portfolio de proyectos, credenciales de la dueña |
| Aparecer en Google y en respuestas de IA | SEO técnico + SEO local + GEO |
| Ordenar la operación interna | Panel admin: clientes, presupuestos, facturas, catálogo, contenido |

### KPIs (medir desde el día 1)
- Consultas/presupuestos recibidos por mes (por canal: formulario, cotizador, WhatsApp).
- Tasa de conversión presupuesto → venta (desde el panel).
- Clics en "Cómo llegar" y "Llamar" (Google Business Profile).
- Posiciones para keywords locales ("cortinas a medida en [zona]", etc.).
- Core Web Vitals en verde (LCP < 2,5 s, INP < 200 ms, CLS < 0,1).

---

## 2. Stack técnico y principio de portabilidad

### Regla de oro
**Supabase se usa como "PostgreSQL administrado", no como plataforma.** Todo lo que dependa de Supabase debe estar detrás de una interfaz propia para que la migración a la VPS sea cambiar variables de entorno y adaptadores, no reescribir la app.

### Stack recomendado

| Capa | Elección | Por qué |
|---|---|---|
| Framework | **Next.js (última versión estable), App Router, TypeScript estricto** | SSR/SSG/ISR, SEO nativo, Server Actions |
| UI | **Tailwind CSS** + componentes propios (opcional base shadcn/ui para el admin) | Control total del diseño HIG |
| Animaciones | **Motion** (paquete `motion`, import `motion/react`) — es el nuevo nombre de Framer Motion | Requisito del proyecto |
| Base de datos | **PostgreSQL** (Supabase ahora, Postgres en VPS después) | Mismo motor = migración simple |
| ORM | **Drizzle ORM** (alternativa: Prisma) | Tipado, migraciones versionadas en el repo, sin lock-in |
| Autenticación | **Better Auth** o **Auth.js** con tablas en nuestra propia DB | Evita depender de Supabase Auth al migrar |
| Archivos/imágenes | Interfaz `StorageAdapter` → Supabase Storage hoy; en VPS: almacenamiento S3-compatible (MinIO en la VPS o Cloudflare R2) | Cambiar solo el adaptador |
| Validación | **Zod** (compartido entre formularios y servidor) | Una sola fuente de verdad |
| Formularios | React Hook Form + Zod | |
| Editor de contenido | **Tiptap** (noticias, páginas) | Guarda JSON estructurado, fácil de renderizar |
| PDF (presupuestos/facturas) | `@react-pdf/renderer` | PDFs con diseño, generados en servidor |
| Emails | React Email + Resend (Vercel) → SMTP propio en VPS | Interfaz `MailAdapter` |
| Tareas programadas | Vercel Cron → cron del sistema / systemd timers en VPS | Sincronizar reseñas, sitemap, backups |
| Testing | Vitest (unit), Playwright (e2e) | |
| Calidad | ESLint, Prettier, Husky + lint-staged, CI en GitHub Actions | |

### Qué NO hacer (para no atarse a Supabase)
- No usar Supabase Auth, Edge Functions ni Realtime para funciones críticas.
- No poner lógica de negocio en RLS/funciones SQL específicas de Supabase; la autorización vive en la capa de servidor de Next.js (igual se activa RLS como defensa extra, denegando todo acceso desde el cliente anónimo).
- No llamar a la DB desde el navegador. Todo pasa por Server Components / Server Actions / Route Handlers.

---

## 3. Sistema de diseño basado en Apple HIG

Apple HIG está pensado para apps nativas; se adaptan sus **principios** a la web:

### Principios
1. **Claridad** — el texto se lee sin esfuerzo, los íconos son obvios, cada elemento tiene un propósito.
2. **Deferencia** — la interfaz se corre del camino: el contenido (fotos de cortinas, telas, ambientes) es el protagonista.
3. **Profundidad** — jerarquía visual y transiciones que explican dónde está el usuario y de dónde vino.
4. **Consistencia** — los mismos patrones en todo el sitio y en el admin.

### Tipografía
- Pila de fuentes del sistema: `-apple-system, BlinkMacSystemFont, "SF Pro Text", "Inter", "Segoe UI", Roboto, sans-serif`. Usar **Inter** vía `next/font` como respaldo consistente en Android/Windows (SF Pro no se puede servir como web font).
- Opcional: una serif elegante solo para titulares grandes (p. ej. *Fraunces* o *Cormorant*) para dar calidez "deco". Máximo 2 familias.
- Escala tipográfica inspirada en HIG (en `rem`, respeta el zoom del usuario):

| Token | Tamaño | Uso |
|---|---|---|
| `largeTitle` | 2.125rem (34px) → 3.5rem en desktop | Hero |
| `title1` | 1.75rem (28px) | Títulos de página |
| `title2` | 1.375rem (22px) | Secciones |
| `title3` | 1.25rem (20px) | Tarjetas |
| `headline` | 1.0625rem (17px) semibold | Destacados |
| `body` | 1.0625rem (17px) | Texto principal |
| `callout` | 1rem (16px) | Notas |
| `subheadline` | 0.9375rem (15px) | Metadatos |
| `footnote` | 0.8125rem (13px) | Legales |
| `caption` | 0.75rem (12px) | Pies de foto |

- Interlineado del cuerpo 1,5; ancho de línea de 60–75 caracteres.

### Espaciado y layout
- Grilla base de **8 pt** (4 pt para ajustes finos). Tokens: 4, 8, 12, 16, 24, 32, 48, 64, 96, 128.
- Márgenes laterales: 16px mobile, 24px tablet, contenedor máx. 1200–1280px en desktop.
- **Objetivos táctiles mínimos de 44×44 px** (regla HIG).
- Bordes redondeados suaves y consistentes: 12px tarjetas, 20px modales, píldora para botones.

### Color
- Paleta neutra cálida (marfil, arena, lino, grafito) + **un solo color de acento** de la marca para acciones (botón primario, links).
- **Partir de la identidad que Casa Esusy ya usa en Instagram**: fondo crema/marfil, texto marrón oscuro, acento **terracota/rosado**, gris del monograma del logo. Valores de referencia a ajustar con el logo original: `--color-bg #F7F3EE`, `--color-label #3A2E28`, `--color-accent #B9785F` (verificar contraste AA sobre crema; si no llega, oscurecer a ~#9C5F48 para texto/botones), `--color-brand-gray #8A8A8A`.
- Tipografía de titulares: una **serif clásica** (como en sus piezas de Instagram) + sans de sistema para el cuerpo. Mantener el sello "desde 1967".
- El **verde de WhatsApp** (#25D366) es la única excepción a la regla del acento único, y solo en el botón flotante.
- Colores semánticos como tokens CSS (`--color-bg`, `--color-label`, `--color-secondary-label`, `--color-separator`, `--color-accent`, `--color-success`…), nombrados al estilo HIG.
- Contraste mínimo WCAG AA (4.5:1 texto, 3:1 elementos grandes).
- Modo oscuro: opcional en el sitio público (una casa de deco suele lucir mejor en claro), **sí** en el panel admin.

### Componentes (estilo HIG)
- Barra de navegación translúcida con desenfoque (`backdrop-filter: blur`) que se compacta al hacer scroll.
- En mobile: menú en hoja (sheet) que sube desde abajo.
- **Botón flotante de WhatsApp** abajo a la derecha en todo el sitio público (especificación completa abajo).
- Botones: primario (relleno acento), secundario (tinte suave), terciario (solo texto).
- Hojas modales (sheets) para filtros del catálogo en mobile.
- Controles segmentados (segmented control) para alternar vistas/categorías.
- Listas agrupadas (inset grouped) en formularios y en el admin.
- Estados vacíos, de carga (skeletons) y de error diseñados para cada pantalla.

### Iconografía
- Íconos de línea consistentes (Lucide o similar con trazo uniforme). SF Symbols no está licenciado para web.
- Logo oficial de WhatsApp solo en el botón flotante y en los CTA de WhatsApp (respetando las pautas de marca de WhatsApp).

### Botón flotante de WhatsApp (especificación)
| Aspecto | Definición |
|---|---|
| Número | **+54 9 11 5598-4126** → link `https://wa.me/5491155984126` (formato internacional sin `+`, espacios ni guiones) |
| Posición | Fijo **abajo a la derecha**: `right: max(16px, env(safe-area-inset-right))`, `bottom: max(16px, env(safe-area-inset-bottom))`; en desktop 24px |
| Tamaño | 56×56 px (supera el mínimo HIG de 44×44), círculo, sombra suave, ícono blanco sobre #25D366 |
| Mensaje prellenado | Contextual según la página, vía `?text=` codificado: inicio → "Hola Casa Esusy, quiero hacer una consulta"; ficha de producto → "Hola, me interesa [producto] ([URL])"; cortinas → "Hola, quiero presupuesto de cortinas a medida"; etc. Configurable desde el admin |
| Etiqueta | En desktop, al pasar el mouse se despliega una píldora "¿Te asesoramos?"; en mobile solo el ícono |
| Horario | Fuera del horario de atención (L–V 9–13, S 10–14) muestra un aviso sutil "Te respondemos al abrir" (los horarios se leen de la configuración) |
| Animación | Entrada con spring (escala 0.8→1 + fade) 1–2 s después de cargar; sin rebotes repetitivos; respeta `prefers-reduced-motion` |
| Convivencia | Se oculta/eleva cuando hay un sheet abierto, el banner de cookies o la barra de "agregar al carrito" en mobile para no tapar CTAs |
| Accesibilidad | `<a>` real con `aria-label="Escribinos por WhatsApp"`, foco visible, `rel="noopener"`, `target="_blank"` |
| Medición | Evento `click_whatsapp` con la página de origen (y UTM) para saber qué secciones generan consultas |
| Exclusiones | No se muestra en `/admin`, `/checkout` ni en la vista de presupuesto `/p/[token]` (allí hay un botón propio) |
| Admin | Número, mensajes por sección, activar/desactivar y horario editables en Configuración |
| Rendimiento | Componente cliente mínimo, ícono SVG inline, sin scripts de terceros ni widgets externos |

---

## 4. Animaciones con Motion

### Reglas
- Las animaciones **explican**, no decoran: transiciones de navegación, aparición de contenido, feedback de interacción.
- Duraciones cortas: 150–250 ms para micro-interacciones, 300–500 ms para transiciones de sección.
- Preferir **springs** suaves (sensación nativa de Apple): `type: "spring", stiffness ~300, damping ~30`.
- Animar solo `transform` y `opacity` (nunca `width/height/top/left`) para no romper performance.
- **Respetar `prefers-reduced-motion`** con `useReducedMotion()` / `MotionConfig reducedMotion="user"`.
- Usar `LazyMotion` + `domAnimation` y el componente `m` para reducir el bundle.
- Los componentes animados son Client Components chicos; el resto de la página sigue siendo Server Component.

### Catálogo de animaciones
| Lugar | Animación |
|---|---|
| Hero | Fade + leve escala de la imagen (Ken Burns muy sutil) y texto entrando escalonado |
| Secciones al hacer scroll | `whileInView` con fade-up de 16–24px, `once: true` |
| Tarjetas de producto | Elevación sutil en hover (desktop), escala 0.98 al tocar (mobile) |
| Producto → detalle | `layoutId` compartido en la imagen (transición tipo "zoom" de iOS) |
| Galerías | Arrastre con inercia (`drag`), lightbox con gesto para cerrar |
| Antes/después (proyectos) | Slider comparativo arrastrable |
| Filtros | `AnimatePresence` + `layout` para reordenar la grilla sin saltos |
| Navbar | Compactación al hacer scroll |
| Formularios | Feedback de éxito con check animado; errores con leve "shake" |
| Reseñas | Carrusel con arrastre |

---

## 5. Mapa del sitio y estructura de URLs

### Convenciones de URL
- Todo en **español**, minúsculas, con guiones, sin acentos ni "ñ" (`diseno-de-interiores`).
- Sin IDs en la URL, solo slugs legibles. Sin barra final (configurar `trailingSlash: false` y redirigir).
- Slugs editables desde el admin; **al cambiar un slug se crea automáticamente una redirección 301** desde el anterior.
- Profundidad máxima de 3 niveles.

### Mapa
```
/                                       Inicio
/cortinas                               Servicio: cortinas a medida (landing)
/cortinas/[tipo]                        de-tela, gasas-y-voile, black-out-textil, roller, venecianas, romanas,
                                        bandas-verticales, paneles-orientales, cortinas-de-bano, rieles-y-barrales
/tapiceria                              Servicio: sillones y tapizados (landing)
/tapiceria/[tipo]                       sillones-a-medida, retapizado, fundas-de-sillon, respaldos-de-cama, sillas
/dormitorio                             Acolchados, cubrecamas a medida, almohadones (landing)
/dormitorio/[tipo]                      acolchados, cubrecamas-a-medida, almohadones
/empapelados                            Empapelados (landing + catálogo por línea: kids, texturas, etc.)
/pisos                                  Pisos SPC vinílicos y flotantes, zócalos (landing: tipos, colocación click)
/exterior                               Telas outdoor, paneles WPC, césped sintético (balcones y terrazas)
/marcas                                 Marcas con las que trabajamos (Flexcolor, El Espartano, etc.)
/alfombras                              Alfombras (catálogo)
/telas                                  Telas por metro: tapicería, cortinas, manteles, exterior Aqua Block
/producto/[slug]                        Ficha de producto (única URL canónica por producto)
/diseno-de-interiores                   Servicio de diseño (landing)
/proyectos                              Portfolio
/proyectos/[slug]                       Caso de proyecto (antes/después, materiales usados)
/nosotros                               Quiénes somos + credenciales
/resenas                                Reseñas de Google
/novedades                              Noticias / blog
/novedades/[slug]                       Artículo
/presupuesto                            Solicitar presupuesto / cotizador orientativo
/contacto                               Contacto, mapa, horarios
/preguntas-frecuentes                   FAQ
/cuidado-de-telas                       Guía de lavado y cuidado (responde a la queja de encogimiento)
/zonas/[zona]                           (opcional, fase 3) Landings locales reales: Banfield, Lomas de Zamora, Temperley, Adrogué, Lanús...
/carrito, /checkout                     (fase 2) compra de almohadones
/mi-cuenta                              (fase 2) cuenta de cliente: pedidos, presupuestos
/legales/privacidad
/legales/terminos
/legales/cambios-y-devoluciones
/legales/cookies
/admin/...                              Panel (noindex, protegido)
/sitemap.xml, /robots.txt, /llms.txt
```

### Correspondencia con las historias destacadas de Instagram
| Historia destacada | Sección del sitio |
|---|---|
| Cortinas · Black out textil | `/cortinas` y `/cortinas/black-out-textil` |
| Dormitorio · Acolchados | `/dormitorio` |
| Empapelados | `/empapelados` |
| Pisos | `/pisos` |
| Alfombras | `/alfombras` |
| Nuestro local · Nosotros | `/nosotros` (y foto del frente en `/contacto`) |
| Eventos fábrica | `/novedades` (categoría "Eventos y ofertas") |

---

## 6. Páginas públicas en detalle

### Inicio
1. **Hero**: foto o video corto de un ambiente terminado; titular claro ("Decoración integral en Banfield desde 1967 · Cortinas a medida, sillones y ambientes completos"); sello **"Presupuesto sin cargo"**; CTA primario "Pedir presupuesto", secundario "Escribinos por WhatsApp".
2. **Servicios/categorías** (grilla de tarjetas grandes): Cortinas · Sillones y tapizados · Dormitorio (acolchados y almohadones) · Empapelados · Pisos · Alfombras · Telas · Diseño de interiores.
2b. **Franja de confianza**: "Desde 1967" · "4,5 ★ en Google" (dato sincronizado) · "Presupuesto sin cargo" · "Colocación propia".
3. **Cómo trabajamos** (proceso en 4 pasos): consulta → medición a domicilio → presupuesto → confección e instalación.
4. **Proyectos destacados** (3–6 con antes/después).
5. **Reseñas de Google** (puntaje + 3–6 reseñas + link a ver todas / dejar reseña).
6. **Almohadones destacados** (carrusel).
7. **Sobre la dueña** (foto, certificación, frase breve) → link a /nosotros.
8. **Novedades** (últimas 3).
9. **Últimos posteos de Instagram** (6 fotos que enlazan al perfil; ver sección 12b).
10. **Visitanos**: dirección, horarios, mapa diferido, foto del frente del local + zona de cobertura + CTA final.

### Landings de servicio (cortinas, tapicería, diseño)
Cada una debe responder, en este orden: qué es · para quién · tipos/opciones · materiales · proceso y plazos · rango de precios orientativo ("desde…") si el negocio lo acepta · galería · FAQ específica · CTA a presupuesto. Las subpáginas por tipo (p. ej. `/cortinas/blackout`) tienen **contenido propio** (no duplicado), ideal para posicionar búsquedas específicas.

### Diseño de interiores
- Credenciales visibles: **Andrea Esusy — Certificado en Diseño y Decoración de Interiores, DECOmobi (Lomas de Zamora), 2025**; mención en la revista DECOmobi 2026; foto del acto de egreso. (Confirmar datos exactos.)
- Modalidades y paquetes: asesoría por hora, proyecto de ambiente, proyecto integral, asesoría online.
- Entregables (moodboard, plano, render, lista de compras, dirección de obra).
- Portfolio filtrado a proyectos de diseño.

### Quiénes somos
Historia **desde 1967** (línea de tiempo animada con hitos: fundación, generaciones, el local de Manuel Acevedo, la renovación del frente, la certificación en diseño), valores, el taller y la colocación propia, equipo, credenciales de la dueña, empresa liderada por una mujer, zona de atención, datos de contacto (mismo NAP que Google). Muy importante para E-E-A-T y GEO.

### Landings nuevas (surgen del relevamiento)
- **Empapelados**: líneas (infantiles, texturas, vinílicos), cómo se mide (rollos por pared), colocación, galería.
- **Pisos flotantes**: tipos, cálculo de m², colocación, mantenimiento.
- **Alfombras**: catálogo por medida y material.
- **Dormitorio**: acolchados (king/queen/twin, colores), cubrecamas a medida, almohadones.
- **Telas por metro**: tapicería, cortinas, manteles, **Aqua Block impermeable para exterior** (ideal para galerías y reposeras).
- **Cuidado de telas**: lavado, encogimiento, limpieza en seco, cuidado de venecianas y roller.

### Proyectos (portfolio)
Filtros: Hogar · **Comercial/empresas** (p. ej. concesionarias, oficinas) · por servicio. Por proyecto: título, ubicación (barrio), tipo de servicio, desafío, solución, materiales/telas usados (enlazados al catálogo), galería, slider antes/después, reseña del cliente si autoriza.

### Novedades
Noticias del negocio + artículos útiles ("Cómo medir tu ventana para cortinas", "Blackout vs. roller sunscreen", "Cómo elegir tela para un sillón con mascotas"). Son la principal fuente de tráfico orgánico y de citas en IA.

### Presupuesto
Formulario por pasos (estilo iOS): servicio → detalles → medidas/fotos (subida de imágenes) → datos de contacto → confirmación. Incluye el **cotizador orientativo** (sección 8).

### Contacto
Mapa embebido (carga diferida), dirección (Manuel Acevedo 1290, Banfield), horarios (L–V 9–13 · S 10–14, con indicador "Abierto ahora/Cerrado"), teléfono (`tel:+5491155984126`), WhatsApp (`wa.me/5491155984126`), email, Instagram, Facebook, formulario breve, botón "Cómo llegar" (link a la ficha de Google Maps), foto del frente del local, accesible para silla de ruedas.

### FAQ
Agrupada por servicio. Preguntas reales (plazos, medición, garantía, formas de pago, envíos, zonas). Alimenta el SEO y el GEO.

---

## 7. Catálogo

Hay dos tipos de ítems con lógica distinta:

| Tipo | Ejemplos | Comportamiento |
|---|---|---|
| **Producto de stock** | Almohadones, acolchados (king/queen/twin), alfombras, accesorios | Precio fijo, variantes (tamaño/color/tela), stock, agregar al carrito |
| **Producto/servicio a medida** | Cortinas (tela, black out, roller, venecianas), sillones, cubrecamas a medida, colocación de empapelados y pisos | Precio "desde" u oculto, configurador, termina en presupuesto |
| **Material / venta por unidad de medida** | Telas por metro (incl. Aqua Block exterior), rollos de empapelado, cajas de piso (m²), rieles | Precio por metro/rollo/m²; se usan en el cotizador y se muestran como muestrario |

### Funcionalidades
- Categorías y subcategorías jerárquicas, colecciones (p. ej. "Otoño 2026"), etiquetas.
- Filtros: categoría, color, material, tamaño, rango de precio, uso (interior/exterior), disponibilidad. En mobile se abren en una hoja modal.
- Ordenar: destacados, más nuevos, precio.
- Búsqueda con texto completo (Postgres full-text search con configuración `spanish` + `unaccent`).
- Ficha: galería con zoom, variantes con foto propia, precio, stock, descripción, cuidados y lavado, medidas, composición, productos relacionados, "pedir por WhatsApp" con mensaje prellenado, compartir.
- Fase 1: "carrito de consulta" (lista que se envía por WhatsApp/formulario). Fase 2: checkout con **Mercado Pago** + envíos.
- URL canónica única por producto (`/producto/[slug]`) aunque aparezca en varias categorías.

---

## 8. Cotizador público (lead) y cotizador interno

### Cotizador público (orientativo)
- El cliente elige tipo de cortina, sistema, tela (rango de calidad), ancho y alto, cantidad de paños, si quiere instalación.
- Muestra un **rango estimado** ("entre $X y $Y") con la aclaración de que el precio final se confirma tras la medición.
- Al pedir el presupuesto formal, se crea un **lead** en el panel con todos los datos ya cargados.
- Las fórmulas y precios se leen de la base (se editan en el admin), nunca están fijos en el código.

### Cotizador interno (en el admin) — motor de presupuestos
Calcula de forma exacta con reglas configurables por tipo de producto:

**Ejemplo cortina tradicional:**
```
metros_tela   = (ancho_ventana × factor_fruncido + dobladillos_laterales) × cantidad_paños
                → ajustado por ancho de rollo y repetición del estampado (rapport)
alto_corte    = alto + dobladillo_superior + dobladillo_inferior
costo_tela    = metros_tela × precio_metro_tela
confección    = metros_lineales × precio_confección (según tipo de cabezal: pinza, ollaos, presillas…)
sistema       = metros de riel/barral × precio + soportes + terminales
instalación   = tarifa fija o por ventana (+ adicional por altura/zona)
subtotal      = suma de ítems
margen        = % configurable por categoría
descuento     = % o monto
IVA           = según condición fiscal del negocio y del cliente
total
```

**Ejemplo sillón/retapizado:** metros de tela según modelo (tabla de consumo por modelo y cantidad de cuerpos) + espuma (densidad) + mano de obra + estructura + flete.

**Ejemplo veneciana / roller:** m² = ancho × alto (con mínimo facturable por unidad) × precio del m² según línea (madera, PVC, aluminio; ancho de listón 25/50 mm) + mecanismo + colocación.

**Ejemplo empapelado:** rollos = ⌈ perímetro de paredes ÷ ancho del rollo ⌉ por paños según alto + repetición del dibujo + % de desperdicio → rollos × precio + colocación por m² o por rollo.

**Ejemplo piso flotante:** m² del ambiente × (1 + desperdicio 5–10%) → cajas = ⌈ m² ÷ m² por caja ⌉ + bajo piso + zócalos (metros lineales) + colocación por m².

**Ejemplo cubrecama/acolchado a medida:** medidas del colchón + caída lateral → metros de tela + relleno + confección.

### Funcionalidades del cotizador interno
- Presupuesto con múltiples ambientes y múltiples ítems por ambiente.
- Ítems calculados (por fórmula) y manuales (texto libre + precio).
- Plantillas de presupuesto reutilizables.
- Lista de precios con **historial** y actualización masiva por % (clave con inflación).
- Opción de cotizar en ARS y mostrar equivalencia en USD (cotización del día configurable).
- Validez del presupuesto (p. ej. 7 o 15 días) y condiciones de pago (seña %, saldo contra entrega).
- Estados: borrador → enviado → visto → aceptado / rechazado / vencido.
- PDF con la marca, enviable por email y por WhatsApp (link público con token, sin login).
- El cliente puede **aceptar online** desde el link.
- **Conversión con un clic: presupuesto aceptado → orden de trabajo → factura.**
- Numeración correlativa (`P-2026-0001`), duplicar presupuesto, versiones (v1, v2…).

---

## 9. Panel de administrador

Ruta `/admin`, protegido, `noindex`, diseño tipo app de macOS/iPadOS: barra lateral, listas, paneles de detalle, búsqueda global (⌘K / Ctrl+K), modo oscuro.

### Módulos

**1. Dashboard**
Presupuestos del mes (enviados/aceptados/monto), leads nuevos, órdenes en curso, facturación del mes, stock bajo, últimas reseñas, tráfico del sitio.

**2. Catálogo**
CRUD de productos, variantes, categorías, colecciones, materiales/telas; stock; precios; destacados; orden por arrastre; publicar/despublicar/programar; duplicar; importación/exportación CSV; edición masiva de precios.

**3. Medios (biblioteca de imágenes)**
Subida múltiple con arrastre, recorte y punto focal, compresión y conversión automática (WebP/AVIF), **texto alternativo obligatorio**, carpetas/etiquetas, detección de imágenes no usadas, reemplazo de imagen manteniendo referencias.

**4. Contenido**
- Páginas editables por bloques (hero, texto, galería, CTA, FAQ, testimonios) para Inicio, Nosotros, landings de servicio.
- Noticias/Novedades con editor enriquecido, categorías, autor, fecha de publicación programada, borradores, vista previa.
- Proyectos (portfolio) con antes/después.
- FAQ, banners/avisos (p. ej. "Cerramos por vacaciones del…").

**5. Leads y presupuestos**
Bandeja de consultas (formulario, cotizador, WhatsApp cargado manual), asignación, notas, seguimiento, conversión a presupuesto.

**6. Órdenes de trabajo**
Desde presupuesto aceptado: fecha de medición, confección, instalación (calendario), estado, seña cobrada, saldo, fotos del trabajo terminado (que pueden pasar al portfolio).

**7. Facturación**
Ver sección 11. Facturas, notas de crédito/débito, cobros parciales, cuenta corriente del cliente, exportación para el contador.

**8. Clientes (CRM)**
Ficha: datos personales y fiscales (CUIT/DNI, condición frente al IVA), direcciones (con las medidas de cada ambiente guardadas), historial de presupuestos, órdenes, facturas, pagos, notas, etiquetas, consentimiento de marketing. Opción de invitar al cliente a su portal (fase 2).

**9. Usuarios y roles**
Roles: **Dueña/Admin** (todo), **Ventas** (leads, presupuestos, clientes), **Taller** (órdenes de trabajo), **Contenido** (catálogo, noticias, medios). Permisos granulares por módulo, 2FA obligatorio para admin, registro de sesiones.

**10. SEO**
- Por cada página/producto/artículo: título SEO, meta descripción, slug, imagen para redes (OG), canonical, `noindex` opcional, vista previa del resultado de Google y de cómo se ve al compartir en WhatsApp.
- Indicadores de calidad (largo del título, descripción, alt faltantes, H1).
- Gestor de **redirecciones 301**.
- Configuración global: nombre del negocio, NAP, horarios, redes, logo → alimenta el schema JSON-LD.
- Edición de `robots.txt` y `llms.txt`.
- Informe de páginas con problemas (sin descripción, imágenes sin alt, contenido corto).

**11. Reseñas**
Sincronización con Google, elegir cuáles destacar en la home, ocultar, link para pedir reseñas a clientes (y QR imprimible).

**12. Configuración**
Datos del negocio (NAP, horarios, año de fundación), **botón de WhatsApp** (número, mensajes por sección, activar/desactivar), datos fiscales y certificado de ARCA, punto de venta, impuestos, monedas, listas de precios, plantillas de email y WhatsApp, numeraciones, integraciones (Google Place ID, Instagram, Mercado Pago, analytics), copias de seguridad.

**12b. Instagram**
Ver últimos posteos sincronizados, elegir cuáles mostrar, importar un posteo como proyecto o novedad.

**13. Auditoría**
Registro de quién cambió qué y cuándo (precios, facturas, usuarios). Imprescindible para facturación.

---

## 10. Modelo de datos

Tablas principales (PostgreSQL, gestionadas con Drizzle; todas con `id uuid`, `created_at`, `updated_at`, y `deleted_at` donde aplique borrado lógico):

```
-- Identidad
users (id, email, name, role_id, two_factor, last_login)
roles (id, name) · permissions (id, key) · role_permissions
sessions / accounts / verification (tablas de la librería de auth)

-- Catálogo
categories (id, parent_id, name, slug, description, image_id, sort, seo_id)
products (id, type[stock|custom|material], name, slug, short_desc, body_json,
          base_price, price_mode[fixed|from|hidden], status[draft|published|scheduled],
          published_at, featured, seo_id)
product_variants (id, product_id, sku, attrs jsonb, price, stock, image_id)
product_categories (product_id, category_id)
collections · collection_products
materials (id, kind[tela|riel|barral|espuma|…], name, code, width_cm, rapport_cm,
           unit, cost, price, supplier, stock, image_id)

-- Medios
media (id, storage_key, url, mime, width, height, size, alt, focal_x, focal_y, folder, tags)

-- Contenido
pages (id, key, title, slug, blocks jsonb, status, seo_id)
posts (id, title, slug, excerpt, body_json, cover_id, author_id, category_id,
       status, published_at, seo_id)
projects (id, title, slug, location, service, body_json, before_ids, after_ids,
          materials[], testimonial, status, seo_id)
faqs (id, question, answer, group, sort)

-- SEO
seo_meta (id, title, description, og_image_id, canonical, noindex)
redirects (id, from_path, to_path, code[301|302], hits)
site_settings (key, value jsonb)  -- NAP, horarios, redes, robots, llms

-- Reseñas
reviews (id, source[google], external_id, author, rating, text, published_at,
         reply, visible, featured, synced_at)

-- CRM
customers (id, type[persona|empresa], name, doc_type, doc_number, tax_condition,
           email, phone, notes, tags[], marketing_consent)
addresses (id, customer_id, street, city, province, zip, notes)
rooms (id, address_id, name, measurements jsonb)  -- medidas por ambiente
leads (id, source, service, data jsonb, customer_id, status, assigned_to)

-- Cotizador
pricing_rules (id, product_type, formula jsonb, params jsonb, version, active)
price_lists (id, name, valid_from) · price_list_items · price_history
quotes (id, number, customer_id, status, currency, exchange_rate, valid_until,
        subtotal, discount, tax, total, terms, public_token, version, parent_id)
quote_items (id, quote_id, room, product_id, material_id, inputs jsonb,
             computed jsonb, description, qty, unit_price, total)

-- Operación
work_orders (id, quote_id, status, measure_date, install_date, notes)
payments (id, customer_id, invoice_id, order_id, method, amount, date, reference)

-- Facturación
fiscal_config (cuit, razon_social, condicion_iva, punto_venta, cert_ref, env)
invoices (id, type[A|B|C|NC|ND], point_of_sale, number, customer_id, quote_id,
          date, net, iva_breakdown jsonb, total, cae, cae_due, qr_data, status, pdf_media_id)
invoice_items

-- Tienda (fase 2)
orders · order_items · shipments

-- Sistema
audit_log (id, user_id, entity, entity_id, action, diff jsonb, ip, at)
```

---

## 11. Facturación electrónica (ARCA, ex AFIP)

> **Importante:** en Argentina una factura válida debe emitirse a través de **ARCA** (la ex AFIP) y obtener un **CAE**. Un "PDF con forma de factura" generado sin ARCA no es una factura legal. Validar todo con el contador del negocio.

### Flujo
`Presupuesto aceptado → Orden → Generar factura → solicitar CAE a ARCA (web service WSFEv1) → guardar CAE y vencimiento → generar PDF con QR obligatorio → enviar al cliente`.

### Requisitos
- CUIT del negocio, **punto de venta para web services** dado de alta en ARCA, **certificado digital** (primero en homologación/testing, luego producción).
- Tipo de comprobante según condición fiscal: si el negocio es **monotributista → Factura C**; si es **responsable inscripto → Factura A** (a responsables inscriptos) o **B** (consumidores finales/monotributistas).
- Datos del receptor (CUIT/DNI, condición frente al IVA) desde la ficha del cliente.
- Notas de crédito/débito asociadas a la factura original.
- Código QR en el PDF según normativa vigente de ARCA.

### Implementación
- Opción A: integración directa al web service SOAP de ARCA (WSAA para autenticación + WSFEv1).
- Opción B: SDK/servicio intermediario (p. ej. Afip SDK) para simplificar — evaluar costo.
- El certificado y la clave privada se guardan **cifrados**, nunca en el repo.
- Las facturas emitidas son **inmutables**: no se editan ni se borran; se corrigen con notas de crédito.
- Cola con reintentos si ARCA no responde; nunca duplicar numeración.
- Exportación mensual (CSV/Excel) para el contador y libro IVA digital si aplica.

**Fase intermedia sugerida:** mientras se integra ARCA, el sistema genera presupuestos y "comprobantes internos" y la factura se emite manualmente en ARCA, cargando luego el número y CAE en el panel.

---

## 12. Reseñas de Google

### Opciones de obtención
| Opción | Ventaja | Limitación |
|---|---|---|
| **Google Business Profile API** (recomendada) | Como dueña del perfil, permite leer **todas** las reseñas y responderlas desde el panel | Requiere solicitar acceso a la API a Google |
| **Places API (New) – Place Details** | Fácil de implementar con una API key | Devuelve solo unas pocas reseñas (máx. 5) y el puntaje general |
| Widget de terceros | Rápido | Dependencia externa, peor performance y SEO |

### Implementación
- Tarea programada (diaria) que sincroniza reseñas a la tabla `reviews`; la web lee de la base (rápido, sin llamar a Google en cada visita).
- Mostrar puntaje promedio, cantidad total, reseñas con nombre, foto, fecha y estrellas, **con atribución a Google** y link a la ficha.
- Botón "Dejanos tu reseña" (link directo de reseña de Google Business Profile) + QR para entregar en cada instalación.
- Respetar las políticas de Google sobre caché y visualización de su contenido (revisar términos vigentes al implementar).
- **No** marcar las reseñas de Google con schema `AggregateRating`/`Review` sobre el propio negocio: Google no muestra estrellas para reseñas "autoservidas" y puede considerarse marcado engañoso. Las estrellas en Google ya las da el perfil de Google Business.
- Nunca inventar ni editar reseñas.

### Situación actual de Casa Esusy en Google
- Ficha "Casa Esusy decoraciones": **4,5 ★ · 26 opiniones**, 44 fotos, categoría "Tienda de cortinas", sin sitio web.
- La ficha ya existe y tiene reseñas → usar su **Place ID** para la sincronización (se obtiene una vez con Places API "Find Place" y se guarda en Configuración).
- Acciones: responder **todas** las reseñas (incluida la negativa sobre encogimiento, con tono profesional y ofreciendo solución), y entregar un **QR de "Dejanos tu reseña"** en cada colocación para pasar de 26 a 100+ opiniones.

---

## 12b. Integración con Instagram

Instagram es el canal más activo del negocio (~2.400 publicaciones). El sitio debe aprovecharlo sin depender de él:

- **Sección "Seguinos en Instagram"** con los últimos 6–9 posteos, enlazados al perfil @casa_esusy.
- Implementación: **Instagram Graph API** (la Basic Display API fue discontinuada), que requiere que @casa_esusy sea cuenta **profesional (empresa/creador) vinculada a la página de Facebook**. Un cron guarda los posteos (imagen, link, fecha, caption) en la base y las imágenes en nuestro storage; la web nunca llama a Instagram en tiempo real.
- Alternativa sin API: en el admin, pegar el link del posteo y subir la imagen ("posteos destacados" curados a mano).
- **Importador desde el admin**: convertir un posteo de Instagram en un **proyecto del portfolio** o en una **novedad** con un clic (trae imágenes y caption para completar). Así las fotos de trabajos reales que ya publican alimentan el sitio.
- Nunca usar embeds oficiales de Instagram en la home (cargan scripts pesados y rompen Core Web Vitals).
- Links de la bio de Instagram → página `/links` propia (alternativa a Linktree) con: WhatsApp, Presupuesto, Catálogo, Cómo llegar, Reseñas; con UTMs para medir.
- Meta tags Open Graph cuidados para que los links compartidos por WhatsApp/Instagram se vean con foto y título.

---

## 13. SEO técnico

### Renderizado
- Páginas públicas como **Server Components** con SSG/ISR. Al editar contenido en el admin se invalida la caché por etiqueta (`revalidateTag` / `revalidatePath`) para que el cambio se vea al instante sin recompilar.
- HTML completo en la primera respuesta (nada de contenido importante cargado solo con JS).

### Metadatos
- `generateMetadata` por ruta, alimentado por `seo_meta` del admin, con valores por defecto inteligentes (título = nombre + categoría + ciudad).
- Plantilla de título: `{Título} | {Marca}`; títulos de ≤ 60 caracteres, descripciones de 140–160.
- `metadataBase`, canonical en todas las páginas, `lang="es-AR"`, Open Graph y Twitter Cards con imagen 1200×630 (generada dinámicamente con `ImageResponse` si no se carga una).
- Favicons, `manifest.webmanifest`, `theme-color`.

### Datos estructurados (JSON-LD)
| Página | Schema |
|---|---|
| Todo el sitio | `Organization` + `WebSite` |
| Inicio / Contacto | `HomeAndConstructionBusiness` o `LocalBusiness` (subtipo adecuado; evaluar `FurnitureStore`), con dirección, geo, horarios, teléfono, `areaServed`, `sameAs` (redes, Google Maps) |
| Servicios | `Service` (+ `OfferCatalog`) |
| Producto | `Product` + `Offer` (precio en ARS, disponibilidad) |
| Artículos | `Article`/`BlogPosting` con `author` (`Person` de la dueña con credenciales) |
| FAQ | `FAQPage` (útil para IA aunque Google limite su rich result) |
| Navegación | `BreadcrumbList` en todas las páginas internas |
| Diseñadora | `Person` con `hasCredential` (`EducationalOccupationalCredential`) |

Validar con la Prueba de resultados enriquecidos y el validador de schema.org.

### Contenido y estructura
- Un solo `<h1>` por página; jerarquía H2/H3 lógica.
- Enlazado interno: servicios ↔ proyectos ↔ productos ↔ artículos; breadcrumbs visibles.
- Texto alternativo descriptivo en todas las imágenes (obligatorio en el admin).
- Nombres de archivo de imágenes descriptivos al subir (`cortina-blackout-living-palermo.webp`).
- Evitar contenido duplicado: canonical en productos con variantes/filtros; filtros del catálogo con `noindex,follow` o canonical a la categoría.
- 404 personalizada con buscador y links útiles; 410 para productos eliminados definitivamente.

### Keywords base (a validar con datos reales)
"cortinas a medida Banfield", "cortinas Lomas de Zamora", "cortinas black out zona sur", "venecianas de madera Banfield", "cortinas roller Lomas de Zamora", "empapelados Banfield", "pisos flotantes Lomas de Zamora", "alfombras Banfield", "acolchados a medida", "tapicería de sillones zona sur", "telas impermeables para exterior", "decoración de interiores Banfield", "Casa Esusy" (marca).

---

## 14. SEO local y GEO

### SEO local (Google Maps / búsquedas "cerca de mí")
- **Google Business Profile** completo y verificado: categorías correctas (principal y secundarias), servicios, productos, fotos reales actualizadas, horarios, publicaciones periódicas, responder todas las reseñas.
- **NAP idéntico** (nombre, dirección, teléfono) en web, Google, Instagram, Facebook, directorios (Páginas Amarillas, Guía Oleo no aplica, directorios de deco/arquitectura).
- Página de contacto con mapa embebido y datos visibles.
- Landings por zona **solo si hay contenido real** (proyectos hechos en esa zona, cobertura, tiempos de visita). Nada de páginas duplicadas cambiando el nombre del barrio.

### Acciones concretas para Casa Esusy
- **NAP oficial** (usar exactamente igual en todos lados): *Casa Esusy · Manuel Acevedo 1290, B1828 Banfield, Buenos Aires · +54 9 11 5598-4126*.
- **Google Business Profile**: agregar el sitio web; sumar categorías secundarias (p. ej. tienda de decoración de interiores, tienda de alfombras, tienda de papel tapiz/empapelados, tienda de pisos, tapicería, diseñador de interiores — elegir las que existan en el listado de Google); cargar horarios (L–V 9–13, S 10–14), atributos ("presupuesto sin cargo", "empresa liderada por mujeres"), productos con foto y publicaciones semanales (reutilizar lo de Instagram).
- **Facebook**: renombrar la página sin el número, corregir teléfono a +54 9 11 5598-4126, reemplazar el link roto de SimDif por el dominio nuevo, conectar con Instagram.
- **Instagram**: link de la bio al sitio (`/links` con UTMs), dirección y botón de contacto con el WhatsApp.
- `areaServed` en el schema: Banfield, Lomas de Zamora, Temperley, Adrogué, Lanús, Remedios de Escalada, Turdera y demás zonas que confirme el negocio.
- `foundingDate: "1967"` en el schema `Organization`/`LocalBusiness` y mención en el contenido.

### GEO — Generative Engine Optimization (aparecer en respuestas de ChatGPT, Gemini, Perplexity, Claude, AI Overviews)
- Contenido que **responde preguntas concretas** con datos claros: qué incluye el servicio, plazos, zonas, rango de precios, materiales, garantía.
- Formato "citable": párrafos cortos, listas, tablas comparativas, definiciones claras al inicio de cada sección.
- **Autoridad (E-E-A-T)**: página de la dueña con certificación, institución y años de experiencia; autoría visible en los artículos; casos reales con fotos.
- Datos estructurados completos (sección 13): ayudan a que los modelos entiendan entidades.
- Archivo **`/llms.txt`** con resumen del negocio, servicios, zona, contacto y links a las páginas clave (editable desde el admin).
- `robots.txt`: decidir explícitamente qué bots de IA permitir (OAI-SearchBot, PerplexityBot, Google-Extended, ClaudeBot, etc.). Para un negocio local conviene **permitir** los de búsqueda para ser citado.
- Menciones externas: notas en medios locales, blogs de deco, directorios de diseñadores, Instagram activo. Los modelos citan lo que aparece en muchas fuentes confiables.
- FAQ amplia y actualizada.
- Consistencia total de la información del negocio en todas partes.

---

## 15. Indexación

- `app/sitemap.ts` dinámico desde la base: páginas, servicios, productos publicados, proyectos, artículos, con `lastModified` real. Si crece, dividir en sitemaps índice (productos, contenido, imágenes).
- `app/robots.ts`: permitir todo el sitio público, bloquear `/admin`, `/api`, `/carrito`, `/checkout`, `/mi-cuenta`, parámetros de filtros; declarar el sitemap.
- `noindex` en: admin, resultados de búsqueda interna, páginas de agradecimiento, entornos de preview.
- **Bloquear indexación de los dominios `*.vercel.app` y previews** (header `X-Robots-Tag: noindex` cuando el host no es el dominio principal) para evitar contenido duplicado.
- Redirección única al dominio canónico (con o sin `www`, elegir uno) y HTTPS.
- **Google Search Console** y **Bing Webmaster Tools**: verificar dominio, enviar sitemap, monitorear cobertura y Core Web Vitals.
- **IndexNow** (Bing/Yandex) al publicar o actualizar contenido desde el admin.
- Dominio recomendado `.com.ar` (registro en NIC Argentina) — y opcionalmente `.com` redirigiendo.

---

## 16. Responsive y mobile-first

- Diseñar **primero para mobile** (la mayoría del tráfico de deco llega desde Instagram en el celular).
- Breakpoints: 390px (base), 768px (tablet), 1024px (laptop), 1280px+ (desktop).
- Tipografía fluida con `clamp()`.
- Imágenes con `next/image` y `sizes` correctos para cada breakpoint; dirección de arte (`<picture>`) en el hero si conviene un recorte distinto en mobile.
- Navegación: mobile con menú en hoja + barra inferior opcional; desktop con navbar.
- Formularios con teclados correctos (`inputmode="numeric"`, `type="tel"`, `type="email"`, `autocomplete`).
- Zonas seguras (`env(safe-area-inset-*)`) para iPhone con notch.
- El **panel admin también debe ser usable desde el celular** (cargar un lead o mirar un presupuesto en una visita).
- Probar en Safari iOS, Chrome Android, y desktop (Chrome, Safari, Firefox, Edge).

---

## 17. Performance y Core Web Vitals

- Metas: **Lighthouse ≥ 95** en Performance, Accesibilidad, Buenas prácticas y SEO; LCP < 2,5 s, INP < 200 ms, CLS < 0,1 en mobile.
- `next/image` con AVIF/WebP, `priority` solo en la imagen LCP, placeholders blur.
- `next/font` con `display: swap` y subset latino.
- Minimizar JavaScript en el cliente: solo islas interactivas como Client Components; `LazyMotion` para Motion.
- Mapas, videos y widgets de terceros cargados diferidos (al hacer scroll o al tocar).
- Scripts de terceros con `next/script` y estrategia `lazyOnload`/`afterInteractive`.
- Caché: ISR + invalidación por etiquetas; headers de caché largos para assets estáticos.
- Paginación o scroll infinito con URL en el catálogo.
- Medir con Vercel Speed Insights (o equivalente en VPS) y datos de campo de Search Console.

---

## 18. Accesibilidad

Objetivo **WCAG 2.2 nivel AA**:
- HTML semántico, landmarks (`header`, `nav`, `main`, `footer`), enlace "saltar al contenido".
- Navegación completa por teclado con foco visible.
- Contraste suficiente, no transmitir información solo con color.
- Etiquetas en todos los campos, mensajes de error asociados (`aria-describedby`), anuncios de estado (`aria-live`).
- Alt obligatorio en imágenes; los decorativos con `alt=""`.
- Respetar `prefers-reduced-motion` y el zoom del navegador hasta 200%.
- Modales y menús con trampa de foco y cierre con Escape.
- Probar con VoiceOver (iOS/macOS) y axe DevTools.

---

## 19. Seguridad

- Autenticación con 2FA para administradores; contraseñas con hash seguro (lo maneja la librería de auth); bloqueo por intentos fallidos.
- Autorización verificada **en el servidor** en cada Server Action / Route Handler (nunca confiar en el cliente).
- Validación de toda entrada con Zod; consultas parametrizadas vía ORM.
- Protección de formularios públicos: rate limiting (Upstash/Redis o en memoria en VPS) + **Cloudflare Turnstile** como captcha invisible + honeypot.
- Subida de archivos: validar tipo real y tamaño, re-procesar imágenes (quita metadatos EXIF con ubicación), nombres aleatorios.
- Headers de seguridad: CSP, HSTS, `X-Content-Type-Options`, `Referrer-Policy`, `Permissions-Policy`, `frame-ancestors`.
- Secretos solo en variables de entorno; certificado de ARCA cifrado.
- RLS activado en Supabase denegando acceso anónimo directo (defensa en profundidad).
- Backups automáticos diarios de la DB y del almacenamiento de imágenes, con prueba de restauración periódica.
- Registro de auditoría (sección 9) y logs de errores (Sentry o similar).
- Dependencias actualizadas (Dependabot/Renovate).

---

## 20. Legales (Argentina)

- **Política de privacidad** conforme a la **Ley 25.326 de Protección de Datos Personales** (finalidad, derechos de acceso/rectificación/supresión, responsable de la base). Evaluar la inscripción de la base de datos ante la Agencia de Acceso a la Información Pública.
- **Términos y condiciones** de uso y de venta.
- **Botón de arrepentimiento** visible en la home si se vende online (normativa de Defensa del Consumidor para comercio electrónico) y política de **cambios y devoluciones** (los productos a medida suelen tener condiciones especiales — redactarlo con un profesional).
- Precios con IVA incluido para consumidor final y aclaración de vigencia.
- Datos del negocio visibles (razón social, CUIT) y, si corresponde, el código QR de **Data Fiscal** de ARCA.
- **Banner de cookies** si se usan cookies de analítica/marketing, con opción de rechazar.
- Consentimiento explícito (checkbox no premarcado) para comunicaciones de marketing.
- Autorización de clientes para publicar fotos de sus casas en el portfolio.
- Revisar todos los textos legales con un abogado.

---

## 21. Analítica y medición

- **Google Analytics 4** (con consentimiento) o una alternativa liviana y respetuosa de la privacidad (Plausible/Umami — Umami se puede autoalojar en la VPS después).
- **Eventos clave**: `click_whatsapp`, `click_telefono`, `envio_presupuesto`, `uso_cotizador`, `envio_contacto`, `ver_producto`, `agregar_carrito`, `compra`, `click_como_llegar`.
- UTMs en links de Instagram, campañas y QR.
- Google Tag Manager opcional.
- Meta Pixel / API de Conversiones si se harán anuncios en Instagram.
- Panel de métricas simplificado dentro del dashboard del admin.

---

## 22. Migración Vercel + Supabase → VPS DonWeb

### Diseño desde el día 1 para que sea fácil
| Pieza | Hoy (Vercel + Supabase) | Mañana (VPS DonWeb) |
|---|---|---|
| App Next.js | Vercel | `output: "standalone"` en Docker, detrás de **Nginx** o **Caddy** (HTTPS automático) — o un panel tipo Coolify/Dokploy |
| Base de datos | Postgres de Supabase | PostgreSQL en la VPS (misma versión mayor) |
| ORM/migraciones | Drizzle | Drizzle (sin cambios) |
| Auth | Better Auth/Auth.js en nuestra DB | Sin cambios |
| Imágenes | Supabase Storage vía `StorageAdapter` | MinIO en la VPS o Cloudflare R2 vía el mismo adaptador |
| Optimización de imágenes | Vercel | `sharp` en el servidor de Next.js (+ caché de Nginx/CDN) |
| Emails | Resend | SMTP (o seguir con Resend) vía `MailAdapter` |
| Cron | Vercel Cron | cron del sistema / systemd timer llamando a endpoints protegidos |
| Rate limit | Upstash | Redis en la VPS |
| CDN | Vercel | **Cloudflare** delante de la VPS (DNS, caché, WAF, DDoS) |

### Pasos de la migración
1. Levantar la VPS (Ubuntu LTS), usuario no root, SSH con clave, firewall (solo 22/80/443), fail2ban, actualizaciones automáticas.
2. Instalar Docker + Docker Compose; contenedores: `app`, `postgres`, `minio` (opcional), `redis`, proxy inverso.
3. `pg_dump` de Supabase → `pg_restore` en la VPS; correr migraciones de Drizzle para verificar el esquema.
4. Copiar los archivos del storage al nuevo bucket (script con el adaptador) y actualizar URLs si cambian (mejor guardar solo la `storage_key` y construir la URL en tiempo de ejecución).
5. Configurar variables de entorno, compilar la imagen y probar en un subdominio de staging.
6. Backups: `pg_dump` diario comprimido + copia fuera de la VPS (otro proveedor/bucket), retención 30 días; probar restauración.
7. Monitoreo: uptime (Uptime Kuma), logs, alertas de disco/CPU.
8. Bajar el TTL del DNS, congelar la escritura en el admin durante la ventana de corte, sincronización final de datos, cambiar DNS, verificar.
9. Mantener Vercel/Supabase unos días como respaldo antes de darlos de baja.

---

## 23. Estructura de carpetas del proyecto

```
/
├─ src/
│  ├─ app/
│  │  ├─ (public)/              # sitio público (layout con navbar/footer)
│  │  │  ├─ page.tsx            # inicio
│  │  │  ├─ cortinas/ tapiceria/ almohadones/ producto/[slug]/
│  │  │  ├─ diseno-de-interiores/ proyectos/ nosotros/ resenas/
│  │  │  ├─ novedades/ presupuesto/ contacto/ preguntas-frecuentes/ legales/
│  │  ├─ (admin)/admin/         # panel (layout con sidebar, protegido)
│  │  │  ├─ dashboard/ catalogo/ medios/ contenido/ leads/ presupuestos/
│  │  │  ├─ ordenes/ facturacion/ clientes/ resenas/ seo/ usuarios/ configuracion/
│  │  ├─ p/[token]/             # vista pública de presupuesto para el cliente (noindex)
│  │  ├─ api/                   # route handlers (webhooks, cron, auth)
│  │  ├─ sitemap.ts  robots.ts  manifest.ts  llms.txt/route.ts
│  │  └─ not-found.tsx
│  ├─ components/
│  │  ├─ ui/                    # botones, inputs, sheets, segmented control (design system HIG)
│  │  ├─ motion/                # wrappers de animación reutilizables
│  │  ├─ public/ admin/
│  ├─ lib/
│  │  ├─ db/                    # cliente Drizzle, schema, queries
│  │  ├─ auth/                  # configuración de auth y permisos
│  │  ├─ storage/               # StorageAdapter (supabase.ts, s3.ts)
│  │  ├─ mail/                  # MailAdapter
│  │  ├─ pricing/               # motor del cotizador (puro, con tests)
│  │  ├─ invoicing/             # integración ARCA
│  │  ├─ reviews/               # sincronización Google
│  │  ├─ instagram/             # sincronización Graph API + importador
│  │  ├─ seo/                   # helpers de metadata y JSON-LD
│  │  └─ validation/            # esquemas Zod
│  ├─ styles/                   # tokens CSS
│  └─ middleware.ts / proxy.ts  # protección /admin, redirecciones, noindex en previews
├─ drizzle/                     # migraciones SQL versionadas
├─ tests/ (unit, e2e)
├─ docker/ (Dockerfile, compose, nginx/caddy)  # listo para la VPS
└─ .github/workflows/          # CI: lint, typecheck, tests, build
```

---

## 24. Roadmap por fases

### Fase 0 — Descubrimiento (1 semana)
Definir marca (logo, paleta, tipografía), relevar contenido y fotos, keywords, condición fiscal, zona de cobertura, lista de precios y fórmulas reales de cotización.

### Fase 1 — MVP público + admin base (4–6 semanas)
- Design system HIG + componentes + animaciones base.
- Todas las páginas públicas, catálogo con "carrito de consulta" y WhatsApp.
- Admin: catálogo, medios, contenido (páginas, noticias, proyectos), leads, SEO, usuarios y roles.
- SEO técnico completo, sitemap, robots, schema, Search Console, GBP optimizado.
- Reseñas de Google (vía Places API mientras se aprueba la de Business Profile).
- Legales, analítica, accesibilidad, performance.

### Fase 2 — Operación (3–4 semanas)
- Cotizador interno completo + PDF + link público de aceptación.
- CRM de clientes, órdenes de trabajo, calendario de mediciones/instalaciones, pagos.
- Facturación: primero carga manual de CAE, luego integración ARCA (homologación → producción).
- Cotizador orientativo público.

### Fase 3 — Crecimiento (continuo)
- Tienda con Mercado Pago y envíos; portal de cliente.
- Landings por zona con proyectos reales, plan editorial de artículos (2–4 por mes).
- Reseñas vía Business Profile API con respuesta desde el panel.
- Migración a VPS DonWeb.

---

## 25. Contenido que debe preparar el negocio

- [ ] Logo en vector (SVG) y variantes (el monograma de "Casa Esusy · Decoraciones"); las piezas de Instagram con la estética crema/serif/terracota como referencia.
- [ ] Historia de la familia y del local desde 1967 (fechas, fotos antiguas si hay).
- [ ] Acceso a Instagram (cuenta profesional), a la página de Facebook y a Google Business Profile.
- [ ] Selección de las mejores fotos ya publicadas en Instagram (en máxima resolución, no capturas).
- [ ] **Fotos profesionales**: trabajos terminados, antes/después, taller, telas, almohadones (fondo neutro), la dueña y el equipo. Es lo que más impacta en el resultado.
- [ ] Textos: historia, valores, descripción de cada servicio, proceso de trabajo.
- [ ] Certificación de la dueña (título, institución, año, matrícula) e imagen del certificado/insignia.
- [ ] Catálogo inicial: productos con nombre, descripción, medidas, composición, precios, stock, fotos.
- [ ] Listado de telas y materiales con costos y precios.
- [ ] **Fórmulas reales de cotización** (cómo calculan hoy una cortina y un retapizado).
- [ ] Zonas de cobertura, horarios, plazos típicos, formas de pago, garantías.
- [ ] 20–30 preguntas frecuentes reales.
- [ ] Datos fiscales (CUIT, condición IVA, punto de venta) y contacto del contador.
- [ ] Accesos: Google Business Profile, dominio, redes sociales.
- [ ] Autorizaciones de clientes para publicar fotos de sus casas.

---

## 26. Checklist de lanzamiento

**SEO / indexación**
- [ ] Títulos y descripciones únicos en todas las páginas
- [ ] Canonical correctos, redirección www/no-www y HTTPS
- [ ] sitemap.xml y robots.txt correctos; previews/vercel.app en noindex
- [ ] JSON-LD validado sin errores
- [ ] Search Console y Bing Webmaster verificados, sitemap enviado
- [ ] Google Business Profile completo y NAP consistente
- [ ] llms.txt publicado
- [ ] Link roto de SimDif reemplazado en Facebook (ese sitio ya no está publicado, no requiere redirecciones)
- [ ] NAP unificado en Google, Facebook, Instagram y el sitio (teléfono +54 9 11 5598-4126)
- [ ] Sitio web cargado en Google Business Profile y categorías secundarias agregadas
- [ ] Botón flotante de WhatsApp probado en iPhone y Android (abre la app con el mensaje correcto)
- [ ] Reseñas de Google respondidas

**Calidad**
- [ ] Lighthouse ≥ 95 en mobile en las páginas principales
- [ ] Sin errores de consola; 404 personalizada
- [ ] Probado en iPhone (Safari), Android (Chrome) y desktop
- [ ] Accesibilidad revisada con axe y VoiceOver
- [ ] Formularios probados de punta a punta (llegan emails y leads al panel)
- [ ] Imágenes con alt; sin imágenes pesadas

**Operación y seguridad**
- [ ] 2FA activo en cuentas admin
- [ ] Backups configurados y restauración probada
- [ ] Rate limit + captcha en formularios
- [ ] Headers de seguridad
- [ ] Monitoreo de errores y uptime
- [ ] Analítica y eventos de conversión funcionando
- [ ] Textos legales publicados y revisados

---

## 27. Prompt maestro para el agente de desarrollo

> Copiar este prompt al iniciar el proyecto con un agente de código (Claude Code u otro). Conviene trabajar **fase por fase**, pidiendo al agente que primero proponga el plan de cada fase y espere aprobación.

````markdown
# Rol
Sos un ingeniero full-stack senior y diseñador de producto especializado en Next.js, PostgreSQL,
SEO técnico y diseño según Apple Human Interface Guidelines. Vas a construir el sitio web y el panel
de administración de una casa de decoración argentina.

# Contexto del negocio
- Negocio: Casa Esusy · Decoración Integral, desde 1967, tres generaciones. Dueña: Andrea Esusy,
  certificada en Diseño y Decoración de Interiores (DECOmobi). Hace proyectos de hogar y comerciales. Local en Manuel Acevedo 1290,
  B1828 Banfield, Buenos Aires. Horario L–V 9–13 h, S 10–14 h. Presupuesto sin cargo.
  WhatsApp/teléfono: +54 9 11 5598-4126. Instagram: @casa_esusy. 4,5★ (26) en Google.
- Servicios: cortinas a medida (tela, gasas, black out textil, roller, venecianas de madera/
  PVC/aluminio, rieles), sillones y tapizados, acolchados y cubrecamas a medida, almohadones,
  alfombras, empapelados, pisos flotantes, telas por metro (incl. Aqua Block para exterior),
  colocación propia y diseño de interiores. También: romanas, bandas verticales, paneles
  orientales, cortinas de baño, respaldos de cama y fundas a medida, sábanas, carpetas de alfombra
  personalizadas, pisos SPC, zócalos, paneles WPC, césped sintético, pantallas de lámparas.
- Identidad visual: crema/marfil, serif clásica en titulares, acento terracota (sección 3).
- Mercado: Argentina (español rioplatense, moneda ARS, facturación electrónica ARCA).
- Objetivo principal: generar pedidos de presupuesto y posicionarse localmente en Google y en
  respuestas de IA. Secundario: vender almohadones online.
- Documento de referencia: `plan-web-casa-esusy.md` (es la fuente de verdad; leelo completo
  antes de empezar y seguilo. Si algo no está definido, preguntá antes de suponer).

# Stack obligatorio
- Next.js (última versión estable) con App Router, TypeScript en modo estricto, Server Components
  por defecto, Server Actions para mutaciones.
- Tailwind CSS con tokens de diseño en variables CSS.
- Motion (paquete `motion`, import desde `motion/react`) para animaciones, con LazyMotion,
  y respetando prefers-reduced-motion.
- PostgreSQL vía Supabase (solo como base de datos y storage), con Drizzle ORM y migraciones
  versionadas en el repo.
- Autenticación con Better Auth (o Auth.js) guardando las tablas en nuestra propia base.
  NO usar Supabase Auth, Edge Functions ni Realtime.
- Zod para toda validación, React Hook Form en formularios, Tiptap para contenido enriquecido,
  @react-pdf/renderer para PDFs.
- Deploy inicial en Vercel. El proyecto DEBE poder migrarse a una VPS (Docker + PostgreSQL)
  cambiando solo variables de entorno: aislar storage, email, cron y rate limiting detrás de
  adaptadores (`StorageAdapter`, `MailAdapter`). Configurar `output: "standalone"` e incluir
  Dockerfile y docker-compose desde el inicio.

# Principios de diseño (Apple HIG adaptado a web)
- Claridad, deferencia (el contenido/fotografía es protagonista), profundidad, consistencia.
- Mobile-first. Escala tipográfica HIG en rem (body 17px), grilla de 8pt, objetivos táctiles
  mínimos de 44×44px, mucho espacio en blanco, paleta neutra cálida con un único color de acento.
- Componentes: navbar translúcida con blur, sheets modales, segmented controls, listas agrupadas,
  skeletons, estados vacíos y de error diseñados.
- Animaciones cortas con springs, solo transform/opacity, con propósito (ver sección 4 del plan).
- WCAG 2.2 AA obligatorio.

# Requisitos no negociables
- SEO: generateMetadata en cada ruta alimentado desde la base, canonical, Open Graph,
  JSON-LD (LocalBusiness, Organization, WebSite, Service, Product, BlogPosting, FAQPage,
  BreadcrumbList, Person con credenciales), sitemap.ts y robots.ts dinámicos, llms.txt,
  noindex en /admin y en dominios de preview, redirecciones 301 automáticas al cambiar slugs.
- URLs en español, sin acentos, con guiones, según la sección 5 del plan.
- Performance: Lighthouse ≥ 95 en mobile, next/image con sizes correctos, next/font,
  mínimo JavaScript en el cliente.
- Seguridad: autorización en servidor en cada acción, roles y permisos, 2FA para admin,
  rate limiting + Turnstile en formularios públicos, headers de seguridad, auditoría de cambios.
- Nunca acceder a la base desde el navegador.
- Precios, fórmulas del cotizador, textos, imágenes y SEO se editan desde el panel;
  nada de esto queda fijo en el código.
- Las reseñas de Google se sincronizan por cron a la base y se muestran con atribución;
  no marcarlas con schema AggregateRating del propio negocio.
- Las facturas emitidas son inmutables; la integración con ARCA va aislada en `lib/invoicing`.
- Botón flotante de WhatsApp abajo a la derecha en todo el sitio público, con link
  `https://wa.me/5491155984126`, mensaje prellenado según la página y todos los detalles de la
  especificación de la sección 3 (safe areas, 56px, accesible, evento `click_whatsapp`,
  configurable desde el admin, oculto en /admin y /checkout).
- Instagram vía Graph API sincronizado por cron a la base (nunca embeds pesados).

# Forma de trabajo
1. Antes de cada fase, presentá el plan detallado (archivos, tablas, componentes) y esperá aprobación.
2. Trabajá en pasos pequeños y verificables; después de cada paso corré lint, typecheck y tests.
3. El motor del cotizador (`lib/pricing`) debe ser código puro con tests unitarios exhaustivos.
4. Escribí tests e2e (Playwright) para: enviar presupuesto, login admin, crear producto,
   crear presupuesto y convertirlo en factura.
5. Usá commits pequeños con mensajes descriptivos (Conventional Commits).
6. Documentá en README: instalación, variables de entorno, scripts, despliegue en Vercel y en VPS.
7. No inventes contenido del negocio: usá placeholders claramente marcados (`[COMPLETAR]`)
   y datos de ejemplo en un seed.

# Orden de ejecución
- Fase 1a: inicialización del proyecto, tooling (ESLint, Prettier, Husky, CI), Drizzle + esquema
  base, auth con roles, adaptadores, Docker.
- Fase 1b: design system HIG (tokens, tipografía, componentes UI, wrappers de Motion) con una
  página de muestra de componentes.
- Fase 1c: sitio público completo (todas las páginas del mapa), SEO técnico, legales, analítica.
- Fase 1d: panel admin: catálogo, medios, contenido, leads, SEO, reseñas, usuarios, configuración.
- Fase 2: cotizador interno + PDF + link público, CRM, órdenes de trabajo, pagos, facturación
  (primero carga manual de CAE, luego ARCA WSFEv1 en homologación).
- Fase 3: tienda con Mercado Pago, portal de clientes, landings por zona.

Empezá leyendo el plan completo y respondiendo con: (1) dudas o ambigüedades detectadas,
(2) el plan detallado de la Fase 1a.
````

---

## 28. Decisiones pendientes

Definir antes de empezar a construir:

1. **Dominio** (`casaesusy.com.ar` si está disponible en NIC Argentina) y email con dominio propio.
1b. **Nombre del sitio**: "Casa Esusy" a secas, o "Casa Esusy · Decoración Integral" (unificar en Google, Facebook e Instagram).
1c. **¿Las líneas de pisos y empapelados se venden con colocación, sin colocación o ambas?**
1d. **Teléfono de línea**: ¿el 011 6088-9505 de Facebook sigue en uso? Si no, quitarlo; si sí, decidir cuál es el principal (para SEO local conviene uno solo).
2. **Condición fiscal** (monotributo o responsable inscripto) → define el tipo de factura.
3. **¿Se muestran precios en la web?** (fijos para almohadones; "desde" u ocultos para lo a medida).
4. **¿Venta online de almohadones en la fase 1** o solo consulta por WhatsApp?
5. **Zona de cobertura** para mediciones e instalaciones (¿solo zona sur o también CABA?).
6. **Envíos**: retiro en local, moto en la ciudad, correo al interior.
7. **Medios de pago**: efectivo, transferencia, Mercado Pago, cuotas.
8. ¿Habrá **cuentas de cliente** (portal) o los clientes solo reciben links por WhatsApp/email?
9. **Idioma**: solo español, o también inglés a futuro (afecta la estructura de URLs).
10. Presupuesto para **fotografía profesional** (muy recomendado).
