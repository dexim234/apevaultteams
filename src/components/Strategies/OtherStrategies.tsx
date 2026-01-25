import React from 'react'
import { useThemeStore } from '@/store/themeStore'
import { ExternalLink, Globe } from 'lucide-react'

interface NewsResource {
    name: string
    url: string
    description: string
    icon: React.ReactNode
    color: string
    bgColor: string
}

export const OtherStrategies: React.FC = () => {
    const { theme } = useThemeStore()

    const headingColor = theme === 'dark' ? 'text-white' : 'text-gray-900'
    const mutedText = theme === 'dark' ? 'text-gray-400' : 'text-gray-500'
    const cardBg = theme === 'dark' ? 'bg-[#151a21]/50 border-white/5' : 'bg-white border-gray-100'

    const newsResources: NewsResource[] = [
        {
            name: 'CoinMarketCap News',
            url: 'https://coinmarketcap.com/headlines/news/',
            description: 'Новостной раздел CoinMarketCap с публикациями о запусках проектов, обновлениях экосистем, инвестиционных раундах и анонсах в криптоиндустрии.',
            icon: <Globe className="w-5 h-5" />,
            color: 'text-blue-400',
            bgColor: 'bg-blue-500/10 border-blue-500/20'
        },
        {
            name: 'Dropstab News',
            url: 'https://dropstab.com/news',
            description: 'Новостной раздел Dropstab, агрегирующий события и обновления криптопроектов, включая запуск продуктов, изменения в экосистемах и рыночные анонсы.',
            icon: <Globe className="w-5 h-5" />,
            color: 'text-blue-400',
            bgColor: 'bg-blue-500/10 border-blue-500/20'
        },
        {
            name: 'CoinDesk',
            url: 'https://www.coindesk.com',
            description: 'Крупное криптомедиа, публикующее новости о запуске протоколов, развитии блокчейн-сетей, инфраструктурных проектах и Web3-стартапах.',
            icon: <Globe className="w-5 h-5" />,
            color: 'text-orange-400',
            bgColor: 'bg-orange-500/10 border-orange-500/20'
        },
        {
            name: 'The Block',
            url: 'https://www.theblock.co',
            description: 'Аналитическое новостное издание с фокусом на Web3, DeFi, Layer 2, инфраструктуру и новые криптопроекты.',
            icon: <Globe className="w-5 h-5" />,
            color: 'text-emerald-400',
            bgColor: 'bg-emerald-500/10 border-emerald-500/20'
        },
        {
            name: 'Coindar',
            url: 'https://coindar.org',
            description: 'Криптокалендарь событий с анонсами запусков, обновлений, релизов продуктов, testnet\'ов и других значимых этапов развития проектов.',
            icon: <Globe className="w-5 h-5" />,
            color: 'text-cyan-400',
            bgColor: 'bg-cyan-500/10 border-cyan-500/20'
        },
        {
            name: 'Reddit',
            url: 'https://www.reddit.com',
            description: 'Форумная платформа с тематическими сабреддитами, где публикуются новости о запуске проектов, обновлениях сетей и потенциальных airdrop\'ах.',
            icon: <Globe className="w-5 h-5" />,
            color: 'text-orange-500',
            bgColor: 'bg-orange-500/10 border-orange-500/20'
        },
        {
            name: 'X / Twitter',
            url: 'https://x.com',
            description: 'Социальная платформа, где проекты, разработчики и комьюнити публикуют анонсы запусков, testnet\'ов и экосистемных инициатив.',
            icon: <Globe className="w-5 h-5" />,
            color: 'text-gray-400',
            bgColor: 'bg-gray-500/10 border-gray-500/20'
        }
    ]

    return (
        <div className="space-y-16 pb-20">
            {/* News Resources Section */}
            <section className="space-y-8">
                <div className="flex items-center gap-3">
                    <div className="p-2 bg-blue-500/10 rounded-xl border border-blue-500/20">
                        <Globe className="w-6 h-6 text-blue-500" />
                    </div>
                    <div>
                        <h3 className={`text-xl font-black ${headingColor}`}>Новостные ресурсы и календари событий</h3>
                        <p className={`text-sm ${mutedText}`}>
                            Источники информации о запусках, обновлениях и значимых событиях криптопроектов
                        </p>
                    </div>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4">
                    {newsResources.map((resource, idx) => (
                        <a
                            key={idx}
                            href={resource.url}
                            target="_blank"
                            rel="noopener noreferrer"
                            className={`group relative p-5 rounded-2xl border transition-all duration-300 hover:shadow-lg ${cardBg} hover:border-blue-500/30`}
                        >
                            <div className="absolute top-4 right-4 opacity-0 group-hover:opacity-100 transition-opacity">
                                <ExternalLink className={`w-4 h-4 ${theme === 'dark' ? 'text-gray-400' : 'text-gray-500'}`} />
                            </div>

                            <div className={`p-2.5 rounded-xl w-fit mb-4 ${resource.bgColor} group-hover:scale-110 transition-transform`}>
                                <div className={resource.color}>
                                    {resource.icon}
                                </div>
                            </div>

                            <h4 className={`font-bold mb-1 ${headingColor} flex items-center gap-2`}>
                                {resource.name}
                            </h4>
                            <p className="text-xs text-gray-500 leading-relaxed">
                                {resource.description}
                            </p>
                        </a>
                    ))}
                </div>
            </section>
        </div>
    )
}