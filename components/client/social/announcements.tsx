import { Bell } from "lucide-react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"

export function AdminAnnouncements() {
  const announcements = [
    {
      title: "New Course Release",
      content: "Advanced Network Penetration Testing course now available!",
      date: "Today",
    },
    {
      title: "Weekend CTF Event",
      content: "Join us this weekend for a special Capture The Flag event",
      date: "2 days ago",
    },
    {
      title: "Platform Update",
      content: "New features added to the practice labs",
      date: "3 days ago",
    },
  ]

  return (
    <Card className="bg-[#1A1A2E] border-purple-500/20">
      <CardHeader className="flex flex-row items-center space-x-2">
        <Bell className="w-5 h-5 text-purple-500" />
        <CardTitle className="text-white">Admin Announcements</CardTitle>
      </CardHeader>
      <CardContent>
        <div className="space-y-4">
          {announcements.map((announcement, index) => (
            <div key={index} className="border-l-2 border-purple-500 pl-4 py-2">
              <h4 className="font-semibold text-white">{announcement.title}</h4>
              <p className="text-sm text-gray-400 mt-1">{announcement.content}</p>
              <span className="text-xs text-gray-500 mt-2 block">{announcement.date}</span>
            </div>
          ))}
        </div>
      </CardContent>
    </Card>
  )
}

