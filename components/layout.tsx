import { ThemeProvider } from "next-themes"
import type { ReactNode } from "react"
import Aside from "./aside"
import Header from "./header"

export default function Layout({ children }: { children: ReactNode }) {
  return (
    <ThemeProvider attribute="class" defaultTheme="dark" enableSystem={false}>

      <div className="flex h-screen bg-background bg-gradient-to-br from-background to-muted">
        <Aside />
        <div className="flex-1 flex flex-col overflow-hidden">
          <Header />
          <main className="flex-1 overflow-y-auto p-6">{children}</main>
        </div>
      </div>
    </ThemeProvider>
  )
}

