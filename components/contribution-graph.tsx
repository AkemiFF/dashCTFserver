"use client"

import { useEffect, useRef } from "react"

interface ContributionData {
  month: string
  contributions: number
}

interface ContributionGraphProps {
  data: ContributionData[]
}

export default function ContributionGraph({ data }: ContributionGraphProps) {
  const canvasRef = useRef<HTMLCanvasElement>(null)

  useEffect(() => {
    const canvas = canvasRef.current
    if (!canvas) return

    const ctx = canvas.getContext("2d")
    if (!ctx) return

    // Set canvas dimensions
    const dpr = window.devicePixelRatio || 1
    const rect = canvas.getBoundingClientRect()
    canvas.width = rect.width * dpr
    canvas.height = rect.height * dpr
    ctx.scale(dpr, dpr)

    // Clear canvas
    ctx.clearRect(0, 0, rect.width, rect.height)

    // Graph dimensions
    const padding = 40
    const graphWidth = rect.width - padding * 2
    const graphHeight = rect.height - padding * 2

    // Find max value for scaling
    const maxContributions = Math.max(...data.map((d) => d.contributions))

    // Draw axes
    ctx.beginPath()
    ctx.strokeStyle = "rgba(255, 255, 255, 0.2)"
    ctx.moveTo(padding, padding)
    ctx.lineTo(padding, rect.height - padding)
    ctx.lineTo(rect.width - padding, rect.height - padding)
    ctx.stroke()

    // Draw grid lines
    const gridLines = 5
    ctx.textAlign = "right"
    ctx.textBaseline = "middle"
    ctx.font = "10px sans-serif"
    ctx.fillStyle = "rgba(255, 255, 255, 0.6)"

    for (let i = 0; i <= gridLines; i++) {
      const y = padding + (graphHeight / gridLines) * i
      const value = Math.round(maxContributions - (maxContributions / gridLines) * i)

      ctx.beginPath()
      ctx.strokeStyle = "rgba(255, 255, 255, 0.1)"
      ctx.moveTo(padding, y)
      ctx.lineTo(rect.width - padding, y)
      ctx.stroke()

      ctx.fillText(value.toString(), padding - 10, y)
    }

    // Draw x-axis labels
    ctx.textAlign = "center"
    ctx.textBaseline = "top"

    data.forEach((d, i) => {
      const x = padding + (graphWidth / (data.length - 1)) * i
      ctx.fillText(d.month, x, rect.height - padding + 10)
    })

    // Draw gradient area
    const gradient = ctx.createLinearGradient(0, padding, 0, rect.height - padding)
    gradient.addColorStop(0, "rgba(236, 72, 153, 0.5)")
    gradient.addColorStop(1, "rgba(236, 72, 153, 0)")

    ctx.beginPath()
    ctx.moveTo(padding, rect.height - padding)

    data.forEach((d, i) => {
      const x = padding + (graphWidth / (data.length - 1)) * i
      const y = rect.height - padding - (graphHeight * d.contributions) / maxContributions
      ctx.lineTo(x, y)
    })

    ctx.lineTo(rect.width - padding, rect.height - padding)
    ctx.closePath()
    ctx.fillStyle = gradient
    ctx.fill()

    // Draw line
    const lineGradient = ctx.createLinearGradient(padding, 0, rect.width - padding, 0)
    lineGradient.addColorStop(0, "#ec4899")
    lineGradient.addColorStop(1, "#9333ea")

    ctx.beginPath()
    ctx.strokeStyle = lineGradient
    ctx.lineWidth = 3

    data.forEach((d, i) => {
      const x = padding + (graphWidth / (data.length - 1)) * i
      const y = rect.height - padding - (graphHeight * d.contributions) / maxContributions

      if (i === 0) {
        ctx.moveTo(x, y)
      } else {
        ctx.lineTo(x, y)
      }
    })

    ctx.stroke()

    // Draw points
    data.forEach((d, i) => {
      const x = padding + (graphWidth / (data.length - 1)) * i
      const y = rect.height - padding - (graphHeight * d.contributions) / maxContributions

      ctx.beginPath()
      ctx.arc(x, y, 5, 0, Math.PI * 2)
      ctx.fillStyle = "#ec4899"
      ctx.fill()

      ctx.beginPath()
      ctx.arc(x, y, 3, 0, Math.PI * 2)
      ctx.fillStyle = "white"
      ctx.fill()
    })
  }, [data])

  return <canvas ref={canvasRef} className="w-full h-64" />
}

export { ContributionGraph }

