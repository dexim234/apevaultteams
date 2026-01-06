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
  DocumentData,
  DocumentSnapshot,
} from 'firebase/firestore'
import { db } from '@/firebase/config' // Keep original path for db
import { WorkSlot, DayStatus, Earnings, RatingData, Referral, Call, Task, TaskStatus, Note, TaskPriority, StageAssignee, ApprovalRequest, ApprovalStatus, UserActivity, UserNickname, Restriction, RestrictionType, UserConflict, AccessBlock, AiAlert, User, TriggerAlert, FasolTriggerAlert } from '@/types' // Add User to existing types
import { clearNicknameCache, getUserNicknameAsync } from '@/utils/userUtils'
import { formatDate } from '@/utils/dateUtils'

const DATA_RETENTION_DAYS = 30

const pad = (value: number) => value.toString().padStart(2, '0')
const getRetentionThresholds = () => {
  const thresholdDate = new Date()
  thresholdDate.setDate(thresholdDate.getDate() - DATA_RETENTION_DAYS)
  const dateOnly = `${thresholdDate.getFullYear()} -${pad(thresholdDate.getMonth() + 1)} -${pad(thresholdDate.getDate())} `
  return {
    dateOnly,
    iso: thresholdDate.toISOString(),
  }
}

const cleanupCollectionByField = async (collectionName: string, fieldName: string, threshold: string) => {
  const collectionRef = collection(db, collectionName)
  const q = query(collectionRef, where(fieldName, '<', threshold))
  const snapshot = await getDocs(q)
  await Promise.all(snapshot.docs.map((docSnap: any) => deleteDoc(doc(db, collectionName, docSnap.id))))
}

