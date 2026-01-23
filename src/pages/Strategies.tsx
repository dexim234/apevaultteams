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
    Gift,
    ChevronDown
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

            {/* Tabs Navigation - Centered on PC, Selector on Mobile */}
            <div className="relative">
                {/* Mobile Selector */}
                <div className="sm:hidden relative z-10 px-4">
                    <div className={`p-4 rounded-2xl border ${theme === 'dark' ? 'bg-[#151a21]/90 border-white/10' : 'bg-white border-gray-200'} backdrop-blur-xl shadow-lg`}>
                        <div className="relative group">
                            <select
                                value={activeTab}
                                onChange={(e) => setActiveTab(e.target.value as TabType)}
                                className={`w-full appearance-none px-4 py-3 rounded-xl font-bold transition-all outline-none border ${theme === 'dark'
                                        ? 'bg-white/5 border-white/10 text-white focus:border-blue-500/50'
                                        : 'bg-gray-50 border-gray-200 text-gray-900 focus:border-blue-500/30'
                                    }`}
                            >
                                {visibleTabs.map((tab) => (
                                    <option key={tab.id} value={tab.id} className={theme === 'dark' ? 'bg-[#151a21] text-white' : 'bg-white text-gray-900'}>
                                        {tab.label}
                                    </option>
                                ))}
                            </select>
                            <div className="absolute right-4 top-1/2 -translate-y-1/2 pointer-events-none text-blue-500">
                                <ChevronDown className="w-5 h-5" />
                            </div>
                        </div>
                    </div>
                </div>

                {/* PC Centered Tabs */}
                <div className="hidden sm:flex justify-center w-full">
                    <div className="overflow-x-auto pb-2 scrollbar-hide">
                        <div className={`flex items-center gap-2 p-2 rounded-2xl ${theme === 'dark' ? 'bg-white/5 border-white/10' : 'bg-gray-100/50 border-gray-200'} border backdrop-blur-sm w-fit`}>
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
