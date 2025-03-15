"use client"

import { CourseDetail } from "@/components/course-detail"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { Card, CardContent } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { useDebounce } from "@/hooks/use-debounce"
import { motion } from "framer-motion"
import { BookOpen, Clock, Plus, Search, TrendingUp } from "lucide-react"
import { useRouter, useSearchParams } from "next/navigation"
import { useEffect, useState } from "react"

// Sample course data
const coursesData = [
  {
    id: "1",
    title: "Introduction to Web Development",
    description: "Learn the fundamentals of web development including HTML, CSS, and JavaScript.",
    instructor: "Sarah Johnson",
    image: "/placeholder.svg?height=400&width=600",
    rating: 4.8,
    students: 12500,
    duration: "24 hours",
    level: "Beginner",
    tags: ["Web Development", "HTML", "CSS", "JavaScript"],
    progress: 0,
    modules: [
      {
        id: "m1",
        title: "Getting Started with HTML",
        duration: "2h 30min",
        completed: false,
      },
      {
        id: "m2",
        title: "CSS Fundamentals",
        duration: "3h 15min",
        completed: false,
      },
      {
        id: "m3",
        title: "JavaScript Basics",
        duration: "4h",
        completed: false,
      },
      {
        id: "m4",
        title: "Building Your First Website",
        duration: "5h",
        completed: false,
      },
    ],
  },
  {
    id: "2",
    title: "Advanced React Development",
    description: "Master React.js and build complex, interactive user interfaces.",
    instructor: "Michael Chen",
    image: "/placeholder.svg?height=400&width=600",
    rating: 4.9,
    students: 8300,
    duration: "30 hours",
    level: "Advanced",
    tags: ["React", "JavaScript", "Frontend"],
    progress: 65,
    modules: [
      {
        id: "m1",
        title: "React Hooks Deep Dive",
        duration: "3h",
        completed: true,
      },
      {
        id: "m2",
        title: "State Management with Redux",
        duration: "4h 30min",
        completed: true,
      },
      {
        id: "m3",
        title: "Performance Optimization",
        duration: "3h 45min",
        completed: false,
      },
      {
        id: "m4",
        title: "Testing React Applications",
        duration: "4h",
        completed: false,
      },
    ],
  },
  {
    id: "3",
    title: "Python for Data Science",
    description: "Learn Python programming and its applications in data analysis and visualization.",
    instructor: "Emily Rodriguez",
    image: "/placeholder.svg?height=400&width=600",
    rating: 4.7,
    students: 15800,
    duration: "28 hours",
    level: "Intermediate",
    tags: ["Python", "Data Science", "Machine Learning"],
    progress: 0,
    modules: [
      {
        id: "m1",
        title: "Python Fundamentals",
        duration: "3h",
        completed: false,
      },
      {
        id: "m2",
        title: "Data Manipulation with Pandas",
        duration: "4h",
        completed: false,
      },
      {
        id: "m3",
        title: "Data Visualization",
        duration: "3h 30min",
        completed: false,
      },
      {
        id: "m4",
        title: "Introduction to Machine Learning",
        duration: "5h",
        completed: false,
      },
    ],
  },
  {
    id: "4",
    title: "Full Stack Development with MERN",
    description: "Build complete web applications using MongoDB, Express, React, and Node.js.",
    instructor: "David Wilson",
    image: "/placeholder.svg?height=400&width=600",
    rating: 4.6,
    students: 7200,
    duration: "36 hours",
    level: "Intermediate",
    tags: ["MERN", "Full Stack", "JavaScript", "React", "Node.js"],
    progress: 25,
    modules: [
      {
        id: "m1",
        title: "Setting Up Your Development Environment",
        duration: "2h",
        completed: true,
      },
      {
        id: "m2",
        title: "Building RESTful APIs with Express",
        duration: "4h",
        completed: true,
      },
      {
        id: "m3",
        title: "Frontend Development with React",
        duration: "5h",
        completed: false,
      },
      {
        id: "m4",
        title: "Database Design with MongoDB",
        duration: "4h 30min",
        completed: false,
      },
    ],
  },
  {
    id: "5",
    title: "UI/UX Design Principles",
    description: "Learn the fundamentals of user interface and user experience design.",
    instructor: "Sophia Lee",
    image: "/placeholder.svg?height=400&width=600",
    rating: 4.9,
    students: 9500,
    duration: "20 hours",
    level: "Beginner",
    tags: ["UI/UX", "Design", "Figma"],
    progress: 0,
    modules: [
      {
        id: "m1",
        title: "Introduction to UI/UX Design",
        duration: "2h",
        completed: false,
      },
      {
        id: "m2",
        title: "User Research Methods",
        duration: "3h",
        completed: false,
      },
      {
        id: "m3",
        title: "Wireframing and Prototyping",
        duration: "4h",
        completed: false,
      },
      {
        id: "m4",
        title: "Design Systems",
        duration: "3h 30min",
        completed: false,
      },
    ],
  },
  {
    id: "6",
    title: "DevOps and CI/CD Pipelines",
    description: "Master DevOps practices and build continuous integration/continuous deployment pipelines.",
    instructor: "Robert Taylor",
    image: "/placeholder.svg?height=400&width=600",
    rating: 4.7,
    students: 5800,
    duration: "25 hours",
    level: "Advanced",
    tags: ["DevOps", "CI/CD", "Docker", "Kubernetes"],
    progress: 0,
    modules: [
      {
        id: "m1",
        title: "Introduction to DevOps",
        duration: "2h 30min",
        completed: false,
      },
      {
        id: "m2",
        title: "Containerization with Docker",
        duration: "4h",
        completed: false,
      },
      {
        id: "m3",
        title: "Orchestration with Kubernetes",
        duration: "5h",
        completed: false,
      },
      {
        id: "m4",
        title: "Building CI/CD Pipelines",
        duration: "4h 30min",
        completed: false,
      },
    ],
  },
]

