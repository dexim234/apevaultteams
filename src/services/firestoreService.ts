// Firestore service for data operations
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
import { ref, uploadBytes, getDownloadURL, deleteObject } from 'firebase/storage'
import { db, storage } from '@/firebase/config'
import { WorkSlot, DayStatus, Earnings, RatingData, Referral, Call, Task, TaskNotification, TaskStatus, Notification, NotificationCategory, TaskChatMessage } from '@/types'

const DATA_RETENTION_DAYS = 30

const pad = (value: number) => value.toString().padStart(2, '0')
const getRetentionThresholds = () => {
  const thresholdDate = new Date()
  thresholdDate.setDate(thresholdDate.getDate() - DATA_RETENTION_DAYS)
  const dateOnly = `${thresholdDate.getFullYear()}-${pad(thresholdDate.getMonth() + 1)}-${pad(thresholdDate.getDate())}`
  return {
    dateOnly,
    iso: thresholdDate.toISOString(),
  }
}

const cleanupCollectionByField = async (collectionName: string, fieldName: string, threshold: string) => {
  const collectionRef = collection(db, collectionName)
  const q = query(collectionRef, where(fieldName, '<', threshold))
  const snapshot = await getDocs(q)
  await Promise.all(snapshot.docs.map((docSnap) => deleteDoc(doc(db, collectionName, docSnap.id))))
}

export const cleanupOldData = async () => {
  try {
    const { dateOnly, iso } = getRetentionThresholds()
    await Promise.all([
      cleanupCollectionByField('workSlots', 'date', dateOnly),
      cleanupCollectionByField('dayStatuses', 'date', dateOnly),
      cleanupCollectionByField('earnings', 'date', dateOnly),
      cleanupCollectionByField('referrals', 'createdAt', iso),
      cleanupExpiredChats(), // Clean up expired task chats (48 hours)
    ])
  } catch (error) {
    console.error('Failed to cleanup old data', error)
  }
}

// Work Slots
export const getWorkSlots = async (userId?: string, date?: string) => {
  const slotsRef = collection(db, 'workSlots')
  let q: ReturnType<typeof query>

  // Build query based on filters - avoid composite index requirement
  // Use only single-field filters to avoid needing composite indexes
  if (userId && date) {
    // Filter by userId first, then filter in memory
    q = query(slotsRef, where('userId', '==', userId))
  } else if (userId) {
    // Filter by userId only, sort in memory to avoid index requirement
    q = query(slotsRef, where('userId', '==', userId))
  } else if (date) {
    // Filter by date only
    q = query(slotsRef, where('date', '==', date))
  } else {
    // No filters, get all
    q = query(slotsRef)
  }

  const snapshot = await getDocs(q)
  let results = snapshot.docs.map((doc) => {
    const data = doc.data() as any
    // Convert old format (break) to new format (breaks array) for backward compatibility
    const slots = (data?.slots || []).map((slot: any) => {
      if (slot.break && !slot.breaks) {
        // Old format with single break - convert to array
        return {
          ...slot,
          breaks: [slot.break],
          break: undefined
        }
      }
      return slot
    })
    
    return {
      id: doc.id,
      userId: data?.userId || '',
      date: data?.date || '',
      slots,
      participants: data?.participants || [],
      ...(data?.comment && { comment: data.comment }),
    } as WorkSlot
  })
  
  // Filter by date in memory if both userId and date provided
  if (userId && date) {
    results = results.filter((s) => s.date === date)
  }
  
  // Sort by date in memory to avoid index requirement
  results.sort((a, b) => a.date.localeCompare(b.date))
  
  return results
}

export const addWorkSlot = async (slot: Omit<WorkSlot, 'id'>) => {
  try {
    console.log('addWorkSlot: Starting, db initialized:', !!db)
    const slotsRef = collection(db, 'workSlots')
    console.log('addWorkSlot: Collection reference created')
    // Remove undefined values before saving
    const cleanSlot = Object.fromEntries(
      Object.entries(slot).filter(([_, value]) => value !== undefined)
    )
    console.log('addWorkSlot: Clean slot prepared:', cleanSlot)
    console.log('addWorkSlot: Calling addDoc...')
    const result = await addDoc(slotsRef, cleanSlot)
    console.log('addWorkSlot: Work slot added successfully:', result.id)
    
    // Create notification
    try {
      await addNotification({
        userId: slot.userId,
        type: 'slot_added',
        category: 'schedule',
        title: 'Добавлен рабочий слот',
        message: `Добавлен рабочий слот на ${slot.date}`,
        read: false,
        createdAt: new Date().toISOString(),
        relatedId: result.id,
        relatedType: 'slot',
        actionUrl: '/management',
        icon: '📅',
        priority: 'medium',
      })
    } catch (notifError) {
      console.error('Error creating notification for slot:', notifError)
    }
    
    return result
  } catch (error: any) {
    console.error('addWorkSlot: Error caught:', error)
    console.error('addWorkSlot: Error code:', error?.code)
    console.error('addWorkSlot: Error message:', error?.message)
    console.error('addWorkSlot: Full error:', JSON.stringify(error, null, 2))
    throw error
  }
}

