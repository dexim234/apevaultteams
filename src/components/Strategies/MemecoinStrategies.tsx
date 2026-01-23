import React, { useState, useEffect } from 'react'
import { useThemeStore } from '@/store/themeStore'
import { useAuthStore } from '@/store/authStore'
import { useAdminStore } from '@/store/adminStore'
import { checkUserAccess } from '@/services/firestoreService'
import {
    Lightbulb,
    Wrench,
    Brain,
    Zap,
    BarChart,
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
    ExternalLink,
    Lock,
    MessageSquare,
    Calendar
} from 'lucide-react'
import { AVFLateVolumeStrategy } from './AVFLateVolumeStrategy'
import { AVFIntradayStrategy } from './AVFIntradayStrategy'
import { AVFFlipStrategy } from './AVFFlipStrategy'

type StrategyId = 'late-volume' | 'intraday' | 'flip' | null;

export const MemecoinStrategies: React.FC = () => {
    const { theme } = useThemeStore()
    const { user } = useAuthStore()
    const { isAdmin } = useAdminStore()
    const [activeStrategy, setActiveStrategy] = useState<StrategyId>(null)
    const [hasStrategiesAccess, setHasStrategiesAccess] = useState(true)
    const [hasToolsAccess, setHasToolsAccess] = useState(true)
    const [loading, setLoading] = useState(true)

    const headingColor = theme === 'dark' ? 'text-white' : 'text-gray-900'

    useEffect(() => {
        const checkAccess = async () => {
            if (!user || isAdmin) {
                setLoading(false)
                return
            }

            const [stratResult, toolsResult] = await Promise.all([
                checkUserAccess(user.id, 'tools_strategies_view'),
                checkUserAccess(user.id, 'tools_items_view')
            ])

            setHasStrategiesAccess(stratResult.hasAccess)
            setHasToolsAccess(toolsResult.hasAccess)
            setLoading(false)
        }

        checkAccess()
    }, [user, isAdmin])

    const strategies = [
        { id: 'late-volume', name: 'AVF Late Volume', icon: <BarChart className="w-4 h-4" /> },
        { id: 'intraday', name: 'AVF Intraday', icon: <Zap className="w-4 h-4" /> },
        { id: 'flip', name: 'AVF FLIP-1S', icon: <Timer className="w-4 h-4" /> },
    ]

    if (loading) {
        return null // Sub-loading handled by parent
    }

    return (
        <div className="space-y-16 pb-20">
            {/* 2. Strategies Block */}
            {hasStrategiesAccess ? (
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

                        {/* Strategy Selector - Visible when strategy is already selected */}
                        {activeStrategy && (
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
                        )}
                    </div>

                    {!activeStrategy ? (
                        /* Selection Grid */
                        <div className="grid grid-cols-1 sm:grid-cols-3 gap-6">
                            {strategies.map((s) => (
                                <button
                                    key={s.id}
                                    onClick={() => setActiveStrategy(s.id as StrategyId)}
                                    className={`group p-8 rounded-[2.5rem] border text-left transition-all duration-500 hover:-translate-y-2 ${theme === 'dark'
                                        ? 'bg-white/5 border-white/5 hover:border-blue-500/30 hover:bg-blue-500/5'
                                        : 'bg-white border-gray-100 hover:border-blue-500/20 hover:shadow-2xl hover:shadow-blue-500/10'
                                        }`}
                                >
                                    <div className={`p-4 rounded-2xl w-fit mb-6 transition-transform duration-500 group-hover:scale-110 ${theme === 'dark' ? 'bg-blue-500/20 text-blue-400' : 'bg-blue-50 text-blue-500'
                                        }`}>
                                        {React.cloneElement(s.icon as React.ReactElement, { className: 'w-8 h-8' })}
                                    </div>
                                    <h4 className={`text-xl font-black mb-2 ${headingColor}`}>{s.name}</h4>
                                    <p className={`text-sm leading-relaxed ${theme === 'dark' ? 'text-gray-400' : 'text-gray-500'}`}>
                                        {s.id === 'late-volume' ? 'Работа с аномальными объемами на поздних стадиях.' :
                                            s.id === 'intraday' ? 'Внутридневная торговля на основе технического анализа.' :
                                                'Скоростная торговля на изменениях цены в 1 секунду.'}
                                    </p>
                                    <div className="mt-6 flex items-center gap-2 text-blue-500 font-bold text-xs uppercase tracking-wider">
                                        Подробнее <ExternalLink className="w-3 h-3" />
                                    </div>
                                </button>
                            ))}
                        </div>
                    ) : (
                        /* Active Strategy View */
                        <div className={`rounded-3xl border p-1 sm:p-2 ${theme === 'dark' ? 'bg-[#0b1015]/50 border-white/5' : 'bg-white border-gray-100'
                            } shadow-xl animate-scale-up`}>
                            <div className={`p-6 sm:p-8 rounded-[2.5rem] ${theme === 'dark' ? 'bg-[#151a21]/50' : 'bg-gray-50/50'
                                }`}>
                                <div className="mb-6 flex items-center justify-between">
                                    <button
                                        onClick={() => setActiveStrategy(null)}
                                        className="text-xs font-bold text-gray-500 hover:text-blue-500 transition-colors flex items-center gap-1"
                                    >
                                        ← К списку стратегий
                                    </button>
                                </div>
                                {activeStrategy === 'late-volume' ? (
                                    <AVFLateVolumeStrategy />
                                ) : activeStrategy === 'intraday' ? (
                                    <AVFIntradayStrategy />
                                ) : (
                                    <AVFFlipStrategy />
                                )}
                            </div>
                        </div>
                    )}
                </section>
            ) : (
                <section className={`p-8 rounded-3xl border text-center space-y-4 ${theme === 'dark' ? 'bg-white/5 border-white/10' : 'bg-gray-50 border-gray-200'}`}>
                    <Lock className="w-12 h-12 text-gray-500 mx-auto" />
                    <h3 className={`text-lg font-bold ${headingColor}`}>Доступ к стратегиям заблокирован</h3>
                    <p className="text-sm text-gray-500">Свяжитесь с администратором для получения доступа.</p>
                </section>
            )}

            {/* 3. Tools Block */}
            {hasToolsAccess ? (
                <section className="space-y-8">
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

                    <div className="space-y-12">
                        {[
                            {
                                title: 'Терминалы и Исполнение',
                                description: 'Платформы для быстрой торговли и мониторинга',
                                icon: <Terminal className="w-6 h-6 text-green-500" />,
                                items: [
                                    { name: 'Sniper', url: 'https://www.sniper.xyz', desc: 'Терминал с демо-торговлей для отработки навыков', icon: <Terminal className="w-5 h-5 text-green-400" /> },
                                    { name: 'Axiom', url: 'https://axiom.trade', desc: 'Профессиональный терминал для анализа и выбора монет', icon: <BarChart className="w-5 h-5 text-blue-400" /> },
                                    { name: 'GMGN', url: 'https://gmgn.ai', desc: 'Профессиональный терминал для анализа и выбора монет', icon: <Zap className="w-5 h-5 text-yellow-400" /> },
                                    { name: 'DexScreener', url: 'https://dexscreener.com', desc: 'Мониторинг графиков и поиск новых пар', icon: <Monitor className="w-5 h-5 text-slate-400" /> },
                                    { name: 'Alpha One', url: 'https://t.me/alpha_web3_bot', desc: 'ТГ-терминал с сигналами и AI-агентом', icon: <Bot className="w-5 h-5 text-purple-400" /> },
                                    { name: 'Fasol', url: 'https://t.me/Fasol_robot', desc: 'Торговый бот с гибкими алертами', icon: <Bell className="w-5 h-5 text-red-400" /> },
                                ]
                            },
                            {
                                title: 'Ончейн-аналитика',
                                description: 'Блокчейн-эксплореры и данные о транзакциях',
                                icon: <Database className="w-6 h-6 text-blue-500" />,
                                items: [
                                    { name: 'Solscan', url: 'https://solscan.io', desc: 'Эксплорер блокчейна Solana', icon: <Search className="w-5 h-5 text-teal-400" /> },
                                    { name: 'Etherscan', url: 'https://etherscan.io', desc: 'Эксплорер блокчейна Ethereum', icon: <Database className="w-5 h-5 text-indigo-400" /> },
                                    { name: 'BscScan', url: 'https://bscscan.com', desc: 'Эксплорер блокчейна BSC', icon: <Database className="w-5 h-5 text-yellow-500" /> },
                                ]
                            },
                            {
                                title: 'Безопасность и Рисерч',
                                description: 'Проверка токенов и анализ связей кошельков',
                                icon: <ShieldCheck className="w-6 h-6 text-rose-500" />,
                                items: [
                                    { name: 'Bubblemaps', url: 'https://bubblemaps.io', desc: 'Визуализация связей кошельков', icon: <Share2 className="w-5 h-5 text-pink-400" /> },
                                    { name: 'Frontrun', url: 'https://chromewebstore.google.com/detail/frontrun/kifcalgkjaphbpbcgokommchjiimejah', desc: 'Анализ кошельков и защита от фронтрана', icon: <ShieldAlert className="w-5 h-5 text-orange-400" /> },
                                    { name: 'RugCheck', url: 'https://rugcheck.xyz', desc: 'Проверка токенов на безопасность', icon: <ShieldCheck className="w-5 h-5 text-red-500" /> },
                                    { name: 'SolSniffer', url: 'https://www.solsniffer.com', desc: 'Сниффер новых токенов Solana', icon: <Activity className="w-5 h-5 text-violet-400" /> },
                                ]
                            },
                            {
                                title: 'Продвинутая Аналитика',
                                description: 'Трекинг "умных денег" и инфлюенсеров',
                                icon: <Brain className="w-6 h-6 text-purple-500" />,
                                items: [
                                    { name: 'Nansen', url: 'https://www.nansen.ai', desc: 'Smart Money и глубокая аналитика', icon: <Brain className="w-5 h-5 text-cyan-400" /> },
                                    { name: 'HolderScan', url: 'https://holderscan.com', desc: 'Анализ холдеров и кластеров', icon: <Users className="w-5 h-5 text-emerald-400" /> },
                                    { name: 'KolScan', url: 'https://kolscan.io', desc: 'Трекинг KOL-ов и инфлюенсеров', icon: <TrendingUp className="w-5 h-5 text-fuchsia-400" /> },
                                ]
                            }
                        ].map((category, catIdx) => (
                            <div key={catIdx} className="space-y-6">
                                <div className="flex items-center gap-3">
                                    <div className={`p-2 rounded-xl transition-colors ${theme === 'dark' ? 'bg-white/5 border border-white/10' : 'bg-gray-100 border border-gray-200'}`}>
                                        {category.icon}
                                    </div>
                                    <div>
                                        <h4 className={`text-lg font-bold ${headingColor}`}>{category.title}</h4>
                                        <p className={`text-xs ${theme === 'dark' ? 'text-gray-400' : 'text-gray-500'}`}>{category.description}</p>
                                    </div>
                                </div>
                                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4">
                                    {category.items.map((tool, idx) => (
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
                            </div>
                        ))}
                    </div>
                </section>
            ) : (
                <section className={`p-8 rounded-3xl border text-center space-y-4 ${theme === 'dark' ? 'bg-white/5 border-white/10' : 'bg-gray-50 border-gray-200'}`}>
                    <Lock className="w-12 h-12 text-gray-500 mx-auto" />
                    <h3 className={`text-lg font-bold ${headingColor}`}>Список инструментов скрыт</h3>
                    <p className="text-sm text-gray-500">Доступ ограничен администратором.</p>
                </section>
            )}

            {/* 4. Narrative Tools Block */}
            {hasToolsAccess ? (
                <section className="space-y-6">
                    <div className="flex items-center gap-3">
                        <div className="p-2 bg-indigo-500/10 rounded-xl border border-indigo-500/20">
                            <MessageSquare className="w-6 h-6 text-indigo-500" />
                        </div>
                        <div>
                            <h3 className={`text-xl font-black ${headingColor}`}>Инструменты по нарративам</h3>
                            <p className={`text-sm ${theme === 'dark' ? 'text-gray-400' : 'text-gray-500'}`}>
                                Социальная аналитика, тренд-трекинг и мониторинг внимания
                            </p>
                        </div>
                    </div>

                    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4">
                        {[
                            {
                                name: 'LunarCrush',
                                url: 'https://lunarcrush.com/home?category=cryptocurrencies',
                                desc: 'Социальная и тренд-аналитика: метрики популярности, настроения и роста обсуждений.',
                                icon: <Activity className="w-5 h-5 text-orange-400" />
                            },
                            {
                                name: 'Santiment',
                                url: 'https://app.santiment.net',
                                desc: 'Социальные и он-чейн метрики: упоминания, активность сообщества и поведение держателей.',
                                icon: <BarChart className="w-5 h-5 text-blue-400" />
                            },
                            {
                                name: 'Sharpe AI',
                                url: 'https://sharpe.ai/home/ru',
                                desc: 'Крипто mindshare и тренды: отслеживание доли обсуждений и внимания в реальном времени.',
                                icon: <Brain className="w-5 h-5 text-purple-400" />
                            },
                            {
                                name: 'Coindar',
                                url: 'https://coindar.org',
                                desc: 'Календарь событий: листинги, аирдропы и мероприятия как триггеры нарративов.',
                                icon: <Calendar className="w-5 h-5 text-green-400" />
                            },
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
                                <p className="text-xs text-gray-500 line-clamp-3 leading-relaxed">
                                    {tool.desc}
                                </p>
                            </a>
                        ))}
                    </div>
                </section>
            ) : null}
        </div>
    )
}
