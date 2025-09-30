import { NextResponse } from 'next/server'
import { promises as fs } from 'fs'
import path from 'path'
import type { Destination } from '@/lib/data'

const DATA_DIR = path.join(process.cwd(), 'data')
const DATA_FILE = path.join(DATA_DIR, 'destinations.json')

// Ensure this route runs on Node.js runtime and is always dynamic (no caching)
export const runtime = 'nodejs'
export const dynamic = 'force-dynamic'
export const revalidate = 0

async function ensureFile(): Promise<void> {
  try {
    await fs.mkdir(DATA_DIR, { recursive: true })
    await fs.access(DATA_FILE)
  } catch {
    await fs.writeFile(DATA_FILE, JSON.stringify([], null, 2), 'utf-8')
  }
}

async function readDb(): Promise<Destination[]> {
  await ensureFile()
  const raw = await fs.readFile(DATA_FILE, 'utf-8')
  return JSON.parse(raw || '[]') as Destination[]
}

async function writeDb(list: Destination[]): Promise<void> {
  await ensureFile()
  await fs.writeFile(DATA_FILE, JSON.stringify(list, null, 2), 'utf-8')
}

export async function PUT(_req: Request, { params }: { params: { id: string } }) {
  const body = (await _req.json()) as Partial<Destination>
  const id = params.id
  const list = await readDb()
  const idx = list.findIndex((d) => d.id === id)
  if (idx === -1) return NextResponse.json({ error: 'Not found' }, { status: 404 })

  const existing = list[idx]
  const updated: Destination = {
    ...existing,
    ...body,
    id: existing.id,
    country: body.country ?? existing.country,
    studyLevel: (body.studyLevel as Destination['studyLevel']) ?? existing.studyLevel,
    documentsRequired: body.documentsRequired ?? existing.documentsRequired,
    visaRequirements: body.visaRequirements ?? existing.visaRequirements,
    internationalExamRequirements: body.internationalExamRequirements ?? existing.internationalExamRequirements,
  }
  list[idx] = updated
  await writeDb(list)
  return NextResponse.json(updated)
}

export async function DELETE(_req: Request, { params }: { params: { id: string } }) {
  const id = params.id
  const list = await readDb()
  const next = list.filter((d) => d.id !== id)
  if (next.length === list.length) return NextResponse.json({ error: 'Not found' }, { status: 404 })
  await writeDb(next)
  return NextResponse.json({ ok: true })
}
