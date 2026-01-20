import React, { useState } from 'react'
import { useThemeStore } from '@/store/themeStore'
import {
    BarChart3,
    Search,
    LayoutList,
    TrendingUp,
    ChevronDown,
    ChevronUp,
    Twitter,
    Send,
    Target,
    Calculator,
    Clock,
    Zap,
    XCircle,
    HelpCircle,
    ArrowRightLeft,
    CheckCircle2,
    AlertTriangle,
    MinusCircle,
    MousePointer2,
    ShieldAlert
} from 'lucide-react'

interface StrategyStepProps {
    number: number
    title: string
    children: React.ReactNode
    icon: React.ReactNode
    isOpen: boolean
    onToggle: () => void
}

const StrategyStep: React.FC<StrategyStepProps> = ({ number, title, children, icon, isOpen, onToggle }) => {
    const { theme } = useThemeStore()

    return (
        <div className={`overflow-hidden rounded-2xl border transition-all duration-300 ${theme === 'dark'
            ? 'bg-[#1a212a]/50 border-white/5 shadow-inner'
            : 'bg-white border-gray-100 shadow-sm'
            }`}>
            <button
                onClick={onToggle}
                className="w-full flex items-center justify-between p-5 text-left transition-colors hover:bg-white/5"
            >
                <div className="flex items-center gap-4">
                    <div className={`flex items-center justify-center w-10 h-10 rounded-xl font-black text-lg ${theme === 'dark' ? 'bg-blue-500/20 text-blue-400' : 'bg-blue-50 text-blue-600'
                        }`}>
                        {number}
                    </div>
                    <div className="flex items-center gap-3">
                        <div className={theme === 'dark' ? 'text-gray-300' : 'text-gray-600'}>
                            {icon}
                        </div>
                        <h3 className={`text-lg font-bold ${theme === 'dark' ? 'text-white' : 'text-gray-900'}`}>
                            {title}
                        </h3>
                    </div>
                </div>
                {isOpen ? <ChevronUp className="w-5 h-5 text-gray-500" /> : <ChevronDown className="w-5 h-5 text-gray-500" />}
            </button>

            {isOpen && (
                <div className={`p-6 pt-0 border-t ${theme === 'dark' ? 'border-white/5' : 'border-gray-50'}`}>
                    <div className={`mt-4 space-y-4 ${theme === 'dark' ? 'text-gray-300' : 'text-gray-600'}`}>
                        {children}
                    </div>
                </div>
            )}
        </div>
    )
}

