"use client"

import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { Button } from "@/components/ui/button"
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from "@/components/ui/dropdown-menu"
import { Input } from "@/components/ui/input"
import { Bell, ChevronDown, Grid, LogOut, Maximize, Search, Settings, User } from "lucide-react"
import Link from "next/link"
import LanguageSwitcher from "./LanguageSwitcher"


export default function Header() {
  const handleLogout = () => {
    // Implement logout logic here
    console.log("Logout clicked")
  }

  return (
    <header className="flex h-16 items-center px-6 border-b border-border bg-card/50 backdrop-blur-xl">
      <div className="flex flex-1 items-center space-x-4">
        <div className="relative w-96">
          <Search className="absolute left-2 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
          <Input placeholder="Search..." className="pl-8 bg-background/50 border-border/50 focus:border-accent" />
        </div>
        <LanguageSwitcher />
      </div>
      <div className="flex items-center space-x-4">
        <Button variant="ghost" size="icon" className="hover:bg-background/50">
          <Bell className="h-4 w-4" />
        </Button>
        <Button variant="ghost" size="icon" className="hover:bg-background/50">
          <Grid className="h-4 w-4" />
        </Button>
        <Button variant="ghost" size="icon" className="hover:bg-background/50">
          <Settings className="h-4 w-4" />
        </Button>
        <Button variant="ghost" size="icon" className="hover:bg-background/50">
          <Maximize className="h-4 w-4" />
        </Button>
        <div className="flex items-center space-x-2 border-l border-border/50 pl-4">
          <Avatar className="h-8 w-8">
            <AvatarImage src="https://github.com/shadcn.png" />
            <AvatarFallback>CN</AvatarFallback>
          </Avatar>
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button variant="ghost" className="hover:bg-background/50">
                <span className="mr-2">Admin</span>
                <ChevronDown className="h-4 w-4" />
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="end">
              <DropdownMenuItem asChild>
                <Link href="/admin-profile" className="flex items-center">
                  <User className="mr-2 h-4 w-4" />
                  <span>Profil</span>
                </Link>
              </DropdownMenuItem>
              <DropdownMenuItem onClick={handleLogout}>
                <LogOut className="mr-2 h-4 w-4" />
                <span>Déconnexion</span>
              </DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>
        </div>
      </div>
    </header>
  )
}

