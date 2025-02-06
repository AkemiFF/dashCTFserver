"use client"

import { TrendingUp } from "lucide-react"
import { CartesianGrid, Line, LineChart, XAxis } from "recharts"

import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { type ChartConfig, ChartContainer, ChartTooltip, ChartTooltipContent } from "@/components/ui/chart"

const chartData = [
  { month: "Janvier", participants: 186, flags: 80 },
  { month: "Février", participants: 305, flags: 200 },
  { month: "Mars", participants: 237, flags: 120 },
  { month: "Avril", participants: 273, flags: 190 },
  { month: "Mai", participants: 309, flags: 230 },
  { month: "Juin", participants: 314, flags: 240 },
]

const chartConfig = {
  participants: {
    label: "Participants",
    color: "hsl(var(--chart-1))",
  },
  flags: {
    label: "Flags capturés",
    color: "hsl(var(--chart-2))",
  },
} satisfies ChartConfig

export function ChartLine() {
  return (
    <Card>
      <CardHeader>
        <CardTitle>Activité CTF</CardTitle>
        <CardDescription>Janvier - Juin 2024</CardDescription>
      </CardHeader>
      <CardContent>
        <ChartContainer config={chartConfig}>
          <LineChart
            accessibilityLayer
            data={chartData}
            margin={{
              left: 12,
              right: 12,
            }}
          >
            <CartesianGrid vertical={false} />
            <XAxis
              dataKey="month"
              tickLine={false}
              axisLine={false}
              tickMargin={8}
              tickFormatter={(value) => value.slice(0, 3)}
            />
            <ChartTooltip cursor={false} content={<ChartTooltipContent />} />
            <Line
              dataKey="participants"
              type="monotone"
              stroke="var(--color-participants)"
              strokeWidth={2}
              dot={false}
            />
            <Line dataKey="flags" type="monotone" stroke="var(--color-flags)" strokeWidth={2} dot={false} />
          </LineChart>
        </ChartContainer>
      </CardContent>
      <CardFooter>
        <div className="flex w-full items-start gap-2 text-sm">
          <div className="grid gap-2">
            <div className="flex items-center gap-2 font-medium leading-none">
              Augmentation de 5.2% des flags capturés <TrendingUp className="h-4 w-4" />
            </div>
            <div className="flex items-center gap-2 leading-none text-muted-foreground">
              Progression sur les 6 derniers mois
            </div>
          </div>
        </div>
      </CardFooter>
    </Card>
  )
}

