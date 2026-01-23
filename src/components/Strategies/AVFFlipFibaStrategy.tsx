import React, { useState } from 'react'
import { useThemeStore } from '@/store/themeStore'
import {
    Zap,
    Activity,
    ChevronDown,
    ChevronUp,
    LayoutList,
    Search,
    Target,
    BarChart3,
    HelpCircle,
    Rocket,
    Clock,
    XCircle,
    Twitter,
    MousePointer2,
    Settings,
    Layers
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

export const AVFFlipFibaStrategy: React.FC = () => {
    const { theme } = useThemeStore()
    const [openStep, setOpenStep] = useState<number | null>(1)

    const toggleStep = (step: number) => {
        setOpenStep(openStep === step ? null : step)
    }

    const headingColor = theme === 'dark' ? 'text-white' : 'text-gray-900'
    const mutedText = theme === 'dark' ? 'text-gray-400' : 'text-gray-500'

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
                        <Zap className={`w-12 h-12 text-blue-500`} />
                    </div>
                    <div className="flex-1 space-y-4">
                        <div className="flex items-center gap-3">
                            <h2 className={`text-2xl md:text-3xl font-black ${headingColor}`}>AVF FLIP + FIBA</h2>
                            <span className="px-3 py-1 rounded-full bg-blue-500/20 text-blue-400 text-[10px] font-black uppercase tracking-widest border border-blue-500/20">Pre-Migration</span>
                        </div>
                        <p className={`text-lg leading-relaxed ${theme === 'dark' ? 'text-gray-300' : 'text-gray-600'}`}>
                            Интрадей-флип pre-migration токенов Solana. Цель: 2–3x за 1–10 минут.
                        </p>
                        <p className={`text-sm opacity-80 ${theme === 'dark' ? 'text-gray-300' : 'text-gray-600'}`}>
                            Ловля первичного импульса на старте выпуска токена через хайповый нарратив. Вошёл → забрал импульс → вышел.
                        </p>
                    </div>
                </div>
            </div>

            {/* 2. Core Stats */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                {[
                    { title: "Депозит", desc: "Оптимально до $500 для высокой маневренности.", icon: <Target className="w-5 h-5 text-blue-500" /> },
                    { title: "Активность", icon: <Activity className="w-5 h-5 text-blue-500" />, desc: "10–15 сделок в день для развития насмотренности." },
                    { title: "Тайминг", icon: <Clock className="w-5 h-5 text-blue-500" />, desc: "Вход: 20–30 сек. Фиксация: 1–2 мин." }
                ].map((item, idx) => (
                    <div key={idx} className={`p-5 rounded-2xl border ${theme === 'dark' ? 'bg-white/5 border-white/5' : 'bg-white border-gray-100'} shadow-sm`}>
                        <div className="mb-3">{item.icon}</div>
                        <h4 className="font-bold text-sm mb-1">{item.title}</h4>
                        <p className="text-xs text-gray-500 leading-relaxed">{item.desc}</p>
                    </div>
                ))}
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
                {/* 3. Strategy Guide */}
                <div className="lg:col-span-2 space-y-4">
                    <div className="flex items-center gap-3 mb-2">
                        <LayoutList className={`w-6 h-6 ${theme === 'dark' ? 'text-blue-400' : 'text-blue-500'}`} />
                        <h3 className={`text-xl font-black ${headingColor}`}>Пошаговое руководство</h3>
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
                                    <h5 className="text-xs font-bold uppercase mb-2 text-blue-500">Axiom / GMGN</h5>
                                    <p className="text-xs text-gray-500 leading-relaxed">
                                        Колонка <strong>Final Stretch</strong> — капа $10K–30K. Токены до миграции с уже имеющимся объёмом.
                                    </p>
                                </div>
                                <div className={`p-4 rounded-xl border ${theme === 'dark' ? 'bg-white/5 border-white/10' : 'bg-gray-50 border-gray-200'}`}>
                                    <h5 className="text-xs font-bold uppercase mb-2 text-blue-500">New Pairs</h5>
                                    <p className="text-xs text-gray-500 leading-relaxed">
                                        Свежие токены, капа около нуля. Много шума, но здесь рождаются будущие хайпы.
                                    </p>
                                </div>
                            </div>
                        </div>
                    </StrategyStep>

                    <StrategyStep
                        number={2}
                        title="Критерии отбора (Twitter & Community)"
                        icon={<Twitter className="w-5 h-5" />}
                        isOpen={openStep === 2}
                        onToggle={() => toggleStep(2)}
                    >
                        <ul className="space-y-2 text-sm">
                            <li className="flex gap-2">✅ <span>Запуск из живого Twitter-комьюнити (пост до 15 мин).</span></li>
                            <li className="flex gap-2">✅ <span>У автора/комьюнити 1000+ живых подписчиков.</span></li>
                            <li className="flex gap-2">✅ <span>Количество участников и активность в чате растут.</span></li>
                            <li className="flex gap-2">✅ <span>Визуал и слоган четко попадают в хайповый нарратив.</span></li>
                        </ul>
                    </StrategyStep>

                    <StrategyStep
                        number={3}
                        title="Технический чек-лист (Axiom)"
                        icon={<BarChart3 className="w-5 h-5" />}
                        isOpen={openStep === 3}
                        onToggle={() => toggleStep(3)}
                    >
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-xs">
                            <div className={`p-3 rounded-xl border ${theme === 'dark' ? 'bg-white/5 border-white/10' : 'bg-gray-50 border-gray-200'}`}>
                                <p className="font-bold text-blue-500 mb-1">DEV & HOLDERS</p>
                                <p>Dev: 0% холдинга. Top-10: 25–30%. Снайперы: 6–7%. Инсайдеры: до 10%.</p>
                            </div>
                            <div className={`p-3 rounded-xl border ${theme === 'dark' ? 'bg-white/5 border-white/10' : 'bg-gray-50 border-gray-200'}`}>
                                <p className="font-bold text-blue-500 mb-1">ГРАФИК</p>
                                <p>Таймфрейм: секундный. Плотные свечи (объем), наличие откупа после DevSell.</p>
                            </div>
                        </div>
                    </StrategyStep>

                    <StrategyStep
                        number={4}
                        title="Точка входа и выхода"
                        icon={<MousePointer2 className="w-5 h-5" />}
                        isOpen={openStep === 4}
                        onToggle={() => toggleStep(4)}
                    >
                        <div className="space-y-4 text-sm">
                            <div className="p-4 rounded-xl bg-blue-500/5 border border-blue-500/20">
                                <p className="font-bold text-blue-500 mb-1 uppercase text-xs">Вход</p>
                                <p>В первые минуты после появления токена, когда идея ясна и пошли стартовые объёмы.</p>
                            </div>
                            <div className="p-4 rounded-xl bg-green-500/5 border border-green-500/20">
                                <p className="font-bold text-green-500 mb-1 uppercase text-xs">Выход (Главное правило)</p>
                                <p>Фиксация 2–3x при росте капы до $20–30K. Выход в 0, если цена вернулась к входу. Убыток режем на -15%.</p>
                            </div>
                        </div>
                    </StrategyStep>

                    <StrategyStep
                        number={5}
                        title="Стратегия FIBA (Fibonacci)"
                        icon={<Layers className="w-5 h-5" />}
                        isOpen={openStep === 5}
                        onToggle={() => toggleStep(5)}
                    >
                        <div className={`p-4 rounded-xl border-2 border-dashed ${theme === 'dark' ? 'border-blue-500/30' : 'border-blue-500/20'}`}>
                            <p className="text-xs font-bold text-blue-500 uppercase mb-2">На откате (15s / 1m TF)</p>
                            <p className="text-sm italic">Используем, если основной импульс пропущен. Строим сетку Фибо от лоя до хая.</p>
                            <div className="mt-3 grid grid-cols-2 gap-2 text-xs">
                                <div><span className="font-bold text-blue-400">Вход:</span> уровни 0.618 или 0.786</div>
                                <div><span className="font-bold text-green-400">Выход:</span> отскок 20–40%</div>
                            </div>
                        </div>
                    </StrategyStep>
                </div>

                {/* Sidebar */}
                <div className="space-y-6">
                    {/* Settings */}
                    <div className={`rounded-2xl p-6 border ${theme === 'dark' ? 'bg-[#151a21]/80 border-white/5' : 'bg-white border-gray-100'
                        } shadow-lg space-y-4`}>
                        <div className="flex items-center gap-3">
                            <Settings className={`w-6 h-6 text-blue-500`} />
                            <h3 className={`text-lg font-black ${headingColor}`}>Настройки</h3>
                        </div>
                        <div className="space-y-3">
                            <div className="flex justify-between items-center text-xs">
                                <span className={mutedText}>Газ (Priority):</span>
                                <span className="font-black text-blue-500">0.002 SOL+</span>
                            </div>
                            <div className="flex justify-between items-center text-xs">
                                <span className={mutedText}>Jito:</span>
                                <span className="font-black text-blue-500">Включен (Manual)</span>
                            </div>
                            <div className="flex justify-between items-center text-xs">
                                <span className={mutedText}>Slippage Buy/Sell:</span>
                                <span className="font-black text-blue-500">20% / 20%</span>
                            </div>
                            <div className="flex justify-between items-center text-xs">
                                <span className={mutedText}>Вход:</span>
                                <span className="font-black text-blue-500">Market (One hit)</span>
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
                        <ul className="space-y-3 text-xs text-gray-500 list-disc list-inside">
                            <li>Вход без понимания идеи (нарратива).</li>
                            <li>FOMO-покупки на пике импульса.</li>
                            <li>Вера в токен и пересиживание профита.</li>
                            <li>Игнорирование метрик DEV и холдеров.</li>
                        </ul>
                    </div>

                    {/* Tip */}
                    <div className={`p-6 rounded-2xl bg-blue-500/5 border border-blue-500/10 flex gap-4`}>
                        <Rocket className="w-6 h-6 text-blue-500 shrink-0" />
                        <p className="text-xs leading-relaxed text-gray-500">
                            <strong>Насмотренность:</strong> разбирайте токены, улетевшие за сутки. Анализируйте идею, вход и тайминг.
                        </p>
                    </div>
                </div>
            </div>

            {/* Footer */}
            <div className={`rounded-2xl p-6 border-l-8 ${theme === 'dark' ? 'bg-[#0b1015] border-blue-500/50' : 'bg-gray-50 border-blue-500/30'
                } flex gap-4 items-start`}>
                <HelpCircle className="w-8 h-8 text-blue-500 shrink-0" />
                <div className="space-y-1">
                    <h4 className={`text-lg font-black ${headingColor}`}>Итог</h4>
                    <p className={`text-sm leading-relaxed ${theme === 'dark' ? 'text-gray-300' : 'text-gray-600'}`}>
                        Стратегия основана на скорости и дисциплине. Чек-лист важнее интуиции. На старте — меньше сделок, больше анализа.
                    </p>
                </div>
            </div>
        </div>
    )
}
