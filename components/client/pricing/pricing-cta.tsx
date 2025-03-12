"use client"

import { motion } from "framer-motion"
import { Button } from "@/components/ui/button"
import { ArrowRight } from "lucide-react"

export function PricingCTA() {
  return (
    <motion.div
      className="rounded-2xl bg-gradient-to-r from-purple-500/20 to-pink-500/20 border border-white/10 p-8 md:p-12 text-center backdrop-blur-sm"
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5 }}
    >
      <h2 className="text-2xl md:text-3xl font-bold mb-4">Prêt à commencer votre parcours en cybersécurité ?</h2>
      <p className="text-gray-400 max-w-2xl mx-auto mb-8">
        Rejoignez notre communauté de plus de 50 000 hackers éthiques et commencez à développer vos compétences dès
        aujourd'hui.
      </p>
      <div className="flex flex-col sm:flex-row gap-4 justify-center">
        <Button className="bg-gradient-to-r from-pink-500 to-purple-600 hover:from-pink-600 hover:to-purple-700">
          Commencer gratuitement
        </Button>
        <Button variant="outline" className="border-purple-500/50 text-white hover:bg-purple-500/10">
          Contacter les ventes <ArrowRight className="ml-2 h-4 w-4" />
        </Button>
      </div>
    </motion.div>
  )
}

