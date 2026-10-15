CREATE TABLE `actividad` (
	`id` text PRIMARY KEY NOT NULL,
	`usuario_id` text,
	`usuario` text DEFAULT 'Sistema' NOT NULL,
	`accion` text NOT NULL,
	`entidad` text NOT NULL,
	`entidad_id` text,
	`detalle` text DEFAULT '' NOT NULL,
	`creado` text DEFAULT (strftime('%Y-%m-%dT%H:%M:%fZ','now')) NOT NULL
);
--> statement-breakpoint
CREATE INDEX `actividad_creado_idx` ON `actividad` (`creado`);--> statement-breakpoint
CREATE TABLE `ajustes` (
	`clave` text PRIMARY KEY NOT NULL,
	`valor` text NOT NULL,
	`actualizado` text DEFAULT (strftime('%Y-%m-%dT%H:%M:%fZ','now')) NOT NULL
);
--> statement-breakpoint
CREATE TABLE `clientes` (
	`id` text PRIMARY KEY NOT NULL,
	`nombre` text NOT NULL,
	`telefono` text DEFAULT '' NOT NULL,
	`email` text DEFAULT '' NOT NULL,
	`direccion` text DEFAULT '' NOT NULL,
	`localidad` text DEFAULT '' NOT NULL,
	`documento` text DEFAULT '' NOT NULL,
	`condicion_iva` text DEFAULT 'Consumidor final' NOT NULL,
	`notas` text DEFAULT '' NOT NULL,
	`creado` text DEFAULT (strftime('%Y-%m-%dT%H:%M:%fZ','now')) NOT NULL
);
--> statement-breakpoint
CREATE INDEX `clientes_nombre_idx` ON `clientes` (`nombre`);--> statement-breakpoint
CREATE TABLE `consultas` (
	`id` text PRIMARY KEY NOT NULL,
	`nombre` text NOT NULL,
	`telefono` text DEFAULT '' NOT NULL,
	`email` text DEFAULT '' NOT NULL,
	`servicio` text DEFAULT '' NOT NULL,
	`mensaje` text DEFAULT '' NOT NULL,
	`detalles` text DEFAULT '{}' NOT NULL,
	`origen` text DEFAULT 'web' NOT NULL,
	`estado` text DEFAULT 'nueva' NOT NULL,
	`cliente_id` text,
	`notas` text DEFAULT '' NOT NULL,
	`creado` text DEFAULT (strftime('%Y-%m-%dT%H:%M:%fZ','now')) NOT NULL,
	`actualizado` text DEFAULT (strftime('%Y-%m-%dT%H:%M:%fZ','now')) NOT NULL,
	FOREIGN KEY (`cliente_id`) REFERENCES `clientes`(`id`) ON UPDATE no action ON DELETE set null
);
--> statement-breakpoint
CREATE INDEX `consultas_estado_idx` ON `consultas` (`estado`);--> statement-breakpoint
CREATE INDEX `consultas_creado_idx` ON `consultas` (`creado`);--> statement-breakpoint
CREATE TABLE `medios` (
	`id` text PRIMARY KEY NOT NULL,
	`nombre` text NOT NULL,
	`url` text NOT NULL,
	`alt` text DEFAULT '' NOT NULL,
	`ancho` integer,
	`alto` integer,
	`peso` integer,
	`tipo` text DEFAULT 'image/webp' NOT NULL,
	`creado` text DEFAULT (strftime('%Y-%m-%dT%H:%M:%fZ','now')) NOT NULL
);
--> statement-breakpoint
CREATE UNIQUE INDEX `medios_url_unique` ON `medios` (`url`);--> statement-breakpoint
CREATE TABLE `precios` (
	`id` text PRIMARY KEY NOT NULL,
	`categoria` text NOT NULL,
	`nombre` text NOT NULL,
	`unidad` text DEFAULT 'u' NOT NULL,
	`precio` real DEFAULT 0 NOT NULL,
	`notas` text DEFAULT '' NOT NULL,
	`activo` integer DEFAULT true NOT NULL,
	`actualizado` text DEFAULT (strftime('%Y-%m-%dT%H:%M:%fZ','now')) NOT NULL
);
--> statement-breakpoint
CREATE UNIQUE INDEX `precios_cat_nombre_idx` ON `precios` (`categoria`,`nombre`);--> statement-breakpoint
CREATE TABLE `preguntas` (
	`id` text PRIMARY KEY NOT NULL,
	`pregunta` text NOT NULL,
	`respuesta` text NOT NULL,
	`grupo` text DEFAULT 'General' NOT NULL,
	`orden` integer DEFAULT 0 NOT NULL,
	`publicada` integer DEFAULT true NOT NULL
);
--> statement-breakpoint
CREATE TABLE `presupuesto_items` (
	`id` text PRIMARY KEY NOT NULL,
	`presupuesto_id` text NOT NULL,
	`ambiente` text DEFAULT '' NOT NULL,
	`descripcion` text NOT NULL,
	`tipo` text DEFAULT 'manual' NOT NULL,
	`entradas` text DEFAULT '{}' NOT NULL,
	`desglose` text DEFAULT '[]' NOT NULL,
	`cantidad` real DEFAULT 1 NOT NULL,
	`precio_unitario` real DEFAULT 0 NOT NULL,
	`total` real DEFAULT 0 NOT NULL,
	`orden` integer DEFAULT 0 NOT NULL,
	FOREIGN KEY (`presupuesto_id`) REFERENCES `presupuestos`(`id`) ON UPDATE no action ON DELETE cascade
);
--> statement-breakpoint
CREATE INDEX `items_presupuesto_idx` ON `presupuesto_items` (`presupuesto_id`);--> statement-breakpoint
CREATE TABLE `presupuestos` (
	`id` text PRIMARY KEY NOT NULL,
	`numero` text NOT NULL,
	`cliente_id` text,
	`consulta_id` text,
	`titulo` text DEFAULT '' NOT NULL,
	`estado` text DEFAULT 'borrador' NOT NULL,
	`valido_hasta` text NOT NULL,
	`descuento_pct` real DEFAULT 0 NOT NULL,
	`iva_pct` real DEFAULT 0 NOT NULL,
	`sena_pct` real DEFAULT 50 NOT NULL,
	`notas` text DEFAULT '' NOT NULL,
	`condiciones` text DEFAULT '' NOT NULL,
	`token` text NOT NULL,
	`subtotal` real DEFAULT 0 NOT NULL,
	`total` real DEFAULT 0 NOT NULL,
	`enviado` text,
	`visto` text,
	`respondido` text,
	`creado` text DEFAULT (strftime('%Y-%m-%dT%H:%M:%fZ','now')) NOT NULL,
	`actualizado` text DEFAULT (strftime('%Y-%m-%dT%H:%M:%fZ','now')) NOT NULL,
	FOREIGN KEY (`cliente_id`) REFERENCES `clientes`(`id`) ON UPDATE no action ON DELETE set null,
	FOREIGN KEY (`consulta_id`) REFERENCES `consultas`(`id`) ON UPDATE no action ON DELETE set null
);
--> statement-breakpoint
CREATE UNIQUE INDEX `presupuestos_numero_unique` ON `presupuestos` (`numero`);--> statement-breakpoint
CREATE UNIQUE INDEX `presupuestos_token_unique` ON `presupuestos` (`token`);--> statement-breakpoint
CREATE INDEX `presupuestos_estado_idx` ON `presupuestos` (`estado`);--> statement-breakpoint
CREATE TABLE `proyectos` (
	`id` text PRIMARY KEY NOT NULL,
	`titulo` text NOT NULL,
	`servicio` text NOT NULL,
	`ubicacion` text DEFAULT '' NOT NULL,
	`descripcion` text DEFAULT '' NOT NULL,
	`imagen` text NOT NULL,
	`galeria` text DEFAULT '[]' NOT NULL,
	`destacado` integer DEFAULT false NOT NULL,
	`publicado` integer DEFAULT true NOT NULL,
	`orden` integer DEFAULT 0 NOT NULL,
	`creado` text DEFAULT (strftime('%Y-%m-%dT%H:%M:%fZ','now')) NOT NULL
);
--> statement-breakpoint
CREATE TABLE `redirecciones` (
	`id` text PRIMARY KEY NOT NULL,
	`desde` text NOT NULL,
	`hacia` text NOT NULL,
	`codigo` integer DEFAULT 301 NOT NULL,
	`visitas` integer DEFAULT 0 NOT NULL,
	`creado` text DEFAULT (strftime('%Y-%m-%dT%H:%M:%fZ','now')) NOT NULL
);
--> statement-breakpoint
CREATE UNIQUE INDEX `redirecciones_desde_unique` ON `redirecciones` (`desde`);--> statement-breakpoint
CREATE TABLE `resenas` (
	`id` text PRIMARY KEY NOT NULL,
	`autor` text NOT NULL,
	`puntaje` integer DEFAULT 5 NOT NULL,
	`texto` text NOT NULL,
	`fecha` text DEFAULT '' NOT NULL,
	`origen` text DEFAULT 'Google' NOT NULL,
	`destacada` integer DEFAULT false NOT NULL,
	`visible` integer DEFAULT true NOT NULL,
	`creado` text DEFAULT (strftime('%Y-%m-%dT%H:%M:%fZ','now')) NOT NULL
);
--> statement-breakpoint
CREATE TABLE `seo_paginas` (
	`ruta` text PRIMARY KEY NOT NULL,
	`titulo` text,
	`descripcion` text,
	`imagen` text,
	`noindex` integer DEFAULT false NOT NULL,
	`actualizado` text DEFAULT (strftime('%Y-%m-%dT%H:%M:%fZ','now')) NOT NULL
);
--> statement-breakpoint
CREATE TABLE `servicios` (
	`id` text PRIMARY KEY NOT NULL,
	`slug` text NOT NULL,
	`nombre` text NOT NULL,
	`titulo` text NOT NULL,
	`bajada` text NOT NULL,
	`descripcion` text DEFAULT '' NOT NULL,
	`imagen` text NOT NULL,
	`tipos` text DEFAULT '[]' NOT NULL,
	`preguntas` text DEFAULT '[]' NOT NULL,
	`mensaje_whatsapp` text DEFAULT '' NOT NULL,
	`orden` integer DEFAULT 0 NOT NULL,
	`publicado` integer DEFAULT true NOT NULL,
	`actualizado` text DEFAULT (strftime('%Y-%m-%dT%H:%M:%fZ','now')) NOT NULL
);
--> statement-breakpoint
CREATE UNIQUE INDEX `servicios_slug_unique` ON `servicios` (`slug`);--> statement-breakpoint
CREATE TABLE `sesiones` (
	`id` text PRIMARY KEY NOT NULL,
	`usuario_id` text NOT NULL,
	`expira` text NOT NULL,
	`agente` text,
	`creado` text DEFAULT (strftime('%Y-%m-%dT%H:%M:%fZ','now')) NOT NULL,
	FOREIGN KEY (`usuario_id`) REFERENCES `usuarios`(`id`) ON UPDATE no action ON DELETE cascade
);
--> statement-breakpoint
CREATE INDEX `sesiones_usuario_idx` ON `sesiones` (`usuario_id`);--> statement-breakpoint
CREATE TABLE `usuarios` (
	`id` text PRIMARY KEY NOT NULL,
	`email` text NOT NULL,
	`nombre` text NOT NULL,
	`hash` text NOT NULL,
	`rol` text DEFAULT 'admin' NOT NULL,
	`activo` integer DEFAULT true NOT NULL,
	`ultimo_ingreso` text,
	`creado` text DEFAULT (strftime('%Y-%m-%dT%H:%M:%fZ','now')) NOT NULL
);
--> statement-breakpoint
CREATE UNIQUE INDEX `usuarios_email_unique` ON `usuarios` (`email`);