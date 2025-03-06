import Image from "next/image"

export function BlogSection() {
  const posts = [
    {
      title: "Cybersecurity Best Practices",
      image: "https://hebbkx1anhila5yf.public.blob.vercel-storage.com/design-lfp1mqweNFHdsbk8hLcdQgItUZwSdB.webp",
      category: "Security",
    },
    {
      title: "Network Protection Strategies",
      image: "https://hebbkx1anhila5yf.public.blob.vercel-storage.com/design-lfp1mqweNFHdsbk8hLcdQgItUZwSdB.webp",
      category: "Network",
    },
    {
      title: "Data Privacy Solutions",
      image: "https://hebbkx1anhila5yf.public.blob.vercel-storage.com/design-lfp1mqweNFHdsbk8hLcdQgItUZwSdB.webp",
      category: "Privacy",
    },
  ]

  return (
    <section className="container mx-auto px-4 py-20">
      <h2 className="text-2xl font-bold mb-8">Recent From Blog</h2>
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        {posts.map((post, index) => (
          <div key={index} className="bg-[#0A1628] rounded-lg overflow-hidden">
            <div className="relative h-48">
              <Image src={post.image || "/placeholder.svg"} alt={post.title} fill className="object-cover" />
            </div>
            <div className="p-4">
              <span className="text-emerald-500 text-sm">{post.category}</span>
              <h3 className="text-lg font-semibold mt-2">{post.title}</h3>
            </div>
          </div>
        ))}
      </div>
    </section>
  )
}

