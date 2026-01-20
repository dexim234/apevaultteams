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
    ExternalLink
} from 'lucide-react'
import { AVFValueBettingStrategy } from './AVFValueBettingStrategy'
import { AVFArbitrageStrategy } from './AVFArbitrageStrategy'

type StrategyId = 'value-betting' | 'arbitrage';

export const PolymarketStrategies: React.FC = () => {
    const { theme } = useThemeStore()
    const [activeStrategy, setActiveStrategy] = useState<StrategyId>('value-betting')

    const headingColor = theme === 'dark' ? 'text-white' : 'text-gray-900'

    const strategies = [
        { id: 'value-betting', name: 'AVF Value Betting', icon: <Target className="w-4 h-4" /> },
        { id: 'arbitrage', name: 'AVF Арбитраж', icon: <Calculator className="w-4 h-4" /> },
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
                            <p className={`text-sm ${theme === 'dark' ? 'text-gray-400' : 'text-gray-500'}`}>
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
                    <div className={`p-6 sm:p-8 rounded-[2.5rem] ${theme === 'dark' ? 'bg-[#151a21]/50' : 'bg-gray-50/50'
                        }`}>
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
                        <p className={`text-sm ${theme === 'dark' ? 'text-gray-400' : 'text-gray-500'}`}>
                            Аналитические платформы и сервисы для Polymarket
                        </p>
                    </div>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4">
                    {[
                        {
                            name: 'Polymarket',
                            url: 'https://polymarket.com/',
                            desc: 'Децентрализованная платформа на блокчейне Polygon для торговли вероятностями событий. Покупайте токены результата YES или NO, где цена токена отражает рыночную вероятность события. Торговля через смарт-контракты без посредников.',
                            icon: <Target className="w-5 h-5 text-rose-400" />
                        },
                        {
                            name: 'HashDive',
                            url: 'https://hashdive.com',
                            desc: 'Аналитическая платформа с уникальной системой Smart Scores (–100 до +100) на основе перфоманса трейдеров. Отслеживайте активность китов, крупные сделки, рыночные тренды, ликвидность и волатильность. Портфельный анализ по адресам.',
                            icon: <BarChart3 className="w-5 h-5 text-blue-400" />
                        },
                        {
                            name: 'Polysights',
                            url: 'https://app.polysights.xyz',
                            desc: 'Платформа аналитики с ML/AI: AI-driven insights и рыночные сводки, поиск арбитражных возможностей, продвинутые торговые метрики. Smart фильтры по категориям, трендам и ликвидности. Telegram-бот и live feed событий.',
                            icon: <Brain className="w-5 h-5 text-purple-400" />
                        },
                        {
                            name: 'Munar AI',
                            url: 'https://app.munar.ai',
                            desc: 'AI-криптопомощник (crypto copilot) для трейдеров. Помогает анализировать рынки, отвечает на вопросы о событиях и стратегиях, генерирует аналитические отчёты и торговые рекомендации.',
                            icon: <Brain className="w-5 h-5 text-cyan-400" />
                        },
                        {
                            name: 'Polymarket Analytics',
                            url: 'https://polymarketanalytics.com',
                            desc: 'Глобальная платформа данных: live-цены всех активных маркетов (обновление каждые 5 минут), Top Traders с фильтрацией по категориям (Politics, Crypto, Sports), Unified Search для Polymarket и Kalshi, Real-time Activity и Portfolio Builder.',
                            icon: <TrendingUp className="w-5 h-5 text-emerald-400" />
                        },
                        {
                            name: 'PredictFolio',
                            url: 'https://predictfolio.com',
                            desc: 'Портфолио и трейдер-аналитика: Portfolio Tracker для отслеживания позиций и PnL в реальном времени, Trader Analytics для анализа стратегий, Benchmarking для сравнения с топ-трейдерами, Follow Winners для копирования сделок.',
                            icon: <Wallet className="w-5 h-5 text-indigo-400" />
                        },
                    ].map((tool, idx) => (
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
