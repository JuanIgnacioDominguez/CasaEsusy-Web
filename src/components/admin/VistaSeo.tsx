"use client";

import { useState, useTransition } from "react";
import {
  AlertTriangleIcon,
  ArrowRightIcon,
  CheckCircle2Icon,
  ExternalLinkIcon,
  PlusIcon,
  RotateCcwIcon,
  SaveIcon,
  Trash2Icon,
  XCircleIcon,
} from "lucide-react";
import { toast } from "sonner";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Field, FieldDescription, FieldGroup, FieldLabel } from "@/components/ui/field";
import { Input } from "@/components/ui/input";
import { Select, SelectContent, SelectGroup, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Sheet, SheetContent, SheetDescription, SheetFooter, SheetHeader, SheetTitle } from "@/components/ui/sheet";
import { Spinner } from "@/components/ui/spinner";
import { Switch } from "@/components/ui/switch";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Textarea } from "@/components/ui/textarea";
import { Puntaje } from "@/components/admin/comunes";
import { SelectorImagen } from "@/components/admin/SelectorImagen";
import { VistaGoogle, VistaWhatsApp } from "@/components/admin/VistasPrevias";
import { eliminarRedireccion, guardarAjustes, guardarRedireccion, guardarSeoPagina, restablecerSeoPagina } from "@/lib/acciones/contenido";
import type { AjustesSeo } from "@/lib/ajustes/esquemas";
import type { Redireccion } from "@/lib/db/schema";
import { haceCuanto } from "@/lib/formato";
import { analizarDescripcion, analizarTitulo, type AnalisisPagina, type Chequeo } from "@/lib/seo-salud";
import { cn } from "@/lib/utils";

/** Búsquedas locales a las que apunta cada página (del plan de SEO). */
const PALABRAS: Record<string, string[]> = {
  "/": ["casa esusy", "decoración banfield", "cortinas banfield", "decoración zona sur"],
  "/cortinas": ["cortinas a medida banfield", "cortinas lomas de zamora", "cortinas black out zona sur", "cortinas roller lomas de zamora", "venecianas de madera banfield"],
  "/tapiceria": ["tapicería de sillones zona sur", "retapizado de sillones banfield", "sillones a medida lomas de zamora", "respaldos de cama a medida"],
  "/dormitorio": ["acolchados a medida", "cubrecamas a medida banfield", "almohadones decorativos"],
  "/alfombras": ["alfombras banfield", "alfombras a medida zona sur", "alfombras de yute"],
  "/empapelados": ["empapelados banfield", "empapelado infantil", "papel tapiz lomas de zamora"],
  "/pisos": ["pisos flotantes lomas de zamora", "pisos spc vinílicos", "pisos vinílicos banfield"],
  "/diseno-de-interiores": ["decoración de interiores banfield", "diseñadora de interiores zona sur"],
};

const ICONO: Record<Chequeo["nivel"], React.ReactNode> = {
  ok: <CheckCircle2Icon className="size-4 shrink-0 text-exito" />,
  aviso: <AlertTriangleIcon className="size-4 shrink-0 text-aviso" />,
  error: <XCircleIcon className="size-4 shrink-0 text-destructive" />,
};

