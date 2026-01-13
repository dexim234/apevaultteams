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
  console.log('RatingCard render - userId:', rating.userId, 'breakdown:', rating.breakdown)
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
    .filter(m => !m.label.includes('Прогулы'))
    .reduce((sum, m) => sum + m.points, 0)
  const absencePenalty = metrics.find(m => m.label === 'Прогулы (Absence)')?.points || 0
  const totalPoints = Math.max(0, Math.min(100, basePoints + absencePenalty))
  const exclusionStatus = getExclusionStatus(rating.rating)

  // Place badge - показываем только место без медали
  const placeBadge = (() => {
    if (!place) return null
    const rank = place.rank

    return (
      <div className={`inline-flex px-3 py-1.5 rounded-xl text-sm font-bold border-2 ${
        rank === 1
          ? 'bg-amber-500/10 border-amber-500/50 text-amber-600 dark:text-amber-400'
          : rank === 2
            ? 'bg-slate-500/10 border-slate-500/50 text-slate-500 dark:text-slate-400'
            : rank === 3
              ? 'bg-orange-500/10 border-orange-500/50 text-orange-500 dark:text-orange-400'
              : 'bg-gray-500/10 border-gray-500/50 text-gray-500 dark:text-gray-400'
      }`}>
        {rank} {rank === 1 ? 'место' : 'место'}
      </div>
    )
  })()

  return (
    <div className={`relative rounded-2xl p-6 ${cardBg} shadow-xl border ${borderColor} transition-all duration-300 hover:shadow-2xl hover:-translate-y-1 overflow-hidden`}>
      {/* Gradient overlay */}
      <div className="absolute inset-0 bg-gradient-to-br from-emerald-500/5 via-transparent to-blue-500/5 pointer-events-none" />

      {/* Header with name and rating */}
      <div className="relative mb-6 flex flex-col gap-4">
        <div className="flex items-start justify-between gap-3">
          <div className="min-w-0 flex-1">
            <p className={`text-[10px] uppercase tracking-[0.15em] font-bold ${mutedColor} mb-2`}>Участник команды</p>
            <h3 className={`text-3xl font-black ${headingColor} truncate mb-2 bg-gradient-to-r from-emerald-600 to-blue-600 bg-clip-text text-transparent dark:from-emerald-400 dark:to-blue-400`}>
              <UserNickname userId={rating.userId} fallback="unknown" />
            </h3>
            {placeBadge}
          <div className="flex flex-col items-end gap-1">
            <span className={`text-4xl font-black bg-gradient-to-br from-emerald-600 to-blue-600 bg-clip-text text-transparent dark:from-emerald-400 dark:to-blue-400`}>
              {rating.rating.toFixed(1)}%
            </span>
            <span className={`text-[10px] uppercase tracking-wider font-bold ${mutedColor}`}>Рейтинг</span>
          </div>
        </div>

        {/* Main rating progress bar */}
        <div className="space-y-2">
          <div className="relative w-full h-8 bg-gradient-to-r from-gray-200/50 to-gray-300/50 dark:from-gray-800/50 dark:to-gray-700/50 rounded-2xl overflow-hidden shadow-inner backdrop-blur-sm">
            <div
              className={`h-full transition-all duration-700 ease-out flex items-center justify-end pr-3 ${bandColor} relative overflow-hidden`}
              style={{
                width: barWidth,
                minWidth: rating.rating <= 0 ? '50px' : undefined,
              }}
            >
              <div className="absolute inset-0 bg-gradient-to-r from-white/20 to-transparent" />
              {rating.rating >= 5 && <span className="text-sm font-black text-white drop-shadow-lg relative z-10">{rating.rating.toFixed(1)}%</span>}
            </div>
          </div>
          <div className="flex justify-between items-center">
            <span className={`text-xs font-semibold ${mutedColor}`}>Общий прогресс</span>
            <span className={`text-xs font-black ${headingColor} px-2 py-0.5 rounded-lg ${theme === 'dark' ? 'bg-white/10' : 'bg-gray-100'}`}>
              {totalPoints}/100
            </span>
          </div>
        </div>

        {/* Exclusion Status */}
        <div className="mt-2">
          <div
            className="inline-flex items-center gap-2 px-4 py-2 rounded-xl border-2 text-sm font-bold shadow-lg backdrop-blur-sm"
            style={{
              backgroundColor: `${exclusionStatus.color}20`,
              borderColor: `${exclusionStatus.color}60`,
              color: exclusionStatus.color
            }}
          >
            <div
              className="w-2.5 h-2.5 rounded-full animate-pulse shadow-lg"
              style={{ backgroundColor: exclusionStatus.color, boxShadow: `0 0 10px ${exclusionStatus.color}` }}
            />
            <span className="uppercase tracking-wide text-xs">{exclusionStatus.label}</span>
          </div>
          <p className={`text-xs mt-2 ${mutedColor} font-medium`}>{exclusionStatus.description}</p>
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



