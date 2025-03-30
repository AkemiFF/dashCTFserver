"use client"

import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { useState } from "react"

interface DockerPortsProps {
  ports: Record<string, number | null>
  onAddPort: (key: string, value: number | null) => void
  onRemovePort: (key: string) => void
}

export function DockerPorts({ ports, onAddPort, onRemovePort }: DockerPortsProps) {
  const [newPortKey, setNewPortKey] = useState("")
  const [newPortValue, setNewPortValue] = useState<string>("")

  const handleAddPort = () => {
    if (newPortKey) {
      onAddPort(newPortKey, newPortValue ? Number.parseInt(newPortValue) : null)
      setNewPortKey("")
      setNewPortValue("")
    }
  }

  return (
    <div className="space-y-2">
      <Label>Docker Ports</Label>
      <div className="grid grid-cols-3 gap-4 mb-2">
        <Input
          placeholder="Port (e.g., 22/tcp)"
          value={newPortKey}
          onChange={(e) => setNewPortKey(e.target.value)}
          className="bg-gray-800 border-gray-700 text-gray-200 placeholder:text-gray-500"
        />
        <Input
          placeholder="Host Port (empty for random)"
          value={newPortValue}
          onChange={(e) => setNewPortValue(e.target.value)}
          className="bg-gray-800 border-gray-700 text-gray-200 placeholder:text-gray-500"
        />
        <Button type="button" onClick={handleAddPort} className="bg-blue-600 hover:bg-blue-700 text-white">
          Add Port
        </Button>
      </div>

      {Object.keys(ports).length > 0 && (
        <div className="border border-gray-700 rounded-md p-4 mt-2 bg-gray-800/50">
          <h4 className="text-sm font-medium mb-2 text-gray-200">Configured Ports:</h4>
          <div className="space-y-2">
            {Object.entries(ports).map(([key, value]) => (
              <div
                key={key}
                className="flex items-center justify-between bg-gray-900 p-2 rounded border border-gray-700"
              >
                <div className="text-gray-200">
                  <span className="font-mono">{key}</span> →
                  <span className="font-mono ml-2">{value === null ? "random" : value}</span>
                </div>
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={() => onRemovePort(key)}
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

