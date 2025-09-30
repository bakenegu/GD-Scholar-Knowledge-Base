import { NextResponse } from 'next/server'
import { promises as fs } from 'fs'
import path from 'path'
import crypto from 'crypto'
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

export async function GET() {
  const list = await readDb()
  return NextResponse.json(list)
}

export async function POST(req: Request) {
  const body = (await req.json()) as Partial<Destination>
  if (!body.country || !body.studyLevel) {
    return NextResponse.json({ error: 'country and studyLevel are required' }, { status: 400 })
  }
  const list = await readDb()
  const newItem: Destination = {
    id: crypto.randomUUID(),
    country: body.country,
    whyThisDestination: body.whyThisDestination || '',
    opportunitiesWhileStudying: body.opportunitiesWhileStudying || '',
    opportunitiesAfterGraduation: body.opportunitiesAfterGraduation || '',
    documentsRequired: body.documentsRequired || [],
    visaRequirements: body.visaRequirements || [],
    internationalExamRequirements: body.internationalExamRequirements || [],
    studyLevel: body.studyLevel,
    imageUrl: body.imageUrl || '/placeholder-logo.png',
  }
  list.push(newItem)
  await writeDb(list)
  return NextResponse.json(newItem, { status: 201 })
}
