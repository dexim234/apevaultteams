import { Layout } from '@/components/Layout'
import { useThemeStore } from '@/store/themeStore'
import {
  BookOpen,
  ShieldCheck,
  AlertTriangle,
  ClipboardCheck,
  Lock,
  Clock,
  ArrowUpRight,
  Scale,
  ScrollText,
  Info,
  Download,
} from 'lucide-react'

const SectionCard = ({
  title,
  description,
  children,
}: {
  title: string
  description?: string
  children: React.ReactNode
}) => {
  const { theme } = useThemeStore()
  const headingColor = theme === 'dark' ? 'text-white' : 'text-gray-900'
  const subTextColor = theme === 'dark' ? 'text-gray-400' : 'text-gray-600'

  return (
    <div className="section-card rounded-3xl p-6 sm:p-7 border border-white/60 dark:border-white/10 shadow-xl relative overflow-hidden">
      <div className="relative z-10 space-y-4">
        <div className="flex items-start gap-3">
          <div className="p-2 rounded-xl bg-gradient-to-br from-[#4E6E49]/20 to-emerald-500/15 text-[#4E6E49]">
            <BookOpen className="w-5 h-5" />
          </div>
          <div className="space-y-1">
            <h2 className={`text-xl sm:text-2xl font-extrabold ${headingColor}`}>{title}</h2>
            {description && <p className={`text-sm ${subTextColor}`}>{description}</p>}
          </div>
        </div>
        {children}
      </div>
    </div>
  )
}

