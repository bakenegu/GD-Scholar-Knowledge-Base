"use client"

import { useState } from "react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Button } from "@/components/ui/button"
import { Label } from "@/components/ui/label"

interface AdminGateProps {
  onUnlock: () => void
}

export function AdminGate({ onUnlock }: AdminGateProps) {
  const [password, setPassword] = useState("")
  const [error, setError] = useState("")

  const handleUnlock = (e: React.FormEvent) => {
    e.preventDefault()
    if (password === "password") {
      onUnlock()
    } else {
      setError("Invalid password")
    }
  }

  return (
    <div className="min-h-screen flex items-center justify-center p-4">
      <Card className="w-full max-w-sm">
        <CardHeader>
          <CardTitle>Admin Access</CardTitle>
        </CardHeader>
        <CardContent>
          <form onSubmit={handleUnlock} className="space-y-4">
            <div className="space-y-2">
              <Label htmlFor="pwd">Password</Label>
              <Input id="pwd" type="password" value={password} onChange={(e) => setPassword(e.target.value)} />
              {error && <p className="text-sm text-destructive">{error}</p>}
            </div>
            <Button type="submit" className="w-full">Enter</Button>
          </form>
        </CardContent>
      </Card>
    </div>
  )
}
