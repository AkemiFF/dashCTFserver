"use client"

import { useState } from "react"
import { Label } from "@/components/ui/label"
import { Button } from "@/components/ui/button"
import { Switch } from "@/components/ui/switch"
import { Input } from "@/components/ui/input"
import { Textarea } from "@/components/ui/textarea"

export function NotificationSettings() {
  const [emailNotifications, setEmailNotifications] = useState(true)
  const [pushNotifications, setPushNotifications] = useState(false)
  const [newChallengeNotif, setNewChallengeNotif] = useState(true)
  const [newCommentNotif, setNewCommentNotif] = useState(true)
  const [leaderboardUpdateNotif, setLeaderboardUpdateNotif] = useState(false)
  const [smtpServer, setSmtpServer] = useState("smtp.example.com")
  const [smtpPort, setSmtpPort] = useState(587)
  const [smtpUsername, setSmtpUsername] = useState("notifications@hackitech.com")
  const [smtpPassword, setSmtpPassword] = useState("")
  const [notificationTemplate, setNotificationTemplate] = useState(
    "Bonjour {username},\n\n{message}\n\nCordialement,\nL'équipe HackiTech",
  )

  const handleSave = () => {
    // Logique pour sauvegarder les paramètres
    console.log("Paramètres de notification sauvegardés")
  }

  return (
    <div className="space-y-6">
      <div className="flex items-center space-x-2">
        <Switch id="emailNotifications" checked={emailNotifications} onCheckedChange={setEmailNotifications} />
        <Label htmlFor="emailNotifications">Activer les notifications par email</Label>
      </div>
      <div className="flex items-center space-x-2">
        <Switch id="pushNotifications" checked={pushNotifications} onCheckedChange={setPushNotifications} />
        <Label htmlFor="pushNotifications">Activer les notifications push</Label>
      </div>
      <div className="space-y-2">
        <Label>Types de notifications</Label>
        <div className="pl-4 space-y-2">
          <div className="flex items-center space-x-2">
            <Switch id="newChallengeNotif" checked={newChallengeNotif} onCheckedChange={setNewChallengeNotif} />
            <Label htmlFor="newChallengeNotif">Nouveaux défis</Label>
          </div>
          <div className="flex items-center space-x-2">
            <Switch id="newCommentNotif" checked={newCommentNotif} onCheckedChange={setNewCommentNotif} />
            <Label htmlFor="newCommentNotif">Nouveaux commentaires</Label>
          </div>
          <div className="flex items-center space-x-2">
            <Switch
              id="leaderboardUpdateNotif"
              checked={leaderboardUpdateNotif}
              onCheckedChange={setLeaderboardUpdateNotif}
            />
            <Label htmlFor="leaderboardUpdateNotif">Mises à jour du classement</Label>
          </div>
        </div>
      </div>
      <div className="space-y-2">
        <Label htmlFor="smtpServer">Serveur SMTP</Label>
        <Input id="smtpServer" value={smtpServer} onChange={(e) => setSmtpServer(e.target.value)} />
      </div>
      <div className="space-y-2">
        <Label htmlFor="smtpPort">Port SMTP</Label>
        <Input id="smtpPort" type="number" value={smtpPort} onChange={(e) => setSmtpPort(Number(e.target.value))} />
      </div>
      <div className="space-y-2">
        <Label htmlFor="smtpUsername">Nom d'utilisateur SMTP</Label>
        <Input id="smtpUsername" value={smtpUsername} onChange={(e) => setSmtpUsername(e.target.value)} />
      </div>
      <div className="space-y-2">
        <Label htmlFor="smtpPassword">Mot de passe SMTP</Label>
        <Input
          id="smtpPassword"
          type="password"
          value={smtpPassword}
          onChange={(e) => setSmtpPassword(e.target.value)}
        />
      </div>
      <div className="space-y-2">
        <Label htmlFor="notificationTemplate">Modèle de notification par email</Label>
        <Textarea
          id="notificationTemplate"
          value={notificationTemplate}
          onChange={(e) => setNotificationTemplate(e.target.value)}
          rows={6}
        />
      </div>
      <Button onClick={handleSave}>Enregistrer les modifications</Button>
    </div>
  )
}

