import { useEffect, useMemo, useState } from 'react'

type DeadlineStatus = 'overdue' | 'urgent' | 'soon' | 'on_track' | 'unknown'

interface DeadlineInfo {
  label: string
  status: DeadlineStatus
  isOverdue: boolean
}

const MINUTE = 60 * 1000
const HOUR = 60 * MINUTE
const DAY = 24 * HOUR

const buildLabel = (diffMs: number): string => {
  if (diffMs <= 0) {
    return 'Просрочено'
  }

  const days = Math.floor(diffMs / DAY)
  const hours = Math.floor((diffMs % DAY) / HOUR)
  const minutes = Math.floor((diffMs % HOUR) / MINUTE)

  if (days > 0) {
    return `${days}д ${hours}ч`
  }

  if (hours > 0) {
    return `${hours}ч ${minutes}м`
  }

  return `${Math.max(minutes, 1)}м`
}

const detectStatus = (diffMs: number): DeadlineStatus => {
  if (diffMs <= 0) return 'overdue'
  if (diffMs <= HOUR) return 'urgent'
  if (diffMs <= 6 * HOUR) return 'soon'
  return 'on_track'
}

const calculateDeadlineInfo = (dueDate: string, dueTime: string): DeadlineInfo => {
  if (!dueDate || !dueTime) {
    return {
      label: '—',
      status: 'unknown',
      isOverdue: false,
    }
  }

  const deadline = new Date(`${dueDate}T${dueTime}`)
  const diffMs = deadline.getTime() - Date.now()

  if (Number.isNaN(diffMs)) {
    return {
      label: '—',
      status: 'unknown',
      isOverdue: false,
    }
  }

  const status = detectStatus(diffMs)

  return {
    label: buildLabel(diffMs),
    status,
    isOverdue: status === 'overdue',
  }
}

export const useDeadlineTimer = (dueDate: string, dueTime: string): DeadlineInfo => {
  const initialInfo = useMemo(() => calculateDeadlineInfo(dueDate, dueTime), [dueDate, dueTime])
  const [info, setInfo] = useState<DeadlineInfo>(initialInfo)

  useEffect(() => {
    setInfo(calculateDeadlineInfo(dueDate, dueTime))

    const interval = setInterval(() => {
      setInfo(calculateDeadlineInfo(dueDate, dueTime))
    }, MINUTE)

    return () => clearInterval(interval)
  }, [dueDate, dueTime])

  return info
}

export type { DeadlineStatus, DeadlineInfo }

