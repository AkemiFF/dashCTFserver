import { AnimatedBackground } from "@/components/client/AnimatedBackground"
import { PostCreator } from "@/components/client/PostCreator"
import { PostFeed } from "@/components/client/PostFeed"
import { SidebarHome } from "@/components/client/SidebarHome"

export default function Home() {
    return (
        <div className="min-h-screen top-30 bg-gray-900 text-gray-100 overflow-hidden pt-16">
            <AnimatedBackground />
            <main className="container mx-auto px-4 py-8 relative z-10">
                <div className="flex flex-col lg:flex-row gap-8">
                    <div className="flex-grow max-w-2xl mx-auto w-full">
                        <PostCreator />
                        <PostFeed />
                    </div>
                    <SidebarHome />
                </div>
            </main>
        </div>
    )
}

