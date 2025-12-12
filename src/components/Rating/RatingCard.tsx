// Rating card component
import { useThemeStore } from '@/store/themeStore'
import { getRatingBreakdown } from '@/utils/ratingUtils'
import { RatingData, TEAM_MEMBERS } from '@/types'
import { formatHours } from '@/utils/dateUtils'
import { getUserNicknameSync } from '@/utils/userUtils'
import { Calendar, Heart, Plane, Clock, DollarSign, Users, MessageSquare, TrendingUp, Info } from 'lucide-react'
import { useState } from 'react'

interface RatingCardProps {
  rating: RatingData & { breakdown?: ReturnType<typeof getRatingBreakdown> }
  place?: { rank: number }
}

interface MetricInfo {
  icon: React.ReactNode
  label: string
  value: string
  points: number
  maxPoints: number
  explanation: string
  threshold: string
  color: string
}

export const RatingCard = ({ rating, place }: RatingCardProps) => {
  const { theme } = useThemeStore()
  const [expandedMetric, setExpandedMetric] = useState<number | null>(null)
  const member = TEAM_MEMBERS.find((m) => m.id === rating.userId)
  const headingColor = theme === 'dark' ? 'text-white' : 'text-gray-900'
  const mutedColor = theme === 'dark' ? 'text-gray-400' : 'text-gray-600'
  const cardBg = theme === 'dark' ? 'bg-[#0f0f0f]' : 'bg-white'
  const borderColor = theme === 'dark' ? 'border-white/10' : 'border-gray-200'
  const hoverBg = theme === 'dark' ? 'hover:bg-white/5' : 'hover:bg-gray-50'
  const softSurface = theme === 'dark' ? 'bg-white/5' : 'bg-gray-50/80'
  const barWidth = rating.rating <= 0 ? '4%' : `${Math.min(rating.rating, 100)}%`
  const bandColor =
    rating.rating >= 80
      ? 'bg-emerald-500'
      : rating.rating >= 60
      ? 'bg-blue-500'
      : rating.rating >= 40
      ? 'bg-amber-500'
      : 'bg-rose-500'
  const ratingTextColor =
    rating.rating >= 80
      ? '#10b981'
      : rating.rating >= 60
      ? '#3b82f6'
      : rating.rating >= 40
      ? '#f59e0b'
      : '#f43f5e'

  const accentPalette: Record<
    string,
    { bg: string; border: string; text: string; icon: string; soft: string }
  > = {
    '1': {
      bg: theme === 'dark' ? 'bg-emerald-500/10' : 'bg-emerald-50',
      border: theme === 'dark' ? 'border-emerald-400/30' : 'border-emerald-200',
      text: theme === 'dark' ? 'text-emerald-100' : 'text-emerald-900',
      icon: theme === 'dark' ? 'text-emerald-200' : 'text-emerald-600',
      soft: theme === 'dark' ? 'bg-emerald-500/8' : 'bg-emerald-50',
    },
    '2': {
      bg: theme === 'dark' ? 'bg-sky-500/10' : 'bg-sky-50',
      border: theme === 'dark' ? 'border-sky-400/30' : 'border-sky-200',
      text: theme === 'dark' ? 'text-sky-100' : 'text-sky-900',
      icon: theme === 'dark' ? 'text-sky-200' : 'text-sky-600',
      soft: theme === 'dark' ? 'bg-sky-500/8' : 'bg-sky-50',
    },
    '3': {
      bg: theme === 'dark' ? 'bg-purple-500/10' : 'bg-purple-50',
      border: theme === 'dark' ? 'border-purple-400/30' : 'border-purple-200',
      text: theme === 'dark' ? 'text-purple-100' : 'text-purple-900',
      icon: theme === 'dark' ? 'text-purple-200' : 'text-purple-600',
      soft: theme === 'dark' ? 'bg-purple-500/8' : 'bg-purple-50',
    },
    '4': {
      bg: theme === 'dark' ? 'bg-amber-500/10' : 'bg-amber-50',
      border: theme === 'dark' ? 'border-amber-400/30' : 'border-amber-200',
      text: theme === 'dark' ? 'text-amber-100' : 'text-amber-900',
      icon: theme === 'dark' ? 'text-amber-200' : 'text-amber-600',
      soft: theme === 'dark' ? 'bg-amber-500/8' : 'bg-amber-50',
    },
    '5': {
      bg: theme === 'dark' ? 'bg-rose-500/10' : 'bg-rose-50',
      border: theme === 'dark' ? 'border-rose-400/30' : 'border-rose-200',
      text: theme === 'dark' ? 'text-rose-100' : 'text-rose-900',
      icon: theme === 'dark' ? 'text-rose-200' : 'text-rose-600',
      soft: theme === 'dark' ? 'bg-rose-500/8' : 'bg-rose-50',
    },
    default: {
      bg: theme === 'dark' ? 'bg-white/5' : 'bg-gray-50',
      border: theme === 'dark' ? 'border-white/10' : 'border-gray-200',
      text: theme === 'dark' ? 'text-white' : 'text-gray-900',
      icon: theme === 'dark' ? 'text-white' : 'text-gray-700',
      soft: theme === 'dark' ? 'bg-white/5' : 'bg-gray-50',
    },
  }

  const accent = accentPalette[member?.id || 'default']

  const metrics: MetricInfo[] = rating.breakdown ? [
    {
      icon: <Calendar className="w-5 h-5" />,
      label: 'Выходные',
      value: `${rating.breakdown.daysOff} день`,
      points: rating.breakdown.daysOffPoints,
      maxPoints: 10,
      explanation: '0-2 выходных в неделю = 10% к рейтингу. Более 2 выходных = 0%. Показывает стабильность присутствия.',
      threshold: '0-2 дня',
      color: 'bg-amber-200 text-amber-900'
    },
    {
      icon: <Heart className="w-5 h-5" />,
      label: 'Больничные',
      value: `${rating.breakdown.sickDays} дней`,
      points: rating.breakdown.sickDaysPoints,
      maxPoints: 10,
      explanation: 'До 7 дней больничного в месяц = 10% к рейтингу. Более 7 дней = 0%. Учитывается за последние 30 дней.',
      threshold: '≤7 дней',
      color: 'bg-purple-200 text-purple-900'
    },
    {
      icon: <Plane className="w-5 h-5" />,
      label: 'Отпуск',
      value: `${rating.breakdown.vacationDays} дней`,
      points: rating.breakdown.vacationDaysPoints,
      maxPoints: 10,
      explanation: 'До 7 дней отпуска в месяц = 10% к рейтингу. Более 7 дней = 0%. Учитывается за последние 30 дней.',
      threshold: '≤7 дней',
      color: 'bg-orange-200 text-orange-900'
    },
    {
      icon: <Clock className="w-5 h-5" />,
      label: 'Часы работы',
      value: formatHours(rating.breakdown.weeklyHours),
      points: rating.breakdown.weeklyHoursPoints,
      maxPoints: 25,
      explanation: '20+ часов в неделю = 25% к рейтингу. 15-19 часов = 15%. Менее 15 часов = 0%. Показывает объем работы за неделю.',
      threshold: '≥20ч: 25% | ≥15ч: 15%',
      color: 'bg-blue-200 text-blue-900'
    },
    {
      icon: <DollarSign className="w-5 h-5" />,
      label: 'Заработок',
      value: `${rating.breakdown.weeklyEarnings.toFixed(2)} ₽`,
      points: rating.breakdown.weeklyEarningsPoints,
      maxPoints: 30,
      explanation: '6000+ ₽ в неделю = 30% к рейтингу. 3000-5999 ₽ = 15%. Менее 3000 ₽ = 0%. Основной показатель эффективности.',
      threshold: '≥6000₽: 30% | ≥3000₽: 15%',
      color: 'bg-emerald-200 text-emerald-900'
    },
    {
      icon: <Users className="w-5 h-5" />,
      label: 'Рефералы',
      value: `${rating.breakdown.referrals} чел.`,
      points: rating.breakdown.referralsPoints,
      maxPoints: 30,
      explanation: '5% к рейтингу за каждого реферала. Максимум 30% (6 рефералов). Учитываются за последние 30 дней. Показывает активность по привлечению новых участников.',
      threshold: '5% за каждого (макс 30%)',
      color: 'bg-pink-200 text-pink-900'
    },
    {
      icon: <MessageSquare className="w-5 h-5" />,
      label: 'Сообщения',
      value: `${rating.breakdown.weeklyMessages} сообщений`,
      points: rating.breakdown.weeklyMessagesPoints,
      maxPoints: 15,
      explanation: 'Более 50 сообщений в неделю в группе = 15% к рейтингу. Менее 50 = 0%. Учитываются все типы сообщений (текст, фото, стикеры и т.д.). Показывает активность в общении.',
      threshold: '>50 сообщений',
      color: 'bg-indigo-200 text-indigo-900'
    }
  ] : []

  const totalPoints = metrics.reduce((sum, m) => sum + m.points, 0)

  const placeBadge = (() => {
    if (!place) return null
    const rank = place.rank
    const palette =
      rank === 1
        ? { bg: 'from-amber-400 to-amber-600', ring: 'ring-amber-300/50', icon: '🥇' }
        : rank === 2
          ? { bg: 'from-slate-300 to-slate-500', ring: 'ring-slate-300/50', icon: '🥈' }
          : rank === 3
            ? { bg: 'from-amber-200 to-amber-500', ring: 'ring-amber-200/40', icon: '🥉' }
            : { bg: 'from-gray-200 to-gray-400', ring: 'ring-gray-200/40', icon: rank.toString() }

    return (
      <div className={`absolute top-3 right-3`}>
        <div className={`w-10 h-10 rounded-full bg-gradient-to-br ${palette.bg} ring-4 ${palette.ring} shadow-lg grid place-items-center text-lg font-semibold`}>
          {palette.icon}
        </div>
      </div>
    )
  })()

  return (
    <div className={`relative rounded-2xl p-6 ${cardBg} shadow-sm border ${borderColor} transition-colors`}>
      {placeBadge}
      {/* Header with name and rating */}
      <div className="mb-5 flex flex-col gap-3">
        <div className="flex items-start justify-between gap-3">
          <div className="min-w-0">
            <p className={`text-[11px] uppercase tracking-[0.12em] ${mutedColor}`}>Участник</p>
            <div className="flex items-center gap-2 flex-wrap">
              <h3 className={`text-2xl font-bold ${headingColor} truncate`}>
                {member ? getUserNicknameSync(member.id) : 'unknown'}
              </h3>
            </div>
            <div className="flex items-center gap-2 mt-1">
              <span
                className={`px-2.5 py-1 rounded-lg text-xs font-semibold border ${accent.border} ${accent.bg} ${accent.text} flex items-center gap-1`}
              >
                <span className={`text-lg leading-none ${accent.icon}`}>●</span>
                <span>Ник</span>
              </span>
              <div className="flex items-center gap-2">
                <span className={`text-lg font-bold`} style={{ color: ratingTextColor }}>{rating.rating.toFixed(1)}%</span>
              </div>
            </div>
          </div>
        </div>

        {/* Main rating progress bar */}
        <div>
          <div className="w-full bg-gray-200/70 dark:bg-gray-800 rounded-full h-6 overflow-hidden shadow-inner">
            <div
              className={`h-full transition-all duration-500 flex items-center justify-center text-sm font-semibold text-white ${bandColor}`}
              style={{
                width: barWidth,
                minWidth: rating.rating <= 0 ? '40px' : undefined,
              }}
            >
              {rating.rating >= 8 && <span>{rating.rating.toFixed(0)}%</span>}
            </div>
          </div>
          <div className="flex justify-between mt-1">
            <span className={`text-xs ${mutedColor}`}>Общий рейтинг</span>
            <span className={`text-xs font-semibold ${mutedColor}`}>{totalPoints}/100 баллов</span>
          </div>
        </div>
      </div>

      {/* Metrics Breakdown */}
      {rating.breakdown && (
        <div className="space-y-3 mb-6">
          <div className="flex items-center gap-2 mb-4">
            <TrendingUp className={`w-5 h-5 ${mutedColor}`} />
            <h4 className={`text-lg font-semibold ${headingColor}`}>Детальный разбор рейтинга</h4>
          </div>
          
          {metrics.map((metric, index) => {
            const percentage = metric.maxPoints > 0 ? (metric.points / metric.maxPoints) * 100 : 0
            const isExpanded = expandedMetric === index
            
            return (
              <div
                key={index}
                className={`rounded-lg border ${borderColor} overflow-hidden transition-all ${isExpanded ? 'shadow-md' : ''}`}
              >
                <button
                  onClick={() => setExpandedMetric(isExpanded ? null : index)}
                  className={`w-full p-4 flex items-center justify-between ${hoverBg} transition-colors`}
                >
                  <div className="flex items-center gap-3 flex-1 min-w-0">
                    <div className={`p-2 rounded-lg ${metric.color} flex-shrink-0`}>
                      {metric.icon}
                    </div>
                    <div className="flex-1 min-w-0">
                      <div className="flex items-center justify-between mb-1">
                        <span className={`font-semibold ${headingColor} truncate`}>{metric.label}</span>
                        <span className={`font-bold ml-2 ${metric.points > 0 ? 'text-[#4E6E49]' : 'text-red-500'}`}>
                          {metric.points}/{metric.maxPoints}
                        </span>
                      </div>
                      <div className="w-full bg-gray-200 dark:bg-gray-800 rounded-full h-2 overflow-hidden">
                        <div
                          className={`h-full transition-all duration-300 ${metric.color}`}
                          style={{ width: `${percentage}%` }}
                        />
                      </div>
                      <div className="flex items-center justify-between mt-1">
                        <span className={`text-xs ${mutedColor} truncate mr-2`}>{metric.value}</span>
                        <span className={`text-xs ${mutedColor} whitespace-nowrap`}>{metric.threshold}</span>
                      </div>
                    </div>
                    <Info className={`w-4 h-4 flex-shrink-0 ml-2 ${mutedColor} transition-transform ${isExpanded ? 'rotate-180' : ''}`} />
                  </div>
                </button>
                
                {isExpanded && (
                  <div className={`px-4 pb-4 pt-2 border-t ${borderColor} ${softSurface}`}>
                    <p className={`text-sm ${mutedColor} leading-relaxed`}>
                      {metric.explanation}
                    </p>
                  </div>
                )}
              </div>
            )
          })}
        </div>
      )}

      {/* Additional Statistics */}
      <div className={`pt-4 border-t ${borderColor}`}>
        <h4 className={`text-sm font-semibold mb-3 ${headingColor}`}>Дополнительная статистика</h4>
        <div className="grid grid-cols-2 gap-3 text-sm">
          <div className={`p-3 rounded-lg ${softSurface}`}>
            <div className={`text-xs ${mutedColor} mb-1`}>Заработок (месяц)</div>
            <div className={`text-lg font-bold ${headingColor}`}>{rating.earnings.toFixed(0)} ₽</div>
          </div>
          <div className={`p-3 rounded-lg ${softSurface}`}>
            <div className={`text-xs ${mutedColor} mb-1`}>В пул</div>
            <div className={`text-lg font-bold ${headingColor}`}>{rating.poolAmount.toFixed(0)} ₽</div>
          </div>
        </div>
      </div>
    </div>
  )
}



