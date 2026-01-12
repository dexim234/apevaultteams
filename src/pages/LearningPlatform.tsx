import { useState, useEffect } from 'react'
import { BookOpen, Clock, Users, Award, Play } from 'lucide-react'

// Simple cn utility inline
const cn = (...classes: (string | undefined | null | false)[]) => {
  return classes.filter(Boolean).join(' ')
}

export const LearningPlatform = () => {
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    // Simulate loading
    const timer = setTimeout(() => setLoading(false), 500)
    return () => clearTimeout(timer)
  }, [])

  if (loading) {
    return (
      <div className="flex items-center justify-center h-64">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-[#4E6E49]"></div>
      </div>
    )
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
        <div>
          <h1 className="text-2xl font-black text-[#4E6E49] dark:text-white uppercase tracking-wider">
            Учебная платформа
          </h1>
          <p className="text-sm text-gray-500 dark:text-gray-400 mt-1">
            Образовательные материалы для участников команды
          </p>
        </div>
        <button
          className={cn(
            "px-4 py-2 rounded-xl font-bold text-sm transition-all",
            "bg-[#4E6E49]/10 text-[#4E6E49] hover:bg-[#4E6E49]/20",
            "border border-[#4E6E49]/20 cursor-default"
          )}
        >
          В разработке
        </button>
      </div>

      {/* Coming Soon Card */}
      <div className={cn(
        "rounded-3xl p-8 border",
        "bg-gradient-to-br from-[#4E6E49]/5 to-emerald-500/5",
        "border-[#4E6E49]/20 dark:border-[#4E6E49]/30"
      )}>
        <div className="flex flex-col items-center justify-center text-center py-8">
          <div className={cn(
            "w-20 h-20 rounded-2xl flex items-center justify-center mb-6",
            "bg-[#4E6E49]/10 dark:bg-[#4E6E49]/20"
          )}>
            <BookOpen className="w-10 h-10 text-[#4E6E49]" />
          </div>
          
          <h2 className="text-2xl font-bold text-[#4E6E49] dark:text-white mb-2">
            Раздел в разработке
          </h2>
          
          <p className="text-gray-500 dark:text-gray-400 max-w-md mb-6">
            Мы готовим для вас качественные образовательные материалы по торговле, 
            анализу рынка и управлению рисками. Скоро здесь появятся уроки и курсы.
          </p>

          <div className={cn(
            "flex items-center gap-2 px-4 py-2 rounded-xl",
            "bg-white dark:bg-white/5 border border-gray-200 dark:border-white/10"
          )}>
            <Clock className="w-4 h-4 text-[#4E6E49]" />
            <span className="text-sm font-medium text-gray-600 dark:text-gray-300">
              Ожидаемый запуск: Q1 2026
            </span>
          </div>
        </div>
      </div>

      {/* Feature Preview Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        <div className={cn(
          "rounded-2xl p-5 border transition-all",
          "bg-white dark:bg-white/5 border-gray-200 dark:border-white/10",
          "hover:border-[#4E6E49]/30 dark:hover:border-[#4E6E49]/30"
        )}>
          <div className="flex items-center gap-3 mb-3">
            <div className={cn(
              "w-10 h-10 rounded-xl flex items-center justify-center",
              "bg-blue-500/10"
            )}>
              <BookOpen className="w-5 h-5 text-blue-500" />
            </div>
            <span className="text-xs font-bold uppercase tracking-wider text-gray-500 dark:text-gray-400">
              Курсы
            </span>
          </div>
          <p className="text-sm text-gray-600 dark:text-gray-300">
            Интерактивные курсы по трейдингу
          </p>
        </div>

        <div className={cn(
          "rounded-2xl p-5 border transition-all",
          "bg-white dark:bg-white/5 border-gray-200 dark:border-white/10",
          "hover:border-[#4E6E49]/30 dark:hover:border-[#4E6E49]/30"
        )}>
          <div className="flex items-center gap-3 mb-3">
            <div className={cn(
              "w-10 h-10 rounded-xl flex items-center justify-center",
              "bg-emerald-500/10"
            )}>
              <Play className="w-5 h-5 text-emerald-500" />
            </div>
            <span className="text-xs font-bold uppercase tracking-wider text-gray-500 dark:text-gray-400">
              Видео
            </span>
          </div>
          <p className="text-sm text-gray-600 dark:text-gray-300">
            Обучающие видеоматериалы
          </p>
        </div>

        <div className={cn(
          "rounded-2xl p-5 border transition-all",
          "bg-white dark:bg-white/5 border-gray-200 dark:border-white/10",
          "hover:border-[#4E6E49]/30 dark:hover:border-[#4E6E49]/30"
        )}>
          <div className="flex items-center gap-3 mb-3">
            <div className={cn(
              "w-10 h-10 rounded-xl flex items-center justify-center",
              "bg-amber-500/10"
            )}>
              <Award className="w-5 h-5 text-amber-500" />
            </div>
            <span className="text-xs font-bold uppercase tracking-wider text-gray-500 dark:text-gray-400">
              Тесты
            </span>
          </div>
          <p className="text-sm text-gray-600 dark:text-gray-300">
            Проверка знаний и сертификация
          </p>
        </div>

        <div className={cn(
          "rounded-2xl p-5 border transition-all",
          "bg-white dark:bg-white/5 border-gray-200 dark:border-white/10",
          "hover:border-[#4E6E49]/30 dark:hover:border-[#4E6E49]/30"
        )}>
          <div className="flex items-center gap-3 mb-3">
            <div className={cn(
              "w-10 h-10 rounded-xl flex items-center justify-center",
              "bg-purple-500/10"
            )}>
              <Users className="w-5 h-5 text-purple-500" />
            </div>
            <span className="text-xs font-bold uppercase tracking-wider text-gray-500 dark:text-gray-400">
              Вебинары
            </span>
          </div>
          <p className="text-sm text-gray-600 dark:text-gray-300">
            Живые разборы с экспертами
          </p>
        </div>
      </div>
    </div>
  )
}
