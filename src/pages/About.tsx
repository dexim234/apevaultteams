import { useThemeStore } from '@/store/themeStore'
import { Info, ArrowUpRight, BookOpen, Mail, Sparkles, Users, Calendar, GraduationCap, Target, Shield, Zap, Globe, Lock, Layers } from 'lucide-react'
import { Link } from 'react-router-dom'

export const About = () => {
  const { theme } = useThemeStore()
  const headingColor = theme === 'dark' ? 'text-white' : 'text-gray-900'
  const subTextColor = theme === 'dark' ? 'text-gray-400' : 'text-gray-500'

  const principles = [
    {
      title: 'Финансовая грамотность',
      icon: GraduationCap,
      note: 'Управление рисками и анализ вместо эмоций.',
      accent: 'text-emerald-400',
      bg: 'bg-emerald-500/5 border-emerald-500/20'
    },
    {
      title: 'Приватность',
      icon: Lock,
      note: 'Защита цифровой идентичности и личных границ.',
      accent: 'text-blue-400',
      bg: 'bg-blue-500/5 border-blue-500/20'
    },
    {
      title: 'Образование',
      icon: BookOpen,
      note: 'От основ блокчейна до  DeFi-стратегий.',
      accent: 'text-amber-400',
      bg: 'bg-amber-500/5 border-amber-500/20'
    },
    {
      title: 'Прозрачность',
      icon: Shield,
      note: 'Честные сделки и открытость внутри клуба.',
      accent: 'text-purple-400',
      bg: 'bg-purple-500/5 border-purple-500/20'
    },
    {
      title: 'Инновации',
      icon: Zap,
      note: 'Тестируем новые протоколы и не боимся быть первыми.',
      accent: 'text-pink-400',
      bg: 'bg-pink-500/5 border-pink-500/20'
    },
    {
      title: 'Критическое мышление',
      icon: Target,
      note: 'Анализируем, проверяем, не следуем за хайпом.',
      accent: 'text-cyan-400',
      bg: 'bg-cyan-500/5 border-cyan-500/20'
    },
    {
      title: 'Глобальность',
      icon: Globe,
      note: 'Сотрудничество ради свободы в рамках закона.',
      accent: 'text-lime-400',
      bg: 'bg-lime-500/5 border-lime-500/20'
    },
    {
      title: 'Ответственность',
      icon: Users,
      note: 'Зрелость и самоконтроль в принятии решений.',
      accent: 'text-slate-400',
      bg: 'bg-slate-500/5 border-slate-500/20'
    },
  ]

  const glassCard = theme === 'dark'
    ? 'bg-[#151a21]/60 border-white/5 backdrop-blur-md'
    : 'bg-white border-gray-100 shadow-sm'

  return (
    <div className="space-y-8 animate-fade-in pb-12 font-sans">
      {/* Header */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div className="flex items-center gap-4">
          <div className="p-3 rounded-2xl bg-[#4E6E49]/10 border border-[#4E6E49]/20">
            <Info className="w-8 h-8 text-[#4E6E49]" />
          </div>
          <div>
            <h1 className={`text-3xl font-black ${headingColor} flex items-center gap-3`}>
              AVF INFO
            </h1>
            <p className={subTextColor}>
              О нас, наши ценности и правила сообщества
            </p>
          </div>
        </div>
      </div>

      {/* Main Grid - Bento Style */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">

        {/* Main Info Card (Span 2) */}
        <div className={`col-span-1 lg:col-span-2 rounded-3xl p-8 border relative overflow-hidden group ${glassCard}`}>
          <div className="absolute top-0 right-0 w-64 h-64 bg-[#4E6E49]/10 rounded-full blur-3xl -mr-16 -mt-16 pointer-events-none group-hover:bg-[#4E6E49]/20 transition-all duration-500" />

          <div className="relative z-10 space-y-6">
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-[#4E6E49]/10 border border-[#4E6E49]/20 text-[#4E6E49] text-xs font-bold uppercase tracking-wider">
              <Sparkles className="w-3 h-3" />
              ApeVault Community
            </div>

            <h2 className={`text-4xl sm:text-5xl font-black tracking-tight leading-tight ${headingColor}`}>
              Где знания <br />
              <span className="text-transparent bg-clip-text bg-gradient-to-r from-[#4E6E49] to-emerald-400">
                превращаются в действие
              </span>
            </h2>

            <p className={`text-lg leading-relaxed max-w-2xl ${subTextColor}`}>
              ApeVault Frontier — закрытая среда для тех, кто понимает рынок глубже заголовков и хайпа.<br /><br />
              Мы создаём пространство для аккуратного входа в рынок, глубокой аналитики и совместного роста, где во главу угла поставлены качество решений и ответственность за результат.<br /><br />
              Здесь решения принимаются осознанно, а рост строится системно.
            </p>
          </div>
        </div>

        {/* Stats Column (Span 1) */}
        <div className="space-y-4">
          {/* Stat Card 1 */}
          <div className={`rounded-3xl p-6 border ${glassCard} relative overflow-hidden`}>
            <div className="flex justify-between items-start mb-2">
              <span className={`text-xs font-bold uppercase tracking-wider ${subTextColor}`}>Участников</span>
              <Users className="w-5 h-5 text-indigo-500" />
            </div>
            <div className={`text-4xl font-black ${headingColor}`}>50+</div>
            <div className="text-xs text-indigo-400 mt-2 font-medium">Активное комьюнити</div>
          </div>

          {/* Stat Card 2 */}
          <div className={`rounded-3xl p-6 border ${glassCard} relative overflow-hidden`}>
            <div className="flex justify-between items-start mb-2">
              <span className={`text-xs font-bold uppercase tracking-wider ${subTextColor}`}>Сессий / Неделю</span>
              <Calendar className="w-5 h-5 text-emerald-500" />
            </div>
            <div className={`text-4xl font-black ${headingColor}`}>10+</div>
            <div className="text-xs text-emerald-400 mt-2 font-medium">Регулярные созвоны</div>
          </div>

          {/* Stat Card 3 */}
          <div className={`rounded-3xl p-6 border ${glassCard} relative overflow-hidden`}>
            <div className="flex justify-between items-start mb-2">
              <span className={`text-xs font-bold uppercase tracking-wider ${subTextColor}`}>База знаний</span>
              <BookOpen className="w-5 h-5 text-amber-500" />
            </div>
            <div className={`text-4xl font-black ${headingColor}`}>100+</div>
            <div className="text-xs text-amber-400 mt-2 font-medium">Уроков и материалов</div>
          </div>
        </div>
      </div>

      {/* Principles Grid */}
      <div className="space-y-4">
        <h2 className={`text-2xl font-black ${headingColor} text-center md:text-left`}>Наши принципы</h2>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
          {principles.map((item, index) => (
            <div
              key={index}
              className={`relative overflow-hidden rounded-2xl p-5 border transition-all duration-300 hover:shadow-lg group ${
                theme === 'dark'
                  ? `${item.bg} hover:border-opacity-50`
                  : 'bg-white border-gray-100 hover:border-emerald-500/20'
              }`}
            >
              <div className="flex justify-between items-start mb-3">
                <div className="flex items-center gap-2">
                  <item.icon className={`w-4 h-4 ${item.accent}`} />
                  <span className={`text-xs font-bold uppercase tracking-wider ${theme === 'dark' ? 'text-gray-300' : 'text-gray-600'}`}>
                    {item.title}
                  </span>
                </div>
              </div>
              <div className="space-y-1">
                <div className={`text-sm font-medium leading-relaxed ${subTextColor}`}>
                  {item.note}
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Split Section: Strategies & Rules */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Strategies Block (Replaces Image) */}
        <div className={`rounded-3xl border p-8 relative overflow-hidden flex flex-col justify-between ${glassCard}`}>
          <div className={`absolute top-0 right-0 w-64 h-64 bg-emerald-500/10 rounded-full blur-3xl -mr-16 -mt-16 pointer-events-none`} />

          <div className="relative z-10">
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-emerald-500/10 border border-emerald-500/20 text-emerald-400 text-xs font-bold uppercase tracking-wider mb-6">
              <Layers className="w-3 h-3" />
              Стратегии
            </div>
            <h3 className={`text-3xl font-black mb-4 ${headingColor}`}>Наши стратегии</h3>
            <p className={`${subTextColor} mb-8 max-w-md`}>
              Авторские методики торговли и инвестирования, проверенные временем. Изучите наши подходы к рынку.
            </p>
          </div>

          <Link
            to="/fasol-signals-strategy"
            className="relative z-10 w-full sm:w-auto inline-flex items-center justify-center gap-2 px-6 py-3.5 bg-gradient-to-r from-emerald-500 to-teal-600 hover:from-emerald-400 hover:to-teal-500 text-white font-bold rounded-xl transition-all shadow-lg shadow-emerald-500/20 active:scale-95"
          >
            <span>Смотреть стратегии</span>
            <ArrowUpRight className="w-4 h-4" />
          </Link>
        </div>

        {/* Rules CTA */}
        <div className={`rounded-3xl border p-8 relative overflow-hidden flex flex-col justify-between ${glassCard}`}>
          <div className="absolute top-0 right-0 w-64 h-64 bg-indigo-500/10 rounded-full blur-3xl -mr-16 -mt-16 pointer-events-none" />

          <div className="relative z-10">
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-indigo-500/10 border border-indigo-500/20 text-indigo-400 text-xs font-bold uppercase tracking-wider mb-6">
              <BookOpen className="w-3 h-3" />
              Регламент
            </div>
            <h3 className={`text-3xl font-black mb-4 ${headingColor}`}>Правила сообщества</h3>
            <p className={`${subTextColor} mb-8 max-w-md`}>
              Мы подробно описали процессы, безопасность и принципы взаимодействия. Прозрачные правила — залог доверия и эффективности.
            </p>
          </div>

          <Link
            to="/rules"
            className="relative z-10 w-full sm:w-auto inline-flex items-center justify-center gap-2 px-6 py-3.5 bg-gradient-to-r from-indigo-500 to-purple-600 hover:from-indigo-400 hover:to-purple-500 text-white font-bold rounded-xl transition-all shadow-lg shadow-indigo-500/20 active:scale-95"
          >
            <span>Читать правила</span>
            <ArrowUpRight className="w-4 h-4" />
          </Link>
        </div>
      </div>

      {/* Contacts Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <div className={`rounded-3xl p-6 border flex items-center gap-5 ${glassCard} hover:border-[#4E6E49]/30 transition-colors`}>
          <div className="w-14 h-14 rounded-full bg-gradient-to-br from-rose-500 to-orange-500 flex items-center justify-center text-white shadow-lg">
            <Users className="w-7 h-7" />
          </div>
          <div>
            <div className="text-xs font-bold uppercase text-rose-500 mb-1">Администратор</div>
            <div className={`text-xl font-black ${headingColor}`}>@artyommedoed</div>
            <div className={`text-sm ${subTextColor} mt-1`}>Вопросы доступов и регламентов</div>
          </div>
        </div>

        <a
          href="https://t.me/+vPZdPwPaaKI1MjAy"
          target="_blank"
          rel="noopener noreferrer"
          className={`rounded-3xl p-6 border flex items-center gap-5 group ${glassCard} hover:border-emerald-500/30 transition-colors cursor-pointer`}
        >
          <div className="w-14 h-14 rounded-full bg-gradient-to-br from-[#4E6E49] to-emerald-400 flex items-center justify-center text-white shadow-lg group-hover:scale-110 transition-transform">
            <Mail className="w-7 h-7" />
          </div>
          <div>
            <div className="text-xs font-bold uppercase text-emerald-500 mb-1">Обратная связь</div>
            <div className={`text-xl font-black ${headingColor} flex items-center gap-2`}>
              Командный чат
              <ArrowUpRight className="w-5 h-5 opacity-50 group-hover:opacity-100 group-hover:translate-x-1 group-hover:-translate-y-1 transition-all" />
            </div>
            <div className={`text-sm ${subTextColor} mt-1`}>Оперативные вопросы и общение</div>
          </div>
        </a>
      </div>

    </div>
  )
}