export const updateWorkSlot = async (id: string, updates: Partial<WorkSlot>) => {
  // Get slot data before updating to create notification
  const slotRef = doc(db, 'workSlots', id)
  const slotDoc = await getDoc(slotRef)
  const slotData = slotDoc.data() as WorkSlot | undefined
  
  // Remove undefined values before updating
  const cleanUpdates = Object.fromEntries(
    Object.entries(updates).filter(([_, value]) => value !== undefined)
  )
  await updateDoc(slotRef, cleanUpdates)
  
  // Create notification
  if (slotData) {
    try {
      const updatedSlot = { ...slotData, ...cleanUpdates } as WorkSlot
      await addNotification({
        userId: slotData.userId,
        type: 'slot_updated',
        category: 'schedule',
        title: 'Изменен рабочий слот',
        message: `Рабочий слот на ${updatedSlot.date || slotData.date} был изменен`,
        read: false,
        createdAt: new Date().toISOString(),
        relatedId: id,
        relatedType: 'slot',
        actionUrl: '/management',
        icon: '✏️',
        priority: 'medium',
      })
    } catch (notifError) {
      console.error('Error creating notification for updated slot:', notifError)
    }
  }
}

export const deleteWorkSlot = async (id: string) => {
  // Get slot data before deleting to create notification
  const slotRef = doc(db, 'workSlots', id)
  const slotDoc = await getDoc(slotRef)
  const slotData = slotDoc.data() as WorkSlot | undefined
  
  await deleteDoc(slotRef)
  
  // Create notification
  if (slotData) {
    try {
      await addNotification({
        userId: slotData.userId,
        type: 'slot_deleted',
        category: 'schedule',
        title: 'Удален рабочий слот',
        message: `Удален рабочий слот на ${slotData.date}`,
        read: false,
        createdAt: new Date().toISOString(),
        relatedId: id,
        relatedType: 'slot',
        actionUrl: '/management',
        icon: '🗑️',
        priority: 'medium',
      })
    } catch (notifError) {
      console.error('Error creating notification for deleted slot:', notifError)
    }
  }
}

// Day Statuses
export const getDayStatuses = async (userId?: string, date?: string) => {
  const statusesRef = collection(db, 'dayStatuses')
  let q: ReturnType<typeof query>

  // Build query based on filters - avoid composite index requirement
  // Use only single-field filters to avoid needing composite indexes
  if (userId && date) {
    // Filter by userId first, then filter in memory
    q = query(statusesRef, where('userId', '==', userId))
  } else if (userId) {
    // Filter by userId only, sort in memory to avoid index requirement
    q = query(statusesRef, where('userId', '==', userId))
  } else if (date) {
    // Filter by date only
    q = query(statusesRef, where('date', '==', date))
  } else {
    // No filters, get all
    q = query(statusesRef)
  }

  const snapshot = await getDocs(q)
  let results = snapshot.docs.map((doc) => {
    const data = doc.data() as any
    return {
      id: doc.id,
      userId: data?.userId || '',
      date: data?.date || '',
      type: data?.type || 'dayoff',
      ...(data?.comment && { comment: data.comment }),
      ...(data?.endDate && { endDate: data.endDate }),
    } as DayStatus
  })
  
  // Filter by date in memory if both userId and date provided
  if (userId && date) {
    results = results.filter((s) => s.date === date)
  }
  
  // Sort by date in memory to avoid index requirement
  results.sort((a, b) => a.date.localeCompare(b.date))
  
  return results
}

export const addDayStatus = async (status: Omit<DayStatus, 'id'>) => {
  try {
    const statusesRef = collection(db, 'dayStatuses')
    // Remove undefined values before saving
    const cleanStatus = Object.fromEntries(
      Object.entries(status).filter(([_, value]) => value !== undefined)
    )
    console.log('Adding day status:', cleanStatus)
    const result = await addDoc(statusesRef, cleanStatus)
    console.log('Day status added successfully:', result.id)
    
    // Create notification
    try {
      const statusLabels: Record<string, string> = {
        dayoff: 'Выходной',
        sick: 'Больничный',
        vacation: 'Отпуск',
      }
      const statusLabel = statusLabels[status.type] || status.type
      await addNotification({
        userId: status.userId,
        type: 'day_status_changed',
        category: 'schedule',
        title: `Добавлен ${statusLabel}`,
        message: `${statusLabel} добавлен на ${status.date}${status.endDate ? ` - ${status.endDate}` : ''}`,
        read: false,
        createdAt: new Date().toISOString(),
        relatedId: result.id,
        relatedType: 'day_status',
        actionUrl: '/management',
        icon: status.type === 'dayoff' ? '🏖️' : status.type === 'sick' ? '🏥' : '✈️',
        priority: 'medium',
      })
    } catch (notifError) {
      console.error('Error creating notification for day status:', notifError)
    }
    
    return result
  } catch (error) {
    console.error('Error in addDayStatus:', error)
    throw error
  }
}

