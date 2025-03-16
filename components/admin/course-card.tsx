import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { ADMIN_NAME } from "@/lib/host"
import type { Course } from "@/types/course"
import { BookOpen, Clock } from "lucide-react"
import Link from "next/link"

interface CourseCardProps extends Course { }

export function CourseCard({ id, title, description, level, duration, modules }: CourseCardProps) {
  return (
    <Card className="hover:shadow-lg transition-shadow bg-card/50 backdrop-blur-xl">
      <CardHeader>
        <CardTitle className="text-lg">{title}</CardTitle>
        <Badge variant="outline" className="w-fit">
          {level}
        </Badge>
      </CardHeader>
      <CardContent>
        <p className="text-muted-foreground mb-4">{description}</p>
        <div className="flex items-center space-x-2 text-sm text-muted-foreground">
          <Clock size={16} />
          <span>{duration}</span>
        </div>
        <div className="flex items-center space-x-2 text-sm text-muted-foreground mt-2">
          <BookOpen size={16} />
          <span>{modules?.length} modules</span>
        </div>
      </CardContent>
      <CardFooter>
        <Link href={`${ADMIN_NAME}/learn/${id}`} className="w-full">
          <Button className="w-full">Détails du cours</Button>
        </Link>
      </CardFooter>
    </Card>
  )
}

