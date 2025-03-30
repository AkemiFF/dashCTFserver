"use client"

import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { useState } from "react"

interface EnvironmentVariablesProps {
  variables: Record<string, string>
  onAddVariable: (key: string, value: string) => void
  onRemoveVariable: (key: string) => void
}

export function EnvironmentVariables({ variables, onAddVariable, onRemoveVariable }: EnvironmentVariablesProps) {
  const [newKey, setNewKey] = useState("")
  const [newValue, setNewValue] = useState("")

  const handleAdd = () => {
    if (newKey && newValue) {
      onAddVariable(newKey, newValue)
      setNewKey("")
      setNewValue("")
    }
  }

  return (
    <div className="space-y-2">
      <Label>Environment Variables</Label>
      <div className="grid grid-cols-3 gap-4 mb-2">
        <Input
          placeholder="Key"
          value={newKey}
          onChange={(e) => setNewKey(e.target.value)}
          className="bg-gray-800 border-gray-700 text-gray-200 placeholder:text-gray-500"
        />
        <Input
          placeholder="Value"
          value={newValue}
          onChange={(e) => setNewValue(e.target.value)}
          className="bg-gray-800 border-gray-700 text-gray-200 placeholder:text-gray-500"
        />
        <Button type="button" onClick={handleAdd} className="bg-blue-600 hover:bg-blue-700 text-white">
          Add Variable
        </Button>
      </div>

      {Object.keys(variables).length > 0 && (
        <div className="border border-gray-700 rounded-md p-4 mt-2 bg-gray-800/50">
          <h4 className="text-sm font-medium mb-2 text-gray-200">Environment Variables:</h4>
          <div className="space-y-2">
            {Object.entries(variables).map(([key, value]) => (
              <div
                key={key}
                className="flex items-center justify-between bg-gray-900 p-2 rounded border border-gray-700"
              >
                <div className="text-gray-200">
                  <span className="font-mono">{key}</span> =<span className="font-mono ml-2">{value}</span>
                </div>
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={() => onRemoveVariable(key)}
                  className="text-red-400 hover:text-red-300 hover:bg-gray-800"
                >
                  Remove
                </Button>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  )
}

