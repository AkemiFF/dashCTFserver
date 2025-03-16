"use client"

interface KeyboardShortcutsProps {
  isFullscreen: boolean
}

export function KeyboardShortcuts({ isFullscreen }: KeyboardShortcutsProps) {
  if (!isFullscreen) return null

  return (
    <div className="fixed bottom-4 left-4 bg-black/40 backdrop-blur-sm p-2 rounded-lg text-xs text-white/60">
      <div className="grid grid-cols-2 gap-x-4 gap-y-1">
        <div>⬅️ ➡️</div>
        <div>Navigation</div>
        <div>F</div>
        <div>Plein écran</div>
        <div>Espace</div>
        <div>Lecture auto</div>
        <div>Q</div>
        <div>Quiz / Contenu</div>
        <div>Esc</div>
        <div>Quitter plein écran</div>
      </div>
    </div>
  )
}

