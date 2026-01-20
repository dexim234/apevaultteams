import React, { useState } from 'react'
import { useThemeStore } from '@/store/themeStore'
import {
    Zap,
    Timer,
    Activity,
    ShieldAlert,
    TrendingUp,
    ChevronDown,
    ChevronUp,
    LayoutList,
    Search,
    MousePointer2,
    XCircle,
    AlertTriangle,
    Target,
    BarChart3,
    HelpCircle,
    Info,
    Rocket,
    Clock,
    ZapOff
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
                        <div className={theme === 'dark' ? 'text-gray-400' : 'text-gray-500'}>
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

export const AVFFlipStrategy: React.FC = () => {
    const { theme } = useThemeStore()
    const [openStep, setOpenStep] = useState<number | null>(1)

    const toggleStep = (step: number) => {
        setOpenStep(openStep === step ? null : step)
    }

    const headingColor = theme === 'dark' ? 'text-white' : 'text-gray-900'

    return (
        <div className="space-y-12 animate-fade-in">
            {/* 1. Hero Intro */}
            <div className={`relative overflow-hidden rounded-3xl p-8 border ${theme === 'dark'
                ? 'bg-gradient-to-br from-[#1a212a] to-[#0f1216] border-blue-500/20 shadow-2xl'
                : 'bg-gradient-to-br from-white to-blue-50/30 border-blue-500/10 shadow-xl'
                }`}>
                <div className="absolute top-0 right-0 w-64 h-64 bg-blue-500/5 blur-3xl rounded-full -mr-20 -mt-20 pointer-events-none"></div>

                <div className="relative flex flex-col md:flex-row gap-8 items-start">
                    <div className={`p-4 rounded-2xl ${theme === 'dark' ? 'bg-blue-500/10' : 'bg-blue-500/5'}`}>
                        <Timer className={`w-12 h-12 text-blue-500`} />
                    </div>
                    <div className="flex-1 space-y-4">
                        <div className="flex items-center gap-3">
                            <h2 className={`text-2xl md:text-3xl font-black ${headingColor}`}>AVF FLIP-1S</h2>
                            <span className="px-3 py-1 rounded-full bg-blue-500/20 text-blue-400 text-[10px] font-black uppercase tracking-widest border border-blue-500/20">Scalping</span>
                        </div>
                        <p className={`text-lg leading-relaxed ${theme === 'dark' ? 'text-gray-300' : 'text-gray-600'}`}>
                            Flip на секундном таймфрейме — это сверхбыстрая стратегия скальпинга, заточенная под мгновенный откуп резких просадок на графике.
                        </p>
                        <p className={`text-sm opacity-80 ${theme === 'dark' ? 'text-gray-300' : 'text-gray-600'}`}>
                            Цель — не угадать рост токена, а активно отработать момент сильного падения, которое с высокой вероятностью откупается. Сделки длятся <strong>от 1 до 5 секунд</strong>.
                        </p>
                    </div>
                </div>
            </div>

            {/* 2. Logic & Core Principles */}
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                <div className={`rounded-2xl p-6 border-l-8 ${theme === 'dark' ? 'bg-[#0b1015] border-blue-500/50' : 'bg-gray-50 border-blue-500/30'
                    } flex gap-4 items-start`}>
                    <Activity className="w-8 h-8 text-blue-500 shrink-0" />
                    <div className="space-y-2">
                        <h4 className={`text-lg font-black ${headingColor}`}>Почему это работает?</h4>
                        <p className={`text-xs leading-relaxed ${theme === 'dark' ? 'text-gray-300' : 'text-gray-600'}`}>
                            Большинство трейдеров используют медленные источники (DexScreener/DexTool), которые отстают на 5-7 секунд. Резкие сливы (10-20% эмиссии) создают глубокие просадки, видимые только в быстрых терминалах (GMGN, Alpha One, Fasol).
                        </p>
                    </div>
                </div>

                <div className={`rounded-2xl p-6 border ${theme === 'dark' ? 'bg-blue-500/5 border-blue-500/20' : 'bg-blue-50 border-blue-500/20'
                    } flex gap-4 items-start`}>
                    <MousePointer2 className="w-8 h-8 text-blue-500 shrink-0" />
                    <div className="space-y-2">
                        <h4 className={`text-lg font-black ${headingColor}`}>Кому подходит?</h4>
                        <p className={`text-xs leading-relaxed ${theme === 'dark' ? 'text-gray-300' : 'text-gray-600'}`}>
                            Любому трейдеру, готовому тренировать внимание и дисциплину. Работает на любом депозите, но идеальный старт — <strong>от 50 долларов</strong>. Важен только импульс и откуп в моменте.
                        </p>
                    </div>
                </div>
            </div>

            {/* 3. Stats & Learning */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                {[
                    { title: "Освоение", desc: "От 1 недели до месяца. Не сравнивайте свой путь с чужим.", icon: <Rocket className="w-5 h-5 text-blue-500" /> },
                    { title: "Потенциал", icon: <TrendingUp className="w-5 h-5 text-blue-500" />, desc: "Возможен выход на $1000/день через месяц практики." },
                    { title: "Тайминг", icon: <Clock className="w-5 h-5 text-blue-500" />, desc: "Сделки 1-5 сек. Важна концентрация, а не глубокий ресерч." }
                ].map((item, idx) => (
                    <div key={idx} className={`p-5 rounded-2xl border ${theme === 'dark' ? 'bg-white/5 border-white/5' : 'bg-white border-gray-100'} shadow-sm`}>
                        <div className="mb-3">{item.icon}</div>
                        <h4 className="font-bold text-sm mb-1">{item.title}</h4>
                        <p className="text-xs text-gray-500 leading-relaxed">{item.desc}</p>
                    </div>
                ))}
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
                {/* 4. Main Algorithm */}
                <div className="lg:col-span-2 space-y-4">
                    <div className="flex items-center gap-3 mb-2">
                        <LayoutList className={`w-6 h-6 ${theme === 'dark' ? 'text-blue-400' : 'text-blue-500'}`} />
                        <h3 className={`text-xl font-black ${headingColor}`}>Где искать и что делать</h3>
                    </div>

                    <StrategyStep
                        number={1}
                        title="Где искать токены?"
                        icon={<Search className="w-5 h-5" />}
                        isOpen={openStep === 1}
                        onToggle={() => toggleStep(1)}
                    >
                        <div className="space-y-4">
                            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                <div className={`p-4 rounded-xl border ${theme === 'dark' ? 'bg-white/5 border-white/10' : 'bg-gray-50 border-gray-200'}`}>
                                    <h5 className="text-xs font-bold uppercase mb-2 text-blue-500">Миграции Axiom</h5>
                                    <p className="text-xs text-gray-500 leading-relaxed">Jupiter Studio, Believe, Moonshot. Главное — открыть график до просадки.</p>
                                </div>
                                <div className={`p-4 rounded-xl border ${theme === 'dark' ? 'bg-white/5 border-white/10' : 'bg-gray-50 border-gray-200'}`}>
                                    <h5 className="text-xs font-bold uppercase mb-2 text-blue-500">Photon (Тренды)</h5>
                                    <p className="text-xs text-gray-500 leading-relaxed">Вкладка тренды, режим 1м/5м. Сортировка по объёму для поиска резкой активности.</p>
                                </div>
                            </div>
                            <div className="p-4 rounded-xl border border-l-4 border-blue-500/50 ${theme === 'dark' ? 'bg-blue-500/5' : 'bg-blue-50'}">
                                <p className="text-xs font-bold uppercase mb-1">Признаки нужного токена:</p>
                                <ul className="text-xs space-y-1 list-disc list-inside text-gray-600">
                                    <li>Зелёные свечи подряд</li>
                                    <li>Объём за 5 минут: <strong>$50,000+</strong></li>
                                    <li>Резкий взлет цены (памп)</li>
                                </ul>
                            </div>
                        </div>
                    </StrategyStep>

                    <StrategyStep
                        number={2}
                        title="Какой график и токен нужен?"
                        icon={<BarChart3 className="w-5 h-5" />}
                        isOpen={openStep === 2}
                        onToggle={() => toggleStep(2)}
                    >
                        <div className="flex flex-wrap gap-2 mb-4">
                            {['Секундный TF', 'Высокая волатильность', 'Просадка > 20%', 'Откуп 1-3 сек'].map(tag => (
                                <span key={tag} className={`px-3 py-1 rounded-lg border text-[10px] font-bold ${theme === 'dark' ? 'bg-white/5 border-white/10' : 'bg-gray-50 border-gray-200'}`}>{tag}</span>
                            ))}
                        </div>
                        <p className="text-sm">Если таких признаков нет — токен не подходит для FLIP-1S.</p>
                    </StrategyStep>

                    <StrategyStep
                        number={3}
                        title="Сигналы на вход"
                        icon={<Zap className="w-5 h-5" />}
                        isOpen={openStep === 3}
                        onToggle={() => toggleStep(3)}
                    >
                        <div className={`p-4 rounded-xl border border-l-4 border-blue-500/50 ${theme === 'dark' ? 'bg-blue-500/5' : 'bg-blue-50'}`}>
                            <p className="text-sm font-bold uppercase mb-2 tracking-widest text-blue-500">Резкая просадка</p>
                            <p className="text-sm">Трейд работает только при падении на <strong>20% за 1-2 секунды</strong>. Заходим, когда свеча падает или на мгновенном начале отскока.</p>
                        </div>
                    </StrategyStep>

                    <StrategyStep
                        number={4}
                        title="Идеальный вход"
                        icon={<Target className="w-5 h-5" />}
                        isOpen={openStep === 4}
                        onToggle={() => toggleStep(4)}
                    >
                        <div className="space-y-3">
                            <p className="text-sm font-medium">Последовательность успеха:</p>
                            <div className="flex flex-col gap-2">
                                {[
                                    "Токен только вылетел в миграции",
                                    "Появился всплеск объёма",
                                    "График улетает вверх",
                                    "Резкая просадка (1-2 сек)",
                                    "Сильный откуп (1-3 сек)"
                                ].map((step, i) => (
                                    <div key={i} className="flex items-center gap-3 text-xs">
                                        <div className="w-5 h-5 rounded-full bg-blue-500/20 text-blue-500 flex items-center justify-center font-bold text-[10px]">{i + 1}</div>
                                        {step}
                                    </div>
                                ))}
                            </div>
                            <p className="text-xs text-blue-500 font-bold mt-2">Важно: Купить на просадке, а не после того, как график уже вернулся на хай.</p>
                        </div>
                    </StrategyStep>

                    <StrategyStep
                        number={5}
                        title="Когда НЕ заходить?"
                        icon={<ZapOff className="w-5 h-5" />}
                        isOpen={openStep === 5}
                        onToggle={() => toggleStep(5)}
                    >
                        <ul className="space-y-2 text-sm text-gray-500">
                            <li className="flex gap-2">❌ <span>Момент пропущен и токен уже откупился.</span></li>
                            <li className="flex gap-2">❌ <span>Просадка плавная, а не резкая.</span></li>
                            <li className="flex gap-2">❌ <span>Токен упал на <strong>-50%</strong> от хая (затяжной слив).</span></li>
                            <li className="flex gap-2">❌ <span>Нет откупа за 2-3 секунды — выход в ноль/минус.</span></li>
                        </ul>
                    </StrategyStep>

                    <StrategyStep
                        number={6}
                        title="Аномальные просадки (Advanced)"
                        icon={<AlertTriangle className="w-5 h-5" />}
                        isOpen={openStep === 6}
                        onToggle={() => toggleStep(6)}
                    >
                        <div className={`p-4 rounded-xl border border-dashed ${theme === 'dark' ? 'border-blue-500/30' : 'border-blue-500/20'}`}>
                            <p className="text-xs italic text-gray-500 mb-3">Только для профи. Сделки до 15-20 секунд при падении с 200к до 20к.</p>
                            <ul className="text-xs space-y-1 list-disc list-inside text-gray-600">
                                <li>Нормальный DEV (не скам)</li>
                                <li>Просадка 80-90%</li>
                                <li>Ликвидность не убита</li>
                            </ul>
                        </div>
                    </StrategyStep>
                </div>
            </div>

            {/* 5. Sidebar: Checkups & Errors */}
            <div className="space-y-6">
                {/* Express Check */}
                <div className={`rounded-2xl p-6 border ${theme === 'dark' ? 'bg-[#151a21]/80 border-white/5' : 'bg-white border-gray-100'
                        } shadow-lg space-y-4`}>
                    <div className="flex items-center gap-3">
                        <Info className={`w-6 h-6 text-blue-500`} />
                        <h3 className={`text-lg font-black ${headingColor}`}>Экспресс-чек</h3>
                    </div>
                    <div className="space-y-3">
                        <div className="space-y-1 pb-2 border-b border-white/5">
                            <p className="text-[9px] font-black text-blue-500 uppercase tracking-widest">Объёмы</p>
                            <p className="text-xs text-gray-500">За 5 мин — $50,000+. Серия зелёных свечей вверх.</p>
                        </div>
                        <div className="space-y-1 pb-2 border-b border-white/5">
                            <p className="text-[9px] font-black text-blue-500 uppercase tracking-widest">Метрики</p>
                            <p className="text-xs text-gray-500">DEV {'<'} 2%. Топ-10 холдеров {'<'} 50%. Ликвидность {'>'} $20k.</p>
                        </div>
                        <div className="space-y-1 pb-2 border-b border-white/5">
                            <p className="text-[9px] font-black text-blue-500 uppercase tracking-widest">Позиция</p>
                            <p className="text-xs text-gray-500">Вход {'<'} 1% от ликвидности. Макс 30% депозита.</p>
                        </div>
                    </div>
                </div>

                {/* Typical Errors */}
                <div className={`rounded-2xl p-6 border ${theme === 'dark' ? 'bg-rose-500/5 border-rose-500/20' : 'bg-rose-50 border-rose-500/20'
                        } shadow-lg space-y-4`}>
                    <div className="flex items-center gap-3">
                        <XCircle className="w-6 h-6 text-rose-500" />
                        <h3 className={`text-lg font-black ${headingColor}`}>Типовые ошибки</h3>
                    </div>
                    <div className="space-y-4 text-xs text-gray-500">
                        <div>
                            <p className="font-bold text-rose-500">Вход после откупа</p>
                            <p className="leading-relaxed">Заход на росте приводит к потере на следующем сливе. Жди только дна.</p>
                        </div>
                        <div>
                            <p className="font-bold text-rose-500">Засаживание (Hope)</p>
                            <p className="leading-relaxed">Надежда на отскок более 2-3 секунд. Не откупилось — выходи сразу.</p>
                        </div>
                        <div>
                            <p className="font-bold text-rose-500">Тильт-усреднение</p>
                            <p className="leading-relaxed">Попытка отбиться после минуса через увеличение позы. Стоп после -30%.</p>
                        </div>
                    </div>
                </div>

                {/* Risk Management */}
                <div className={`p-6 rounded-2xl border-2 border-dashed ${theme === 'dark' ? 'border-blue-500/30' : 'border-blue-500/20'} space-y-4`}>
                    <div className="flex items-center gap-3">
                        <ShieldAlert className="w-5 h-5 text-blue-500" />
                        <h4 className="font-bold text-sm">Дисциплина рисков</h4>
                    </div>
                    <div className="grid grid-cols-2 gap-4">
                        <div className="space-y-1">
                            <p className="text-[10px] text-gray-500 font-bold">СТОП СЕССИИ</p>
                            <p className="text-xs font-black text-rose-500">-30% (Пауза 2ч)</p>
                        </div>
                        <div className="space-y-1">
                            <p className="text-[10px] text-gray-500 font-bold">СТОП ДНЯ</p>
                            <p className="text-xs font-black text-rose-500">-50% (Отдых)</p>
                        </div>
                    </div>
                </div>
            </div>

            {/* 6. Summary Footer */}
            <div className={`rounded-2xl p-6 border-l-8 ${theme === 'dark' ? 'bg-[#0b1015] border-blue-500/50' : 'bg-gray-50 border-blue-500/30'
                }`}>
                <div className="flex gap-4 items-start">
                    <HelpCircle className="w-8 h-8 text-blue-500 shrink-0" />
                    <div className="space-y-2">
                        <h4 className={`text-lg font-black ${headingColor}`}>Финальное напутствие</h4>
                        <p className={`text-sm leading-relaxed ${theme === 'dark' ? 'text-gray-300' : 'text-gray-600'}`}>
                            FLIP-1S требует максимального спокойствия. Это механический процесс откупа неэффективности рынка. Если вы успеваете реагировать быстрее, чем DexScreener отображает свечу — вы уже в прибыли. Не торопите прогресс, результат придет через сотни микро-сделок.
                        </p>
                    </div>
                </div>
            </div>
        </div>
    )
}
