"use client"

import { useState } from "react"
import { Label } from "@/components/ui/label"
import { Button } from "@/components/ui/button"
import { Switch } from "@/components/ui/switch"
import { Input } from "@/components/ui/input"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"

export function AppearanceSettings() {
  const [theme, setTheme] = useState("dark")
  const [primaryColor, setPrimaryColor] = useState("#6366f1")
  const [logoUrl, setLogoUrl] = useState("/logo.png")
  const [customCss, setCustomCss] = useState("")
  const [enableCustomization, setEnableCustomization] = useState(false)

  const handleSave = () => {
    // Logique pour sauvegarder les paramètres
    console.log("Paramètres d'apparence sauvegardés")
  }

  return (
    <div className="space-y-6">
      <div className="space-y-2">
        <Label htmlFor="theme">Thème</Label>
        <Select value={theme} onValueChange={setTheme}>
          <SelectTrigger id="theme">
            <SelectValue placeholder="Sélectionnez un thème" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="light">Clair</SelectItem>
            <SelectItem value="dark">Sombre</SelectItem>
            <SelectItem value="system">Système</SelectItem>
          </SelectContent>
        </Select>
      </div>
      <div className="space-y-2">
        <Label htmlFor="primaryColor">Couleur principale</Label>
        <Input id="primaryColor" type="color" value={primaryColor} onChange={(e) => setPrimaryColor(e.target.value)} />
      </div>
      <div className="space-y-2">
        <Label htmlFor="logoUrl">URL du logo</Label>
        <Input id="logoUrl" value={logoUrl} onChange={(e) => setLogoUrl(e.target.value)} />
      </div>
      <div className="flex items-center space-x-2">
        <Switch id="enableCustomization" checked={enableCustomization} onCheckedChange={setEnableCustomization} />
        <Label htmlFor="enableCustomization">Activer la personnalisation avancée</Label>
      </div>
      {enableCustomization && (
        <div className="space-y-2">
          <Label htmlFor="customCss">CSS personnalisé</Label>
          <textarea
            id="customCss"
            value={customCss}
            onChange={(e) => setCustomCss(e.target.value)}
            className="w-full h-32 p-2 border rounded"
            placeholder="Entrez votre CSS personnalisé ici"
          />
        </div>
      )}
      <Button onClick={handleSave}>Enregistrer les modifications</Button>
    </div>
  )
}

