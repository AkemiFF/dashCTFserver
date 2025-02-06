import { ChartArea } from "@/components/chart-area"
import { ChartBar } from "@/components/chart-bar"
import { ChartLine } from "@/components/chart-line"
import { StatsCard } from "@/components/stats-card"
import Layout from "@/components/layout"

export default function DashboardPage() {
  return (
    <Layout>
      <div className="space-y-6 max-w-[1400px] mx-auto">
        <div className="flex items-center justify-between">
          <h1 className="text-2xl font-semibold">Dashboard</h1>
          <div className="text-sm text-muted-foreground">01/27/2025</div>
        </div>

        <div className="stats-grid">
          <StatsCard
            title="Participants"
            value="36,254"
            change={{ value: 5.27, trend: "up" }}
            label="Since last month"
          />
          <StatsCard
            title="Challenges Completed"
            value="5,543"
            change={{ value: 1.08, trend: "down" }}
            label="Since last month"
          />
          <StatsCard title="Revenue" value="$6,254" change={{ value: 7.0, trend: "down" }} label="Since last month" />
          <StatsCard title="Growth" value="+30.56%" change={{ value: 4.87, trend: "up" }} label="Since last month" />
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          <div className="chart-container hover-card">
            <ChartArea />
          </div>
          <div className="chart-container hover-card">
            <ChartBar />
          </div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          <div className="chart-container hover-card">
            <ChartLine />
          </div>
          <div className="chart-container hover-card">
            <h3 className="text-lg font-medium mb-4">Revenue by Location</h3>
            {/* World map visualization would go here */}
          </div>
        </div>
      </div>
    </Layout>
  )
}

