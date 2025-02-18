"use client"

import { TrendingUp } from "lucide-react"
import { Bar, BarChart, CartesianGrid, XAxis } from "recharts"

import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import {
  type ChartConfig,
  ChartContainer,
  ChartLegend,
  ChartLegendContent,
  ChartTooltip,
  ChartTooltipContent,
} from "@/components/ui/chart"

const chartData = [
  { month: "Janvier", facile: 18, moyen: 8, difficile: 4 },
  { month: "Février", facile: 30, moyen: 20, difficile: 10 },
  { month: "Mars", facile: 23, moyen: 12, difficile: 7 },
  { month: "Avril", facile: 27, moyen: 19, difficile: 11 },
  { month: "Mai", facile: 30, moyen: 23, difficile: 13 },
  { month: "Juin", facile: 31, moyen: 24, difficile: 14 },
]

const chartConfig = {
  facile: {
    label: "Facile",
    color: "hsl(var(--chart-1))",
  },
  moyen: {
    label: "Moyen",
    color: "hsl(var(--chart-2))",
  },
  difficile: {
    label: "Difficile",
    color: "hsl(var(--chart-3))",
  },
} satisfies ChartConfig

export function ChartBar() {
  return (
    <Card>
      <CardHeader>
        <CardTitle>Répartition des challenges</CardTitle>
        <CardDescription>Par niveau de difficulté</CardDescription>
      </CardHeader>
      <CardContent>
        <ChartContainer config={chartConfig}>
          <BarChart accessibilityLayer data={chartData}>
            <CartesianGrid vertical={false} />
            <XAxis
              dataKey="month"
              tickLine={false}
              tickMargin={10}
              axisLine={false}
              tickFormatter={(value) => value.slice(0, 3)}
            />
            <ChartTooltip content={<ChartTooltipContent hideLabel />} />
            <ChartLegend content={<ChartLegendContent />} />
            <Bar dataKey="facile" stackId="a" fill="var(--color-facile)" radius={[4, 4, 0, 0]} />
            <Bar dataKey="moyen" stackId="a" fill="var(--color-moyen)" radius={[0, 0, 0, 0]} />
            <Bar dataKey="difficile" stackId="a" fill="var(--color-difficile)" radius={[0, 0, 4, 4]} />
          </BarChart>
        </ChartContainer>
      </CardContent>
      <CardFooter className="flex-col items-start gap-2 text-sm">
        <div className="flex gap-2 font-medium leading-none">
          Augmentation de 5.2% des challenges difficiles <TrendingUp className="h-4 w-4" />
        </div>
        <div className="leading-none text-muted-foreground">Janvier - Juin 2024</div>
      </CardFooter>
    </Card>
  )
}

