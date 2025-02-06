"use client"

import { Area, AreaChart, CartesianGrid, XAxis, YAxis } from "recharts"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { type ChartConfig, ChartContainer, ChartTooltip, ChartTooltipContent } from "@/components/ui/chart"

const chartData = [
  { month: "Jan", actuals: 65000, projections: 80000 },
  { month: "Feb", actuals: 95000, projections: 100000 },
  { month: "Mar", actuals: 85000, projections: 90000 },
  { month: "Apr", actuals: 105000, projections: 95000 },
  { month: "May", actuals: 90000, projections: 110000 },
  { month: "Jun", actuals: 120000, projections: 115000 },
  { month: "Jul", actuals: 110000, projections: 120000 },
  { month: "Aug", actuals: 130000, projections: 125000 },
  { month: "Sep", actuals: 125000, projections: 130000 },
  { month: "Oct", actuals: 140000, projections: 135000 },
  { month: "Nov", actuals: 135000, projections: 140000 },
  { month: "Dec", actuals: 160000, projections: 145000 },
]

const chartConfig = {
  actuals: {
    label: "Actuals",
    color: "hsl(var(--primary))",
  },
  projections: {
    label: "Projections",
    color: "hsl(var(--muted))",
  },
} satisfies ChartConfig

export function ChartArea() {
  return (
    <Card>
      <CardHeader className="flex flex-row items-center justify-between">
        <CardTitle>Projections vs Actuals</CardTitle>
      </CardHeader>
      <CardContent>
        <ChartContainer config={chartConfig} className="h-[300px]">
          <AreaChart data={chartData} margin={{ top: 20, right: 0, bottom: 0, left: 0 }}>
            <defs>
              <linearGradient id="actuals" x1="0" y1="0" x2="0" y2="1">
                <stop offset="5%" stopColor="hsl(var(--primary))" stopOpacity={0.2} />
                <stop offset="95%" stopColor="hsl(var(--primary))" stopOpacity={0} />
              </linearGradient>
              <linearGradient id="projections" x1="0" y1="0" x2="0" y2="1">
                <stop offset="5%" stopColor="hsl(var(--muted))" stopOpacity={0.2} />
                <stop offset="95%" stopColor="hsl(var(--muted))" stopOpacity={0} />
              </linearGradient>
            </defs>
            <CartesianGrid strokeDasharray="3 3" stroke="hsl(var(--border))" vertical={false} />
            <XAxis dataKey="month" stroke="hsl(var(--muted-foreground))" tickLine={false} axisLine={false} />
            <YAxis
              stroke="hsl(var(--muted-foreground))"
              tickLine={false}
              axisLine={false}
              tickFormatter={(value) => `${value / 1000}k`}
            />
            <ChartTooltip content={<ChartTooltipContent />} />
            <Area
              type="monotone"
              dataKey="projections"
              stroke="hsl(var(--muted))"
              fillOpacity={1}
              fill="url(#projections)"
            />
            <Area type="monotone" dataKey="actuals" stroke="hsl(var(--primary))" fillOpacity={1} fill="url(#actuals)" />
          </AreaChart>
        </ChartContainer>
      </CardContent>
    </Card>
  )
}

