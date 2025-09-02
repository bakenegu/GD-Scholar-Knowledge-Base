"use client"

import { useEffect, useMemo, useState } from "react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import { getUsers, saveUsers, type User } from "@/lib/data"

export function UserManagement() {
  const [users, setUsers] = useState<User[]>([])
  const [editing, setEditing] = useState<User | null>(null)
  const [form, setForm] = useState<Partial<User>>({ role: 'user' })

  useEffect(() => {
    setUsers(getUsers())
  }, [])

  const resetForm = () => {
    setEditing(null)
    setForm({ role: 'user' })
  }

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    if (!form.name || !form.email || !form.password || !form.role) return

    if (editing) {
      const updated = users.map(u => u.id === editing.id ? { ...(editing as User), ...(form as User) } : u)
      setUsers(updated)
      saveUsers(updated)
      resetForm()
    } else {
      const newUser: User = {
        id: crypto.randomUUID(),
        name: form.name!,
        email: form.email!,
        password: form.password!,
        role: (form.role as User['role']) || 'user',
      }
      const updated = [...users, newUser]
      setUsers(updated)
      saveUsers(updated)
      resetForm()
    }
  }

  const startEdit = (u: User) => {
    setEditing(u)
    setForm({ ...u })
  }

  const remove = (id: string) => {
    const updated = users.filter(u => u.id !== id)
    setUsers(updated)
    saveUsers(updated)
    if (editing?.id === id) resetForm()
  }

  const total = useMemo(() => users.length, [users])

  return (
    <div className="grid gap-6">
      <Card>
        <CardHeader>
          <CardTitle>Add / Edit User</CardTitle>
        </CardHeader>
        <CardContent>
          <form onSubmit={handleSubmit} className="grid grid-cols-1 md:grid-cols-5 gap-4 items-end">
            <div className="space-y-2 md:col-span-2">
              <Label>Name</Label>
              <Input value={form.name || ''} onChange={(e) => setForm(f => ({ ...f, name: e.target.value }))} required />
            </div>
            <div className="space-y-2 md:col-span-2">
              <Label>Email</Label>
              <Input type="email" value={form.email || ''} onChange={(e) => setForm(f => ({ ...f, email: e.target.value }))} required />
            </div>
            <div className="space-y-2 md:col-span-2">
              <Label>Password</Label>
              <Input type="password" value={form.password || ''} onChange={(e) => setForm(f => ({ ...f, password: e.target.value }))} required />
            </div>
            <div className="space-y-2">
              <Label>Role</Label>
              <Select value={(form.role as string) || 'user'} onValueChange={(val) => setForm(f => ({ ...f, role: val as User['role'] }))}>
                <SelectTrigger>
                  <SelectValue placeholder="Role" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="user">User</SelectItem>
                  <SelectItem value="admin">Admin</SelectItem>
                </SelectContent>
              </Select>
            </div>
            <div className="flex gap-2">
              <Button type="submit">{editing ? 'Update' : 'Add'} User</Button>
              {editing && (
                <Button type="button" variant="outline" onClick={resetForm}>Cancel</Button>
              )}
            </div>
          </form>
        </CardContent>
      </Card>

      <Card>
        <CardHeader className="flex-row items-center justify-between">
          <CardTitle>Users ({total})</CardTitle>
        </CardHeader>
        <CardContent>
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Name</TableHead>
                <TableHead>Email</TableHead>
                <TableHead>Role</TableHead>
                <TableHead className="text-right">Actions</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {users.map(u => (
                <TableRow key={u.id}>
                  <TableCell>{u.name}</TableCell>
                  <TableCell>{u.email}</TableCell>
                  <TableCell className="capitalize">{u.role}</TableCell>
                  <TableCell className="text-right space-x-2">
                    <Button size="sm" variant="outline" onClick={() => startEdit(u)}>Edit</Button>
                    <Button size="sm" variant="destructive" onClick={() => remove(u.id)}>Delete</Button>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </CardContent>
      </Card>
    </div>
  )
}
