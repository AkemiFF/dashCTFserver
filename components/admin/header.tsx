"use client"

import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { Button } from "@/components/ui/button"
import { Command, CommandEmpty, CommandGroup, CommandInput, CommandItem, CommandList } from "@/components/ui/command"
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from "@/components/ui/dropdown-menu"
import { Input } from "@/components/ui/input"
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover"
import { Bell, ChevronDown, Grid, LogOut, Maximize, Search, Settings, User } from "lucide-react"
import { useTranslation } from "next-i18next"
import Link from "next/link"
import { useRouter } from "next/router"

const LanguageSwitcher = () => {
  const { i18n } = useTranslation()
  const router = useRouter()

  const languages = [
    { code: "en", name: "English", flag: "🇬🇧" },
    { code: "fr", name: "Français", flag: "🇫🇷" },
    { code: "zh", name: "中文", flag: "🇨🇳" },
    { code: "es", name: "Español", flag: "🇪🇸" },
  ]

  const changeLanguage = (lang: string) => {
    i18n.changeLanguage(lang)
    router.push(router.pathname, router.asPath, { locale: lang })
  }

  return (
    <Popover>
      <PopoverTrigger asChild>
        <Button variant="outline" size="sm" className="w-[150px] justify-start">
          {languages.find((lang) => lang.code === (i18n.language ?? "en"))?.flag ?? "🌐"}
          <span className="ml-2">{i18n.language?.toUpperCase() ?? "EN"}</span>
          <ChevronDown className="ml-auto h-4 w-4 shrink-0 opacity-50" />
        </Button>
      </PopoverTrigger>
      <PopoverContent className="w-[200px] p-0">
        <Command>
          <CommandInput placeholder="Search language..." />
          <CommandList>
            <CommandEmpty>No language found.</CommandEmpty>
            <CommandGroup>
              {languages.map((lang) => (
                <CommandItem key={lang.code} onSelect={() => changeLanguage(lang.code)}>
                  <span>{lang.flag}</span>
                  <span className="ml-2">{lang.name}</span>
                </CommandItem>
              ))}
            </CommandGroup>
          </CommandList>
        </Command>
      </PopoverContent>
    </Popover>
  )
}

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

