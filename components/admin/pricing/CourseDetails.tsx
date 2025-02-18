import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from "@/components/ui/accordion"

const faqs = [
  {
    question: "Puis-je changer de plan à tout moment ?",
    answer:
      "Oui, vous pouvez passer à un plan supérieur ou inférieur à tout moment. Les changements prendront effet à votre prochaine période de facturation.",
  },
  {
    question: "Y a-t-il un engagement de durée ?",
    answer: "Non, tous nos plans sont sans engagement. Vous pouvez annuler à tout moment.",
  },
  {
    question: "Les certifications sont-elles reconnues dans l'industrie ?",
    answer:
      "Les certifications du plan Ultimate sont reconnues par de nombreuses entreprises du secteur de la cybersécurité. Elles attestent de compétences pratiques validées par nos experts.",
  },
  {
    question: "Puis-je essayer le plan Premium ou Ultimate avant de m'engager ?",
    answer:
      "Oui, nous offrons une période d'essai de 7 jours pour les plans Premium et Ultimate. Vous pouvez explorer toutes les fonctionnalités avant de décider.",
  },
]

export function PricingFAQ() {
  return (
    <div className="max-w-3xl mx-auto">
      <h2 className="text-3xl font-bold text-white mb-8 text-center">Questions fréquentes</h2>
      <Accordion type="single" collapsible className="space-y-4">
        {faqs.map((faq, index) => (
          <AccordionItem key={index} value={`item-${index}`} className="bg-white/5 rounded-lg border border-white/10">
            <AccordionTrigger className="text-white px-4">{faq.question}</AccordionTrigger>
            <AccordionContent className="text-gray-400 px-4 pb-4">{faq.answer}</AccordionContent>
          </AccordionItem>
        ))}
      </Accordion>
    </div>
  )
}

