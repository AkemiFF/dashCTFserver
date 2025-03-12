"use client"

import Link from "next/link"
import { motion, AnimatePresence } from "framer-motion"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { usePathname } from "next/navigation"
import { Bell, Home, Search, MessageCircle, User, Menu, X, Trophy, Terminal, Shield, LogOut } from "lucide-react"
import { useState } from "react"
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { Badge } from "@/components/ui/badge"

export function SiteHeader({ unreadNotifications }: { unreadNotifications: number }) {
  const pathname = usePathname()
  const [showMobileMenu, setShowMobileMenu] = useState(false)
  const [showSearch, setShowSearch] = useState(false)
  const unreadNotificationsCount = 5 // This would normally come from a state or context

  return (
    <motion.header
      initial={{ y: -100, opacity: 0 }}
      animate={{ y: 0, opacity: 1 }}
      transition={{ duration: 0.5 }}
      className="fixed top-0 left-0 right-0 z-50"
    >
      <div className="relative">
        {/* Glowing border */}
        <div className="absolute inset-x-0 -bottom-px h-[1.5px] bg-gradient-to-r from-transparent via-pink-500/50 to-transparent" />

        {/* Glassmorphism background */}
        <div className="absolute inset-0 bg-navy-950/70 backdrop-blur-xl -z-10" />

        <nav className="container mx-auto py-3">
          <div className="flex items-center justify-between">
            {/* Logo and Search (Desktop) */}
            <div className="flex items-center gap-4">
              <Link href="/" className="flex items-center space-x-2 group">
                <div className="relative w-10 h-10 transition-transform duration-300 group-hover:scale-110">
                  <div className="absolute inset-0 bg-gradient-to-r from-pink-500 to-purple-500 rounded-full blur-sm opacity-80 animate-pulse" />
                  <div className="relative w-full h-full bg-gradient-to-r from-pink-500 to-purple-500 rounded-full flex items-center justify-center border border-white/10">
                    <span className="text-white font-bold text-xl">H</span>
                  </div>
                </div>
                <div className="hidden sm:flex flex-col">
                  <span className="text-xl font-bold bg-clip-text text-transparent bg-gradient-to-r from-pink-500 to-purple-500">
                    Hackitech
                  </span>
                  <span className="text-xs text-gray-400 -mt-1">For Developers & Hackers</span>
                </div>
              </Link>

              <div className="hidden md:flex relative max-w-md w-full">
                <Input
                  type="search"
                  placeholder="Rechercher des challenges, hackers, code..."
                  className="w-full bg-white/5 border-white/10 text-white placeholder:text-white/50 pl-10 rounded-full transition-all focus:border-pink-500/50 focus:ring-1 focus:ring-pink-500/30"
                />
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-white/50" />
              </div>
            </div>

            {/* Mobile Search Toggle */}
            <Button variant="ghost" size="icon" className="md:hidden" onClick={() => setShowSearch(!showSearch)}>
              <Search className="h-5 w-5 text-white" />
            </Button>

            {/* Navigation Icons (Desktop) */}
            <div className="hidden md:flex items-center space-x-2">
              <Link
                href="/"
                className={`px-3 py-2 rounded-full flex items-center gap-2 transition-colors ${pathname === "/" ? "bg-white/10 text-pink-400" : "text-white hover:bg-white/5"}`}
              >
                <Home className="h-4 w-4" />
                <span className="text-sm">Home</span>
              </Link>
              <Link
                href="/messages"
                className={`px-3 py-2 rounded-full flex items-center gap-2 transition-colors relative ${pathname === "/messages" ? "bg-white/10 text-pink-400" : "text-white hover:bg-white/5"}`}
              >
                <MessageCircle className="h-4 w-4" />
                <span className="text-sm">Messages</span>
                <Badge className="absolute -top-1 -right-1 h-5 w-5 p-0 flex items-center justify-center bg-pink-500 text-white text-xs">
                  3
                </Badge>
              </Link>
              <Link
                href="/leaderboard"
                className={`px-3 py-2 rounded-full flex items-center gap-2 transition-colors ${pathname === "/leaderboard" ? "bg-white/10 text-pink-400" : "text-white hover:bg-white/5"}`}
              >
                <Trophy className="h-4 w-4" />
                <span className="text-sm">Leaderboard</span>
              </Link>
            </div>

            {/* User Menu (Desktop) */}
            <div className="hidden md:block">
              <DropdownMenu>
                <DropdownMenuTrigger asChild>
                  <Button variant="ghost" className="relative h-10 w-10 rounded-full">
                    <Avatar>
                      <AvatarImage src="/placeholder.svg?height=40&width=40" alt="@user" />
                      <AvatarFallback className="bg-gradient-to-r from-pink-500 to-purple-500 text-white">
                        JD
                      </AvatarFallback>
                    </Avatar>
                  </Button>
                </DropdownMenuTrigger>
                <DropdownMenuContent
                  align="end"
                  className="w-64 bg-navy-950/90 backdrop-blur-xl border-white/10 text-white rounded-xl shadow-lg shadow-pink-500/10"
                >
                  <div className="p-2 border-b border-white/10">
                    <div className="flex items-center gap-3 p-2">
                      <Avatar className="h-10 w-10">
                        <AvatarImage src="/placeholder.svg?height=40&width=40" alt="@user" />
                        <AvatarFallback className="bg-gradient-to-r from-pink-500 to-purple-500 text-white">
                          JD
                        </AvatarFallback>
                      </Avatar>
                      <div>
                        <div className="font-medium">John Doe</div>
                        <div className="text-xs text-gray-400">@johndoe</div>
                      </div>
                    </div>
                  </div>
                  <DropdownMenuLabel className="text-xs text-gray-400 font-normal">Navigation</DropdownMenuLabel>
                  <DropdownMenuItem className="hover:bg-white/5 cursor-pointer focus:bg-white/5">
                    <User className="mr-2 h-4 w-4 text-pink-400" />
                    <span>Profil</span>
                  </DropdownMenuItem>
                  <DropdownMenuItem className="hover:bg-white/5 cursor-pointer focus:bg-white/5">
                    <MessageCircle className="mr-2 h-4 w-4 text-pink-400" />
                    <span>Messages</span>
                    <Badge className="ml-auto bg-pink-500 text-white text-xs">3</Badge>
                  </DropdownMenuItem>
                  <DropdownMenuItem className="hover:bg-white/5 cursor-pointer focus:bg-white/5">
                    <Bell className="mr-2 h-4 w-4 text-pink-400" />
                    <span>Notifications</span>
                    <Badge className="ml-auto bg-pink-500 text-white text-xs">{unreadNotificationsCount}</Badge>
                  </DropdownMenuItem>
                  <DropdownMenuItem className="hover:bg-white/5 cursor-pointer focus:bg-white/5">
                    <Trophy className="mr-2 h-4 w-4 text-pink-400" />
                    <span>Leaderboard</span>
                  </DropdownMenuItem>
                  <DropdownMenuSeparator className="bg-white/10" />
                  <DropdownMenuLabel className="text-xs text-gray-400 font-normal">Activités</DropdownMenuLabel>
                  <DropdownMenuItem className="hover:bg-white/5 cursor-pointer focus:bg-white/5">
                    <Terminal className="mr-2 h-4 w-4 text-pink-400" />
                    <span>Mes Challenges</span>
                  </DropdownMenuItem>
                  <DropdownMenuItem className="hover:bg-white/5 cursor-pointer focus:bg-white/5">
                    <Shield className="mr-2 h-4 w-4 text-pink-400" />
                    <span>Badges & Récompenses</span>
                  </DropdownMenuItem>
                  <DropdownMenuSeparator className="bg-white/10" />
                  <DropdownMenuItem className="hover:bg-white/5 cursor-pointer focus:bg-white/5 text-pink-500">
                    <LogOut className="mr-2 h-4 w-4" />
                    <span>Déconnexion</span>
                  </DropdownMenuItem>
                </DropdownMenuContent>
              </DropdownMenu>
            </div>

            {/* Mobile Menu Toggle */}
            <Button
              variant="ghost"
              size="icon"
              className="md:hidden"
              onClick={() => setShowMobileMenu(!showMobileMenu)}
            >
              {showMobileMenu ? <X className="h-6 w-6 text-white" /> : <Menu className="h-6 w-6 text-white" />}
            </Button>
          </div>

          {/* Mobile Search Bar */}
          <AnimatePresence>
            {showSearch && (
              <motion.div
                initial={{ height: 0, opacity: 0 }}
                animate={{ height: "auto", opacity: 1 }}
                exit={{ height: 0, opacity: 0 }}
                transition={{ duration: 0.2 }}
                className="mt-3 md:hidden overflow-hidden"
              >
                <div className="relative">
                  <Input
                    type="search"
                    placeholder="Rechercher des challenges, hackers, code..."
                    className="w-full bg-white/5 border-white/10 text-white placeholder:text-white/50 pl-10 rounded-full"
                  />
                  <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-white/50" />
                </div>
              </motion.div>
            )}
          </AnimatePresence>

          {/* Mobile Menu */}
          <motion.div
            initial={{ height: 0, opacity: 0 }}
            animate={{ height: "auto", opacity: 1 }}
            exit={{ height: 0, opacity: 0 }}
            transition={{ duration: 0.2 }}
            className="mt-3 md:hidden overflow-hidden"
          >
            {showMobileMenu && (
              <div className="flex flex-col space-y-1 py-3 bg-white/5 backdrop-blur-md rounded-xl px-2 border border-white/10">
                <Link
                  href="/"
                  className={`flex items-center space-x-3 py-2 px-3 rounded-lg ${pathname === "/" ? "bg-white/10 text-pink-400" : "hover:bg-white/5"}`}
                >
                  <Home className="h-5 w-5 text-pink-500" />
                  <span>Accueil</span>
                </Link>
                <Link
                  href="/messages"
                  className={`flex items-center space-x-3 py-2 px-3 rounded-lg ${pathname === "/messages" ? "bg-white/10 text-pink-400" : "hover:bg-white/5"}`}
                >
                  <MessageCircle className="h-5 w-5 text-pink-500" />
                  <span>Messages</span>
                  <Badge className="ml-auto bg-pink-500 text-white">3</Badge>
                </Link>
                <Link
                  href="/notifications"
                  className={`flex items-center space-x-3 py-2 px-3 rounded-lg ${pathname === "/notifications" ? "bg-white/10 text-pink-400" : "hover:bg-white/5"}`}
                >
                  <Bell className="h-5 w-5 text-pink-500" />
                  <span>Notifications</span>
                  <Badge className="ml-auto bg-pink-500 text-white">{unreadNotificationsCount}</Badge>
                </Link>
                <Link
                  href="/leaderboard"
                  className={`flex items-center space-x-3 py-2 px-3 rounded-lg ${pathname === "/leaderboard" ? "bg-white/10 text-pink-400" : "hover:bg-white/5"}`}
                >
                  <Trophy className="h-5 w-5 text-pink-500" />
                  <span>Leaderboard</span>
                </Link>
                <Link
                  href="/profile"
                  className={`flex items-center space-x-3 py-2 px-3 rounded-lg ${pathname === "/profile" ? "bg-white/10 text-pink-400" : "hover:bg-white/5"}`}
                >
                  <User className="h-5 w-5 text-pink-500" />
                  <span>Profil</span>
                </Link>
                <Link
                  href="/challenges"
                  className={`flex items-center space-x-3 py-2 px-3 rounded-lg ${pathname === "/challenges" ? "bg-white/10 text-pink-400" : "hover:bg-white/5"}`}
                >
                  <Terminal className="h-5 w-5 text-pink-500" />
                  <span>Challenges</span>
                </Link>
                <Link
                  href="/badges"
                  className={`flex items-center space-x-3 py-2 px-3 rounded-lg ${pathname === "/badges" ? "bg-white/10 text-pink-400" : "hover:bg-white/5"}`}
                >
                  <Shield className="h-5 w-5 text-pink-500" />
                  <span>Badges</span>
                </Link>
                <div className="pt-2 mt-2 border-t border-white/10">
                  <Button variant="ghost" className="w-full justify-start text-pink-500 hover:bg-white/5">
                    <LogOut className="mr-2 h-4 w-4" />
                    Déconnexion
                  </Button>
                </div>
              </div>
            )}
          </motion.div>
        </nav>
      </div>
    </motion.header>
  )
}

