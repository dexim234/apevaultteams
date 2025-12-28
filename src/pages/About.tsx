// About community page (minimalist redesign)
import { useThemeStore } from '@/store/themeStore'
import { Info, ArrowUpRight, BookOpen, Mail, Sparkles } from 'lucide-react'
import { Link } from 'react-router-dom'
import valuesIllustration from '../../assets/image-779ddbd9-e512-4bda-8983-af1ab9237b7c.png'

export const About = () => {
  const { theme } = useThemeStore()
  const headingColor = theme === 'dark' ? 'text-white' : 'text-gray-900'
  const subTextColor = theme === 'dark' ? 'text-gray-400' : 'text-gray-600'

  const principles = [
    {
      title: 'Финансовая грамотность',
      note: 'Учимся управлять рисками, понимать токеномику и принимать решения на основе анализа, а не эмоций.',
      accent: 'from-emerald-200 to-teal-200',
    },
    {
      title: 'Приватность превыше всего',
      note: 'Уважаем личные границы и используем инструменты, защищающие цифровую идентичность.',
      accent: 'from-sky-200 to-blue-200',
    },
    {
      title: 'Образование и развитие',
      note: 'Учимся от основ блокчейна до продвинутых DeFi-стратегий и делимся знаниями.',
      accent: 'from-amber-200 to-orange-200',
    },
    {
      title: 'Честность и прозрачность',
      note: 'Внутри клуба — открытость, честные сделки и уважение. Доверие строим действиями.',
      accent: 'from-purple-200 to-indigo-200',
    },
    {
      title: 'Инновации и эксперименты',
      note: 'Тестируем новые протоколы, участвуем в DAO, не боимся быть первыми в трендах.',
      accent: 'from-pink-200 to-rose-200',
    },
    {
      title: 'Критическое мышление',
      note: 'Не следуем слепо за хайпом: анализируем, проверяем источники и опираемся на здравый смысл.',
      accent: 'from-cyan-200 to-teal-200',
    },
    {
      title: 'Глобальное мышление',
      note: 'Открыты к сотрудничеству с людьми из разных стран ради цифровой и финансовой свободы в рамках закона.',
      accent: 'from-lime-200 to-green-200',
    },
    {
      title: 'Свобода и ответственность',
      note: 'Ценим свободу крипты и понимаем её цену: зрелость, самоконтроль и ответственность за решения.',
      accent: 'from-gray-200 to-slate-200',
    },
  ]

  const fastFacts = [
    { label: 'Что такое ApeVault?', value: 'Клуб криптоэнтузиастов, где знания превращаются в действие.' },
    {
      label: 'Цель',
      value: 'Объединить инвесторов и трейдеров ради роста дохода и безопасности входа в рынок.',
    },
  ]

  return (
    <div className="space-y-7 sm:space-y-8">
      {/* Hero */}
      <div className="section-card rounded-3xl p-6 sm:p-8 border border-white/60 dark:border-white/10 shadow-2xl relative overflow-hidden">
        <div className="accent-dots" />
        <div className="absolute inset-y-0 right-0 w-1/3 pointer-events-none bg-gradient-to-l from-[#4E6E49]/10 to-transparent blur-2xl" />
        <div className="relative z-10 flex flex-col gap-5 lg:flex-row lg:items-center lg:justify-between">
          <div className="space-y-3 max-w-3xl">
            <div className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full border border-white/50 dark:border-white/10 bg-white/70 dark:bg-white/5 text-xs font-semibold uppercase tracking-[0.16em]">
              <Info className="w-4 h-4 text-[#4E6E49]" />
              ApeVault Community
            </div>
            <h1 className={`text-3xl sm:text-4xl lg:text-5xl font-extrabold leading-tight ${headingColor}`}>
              О нас и нашем сообществе
            </h1>
            <p className={`text-sm sm:text-base ${subTextColor} max-w-2xl`}>
              ApeVault — это пространство, где опытные криптоэнтузиасты объединяют знания и проверенные стратегии, чтобы
              безопасно заходить в рынок и расти вместе.
            </p>
            <div className="flex flex-wrap gap-2">
              {['Командные сессии', 'Проверенные стратегии', 'Прозрачные регламенты'].map((tag) => (
                <span
                  key={tag}
                  className={`px-3 py-1.5 rounded-full text-xs font-semibold border ${theme === 'dark'
                    ? 'border-white/10 bg-white/5 text-white'
                    : 'border-gray-200 bg-white text-gray-900'
                    }`}
                >
                  {tag}
                </span>
              ))}
            </div>
          </div>
          <div className="grid grid-cols-2 gap-3 w-full max-w-xs lg:max-w-sm">
            {[
              { label: 'Участников', value: '50+' },
              { label: 'Сессий / неделю', value: '10+' },
              { label: 'Уроков', value: '100+' },
              { label: 'Фокуса', value: '100% качество' },
            ].map((item) => (
              <div
                key={item.label}
                className={`rounded-2xl border p-3 sm:p-4 shadow-sm ${theme === 'dark' ? 'border-white/10 bg-white/5 text-white' : 'border-gray-200 bg-white text-gray-900'
                  }`}
              >
                <p className="text-[11px] uppercase tracking-wide opacity-70">{item.label}</p>
                <p className="text-xl font-extrabold leading-tight mt-1">{item.value}</p>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* What is ApeVault */}
      <div className="section-card rounded-3xl p-6 sm:p-7 border border-white/60 dark:border-white/10 shadow-xl relative overflow-hidden">
        <div className="absolute top-0 right-0 w-40 h-40 bg-gradient-to-br from-emerald-500/10 to-blue-500/10 rounded-full blur-3xl -mr-16 -mt-16" />
        <div className="relative z-10 space-y-4">
          <h2 className={`text-2xl sm:text-3xl font-extrabold ${headingColor} flex items-center gap-2`}>
            <Sparkles className="w-6 h-6 text-[#4E6E49]" />
            Что такое ApeVault?
          </h2>
          <div className="grid gap-4 sm:grid-cols-2">
            {fastFacts.map((item) => (
              <div
                key={item.label}
                className={`rounded-2xl border p-4 sm:p-5 flex gap-3 items-start ${theme === 'dark' ? 'border-white/10 bg-white/5' : 'border-gray-200 bg-white'
                  }`}
              >
                <div className="p-2 rounded-xl bg-gradient-to-br from-[#4E6E49] to-emerald-600 text-white shadow-lg">
                  <ArrowUpRight className="w-4 h-4" />
                </div>
                <div className="space-y-1">
                  <p className="text-xs uppercase tracking-wide text-[#4E6E49] font-semibold">{item.label}</p>
                  <p className={`text-sm sm:text-base leading-relaxed ${headingColor}`}>{item.value}</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Principles */}
      <div className="section-card rounded-3xl p-6 sm:p-7 border border-white/60 dark:border-white/10 shadow-xl relative overflow-hidden">
        <div className="absolute -left-10 top-0 w-52 h-52 bg-gradient-to-br from-amber-400/10 to-rose-400/10 rounded-full blur-3xl" />
        <div className="absolute -right-10 bottom-0 w-52 h-52 bg-gradient-to-br from-blue-400/10 to-emerald-400/10 rounded-full blur-3xl" />
        <div className="relative z-10 space-y-5">
          <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between gap-3">
            <h2 className={`text-2xl sm:text-3xl font-extrabold ${headingColor}`}>
              Принципы, которые держат нас на вершине
            </h2>
            <div className="flex gap-2">
              <Link to="/rules" className="pill justify-center text-center" data-active="false">
                Ознакомиться с правилами
                <ArrowUpRight className="w-4 h-4" />
              </Link>
              <a
                href="#contacts"
                className="pill"
                data-active="false"
              >
                Контакты
                <ArrowUpRight className="w-4 h-4" />
              </a>
            </div>
          </div>

          <div className="grid lg:grid-cols-[1fr_420px_1fr] gap-6 items-center">
            <div className="space-y-3">
              {principles.slice(0, 4).map((item) => (
                <div
                  key={item.title}
                  className={`rounded-2xl border px-4 py-3 flex items-start gap-3 ${theme === 'dark' ? 'border-white/10 bg-white/5' : 'border-gray-200 bg-white/90'}`}
                >
                  <div className={`p-2 rounded-xl text-gray-900 bg-gradient-to-br ${item.accent}`}>
                    <ArrowUpRight className="w-4 h-4" />
                  </div>
                  <div className="space-y-1">
                    <p className={`text-sm sm:text-base font-semibold ${headingColor}`}>{item.title}</p>
                    {item.note && <p className={`text-xs ${subTextColor}`}>{item.note}</p>}
                  </div>
                </div>
              ))}
            </div>

            <div className={`rounded-3xl border shadow-xl overflow-hidden relative ${theme === 'dark' ? 'border-white/10 bg-white/5' : 'border-gray-200 bg-white/95'}`}>
              <img
                src={valuesIllustration}
                alt="Принципы ApeVault"
                className="w-full h-full object-contain"
              />
              <div className="absolute inset-0 pointer-events-none bg-gradient-to-b from-transparent via-transparent to-white/0" />
            </div>

            <div className="space-y-3">
              {principles.slice(4).map((item) => (
                <div
                  key={item.title}
                  className={`rounded-2xl border px-4 py-3 flex items-start gap-3 ${theme === 'dark' ? 'border-white/10 bg-white/5' : 'border-gray-200 bg-white/90'}`}
                >
                  <div className={`p-2 rounded-xl text-gray-900 bg-gradient-to-br ${item.accent}`}>
                    <ArrowUpRight className="w-4 h-4" />
                  </div>
                  <div className="space-y-1">
                    <p className={`text-sm sm:text-base font-semibold ${headingColor}`}>{item.title}</p>
                    {item.note && <p className={`text-xs ${subTextColor}`}>{item.note}</p>}
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>

      {/* Rules link */}
      <div
        id="rules"
        className="section-card rounded-3xl p-6 sm:p-7 border border-white/60 dark:border-white/10 shadow-xl relative overflow-hidden"
      >
        <div className="absolute inset-0 bg-gradient-to-br from-indigo-100/50 via-white/40 to-purple-100/40 dark:from-indigo-900/30 dark:via-transparent dark:to-purple-900/20" />
        <div className="relative z-10 grid gap-5 sm:grid-cols-[1.15fr_0.85fr] items-center">
          <div className="space-y-3">
            <div className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full bg-white/80 dark:bg-white/10 border border-white/60 dark:border-white/10 text-xs font-semibold tracking-wide text-indigo-700 dark:text-white">
              <BookOpen className="w-4 h-4" />
              Правила сообщества
            </div>
            <h2 className={`text-2xl sm:text-3xl font-extrabold ${headingColor}`}>
              Простой регламент, чтобы оставаться на одной волне
            </h2>
            <p className={`text-sm sm:text-base ${subTextColor}`}>
              Подробно описали процессы, безопасность и взаимодействие, чтобы каждый чувствовал прозрачность и поддержку.
            </p>
            <div className="flex flex-wrap gap-2">
              {['Безопасность', 'Честные сделки', 'Уважение', 'Прозрачность'].map((tag) => (
                <span
                  key={tag}
                  className={`px-3 py-1 rounded-full text-xs font-semibold border ${theme === 'dark' ? 'border-white/10 bg-white/5 text-white' : 'border-indigo-100 bg-white text-indigo-900'
                    }`}
                >
                  {tag}
                </span>
              ))}
            </div>
            <Link
              to="/rules"
              className="inline-flex items-center gap-2 px-5 py-3 rounded-xl bg-gradient-to-r from-indigo-500 to-purple-500 text-white font-semibold shadow-lg hover:shadow-xl hover:-translate-y-0.5 transition-all"
            >
              <BookOpen className="w-5 h-5" />
              <span>Ознакомиться с правилами</span>
              <ArrowUpRight className="w-4 h-4" />
            </Link>
          </div>
          <div
            className={`rounded-2xl border p-4 sm:p-5 shadow-lg ${theme === 'dark' ? 'border-white/10 bg-white/5' : 'border-white/80 bg-white/90'
              }`}
          >
            <div className="space-y-3">
              {[
                'Короткие правила для быстрых решений',
                'Фокус на безопасности и приватности',
                'Прозрачные роли и ответственность',
                'Действуем в рамках законодательства',
              ].map((rule) => (
                <div key={rule} className="flex items-start gap-2">
                  <div className="w-2 h-2 rounded-full bg-indigo-500 mt-2" />
                  <p className={`text-sm ${headingColor}`}>{rule}</p>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>

      {/* Contact */}
      <div
        id="contacts"
        className="section-card rounded-3xl p-6 sm:p-7 border border-white/60 dark:border-white/10 shadow-xl relative overflow-hidden"
      >
        <div className="absolute inset-0 bg-gradient-to-br from-rose-100/50 via-white/40 to-amber-100/40 dark:from-rose-900/25 dark:via-transparent dark:to-amber-900/20" />
        <div className="relative z-10 grid gap-5 sm:grid-cols-[0.9fr_1.1fr] items-center">
          <div
            className={`p-4 rounded-2xl shadow-lg inline-flex items-center gap-3 ${theme === 'dark' ? 'bg-gradient-to-br from-rose-600 to-amber-600 text-white' : 'bg-gradient-to-br from-rose-500 to-amber-500 text-white'
              }`}
          >
            <Mail className="w-7 h-7" />
            <div>
              <p className="text-xs uppercase tracking-wide">Контакты клуба</p>
              <p className="text-base font-semibold">Свяжитесь с нами</p>
            </div>
          </div>
          <div className="grid gap-3 sm:grid-cols-2">
            <div
              className={`rounded-2xl border p-4 shadow-md flex flex-col gap-2 ${theme === 'dark' ? 'border-white/10 bg-white/5' : 'border-white/80 bg-white/90'
                }`}
            >
              <p className="text-xs uppercase tracking-wide text-rose-600 dark:text-rose-200 font-semibold">Администратор</p>
              <p className={`text-lg font-extrabold ${headingColor}`}>@artyommedoed</p>
              <p className={`text-sm ${subTextColor}`}>По вопросам правил, доступов и регламентов.</p>
            </div>
            <div
              className={`rounded-2xl border p-4 shadow-md flex flex-col gap-2 ${theme === 'dark' ? 'border-white/10 bg-white/5' : 'border-white/80 bg-white/90'
                }`}
            >
              <p className="text-xs uppercase tracking-wide text-amber-600 dark:text-amber-200 font-semibold">Обратная связь</p>
              <p className={`text-lg font-extrabold ${headingColor}`}>Командный чат</p>
              <p className={`text-sm ${subTextColor}`}>Оперативные вопросы по продуктам и сессиям.</p>
              <a
                href="https://t.me/+vPZdPwPaaKI1MjAy"
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex items-center gap-2 text-sm font-semibold text-[#4E6E49] hover:text-emerald-600"
              >
                Присоединиться
                <ArrowUpRight className="w-4 h-4" />
              </a>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}

