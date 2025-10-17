"use client"

import { useEffect, useMemo, useState } from "react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import { Badge } from "@/components/ui/badge"
import { Textarea } from "@/components/ui/textarea"
// removed MarkdownEditor; using structured rows stored as JSON strings
import { type Destination } from "@/lib/data"
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

  // structured rows (stored as JSON string in string fields)
  type Row = { no?: string; title?: string; description?: string }
  const [whyRows, setWhyRows] = useState<Row[]>([])
  const [whileRows, setWhileRows] = useState<Row[]>([])
  const [afterRows, setAfterRows] = useState<Row[]>([])

  // inputs for adding a single row at a time per section
  const [whyNo, setWhyNo] = useState("")
  const [whyTitle, setWhyTitle] = useState("")
  const [whyDesc, setWhyDesc] = useState("")

  const [whileNo, setWhileNo] = useState("")
  const [whileTitle, setWhileTitle] = useState("")
  const [whileDesc, setWhileDesc] = useState("")

  const [afterNo, setAfterNo] = useState("")
  const [afterTitle, setAfterTitle] = useState("")
  const [afterDesc, setAfterDesc] = useState("")

  const parseRows = (s?: string): Row[] => {
    if (!s) return []
    try {
      const v = JSON.parse(s)
      if (Array.isArray(v)) return v as Row[]
      return []
    } catch {
      return []
    }
  }

  const rowsToString = (rows: Row[]) => JSON.stringify(rows)

  useEffect(() => {
    const load = async () => {
      try {
        const res = await fetch('/api/destinations', { cache: 'no-store' })
        const data: Destination[] = await res.json()
        setDestinations(data)
      } catch (e) {
        console.error('Failed to load destinations', e)
      }
    }
    load()
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
    setWhyRows([]); setWhileRows([]); setAfterRows([])
    setWhyNo(""); setWhyTitle(""); setWhyDesc("")
    setWhileNo(""); setWhileTitle(""); setWhileDesc("")
    setAfterNo(""); setAfterTitle(""); setAfterDesc("")
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

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    if (!form.country) return

    if (editing) {
      try {
        const res = await fetch(`/api/destinations/${editing.id}`, {
          method: 'PUT',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({
            ...editing,
            ...(form as Destination),
            whyThisDestination: (whyRows.length > 0) ? rowsToString(whyRows) : (form.whyThisDestination || editing.whyThisDestination || ""),
            opportunitiesWhileStudying: (whileRows.length > 0) ? rowsToString(whileRows) : (form.opportunitiesWhileStudying || editing.opportunitiesWhileStudying || ""),
            opportunitiesAfterGraduation: (afterRows.length > 0) ? rowsToString(afterRows) : (form.opportunitiesAfterGraduation || editing.opportunitiesAfterGraduation || ""),
          }),
        })
        if (!res.ok) throw new Error('Failed to update')
        const updated: Destination = await res.json()
        setDestinations(prev => prev.map(d => d.id === updated.id ? updated : d))
        resetForm()
      } catch (err) {
        console.error(err)
      }
    } else {
      try {
        const payload: Partial<Destination> = {
          country: form.country!,
          whyThisDestination: (whyRows.length > 0) ? rowsToString(whyRows) : (form.whyThisDestination || ""),
          opportunitiesWhileStudying: (whileRows.length > 0) ? rowsToString(whileRows) : (form.opportunitiesWhileStudying || ""),
          opportunitiesAfterGraduation: (afterRows.length > 0) ? rowsToString(afterRows) : (form.opportunitiesAfterGraduation || ""),
          documentsRequired: form.documentsRequired || [],
          visaRequirements: form.visaRequirements || [],
          internationalExamRequirements: form.internationalExamRequirements || [],
          studyLevel: (form.studyLevel as Destination['studyLevel']) || 'Undergraduate',
          imageUrl: form.imageUrl || '/placeholder-logo.png',
        }
        const res = await fetch('/api/destinations', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify(payload),
        })
        if (!res.ok) throw new Error('Failed to create')
        const created: Destination = await res.json()
        setDestinations(prev => [...prev, created])
        resetForm()
      } catch (err) {
        console.error(err)
      }
    }
  }

  const startEdit = (d: Destination) => {
    setEditing(d)
    setForm({ ...d })
    setWhyRows(parseRows(d.whyThisDestination))
    setWhileRows(parseRows(d.opportunitiesWhileStudying))
    setAfterRows(parseRows(d.opportunitiesAfterGraduation))
  }

  const remove = async (id: string) => {
    try {
      const res = await fetch(`/api/destinations/${id}`, { method: 'DELETE' })
      if (!res.ok) throw new Error('Failed to delete')
      setDestinations(prev => prev.filter(d => d.id !== id))
      if (editing?.id === id) resetForm()
    } catch (err) {
      console.error(err)
    }
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
              <div className="grid grid-cols-1 gap-4">
                {/* Single table-like editor for overview items */}
                <div className="space-y-2">
                  <Label>Overview items (Number, Title, Description)</Label>
                  <div className="grid grid-cols-3 gap-2">
                    <Input placeholder="#" value={whyNo} onChange={(e) => setWhyNo(e.target.value)} />
                    <Input placeholder="Title" value={whyTitle} onChange={(e) => setWhyTitle(e.target.value)} />
                    <Input placeholder="Description" value={whyDesc} onChange={(e) => setWhyDesc(e.target.value)} />
                  </div>
                  <div className="flex justify-end">
                    <Button type="button" size="sm" onClick={() => {
                      if (!whyTitle && !whyDesc) return
                      const next = [...whyRows, { no: whyNo, title: whyTitle, description: whyDesc }]
                      setWhyRows(next)
                      setWhyNo(""); setWhyTitle(""); setWhyDesc("")
                    }}>Add Row</Button>
                  </div>
                  <div className="space-y-1">
                    {whyRows.map((r, i) => (
                      <div key={i} className="flex items-center justify-between rounded border p-2 text-sm">
                        <div className="flex-1 truncate">
                          <span className="text-muted-foreground mr-2">{r.no}</span>
                          <span className="font-medium">{r.title}</span>
                        </div>
                        <Button type="button" size="sm" variant="ghost" onClick={() => setWhyRows(prev => prev.filter((_, idx) => idx !== i))}>Remove</Button>
                      </div>
                    ))}
                  </div>
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
