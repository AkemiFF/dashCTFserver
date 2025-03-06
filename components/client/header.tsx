import { Button } from "@/components/ui/button"
import { Shield } from "lucide-react"
import Link from "next/link"

export function Header() {
  return (
    <header className="fixed top-0 w-full z-50 bg-black/20 backdrop-blur-sm border-b border-white/10">
      <div className="container mx-auto px-4 py-4">
        <div className="flex items-center justify-between">
          <Link href="/users/" className="flex items-center space-x-2">
            <Shield className="w-8 h-8 text-purple-500" />
            <span className="text-2xl font-bold bg-gradient-to-r from-purple-400 to-blue-500 text-transparent bg-clip-text">
              HackiTech
            </span>
          </Link>

          <nav className="hidden md:flex items-center space-x-8">
            <Link href="/users/paths" className="text-sm text-gray-300 hover:text-white transition-colors">
              Learning Paths
            </Link>
            <Link href="/users/challenges" className="text-sm text-gray-300 hover:text-white transition-colors">
              Challenges
            </Link>
            <Link href="/users/pricing" className="text-sm text-gray-300 hover:text-white transition-colors">
              Plans
            </Link>
            <Link href="/users/leaderboard" className="text-sm text-gray-300 hover:text-white transition-colors">
              Leaderboard
            </Link>
          </nav>

          <div className="flex items-center space-x-4">
            <Link href="/users/login">
              <Button variant="ghost" className="text-white hover:bg-white/10">
                Sign in
              </Button>
            </Link>
            <Link href="/users/signup">
              <Button className="bg-purple-600 hover:bg-purple-700 text-white">Sign up</Button>
            </Link>
          </div>
        </div>
      </div>
    </header>
  )
}

