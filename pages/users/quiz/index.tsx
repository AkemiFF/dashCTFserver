"use client"

import { QuizComponent } from "@/components/client/QuizComponent"
import { useEffect, useRef } from "react"

const sampleQuizData = {
  id: "1",
  title: "Cybersecurity Basics Quiz",
  theme: "Information Security",
  questions: [
    {
      id: "1",
      text: "What does SSL stand for?",
      choices: [
        { id: "a", text: "Secure Socket Layer" },
        { id: "b", text: "System Security Layer" },
        { id: "c", text: "Safe System Link" },
        { id: "d", text: "Secure System Login" },
      ],
      correctAnswer: "a",
      timeLimit: 30,
    },
    {
      id: "2",
      text: "Which of the following is NOT a common type of cyber attack?",
      choices: [
        { id: "a", text: "Phishing" },
        { id: "b", text: "DDoS" },
        { id: "c", text: "Firewall" },
        { id: "d", text: "Malware" },
      ],
      correctAnswer: "c",
      timeLimit: 45,
    },
    {
      id: "3",
      text: "What is the primary purpose of a firewall in network security?",
      choices: [
        { id: "a", text: "To prevent physical access to the network" },
        { id: "b", text: "To monitor network traffic and block unauthorized access" },
        { id: "c", text: "To encrypt all data transmitted over the network" },
        { id: "d", text: "To boost network speed and performance" },
      ],
      correctAnswer: "b",
      timeLimit: 60,
    },
  ],
}

export default function QuizPage() {
  const canvasRef = useRef<HTMLCanvasElement>(null)

  useEffect(() => {
    const canvas = canvasRef.current
    if (!canvas) return

    const ctx = canvas.getContext("2d")
    if (!ctx) return

    canvas.width = window.innerWidth
    canvas.height = window.innerHeight

    const particles: { x: number; y: number; radius: number; vx: number; vy: number }[] = []

    for (let i = 0; i < 100; i++) {
      particles.push({
        x: Math.random() * canvas.width,
        y: Math.random() * canvas.height,
        radius: Math.random() * 2 + 1,
        vx: (Math.random() - 0.5) * 0.5,
        vy: (Math.random() - 0.5) * 0.5,
      })
    }

    function animate() {
      requestAnimationFrame(animate)
      if (canvas && ctx) {
        ctx.clearRect(0, 0, canvas.width, canvas.height)


        particles.forEach((particle) => {
          particle.x += particle.vx
          particle.y += particle.vy

          if (particle.x < 0 || particle.x > canvas.width) particle.vx *= -1
          if (particle.y < 0 || particle.y > canvas.height) particle.vy *= -1

          ctx.beginPath()
          ctx.arc(particle.x, particle.y, particle.radius, 0, Math.PI * 2)
          ctx.fillStyle = "rgba(102, 51, 153, 0.5)"
          ctx.fill()

        })
      }
    }

    animate()

    const handleResize = () => {
      canvas.width = window.innerWidth
      canvas.height = window.innerHeight
    }

    window.addEventListener("resize", handleResize)

    return () => {
      window.removeEventListener("resize", handleResize)
    }
  }, [])

  return (
    <div className="min-h-screen bg-gradient-to-br from-[#0A0A1B] via-[#0F1C3F] to-[#0A0A1B] py-12 px-4 relative overflow-hidden">
      <canvas ref={canvasRef} className="absolute inset-0 pointer-events-none" />
      <div className="relative z-10 max-w-4xl mx-auto">
        <h1 className="text-4xl font-bold text-center mb-8 bg-clip-text text-transparent bg-gradient-to-r from-purple-400 to-blue-500">
          Cybersecurity Challenge
        </h1>
        <QuizComponent quizData={sampleQuizData} />
      </div>
    </div>
  )
}

