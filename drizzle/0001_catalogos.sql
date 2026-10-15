CREATE TABLE `catalogos` (
	`id` text PRIMARY KEY NOT NULL,
	`titulo` text NOT NULL,
	`descripcion` text DEFAULT '' NOT NULL,
	`categoria` text DEFAULT 'Telas' NOT NULL,
	`marca_id` text,
	`tipo` text DEFAULT 'pdf' NOT NULL,
	`archivo` text DEFAULT '' NOT NULL,
	`enlace` text DEFAULT '' NOT NULL,
	`portada` text DEFAULT '' NOT NULL,
	`imagenes` text DEFAULT '[]' NOT NULL,
	`destacado` integer DEFAULT false NOT NULL,
	`publicado` integer DEFAULT true NOT NULL,
	`orden` integer DEFAULT 0 NOT NULL,
	`creado` text DEFAULT (strftime('%Y-%m-%dT%H:%M:%fZ','now')) NOT NULL,
	FOREIGN KEY (`marca_id`) REFERENCES `marcas`(`id`) ON UPDATE no action ON DELETE set null
);
--> statement-breakpoint
CREATE INDEX `catalogos_categoria_idx` ON `catalogos` (`categoria`);--> statement-breakpoint
CREATE TABLE `marcas` (
	`id` text PRIMARY KEY NOT NULL,
	`nombre` text NOT NULL,
	`descripcion` text DEFAULT '' NOT NULL,
	`rubro` text DEFAULT '' NOT NULL,
	`logo` text DEFAULT '' NOT NULL,
	`sitio_web` text DEFAULT '' NOT NULL,
	`orden` integer DEFAULT 0 NOT NULL,
	`publicada` integer DEFAULT true NOT NULL,
	`creado` text DEFAULT (strftime('%Y-%m-%dT%H:%M:%fZ','now')) NOT NULL
);
--> statement-breakpoint
CREATE UNIQUE INDEX `marcas_nombre_unique` ON `marcas` (`nombre`);