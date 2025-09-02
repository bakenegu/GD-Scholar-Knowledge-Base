// Simple localStorage-backed data layer for users and programs
// Works on client-side only

export type Program = {
  id: string
  name: string
  price: string
  image: string
  description: string
  category: string
  rating: number
  destination?: string
  studyLevel?: string
  fieldOfStudy?: string
  ieltsRequired?: boolean
}

export type User = {
  id: string
  name: string
  email: string
  password: string
  role: 'admin' | 'user'
}

const PROGRAMS_KEY = 'programs'
const USERS_KEY = 'users'
const SESSION_KEY = 'session_user'

function isBrowser() {
  return typeof window !== 'undefined' && !!window.localStorage
}

// Seed initial programs if none
export function ensureSeedPrograms() {
  if (!isBrowser()) return [] as Program[]
  const raw = localStorage.getItem(PROGRAMS_KEY)
  if (raw) return JSON.parse(raw) as Program[]
  const seed: Program[] = [
    {
      id: '1',
      name: 'Computer Science BSc - USA',
      price: '$25,000',
      image: '/placeholder-logo.png',
      description: "Bachelor's degree in Computer Science with focus on software engineering",
      category: 'Undergraduate',
      rating: 4.8,
      destination: 'USA',
      studyLevel: 'Undergraduate',
      fieldOfStudy: 'Computer Science',
      ieltsRequired: true,
    },
    {
      id: '2',
      name: 'MBA Program - UK',
      price: '$35,000',
      image: '/placeholder-logo.png',
      description: 'Master of Business Administration at a top UK university',
      category: 'Postgraduate',
      rating: 4.7,
      destination: 'UK',
      studyLevel: 'Postgraduate',
      fieldOfStudy: 'Business',
      ieltsRequired: true,
    },
    {
      id: '3',
      name: 'Mechanical Engineering MSc - Germany',
      price: '$1,500',
      image: '/placeholder-logo.png',
      description: "Master's program in Mechanical Engineering with industry placement",
      category: 'Postgraduate',
      rating: 4.6,
      destination: 'Germany',
      studyLevel: 'Postgraduate',
      fieldOfStudy: 'Engineering',
      ieltsRequired: false,
    },
    {
      id: '4',
      name: 'Medicine MD - Australia',
      price: '$45,000',
      image: '/placeholder-logo.png',
      description: 'Doctor of Medicine program with clinical rotations',
      category: 'Postgraduate',
      rating: 4.9,
      destination: 'Australia',
      studyLevel: 'Postgraduate',
      fieldOfStudy: 'Medicine',
      ieltsRequired: true,
    },
    {
      id: '5',
      name: 'Arts & Humanities BA - Canada',
      price: '$22,000',
      image: '/placeholder-logo.png',
      description: "Bachelor's degree in Arts & Humanities with various specialization options",
      category: 'Undergraduate',
      rating: 4.5,
      destination: 'Canada',
      studyLevel: 'Undergraduate',
      fieldOfStudy: 'Arts',
      ieltsRequired: true,
    },
    {
      id: '6',
      name: 'Data Science MSc - Canada',
      price: '$28,000',
      image: '/placeholder-logo.png',
      description: "Master's program in Data Science with industry projects",
      category: 'Postgraduate',
      rating: 4.7,
      destination: 'Canada',
      studyLevel: 'Postgraduate',
      fieldOfStudy: 'Computer Science',
      ieltsRequired: true,
    },
    {
      id: '7',
      name: 'Business Administration BBA - Germany',
      price: '$1,200',
      image: '/placeholder-logo.png',
      description: "Bachelor's in Business Administration with international focus",
      category: 'Undergraduate',
      rating: 4.4,
      destination: 'Germany',
      studyLevel: 'Undergraduate',
      fieldOfStudy: 'Business',
      ieltsRequired: false,
    },
    {
      id: '8',
      name: 'Environmental Science BSc - Canada',
      price: '$24,500',
      image: '/placeholder-logo.png',
      description: 'Bachelor\'s program focusing on environmental conservation and sustainability',
      category: 'Undergraduate',
      rating: 4.6,
      destination: 'Canada',
      studyLevel: 'Undergraduate',
      fieldOfStudy: 'Environmental Science',
      ieltsRequired: true,
    },
  ]
  localStorage.setItem(PROGRAMS_KEY, JSON.stringify(seed))
  return seed
}

export function getPrograms(): Program[] {
  if (!isBrowser()) return []
  return ensureSeedPrograms()
}

export function savePrograms(list: Program[]) {
  if (!isBrowser()) return
  localStorage.setItem(PROGRAMS_KEY, JSON.stringify(list))
}

// Users
export function ensureSeedUsers() {
  if (!isBrowser()) return [] as User[]
  const raw = localStorage.getItem(USERS_KEY)
  if (raw) return JSON.parse(raw) as User[]
  const seed: User[] = [
    { id: 'u1', name: 'Admin', email: 'admin@example.com', password: 'password', role: 'admin' },
    { id: 'u2', name: 'User', email: 'user@example.com', password: 'password', role: 'user' },
  ]
  localStorage.setItem(USERS_KEY, JSON.stringify(seed))
  return seed
}

export function getUsers(): User[] {
  if (!isBrowser()) return []
  return ensureSeedUsers()
}

export function saveUsers(list: User[]) {
  if (!isBrowser()) return
  localStorage.setItem(USERS_KEY, JSON.stringify(list))
}

export function setSession(user: Omit<User, 'password'> | null) {
  if (!isBrowser()) return
  if (user) localStorage.setItem(SESSION_KEY, JSON.stringify(user))
  else localStorage.removeItem(SESSION_KEY)
}

export function getSession(): Omit<User, 'password'> | null {
  if (!isBrowser()) return null
  const raw = localStorage.getItem(SESSION_KEY)
  return raw ? JSON.parse(raw) : null
}
