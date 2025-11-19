// Date utility functions
import { format, addDays, startOfWeek, endOfWeek, eachDayOfInterval, parseISO, isSameDay, isBefore, isAfter } from 'date-fns'
import { ru } from 'date-fns/locale'

export const formatDate = (date: Date | string, formatStr: string = 'dd.MM.yyyy'): string => {
  const dateObj = typeof date === 'string' ? parseISO(date) : date
  return format(dateObj, formatStr, { locale: ru })
}

export const getWeekRange = (date: Date = new Date()) => {
  const start = startOfWeek(date, { weekStartsOn: 1 }) // Monday
  const end = endOfWeek(date, { weekStartsOn: 1 })
  return { start, end }
}

export const getWeekDays = (date: Date = new Date()): Date[] => {
  const { start, end } = getWeekRange(date)
  return eachDayOfInterval({ start, end })
}

export const getLastNDaysRange = (days: number) => {
  const now = new Date()
  const start = new Date(now)
  start.setHours(0, 0, 0, 0)
  start.setDate(start.getDate() - (days - 1))
  const end = new Date(now)
  end.setHours(23, 59, 59, 999)
  return { start, end }
}

export const isSameDate = (date1: Date | string, date2: Date | string): boolean => {
  const d1 = typeof date1 === 'string' ? parseISO(date1) : date1
  const d2 = typeof date2 === 'string' ? parseISO(date2) : date2
  return isSameDay(d1, d2)
}

export const canSetSickLeave = (date: Date | string): boolean => {
  const today = new Date()
  const targetDate = typeof date === 'string' ? parseISO(date) : date
  const maxDate = addDays(today, 2)
  return !isAfter(targetDate, maxDate) && !isBefore(targetDate, today)
}

export const calculateHours = (slots: { start: string; end: string; breaks?: { start: string; end: string }[] }[]): number => {
  return slots.reduce((total, slot) => {
    const [startHour, startMin] = slot.start.split(':').map(Number)
    const [endHour, endMin] = slot.end.split(':').map(Number)
    const startMinutes = startHour * 60 + startMin
    const endMinutes = endHour * 60 + endMin
    let diff = (endMinutes - startMinutes) / 60
    
    // Subtract all breaks time if exists
    if (slot.breaks && slot.breaks.length > 0) {
      const totalBreakTime = slot.breaks.reduce((breakTotal, breakTime) => {
        const [breakStartHour, breakStartMin] = breakTime.start.split(':').map(Number)
        const [breakEndHour, breakEndMin] = breakTime.end.split(':').map(Number)
        const breakStartMinutes = breakStartHour * 60 + breakStartMin
        const breakEndMinutes = breakEndHour * 60 + breakEndMin
        const breakDiff = (breakEndMinutes - breakStartMinutes) / 60
        return breakTotal + breakDiff
      }, 0)
      diff -= totalBreakTime
    }
    
    return total + diff
  }, 0)
}

export const parseTime = (time: string): number => {
  const [hours, minutes] = time.split(':').map(Number)
  return hours * 60 + minutes
}

export const formatTimeFromMinutes = (minutes: number): string => {
  const hours = Math.floor(minutes / 60)
  const mins = minutes % 60
  return `${hours.toString().padStart(2, '0')}:${mins.toString().padStart(2, '0')}`
}

export const timeOverlaps = (
  slot1: { start: string; end: string },
  slot2: { start: string; end: string }
): boolean => {
  const s1 = parseTime(slot1.start)
  const e1 = parseTime(slot1.end)
  const s2 = parseTime(slot2.start)
  const e2 = parseTime(slot2.end)
  return (s1 < e2 && e1 > s2)
}

// Check minimum 20 minute gap between slots on the same date
// Breaks within a slot don't count - only the actual end time matters
export const checkMinimumGap = (
  newSlot: { start: string; end: string; breaks?: { start: string; end: string }[] },
  existingSlots: { slots: { start: string; end: string; breaks?: { start: string; end: string }[] }[] }[],
  minimumGapMinutes: number = 20
): { valid: boolean; error?: string } => {
  // Find the latest end time among all existing slots on this date
  let latestEndMinutes = -1
  
  for (const existingSlot of existingSlots) {
    for (const timeSlot of existingSlot.slots) {
      // Breaks don't affect the end time - we only care about the slot's actual end time
      const endMinutes = parseTime(timeSlot.end)
      if (endMinutes > latestEndMinutes) {
        latestEndMinutes = endMinutes
      }
    }
  }
  
  // If no existing slots, no gap check needed
  if (latestEndMinutes === -1) {
    return { valid: true }
  }
  
  const newSlotStartMinutes = parseTime(newSlot.start)
  const earliestAllowedStart = latestEndMinutes + minimumGapMinutes
  
  if (newSlotStartMinutes < earliestAllowedStart) {
    const latestEndTime = formatTimeFromMinutes(latestEndMinutes)
    const earliestAllowedTime = formatTimeFromMinutes(earliestAllowedStart)
    return {
      valid: false,
      error: `Новый слот не может начаться раньше ${earliestAllowedTime}. Последний слот на эту дату заканчивается в ${latestEndTime}. Минимальный интервал между слотами - 20 минут.`
    }
  }
  
  return { valid: true }
}

export const getMoscowTime = (): Date => {
  const now = new Date()
  const moscowOffset = 3 * 60 // UTC+3
  const localOffset = now.getTimezoneOffset()
  const moscowTime = new Date(now.getTime() + (moscowOffset + localOffset) * 60 * 1000)
  return moscowTime
}

export const canAddEarnings = (slotEndTime: string, currentTime: Date = getMoscowTime()): boolean => {
  const currentHour = currentTime.getHours()
  const slotEndDate = new Date(`${format(currentTime, 'yyyy-MM-dd')}T${slotEndTime}:00`)
  return currentHour >= 21 || currentTime > slotEndDate
}

export const formatHours = (totalHours: number): string => {
  const hours = Math.floor(totalHours)
  const minutes = Math.round((totalHours - hours) * 60)

  if (hours === 0 && minutes === 0) {
    return '0ч'
  }

  if (hours === 0) {
    return `${minutes}м`
  }

  if (minutes === 0) {
    return `${hours}ч`
  }

  return `${hours}ч ${minutes}м`
}

// Calculate number of days in a date range that fall within a period
export const countDaysInPeriod = (
  statusDate: string,
  statusEndDate: string | undefined,
  periodStart: string,
  periodEnd: string
): number => {
  const start = statusDate
  const end = statusEndDate || statusDate
  
  // If status range doesn't overlap with period, return 0
  if (end < periodStart || start > periodEnd) {
    return 0
  }
  
  // Find the overlap
  const overlapStart = start > periodStart ? start : periodStart
  const overlapEnd = end < periodEnd ? end : periodEnd
  
  // Calculate days in overlap (inclusive)
  const startDate = parseISO(overlapStart)
  const endDate = parseISO(overlapEnd)
  const diffTime = endDate.getTime() - startDate.getTime()
  const diffDays = Math.floor(diffTime / (1000 * 60 * 60 * 24)) + 1
  
  return diffDays
}