export const cleanupOldData = async () => {
  try {
    const { dateOnly, iso } = getRetentionThresholds()
    await Promise.all([
      cleanupCollectionByField('workSlots', 'date', dateOnly),
      cleanupCollectionByField('dayStatuses', 'date', dateOnly),
      cleanupCollectionByField('earnings', 'date', dateOnly),
      cleanupCollectionByField('referrals', 'createdAt', iso),
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
  let results = snapshot.docs.map((doc: any) => {
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
      ...(data?.category && { category: data.category }),
    } as WorkSlot
  })

  // Filter by date in memory if both userId and date provided
  if (userId && date) {
    results = results.filter((s: WorkSlot) => s.date === date)
  }

  // Sort by date in memory to avoid index requirement
  results.sort((a: WorkSlot, b: WorkSlot) => a.date.localeCompare(b.date))

  return results
}

export const addWorkSlot = async (slot: Omit<WorkSlot, 'id'>) => {
  try {
    console.log('addWorkSlot: Starting, db initialized:', !!db)
    const slotsRef = collection(db, 'workSlots')
    console.log('addWorkSlot: Collection reference created')
    // Remove undefined values before saving
    const cleanSlot = Object.fromEntries(
      Object.entries(slot).filter(([_, value]: [string, any]) => value !== undefined)
    )
    console.log('addWorkSlot: Clean slot prepared:', cleanSlot)
    console.log('addWorkSlot: Calling addDoc...')
    const result = await addDoc(slotsRef, cleanSlot)
    console.log('addWorkSlot: Work slot added successfully:', result.id)

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
  const slotRef = doc(db, 'workSlots', id)

  // Remove undefined values before updating
  const cleanUpdates = Object.fromEntries(
    Object.entries(updates).filter(([_, value]: [string, any]) => value !== undefined)
  )
  await updateDoc(slotRef, cleanUpdates)
}

export const deleteWorkSlot = async (id: string) => {
  const slotRef = doc(db, 'workSlots', id)
  await deleteDoc(slotRef)
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
  let results = snapshot.docs.map((doc: any) => {
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
    results = results.filter((s: DayStatus) => s.date === date)
  }

  // Sort by date in memory to avoid index requirement
  results.sort((a: DayStatus, b: DayStatus) => a.date.localeCompare(b.date))

  return results
}

export const addDayStatus = async (status: Omit<DayStatus, 'id'>) => {
  try {
    const statusesRef = collection(db, 'dayStatuses')
    // Remove undefined values before saving
    const cleanStatus = Object.fromEntries(
      Object.entries(status).filter(([_, value]: [string, any]) => value !== undefined)
    )
    console.log('Adding day status:', cleanStatus)
    const result = await addDoc(statusesRef, cleanStatus)
    console.log('Day status added successfully:', result.id)

    return result
  } catch (error) {
    console.error('Error in addDayStatus:', error)
    throw error
  }
}

export const updateDayStatus = async (id: string, updates: Partial<DayStatus>) => {
  const statusRef = doc(db, 'dayStatuses', id)

  // Remove undefined values before updating
  const cleanUpdates = Object.fromEntries(
    Object.entries(updates).filter(([_, value]: [string, any]) => value !== undefined)
  )
  await updateDoc(statusRef, cleanUpdates)
}

export const deleteDayStatus = async (id: string) => {
  const statusRef = doc(db, 'dayStatuses', id)
  await deleteDoc(statusRef)
}

// Restrictions
export const getRestrictions = async (isActive?: boolean) => {
  const restrictionsRef = collection(db, 'restrictions')
  let q: ReturnType<typeof query>

  if (isActive !== undefined) {
    q = query(restrictionsRef, where('isActive', '==', isActive))
  } else {
    q = query(restrictionsRef)
  }

  const snapshot = await getDocs(q)
  const results = snapshot.docs.map((doc: any) => {
    const data = doc.data() as any
    return {
      id: doc.id,
      type: data?.type || 'all',
      startDate: data?.startDate || '',
      endDate: data?.endDate,
      startTime: data?.startTime,
      blockFutureDates: data?.blockFutureDates || false,
      comment: data?.comment,
      createdBy: data?.createdBy || '',
      createdAt: data?.createdAt || '',
      isActive: data?.isActive ?? true,
    } as Restriction
  })

  // Sort by start date in memory to avoid index requirement
  results.sort((a: Restriction, b: Restriction) => a.startDate.localeCompare(b.startDate))

  return results
}

export const addRestriction = async (restriction: Omit<Restriction, 'id'>) => {
  try {
    const restrictionsRef = collection(db, 'restrictions')
    // Remove undefined values before saving
    const cleanRestriction = Object.fromEntries(
      Object.entries(restriction).filter(([_, value]: [string, any]) => value !== undefined)
    )
    const result = await addDoc(restrictionsRef, cleanRestriction)
    return result
  } catch (error) {
    console.error('Error adding restriction:', error)
    throw error
  }
}

export const updateRestriction = async (id: string, updates: Partial<Restriction>) => {
  const restrictionRef = doc(db, 'restrictions', id)

  // Remove undefined values before updating
  const cleanUpdates = Object.fromEntries(
    Object.entries(updates).filter(([_, value]: [string, any]) => value !== undefined)
  )
  await updateDoc(restrictionRef, cleanUpdates)
}

export const deleteRestriction = async (id: string) => {
  const restrictionRef = doc(db, 'restrictions', id)
  await deleteDoc(restrictionRef)
}

// Check if a specific action is restricted for given date/time
export const checkRestriction = async (
  actionType: RestrictionType,
  date: string,
  time?: string
): Promise<{ restricted: boolean; restriction?: Restriction; reason?: string }> => {
  try {
    const restrictions = await getRestrictions(true)
    const now = new Date()

    for (const restriction of restrictions) {
      // Check if restriction applies to this action type
      if (restriction.type !== 'all' && restriction.type !== actionType) {
        continue
      }

      const checkDate = new Date(date)
      const restrictionDateTime = new Date(`${restriction.startDate}${restriction.startTime ? `T${restriction.startTime}` : ''} `)

      // Check if blockFutureDates restriction is active
      if (restriction.blockFutureDates && now >= restrictionDateTime) {
        // Block creating records only on the next day after the restriction date
        const restrictionDate = new Date(restriction.startDate);
        const nextDay = new Date(restrictionDate);
        nextDay.setDate(restrictionDate.getDate() + 1);

        if (checkDate.toDateString() === nextDay.toDateString()) {
          return {
            restricted: true,
            restriction,
            reason: `После ${formatDate(restrictionDateTime, 'dd.MM.yyyy')}${restriction.startTime ? ` ${restriction.startTime}` : ''} запрещено создавать ${restrictionTypeToLabel(actionType)} на следующий день ${formatDate(nextDay, 'dd.MM.yyyy')} `
          }
        }
      }

      // Check date range restrictions (existing logic)
      const startDate = new Date(restriction.startDate)

      let dateInRange = false
      if (restriction.endDate) {
        const endDate = new Date(restriction.endDate)
        dateInRange = checkDate >= startDate && checkDate <= endDate
      } else {
        dateInRange = checkDate.getTime() === startDate.getTime()
      }

      if (!dateInRange) {
        continue
      }

      // If no time restriction, then it's restricted
      if (!restriction.startTime) {
        return {
          restricted: true,
          restriction,
          reason: `Запрещено создавать ${restrictionTypeToLabel(actionType)} на ${formatDate(checkDate, 'dd.MM.yyyy')} `
        }
      }

      // Check time restriction
      if (time && restriction.startTime) {
        const checkTime = time
        const restrictTime = restriction.startTime

        if (checkTime >= restrictTime) {
          return {
            restricted: true,
            restriction,
            reason: `Запрещено создавать ${restrictionTypeToLabel(actionType)} после ${restrictTime} на ${formatDate(checkDate, 'dd.MM.yyyy')} `
          }
        }
      }
    }

    return { restricted: false }
  } catch (error) {
    console.error('Error checking restrictions:', error)
    return { restricted: false } // Allow on error to avoid blocking users
  }
}

const restrictionTypeToLabel = (type: RestrictionType): string => {
  const labels: Record<RestrictionType, string> = {
    slots: 'слоты',
    dayoff: 'выходные',
    sick: 'больничные',
    vacation: 'отпуска',
    absence: 'прогулы',
    all: 'любые записи',
  }
  return labels[type]
}

// Approval Requests
const APPROVAL_COLLECTION = 'approvalRequests'

const mapApprovalSnapshot = (docSnap: any): ApprovalRequest => {
  const data = docSnap.data() as any
  const nowIso = new Date().toISOString()
  return {
    id: docSnap.id,
    entity: data?.entity || 'slot',
    action: data?.action || 'create',
    status: data?.status || 'pending',
    authorId: data?.authorId || '',
    targetUserId: data?.targetUserId || '',
    before: data?.before ?? null,
    after: data?.after ?? null,
    comment: data?.comment,
    adminComment: data?.adminComment,
    reviewedBy: data?.reviewedBy,
    createdAt: data?.createdAt || nowIso,
    updatedAt: data?.updatedAt || data?.createdAt || nowIso,
  }
}

const applySlotChange = async (request: ApprovalRequest) => {
  const beforeSlot = request.before as WorkSlot | null | undefined
  const afterSlot = request.after as WorkSlot | null | undefined

  switch (request.action) {
    case 'create': {
      if (!afterSlot) {
        throw new Error('No slot payload for creation')
      }
      const { id: _id, ...payload } = afterSlot
      await addWorkSlot(payload)
      return
    }
    case 'update': {
      const targetId = (afterSlot as WorkSlot | undefined)?.id || beforeSlot?.id
      if (!targetId || !afterSlot) {
        throw new Error('No slot payload for update')
      }
      const { id: _id, ...payload } = afterSlot
      await updateWorkSlot(targetId, payload)
      return
    }
    case 'delete': {
      if (!beforeSlot?.id) {
        throw new Error('No slot id for delete')
      }
      await deleteWorkSlot(beforeSlot.id)
      return
    }
    default:
      return
  }
}

const applyStatusChange = async (request: ApprovalRequest) => {
  const beforeStatus = request.before as DayStatus | null | undefined
  const afterStatus = request.after as DayStatus | null | undefined

  switch (request.action) {
    case 'create': {
      if (!afterStatus) {
        throw new Error('No status payload for creation')
      }
      const { id: _id, ...payload } = afterStatus
      await addDayStatus(payload)
      return
    }
    case 'update': {
      const targetId = (afterStatus as DayStatus | undefined)?.id || beforeStatus?.id
      if (!targetId || !afterStatus) {
        throw new Error('No status payload for update')
      }
      const { id: _id, ...payload } = afterStatus
      await updateDayStatus(targetId, payload)
      return
    }
    case 'delete': {
      if (!beforeStatus?.id) {
        throw new Error('No status id for delete')
      }
      await deleteDayStatus(beforeStatus.id)
      return
    }
    default:
      return
  }
}

const applyEarningChange = async (request: ApprovalRequest) => {
  const beforeE = request.before as Earnings | null | undefined
  const afterE = request.after as Earnings | null | undefined

  switch (request.action) {
    case 'create': {
      if (!afterE) throw new Error('No earning payload for creation')
      const { id: _id, ...payload } = afterE
      await addEarnings(payload)
      return
    }
    case 'update': {
      const targetId = afterE?.id || beforeE?.id
      if (!targetId || !afterE) throw new Error('No earning payload for update')
      const { id: _id, ...payload } = afterE
      await updateEarnings(targetId, payload)
      return
    }
    case 'delete': {
      if (!beforeE?.id) throw new Error('No earning id for delete')
      await deleteEarnings(beforeE.id)
      return
    }
    default:
      return
  }
}

const applyReferralChange = async (request: ApprovalRequest) => {
  const beforeR = request.before as Referral | null | undefined
  const afterR = request.after as Referral | null | undefined

  switch (request.action) {
    case 'create': {
      if (!afterR) throw new Error('No referral payload for creation')
      const { id: _id, ...payload } = afterR
      await addReferral(payload)
      return
    }
    case 'update': {
      const targetId = afterR?.id || beforeR?.id
      if (!targetId || !afterR) throw new Error('No referral payload for update')
      const { id: _id, ...payload } = afterR
      await updateReferral(targetId, payload)
      return
    }
    case 'delete': {
      if (!beforeR?.id) throw new Error('No referral id for delete')
      await deleteReferral(beforeR.id)
      return
    }
    default:
      return
  }
}

const applyLoginChange = async (request: ApprovalRequest) => {
  const afterN = request.after as UserNickname | null | undefined

  switch (request.action) {
    case 'update': {
      if (!afterN || !afterN.nickname) throw new Error('No nickname payload for update')
      await setUserNickname(request.targetUserId, afterN.nickname)
      return
    }
    case 'delete': {
      await deleteUserNickname(request.targetUserId)
      return
    }
    default:
      return
  }
}

export const addApprovalRequest = async (
  request: Omit<ApprovalRequest, 'id' | 'status' | 'createdAt' | 'updatedAt' | 'reviewedBy'>
) => {
  const approvalsRef = collection(db, APPROVAL_COLLECTION)
  const now = new Date().toISOString()
  const payload = {
    ...request,
    status: 'pending' as const,
    createdAt: now,
    updatedAt: now,
  }
  const cleanPayload = Object.fromEntries(
    Object.entries(payload).filter(([, value]: [string, any]) => value !== undefined)
  )
  const result = await addDoc(approvalsRef, cleanPayload)
  return result
}

export const getApprovalRequests = async (
  status?: ApprovalStatus,
  authorId?: string,
  targetUserId?: string
) => {
  const approvalsRef = collection(db, APPROVAL_COLLECTION)
  let q: ReturnType<typeof query>

  if (status) {
    q = query(approvalsRef, where('status', '==', status))
  } else if (authorId) {
    q = query(approvalsRef, where('authorId', '==', authorId))
  } else if (targetUserId) {
    q = query(approvalsRef, where('targetUserId', '==', targetUserId))
  } else {
    q = query(approvalsRef)
  }

  const snapshot = await getDocs(q)
  let results = snapshot.docs.map(mapApprovalSnapshot)

  // Additional in-memory filters to avoid composite indexes
  if (status) {
    results = results.filter((r: ApprovalRequest) => r.status === status)
  }
  if (authorId) {
    results = results.filter((r: ApprovalRequest) => r.authorId === authorId)
  }
  if (targetUserId) {
    results = results.filter((r: ApprovalRequest) => r.targetUserId === targetUserId)
  }

  // Sort by creation time descending
  results.sort((a: ApprovalRequest, b: ApprovalRequest) => b.createdAt.localeCompare(a.createdAt))

  return results
}

export const updateApprovalRequest = async (id: string, updates: Partial<ApprovalRequest>) => {
  const ref = doc(db, APPROVAL_COLLECTION, id)
  const cleanUpdates = Object.fromEntries(
    Object.entries({
      ...updates,
      updatedAt: new Date().toISOString(),
    }).filter(([, value]: [string, any]) => value !== undefined)
  )
  await updateDoc(ref, cleanUpdates)
}

export const approveApprovalRequest = async (id: string, adminId: string, adminComment?: string) => {
  const ref = doc(db, APPROVAL_COLLECTION, id)
  const snap = await getDoc(ref)
  if (!snap.exists()) return

  const request = mapApprovalSnapshot(snap)
  if (request.status !== 'pending') return

  if (request.entity === 'slot') {
    await applySlotChange(request)
  } else if (request.entity === 'status') {
    await applyStatusChange(request)
  } else if (request.entity === 'earning') {
    await applyEarningChange(request)
  } else if (request.entity === 'referral') {
    await applyReferralChange(request)
  } else if (request.entity === 'login') {
    await applyLoginChange(request)
    // Clear nickname cache and reload new value after approval
    clearNicknameCache(request.targetUserId)
    // Force reload new nickname into cache
    await getUserNicknameAsync(request.targetUserId)
  }

  const approvePayload: Record<string, any> = {
    status: 'approved',
    reviewedBy: adminId,
    updatedAt: new Date().toISOString(),
  }
  const finalComment = adminComment ?? request.adminComment
  if (finalComment !== undefined) {
    approvePayload.adminComment = finalComment
  }
  await updateDoc(ref, approvePayload)
}

export const rejectApprovalRequest = async (id: string, adminId: string, adminComment: string) => {
  const ref = doc(db, APPROVAL_COLLECTION, id)
  const snap = await getDoc(ref)
  if (!snap.exists()) return

  const request = mapApprovalSnapshot(snap)
  if (request.status !== 'pending') return

  await updateDoc(ref, {
    status: 'rejected',
    adminComment,
    reviewedBy: adminId,
    updatedAt: new Date().toISOString(),
  })
}

// Earnings
export const getEarnings = async (userId?: string, startDate?: string, endDate?: string) => {
  const earningsRef = collection(db, 'earnings')
  let q: ReturnType<typeof query>

  // Build query to avoid composite index requirement
  // When userId is provided, we need to get all earnings and filter in memory
  // because we need to check both userId field and participants array
  if (userId) {
    // Get all earnings to check both userId and participants
    q = query(earningsRef)
  } else if (startDate && endDate) {
    // Filter by date range (this doesn't require index for range queries on single field)
    q = query(earningsRef, where('date', '>=', startDate), where('date', '<=', endDate))
  } else {
    // No filters, get all
    q = query(earningsRef)
  }

  const snapshot = await getDocs(q)
  let results = snapshot.docs.map((doc: any) => {
    const data = doc.data() as any
    return {
      id: doc.id,
      userId: data?.userId || '',
      date: data?.date || '',
      amount: data?.amount || 0,
      poolAmount: data?.poolAmount || 0,
      slotId: data?.slotId || '',
      extraWalletsCount: data?.extraWalletsCount || 0,
      extraWalletsAmount: data?.extraWalletsAmount || 0,
      category: data?.category || 'other',
      participants: data?.participants || [],
    } as Earnings
  })

  // Filter by userId in memory (check both userId field and participants array)
  if (userId) {
    results = results.filter((e: Earnings) => {
      const allParticipants = e.participants && e.participants.length > 0
        ? [...e.participants, e.userId]
        : [e.userId]
      return allParticipants.includes(userId)
    })
  }

  // Filter by date range in memory if userId is also provided
  if (userId && startDate && endDate) {
    results = results.filter((e: Earnings) => e.date >= startDate && e.date <= endDate)
  } else if (!userId && startDate && endDate) {
    // Already filtered by query, but ensure consistency
    results = results.filter((e: Earnings) => e.date >= startDate && e.date <= endDate)
  }

  // Sort by date descending in memory to avoid index requirement
  results.sort((a: any, b: any) => b.date.localeCompare(a.date))

  return results
}

export const addEarnings = async (earning: Omit<Earnings, 'id'>) => {
  try {
    const earningsRef = collection(db, 'earnings')
    // Remove undefined values before saving
    const cleanEarning = Object.fromEntries(
      Object.entries(earning).filter(([_, value]: [string, any]) => value !== undefined)
    )
    console.log('Adding earnings:', cleanEarning)
    const result = await addDoc(earningsRef, cleanEarning)
    console.log('Earnings added successfully:', result.id)

    return result
  } catch (error) {
    console.error('Error in addEarnings:', error)
    throw error
  }
}

export const updateEarnings = async (id: string, updates: Partial<Earnings>) => {
  const earningRef = doc(db, 'earnings', id)

  // Remove undefined values before updating
  const cleanUpdates = Object.fromEntries(
    Object.entries(updates).filter(([_, value]: [string, any]) => value !== undefined)
  )
  await updateDoc(earningRef, cleanUpdates)
}

export const deleteEarnings = async (id: string) => {
  const earningRef = doc(db, 'earnings', id)
  await deleteDoc(earningRef)
}

// Rating
export const getRatingData = async (userId?: string) => {
  const ratingRef = collection(db, 'ratings')
  let q = query(ratingRef)

  if (userId) {
    q = query(q, where('userId', '==', userId))
  }

  const snapshot = await getDocs(q)
  return snapshot.docs.map((doc: any) => {
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
      absenceDays: data.absenceDays || 0,
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
    const weeklyMessages = snapshot.docs.filter((doc: any) => {
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
      Object.entries(referral).filter(([_, value]: [string, any]) => value !== undefined)
    )
    console.log('Adding referral:', cleanReferral)
    const result = await addDoc(referralsRef, cleanReferral)
    console.log('Referral added successfully:', result.id)

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
  let referrals = snapshot.docs.map((docSnap: any) => {
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
    referrals = referrals.filter((referral: Referral) => referral.createdAt >= startDate && referral.createdAt <= endDate)
  }

  return referrals.sort((a: Referral, b: Referral) => (a.createdAt < b.createdAt ? 1 : -1))
}

export const updateReferral = async (id: string, updates: Partial<Referral>) => {
  const referralRef = doc(db, 'referrals', id)

  const cleanUpdates = Object.fromEntries(
    Object.entries(updates).filter(([_, value]: [string, any]) => value !== undefined)
  )
  await updateDoc(referralRef, cleanUpdates)
}

export const deleteReferral = async (id: string) => {
  const referralRef = doc(db, 'referrals', id)
  await deleteDoc(referralRef)
}

// Call (Trading Signal) functions
export const addCall = async (callData: Omit<Call, 'id'>): Promise<string> => {
  console.log('📝 Service site: Creating call:', {
    category: callData.category,
    userId: callData.userId,
    status: callData.status,
    createdAt: callData.createdAt
  })

  if (!db) {
    console.error('❌ Service site: Firestore db is not initialized')
    throw new Error('Firestore database is not initialized')
  }

  const callsRef = collection(db, 'calls')
  const docRef = await addDoc(callsRef, callData)

  console.log('✅ Service site: Call created successfully with ID:', docRef.id)
  console.log('📊 Service site: Call data saved to Firestore:', callData)

  return docRef.id
}

export const getCalls = async (filters?: {
  userId?: string
  category?: string
  riskLevel?: string
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

  if (filters?.category) {
    constraints.push(where('category', '==', filters.category))
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
  let calls = snapshot.docs.map((doc: any) => {
    const data = doc.data() as any
    const category = (data.category as Call['category']) || 'memecoins'

    // Legacy compatibility: map flat fields into memecoin structure if details are absent
    const legacyMemecoin = (!data.details && data.ticker) ? {
      memecoins: {
        coinName: data.pair || data.ticker,
        ticker: data.ticker || '',
        network: data.network || 'solana',
        contract: data.contract,
        signalType: (data.sentiment || 'buy') as Call['sentiment'],
        reason: data.comment || data.risks || '',
        entryCap: data.entryPoint || '',
        targets: data.target || '',
        stopLoss: data.cancelConditions,
        riskLevel: data.riskLevel || 'medium',
        risks: data.risks || '',
        holdPlan: 'short',
        liquidityLocked: false,
        traderComment: data.comment,
      }
    } : {}

    const details = (data.details as Call['details']) || legacyMemecoin || {}
    const riskLevel =
      (data.riskLevel as Call['riskLevel']) ||
      details.memecoins?.riskLevel ||
      details.polymarket?.riskLevel ||
      details.staking?.protocolRisk ||
      details.spot?.riskLevel ||
      details.futures?.riskLevel

    const sentiment =
      (data.sentiment as Call['sentiment']) ||
      (details.futures?.direction === 'long' ? 'buy' : details.futures?.direction === 'short' ? 'sell' : undefined)

    return {
      id: doc.id,
      userId: data.userId || '',
      category,
      details,
      sentiment,
      riskLevel,
      comment: data.comment,
      createdAt: data.createdAt || new Date().toISOString(),
      status: data.status || 'active',
      maxProfit: data.maxProfit,
      currentPnL: data.currentPnL,
      currentMarketCap: data.currentMarketCap,
      signalMarketCap: data.signalMarketCap,
      currentPrice: data.currentPrice,
      entryPrice: data.entryPrice,
      tags: data.tags || [],
    } as Call
  })

  // Apply additional filters in memory
  if (filters?.category) {
    calls = calls.filter((c: Call) => c.category === filters.category)
  }
  if (filters?.riskLevel) {
    calls = calls.filter((c: Call) => c.riskLevel === filters.riskLevel)
  }

  // Filter by active (24 hours) if needed
  if (filters?.activeOnly && !filters.status) {
    const yesterday = new Date()
    yesterday.setHours(yesterday.getHours() - 24)
    calls = calls.filter((c: Call) => {
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
  assignedTo?: string | string[]
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
  const normalizePriority = (value: any): TaskPriority => {
    return value === 'high' || value === 'low' || value === 'urgent' ? value : 'medium'
  }

  const normalizeStatus = (value: any): TaskStatus => {
    return value === 'completed' || value === 'closed' ? value : 'in_progress'
  }

  const normalizeStageAssignees = (assignees: any[] = []): StageAssignee[] =>
    assignees
      .filter((a: any) => a?.userId)
      .slice(0, 10)
      .map((a) => ({
        userId: a.userId,
        priority: normalizePriority(a.priority),
        comment: a.comment,
        instruction: a.instruction,
      }))

  let tasks = snapshot.docs.map((doc: any) => {
    const data = doc.data() as any
    const rawAssignees = Array.isArray(data.assignees)
      ? data.assignees
      : (data.assignedTo || []).map((userId: string) => ({ userId, priority: 'medium' }))
    const normalizedAssignees = (rawAssignees || [])
      .map((assignee: any) => ({
        userId: assignee.userId || '',
        priority: normalizePriority(assignee.priority),
        comment: assignee.comment,
      }))
      .filter((assignee: any) => !!assignee.userId)
    const assignedIds = normalizedAssignees.map((assignee: any) => assignee.userId)
    const coExecutors: string[] = Array.isArray(data.coExecutors)
      ? data.coExecutors
      : Array.isArray(data.executors)
        ? data.executors
        : []
    const normalizedStages = (data.stages || []).map((stage: any) => ({
      id: stage.id || `stage - ${Date.now()} `,
      name: stage.name || 'Этап',
      description: stage.description,
      responsible: stage.responsible === 'all' ? 'all' : Array.isArray(stage.responsible) ? stage.responsible : (stage.assignees || []).map((a: any) => a.userId),
      assignees: normalizeStageAssignees(stage.assignees),
      stagePriority: normalizePriority(stage.stagePriority),
      requiresApproval: stage.requiresApproval ?? true,
      approvals: stage.approvals || [],
      comments: stage.comments || [],
      status: stage.status || 'pending',
    }))
    return {
      id: doc.id,
      title: data.title || '',
      description: data.description,
      category: data.category || 'trading',
      status: normalizeStatus(data.status),
      createdBy: data.createdBy || '',
      assignedTo: assignedIds,
      assignees: normalizedAssignees,
      approvals: data.approvals || [],
      createdAt: data.createdAt || new Date().toISOString(),
      updatedAt: data.updatedAt || new Date().toISOString(),
      completedAt: data.completedAt,
      closedAt: data.closedAt,
      completedBy: data.completedBy,
      priority: normalizePriority(data.priority),
      dueDate: data.dueDate || new Date().toISOString().split('T')[0],
      dueTime: data.dueTime || '12:00',
      startTime: data.startTime,
      mainExecutor: data.mainExecutor,
      leadExecutor: data.leadExecutor,
      deputies: data.deputies || [],
      coExecutors,
      executors: data.executors || [],
      curators: data.curators || [],
      leads: data.leads || [],
      stages: normalizedStages,
      currentStageId: data.currentStageId,
      awaitingStageId: data.awaitingStageId,
      comments: data.comments || [],
      expectedResult: data.expectedResult,
      requiresApproval: data.requiresApproval ?? true,
    } as Task
  })

  // Auto-delete tasks that have been closed for more than 12 hours
  const now = new Date()
  const twelveHoursAgo = new Date(now.getTime() - 12 * 60 * 60 * 1000)

  const tasksToDelete = tasks.filter((task: Task) => {
    if (task.status === 'closed' && task.closedAt) {
      const closedDate = new Date(task.closedAt)
      return closedDate < twelveHoursAgo
    }
    return false
  })

  // Delete old closed tasks
  if (tasksToDelete.length > 0) {
    await Promise.all(tasksToDelete.map((task: Task) => deleteTask(task.id)))
    // Remove deleted tasks from the list
    tasks = tasks.filter((task: Task) => !tasksToDelete.find((t: any) => t.id === task.id))
  }

  // Apply assignedTo filter in memory (array-contains doesn't work well with multiple users)
  if (filters?.assignedTo) {
    if (Array.isArray(filters.assignedTo)) {
      const selected = filters.assignedTo
      if (selected.length > 0) {
        tasks = tasks.filter((t: Task) => selected.some((userId) => t.assignedTo.includes(userId)))
      }
    } else {
      tasks = tasks.filter((t: Task) => t.assignedTo.includes(filters.assignedTo as string))
    }
  }

  return tasks
}

export const updateTask = async (id: string, updates: Partial<Task>): Promise<void> => {
  const taskRef = doc(db, 'tasks', id)
  // Remove undefined fields to avoid Firestore errors
  const cleanUpdates = Object.fromEntries(
    Object.entries({
      ...updates,
      updatedAt: new Date().toISOString(),
    }).filter(([_, value]: [string, any]) => value !== undefined)
  )
  await updateDoc(taskRef, cleanUpdates as any)
}

export const deleteTask = async (id: string): Promise<void> => {
  const taskRef = doc(db, 'tasks', id)
  await deleteDoc(taskRef)
}

// Notes (user + admin visibility)
export const getUserNotes = async (userId?: string, includeAllForAdmin: boolean = false): Promise<Note[]> => {
  const notesRef = collection(db, 'notes')
  let q: ReturnType<typeof query>

  if (!includeAllForAdmin && userId) {
    q = query(notesRef, where('userId', '==', userId))
  } else {
    q = query(notesRef)
  }

  const snapshot = await getDocs(q)
  const notes = snapshot.docs.map((docSnap: any) => {
    const data = docSnap.data() as any
    return {
      id: docSnap.id,
      userId: data.userId || '',
      title: data.title || '',
      text: data.text || '',
      priority: data.priority === 'low' || data.priority === 'high' ? data.priority : 'medium',
      createdAt: data.createdAt || new Date().toISOString(),
      updatedAt: data.updatedAt || new Date().toISOString(),
    } as Note
  })

  notes.sort((a: Note, b: Note) => (b.updatedAt || '').localeCompare(a.updatedAt || ''))
  if (userId && !includeAllForAdmin) {
    return notes.filter((n: Note) => n.userId === userId)
  }
  return notes
}

export const addNote = async (note: Omit<Note, 'id' | 'createdAt' | 'updatedAt'>): Promise<string> => {
  const notesRef = collection(db, 'notes')
  const payload = {
    ...note,
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString(),
  }
  const res = await addDoc(notesRef, payload)
  return res.id
}

export const updateNote = async (id: string, updates: Partial<Omit<Note, 'id' | 'userId'>>): Promise<void> => {
  const noteRef = doc(db, 'notes', id)
  const cleanUpdates = Object.fromEntries(
    Object.entries({
      ...updates,
      updatedAt: new Date().toISOString(),
    }).filter(([_, value]: [string, any]) => value !== undefined)
  )
  await updateDoc(noteRef, cleanUpdates as any)
}

export const deleteNote = async (id: string): Promise<void> => {
  const noteRef = doc(db, 'notes', id)
  await deleteDoc(noteRef)
}

// User Activity tracking
export const getUserActivities = async (userId?: string): Promise<UserActivity[]> => {
  const activitiesRef = collection(db, 'userActivities')
  let q: ReturnType<typeof query>

  if (userId) {
    q = query(activitiesRef, where('userId', '==', userId), orderBy('loginAt', 'desc'))
  } else {
    q = query(activitiesRef, orderBy('loginAt', 'desc'))
  }

  const snapshot = await getDocs(q)
  return snapshot.docs.map((docSnap: any) => {
    const data = docSnap.data() as any
    return {
      id: docSnap.id,
      userId: data.userId || '',
      loginAt: data.loginAt || new Date().toISOString(),
      logoutAt: data.logoutAt || undefined,
      browser: data.browser || 'Unknown',
      userAgent: data.userAgent || '',
      sessionDuration: data.sessionDuration || undefined,
      isActive: data.isActive !== false,
      pageViews: data.pageViews || [],
    } as UserActivity
  })
}

export const getLatestUserActivities = async (): Promise<UserActivity[]> => {
  const activitiesRef = collection(db, 'userActivities')
  // Get all activities, then group by userId and get latest for each
  const q = query(activitiesRef, orderBy('loginAt', 'desc'))
  const snapshot = await getDocs(q)

  const allActivities = snapshot.docs.map((docSnap: any) => {
    const data = docSnap.data() as any
    return {
      id: docSnap.id,
      userId: data.userId || '',
      loginAt: data.loginAt || new Date().toISOString(),
      logoutAt: data.logoutAt || undefined,
      browser: data.browser || 'Unknown',
      userAgent: data.userAgent || '',
      sessionDuration: data.sessionDuration || undefined,
      isActive: data.isActive !== false,
      pageViews: data.pageViews || [],
    } as UserActivity
  })

  // Group by userId and get latest activity for each user
  const latestByUser = new Map<string, UserActivity>()
  for (const activity of allActivities) {
    const existing = latestByUser.get(activity.userId)
    if (!existing || new Date(activity.loginAt) > new Date(existing.loginAt)) {
      latestByUser.set(activity.userId, activity)
    }
  }

  return Array.from(latestByUser.values())
}

export const addUserActivity = async (activity: Omit<UserActivity, 'id'>): Promise<string> => {
  const activitiesRef = collection(db, 'userActivities')
  const res = await addDoc(activitiesRef, activity)
  return res.id
}

export const updateUserActivity = async (id: string, updates: Partial<Omit<UserActivity, 'id' | 'userId'>>): Promise<void> => {
  const activityRef = doc(db, 'userActivities', id)
  const cleanUpdates = Object.fromEntries(
    Object.entries(updates).filter(([_, value]: [string, any]) => value !== undefined)
  )
  await updateDoc(activityRef, cleanUpdates as any)
}

export const markActivityAsInactive = async (id: string, logoutAt: string, sessionDuration: number): Promise<void> => {
  await updateUserActivity(id, {
    logoutAt,
    sessionDuration,
    isActive: false,
  })
}

// User Nickname management
export const getUserNickname = async (userId: string): Promise<UserNickname | null> => {
  const nicknamesRef = collection(db, 'userNicknames')
  const q = query(nicknamesRef, where('userId', '==', userId))
  const snapshot = await getDocs(q)

  if (snapshot.empty) return null

  const data = snapshot.docs[0].data() as any
  return {
    id: snapshot.docs[0].id,
    userId: data.userId || '',
    nickname: data.nickname || '',
    createdAt: data.createdAt || new Date().toISOString(),
    updatedAt: data.updatedAt || new Date().toISOString(),
  }
}

export const getUserNicknameValue = async (userId: string): Promise<string | null> => {
  const userNickname = await getUserNickname(userId)
  return userNickname?.nickname || null
}

export const setUserNickname = async (userId: string, nickname: string): Promise<string> => {
  const nicknamesRef = collection(db, 'userNicknames')
  const existing = await getUserNickname(userId)
  const now = new Date().toISOString()

  if (existing) {
    const ref = doc(db, 'userNicknames', existing.id)
    await updateDoc(ref, {
      nickname,
      updatedAt: now,
    })
    return existing.id
  } else {
    const res = await addDoc(nicknamesRef, {
      userId,
      nickname,
      createdAt: now,
      updatedAt: now,
    })
    return res.id
  }
}

export const deleteUserNickname = async (userId: string): Promise<void> => {
  const existing = await getUserNickname(userId)
  if (existing) {
    await deleteDoc(doc(db, 'userNicknames', existing.id))
  }
}

export const getUserActivitiesLast24Hours = async (): Promise<UserActivity[]> => {
  const activitiesRef = collection(db, 'userActivities')
  const now = new Date()
  const last24Hours = new Date(now.getTime() - 24 * 60 * 60 * 1000)

  // Get all activities from last 24 hours
  const q = query(activitiesRef, orderBy('loginAt', 'desc'))
  const snapshot = await getDocs(q)

  const allActivities = snapshot.docs.map((docSnap: any) => {
    const data = docSnap.data() as any
    return {
      id: docSnap.id,
      userId: data.userId || '',
      loginAt: data.loginAt || new Date().toISOString(),
      logoutAt: data.logoutAt || undefined,
      browser: data.browser || 'Unknown',
      userAgent: data.userAgent || '',
      sessionDuration: data.sessionDuration || undefined,
      isActive: data.isActive !== false,
      pageViews: data.pageViews || [],
    } as UserActivity
  })

  // Filter activities from last 24 hours
  return allActivities.filter((activity: UserActivity) => {
    const loginTime = new Date(activity.loginAt)
    return loginTime >= last24Hours
  })
}

// User Conflicts
export const getUserConflicts = async (userId?: string, isActive?: boolean): Promise<UserConflict[]> => {
  const conflictsRef = collection(db, 'userConflicts')
  let q: ReturnType<typeof query>

  if (userId && isActive !== undefined) {
    q = query(conflictsRef, where('isActive', '==', isActive), where('userId', '==', userId))
  } else if (userId) {
    q = query(conflictsRef, where('userId', '==', userId))
  } else if (isActive !== undefined) {
    q = query(conflictsRef, where('isActive', '==', isActive))
  } else {
    q = query(conflictsRef)
  }

  const snapshot: any = await getDocs(q)
  return snapshot.docs.map((doc: any) => {
    const data = doc.data() as any
    return {
      id: doc.id,
      userId: data?.userId || '',
      restrictedUserId: data?.restrictedUserId || '',
      reason: data?.reason || '',
      createdBy: data?.createdBy || '',
      createdAt: data?.createdAt || '',
      isActive: data?.isActive ?? true
    } as UserConflict
  })
}

export const addUserConflict = async (conflict: Omit<UserConflict, 'id'>) => {
  const conflictsRef = collection(db, 'userConflicts')
  const result = await addDoc(conflictsRef, conflict)
  return result
}

export const updateUserConflict = async (id: string, updates: Partial<UserConflict>) => {
  const conflictRef = doc(db, 'userConflicts', id)
  await updateDoc(conflictRef, updates)
}

export const deleteUserConflict = async (id: string) => {
  const conflictRef = doc(db, 'userConflicts', id)
  await deleteDoc(conflictRef)
}

// Access Blocks
export const getAccessBlocks = async (userId?: string, isActive?: boolean): Promise<AccessBlock[]> => {
  const blocksRef = collection(db, 'accessBlocks')
  let q: ReturnType<typeof query>

  // First get all active blocks, then filter in memory for null userId
  // This is because Firestore doesn't support filtering by null values easily
  if (isActive !== undefined) {
    q = query(blocksRef, where('isActive', '==', isActive))
  } else {
    q = query(blocksRef)
  }

  const snapshot: any = await getDocs(q)
  let results = snapshot.docs.map((doc: any) => {
    const data = doc.data() as any
    return {
      id: doc.id,
      userId: data?.userId,
      reason: data?.reason || '',
      createdBy: data?.createdBy || '',
      createdAt: data?.createdAt || '',
      expiresAt: data?.expiresAt,
      isActive: data?.isActive ?? true,
      blockFeatures: data?.blockFeatures || []
    } as AccessBlock
  })

  // Filter in memory based on userId
  // Handle both null/undefined and empty string as "no user" (general block)
  // Also handle old records where userId field doesn't exist at all
  if (userId !== undefined && userId !== null) {
    // Return only blocks for this specific user
    results = results.filter((block: AccessBlock) => block.userId === userId)
  } else {
    // Return only general blocks (no userId, null, undefined, or empty string)
    results = results.filter((block: AccessBlock) => !block.userId)
  }

  return results
}

// Get ALL access blocks (for admin panel - shows both general and user-specific)
export const getAllAccessBlocks = async (isActive?: boolean): Promise<AccessBlock[]> => {
  const blocksRef = collection(db, 'accessBlocks')
  let q: ReturnType<typeof query>

  if (isActive !== undefined) {
    q = query(blocksRef, where('isActive', '==', isActive))
  } else {
    q = query(blocksRef)
  }

  const snapshot: any = await getDocs(q)
  return snapshot.docs.map((doc: any) => {
    const data = doc.data() as any
    return {
      id: doc.id,
      userId: data?.userId,
      reason: data?.reason || '',
      createdBy: data?.createdBy || '',
      createdAt: data?.createdAt || '',
      expiresAt: data?.expiresAt,
      isActive: data?.isActive ?? true,
      blockFeatures: data?.blockFeatures || []
    } as AccessBlock
  })
}

export const addAccessBlock = async (block: Omit<AccessBlock, 'id'>) => {
  const blocksRef = collection(db, 'accessBlocks')
  const result = await addDoc(blocksRef, block)
  return result
}

export const updateAccessBlock = async (id: string, updates: Partial<AccessBlock>) => {
  const blockRef = doc(db, 'accessBlocks', id)
  await updateDoc(blockRef, updates)
}

export const deleteAccessBlock = async (id: string) => {
  const blockRef = doc(db, 'accessBlocks', id)
  await deleteDoc(blockRef)
}

// Check if user has access to a specific feature
export const checkUserAccess = async (userId: string, feature: string): Promise<{ hasAccess: boolean; reason?: string; expiresAt?: string }> => {
  try {
    // Check for general blocks (userId is null)
    const generalBlocks = await getAccessBlocks(undefined, true)
    for (const block of generalBlocks) {
      // Check if block is expired
      if (block.expiresAt && new Date(block.expiresAt) < new Date()) {
        // Block is expired, mark as inactive
        await updateAccessBlock(block.id, { isActive: false })
        continue
      }

      // Check for 'all' feature - blocks entire site
      if (block.blockFeatures.includes('all' as any)) {
        return { hasAccess: false, reason: block.reason, expiresAt: block.expiresAt }
      }

      // Check for specific feature
      if (block.blockFeatures.includes(feature as any)) {
        return { hasAccess: false, reason: block.reason, expiresAt: block.expiresAt }
      }

      // Check for 'tools' - blocks entire Tools section (should hide from menu)
      if (feature === 'tools' && block.blockFeatures.includes('tools' as any)) {
        return { hasAccess: false, reason: block.reason, expiresAt: block.expiresAt }
      }

      // Check for 'call' feature
      if (feature === 'call' && block.blockFeatures.includes('call' as any)) {
        return { hasAccess: false, reason: block.reason, expiresAt: block.expiresAt }
      }

      // Check for 'avf_hub' feature
      if (feature === 'avf_hub' && block.blockFeatures.includes('avf_hub' as any)) {
        return { hasAccess: false, reason: block.reason, expiresAt: block.expiresAt }
      }

      // Check for 'about' feature
      if (feature === 'about' && block.blockFeatures.includes('about' as any)) {
        return { hasAccess: false, reason: block.reason, expiresAt: block.expiresAt }
      }

      // Check for tool sub-features
      const toolSubFeatures = ['tools_meme_evaluation', 'tools_ai_ao_alerts', 'tools_signals_trigger_bot']
      if (toolSubFeatures.includes(feature) && block.blockFeatures.includes('tools' as any)) {
        // If tools section is blocked, all sub-features are blocked too
        return { hasAccess: false, reason: block.reason, expiresAt: block.expiresAt }
      }
      if (toolSubFeatures.includes(feature) && block.blockFeatures.includes(feature as any)) {
        return { hasAccess: false, reason: block.reason, expiresAt: block.expiresAt }
      }
    }

    // Check for user-specific blocks
    const userBlocks = await getAccessBlocks(userId, true)
    for (const block of userBlocks) {
      // Check if block is expired
      if (block.expiresAt && new Date(block.expiresAt) < new Date()) {
        // Block is expired, mark as inactive
        await updateAccessBlock(block.id, { isActive: false })
        continue
      }

      // Check for 'all' feature - blocks entire site
      if (block.blockFeatures.includes('all' as any)) {
        return { hasAccess: false, reason: block.reason, expiresAt: block.expiresAt }
      }

      // Check for specific feature
      if (block.blockFeatures.includes(feature as any)) {
        return { hasAccess: false, reason: block.reason, expiresAt: block.expiresAt }
      }

      // Check for 'tools' - blocks entire Tools section
      if (feature === 'tools' && block.blockFeatures.includes('tools' as any)) {
        return { hasAccess: false, reason: block.reason, expiresAt: block.expiresAt }
      }

      // Check for 'call' feature
      if (feature === 'call' && block.blockFeatures.includes('call' as any)) {
        return { hasAccess: false, reason: block.reason, expiresAt: block.expiresAt }
      }

      // Check for 'avf_hub' feature
      if (feature === 'avf_hub' && block.blockFeatures.includes('avf_hub' as any)) {
        return { hasAccess: false, reason: block.reason, expiresAt: block.expiresAt }
      }

      // Check for 'about' feature
      if (feature === 'about' && block.blockFeatures.includes('about' as any)) {
        return { hasAccess: false, reason: block.reason, expiresAt: block.expiresAt }
      }

      // Check for tool sub-features
      const toolSubFeatures = ['tools_meme_evaluation', 'tools_ai_ao_alerts', 'tools_signals_trigger_bot']
      if (toolSubFeatures.includes(feature) && block.blockFeatures.includes('tools' as any)) {
        return { hasAccess: false, reason: block.reason, expiresAt: block.expiresAt }
      }
      if (toolSubFeatures.includes(feature) && block.blockFeatures.includes(feature as any)) {
        return { hasAccess: false, reason: block.reason, expiresAt: block.expiresAt }
      }
    }

    return { hasAccess: true, reason: undefined, expiresAt: undefined }
  } catch (error) {
    console.error('Error checking user access:', error)
    return { hasAccess: true, reason: undefined, expiresAt: undefined } // Default to allow access on error
  }
}


// AI - AO Alerts
export const getAiAlerts = async (): Promise<AiAlert[]> => {
  const alertsRef = collection(db, 'aiAlerts')
  const q = query(alertsRef, orderBy('createdAt', 'desc'))
  const querySnapshot: any = await getDocs(q) // Corrected from usersRef to q
  return querySnapshot.docs.map((docSnap: any) => ({
    id: docSnap.id,
    ...docSnap.data(),
  } as AiAlert)) // Corrected type to AiAlert
}

export const getUserById = async (userId: string): Promise<User | null> => {
  const userRef = doc(db, 'users', userId)
  const docSnap: DocumentSnapshot<DocumentData> = await getDoc(userRef)
  if (docSnap.exists()) {
    return { id: docSnap.id, ...docSnap.data() } as User
  }
  return null
}

export const addAiAlert = async (alert: Omit<AiAlert, 'id'>) => {
  const alertsRef = collection(db, 'aiAlerts')
  const cleanAlert = Object.fromEntries(
    Object.entries(alert).filter(([_, value]: [string, any]) => value !== undefined)
  )
  const result = await addDoc(alertsRef, cleanAlert)
  return result
}

export const updateAiAlert = async (id: string, updates: Partial<AiAlert>) => {
  const alertRef = doc(db, 'aiAlerts', id)
  const cleanUpdates = Object.fromEntries(
    Object.entries(updates).filter(([_, value]: [string, any]) => value !== undefined)
  )
  await updateDoc(alertRef, cleanUpdates)
}

export const deleteAiAlert = async (id: string) => {
  const alertRef = doc(db, 'aiAlerts', id)
  await deleteDoc(alertRef)
}

// Signals Trigger Bot (independent collection)
export const getTriggerAlerts = async (): Promise<TriggerAlert[]> => {
  const alertsRef = collection(db, 'triggerAlerts')
  const q = query(alertsRef, orderBy('createdAt', 'desc'))
  const querySnapshot = await getDocs(q)
  return querySnapshot.docs.map((docSnap) => ({
    id: docSnap.id,
    ...docSnap.data(),
  } as TriggerAlert))
}

export const addTriggerAlert = async (alert: Omit<TriggerAlert, 'id'>) => {
  const alertsRef = collection(db, 'triggerAlerts')
  const cleanAlert = Object.fromEntries(
    Object.entries(alert).filter(([_, value]: [string, any]) => value !== undefined)
  )
  const result = await addDoc(alertsRef, cleanAlert)
  return result
}

export const updateTriggerAlert = async (id: string, updates: Partial<TriggerAlert>) => {
  const alertRef = doc(db, 'triggerAlerts', id)
  const cleanUpdates = Object.fromEntries(
    Object.entries(updates).filter(([_, value]: [string, any]) => value !== undefined)
  )
  await updateDoc(alertRef, cleanUpdates)
}

export const deleteTriggerAlert = async (id: string) => {
  const alertRef = doc(db, 'triggerAlerts', id)
  await deleteDoc(alertRef)
}

// Fasol Signals Strategy (independent collection)
export const getFasolTriggerAlerts = async (): Promise<FasolTriggerAlert[]> => {
  const alertsRef = collection(db, 'fasolTriggerAlerts')
  const q = query(alertsRef, orderBy('createdAt', 'desc'))
  const querySnapshot = await getDocs(q)
  return querySnapshot.docs.map((docSnap) => ({
    id: docSnap.id,
    ...docSnap.data(),
  } as FasolTriggerAlert))
}

export const addFasolTriggerAlert = async (alert: Omit<FasolTriggerAlert, 'id'>) => {
  const alertsRef = collection(db, 'fasolTriggerAlerts')
  const cleanAlert = Object.fromEntries(
    Object.entries(alert).filter(([_, value]: [string, any]) => value !== undefined)
  )
  const result = await addDoc(alertsRef, cleanAlert)
  return result
}

export const updateFasolTriggerAlert = async (id: string, updates: Partial<FasolTriggerAlert>) => {
  const alertRef = doc(db, 'fasolTriggerAlerts', id)
  const cleanUpdates = Object.fromEntries(
    Object.entries(updates).filter(([_, value]: [string, any]) => value !== undefined)
  )
  await updateDoc(alertRef, cleanUpdates)
}

export const deleteFasolTriggerAlert = async (id: string) => {
  const alertRef = doc(db, 'fasolTriggerAlerts', id)
  await deleteDoc(alertRef)
}
