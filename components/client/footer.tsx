export function Footer() {
  return (
    <footer className="border-t border-white/10 py-8 relative z-10">
      <div className="container mx-auto px-4">
        <div className="flex flex-col md:flex-row justify-between items-center gap-4">
          <div className="text-gray-400 text-sm">
            © {new Date().getFullYear()} Ethical Hacking Platform. All rights reserved.
          </div>
          <div className="flex gap-6">
            <a href="#" className="text-gray-400 hover:text-purple-400 transition-colors">
              Terms
            </a>
            <a href="#" className="text-gray-400 hover:text-purple-400 transition-colors">
              Privacy
            </a>
            <a href="#" className="text-gray-400 hover:text-purple-400 transition-colors">
              Contact
            </a>
          </div>
        </div>
      </div>
    </footer>
  )
}