export function VistaSeo({
  analisis,
  generales,
  seo,
  redirecciones,
  sitio,
  rutaInicial,
  tabInicial,
  incluidas,
  subidas,
  servicios,
}: {
  analisis: AnalisisPagina[];
  generales: Chequeo[];
  seo: AjustesSeo;
  redirecciones: Redireccion[];
  sitio: string;
  rutaInicial?: string;
  tabInicial?: string;
  incluidas: string[];
  subidas: { url: string; alt: string }[];
  servicios: { nombre: string; slug: string }[];
}) {
  const [ruta, setRuta] = useState<string | null>(rutaInicial ?? null);
  const actual = analisis.find((a) => a.ruta === ruta);

  return (
    <Tabs defaultValue={tabInicial ?? "paginas"} className="gap-4">
      <TabsList className="no-scrollbar max-w-full overflow-x-auto">
        <TabsTrigger value="paginas">Páginas</TabsTrigger>
        <TabsTrigger value="general">General</TabsTrigger>
        <TabsTrigger value="redirecciones">Redirecciones · {redirecciones.length}</TabsTrigger>
        <TabsTrigger value="avanzado">Robots y llms.txt</TabsTrigger>
      </TabsList>

      <TabsContent value="paginas">
        <Card className="gap-0 overflow-hidden py-0">
          <Table>
            <TableHeader>
              <TableRow className="bg-muted/50 hover:bg-muted/50">
                <TableHead className="w-16 pl-4">Puntaje</TableHead>
                <TableHead>Página</TableHead>
                <TableHead className="hidden lg:table-cell">Título en Google</TableHead>
                <TableHead className="hidden md:table-cell">A mejorar</TableHead>
                <TableHead className="w-10 pr-4" />
              </TableRow>
            </TableHeader>
            <TableBody>
              {analisis.map((a) => {
                const problemas = a.chequeos.filter((c) => c.nivel !== "ok");
                return (
                  <TableRow key={a.ruta} className="cursor-pointer" onClick={() => setRuta(a.ruta)}>
                    <TableCell className="pl-4">
                      <Puntaje valor={a.puntaje} className="size-10" />
                    </TableCell>
                    <TableCell>
                      <span className="flex flex-col">
                        <span className="flex items-center gap-2 font-medium">
                          {a.nombre}
                          {a.personalizado && <Badge variant="secondary">Personalizado</Badge>}
                          {a.noindex && <Badge variant="destructive">noindex</Badge>}
                        </span>
                        <span className="text-xs text-muted-foreground">{a.ruta}</span>
                      </span>
                    </TableCell>
                    <TableCell className="hidden max-w-xs truncate text-muted-foreground lg:table-cell">{a.titulo}</TableCell>
                    <TableCell className="hidden md:table-cell">
                      {problemas.length ? (
                        <span className="flex items-center gap-1.5 text-sm text-muted-foreground">
                          {ICONO[problemas[0]!.nivel]} <span className="truncate">{problemas[0]!.texto}</span>
                          {problemas.length > 1 && <span className="text-xs">+{problemas.length - 1}</span>}
                        </span>
                      ) : (
                        <span className="flex items-center gap-1.5 text-sm text-exito">{ICONO.ok} Todo en orden</span>
                      )}
                    </TableCell>
                    <TableCell className="pr-4">
                      <ArrowRightIcon className="size-4 text-muted-foreground" />
                    </TableCell>
                  </TableRow>
                );
              })}
            </TableBody>
          </Table>
        </Card>
        <Sheet open={!!actual} onOpenChange={(o) => !o && setRuta(null)}>
          <SheetContent className="w-full gap-0 overflow-y-auto sm:max-w-xl">
            {actual && <EditorSeoPagina key={actual.ruta} a={actual} sitio={sitio} plantilla={seo.plantilla} incluidas={incluidas} subidas={subidas} onCerrar={() => setRuta(null)} />}
          </SheetContent>
        </Sheet>
      </TabsContent>

      <TabsContent value="general" className="grid gap-4 xl:grid-cols-[1fr_1.2fr]">
        <Card>
          <CardHeader>
            <CardTitle>Diagnóstico</CardTitle>
            <CardDescription>Lo básico para que Google confíe en el sitio.</CardDescription>
          </CardHeader>
          <CardContent className="flex flex-col gap-2.5">
            {generales.map((c) => (
              <p key={c.texto} className="flex items-start gap-2 text-sm">
                {ICONO[c.nivel]} {c.texto}
              </p>
            ))}
            <div className="mt-2 flex flex-wrap gap-2">
              {["/sitemap.xml", "/robots.txt", "/llms.txt"].map((u) => (
                <Button key={u} asChild variant="outline" size="sm">
                  <a href={u} target="_blank" rel="noopener">
                    {u} <ExternalLinkIcon data-icon="inline-end" />
                  </a>
                </Button>
              ))}
            </div>
          </CardContent>
        </Card>
        <AjustesGenerales seo={seo} incluidas={incluidas} subidas={subidas} sitio={sitio} />
        <Card className="xl:col-span-2">
          <CardHeader>
            <CardTitle>Búsquedas objetivo</CardTitle>
            <CardDescription>Frases que la gente busca en Google. Usalas de forma natural en títulos, textos y preguntas de cada página.</CardDescription>
          </CardHeader>
          <CardContent className="grid gap-4 md:grid-cols-2 xl:grid-cols-4">
            {Object.entries(PALABRAS).map(([r, palabras]) => (
              <div key={r} className="flex flex-col gap-2 rounded-xl border p-4">
                <span className="text-sm font-semibold">{r === "/" ? "Inicio" : (servicios.find((s) => `/${s.slug}` === r)?.nombre ?? r)}</span>
                <div className="flex flex-wrap gap-1.5">
                  {palabras.map((p) => (
                    <Badge key={p} variant="outline" className="font-normal">
                      {p}
                    </Badge>
                  ))}
                </div>
              </div>
            ))}
          </CardContent>
        </Card>
      </TabsContent>

      <TabsContent value="redirecciones">
        <Redirecciones lista={redirecciones} />
      </TabsContent>

      <TabsContent value="avanzado">
        <Avanzado seo={seo} />
      </TabsContent>
    </Tabs>
  );
}

