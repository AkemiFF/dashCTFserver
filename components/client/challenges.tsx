import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"

export function Challenges() {
  const challenges = [
    {
      title: "SQL Injection Basics",
      category: "Web Security",
      difficulty: "Easy",
      points: 100,
      completions: 1234,
    },
    {
      title: "Buffer Overflow Attack",
      category: "Binary Exploitation",
      difficulty: "Hard",
      points: 500,
      completions: 145,
    },
    {
      title: "Password Cracking",
      category: "Cryptography",
      difficulty: "Medium",
      points: 250,
      completions: 678,
    },
  ]

  return (
    <section className="py-20 px-4">
      <div className="container mx-auto">
        <div className="flex justify-between items-center mb-12">
          <h2 className="text-3xl font-bold text-white">Featured Challenges</h2>
          <Button variant="outline" className="border-purple-500 text-purple-400">
            View All Challenges
          </Button>
        </div>
        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
          {challenges.map((challenge, index) => (
            <div
              key={index}
              className="rounded-xl bg-white/5 border border-white/10 p-6 hover:border-purple-500/50 transition-all"
            >
              <div className="flex justify-between items-start mb-4">
                <h3 className="text-xl font-semibold text-white">{challenge.title}</h3>
                <Badge variant="outline" className="bg-purple-500/10 text-purple-400 border-purple-500/20">
                  {challenge.points} pts
                </Badge>
              </div>
              <div className="space-y-4">
                <div className="flex items-center gap-2">
                  <Badge variant="secondary">{challenge.category}</Badge>
                  <Badge
                    variant="outline"
                    className={
                      challenge.difficulty === "Easy"
                        ? "text-green-400"
                        : challenge.difficulty === "Medium"
                          ? "text-yellow-400"
                          : "text-red-400"
                    }
                  >
                    {challenge.difficulty}
                  </Badge>
                </div>
                <div className="text-sm text-gray-400">{challenge.completions} completions</div>
                <Button className="w-full bg-purple-600 hover:bg-purple-700">Start Challenge</Button>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  )
}

