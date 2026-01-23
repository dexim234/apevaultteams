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
    Wrench
} from 'lucide-react'

export const NftStrategies: React.FC = () => {
    const { theme } = useThemeStore()
    const headingColor = theme === 'dark' ? 'text-white' : 'text-gray-900'
    const [activeCategory, setActiveCategory] = useState<number | null>(null)

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
                { name: 'Ninjalerts', url: 'https://ninjalerts.com', desc: 'Алерты по кошелькам и коллекциям. Реакция на сделки китов в реальном времени.', icon: <Bell className="w-5 h-5 text-red-400" /> },
                { name: 'ИИ-чат NFTBirdies', url: 'https://chat.nftbirdies.com', desc: 'Помогает отслеживать дропы и анализировать коллекции через ИИ.', icon: <Bot className="w-5 h-5 text-purple-400" /> },
            ]
        }
    ]

    return (
        <div className="space-y-16 pb-20">
            {/* 1. Tools Block */}
            <section className="space-y-8">
                <div className="flex items-center gap-3">
                    <div className="p-2 bg-amber-500/10 rounded-xl border border-amber-500/20">
                        <Wrench className="w-6 h-6 text-amber-500" />
                    </div>
                    <div>
                        <h3 className={`text-xl font-black ${headingColor}`}>Инструменты</h3>
                        <p className={`text-sm ${theme === 'dark' ? 'text-gray-400' : 'text-gray-500'}`}>
                            Основные сервисы для работы с NFT
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
                                    ← Все категории
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