export const updateDayStatus = async (id: string, updates: Partial<DayStatus>) => {
  // Get status data before updating to create notification
  const statusRef = doc(db, 'dayStatuses', id)
  const statusDoc = await getDoc(statusRef)
  const statusData = statusDoc.data() as DayStatus | undefined
  
  // Remove undefined values before updating
  const cleanUpdates = Object.fromEntries(
    Object.entries(updates).filter(([_, value]) => value !== undefined)
  )
  await updateDoc(statusRef, cleanUpdates)
  
  // Create notification
  if (statusData) {
    try {
      const statusLabels: Record<string, string> = {
        dayoff: 'Выходной',
        sick: 'Больничный',
        vacation: 'Отпуск',
      }
      const statusLabel = statusLabels[statusData.type] || statusData.type
      await addNotification({
        userId: statusData.userId,
        type: 'day_status_changed',
        category: 'schedule',
        title: `Изменен ${statusLabel}`,
        message: `${statusLabel} на ${statusData.date} был изменен`,
        read: false,
        createdAt: new Date().toISOString(),
        relatedId: id,
        relatedType: 'day_status',
        actionUrl: '/management',
        icon: statusData.type === 'dayoff' ? '🏖️' : statusData.type === 'sick' ? '🏥' : '✈️',
        priority: 'medium',
      })
    } catch (notifError) {
      console.error('Error creating notification for updated day status:', notifError)
    }
  }
}

export const deleteDayStatus = async (id: string) => {
  // Get status data before deleting to create notification
  const statusRef = doc(db, 'dayStatuses', id)
  const statusDoc = await getDoc(statusRef)
  const statusData = statusDoc.data() as DayStatus | undefined
  
  await deleteDoc(statusRef)
  
  // Create notification
  if (statusData) {
    try {
      const statusLabels: Record<string, string> = {
        dayoff: 'Выходной',
        sick: 'Больничный',
        vacation: 'Отпуск',
      }
      const statusLabel = statusLabels[statusData.type] || statusData.type
      await addNotification({
        userId: statusData.userId,
        type: 'day_status_changed',
        category: 'schedule',
        title: `Удален ${statusLabel}`,
        message: `${statusLabel} на ${statusData.date} был удален`,
        read: false,
        createdAt: new Date().toISOString(),
        relatedId: id,
        relatedType: 'day_status',
        actionUrl: '/management',
        icon: '🗑️',
        priority: 'medium',
      })
    } catch (notifError) {
      console.error('Error creating notification for deleted day status:', notifError)
    }
  }
}

// Earnings
export const getEarnings = async (userId?: string, startDate?: string, endDate?: string) => {
  const earningsRef = collection(db, 'earnings')
  let q: ReturnType<typeof query>

  // Build query to avoid composite index requirement
  if (userId && startDate && endDate) {
    // Filter by userId first, then filter by date in memory
    q = query(earningsRef, where('userId', '==', userId))
  } else if (userId) {
    // Filter by userId only, sort in memory
    q = query(earningsRef, where('userId', '==', userId))
  } else if (startDate && endDate) {
    // Filter by date range (this doesn't require index for range queries on single field)
    q = query(earningsRef, where('date', '>=', startDate), where('date', '<=', endDate))
  } else {
    // No filters, get all
    q = query(earningsRef)
  }

  const snapshot = await getDocs(q)
  let results = snapshot.docs.map((doc) => {
    const data = doc.data() as any
    return {
      id: doc.id,
      userId: data?.userId || '',
      date: data?.date || '',
      amount: data?.amount || 0,
      poolAmount: data?.poolAmount || 0,
      slotId: data?.slotId || '',
      participants: data?.participants || [],
    } as Earnings
  })
  
  // Filter by date range in memory if userId is also provided
  if (userId && startDate && endDate) {
    results = results.filter((e) => e.date >= startDate && e.date <= endDate)
  }
  
  // Sort by date descending in memory to avoid index requirement
  results.sort((a, b) => b.date.localeCompare(a.date))
  
  return results
}

export const addEarnings = async (earning: Omit<Earnings, 'id'>) => {
  try {
    const earningsRef = collection(db, 'earnings')
    // Remove undefined values before saving
    const cleanEarning = Object.fromEntries(
      Object.entries(earning).filter(([_, value]) => value !== undefined)
    )
    console.log('Adding earnings:', cleanEarning)
    const result = await addDoc(earningsRef, cleanEarning)
    console.log('Earnings added successfully:', result.id)
    
    // Create notification
    try {
      await addNotification({
        userId: earning.userId,
        type: 'earnings_added',
        category: 'earnings',
        title: 'Добавлен заработок',
        message: `Добавлен заработок: ${earning.amount} ₽ на ${earning.date}`,
        read: false,
        createdAt: new Date().toISOString(),
        relatedId: result.id,
        relatedType: 'earning',
        actionUrl: '/earnings',
        icon: '💰',
        priority: 'high',
      })
    } catch (notifError) {
      console.error('Error creating notification for earnings:', notifError)
    }
    
    return result
  } catch (error) {
    console.error('Error in addEarnings:', error)
    throw error
  }
}

export const updateEarnings = async (id: string, updates: Partial<Earnings>) => {
  // Get earning data before updating to create notification
  const earningRef = doc(db, 'earnings', id)
  const earningDoc = await getDoc(earningRef)
  const earningData = earningDoc.data() as Earnings | undefined
  
  // Remove undefined values before updating
  const cleanUpdates = Object.fromEntries(
    Object.entries(updates).filter(([_, value]) => value !== undefined)
  )
  await updateDoc(earningRef, cleanUpdates)
  
  // Create notification
  if (earningData) {
    try {
      const updatedAmount = updates.amount !== undefined ? updates.amount : earningData.amount
      await addNotification({
        userId: earningData.userId,
        type: 'earnings_updated',
        category: 'earnings',
        title: 'Изменен заработок',
        message: `Заработок на ${earningData.date} изменен на ${updatedAmount} ₽`,
        read: false,
        createdAt: new Date().toISOString(),
        relatedId: id,
        relatedType: 'earning',
        actionUrl: '/earnings',
        icon: '✏️',
        priority: 'high',
      })
    } catch (notifError) {
      console.error('Error creating notification for updated earnings:', notifError)
    }
  }
}

