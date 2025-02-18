"use client"

import * as React from "react"
import { TrendingUp } from "lucide-react"
import { Label, Pie, PieChart } from "recharts"

import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { type ChartConfig, ChartContainer, ChartTooltip, ChartTooltipContent } from "@/components/ui/chart"

const chartData = [
  { category: "web", challenges: 75, fill: "var(--color-web)" },
  { category: "crypto", challenges: 50, fill: "var(--color-crypto)" },
  { category: "forensics", challenges: 87, fill: "var(--color-forensics)" },
  { category: "pwn", challenges: 63, fill: "var(--color-pwn)" },
  { category: "reverse", challenges: 70, fill: "var(--color-reverse)" },
]

const chartConfig = {
  challenges: {
    label: "Challenges",
  },
  web: {
    label: "Web",
    color: "hsl(var(--chart-1))",
  },
  crypto: {
    label: "Crypto",
    color: "hsl(var(--chart-2))",
  },
  forensics: {
    label: "Forensics",
    color: "hsl(var(--chart-3))",
  },
  pwn: {
    label: "Pwn",
    color: "hsl(var(--chart-4))",
  },
  reverse: {
    label: "Reverse",
    color: "hsl(var(--chart-5))",
  },
} satisfies ChartConfig

export function ChartPie() {
  const totalChallenges = React.useMemo(() => {
    return chartData.reduce((acc, curr) => acc + curr.challenges, 0)
  }, [])

  return (
    <Card className="flex flex-col">
      <CardHeader className="items-center pb-0">
        <CardTitle>Répartition des challenges</CardTitle>
        <CardDescription>Par catégorie</CardDescription>
      </CardHeader>
      <CardContent className="flex-1 pb-0">
        <ChartContainer config={chartConfig} className="mx-auto aspect-square max-h-[250px]">
          <PieChart>
            <ChartTooltip cursor={false} content={<ChartTooltipContent hideLabel />} />
            <Pie data={chartData} dataKey="challenges" nameKey="category" innerRadius={60} strokeWidth={5}>
              <Label
                content={({ viewBox }) => {
                  if (viewBox && "cx" in viewBox && "cy" in viewBox) {
                    return (
                      <text x={viewBox.cx} y={viewBox.cy} textAnchor="middle" dominantBaseline="middle">
                        <tspan x={viewBox.cx} y={viewBox.cy} className="fill-foreground text-3xl font-bold">
                          {totalChallenges.toLocaleString()}
                        </tspan>
                        <tspan x={viewBox.cx} y={(viewBox.cy || 0) + 24} className="fill-muted-foreground">
                          Challenges
                        </tspan>
                      </text>
                    )
                  }
                }}
              />
            </Pie>
          </PieChart>
        </ChartContainer>
      </CardContent>
      <CardFooter className="flex-col gap-2 text-sm">
        <div className="flex items-center gap-2 font-medium leading-none">
          Augmentation de 5.2% des challenges Web <TrendingUp className="h-4 w-4" />
        </div>
        <div className="leading-none text-muted-foreground">Répartition actuelle des challenges</div>
      </CardFooter>
    </Card>
  )
}

