"use client"

import { useEffect, useRef } from "react"

interface Particle {
  x: number
  y: number
  size: number
  speedX: number
  speedY: number
  color: string
  alpha: number
  connection: number
}

export default function ParticleBackground() {
  const canvasRef = useRef<HTMLCanvasElement>(null)
  const particlesRef = useRef<Particle[]>([])
  const mouseRef = useRef({ x: 0, y: 0 })
  const animationFrameRef = useRef<number>(0)

  useEffect(() => {
    const canvas = canvasRef.current
    if (!canvas) return

    const ctx = canvas.getContext("2d")
    if (!ctx) return

    // Ajuster la taille du canvas à la fenêtre
    const resizeCanvas = () => {
      canvas.width = window.innerWidth
      canvas.height = window.innerHeight
      initParticles()
    }

    // Initialiser les particules
    const initParticles = () => {
      particlesRef.current = []
      const particleCount = Math.min(Math.floor((canvas.width * canvas.height) / 15000), 150)

      for (let i = 0; i < particleCount; i++) {
        particlesRef.current.push({
          x: Math.random() * canvas.width,
          y: Math.random() * canvas.height,
          size: Math.random() * 1.5 + 0.5,
          speedX: (Math.random() - 0.5) * 0.5,
          speedY: (Math.random() - 0.5) * 0.5,
          color: getRandomColor(),
          alpha: Math.random() * 0.5 + 0.1,
          connection: Math.random() * 100 + 50,
        })
      }
    }

    // Couleurs futuristes pour les particules
    const getRandomColor = () => {
      const colors = [
        "#64ffda", // turquoise néon
        "#05ffa1", // vert néon
        "#ff2a6d", // rose néon
        "#01c5c4", // cyan
        "#7b42f6", // violet
        "#05d9e8", // bleu clair
      ]
      return colors[Math.floor(Math.random() * colors.length)]
    }

    // Dessiner et animer les particules
    const animate = () => {
      ctx.clearRect(0, 0, canvas.width, canvas.height)

      // Fond dégradé
      const gradient = ctx.createLinearGradient(0, 0, canvas.width, canvas.height)
      gradient.addColorStop(0, "rgba(15, 12, 41, 0.8)")
      gradient.addColorStop(0.5, "rgba(48, 43, 99, 0.8)")
      gradient.addColorStop(1, "rgba(36, 36, 62, 0.8)")
      ctx.fillStyle = gradient
      ctx.fillRect(0, 0, canvas.width, canvas.height)

      // Dessiner et mettre à jour chaque particule
      particlesRef.current.forEach((particle, index) => {
        // Mettre à jour la position
        particle.x += particle.speedX
        particle.y += particle.speedY

        // Rebondir sur les bords
        if (particle.x < 0 || particle.x > canvas.width) {
          particle.speedX *= -1
        }
        if (particle.y < 0 || particle.y > canvas.height) {
          particle.speedY *= -1
        }

        // Dessiner la particule
        ctx.beginPath()
        ctx.arc(particle.x, particle.y, particle.size, 0, Math.PI * 2)
        ctx.fillStyle = particle.color
        ctx.globalAlpha = particle.alpha
        ctx.fill()
        ctx.globalAlpha = 1

        // Dessiner les connexions entre particules proches
        for (let j = index + 1; j < particlesRef.current.length; j++) {
          const otherParticle = particlesRef.current[j]
          const dx = particle.x - otherParticle.x
          const dy = particle.y - otherParticle.y
          const distance = Math.sqrt(dx * dx + dy * dy)

          if (distance < particle.connection) {
            // Calculer l'opacité basée sur la distance
            const opacity = 1 - distance / particle.connection

            // Dessiner la ligne de connexion
            ctx.beginPath()
            ctx.moveTo(particle.x, particle.y)
            ctx.lineTo(otherParticle.x, otherParticle.y)
            ctx.strokeStyle = particle.color
            ctx.globalAlpha = opacity * 0.2
            ctx.lineWidth = 0.5
            ctx.stroke()
            ctx.globalAlpha = 1
          }
        }

        // Interaction avec la souris
        const dx = particle.x - mouseRef.current.x
        const dy = particle.y - mouseRef.current.y
        const mouseDistance = Math.sqrt(dx * dx + dy * dy)
        const mouseRadius = 100

        if (mouseDistance < mouseRadius) {
          const force = (mouseRadius - mouseDistance) / mouseRadius
          const angle = Math.atan2(dy, dx)
          particle.x += Math.cos(angle) * force * 2
          particle.y += Math.sin(angle) * force * 2
        }
      })

      animationFrameRef.current = requestAnimationFrame(animate)
    }

    // Gérer les mouvements de la souris
    const handleMouseMove = (e: MouseEvent) => {
      mouseRef.current = {
        x: e.clientX,
        y: e.clientY,
      }
    }

    // Initialiser et démarrer l'animation
    window.addEventListener("resize", resizeCanvas)
    window.addEventListener("mousemove", handleMouseMove)
    resizeCanvas()
    animate()

    // Nettoyer
    return () => {
      window.removeEventListener("resize", resizeCanvas)
      window.removeEventListener("mousemove", handleMouseMove)
      cancelAnimationFrame(animationFrameRef.current)
    }
  }, [])

  return <canvas ref={canvasRef} className="fixed top-0 left-0 w-full h-full -z-10" style={{ pointerEvents: "none" }} />
}