export const deleteEarnings = async (id: string) => {
  // Get earning data before deleting to create notification
  const earningRef = doc(db, 'earnings', id)
  const earningDoc = await getDoc(earningRef)
  const earningData = earningDoc.data() as Earnings | undefined
  
  await deleteDoc(earningRef)
  
  // Create notification
  if (earningData) {
    try {
      await addNotification({
        userId: earningData.userId,
        type: 'earnings_updated',
        category: 'earnings',
        title: 'Удален заработок',
        message: `Заработок ${earningData.amount} ₽ на ${earningData.date} был удален`,
        read: false,
        createdAt: new Date().toISOString(),
        relatedId: id,
        relatedType: 'earning',
        actionUrl: '/earnings',
        icon: '🗑️',
        priority: 'high',
      })
    } catch (notifError) {
      console.error('Error creating notification for deleted earnings:', notifError)
    }
  }
}

// Rating
export const getRatingData = async (userId?: string) => {
  const ratingRef = collection(db, 'ratings')
  let q = query(ratingRef)

  if (userId) {
    q = query(q, where('userId', '==', userId))
  }

  const snapshot = await getDocs(q)
  return snapshot.docs.map((doc) => {
    const data = doc.data()
    return {
      id: doc.id,
      userId: data.userId || '',
      earnings: data.earnings || 0,
      messages: data.messages || 0,
      initiatives: data.initiatives || 0,
      signals: data.signals || 0,
      profitableSignals: data.profitableSignals || 0,
      referrals: data.referrals || 0,
      daysOff: data.daysOff || 0,
      sickDays: data.sickDays || 0,
      vacationDays: data.vacationDays || 0,
      poolAmount: data.poolAmount || 0,
      rating: data.rating || 0,
      lastUpdated: data.lastUpdated || new Date().toISOString(),
    } as RatingData
  })
}

export const getWeeklyMessages = async (userId: string, weekStart: string, weekEnd: string): Promise<number> => {
  try {
    const messagesRef = collection(db, 'messages')
    // Filter by userId first, then filter by date in memory to avoid composite index requirement
    const q = query(messagesRef, where('userId', '==', userId))
    const snapshot = await getDocs(q)
    
    // Filter by date range in memory
    const weeklyMessages = snapshot.docs.filter(doc => {
      const data = doc.data()
      const date = data.date || ''
      return date >= weekStart && date <= weekEnd
    })
    
    return weeklyMessages.length
  } catch (error) {
    console.error('Error getting weekly messages:', error)
    // Fallback to ratings if messages collection doesn't exist yet
    const ratingRef = collection(db, 'ratings')
    const q = query(ratingRef, where('userId', '==', userId))
    const snapshot = await getDocs(q)
    if (snapshot.empty) return 0
    const data = snapshot.docs[0].data()
    return data.messages || 0
  }
}

export const updateRatingData = async (userId: string, data: Partial<RatingData>) => {
  const ratingRef = doc(db, 'ratings', userId)
  const ratingDoc = await getDoc(ratingRef)
  
  if (ratingDoc.exists()) {
    return await updateDoc(ratingRef, data)
  } else {
    return await addDoc(collection(db, 'ratings'), { userId, ...data })
  }
}

// Referrals
export const addReferral = async (referral: Omit<Referral, 'id'>) => {
  try {
    const referralsRef = collection(db, 'referrals')
    const cleanReferral = Object.fromEntries(
      Object.entries(referral).filter(([_, value]) => value !== undefined)
    )
    console.log('Adding referral:', cleanReferral)
    const result = await addDoc(referralsRef, cleanReferral)
    console.log('Referral added successfully:', result.id)
    
    // Create notification for referral owner
    try {
      await addNotification({
        userId: referral.ownerId,
        type: 'referral_added',
        category: 'referrals',
        title: 'Добавлен новый реферал',
        message: `Добавлен новый реферал: ${referral.name || referral.referralId}`,
        read: false,
        createdAt: new Date().toISOString(),
        relatedId: result.id,
        relatedType: 'referral',
        actionUrl: '/rating',
        icon: '👥',
        priority: 'medium',
      })
    } catch (notifError) {
      console.error('Error creating notification for referral:', notifError)
    }
    
    return result
  } catch (error) {
    console.error('Error in addReferral:', error)
    throw error
  }
}

export const getReferrals = async (ownerId?: string, startDate?: string, endDate?: string) => {
  const referralsRef = collection(db, 'referrals')
  let q: ReturnType<typeof query>

  if (ownerId) {
    q = query(referralsRef, where('ownerId', '==', ownerId))
  } else {
    q = query(referralsRef, orderBy('createdAt', 'desc'))
  }

  const snapshot = await getDocs(q)
  let referrals = snapshot.docs.map((docSnap) => {
    const data = docSnap.data() as Omit<Referral, 'id'>
    return {
      id: docSnap.id,
      referralId: data.referralId,
      ownerId: data.ownerId,
      name: data.name,
      age: data.age,
      createdAt: data.createdAt,
      comment: data.comment,
    } as Referral
  })

  if (startDate && endDate) {
    referrals = referrals.filter((referral) => referral.createdAt >= startDate && referral.createdAt <= endDate)
  }

  return referrals.sort((a, b) => (a.createdAt < b.createdAt ? 1 : -1))
}