export const AVFIntradayStrategy: React.FC = () => {
    const { theme } = useThemeStore()
    const [openStep, setOpenStep] = useState<number | null>(1)

    const toggleStep = (step: number) => {
        setOpenStep(openStep === step ? null : step)
    }

    const headingColor = theme === 'dark' ? 'text-white' : 'text-gray-900'

    return (
        <div className="space-y-12 animate-fade-in">
            {/* 1. Strategy Hero Intro */}
            <div className={`relative overflow-hidden rounded-3xl p-8 border ${theme === 'dark'
                ? 'bg-gradient-to-br from-[#1a212a] to-[#0f1216] border-blue-500/20 shadow-2xl'
                : 'bg-gradient-to-br from-white to-blue-50/30 border-blue-500/10 shadow-xl'
                }`}>
                <div className="absolute top-0 right-0 w-64 h-64 bg-blue-500/5 blur-3xl rounded-full -mr-20 -mt-20 pointer-events-none"></div>

                <div className="relative flex flex-col md:flex-row gap-8 items-start">
                    <div className={`p-4 rounded-2xl ${theme === 'dark' ? 'bg-blue-500/10' : 'bg-blue-500/5'}`}>
                        <Zap className={`w-12 h-12 ${theme === 'dark' ? 'text-blue-400' : 'text-blue-500'}`} />
                    </div>
                    <div className="flex-1 space-y-4">
                        <h2 className={`text-2xl md:text-3xl font-black ${headingColor}`}>AVF Intraday</h2>
                        <p className={`text-lg leading-relaxed ${theme === 'dark' ? 'text-gray-300' : 'text-gray-600'}`}>
                            AVF Intraday — это системная стратегия внутридневной торговли в Solana-сегменте, ориентированная на поиск и отработку свежих токенов с горизонтом удержания позиции от 1 часа до 1 торгового дня.
                        </p>
                        <p className={`text-sm opacity-80 ${theme === 'dark' ? 'text-gray-300' : 'text-gray-600'}`}>
                            Это не скальпинг и не погоня за хаями. Ключ — быстрое, но взвешенное принятие решений на основе чётких метрик и алгоритма.
                        </p>
                        <div className={`flex flex-wrap gap-4 pt-2`}>
                            <div className={`flex items-center gap-2 px-3 py-1.5 rounded-full text-xs font-bold ${theme === 'dark' ? 'bg-white/5 text-gray-400 border border-white/10' : 'bg-gray-100 text-gray-600 border border-gray-200'
                                }`}>
                                <Clock className="w-3.5 h-3.5" />
                                1H - 24H
                            </div>
                            <div className={`flex items-center gap-2 px-3 py-1.5 rounded-full text-xs font-bold ${theme === 'dark' ? 'bg-white/5 text-gray-400 border border-white/10' : 'bg-gray-100 text-gray-600 border border-gray-200'
                                }`}>
                                <Search className="w-3.5 h-3.5" />
                                SOLANA MIGRATED
                            </div>
                            <div className={`flex items-center gap-2 px-3 py-1.5 rounded-full text-xs font-bold ${theme === 'dark' ? 'bg-white/10 text-blue-400 border border-blue-500/20' : 'bg-blue-50 text-blue-600 border border-blue-200'
                                }`}>
                                <TrendingUp className="w-3.5 h-3.5" />
                                DCA / RETRACE
                            </div>
                        </div>
                    </div>
                </div>
            </div>

            {/* 2. Key Advantages & Targets */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
                {[
                    { title: "Любая фаза", desc: "При слабых объёмах, стагнации и во флете.", icon: <CheckCircle2 className="w-5 h-5 text-emerald-500" /> },
                    { title: "Стабильность", icon: <TrendingUp className="w-5 h-5 text-blue-500" />, desc: "Забираем повторяемую прибыль на умеренных сетапах." },
                    { title: "Ежедневно", icon: <Clock className="w-5 h-5 text-amber-500" />, desc: "Десятки новых мемов и раннеров каждый день в Solana." },
                    { title: "Микро-деп", icon: <MousePointer2 className="w-5 h-5 text-purple-500" />, desc: "Входы возможны от $5–10." }
                ].map((item, idx) => (
                    <div key={idx} className={`p-5 rounded-2xl border ${theme === 'dark' ? 'bg-white/5 border-white/5' : 'bg-white border-gray-100'} shadow-sm`}>
                        <div className="mb-3">{item.icon}</div>
                        <h4 className="font-bold text-sm mb-1">{item.title}</h4>
                        <p className="text-xs text-gray-500 leading-relaxed">{item.desc}</p>
                    </div>
                ))}
            </div>

            {/* 3. Logic & Summary (Moved Up) */}
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                <div className={`rounded-2xl p-6 border-l-8 ${theme === 'dark' ? 'bg-[#0b1015] border-blue-500/50' : 'bg-gray-50 border-blue-500/30'
                    } flex gap-4 items-start`}>
                    <HelpCircle className="w-8 h-8 text-blue-500 shrink-0" />
                    <div className="space-y-2">
                        <h4 className={`text-lg font-black ${headingColor}`}>Суть стратегии</h4>
                        <p className={`text-xs leading-relaxed ${theme === 'dark' ? 'text-gray-300' : 'text-gray-600'}`}>
                            Это не про угадывание, это рабочая рутина. Результат достигается анализом, а не спешкой. Один пропущенный красный флаг перечеркивает серию прибыльных сделок. Если токен требует оправданий — он не торгуется.
                        </p>
                    </div>
                </div>

                <div className={`rounded-2xl p-6 border ${theme === 'dark' ? 'bg-blue-500/5 border-blue-500/20' : 'bg-blue-50 border-blue-500/20'
                    } flex gap-4 items-start`}>
                    <ShieldAlert className="w-8 h-8 text-blue-500 shrink-0" />
                    <div className="space-y-2">
                        <h4 className={`text-lg font-black ${headingColor}`}>Кому подходит?</h4>
                        <p className={`text-xs leading-relaxed ${theme === 'dark' ? 'text-gray-300' : 'text-gray-600'}`}>
                            Трейдерам, ценящим структуру и понятные правила. Новичкам с небольшим депо и опытным филлерам, желающим диверсифицировать стиль через 15–60 минут после старта токена.
                        </p>
                    </div>
                </div>
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
                {/* 4. Main Steps */}
                <div className="lg:col-span-2 space-y-4">
                    <div className="flex items-center gap-3 mb-2">
                        <LayoutList className={`w-6 h-6 ${theme === 'dark' ? 'text-blue-400' : 'text-blue-500'}`} />
                        <h3 className={`text-xl font-black ${headingColor}`}>Алгоритм работы</h3>
                    </div>

                    <StrategyStep
                        number={1}
                        title="Поиск свежих токенов"
                        icon={<Search className="w-5 h-5" />}
                        isOpen={openStep === 1}
                        onToggle={() => toggleStep(1)}
                    >
                        <p className="text-sm font-medium mb-2">Отбор на самой ранней стадии свободы:</p>
                        <ul className="space-y-2 text-sm list-disc list-inside pl-2">
                            <li>Открываем <strong>GMGN</strong> или <strong>Axiom</strong></li>
                            <li>Вкладка <strong>Migrated</strong> (с Launchpad в торговлю)</li>
                            <li>Фильтруем по интересующим Launchpad’ам</li>
                            <li>Возраст токена: <strong>1 – 60 минут</strong></li>
                            <li className="text-orange-400 font-bold">Токены старше 1 часа — исключаются.</li>
                        </ul>
                    </StrategyStep>

                    <StrategyStep
                        number={2}
                        title="Скрининг базовых метрик"
                        icon={<Target className="w-5 h-5" />}
                        isOpen={openStep === 2}
                        onToggle={() => toggleStep(2)}
                    >
                        <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                            <div className={`p-4 rounded-xl border ${theme === 'dark' ? 'bg-white/5 border-white/10' : 'bg-gray-50 border-gray-200'}`}>
                                <p className="text-[10px] font-bold uppercase tracking-wider text-gray-500 mb-1">Market Cap</p>
                                <p className={`text-lg font-black ${headingColor}`}>50k - 100k USD</p>
                                <p className="text-[10px] text-orange-400 font-medium">{'>'}100k — риск перегретости</p>
                            </div>
                            <div className={`p-4 rounded-xl border ${theme === 'dark' ? 'bg-white/5 border-white/10' : 'bg-gray-50 border-gray-200'}`}>
                                <p className="text-[10px] font-bold uppercase tracking-wider text-gray-500 mb-1">Объёмы</p>
                                <p className={`text-lg font-black ${headingColor}`}>Активные</p>
                                <p className="text-[10px] text-emerald-500 font-medium">Рост в 2-4 раза за короткий период</p>
                            </div>
                            <div className={`p-4 rounded-xl border ${theme === 'dark' ? 'bg-white/5 border-white/10' : 'bg-gray-50 border-gray-200'}`}>
                                <p className="text-[10px] font-bold uppercase tracking-wider text-gray-500 mb-1">Холдеры</p>
                                <p className={`text-lg font-black ${headingColor}`}>+300 / 40м</p>
                                <p className="text-[10px] text-emerald-500 font-medium">Минимум +300 за 30-40 мин</p>
                            </div>
                        </div>
                    </StrategyStep>

                    <StrategyStep
                        number={3}
                        title="Проверка нарратива и социального фона"
                        icon={<Twitter className="w-5 h-5" />}
                        isOpen={openStep === 3}
                        onToggle={() => toggleStep(3)}
                    >
                        <div className="space-y-4">
                            <div className="flex gap-4">
                                <div className={`p-3 rounded-xl ${theme === 'dark' ? 'bg-white/5' : 'bg-gray-50'}`}>
                                    <Twitter className="w-5 h-5 text-sky-400" />
                                </div>
                                <div className="flex-1">
                                    <h4 className="font-bold text-sm">Анализ Twitter / X</h4>
                                    <p className="text-xs text-gray-500 leading-relaxed">Наличие свежих постов, комментарии, репосты, поддержка со стороны реальных коллеров.</p>
                                </div>
                            </div>
                            <div className="flex gap-4">
                                <div className={`p-3 rounded-xl ${theme === 'dark' ? 'bg-white/5' : 'bg-gray-50'}`}>
                                    <Send className="w-5 h-5 text-blue-400" />
                                </div>
                                <div className="flex-1">
                                    <h4 className="font-bold text-sm">Telegram-группа</h4>
                                    <p className="text-xs text-gray-500 leading-relaxed">Активность админ-состава, живое обсуждение, отсутствие явной бот-активности.</p>
                                </div>
                            </div>
                        </div>
                    </StrategyStep>

                    <StrategyStep
                        number={4}
                        title="Техническая оценка графика"
                        icon={<BarChart3 className="w-5 h-5" />}
                        isOpen={openStep === 4}
                        onToggle={() => toggleStep(4)}
                    >
                        <ul className="space-y-3 text-sm list-disc list-inside pl-2">
                            <li>Органичное движение: плавный рост, отсутствие "одной ракеты" (свеча 200%+).</li>
                            <li>Сравнение объёмов на <strong>1m TF</strong> за последние 10–15 минут.</li>
                            <li className="text-rose-400 font-bold p-3 rounded-xl bg-rose-400/5 border border-rose-400/20 list-none">
                                КРИТИЧЕСКИЙ СИГНАЛ: Если объёмы падают (напр. с 5k до 500), активность затухает — вход запрещён.
                            </li>
                        </ul>
                    </StrategyStep>

                    <StrategyStep
                        number={5}
                        title="Уровни Фибоначчи + Структура"
                        icon={<Calculator className="w-5 h-5" />}
                        isOpen={openStep === 5}
                        onToggle={() => toggleStep(5)}
                    >
                        <div className="space-y-4">
                            <div className={`p-4 rounded-xl border border-l-4 border-blue-500/50 ${theme === 'dark' ? 'bg-blue-500/5' : 'bg-blue-50'}`}>
                                <p className="text-sm font-bold text-blue-500 uppercase tracking-widest mb-1">Правило входа</p>
                                <p className="text-sm">Вход только на подтверждённом откате. Вход в растущий график ЗАПРЕЩЁН.</p>
                            </div>
                            <p className="text-sm font-medium">Тянем Фибу от начала импульса до хая. Ключевые уровни входа:</p>
                            <div className="flex flex-wrap gap-2">
                                {['0.5', '0.618', '0.786'].map(level => (
                                    <div key={level} className={`px-4 py-2 rounded-lg border font-black text-sm ${theme === 'dark' ? 'bg-white/5 border-white/10 text-blue-400' : 'bg-blue-50 border-blue-200 text-blue-600'}`}>
                                        {level}
                                    </div>
                                ))}
                            </div>
                            <p className="text-xs text-gray-500">Приоритет — совпадение уровня с локальной поддержкой или проторговкой.</p>
                        </div>
                    </StrategyStep>

                    <StrategyStep
                        number={6}
                        title="Контроль позиции и выход"
                        icon={<ArrowRightLeft className="w-5 h-5" />}
                        isOpen={openStep === 6}
                        onToggle={() => toggleStep(6)}
                    >
                        <div className="space-y-6">
                            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                                <div className={`p-4 rounded-xl border ${theme === 'dark' ? 'bg-emerald-500/5 border-emerald-500/20' : 'bg-emerald-50 border-emerald-500/20'}`}>
                                    <h5 className="text-xs font-bold text-emerald-500 uppercase tracking-widest mb-2">Цели (TP)</h5>
                                    <p className="text-lg font-black ${headingColor}">20% – 70%</p>
                                    <p className="text-[10px] text-gray-500">Основная прибыль в этом диапазоне, остаток по ситуации.</p>
                                </div>
                                <div className={`p-4 rounded-xl border ${theme === 'dark' ? 'bg-rose-500/5 border-rose-500/20' : 'bg-rose-50 border-rose-500/20'}`}>
                                    <h5 className="text-xs font-bold text-rose-500 uppercase tracking-widest mb-2">Сигнал Выхода</h5>
                                    <p className="text-sm font-bold">Деградация объёмов</p>
                                    <p className="text-[10px] text-gray-500">Резкое снижение активности или ончейн-фиксация.</p>
                                </div>
                            </div>
                            <div className="space-y-2">
                                <p className="text-sm font-bold uppercase tracking-widest opacity-50">В процессе удержания:</p>
                                <ul className="text-xs space-y-2 list-disc list-inside text-gray-500">
                                    <li>Мониторинг X: прекращение активности = сигнал слабости.</li>
                                    <li>Ончейн: проверка фиксации прибыли топ-холдерами.</li>
                                    <li>Никаких пересиживаний минуса: стратегия не терпит ухудшения условий.</li>
                                </ul>
                            </div>
                        </div>
                    </StrategyStep>
                </div>

                {/* 4. Sidebar: Warnings & Errors */}
                <div className="space-y-6">
                    {/* Red Flags */}
                    <div className={`rounded-2xl p-6 border ${theme === 'dark' ? 'bg-rose-500/5 border-rose-500/20' : 'bg-rose-50 border-rose-500/20'
                        } shadow-lg space-y-4`}>
                        <div className="flex items-center gap-3">
                            <XCircle className={`w-6 h-6 text-rose-500`} />
                            <h3 className={`text-lg font-black ${headingColor}`}>Красные флаги</h3>
                        </div>
                        <p className="text-[10px] text-rose-400 uppercase font-black tracking-widest">Автоматический отказ от сделки</p>
                        <div className="space-y-3">
                            {[
                                { label: 'График', val: 'Ракета 200%+ или пробой всех уровней Фибо одной свечой вниз.' },
                                { label: 'Объём', val: 'Резкое падение (напр. 40k → 3k за 10 мин).' },
                                { label: 'Ликвидность', val: 'Объёмы значительно меньше капитализации (Cap 1M — Vol 100k).' },
                                { label: 'Холдеры', val: 'Один холдер > 2%, бандлы > 30 SOL, или Top-10 > 20%.' },
                                { label: 'PNL Холдеров', val: 'Большинство уже сидит на x5+ при капе < 100k.' },
                                { label: 'DEV', val: 'Запускает 3–5 токенов в сутки без миграции.' },
                            ].map((item, id) => (
                                <div key={id} className="space-y-1 pb-2 border-b border-rose-500/10 last:border-0">
                                    <p className="text-[9px] font-black text-rose-500/70 uppercase">{item.label}</p>
                                    <p className="text-xs font-medium text-gray-500 leading-tight">{item.val}</p>
                                </div>
                            ))}
                        </div>
                    </div>

                    {/* Yellow Flags */}
                    <div className={`rounded-2xl p-6 border ${theme === 'dark' ? 'bg-amber-500/5 border-amber-500/20' : 'bg-amber-50 border-amber-500/20'
                        } shadow-lg space-y-4`}>
                        <div className="flex items-center gap-3">
                            <AlertTriangle className={`w-6 h-6 text-amber-500`} />
                            <h3 className={`text-lg font-black ${headingColor}`}>Жёлтые флаги</h3>
                        </div>
                        <p className="text-[10px] text-amber-500 uppercase font-black tracking-widest">Требуют осторожности</p>
                        <div className="space-y-3 text-xs text-gray-500">
                            <p><span className="font-bold text-amber-500">Бандлы 100–200 SOL:</span> Оценить, плавно ли команда ведёт график.</p>
                            <p><span className="font-bold text-amber-500">Нет ссылки на X:</span> Требуется ручной поиск. Если нарратив не читается — отказ.</p>
                            <p><span className="font-bold text-amber-500">Слабый нарратив:</span> Если идея не вызывает интереса, лучше переключиться.</p>
                        </div>
                    </div>

                    {/* Typical Errors */}
                    <div className={`rounded-2xl p-6 border ${theme === 'dark' ? 'bg-white/5 border-white/5' : 'bg-white border-gray-100'
                        } shadow-lg space-y-4`}>
                        <div className="flex items-center gap-3">
                            <MinusCircle className={`w-6 h-6 text-gray-500`} />
                            <h3 className={`text-lg font-black ${headingColor}`}>Типичные ошибки</h3>
                        </div>
                        <ul className="space-y-2 text-xs text-gray-500 list-disc list-inside">
                            <li>Вход в ракету вместо отката.</li>
                            <li>Игнорирование падения объёмов "в надежде".</li>
                            <li>Заход при перегруженном распределении.</li>
                            <li>Оправдание плохих метрик "сильным графиком".</li>
                            <li>Попытка "досидеть", когда сетап уже сломан.</li>
                        </ul>
                    </div>
                </div>
            </div>

        </div>
    )
}
