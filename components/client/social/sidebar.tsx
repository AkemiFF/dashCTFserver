import { AdminAnnouncements } from "./announcements"
import { PopularCourses } from "./popular-courses"

export function Sidebar() {
  return (
    <div className="space-y-6">
      <AdminAnnouncements />
      <PopularCourses />
    </div>
  )
}

