import Layout from "@/components/admin/layout"
import { LeaderboardTable } from "@/components/admin/leaderboard-table"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"

export default function LeaderboardPage() {
  return (
    <Layout>
      <div className="space-y-6 max-w-[1200px] mx-auto">
        <h1 className="text-3xl font-bold tracking-tight">Classement</h1>
        <Card className="bg-card/50 backdrop-blur-xl">
          <CardHeader>
            <CardTitle>Top Hackers</CardTitle>
          </CardHeader>
          <CardContent>
            <Tabs defaultValue="global" className="space-y-4">
              <TabsList>
                <TabsTrigger value="global">Global</TabsTrigger>
                <TabsTrigger value="monthly">Mensuel</TabsTrigger>
                <TabsTrigger value="weekly">Hebdomadaire</TabsTrigger>
              </TabsList>
              <TabsContent value="global">
                <LeaderboardTable />
              </TabsContent>
              <TabsContent value="monthly">
                <LeaderboardTable />
              </TabsContent>
              <TabsContent value="weekly">
                <LeaderboardTable />
              </TabsContent>
            </Tabs>
          </CardContent>
        </Card>
      </div>
    </Layout>
  )
}

