import { Clock } from 'lucide-react'
import { useDeadlineTimer, DeadlineStatus } from '@/hooks/useDeadlineTimer'

interface TaskDeadlineBadgeProps {
  dueDate: string
  dueTime: string
  theme: 'dark' | 'light'
  size?: 'default' | 'compact'
}

const getBadgeClasses = (status: DeadlineStatus, theme: 'dark' | 'light') => {
  const darkMap: Record<DeadlineStatus, string> = {
    overdue: 'bg-red-500/10 border-red-500/40 text-red-300',
    urgent: 'bg-orange-500/10 border-orange-500/40 text-orange-200',
    soon: 'bg-yellow-500/10 border-yellow-500/40 text-yellow-200',
    on_track: 'bg-green-500/10 border-green-500/40 text-green-200',
    unknown: 'bg-gray-600/30 border-gray-500/40 text-gray-200',
  }

  const lightMap: Record<DeadlineStatus, string> = {
    overdue: 'bg-red-50 border-red-200 text-red-600',
    urgent: 'bg-orange-50 border-orange-200 text-orange-600',
    soon: 'bg-yellow-50 border-yellow-200 text-yellow-700',
    on_track: 'bg-green-50 border-green-200 text-green-700',
    unknown: 'bg-gray-100 border-gray-200 text-gray-600',
  }

  return theme === 'dark' ? darkMap[status] : lightMap[status]
}

export const TaskDeadlineBadge = ({ dueDate, dueTime, theme, size = 'default' }: TaskDeadlineBadgeProps) => {
  const { label, status } = useDeadlineTimer(dueDate, dueTime)
  const classes = getBadgeClasses(status, theme)
  const padding = size === 'compact' ? 'px-2 py-0.5 text-[11px]' : 'px-2.5 py-1 text-xs sm:text-sm'
  const iconSize = size === 'compact' ? 'w-3 h-3' : 'w-4 h-4'

  return (
    <span className={`inline-flex items-center gap-1 rounded-full border font-medium ${padding} ${classes}`}>
      <Clock className={iconSize} />
      {label}
    </span>
  )
}

