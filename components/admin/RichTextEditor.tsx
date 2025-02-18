import type React from "react"
import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Textarea } from "@/components/ui/textarea"
import { Bold, Italic, Underline, List } from "lucide-react"

interface RichTextEditorProps {
  value: string
  onChange: (value: string) => void
}

export function RichTextEditor({ value, onChange }: RichTextEditorProps) {
  const [selection, setSelection] = useState<{ start: number; end: number } | null>(null)

  const handleChange = (e: React.ChangeEvent<HTMLTextAreaElement>) => {
    onChange(e.target.value)
  }

  const handleSelect = (e: React.SyntheticEvent<HTMLTextAreaElement>) => {
    const target = e.target as HTMLTextAreaElement
    setSelection({
      start: target.selectionStart,
      end: target.selectionEnd,
    })
  }

  const applyStyle = (tag: string) => {
    if (selection) {
      const before = value.substring(0, selection.start)
      const selected = value.substring(selection.start, selection.end)
      const after = value.substring(selection.end)
      onChange(`${before}<${tag}>${selected}</${tag}>${after}`)
    }
  }

  return (
    <div className="space-y-2">
      <div className="flex space-x-2">
        <Button type="button" variant="outline" size="icon" onClick={() => applyStyle("strong")}>
          <Bold className="h-4 w-4" />
        </Button>
        <Button type="button" variant="outline" size="icon" onClick={() => applyStyle("em")}>
          <Italic className="h-4 w-4" />
        </Button>
        <Button type="button" variant="outline" size="icon" onClick={() => applyStyle("u")}>
          <Underline className="h-4 w-4" />
        </Button>
        <Button type="button" variant="outline" size="icon" onClick={() => applyStyle("li")}>
          <List className="h-4 w-4" />
        </Button>
      </div>
      <Textarea value={value} onChange={handleChange} onSelect={handleSelect} className="min-h-[100px]" />
    </div>
  )
}

