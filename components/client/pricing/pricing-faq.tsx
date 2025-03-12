"use client"
import { motion } from "framer-motion"
import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from "@/components/ui/accordion"

export function PricingFAQ() {
  const faqs = [
    {
      question: "Puis-je changer de plan à tout moment ?",
      answer:
        "Oui, vous pouvez passer à un plan supérieur à tout moment. Si vous passez à un plan inférieur, le changement prendra effet à la fin de votre période de facturation actuelle.",
    },
    {
      question: "Comment fonctionne la période d'essai ?",
      answer:
        "Nous offrons une période d'essai de 14 jours pour nos plans Pro et Expert. Vous pouvez annuler à tout moment pendant cette période et vous ne serez pas facturé.",
    },
    {
      question: "Quels modes de paiement acceptez-vous ?",
      answer:
        "Nous acceptons les cartes de crédit (Visa, Mastercard, American Express), PayPal, et dans certains pays, le virement bancaire pour les abonnements annuels.",
    },
    {
      question: "Les mises à jour sont-elles incluses dans mon abonnement ?",
      answer:
        "Oui, toutes les mises à jour de la plateforme sont automatiquement incluses dans votre abonnement, quel que soit le plan choisi.",
    },
    {
      question: "Proposez-vous des tarifs spéciaux pour les étudiants ou les établissements d'enseignement ?",
      answer:
        "Oui, nous offrons des réductions pour les étudiants et des forfaits spéciaux pour les établissements d'enseignement. Contactez notre équipe commerciale pour plus d'informations.",
    },
    {
      question: "Comment puis-je obtenir une facture pour mon abonnement ?",
      answer:
        "Les factures sont automatiquement générées et envoyées à l'adresse e-mail associée à votre compte après chaque paiement. Vous pouvez également les télécharger depuis votre tableau de bord.",
    },
  ]

  return (
    <div className="max-w-3xl mx-auto mb-20">
      <motion.div
        className="text-center mb-12"
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
      >
        <h2 className="text-3xl font-bold mb-4">Questions fréquentes</h2>
        <p className="text-gray-400">
          Vous avez d'autres questions ? N'hésitez pas à{" "}
          <a href="#" className="text-purple-400 hover:underline">
            nous contacter
          </a>
          .
        </p>
      </motion.div>

      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5, delay: 0.2 }}
      >
        <Accordion type="single" collapsible className="space-y-4">
          {faqs.map((faq, index) => (
            <AccordionItem
              key={index}
              value={`item-${index}`}
              className="border border-white/10 rounded-lg bg-white/5 backdrop-blur-sm px-6 overflow-hidden"
            >
              <AccordionTrigger className="text-left text-white hover:text-purple-400 py-4 [&[data-state=open]>svg]:text-purple-400">
                {faq.question}
              </AccordionTrigger>
              <AccordionContent className="text-gray-400 pb-4">{faq.answer}</AccordionContent>
            </AccordionItem>
          ))}
        </Accordion>
      </motion.div>
    </div>
  )
}

