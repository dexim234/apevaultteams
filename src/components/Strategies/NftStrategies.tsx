import React, { useState } from 'react'
import { useThemeStore } from '@/store/themeStore'
import {
    ShoppingBag,
    BarChart3,
    Gem,
    Bell,
    ExternalLink,
    Zap,
    Layers,
    Palette,
    Search,
    Brain,
    Bot,
    Calendar,
    Activity,
    Wrench,
    Lightbulb,
    ArrowLeft,
    Twitter,
    Target,
    Flame,
    MessageSquare
} from 'lucide-react'
import { AftNftSnipingStrategy } from './AftNftSnipingStrategy'
import { AvfMintFlipStrategy } from './AvfMintFlipStrategy'
import { AvfNftNarrativeStrategy } from './AvfNftNarrativeStrategy'
import { TwitterSmartAccountChecklist } from './TwitterSmartAccountChecklist'

type StrategyId = 'nft-sniping' | 'nft-mint-flip' | 'nft-narrative' | 'twitter-checklist' | null;

export const NftStrategies: React.FC = () => {
    const { theme } = useThemeStore()
    const headingColor = theme === 'dark' ? 'text-white' : 'text-gray-900'
    const [activeCategory, setActiveCategory] = useState<number | null>(null)
    const [activeStrategy, setActiveStrategy] = useState<StrategyId>(null)

    const strategies = [
        { id: 'nft-sniping' as StrategyId, name: 'AVF снайпинг NFT', icon: <Target className="w-4 h-4" />, desc: 'Покупка NFT ниже текущей рыночной цены (флора) с целью быстрой перепродажи.' },
        { id: 'nft-mint-flip' as StrategyId, name: 'AVF Mint → Flip', icon: <Flame className="w-4 h-4" />, desc: 'Покупка на первичном рынке (минт) и перепродажа на хайпе запуска.' },
        { id: 'nft-narrative' as StrategyId, name: 'AVF торговля NFT на нарративах', icon: <MessageSquare className="w-4 h-4" />, desc: 'Работа с темами, в которые рынок начинает верить. Покупка раньше, продажа на массовом внимании.' },
        { id: 'twitter-checklist' as StrategyId, name: 'Чек-лист: Smart Twitter', icon: <Twitter className="w-4 h-4" />, desc: 'Как отличить «умный» аккаунт в Twitter (X) от маркетингового шума. 5–6 совпадений — аккаунт стоит внимания.' },
    ]

    const categories = [
        {
            title: 'NFT-маркетплейсы',
            description: 'Площадки для покупки, продажи и минта NFT',
            icon: <ShoppingBag className="w-6 h-6 text-blue-500" />,
            bgColor: 'bg-blue-500/10',
            borderColor: 'border-blue-500/20',
            tools: [
                { name: 'OpenSea', url: 'https://opensea.io', desc: 'Крупнейший универсальный NFT-маркетплейс (Ethereum, Polygon, Base и др.). Базовая ликвидность.', icon: <ShoppingBag className="w-5 h-5 text-blue-400" /> },
                { name: 'Blur', url: 'https://blur.io', desc: 'Профессиональный маркетплейс для трейдеров. Быстрый флиппинг, агрегация листингов, sweep-покупки.', icon: <Zap className="w-5 h-5 text-yellow-400" /> },
                { name: 'Rarible', url: 'https://rarible.com', desc: 'Упор на creator-экономику и мультичейн. Поиск недооценённых коллекций и арбитраж.', icon: <Layers className="w-5 h-5 text-purple-400" /> },
                { name: 'Magic Eden', url: 'https://magiceden.io', desc: 'Крупнейший маркетплейс Solana. Высокая скорость сделок, ранние минта, активный рынок SOL.', icon: <Palette className="w-5 h-5 text-pink-400" /> },
                { name: 'Foundation', url: 'https://foundation.app', desc: 'Кураторская арт-платформа с отбором художников. Инвестиции в арт-NFT.', icon: <Gem className="w-5 h-5 text-emerald-400" /> },
            ]
        },
        {
            title: 'Аналитика NFT-рынка',
            description: 'Инструменты для анализа трендов, холдеров и объемов',
            icon: <BarChart3 className="w-6 h-6 text-purple-500" />,
            bgColor: 'bg-purple-500/10',
            borderColor: 'border-purple-500/20',
            tools: [
                { name: 'NFTGo', url: 'https://nftgo.io', desc: 'Глубокая аналитика: анализ холдеров, распределения токенов и "здоровья" коллекции.', icon: <BarChart3 className="w-5 h-5 text-indigo-400" /> },
                { name: 'Arkham', url: 'https://www.arkhamintelligence.com', desc: 'Связывает Twitter с on-chain действиями. Просмотр транзакций по Twitter-нику и анализ кошельков.', icon: <Search className="w-5 h-5 text-blue-400" /> },
                { name: 'DeBank', url: 'https://debank.com/', desc: 'Отслеживает активы кошельков в разных сетях, полезен для проверки активности крупных адресов.', icon: <Activity className="w-5 h-5 text-emerald-400" /> },
                { name: 'NFTBirdies', url: 'https://nftbirdies.com', desc: 'Календарь NFT-дропов и аналитика. Помогает планировать участие в дропах.', icon: <Calendar className="w-5 h-5 text-sky-400" /> },
                { name: 'DappRadar', url: 'https://dappradar.com', desc: 'Трекер dApps и NFT. Оценка реального пользовательского спроса.', icon: <Activity className="w-5 h-5 text-rose-400" /> },
                { name: 'Nansen', url: 'https://nansen.ai', desc: 'Ончейн-аналитика "умных денег". Отслеживание действий китов и инсайдерских кошельков.', icon: <Brain className="w-5 h-5 text-cyan-400" /> },
            ]
        },
        {
            title: 'Редкость и оценка',
            description: 'Оценка уникальности и ценности конкретных токенов',
            icon: <Gem className="w-6 h-6 text-emerald-500" />,
            bgColor: 'bg-emerald-500/10',
            borderColor: 'border-emerald-500/20',
            tools: [
                { name: 'HowRare.is', url: 'https://howrare.is', desc: 'Инструмент оценки редкости Solana-NFT. База для SOL-флиппинга.', icon: <Search className="w-5 h-5 text-teal-400" /> },
            ]
        },
        {
            title: 'Алерты и сигналы',
            description: 'Мгновенные уведомления о событиях на рынке',
            icon: <Bell className="w-6 h-6 text-amber-500" />,
            bgColor: 'bg-amber-500/10',
            borderColor: 'border-amber-500/20',
            tools: [
                { name: 'Twitter (X) Advanced Search', url: 'https://twitter.com/search-advanced', desc: 'Расширенный поиск для фильтрации твитов по пользователю, словам и датам. Поиск ранних упоминаний.', icon: <Twitter className="w-5 h-5 text-blue-400" /> },
                { name: 'Ninjalerts', url: 'https://ninjalerts.com', desc: 'Алерты по кошелькам и коллекциям. Реакция на сделки китов в реальном времени.', icon: <Bell className="w-5 h-5 text-red-400" /> },
                { name: 'ИИ-чат NFTBirdies', url: 'https://chat.nftbirdies.com', desc: 'Помогает отслеживать дропы и анализировать коллекции через ИИ.', icon: <Bot className="w-5 h-5 text-purple-400" /> },
            ]
        }
    ]

    return (
        <div className="space-y-16 pb-20">
            {/* 1. Strategies Block */}
            <section className="space-y-6">
                <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
                    <div className="flex items-center gap-3">
                        <div className="p-2 bg-blue-500/10 rounded-xl border border-blue-500/20">
                            <Lightbulb className="w-6 h-6 text-blue-500" />
                        </div>
                        <div>
                            <h3 className={`text-xl font-black ${headingColor}`}>Стратегии</h3>
                            <p className={`text-sm ${theme === 'dark' ? 'text-gray-400' : 'text-gray-500'}`}>
                                Проверенные методики работы с NFT рынком
                            </p>
                        </div>
                    </div>

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
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
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
                                    {s.desc}
                                </p>
                                <div className="mt-6 flex items-center gap-2 text-blue-500 font-bold text-xs uppercase tracking-wider">
                                    Подробнее <ExternalLink className="w-3 h-3" />
                                </div>
                            </button>
                        ))}
                    </div>
                ) : (
                    <div className={`rounded-3xl border p-1 sm:p-2 ${theme === 'dark' ? 'bg-[#0b1015]/50 border-white/5' : 'bg-white border-gray-100'
                        } shadow-xl animate-scale-up`}>
                        <div className={`p-6 sm:p-8 rounded-[2.5rem] ${theme === 'dark' ? 'bg-[#151a21]/50' : 'bg-gray-50/50'}`}>
                            <div className="mb-6 flex items-center justify-between">
                                <button
                                    onClick={() => setActiveStrategy(null)}
                                    className="text-xs font-bold text-gray-500 hover:text-blue-500 transition-colors flex items-center gap-1"
                                >
                                    <ArrowLeft className="w-3 h-3" /> К списку стратегий
                                </button>
                            </div>
                            {activeStrategy === 'nft-sniping' && <AftNftSnipingStrategy />}
                            {activeStrategy === 'nft-mint-flip' && <AvfMintFlipStrategy />}
                            {activeStrategy === 'nft-narrative' && <AvfNftNarrativeStrategy />}
                            {activeStrategy === 'twitter-checklist' && <TwitterSmartAccountChecklist />}
                        </div>
                    </div>
                )}
            </section>

            {/* 2. Tools Block */}
            <section className="space-y-8">
                <div className="flex items-center gap-3">
                    <div className="p-2 bg-amber-500/10 rounded-xl border border-amber-500/20">
                        <Wrench className="w-6 h-6 text-amber-500" />
                    </div>
                    <div>
                        <h3 className={`text-xl font-black ${headingColor}`}>Инструменты</h3>
                        <p className={`text-sm ${theme === 'dark' ? 'text-gray-400' : 'text-gray-500'}`}>
                            Основные сервисы для работы with NFT
                        </p>
                    </div>
                </div>

                <div className="space-y-12">
                    {activeCategory === null ? (
                        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
                            {categories.map((category, idx) => (
                                <button
                                    key={idx}
                                    onClick={() => setActiveCategory(idx)}
                                    className={`group p-6 rounded-3xl border text-left transition-all duration-500 hover:-translate-y-2 ${theme === 'dark'
                                        ? 'bg-[#151a21]/50 border-white/5 hover:border-blue-500/30 hover:bg-blue-500/5'
                                        : 'bg-white border-gray-100 hover:border-blue-500/20 hover:shadow-xl'
                                        }`}
                                >
                                    <div className={`p-4 rounded-2xl w-fit mb-4 transition-transform duration-500 group-hover:scale-110 ${category.bgColor} ${category.borderColor} border`}>
                                        {React.cloneElement(category.icon as React.ReactElement, { className: 'w-8 h-8' })}
                                    </div>
                                    <h4 className={`text-lg font-black mb-2 ${headingColor}`}>{category.title}</h4>
                                    <p className={`text-xs leading-relaxed ${theme === 'dark' ? 'text-gray-400' : 'text-gray-500'}`}>
                                        {category.description}
                                    </p>
                                    <div className="mt-4 flex items-center gap-2 text-blue-500 font-bold text-[10px] uppercase tracking-wider">
                                        Смотреть инструменты <ExternalLink className="w-3 h-3" />
                                    </div>
                                </button>
                            ))}
                        </div>
                    ) : (
                        <div className="space-y-8 animate-scale-up">
                            <div className="flex items-center justify-between">
                                <button
                                    onClick={() => setActiveCategory(null)}
                                    className="text-xs font-bold text-gray-500 hover:text-blue-500 transition-colors flex items-center gap-1"
                                >
                                    <ArrowLeft className="w-3 h-3" /> Все категории
                                </button>
                            </div>

                            <section className="space-y-6">
                                <div className="flex items-center gap-3">
                                    <div className={`p-3 ${categories[activeCategory].bgColor} rounded-2xl border ${categories[activeCategory].borderColor}`}>
                                        {React.cloneElement(categories[activeCategory].icon as React.ReactElement, { className: 'w-8 h-8' })}
                                    </div>
                                    <div>
                                        <h3 className={`text-2xl font-black ${headingColor}`}>{categories[activeCategory].title}</h3>
                                        <p className={`text-sm ${theme === 'dark' ? 'text-gray-400' : 'text-gray-500'}`}>
                                            {categories[activeCategory].description}
                                        </p>
                                    </div>
                                </div>

                                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4">
                                    {categories[activeCategory].tools.map((tool, idx) => (
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
                        </div>
                    )}
                </div>
            </section>
        </div>
    )
}
