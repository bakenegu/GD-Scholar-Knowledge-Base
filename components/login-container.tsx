"use client"

import type React from "react"

interface LoginContainerProps {
  children: React.ReactNode
}

export function LoginContainer({ children }: LoginContainerProps) {
  return (
    <div className="min-h-screen flex items-center justify-center gradient-bg p-4 relative overflow-hidden">
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        <div className="absolute top-1/4 left-1/4 w-64 h-64 bg-primary/10 rounded-full blur-3xl animate-float" />
        <div
          className="absolute bottom-1/4 right-1/4 w-96 h-96 bg-accent/10 rounded-full blur-3xl animate-float"
          style={{ animationDelay: "2s" }}
        />
        <div
          className="absolute top-1/2 left-1/2 w-48 h-48 bg-secondary/10 rounded-full blur-3xl animate-float"
          style={{ animationDelay: "4s" }}
        />
      </div>

      <div className="w-full max-w-md glass-morphism shadow-2xl border-white/20 relative z-10 animate-pulse-glow rounded-lg">
        {children}
      </div>
    </div>
  )
}
