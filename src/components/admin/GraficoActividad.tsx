"use client";

import { Bar, BarChart, CartesianGrid, XAxis, YAxis } from "recharts";
import { ChartContainer, ChartLegend, ChartLegendContent, ChartTooltip, ChartTooltipContent, type ChartConfig } from "@/components/ui/chart";

const config = {
  consultas: { label: "Consultas", color: "var(--chart-2)" },
  aceptados: { label: "Presupuestos aceptados", color: "var(--chart-1)" },
} satisfies ChartConfig;

export function GraficoActividad({ datos }: { datos: { mes: string; consultas: number; aceptados: number }[] }) {
  return (
    <ChartContainer config={config} className="aspect-auto h-[260px] w-full">
      <BarChart data={datos} margin={{ left: -20, right: 8, top: 8 }} barGap={4}>
        <CartesianGrid vertical={false} strokeDasharray="3 3" />
        <XAxis dataKey="mes" tickLine={false} axisLine={false} tickMargin={8} className="capitalize" />
        <YAxis allowDecimals={false} tickLine={false} axisLine={false} width={40} />
        <ChartTooltip cursor={{ fill: "var(--muted)" }} content={<ChartTooltipContent />} />
        <ChartLegend content={<ChartLegendContent />} />
        <Bar dataKey="consultas" fill="var(--color-consultas)" radius={[6, 6, 0, 0]} maxBarSize={28} />
        <Bar dataKey="aceptados" fill="var(--color-aceptados)" radius={[6, 6, 0, 0]} maxBarSize={28} />
      </BarChart>
    </ChartContainer>
  );
}
