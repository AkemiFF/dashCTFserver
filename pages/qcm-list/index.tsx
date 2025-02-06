"use client"

import { QCMCard } from "@/components/qcm-card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import Layout from "@/components/layout"
import Link from "next/link"
import { useState } from "react"

// This would typically come from your API
const mockQCMs = [
  {
    id: "1",
    title: "Concepts de base en cybersécurité",
    theme: "Sécurité Web",
    difficulty: "Facile",
    points: 100,
    questionCount: 10,
  },
  {
    id: "2",
    title: "Analyse de paquets réseau",
    theme: "Réseaux",
    difficulty: "Intermédiaire",
    points: 200,
    questionCount: 15,
  },
  {
    id: "3",
    title: "Techniques avancées de cryptographie",
    theme: "Cryptographie",
    difficulty: "Difficile",
    points: 300,
    questionCount: 20,
  },
]

export default function QCMListPage() {
  const [searchTerm, setSearchTerm] = useState("")
  const [qcms, setQcms] = useState(mockQCMs)

  const filteredQCMs = qcms.filter((qcm) => qcm.title.toLowerCase().includes(searchTerm.toLowerCase()))

  const handleDelete = (id: string) => {
    // This would typically be an API call
    setQcms(qcms.filter((qcm) => qcm.id !== id))
  }

  return (
    <Layout>
      <div className="space-y-6 max-w-[1200px] mx-auto">
        <div className="flex justify-between items-center">
          <h1 className="text-3xl font-bold tracking-tight">QCM existants</h1>
          <Link href="/qcm-creator">
            <Button>Créer un nouveau QCM</Button>
          </Link>
        </div>
        <div className="flex items-center space-x-2">
          <Input
            placeholder="Rechercher un QCM..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="max-w-sm"
          />
        </div>
        <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
          {filteredQCMs.map((qcm) => (
            <QCMCard key={qcm.id} qcm={qcm} onDelete={handleDelete} />
          ))}
        </div>
      </div>
    </Layout>
  )
}

