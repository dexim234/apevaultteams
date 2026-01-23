import React, { useState } from 'react'
import { useThemeStore } from '@/store/themeStore'
import {
    Lightbulb,
    Target,
    Calculator,
    Wrench,
    BarChart3,
    Brain,
    TrendingUp,
    Wallet,
    ExternalLink,
    Zap,
    Activity,
    ArrowLeft
} from 'lucide-react'
import { AVFValueBettingStrategy } from './AVFValueBettingStrategy'
import { AVFArbitrageStrategy } from './AVFArbitrageStrategy'

type StrategyId = 'value-betting' | 'arbitrage' | null;

interface Tool {
    name: string
    url: string
    fullDesc: string
    icon: React.ReactNode
    color: string
    bgColor: string
    tags: string[]
}

export const PolymarketStrategies: React.FC = () => {
    const { theme } = useThemeStore()
    const [activeStrategy, setActiveStrategy] = useState<StrategyId>(null)
    const [activeToolCategory, setActiveToolCategory] = useState<number | null>(null)

    const headingColor = theme === 'dark' ? 'text-white' : 'text-gray-900'
    const innerBg = theme === 'dark' ? 'bg-[#151a21]/50' : 'bg-gray-50/50'
    const mutedText = theme === 'dark' ? 'text-gray-400' : 'text-gray-500'

    const strategies = [
        { id: 'value-betting', name: 'AVF Value Betting', icon: <Target className="w-4 h-4" /> },
        { id: 'arbitrage', name: 'AVF Арбитраж', icon: <Calculator className="w-4 h-4" /> },
    ]

    const tools: Tool[] = [
        {
            name: 'Polymarket',
            url: 'https://polymarket.com/',
            fullDesc: 'Децентрализованная платформа на блокчейне Polygon, на которой можно торговать вероятностями событий, покупая токены результата — YES или NO. Цена токена отражает рыночную вероятность события.',
            icon: <Target className="w-5 h-5" />,
            color: 'text-rose-400',
            bgColor: 'bg-rose-500/10 border-rose-500/20',
            tags: ['Core', 'Trading']
        },
        {
            name: 'HashDive',
            url: 'https://hashdive.com',
            fullDesc: 'Аналитическая платформа для Polymarket и Kalshi. Отслеживайте Smart Scores трейдеров (–100 до +100) на основе их перфоманса. Мониторинг активности китов, крупных сделок, рыночных трендов, ликвидности и волатильности. Анализ позиций и PnL по кошелькам.',
            icon: <BarChart3 className="w-5 h-5" />,
            color: 'text-blue-400',
            bgColor: 'bg-blue-500/10 border-blue-500/20',
            tags: ['Analytics', 'Whales', 'Scores']
        },
        {
            name: 'Polysights',
            url: 'https://app.polysights.xyz',
            fullDesc: 'Платформа аналитики для Polymarket с ML и AI. AI-driven insights и рыночные сводки. Поиск арбитражных возможностей и продвинутые торговые метрики. Анализ цен, объёмов и трендов. Smart фильтры по категориям, трендам и ликвидности. Telegram-бот и live feed событий. Leaderboard и performance metrics.',
            icon: <Brain className="w-5 h-5" />,
            color: 'text-purple-400',
            bgColor: 'bg-purple-500/10 border-purple-500/20',
            tags: ['AI', 'ML', 'Arbitrage', 'Telegram']
        },
        {
            name: 'Munar AI',
            url: 'https://app.munar.ai',
            fullDesc: 'AI крипто-помощник (crypto copilot) для трейдеров. Помогает анализировать рынки, отвечает на вопросы о событиях и стратегиях, генерирует аналитические отчёты и торговые рекомендации.',
            icon: <Zap className="w-5 h-5" />,
            color: 'text-cyan-400',
            bgColor: 'bg-cyan-500/10 border-cyan-500/20',
            tags: ['AI', 'Assistant']
        },
        {
            name: 'Polymarket Analytics',
            url: 'https://polymarketanalytics.com',
            fullDesc: 'Глобальная платформа данных и аналитики для Polymarket. Live цены всех активных маркетов с обновлением каждые 5 минут. Top Traders с фильтрацией по категориям (Politics, Crypto, Sports). Unified Search — поиск маркетов на Polymarket и Kalshi в одном месте. Real-time Activity для отслеживания позиций топ-трейдеров. Portfolio Builder для управления несколькими кошельками и сводной PnL.',
            icon: <TrendingUp className="w-5 h-5" />,
            color: 'text-emerald-400',
            bgColor: 'bg-emerald-500/10 border-emerald-500/20',
            tags: ['Data', 'Live', 'Portfolio']
        },
        {
            name: 'PredictFolio',
            url: 'https://predictfolio.com',
            fullDesc: 'Портфолио и трейдер-аналитика для Polymarket. Portfolio Tracker для отслеживания позиций, PnL и odds в реальном времени. Trader Analytics для анализа стратегий других трейдеров. Benchmarking для сравнения win rate, volume и PnL с топ-кошельками. Follow Winners для копирования лучших сделок. Advanced Search по хендлу, маркету или метрикам.',
            icon: <Wallet className="w-5 h-5" />,
            color: 'text-indigo-400',
            bgColor: 'bg-indigo-500/10 border-indigo-500/20',
            tags: ['Portfolio', 'Analytics', 'Copy Trading']
        },
    ]

    return (
        <div className="space-y-16 pb-20">
            {/* Strategies Block */}
            <section className="space-y-6">
                <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
                    <div className="flex items-center gap-3">
                        <div className="p-2 bg-rose-500/10 rounded-xl border border-rose-500/20">
                            <Lightbulb className="w-6 h-6 text-rose-500" />
                        </div>
                        <div>
                            <h3 className={`text-xl font-black ${headingColor}`}>Стратегии</h3>
                            <p className={`text-sm ${mutedText}`}>
                                Проверенные методики работы с прогнозными рынками
                            </p>
                        </div>
                    </div>

                    {/* Strategy Selector - Visible when strategy is already selected */}
                    {activeStrategy && (
                        <div className={`flex p-1 rounded-xl w-fit ${theme === 'dark' ? 'bg-white/5 border border-white/5' : 'bg-gray-100'}`}>
                            {strategies.map(s => (
                                <button
                                    key={s.id}
                                    onClick={() => setActiveStrategy(s.id as StrategyId)}
                                    className={`flex items-center gap-2 px-4 py-2 rounded-lg text-xs font-bold transition-all duration-300 ${activeStrategy === s.id
                                        ? 'bg-rose-500 text-white shadow-md'
                                        : 'text-gray-500 hover:text-gray-400'
                                        }`}
                                >
                                    {s.icon}
                                    {s.name}
                                </button>
                            ))}
                        </div>
                    )}
                </div>

                {!activeStrategy ? (
                    /* Selection Grid */
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
                        {strategies.map((s) => (
                            <button
                                key={s.id}
                                onClick={() => setActiveStrategy(s.id as StrategyId)}
                                className={`group p-8 rounded-[2.5rem] border text-left transition-all duration-500 hover:-translate-y-2 ${theme === 'dark'
                                    ? 'bg-white/5 border-white/5 hover:border-rose-500/30 hover:bg-rose-500/5'
                                    : 'bg-white border-gray-100 hover:border-rose-500/20 hover:shadow-2xl hover:shadow-rose-500/10'
                                    }`}
                            >
                                <div className={`p-4 rounded-2xl w-fit mb-6 transition-transform duration-500 group-hover:scale-110 ${theme === 'dark' ? 'bg-rose-500/20 text-rose-400' : 'bg-rose-50 text-rose-500'
                                    }`}>
                                    {React.cloneElement(s.icon as React.ReactElement, { className: 'w-8 h-8' })}
                                </div>
                                <h4 className={`text-xl font-black mb-2 ${headingColor}`}>{s.name}</h4>
                                <p className={`text-sm leading-relaxed ${theme === 'dark' ? 'text-gray-400' : 'text-gray-500'}`}>
                                    {s.id === 'value-betting'
                                        ? 'Поиск математического ожидания и недооцененных исходов на рынках предсказаний.'
                                        : 'Заработок на разнице цен между Polymarket и другими платформами или реальностью.'}
                                </p>
                                <div className="mt-6 flex items-center gap-2 text-rose-500 font-bold text-xs uppercase tracking-wider">
                                    Подробнее <ExternalLink className="w-3 h-3" />
                                </div>
                            </button>
                        ))}
                    </div>
                ) : (
                    /* Active Strategy View */
                    <div className={`rounded-3xl border p-1 sm:p-2 ${theme === 'dark' ? 'bg-[#0b1015]/50 border-white/5' : 'bg-white border-gray-100'
                        } shadow-xl animate-scale-up`}>
                        <div className={`p-6 sm:p-8 rounded-[2.5rem] ${innerBg}`}>
                            <div className="mb-6 flex items-center justify-between">
                                <button
                                    onClick={() => setActiveStrategy(null)}
                                    className="text-xs font-bold text-gray-500 hover:text-rose-500 transition-colors flex items-center gap-1"
                                >
                                    ← К списку стратегий
                                </button>
                            </div>
                            {activeStrategy === 'value-betting' ? (
                                <AVFValueBettingStrategy />
                            ) : (
                                <AVFArbitrageStrategy />
                            )}
                        </div>
                    </div>
                )}
            </section>

            {/* Tools Block */}
            <section className="space-y-8">
                <div className="flex items-center gap-3">
                    <div className="p-2 bg-amber-500/10 rounded-xl border border-amber-500/20">
                        <Wrench className="w-6 h-6 text-amber-500" />
                    </div>
                    <div>
                        <h3 className={`text-xl font-black ${headingColor}`}>Инструменты</h3>
                        <p className={`text-sm ${mutedText}`}>
                            Вспомогательные сервисы и аналитика для прогнозных рынков
                        </p>
                    </div>
                </div>

                <div className="space-y-12">
                    {activeToolCategory === null ? (
                        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
                            {[
                                {
                                    title: 'Аналитика и Данные',
                                    description: 'Отслеживание рынков, объёмов и активности китов',
                                    icon: <BarChart3 className="w-8 h-8 text-blue-500" />,
                                    bgColor: 'bg-blue-500/10',
                                    borderColor: 'border-blue-500/20'
                                },
                                {
                                    title: 'AI и Смарт-Инсайты',
                                    description: 'Интеллектуальные помощники и предсказательные модели',
                                    icon: <Brain className="w-8 h-8 text-purple-500" />,
                                    bgColor: 'bg-purple-500/10',
                                    borderColor: 'border-purple-500/20'
                                },
                                {
                                    title: 'Портфолио и Трекинг',
                                    description: 'Управление позициями и мониторинг перфоманса',
                                    icon: <Wallet className="w-8 h-8 text-emerald-500" />,
                                    bgColor: 'bg-emerald-500/10',
                                    borderColor: 'border-emerald-500/20'
                                }
                            ].map((cat, idx) => (
                                <button
                                    key={idx}
                                    onClick={() => setActiveToolCategory(idx)}
                                    className={`group p-6 rounded-3xl border text-left transition-all duration-500 hover:-translate-y-2 ${theme === 'dark'
                                        ? 'bg-[#151a21]/50 border-white/5 hover:border-rose-500/30 hover:bg-rose-500/5'
                                        : 'bg-white border-gray-100 hover:border-rose-500/20 hover:shadow-xl'
                                        }`}
                                >
                                    <div className={`p-4 rounded-2xl w-fit mb-4 transition-transform duration-500 group-hover:scale-110 ${cat.bgColor} ${cat.borderColor} border`}>
                                        {cat.icon}
                                    </div>
                                    <h4 className={`text-lg font-black mb-2 ${headingColor}`}>{cat.title}</h4>
                                    <p className={`text-xs leading-relaxed ${theme === 'dark' ? 'text-gray-400' : 'text-gray-500'}`}>
                                        {cat.description}
                                    </p>
                                    <div className="mt-4 flex items-center gap-2 text-rose-500 font-bold text-[10px] uppercase tracking-wider">
                                        Смотреть инструменты <ExternalLink className="w-3 h-3" />
                                    </div>
                                </button>
                            ))}
                        </div>
                    ) : (
                        <div className="space-y-8 animate-scale-up">
                            <div className="flex items-center justify-between">
                                <button
                                    onClick={() => setActiveToolCategory(null)}
                                    className="text-xs font-bold text-gray-500 hover:text-rose-500 transition-colors flex items-center gap-2"
                                >
                                    <ArrowLeft className="w-4 h-4" /> К категориям
                                </button>
                            </div>

                            {[
                                {
                                    title: 'Аналитика и Данные',
                                    items: tools.filter(t => t.tags.includes('Analytics') || t.tags.includes('Live'))
                                },
                                {
                                    title: 'AI и Смарт-Инсайты',
                                    items: tools.filter(t => t.tags.includes('AI') || t.tags.includes('Scores'))
                                },
                                {
                                    title: 'Портфолио и Трекинг',
                                    items: tools.filter(t => t.tags.includes('Portfolio'))
                                }
                            ].filter((_c, i) => i === activeToolCategory).map((category, catIdx) => (
                                <div key={catIdx} className="space-y-6">
                                    <div className="flex items-center gap-3">
                                        <div className={`p-3 rounded-2xl ${theme === 'dark' ? 'bg-white/5 border border-white/10' : 'bg-gray-100 border border-gray-200'}`}>
                                            <Wrench className="w-6 h-6 text-rose-500" />
                                        </div>
                                        <h4 className={`text-xl font-bold ${headingColor}`}>{category.title}</h4>
                                    </div>
                                    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4">
                                        {category.items.map((tool, idx) => (
                                            <a
                                                key={idx}
                                                href={tool.url}
                                                target="_blank"
                                                rel="noopener noreferrer"
                                                className={`group relative p-5 rounded-2xl border transition-all duration-300 hover:shadow-lg ${theme === 'dark'
                                                    ? 'bg-[#151a21]/50 border-white/5 hover:border-rose-500/30'
                                                    : 'bg-white border-gray-100 hover:border-rose-500/20'
                                                    }`}
                                            >
                                                <div className="absolute top-4 right-4 opacity-0 group-hover:opacity-100 transition-opacity">
                                                    <ExternalLink className={`w-4 h-4 ${theme === 'dark' ? 'text-gray-400' : 'text-gray-500'}`} />
                                                </div>

                                                <div className={`p-2.5 rounded-xl w-fit mb-4 ${tool.bgColor} group-hover:scale-110 transition-transform`}>
                                                    <div className={tool.color}>
                                                        {tool.icon}
                                                    </div>
                                                </div>

                                                <h4 className={`font-bold mb-1 ${headingColor} flex items-center gap-2`}>
                                                    {tool.name}
                                                </h4>
                                                <p className="text-xs text-gray-500 line-clamp-2 leading-relaxed">
                                                    {tool.fullDesc}
                                                </p>
                                            </a>
                                        ))}
                                    </div>
                                </div>
                            ))}
                        </div>
                    )}
                </div>
            </section>

            {/* Quick Stats */}
            <section className={`p-6 rounded-2xl border ${theme === 'dark' ? 'bg-gradient-to-br from-rose-500/5 to-amber-500/5 border-white/5' : 'bg-gradient-to-br from-rose-50 to-amber-50 border-gray-100'
                }`}>
                <div className="flex flex-wrap items-center justify-between gap-6">
                    <div className="flex items-center gap-4">
                        <div className="p-3 rounded-xl bg-rose-500/10">
                            <Activity className="w-6 h-6 text-rose-500" />
                        </div>
                        <div>
                            <p className={`text-sm ${mutedText}`}>Всего инструментов</p>
                            <p className={`text-2xl font-black ${headingColor}`}>{tools.length}</p>
                        </div>
                    </div>
                    <div className="flex flex-wrap gap-3">
                        {['Analytics', 'AI/ML', 'Portfolio', 'Live Data', 'Whales'].map((category, idx) => (
                            <span
                                key={idx}
                                className={`px-3 py-1.5 text-xs font-medium rounded-lg ${theme === 'dark' ? 'bg-white/5 text-gray-300' : 'bg-white text-gray-600 border border-gray-200'
                                    }`}
                            >
                                {category}
                            </span>
                        ))}
                    </div>
                </div>
            </section>
        </div>
    )
}
