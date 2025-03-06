import { Challenges } from "@/components/client/challenges"
import { Features } from "@/components/client/features"
import { Footer } from "@/components/client/footer"
import { Hero } from "@/components/client/hero"
import { Leaderboard } from "@/components/client/leaderboard"
import { LearningPaths } from "@/components/client/learning-paths"

export default function Home() {
  return (
    <div className="min-h-screen bg-gradient-to-br from-[#0A0A1B] via-[#0F1C3F] to-[#0A0A1B]">
      <div className="relative overflow-hidden">
        {/* <div className="absolute inset-0 bg-[url('/grid.svg')] bg-center [mask-image:linear-gradient(180deg,white,rgba(255,255,255,0))]" /> */}
        <main>
          <Hero />
          <Features />
          <LearningPaths />
          <Challenges />
          <Leaderboard />
        </main>
        <Footer />
      </div>
    </div>
  )
}

