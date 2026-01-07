import { AiAoStrategy, AiAoProfit } from '@/types'
import { Check } from 'lucide-react'

interface MultiStrategySelectorProps {
    strategies: AiAoStrategy[]
    profits: AiAoProfit[]
    onChange: (strategies: AiAoStrategy[], profits: AiAoProfit[]) => void
    theme: string
    color?: string
}

export const MultiStrategySelector: React.FC<MultiStrategySelectorProps> = ({ strategies: selectedStrategies, profits, onChange, theme, color = 'bg-purple-600' }) => {
    const availableStrategies: { value: AiAoStrategy; label: string }[] = [
        { value: 'Фиба', label: 'Fibo Strategy' },
        { value: 'Market Entry', label: 'Market Entry' }
    ]

    const toggleStrategy = (strategy: AiAoStrategy) => {
        let newStrategies: AiAoStrategy[]
        let newProfits: AiAoProfit[] = [...profits]

        if (selectedStrategies.includes(strategy)) {
            newStrategies = selectedStrategies.filter(s => s !== strategy)
            newProfits = profits.filter(p => p.strategy !== strategy)
        } else {
            newStrategies = [...selectedStrategies, strategy]
        }
        onChange(newStrategies, newProfits)
    }

    const updateProfitValue = (strategy: AiAoStrategy, value: string) => {
        const existingIdx = profits.findIndex(p => p.strategy === strategy)
        let newProfits: AiAoProfit[]
        if (existingIdx >= 0) {
            newProfits = profits.map((p, idx) => idx === existingIdx ? { ...p, value } : p)
        } else {
            newProfits = [...profits, { strategy, value }]
        }
        onChange(selectedStrategies, newProfits)
    }

    return (
        <div className="space-y-3">
            <label className={`text-xs font-semibold uppercase tracking-wider ${theme === 'dark' ? 'text-gray-400' : 'text-gray-600'} ml-1`}>
                Выбор стратегии и профит
            </label>
            <div className="grid grid-cols-1 gap-2">
                {availableStrategies.map(s => {
                    const isActive = selectedStrategies.includes(s.value)
                    const profitValue = profits.find(p => p.strategy === s.value)?.value || ''

                    return (
                        <div key={s.value} className="space-y-2">
                            <button
                                type="button"
                                onClick={() => toggleStrategy(s.value)}
                                className={`w-full p-4 rounded-2xl border transition-all duration-300 flex items-center gap-4 ${isActive
                                    ? `${theme === 'dark' ? 'bg-white/5 border-white/20' : 'bg-gray-50 border-gray-300'}`
                                    : theme === 'dark'
                                        ? 'bg-black/20 border-white/5 hover:border-white/10'
                                        : 'bg-white border-gray-100 hover:border-gray-200'
                                    }`}
                            >
                                <div className={`w-5 h-5 rounded border transition-colors flex items-center justify-center ${isActive ? color : 'border-gray-500'}`}>
                                    {isActive && <Check className="w-3.5 h-3.5 text-white" />}
                                </div>
                                <span className={`text-sm font-bold ${isActive ? (theme === 'dark' ? 'text-white' : 'text-gray-900') : 'text-gray-500'}`}>
                                    {s.label}
                                </span>
                            </button>

                            {isActive && (
                                <div className="px-2 animate-in fade-in slide-in-from-top-1 duration-200">
                                    <input
                                        type="text"
                                        placeholder="Профит (напр. +28% или X3)"
                                        value={profitValue}
                                        onChange={(e) => updateProfitValue(s.value, e.target.value)}
                                        className={`w-full p-2.5 rounded-xl text-xs font-semibold outline-none border transition-all ${theme === 'dark'
                                            ? 'bg-black/30 border-white/10 text-white focus:border-white/20'
                                            : 'bg-gray-50 border-gray-200 text-gray-900 focus:border-gray-300'
                                            }`}
                                    />
                                </div>
                            )}
                        </div>
                    )
                })}
            </div>
        </div>
    )
}
