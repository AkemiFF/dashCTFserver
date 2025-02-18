"use client"
import {
  Award,
  Bell,
  Book,
  FileText,
  Flag,
  Home,
  List,
  MessageSquare,
  Settings,
  User,
  Users
} from "lucide-react"
import Link from "next/link"
import { usePathname } from "next/navigation"

export default function Aside() {
  const pathname = usePathname()
  const admin_url = 'private-zone-0x8a7b6c'
  const navItems = [
    {
      section: "PLATEFORME",
      items: [
        { href: `/${admin_url}/`, icon: Home, label: "Tableau de bord" },
        { href: `/${admin_url}/challenges`, icon: Flag, label: "Défis" },
        { href: `/${admin_url}/leaderboard`, icon: Award, label: "Classement" },
        { href: `/${admin_url}/learn`, icon: Book, label: "Apprentissage" },
        // { href: "/qcm-creator", icon: FileQuestion, label: "Créateur de QCM" },
        { href: `/${admin_url}/qcm-list`, icon: List, label: "QCM" },
      ],
    },
    {
      section: "COMMUNAUTÉ",
      items: [
        { href: `/${admin_url}/feed`, icon: FileText, label: "Fil d'actualité" },
        { href: `/${admin_url}/messages`, icon: MessageSquare, label: "Messages" },
        // { href: "/users", icon: Users, label: "Utilisateurs" },
        { href: `/${admin_url}/alerts`, icon: Bell, label: "Alertes" },
      ],
    },
    {
      section: "ADMINISTRATION",
      items: [
        // { href: "/challenge-management", icon: Target, label: "Gestion des défis" },
        { href: `/${admin_url}/users`, icon: Users, label: "Gestion des utilisateurs" },
        // { href: "/security", icon: Shield, label: "Sécurité" },
        { href: `/${admin_url}/admin-profile`, icon: User, label: "Profil" },
        { href: `/${admin_url}/settings`, icon: Settings, label: "Paramètres" },
      ],
    },
  ]

  return (
    <aside className="w-64 bg-card/50 backdrop-blur-xl border-r border-border">
      <div className="p-6 border-b border-border">
        <div className="flex items-center space-x-2">
          <div className="h-8 w-8 rounded bg-primary flex items-center justify-center">
            <span className="text-primary-foreground font-bold">EH</span>
          </div>
          <span className="text-xl font-bold">HackiTech</span>
        </div>
      </div>
      <nav className="px-3 py-6">
        {navItems.map((section, i) => (
          <div key={i} className="mb-6">
            <div className="px-3 mb-2 text-xs font-semibold text-muted-foreground tracking-wider">
              {section.section}
            </div>
            <div className="space-y-1">
              {section.items.map((item) => (
                <Link
                  key={item.href}
                  href={item.href}
                  className={`flex items-center space-x-2 px-3 py-2 rounded-lg transition-colors ${pathname === item.href
                    ? "bg-primary/15 text-primary"
                    : "hover:bg-muted/50 text-muted-foreground hover:text-foreground"
                    }`}
                >
                  <item.icon size={18} />
                  <span className="text-sm font-medium">{item.label}</span>
                </Link>
              ))}
            </div>
          </div>
        ))}
      </nav>
    </aside>
  )
}

