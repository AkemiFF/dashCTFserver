export function LoadingScreen() {
  return (
    <div className="flex flex-col items-center justify-center w-full h-screen bg-[#0f0c29]">
      <div className="w-16 h-16 border-4 border-[#64ffda] border-t-transparent rounded-full animate-spin"></div>
      <p className="mt-4 text-[#64ffda] text-lg">Chargement de l'OSINT Framework...</p>
    </div>
  )
}
