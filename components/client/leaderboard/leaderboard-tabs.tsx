"use client"

import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { LeaderboardTable } from "./leaderboard-table"
import { useState } from "react"

export function LeaderboardTabs() {
  const [selectedRank, setSelectedRank] = useState("all")

  const ranks = [
    { id: "all", label: "Tous les rangs" },
    { id: "S", label: "Rang S", description: "Top 5" },
    { id: "A", label: "Rang A", description: "8k - 10k pts" },
    { id: "B", label: "Rang B", description: "4k - 8k pts" },
    { id: "C", label: "Rang C", description: "0 - 4k pts" },
  ]

  return (
    <Tabs defaultValue="all" className="space-y-8" onValueChange={setSelectedRank}>
      <TabsList className="bg-white/5 border border-white/10 p-1">
        {ranks.map((rank) => (
          <TabsTrigger
            key={rank.id}
            value={rank.id}
            className={`
              data-[state=active]:bg-purple-500 
              data-[state=active]:text-white 
              text-gray-400
              hover:text-white
              transition-colors
            `}
          >
            {rank.label}
          </TabsTrigger>
        ))}
      </TabsList>
      {ranks.map((rank) => (
        <TabsContent key={rank.id} value={rank.id}>
          <LeaderboardTable rank={rank.id} />
        </TabsContent>
      ))}
    </Tabs>
  )
}

