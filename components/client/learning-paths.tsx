import { Button } from "@/components/ui/button"
import { Progress } from "@/components/ui/progress"

export function LearningPaths() {
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

  return (
    <section className="py-20 px-4 bg-black/20">
      <div className="container mx-auto">
        <h2 className="text-3xl font-bold text-white mb-12">Learning Paths</h2>
        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
          {paths.map((path, index) => (
            <div key={index} className="rounded-xl bg-white/5 border border-white/10 overflow-hidden">
              <div className="p-6">
                <div className="text-sm text-purple-400 mb-2">{path.level}</div>
                <h3 className="text-xl font-semibold text-white mb-2">{path.title}</h3>
                <p className="text-gray-400 mb-4">{path.description}</p>
                <div className="space-y-2 mb-4">
                  <div className="flex justify-between text-sm">
                    <span className="text-gray-400">{path.progress}% Complete</span>
                    <span className="text-gray-400">{path.modules} Modules</span>
                  </div>
                  <Progress value={path.progress} className="h-1 bg-white/10" />
                </div>
                <Button className="w-full bg-purple-600 hover:bg-purple-700">
                  {path.progress > 0 ? "Continue" : "Start Learning"}
                </Button>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  )
}

