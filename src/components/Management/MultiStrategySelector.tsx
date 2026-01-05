import { TriggerStrategy, TriggerProfit } from '@/types'
import { Check, XCircle } from 'lucide-react'

interface MultiStrategySelectorProps {
    strategies: TriggerStrategy[]
    profits: TriggerProfit[]
    onChange: (strategies: TriggerStrategy[], profits: TriggerProfit[]) => void
    theme: string
}

export const MultiStrategySelector: React.FC<MultiStrategySelectorProps> = ({ strategies: selectedStrategies, profits, onChange, theme }) => {
    const availableStrategies: { value: TriggerStrategy; label: string }[] = [
        { value: 'Фиба', label: 'Фиба' },
        { value: 'Market Entry', label: 'Market Entry' }
    ]

    const toggleStrategy = (strategy: TriggerStrategy) => {
        let newStrategies: TriggerStrategy[]
        let newProfits: TriggerProfit[] = [...profits]

        if (selectedStrategies.includes(strategy)) {
            newStrategies = selectedStrategies.filter(s => s !== strategy)
            newProfits = profits.filter(p => p.strategy !== strategy)
        } else {
            newStrategies = [...selectedStrategies, strategy]
        }
        onChange(newStrategies, newProfits)
    }

    const updateProfitValue = (strategy: TriggerStrategy, value: string) => {
        const existingIdx = profits.findIndex(p => p.strategy === strategy)
        let newProfits: TriggerProfit[]
        if (existingIdx >= 0) {
            newProfits = profits.map((p, idx) => idx === existingIdx ? { ...p, value } : p)
        } else {
            newProfits = [...profits, { strategy, value }]
        }
        onChange(selectedStrategies, newProfits)
    }

    return (
        <div className="space-y-4">
            <div className="space-y-1">
                <label className={`text-xs ${theme === 'dark' ? 'text-gray-400' : 'text-gray-600'}`}>Выберите стратегии</label>
                <div className="flex flex-wrap gap-2">
                    {availableStrategies.map(s => {
                        const isActive = selectedStrategies.includes(s.value)
                        return (
                            <button
                                key={s.value}
                                type="button"
                                onClick={() => toggleStrategy(s.value)}
                                className={`flex-1 min-w-[100px] px-3 py-2 rounded-xl text-xs font-semibold border-2 transition-all duration-300 ${isActive
                                    ? 'bg-amber-500 border-amber-500 text-white shadow-lg shadow-amber-500/20 scale-[1.02]'
                                    : theme === 'dark'
                                        ? 'bg-black/20 border-white/10 text-gray-400 hover:border-white/20 hover:bg-black/40'
                                        : 'bg-white border-gray-200 text-gray-600 hover:border-gray-300 hover:bg-gray-50'
                                    } active:scale-95`}
                            >
                                <div className="flex items-center justify-center gap-1.5">
                                    {isActive && <Check className="w-3 h-3" />}
                                    {s.label}
                                </div>
                            </button>
                        )
                    })}
                </div>
            </div>

            {selectedStrategies.length > 0 && (
                <div className="space-y-2 animate-in fade-in slide-in-from-top-2 duration-300">
                    <label className={`text-xs font-semibold uppercase ${theme === 'dark' ? 'text-gray-500' : 'text-gray-400'}`}>Профиты по стратегиям</label>
                    <div className="grid grid-cols-1 gap-2">
                        {selectedStrategies.map(strategy => {
                            const profitValue = profits.find(p => p.strategy === strategy)?.value || ''
                            return (
                                <div key={strategy} className={`flex items-center gap-2 p-2 rounded-xl border ${theme === 'dark' ? 'bg-black/20 border-white/5' : 'bg-gray-50 border-gray-100'}`}>
                                    <span className={`text-xs font-bold w-24 px-2 py-1 rounded bg-amber-500/10 text-amber-500 text-center`}>
                                        {strategy}
                                    </span>
                                    <input
                                        type="text"
                                        placeholder="Напр. +28% или X3"
                                        value={profitValue}
                                        onChange={(e) => updateProfitValue(strategy, e.target.value)}
                                        className={`flex-1 p-2 rounded-lg text-sm outline-none border transition-all ${theme === 'dark'
                                            ? 'bg-black/30 border-white/10 text-white focus:border-amber-500/50'
                                            : 'bg-white border-gray-200 text-gray-900 focus:border-amber-500/50'
                                            }`}
                                    />
                                    {profitValue && (
                                        <button
                                            type="button"
                                            onClick={() => updateProfitValue(strategy, '')}
                                            className="p-1.5 rounded-lg hover:bg-red-500/10 text-red-500/50 hover:text-red-500 transition-colors"
                                        >
                                            <XCircle className="w-4 h-4" />
                                        </button>
                                    )}
                                </div>
                            )
                        })}
                    </div>
                </div>
            )}
        </div>
    )
}
