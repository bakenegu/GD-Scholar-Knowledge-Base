"use client"

import { useEffect, useState } from "react"
import { AdminGate } from "@/components/admin/admin-gate"
import { AdminPage } from "@/components/admin/admin-page"
import { getSession } from "@/lib/data"

export default function AdminRoute() {
  const [allowed, setAllowed] = useState(false)

  useEffect(() => {
    const session = getSession()
    if (session && session.role === 'admin') {
      setAllowed(true)
    }
  }, [])

  if (allowed) return <AdminPage />

  return <AdminGate onUnlock={() => setAllowed(true)} />
}
