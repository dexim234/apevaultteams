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
    Activity
} from 'lucide-react'
import { AVFValueBettingStrategy } from './AVFValueBettingStrategy'
import { AVFArbitrageStrategy } from './AVFArbitrageStrategy'

type StrategyId = 'value-betting' | 'arbitrage';

interface Tool {
    name: string
    url: string
    shortDesc: string
    fullDesc: string
    icon: React.ReactNode
    color: string
    bgColor: string
    tags: string[]
}

export const PolymarketStrategies: React.FC = () => {
    const { theme } = useThemeStore()
    const [activeStrategy, setActiveStrategy] = useState<StrategyId>('value-betting')

    const headingColor = theme === 'dark' ? 'text-white' : 'text-gray-900'
    const cardBg = theme === 'dark' ? 'bg-[#151a21]/50' : 'bg-white'
    const cardBorder = theme === 'dark' ? 'border-white/5' : 'border-gray-100'
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
            shortDesc: 'Децентрализованная платформа на блокчейне Polygon',
            fullDesc: 'Децентрализованная платформа на блокчейне Polygon, на которой можно торговать вероятностями событий, покупая токены результата — YES или NO. Цена токена отражает рыночную вероятность события.',
            icon: <Target className="w-5 h-5" />,
            color: 'text-rose-400',
            bgColor: 'bg-rose-500/10 border-rose-500/20',
            tags: ['Core', 'Trading']
        },
        {
            name: 'HashDive',
            url: 'https://hashdive.com',
            shortDesc: 'Аналитика Polymarket и Kalshi с Smart Scores',
            fullDesc: 'Аналитическая платформа для Polymarket и Kalshi. Отслеживайте Smart Scores трейдеров (–100 до +100) на основе их перфоманса. Мониторинг активности китов, крупных сделок, рыночных трендов, ликвидности и волатильности. Анализ позиций и PnL по кошелькам.',
            icon: <BarChart3 className="w-5 h-5" />,
            color: 'text-blue-400',
            bgColor: 'bg-blue-500/10 border-blue-500/20',
            tags: ['Analytics', 'Whales', 'Scores']
        },
        {
            name: 'Polysights',
            url: 'https://app.polysights.xyz',
            shortDesc: 'AI/ML аналитика и арбитражные возможности',
            fullDesc: 'Платформа аналитики для Polymarket с ML и AI. AI-driven insights и рыночные сводки. Поиск арбитражных возможностей и продвинутые торговые метрики. Анализ цен, объёмов и трендов. Smart фильтры по категориям, трендам и ликвидности. Telegram-бот и live feed событий. Leaderboard и performance metrics.',
            icon: <Brain className="w-5 h-5" />,
            color: 'text-purple-400',
            bgColor: 'bg-purple-500/10 border-purple-500/20',
            tags: ['AI', 'ML', 'Arbitrage', 'Telegram']
        },
        {
            name: 'Munar AI',
            url: 'https://app.munar.ai',
            shortDesc: 'AI-криптопомощник для трейдеров',
            fullDesc: 'AI крипто-помощник (crypto copilot) для трейдеров. Помогает анализировать рынки, отвечает на вопросы о событиях и стратегиях, генерирует аналитические отчёты и торговые рекомендации.',
            icon: <Zap className="w-5 h-5" />,
            color: 'text-cyan-400',
            bgColor: 'bg-cyan-500/10 border-cyan-500/20',
            tags: ['AI', 'Assistant']
        },
        {
            name: 'Polymarket Analytics',
            url: 'https://polymarketanalytics.com',
            shortDesc: 'Глобальная платформа данных и аналитики',
            fullDesc: 'Глобальная платформа данных и аналитики для Polymarket. Live цены всех активных маркетов с обновлением каждые 5 минут. Top Traders с фильтрацией по категориям (Politics, Crypto, Sports). Unified Search — поиск маркетов на Polymarket и Kalshi в одном месте. Real-time Activity для отслеживания позиций топ-трейдеров. Portfolio Builder для управления несколькими кошельками и сводной PnL.',
            icon: <TrendingUp className="w-5 h-5" />,
            color: 'text-emerald-400',
            bgColor: 'bg-emerald-500/10 border-emerald-500/20',
            tags: ['Data', 'Live', 'Portfolio']
        },
        {
            name: 'PredictFolio',
            url: 'https://predictfolio.com',
            shortDesc: 'Портфолио и трейдер-аналитика',
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

                    {/* Strategy Selector */}
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
                </div>

                <div className={`rounded-3xl border p-1 sm:p-2 ${theme === 'dark' ? 'bg-[#0b1015]/50 border-white/5' : 'bg-white border-gray-100'
                    } shadow-xl`}>
                    <div className={`p-6 sm:p-8 rounded-[2.5rem] ${innerBg}`}>
                        {activeStrategy === 'value-betting' ? (
                            <AVFValueBettingStrategy />
                        ) : (
                            <AVFArbitrageStrategy />
                        )}
                    </div>
                </div>
            </section>

            {/* Tools Block */}
            <section className="space-y-6">
                <div className="flex items-center gap-3">
                    <div className="p-2 bg-amber-500/10 rounded-xl border border-amber-500/20">
                        <Wrench className="w-6 h-6 text-amber-500" />
                    </div>
                    <div>
                        <h3 className={`text-xl font-black ${headingColor}`}>Инструменты</h3>
                        <p className={`text-sm ${mutedText}`}>
                            Аналитические платформы и сервисы для Polymarket
                        </p>
                    </div>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-3 gap-5">
                    {tools.map((tool, idx) => (
                        <a
                            key={idx}
                            href={tool.url}
                            target="_blank"
                            rel="noopener noreferrer"
                            className={`group relative flex flex-col p-6 rounded-2xl border transition-all duration-300 hover:shadow-xl hover:-translate-y-1 ${theme === 'dark'
                                ? `${cardBg} ${cardBorder} hover:border-rose-500/30`
                                : 'bg-white border-gray-100 hover:border-rose-500/30 hover:shadow-lg'
                                }`}
                        >
                            {/* External Link Icon */}
                            <div className="absolute top-4 right-4 opacity-0 group-hover:opacity-100 transition-all duration-300 transform translate-x-2 group-hover:translate-x-0">
                                <ExternalLink className={`w-4 h-4 ${theme === 'dark' ? 'text-gray-400' : 'text-gray-500'}`} />
                            </div>

                            {/* Header with Icon */}
                            <div className="flex items-start gap-4 mb-4">
                                <div className={`p-3 rounded-xl ${tool.bgColor} group-hover:scale-110 transition-transform duration-300`}>
                                    <div className={tool.color}>
                                        {tool.icon}
                                    </div>
                                </div>
                                <div className="flex-1 min-w-0">
                                    <h4 className={`font-bold ${headingColor} text-lg mb-1`}>
                                        {tool.name}
                                    </h4>
                                    <p className={`text-xs font-medium ${tool.color} truncate`}>
                                        {tool.shortDesc}
                                    </p>
                                </div>
                            </div>

                            {/* Tags */}
                            <div className="flex flex-wrap gap-2 mb-4">
                                {tool.tags.map((tag, tagIdx) => (
                                    <span
                                        key={tagIdx}
                                        className={`px-2 py-1 text-[10px] font-semibold uppercase tracking-wider rounded-full ${theme === 'dark' ? 'bg-white/5 text-gray-400' : 'bg-gray-100 text-gray-500'
                                            }`}
                                    >
                                        {tag}
                                    </span>
                                ))}
                            </div>

                            {/* Description */}
                            <p className={`text-sm leading-relaxed ${mutedText} flex-1`}>
                                {tool.fullDesc}
                            </p>

                            {/* Hover Line */}
                            <div className={`absolute bottom-0 left-0 right-0 h-0.5 bg-gradient-to-r from-rose-500 to-amber-500 opacity-0 group-hover:opacity-100 transition-opacity duration-300 rounded-b-2xl`} />
                        </a>
                    ))}
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
                        {['Analytics', 'AI/ML', 'Portfolio', 'Live Data', 'Copy Trading'].map((category, idx) => (
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
