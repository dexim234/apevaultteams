// Rating card component
import { useThemeStore } from '@/store/themeStore'
import { getRatingColor, getRatingBreakdown } from '@/utils/ratingUtils'
import { RatingData, TEAM_MEMBERS } from '@/types'
import { formatHours } from '@/utils/dateUtils'
import { Calendar, Heart, Plane, Clock, DollarSign, Users, MessageSquare, TrendingUp, Info } from 'lucide-react'
import { useState } from 'react'

interface RatingCardProps {
  rating: RatingData & { breakdown?: ReturnType<typeof getRatingBreakdown> }
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

export const RatingCard = ({ rating }: RatingCardProps) => {
  const { theme } = useThemeStore()
  const [expandedMetric, setExpandedMetric] = useState<number | null>(null)
  const member = TEAM_MEMBERS.find((m) => m.id === rating.userId)
  const color = getRatingColor(rating.rating)
  const headingColor = theme === 'dark' ? 'text-white' : 'text-gray-900'
  const mutedColor = theme === 'dark' ? 'text-gray-400' : 'text-gray-600'
  const cardBg = theme === 'dark' ? 'bg-[#1a1a1a]' : 'bg-white'
  const borderColor = theme === 'dark' ? 'border-gray-800' : 'border-gray-200'
  const hoverBg = theme === 'dark' ? 'hover:bg-gray-700' : 'hover:bg-gray-50'
  const barWidth = rating.rating <= 0 ? '4%' : `${Math.min(rating.rating, 100)}%`

  const getRatingEmoji = (ratingValue: number): string => {
    if (ratingValue >= 81) return '🏆'
    if (ratingValue >= 60) return '⭐'
    if (ratingValue >= 31) return '📊'
    if (ratingValue >= 11) return '📈'
    if (ratingValue >= 1) return '⚠️'
    return '❌'
  }

  const metrics: MetricInfo[] = rating.breakdown ? [
    {
      icon: <Calendar className="w-5 h-5" />,
      label: 'Выходные',
      value: `${rating.breakdown.daysOff} день`,
      points: rating.breakdown.daysOffPoints,
      maxPoints: 10,
      explanation: '0-2 выходных в неделю = 10% к рейтингу. Более 2 выходных = 0%. Показывает стабильность присутствия.',
      threshold: '0-2 дня',
      color: 'bg-yellow-500'
    },
    {
      icon: <Heart className="w-5 h-5" />,
      label: 'Больничные',
      value: `${rating.breakdown.sickDays} дней`,
      points: rating.breakdown.sickDaysPoints,
      maxPoints: 10,
      explanation: 'До 7 дней больничного в месяц = 10% к рейтингу. Более 7 дней = 0%. Учитывается за последние 30 дней.',
      threshold: '≤7 дней',
      color: 'bg-purple-500'
    },
    {
      icon: <Plane className="w-5 h-5" />,
      label: 'Отпуск',
      value: `${rating.breakdown.vacationDays} дней`,
      points: rating.breakdown.vacationDaysPoints,
      maxPoints: 10,
      explanation: 'До 7 дней отпуска в месяц = 10% к рейтингу. Более 7 дней = 0%. Учитывается за последние 30 дней.',
      threshold: '≤7 дней',
      color: 'bg-orange-500'
    },
    {
      icon: <Clock className="w-5 h-5" />,
      label: 'Часы работы',
      value: formatHours(rating.breakdown.weeklyHours),
      points: rating.breakdown.weeklyHoursPoints,
      maxPoints: 25,
      explanation: '30+ часов в неделю = 25% к рейтингу. 20-29 часов = 15%. Менее 20 часов = 0%. Показывает объем работы за неделю.',
      threshold: '≥30ч: 25% | ≥20ч: 15%',
      color: 'bg-blue-500'
    },
    {
      icon: <DollarSign className="w-5 h-5" />,
      label: 'Заработок',
      value: `${rating.breakdown.weeklyEarnings.toFixed(2)} ₽`,
      points: rating.breakdown.weeklyEarningsPoints,
      maxPoints: 30,
      explanation: '6000+ ₽ в неделю = 30% к рейтингу. 3000-5999 ₽ = 15%. Менее 3000 ₽ = 0%. Основной показатель эффективности.',
      threshold: '≥6000₽: 30% | ≥3000₽: 15%',
      color: 'bg-[#4E6E49]'
    },
    {
      icon: <Users className="w-5 h-5" />,
      label: 'Рефералы',
      value: `${rating.breakdown.referrals} чел.`,
      points: rating.breakdown.referralsPoints,
      maxPoints: 30,
      explanation: '5% к рейтингу за каждого реферала. Максимум 30% (6 рефералов). Учитываются за последние 30 дней. Показывает активность по привлечению новых участников.',
      threshold: '5% за каждого (макс 30%)',
      color: 'bg-pink-500'
    },
    {
      icon: <MessageSquare className="w-5 h-5" />,
      label: 'Сообщения',
      value: `${rating.breakdown.weeklyMessages} сообщений`,
      points: rating.breakdown.weeklyMessagesPoints,
      maxPoints: 15,
      explanation: 'Более 50 сообщений в неделю в группе = 15% к рейтингу. Менее 50 = 0%. Учитываются все типы сообщений (текст, фото, стикеры и т.д.). Показывает активность в общении.',
      threshold: '>50 сообщений',
      color: 'bg-indigo-500'
    }
  ] : []

  const totalPoints = metrics.reduce((sum, m) => sum + m.points, 0)

  return (
    <div className={`rounded-xl p-6 ${cardBg} shadow-lg border ${borderColor} transition-all hover:shadow-xl`}>
      {/* Header with name and rating */}
      <div className="mb-6">
        <div className="flex items-center justify-between mb-4">
          <div>
            <h3 className={`text-2xl font-bold mb-1 ${headingColor}`}>{member?.name || 'Неизвестно'}</h3>
            <div className="flex items-center gap-2">
              <span className={`text-lg font-bold`} style={{ color }}>{rating.rating.toFixed(1)}%</span>
              <span className="text-2xl">{getRatingEmoji(rating.rating)}</span>
            </div>
          </div>
        </div>

        {/* Main rating progress bar */}
        <div className="mb-2">
          <div className="w-full bg-gray-200 dark:bg-gray-700 rounded-full h-8 overflow-hidden shadow-inner">
            <div
              className="h-full transition-all duration-500 flex items-center justify-center text-sm font-bold text-white shadow-md"
              style={{
                width: barWidth,
                backgroundColor: color,
                minWidth: rating.rating <= 0 ? '40px' : undefined,
              }}
            >
              {rating.rating >= 10 && <span>{rating.rating.toFixed(0)}%</span>}
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
                    <div className={`p-2 rounded-lg ${metric.color} text-white flex-shrink-0`}>
                      {metric.icon}
                    </div>
                    <div className="flex-1 min-w-0">
                      <div className="flex items-center justify-between mb-1">
                        <span className={`font-semibold ${headingColor} truncate`}>{metric.label}</span>
                        <span className={`font-bold ml-2 ${metric.points > 0 ? 'text-[#4E6E49]' : 'text-red-500'}`}>
                          {metric.points}/{metric.maxPoints}
                        </span>
                      </div>
                      <div className="w-full bg-gray-200 dark:bg-gray-700 rounded-full h-2 overflow-hidden">
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
                  <div className={`px-4 pb-4 pt-2 border-t ${borderColor} ${theme === 'dark' ? 'bg-gray-700' : 'bg-gray-50'}`}>
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
          <div className={`p-3 rounded-lg ${theme === 'dark' ? 'bg-gray-700' : 'bg-gray-50'}`}>
            <div className={`text-xs ${mutedColor} mb-1`}>Заработок (месяц)</div>
            <div className={`text-lg font-bold ${headingColor}`}>{rating.earnings.toFixed(0)} ₽</div>
          </div>
          <div className={`p-3 rounded-lg ${theme === 'dark' ? 'bg-gray-700' : 'bg-gray-50'}`}>
            <div className={`text-xs ${mutedColor} mb-1`}>В пул</div>
            <div className={`text-lg font-bold ${headingColor}`}>{rating.poolAmount.toFixed(0)} ₽</div>
          </div>
        </div>
      </div>
    </div>
  )
}



