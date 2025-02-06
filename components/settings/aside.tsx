"use client"

import { useState } from "react"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Button } from "@/components/ui/button"
import { Switch } from "@/components/ui/switch"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"

export function GeneralSettings() {
  const [platformName, setPlatformName] = useState("HackiTech CTF")
  const [adminEmail, setAdminEmail] = useState("admin@hackitech.com")
  const [language, setLanguage] = useState("fr")
  const [timeZone, setTimeZone] = useState("Europe/Paris")
  const [maintenanceMode, setMaintenanceMode] = useState(false)

  const handleSave = () => {
    // Logique pour sauvegarder les paramètres
    console.log("Paramètres généraux sauvegardés")
  }

  return (
    <div className="space-y-6">
      <div className="space-y-2">
        <Label htmlFor="platformName">Nom de la plateforme</Label>
        <Input id="platformName" value={platformName} onChange={(e) => setPlatformName(e.target.value)} />
      </div>
      <div className="space-y-2">
        <Label htmlFor="adminEmail">Email de l'administrateur</Label>
        <Input id="adminEmail" type="email" value={adminEmail} onChange={(e) => setAdminEmail(e.target.value)} />
      </div>
      <div className="space-y-2">
        <Label htmlFor="language">Langue par défaut</Label>
        <Select value={language} onValueChange={setLanguage}>
          <SelectTrigger id="language">
            <SelectValue placeholder="Sélectionnez une langue" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="fr">Français</SelectItem>
            <SelectItem value="en">English</SelectItem>
            <SelectItem value="es">Español</SelectItem>
          </SelectContent>
        </Select>
      </div>
      <div className="space-y-2">
        <Label htmlFor="timeZone">Fuseau horaire</Label>
        <Select value={timeZone} onValueChange={setTimeZone}>
          <SelectTrigger id="timeZone">
            <SelectValue placeholder="Sélectionnez un fuseau horaire" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="Europe/Paris">Europe/Paris</SelectItem>
            <SelectItem value="America/New_York">America/New_York</SelectItem>
            <SelectItem value="Asia/Tokyo">Asia/Tokyo</SelectItem>
          </SelectContent>
        </Select>
      </div>
      <div className="flex items-center space-x-2">
        <Switch id="maintenanceMode" checked={maintenanceMode} onCheckedChange={setMaintenanceMode} />
        <Label htmlFor="maintenanceMode">Mode maintenance</Label>
      </div>
      <Button onClick={handleSave}>Enregistrer les modifications</Button>
    </div>
  )
}

