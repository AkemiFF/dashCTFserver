"use client"

import { SiteHeader } from "@/components/site-header"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from "@/components/ui/dropdown-menu"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { ScrollArea } from "@/components/ui/scroll-area"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Separator } from "@/components/ui/separator"
import { Slider } from "@/components/ui/slider"
import { Switch } from "@/components/ui/switch"
import { Textarea } from "@/components/ui/textarea"
import { Toaster } from "@/components/ui/toaster"
import { useToast } from "@/components/ui/use-toast"
import Particles, { initParticlesEngine } from "@tsparticles/react"
import { loadSlim } from "@tsparticles/slim"
import { motion } from "framer-motion"
import {
    Bell,
    Check,
    ChevronRight,
    Eye,
    Github,
    Gitlab,
    Globe,
    Link2,
    Linkedin,
    Lock,
    LogOut,
    Palette,
    Shield,
    Smartphone,
    Terminal,
    Twitter,
    User,
} from "lucide-react"
import { useEffect, useState } from "react"

export default function SettingsPage() {
    const [init, setInit] = useState(false)
    const [activeTab, setActiveTab] = useState("account")
    const [isMobile, setIsMobile] = useState(false)
    const [isDarkMode, setIsDarkMode] = useState(true)
    const [isLoading, setIsLoading] = useState(false)
    const { toast } = useToast()

    // Check if mobile on mount and when window resizes
    useEffect(() => {
        const checkIfMobile = () => {
            setIsMobile(window.innerWidth < 768)
        }

        checkIfMobile()
        window.addEventListener("resize", checkIfMobile)

        return () => {
            window.removeEventListener("resize", checkIfMobile)
        }
    }, [])

    useEffect(() => {
        initParticlesEngine(async (engine) => {
            await loadSlim(engine)
        }).then(() => {
            setInit(true)
        })
    }, [])

    const particlesOptions = {
        particles: {
            number: {
                value: 20,
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

    // Sample user data (same structure as in profile page)
    const userData = {
        id: "user123",
        name: "Alex Durand",
        username: "0xalexcode",
        email: "alex.durand@example.com",
        avatar: "/placeholder.svg?height=150&width=150",
        coverImage: "/placeholder.svg?height=400&width=1200",
        bio: "Développeur full-stack & ethical hacker | Contributeur open source | Passionné de cybersécurité et d'IA | Toujours à la recherche de nouveaux défis techniques",
        location: "Paris, France",
        joinedDate: "Membre depuis Mars 2022",
        website: "https://alexdurand.dev",
        github: "github.com/0xalexcode",
        gitlab: "gitlab.com/0xalexcode",
        stackoverflow: "stackoverflow.com/users/0xalexcode",
        hackthebox: "hackthebox.com/0xalexcode",
        level: 42,
        contributionPoints: 8756,
        rank: "Expert",
        followers: 1243,
        following: 567,
        posts: 89,
        skills: [
            { name: "JavaScript", level: 95, category: "language" },
            { name: "TypeScript", level: 90, category: "language" },
            { name: "Python", level: 85, category: "language" },
            { name: "Rust", level: 75, category: "language" },
            { name: "Go", level: 70, category: "language" },
            { name: "React", level: 92, category: "framework" },
            { name: "Node.js", level: 88, category: "framework" },
            { name: "Next.js", level: 85, category: "framework" },
            { name: "Docker", level: 80, category: "tool" },
            { name: "Kubernetes", level: 75, category: "tool" },
            { name: "AWS", level: 82, category: "cloud" },
            { name: "Penetration Testing", level: 88, category: "security" },
            { name: "Network Security", level: 85, category: "security" },
            { name: "Cryptography", level: 78, category: "security" },
            { name: "Reverse Engineering", level: 80, category: "security" },
        ],
    }

    const handleSaveSettings = () => {
        setIsLoading(true)

        // Simulate API call
        setTimeout(() => {
            setIsLoading(false)
            toast({
                title: "Settings saved",
                description: "Your settings have been updated successfully.",
                variant: "default",
            })
        }, 1000)
    }

    const handleDeleteAccount = () => {
        toast({
            title: "Are you sure?",
            description: "This action cannot be undone. Your account and all associated data will be permanently deleted.",
            variant: "destructive",
            action: (
                <div className="flex gap-2 mt-2">
                    <Button
                        variant="destructive"
                        size="sm"
                        onClick={() => {
                            toast({
                                title: "Account deletion initiated",
                                description: "We've sent a confirmation email to complete the process.",
                            })
                        }}
                    >
                        Confirm
                    </Button>
                    <Button variant="outline" size="sm">
                        Cancel
                    </Button>
                </div>
            ),
        })
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

            <SiteHeader unreadNotifications={5} />
            <Toaster />

            <main className="container mx-auto px-4 pt-24 pb-16 relative z-10">
                <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.5 }}
                    className="mb-8"
                >
                    <h1 className="text-3xl font-bold bg-clip-text text-transparent bg-gradient-to-r from-pink-500 to-purple-500">
                        Settings
                    </h1>
                    <p className="text-white/70 mt-2">Manage your account settings and preferences</p>
                </motion.div>

                <div className="grid grid-cols-1 md:grid-cols-[250px_1fr] gap-6">
                    {/* Settings Navigation - Desktop */}
                    <motion.div
                        initial={{ opacity: 0, x: -20 }}
                        animate={{ opacity: 1, x: 0 }}
                        transition={{ duration: 0.5, delay: 0.1 }}
                        className="hidden md:block"
                    >
                        <Card className="backdrop-blur-xl bg-white/5 border border-white/10 sticky top-24">
                            <CardContent className="p-0">
                                <nav className="flex flex-col">
                                    {[
                                        { id: "account", label: "Account", icon: <User className="h-4 w-4 mr-2" /> },
                                        { id: "security", label: "Security", icon: <Shield className="h-4 w-4 mr-2" /> },
                                        { id: "notifications", label: "Notifications", icon: <Bell className="h-4 w-4 mr-2" /> },
                                        { id: "privacy", label: "Privacy", icon: <Eye className="h-4 w-4 mr-2" /> },
                                        { id: "appearance", label: "Appearance", icon: <Palette className="h-4 w-4 mr-2" /> },
                                        { id: "skills", label: "Skills & Expertise", icon: <Terminal className="h-4 w-4 mr-2" /> },
                                        { id: "connections", label: "Social Connections", icon: <Link2 className="h-4 w-4 mr-2" /> },
                                        { id: "language", label: "Language & Region", icon: <Globe className="h-4 w-4 mr-2" /> },
                                    ].map((item) => (
                                        <button
                                            key={item.id}
                                            className={`flex items-center px-4 py-3 text-sm transition-colors hover:bg-white/5 ${activeTab === item.id ? "bg-white/10 border-l-2 border-pink-500 text-pink-400" : "text-white/80"
                                                }`}
                                            onClick={() => setActiveTab(item.id)}
                                        >
                                            {item.icon}
                                            {item.label}
                                        </button>
                                    ))}
                                    <Separator className="bg-white/10 my-2" />
                                    <button
                                        className="flex items-center px-4 py-3 text-sm text-red-400 transition-colors hover:bg-white/5"
                                        onClick={handleDeleteAccount}
                                    >
                                        <LogOut className="h-4 w-4 mr-2" />
                                        Delete Account
                                    </button>
                                </nav>
                            </CardContent>
                        </Card>
                    </motion.div>

                    {/* Settings Navigation - Mobile */}
                    <motion.div
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ duration: 0.5, delay: 0.1 }}
                        className="md:hidden"
                    >
                        <ScrollArea className="w-full">
                            <div className="flex space-x-2 pb-4">
                                {[
                                    { id: "account", label: "Account", icon: <User className="h-4 w-4" /> },
                                    { id: "security", label: "Security", icon: <Shield className="h-4 w-4" /> },
                                    { id: "notifications", label: "Notifications", icon: <Bell className="h-4 w-4" /> },
                                    { id: "privacy", label: "Privacy", icon: <Eye className="h-4 w-4" /> },
                                    { id: "appearance", label: "Appearance", icon: <Palette className="h-4 w-4" /> },
                                    { id: "skills", label: "Skills", icon: <Terminal className="h-4 w-4" /> },
                                    { id: "connections", label: "Social", icon: <Link2 className="h-4 w-4" /> },
                                    { id: "language", label: "Language", icon: <Globe className="h-4 w-4" /> },
                                ].map((item) => (
                                    <Button
                                        key={item.id}
                                        variant="ghost"
                                        size="sm"
                                        className={`flex flex-col items-center rounded-full px-4 py-2 ${activeTab === item.id
                                            ? "bg-gradient-to-r from-pink-500 to-purple-600 text-white"
                                            : "bg-white/5 text-white/80 hover:bg-white/10"
                                            }`}
                                        onClick={() => setActiveTab(item.id)}
                                    >
                                        {item.icon}
                                        <span className="text-xs mt-1">{item.label}</span>
                                    </Button>
                                ))}
                            </div>
                        </ScrollArea>
                    </motion.div>

                    {/* Settings Content */}
                    <motion.div
                        key={activeTab}
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ duration: 0.5 }}
                        className="space-y-6"
                    >
                        {/* Account Settings */}
                        {activeTab === "account" && (
                            <>
                                <Card className="backdrop-blur-xl bg-white/5 border border-white/10">
                                    <CardHeader>
                                        <CardTitle className="flex items-center">
                                            <User className="h-5 w-5 mr-2 text-pink-500" />
                                            Profile Information
                                        </CardTitle>
                                        <CardDescription className="text-white/70">
                                            Update your personal information and public profile
                                        </CardDescription>
                                    </CardHeader>
                                    <CardContent className="space-y-6">
                                        <div className="flex flex-col md:flex-row gap-6 items-start">
                                            <div className="relative group">
                                                <Avatar className="h-24 w-24 border-2 border-white/20 group-hover:border-pink-500 transition-all">
                                                    <AvatarImage src={userData.avatar} alt={userData.name} />
                                                    <AvatarFallback className="text-2xl bg-gradient-to-r from-pink-500 to-purple-500">
                                                        {userData.name
                                                            .split(" ")
                                                            .map((n) => n[0])
                                                            .join("")}
                                                    </AvatarFallback>
                                                </Avatar>
                                                <div className="absolute inset-0 bg-black/50 rounded-full opacity-0 group-hover:opacity-100 flex items-center justify-center transition-opacity">
                                                    <Button size="sm" variant="ghost" className="text-xs">
                                                        Change
                                                    </Button>
                                                </div>
                                            </div>
                                            <div className="space-y-4 flex-1">
                                                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                                    <div className="space-y-2">
                                                        <Label htmlFor="name">Full Name</Label>
                                                        <Input id="name" defaultValue={userData.name} className="bg-white/5 border-white/10" />
                                                    </div>
                                                    <div className="space-y-2">
                                                        <Label htmlFor="username">Username</Label>
                                                        <Input
                                                            id="username"
                                                            defaultValue={userData.username}
                                                            className="bg-white/5 border-white/10"
                                                        />
                                                    </div>
                                                </div>
                                                <div className="space-y-2">
                                                    <Label htmlFor="email">Email</Label>
                                                    <Input
                                                        id="email"
                                                        type="email"
                                                        defaultValue={userData.email}
                                                        className="bg-white/5 border-white/10"
                                                    />
                                                </div>
                                                <div className="space-y-2">
                                                    <Label htmlFor="bio">Bio</Label>
                                                    <Textarea
                                                        id="bio"
                                                        defaultValue={userData.bio}
                                                        className="bg-white/5 border-white/10 min-h-[100px]"
                                                    />
                                                </div>
                                            </div>
                                        </div>
                                    </CardContent>
                                </Card>

                                <Card className="backdrop-blur-xl bg-white/5 border border-white/10">
                                    <CardHeader>
                                        <CardTitle className="flex items-center">
                                            <Globe className="h-5 w-5 mr-2 text-pink-500" />
                                            Location & Contact
                                        </CardTitle>
                                    </CardHeader>
                                    <CardContent className="space-y-4">
                                        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                            <div className="space-y-2">
                                                <Label htmlFor="location">Location</Label>
                                                <Input id="location" defaultValue={userData.location} className="bg-white/5 border-white/10" />
                                            </div>
                                            <div className="space-y-2">
                                                <Label htmlFor="website">Website</Label>
                                                <Input id="website" defaultValue={userData.website} className="bg-white/5 border-white/10" />
                                            </div>
                                        </div>
                                    </CardContent>
                                </Card>
                            </>
                        )}

                        {/* Security Settings */}
                        {activeTab === "security" && (
                            <>
                                <Card className="backdrop-blur-xl bg-white/5 border border-white/10">
                                    <CardHeader>
                                        <CardTitle className="flex items-center">
                                            <Lock className="h-5 w-5 mr-2 text-pink-500" />
                                            Password
                                        </CardTitle>
                                        <CardDescription className="text-white/70">
                                            Update your password to keep your account secure
                                        </CardDescription>
                                    </CardHeader>
                                    <CardContent className="space-y-4">
                                        <div className="space-y-2">
                                            <Label htmlFor="current-password">Current Password</Label>
                                            <Input id="current-password" type="password" className="bg-white/5 border-white/10" />
                                        </div>
                                        <div className="space-y-2">
                                            <Label htmlFor="new-password">New Password</Label>
                                            <Input id="new-password" type="password" className="bg-white/5 border-white/10" />
                                        </div>
                                        <div className="space-y-2">
                                            <Label htmlFor="confirm-password">Confirm New Password</Label>
                                            <Input id="confirm-password" type="password" className="bg-white/5 border-white/10" />
                                        </div>
                                    </CardContent>
                                    <CardFooter>
                                        <Button className="bg-gradient-to-r from-pink-500 to-purple-600 hover:from-pink-600 hover:to-purple-700">
                                            Update Password
                                        </Button>
                                    </CardFooter>
                                </Card>

                                <Card className="backdrop-blur-xl bg-white/5 border border-white/10">
                                    <CardHeader>
                                        <CardTitle className="flex items-center">
                                            <Shield className="h-5 w-5 mr-2 text-pink-500" />
                                            Two-Factor Authentication
                                        </CardTitle>
                                        <CardDescription className="text-white/70">
                                            Add an extra layer of security to your account
                                        </CardDescription>
                                    </CardHeader>
                                    <CardContent className="space-y-4">
                                        <div className="flex items-center justify-between">
                                            <div className="space-y-0.5">
                                                <div className="font-medium">Authenticator App</div>
                                                <div className="text-sm text-white/70">
                                                    Use an authenticator app to generate verification codes
                                                </div>
                                            </div>
                                            <Switch checked={true} />
                                        </div>
                                        <Separator className="bg-white/10" />
                                        <div className="flex items-center justify-between">
                                            <div className="space-y-0.5">
                                                <div className="font-medium">SMS Authentication</div>
                                                <div className="text-sm text-white/70">Receive verification codes via SMS</div>
                                            </div>
                                            <Switch checked={false} />
                                        </div>
                                        <Separator className="bg-white/10" />
                                        <div className="flex items-center justify-between">
                                            <div className="space-y-0.5">
                                                <div className="font-medium">Security Keys</div>
                                                <div className="text-sm text-white/70">Use hardware security keys (FIDO2)</div>
                                            </div>
                                            <Switch checked={false} />
                                        </div>
                                    </CardContent>
                                </Card>

                                <Card className="backdrop-blur-xl bg-white/5 border border-white/10">
                                    <CardHeader>
                                        <CardTitle className="flex items-center">
                                            <Smartphone className="h-5 w-5 mr-2 text-pink-500" />
                                            Active Sessions
                                        </CardTitle>
                                        <CardDescription className="text-white/70">Manage your active sessions and devices</CardDescription>
                                    </CardHeader>
                                    <CardContent className="space-y-4">
                                        <div className="space-y-4">
                                            <div className="flex items-center justify-between p-3 bg-white/5 rounded-lg">
                                                <div className="flex items-center space-x-3">
                                                    <div className="bg-green-500/20 p-2 rounded-full">
                                                        <Smartphone className="h-5 w-5 text-green-500" />
                                                    </div>
                                                    <div>
                                                        <div className="font-medium">Current Device</div>
                                                        <div className="text-xs text-white/70">Chrome on macOS • Paris, France</div>
                                                    </div>
                                                </div>
                                                <Badge className="bg-green-500/20 text-green-500 hover:bg-green-500/30">Active</Badge>
                                            </div>

                                            <div className="flex items-center justify-between p-3 bg-white/5 rounded-lg">
                                                <div className="flex items-center space-x-3">
                                                    <div className="bg-white/10 p-2 rounded-full">
                                                        <Smartphone className="h-5 w-5 text-white/70" />
                                                    </div>
                                                    <div>
                                                        <div className="font-medium">iPhone 13</div>
                                                        <div className="text-xs text-white/70">Safari on iOS • Paris, France</div>
                                                    </div>
                                                </div>
                                                <Button
                                                    variant="ghost"
                                                    size="sm"
                                                    className="text-red-400 hover:text-red-300 hover:bg-red-500/10"
                                                >
                                                    Revoke
                                                </Button>
                                            </div>
                                        </div>
                                    </CardContent>
                                    <CardFooter>
                                        <Button variant="outline" className="border-white/10 hover:bg-white/5">
                                            Log Out All Devices
                                        </Button>
                                    </CardFooter>
                                </Card>
                            </>
                        )}

                        {/* Notifications Settings */}
                        {activeTab === "notifications" && (
                            <Card className="backdrop-blur-xl bg-white/5 border border-white/10">
                                <CardHeader>
                                    <CardTitle className="flex items-center">
                                        <Bell className="h-5 w-5 mr-2 text-pink-500" />
                                        Notification Preferences
                                    </CardTitle>
                                    <CardDescription className="text-white/70">
                                        Control how and when you receive notifications
                                    </CardDescription>
                                </CardHeader>
                                <CardContent className="space-y-6">
                                    <div className="space-y-4">
                                        <h3 className="text-lg font-medium">Email Notifications</h3>
                                        <div className="space-y-2">
                                            {[
                                                {
                                                    id: "email-messages",
                                                    label: "New messages",
                                                    description: "Receive emails for new direct messages",
                                                },
                                                {
                                                    id: "email-mentions",
                                                    label: "Mentions",
                                                    description: "Receive emails when you're mentioned in posts or comments",
                                                },
                                                {
                                                    id: "email-followers",
                                                    label: "New followers",
                                                    description: "Receive emails when someone follows you",
                                                },
                                                {
                                                    id: "email-challenges",
                                                    label: "Challenge updates",
                                                    description: "Receive emails about challenges you've joined",
                                                },
                                            ].map((item) => (
                                                <div key={item.id} className="flex items-center justify-between py-2">
                                                    <div className="space-y-0.5">
                                                        <Label htmlFor={item.id} className="text-base cursor-pointer">
                                                            {item.label}
                                                        </Label>
                                                        <p className="text-sm text-white/70">{item.description}</p>
                                                    </div>
                                                    <Switch id={item.id} defaultChecked={item.id !== "email-followers"} />
                                                </div>
                                            ))}
                                        </div>
                                    </div>

                                    <Separator className="bg-white/10" />

                                    <div className="space-y-4">
                                        <h3 className="text-lg font-medium">Push Notifications</h3>
                                        <div className="space-y-2">
                                            {[
                                                {
                                                    id: "push-messages",
                                                    label: "New messages",
                                                    description: "Receive push notifications for new direct messages",
                                                },
                                                {
                                                    id: "push-mentions",
                                                    label: "Mentions",
                                                    description: "Receive push notifications when you're mentioned",
                                                },
                                                {
                                                    id: "push-followers",
                                                    label: "New followers",
                                                    description: "Receive push notifications when someone follows you",
                                                },
                                                {
                                                    id: "push-challenges",
                                                    label: "Challenge updates",
                                                    description: "Receive push notifications about challenges",
                                                },
                                            ].map((item) => (
                                                <div key={item.id} className="flex items-center justify-between py-2">
                                                    <div className="space-y-0.5">
                                                        <Label htmlFor={item.id} className="text-base cursor-pointer">
                                                            {item.label}
                                                        </Label>
                                                        <p className="text-sm text-white/70">{item.description}</p>
                                                    </div>
                                                    <Switch id={item.id} defaultChecked={true} />
                                                </div>
                                            ))}
                                        </div>
                                    </div>

                                    <Separator className="bg-white/10" />

                                    <div className="space-y-4">
                                        <h3 className="text-lg font-medium">Notification Schedule</h3>
                                        <div className="space-y-4">
                                            <div className="space-y-2">
                                                <Label>Quiet Hours</Label>
                                                <div className="flex items-center space-x-4">
                                                    <Select defaultValue="22:00">
                                                        <SelectTrigger className="w-[120px] bg-white/5 border-white/10">
                                                            <SelectValue placeholder="From" />
                                                        </SelectTrigger>
                                                        <SelectContent>
                                                            {Array.from({ length: 24 }).map((_, i) => (
                                                                <SelectItem key={i} value={`${i.toString().padStart(2, "0")}:00`}>
                                                                    {i.toString().padStart(2, "0")}:00
                                                                </SelectItem>
                                                            ))}
                                                        </SelectContent>
                                                    </Select>
                                                    <span>to</span>
                                                    <Select defaultValue="07:00">
                                                        <SelectTrigger className="w-[120px] bg-white/5 border-white/10">
                                                            <SelectValue placeholder="To" />
                                                        </SelectTrigger>
                                                        <SelectContent>
                                                            {Array.from({ length: 24 }).map((_, i) => (
                                                                <SelectItem key={i} value={`${i.toString().padStart(2, "0")}:00`}>
                                                                    {i.toString().padStart(2, "0")}:00
                                                                </SelectItem>
                                                            ))}
                                                        </SelectContent>
                                                    </Select>
                                                </div>
                                            </div>

                                            <div className="flex items-center justify-between">
                                                <div className="space-y-0.5">
                                                    <div className="font-medium">Do Not Disturb</div>
                                                    <div className="text-sm text-white/70">Pause all notifications</div>
                                                </div>
                                                <Switch id="dnd" defaultChecked={false} />
                                            </div>
                                        </div>
                                    </div>
                                </CardContent>
                            </Card>
                        )}

                        {/* Privacy Settings */}
                        {activeTab === "privacy" && (
                            <Card className="backdrop-blur-xl bg-white/5 border border-white/10">
                                <CardHeader>
                                    <CardTitle className="flex items-center">
                                        <Eye className="h-5 w-5 mr-2 text-pink-500" />
                                        Privacy Settings
                                    </CardTitle>
                                    <CardDescription className="text-white/70">
                                        Control who can see your profile and content
                                    </CardDescription>
                                </CardHeader>
                                <CardContent className="space-y-6">
                                    <div className="space-y-4">
                                        <h3 className="text-lg font-medium">Profile Visibility</h3>
                                        <div className="space-y-4">
                                            <div className="space-y-2">
                                                <Label htmlFor="profile-visibility">Who can see your profile</Label>
                                                <Select defaultValue="everyone">
                                                    <SelectTrigger id="profile-visibility" className="w-full bg-white/5 border-white/10">
                                                        <SelectValue placeholder="Select visibility" />
                                                    </SelectTrigger>
                                                    <SelectContent>
                                                        <SelectItem value="everyone">Everyone</SelectItem>
                                                        <SelectItem value="followers">Followers only</SelectItem>
                                                        <SelectItem value="connections">Connections only</SelectItem>
                                                        <SelectItem value="nobody">Only me</SelectItem>
                                                    </SelectContent>
                                                </Select>
                                            </div>

                                            <div className="flex items-center justify-between">
                                                <div className="space-y-0.5">
                                                    <div className="font-medium">Show activity status</div>
                                                    <div className="text-sm text-white/70">Let others see when you're online</div>
                                                </div>
                                                <Switch id="activity-status" defaultChecked={true} />
                                            </div>

                                            <div className="flex items-center justify-between">
                                                <div className="space-y-0.5">
                                                    <div className="font-medium">Show contribution activity</div>
                                                    <div className="text-sm text-white/70">Display your coding activity on your profile</div>
                                                </div>
                                                <Switch id="contribution-activity" defaultChecked={true} />
                                            </div>
                                        </div>
                                    </div>

                                    <Separator className="bg-white/10" />

                                    <div className="space-y-4">
                                        <h3 className="text-lg font-medium">Content Privacy</h3>
                                        <div className="space-y-4">
                                            <div className="space-y-2">
                                                <Label htmlFor="default-post-visibility">Default post visibility</Label>
                                                <Select defaultValue="followers">
                                                    <SelectTrigger id="default-post-visibility" className="w-full bg-white/5 border-white/10">
                                                        <SelectValue placeholder="Select visibility" />
                                                    </SelectTrigger>
                                                    <SelectContent>
                                                        <SelectItem value="everyone">Everyone</SelectItem>
                                                        <SelectItem value="followers">Followers only</SelectItem>
                                                        <SelectItem value="connections">Connections only</SelectItem>
                                                        <SelectItem value="nobody">Only me</SelectItem>
                                                    </SelectContent>
                                                </Select>
                                            </div>

                                            <div className="flex items-center justify-between">
                                                <div className="space-y-0.5">
                                                    <div className="font-medium">Allow mentions</div>
                                                    <div className="text-sm text-white/70">Let others mention you in their posts</div>
                                                </div>
                                                <Select defaultValue="followers">
                                                    <SelectTrigger className="w-[140px] bg-white/5 border-white/10">
                                                        <SelectValue placeholder="Select who" />
                                                    </SelectTrigger>
                                                    <SelectContent>
                                                        <SelectItem value="everyone">Everyone</SelectItem>
                                                        <SelectItem value="followers">Followers only</SelectItem>
                                                        <SelectItem value="nobody">Nobody</SelectItem>
                                                    </SelectContent>
                                                </Select>
                                            </div>
                                        </div>
                                    </div>

                                    <Separator className="bg-white/10" />

                                    <div className="space-y-4">
                                        <h3 className="text-lg font-medium">Data & Privacy</h3>
                                        <div className="space-y-4">
                                            <div className="flex items-center justify-between">
                                                <div className="space-y-0.5">
                                                    <div className="font-medium">Analytics tracking</div>
                                                    <div className="text-sm text-white/70">Allow us to collect anonymous usage data</div>
                                                </div>
                                                <Switch id="analytics" defaultChecked={true} />
                                            </div>

                                            <div className="flex items-center justify-between">
                                                <div className="space-y-0.5">
                                                    <div className="font-medium">Personalized recommendations</div>
                                                    <div className="text-sm text-white/70">Receive content based on your activity</div>
                                                </div>
                                                <Switch id="personalization" defaultChecked={true} />
                                            </div>

                                            <Button variant="outline" className="border-white/10 hover:bg-white/5">
                                                Download Your Data
                                            </Button>
                                        </div>
                                    </div>
                                </CardContent>
                            </Card>
                        )}

                        {/* Appearance Settings */}
                        {activeTab === "appearance" && (
                            <Card className="backdrop-blur-xl bg-white/5 border border-white/10">
                                <CardHeader>
                                    <CardTitle className="flex items-center">
                                        <Palette className="h-5 w-5 mr-2 text-pink-500" />
                                        Appearance
                                    </CardTitle>
                                    <CardDescription className="text-white/70">Customize how Hackitech looks for you</CardDescription>
                                </CardHeader>
                                <CardContent className="space-y-6">
                                    <div className="space-y-4">
                                        <h3 className="text-lg font-medium">Theme</h3>
                                        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                                            <div
                                                className={`relative rounded-lg overflow-hidden border-2 transition-all cursor-pointer ${isDarkMode ? "border-pink-500" : "border-white/10 hover:border-white/30"
                                                    }`}
                                                onClick={() => setIsDarkMode(true)}
                                            >
                                                <div className="absolute inset-0 bg-navy-950 p-4">
                                                    <div className="h-3 w-3/4 rounded-full bg-pink-500 mb-2"></div>
                                                    <div className="h-2 w-full rounded-full bg-white/20 mb-1"></div>
                                                    <div className="h-2 w-4/5 rounded-full bg-white/20 mb-1"></div>
                                                    <div className="h-2 w-2/3 rounded-full bg-white/20"></div>
                                                </div>
                                                <div className="h-24"></div>
                                                <div className="absolute bottom-2 right-2">
                                                    {isDarkMode && <Check className="h-4 w-4 text-pink-500" />}
                                                </div>
                                                <div className="absolute bottom-2 left-2 text-xs font-medium">Dark</div>
                                            </div>

                                            <div
                                                className={`relative rounded-lg overflow-hidden border-2 transition-all cursor-pointer ${!isDarkMode ? "border-pink-500" : "border-white/10 hover:border-white/30"
                                                    }`}
                                                onClick={() => setIsDarkMode(false)}
                                            >
                                                <div className="absolute inset-0 bg-white p-4">
                                                    <div className="h-3 w-3/4 rounded-full bg-pink-500 mb-2"></div>
                                                    <div className="h-2 w-full rounded-full bg-gray-200 mb-1"></div>
                                                    <div className="h-2 w-4/5 rounded-full bg-gray-200 mb-1"></div>
                                                    <div className="h-2 w-2/3 rounded-full bg-gray-200"></div>
                                                </div>
                                                <div className="h-24"></div>
                                                <div className="absolute bottom-2 right-2 text-black">
                                                    {!isDarkMode && <Check className="h-4 w-4 text-pink-500" />}
                                                </div>
                                                <div className="absolute bottom-2 left-2 text-xs font-medium text-black">Light</div>
                                            </div>

                                            <div className="relative rounded-lg overflow-hidden border-2 border-white/10 hover:border-white/30 transition-all cursor-pointer opacity-60">
                                                <div className="absolute inset-0 bg-gradient-to-b from-white to-navy-950 p-4">
                                                    <div className="h-3 w-3/4 rounded-full bg-pink-500 mb-2"></div>
                                                    <div className="h-2 w-full rounded-full bg-gray-200 mb-1"></div>
                                                    <div className="h-2 w-4/5 rounded-full bg-gray-200 mb-1"></div>
                                                    <div className="h-2 w-2/3 rounded-full bg-gray-200"></div>
                                                </div>
                                                <div className="h-24"></div>
                                                <div className="absolute bottom-2 left-2 text-xs font-medium">Auto (Soon)</div>
                                            </div>
                                        </div>
                                    </div>

                                    <Separator className="bg-white/10" />

                                    <div className="space-y-4">
                                        <h3 className="text-lg font-medium">Accent Color</h3>
                                        <div className="grid grid-cols-5 gap-4">
                                            {[
                                                { color: "from-pink-500 to-purple-600", name: "Pink (Default)" },
                                                { color: "from-blue-500 to-indigo-600", name: "Blue" },
                                                { color: "from-green-500 to-emerald-600", name: "Green" },
                                                { color: "from-amber-500 to-orange-600", name: "Amber" },
                                                { color: "from-red-500 to-rose-600", name: "Red" },
                                            ].map((item, index) => (
                                                <div
                                                    key={index}
                                                    className={`rounded-full h-12 bg-gradient-to-r ${item.color} cursor-pointer ${index === 0 ? "ring-2 ring-white ring-offset-2 ring-offset-navy-950" : ""
                                                        }`}
                                                    title={item.name}
                                                ></div>
                                            ))}
                                        </div>
                                    </div>

                                    <Separator className="bg-white/10" />

                                    <div className="space-y-4">
                                        <div className="flex items-center justify-between">
                                            <div>
                                                <h3 className="text-lg font-medium">Animations</h3>
                                                <p className="text-sm text-white/70">Control UI animations and effects</p>
                                            </div>
                                            <Switch id="animations" defaultChecked={true} />
                                        </div>

                                        <div className="space-y-2">
                                            <Label htmlFor="animation-speed">Animation Speed</Label>
                                            <div className="flex items-center space-x-2">
                                                <Slider id="animation-speed" defaultValue={[1]} max={2} step={0.1} className="w-full" />
                                                <span className="w-12 text-center">1.0x</span>
                                            </div>
                                        </div>
                                    </div>

                                    <Separator className="bg-white/10" />

                                    <div className="space-y-4">
                                        <div className="flex items-center justify-between">
                                            <div>
                                                <h3 className="text-lg font-medium">Reduce Motion</h3>
                                                <p className="text-sm text-white/70">Minimize animations for accessibility</p>
                                            </div>
                                            <Switch id="reduce-motion" defaultChecked={false} />
                                        </div>
                                    </div>
                                </CardContent>
                            </Card>
                        )}

                        {/* Skills Settings */}
                        {activeTab === "skills" && (
                            <Card className="backdrop-blur-xl bg-white/5 border border-white/10">
                                <CardHeader>
                                    <CardTitle className="flex items-center">
                                        <Terminal className="h-5 w-5 mr-2 text-pink-500" />
                                        Skills & Expertise
                                    </CardTitle>
                                    <CardDescription className="text-white/70">Manage your skills and expertise levels</CardDescription>
                                </CardHeader>
                                <CardContent className="space-y-6">
                                    <div className="space-y-4">
                                        <div className="flex items-center justify-between">
                                            <h3 className="text-lg font-medium">Your Skills</h3>
                                            <Button
                                                size="sm"
                                                className="bg-gradient-to-r from-pink-500 to-purple-600 hover:from-pink-600 hover:to-purple-700"
                                            >
                                                Add Skill
                                            </Button>
                                        </div>

                                        <div className="space-y-6">
                                            {["language", "framework", "tool", "security"].map((category) => (
                                                <div key={category} className="space-y-4">
                                                    <h4 className="text-md font-medium capitalize">{category}s</h4>
                                                    <div className="space-y-4">
                                                        {userData.skills
                                                            .filter((skill) => skill.category === category)
                                                            .map((skill) => (
                                                                <div key={skill.name} className="bg-white/5 rounded-lg p-4">
                                                                    <div className="flex items-center justify-between mb-2">
                                                                        <div className="font-medium">{skill.name}</div>
                                                                        <DropdownMenu>
                                                                            <DropdownMenuTrigger asChild>
                                                                                <Button variant="ghost" size="sm" className="h-8 w-8 p-0">
                                                                                    <span className="sr-only">Open menu</span>
                                                                                    <ChevronRight className="h-4 w-4" />
                                                                                </Button>
                                                                            </DropdownMenuTrigger>
                                                                            <DropdownMenuContent
                                                                                align="end"
                                                                                className="bg-navy-950/90 backdrop-blur-xl border-white/10"
                                                                            >
                                                                                <DropdownMenuItem className="hover:bg-white/5 cursor-pointer">
                                                                                    Edit
                                                                                </DropdownMenuItem>
                                                                                <DropdownMenuItem className="hover:bg-white/5 cursor-pointer text-red-400">
                                                                                    Remove
                                                                                </DropdownMenuItem>
                                                                            </DropdownMenuContent>
                                                                        </DropdownMenu>
                                                                    </div>
                                                                    <div className="flex items-center gap-4">
                                                                        <div className="w-full">
                                                                            <div className="flex justify-between mb-1">
                                                                                <span className="text-xs text-white/70">Beginner</span>
                                                                                <span className="text-xs text-white/70">Expert</span>
                                                                            </div>
                                                                            <div className="w-full bg-white/10 rounded-full h-2">
                                                                                <div
                                                                                    className="bg-gradient-to-r from-pink-500 to-purple-600 h-2 rounded-full"
                                                                                    style={{ width: `${skill.level}%` }}
                                                                                ></div>
                                                                            </div>
                                                                        </div>
                                                                        <div className="text-sm font-medium">{skill.level}%</div>
                                                                    </div>
                                                                </div>
                                                            ))}
                                                    </div>
                                                </div>
                                            ))}
                                        </div>
                                    </div>

                                    <Separator className="bg-white/10" />

                                    <div className="space-y-4">
                                        <h3 className="text-lg font-medium">Skill Visibility</h3>
                                        <div className="space-y-4">
                                            <div className="flex items-center justify-between">
                                                <div className="space-y-0.5">
                                                    <div className="font-medium">Show skill levels</div>
                                                    <div className="text-sm text-white/70">
                                                        Display your proficiency percentage for each skill
                                                    </div>
                                                </div>
                                                <Switch id="show-skill-levels" defaultChecked={true} />
                                            </div>

                                            <div className="flex items-center justify-between">
                                                <div className="space-y-0.5">
                                                    <div className="font-medium">Show skill categories</div>
                                                    <div className="text-sm text-white/70">Group your skills by category</div>
                                                </div>
                                                <Switch id="show-skill-categories" defaultChecked={true} />
                                            </div>
                                        </div>
                                    </div>
                                </CardContent>
                            </Card>
                        )}

                        {/* Social Connections Settings */}
                        {activeTab === "connections" && (
                            <Card className="backdrop-blur-xl bg-white/5 border border-white/10">
                                <CardHeader>
                                    <CardTitle className="flex items-center">
                                        <Link2 className="h-5 w-5 mr-2 text-pink-500" />
                                        Social Connections
                                    </CardTitle>
                                    <CardDescription className="text-white/70">
                                        Connect your social and developer accounts
                                    </CardDescription>
                                </CardHeader>
                                <CardContent className="space-y-6">
                                    <div className="space-y-4">
                                        <h3 className="text-lg font-medium">Connected Accounts</h3>
                                        <div className="space-y-4">
                                            <div className="flex items-center justify-between p-3 bg-white/5 rounded-lg">
                                                <div className="flex items-center space-x-3">
                                                    <div className="bg-white/10 p-2 rounded-full">
                                                        <Github className="h-5 w-5" />
                                                    </div>
                                                    <div>
                                                        <div className="font-medium">GitHub</div>
                                                        <div className="text-xs text-white/70">{userData.github}</div>
                                                    </div>
                                                </div>
                                                <Badge className="bg-green-500/20 text-green-500 hover:bg-green-500/30">Connected</Badge>
                                            </div>

                                            <div className="flex items-center justify-between p-3 bg-white/5 rounded-lg">
                                                <div className="flex items-center space-x-3">
                                                    <div className="bg-white/10 p-2 rounded-full">
                                                        <Gitlab className="h-5 w-5" />
                                                    </div>
                                                    <div>
                                                        <div className="font-medium">GitLab</div>
                                                        <div className="text-xs text-white/70">{userData.gitlab}</div>
                                                    </div>
                                                </div>
                                                <Badge className="bg-green-500/20 text-green-500 hover:bg-green-500/30">Connected</Badge>
                                            </div>

                                            <div className="flex items-center justify-between p-3 bg-white/5 rounded-lg">
                                                <div className="flex items-center space-x-3">
                                                    <div className="bg-white/10 p-2 rounded-full">
                                                        <Twitter className="h-5 w-5" />
                                                    </div>
                                                    <div>
                                                        <div className="font-medium">Twitter</div>
                                                        <div className="text-xs text-white/70">Not connected</div>
                                                    </div>
                                                </div>
                                                <Button size="sm" variant="outline" className="border-white/10 hover:bg-white/5">
                                                    Connect
                                                </Button>
                                            </div>

                                            <div className="flex items-center justify-between p-3 bg-white/5 rounded-lg">
                                                <div className="flex items-center space-x-3">
                                                    <div className="bg-white/10 p-2 rounded-full">
                                                        <Linkedin className="h-5 w-5" />
                                                    </div>
                                                    <div>
                                                        <div className="font-medium">LinkedIn</div>
                                                        <div className="text-xs text-white/70">Not connected</div>
                                                    </div>
                                                </div>
                                                <Button size="sm" variant="outline" className="border-white/10 hover:bg-white/5">
                                                    Connect
                                                </Button>
                                            </div>
                                        </div>
                                    </div>

                                    <Separator className="bg-white/10" />

                                    <div className="space-y-4">
                                        <h3 className="text-lg font-medium">Social Sharing</h3>
                                        <div className="space-y-4">
                                            <div className="flex items-center justify-between">
                                                <div className="space-y-0.5">
                                                    <div className="font-medium">Auto-share achievements</div>
                                                    <div className="text-sm text-white/70">Automatically share new badges and achievements</div>
                                                </div>
                                                <Switch id="auto-share" defaultChecked={false} />
                                            </div>

                                            <div className="flex items-center justify-between">
                                                <div className="space-y-0.5">
                                                    <div className="font-medium">Share activity</div>
                                                    <div className="text-sm text-white/70">
                                                        Share your coding activity with connected platforms
                                                    </div>
                                                </div>
                                                <Switch id="share-activity" defaultChecked={false} />
                                            </div>
                                        </div>
                                    </div>
                                </CardContent>
                            </Card>
                        )}

                        {/* Language & Region Settings */}
                        {activeTab === "language" && (
                            <Card className="backdrop-blur-xl bg-white/5 border border-white/10">
                                <CardHeader>
                                    <CardTitle className="flex items-center">
                                        <Globe className="h-5 w-5 mr-2 text-pink-500" />
                                        Language & Region
                                    </CardTitle>
                                    <CardDescription className="text-white/70">
                                        Set your preferred language and regional settings
                                    </CardDescription>
                                </CardHeader>
                                <CardContent className="space-y-6">
                                    <div className="space-y-4">
                                        <div className="space-y-2">
                                            <Label htmlFor="language">Language</Label>
                                            <Select defaultValue="fr">
                                                <SelectTrigger id="language" className="w-full bg-white/5 border-white/10">
                                                    <SelectValue placeholder="Select language" />
                                                </SelectTrigger>
                                                <SelectContent>
                                                    <SelectItem value="en">English</SelectItem>
                                                    <SelectItem value="fr">Français</SelectItem>
                                                    <SelectItem value="es">Español</SelectItem>
                                                    <SelectItem value="de">Deutsch</SelectItem>
                                                    <SelectItem value="ja">日本語</SelectItem>
                                                </SelectContent>
                                            </Select>
                                        </div>

                                        <div className="space-y-2">
                                            <Label htmlFor="region">Region</Label>
                                            <Select defaultValue="fr">
                                                <SelectTrigger id="region" className="w-full bg-white/5 border-white/10">
                                                    <SelectValue placeholder="Select region" />
                                                </SelectTrigger>
                                                <SelectContent>
                                                    <SelectItem value="us">United States</SelectItem>
                                                    <SelectItem value="fr">France</SelectItem>
                                                    <SelectItem value="uk">United Kingdom</SelectItem>
                                                    <SelectItem value="ca">Canada</SelectItem>
                                                    <SelectItem value="jp">Japan</SelectItem>
                                                </SelectContent>
                                            </Select>
                                        </div>

                                        <div className="space-y-2">
                                            <Label htmlFor="timezone">Timezone</Label>
                                            <Select defaultValue="europe-paris">
                                                <SelectTrigger id="timezone" className="w-full bg-white/5 border-white/10">
                                                    <SelectValue placeholder="Select timezone" />
                                                </SelectTrigger>
                                                <SelectContent>
                                                    <SelectItem value="america-newyork">America/New_York (UTC-5)</SelectItem>
                                                    <SelectItem value="america-losangeles">America/Los_Angeles (UTC-8)</SelectItem>
                                                    <SelectItem value="europe-london">Europe/London (UTC+0)</SelectItem>
                                                    <SelectItem value="europe-paris">Europe/Paris (UTC+1)</SelectItem>
                                                    <SelectItem value="asia-tokyo">Asia/Tokyo (UTC+9)</SelectItem>
                                                </SelectContent>
                                            </Select>
                                        </div>
                                    </div>

                                    <Separator className="bg-white/10" />

                                    <div className="space-y-4">
                                        <h3 className="text-lg font-medium">Format Preferences</h3>
                                        <div className="space-y-4">
                                            <div className="space-y-2">
                                                <Label htmlFor="date-format">Date Format</Label>
                                                <Select defaultValue="dd-mm-yyyy">
                                                    <SelectTrigger id="date-format" className="w-full bg-white/5 border-white/10">
                                                        <SelectValue placeholder="Select date format" />
                                                    </SelectTrigger>
                                                    <SelectContent>
                                                        <SelectItem value="mm-dd-yyyy">MM/DD/YYYY</SelectItem>
                                                        <SelectItem value="dd-mm-yyyy">DD/MM/YYYY</SelectItem>
                                                        <SelectItem value="yyyy-mm-dd">YYYY/MM/DD</SelectItem>
                                                    </SelectContent>
                                                </Select>
                                            </div>

                                            <div className="space-y-2">
                                                <Label htmlFor="time-format">Time Format</Label>
                                                <Select defaultValue="24h">
                                                    <SelectTrigger id="time-format" className="w-full bg-white/5 border-white/10">
                                                        <SelectValue placeholder="Select time format" />
                                                    </SelectTrigger>
                                                    <SelectContent>
                                                        <SelectItem value="12h">12-hour (AM/PM)</SelectItem>
                                                        <SelectItem value="24h">24-hour</SelectItem>
                                                    </SelectContent>
                                                </Select>
                                            </div>
                                        </div>
                                    </div>
                                </CardContent>
                            </Card>
                        )}

                        {/* Save Button */}
                        <div className="flex justify-end">
                            <Button
                                className="bg-gradient-to-r from-pink-500 to-purple-600 hover:from-pink-600 hover:to-purple-700"
                                onClick={handleSaveSettings}
                                disabled={isLoading}
                            >
                                {isLoading ? "Saving..." : "Save Settings"}
                            </Button>
                        </div>
                    </motion.div>
                </div>
            </main>
        </div>
    )
}

