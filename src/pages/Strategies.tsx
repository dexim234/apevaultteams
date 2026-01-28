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
    X,
    LayoutGrid,
    MoreHorizontal
} from 'lucide-react'
import { MemecoinStrategies } from '@/components/Strategies/MemecoinStrategies'
import { PolymarketStrategies } from '@/components/Strategies/PolymarketStrategies'
import { NftStrategies } from '@/components/Strategies/NftStrategies'
import { FuturesStrategies } from '@/components/Strategies/FuturesStrategies'
import { AirDropStrategies } from '@/components/Strategies/AirDropStrategies'
import { OtherStrategies } from '@/components/Strategies/OtherStrategies'

type TabType = 'memecoins' | 'polymarket' | 'nft' | 'staking' | 'spot' | 'futures' | 'airdrop' | 'other';

export const Strategies = () => {
    const { theme } = useThemeStore()
    const [activeTab, setActiveTab] = useState<TabType>('memecoins')
    const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false)

    const headingColor = theme === 'dark' ? 'text-white' : 'text-gray-900'

    const pageAccess = useAccessControl('tools_strategies_view')
    const memecoinsAccess = useAccessControl('tools_kontur_memecoins')
    const polymarketAccess = useAccessControl('tools_kontur_polymarket')
    const nftAccess = useAccessControl('tools_kontur_nft')
    const stakingAccess = useAccessControl('tools_kontur_staking')
    const spotAccess = useAccessControl('tools_kontur_spot')
    const futuresAccess = useAccessControl('tools_kontur_futures')
    const airdropAccess = useAccessControl('tools_kontur_airdrop')
    const otherAccess = useAccessControl('tools_kontur_other')

    const tabs: { id: TabType; label: string; icon: any; access: { hasAccess: boolean; loading: boolean } }[] = [
        { id: 'memecoins', label: 'Мемкоины', icon: <Rocket className="w-4 h-4" />, access: memecoinsAccess },
        { id: 'polymarket', label: 'Polymarket', icon: <BarChart3 className="w-4 h-4" />, access: polymarketAccess },
        { id: 'nft', label: 'NFT', icon: <ImageIcon className="w-4 h-4" />, access: nftAccess },
        { id: 'staking', label: 'Стейкинг', icon: <Database className="w-4 h-4" />, access: stakingAccess },
        { id: 'spot', label: 'Спот', icon: <Wallet2 className="w-4 h-4" />, access: spotAccess },
        { id: 'futures', label: 'Фьючерсы', icon: <Zap className="w-4 h-4" />, access: futuresAccess },
        { id: 'airdrop', label: 'AirDrop', icon: <Gift className="w-4 h-4" />, access: airdropAccess },
        { id: 'other', label: 'Прочее', icon: <MoreHorizontal className="w-4 h-4" />, access: otherAccess },
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
        <div className="space-y-6">
            {/* Header */}
            <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
                <div className="flex items-center gap-4">
                    <div className={`p-3 rounded-2xl ${theme === 'dark' ? 'bg-white/10 border-white/20' : 'bg-blue-500/10 border-blue-500/30'}`}>
                        <TrendingUp className={`w-8 h-8 ${theme === 'dark' ? 'text-white' : 'text-blue-500'}`} />
                    </div>
                    <div>
                        <h1 className={`text-2xl md:text-3xl font-black tracking-tight ${headingColor}`}>
                            AVF Контур
                        </h1>
                        <p className={`text-sm font-medium ${theme === 'dark' ? 'text-gray-400' : 'text-gray-500'}`}>
                            Стратегические направления и инструменты ApeVault Frontier
                        </p>
                    </div>
                </div>
            </div>

            {/* Tabs Navigation - Centered on PC, Premium Selector on Mobile */}
            <div className="relative">
                {/* Modern Mobile Selector */}
                <div className="sm:hidden px-4 mb-8">
                    <button
                        onClick={() => setIsMobileMenuOpen(true)}
                        className={`w-full flex items-center justify-between p-4 rounded-2xl border transition-all active:scale-[0.98] ${theme === 'dark'
                            ? 'bg-white/5 border-white/10 text-white active:bg-white/10'
                            : 'bg-white border-gray-200 text-gray-900 active:bg-gray-50'
                            } shadow-xl backdrop-blur-xl relative overflow-hidden group`}
                    >
                        <div className="flex items-center gap-3">
                            <div className="p-2 rounded-xl bg-blue-500/10 text-blue-500">
                                {visibleTabs.find(t => t.id === activeTab)?.icon}
                            </div>
                            <div className="text-left">
                                <p className="text-[10px] uppercase tracking-widest font-bold text-blue-500/60 leading-none mb-1">Выбранная Сфера</p>
                                <span className="font-black text-lg">{visibleTabs.find(t => t.id === activeTab)?.label}</span>
                            </div>
                        </div>
                        <div className={`p-2 rounded-xl ${theme === 'dark' ? 'bg-white/5' : 'bg-gray-50'}`}>
                            <LayoutGrid className="w-5 h-5 text-blue-500" />
                        </div>

                        {/* Animated background glow */}
                        <div className="absolute inset-0 bg-gradient-to-r from-blue-500/0 via-blue-500/5 to-blue-500/0 -translate-x-full group-hover:translate-x-full transition-transform duration-1000" />
                    </button>

                    {/* Mobile Drawer Overlay */}
                    {isMobileMenuOpen && (
                        <div className="fixed inset-0 z-[100] flex items-end sm:hidden">
                            <div
                                className="absolute inset-0 bg-black/60 backdrop-blur-sm"
                                onClick={() => setIsMobileMenuOpen(false)}
                            />
                            <div className={`w-full relative z-10 p-6 rounded-t-[2.5rem] border-t ${theme === 'dark' ? 'bg-[#0b1015] border-white/10' : 'bg-white border-gray-100'
                                } shadow-2xl animate-in slide-in-from-bottom duration-300`}>
                                <div className="flex items-center justify-between mb-8">
                                    <h3 className={`text-xl font-black ${theme === 'dark' ? 'text-white' : 'text-gray-900'}`}>Выберите сферу</h3>
                                    <button
                                        onClick={() => setIsMobileMenuOpen(false)}
                                        className={`p-2 rounded-full ${theme === 'dark' ? 'bg-white/5 text-gray-400' : 'bg-gray-100 text-gray-500'}`}
                                    >
                                        <X className="w-5 h-5" />
                                    </button>
                                </div>

                                <div className="grid grid-cols-1 gap-3">
                                    {visibleTabs.map((tab) => (
                                        <button
                                            key={tab.id}
                                            onClick={() => {
                                                setActiveTab(tab.id as TabType)
                                                setIsMobileMenuOpen(false)
                                            }}
                                            className={`flex items-center gap-4 p-4 rounded-[1.5rem] transition-all relative overflow-hidden ${activeTab === tab.id
                                                ? 'bg-blue-500 text-white shadow-lg shadow-blue-500/25 scale-[1.02]'
                                                : theme === 'dark' ? 'bg-white/5 text-gray-400 hover:bg-white/10' : 'bg-gray-50 text-gray-600 hover:bg-gray-100'
                                                }`}
                                        >
                                            <div className={`p-2.5 rounded-xl ${activeTab === tab.id ? 'bg-white/20' : theme === 'dark' ? 'bg-white/5' : 'bg-white'}`}>
                                                {tab.icon}
                                            </div>
                                            <span className="font-bold text-base">{tab.label}</span>
                                            {activeTab === tab.id && (
                                                <div className="ml-auto w-2 h-2 rounded-full bg-white animate-pulse" />
                                            )}
                                        </button>
                                    ))}
                                </div>
                                <div className="h-8" /> {/* Safe area spacer */}
                            </div>
                        </div>
                    )}
                </div>

                {/* PC Centered Tabs */}
                <div className="hidden sm:flex w-full overflow-x-auto pb-2 scrollbar-hide">
                    <div className={`flex items-center gap-2 p-1.5 rounded-xl border ${theme === 'dark' ? 'bg-[#151a21] border-white/5' : 'bg-gray-50 border-gray-200'}`}>
                        {visibleTabs.map((tab) => (
                            <button
                                key={tab.id}
                                onClick={() => setActiveTab(tab.id as TabType)}
                                className={`flex items-center gap-2 px-4 py-2.5 rounded-lg text-sm font-bold transition-all ${activeTab === tab.id
                                    ? 'bg-blue-500 text-white shadow-lg shadow-blue-500/20'
                                    : 'text-gray-400 hover:text-gray-200'
                                    }`}
                            >
                                {tab.icon}
                                <span>{tab.label}</span>
                            </button>
                        ))}
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
                ) : activeTab === 'futures' ? (
                    <FuturesStrategies />
                ) : activeTab === 'airdrop' ? (
                    <AirDropStrategies />
                ) : activeTab === 'other' ? (
                    <OtherStrategies />
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
