import React, { useState, useRef, useEffect } from 'react'
import { Search, ChevronDown, User, X } from 'lucide-react'
import { TEAM_MEMBERS, User as UserType } from '@/types'
import { useUserNickname } from '@/utils/userUtils'
import { useThemeStore } from '@/store/themeStore'

interface MemberSelectorProps {
    selectedUserId: string | null
    onSelect: (userId: string | null) => void
}

export const MemberSelector: React.FC<MemberSelectorProps> = ({ selectedUserId, onSelect }) => {
    const { theme } = useThemeStore()
    const [isOpen, setIsOpen] = useState(false)
    const [search, setSearch] = useState('')
    const containerRef = useRef<HTMLDivElement>(null)

    const selectedMember = TEAM_MEMBERS.find(m => m.id === selectedUserId)
    const selectedNickname = useUserNickname(selectedUserId || '')

    useEffect(() => {
        const handleClickOutside = (event: MouseEvent) => {
            if (containerRef.current && !containerRef.current.contains(event.target as Node)) {
                setIsOpen(false)
            }
        }
        document.addEventListener('mousedown', handleClickOutside)
        return () => document.removeEventListener('mousedown', handleClickOutside)
    }, [])

    const filteredMembers = TEAM_MEMBERS.filter(m => {
        const name = m.name.toLowerCase()
        const login = m.login.toLowerCase()
        const query = search.toLowerCase()
        return name.includes(query) || login.includes(query)
    })

    return (
        <div className="relative w-full" ref={containerRef}>
            <button
                onClick={() => setIsOpen(!isOpen)}
                className={`w-full flex items-center justify-between gap-3 px-4 py-2.5 rounded-xl border transition-all ${theme === 'dark'
                        ? 'bg-[#151a21] border-white/5 text-gray-300 hover:border-emerald-500/30'
                        : 'bg-gray-50 border-gray-200 text-gray-700 hover:border-emerald-500'
                    }`}
            >
                <div className="flex items-center gap-2.5 overflow-hidden">
                    {selectedMember ? (
                        <>
                            {selectedMember.avatar ? (
                                <img src={selectedMember.avatar} alt="" className="w-5 h-5 rounded-full object-cover flex-shrink-0" />
                            ) : (
                                <div className={`w-5 h-5 rounded-full flex items-center justify-center text-[10px] bg-emerald-500/20 text-emerald-500 flex-shrink-0`}>
                                    <User size={12} />
                                </div>
                            )}
                            <span className="text-sm font-bold truncate">
                                {selectedNickname || selectedMember.name}
                            </span>
                        </>
                    ) : (
                        <>
                            <div className={`w-5 h-5 rounded-full flex items-center justify-center border border-dashed border-gray-500 flex-shrink-0`}>
                                <User size={12} className="text-gray-500" />
                            </div>
                            <span className="text-sm font-semibold text-gray-500">Все участники...</span>
                        </>
                    )}
                </div>
                <ChevronDown size={16} className={`text-gray-500 transition-transform ${isOpen ? 'rotate-180' : ''}`} />
            </button>

            {isOpen && (
                <div className={`absolute z-50 top-full mt-2 w-full min-w-[240px] rounded-2xl border shadow-2xl overflow-hidden animate-in fade-in slide-in-from-top-2 duration-200 ${theme === 'dark' ? 'bg-[#1a1f26] border-white/10' : 'bg-white border-gray-200'
                    }`}>
                    {/* Search bar */}
                    <div className="p-3 border-b border-white/5">
                        <div className="relative">
                            <Search size={14} className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-500" />
                            <input
                                type="text"
                                placeholder="Поиск участника..."
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

                    {/* Members list */}
                    <div className="max-h-[300px] overflow-y-auto p-1.5 custom-scrollbar">
                        <button
                            onClick={() => {
                                onSelect(null)
                                setIsOpen(false)
                            }}
                            className={`w-full flex items-center gap-3 px-3 py-2 rounded-lg transition-all text-left ${!selectedUserId
                                    ? theme === 'dark' ? 'bg-emerald-500/10 text-emerald-400' : 'bg-emerald-50 text-emerald-600'
                                    : theme === 'dark' ? 'hover:bg-white/5 text-gray-400' : 'hover:bg-gray-50 text-gray-600'
                                }`}
                        >
                            <div className={`w-6 h-6 rounded-full flex items-center justify-center border border-dashed border-gray-500 text-[10px]`}>
                                <User size={12} />
                            </div>
                            <span className="text-xs font-bold">Все участники</span>
                        </button>

                        {filteredMembers.map(member => (
                            <MemberItem
                                key={member.id}
                                member={member}
                                isSelected={selectedUserId === member.id}
                                onSelect={(id) => {
                                    onSelect(id)
                                    setIsOpen(false)
                                }}
                                theme={theme}
                            />
                        ))}

                        {filteredMembers.length === 0 && (
                            <div className="p-4 text-center">
                                <p className="text-[10px] text-gray-500">Никого не нашли :(</p>
                            </div>
                        )}
                    </div>
                </div>
            )}
        </div>
    )
}

const MemberItem: React.FC<{
    member: UserType
    isSelected: boolean
    onSelect: (id: string) => void
    theme: string
}> = ({ member, isSelected, onSelect, theme }) => {
    const nickname = useUserNickname(member.id)

    return (
        <button
            onClick={() => onSelect(member.id)}
            className={`w-full flex items-center gap-3 px-3 py-2 rounded-lg transition-all text-left group ${isSelected
                    ? theme === 'dark' ? 'bg-emerald-500/10 text-emerald-400' : 'bg-emerald-50 text-emerald-600'
                    : theme === 'dark' ? 'hover:bg-white/5 text-gray-300' : 'hover:bg-gray-50 text-gray-700'
                }`}
        >
            <div className="relative">
                {member.avatar ? (
                    <img src={member.avatar} alt="" className="w-6 h-6 rounded-full object-cover group-hover:ring-2 ring-emerald-500/30 transition-all" />
                ) : (
                    <div className={`w-6 h-6 rounded-full flex items-center justify-center text-[10px] ${isSelected ? 'bg-emerald-500/20 text-emerald-500' : 'bg-gray-500/10 text-gray-500'
                        }`}>
                        {member.name[0]}
                    </div>
                )}
            </div>
            <div className="flex flex-col min-w-0">
                <span className="text-xs font-bold truncate">{nickname || member.name}</span>
                <span className="text-[9px] opacity-50 truncate">{member.login}</span>
            </div>
        </button>
    )
}
