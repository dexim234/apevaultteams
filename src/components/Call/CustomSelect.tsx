import React, { useState, useRef, useEffect } from 'react'
import { ChevronDown, Search, X, Check } from 'lucide-react'
import { useThemeStore } from '@/store/themeStore'

export interface SelectOption {
    value: string
    label: string
    icon?: React.ReactNode
    meta?: string // e.g., login or extra info
    chip?: string // generic class for coloring
}

interface CustomSelectProps {
    value: string
    onChange: (value: string) => void
    options: SelectOption[]
    placeholder?: string
    searchable?: boolean
    label?: string // e.g. "Spher:"
    icon?: React.ReactNode // Main icon for the trigger
}

export const CustomSelect: React.FC<CustomSelectProps> = ({
    value,
    onChange,
    options,
    placeholder = 'Select...',
    searchable = false,
    icon
}) => {
    const { theme } = useThemeStore()
    const [isOpen, setIsOpen] = useState(false)
    const [search, setSearch] = useState('')
    const containerRef = useRef<HTMLDivElement>(null)

    const selectedOption = options.find(o => o.value === value)

    useEffect(() => {
        const handleClickOutside = (event: MouseEvent) => {
            if (containerRef.current && !containerRef.current.contains(event.target as Node)) {
                setIsOpen(false)
            }
        }
        document.addEventListener('mousedown', handleClickOutside)
        return () => document.removeEventListener('mousedown', handleClickOutside)
    }, [])

    const filteredOptions = options.filter(o =>
        o.label.toLowerCase().includes(search.toLowerCase()) ||
        (o.meta && o.meta.toLowerCase().includes(search.toLowerCase()))
    )

    return (
        <div className="relative min-w-[180px]" ref={containerRef}>
            <button
                onClick={() => setIsOpen(!isOpen)}
                className={`w-full flex items-center justify-between gap-3 px-4 py-2.5 rounded-xl border transition-all ${theme === 'dark'
                    ? 'bg-[#151a21] border-white/5 text-gray-300 hover:border-emerald-500/30'
                    : 'bg-white border-gray-200 text-gray-700 hover:border-emerald-500'
                    }`}
            >
                <div className="flex items-center gap-2.5 overflow-hidden">
                    {icon && <div className={selectedOption ? "text-emerald-500" : "text-gray-500"}>{icon}</div>}

                    {selectedOption ? (
                        <div className="flex items-center gap-2">
                            {selectedOption.icon && (
                                <div className={`flex items-center justify-center`}>
                                    {selectedOption.icon}
                                </div>
                            )}
                            <span className="text-sm font-bold truncate">
                                {selectedOption.label}
                            </span>
                        </div>
                    ) : (
                        <span className="text-sm font-semibold text-gray-500">{placeholder}</span>
                    )}
                </div>
                <ChevronDown size={16} className={`text-gray-500 transition-transform ${isOpen ? 'rotate-180' : ''}`} />
            </button>

            {isOpen && (
                <div className={`absolute z-50 top-full mt-2 w-full min-w-[200px] rounded-2xl border shadow-2xl overflow-hidden animate-in fade-in slide-in-from-top-2 duration-200 ${theme === 'dark' ? 'bg-[#1a1f26] border-white/10' : 'bg-white border-gray-200'
                    }`}>
                    {searchable && (
                        <div className="p-3 border-b border-white/5">
                            <div className="relative">
                                <Search size={14} className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-500" />
                                <input
                                    type="text"
                                    placeholder="Поиск..."
                                    value={search}
                                    onChange={(e) => setSearch(e.target.value)}
                                    className={`w-full pl-9 pr-8 py-2 rounded-lg text-xs font-medium outline-none transition-all ${theme === 'dark'
                                        ? 'bg-black/20 text-gray-300 focus:bg-black/40'
                                        : 'bg-gray-100 text-gray-700 focus:bg-gray-200'
                                        }`}
                                    autoFocus
                                />
                                {search && (
                                    <button
                                        onClick={() => setSearch('')}
                                        className="absolute right-2 top-1/2 -translate-y-1/2 p-1 hover:text-rose-500"
                                    >
                                        <X size={12} />
                                    </button>
                                )}
                            </div>
                        </div>
                    )}

                    <div className="max-h-[300px] overflow-y-auto p-1.5 custom-scrollbar">
                        {filteredOptions.map(option => (
                            <button
                                key={option.value}
                                onClick={() => {
                                    onChange(option.value)
                                    setIsOpen(false)
                                }}
                                className={`w-full flex items-center justify-between gap-3 px-3 py-2 rounded-lg transition-all text-left ${option.value === value
                                    ? theme === 'dark' ? 'bg-emerald-500/10 text-emerald-400' : 'bg-emerald-50 text-emerald-600'
                                    : theme === 'dark' ? 'hover:bg-white/5 text-gray-300' : 'hover:bg-gray-50 text-gray-700'
                                    }`}
                            >
                                <div className="flex items-center gap-3 min-w-0">
                                    {option.icon && (
                                        <div className={`w-6 h-6 rounded-full flex items-center justify-center text-[10px] ${option.chip || (theme === 'dark' ? 'bg-white/5' : 'bg-gray-100')
                                            }`}>
                                            {option.icon}
                                        </div>
                                    )}
                                    <div className="flex flex-col min-w-0">
                                        <span className="text-xs font-bold truncate">{option.label}</span>
                                        {option.meta && <span className="text-[9px] opacity-50 truncate">{option.meta}</span>}
                                    </div>
                                </div>
                                {option.value === value && <Check size={14} />}
                            </button>
                        ))}
                        {filteredOptions.length === 0 && (
                            <div className="p-4 text-center">
                                <p className="text-[10px] text-gray-500">Ничего не найдено</p>
                            </div>
                        )}
                    </div>
                </div>
            )}
        </div>
    )
}
