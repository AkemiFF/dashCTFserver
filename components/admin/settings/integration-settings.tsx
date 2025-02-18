"use client"

import { useState } from "react"
import { Label } from "@/components/ui/label"
import { Button } from "@/components/ui/button"
import { Switch } from "@/components/ui/switch"
import { Input } from "@/components/ui/input"

export function IntegrationSettings() {
  const [slackWebhook, setSlackWebhook] = useState("")
  const [discordWebhook, setDiscordWebhook] = useState("")
  const [githubToken, setGithubToken] = useState("")
  const [enableGitHubIntegration, setEnableGitHubIntegration] = useState(false)
  const [jiraApiKey, setJiraApiKey] = useState("")
  const [jiraDomain, setJiraDomain] = useState("")
  const [enableJiraIntegration, setEnableJiraIntegration] = useState(false)

  const handleSave = () => {
    // Logique pour sauvegarder les paramètres
    console.log("Paramètres d'intégration sauvegardés")
  }

  return (
    <div className="space-y-6">
      <div className="space-y-2">
        <Label htmlFor="slackWebhook">Webhook Slack</Label>
        <Input
          id="slackWebhook"
          value={slackWebhook}
          onChange={(e) => setSlackWebhook(e.target.value)}
          placeholder="https://hooks.slack.com/services/..."
        />
      </div>
      <div className="space-y-2">
        <Label htmlFor="discordWebhook">Webhook Discord</Label>
        <Input
          id="discordWebhook"
          value={discordWebhook}
          onChange={(e) => setDiscordWebhook(e.target.value)}
          placeholder="https://discord.com/api/webhooks/..."
        />
      </div>
      <div className="space-y-2">
        <div className="flex items-center space-x-2">
          <Switch
            id="enableGitHubIntegration"
            checked={enableGitHubIntegration}
            onCheckedChange={setEnableGitHubIntegration}
          />
          <Label htmlFor="enableGitHubIntegration">Activer l'intégration GitHub</Label>
        </div>
        {enableGitHubIntegration && (
          <div className="pl-6 space-y-2">
            <Label htmlFor="githubToken">Token d'accès GitHub</Label>
            <Input
              id="githubToken"
              type="password"
              value={githubToken}
              onChange={(e) => setGithubToken(e.target.value)}
              placeholder="ghp_..."
            />
          </div>
        )}
      </div>
      <div className="space-y-2">
        <div className="flex items-center space-x-2">
          <Switch
            id="enableJiraIntegration"
            checked={enableJiraIntegration}
            onCheckedChange={setEnableJiraIntegration}
          />
          <Label htmlFor="enableJiraIntegration">Activer l'intégration Jira</Label>
        </div>
        {enableJiraIntegration && (
          <div className="pl-6 space-y-2">
            <Label htmlFor="jiraDomain">Domaine Jira</Label>
            <Input
              id="jiraDomain"
              value={jiraDomain}
              onChange={(e) => setJiraDomain(e.target.value)}
              placeholder="votre-domaine.atlassian.net"
            />
            <Label htmlFor="jiraApiKey">Clé API Jira</Label>
            <Input
              id="jiraApiKey"
              type="password"
              value={jiraApiKey}
              onChange={(e) => setJiraApiKey(e.target.value)}
              placeholder="Votre clé API Jira"
            />
          </div>
        )}
      </div>
      <Button onClick={handleSave}>Enregistrer les modifications</Button>
    </div>
  )
}

