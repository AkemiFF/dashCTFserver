import { Trophy } from "lucide-react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Progress } from "@/components/ui/progress"

export function PopularCourses() {
  const courses = [
    {
      title: "Web Security Fundamentals",
      enrolled: 1234,
      rating: 4.8,
      progress: 85,
    },
    {
      title: "Mobile App Penetration",
      enrolled: 890,
      rating: 4.7,
      progress: 72,
    },
    {
      title: "Cryptography Basics",
      enrolled: 756,
      rating: 4.9,
      progress: 65,
    },
  ]

  return (
    <Card className="bg-[#1A1A2E] border-purple-500/20">
      <CardHeader className="flex flex-row items-center space-x-2">
        <Trophy className="w-5 h-5 text-yellow-500" />
        <CardTitle className="text-white">Popular Courses</CardTitle>
      </CardHeader>
      <CardContent>
        <div className="space-y-6">
          {courses.map((course, index) => (
            <div key={index} className="space-y-2">
              <div className="flex justify-between items-start">
                <div>
                  <h4 className="font-semibold text-white">{course.title}</h4>
                  <div className="flex items-center space-x-2 text-sm text-gray-400">
                    <span>{course.enrolled} enrolled</span>
                    <span>•</span>
                    <span>⭐ {course.rating}</span>
                  </div>
                </div>
              </div>
              <Progress value={course.progress} className="h-1 bg-gray-800">
                <div className="bg-gradient-to-r from-purple-500 to-blue-500" />
              </Progress>
            </div>
          ))}
        </div>
      </CardContent>
    </Card>
  )
}

