import DockerChallengeManager from "@/components/admin/docker-challenge-manager"
import Layout from "@/components/admin/layout"

export default function DockerChallengesPage() {
  return (
    <Layout>
      <div className="max-w-4xl mx-auto">
        <h1 className="text-4xl font-bold mb-8 animate-glitch">Gestion des Défis Docker</h1>
        <DockerChallengeManager />
      </div>
    </Layout>
  )
}

