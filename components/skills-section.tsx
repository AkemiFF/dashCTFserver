"use client"

import { useState } from "react"
import { motion } from "framer-motion"
import { Card } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Terminal, Code2, Server, Cloud, Shield } from "lucide-react"

interface Skill {
  name: string
  level: number
  category: string
}

interface SkillsSectionProps {
  skills: Skill[]
}

export default function SkillsSection({ skills }: SkillsSectionProps) {
  const [selectedCategory, setSelectedCategory] = useState("all")

  const categories = [
    { id: "all", name: "Toutes", icon: <Terminal className="h-4 w-4 mr-2" /> },
    { id: "language", name: "Langages", icon: <Code2 className="h-4 w-4 mr-2" /> },
    { id: "framework", name: "Frameworks", icon: <Code2 className="h-4 w-4 mr-2" /> },
    { id: "tool", name: "Outils", icon: <Server className="h-4 w-4 mr-2" /> },
    { id: "cloud", name: "Cloud", icon: <Cloud className="h-4 w-4 mr-2" /> },
    { id: "security", name: "Sécurité", icon: <Shield className="h-4 w-4 mr-2" /> },
  ]

  const filteredSkills =
    selectedCategory === "all" ? skills : skills.filter((skill) => skill.category === selectedCategory)

  const getSkillLevelClass = (level: number) => {
    if (level >= 90) return "from-green-500 to-emerald-600"
    if (level >= 75) return "from-blue-500 to-indigo-600"
    if (level >= 60) return "from-yellow-500 to-amber-600"
    return "from-pink-500 to-purple-600"
  }

  const getSkillLevelText = (level: number) => {
    if (level >= 90) return "Expert"
    if (level >= 75) return "Avancé"
    if (level >= 60) return "Intermédiaire"
    return "Débutant"
  }

  return (
    <Card className="backdrop-blur-xl bg-white/5 border border-white/10 overflow-hidden">
      <div className="p-6">
        <h3 className="text-xl font-bold mb-6 flex items-center">
          <Terminal className="h-5 w-5 mr-2 text-pink-500" />
          Compétences Techniques
        </h3>

        <Tabs defaultValue="all" className="w-full" onValueChange={setSelectedCategory}>
          <TabsList className="grid grid-cols-3 md:grid-cols-6 w-full bg-white/5 p-1">
            {categories.map((category) => (
              <TabsTrigger key={category.id} value={category.id} className="data-[state=active]:bg-white/10">
                {category.icon}
                <span className="hidden sm:inline">{category.name}</span>
              </TabsTrigger>
            ))}
          </TabsList>

          <TabsContent value={selectedCategory} className="mt-6">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {filteredSkills.map((skill, index) => (
                <motion.div
                  key={skill.name}
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.3, delay: index * 0.05 }}
                >
                  <div className="bg-white/5 rounded-lg p-4 border border-white/10">
                    <div className="flex justify-between items-center mb-2">
                      <h4 className="font-medium">{skill.name}</h4>
                      <Badge className={`bg-gradient-to-r ${getSkillLevelClass(skill.level)} border-none`}>
                        {getSkillLevelText(skill.level)}
                      </Badge>
                    </div>
                    <div className="w-full bg-white/10 rounded-full h-2.5">
                      <div
                        className={`bg-gradient-to-r ${getSkillLevelClass(skill.level)} h-2.5 rounded-full`}
                        style={{ width: `${skill.level}%` }}
                      ></div>
                    </div>
                  </div>
                </motion.div>
              ))}
            </div>
          </TabsContent>
        </Tabs>
      </div>
    </Card>
  )
}

export { SkillsSection }

