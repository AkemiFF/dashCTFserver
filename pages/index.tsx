"use client"

import { CourseCard } from "@/components/course-card-home"
import { Sidebar } from "@/components/sidebar"
import { SiteHeader } from "@/components/site-header"
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { Progress } from "@/components/ui/progress"
import Particles, { initParticlesEngine } from "@tsparticles/react"
import { loadSlim } from "@tsparticles/slim"
import { motion } from "framer-motion"
import { AlertCircle, Calendar, Clock } from "lucide-react"
import { useEffect, useState } from "react"

// Import services
import { authFetch } from "@/lib/api"
import { BASE_URL } from "@/lib/host"
import { challengeService, type Challenge } from "@/services/challenge-service"
import { CourseApiService } from "@/services/course-api-service"
import { eventService, type Event } from "@/services/event-service"
import type { Course } from "@/services/types/course"
import { userService, type UserProfile } from "@/services/user-service"

export default function Home() {
  const [init, setInit] = useState(false)
  const [newCourses, setNewCourses] = useState<Course[]>([])
  const [enrolledCourses, setEnrolledCourses] = useState<Course[]>([])
  const [featuredChallenge, setFeaturedChallenge] = useState<Challenge | null>(null)
  const [upcomingEvents, setUpcomingEvents] = useState<Event[]>([])
  const [userProfile, setUserProfile] = useState<UserProfile | null>(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)
  const [uData, setuData] = useState<any>(null)

  useEffect(() => {
    const fetchUserData = async () => {
      try {
        const response = await authFetch(`${BASE_URL}/api/auth/user/`);
        if (!response.ok) {
          throw new Error("Failed to fetch user data");
        }
        const userData = await response.json();
        setuData(userData);

      } catch (error) {
        console.error("Error fetching user data:", error);
      }
    };
    fetchUserData()
  }, []);

  useEffect(() => {
    initParticlesEngine(async (engine) => {
      await loadSlim(engine)
    }).then(() => {
      setInit(true)
    })
  }, [])

  useEffect(() => {
    const fetchData = async () => {
      try {
        setLoading(true)

        // Fetch all data in parallel for better performance
        const [courses, featuredChall, events, profile] = await Promise.all([
          CourseApiService.getAllCourses(),
          challengeService.getFeaturedChallenge(),
          eventService.getUpcomingEvents(3), // Get top 3 upcoming events
          userService.getCurrentUserProfile(),
        ])


        setNewCourses(courses.slice(0, 3))
        setEnrolledCourses(courses.filter((course) => course.progress > 0))
        setFeaturedChallenge(featuredChall)
        setUpcomingEvents(events)
        setUserProfile(profile)
      } catch (err) {
        console.error("Error fetching data:", err)
        setError("Failed to load data. Please try again.")
      } finally {
        setLoading(false)
      }
    }

    fetchData()
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

      <SiteHeader unreadNotifications={0} />

      <main className="container mx-auto px-4 pt-24 pb-16 relative z-10">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
          {/* Left Sidebar */}
          <div className="hidden lg:block lg:col-span-3 sticky top-24 self-start">
            <Sidebar userProfile={uData} />
          </div>

          {/* Main Content */}
          <div className="lg:col-span-9 space-y-8">
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5 }}
              className="mb-8"
            >
              <h1 className="text-3xl font-bold bg-clip-text text-transparent bg-gradient-to-r from-pink-500 to-purple-600">
                Ethical Hacking Learning Hub
              </h1>
              <p className="text-white/70 mt-2">Master cybersecurity skills with hands-on practice</p>
            </motion.div>

            {loading && (
              <div className="flex justify-center py-12">
                <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-pink-500"></div>
              </div>
            )}

            {error && (
              <Alert variant="destructive">
                <AlertCircle className="h-4 w-4" />
                <AlertTitle>Error</AlertTitle>
                <AlertDescription>{error}</AlertDescription>
              </Alert>
            )}

            {!loading && !error && (
              <div className="space-y-8">
                {/* Featured Challenge */}
                {featuredChallenge && (
                  <section>
                    <h2 className="text-2xl font-semibold mb-4">Featured Challenge</h2>
                    <Card className="bg-gradient-to-r from-pink-500/10 to-purple-500/10 border border-white/10 overflow-hidden">
                      <CardHeader>
                        <div className="flex justify-between items-start">
                          <div>
                            <CardTitle className="text-xl">{featuredChallenge.title}</CardTitle>
                            <CardDescription className="text-white/70 mt-1">
                              {featuredChallenge.description}
                            </CardDescription>
                          </div>
                          <Badge variant="outline" className="bg-white/10">
                            {featuredChallenge.points} pts
                          </Badge>
                        </div>
                      </CardHeader>
                      <CardContent>
                        <div className="flex flex-wrap gap-2 mb-2">
                          <Badge className="bg-pink-500/20 text-pink-300 hover:bg-pink-500/30">
                            {featuredChallenge.category}
                          </Badge>
                          <Badge className="bg-purple-500/20 text-purple-300 hover:bg-purple-500/30">
                            {featuredChallenge.difficulty}
                          </Badge>
                          {featuredChallenge.tags?.map((tag, index) => (
                            <Badge key={index} variant="outline" className="bg-white/5">
                              {tag}
                            </Badge>
                          ))}
                        </div>
                        <div className="flex items-center justify-between text-sm text-white/60 mt-2">
                          <p>
                            <span className="font-medium">{featuredChallenge.completions}</span> hackers have completed
                            this challenge
                          </p>
                          {featuredChallenge.estimatedTime && (
                            <p className="flex items-center gap-1">
                              <Clock className="h-3 w-3" />
                              {featuredChallenge.estimatedTime}
                            </p>
                          )}
                        </div>
                      </CardContent>
                      <CardFooter>
                        <Button className="w-full bg-gradient-to-r from-pink-500 to-purple-600 hover:from-pink-600 hover:to-purple-700">
                          Start Challenge
                        </Button>
                      </CardFooter>
                    </Card>
                  </section>
                )}

                {/* My Progress Section */}
                {enrolledCourses.length > 0 && (
                  <section>
                    <h2 className="text-2xl font-semibold mb-4">Continue Learning</h2>
                    <div className="space-y-4">
                      {enrolledCourses.map((course) => (
                        <Card key={course.id} className="bg-white/5 border border-white/10">
                          <CardHeader>
                            <CardTitle>{course.title}</CardTitle>
                          </CardHeader>
                          <CardContent>
                            <div className="flex items-center justify-between mb-2">
                              <p className="text-white/70">Progress</p>
                              <p className="text-white">{course.progress}%</p>
                            </div>
                            <Progress value={course.progress} className="h-2" />
                          </CardContent>
                          <CardFooter className="flex justify-between">
                            <Button variant="link" className="text-pink-400 p-0">
                              View Course
                            </Button>
                            <Button variant="outline" className="border-pink-500 text-pink-400 hover:bg-pink-500/10">
                              Continue
                            </Button>
                          </CardFooter>
                        </Card>
                      ))}
                    </div>
                  </section>
                )}

                {/* New Courses Section */}
                <section>
                  <h2 className="text-2xl font-semibold mb-4">New Courses</h2>
                  <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                    {newCourses.map((course) => (
                      <CourseCard key={course.id} course={course} />
                    ))}
                  </div>
                  <div className="mt-4 text-center">
                    <Button variant="link" className="text-pink-400">
                      View All Courses
                    </Button>
                  </div>
                </section>

                {/* Upcoming Events */}
                {upcomingEvents.length > 0 && (
                  <section>
                    <h2 className="text-2xl font-semibold mb-4">Upcoming Events</h2>
                    <div className="space-y-4">
                      {upcomingEvents.map((event) => (
                        <Card key={event.id} className="bg-white/5 border border-white/10">
                          <CardContent className="p-4">
                            <div className="flex items-center gap-4">
                              <div className="flex-shrink-0 flex flex-col items-center justify-center bg-white/5 p-3 rounded-lg">
                                <Calendar className="h-5 w-5 text-pink-400" />
                                <p className="text-xs mt-1 text-white/70">
                                  {new Date(event.date).toLocaleDateString("en-US", { month: "short", day: "numeric" })}
                                </p>
                              </div>
                              <div className="flex-grow">
                                <h3 className="font-medium">{event.title}</h3>
                                <div className="flex items-center gap-2 mt-1 text-sm text-white/70">
                                  <Clock className="h-4 w-4" />
                                  <span>
                                    {new Date(event.date).toLocaleTimeString("en-US", {
                                      hour: "2-digit",
                                      minute: "2-digit",
                                      hour12: true,
                                    })}
                                  </span>
                                  {event.duration && <span>• {event.duration}</span>}
                                </div>
                              </div>
                              <div className="flex items-center gap-2">
                                <Avatar className="h-8 w-8">
                                  <AvatarImage src={event.avatar || "/placeholder.svg"} alt={event.instructor} />
                                  <AvatarFallback>{event.instructor.charAt(0)}</AvatarFallback>
                                </Avatar>
                                <span className="text-sm text-white/70">{event.instructor}</span>
                              </div>
                            </div>
                            {event.description && <p className="mt-3 text-sm text-white/70">{event.description}</p>}
                            <div className="mt-4 flex justify-end">
                              <Button
                                size="sm"
                                variant="outline"
                                className="border-pink-500 text-pink-400 hover:bg-pink-500/10"
                              >
                                Register
                              </Button>
                            </div>
                          </CardContent>
                        </Card>
                      ))}
                    </div>
                    <div className="mt-4 text-center">
                      <Button variant="link" className="text-pink-400">
                        View All Events
                      </Button>
                    </div>
                  </section>
                )}
              </div>
            )}
          </div>
        </div>
      </main>
    </div>
  )
}
