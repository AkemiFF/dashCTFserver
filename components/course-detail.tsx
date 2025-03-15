"use client"

import { CourseCard } from "@/components/course-card"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader } from "@/components/ui/card"
import { Progress } from "@/components/ui/progress"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { motion } from "framer-motion"
import { BookOpen, CheckCircle2, Clock, Download, FileText, MessageSquare, Play, Star, Users } from "lucide-react"
import { useState } from "react"

interface CourseDetailProps {
  course: any
  courses: any[]
}

export function CourseDetail({ course, courses }: CourseDetailProps) {
  const [activeTab, setActiveTab] = useState("modules")

  return (
    <div className="space-y-6">
      {/* Course Header */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <div className="lg:col-span-2">
          <div className="relative rounded-xl overflow-hidden">
            <img src={course.image || "/placeholder.svg"} alt={course.title} className="w-full h-64 object-cover" />
            <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/40 to-transparent flex items-end">
              <div className="p-6">
                <div className="flex flex-wrap gap-2 mb-3">
                  {course.tags.map((tag: string) => (
                    <Badge key={tag} className="bg-white/10 hover:bg-white/20">
                      {tag}
                    </Badge>
                  ))}
                </div>
                <h1 className="text-2xl md:text-3xl font-bold">{course.title}</h1>
                <div className="flex flex-wrap items-center gap-4 mt-3">
                  <div className="flex items-center gap-1.5">
                    <img
                      src="/placeholder.svg?height=32&width=32"
                      alt={course.instructor}
                      className="w-6 h-6 rounded-full"
                    />
                    <span className="text-sm">{course.instructor}</span>
                  </div>

                  <div className="flex items-center gap-1">
                    <Star className="h-4 w-4 text-yellow-400 fill-yellow-400" />
                    <span className="text-sm">{course.rating}</span>
                    <span className="text-white/60 text-sm">(128 reviews)</span>
                  </div>

                  <div className="flex items-center gap-1">
                    <Users className="h-4 w-4 text-white/60" />
                    <span className="text-sm">{course.students.toLocaleString()} students</span>
                  </div>

                  <div className="flex items-center gap-1">
                    <Clock className="h-4 w-4 text-white/60" />
                    <span className="text-sm">{course.duration}</span>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>

        <div className="lg:col-span-1">
          <Card className="border border-white/10 bg-white/5 backdrop-blur-sm h-full">
            <CardContent className="p-6 space-y-4">
              <div className="text-center">
                <div className="text-3xl font-bold mb-1">
                  {course.progress > 0 ? `${course.progress}% Complete` : "Ready to Start?"}
                </div>
                {course.progress > 0 ? (
                  <Progress value={course.progress} className="h-2 mb-4" />
                ) : (
                  <p className="text-white/70 mb-4">Enroll now to track your progress</p>
                )}
              </div>

              <Button className="w-full bg-gradient-to-r from-pink-500 to-purple-600 hover:from-pink-600 hover:to-purple-700">
                {course.progress > 0 ? (
                  <>
                    <Play className="h-4 w-4 mr-2" />
                    Continue Learning
                  </>
                ) : (
                  <>
                    <BookOpen className="h-4 w-4 mr-2" />
                    Enroll in Course
                  </>
                )}
              </Button>

              <div className="pt-4 border-t border-white/10 space-y-3">
                <div className="flex justify-between">
                  <span className="text-white/70">Level:</span>
                  <span>{course.level}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-white/70">Modules:</span>
                  <span>{course.modules.length}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-white/70">Total Duration:</span>
                  <span>
                    {course.modules.reduce((total: number, module: any) => {
                      const time = module.duration.match(/(\d+)h\s*(\d+)min|(\d+)h|(\d+)min/)
                      let minutes = 0
                      if (time) {
                        if (time[1] && time[2]) minutes = Number.parseInt(time[1]) * 60 + Number.parseInt(time[2])
                        else if (time[3]) minutes = Number.parseInt(time[3]) * 60
                        else if (time[4]) minutes = Number.parseInt(time[4])
                      }
                      return total + minutes
                    }, 0) /
                      60 >
                      1
                      ? `${Math.floor(
                        course.modules.reduce((total: number, module: any) => {
                          const time = module.duration.match(/(\d+)h\s*(\d+)min|(\d+)h|(\d+)min/)
                          let minutes = 0
                          if (time) {
                            if (time[1] && time[2]) minutes = Number.parseInt(time[1]) * 60 + Number.parseInt(time[2])
                            else if (time[3]) minutes = Number.parseInt(time[3]) * 60
                            else if (time[4]) minutes = Number.parseInt(time[4])
                          }
                          return total + minutes
                        }, 0) / 60,
                      )} hours ${course.modules.reduce((total: number, module: any) => {
                        const time = module.duration.match(/(\d+)h\s*(\d+)min|(\d+)h|(\d+)min/)
                        let minutes = 0
                        if (time) {
                          if (time[1] && time[2]) minutes = Number.parseInt(time[1]) * 60 + Number.parseInt(time[2])
                          else if (time[3]) minutes = Number.parseInt(time[3]) * 60
                          else if (time[4]) minutes = Number.parseInt(time[4])
                        }
                        return total + minutes
                      }, 0) % 60
                      } min`
                      : `${course.modules.reduce((total: number, module: any) => {
                        const time = module.duration.match(/(\d+)h\s*(\d+)min|(\d+)h|(\d+)min/)
                        let minutes = 0
                        if (time) {
                          if (time[1] && time[2]) minutes = Number.parseInt(time[1]) * 60 + Number.parseInt(time[2])
                          else if (time[3]) minutes = Number.parseInt(time[3]) * 60
                          else if (time[4]) minutes = Number.parseInt(time[4])
                        }
                        return total + minutes
                      }, 0)} min`}
                  </span>
                </div>
                <div className="flex justify-between">
                  <span className="text-white/70">Certificate:</span>
                  <span>Yes, on completion</span>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>

      {/* Course Content Tabs */}
      <Tabs defaultValue="modules" value={activeTab} onValueChange={setActiveTab} className="w-full">
        <TabsList className="bg-white/5 border border-white/10">
          <TabsTrigger value="modules" className="data-[state=active]:bg-white/10">
            <BookOpen className="h-4 w-4 mr-2" />
            Modules
          </TabsTrigger>
          <TabsTrigger value="overview" className="data-[state=active]:bg-white/10">
            <FileText className="h-4 w-4 mr-2" />
            Overview
          </TabsTrigger>
          <TabsTrigger value="resources" className="data-[state=active]:bg-white/10">
            <Download className="h-4 w-4 mr-2" />
            Resources
          </TabsTrigger>
          <TabsTrigger value="discussions" className="data-[state=active]:bg-white/10">
            <MessageSquare className="h-4 w-4 mr-2" />
            Discussions
          </TabsTrigger>
        </TabsList>

        <TabsContent value="modules" className="mt-6">
          <Card className="border border-white/10 bg-white/5 backdrop-blur-sm">
            <CardHeader className="pb-3">
              <h3 className="text-xl font-semibold">Course Modules</h3>
              <p className="text-white/70 text-sm">
                {course.modules.length} modules • {course.progress > 0 ? `${course.progress}% complete` : "Not started"}
              </p>
            </CardHeader>
            <CardContent className="space-y-4">
              {course.modules.map((module: any, index: number) => (
                <motion.div
                  key={module.id}
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.3, delay: index * 0.05 }}
                  className={`p-4 rounded-lg border ${module.completed
                    ? "border-green-500/20 bg-green-500/5"
                    : "border-white/10 bg-white/5 hover:bg-white/10"
                    } transition-colors cursor-pointer`}
                >
                  <div className="flex items-start gap-3">
                    <div
                      className={`w-8 h-8 rounded-full flex items-center justify-center flex-shrink-0 ${module.completed ? "bg-green-500/20 text-green-500" : "bg-white/10 text-white/70"
                        }`}
                    >
                      {module.completed ? <CheckCircle2 className="h-4 w-4" /> : <span>{index + 1}</span>}
                    </div>

                    <div className="flex-1">
                      <div className="flex justify-between">
                        <h4 className="font-medium">{module.title}</h4>
                        <span className="text-white/60 text-sm">{module.duration}</span>
                      </div>

                      <div className="flex items-center gap-2 mt-2">
                        <Button size="sm" variant="ghost" className="h-8 px-3 text-xs bg-white/5 hover:bg-white/10">
                          <Play className="h-3 w-3 mr-1" />
                          {module.completed ? "Replay" : "Start"}
                        </Button>

                        {module.completed && (
                          <Badge variant="outline" className="bg-green-500/10 text-green-400 border-green-500/20">
                            Completed
                          </Badge>
                        )}
                      </div>
                    </div>
                  </div>
                </motion.div>
              ))}
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="overview" className="mt-6">
          <Card className="border border-white/10 bg-white/5 backdrop-blur-sm">
            <CardContent className="p-6">
              <h3 className="text-xl font-semibold mb-4">About This Course</h3>
              <p className="text-white/80 mb-6 leading-relaxed">
                {course.description}
                {
                  " This comprehensive course is designed to give you a deep understanding of the subject matter through practical examples and hands-on exercises. By the end of this course, you'll have the skills and knowledge to apply these concepts in real-world scenarios."
                }
              </p>

              <h4 className="text-lg font-medium mb-3">What You'll Learn</h4>
              <ul className="grid grid-cols-1 md:grid-cols-2 gap-2 mb-6">
                <li className="flex items-start gap-2">
                  <CheckCircle2 className="h-5 w-5 text-green-400 flex-shrink-0 mt-0.5" />
                  <span>Master the fundamental concepts and principles</span>
                </li>
                <li className="flex items-start gap-2">
                  <CheckCircle2 className="h-5 w-5 text-green-400 flex-shrink-0 mt-0.5" />
                  <span>Build practical projects to reinforce your learning</span>
                </li>
                <li className="flex items-start gap-2">
                  <CheckCircle2 className="h-5 w-5 text-green-400 flex-shrink-0 mt-0.5" />
                  <span>Understand best practices and industry standards</span>
                </li>
                <li className="flex items-start gap-2">
                  <CheckCircle2 className="h-5 w-5 text-green-400 flex-shrink-0 mt-0.5" />
                  <span>Solve complex problems with efficient solutions</span>
                </li>
                <li className="flex items-start gap-2">
                  <CheckCircle2 className="h-5 w-5 text-green-400 flex-shrink-0 mt-0.5" />
                  <span>Apply your knowledge to real-world scenarios</span>
                </li>
                <li className="flex items-start gap-2">
                  <CheckCircle2 className="h-5 w-5 text-green-400 flex-shrink-0 mt-0.5" />
                  <span>Prepare for industry certification exams</span>
                </li>
              </ul>

              <h4 className="text-lg font-medium mb-3">Requirements</h4>
              <ul className="space-y-2 mb-6">
                <li className="flex items-start gap-2">
                  <div className="w-1 h-1 rounded-full bg-white/60 mt-2.5"></div>
                  <span>Basic understanding of {course.tags[0]} concepts</span>
                </li>
                <li className="flex items-start gap-2">
                  <div className="w-1 h-1 rounded-full bg-white/60 mt-2.5"></div>
                  <span>A computer with internet access</span>
                </li>
                <li className="flex items-start gap-2">
                  <div className="w-1 h-1 rounded-full bg-white/60 mt-2.5"></div>
                  <span>Enthusiasm to learn and practice</span>
                </li>
              </ul>

              <h4 className="text-lg font-medium mb-3">Instructor</h4>
              <div className="flex items-start gap-4">
                <img
                  src="/placeholder.svg?height=80&width=80"
                  alt={course.instructor}
                  className="w-16 h-16 rounded-full object-cover"
                />
                <div>
                  <h5 className="font-medium">{course.instructor}</h5>
                  <p className="text-white/70 text-sm mb-2">Senior {course.tags[0]} Expert</p>
                  <p className="text-white/80 text-sm">
                    An experienced instructor with over 10 years of industry experience in {course.tags.join(", ")}.
                    Passionate about teaching and helping students achieve their learning goals.
                  </p>
                </div>
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="resources" className="mt-6">
          <Card className="border border-white/10 bg-white/5 backdrop-blur-sm">
            <CardContent className="p-6">
              <h3 className="text-xl font-semibold mb-4">Course Resources</h3>
              <div className="space-y-3">
                <div className="p-4 border border-white/10 rounded-lg bg-white/5 hover:bg-white/10 transition-colors cursor-pointer flex justify-between items-center">
                  <div className="flex items-center gap-3">
                    <FileText className="h-5 w-5 text-white/70" />
                    <div>
                      <h4 className="font-medium">Course Syllabus</h4>
                      <p className="text-white/60 text-sm">PDF, 2.3 MB</p>
                    </div>
                  </div>
                  <Button size="sm" variant="ghost" className="h-8 px-3">
                    <Download className="h-4 w-4 mr-1" />
                    Download
                  </Button>
                </div>

                <div className="p-4 border border-white/10 rounded-lg bg-white/5 hover:bg-white/10 transition-colors cursor-pointer flex justify-between items-center">
                  <div className="flex items-center gap-3">
                    <FileText className="h-5 w-5 text-white/70" />
                    <div>
                      <h4 className="font-medium">Exercise Files</h4>
                      <p className="text-white/60 text-sm">ZIP, 15.7 MB</p>
                    </div>
                  </div>
                  <Button size="sm" variant="ghost" className="h-8 px-3">
                    <Download className="h-4 w-4 mr-1" />
                    Download
                  </Button>
                </div>

                <div className="p-4 border border-white/10 rounded-lg bg-white/5 hover:bg-white/10 transition-colors cursor-pointer flex justify-between items-center">
                  <div className="flex items-center gap-3">
                    <FileText className="h-5 w-5 text-white/70" />
                    <div>
                      <h4 className="font-medium">Reference Guide</h4>
                      <p className="text-white/60 text-sm">PDF, 4.1 MB</p>
                    </div>
                  </div>
                  <Button size="sm" variant="ghost" className="h-8 px-3">
                    <Download className="h-4 w-4 mr-1" />
                    Download
                  </Button>
                </div>
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="discussions" className="mt-6">
          <Card className="border border-white/10 bg-white/5 backdrop-blur-sm">
            <CardContent className="p-6">
              <h3 className="text-xl font-semibold mb-4">Course Discussions</h3>
              <p className="text-white/70 mb-4">Join the conversation with other students and the instructor.</p>

              <div className="space-y-4">
                <div className="p-4 border border-white/10 rounded-lg bg-white/5">
                  <div className="flex items-start gap-3">
                    <img
                      src="/placeholder.svg?height=40&width=40"
                      alt="User Avatar"
                      className="w-10 h-10 rounded-full"
                    />
                    <div className="flex-1">
                      <div className="flex justify-between items-start">
                        <div>
                          <h4 className="font-medium">Marie Laurent</h4>
                          <p className="text-white/60 text-xs">2 days ago</p>
                        </div>
                        <Badge variant="outline" className="bg-white/5">
                          Module 3
                        </Badge>
                      </div>
                      <p className="mt-2 text-white/80">
                        I'm having trouble understanding the concept in module 3. Could someone explain it in simpler
                        terms?
                      </p>
                      <div className="mt-3 flex gap-2">
                        <Button size="sm" variant="ghost" className="h-8 px-3 text-xs">
                          <MessageSquare className="h-3 w-3 mr-1" />
                          Reply
                        </Button>
                      </div>
                    </div>
                  </div>
                </div>

                <div className="p-4 border border-white/10 rounded-lg bg-white/5 ml-8">
                  <div className="flex items-start gap-3">
                    <img
                      src="/placeholder.svg?height=40&width=40"
                      alt="Instructor Avatar"
                      className="w-10 h-10 rounded-full"
                    />
                    <div className="flex-1">
                      <div className="flex justify-between items-start">
                        <div>
                          <h4 className="font-medium">{course.instructor}</h4>
                          <p className="text-white/60 text-xs">1 day ago</p>
                        </div>
                        <Badge className="bg-gradient-to-r from-pink-500 to-purple-600">Instructor</Badge>
                      </div>
                      <p className="mt-2 text-white/80">
                        Hi Marie! Think of it like this: [simplified explanation]. Does that help clarify things?
                      </p>
                      <div className="mt-3 flex gap-2">
                        <Button size="sm" variant="ghost" className="h-8 px-3 text-xs">
                          <MessageSquare className="h-3 w-3 mr-1" />
                          Reply
                        </Button>
                      </div>
                    </div>
                  </div>
                </div>
              </div>

              <Button className="w-full mt-4 bg-white/10 hover:bg-white/20">View All Discussions</Button>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>

      {/* Related Courses */}
      <div className="mt-8">
        <h3 className="text-xl font-semibold mb-4">Related Courses</h3>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {courses && courses.length > 0 ? (
            courses
              .filter((c) => c.id !== course.id && c.tags.some((tag: any) => course.tags.includes(tag)))
              .slice(0, 3)
              .map((relatedCourse, index) => (
                <motion.div
                  key={relatedCourse.id}
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.5, delay: index * 0.1 }}
                >
                  <CourseCard course={relatedCourse} onClick={() => window.scrollTo(0, 0)} />
                </motion.div>
              ))
          ) : (
            <div className="col-span-3 text-center py-8 text-white/60">No related courses found</div>
          )}
        </div>
      </div>
    </div>
  )
}

