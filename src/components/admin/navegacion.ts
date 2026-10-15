import {
  BriefcaseIcon,
  FileTextIcon,
  GaugeIcon,
  HelpCircleIcon,
  ImagesIcon,
  InboxIcon,
  LayoutGridIcon,
  type LucideIcon,
  SearchCheckIcon,
  SettingsIcon,
  StarIcon,
  TagsIcon,
  UsersIcon,
  UserCogIcon,
  HomeIcon,
} from "lucide-react";

export interface EnlacePanel {
  href: string;
  titulo: string;
  Icono: LucideIcon;
  clave?: "consultas";
  roles?: ("admin" | "ventas" | "contenido")[];
}

export const NAVEGACION: { grupo: string; enlaces: EnlacePanel[] }[] = [
  {
    grupo: "General",
    enlaces: [{ href: "/admin", titulo: "Inicio", Icono: GaugeIcon }],
  },
  {
    grupo: "Ventas",
    enlaces: [
      { href: "/admin/consultas", titulo: "Consultas", Icono: InboxIcon, clave: "consultas", roles: ["ventas"] },
      { href: "/admin/presupuestos", titulo: "Presupuestos", Icono: FileTextIcon, roles: ["ventas"] },
      { href: "/admin/clientes", titulo: "Clientes", Icono: UsersIcon, roles: ["ventas"] },
      { href: "/admin/precios", titulo: "Lista de precios", Icono: TagsIcon, roles: ["ventas"] },
    ],
  },
  {
    grupo: "Sitio web",
    enlaces: [
      { href: "/admin/inicio", titulo: "Portada", Icono: HomeIcon, roles: ["contenido"] },
      { href: "/admin/servicios", titulo: "Servicios", Icono: LayoutGridIcon, roles: ["contenido"] },
      { href: "/admin/trabajos", titulo: "Trabajos", Icono: BriefcaseIcon, roles: ["contenido"] },
      { href: "/admin/resenas", titulo: "Reseñas", Icono: StarIcon, roles: ["contenido"] },
      { href: "/admin/preguntas", titulo: "Preguntas", Icono: HelpCircleIcon, roles: ["contenido"] },
      { href: "/admin/medios", titulo: "Imágenes", Icono: ImagesIcon, roles: ["contenido"] },
      { href: "/admin/seo", titulo: "SEO", Icono: SearchCheckIcon, roles: ["contenido"] },
    ],
  },
  {
    grupo: "Ajustes",
    enlaces: [
      { href: "/admin/configuracion", titulo: "Configuración", Icono: SettingsIcon, roles: ["contenido", "ventas"] },
      { href: "/admin/usuarios", titulo: "Usuarios", Icono: UserCogIcon, roles: ["admin"] },
    ],
  },
];

export const puedeVer = (rol: "admin" | "ventas" | "contenido", e: EnlacePanel) => rol === "admin" || !e.roles || e.roles.includes(rol);
