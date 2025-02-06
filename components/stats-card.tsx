import { Card } from "@/components/ui/card"

interface StatsCardProps {
  title: string
  value: string | number
  change: {
    value: number
    trend: "up" | "down"
  }
  label: string
}

export function StatsCard({ title, value, change, label }: StatsCardProps) {
  return (
    <Card className="p-6 hover-card bg-card/50 backdrop-blur-xl">
      <h3 className="text-sm font-medium text-muted-foreground mb-4">{title}</h3>
      <div className="text-2xl font-bold mb-2">{value}</div>
      <div className="flex items-center space-x-2">
        <span className={`text-sm font-medium ${change.trend === "up" ? "text-emerald-500" : "text-rose-500"}`}>
          {change.trend === "up" ? "↑" : "↓"} {Math.abs(change.value)}%
        </span>
        <span className="text-sm text-muted-foreground">{label}</span>
      </div>
    </Card>
  )
}

