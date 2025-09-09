"use client"

import { useEffect, useMemo, useState } from "react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import { Badge } from "@/components/ui/badge"
import { Textarea } from "@/components/ui/textarea"
import { MarkdownEditor } from "./markdown-editor"
import { getDestinations, saveDestinations, type Destination } from "@/lib/data"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"

export function DestinationManagement() {
  const [destinations, setDestinations] = useState<Destination[]>([])
  const [editing, setEditing] = useState<Destination | null>(null)
  const [form, setForm] = useState<Partial<Destination>>({
    country: "",
    whyThisDestination: "",
    opportunitiesWhileStudying: "",
    opportunitiesAfterGraduation: "",
    documentsRequired: [],
    visaRequirements: [],
    internationalExamRequirements: [],
    studyLevel: 'Undergraduate',
    imageUrl: '',
  })

  // temp inputs for tag-like fields
  const [docInput, setDocInput] = useState("")
  const [visaInput, setVisaInput] = useState("")
  const [examInput, setExamInput] = useState("")

  useEffect(() => {
    setDestinations(getDestinations())
  }, [])

  const resetForm = () => {
    setEditing(null)
    setForm({
      country: "",
      whyThisDestination: "",
      opportunitiesWhileStudying: "",
      opportunitiesAfterGraduation: "",
      documentsRequired: [],
      visaRequirements: [],
      internationalExamRequirements: [],
      studyLevel: 'Undergraduate',
      imageUrl: '',
    })
    setDocInput("")
    setVisaInput("")
    setExamInput("")
  }

  const addTag = (key: keyof Pick<Destination, 'documentsRequired' | 'visaRequirements' | 'internationalExamRequirements'>, value: string) => {
    const v = value.trim()
    if (!v) return
    setForm(f => ({
      ...f,
      [key]: ([...(f[key] as string[] | undefined) || [], v]) as any,
    }))
  }

  const removeTag = (key: keyof Pick<Destination, 'documentsRequired' | 'visaRequirements' | 'internationalExamRequirements'>, idx: number) => {
    setForm(f => {
      const arr = ([...((f[key] as string[] | undefined) || [])])
      arr.splice(idx, 1)
      return { ...f, [key]: arr as any }
    })
  }

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    if (!form.country) return

    if (editing) {
      const updated: Destination = { ...editing, ...(form as Destination) }
      const list = destinations.map(d => d.id === editing.id ? updated : d)
      setDestinations(list)
      saveDestinations(list)
      resetForm()
    } else {
      const newDestination: Destination = {
        id: crypto.randomUUID(),
        country: form.country!,
        whyThisDestination: form.whyThisDestination || "",
        opportunitiesWhileStudying: form.opportunitiesWhileStudying || "",
        opportunitiesAfterGraduation: form.opportunitiesAfterGraduation || "",
        documentsRequired: form.documentsRequired || [],
        visaRequirements: form.visaRequirements || [],
        internationalExamRequirements: form.internationalExamRequirements || [],
        studyLevel: (form.studyLevel as Destination['studyLevel']) || 'Undergraduate',
        imageUrl: form.imageUrl || '/placeholder-logo.png',
      }
      const list = [...destinations, newDestination]
      setDestinations(list)
      saveDestinations(list)
      resetForm()
    }
  }

  const startEdit = (d: Destination) => {
    setEditing(d)
    setForm({ ...d })
  }

  const remove = (id: string) => {
    const list = destinations.filter(d => d.id !== id)
    setDestinations(list)
    saveDestinations(list)
    if (editing?.id === id) resetForm()
  }

  const total = useMemo(() => destinations.length, [destinations])

  return (
    <div className="grid gap-6">
      <Card>
        <CardHeader>
          <CardTitle>Add / Edit Destination</CardTitle>
        </CardHeader>
        <CardContent>
          <form onSubmit={handleSubmit} className="grid grid-cols-1 gap-6">
            {/* Basic Info Section */}
            <div className="grid gap-4 rounded-lg border p-4">
              <div className="flex items-center justify-between">
                <h3 className="font-semibold">Basic Info</h3>
              </div>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label>Country</Label>
                  <Input value={form.country || ''} onChange={(e) => setForm(f => ({ ...f, country: e.target.value }))} placeholder="USA" required />
                </div>
                <div className="space-y-2">
                  <Label>Study Level</Label>
                  <Select value={(form.studyLevel as string) || 'Undergraduate'} onValueChange={(v) => setForm(f => ({ ...f, studyLevel: v as Destination['studyLevel'] }))}>
                    <SelectTrigger className="w-full">
                      <SelectValue placeholder="Select level" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="Undergraduate">Undergraduate</SelectItem>
                      <SelectItem value="Postgraduate">Postgraduate</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
              </div>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="space-y-2 md:col-span-2">
                  <Label>Image URL</Label>
                  <Input value={form.imageUrl || ''} onChange={(e) => setForm(f => ({ ...f, imageUrl: e.target.value }))} placeholder="https://...your-image.jpg" />
                </div>
              </div>
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                <div className="space-y-2">
                  <Label>Why this destination</Label>
                  <MarkdownEditor
                    value={form.whyThisDestination || ''}
                    onChange={(v) => setForm(f => ({ ...f, whyThisDestination: v }))}
                    placeholder="World-class universities, diverse culture..."
                  />
                </div>
                <div className="space-y-2">
                  <Label>Top Schools</Label>
                  <MarkdownEditor
                    value={form.opportunitiesWhileStudying || ''}
                    onChange={(v) => setForm(f => ({ ...f, opportunitiesWhileStudying: v }))}
                    placeholder="- Harvard University\n- MIT\n- Stanford University"
                  />
                </div>
                <div className="space-y-2">
                  <Label>Payment</Label>
                  <MarkdownEditor
                    value={form.opportunitiesAfterGraduation || ''}
                    onChange={(v) => setForm(f => ({ ...f, opportunitiesAfterGraduation: v }))}
                    placeholder="Tuition ranges, payment schedules, scholarship links..."
                  />
                </div>
              </div>
            </div>

            {/* Admission Requirements Section */}
            <div className="grid gap-4 rounded-lg border p-4">
              <h3 className="font-semibold">Admission Requirements</h3>
              {/* Documents Required */}
              <div className="grid gap-2">
                <Label>Documents required</Label>
                <div className="flex gap-2">
                  <Input value={docInput} onChange={(e) => setDocInput(e.target.value)} placeholder="e.g., Passport" />
                  <Button type="button" onClick={() => { addTag('documentsRequired', docInput); setDocInput('') }}>Add</Button>
                </div>
                <div className="flex flex-wrap gap-2">
                  {(form.documentsRequired || []).map((d, i) => (
                    <Badge key={i} variant="secondary" className="flex items-center gap-2">
                      <span>{d}</span>
                      <button type="button" className="ml-1 text-muted-foreground hover:text-foreground" onClick={() => removeTag('documentsRequired', i)}>×</button>
                    </Badge>
                  ))}
                </div>
              </div>

              {/* Visa Requirements */}
              <div className="grid gap-2">
                <Label>Visa requirements</Label>
                <div className="flex gap-2">
                  <Input value={visaInput} onChange={(e) => setVisaInput(e.target.value)} placeholder="e.g., Study Permit" />
                  <Button type="button" onClick={() => { addTag('visaRequirements', visaInput); setVisaInput('') }}>Add</Button>
                </div>
                <div className="flex flex-wrap gap-2">
                  {(form.visaRequirements || []).map((v, i) => (
                    <Badge key={i} variant="secondary" className="flex items-center gap-2">
                      <span>{v}</span>
                      <button type="button" className="ml-1 text-muted-foreground hover:text-foreground" onClick={() => removeTag('visaRequirements', i)}>×</button>
                    </Badge>
                  ))}
                </div>
              </div>

              {/* International Exam Requirements */}
              <div className="grid gap-2">
                <Label>International exam requirements</Label>
                <div className="flex gap-2">
                  <Input value={examInput} onChange={(e) => setExamInput(e.target.value)} placeholder="e.g., IELTS/TOEFL" />
                  <Button type="button" onClick={() => { addTag('internationalExamRequirements', examInput); setExamInput('') }}>Add</Button>
                </div>
                <div className="flex flex-wrap gap-2">
                  {(form.internationalExamRequirements || []).map((x, i) => (
                    <Badge key={i} variant="secondary" className="flex items-center gap-2">
                      <span>{x}</span>
                      <button type="button" className="ml-1 text-muted-foreground hover:text-foreground" onClick={() => removeTag('internationalExamRequirements', i)}>×</button>
                    </Badge>
                  ))}
                </div>
              </div>
            </div>

            <div className="flex gap-2">
              <Button type="submit">{editing ? 'Update' : 'Add'} Destination</Button>
              {editing && (
                <Button type="button" variant="outline" onClick={resetForm}>Cancel</Button>
              )}
            </div>
          </form>
        </CardContent>
      </Card>

      <Card>
        <CardHeader className="flex-row items-center justify-between">
          <CardTitle>Destinations ({total})</CardTitle>
        </CardHeader>
        <CardContent>
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Country</TableHead>
                <TableHead>Level</TableHead>
                <TableHead>Documents</TableHead>
                <TableHead>Visa</TableHead>
                <TableHead>Exams</TableHead>
                <TableHead className="text-right">Actions</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {destinations.map(d => (
                <TableRow key={d.id}>
                  <TableCell className="font-medium">{d.country}</TableCell>
                  <TableCell className="whitespace-nowrap">{d.studyLevel}</TableCell>
                  <TableCell className="max-w-[250px]">
                    <div className="flex flex-wrap gap-1">
                      {d.documentsRequired.slice(0, 4).map((t, i) => <Badge key={i} variant="outline">{t}</Badge>)}
                      {d.documentsRequired.length > 4 && <span className="text-xs text-muted-foreground">+{d.documentsRequired.length - 4} more</span>}
                    </div>
                  </TableCell>
                  <TableCell className="max-w-[250px]">
                    <div className="flex flex-wrap gap-1">
                      {d.visaRequirements.slice(0, 3).map((t, i) => <Badge key={i} variant="outline">{t}</Badge>)}
                      {d.visaRequirements.length > 3 && <span className="text-xs text-muted-foreground">+{d.visaRequirements.length - 3} more</span>}
                    </div>
                  </TableCell>
                  <TableCell className="max-w-[250px]">
                    <div className="flex flex-wrap gap-1">
                      {d.internationalExamRequirements.slice(0, 3).map((t, i) => <Badge key={i} variant="outline">{t}</Badge>)}
                      {d.internationalExamRequirements.length > 3 && <span className="text-xs text-muted-foreground">+{d.internationalExamRequirements.length - 3} more</span>}
                    </div>
                  </TableCell>
                  <TableCell className="text-right space-x-2">
                    <Button size="sm" variant="outline" onClick={() => startEdit(d)}>Edit</Button>
                    <Button size="sm" variant="destructive" onClick={() => remove(d.id)}>Delete</Button>
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
