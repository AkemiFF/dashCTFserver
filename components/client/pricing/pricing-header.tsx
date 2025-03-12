"use client"

import { motion } from "framer-motion"

export function PricingHeader() {
  return (
    <div className="text-center max-w-3xl mx-auto mb-16">
      <motion.div initial={{ opacity: 0, y: -20 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.5 }}>
        <div className="inline-block px-4 py-1.5 mb-4 rounded-full bg-white/5 border border-white/10 backdrop-blur-sm">
          <span className="text-sm font-medium bg-gradient-to-r from-pink-500 to-purple-600 text-transparent bg-clip-text">
            Plans & Tarification
          </span>
        </div>
      </motion.div>

      <motion.h1
        className="text-4xl md:text-5xl font-bold mb-6 leading-tight"
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ duration: 0.5, delay: 0.2 }}
      >
        Choisissez le plan qui vous convient
      </motion.h1>

      <motion.p
        className="text-lg text-gray-400 max-w-2xl mx-auto"
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ duration: 0.5, delay: 0.3 }}
      >
        Que vous soyez débutant ou expert en cybersécurité, nous avons un plan adapté à vos besoins. Tous nos plans
        incluent l'accès à notre communauté et aux mises à jour régulières.
      </motion.p>
    </div>
  )
}

