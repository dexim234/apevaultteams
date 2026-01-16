import {
  collection,
  doc,
  getDoc,
  getDocs,
  addDoc,
  updateDoc,
  deleteDoc,
  query,
  where,
  orderBy,
} from 'firebase/firestore'
import { db } from '@/firebase/config'
import { Event, EventCategory } from '@/types'

// Events
export const getEvents = async (filters?: {
  category?: EventCategory
  startDate?: string
  endDate?: string
  userId?: string // Filter by required participants
}): Promise<Event[]> => {
  const eventsRef = collection(db, 'events')
  let q: ReturnType<typeof query>

  // Get all events and filter in memory to avoid composite indexes
  q = query(eventsRef, orderBy('createdAt', 'desc'))

  const snapshot = await getDocs(q)
  let results = snapshot.docs.map((doc: any) => {
    const data = doc.data() as any
    return {
      id: doc.id,
      title: data.title || '',
      description: data.description || '',
      category: data.category || 'memecoins',
      dates: data.dates || [],
      time: data.time || '',
      link: data.link,
      requiredParticipants: data.requiredParticipants || [],
      files: data.files || [],
      createdBy: data.createdBy || '',
      createdAt: data.createdAt || new Date().toISOString(),
      updatedAt: data.updatedAt || new Date().toISOString(),
    } as Event
  })

  // Apply filters in memory
  if (filters?.category) {
    results = results.filter((e: Event) => e.category === filters.category)
  }

  if (filters?.startDate && filters?.endDate) {
    results = results.filter((e: Event) => {
      // Check if any date in the event falls within the range
      return e.dates.some(date => date >= filters.startDate! && date <= filters.endDate!)
    })
  }

  if (filters?.userId) {
    results = results.filter((e: Event) => e.requiredParticipants.includes(filters.userId))
  }

  return results
}

export const getEvent = async (id: string): Promise<Event | null> => {
  const eventRef = doc(db, 'events', id)
  const snap = await getDoc(eventRef)
  if (!snap.exists()) return null

  const data = snap.data() as any
  return {
    id: snap.id,
    title: data.title || '',
    description: data.description || '',
    category: data.category || 'memecoins',
    dates: data.dates || [],
    time: data.time || '',
    link: data.link,
    requiredParticipants: data.requiredParticipants || [],
    files: data.files || [],
    createdBy: data.createdBy || '',
    createdAt: data.createdAt || new Date().toISOString(),
    updatedAt: data.updatedAt || new Date().toISOString(),
  } as Event
}

export const addEvent = async (event: Omit<Event, 'id' | 'createdAt' | 'updatedAt'>): Promise<string> => {
  const eventsRef = collection(db, 'events')
  const now = new Date().toISOString()
  const cleanEvent = {
    ...event,
    createdAt: now,
    updatedAt: now,
  }
  const result = await addDoc(eventsRef, cleanEvent)
  return result.id
}

export const updateEvent = async (id: string, updates: Partial<Event>): Promise<void> => {
  const eventRef = doc(db, 'events', id)
  const cleanUpdates = {
    ...updates,
    updatedAt: new Date().toISOString(),
  }
  await updateDoc(eventRef, cleanUpdates)
}

export const deleteEvent = async (id: string): Promise<void> => {
  const eventRef = doc(db, 'events', id)
  await deleteDoc(eventRef)
}
