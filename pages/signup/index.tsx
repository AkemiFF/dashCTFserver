"use client"

import { AnimatedGears } from "@/components/client/AnimatedGears"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { ArrowRight, Check, Lock, Mail, Shield, User } from "lucide-react"
import Link from "next/link"
import { useState } from "react"

type SignupStep = "email" | "verification" | "details"

export default function SignupPage() {
  const [step, setStep] = useState<SignupStep>("email")
  const [email, setEmail] = useState("")
  const [verificationCode, setVerificationCode] = useState("")
  const [username, setUsername] = useState("")
  const [password, setPassword] = useState("")
  const [confirmPassword, setConfirmPassword] = useState("")

  const handleEmailSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    console.log("Sending verification code to", email)
    setStep("verification")
  }

  const handleVerificationSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    console.log("Verifying code", verificationCode)
    setStep("details")
  }

  const handleSignupSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    console.log("Signup attempt", { email, username, password, confirmPassword })
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-[#0A0A1B] via-[#0F1C3F] to-[#0A0A1B] flex items-center justify-center px-4 relative overflow-hidden">
      {/* <Header /> */}
      <div className="absolute inset-0 bg-[url('/grid.svg')] bg-center [mask-image:linear-gradient(180deg,white,rgba(255,255,255,0))]" />
      <AnimatedGears />
      <div className="relative z-10 w-full max-w-md">
        <div className="bg-black/40 backdrop-blur-sm border border-white/10 rounded-lg p-8 shadow-xl">
          <div className="flex justify-center mb-8">
            <Shield className="w-12 h-12 text-purple-500" />
          </div>
          <h2 className="text-3xl font-bold text-center mb-8 bg-gradient-to-r from-purple-400 to-blue-500 text-transparent bg-clip-text">
            Join HackiTech
          </h2>

          {/* Step indicators */}
          <div className="flex justify-between mb-8">
            <div className={`flex items-center ${step === "email" ? "text-purple-500" : "text-gray-500"}`}>
              <div className="rounded-full bg-purple-500 p-1">
                <Mail className="w-4 h-4 text-white" />
              </div>
              <span className="ml-2 text-sm">Email</span>
            </div>
            <div className={`flex items-center ${step === "verification" ? "text-purple-500" : "text-gray-500"}`}>
              <div className={`rounded-full ${step === "email" ? "bg-gray-500" : "bg-purple-500"} p-1`}>
                <Check className="w-4 h-4 text-white" />
              </div>
              <span className="ml-2 text-sm">Verify</span>
            </div>
            <div className={`flex items-center ${step === "details" ? "text-purple-500" : "text-gray-500"}`}>
              <div className={`rounded-full ${step === "details" ? "bg-purple-500" : "bg-gray-500"} p-1`}>
                <User className="w-4 h-4 text-white" />
              </div>
              <span className="ml-2 text-sm">Details</span>
            </div>
          </div>

          {step === "email" && (
            <form onSubmit={handleEmailSubmit} className="space-y-6">
              <div className="space-y-2">
                <label htmlFor="email" className="text-sm font-medium text-gray-300">
                  Email
                </label>
                <div className="relative">
                  <Input
                    id="email"
                    type="email"
                    placeholder="Enter your email"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    className="pl-10 bg-black/20 border-white/10 text-white placeholder-gray-500"
                    required
                  />
                  <Mail className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-500 w-5 h-5" />
                </div>
              </div>
              <Button type="submit" className="w-full bg-purple-600 hover:bg-purple-700 text-white">
                Send Verification Code <ArrowRight className="ml-2 w-4 h-4" />
              </Button>
            </form>
          )}

          {step === "verification" && (
            <form onSubmit={handleVerificationSubmit} className="space-y-6">
              <div className="space-y-2">
                <label htmlFor="verificationCode" className="text-sm font-medium text-gray-300">
                  Verification Code
                </label>
                <div className="relative">
                  <Input
                    id="verificationCode"
                    type="text"
                    placeholder="Enter verification code"
                    value={verificationCode}
                    onChange={(e) => setVerificationCode(e.target.value)}
                    className="pl-10 bg-black/20 border-white/10 text-white placeholder-gray-500"
                    required
                  />
                  <Check className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-500 w-5 h-5" />
                </div>
              </div>
              <Button type="submit" className="w-full bg-purple-600 hover:bg-purple-700 text-white">
                Verify Code <ArrowRight className="ml-2 w-4 h-4" />
              </Button>
            </form>
          )}

          {step === "details" && (
            <form onSubmit={handleSignupSubmit} className="space-y-6">
              <div className="space-y-2">
                <label htmlFor="username" className="text-sm font-medium text-gray-300">
                  Username
                </label>
                <div className="relative">
                  <Input
                    id="username"
                    type="text"
                    placeholder="Choose a username"
                    value={username}
                    onChange={(e) => setUsername(e.target.value)}
                    className="pl-10 bg-black/20 border-white/10 text-white placeholder-gray-500"
                    required
                  />
                  <User className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-500 w-5 h-5" />
                </div>
              </div>
              <div className="space-y-2">
                <label htmlFor="password" className="text-sm font-medium text-gray-300">
                  Password
                </label>
                <div className="relative">
                  <Input
                    id="password"
                    type="password"
                    placeholder="Create a password"
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    className="pl-10 bg-black/20 border-white/10 text-white placeholder-gray-500"
                    required
                  />
                  <Lock className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-500 w-5 h-5" />
                </div>
              </div>
              <div className="space-y-2">
                <label htmlFor="confirmPassword" className="text-sm font-medium text-gray-300">
                  Confirm Password
                </label>
                <div className="relative">
                  <Input
                    id="confirmPassword"
                    type="password"
                    placeholder="Confirm your password"
                    value={confirmPassword}
                    onChange={(e) => setConfirmPassword(e.target.value)}
                    className="pl-10 bg-black/20 border-white/10 text-white placeholder-gray-500"
                    required
                  />
                  <Lock className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-500 w-5 h-5" />
                </div>
              </div>
              <Button type="submit" className="w-full bg-purple-600 hover:bg-purple-700 text-white">
                Create Account
              </Button>
            </form>
          )}

          <p className="mt-6 text-center text-sm text-gray-400">
            Already have an account?{" "}
            <Link href="/login" className="text-purple-400 hover:text-purple-300">
              Sign in
            </Link>
          </p>
        </div>
      </div>
    </div>
  )
}

