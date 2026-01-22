import { useState, useEffect } from 'react'
import { useThemeStore } from '@/store/themeStore'
import { useAccessControl } from '@/hooks/useAccessControl'
import {
    TrendingUp,
    Rocket,
    LineChart,
    BarChart3,
    Image as ImageIcon,
    Database,
    Wallet2,
    Zap,
    Gift
} from 'lucide-react'
import { MemecoinStrategies } from '@/components/Strategies/MemecoinStrategies'
import { PolymarketStrategies } from '@/components/Strategies/PolymarketStrategies'
import { NftStrategies } from '@/components/Strategies/NftStrategies'

type TabType = 'memecoins' | 'polymarket' | 'nft' | 'staking' | 'spot' | 'futures' | 'airdrop';

export const Strategies = () => {
    const { theme } = useThemeStore()
    const [activeTab, setActiveTab] = useState<TabType>('memecoins')

    const headingColor = theme === 'dark' ? 'text-white' : 'text-gray-900'

    const pageAccess = useAccessControl('tools_strategies_view')
    const memecoinsAccess = useAccessControl('tools_kontur_memecoins')
    const polymarketAccess = useAccessControl('tools_kontur_polymarket')
    const nftAccess = useAccessControl('tools_kontur_nft')
    const stakingAccess = useAccessControl('tools_kontur_staking')
    const spotAccess = useAccessControl('tools_kontur_spot')
    const futuresAccess = useAccessControl('tools_kontur_futures')
    const airdropAccess = useAccessControl('tools_kontur_airdrop')

    const tabs: { id: TabType; label: string; icon: any; access: { hasAccess: boolean; loading: boolean } }[] = [
        { id: 'memecoins', label: 'Мемкоины', icon: <Rocket className="w-4 h-4" />, access: memecoinsAccess },
        { id: 'polymarket', label: 'Polymarket', icon: <BarChart3 className="w-4 h-4" />, access: polymarketAccess },
        { id: 'nft', label: 'NFT', icon: <ImageIcon className="w-4 h-4" />, access: nftAccess },
        { id: 'staking', label: 'Стейкинг', icon: <Database className="w-4 h-4" />, access: stakingAccess },
        { id: 'spot', label: 'Спот', icon: <Wallet2 className="w-4 h-4" />, access: spotAccess },
        { id: 'futures', label: 'Фьючерсы', icon: <Zap className="w-4 h-4" />, access: futuresAccess },
        { id: 'airdrop', label: 'AirDrop', icon: <Gift className="w-4 h-4" />, access: airdropAccess },
    ]

    const visibleTabs = tabs.filter(t => t.access.hasAccess)
    const anyLoading = tabs.some(t => t.access.loading) || pageAccess.loading

    useEffect(() => {
        if (!anyLoading && visibleTabs.length > 0 && !visibleTabs.find(t => t.id === activeTab)) {
            setActiveTab(visibleTabs[0].id)
        }
    }, [anyLoading, visibleTabs, activeTab])

    if (anyLoading) {
        return (
            <div className="flex items-center justify-center py-20">
                <div className="animate-spin rounded-full h-8 w-8 border-4 border-blue-500 border-t-transparent"></div>
            </div>
        )
    }

    if (!pageAccess.hasAccess || visibleTabs.length === 0) {
        return (
            <div className="py-20 text-center space-y-4">
                <TrendingUp className="w-16 h-16 text-gray-700 mx-auto opacity-20" />
                <h3 className={`text-xl font-black ${headingColor}`}>Доступ ограничен</h3>
                <p className="text-gray-500 max-w-md mx-auto">
                    {pageAccess.reason || 'У вас нет доступа к разделам AVF Контур. Свяжитесь с администрацией.'}
                </p>
            </div>
        )
    }

    return (
        <div className="space-y-8 pb-12">
            {/* Header */}
            <div className={`relative overflow-hidden rounded-3xl border ${theme === 'dark' ? 'border-blue-500/30 bg-[#151a21]/80 backdrop-blur-xl shadow-[0_8px_32px_rgba(0,0,0,0.4)]' : 'border-blue-500/20 bg-white/80 backdrop-blur-xl shadow-[0_8px_32px_rgba(0,0,0,0.08)]'}`}>
                <div className="absolute inset-0 pointer-events-none">
                    <div className="absolute -left-16 -bottom-10 w-80 h-80 bg-blue-500/10 blur-3xl"></div>
                    <div className={`absolute inset-0 ${theme === 'dark' ? 'bg-[radial-gradient(circle_at_50%_0%,rgba(255,255,255,0.05),transparent_45%)]' : 'bg-[radial-gradient(circle_at_50%_0%,rgba(59,130,246,0.05),transparent_45%)]'}`}></div>
                </div>

                <div className="relative p-6 sm:p-8 flex flex-col lg:flex-row items-center justify-between gap-6">
                    {/* Left: Icon + Title */}
                    <div className="flex items-center gap-4">
                        <div className={`p-3 rounded-2xl ${theme === 'dark' ? 'bg-white/10 border-white/20' : 'bg-blue-500/10 border-blue-500/30'}`}>
                            <TrendingUp className={`w-8 h-8 ${theme === 'dark' ? 'text-white' : 'text-blue-500'}`} />
                        </div>
                        <div>
                            <h1 className={`text-3xl font-black ${headingColor} whitespace-nowrap`}>AVF Контур</h1>
                            <p className={`text-sm font-medium ${theme === 'dark' ? 'text-gray-400' : 'text-gray-500'}`}>
                                Стратегические направления и инструменты ApeVault Frontier
                            </p>
                        </div>
                    </div>
                </div>
            </div>

            {/* Tabs Navigation - Scrollable on small screens */}
            <div className="overflow-x-auto pb-2 scrollbar-hide -mx-4 px-4 sm:mx-0 sm:px-0">
                <div className="flex items-center gap-2 p-1.5 rounded-2xl bg-white/5 border border-white/5 w-fit backdrop-blur-sm min-w-max">
                    {visibleTabs.map((tab) => (
                        <button
                            key={tab.id}
                            onClick={() => setActiveTab(tab.id as TabType)}
                            className={`flex items-center gap-2 px-6 py-2.5 rounded-xl text-sm font-bold transition-all duration-300 relative ${activeTab === tab.id
                                ? 'bg-blue-500 text-white shadow-lg shadow-blue-500/25'
                                : 'text-gray-400 hover:bg-white/5 hover:text-white'
                                }`}
                        >
                            <div className="flex items-center gap-2">
                                {tab.icon}
                                {tab.label}
                            </div>
                        </button>
                    ))}
                </div>
            </div>

            {/* Tab Content */}
            <div className="animate-fade-in">
                {activeTab === 'memecoins' ? (
                    <MemecoinStrategies />
                ) : activeTab === 'polymarket' ? (
                    <PolymarketStrategies />
                ) : activeTab === 'nft' ? (
                    <NftStrategies />
                ) : (
                    <div className="py-20 text-center space-y-4">
                        <div className="flex justify-center">
                            <LineChart className="w-16 h-16 text-gray-700 animate-pulse" />
                        </div>
                        <h3 className={`text-xl font-black ${headingColor}`}>
                            {tabs.find(t => t.id === activeTab)?.label} — В разработке
                        </h3>
                        <p className="text-gray-500 max-w-md mx-auto px-4">
                            Мы готовим новые контентные модули и стратегии для данного направления. Следите за обновлениями в AVF Контур.
                        </p>
                    </div>
                )}
            </div>
        </div>
    )
}

export default Strategies
