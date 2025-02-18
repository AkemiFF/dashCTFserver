import Layout from "@/components/admin/layout"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"

const users = [
  { id: 1, username: "hacker1", points: 9500, rank: "A", completedChallenges: 15 },
  { id: 2, username: "cyberninja", points: 12000, rank: "S", completedChallenges: 20 },
  { id: 3, username: "newbie123", points: 2000, rank: "C", completedChallenges: 5 },
  // Add more mock users as needed
]

export default function UsersPage() {
  return (
    <Layout>
      <div className="max-w-6xl mx-auto">
        <h1 className="text-4xl font-bold mb-8 animate-glitch">Gestion des Utilisateurs</h1>
        <Card>
          <CardHeader>
            <CardTitle>Liste des Utilisateurs</CardTitle>
          </CardHeader>
          <CardContent>
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Nom d'utilisateur</TableHead>
                  <TableHead>Points</TableHead>
                  <TableHead>Rang</TableHead>
                  <TableHead>Défis Complétés</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {users.map((user) => (
                  <TableRow key={user.id}>
                    <TableCell className="font-medium">{user.username}</TableCell>
                    <TableCell>{user.points}</TableCell>
                    <TableCell>{user.rank}</TableCell>
                    <TableCell>{user.completedChallenges}</TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </CardContent>
        </Card>
      </div>
    </Layout>
  )
}