export const updateReferral = async (id: string, updates: Partial<Referral>) => {
  // Get referral data before updating to create notification
  const referralRef = doc(db, 'referrals', id)
  const referralDoc = await getDoc(referralRef)
  const referralData = referralDoc.data() as Referral | undefined
  
  const cleanUpdates = Object.fromEntries(
    Object.entries(updates).filter(([_, value]) => value !== undefined)
  )
  await updateDoc(referralRef, cleanUpdates)
  
  // Create notification
  if (referralData) {
    try {
      await addNotification({
        userId: referralData.ownerId,
        type: 'referral_added',
        category: 'referrals',
        title: 'Изменен реферал',
        message: `Реферал ${referralData.name || referralData.referralId} был изменен`,
        read: false,
        createdAt: new Date().toISOString(),
        relatedId: id,
        relatedType: 'referral',
        actionUrl: '/rating',
        icon: '✏️',
        priority: 'medium',
      })
    } catch (notifError) {
      console.error('Error creating notification for updated referral:', notifError)
    }
  }
}

export const deleteReferral = async (id: string) => {
  // Get referral data before deleting to create notification
  const referralRef = doc(db, 'referrals', id)
  const referralDoc = await getDoc(referralRef)
  const referralData = referralDoc.data() as Referral | undefined
  
  await deleteDoc(referralRef)
  
  // Create notification
  if (referralData) {
    try {
      await addNotification({
        userId: referralData.ownerId,
        type: 'referral_added',
        category: 'referrals',
        title: 'Удален реферал',
        message: `Реферал ${referralData.name || referralData.referralId} был удален`,
        read: false,
        createdAt: new Date().toISOString(),
        relatedId: id,
        relatedType: 'referral',
        actionUrl: '/rating',
        icon: '🗑️',
        priority: 'medium',
      })
    } catch (notifError) {
      console.error('Error creating notification for deleted referral:', notifError)
    }
  }
}

// Call (Trading Signal) functions
export const addCall = async (callData: Omit<Call, 'id'>): Promise<string> => {
  const callsRef = collection(db, 'calls')
  const docRef = await addDoc(callsRef, callData)
  return docRef.id
}

export const getCalls = async (filters?: {
  userId?: string
  network?: string
  strategy?: string
  status?: string
  activeOnly?: boolean
}): Promise<Call[]> => {
  const callsRef = collection(db, 'calls')
  
  // Build query constraints
  const constraints: any[] = []
  
  // Add userId filter if provided
  if (filters?.userId) {
    constraints.push(where('userId', '==', filters.userId))
  }
  
  // Add status filter if provided (don't combine with activeOnly status)
  if (filters?.status && !filters?.activeOnly) {
    constraints.push(where('status', '==', filters.status))
  }
  
  // Add activeOnly filters
  if (filters?.activeOnly) {
    constraints.push(where('status', '==', 'active'))
    const yesterday = new Date()
    yesterday.setHours(yesterday.getHours() - 24)
    constraints.push(where('createdAt', '>=', yesterday.toISOString()))
  }
  
  // Always add orderBy
  constraints.push(orderBy('createdAt', 'desc'))
  
  // Build query
  let q: ReturnType<typeof query>
  if (constraints.length > 0) {
    q = query(callsRef, ...constraints) as ReturnType<typeof query>
  } else {
    q = query(callsRef, orderBy('createdAt', 'desc'))
  }

  const snapshot = await getDocs(q)
  let calls = snapshot.docs.map((doc) => {
    const data = doc.data() as any
    return {
      id: doc.id,
      userId: data.userId || '',
      network: data.network || '',
      ticker: data.ticker || '',
      pair: data.pair || '',
      entryPoint: data.entryPoint || '',
      target: data.target || '',
      strategy: data.strategy || 'flip',
      risks: data.risks || '',
      cancelConditions: data.cancelConditions,
      comment: data.comment,
      createdAt: data.createdAt || new Date().toISOString(),
      status: data.status || 'active',
      maxProfit: data.maxProfit,
      currentPnL: data.currentPnL,
      currentMarketCap: data.currentMarketCap,
      signalMarketCap: data.signalMarketCap,
      currentPrice: data.currentPrice,
      entryPrice: data.entryPrice
    } as Call
  })

  // Apply additional filters in memory
  if (filters?.network) {
    calls = calls.filter(c => c.network === filters.network)
  }
  if (filters?.strategy) {
    calls = calls.filter(c => c.strategy === filters.strategy)
  }

  // Filter by active (24 hours) if needed
  if (filters?.activeOnly && !filters.status) {
    const yesterday = new Date()
    yesterday.setHours(yesterday.getHours() - 24)
    calls = calls.filter(c => {
      const createdAt = new Date(c.createdAt)
      return c.status === 'active' && createdAt >= yesterday
    })
  }

  return calls
}

export const updateCall = async (id: string, updates: Partial<Call>): Promise<void> => {
  const callRef = doc(db, 'calls', id)
  await updateDoc(callRef, updates as any)
}

