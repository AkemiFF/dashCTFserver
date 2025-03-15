"use client"

import { Card, CardContent, CardFooter } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Progress } from "@/components/ui/progress"
import { Clock, Star, Users } from "lucide-react"

interface CourseCardProps {
  course: any
  onClick: () => void
}

export function CourseCard({ course, onClick }: CourseCardProps) {
  return (
    <Card
      className="overflow-hidden border border-white/10 bg-white/5 backdrop-blur-sm hover:bg-white/10 transition-all cursor-pointer h-full flex flex-col"
      onClick={onClick}
    >
      <div className="relative">
        <img src={course.image || "/placeholder.svg"} alt={course.title} className="w-full h-48 object-cover" />
        {course.featured && (
          <Badge className="absolute top-3 left-3 bg-gradient-to-r from-pink-500 to-purple-600">Featured</Badge>
        )}
        {course.progress > 0 && (
          <div className="absolute bottom-0 left-0 right-0 bg-black/50 px-3 py-1.5">
            <div className="flex justify-between text-xs mb-1">
              <span>Your progress</span>
              <span>{course.progress}%</span>
            </div>
            <Progress value={course.progress} className="h-1.5" />
          </div>
        )}
      </div>

      <CardContent className="flex-1 p-5">
        <div className="flex items-center gap-1 text-white/60 text-sm mb-2">
          <Clock className="h-3.5 w-3.5" />
          <span>{course.duration}</span>
          <span className="mx-1.5">•</span>
          <span>{course.level}</span>
        </div>

        <h3 className="font-semibold text-lg mb-2 line-clamp-2">{course.title}</h3>
        <p className="text-white/70 text-sm line-clamp-3 mb-3">{course.description}</p>

        <div className="flex flex-wrap gap-1.5 mt-auto">
          {course.tags.slice(0, 3).map((tag: string) => (
            <Badge key={tag} variant="outline" className="bg-white/5 text-xs">
              {tag}
            </Badge>
          ))}
          {course.tags.length > 3 && (
            <Badge variant="outline" className="bg-white/5 text-xs">
              +{course.tags.length - 3}
            </Badge>
          )}
        </div>
      </CardContent>

      <CardFooter className="border-t border-white/10 p-5 flex justify-between">
        <div className="flex items-center gap-1.5">
          <img src="/placeholder.svg?height=24&width=24" alt={course.instructor} className="w-6 h-6 rounded-full" />
          <span className="text-sm">{course.instructor}</span>
        </div>

        <div className="flex items-center gap-3">
          <div className="flex items-center gap-1">
            <Star className="h-4 w-4 text-yellow-400 fill-yellow-400" />
            <span className="text-sm">{course.rating}</span>
          </div>

          <div className="flex items-center gap-1">
            <Users className="h-4 w-4 text-white/60" />
            <span className="text-sm">{course.students.toLocaleString()}</span>
          </div>
        </div>
      </CardFooter>
    </Card>
  )
}

