import OsintFramework from "@/components/osint/osint-framework"
import ParticleBackground from "@/components/osint/particle-background"
import { Toaster } from "@/components/ui/toaster"

export default function Home() {
  return (
    <main className="min-h-screen">
      <ParticleBackground />
      <OsintFramework />
      <Toaster />
    </main>
  )
}
