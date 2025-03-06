import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"

export function ContactForm() {
  return (
    <section className="container mx-auto px-4 py-20">
      <div className="max-w-3xl mx-auto">
        <h2 className="text-2xl font-bold mb-6">Talk to an Expert</h2>
        <form className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <Input type="text" placeholder="Name" className="bg-[#0A1628] border-gray-700" />
          <Input type="email" placeholder="Email" className="bg-[#0A1628] border-gray-700" />
          <Button className="bg-emerald-500 hover:bg-emerald-600 text-white">Send Now</Button>
        </form>
      </div>
      <div className="absolute bottom-0 left-0 w-full h-1 bg-gradient-to-r from-emerald-500 to-yellow-500 opacity-50" />
    </section>
  )
}