export default function CoursesPage() {
  const router = useRouter()
  const searchParams = useSearchParams()
  const courseId = searchParams.get("id")

  const [searchTerm, setSearchTerm] = useState("")
  const [activeTab, setActiveTab] = useState("all")
  const [filteredCourses, setFilteredCourses] = useState(coursesData)
  const [selectedCourse, setSelectedCourse] = useState<any>(null)

  const debouncedSearchTerm = useDebounce(searchTerm, 300)

  useEffect(() => {
    if (courseId) {
      const course = coursesData.find((c) => c.id === courseId)
      if (course) {
        setSelectedCourse(course)
      }
    } else {
      setSelectedCourse(null)
    }
  }, [courseId])

  useEffect(() => {
    let filtered = [...coursesData]

    // Apply search filter
    if (debouncedSearchTerm) {
      filtered = filtered.filter(
        (course) =>
          course.title.toLowerCase().includes(debouncedSearchTerm.toLowerCase()) ||
          course.description.toLowerCase().includes(debouncedSearchTerm.toLowerCase()) ||
          course.tags.some((tag) => tag.toLowerCase().includes(debouncedSearchTerm.toLowerCase())),
      )
    }

    // Apply tab filter
    if (activeTab === "popular") {
      filtered = filtered.sort((a, b) => b.students - a.students)
    } else if (activeTab === "newest") {
      // In a real app, you'd sort by date
      filtered = filtered.sort((a, b) => b.id.localeCompare(a.id))
    } else if (activeTab === "enrolled") {
      filtered = filtered.filter((course) => course.progress > 0)
    }

    setFilteredCourses(filtered)
  }, [debouncedSearchTerm, activeTab])

  const handleCourseClick = (course: any) => {
    router.push(`/courses?id=${course.id}`)
  }

  const handleBackToList = () => {
    router.push("/courses")
  }

  return (
    <div className="min-h-screen bg-navy-950 text-white">
      <div className="container mx-auto px-4 py-8">
        {selectedCourse ? (
          <div>
            <Button variant="ghost" onClick={handleBackToList} className="mb-6 hover:bg-white/10">
              ← Back to Courses
            </Button>
            <CourseDetail course={selectedCourse} courses={coursesData} />
          </div>
        ) : (
          <div className="space-y-8">
            <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
              <div>
                <h1 className="text-3xl font-bold bg-clip-text text-transparent bg-gradient-to-r from-pink-500 to-purple-500">
                  Courses
                </h1>
                <p className="text-white/70 mt-1">Expand your knowledge with our comprehensive courses</p>
              </div>

              <div className="relative w-full md:w-64">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-white/50 h-4 w-4" />
                <Input
                  placeholder="Search courses..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="pl-10 bg-white/5 border-white/10 text-white placeholder:text-white/50"
                />
              </div>
            </div>

            <Tabs defaultValue="all" value={activeTab} onValueChange={setActiveTab}>
              <TabsList className="bg-white/5 border border-white/10">
                <TabsTrigger value="all" className="data-[state=active]:bg-white/10">
                  <BookOpen className="h-4 w-4 mr-2" />
                  All Courses
                </TabsTrigger>
                <TabsTrigger value="popular" className="data-[state=active]:bg-white/10">
                  <TrendingUp className="h-4 w-4 mr-2" />
                  Popular
                </TabsTrigger>
                <TabsTrigger value="newest" className="data-[state=active]:bg-white/10">
                  <Plus className="h-4 w-4 mr-2" />
                  Newest
                </TabsTrigger>
                <TabsTrigger value="enrolled" className="data-[state=active]:bg-white/10">
                  <Clock className="h-4 w-4 mr-2" />
                  My Courses
                </TabsTrigger>
              </TabsList>

              <TabsContent value="all" className="mt-6">
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                  {filteredCourses.map((course, index) => (
                    <CourseCard
                      key={course.id}
                      course={course}
                      index={index}
                      onClick={() => handleCourseClick(course)}
                    />
                  ))}
                </div>

                {filteredCourses.length === 0 && (
                  <div className="text-center py-12">
                    <h3 className="text-xl font-medium text-white/70">No courses found</h3>
                    <p className="text-white/50 mt-2">Try adjusting your search or filters</p>
                  </div>
                )}
              </TabsContent>

              <TabsContent value="popular" className="mt-6">
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                  {filteredCourses.map((course, index) => (
                    <CourseCard
                      key={course.id}
                      course={course}
                      index={index}
                      onClick={() => handleCourseClick(course)}
                    />
                  ))}
                </div>

                {filteredCourses.length === 0 && (
                  <div className="text-center py-12">
                    <h3 className="text-xl font-medium text-white/70">No popular courses found</h3>
                    <p className="text-white/50 mt-2">Check back later for new popular courses</p>
                  </div>
                )}
              </TabsContent>

              <TabsContent value="newest" className="mt-6">
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                  {filteredCourses.map((course, index) => (
                    <CourseCard
                      key={course.id}
                      course={course}
                      index={index}
                      onClick={() => handleCourseClick(course)}
                    />
                  ))}
                </div>

                {filteredCourses.length === 0 && (
                  <div className="text-center py-12">
                    <h3 className="text-xl font-medium text-white/70">No new courses found</h3>
                    <p className="text-white/50 mt-2">Check back later for new course additions</p>
                  </div>
                )}
              </TabsContent>

              <TabsContent value="enrolled" className="mt-6">
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                  {filteredCourses.map((course, index) => (
                    <CourseCard
                      key={course.id}
                      course={course}
                      index={index}
                      onClick={() => handleCourseClick(course)}
                    />
                  ))}
                </div>

                {filteredCourses.length === 0 && (
                  <div className="text-center py-12">
                    <h3 className="text-xl font-medium text-white/70">You haven't enrolled in any courses yet</h3>
                    <p className="text-white/50 mt-2">Browse our courses and start learning today</p>
                    <Button
                      className="mt-4 bg-gradient-to-r from-pink-500 to-purple-600 hover:from-pink-600 hover:to-purple-700"
                      onClick={() => setActiveTab("all")}
                    >
                      Browse Courses
                    </Button>
                  </div>
                )}
              </TabsContent>
            </Tabs>
          </div>
        )}
      </div>
    </div>
  )
}

