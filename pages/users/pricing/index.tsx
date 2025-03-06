import { PricingFAQ } from "@/components/client/pricing/pricing-faq"
import { PricingHeader } from "@/components/client/pricing/pricing-header"
import { PricingPlans } from "@/components/client/pricing/pricing-plans"

export default function PricingPage() {
  return (
    <div className="min-h-screen bg-gradient-to-br from-[#0A0A1B] via-[#0F1C3F] to-[#0A0A1B] pt-24">
      <div className="container mx-auto px-4 py-16">
        <PricingHeader />
        <PricingPlans />
        <PricingFAQ />
      </div>
    </div>
  )
}

