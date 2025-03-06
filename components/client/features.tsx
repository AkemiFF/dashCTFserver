import { Terminal, Flag, Brain, Trophy, Users, Shield } from "lucide-react"

export function Features() {
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
    <section className="py-20 px-4">
      <div className="container mx-auto">
        <div className="text-center mb-16">
          <h2 className="text-3xl font-bold text-white mb-4">Learn Ethical Hacking Through Practice</h2>
          <p className="text-gray-400 max-w-2xl mx-auto">
            Our platform offers multiple ways to learn and practice ethical hacking skills
          </p>
        </div>
        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
          {features.map((feature, index) => (
            <div
              key={index}
              className="p-6 rounded-xl bg-white/5 border border-white/10 hover:border-purple-500/50 transition-all group"
            >
              <feature.icon className="w-12 h-12 text-purple-500 mb-4" />
              <h3 className="text-xl font-semibold text-white mb-2">{feature.title}</h3>
              <p className="text-gray-400">{feature.description}</p>
            </div>
          ))}
        </div>
      </div>
    </section>
  )
}