export const Rules = () => {
  const { theme } = useThemeStore()
  const headingColor = theme === 'dark' ? 'text-white' : 'text-gray-900'
  const subTextColor = theme === 'dark' ? 'text-gray-400' : 'text-gray-600'

  const principles = [
    'последовательной эскалации',
    'объективности и равного применения',
    'недопустимости злоупотребления полномочиями',
    'исключения спорных трактовок и субъективности',
  ]

  const minorViolations = [
    'единичные опоздания (не более 1 раза за календарную неделю)',
    'некорректное выполнение инструкций без последствий вследствие заболевания или сбоев в ПО',
    'нарушение регламента общения, не приводящее к конфликту',
  ]

  const mediumViolations = [
    'повторяющиеся нарушения регламента',
    'несоблюдение правил торговой сессии',
    'недостаточная подготовка к сессии',
    'игнорирование инструкций ведущего',
    'нарушение процедур безопасности данных или доступа',
  ]

  const severeViolations = [
    'оскорбления участников',
    'провокации и попытки вызвать конфликт',
    'манипуляции и мошеннические действия',
    'действия, создающие финансовые, репутационные или организационные риски',
    'подрыв дисциплины и порядка в сообществе',
  ]

  const glossary = [
    { term: 'Нарушение', text: 'любое действие или бездействие, противоречащее регламентам ApeVault' },
    { term: 'Предупреждение', text: 'официальное уведомление о нарушении' },
    { term: 'Выговор', text: 'фиксируемая мера повышенной строгости при повторных нарушениях' },
    { term: 'Ведущий торговой сессии', text: 'управляет процессом и следит за соблюдением регламента на сессии' },
    { term: 'Ответственный за сообщество', text: 'назначенное лицо, управляющее дисциплиной и коммуникацией' },
    { term: 'Повторное нарушение', text: 'нарушение в течение 30 календарных дней после предыдущего' },
  ]

  return (
    <Layout>
      <div className="space-y-7 sm:space-y-8">
        <div className="section-card rounded-3xl p-6 sm:p-8 border border-white/60 dark:border-white/10 shadow-2xl relative overflow-hidden">
          <div className="accent-dots" />
          <div className="absolute inset-y-0 right-0 w-1/3 pointer-events-none bg-gradient-to-l from-[#4E6E49]/12 to-transparent blur-3xl" />
          <div className="relative z-10 flex flex-col gap-5 lg:flex-row lg:items-center lg:justify-between">
            <div className="space-y-4 max-w-3xl">
              <div className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full border border-white/50 dark:border-white/10 bg-white/70 dark:bg-white/5 text-xs font-semibold uppercase tracking-[0.16em] text-[#4E6E49]">
                ApeVault Standard Operating Code — ASOC
              </div>
              <h1 className={`text-3xl sm:text-4xl lg:text-5xl font-extrabold leading-tight ${headingColor}`}>
                Кодекс операционных процедур и регламентов платформы ApeVault
              </h1>
              <p className={`text-sm sm:text-base ${subTextColor}`}>
                Единые правила ответственности, дисциплинарных мер и прозрачных процедур для команды ApeVault.
              </p>
              <div className="flex flex-wrap gap-2">
                {['Ответственность', 'Прозрачность', 'Безопасность', 'Справедливость'].map((tag) => (
                  <span
                    key={tag}
                    className={`px-3 py-1.5 rounded-full text-xs font-semibold border ${
                      theme === 'dark'
                        ? 'border-white/10 bg-white/5 text-white'
                        : 'border-gray-200 bg-white text-gray-900'
                    }`}
                  >
                    {tag}
                  </span>
                ))}
              </div>
            </div>
            <div className={`rounded-3xl border shadow-xl p-4 sm:p-5 w-full lg:max-w-sm ${theme === 'dark' ? 'border-white/10 bg-white/5' : 'border-gray-200 bg-white'}`}>
              <div className="flex items-center gap-3">
                <div className="p-3 rounded-2xl bg-gradient-to-br from-[#4E6E49] to-emerald-600 text-white shadow-lg">
                  <ShieldCheck className="w-6 h-6" />
                </div>
                <div>
                  <p className="text-xs uppercase tracking-wide text-[#4E6E49] font-semibold">Назначение раздела</p>
                  <p className={`text-base font-semibold ${headingColor}`}>Поддержание порядка и профессионализма команды</p>
                </div>
              </div>
              <div className="mt-4 space-y-3">
                <div className="flex items-center gap-2 text-sm font-semibold text-[#4E6E49]">
                  <ArrowUpRight className="w-4 h-4" />
                  Публичная версия правил доступна на сайте
                </div>
                <p className={`text-xs ${subTextColor}`}>
                  Используйте кнопку «Правила» в навигации или в профиле, чтобы быстро открыть этот раздел.
                </p>
                <a
                  href="/rules.pdf"
                  download
                  className={`inline-flex items-center gap-2 px-4 py-2.5 rounded-xl border transition-all shadow-sm hover:shadow-md hover:-translate-y-0.5 ${
                    theme === 'dark'
                      ? 'border-white/20 bg-white/10 text-white hover:bg-white/15'
                      : 'border-[#4E6E49]/30 bg-[#4E6E49]/10 text-[#4E6E49] hover:bg-[#4E6E49]/15'
                  }`}
                >
                  <Download className="w-4 h-4" />
                  <span className="text-sm font-semibold">Скачать правила (PDF)</span>
                </a>
              </div>
            </div>
          </div>
        </div>

        <SectionCard
          title="Политика ответственности и меры дисциплинарного воздействия"
          description="Единый порядок применения мер для поддержания порядка, прозрачности и профессионального уровня."
        >
          <div className={`grid gap-4 sm:grid-cols-2 ${theme === 'dark' ? 'text-gray-200' : 'text-gray-900'}`}>
            <div className={`rounded-2xl border p-4 sm:p-5 ${theme === 'dark' ? 'border-white/10 bg-white/5' : 'border-gray-200 bg-white'}`}>
              <div className="flex items-center gap-2 text-sm font-semibold text-[#4E6E49]">
                <ClipboardCheck className="w-4 h-4" />
                Цели дисциплинарной политики
              </div>
              <p className={`text-sm mt-2 ${subTextColor}`}>
                Обеспечить соблюдение регламентов, процедур и рабочих стандартов команды.
              </p>
            </div>
            <div className={`rounded-2xl border p-4 sm:p-5 ${theme === 'dark' ? 'border-white/10 bg-white/5' : 'border-gray-200 bg-white'}`}>
              <div className="flex items-center gap-2 text-sm font-semibold text-[#4E6E49]">
                <Scale className="w-4 h-4" />
                Принципы применения мер
              </div>
              <ul className={`text-sm mt-2 space-y-1 ${subTextColor}`}>
                {principles.map((item) => (
                  <li key={item}>• {item}</li>
                ))}
              </ul>
            </div>
          </div>
          <div className={`mt-3 text-sm ${subTextColor}`}>
            Меры ответственности применяются в зависимости от тяжести, регулярности и последствий нарушения.
          </div>
        </SectionCard>

        <SectionCard
          title="Унифицированный регламент торговой деятельности ApeVault"
          description="Нормы поведения на торговых сессиях, полномочия ведущего, перерывы, записи и конфиденциальность."
        >
          <div className={`space-y-4 text-sm ${subTextColor}`}>
            <div className={`rounded-2xl border p-4 sm:p-5 ${theme === 'dark' ? 'border-white/10 bg-white/5' : 'border-gray-200 bg-white'}`}>
              <p className="text-base font-semibold text-[#4E6E49]">1. Общие положения</p>
              <ul className="mt-2 space-y-1">
                <li>• Регламент задаёт нормы участия, дисциплину, полномочия ведущего и ответственность.</li>
                <li>• Все участники обязаны ознакомиться с разделом до начала торговой деятельности.</li>
              </ul>
            </div>

            <div className={`rounded-2xl border p-4 sm:p-5 ${theme === 'dark' ? 'border-white/10 bg-white/5' : 'border-gray-200 bg-white'}`}>
              <p className="text-base font-semibold text-[#4E6E49]">2. Права и полномочия ведущего</p>
              <p className="mt-2 font-semibold text-[#4E6E49]">Полномочия:</p>
              <ul className="mt-1 space-y-1">
                <li>• Давать обязательные распоряжения по порядку, действиям, стратегии и дисциплине.</li>
                <li>• Требовать соблюдения тайминга, регламента и корректного поведения.</li>
                <li>• Приостанавливать участие нарушающих участников.</li>
                <li>• Объявлять перерывы и завершение сессии.</li>
                <li>• Фиксировать нарушения, выдавать предупреждения/выговоры, вводить временный запрет на участие.</li>
              </ul>
              <p className="mt-3 font-semibold text-[#4E6E49]">Ограничения:</p>
              <ul className="mt-1 space-y-1">
                <li>• Не изменяет дисциплинарные меры, установленные регламентом.</li>
                <li>• Не принимает решения об исключении из команды (решает ответственный за команду).</li>
                <li>• Не меняет торговую стратегию вне утверждённой методологии или плана сессии.</li>
              </ul>
            </div>

            <div className={`rounded-2xl border p-4 sm:p-5 space-y-3 ${theme === 'dark' ? 'border-white/10 bg-white/5' : 'border-gray-200 bg-white'}`}>
              <p className="text-base font-semibold text-[#4E6E49]">3. Порядок проведения сессии</p>
              <div>
                <p className="font-semibold">Начало и окончание:</p>
                <ul className="mt-1 space-y-1">
                  <li>• Старт строго по времени слота.</li>
                  <li>• Подключение за 3–5 минут до старта обязательно.</li>
                  <li>• Окончание объявляет ведущий, не позднее 30 минут после окончания слота.</li>
                </ul>
              </div>
              <div>
                <p className="font-semibold">Поведение во время торгов:</p>
                <p className="text-xs uppercase tracking-wide opacity-70 mt-1">Запрещено:</p>
                <ul className="space-y-1">
                  <li>• Перебивать ведущего или участников.</li>
                  <li>• Отвлекать команду сторонними вопросами.</li>
                  <li>• Включать микрофон без необходимости, создавать шум.</li>
                  <li>• Саботировать процесс или предлагать несогласованные решения.</li>
                  <li>• Коммуницировать с кем-либо вне участников сессии.</li>
                </ul>
                <p className="text-xs uppercase tracking-wide opacity-70 mt-2">Обязано:</p>
                <ul className="space-y-1">
                  <li>• Следовать инструкциям ведущего и оперативно исполнять распоряжения.</li>
                  <li>• Сохранять корректность и нейтральность в коммуникации.</li>
                  <li>• Обеспечивать техническую готовность: связь, устройство, ПО.</li>
                </ul>
              </div>
            </div>

            <div className={`rounded-2xl border p-4 sm:p-5 space-y-2 ${theme === 'dark' ? 'border-white/10 bg-white/5' : 'border-gray-200 bg-white'}`}>
              <p className="text-base font-semibold text-[#4E6E49]">4. Политика перерывов</p>
              <ul className="space-y-1">
                <li>• Краткий перерыв — до 10 минут каждые 45 минут.</li>
                <li>• Большой перерыв — до 45 минут каждые 3 часа активной торговли.</li>
                <li>• Все перерывы объявляет ведущий.</li>
                <li>• Самовольные перерывы запрещены; нарушение дисциплины, если не согласовано в трекере слотов и с ответственным.</li>
              </ul>
            </div>

            <div className={`rounded-2xl border p-4 sm:p-5 space-y-2 ${theme === 'dark' ? 'border-white/10 bg-white/5' : 'border-gray-200 bg-white'}`}>
              <p className="text-base font-semibold text-[#4E6E49]">5. Правила записи сессий</p>
              <ul className="space-y-1">
                <li>• Запись включает только ведущий или ответственный за сообщество.</li>
                <li>• Хранение — в закрытом архиве команды; доступ: ведущий, управляющий сообществом, ответственные аналитики.</li>
                <li>• Распространение вне команды запрещено.</li>
                <li>• Срок хранения определяет ведущий: до 3 лет, но ≥14 календарных дней.</li>
              </ul>
            </div>

            <div className={`rounded-2xl border p-4 sm:p-5 space-y-2 ${theme === 'dark' ? 'border-white/10 bg-white/5' : 'border-gray-200 bg-white'}`}>
              <p className="text-base font-semibold text-[#4E6E49]">6. Конфликт интересов</p>
              <ul className="space-y-1">
                <li>• Запрещено действовать в интересах сторонних групп/конкурентов.</li>
                <li>• Запрещено передавать стратегию, аналитику, материалы, алгоритмы, сигналы и методики ApeVault третьим лицам.</li>
                <li>• Запрещено получать вознаграждение за внешние консультации, использующие опыт или данные ApeVault.</li>
                <li>• Запрещено участвовать в параллельных торговых группах, если это создаёт риск конфликта или утечки информации.</li>
              </ul>
            </div>

            <div className={`rounded-2xl border p-4 sm:p-5 space-y-2 ${theme === 'dark' ? 'border-white/10 bg-white/5' : 'border-gray-200 bg-white'}`}>
              <p className="text-base font-semibold text-[#4E6E49]">7. Конфиденциальность</p>
              <ul className="space-y-1">
                <li>• Все материалы, данные, аналитика, торговые решения и внутренняя коммуникация — интеллектуальная собственность ApeVault.</li>
                <li>• Запрещено копировать, распространять или передавать информацию третьим лицам.</li>
                <li>• Запрещено создавать производные материалы без согласования с ответственным.</li>
                <li>• Запрещено публиковать скриншоты, отчёты или содержимое сессий в открытых источниках (кроме чата команды).</li>
                <li>• Требование к среде: наушники и отсутствие посторонних рядом; не допускать, чтобы экран/звук были доступны третьим лицам.</li>
                <li className="font-semibold text-[#4E6E49]">Нарушение положений конфиденциальности — основание для немедленного исключения.</li>
              </ul>
            </div>
          </div>
        </SectionCard>

        <SectionCard
          title="Классификация нарушений"
          description="Три уровня тяжести определяют, как быстро применяются ограничения."
        >
          <div className="grid gap-4 lg:grid-cols-3">
            <div className={`rounded-2xl border p-4 sm:p-5 ${theme === 'dark' ? 'border-white/10 bg-white/5' : 'border-amber-100 bg-white/95'}`}>
              <div className="flex items-center gap-2 text-sm font-semibold text-amber-600 dark:text-amber-300">
                <Info className="w-4 h-4" />
                Незначительные
              </div>
              <ul className={`text-sm mt-2 space-y-1 ${subTextColor}`}>
                {minorViolations.map((item) => (
                  <li key={item}>• {item}</li>
                ))}
              </ul>
            </div>
            <div className={`rounded-2xl border p-4 sm:p-5 ${theme === 'dark' ? 'border-white/10 bg-white/5' : 'border-orange-100 bg-white/95'}`}>
              <div className="flex items-center gap-2 text-sm font-semibold text-orange-600 dark:text-orange-300">
                <AlertTriangle className="w-4 h-4" />
                Средние
              </div>
              <ul className={`text-sm mt-2 space-y-1 ${subTextColor}`}>
                {mediumViolations.map((item) => (
                  <li key={item}>• {item}</li>
                ))}
              </ul>
            </div>
            <div className={`rounded-2xl border p-4 sm:p-5 ${theme === 'dark' ? 'border-white/10 bg-white/5' : 'border-rose-100 bg-white/95'}`}>
              <div className="flex items-center gap-2 text-sm font-semibold text-rose-600 dark:text-rose-300">
                <Lock className="w-4 h-4" />
                Грубые
              </div>
              <ul className={`text-sm mt-2 space-y-1 ${subTextColor}`}>
                {severeViolations.map((item) => (
                  <li key={item}>• {item}</li>
                ))}
              </ul>
            </div>
          </div>
        </SectionCard>

        <SectionCard
          title="Меры дисциплинарного воздействия и ограничения"
          description="Применяются последовательно, кроме случаев грубых нарушений."
        >
          <div className="grid gap-4 md:grid-cols-2">
            <div className={`rounded-2xl border p-4 sm:p-5 space-y-2 ${theme === 'dark' ? 'border-white/10 bg-white/5' : 'border-gray-200 bg-white'}`}>
              <div className="flex items-center gap-2 text-sm font-semibold text-[#4E6E49]">
                <ClipboardCheck className="w-4 h-4" />
                Порядок эскалации
              </div>
              <ul className={`text-sm space-y-1 ${subTextColor}`}>
                <li>• Напоминания — не более 1 в неделю, без последствий.</li>
                <li>• Предупреждения — не более 2 в неделю, при повторении незначительных или единичном среднем нарушении.</li>
                <li>• Выговоры — не более 2 в неделю, назначаются ведущим сессии или ответственным за сообщество.</li>
              </ul>
            </div>
            <div className={`rounded-2xl border p-4 sm:p-5 space-y-2 ${theme === 'dark' ? 'border-white/10 bg-white/5' : 'border-gray-200 bg-white'}`}>
              <div className="flex items-center gap-2 text-sm font-semibold text-[#4E6E49]">
                <Lock className="w-4 h-4" />
                Ограничительные меры
              </div>
              <ul className={`text-sm space-y-1 ${subTextColor}`}>
                <li>• Ограничение доступа к торговым сессиям: 1-е — ≥3 дней; повторное — 1 неделя; систематическое — 2 недели; дальше — исключение без восстановления.</li>
                <li>• Немедленное исключение без эскалации за грубое нарушение, оскорбления, провокации или угрозу финансам/безопасности/репутации.</li>
              </ul>
            </div>
          </div>
        </SectionCard>

        <SectionCard
          title="Финансовые последствия"
          description="Что происходит при систематических нарушениях и невыполнении мер."
        >
          <div className={`rounded-2xl border p-4 sm:p-5 space-y-2 ${theme === 'dark' ? 'border-white/10 bg-white/5' : 'border-gray-200 bg-white'}`}>
            <ul className={`text-sm space-y-2 ${subTextColor}`}>
              <li>• При систематических нарушениях и игнорировании мер может быть отказано в удовлетворении заявки на вывод средств, включая заработок за успешные сессии.</li>
              <li>• Перераспределение заработка: удержанные средства делятся между участниками, кроме тех, кто допустил два и более нарушений в неделю или более 6 нарушений в месяц.</li>
              <li>• Добровольно внесённые в пул или кошелёк команды средства не возвращаются при досрочном выходе или исключении за нарушения.</li>
            </ul>
          </div>
        </SectionCard>

        <SectionCard
          title="Фиксация нарушений и апелляции"
          description="Прозрачный процесс учёта нарушений и возможность обжаловать решение."
        >
          <div className="grid gap-4 md:grid-cols-2">
            <div className={`rounded-2xl border p-4 sm:p-5 space-y-2 ${theme === 'dark' ? 'border-white/10 bg-white/5' : 'border-gray-200 bg-white'}`}>
              <div className="flex items-center gap-2 text-sm font-semibold text-[#4E6E49]">
                <ScrollText className="w-4 h-4" />
                Порядок фиксации
              </div>
              <ul className={`text-sm space-y-1 ${subTextColor}`}>
                <li>• Все нарушения фиксируются ответственным за сообщество в отдельной ветви командного чата Telegram.</li>
                <li>• Обязательная фиксация: дата и время, тип нарушения, краткое описание ситуации, применённая мера.</li>
              </ul>
            </div>
            <div className={`rounded-2xl border p-4 sm:p-5 space-y-2 ${theme === 'dark' ? 'border-white/10 bg-white/5' : 'border-gray-200 bg-white'}`}>
              <div className="flex items-center gap-2 text-sm font-semibold text-[#4E6E49]">
                <Clock className="w-4 h-4" />
                Процедура апелляции
              </div>
              <ul className={`text-sm space-y-1 ${subTextColor}`}>
                <li>• Апелляция подаётся в течение 24 часов с момента уведомления о мере.</li>
                <li>• Подача: ответственному за сообщество или назначенному куратору.</li>
                <li>• Рассмотрение: до 60 часов; решение окончательное.</li>
              </ul>
            </div>
          </div>
        </SectionCard>

        <SectionCard
          title="Принцип равного применения"
          description="Меры действуют одинаково для всех участников."
        >
          <div className={`rounded-2xl border p-4 sm:p-5 space-y-1 ${theme === 'dark' ? 'border-white/10 bg-white/5' : 'border-gray-200 bg-white'}`}>
            <p className={`text-sm ${subTextColor}`}>
              Дисциплинарные меры применяются ко всем участникам независимо от стажа, роли в проекте, вклада, личных отношений или результатов торговых сессий. Привилегии и исключения не допускаются.
            </p>
          </div>
        </SectionCard>

        <SectionCard
          title="Определения"
          description="Ключевые термины, чтобы избежать двусмысленностей."
        >
          <div className="grid gap-4 md:grid-cols-2">
            {glossary.map((item) => (
              <div
                key={item.term}
                className={`rounded-2xl border p-4 sm:p-5 space-y-1 ${theme === 'dark' ? 'border-white/10 bg-white/5' : 'border-gray-200 bg-white'}`}
              >
                <p className="text-sm font-semibold text-[#4E6E49]">{item.term}</p>
                <p className={`text-sm ${subTextColor}`}>{item.text}</p>
              </div>
            ))}
          </div>
        </SectionCard>

        <SectionCard
          title="Заключительные положения"
          description="Кто может обновлять раздел и обязанность ознакомления."
        >
          <div className={`rounded-2xl border p-4 sm:p-5 space-y-2 ${theme === 'dark' ? 'border-white/10 bg-white/5' : 'border-gray-200 bg-white'}`}>
            <ul className={`text-sm space-y-1 ${subTextColor}`}>
              <li>• Ответственный за сообщество или исполняющий обязанности оставляет за собой право корректировать и обновлять раздел при изменении процессов или структуры платформы.</li>
              <li>• Все участники обязаны ознакомиться с настоящей политикой и соблюдать её безусловно.</li>
            </ul>
          </div>
        </SectionCard>
      </div>
    </Layout>
  )
}














