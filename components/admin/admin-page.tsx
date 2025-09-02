"use client"

import { useEffect, useState } from "react"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { getSession, setSession } from "@/lib/data"
import { UserManagement } from "@/components/admin/user-management"
import { ProgramManagement } from "@/components/admin/program-management"

export function AdminPage() {
  const [active, setActive] = useState("programs")

  useEffect(() => {
    // Ensure only admins stay here
    const s = getSession()
    if (!s || s.role !== 'admin') {
      // downgrade to admin gate on refresh by clearing session role
      setSession(null)
    }
  }, [])

  return (
    <div className="min-h-screen p-6">
      <Card className="max-w-6xl mx-auto">
        <CardHeader className="flex flex-col gap-2 sm:flex-row sm:items-center sm:justify-between">
          <CardTitle>Admin Dashboard</CardTitle>
          <Button variant="outline" onClick={() => setActive(active === 'programs' ? 'users' : 'programs')}>
            Switch to {active === 'programs' ? 'Users' : 'Programs'}
          </Button>
        </CardHeader>
        <CardContent>
          <Tabs value={active} onValueChange={setActive}>
            <TabsList>
              <TabsTrigger value="programs">Programs</TabsTrigger>
              <TabsTrigger value="users">Users</TabsTrigger>
            </TabsList>
            <TabsContent value="programs">
              <ProgramManagement />
            </TabsContent>
            <TabsContent value="users">
              <UserManagement />
            </TabsContent>
          </Tabs>
        </CardContent>
      </Card>
    </div>
  )
}
