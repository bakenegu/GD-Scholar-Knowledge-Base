"use client"

import { useEffect, useState } from "react"
import { LoginForm } from "@/components/login-form"
import { CatalogPage } from "@/components/catalog-page"
import { ensureSeedUsers, getUsers, setSession, getSession } from "@/lib/data"

export default function Home() {
  const [isAuthenticated, setIsAuthenticated] = useState(false)
  const [isGuest, setIsGuest] = useState(false)

  useEffect(() => {
    // Initialize seed users and restore session if any
    ensureSeedUsers()
    const session = getSession()
    if (session) {
      setIsAuthenticated(true)
      setIsGuest(session.name === "Guest")
    }
  }, [])

  const handleLogin = (email: string, password: string) => {
    const users = getUsers()
    const match = users.find(u => u.email === email && u.password === password)
    if (match) {
      setIsAuthenticated(true)
      setIsGuest(false)
      setSession({ id: match.id, name: match.name, email: match.email, role: match.role })
    }
  }

  const handleGuestLogin = () => {
    setIsAuthenticated(true)
    setIsGuest(true)
    setSession({ id: 'guest', name: 'Guest', email: '', role: 'user' })
  }

  const handleLogout = () => {
    setIsAuthenticated(false)
    setIsGuest(false)
    setSession(null)
  }

  if (isAuthenticated) {
    return <CatalogPage isGuest={isGuest} onLogout={handleLogout} />
  }

  return <LoginForm onLogin={handleLogin} onGuestLogin={handleGuestLogin} />
}
