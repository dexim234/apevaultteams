import React, { useState } from 'react'
import { useThemeStore } from '@/store/themeStore'
import {
    Twitter,
    XCircle,
    HelpCircle,
    Check,
    AlertTriangle,
    Search,
    Users,
    Activity,
    Brain,
    ShieldCheck
} from 'lucide-react'

interface ChecklistItemProps {
    text: string
    isChecked: boolean
    onToggle: () => void
    isRedFlag?: boolean
}

const ChecklistItem: React.FC<ChecklistItemProps> = ({ text, isChecked, onToggle, isRedFlag }) => {
    const { theme } = useThemeStore()

    return (
        <button
            onClick={onToggle}
            className={`flex items-start gap-3 p-3 rounded-xl transition-all duration-200 text-left w-full ${isChecked
                ? (isRedFlag ? 'bg-rose-500/10 border-rose-500/20' : 'bg-blue-500/10 border-blue-500/20')
                : (theme === 'dark' ? 'hover:bg-white/5 border-transparent' : 'hover:bg-gray-50 border-transparent')
                } border`}
        >
            <div className={`mt-0.5 flex-shrink-0 w-5 h-5 rounded border flex items-center justify-center transition-colors ${isChecked
                ? (isRedFlag ? 'bg-rose-500 border-rose-500 text-white' : 'bg-blue-500 border-blue-500 text-white')
                : (theme === 'dark' ? 'border-white/20' : 'border-gray-300')
                }`}>
                {isChecked && (isRedFlag ? <XCircle className="w-4 h-4" /> : <Check className="w-4 h-4" />)}
            </div>
            <span className={`text-sm leading-tight ${theme === 'dark' ? 'text-gray-300' : 'text-gray-600'} ${isChecked ? (isRedFlag ? 'text-rose-400 font-medium' : 'text-blue-400 font-medium') : ''}`}>
                {text}
            </span>
        </button>
    )
}