export const deleteCall = async (id: string): Promise<void> => {
  const callRef = doc(db, 'calls', id)
  await deleteDoc(callRef)
}

// Task functions
export const addTask = async (taskData: Omit<Task, 'id'>): Promise<string> => {
  const tasksRef = collection(db, 'tasks')
  const docRef = await addDoc(tasksRef, taskData)
  return docRef.id
}

export const getTasks = async (filters?: {
  assignedTo?: string
  category?: string
  status?: TaskStatus
  createdBy?: string
}): Promise<Task[]> => {
  const tasksRef = collection(db, 'tasks')
  
  const constraints: any[] = []
  
  if (filters?.status) {
    constraints.push(where('status', '==', filters.status))
  }
  
  if (filters?.category) {
    constraints.push(where('category', '==', filters.category))
  }
  
  if (filters?.createdBy) {
    constraints.push(where('createdBy', '==', filters.createdBy))
  }
  
  constraints.push(orderBy('createdAt', 'desc'))
  
  let q: ReturnType<typeof query>
  if (constraints.length > 0) {
    q = query(tasksRef, ...constraints) as ReturnType<typeof query>
  } else {
    q = query(tasksRef, orderBy('createdAt', 'desc'))
  }
  
  const snapshot = await getDocs(q)
  let tasks = snapshot.docs.map((doc) => {
    const data = doc.data() as any
    return {
      id: doc.id,
      title: data.title || '',
      description: data.description,
      category: data.category || 'trading',
      status: data.status || 'pending',
      createdBy: data.createdBy || '',
      assignedTo: data.assignedTo || [],
      approvals: data.approvals || [],
      createdAt: data.createdAt || new Date().toISOString(),
      updatedAt: data.updatedAt || new Date().toISOString(),
      completedAt: data.completedAt,
      closedAt: data.closedAt,
      completedBy: data.completedBy,
      priority: data.priority,
      dueDate: data.dueDate || new Date().toISOString().split('T')[0],
      dueTime: data.dueTime || '12:00',
    } as Task
  })

  // Auto-delete tasks that have been closed for more than 12 hours
  const now = new Date()
  const twelveHoursAgo = new Date(now.getTime() - 12 * 60 * 60 * 1000)
  
  const tasksToDelete = tasks.filter(task => {
    if (task.status === 'closed' && task.closedAt) {
      const closedDate = new Date(task.closedAt)
      return closedDate < twelveHoursAgo
    }
    return false
  })

  // Delete old closed tasks
  if (tasksToDelete.length > 0) {
    await Promise.all(tasksToDelete.map(task => deleteTask(task.id)))
    // Remove deleted tasks from the list
    tasks = tasks.filter(task => !tasksToDelete.find(t => t.id === task.id))
  }
  
  // Apply assignedTo filter in memory (array-contains doesn't work well with multiple users)
  if (filters?.assignedTo) {
    tasks = tasks.filter(t => t.assignedTo.includes(filters.assignedTo!))
  }
  
  return tasks
}

export const updateTask = async (id: string, updates: Partial<Task>): Promise<void> => {
  const taskRef = doc(db, 'tasks', id)
  const cleanUpdates = {
    ...updates,
    updatedAt: new Date().toISOString(),
  }
  await updateDoc(taskRef, cleanUpdates as any)
}

export const deleteTask = async (id: string): Promise<void> => {
  const taskRef = doc(db, 'tasks', id)
  await deleteDoc(taskRef)
  
  // Also delete related notifications
  const notificationsRef = collection(db, 'taskNotifications')
  const q = query(notificationsRef, where('taskId', '==', id))
  const snapshot = await getDocs(q)
  await Promise.all(snapshot.docs.map((doc) => deleteDoc(doc.ref)))
}

// Task Notification functions
export const addTaskNotification = async (notificationData: Omit<TaskNotification, 'id'>): Promise<string> => {
  const notificationsRef = collection(db, 'taskNotifications')
  const docRef = await addDoc(notificationsRef, notificationData)
  return docRef.id
}

export const getTaskNotifications = async (userId?: string, taskId?: string): Promise<TaskNotification[]> => {
  const notificationsRef = collection(db, 'taskNotifications')
  
  const constraints: any[] = []
  
  if (userId) {
    constraints.push(where('userId', '==', userId))
  }
  
  if (taskId) {
    constraints.push(where('taskId', '==', taskId))
  }
  
  constraints.push(orderBy('createdAt', 'desc'))
  
  let q: ReturnType<typeof query>
  if (constraints.length > 0) {
    q = query(notificationsRef, ...constraints) as ReturnType<typeof query>
  } else {
    q = query(notificationsRef, orderBy('createdAt', 'desc'))
  }
  
  const snapshot = await getDocs(q)
  return snapshot.docs.map((doc) => {
    const data = doc.data() as any
    return {
      id: doc.id,
      userId: data.userId || '',
      taskId: data.taskId || '',
      type: data.type || 'task_added',
      message: data.message || '',
      read: data.read || false,
      createdAt: data.createdAt || new Date().toISOString(),
      movedBy: data.movedBy,
    } as TaskNotification
  })
}

export const markNotificationAsRead = async (id: string): Promise<void> => {
  const notificationRef = doc(db, 'taskNotifications', id)
  await updateDoc(notificationRef, { read: true })
}

