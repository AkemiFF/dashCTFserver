"use client"

import Layout from "@/components/admin/layout"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import { useState } from "react"

interface AdminProfile {
  username: string
  email: string
  fullName: string
  bio: string
  avatarUrl: string
  role: string
  joinDate: string
  lastLogin: string
  twoFactorEnabled: boolean
}

export default function AdminProfilePage() {
  const [isEditing, setIsEditing] = useState(false)
  const [profile, setProfile] = useState<AdminProfile>({
    username: "admin_user",
    email: "admin@hackitech.com",
    fullName: "John Doe",
    bio: "Passionné de cybersécurité et administrateur de la plateforme HackiTech CTF.",
    avatarUrl: "https://github.com/shadcn.png",
    role: "Super Admin",
    joinDate: "2023-01-15",
    lastLogin: "2023-05-30 14:23:45",
    twoFactorEnabled: true,
  })

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target
    setProfile((prev) => ({ ...prev, [name]: value }))
  }

  const handleSave = () => {
    // Ici, vous implémenteriez la logique pour sauvegarder les modifications
    console.log("Profil mis à jour:", profile)
    setIsEditing(false)
  }

  return (
    <Layout>
      <div className="container mx-auto px-4 py-8">
        <h1 className="text-4xl font-bold mb-8">Profil Administrateur</h1>
        <Card className="max-w-3xl mx-auto">
          <CardHeader className="flex flex-row items-center justify-between">
            <CardTitle>Informations du profil</CardTitle>
            <Button onClick={() => setIsEditing(!isEditing)}>{isEditing ? "Annuler" : "Modifier"}</Button>
          </CardHeader>
          <CardContent className="space-y-6">
            <div className="flex items-center space-x-4">
              <Avatar className="w-24 h-24">
                <AvatarImage src={profile.avatarUrl} alt={profile.username} />
                <AvatarFallback>{profile.username.slice(0, 2).toUpperCase()}</AvatarFallback>
              </Avatar>
              <div>
                <h2 className="text-2xl font-bold">{profile.fullName}</h2>
                <Badge>{profile.role}</Badge>
              </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label htmlFor="username">Nom d'utilisateur</Label>
                {isEditing ? (
                  <Input id="username" name="username" value={profile.username} onChange={handleInputChange} />
                ) : (
                  <p>{profile.username}</p>
                )}
              </div>

              <div className="space-y-2">
                <Label htmlFor="email">Email</Label>
                {isEditing ? (
                  <Input id="email" name="email" type="email" value={profile.email} onChange={handleInputChange} />
                ) : (
                  <p>{profile.email}</p>
                )}
              </div>

              <div className="space-y-2">
                <Label htmlFor="fullName">Nom complet</Label>
                {isEditing ? (
                  <Input id="fullName" name="fullName" value={profile.fullName} onChange={handleInputChange} />
                ) : (
                  <p>{profile.fullName}</p>
                )}
              </div>

              <div className="space-y-2">
                <Label htmlFor="avatarUrl">URL de l'avatar</Label>
                {isEditing ? (
                  <Input id="avatarUrl" name="avatarUrl" value={profile.avatarUrl} onChange={handleInputChange} />
                ) : (
                  <p>{profile.avatarUrl}</p>
                )}
              </div>
            </div>

            <div className="space-y-2">
              <Label htmlFor="bio">Biographie</Label>
              {isEditing ? (
                <Textarea id="bio" name="bio" value={profile.bio} onChange={handleInputChange} rows={4} />
              ) : (
                <p>{profile.bio}</p>
              )}
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label>Date d'inscription</Label>
                <p>{profile.joinDate}</p>
              </div>

              <div className="space-y-2">
                <Label>Dernière connexion</Label>
                <p>{profile.lastLogin}</p>
              </div>

              <div className="space-y-2">
                <Label>Authentification à deux facteurs</Label>
                <p>{profile.twoFactorEnabled ? "Activée" : "Désactivée"}</p>
              </div>
            </div>

            {isEditing && (
              <Button onClick={handleSave} className="w-full">
                Enregistrer les modifications
              </Button>
            )}
          </CardContent>
        </Card>
      </div>
    </Layout>
  )
}

