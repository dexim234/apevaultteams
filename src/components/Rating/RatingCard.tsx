// Rating card component
import { useThemeStore } from '@/store/themeStore'
import { getRatingBreakdown, getExclusionStatus } from '@/utils/ratingUtils'
import { RatingData, TEAM_MEMBERS } from '@/types'
import { formatHours } from '@/utils/dateUtils'
import { UserNickname } from '@/components/UserNickname'
import { Calendar, Heart, Plane, Clock, DollarSign, Users, TrendingUp, Info, AlertTriangle, Zap, Lightbulb } from 'lucide-react'
import React, { useState } from 'react'

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
  what: string
  why: string
  how: string
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
      icon: <Clock className="w-5 h-5" />,
      label: 'Часы работы',
      value: formatHours(rating.breakdown.weeklyHours),
      points: rating.breakdown.weeklyHoursPoints,
      maxPoints: 25,
      what: `Отработано ${formatHours(rating.breakdown.weeklyHours)} за неделю.`,
      why: 'Часы показывают твой вклад в общее время команды. Норма — 20+ часов.',
      how: rating.breakdown.weeklyHoursPoints < 25
        ? 'Увеличь активность, бери больше слотов или задач. Цель: 20+ часов.'
        : 'Отличный результат, поддерживай этот темп!',
      color: 'bg-blue-200 text-blue-900'
    },
    {
      icon: <DollarSign className="w-5 h-5" />,
      label: 'Заработок',
      value: `${rating.breakdown.weeklyEarnings.toFixed(2)} ₽`,
      points: rating.breakdown.weeklyEarningsPoints,
      maxPoints: 30,
      what: `Заработано ${rating.breakdown.weeklyEarnings.toFixed(2)} ₽ за неделю.`,
      why: 'Доход — ключевой показатель эффективности твоих действий.',
      how: rating.breakdown.weeklyEarningsPoints < 30
        ? 'Анализируй рынок, ищи профитные сигналы, участвуй в активностях. Цель: 6000+ ₽.'
        : 'Супер! Твой доход на высоте.',
      color: 'bg-emerald-200 text-emerald-900'
    },
    {
      icon: <Users className="w-5 h-5" />,
      label: 'Рефералы',
      value: `${rating.breakdown.referrals} чел.`,
      points: rating.breakdown.referralsPoints,
      maxPoints: 30,
      what: `Привлечено ${rating.breakdown.referrals} рефералов за 30 дней.`,
      why: 'Рост комьюнити важен для масштабирования и новых возможностей.',
      how: rating.breakdown.referralsPoints < 30
        ? 'Приглашай активных друзей, делись ссылкой. Цель: 6 человек.'
        : 'Отличная работа по расширению команды!',
      color: 'bg-pink-200 text-pink-900'
    },
    {
      icon: <Zap className="w-5 h-5" />,
      label: 'Сигналы/Коллы',
      value: `${rating.breakdown.signals}`,
      points: 0,
      maxPoints: 0,
      what: `Дано ${rating.breakdown.signals} сигналов.`,
      why: 'Активность в трейдинге и генерация идей.',
      how: 'Продолжай искать и публиковать качественные сигналы.',
      color: 'bg-yellow-200 text-yellow-900'
    },
    {
      icon: <Lightbulb className="w-5 h-5" />,
      label: 'Инициативы',
      value: `${rating.breakdown.initiatives}`,
      points: 0,
      maxPoints: 0,
      what: `Предложено ${rating.breakdown.initiatives} инициатив.`,
      why: 'Проактивность помогает развивать проект.',
      how: 'Предлагай идеи по улучшению процессов.',
      color: 'bg-indigo-200 text-indigo-900'
    },
    {
      icon: <DollarSign className="w-5 h-5" />,
      label: 'Пул',
      value: `${rating.breakdown.poolAmount.toFixed(2)} ₽`,
      points: 0,
      maxPoints: 0,
      what: `Отправлено в пул: ${rating.breakdown.poolAmount.toFixed(2)} ₽.`,
      why: 'Вклад в общий пул команды.',
      how: 'Увеличивай отчисления с доходов.',
      color: 'bg-green-200 text-green-900'
    },
    {
      icon: <Calendar className="w-5 h-5" />,
      label: 'Выходные',
      value: `${rating.breakdown.daysOff} дн.`,
      points: rating.breakdown.daysOffPoints,
      maxPoints: 5,
      what: `Использовано ${rating.breakdown.daysOff} выходных на этой неделе.`,
      why: 'Важен баланс, но частые выходные снижают вовлеченность.',
      how: rating.breakdown.daysOffPoints <= 0
        ? 'Старайся брать не более 2-3 выходных в неделю.'
        : 'График в норме.',
      color: 'bg-amber-200 text-amber-900'
    },
    {
      icon: <Heart className="w-5 h-5" />,
      label: 'Больничные',
      value: `${rating.breakdown.sickDays} дн.`,
      points: rating.breakdown.sickDaysPoints,
      maxPoints: 5,
      what: `Всего ${rating.breakdown.sickDays} дней больничного за месяц (из них ${rating.breakdown.sickDays} на неделе).`, // Note: breakdown might need updating if weeklySickDays needed explicitly here but lets reuse logic
      why: 'Здоровье важно, но длительные отсутствия влияют на процесс.',
      how: rating.breakdown.sickDaysPoints <= 0
        ? 'Выздоравливай! Но следи, чтобы больничные не становились частой практикой без причины.'
        : 'Всё в порядке.',
      color: 'bg-purple-200 text-purple-900'
    },
    {
      icon: <Plane className="w-5 h-5" />,
      label: 'Отпуск',
      value: `${rating.breakdown.vacationDays} дн.`,
      points: rating.breakdown.vacationDaysPoints,
      maxPoints: 10,
      what: `Использовано ${rating.breakdown.vacationDays} дней отпуска за месяц.`,
      why: 'Отдых нужен для перезагрузки, но в меру.',
      how: rating.breakdown.vacationDaysPoints <= 0
        ? 'Планируй отпуск заранее и не превышай лимиты (12 дней/мес).'
        : 'Режим отдыха соблюдается.',
      color: 'bg-orange-200 text-orange-900'
    },
    {
      icon: <AlertTriangle className="w-5 h-5" />,
      label: 'Прогулы (Absence)',
      value: `${rating.breakdown.absenceDays} дн.`,
      points: rating.breakdown.absenceDaysPoints,
      maxPoints: 0,
      what: `Зафиксировано ${rating.breakdown.absenceDays} дней отсутствия (Absence).`,
      why: 'Отсутствие без уважительной причины влияет на рейтинг.',
      how: rating.breakdown.absenceDays > 0
        ? 'Избегай отсутствия без предупреждения.'
        : 'Дисциплина в норме.',
      color: 'bg-red-100 text-red-800'
    },
    {
      icon: <AlertTriangle className="w-5 h-5" />,
      label: 'Прогулы (Truancy)',
      value: `${rating.breakdown.truancyDays} дн.`,
      points: 0,
      maxPoints: 0,
      what: `Зафиксировано ${rating.breakdown.truancyDays} прогулов (Truancy).`,
      why: 'Грубое нарушение дисциплины.',
      how: rating.breakdown.truancyDays > 0
        ? 'Прогулы недопустимы.'
        : 'Прогулов нет.',
      color: 'bg-red-300 text-red-900'
    },
  ] : []

  // Рассчитываем итоговый рейтинг с учетом штрафов за прогулы
  const basePoints = metrics
    .filter(m => m.label !== 'Прогулы')
    .reduce((sum, m) => sum + m.points, 0)
  const absencePenalty = metrics.find(m => m.label === 'Прогулы')?.points || 0
  const totalPoints = Math.max(0, Math.min(100, basePoints + absencePenalty))
  const exclusionStatus = getExclusionStatus(rating.rating)

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
                <UserNickname userId={rating.userId} fallback="unknown" />
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

        {/* Exclusion Status */}
        <div className="mt-3">
          <div
            className="inline-flex items-center gap-2 px-3 py-1.5 rounded-lg border text-sm font-medium"
            style={{
              backgroundColor: `${exclusionStatus.color}15`,
              borderColor: `${exclusionStatus.color}40`,
              color: exclusionStatus.color
            }}
          >
            <div
              className="w-2 h-2 rounded-full animate-pulse"
              style={{ backgroundColor: exclusionStatus.color }}
            />
            <span>{exclusionStatus.label}</span>
          </div>
          <p className={`text-xs mt-1 ${mutedColor}`}>{exclusionStatus.description}</p>
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
                      </div>
                    </div>
                    <Info className={`w-4 h-4 flex-shrink-0 ml-2 ${mutedColor} transition-transform ${isExpanded ? 'rotate-180' : ''}`} />
                  </div>
                </button>

                {isExpanded && (
                  <div className={`px-4 pb-4 pt-2 border-t ${borderColor} ${softSurface}`}>
                    <div className="space-y-3 mt-1">
                      <div>
                        <span className={`text-[10px] uppercase font-bold tracking-wider opacity-60 ${headingColor}`}>Что это</span>
                        <p className={`text-sm ${theme === 'dark' ? 'text-gray-300' : 'text-gray-700'} leading-relaxed`}>{metric.what}</p>
                      </div>
                      <div>
                        <span className={`text-[10px] uppercase font-bold tracking-wider opacity-60 ${headingColor}`}>Почему это важно</span>
                        <p className={`text-sm ${theme === 'dark' ? 'text-gray-300' : 'text-gray-700'} leading-relaxed`}>{metric.why}</p>
                      </div>
                      <div>
                        <span className={`text-[10px] uppercase font-bold tracking-wider opacity-60 ${headingColor}`}>Как улучшить</span>
                        <div className={`mt-1 p-2 rounded-lg border ${theme === 'dark' ? 'bg-white/5 border-white/10' : 'bg-emerald-50 border-emerald-100'}`}>
                          <p className={`text-sm ${metric.points < metric.maxPoints ? 'text-emerald-600 dark:text-emerald-400' : 'text-gray-500 dark:text-gray-400'} font-medium`}>
                            {metric.how}
                          </p>
                        </div>
                      </div>
                    </div>
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
          <div className={`p-3 rounded-lg ${softSurface}`}>
            <div className={`text-xs ${mutedColor} mb-1`}>Прогулы (неделя)</div>
            <div className={`text-lg font-bold ${headingColor}`}>{rating.absenceDays} дней</div>
          </div>
          <div className={`p-3 rounded-lg ${softSurface}`}>
            <div className={`text-xs ${mutedColor} mb-1`}>Сигналы</div>
            <div className={`text-lg font-bold ${headingColor}`}>{rating.signals}/{rating.profitableSignals}</div>
          </div>
        </div>
      </div>
    </div>
  )
}



