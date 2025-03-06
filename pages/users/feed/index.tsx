import { Footer } from "@/components/client/footer"
import { SocialFeed } from "@/components/client/social/feed"
import { Sidebar } from "@/components/client/social/sidebar"

export default function FeedPage() {
  return (
    <div className="min-h-screen bg-gradient-to-br from-[#0A0A1B] via-[#0F1C3F] to-[#0A0A1B]">
      {/* <Header /> */}
      <div className="container mx-auto px-4 py-20">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
          <div className="lg:col-span-8">
            <SocialFeed />
          </div>
          <div className="lg:col-span-4">
            <Sidebar />
          </div>
        </div>
      </div>
      <Footer />
    </div>
  )
}

