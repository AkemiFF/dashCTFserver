"use client"

import { motion } from "framer-motion"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { Card, CardContent } from "@/components/ui/card"
import { Quote } from "lucide-react"

export function PricingTestimonials() {
  const testimonials = [
    {
      quote:
        "Cette plateforme a complètement transformé ma façon d'apprendre la cybersécurité. Les défis sont stimulants et les parcours d'apprentissage sont très bien structurés.",
      author: "Marie Dubois",
      title: "Étudiante en informatique",
      avatar: "/placeholder.svg?height=40&width=40",
    },
    {
      quote:
        "En tant que professionnel de la sécurité, j'utilise cette plateforme pour maintenir mes compétences à jour. Le plan Expert offre un excellent rapport qualité-prix.",
      author: "Thomas Martin",
      title: "Pentester senior",
      avatar: "/placeholder.svg?height=40&width=40",
    },
    {
      quote:
        "Nous avons formé toute notre équipe grâce à cette plateforme. Les environnements de test sont réalistes et les défis correspondent parfaitement aux menaces actuelles.",
      author: "Sophie Laurent",
      title: "RSSI, Entreprise Fortune 500",
      avatar: "/placeholder.svg?height=40&width=40",
    },
  ]

  return (
    <div className="mb-20">
      <motion.div
        className="text-center mb-12"
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
      >
        <h2 className="text-3xl font-bold mb-4">Ce que disent nos utilisateurs</h2>
        <p className="text-gray-400 max-w-2xl mx-auto">
          Découvrez pourquoi des milliers d'apprenants et de professionnels font confiance à notre plateforme pour
          développer leurs compétences en cybersécurité.
        </p>
      </motion.div>

      <div className="grid md:grid-cols-3 gap-6">
        {testimonials.map((testimonial, index) => (
          <motion.div
            key={index}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: index * 0.1 + 0.2 }}
          >
            <Card className="bg-white/5 border-white/10 backdrop-blur-sm hover:border-purple-500/30 transition-all">
              <CardContent className="p-6">
                <Quote className="w-8 h-8 text-purple-400 mb-4 opacity-50" />
                <p className="text-gray-300 mb-6">{testimonial.quote}</p>
                <div className="flex items-center gap-3">
                  <Avatar>
                    <AvatarImage src={testimonial.avatar} />
                    <AvatarFallback>{testimonial.author[0]}</AvatarFallback>
                  </Avatar>
                  <div>
                    <div className="font-medium text-white">{testimonial.author}</div>
                    <div className="text-sm text-gray-400">{testimonial.title}</div>
                  </div>
                </div>
              </CardContent>
            </Card>
          </motion.div>
        ))}
      </div>
    </div>
  )
}

