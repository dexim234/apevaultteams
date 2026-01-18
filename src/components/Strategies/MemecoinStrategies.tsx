import React, { useState } from 'react'
import { useThemeStore } from '@/store/themeStore'
import {
    Lightbulb,
    BookOpen,
    Wrench,
    Brain,
    Zap,
    Clock,
    Repeat,
    BarChart,
    MessageSquare,
    Search,
    Timer,
    Terminal,
    Monitor,
    Bot,
    Bell,
    Database,
    Share2,
    ShieldAlert,
    Users,
    ShieldCheck,
    Activity,
    TrendingUp,
    ExternalLink
} from 'lucide-react'
import { AVFLateVolumeStrategy } from './AVFLateVolumeStrategy'
import { AVFIntradayStrategy } from './AVFIntradayStrategy'
import { AVFFlipStrategy } from './AVFFlipStrategy'

type StrategyId = 'late-volume' | 'intraday' | 'flip';

export const MemecoinStrategies: React.FC = () => {
    const { theme } = useThemeStore()
    const [activeStrategy, setActiveStrategy] = useState<StrategyId>('late-volume')

    const headingColor = theme === 'dark' ? 'text-white' : 'text-gray-900'

    const lessons = [
        { title: 'Психология', icon: <Brain className="w-5 h-5 text-purple-400" />, desc: 'Управление эмоциями и FOMO' },
        { title: 'Интрадей-торговля', icon: <Zap className="w-5 h-5 text-amber-400" />, desc: 'Быстрые сделки внутри дня' },
        { title: 'Среднесрок и геймхантинг', icon: <Clock className="w-5 h-5 text-blue-400" />, desc: 'Поиск долгосрочных нарративов' },
        { title: 'Флип', icon: <Repeat className="w-5 h-5 text-emerald-400" />, desc: 'Стратегии быстрого перезахода' },
        { title: 'Фибоначчи', icon: <BarChart className="w-5 h-5 text-rose-400" />, desc: 'Технический анализ уровней' },
        { title: 'Нарративы', icon: <MessageSquare className="w-5 h-5 text-sky-400" />, desc: 'Анализ рыночных трендов' },
        { title: 'Ончейн-анализ', icon: <Search className="w-5 h-5 text-indigo-400" />, desc: 'Отслеживание кошельков и китов' },
    ]

    const strategies = [
        { id: 'late-volume', name: 'AVF Late Volume', icon: <BarChart className="w-4 h-4" /> },
        { id: 'intraday', name: 'AVF Intraday', icon: <Zap className="w-4 h-4" /> },
        { id: 'flip', name: 'AVF FLIP-1S', icon: <Timer className="w-4 h-4" /> },
    ]

    return (
        <div className="space-y-16 pb-20">
            {/* 1. Lessons Block */}
            <section className="space-y-6">
                <div className="flex items-center gap-3">
                    <div className="p-2 bg-purple-500/10 rounded-xl border border-purple-500/20">
                        <BookOpen className="w-6 h-6 text-purple-500" />
                    </div>
                    <div>
                        <h3 className={`text-xl font-black ${headingColor}`}>Уроки</h3>
                        <p className={`text-sm ${theme === 'dark' ? 'text-gray-400' : 'text-gray-500'}`}>
                            Образовательная база для работы с мемкоинами
                        </p>
                    </div>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4">
                    {lessons.map((lesson, idx) => (
                        <div
                            key={idx}
                            className={`group p-5 rounded-2xl border transition-all duration-300 hover:shadow-lg ${theme === 'dark'
                                ? 'bg-[#151a21]/50 border-white/5 hover:border-purple-500/30'
                                : 'bg-white border-gray-100 hover:border-purple-500/20'
                                }`}
                        >
                            <div className={`p-2.5 rounded-xl w-fit mb-4 ${theme === 'dark' ? 'bg-white/5' : 'bg-gray-50'} group-hover:scale-110 transition-transform`}>
                                {lesson.icon}
                            </div>
                            <h4 className={`font-bold mb-1 ${headingColor}`}>{lesson.title}</h4>
                            <p className="text-xs text-gray-500 line-clamp-2">{lesson.desc}</p>
                        </div>
                    ))}
                </div>
            </section>

            {/* 2. Strategies Block */}
            <section className="space-y-6">
                <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
                    <div className="flex items-center gap-3">
                        <div className="p-2 bg-blue-500/10 rounded-xl border border-blue-500/20">
                            <Lightbulb className="w-6 h-6 text-blue-500" />
                        </div>
                        <div>
                            <h3 className={`text-xl font-black ${headingColor}`}>Стратегии</h3>
                            <p className={`text-sm ${theme === 'dark' ? 'text-gray-400' : 'text-gray-500'}`}>
                                Проверенные методики отбора и управления позициями
                            </p>
                        </div>
                    </div>

                    {/* Strategy Selector */}
                    <div className={`flex p-1 rounded-xl w-fit ${theme === 'dark' ? 'bg-white/5 border border-white/5' : 'bg-gray-100'}`}>
                        {strategies.map(s => (
                            <button
                                key={s.id}
                                onClick={() => setActiveStrategy(s.id as StrategyId)}
                                className={`flex items-center gap-2 px-4 py-2 rounded-lg text-xs font-bold transition-all duration-300 ${activeStrategy === s.id
                                    ? 'bg-blue-500 text-white shadow-md'
                                    : 'text-gray-500 hover:text-gray-400'
                                    }`}
                            >
                                {s.icon}
                                {s.name}
                            </button>
                        ))}
                    </div>
                </div>

                <div className={`rounded-3xl border p-1 sm:p-2 ${theme === 'dark' ? 'bg-[#0b1015]/50 border-white/5' : 'bg-white border-gray-100'
                    } shadow-xl`}>
                    <div className={`p-6 sm:p-8 rounded-[2.5rem] ${theme === 'dark' ? 'bg-[#151a21]/50' : 'bg-gray-50/50'
                        }`}>
                        {activeStrategy === 'late-volume' ? (
                            <AVFLateVolumeStrategy />
                        ) : activeStrategy === 'intraday' ? (
                            <AVFIntradayStrategy />
                        ) : (
                            <AVFFlipStrategy />
                        )}
                    </div>
                </div>
            </section>

            {/* 3. Tools Block */}
            <section className="space-y-6">
                <div className="flex items-center gap-3">
                    <div className="p-2 bg-amber-500/10 rounded-xl border border-amber-500/20">
                        <Wrench className="w-6 h-6 text-amber-500" />
                    </div>
                    <div>
                        <h3 className={`text-xl font-black ${headingColor}`}>Инструменты</h3>
                        <p className={`text-sm ${theme === 'dark' ? 'text-gray-400' : 'text-gray-500'}`}>
                            Вспомогательные сервисы и скрипты
                        </p>
                    </div>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4">
                    {[
                        { name: 'Sniper', url: 'https://www.sniper.xyz', desc: 'Терминал с демо-торговлей для отработки навыков', icon: <Terminal className="w-5 h-5 text-green-400" /> },
                        { name: 'Axiom', url: 'https://axiom.trade', desc: 'Профессиональный терминал для анализа и выбора монет', icon: <BarChart className="w-5 h-5 text-blue-400" /> },
                        { name: 'GMGN', url: 'https://gmgn.ai', desc: 'Снайпер-бот и аналитическая платформа', icon: <Zap className="w-5 h-5 text-yellow-400" /> },
                        { name: 'DexScreener', url: 'https://dexscreener.com', desc: 'Мониторинг графиков и поиск новых пар', icon: <Monitor className="w-5 h-5 text-slate-400" /> },
                        { name: 'Alpha One', url: 'https://t.me/alpha_web3_bot', desc: 'ТГ-терминал с сигналами и AI-агентом', icon: <Bot className="w-5 h-5 text-purple-400" /> },
                        { name: 'Fasol', url: 'https://t.me/Fasol_robot', desc: 'Торговый бот с гибкими алертами', icon: <Bell className="w-5 h-5 text-red-400" /> },
                        { name: 'Solscan', url: 'https://solscan.io', desc: 'Эксплорер блокчейна Solana', icon: <Search className="w-5 h-5 text-teal-400" /> },
                        { name: 'Etherscan', url: 'https://etherscan.io', desc: 'Эксплорер блокчейна Ethereum', icon: <Database className="w-5 h-5 text-indigo-400" /> },
                        { name: 'BscScan', url: 'https://bscscan.com', desc: 'Эксплорер блокчейна BSC', icon: <Database className="w-5 h-5 text-yellow-500" /> },
                        { name: 'Bubblemaps', url: 'https://bubblemaps.io', desc: 'Визуализация связей кошельков', icon: <Share2 className="w-5 h-5 text-pink-400" /> },
                        { name: 'Frontrun', url: 'https://chromewebstore.google.com/detail/frontrun/kifcalgkjaphbpbcgokommchjiimejah', desc: 'Анализ кошельков и защита от фронтрана', icon: <ShieldAlert className="w-5 h-5 text-orange-400" /> },
                        { name: 'Nansen', url: 'https://www.nansen.ai', desc: 'Smart Money и глубокая аналитика', icon: <Brain className="w-5 h-5 text-cyan-400" /> },
                        { name: 'HolderScan', url: 'https://holderscan.com', desc: 'Анализ холдеров и кластеров', icon: <Users className="w-5 h-5 text-emerald-400" /> },
                        { name: 'RugCheck', url: 'https://rugcheck.xyz', desc: 'Проверка токенов на безопасность', icon: <ShieldCheck className="w-5 h-5 text-red-500" /> },
                        { name: 'SolSniffer', url: 'https://www.solsniffer.com', desc: 'Сниффер новых токенов Solana', icon: <Activity className="w-5 h-5 text-violet-400" /> },
                        { name: 'KolScan', url: 'https://kolscan.io', desc: 'Трекинг KOL-ов и инфлюенсеров', icon: <TrendingUp className="w-5 h-5 text-fuchsia-400" /> },
                    ].map((tool, idx) => (
                        <a
                            key={idx}
                            href={tool.url}
                            target="_blank"
                            rel="noopener noreferrer"
                            className={`group relative p-5 rounded-2xl border transition-all duration-300 hover:shadow-lg ${theme === 'dark'
                                    ? 'bg-[#151a21]/50 border-white/5 hover:border-blue-500/30'
                                    : 'bg-white border-gray-100 hover:border-blue-500/20'
                                }`}
                        >
                            <div className="absolute top-4 right-4 opacity-0 group-hover:opacity-100 transition-opacity">
                                <ExternalLink className={`w-4 h-4 ${theme === 'dark' ? 'text-gray-400' : 'text-gray-500'}`} />
                            </div>

                            <div className={`p-2.5 rounded-xl w-fit mb-4 ${theme === 'dark' ? 'bg-white/5' : 'bg-gray-50'
                                } group-hover:scale-110 transition-transform`}>
                                {tool.icon}
                            </div>

                            <h4 className={`font-bold mb-1 ${headingColor} flex items-center gap-2`}>
                                {tool.name}
                            </h4>
                            <p className="text-xs text-gray-500 line-clamp-2 leading-relaxed">
                                {tool.desc}
                            </p>
                        </a>
                    ))}
                </div>
            </section>
        </div>
    )
}
