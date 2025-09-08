"use client"

import { useEffect, useState } from "react"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { getSession, setSession } from "@/lib/data"
import { UserManagement } from "@/components/admin/user-management"
import { DestinationManagement } from "@/components/admin/destination-management"

export function AdminPage() {
  const [active, setActive] = useState("destinations")

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
          <Button variant="outline" onClick={() => setActive(active === 'destinations' ? 'users' : 'destinations')}>
            Switch to {active === 'destinations' ? 'Users' : 'Destinations'}
          </Button>
        </CardHeader>
        <CardContent>
          <Tabs value={active} onValueChange={setActive}>
            <TabsList>
              <TabsTrigger value="destinations">Destinations</TabsTrigger>
              <TabsTrigger value="users">Users</TabsTrigger>
            </TabsList>
            <TabsContent value="destinations">
              <DestinationManagement />
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
