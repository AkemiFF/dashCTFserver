import { Shield } from "lucide-react"

export function Footer() {
  return (
    <footer className="bg-black/40 border-t border-white/10">
      <div className="container mx-auto px-4 py-12">
        <div className="grid md:grid-cols-4 gap-8">
          <div className="space-y-4">
            <div className="flex items-center space-x-2">
              <Shield className="w-8 h-8 text-purple-500" />
              <span className="text-2xl font-bold bg-gradient-to-r from-purple-400 to-blue-500 text-transparent bg-clip-text">
                HackiTech
              </span>
            </div>
            <p className="text-gray-400">Learn ethical hacking through practical experience</p>
          </div>
          <div>
            <h3 className="text-white font-semibold mb-4">Platform</h3>
            <ul className="space-y-2 text-gray-400">
              <li>Learning Paths</li>
              <li>Challenges</li>
              <li>CTF Events</li>
              <li>Leaderboard</li>
            </ul>
          </div>
          <div>
            <h3 className="text-white font-semibold mb-4">Community</h3>
            <ul className="space-y-2 text-gray-400">
              <li>Discord</li>
              <li>Forum</li>
              <li>Blog</li>
              <li>Newsletter</li>
            </ul>
          </div>
          <div>
            <h3 className="text-white font-semibold mb-4">Legal</h3>
            <ul className="space-y-2 text-gray-400">
              <li>Terms of Service</li>
              <li>Privacy Policy</li>
              <li>Cookie Policy</li>
              <li>Responsible Disclosure</li>
            </ul>
          </div>
        </div>
        <div className="mt-12 pt-8 border-t border-white/10 text-center text-gray-400">
          <p>&copy; 2024 HackiTech. All rights reserved.</p>
        </div>
      </div>
    </footer>
  )
}

