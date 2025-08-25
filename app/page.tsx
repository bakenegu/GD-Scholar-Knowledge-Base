"use client"

import { useState } from "react"
import { LoginForm } from "@/components/login-form"
import { CatalogPage } from "@/components/catalog-page"

export default function Home() {
  const [isAuthenticated, setIsAuthenticated] = useState(false)
  const [isGuest, setIsGuest] = useState(false)

  const handleLogin = (email: string, password: string) => {
    // Simple authentication logic - in real app, this would validate against a backend
    if (email && password) {
      setIsAuthenticated(true)
      setIsGuest(false)
    }
  }

  const handleGuestLogin = () => {
    setIsAuthenticated(true)
    setIsGuest(true)
  }

  const handleLogout = () => {
    setIsAuthenticated(false)
    setIsGuest(false)
  }

  if (isAuthenticated) {
    return <CatalogPage isGuest={isGuest} onLogout={handleLogout} />
  }

  return <LoginForm onLogin={handleLogin} onGuestLogin={handleGuestLogin} />
}
