"use client"

import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { Progress } from "@/components/ui/progress"
import Particles, { initParticlesEngine } from "@tsparticles/react"
import { loadSlim } from "@tsparticles/slim"
import { motion } from "framer-motion"
import { Brain, Flag, Shield, Terminal, Trophy, Users } from "lucide-react"
import Image from "next/image"
import { useEffect, useState } from "react"

export default function Welcome() {
  const [init, setInit] = useState(false)

  useEffect(() => {
    initParticlesEngine(async (engine) => {
      await loadSlim(engine)
    }).then(() => {
      setInit(true)
    })
  }, [])

  const particlesOptions = {
    particles: {
      number: {
        value: 30,
        density: {
          enable: true,
          value_area: 800,
        },
      },
      color: {
        value: "#ff1493",
      },
      links: {
        enable: true,
        color: "#ff1493",
        opacity: 0.2,
      },
      move: {
        enable: true,
        speed: 0.5,
      },
      size: {
        value: 2,
      },
      opacity: {
        value: 0.5,
      },
    },
    background: {
      color: {
        value: "transparent",
      },
    },
  }

  // Sample learning paths data
  const paths = [
    {
      title: "Fundamentals of Ethical Hacking",
      description: "Learn the basics of ethical hacking and cybersecurity",
      progress: 0,
      modules: 12,
      level: "Beginner",
    },
    {
      title: "Web Application Security",
      description: "Master web vulnerabilities and secure coding practices",
      progress: 30,
      modules: 8,
      level: "Intermediate",
    },
    {
      title: "Network Penetration Testing",
      description: "Advanced network security and penetration testing",
      progress: 0,
      modules: 10,
      level: "Advanced",
    },
  ]

  // Sample challenges data
  const challenges = [
    {
      title: "SQL Injection Basics",
      category: "Web Security",
      difficulty: "Easy",
      points: 100,
      completions: 1234,
    },
    {
      title: "Buffer Overflow Attack",
      category: "Binary Exploitation",
      difficulty: "Hard",
      points: 500,
      completions: 145,
    },
    {
      title: "Password Cracking",
      category: "Cryptography",
      difficulty: "Medium",
      points: 250,
      completions: 678,
    },
  ]

  // Sample leaderboard data
  const topUsers = [
    { name: "CyberNinja", points: 15000, rank: 1 },
    { name: "HackMaster", points: 14500, rank: 2 },
    { name: "SecurityPro", points: 14000, rank: 3 },
    { name: "EthicalHacker", points: 13500, rank: 4 },
    { name: "ByteWarrior", points: 13000, rank: 5 },
  ]

  // Sample features data
  const features = [
    {
      icon: Terminal,
      title: "Learning Paths",
      description: "Structured courses from basics to advanced ethical hacking techniques",
    },
    {
      icon: Flag,
      title: "Capture The Flag",
      description: "Regular CTF events to test your skills in real-world scenarios",
    },
    {
      icon: Brain,
      title: "Interactive Quizzes",
      description: "Test your knowledge with our comprehensive quiz system",
    },
    {
      icon: Trophy,
      title: "Challenges",
      description: "Practice with hands-on hacking challenges and earn badges",
    },
    {
      icon: Users,
      title: "Community",
      description: "Join a community of ethical hackers and share knowledge",
    },
    {
      icon: Shield,
      title: "Certifications",
      description: "Earn recognized certifications as you progress",
    },
  ]

  return (
    <div className="min-h-screen bg-gradient-to-br from-navy-950 via-navy-900 to-navy-950 text-white relative overflow-hidden">
      {init && <Particles className="absolute inset-0" options={particlesOptions} />}

      {/* Background effects */}
      <div className="absolute inset-0 pointer-events-none">
        <motion.div
          className="absolute -left-32 -top-32 w-64 h-64 bg-pink-500/10 rounded-full blur-3xl"
          animate={{
            scale: [1, 1.2, 1],
            opacity: [0.3, 0.5, 0.3],
          }}
          transition={{
            duration: 8,
            repeat: Number.POSITIVE_INFINITY,
            ease: "easeInOut",
          }}
        />

        <motion.div
          className="absolute -right-32 -bottom-32 w-96 h-96 bg-purple-500/10 rounded-full blur-3xl"
          animate={{
            scale: [1, 1.1, 1],
            opacity: [0.2, 0.4, 0.2],
          }}
          transition={{
            duration: 7,
            repeat: Number.POSITIVE_INFINITY,
            ease: "easeInOut",
          }}
        />
      </div>



      <main className="container mx-auto px-4 pt-24 pb-16 relative z-10">
        {/* Hero Section */}
        <section className="py-16 md:py-24">
          <div className="grid lg:grid-cols-2 gap-12 items-center">
            <div className="space-y-8">
              <motion.h1
                className="text-4xl md:text-5xl font-bold leading-tight"
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.5 }}
              >
                Master Ethical Hacking Through
                <span className="bg-gradient-to-r from-pink-500 to-purple-600 text-transparent bg-clip-text">
                  {" "}
                  Interactive Learning
                </span>
              </motion.h1>
              <motion.p
                className="text-lg text-gray-400 max-w-2xl"
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.5, delay: 0.1 }}
              >
                Join our community of ethical hackers. Learn through hands-on challenges, capture the flag events, and
                interactive courses designed by security experts.
              </motion.p>
              <motion.div
                className="flex flex-wrap gap-4"
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.5, delay: 0.2 }}
              >
                <Button
                  size="lg"
                  className="bg-gradient-to-r from-pink-500 to-purple-600 hover:opacity-90 text-white border-0"
                >
                  Start Learning
                </Button>
                <Button size="lg" variant="outline" className="border-pink-500 text-pink-400 hover:bg-pink-500/10">
                  View Challenges
                </Button>
              </motion.div>
              <motion.div
                className="flex flex-wrap items-center gap-4 md:gap-8 pt-4"
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.5, delay: 0.3 }}
              >
                <div className="flex items-center gap-2">
                  <Terminal className="w-5 h-5 text-pink-500" />
                  <span className="text-gray-400">100+ Challenges</span>
                </div>
                <div className="flex items-center gap-2">
                  <Shield className="w-5 h-5 text-pink-500" />
                  <span className="text-gray-400">Expert-Led Content</span>
                </div>
                <div className="flex items-center gap-2">
                  <Trophy className="w-5 h-5 text-pink-500" />
                  <span className="text-gray-400">Global Rankings</span>
                </div>
              </motion.div>
            </div>
            <motion.div
              className="relative"
              initial={{ opacity: 0, scale: 0.9 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ duration: 0.7 }}
            >
              <div className="relative z-10">
                <Image
                  src="/placeholder.svg?height=400&width=600"
                  alt="Cybersecurity Illustration"
                  className="w-full h-auto rounded-lg"
                />
              </div>
              <div className="absolute inset-0 bg-gradient-to-r from-pink-500 to-purple-600 blur-[80px] opacity-25" />
            </motion.div>
          </div>
        </section>

        {/* Features Section */}
        <section className="py-16 md:py-24">
          <div className="text-center mb-16">
            <h2 className="text-3xl font-bold mb-4">Learn Ethical Hacking Through Practice</h2>
            <p className="text-gray-400 max-w-2xl mx-auto">
              Our platform offers multiple ways to learn and practice ethical hacking skills
            </p>
          </div>
          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
            {features.map((feature, index) => (
              <motion.div
                key={index}
                className="p-6 rounded-xl backdrop-blur-sm bg-white/5 border border-white/10 hover:border-pink-500/50 transition-all group"
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.5, delay: index * 0.1 }}
              >
                <feature.icon className="w-12 h-12 text-pink-500 mb-4" />
                <h3 className="text-xl font-semibold mb-2">{feature.title}</h3>
                <p className="text-gray-400">{feature.description}</p>
              </motion.div>
            ))}
          </div>
        </section>

        {/* Learning Paths Section */}
        <section className="py-16 md:py-24 rounded-xl backdrop-blur-sm bg-white/5 border border-white/10 px-6 my-8">
          <h2 className="text-3xl font-bold mb-12">Learning Paths</h2>
          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
            {paths.map((path, index) => (
              <motion.div
                key={index}
                className="rounded-xl bg-white/5 border border-white/10 overflow-hidden"
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.5, delay: index * 0.1 }}
              >
                <div className="p-6">
                  <div className="text-sm text-pink-400 mb-2">{path.level}</div>
                  <h3 className="text-xl font-semibold mb-2">{path.title}</h3>
                  <p className="text-gray-400 mb-4">{path.description}</p>
                  <div className="space-y-2 mb-4">
                    <div className="flex justify-between text-sm">
                      <span className="text-gray-400">{path.progress}% Complete</span>
                      <span className="text-gray-400">{path.modules} Modules</span>
                    </div>
                    <Progress
                      value={path.progress}
                      className="h-1 bg-white/10 bg-gradient-to-r from-pink-500 to-purple-600"
                    />
                  </div>
                  <Button className="w-full bg-gradient-to-r from-pink-500 to-purple-600 hover:opacity-90 border-0">
                    {path.progress > 0 ? "Continue" : "Start Learning"}
                  </Button>
                </div>
              </motion.div>
            ))}
          </div>
        </section>

        {/* Challenges Section */}
        <section className="py-16 md:py-24">
          <div className="flex justify-between items-center flex-wrap gap-4 mb-12">
            <h2 className="text-3xl font-bold">Featured Challenges</h2>
            <Button variant="outline" className="border-pink-500 text-pink-400 hover:bg-pink-500/10">
              View All Challenges
            </Button>
          </div>
          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
            {challenges.map((challenge, index) => (
              <motion.div
                key={index}
                className="rounded-xl backdrop-blur-sm bg-white/5 border border-white/10 p-6 hover:border-pink-500/50 transition-all"
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.5, delay: index * 0.1 }}
              >
                <div className="flex justify-between items-start mb-4">
                  <h3 className="text-xl font-semibold">{challenge.title}</h3>
                  <Badge variant="outline" className="bg-pink-500/10 text-pink-400 border-pink-500/20">
                    {challenge.points} pts
                  </Badge>
                </div>
                <div className="space-y-4">
                  <div className="flex items-center gap-2">
                    <Badge variant="secondary">{challenge.category}</Badge>
                    <Badge
                      variant="outline"
                      className={
                        challenge.difficulty === "Easy"
                          ? "text-green-400"
                          : challenge.difficulty === "Medium"
                            ? "text-yellow-400"
                            : "text-red-400"
                      }
                    >
                      {challenge.difficulty}
                    </Badge>
                  </div>
                  <div className="text-sm text-gray-400">{challenge.completions} completions</div>
                  <Button className="w-full bg-gradient-to-r from-pink-500 to-purple-600 hover:opacity-90 border-0">
                    Start Challenge
                  </Button>
                </div>
              </motion.div>
            ))}
          </div>
        </section>

        {/* Leaderboard Section */}
        <section className="py-16 md:py-24 rounded-xl backdrop-blur-sm bg-white/5 border border-white/10 px-6 my-8">
          <div className="flex items-center gap-4 mb-12">
            <Trophy className="w-8 h-8 text-yellow-500" />
            <h2 className="text-3xl font-bold">Top Hackers</h2>
          </div>
          <div className="bg-white/5 rounded-xl border border-white/10 overflow-hidden">
            {topUsers.map((user, index) => (
              <motion.div
                key={index}
                className={`flex items-center justify-between p-4 ${index !== topUsers.length - 1 ? "border-b border-white/10" : ""
                  }`}
                initial={{ opacity: 0, x: -20 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ duration: 0.5, delay: index * 0.1 }}
              >
                <div className="flex items-center gap-4">
                  <div className="text-2xl font-bold text-gray-400 w-8">{user.rank}</div>
                  <Avatar>
                    <AvatarImage src={`/placeholder.svg?text=${user.name[0]}`} />
                    <AvatarFallback>{user.name[0]}</AvatarFallback>
                  </Avatar>
                  <div className="font-semibold">{user.name}</div>
                </div>
                <div className="text-pink-400 font-mono">{user.points.toLocaleString()} pts</div>
              </motion.div>
            ))}
          </div>
        </section>

        {/* CTA Section */}
        <section className="py-16 md:py-24 text-center">
          <motion.div
            className="max-w-3xl mx-auto space-y-8"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5 }}
          >
            <h2 className="text-3xl md:text-4xl font-bold">Ready to Start Your Ethical Hacking Journey?</h2>
            <p className="text-lg text-gray-400">
              Join thousands of security enthusiasts and professionals learning ethical hacking skills.
            </p>
            <div className="flex flex-wrap justify-center gap-4">
              <Button
                size="lg"
                className="bg-gradient-to-r from-pink-500 to-purple-600 hover:opacity-90 text-white border-0"
              >
                Create Free Account
              </Button>
              <Button size="lg" variant="outline" className="border-pink-500 text-pink-400 hover:bg-pink-500/10">
                Explore Platform
              </Button>
            </div>
          </motion.div>
        </section>
      </main>

      {/* Footer */}
      <footer className="border-t border-white/10 py-8 relative z-10">
        <div className="container mx-auto px-4">
          <div className="flex flex-col md:flex-row justify-between items-center gap-4">
            <div className="text-gray-400 text-sm">
              © {new Date().getFullYear()} Ethical Hacking Platform. All rights reserved.
            </div>
            <div className="flex gap-6">
              <a href="#" className="text-gray-400 hover:text-pink-400 transition-colors">
                Terms
              </a>
              <a href="#" className="text-gray-400 hover:text-pink-400 transition-colors">
                Privacy
              </a>
              <a href="#" className="text-gray-400 hover:text-pink-400 transition-colors">
                Contact
              </a>
            </div>
          </div>
        </div>
      </footer>
    </div>
  )
}

