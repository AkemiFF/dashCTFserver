"use client"

import { useState } from "react"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Button } from "@/components/ui/button"
import { Switch } from "@/components/ui/switch"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"

export function SecuritySettings() {
  const [passwordMinLength, setPasswordMinLength] = useState(12)
  const [passwordComplexity, setPasswordComplexity] = useState("high")
  const [twoFactorAuth, setTwoFactorAuth] = useState(true)
  const [sessionTimeout, setSessionTimeout] = useState(30)
  const [ipWhitelist, setIpWhitelist] = useState("")

  const handleSave = () => {
    // Logique pour sauvegarder les paramètres
    console.log("Paramètres de sécurité sauvegardés")
  }

  return (
    <div className="space-y-6">
      <div className="space-y-2">
        <Label htmlFor="passwordMinLength">Longueur minimale du mot de passe</Label>
        <Input
          id="passwordMinLength"
          type="number"
          value={passwordMinLength}
          onChange={(e) => setPasswordMinLength(Number(e.target.value))}
        />
      </div>
      <div className="space-y-2">
        <Label htmlFor="passwordComplexity">Complexité du mot de passe</Label>
        <Select value={passwordComplexity} onValueChange={setPasswordComplexity}>
          <SelectTrigger id="passwordComplexity">
            <SelectValue placeholder="Sélectionnez la complexité" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="low">Faible</SelectItem>
            <SelectItem value="medium">Moyenne</SelectItem>
            <SelectItem value="high">Élevée</SelectItem>
          </SelectContent>
        </Select>
      </div>
      <div className="flex items-center space-x-2">
        <Switch id="twoFactorAuth" checked={twoFactorAuth} onCheckedChange={setTwoFactorAuth} />
        <Label htmlFor="twoFactorAuth">Authentification à deux facteurs obligatoire</Label>
      </div>
      <div className="space-y-2">
        <Label htmlFor="sessionTimeout">Délai d'expiration de session (minutes)</Label>
        <Input
          id="sessionTimeout"
          type="number"
          value={sessionTimeout}
          onChange={(e) => setSessionTimeout(Number(e.target.value))}
        />
      </div>
      <div className="space-y-2">
        <Label htmlFor="ipWhitelist">Liste blanche d'adresses IP (séparées par des virgules)</Label>
        <Input
          id="ipWhitelist"
          value={ipWhitelist}
          onChange={(e) => setIpWhitelist(e.target.value)}
          placeholder="ex: 192.168.1.1, 10.0.0.1"
        />
      </div>
      <Button onClick={handleSave}>Enregistrer les modifications</Button>
    </div>
  )
}

