import { Button } from "@/components/ui/button"
import { Shield, Terminal, Trophy } from "lucide-react"
import { AnimatedBackground } from "./AnimatedBackground"

export function Hero() {
  return (
    <section className="pt-32 pb-20 px-4">

      <div className="container mx-auto">
        <div className="grid lg:grid-cols-2 gap-12 items-center">
          <div className="space-y-8">
            <h1 className="text-5xl font-bold leading-tight text-white">
              Master Ethical Hacking Through
              <span className="bg-gradient-to-r from-purple-400 to-blue-500 text-transparent bg-clip-text">
                {" "}
                Interactive Learning
              </span>
            </h1>
            <p className="text-xl text-gray-400 max-w-2xl">
              Join our community of ethical hackers. Learn through hands-on challenges, capture the flag events, and
              interactive courses designed by security experts.
            </p>
            <div className="flex flex-wrap gap-4">
              <Button size="lg" className="bg-purple-600 hover:bg-purple-700 text-white">
                Start Learning
              </Button>
              <Button size="lg" variant="outline" className="border-purple-500 text-purple-400 hover:bg-purple-500/10">
                View Challenges
              </Button>
            </div>
            <div className="flex items-center gap-8 pt-4">
              <div className="flex items-center gap-2">
                <Terminal className="w-5 h-5 text-purple-500" />
                <span className="text-gray-400">100+ Challenges</span>
              </div>
              <div className="flex items-center gap-2">
                <Shield className="w-5 h-5 text-purple-500" />
                <span className="text-gray-400">Expert-Led Content</span>
              </div>
              <div className="flex items-center gap-2">
                <Trophy className="w-5 h-5 text-purple-500" />
                <span className="text-gray-400">Global Rankings</span>
              </div>
            </div>
          </div>
          <div className="relative">
            <div className="relative z-10 animate-float">
              <img
                src="/hero.png"
                alt="Cybersecurity Illustration"
                className="w-full h-auto"
              />
            </div>
            <div className="absolute inset-0 bg-gradient-to-r from-purple-500 to-blue-500 blur-[120px] opacity-25" />
          </div>
        </div>
      </div>
      <AnimatedBackground />
    </section>
  )
}