export const markAllNotificationsAsRead = async (userId: string): Promise<void> => {
  const notificationsRef = collection(db, 'taskNotifications')
  const q = query(notificationsRef, where('userId', '==', userId), where('read', '==', false))
  const snapshot = await getDocs(q)
  await Promise.all(snapshot.docs.map((doc) => updateDoc(doc.ref, { read: true })))
}

// General Notification functions
export const addNotification = async (notificationData: Omit<Notification, 'id'>): Promise<string> => {
  const notificationsRef = collection(db, 'notifications')
  const docRef = await addDoc(notificationsRef, {
    ...notificationData,
    createdAt: notificationData.createdAt || new Date().toISOString(),
  })
  return docRef.id
}

export const getNotifications = async (
  userId?: string, 
  category?: NotificationCategory,
  unreadOnly?: boolean
): Promise<Notification[]> => {
  const notificationsRef = collection(db, 'notifications')
  
  const constraints: any[] = []
  
  if (userId) {
    constraints.push(where('userId', '==', userId))
  }
  
  if (category) {
    constraints.push(where('category', '==', category))
  }
  
  if (unreadOnly) {
    constraints.push(where('read', '==', false))
  }
  
  constraints.push(orderBy('createdAt', 'desc'))
  
  let q: ReturnType<typeof query>
  if (constraints.length > 0) {
    q = query(notificationsRef, ...constraints) as ReturnType<typeof query>
  } else {
    q = query(notificationsRef, orderBy('createdAt', 'desc'))
  }
  
  const snapshot = await getDocs(q)
  return snapshot.docs.map((doc) => {
    const data = doc.data() as any
    return {
      id: doc.id,
      userId: data.userId || '',
      type: data.type || 'task_added',
      category: data.category || 'tasks',
      title: data.title || '',
      message: data.message || '',
      read: data.read || false,
      createdAt: data.createdAt || new Date().toISOString(),
      relatedId: data.relatedId,
      relatedType: data.relatedType,
      actionUrl: data.actionUrl,
      icon: data.icon,
      priority: data.priority || 'medium',
    } as Notification
  })
}

export const markNotificationAsReadGeneral = async (id: string): Promise<void> => {
  const notificationRef = doc(db, 'notifications', id)
  await updateDoc(notificationRef, { read: true })
}

export const markAllNotificationsAsReadGeneral = async (userId: string, category?: NotificationCategory): Promise<void> => {
  const notificationsRef = collection(db, 'notifications')
  const constraints: any[] = [
    where('userId', '==', userId),
    where('read', '==', false)
  ]
  
  if (category) {
    constraints.push(where('category', '==', category))
  }
  
  const q = query(notificationsRef, ...constraints) as ReturnType<typeof query>
  const snapshot = await getDocs(q)
  await Promise.all(snapshot.docs.map((doc) => updateDoc(doc.ref, { read: true })))
}

export const deleteNotification = async (id: string): Promise<void> => {
  const notificationRef = doc(db, 'notifications', id)
  await deleteDoc(notificationRef)
}

// Task Chat functions
export const addTaskChatMessage = async (messageData: Omit<TaskChatMessage, 'id'>): Promise<string> => {
  try {
    const messagesRef = collection(db, 'taskChatMessages')
    const dataToSave = {
      taskId: messageData.taskId,
      userId: messageData.userId,
      userName: messageData.userName,
      message: messageData.message || '',
      imageUrl: messageData.imageUrl || null,
      documentUrl: messageData.documentUrl || null,
      documentName: messageData.documentName || null,
      createdAt: messageData.createdAt || new Date().toISOString(),
      updatedAt: null,
      edited: messageData.edited || false,
      deleted: messageData.deleted || false,
    }
    
    console.log('Adding task chat message to Firestore:', dataToSave)
    const docRef = await addDoc(messagesRef, dataToSave)
    console.log('Task chat message added with ID:', docRef.id)
    return docRef.id
  } catch (error: any) {
    console.error('Error adding task chat message:', error)
    throw new Error(`Failed to add message: ${error?.message || 'Unknown error'}`)
  }
}

export const getTaskChatMessages = async (taskId: string): Promise<TaskChatMessage[]> => {
  const messagesRef = collection(db, 'taskChatMessages')
  // Use only taskId and orderBy to avoid index issues, filter deleted in code
  const q = query(
    messagesRef,
    where('taskId', '==', taskId),
    orderBy('createdAt', 'asc')
  )
  
  const snapshot = await getDocs(q)
  return snapshot.docs
    .map((doc) => {
      const data = doc.data() as any
      return {
        id: doc.id,
        taskId: data.taskId || '',
        userId: data.userId || '',
        userName: data.userName || '',
        message: data.message || '',
        imageUrl: data.imageUrl,
        documentUrl: data.documentUrl,
        documentName: data.documentName,
        createdAt: data.createdAt || new Date().toISOString(),
        updatedAt: data.updatedAt,
        edited: data.edited || false,
        deleted: data.deleted || false,
      } as TaskChatMessage
    })
    .filter(msg => !msg.deleted) // Filter deleted messages in code
}

export const updateTaskChatMessage = async (id: string, updates: Partial<TaskChatMessage>): Promise<void> => {
  const messageRef = doc(db, 'taskChatMessages', id)
  const cleanUpdates = {
    ...updates,
    updatedAt: new Date().toISOString(),
    edited: true,
  }
  await updateDoc(messageRef, cleanUpdates as any)
}

