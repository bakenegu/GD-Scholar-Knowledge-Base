"use client"

import { useEffect, useMemo, useState } from "react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import { getPrograms, savePrograms, type Program } from "@/lib/data"
import { Checkbox } from "@/components/ui/checkbox"

export function ProgramManagement() {
  const [programs, setPrograms] = useState<Program[]>([])
  const [editing, setEditing] = useState<Program | null>(null)
  const [form, setForm] = useState<Partial<Program>>({ ieltsRequired: false, category: 'Undergraduate' })

  useEffect(() => {
    setPrograms(getPrograms())
  }, [])

  const resetForm = () => {
    setEditing(null)
    setForm({ ieltsRequired: false, category: 'Undergraduate' })
  }

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    if (!form.name || !form.price || !form.description) return

    if (editing) {
      const updated: Program = { ...editing, ...(form as Program) }
      const list = programs.map(p => p.id === editing.id ? updated : p)
      setPrograms(list)
      savePrograms(list)
      resetForm()
    } else {
      const newProgram: Program = {
        id: crypto.randomUUID(),
        name: form.name!,
        price: form.price!,
        image: form.image || '/placeholder-logo.png',
        description: form.description!,
        category: (form.category as string) || 'Undergraduate',
        rating: form.rating ?? 4.5,
        destination: form.destination || 'USA',
        studyLevel: form.studyLevel || (form.category as string) || 'Undergraduate',
        fieldOfStudy: form.fieldOfStudy || 'General',
        ieltsRequired: !!form.ieltsRequired,
      }
      const list = [...programs, newProgram]
      setPrograms(list)
      savePrograms(list)
      resetForm()
    }
  }

  const startEdit = (p: Program) => {
    setEditing(p)
    setForm({ ...p })
  }

  const remove = (id: string) => {
    const list = programs.filter(p => p.id !== id)
    setPrograms(list)
    savePrograms(list)
    if (editing?.id === id) resetForm()
  }

  const total = useMemo(() => programs.length, [programs])

  return (
    <div className="grid gap-6">
      <Card>
        <CardHeader>
          <CardTitle>Add / Edit Program</CardTitle>
        </CardHeader>
        <CardContent>
          <form onSubmit={handleSubmit} className="grid grid-cols-1 md:grid-cols-6 gap-4 items-end">
            <div className="space-y-2 md:col-span-2">
              <Label>Name</Label>
              <Input value={form.name || ''} onChange={(e) => setForm(f => ({ ...f, name: e.target.value }))} required />
            </div>
            <div className="space-y-2">
              <Label>Price</Label>
              <Input value={form.price || ''} onChange={(e) => setForm(f => ({ ...f, price: e.target.value }))} placeholder="$10,000" required />
            </div>
            <div className="space-y-2">
              <Label>Destination</Label>
              <Input value={form.destination || ''} onChange={(e) => setForm(f => ({ ...f, destination: e.target.value }))} placeholder="USA" />
            </div>
            <div className="space-y-2">
              <Label>Study Level</Label>
              <Select value={(form.studyLevel as string) || ''} onValueChange={(v) => setForm(f => ({ ...f, studyLevel: v }))}>
                <SelectTrigger>
                  <SelectValue placeholder="Select level" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="Undergraduate">Undergraduate</SelectItem>
                  <SelectItem value="Postgraduate">Postgraduate</SelectItem>
                  <SelectItem value="PhD">PhD</SelectItem>
                  <SelectItem value="Diploma">Diploma</SelectItem>
                </SelectContent>
              </Select>
            </div>
            <div className="space-y-2">
              <Label>Field of Study</Label>
              <Input value={form.fieldOfStudy || ''} onChange={(e) => setForm(f => ({ ...f, fieldOfStudy: e.target.value }))} placeholder="Engineering" />
            </div>
            <div className="space-y-2">
              <Label>IELTS Required</Label>
              <div className="flex items-center gap-2">
                <Checkbox
                  id="ielts"
                  checked={Boolean(form.ieltsRequired)}
                  // Radix passes CheckedState: true | false | 'indeterminate'
                  onCheckedChange={(v) => setForm(f => ({ ...f, ieltsRequired: v === true }))}
                />
                <label htmlFor="ielts" className="text-sm text-muted-foreground">Yes</label>
              </div>
            </div>
            <div className="space-y-2 md:col-span-3">
              <Label>Description</Label>
              <Input value={form.description || ''} onChange={(e) => setForm(f => ({ ...f, description: e.target.value }))} />
            </div>
            <div className="space-y-2 md:col-span-2">
              <Label>Image URL</Label>
              <Input value={form.image || ''} onChange={(e) => setForm(f => ({ ...f, image: e.target.value }))} placeholder="/placeholder-logo.png" />
            </div>
            <div className="flex gap-2">
              <Button type="submit">{editing ? 'Update' : 'Add'} Program</Button>
              {editing && (
                <Button type="button" variant="outline" onClick={resetForm}>Cancel</Button>
              )}
            </div>
          </form>
        </CardContent>
      </Card>

      <Card>
        <CardHeader className="flex-row items-center justify-between">
          <CardTitle>Programs ({total})</CardTitle>
        </CardHeader>
        <CardContent>
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Name</TableHead>
                <TableHead>Destination</TableHead>
                <TableHead>Level</TableHead>
                <TableHead>Price</TableHead>
                <TableHead className="text-right">Actions</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {programs.map(p => (
                <TableRow key={p.id}>
                  <TableCell>{p.name}</TableCell>
                  <TableCell>{p.destination}</TableCell>
                  <TableCell>{p.studyLevel || p.category}</TableCell>
                  <TableCell>{p.price}</TableCell>
                  <TableCell className="text-right space-x-2">
                    <Button size="sm" variant="outline" onClick={() => startEdit(p)}>Edit</Button>
                    <Button size="sm" variant="destructive" onClick={() => remove(p.id)}>Delete</Button>
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
