"use client"

import type React from "react"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { LoginContainer } from "./login-container"

interface LoginFormProps {
  onLogin: (email: string, password: string) => void
  onGuestLogin: () => void
}

export function LoginForm({ onLogin, onGuestLogin }: LoginFormProps) {
  const [email, setEmail] = useState("")
  const [password, setPassword] = useState("")
  const [isLoading, setIsLoading] = useState(false)
  const [focusedField, setFocusedField] = useState<string | null>(null)

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setIsLoading(true)

    // Simulate API call delay
    await new Promise((resolve) => setTimeout(resolve, 1000))

    onLogin(email, password)
    setIsLoading(false)
  }

  const handleGuestLogin = async () => {
    setIsLoading(true)

    // Simulate API call delay
    await new Promise((resolve) => setTimeout(resolve, 500))

    onGuestLogin()
    setIsLoading(false)
  }

  return (
    <LoginContainer>
      <Card className="w-full bg-transparent border-none shadow-none">
        <CardHeader className="space-y-1 text-center pb-8">
          <CardTitle className="text-3xl font-bold bg-gradient-to-r from-primary to-accent bg-clip-text text-transparent">
            Scholar Knowledge Base
          </CardTitle>
          <CardDescription className="text-muted-foreground text-base">
            Sign in to your account or continue as guest
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-6">
          <form onSubmit={handleSubmit} className="space-y-6">
            <div className="space-y-2 relative">
              <Label htmlFor="email" className="text-sm font-medium text-foreground">
                Email
              </Label>
              <div className="relative">
                <Input
                  id="email"
                  type="email"
                  placeholder="Enter your email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  onFocus={() => setFocusedField("email")}
                  onBlur={() => setFocusedField(null)}
                  required
                  className={`bg-input/80 backdrop-blur-sm border-border focus:ring-2 focus:ring-primary/50 transition-all duration-300 ${
                    focusedField === "email" ? "scale-105 shadow-lg" : ""
                  }`}
                />
                {focusedField === "email" && (
                  <div className="absolute inset-0 bg-gradient-to-r from-primary/20 to-accent/20 rounded-lg -z-10 animate-shimmer" />
                )}
              </div>
            </div>
            <div className="space-y-2 relative">
              <Label htmlFor="password" className="text-sm font-medium text-foreground">
                Password
              </Label>
              <div className="relative">
                <Input
                  id="password"
                  type="password"
                  placeholder="Enter your password"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  onFocus={() => setFocusedField("password")}
                  onBlur={() => setFocusedField(null)}
                  required
                  className={`bg-input/80 backdrop-blur-sm border-border focus:ring-2 focus:ring-primary/50 transition-all duration-300 ${
                    focusedField === "password" ? "scale-105 shadow-lg" : ""
                  }`}
                />
                {focusedField === "password" && (
                  <div className="absolute inset-0 bg-gradient-to-r from-primary/20 to-accent/20 rounded-lg -z-10 animate-shimmer" />
                )}
              </div>
            </div>
            <Button
              type="submit"
              className="w-full bg-gradient-to-r from-primary to-primary/90 text-primary-foreground hover:from-primary/90 hover:to-primary hover:scale-105 transition-all duration-300 shadow-lg hover:shadow-xl py-3 text-base font-semibold"
              disabled={isLoading}
            >
              {isLoading ? (
                <div className="flex items-center gap-2">
                  <div className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                  Signing in...
                </div>
              ) : (
                "Sign In"
              )}
            </Button>
          </form>

          <div className="relative">
            <div className="absolute inset-0 flex items-center">
              <span className="w-full border-t border-border/50" />
            </div>
            <div className="relative flex justify-center text-xs uppercase">
              <span className="bg-card px-4 text-muted-foreground font-medium">Or</span>
            </div>
          </div>

          <Button
            variant="outline"
            className="w-full bg-gradient-to-r from-secondary/10 to-accent/10 text-secondary hover:from-secondary/20 hover:to-accent/20 border-secondary/30 hover:border-secondary/50 hover:scale-105 transition-all duration-300 py-3 text-base font-semibold backdrop-blur-sm"
            onClick={handleGuestLogin}
            disabled={isLoading}
          >
            {isLoading ? (
              <div className="flex items-center gap-2">
                <div className="w-4 h-4 border-2 border-secondary/30 border-t-secondary rounded-full animate-spin" />
                Loading...
              </div>
            ) : (
              "Continue as Guest"
            )}
          </Button>
        </CardContent>
      </Card>
    </LoginContainer>
  )
}
