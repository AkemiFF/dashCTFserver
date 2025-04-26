"use client"

import { Badge } from "@/components/ui/badge"
import { Card, CardContent } from "@/components/ui/card"

interface CourseCardProps {
  course: any

}
interface Tag {
  id: string
  name: string
}

export function CourseCard({ course }: CourseCardProps) {
  return (
    <Card className="overflow-hidden border border-white/10 bg-white/5 backdrop-blur-sm hover:bg-white/10 transition-all cursor-pointer h-full flex flex-col">
      <div className="relative">
        <img src={course.image || "/placeholder.svg"} alt={course.title} className="w-full h-48 object-cover" />
        {course.progress > 0 && (
          <div className="absolute bottom-0 left-0 right-0 bg-black/50 px-4 py-2">
            <div className="flex justify-between items-center text-sm">
              <span>Progress: {course.progress}%</span>
              <Badge className="bg-gradient-to-r from-pink-500 to-purple-600">In Progress</Badge>
            </div>
          </div>
        )}
      </div>

      <CardContent className="p-5 flex-1 flex flex-col">
        <div className="flex-1">
          <div className="flex flex-wrap gap-2 mb-2">
            {course.tags.slice(0, 2).map((tag: Tag) => (
              <Badge key={tag.id} variant="outline" className="bg-white/5 text-white/70 border-white/10">
                {tag.name}
              </Badge>
            ))}
            {course.tags.length > 2 && (
              <Badge variant="outline" className="bg-white/5 text-white/70 border-white/10">
                +{course.tags.length - 2}
              </Badge>
            )}
          </div>

          <h3 className="font-semibold text-lg mb-1">{course.title}</h3>
          <p className="text-white/70 text-sm line-clamp-2 mb-3">{course.description}</p>
        </div>

        <div className="pt-3 border-t border-white/10 flex justify-between items-center">
          <div className="flex items-center gap-1.5">
            <img src="/placeholder.svg?height=24&width=24" alt={course.instructor} className="w-6 h-6 rounded-full" />
            <span className="text-sm text-white/70">{course.instructor}</span>
          </div>

          <div className="flex items-center">
            <div className="flex items-center mr-3">
              <svg className="w-4 h-4 text-yellow-400 fill-yellow-400" viewBox="0 0 24 24">
                <path d="M12 17.27L18.18 21l-1.64-7.03L22 9.24l-7.19-.61L12 2 9.19 8.63 2 9.24l5.46 4.73L5.82 21z" />
              </svg>
              <span className="ml-1 text-sm">{course.rating}</span>
            </div>
            <span className="text-sm text-white/70">{course.duration}</span>
          </div>
        </div>
      </CardContent>
    </Card>
  )
}
