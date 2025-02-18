"use client"
import { BannedKeywords } from "@/components/admin/banned-keywords"
import Layout from "@/components/admin/layout"
import { ReportedComments } from "@/components/admin/reported-comments"
import { ReportedPosts } from "@/components/admin/reported-posts"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"

export default function AlertsPage() {
  return (
    <Layout>
      <div className="container mx-auto px-4 py-8">
        <h1 className="text-4xl font-bold mb-8">Alertes et Modération</h1>
        <Tabs defaultValue="posts" className="space-y-4">
          <TabsList>
            <TabsTrigger value="posts">Publications signalées</TabsTrigger>
            <TabsTrigger value="comments">Commentaires signalés</TabsTrigger>
            <TabsTrigger value="keywords">Mots-clés interdits</TabsTrigger>
          </TabsList>
          <TabsContent value="posts">
            <Card>
              <CardHeader>
                <CardTitle>Publications signalées</CardTitle>
                <CardDescription>Gérez les publications signalées par les utilisateurs</CardDescription>
              </CardHeader>
              <CardContent>
                <ReportedPosts />
              </CardContent>
            </Card>
          </TabsContent>
          <TabsContent value="comments">
            <Card>
              <CardHeader>
                <CardTitle>Commentaires signalés</CardTitle>
                <CardDescription>Gérez les commentaires signalés par les utilisateurs</CardDescription>
              </CardHeader>
              <CardContent>
                <ReportedComments />
              </CardContent>
            </Card>
          </TabsContent>
          <TabsContent value="keywords">
            <Card>
              <CardHeader>
                <CardTitle>Mots-clés interdits</CardTitle>
                <CardDescription>Gérez la liste des mots-clés interdits sur la plateforme</CardDescription>
              </CardHeader>
              <CardContent>
                <BannedKeywords />
              </CardContent>
            </Card>
          </TabsContent>
        </Tabs>
      </div>
    </Layout>
  )
}

