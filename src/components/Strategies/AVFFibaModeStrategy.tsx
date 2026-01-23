import React, { useState } from 'react'
import { useThemeStore } from '@/store/themeStore'
import {
    Activity,
    ChevronDown,
    ChevronUp,
    Target,
    BarChart3,
    HelpCircle,
    Info,
    Rocket,
    XCircle,
    Twitter,
    Layers,
    Brain,
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
                    <div className={`flex items-center justify-center w-10 h-10 rounded-xl font-black text-lg ${theme === 'dark' ? 'bg-indigo-500/20 text-indigo-400' : 'bg-indigo-50 text-indigo-600'
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

export const AVFFibaModeStrategy: React.FC = () => {
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
                ? 'bg-gradient-to-br from-[#1a212a] to-[#0f1216] border-indigo-500/20 shadow-2xl'
                : 'bg-gradient-to-br from-white to-indigo-50/30 border-indigo-500/10 shadow-xl'
                }`}>
                <div className="absolute top-0 right-0 w-64 h-64 bg-indigo-500/5 blur-3xl rounded-full -mr-20 -mt-20 pointer-events-none"></div>

                <div className="relative flex flex-col md:flex-row gap-8 items-start">
                    <div className={`p-4 rounded-2xl ${theme === 'dark' ? 'bg-indigo-500/10' : 'bg-indigo-500/5'}`}>
                        <Layers className={`w-12 h-12 text-indigo-500`} />
                    </div>
                    <div className="flex-1 space-y-4">
                        <div className="flex items-center gap-3">
                            <h2 className={`text-2xl md:text-3xl font-black ${headingColor}`}>AVF - FIBA MODE</h2>
                            <span className="px-3 py-1 rounded-full bg-indigo-500/20 text-indigo-400 text-[10px] font-black uppercase tracking-widest border border-indigo-500/20">Counter-Trend</span>
                        </div>
                        <p className={`text-lg leading-relaxed ${theme === 'dark' ? 'text-gray-300' : 'text-gray-600'}`}>
                            Контртрендовая подстратегия для забора технического отката. Включается, когда импульс упущен, но актив жив.
                        </p>
                    </div>
                </div>
            </div>

            {/* 2. Red Flags / When NOT to use */}
            <div className={`p-6 rounded-2xl border ${theme === 'dark' ? 'bg-rose-500/5 border-rose-500/20' : 'bg-rose-50 border-rose-500/20'}`}>
                <div className="flex items-center gap-3 mb-4">
                    <ShieldAlert className="w-6 h-6 text-rose-500" />
                    <h3 className={`text-lg font-black ${headingColor}`}>FIBA НЕ используется, если:</h3>
                </div>
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                    {[
                        "Токен мёртвый по объёму",
                        "Нет живого инфоповода (X)",
                        "Twitter молчит (нет твитов)",
                        "Разовый памп без комьюнити",
                        "График — тонкие линии",
                        "Слив без попыток откупа"
                    ].map((text, i) => (
                        <div key={i} className="flex items-center gap-2 text-xs text-rose-600/80 font-medium">
                            <XCircle className="w-4 h-4 shrink-0" />
                            {text}
                        </div>
                    ))}
                </div>
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
                {/* 3. Guide */}
                <div className="lg:col-span-2 space-y-4">
                    <StrategyStep
                        number={1}
                        title="Обязательные условия"
                        icon={<Activity className="w-5 h-5 text-indigo-500" />}
                        isOpen={openStep === 1}
                        onToggle={() => toggleStep(1)}
                    >
                        <div className="space-y-4">
                            <div className={`p-4 rounded-xl border ${theme === 'dark' ? 'bg-white/5 border-white/10' : 'bg-gray-50 border-gray-200'}`}>
                                <h5 className="text-xs font-bold uppercase mb-2 text-indigo-500 flex items-center gap-2">
                                    <Twitter className="w-4 h-4" /> Живой Twitter & Инфополе
                                </h5>
                                <p className="text-xs text-gray-500 leading-relaxed">
                                    Актуальное сопровождение: новые твиты, репосты, обсуждения в чатах. FIBA не работает на «молчаливых» токенах.
                                </p>
                            </div>
                            <div className={`p-4 rounded-xl border ${theme === 'dark' ? 'bg-white/5 border-white/10' : 'bg-gray-50 border-gray-200'}`}>
                                <h5 className="text-xs font-bold uppercase mb-2 text-indigo-500 flex items-center gap-2">
                                    <BarChart3 className="w-4 h-4" /> Импульсный объём
                                </h5>
                                <p className="text-xs text-gray-500 leading-relaxed">
                                    Свечи с телами, а не хвостами. Объём — это ликвидность, без которой уровни Фибо являются фикцией.
                                </p>
                            </div>
                        </div>
                    </StrategyStep>

                    <StrategyStep
                        number={2}
                        title="Механика входа"
                        icon={<MousePointer2 className="w-5 h-5 text-indigo-500" />}
                        isOpen={openStep === 2}
                        onToggle={() => toggleStep(2)}
                    >
                        <div className="space-y-3 text-sm">
                            <p className="font-bold">Таймфрейм: <span className="text-indigo-500">15s / 1m</span></p>
                            <p>Построение: Сетка Фибо строится <strong>от лоя импульса до его хая</strong>.</p>
                            <div className="grid grid-cols-2 gap-4 mt-2">
                                <div className="p-3 rounded-lg border border-indigo-500/30 bg-indigo-500/5 text-center">
                                    <p className="text-[10px] uppercase font-bold text-indigo-400">Вход 1</p>
                                    <p className="text-lg font-black tracking-widest">0.618</p>
                                </div>
                                <div className="p-3 rounded-lg border border-indigo-500/30 bg-indigo-500/5 text-center">
                                    <p className="text-[10px] uppercase font-bold text-indigo-400">Вход 2</p>
                                    <p className="text-lg font-black tracking-widest">0.786</p>
                                </div>
                            </div>
                            <p className="text-xs italic text-center mt-2 opacity-70">Используйте только лимитные ордера</p>
                        </div>
                    </StrategyStep>

                    <StrategyStep
                        number={3}
                        title="Подтверждение сигнала"
                        icon={<Target className="w-5 h-5 text-indigo-500" />}
                        isOpen={openStep === 3}
                        onToggle={() => toggleStep(3)}
                    >
                        <div className={`p-4 rounded-xl border-l-4 border-indigo-500 ${theme === 'dark' ? 'bg-white/5' : 'bg-indigo-50'}`}>
                            <p className="text-xs font-bold text-indigo-500 uppercase mb-2">Уровень — не сигнал!</p>
                            <ul className="text-xs space-y-2">
                                <li className="flex items-start gap-2">🔹 <span>На уровне должен появиться <strong>объём на откуп</strong>.</span></li>
                                <li className="flex items-start gap-2">🔹 <span>Замедление падения (удар в стенку ликвидности).</span></li>
                                <li className="flex items-start gap-2">🔹 <span>Отсутствие агрессивного пролива (DevSell) в коррекции.</span></li>
                            </ul>
                        </div>
                    </StrategyStep>

                    <StrategyStep
                        number={4}
                        title="Цели и Риски"
                        icon={<ShieldAlert className="w-5 h-5 text-indigo-500" />}
                        isOpen={openStep === 4}
                        onToggle={() => toggleStep(4)}
                    >
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                            <div className="space-y-4">
                                <h5 className="text-xs font-bold uppercase text-indigo-500">Логика сделки</h5>
                                <ul className="text-[11px] space-y-1 opacity-80 list-disc list-inside">
                                    <li>Вход: Уровень + реакция</li>
                                    <li>Цель: Технический отскок</li>
                                    <li>Фиксация: <span className="font-bold text-green-500">20–40%</span></li>
                                </ul>
                            </div>
                            <div className="space-y-4">
                                <h5 className="text-xs font-bold uppercase text-rose-500">Риск-модель</h5>
                                <ul className="text-[11px] space-y-1 opacity-80 list-disc list-inside">
                                    <li>Меньший объём позиции</li>
                                    <li>Более быстрый стоп-лосс</li>
                                    <li>Никаких усреднений</li>
                                    <li>Никакой "веры" в токен</li>
                                </ul>
                            </div>
                        </div>
                    </StrategyStep>
                </div>

                {/* Sidebar */}
                <div className="space-y-6">
                    {/* Psychology Section */}
                    <div className={`rounded-3xl p-6 border ${theme === 'dark' ? 'bg-[#151a21] border-white/5' : 'bg-white border-gray-100'} shadow-xl`}>
                        <div className="flex items-center gap-3 mb-4">
                            <Brain className="w-6 h-6 text-indigo-500" />
                            <h4 className={`font-black uppercase text-sm ${headingColor}`}>Психология</h4>
                        </div>
                        <p className="text-xs leading-relaxed text-gray-500">
                            FIBA — это работа на <strong>чужой фиксации</strong>. Ты зарабатываешь на реакции рынка на коррекцию, а не на глобальном росте.
                        </p>
                    </div>

                    <div className={`p-6 rounded-3xl bg-indigo-500/5 border border-indigo-500/10 space-y-4`}>
                        <h4 className="flex items-center gap-2 text-xs font-black uppercase text-indigo-400">
                            <Rocket className="w-4 h-4" /> Построение
                        </h4>
                        <p className="text-[10px] leading-relaxed opacity-80">
                            <strong>Концептуальная формула:</strong> Жизнь в активе + объём + структура + уровень = сделка. Без любого элемента вход запрещён.
                        </p>
                    </div>

                    <div className={`p-6 rounded-3xl border border-dashed border-gray-300 text-center opacity-70`}>
                        <HelpCircle className="w-8 h-8 text-gray-400 mx-auto mb-2" />
                        <p className="text-[10px] font-bold">Нужна помощь?</p>
                        <p className="text-[9px]">Раздел «Нарративы» поможет найти живые активы.</p>
                    </div>
                </div>
            </div>

            {/* Footer summary */}
            <div className={`rounded-2xl p-6 border-l-8 ${theme === 'dark' ? 'bg-[#0b1015] border-indigo-500/50' : 'bg-gray-50 border-indigo-500/30'} flex gap-4 items-start`}>
                <Info className="w-8 h-8 text-indigo-500 shrink-0" />
                <div className="space-y-1">
                    <h4 className={`text-lg font-black ${headingColor}`}>Финальное правило</h4>
                    <p className={`text-sm leading-relaxed ${theme === 'dark' ? 'text-gray-300' : 'text-gray-600'}`}>
                        FIBA — это короткий технический трейд, а не вера в перехай. Отработал отскок, забрал профит, вышел.
                    </p>
                </div>
            </div>
        </div>
    )
}
