import { useState, useEffect, type JSX } from 'react'
import { useThemeStore } from '@/store/themeStore'
import { useAuthStore } from '@/store/authStore'
import { formatDate, getRelativeTime, isToday, isTomorrow, formatTime } from '@/utils/dateUtils'
import type { Event } from '@/types'
import { useUsers } from '@/hooks/useUsers'
import {
  X,
  Edit,
  Trash2,
  Calendar,
  Clock,
  Link as LinkIcon,
  Users,
  FileText,
  Download,
  ExternalLink,
  ChevronDown,
  ChevronUp,
  Rocket,
  Gauge,
  Image,
  Shield,
  Coins,
  LineChart,
  Gift,
  Sparkles,
  Timer,
} from 'lucide-react'
import { EVENT_CATEGORY_META } from '@/types'

const categoryIcons: Record<string, (props: any) => JSX.Element> = {
  rocket: Rocket,
  barchart: Gauge,
  image: Image,
  shield: Shield,
  coins: Coins,
  trending: LineChart,
  gift: Gift,
}

interface EventCardProps {
  event: Event
  isAdmin: boolean
  onEdit: (event: Event) => void
  onDelete: (eventId: string) => void
  expanded: boolean
  onToggleExpand: () => void
}

export const EventCard = ({ event, isAdmin, onEdit, onDelete, expanded, onToggleExpand }: EventCardProps) => {
  const { theme } = useThemeStore()
  const { user } = useAuthStore()
  const { users: allMembers } = useUsers()

  const meta = EVENT_CATEGORY_META[event.category]
  const IconComponent = categoryIcons[meta.icon] || Sparkles

  const textColor = theme === 'dark' ? 'text-white' : 'text-gray-900'
  const subtleColor = theme === 'dark' ? 'text-gray-400' : 'text-gray-600'
  const borderColor = theme === 'dark' ? 'border-white/10' : 'border-gray-100'
  const cardBg = theme === 'dark' ? 'bg-white/5 backdrop-blur-md' : 'bg-white'

  // Calculate event status and timer
  const now = new Date()
  const currentDate = now.toISOString().split('T')[0]
  const currentTime = now.toTimeString().slice(0, 5)

  const isPast = event.dates.every(date => date < currentDate) ||
    (event.dates.includes(currentDate) && event.time < currentTime)
  const isUpcoming = event.dates.some(date => date >= currentDate)
  const isActive = event.dates.includes(currentDate) && event.time <= currentTime

  // Get next occurrence date
  const upcomingDates = event.dates.filter(date => date >= currentDate).sort()
  const nextDate = upcomingDates[0]

  // Calculate time until event
  const getTimeUntilEvent = () => {
    if (!nextDate) return null
    const eventDateTime = new Date(`${nextDate}T${event.time}`)
    const diff = eventDateTime.getTime() - now.getTime()
    if (diff < 0) return null

    const days = Math.floor(diff / (1000 * 60 * 60 * 24))
    const hours = Math.floor((diff % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60))
    const minutes = Math.floor((diff % (1000 * 60 * 60)) / (1000 * 60))

    if (days > 0) return `${days}д ${hours}ч`
    if (hours > 0) return `${hours}ч ${minutes}м`
    return `${minutes}м`
  }

  const timeUntil = getTimeUntilEvent()

  // Get participant names
  const participants = event.requiredParticipants.map(id => {
    const member = allMembers.find(m => m.id === id)
    return member?.name || 'Unknown'
  }).filter(Boolean)

  // Check if current user is required
  const isUserRequired = user && event.requiredParticipants.includes(user.id)

  // Get date label
  const getDateLabel = () => {
    if (!nextDate) return 'Завершено'
    if (isToday(nextDate)) return 'Сегодня'
    if (isTomorrow(nextDate)) return 'Завтра'
    return formatDate(nextDate, 'dd MMMM')
  }

  return (
    <div
      className={`p-4 rounded-xl border ${borderColor} ${cardBg} shadow-lg hover:shadow-xl transition-all group overflow-hidden`}
    >
      {/* Gradient accent */}
      <div className={`absolute left-0 top-0 bottom-0 w-1 bg-gradient-to-b ${meta.gradientDark}`} />

      <div className="flex items-start gap-4 pl-4">
        {/* Left: Icon */}
        <div className={`p-2.5 rounded-xl bg-gradient-to-br ${meta.gradient} bg-opacity-10 text-white shrink-0`}>
          <IconComponent className="w-5 h-5" />
        </div>

        {/* Center: Content */}
        <div className="flex-1 min-w-0">
          {/* Header row */}
          <div className="flex items-start justify-between gap-2">
            <div className="flex-1 min-w-0">
              <div className="flex items-center gap-2 flex-wrap mb-1">
                <h3 className={`font-bold ${textColor} truncate`}>{event.title}</h3>
                <span className={`px-2 py-0.5 rounded text-[10px] font-bold uppercase tracking-wider bg-gradient-to-r ${meta.gradient} text-white`}>
                  {meta.label}
                </span>
              </div>

              {/* Date and time */}
              <div className="flex items-center gap-4 text-sm">
                <div className="flex items-center gap-1.5">
                  <Calendar size={14} className={subtleColor} />
                  <span className={`font-medium ${subtleColor}`}>
                    {event.dates.length === 1
                      ? formatDate(event.dates[0], 'dd.MM.yyyy')
                      : `${formatDate(event.dates[0], 'dd.MM')} - ${formatDate(event.dates[event.dates.length - 1], 'dd.MM.yyyy')}`
                    }
                  </span>
                </div>
                <div className="flex items-center gap-1.5">
                  <Clock size={14} className={subtleColor} />
                  <span className={`font-medium ${subtleColor}`}>{event.time}</span>
                </div>
              </div>
            </div>

            {/* Status badges */}
            <div className="flex items-center gap-2">
              {isActive && (
                <span className="flex items-center gap-1 px-2 py-1 rounded-full text-[10px] font-bold bg-emerald-500/10 text-emerald-500 border border-emerald-500/20">
                  <Timer size={12} />
                  Идет сейчас
                </span>
              )}
              {timeUntil && !isActive && (
                <span className="flex items-center gap-1 px-2 py-1 rounded-full text-[10px] font-bold bg-amber-500/10 text-amber-500 border border-amber-500/20">
                  <Timer size={12} />
                  {timeUntil}
                </span>
              )}
              {isUserRequired && (
                <span className="flex items-center gap-1 px-2 py-1 rounded-full text-[10px] font-bold bg-blue-500/10 text-blue-500 border border-blue-500/20">
                  <Users size={12} />
                  Вы участвуете
                </span>
              )}
            </div>
          </div>

          {/* Expandable content */}
          <div className={`transition-all duration-300 ${expanded ? 'mt-4 max-h-96 opacity-100' : 'mt-0 max-h-0 opacity-0 overflow-hidden'}`}>
            {/* Description */}
            {event.description && (
              <div className="mb-4">
                <p className={`text-sm ${subtleColor} leading-relaxed`}>{event.description}</p>
              </div>
            )}

            {/* Participants */}
            {participants.length > 0 && (
              <div className="mb-4">
                <p className={`text-xs font-bold uppercase tracking-wider ${subtleColor} mb-2`}>
                  Обязательные участники
                </p>
                <div className="flex flex-wrap gap-2">
                  {participants.map((name, idx) => (
                    <span
                      key={idx}
                      className={`px-3 py-1 rounded-full text-xs font-medium ${theme === 'dark' ? 'bg-white/10 text-gray-300' : 'bg-gray-100 text-gray-700'}`}
                    >
                      {name}
                    </span>
                  ))}
                </div>
              </div>
            )}

            {/* Link */}
            {event.link && (
              <div className="mb-4">
                <a
                  href={event.link}
                  target="_blank"
                  rel="noopener noreferrer"
                  className={`inline-flex items-center gap-2 px-4 py-2 rounded-lg text-sm font-bold transition-all ${theme === 'dark' ? 'bg-emerald-500/10 text-emerald-400 hover:bg-emerald-500/20' : 'bg-emerald-50 text-emerald-600 hover:bg-emerald-100'}`}
                >
                  <ExternalLink size={14} />
                  Открыть ссылку
                </a>
              </div>
            )}

            {/* Files */}
            {event.files.length > 0 && (
              <div>
                <p className={`text-xs font-bold uppercase tracking-wider ${subtleColor} mb-2`}>
                  Полезные материалы
                </p>
                <div className="space-y-2">
                  {event.files.map((file) => (
                    <a
                      key={file.id}
                      href={file.url}
                      target="_blank"
                      rel="noopener noreferrer"
                      className={`flex items-center gap-3 p-3 rounded-lg border ${borderColor} transition-all ${theme === 'dark' ? 'hover:bg-white/5' : 'hover:bg-gray-50'}`}
                    >
                      <FileText size={18} className={subtleColor} />
                      <span className={`flex-1 text-sm font-medium truncate ${textColor}`}>{file.name}</span>
                      <Download size={14} className={subtleColor} />
                    </a>
                  ))}
                </div>
              </div>
            )}
          </div>
        </div>

        {/* Right: Actions */}
        <div className="flex items-center gap-1">
          <button
            onClick={onToggleExpand}
            className={`p-2 rounded-lg transition-all ${theme === 'dark' ? 'hover:bg-white/10 text-gray-400' : 'hover:bg-gray-100 text-gray-500'}`}
          >
            {expanded ? <ChevronUp size={18} /> : <ChevronDown size={18} />}
          </button>

          {isAdmin && (
            <>
              <button
                onClick={() => onEdit(event)}
                className={`p-2 rounded-lg transition-all ${theme === 'dark' ? 'hover:bg-white/10 text-gray-400 hover:text-white' : 'hover:bg-gray-100 text-gray-500 hover:text-gray-900'}`}
              >
                <Edit size={16} />
              </button>
              <button
                onClick={() => onDelete(event.id)}
                className={`p-2 rounded-lg transition-all ${theme === 'dark' ? 'hover:bg-red-500/20 text-red-400' : 'hover:bg-red-50 text-red-600'}`}
              >
                <Trash2 size={16} />
              </button>
            </>
          )}
        </div>
      </div>
    </div>
  )
}