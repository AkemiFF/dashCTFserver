import { Check, X } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"

const plans = [
  {
    name: "Gratuit",
    price: "0€",
    description: "Pour les débutants qui veulent découvrir la cybersécurité",
    features: [
      "Accès aux cours de base",
      "Quelques challenges CTF débutants",
      "Accès limité aux forums / communauté",
      "QCM de validation basiques",
      "Accès aux articles publics",
    ],
    limitations: [
      "Pas d'accès aux défis avancés",
      "Pas d'environnements pratiques (VM, Labs interactifs)",
      "Pas de suivi personnalisé ni de certification",
    ],
    cta: "Commencer gratuitement",
    badge: "🆓",
  },
  {
    name: "Premium",
    price: "9,99€",
    description: "Pour les passionnés qui veulent progresser avec des défis pratiques",
    features: [
      "Tout ce qui est inclus dans le plan gratuit",
      "Accès aux cours intermédiaires et avancés",
      "Défis CTF de niveau intermédiaire et avancé",
      "Accès aux laboratoires pratiques",
      "Certifications internes après validation des modules",
      "Support prioritaire sur les forums",
      "Statistiques et suivi de progression",
    ],
    limitations: ["Accès restreint aux formations premium", "Pas d'accès aux masterclasses avec experts"],
    cta: "Choisir Premium",
    badge: "💎",
  },
  {
    name: "Ultimate",
    price: "15,99€",
    description: "Pour les professionnels qui veulent un apprentissage complet",
    features: [
      "Tout ce qui est inclus dans les plans précédents",
      "Accès illimité à TOUS les cours et défis",
      "Accès aux environnements avancés",
      "Sessions en live avec des experts",
      "Accès à un groupe privé de professionnels",
      "Certifications reconnues après examens",
      "Participation à des compétitions exclusives",
      "Webinars et nouvelles formations en avant-première",
      "Coaching personnalisé",
    ],
    cta: "Devenir Ultimate",
    badge: "🚀",
  },
]

export function PricingPlans() {
  return (
    <div className="grid md:grid-cols-3 gap-8 mb-16">
      {plans.map((plan) => (
        <div key={plan.name} className="bg-white/5 rounded-xl border border-white/10 p-8 flex flex-col">
          <div className="mb-4 flex items-center justify-between">
            <h2 className="text-2xl font-bold text-white">{plan.name}</h2>
            <Badge variant="outline" className="text-purple-400 border-purple-400/20">
              {plan.badge}
            </Badge>
          </div>
          <div className="mb-4">
            <span className="text-4xl font-bold text-white">{plan.price}</span>
            <span className="text-gray-400">/mois</span>
          </div>
          <p className="text-gray-400 mb-6">{plan.description}</p>
          <div className="space-y-4 mb-8 flex-grow">
            {plan.features.map((feature) => (
              <div key={feature} className="flex items-center">
                <Check className="w-5 h-5 text-green-500 mr-2 flex-shrink-0" />
                <span className="text-gray-300">{feature}</span>
              </div>
            ))}
            {plan.limitations &&
              plan.limitations.map((limitation) => (
                <div key={limitation} className="flex items-center">
                  <X className="w-5 h-5 text-red-500 mr-2 flex-shrink-0" />
                  <span className="text-gray-400">{limitation}</span>
                </div>
              ))}
          </div>
          <Button className="w-full bg-purple-600 hover:bg-purple-700 text-white">{plan.cta}</Button>
        </div>
      ))}
    </div>
  )
}