function EditorSeoPagina({
  a,
  sitio,
  plantilla,
  incluidas,
  subidas,
  onCerrar,
}: {
  a: AnalisisPagina;
  sitio: string;
  plantilla: string;
  incluidas: string[];
  subidas: { url: string; alt: string }[];
  onCerrar: () => void;
}) {
  const [d, setD] = useState({ titulo: a.titulo, descripcion: a.descripcion, imagen: a.personalizado ? a.imagen : "", noindex: a.noindex });
  const [pendiente, iniciar] = useTransition();
  const tituloFinal = a.tipo === "inicio" ? d.titulo : plantilla.replace("%s", d.titulo);
  const cT = analizarTitulo(d.titulo, a.tipo === "inicio" ? 0 : plantilla.replace("%s", "").length);
  const cD = analizarDescripcion(d.descripcion);
  const host = sitio.replace(/^https?:\/\//, "");
  const palabras = PALABRAS[a.ruta];

  return (
    <>
      <SheetHeader className="border-b p-6">
        <SheetTitle>{a.nombre}</SheetTitle>
        <SheetDescription>{a.ruta}</SheetDescription>
      </SheetHeader>
      <div className="flex flex-col gap-6 p-6">
        <div className="flex flex-col gap-2">
          <p className="text-xs font-medium text-muted-foreground">Así se ve en Google</p>
          <VistaGoogle titulo={tituloFinal} descripcion={d.descripcion} url={`${sitio}${a.ruta === "/" ? "" : a.ruta}`} />
        </div>
        <FieldGroup>
          <Field>
            <FieldLabel htmlFor="seo-t">Título</FieldLabel>
            <Input id="seo-t" value={d.titulo} onChange={(e) => setD({ ...d, titulo: e.target.value })} />
            <FieldDescription className={cn(cT.nivel !== "ok" && "text-aviso")}>{cT.texto}</FieldDescription>
          </Field>
          <Field>
            <FieldLabel htmlFor="seo-d">Meta descripción</FieldLabel>
            <Textarea id="seo-d" value={d.descripcion} onChange={(e) => setD({ ...d, descripcion: e.target.value })} className="min-h-24" />
            <FieldDescription className={cn(cD.nivel !== "ok" && "text-aviso")}>{cD.texto}</FieldDescription>
          </Field>
          {palabras && (
            <div className="flex flex-col gap-2 rounded-xl bg-muted/60 p-3">
              <p className="text-xs font-medium text-muted-foreground">Búsquedas objetivo</p>
              <div className="flex flex-wrap gap-1.5">
                {palabras.map((p) => {
                  const texto = `${d.titulo} ${d.descripcion}`.toLowerCase().normalize("NFD").replace(/[̀-ͯ]/g, "");
                  const usada = p.split(" ").filter((w) => w.length > 3).every((w) => texto.includes(w));
                  return (
                    <Badge key={p} variant={usada ? "secondary" : "outline"} className="font-normal">
                      {usada && <CheckCircle2Icon className="text-exito" />} {p}
                    </Badge>
                  );
                })}
              </div>
            </div>
          )}
          <Field>
            <FieldLabel>Imagen al compartir</FieldLabel>
            <SelectorImagen valor={d.imagen || a.imagen} onCambio={(u) => setD({ ...d, imagen: u })} incluidas={incluidas} subidas={subidas} aspecto="aspect-[1.91/1]" />
          </Field>
          <Field orientation="horizontal" className="rounded-xl border p-4">
            <div className="flex flex-1 flex-col gap-1">
              <FieldLabel htmlFor="seo-noindex">Ocultar de Google (noindex)</FieldLabel>
              <FieldDescription>Solo para páginas que no querés que aparezcan en búsquedas.</FieldDescription>
            </div>
            <Switch id="seo-noindex" checked={d.noindex} onCheckedChange={(v) => setD({ ...d, noindex: v })} />
          </Field>
        </FieldGroup>
        <div className="flex flex-col gap-2">
          <p className="text-xs font-medium text-muted-foreground">Así se ve al compartir por WhatsApp</p>
          <div className="max-w-xs">
            <VistaWhatsApp titulo={tituloFinal} descripcion={d.descripcion} imagen={d.imagen || a.imagen} host={host} />
          </div>
        </div>
        <div className="flex flex-col gap-2">
          <p className="text-xs font-medium text-muted-foreground">Chequeos</p>
          {a.chequeos.map((c) => (
            <p key={c.texto} className="flex items-start gap-2 text-sm">
              {ICONO[c.nivel]} {c.texto}
            </p>
          ))}
        </div>
      </div>
      <SheetFooter className="mt-auto flex-row border-t p-4">
        {a.personalizado && (
          <Button
            variant="ghost"
            disabled={pendiente}
            onClick={() =>
              iniciar(async () => {
                const r = await restablecerSeoPagina(a.ruta);
                if (!r.ok) return void toast.error(r.error);
                toast.success(r.mensaje);
                onCerrar();
              })
            }
          >
            <RotateCcwIcon data-icon="inline-start" /> Restablecer
          </Button>
        )}
        <Button
          className="ml-auto"
          disabled={pendiente}
          onClick={() =>
            iniciar(async () => {
              const r = await guardarSeoPagina({ ruta: a.ruta, ...d });
              if (!r.ok) return void toast.error(r.error);
              toast.success(r.mensaje);
              onCerrar();
            })
          }
        >
          {pendiente ? <Spinner data-icon="inline-start" /> : <SaveIcon data-icon="inline-start" />}
          Guardar
        </Button>
      </SheetFooter>
    </>
  );
}

function AjustesGenerales({ seo, incluidas, subidas, sitio }: { seo: AjustesSeo; incluidas: string[]; subidas: { url: string; alt: string }[]; sitio: string }) {
  const [d, setD] = useState(seo);
  const [pendiente, iniciar] = useTransition();
  return (
    <Card>
      <CardHeader>
        <CardTitle>Configuración general</CardTitle>
        <CardDescription>Valores por defecto para todo el sitio.</CardDescription>
      </CardHeader>
      <CardContent>
        <FieldGroup>
          <Field>
            <FieldLabel htmlFor="g-titulo">Título del inicio</FieldLabel>
            <Input id="g-titulo" value={d.tituloSitio} onChange={(e) => setD({ ...d, tituloSitio: e.target.value })} />
          </Field>
          <Field>
            <FieldLabel htmlFor="g-plantilla">Plantilla de títulos</FieldLabel>
            <Input id="g-plantilla" value={d.plantilla} onChange={(e) => setD({ ...d, plantilla: e.target.value })} />
            <FieldDescription>%s se reemplaza por el título de cada página.</FieldDescription>
          </Field>
          <Field>
            <FieldLabel htmlFor="g-desc">Descripción del sitio</FieldLabel>
            <Textarea id="g-desc" value={d.descripcion} onChange={(e) => setD({ ...d, descripcion: e.target.value })} />
          </Field>
          <Field>
            <FieldLabel>Imagen general para compartir</FieldLabel>
            <FieldDescription>Si no elegís ninguna, se genera una automáticamente con el logo.</FieldDescription>
            <SelectorImagen valor={d.imagen} onCambio={(u) => setD({ ...d, imagen: u })} incluidas={incluidas} subidas={subidas} aspecto="aspect-[1.91/1]" />
          </Field>
          <div className="grid gap-4 sm:grid-cols-2">
            <Field>
              <FieldLabel htmlFor="g-google">Verificación de Google</FieldLabel>
              <Input id="g-google" value={d.googleVerificacion} onChange={(e) => setD({ ...d, googleVerificacion: e.target.value })} placeholder="Código de Search Console" />
            </Field>
            <Field>
              <FieldLabel htmlFor="g-bing">Verificación de Bing</FieldLabel>
              <Input id="g-bing" value={d.bingVerificacion} onChange={(e) => setD({ ...d, bingVerificacion: e.target.value })} placeholder="msvalidate.01" />
            </Field>
          </div>
          <Field orientation="horizontal" className="rounded-xl border p-4">
            <div className="flex flex-1 flex-col gap-1">
              <FieldLabel htmlFor="g-indexar">Permitir que Google indexe el sitio</FieldLabel>
              <FieldDescription>Apagalo solo mientras el sitio esté en construcción.</FieldDescription>
            </div>
            <Switch id="g-indexar" checked={d.indexar} onCheckedChange={(v) => setD({ ...d, indexar: v })} />
          </Field>
          <Button
            className="self-start"
            disabled={pendiente}
            onClick={() =>
              iniciar(async () => {
                const r = await guardarAjustes("seo", d);
                if (r.ok) toast.success(r.mensaje);
                else toast.error(r.error);
              })
            }
          >
            {pendiente && <Spinner data-icon="inline-start" />}
            Guardar
          </Button>
          <p className="text-xs text-muted-foreground">Dominio configurado: {sitio}</p>
        </FieldGroup>
      </CardContent>
    </Card>
  );
}

function Redirecciones({ lista }: { lista: Redireccion[] }) {
  const [d, setD] = useState({ desde: "", hacia: "", codigo: 301 as 301 | 302 });
  const [pendiente, iniciar] = useTransition();
  return (
    <div className="grid gap-4 xl:grid-cols-[22rem_1fr]">
      <Card className="self-start">
        <CardHeader>
          <CardTitle>Nueva redirección</CardTitle>
          <CardDescription>Para links viejos o páginas que cambiaron de dirección. Al cambiar la URL de un servicio se crea sola.</CardDescription>
        </CardHeader>
        <CardContent>
          <form
            onSubmit={(e) => {
              e.preventDefault();
              iniciar(async () => {
                const r = await guardarRedireccion(d);
                if (!r.ok) return void toast.error(r.error);
                toast.success(r.mensaje);
                setD({ desde: "", hacia: "", codigo: 301 });
              });
            }}
          >
            <FieldGroup>
              <Field>
                <FieldLabel htmlFor="r-desde">Desde</FieldLabel>
                <Input id="r-desde" value={d.desde} onChange={(e) => setD({ ...d, desde: e.target.value })} placeholder="/cortinas-blackout" required />
              </Field>
              <Field>
                <FieldLabel htmlFor="r-hacia">Hacia</FieldLabel>
                <Input id="r-hacia" value={d.hacia} onChange={(e) => setD({ ...d, hacia: e.target.value })} placeholder="/cortinas" required />
              </Field>
              <Field>
                <FieldLabel>Tipo</FieldLabel>
                <Select value={String(d.codigo)} onValueChange={(v) => setD({ ...d, codigo: Number(v) as 301 | 302 })}>
                  <SelectTrigger className="w-full">
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectGroup>
                      <SelectItem value="301">301 · Permanente (recomendado)</SelectItem>
                      <SelectItem value="302">302 · Temporal</SelectItem>
                    </SelectGroup>
                  </SelectContent>
                </Select>
              </Field>
              <Button type="submit" disabled={pendiente} className="self-start">
                {pendiente ? <Spinner data-icon="inline-start" /> : <PlusIcon data-icon="inline-start" />}
                Crear
              </Button>
            </FieldGroup>
          </form>
        </CardContent>
      </Card>
      <Card className="gap-0 overflow-hidden py-0">
        {lista.length === 0 ? (
          <p className="p-10 text-center text-sm text-muted-foreground">No hay redirecciones.</p>
        ) : (
          <Table>
            <TableHeader>
              <TableRow className="bg-muted/50 hover:bg-muted/50">
                <TableHead className="pl-4">Desde</TableHead>
                <TableHead>Hacia</TableHead>
                <TableHead className="hidden sm:table-cell">Tipo</TableHead>
                <TableHead className="hidden md:table-cell">Visitas</TableHead>
                <TableHead className="w-12 pr-4" />
              </TableRow>
            </TableHeader>
            <TableBody>
              {lista.map((r) => (
                <TableRow key={r.id}>
                  <TableCell className="pl-4 font-mono text-xs">{r.desde}</TableCell>
                  <TableCell className="font-mono text-xs">{r.hacia}</TableCell>
                  <TableCell className="hidden sm:table-cell">
                    <Badge variant="outline">{r.codigo}</Badge>
                  </TableCell>
                  <TableCell className="hidden text-muted-foreground md:table-cell">
                    {r.visitas} · {haceCuanto(r.creado)}
                  </TableCell>
                  <TableCell className="pr-4">
                    <Button
                      size="icon-sm"
                      variant="ghost"
                      aria-label="Eliminar"
                      onClick={() =>
                        iniciar(async () => {
                          const res = await eliminarRedireccion(r.id);
                          if (res.ok) toast.success(res.mensaje);
                          else toast.error(res.error);
                        })
                      }
                    >
                      <Trash2Icon />
                    </Button>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        )}
      </Card>
    </div>
  );
}

function Avanzado({ seo }: { seo: AjustesSeo }) {
  const [d, setD] = useState(seo);
  const [pendiente, iniciar] = useTransition();
  return (
    <div className="grid gap-4 xl:grid-cols-2">
      <Card>
        <CardHeader>
          <CardTitle>robots.txt</CardTitle>
          <CardDescription>
            Ya se bloquean /admin, /api y los presupuestos privados, y se permite a buscadores y asistentes de IA. Agregá líneas “Disallow: /ruta” si necesitás ocultar algo más.
          </CardDescription>
        </CardHeader>
        <CardContent className="flex flex-col gap-3">
          <Textarea value={d.robotsExtra} onChange={(e) => setD({ ...d, robotsExtra: e.target.value })} className="min-h-32 font-mono text-xs" placeholder="Disallow: /alguna-ruta" />
        </CardContent>
      </Card>
      <Card>
        <CardHeader>
          <CardTitle>llms.txt</CardTitle>
          <CardDescription>Resumen del negocio para ChatGPT, Gemini, Claude y Perplexity. Si lo dejás vacío se arma solo con tus datos y servicios.</CardDescription>
        </CardHeader>
        <CardContent className="flex flex-col gap-3">
          <Textarea value={d.llms} onChange={(e) => setD({ ...d, llms: e.target.value })} className="min-h-32 font-mono text-xs" placeholder="(automático)" />
          <Button asChild variant="link" className="h-auto self-start px-0">
            <a href="/llms.txt" target="_blank" rel="noopener">
              Ver el llms.txt actual <ExternalLinkIcon data-icon="inline-end" />
            </a>
          </Button>
        </CardContent>
      </Card>
      <Button
        className="self-start"
        disabled={pendiente}
        onClick={() =>
          iniciar(async () => {
            const r = await guardarAjustes("seo", d);
            if (r.ok) toast.success(r.mensaje);
            else toast.error(r.error);
          })
        }
      >
        {pendiente && <Spinner data-icon="inline-start" />}
        Guardar
      </Button>
    </div>
  );
}