// Course Card Component
function CourseCard({ course, index, onClick }: { course: any; index: number; onClick: () => void }) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.4, delay: index * 0.1 }}
      className="h-full"
    >
      <Card
        className="overflow-hidden border border-white/10 bg-white/5 backdrop-blur-sm hover:bg-white/10 transition-all cursor-pointer h-full flex flex-col"
        onClick={onClick}
      >
        <div className="relative">
          <img src={course.image || "/placeholder.svg"} alt={course.title} className="w-full h-48 object-cover" />
          {course.progress > 0 && (
            <div className="absolute bottom-0 left-0 right-0 bg-black/60 px-4 py-2">
              <div className="flex justify-between items-center text-sm">
                <span>Progress: {course.progress}%</span>
                <Badge className="bg-gradient-to-r from-pink-500 to-purple-600">In Progress</Badge>
              </div>
              <div className="w-full bg-white/20 h-1 mt-1 rounded-full overflow-hidden">
                <div
                  className="bg-gradient-to-r from-pink-500 to-purple-600 h-1 rounded-full"
                  style={{ width: `${course.progress}%` }}
                ></div>
              </div>
            </div>
          )}
        </div>

        <CardContent className="p-5 flex-1 flex flex-col">
          <div className="flex-1">
            <div className="flex flex-wrap gap-2 mb-2">
              {course.tags.slice(0, 2).map((tag: string) => (
                <Badge key={tag} variant="outline" className="bg-white/5 text-white/70 border-white/10">
                  {tag}
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
    </motion.div>
  )
}

