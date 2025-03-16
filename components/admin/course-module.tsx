import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import type { Module } from "@/types/course"
import Image from "next/image"

interface CourseModuleProps {
  module: Module
}

export function CourseModule({ module }: CourseModuleProps) {
  return (
    <Card className="mb-6">
      <CardHeader>
        <CardTitle>{module.title}</CardTitle>
      </CardHeader>
      <CardContent>
        {module.content.map((item, index) => {
          switch (item.type) {
            case "text":
              return (
                <p key={index} className="mb-4">
                  {item.content}
                </p>
              )
            case "image":
              return (
                <div key={index} className={`mb-4 flex justify-${item.type || "center"}`}>
                  <Image
                    src={item.url || "/placeholder.svg"}
                    alt="Module image"
                    width={400}
                    height={300}
                    className="rounded-lg"
                  />
                </div>
              )
            case "video":
              return (
                <div key={index} className={`mb-4 flex justify-${item.type || "center"}`}>
                  <video controls width="400" className="rounded-lg">
                    <source src={item.url} type="video/mp4" />
                    Your browser does not support the video tag.
                  </video>
                </div>
              )
            default:
              return null
          }
        })}
      </CardContent>
    </Card>
  )
}

