import { memo } from 'react'
import { useThemeStore } from '@/store/themeStore'
import { useAuthStore } from '@/store/authStore'
import { useUsers } from '@/hooks/useUsers'
import type { Event } from '@/types'
import { EVENT_CATEGORY_META } from '@/types'
import {
  Edit,
  Trash2,
  Calendar,
  Clock,
  Users,
  FileText,
  ExternalLink,
  Timer,
  Rocket,
  BarChart3,
  Image as ImageIcon,
  Shield,
  Coins,
  TrendingUp,
  Gift,
} from 'lucide-react'
import { format, parseISO } from 'date-fns'

interface EventCardProps {
  event: Event
  isAdmin: boolean
  onEdit: (event: Event) => void
  onDelete: (eventId: string) => void
}

const categoryIcons: Record<string, any> = {
  memecoins: Rocket,
  polymarket: BarChart3,
  nft: ImageIcon,
  staking: Shield,
  spot: Coins,
  futures: TrendingUp,
  airdrop: Gift,
}

export const EventCard = memo(({ event, isAdmin, onEdit, onDelete }: EventCardProps) => {
  const { theme } = useThemeStore()
  const { user } = useAuthStore()
  const { users: allMembers } = useUsers()

  const meta = EVENT_CATEGORY_META[event.category]
  const IconComponent = categoryIcons[event.category] || Rocket

  const textColor = theme === 'dark' ? 'text-white' : 'text-gray-900'
  const subtleColor = theme === 'dark' ? 'text-gray-400' : 'text-gray-600'
  const borderColor = theme === 'dark' ? 'border-white/10' : 'border-gray-100'
  const cardBg = theme === 'dark' ? 'bg-white/5 backdrop-blur-md' : 'bg-white'

  // Calculate event status and timer
  const now = new Date()
  const currentDate = now.toISOString().split('T')[0]
  const currentTime = now.toTimeString().slice(0, 5)

  const isActive = event.dates.includes(currentDate) && event.time <= currentTime

  // Get next occurrence date
  const upcomingDates = event.dates.filter(date => date >= currentDate).sort()
  const nextDate = upcomingDates[0]

  // Calculate time until event
  const getTimeUntilEvent = (): string | null => {
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

  // Format date helper
  const formatDate = (dateStr: string) => {
    return format(parseISO(dateStr), 'dd.MM.yyyy')
  }

  return (
    <div
      className={`relative p-5 rounded-2xl border ${borderColor} ${cardBg} shadow-sm hover:shadow-xl transition-all group overflow-hidden`}
    >
      {/* Background Gradient Glow */}
      <div className={`absolute -right-20 -top-20 w-64 h-64 bg-gradient-to-br ${meta.cardGradient} blur-3xl opacity-50 group-hover:opacity-100 transition-opacity duration-500`} />

      <div className="relative flex flex-col lg:flex-row lg:items-start gap-6">
        {/* Left Section: Icon and Basics */}
        <div className="flex-1 min-w-0">
          <div className="flex items-start gap-4">
            <div className={`p-4 rounded-2xl bg-gradient-to-br ${meta.gradient} shadow-lg shadow-emerald-500/10 text-white shrink-0`}>
              <IconComponent className="w-6 h-6 sm:w-7 sm:h-7" />
            </div>

            <div className="flex-1 min-w-0">
              <div className="flex flex-col sm:flex-row sm:items-center gap-2 mb-3">
                <h3 className={`text-xl sm:text-2xl font-black ${textColor} tracking-tight leading-tight`}>{event.title}</h3>
                <span className={`w-fit px-3 py-1 rounded-full text-[10px] font-black uppercase tracking-widest bg-gradient-to-r ${meta.gradient} text-white shadow-sm ring-1 ring-white/20`}>
                  {meta.label}
                </span>
              </div>

              <div className="flex flex-wrap items-center gap-5 text-sm sm:text-base">
                <div className="flex items-center gap-2.5">
                  <div className={`p-2 rounded-xl ${theme === 'dark' ? 'bg-white/5' : 'bg-gray-100'}`}>
                    <Calendar size={16} className="text-emerald-500" />
                  </div>
                  <span className={`font-bold ${subtleColor}`}>
                    {event.dates.length === 1
                      ? formatDate(event.dates[0])
                      : `${formatDate(event.dates[0])} — ${formatDate(event.dates[event.dates.length - 1])}`
                    }
                  </span>
                </div>
                <div className="flex items-center gap-2.5">
                  <div className={`p-2 rounded-xl ${theme === 'dark' ? 'bg-white/5' : 'bg-gray-100'}`}>
                    <Clock size={16} className="text-emerald-500" />
                  </div>
                  <span className={`font-bold ${subtleColor}`}>{event.time}</span>
                </div>
              </div>
            </div>
          </div>

          {/* Description */}
          {event.description && (
            <div className="mt-5 pl-1">
              <p className={`text-[15px] ${theme === 'dark' ? 'text-gray-300' : 'text-gray-600'} leading-relaxed`}>
                {event.description}
              </p>
            </div>
          )}

          {/* Links and Files */}
          <div className="mt-6 flex flex-wrap gap-3">
            {event.links.map((link, index) => (
              <a
                key={index}
                href={link.url}
                target="_blank"
                rel="noopener noreferrer"
                className={`flex items-center gap-2 px-4 py-2.5 rounded-xl text-sm font-bold transition-all ${theme === 'dark' ? 'bg-emerald-500/10 text-emerald-400 hover:bg-emerald-500/20 border border-emerald-500/20' : 'bg-emerald-50 text-emerald-700 hover:bg-emerald-100 border border-emerald-100'}`}
              >
                <ExternalLink size={14} />
                {link.name}
              </a>
            ))}
            {event.files.map((file) => (
              <a
                key={file.id}
                href={file.url}
                target="_blank"
                rel="noopener noreferrer"
                className={`flex items-center gap-2 px-4 py-2.5 rounded-xl text-sm font-bold transition-all ${theme === 'dark' ? 'bg-white/5 text-gray-300 hover:bg-white/10 border border-white/5' : 'bg-gray-50 text-gray-700 hover:bg-gray-100 border border-gray-100'}`}
              >
                <FileText size={14} />
                {file.name}
              </a>
            ))}
          </div>
        </div>

        {/* Right Section: Participants and Status */}
        <div className="lg:w-72 flex flex-col gap-5">
          {/* Status highlight */}
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-1 gap-2">
            {isActive && (
              <div className="flex items-center justify-between p-4 rounded-2xl bg-emerald-500/10 border border-emerald-500/20 shadow-inner">
                <span className="text-[10px] font-black uppercase text-emerald-500 tracking-wider">Идет сейчас</span>
                <div className="flex items-center gap-2">
                  <div className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse" />
                  <Timer size={16} className="text-emerald-500" />
                </div>
              </div>
            )}
            {timeUntil && !isActive && (
              <div className="flex items-center justify-between p-4 rounded-2xl bg-amber-500/10 border border-amber-500/20 shadow-inner">
                <span className="text-[10px] font-black uppercase text-amber-500 tracking-wider">Начнется через</span>
                <span className="text-sm font-black text-amber-500">{timeUntil}</span>
              </div>
            )}
            {isUserRequired && (
              <div className="flex items-center justify-between p-4 rounded-2xl bg-blue-500/10 border border-blue-500/20 shadow-inner">
                <span className="text-[10px] font-black uppercase text-blue-500 tracking-wider">Вы участвуете</span>
                <Users size={16} className="text-blue-500" />
              </div>
            )}
          </div>

          {/* Participants - only scrollable container on mobile if many */}
          {participants.length > 0 && (
            <div className={`p-5 rounded-2xl ${theme === 'dark' ? 'bg-white/5 shadow-inner' : 'bg-gray-50'} border ${borderColor}`}>
              <p className={`text-[10px] font-black uppercase tracking-widest ${subtleColor} mb-3.5`}>Участники</p>
              <div className="flex flex-wrap gap-2">
                {participants.map((name, idx) => (
                  <span
                    key={idx}
                    className={`px-3 py-1.5 rounded-xl text-xs font-bold ${theme === 'dark' ? 'bg-white/10 text-gray-300' : 'bg-white text-gray-700 shadow-sm'}`}
                  >
                    {name}
                  </span>
                ))}
              </div>
            </div>
          )}

          {/* Admin Actions */}
          {isAdmin && (
            <div className="flex items-center gap-3 mt-auto pt-4 border-t border-white/5 lg:border-none">
              <button
                onClick={() => onEdit(event)}
                className={`flex-1 flex items-center justify-center gap-2 px-5 py-3 rounded-2xl text-sm font-black transition-all ${theme === 'dark' ? 'bg-white/5 hover:bg-white/10 text-gray-400 hover:text-white' : 'bg-gray-50 hover:bg-gray-100 text-gray-500 hover:text-gray-900'}`}
              >
                <Edit size={16} />
                Изменить
              </button>
              <button
                onClick={() => onDelete(event.id)}
                className={`p-3 rounded-2xl transition-all ${theme === 'dark' ? 'bg-red-500/10 hover:bg-red-500/20 text-red-400' : 'bg-red-50 hover:bg-red-100 text-red-600'}`}
              >
                <Trash2 size={20} />
              </button>
            </div>
          )}
        </div>
      </div>
    </div>
  )
})