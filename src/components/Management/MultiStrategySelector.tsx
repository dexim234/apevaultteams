import React from 'react'
import { TriggerStrategy } from '@/types'

interface MultiStrategySelectorProps {
    value: TriggerStrategy[]
    onChange: (strategies: TriggerStrategy[]) => void
    onChange: (strategies: TriggerStrategy[]) => void
}

export const MultiStrategySelector: React.FC<MultiStrategySelectorProps> = ({ value, onChange }) => {
    // Placeholder implementation
    const strategies: TriggerStrategy[] = ['Фиба', 'Market Entry'] // Assuming these are valid strategies based on code

    const toggleStrategy = (strategy: TriggerStrategy) => {
        if (value.includes(strategy)) {
            onChange(value.filter(s => s !== strategy))
        } else {
            onChange([...value, strategy])
        }
    }

    return (
        <div className="flex gap-2">
            {strategies.map(strategy => (
                <button
                    key={strategy}
                    type="button"
                    onClick={() => toggleStrategy(strategy)}
                    className={`px-3 py-1 rounded border ${value.includes(strategy) ? 'bg-amber-500 text-white border-amber-500' : 'bg-transparent border-gray-300'}`}
                >
                    {strategy}
                </button>
            ))}
        </div>
    )
}
