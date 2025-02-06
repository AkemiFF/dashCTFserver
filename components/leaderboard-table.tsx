import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { Badge } from "@/components/ui/badge"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"

const leaderboardData = [
  { rank: 1, username: "eth1calH4ck3r", points: 15000, badges: ["Master", "Speed Demon"] },
  { rank: 2, username: "cyb3rN1nj4", points: 14500, badges: ["Expert", "Bug Hunter"] },
  { rank: 3, username: "securityGuru", points: 14000, badges: ["Expert", "CTF Champion"] },
  { rank: 4, username: "h4ckM4st3r", points: 13500, badges: ["Advanced", "Web Wizard"] },
  { rank: 5, username: "cryptoQueen", points: 13000, badges: ["Advanced", "Crypto Expert"] },
]

export function LeaderboardTable() {
  return (
    <Table>
      <TableHeader>
        <TableRow>
          <TableHead className="w-[100px]">Rang</TableHead>
          <TableHead>Utilisateur</TableHead>
          <TableHead>Points</TableHead>
          <TableHead>Badges</TableHead>
        </TableRow>
      </TableHeader>
      <TableBody>
        {leaderboardData.map((user) => (
          <TableRow key={user.rank} className="hover:bg-muted/50 transition-colors">
            <TableCell className="font-medium">{user.rank}</TableCell>
            <TableCell>
              <div className="flex items-center space-x-2">
                <Avatar className="h-8 w-8">
                  <AvatarImage src={`https://avatars.dicebear.com/api/identicon/${user.username}.svg`} />
                  <AvatarFallback>{user.username.slice(0, 2).toUpperCase()}</AvatarFallback>
                </Avatar>
                <span>{user.username}</span>
              </div>
            </TableCell>
            <TableCell>{user.points.toLocaleString()}</TableCell>
            <TableCell>
              <div className="flex flex-wrap gap-1">
                {user.badges.map((badge) => (
                  <Badge key={badge} variant="secondary" className="bg-primary/20 text-primary">
                    {badge}
                  </Badge>
                ))}
              </div>
            </TableCell>
          </TableRow>
        ))}
      </TableBody>
    </Table>
  )
}