export const deleteTaskChatMessage = async (id: string): Promise<void> => {
  const messageRef = doc(db, 'taskChatMessages', id)
  await updateDoc(messageRef, { 
    deleted: true,
    updatedAt: new Date().toISOString(),
  })
}

export const saveTaskChat = async (taskId: string): Promise<void> => {
  const taskRef = doc(db, 'tasks', taskId)
  await updateDoc(taskRef, {
    chatSaved: true,
    chatSavedAt: new Date().toISOString(),
    updatedAt: new Date().toISOString(),
  })
}

export const clearTaskChat = async (taskId: string): Promise<void> => {
  const messagesRef = collection(db, 'taskChatMessages')
  const q = query(messagesRef, where('taskId', '==', taskId))
  const snapshot = await getDocs(q)
  
  await Promise.all(snapshot.docs.map((doc) => deleteDoc(doc.ref)))
  
  // Update task
  const taskRef = doc(db, 'tasks', taskId)
  await updateDoc(taskRef, {
    chatSaved: false,
    chatSavedAt: undefined,
    updatedAt: new Date().toISOString(),
  })
}

export const cleanupExpiredChats = async (): Promise<void> => {
  const messagesRef = collection(db, 'taskChatMessages')
  const twoDaysAgo = new Date()
  twoDaysAgo.setHours(twoDaysAgo.getHours() - 48)
  
  const q = query(messagesRef, where('createdAt', '<', twoDaysAgo.toISOString()))
  const snapshot = await getDocs(q)
  
  const taskIds = new Set<string>()
  
  // Get all task IDs with expired messages
  snapshot.docs.forEach((doc) => {
    const data = doc.data()
    if (data.taskId) {
      taskIds.add(data.taskId)
    }
  })
  
  // Delete expired messages and their files
  for (const docSnap of snapshot.docs) {
    const data = docSnap.data()
    
    // Delete image from storage if exists
    if (data.imageUrl) {
      try {
        const imageRef = ref(storage, data.imageUrl)
        await deleteObject(imageRef)
      } catch (error) {
        console.error('Error deleting image:', error)
      }
    }
    
    // Delete document from storage if exists
    if (data.documentUrl) {
      try {
        const documentRef = ref(storage, data.documentUrl)
        await deleteObject(documentRef)
      } catch (error) {
        console.error('Error deleting document:', error)
      }
    }
    
    // Delete message
    await deleteDoc(docSnap.ref)
  }
  
  // Check if chats are saved, if not - clear saved flag
  for (const taskId of taskIds) {
    const taskRef = doc(db, 'tasks', taskId)
    const taskDoc = await getDoc(taskRef)
    const taskData = taskDoc.data() as Task | undefined
    
    if (taskData && !taskData.chatSaved) {
      // Check if there are any messages left
      const remainingMessages = query(messagesRef, where('taskId', '==', taskId))
      const remainingSnapshot = await getDocs(remainingMessages)
      
      if (remainingSnapshot.empty) {
        await updateDoc(taskRef, {
          chatSaved: false,
          chatSavedAt: undefined,
        })
      }
    }
  }
}

// File upload functions
export const uploadChatImage = async (taskId: string, file: File): Promise<string> => {
  try {
    if (!storage) {
      throw new Error('Firebase Storage не инициализирован')
    }
    
    const timestamp = Date.now()
    const sanitizedFileName = file.name.replace(/[^a-zA-Z0-9._-]/g, '_')
    const fileName = `task-chat/${taskId}/images/${timestamp}-${sanitizedFileName}`
    const storageRef = ref(storage, fileName)
    
    console.log('Uploading image to storage:', fileName, 'Size:', file.size)
    await uploadBytes(storageRef, file)
    const downloadURL = await getDownloadURL(storageRef)
    console.log('Image uploaded, URL:', downloadURL)
    return downloadURL
  } catch (error: any) {
    console.error('Error in uploadChatImage:', error)
    throw new Error(`Ошибка загрузки изображения: ${error?.message || 'Unknown error'}`)
  }
}

export const uploadChatDocument = async (taskId: string, file: File): Promise<string> => {
  try {
    if (!storage) {
      throw new Error('Firebase Storage не инициализирован')
    }
    
    const timestamp = Date.now()
    const sanitizedFileName = file.name.replace(/[^a-zA-Z0-9._-]/g, '_')
    const fileName = `task-chat/${taskId}/documents/${timestamp}-${sanitizedFileName}`
    const storageRef = ref(storage, fileName)
    
    console.log('Uploading document to storage:', fileName, 'Size:', file.size)
    await uploadBytes(storageRef, file)
    const downloadURL = await getDownloadURL(storageRef)
    console.log('Document uploaded, URL:', downloadURL)
    return downloadURL
  } catch (error: any) {
    console.error('Error in uploadChatDocument:', error)
    throw new Error(`Ошибка загрузки документа: ${error?.message || 'Unknown error'}`)
  }
}

export const deleteChatFile = async (fileUrl: string): Promise<void> => {
  try {
    const fileRef = ref(storage, fileUrl)
    await deleteObject(fileRef)
  } catch (error) {
    console.error('Error deleting file:', error)
  }
}