export const TwitterSmartAccountChecklist: React.FC = () => {
    const { theme } = useThemeStore()
    const [checkedItems, setCheckedItems] = useState<Record<string, boolean>>({})

    const toggleItem = (id: string) => {
        setCheckedItems(prev => ({ ...prev, [id]: !prev[id] }))
    }

    const sections = [
        {
            title: 'Контент',
            icon: <Search className="w-5 h-5" />,
            items: [
                { id: 'c1', text: 'Пишет до роста интереса, а не в момент хайпа' },
                { id: 'c2', text: 'Формулирует мысли как гипотезы, а не утверждения' },
                { id: 'c3', text: 'Объясняет, почему тема может сработать' },
                { id: 'c4', text: 'Пишет редко и по делу' },
                { id: 'c5', text: 'Есть старые твиты, которые оказались правдой' }
            ]
        },
        {
            title: 'Поведение',
            icon: <Activity className="w-5 h-5" />,
            items: [
                { id: 'b1', text: 'Не даёт прямых сигналов «покупай / продавай»' },
                { id: 'b2', text: 'Не обещает доходность' },
                { id: 'b3', text: 'Может публично написать, что ошибся' },
                { id: 'b4', text: 'Не повторяет одни и те же тезисы каждый день' }
            ]
        },
        {
            title: 'Социальные признаки',
            icon: <Users className="w-5 h-5" />,
            items: [
                { id: 's1', text: 'В ответах — разработчики, аналитики, инвесторы' },
                { id: 's2', text: 'Его ретвитят без взаимного пиара' },
                { id: 's3', text: 'Нет однотипных комментариев и ботов' }
            ]
        }
    ]

    const redFlags = [
        { id: 'r1', text: 'Каждый пост — реклама' },
        { id: 'r2', text: 'Продажа курсов, закрытых чатов, сигналов' },
        { id: 'r3', text: 'Формулировки «100x», «гарантировано», «инсайд»' },
        { id: 'r4', text: 'Постоянная уверенность без оговорок' }
    ]

    const score = Object.entries(checkedItems)
        .filter(([id, checked]) => checked && !id.startsWith('r'))
        .length

    const redFlagCount = Object.entries(checkedItems)
        .filter(([id, checked]) => checked && id.startsWith('r'))
        .length

    const headingColor = theme === 'dark' ? 'text-white' : 'text-gray-900'

    return (
        <div className="space-y-8 animate-fade-in">
            {/* Header */}
            <div className={`p-8 rounded-[2.5rem] border ${theme === 'dark'
                ? 'bg-gradient-to-br from-[#1a212a] to-[#0f1216] border-blue-500/20'
                : 'bg-gradient-to-br from-white to-blue-50/30 border-blue-500/10 shadow-xl'
                }`}>
                <div className="flex flex-col md:flex-row gap-8 items-center">
                    <div className={`p-5 rounded-2xl ${theme === 'dark' ? 'bg-blue-500/10' : 'bg-blue-500/5'} scale-110`}>
                        <Twitter className="w-12 h-12 text-blue-500" />
                    </div>
                    <div className="flex-1 text-center md:text-left space-y-3">
                        <div className="flex flex-wrap items-center justify-center md:justify-start gap-3">
                            <h2 className={`text-2xl md:text-3xl font-black ${headingColor}`}>Как определить «умный» аккаунт?</h2>
                            <span className="px-3 py-1 rounded-full bg-blue-500/20 text-blue-400 text-[10px] font-black uppercase tracking-widest border border-blue-500/20">Checklist</span>
                        </div>
                        <p className={`text-lg opacity-70 leading-relaxed`}>
                            Короткий чек-лист для фильтрации инфо-шума в Twitter (X). Отмечайте пункты, чтобы оценить качество источника.
                        </p>
                        <div className="flex items-center justify-center md:justify-start gap-4">
                            <div className={`flex items-center gap-2 px-3 py-1.5 rounded-lg border font-bold text-xs ${score >= 5 ? 'bg-emerald-500/10 border-emerald-500/20 text-emerald-500' : 'bg-blue-500/10 border-blue-500/20 text-blue-500'
                                }`}>
                                <Brain className="w-4 h-4" />
                                Счёт: {score} из 12
                            </div>
                            {score >= 5 && (
                                <div className="animate-bounce-subtle flex items-center gap-2 px-3 py-1.5 rounded-lg bg-emerald-500/10 border border-emerald-500/20 text-emerald-500 font-bold text-xs uppercase">
                                    <ShieldCheck className="w-4 h-4" /> Стоит читать
                                </div>
                            )}
                        </div>
                    </div>
                </div>
            </div>

            {/* Checklist Grid */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                {sections.map((section, idx) => (
                    <div key={idx} className={`p-6 rounded-3xl border ${theme === 'dark' ? 'bg-white/5 border-white/5 shadow-inner' : 'bg-white border-gray-100 shadow-sm'} space-y-4`}>
                        <div className="flex items-center gap-3 mb-2">
                            <div className={`p-2 rounded-xl ${theme === 'dark' ? 'bg-blue-500/10' : 'bg-blue-50'}`}>
                                {React.cloneElement(section.icon as React.ReactElement, { className: 'text-blue-500' })}
                            </div>
                            <h4 className={`font-black text-sm uppercase tracking-tight ${headingColor}`}>{section.title}</h4>
                        </div>
                        <div className="space-y-1">
                            {section.items.map(item => (
                                <ChecklistItem
                                    key={item.id}
                                    text={item.text}
                                    isChecked={!!checkedItems[item.id]}
                                    onToggle={() => toggleItem(item.id)}
                                />
                            ))}
                        </div>
                    </div>
                ))}
            </div>

            {/* Red Flags and Fast Check */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div className={`p-6 rounded-3xl border ${theme === 'dark' ? 'bg-rose-500/5 border-rose-500/10' : 'bg-rose-50/50 border-rose-100'} space-y-4 relative overflow-hidden`}>
                    <div className="absolute -top-6 -right-6 opacity-10">
                        <AlertTriangle className="w-32 h-32 text-rose-500" />
                    </div>
                    <div className="flex items-center gap-3 mb-2 relative">
                        <div className="p-2 rounded-xl bg-rose-500/20">
                            <XCircle className="w-6 h-6 text-rose-500" />
                        </div>
                        <h4 className={`font-black text-sm uppercase tracking-tight text-rose-500`}>Красные флаги (1–2 — повод не читать)</h4>
                    </div>
                    <div className="space-y-1 relative">
                        {redFlags.map(item => (
                            <ChecklistItem
                                key={item.id}
                                text={item.text}
                                isChecked={!!checkedItems[item.id]}
                                onToggle={() => toggleItem(item.id)}
                                isRedFlag
                            />
                        ))}
                    </div>
                    {redFlagCount > 0 && (
                        <div className="p-3 rounded-xl bg-rose-500/10 border border-rose-500/20 text-rose-500 text-xs font-medium animate-pulse-subtle">
                            Внимание: обнаружено {redFlagCount} красных флага!
                        </div>
                    )}
                </div>

                <div className={`p-8 rounded-3xl border ${theme === 'dark' ? 'bg-blue-500/5 border-blue-500/20' : 'bg-blue-50 border-blue-500/10'} flex flex-col justify-center items-center text-center space-y-6`}>
                    <div className={`p-4 rounded-full ${theme === 'dark' ? 'bg-blue-500/10' : 'bg-blue-500/5'}`}>
                        <HelpCircle className="w-12 h-12 text-blue-500" />
                    </div>
                    <div className="space-y-2">
                        <h4 className={`text-xl font-black ${headingColor} uppercase`}>Быстрая проверка (1 вопрос)</h4>
                        <p className={`text-sm italic leading-relaxed ${theme === 'dark' ? 'text-gray-400' : 'text-gray-500'}`}>
                            «Если убрать ник и аватарку, текст всё ещё полезен?»
                        </p>
                    </div>
                    <div className="flex items-center gap-8 pt-4">
                        <div className="text-center">
                            <div className="text-emerald-500 font-black text-xs uppercase mb-1">Если да</div>
                            <div className={`px-4 py-2 rounded-xl border border-emerald-500/30 bg-emerald-500/10 text-emerald-500 font-bold text-xs`}>
                                Аккаунт умный
                            </div>
                        </div>
                        <div className="text-center">
                            <div className="text-rose-500 font-black text-xs uppercase mb-1">Если нет</div>
                            <div className={`px-4 py-2 rounded-xl border border-rose-500/30 bg-rose-500/10 text-rose-500 font-bold text-xs`}>
                                Это маркетинг
                            </div>
                        </div>
                    </div>
                </div>
            </div>

            {/* Logic Info */}
            <div className={`p-4 rounded-2xl border text-center ${theme === 'dark' ? 'bg-white/5 border-white/5' : 'bg-gray-50 border-gray-100'}`}>
                <p className="text-xs text-gray-500">
                    💡 <span className="font-bold">Логика:</span> 5–6 совпадений — аккаунт стоит вашего времени.
                </p>
            </div>
        </div>
    )
}
