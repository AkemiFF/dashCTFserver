"use client"

import { useState } from "react"
import { motion } from "framer-motion"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Check, Shield, Zap, Star } from "lucide-react"

export function PricingPlans() {
  const [billingCycle, setBillingCycle] = useState<"monthly" | "yearly">("monthly")

  const plans = [
    {
      name: "Débutant",
      description: "Parfait pour commencer votre parcours en cybersécurité",
      monthlyPrice: 0,
      yearlyPrice: 0,
      features: ["Accès aux défis de base", "Communauté d'entraide", "5 CTF par mois", "Classement global"],
      icon: Shield,
      color: "blue",
      popular: false,
    },
    {
      name: "Pro",
      description: "Pour les hackers éthiques qui veulent progresser rapidement",
      monthlyPrice: 19.99,
      yearlyPrice: 199.99,
      features: [
        "Tous les avantages du plan Débutant",
        "Accès à tous les défis",
        "CTF illimités",
        "Parcours d'apprentissage personnalisés",
        "Certificats de compétences",
        "Support prioritaire",
      ],
      icon: Zap,
      color: "purple",
      popular: true,
    },
    {
      name: "Expert",
      description: "Pour les professionnels et les équipes de sécurité",
      monthlyPrice: 49.99,
      yearlyPrice: 499.99,
      features: [
        "Tous les avantages du plan Pro",
        "Environnements de test avancés",
        "Défis exclusifs",
        "Mentorat personnalisé",
        "API d'intégration",
        "Rapports d'analyse détaillés",
        "Formation d'équipe",
      ],
      icon: Star,
      color: "yellow",
      popular: false,
    },
  ]

  return (
    <div className="mb-20">
      {/* Billing Toggle */}
      <div className="flex justify-center mb-12">
        <div className="inline-flex items-center p-1 bg-white/5 backdrop-blur-sm border border-white/10 rounded-full">
          <button
            className={`px-4 py-2 rounded-full text-sm font-medium transition-all ${
              billingCycle === "monthly" ? "bg-gradient-to-r from-pink-500 to-purple-600 text-white" : "text-gray-400"
            }`}
            onClick={() => setBillingCycle("monthly")}
          >
            Mensuel
          </button>
          <button
            className={`px-4 py-2 rounded-full text-sm font-medium transition-all ${
              billingCycle === "yearly" ? "bg-gradient-to-r from-pink-500 to-purple-600 text-white" : "text-gray-400"
            }`}
            onClick={() => setBillingCycle("yearly")}
          >
            Annuel
            <span className="ml-1 text-xs bg-gradient-to-r from-pink-500 to-purple-600 text-transparent bg-clip-text">
              -17%
            </span>
          </button>
        </div>
      </div>

      {/* Plans */}
      <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
        {plans.map((plan, index) => {
          const Icon = plan.icon
          return (
            <motion.div
              key={plan.name}
              className={`relative rounded-xl backdrop-blur-sm border ${
                plan.popular
                  ? "bg-gradient-to-b from-purple-500/10 to-transparent border-purple-500/30"
                  : "bg-white/5 border-white/10"
              } overflow-hidden transition-all hover:border-purple-500/50 hover:shadow-lg hover:shadow-purple-500/10`}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5, delay: index * 0.1 + 0.3 }}
            >
              {plan.popular && (
                <div className="absolute top-0 right-0">
                  <Badge className="rounded-bl-lg rounded-tr-lg bg-gradient-to-r from-pink-500 to-purple-600 text-white border-0 px-3 py-1">
                    Populaire
                  </Badge>
                </div>
              )}
              <div className="p-6">
                <div className="flex items-center gap-3 mb-4">
                  <div
                    className={`w-10 h-10 rounded-full flex items-center justify-center ${
                      plan.color === "purple"
                        ? "bg-purple-500/20 text-purple-400"
                        : plan.color === "blue"
                          ? "bg-blue-500/20 text-blue-400"
                          : "bg-yellow-500/20 text-yellow-400"
                    }`}
                  >
                    <Icon className="w-5 h-5" />
                  </div>
                  <h3 className="text-xl font-bold text-white">{plan.name}</h3>
                </div>
                <p className="text-gray-400 mb-6 h-12">{plan.description}</p>
                <div className="mb-6">
                  <div className="flex items-end gap-1">
                    <span className="text-3xl font-bold text-white">
                      {billingCycle === "monthly"
                        ? plan.monthlyPrice === 0
                          ? "Gratuit"
                          : `${plan.monthlyPrice.toFixed(2)} €`
                        : plan.yearlyPrice === 0
                          ? "Gratuit"
                          : `${plan.yearlyPrice.toFixed(2)} €`}
                    </span>
                    {plan.monthlyPrice > 0 && (
                      <span className="text-gray-400 mb-1">/{billingCycle === "monthly" ? "mois" : "an"}</span>
                    )}
                  </div>
                </div>
                <Button
                  className={`w-full mb-6 ${
                    plan.popular
                      ? "bg-gradient-to-r from-pink-500 to-purple-600 hover:from-pink-600 hover:to-purple-700"
                      : "bg-white/10 hover:bg-white/20 text-white"
                  }`}
                >
                  {plan.monthlyPrice === 0 ? "Commencer gratuitement" : "Choisir ce plan"}
                </Button>
                <ul className="space-y-3">
                  {plan.features.map((feature, i) => (
                    <li key={i} className="flex items-start gap-2">
                      <Check className="w-5 h-5 text-green-400 shrink-0 mt-0.5" />
                      <span className="text-gray-300">{feature}</span>
                    </li>
                  ))}
                </ul>
              </div>
            </motion.div>
          )
        })}
      </div>
    </div>
  )
}

