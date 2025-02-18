import ChallengeManager from "@/components/admin/challenge-manager"
import Layout from "@/components/admin/layout"
import { Button } from "@/components/ui/button"

export default function ChallengesPage() {
  return (
    <Layout>
      <div className="container mx-auto px-4 py-8">
        <div className="flex justify-between items-center mb-8">
          <h1 className="text-4xl font-bold">Gestion des Défis</h1>
          <Button size="lg" variant="default">
            Construire tous les conteneurs Docker
          </Button>
        </div>
        <ChallengeManager />
      </div>
    </Layout>
  )
}

