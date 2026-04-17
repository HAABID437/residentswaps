import React, { createContext, useContext, useState, useEffect } from 'react'

const NHS_TRUSTS = [
  'Sandwell and West Birmingham NHS Trust',
  'University Hospitals Birmingham NHS FT',
  'King\'s College Hospital NHS FT',
  'Guy\'s and St Thomas\' NHS FT',
  'Manchester University NHS FT',
  'Leeds Teaching Hospitals NHS Trust',
  'Sheffield Teaching Hospitals NHS FT',
  'Newcastle Upon Tyne Hospitals NHS FT',
  'Nottingham University Hospitals NHS Trust',
  'Bristol University Hospitals NHS FT',
  'Oxford University Hospitals NHS FT',
  'Cambridge University Hospitals NHS FT',
  'Imperial College Healthcare NHS Trust',
  'Barts Health NHS Trust',
  'Liverpool University Hospitals NHS FT',
]

const DEPARTMENTS = [
  'Acute Medicine',
  'Anaesthetics',
  'Cardiology',
  'Emergency Medicine',
  'Endocrinology',
  'Gastroenterology',
  'General Medicine',
  'General Surgery',
  'Haematology',
  'Intensive Care',
  'Neurology',
  'Obstetrics & Gynaecology',
  'Oncology',
  'Orthopaedics',
  'Paediatrics',
  'Psychiatry',
  'Radiology',
  'Renal Medicine',
  'Respiratory Medicine',
  'Urology',
]

const GRADES = ['FY1', 'FY2', 'IMT1', 'IMT2', 'IMT3', 'ST3', 'ST4', 'ST5', 'ST6', 'ST7', 'ST8', 'Clinical Fellow']

const SHIFT_TYPES = [
  { id: 'day', label: 'Day', time: '08:00–17:00', color: 'amber' },
  { id: 'long-day', label: 'Long Day', time: '08:00–20:00', color: 'orange' },
  { id: 'night', label: 'Night', time: '20:00–08:00', color: 'indigo' },
  { id: 'twilight', label: 'Twilight', time: '15:00–23:00', color: 'purple' },
  { id: 'weekend-day', label: 'Weekend Day', time: '08:00–17:00', color: 'emerald' },
  { id: 'weekend-night', label: 'Weekend Night', time: '20:00–08:00', color: 'rose' },
  { id: 'on-call', label: 'On-Call', time: '08:00–08:00', color: 'sky' },
]

const DEMO_USER = {
  id: 'demo-user',
  name: 'Dr Sarah Chen',
  email: 'sarah.chen@nhs.net',
  trust: 'Sandwell and West Birmingham NHS Trust',
  department: 'Cardiology',
  grade: 'IMT3',
  gmc: '7654321',
  joinDate: '2024-08-01',
  password: 'demo',
}

const SEED_SWAPS = [
  {
    id: 'swap-1',
    userId: 'user-a',
    userName: 'Dr James Okafor',
    grade: 'IMT2',
    department: 'Respiratory Medicine',
    trust: 'Sandwell and West Birmingham NHS Trust',
    offerType: 'night',
    offerDate: '2026-04-22',
    wantType: 'day',
    wantDate: '2026-04-25',
    note: 'Happy to swap with anyone in acute specialties. My night is in HDU.',
    urgent: false,
    createdAt: '2026-04-15T09:00:00Z',
  },
  {
    id: 'swap-2',
    userId: 'user-b',
    userName: 'Dr Priya Nair',
    grade: 'FY2',
    department: 'Acute Medicine',
    trust: 'Sandwell and West Birmingham NHS Trust',
    offerType: 'weekend-day',
    offerDate: '2026-04-26',
    wantType: 'weekend-day',
    wantDate: '',
    note: 'Any weekend day in May works for me.',
    urgent: true,
    createdAt: '2026-04-15T10:30:00Z',
  },
  {
    id: 'swap-3',
    userId: 'user-c',
    userName: 'Dr Marcus Webb',
    grade: 'IMT1',
    department: 'Cardiology',
    trust: 'Sandwell and West Birmingham NHS Trust',
    offerType: 'twilight',
    offerDate: '2026-04-24',
    wantType: 'day',
    wantDate: '2026-04-28',
    note: '',
    urgent: false,
    createdAt: '2026-04-14T14:00:00Z',
  },
  {
    id: 'swap-4',
    userId: 'user-d',
    userName: 'Dr Amara Diallo',
    grade: 'ST4',
    department: 'General Surgery',
    trust: 'Sandwell and West Birmingham NHS Trust',
    offerType: 'on-call',
    offerDate: '2026-05-03',
    wantType: 'on-call',
    wantDate: '2026-05-10',
    note: 'Looking to swap May bank holiday on-call. Covering colorectal that day.',
    urgent: true,
    createdAt: '2026-04-13T16:45:00Z',
  },
  {
    id: 'swap-5',
    userId: 'user-e',
    userName: 'Dr Tom Finlay',
    grade: 'FY1',
    department: 'General Medicine',
    trust: 'Sandwell and West Birmingham NHS Trust',
    offerType: 'long-day',
    offerDate: '2026-04-29',
    wantType: 'long-day',
    wantDate: '',
    note: 'Flexible on dates. Covering ward 12.',
    urgent: false,
    createdAt: '2026-04-12T11:00:00Z',
  },
]

function load(key, fallback) {
  try {
    const v = localStorage.getItem(key)
    return v ? JSON.parse(v) : fallback
  } catch {
    return fallback
  }
}

function save(key, value) {
  localStorage.setItem(key, JSON.stringify(value))
}

const AppContext = createContext(null)

export function AppProvider({ children }) {
  const [user, setUser] = useState(() => load('rs_user', null))
  const [users, setUsers] = useState(() => load('rs_users', [DEMO_USER]))
  const [swaps, setSwaps] = useState(() => {
    const stored = load('rs_swaps', null)
    return stored ?? SEED_SWAPS
  })

  useEffect(() => { save('rs_user', user) }, [user])
  useEffect(() => { save('rs_users', users) }, [users])
  useEffect(() => { save('rs_swaps', swaps) }, [swaps])

  function login(email, password) {
    const found = users.find(u => u.email === email && u.password === password)
    if (!found) return { error: 'Invalid email or password' }
    setUser(found)
    return { ok: true }
  }

  function register(data) {
    if (users.find(u => u.email === data.email)) return { error: 'Email already registered' }
    const newUser = { ...data, id: `user-${Date.now()}`, joinDate: new Date().toISOString().slice(0, 10) }
    setUsers(prev => [...prev, newUser])
    setUser(newUser)
    return { ok: true }
  }

  function logout() {
    setUser(null)
  }

  function addSwap(swap) {
    const newSwap = {
      ...swap,
      id: `swap-${Date.now()}`,
      userId: user.id,
      userName: user.name,
      grade: user.grade,
      department: user.department,
      trust: user.trust,
      createdAt: new Date().toISOString(),
    }
    setSwaps(prev => [newSwap, ...prev])
    return newSwap
  }

  function deleteSwap(id) {
    setSwaps(prev => prev.filter(s => s.id !== id))
  }

  const trustSwaps = swaps.filter(s => !user || s.trust === user.trust)

  return (
    <AppContext.Provider value={{
      user, login, register, logout,
      swaps, trustSwaps, addSwap, deleteSwap,
      NHS_TRUSTS, DEPARTMENTS, GRADES, SHIFT_TYPES, DEMO_USER,
    }}>
      {children}
    </AppContext.Provider>
  )
}

export function useApp() {
  return useContext(AppContext)
}
