// Referrals page
import { useState, useEffect, useMemo } from 'react'
import { useThemeStore } from '@/store/themeStore'
import { useAuthStore } from '@/store/authStore'
import { useAdminStore } from '@/store/adminStore'
import { getReferrals, addApprovalRequest, updateReferral, addReferral } from '@/services/firestoreService'
import { Referral } from '@/types'
import { useUsers } from '@/hooks/useUsers'
import {
    UserPlus,
    Users,
    Copy,
    TrendingUp,
    Shield,
    User as UserIcon,
    Check,
    Battery
} from 'lucide-react'

// Battery Component
const ReferralBattery = ({ count, theme }: { count: number; theme: 'dark' | 'light' }) => {
    const getProgress = (c: number) => {
        if (c >= 30) return 100
        if (c >= 20) return 75
        if (c >= 10) return 50
        if (c >= 5) return 25
        return (c / 5) * 25 // Linear progress for first 5
    }

    const getColor = (c: number) => {
        if (c >= 30) return 'bg-emerald-500 shadow-[0_0_15px_rgba(16,185,129,0.5)]'
        if (c >= 20) return 'bg-yellow-500 shadow-[0_0_15px_rgba(234,179,8,0.5)]'
        if (c >= 10) return 'bg-orange-500 shadow-[0_0_15px_rgba(249,115,22,0.5)]'
        if (c >= 5) return 'bg-rose-500 shadow-[0_0_15px_rgba(244,63,94,0.5)]'
        return 'bg-gray-400'
    }

    const progress = getProgress(count)
    const colorClass = getColor(count)

    return (
        <div className={`relative p-6 rounded-[2rem] border transition-all duration-500 ${theme === 'dark' ? 'bg-[#0b1015] border-white/5 hover:border-emerald-500/20' : 'bg-white border-gray-100 hover:border-emerald-500/10'} shadow-2xl group overflow-hidden`}>
            <div className="absolute top-0 right-0 w-32 h-32 bg-emerald-500/5 blur-[50px] rounded-full pointer-events-none" />

            <div className="flex items-center justify-between mb-8">
                <div className="flex items-center gap-3">
                    <div className={`p-2.5 rounded-xl ${theme === 'dark' ? 'bg-emerald-500/10 text-emerald-400' : 'bg-emerald-50 text-emerald-600'}`}>
                        <Battery className="w-5 h-5" />
                    </div>
                    <div>
                        <h4 className={`text-sm font-black uppercase tracking-widest ${theme === 'dark' ? 'text-white' : 'text-gray-900'}`}>Месячный драйв</h4>
                        <p className="text-[10px] font-bold text-gray-500 uppercase tracking-tighter">Счетчик обнуляется каждый месяц</p>
                    </div>
                </div>
                <div className="text-right">
                    <span className={`text-3xl font-black tracking-tighter ${theme === 'dark' ? 'text-white' : 'text-gray-900'}`}>{count}</span>
                    <span className="text-sm font-bold text-gray-500"> / 30</span>
                </div>
            </div>

            <div className="space-y-4">
                <div className={`relative h-14 w-full rounded-2xl overflow-hidden p-1.5 ${theme === 'dark' ? 'bg-white/5 border border-white/5' : 'bg-gray-100 border border-gray-200'}`}>
                    <div
                        className={`h-full rounded-xl transition-all duration-1000 ease-out ${colorClass}`}
                        style={{ width: `${progress}%` }}
                    />

                    {/* Milestone markers */}
                    {[5, 10, 20, 30].map((m) => (
                        <div
                            key={m}
                            className="absolute top-0 bottom-0 border-r border-white/10 dark:border-white/5"
                            style={{ left: `${(m / 30) * 100}%` }}
                        />
                    ))}
                </div>

                <div className="flex justify-between px-1">
                    {[5, 10, 20, 30].map((m) => (
                        <div key={m} className={`flex flex-col items-center gap-1 transition-all duration-300 ${count >= m ? 'opacity-100' : 'opacity-40'}`}>
                            <span className={`text-[10px] font-black tracking-tighter ${theme === 'dark' ? 'text-gray-400' : 'text-gray-600'}`}>{m}</span>
                            <div className={`w-1 h-1 rounded-full ${count >= m ? 'bg-emerald-500' : 'bg-gray-500'}`} />
                        </div>
                    ))}
                </div>
            </div>
        </div>
    )
}

// Referral Modal Component
const ReferralModal = ({
    referral,
    onClose,
    onSave,
    theme
}: {
    referral?: Referral | null;
    onClose: () => void;
    onSave: () => void;
    theme: 'dark' | 'light'
}) => {
    const { user } = useAuthStore()
    const { isAdmin } = useAdminStore()
    const [formData, setFormData] = useState({
        name: '',
        phone: '',
        tgAccount: '',
        source: '',
        status: 'active' as Referral['status'],
    })
    const [loading, setLoading] = useState(false)
    const [error, setError] = useState('')

    const referralId = useMemo(() => referral?.referralId || `REF-${Math.random().toString(36).slice(2, 8).toUpperCase()}`, [referral])

    useEffect(() => {
        if (referral) {
            setFormData({
                name: referral.name,
                phone: referral.phone || '',
                tgAccount: referral.tgAccount || '',
                source: referral.source || '',
                status: referral.status || 'active',
            })
        }
    }, [referral])

    const handleSave = async (e: React.FormEvent) => {
        e.preventDefault()
        setLoading(true)
        setError('')

        const payload = {
            ...formData,
            referralId,
            ownerId: referral?.ownerId || user?.id || '',
            age: 18, // Default age as it's required in type but not in form
            createdAt: referral?.createdAt || new Date().toISOString(),
        }

        try {
            if (referral) {
                if (isAdmin) {
                    await updateReferral(referral.id, payload)
                } else {
                    await addApprovalRequest({
                        entity: 'referral',
                        action: 'update',
                        authorId: user?.id || '',
                        targetUserId: referral.ownerId,
                        before: referral,
                        after: { id: referral.id, ...payload },
                    })
                }
            } else {
                if (isAdmin) {
                    await addReferral(payload)
                } else {
                    await addApprovalRequest({
                        entity: 'referral',
                        action: 'create',
                        authorId: user?.id || '',
                        targetUserId: user?.id || '',
                        before: null,
                        after: { id: '', ...payload },
                    })
                }
            }
            onSave()
        } catch (err: any) {
            setError('Ошибка при сохранении')
        } finally {
            setLoading(false)
        }
    }

    const inputClasses = `w-full px-5 py-4 rounded-2xl border transition-all duration-300 focus:outline-none focus:ring-4 focus:ring-emerald-500/10 ${theme === 'dark'
        ? 'bg-white/5 border-white/10 text-white placeholder-gray-600 focus:border-emerald-500'
        : 'bg-gray-50 border-gray-200 text-gray-900 placeholder-gray-400 focus:border-emerald-500'
        }`

    return (
        <div className="fixed inset-0 z-[100] flex items-center justify-center p-4">
            <div className="absolute inset-0 bg-black/60 backdrop-blur-md" onClick={onClose} />
            <div className={`relative w-full max-w-lg overflow-hidden rounded-[2.5rem] ${theme === 'dark' ? 'bg-[#0b0f17]' : 'bg-white'} shadow-2xl border ${theme === 'dark' ? 'border-white/10' : 'border-gray-200'} animate-in zoom-in duration-300`}>
                <div className="p-10">
                    <div className="flex items-center justify-between mb-8">
                        <h3 className={`text-2xl font-black tracking-tight ${theme === 'dark' ? 'text-white' : 'text-gray-900'}`}>
                            {referral ? 'Редактировать' : 'Добавить'} реферала
                        </h3>
                        <button onClick={onClose} className="p-2 rounded-xl hover:bg-white/5 transition-colors">
                            <X className="w-6 h-6 text-gray-400" />
                        </button>
                    </div>

                    <form onSubmit={handleSave} className="space-y-6">
                        <div className="grid grid-cols-2 gap-4">
                            <div className="space-y-2">
                                <label className="text-[10px] font-black uppercase tracking-widest text-gray-500 ml-2">Имя</label>
                                <input
                                    required
                                    className={inputClasses}
                                    value={formData.name}
                                    onChange={e => setFormData(prev => ({ ...prev, name: e.target.value }))}
                                    placeholder="Имя Фамилия"
                                />
                            </div>
                            <div className="space-y-2">
                                <label className="text-[10px] font-black uppercase tracking-widest text-gray-500 ml-2">Телефон</label>
                                <input
                                    required
                                    className={inputClasses}
                                    value={formData.phone}
                                    onChange={e => setFormData(prev => ({ ...prev, phone: e.target.value }))}
                                    placeholder="79000000000"
                                />
                            </div>
                        </div>

                        <div className="grid grid-cols-2 gap-4">
                            <div className="space-y-2">
                                <label className="text-[10px] font-black uppercase tracking-widest text-gray-500 ml-2">Telegram</label>
                                <input
                                    required
                                    className={inputClasses}
                                    value={formData.tgAccount}
                                    onChange={e => setFormData(prev => ({ ...prev, tgAccount: e.target.value }))}
                                    placeholder="@username"
                                />
                            </div>
                            <div className="space-y-2">
                                <label className="text-[10px] font-black uppercase tracking-widest text-gray-500 ml-2">Источник</label>
                                <input
                                    required
                                    className={inputClasses}
                                    value={formData.source}
                                    onChange={e => setFormData(prev => ({ ...prev, source: e.target.value }))}
                                    placeholder="Откуда узнал?"
                                />
                            </div>
                        </div>

                        <div className="grid grid-cols-2 gap-4">
                            <div className="space-y-2">
                                <label className="text-[10px] font-black uppercase tracking-widest text-gray-500 ml-2">ID (Авто)</label>
                                <input
                                    readOnly
                                    className={`${inputClasses} opacity-50 cursor-not-allowed`}
                                    value={referralId}
                                />
                            </div>
                            {isAdmin && (
                                <div className="space-y-2">
                                    <label className="text-[10px] font-black uppercase tracking-widest text-gray-500 ml-2">Статус</label>
                                    <select
                                        className={inputClasses}
                                        value={formData.status}
                                        onChange={e => setFormData(prev => ({ ...prev, status: e.target.value as any }))}
                                    >
                                        <option value="active">Активный</option>
                                        <option value="inactive">Неактивный</option>
                                        <option value="deleted">Удаленный</option>
                                    </select>
                                </div>
                            )}
                        </div>

                        {error && <div className="p-4 rounded-xl bg-red-500/10 border border-red-500/20 text-red-500 text-xs font-bold text-center">{error}</div>}

                        <button
                            type="submit"
                            disabled={loading}
                            className="w-full relative group overflow-hidden py-5 rounded-[1.25rem] bg-emerald-500 text-white font-black transition-all duration-300 shadow-[0_20px_40px_-10px_rgba(16,185,129,0.3)] hover:shadow-[0_25px_50px_-12px_rgba(16,185,129,0.4)] hover:-translate-y-0.5 active:translate-y-0 active:scale-95 disabled:opacity-50"
                        >
                            <span className="relative z-10 flex items-center justify-center gap-2">
                                {loading ? 'Сохранение...' : referral ? 'Обновить данные' : 'Создать реферала'}
                            </span>
                        </button>
                    </form>
                </div>
            </div>
        </div>
    )
}

export const Referrals = () => {
    const { theme } = useThemeStore()
    const { user } = useAuthStore()
    const { isAdmin } = useAdminStore()
    const { users } = useUsers()

    const [referrals, setReferrals] = useState<Referral[]>([])
    const [loading, setLoading] = useState(true)
    const [showModal, setShowModal] = useState(false)
    const [editingReferral, setEditingReferral] = useState<Referral | null>(null)
    const [copied, setCopied] = useState(false)

    const loadData = async () => {
        setLoading(true)
        const data = await getReferrals()
        setReferrals(data)
        setLoading(false)
    }

    useEffect(() => {
        loadData()
    }, [])

    // Filter referrals for current user
    const myReferrals = useMemo(() => referrals.filter(r => r.ownerId === user?.id), [referrals, user])

    // Aggregate stats for third table
    const statsTable = useMemo(() => {
        return users.map(u => {
            const userRefs = referrals.filter(r => r.ownerId === u.id)
            return {
                userId: u.id,
                name: u.name,
                total: userRefs.length,
                active: userRefs.filter(r => r.status === 'active' || !r.status).length,
                inactive: userRefs.filter(r => r.status === 'inactive').length,
                deleted: userRefs.filter(r => r.status === 'deleted').length,
            }
        }).sort((a, b) => b.total - a.total)
    }, [users, referrals])

    // Current month referral count for battery
    const monthlyCount = useMemo(() => {
        const now = new Date()
        const firstDay = new Date(now.getFullYear(), now.getMonth(), 1).toISOString()
        return myReferrals.filter(r => r.createdAt >= firstDay && (r.status === 'active' || !r.status)).length
    }, [myReferrals])

    const copyTableToClipboard = () => {
        if (!isAdmin) return
        const header = "Кто пригласил\tID\tИмя\tТелефон\tИсточник\tTG\tСтатус\n"
        const rows = referrals.map(r => {
            const owner = users.find(u => u.id === r.ownerId)?.name || '—'
            return `${owner}\t${r.referralId}\t${r.name}\t${r.phone || '—'}\t${r.source || '—'}\t${r.tgAccount || '—'}\t${r.status || 'active'}`
        }).join('\n')

        navigator.clipboard.writeText(header + rows)
        setCopied(true)
        setTimeout(() => setCopied(false), 2000)
    }

    const headingColor = theme === 'dark' ? 'text-white' : 'text-gray-900'
    const subTextColor = theme === 'dark' ? 'text-gray-400' : 'text-gray-500'

    if (loading) {
        return (
            <div className="flex items-center justify-center min-h-[60vh]">
                <div className="w-12 h-12 border-4 border-emerald-500/20 border-t-emerald-500 rounded-full animate-spin" />
            </div>
        )
    }

    return (
        <div className="space-y-8 animate-in fade-in duration-700">
            {/* Header */}
            <div className="flex flex-col md:flex-row md:items-center justify-between gap-6">
                <div className="flex items-center gap-5">
                    <div className="relative">
                        <div className="absolute inset-0 bg-pink-500/20 blur-2xl rounded-full" />
                        <div className={`relative p-4 rounded-2xl border ${theme === 'dark' ? 'bg-pink-500/10 border-pink-500/20 text-pink-400' : 'bg-pink-50 border-pink-100 text-pink-600 shadow-sm'}`}>
                            <Users className="w-8 h-8" />
                        </div>
                    </div>
                    <div>
                        <h1 className={`text-3xl md:text-4xl font-black tracking-tight ${headingColor}`}>
                            AVF Referrals
                        </h1>
                        <p className={`text-sm font-medium ${subTextColor}`}>
                            Система приглашений и управления рефералами
                        </p>
                    </div>
                </div>

                <button
                    onClick={() => {
                        setEditingReferral(null)
                        setShowModal(true)
                    }}
                    className="flex items-center gap-3 px-8 py-4 rounded-2xl bg-emerald-500 text-white font-black transition-all duration-300 shadow-[0_20px_40px_-10px_rgba(16,185,129,0.3)] hover:shadow-[0_25px_50px_-12px_rgba(16,185,129,0.4)] hover:-translate-y-1 active:translate-y-0 active:scale-95"
                >
                    <UserPlus className="w-5 h-5" />
                    <span>Добавить реферала</span>
                </button>
            </div>

            {/* Battery Section */}
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
                <div className="lg:col-span-1">
                    <ReferralBattery count={monthlyCount} theme={theme} />
                </div>
                <div className={`lg:col-span-2 rounded-[2rem] border p-8 flex flex-col justify-center gap-6 ${theme === 'dark' ? 'bg-[#0b1015] border-white/5' : 'bg-white border-gray-100'} shadow-2xl`}>
                    <div className="flex items-center gap-3 mb-2">
                        <Shield className="w-6 h-6 text-emerald-500" />
                        <h3 className={`text-xl font-black tracking-tight ${headingColor}`}>Ваша активность</h3>
                    </div>
                    <p className={`text-sm leading-relaxed ${subTextColor}`}>
                        Приглашайте новых участников и заряжайте батарею! Каждые 5 рефералов открывают новый уровень энергии.
                        Максимальный заряд &mdash; <span className="text-emerald-500 font-black">100% (30 рефералов)</span>.
                        Статистика обнуляется каждое 1-е число месяца.
                    </p>
                    <div className="flex flex-wrap gap-4 mt-2">
                        {['RED: 5 (25%)', 'ORANGE: 10 (50%)', 'YELLOW: 20 (75%)', 'GREEN: 30 (100%)'].map((label, idx) => (
                            <div key={idx} className={`px-4 py-2 rounded-xl text-[10px] font-black tracking-widest uppercase ${theme === 'dark' ? 'bg-white/5 text-gray-400' : 'bg-gray-50 text-gray-600'}`}>
                                {label}
                            </div>
                        ))}
                    </div>
                </div>
            </div>

            {/* Tables Section */}
            <div className="space-y-12">
                {/* Admin Table */}
                {isAdmin && (
                    <div className={`rounded-[2.5rem] border overflow-hidden ${theme === 'dark' ? 'bg-[#0b1015] border-white/5' : 'bg-white border-gray-100'} shadow-2xl`}>
                        <div className="p-8 border-b border-white/5 flex items-center justify-between">
                            <div className="flex items-center gap-3">
                                <Shield className="w-5 h-5 text-emerald-500" />
                                <h3 className={`text-xl font-black tracking-tight ${headingColor}`}>Панель управления (Admin)</h3>
                            </div>
                            <button
                                onClick={copyTableToClipboard}
                                className={`p-3 rounded-xl transition-all ${copied ? 'bg-emerald-500 text-white' : theme === 'dark' ? 'bg-white/5 text-gray-400 hover:text-white' : 'bg-gray-50 text-gray-500 hover:text-emerald-500'}`}
                            >
                                {copied ? <Check className="w-5 h-5" /> : <Copy className="w-5 h-5" />}
                            </button>
                        </div>
                        <div className="overflow-x-auto">
                            <table className="w-full text-left border-collapse">
                                <thead>
                                    <tr className={theme === 'dark' ? 'bg-white/[0.02]' : 'bg-gray-50'}>
                                        {['Кто пригласил', 'ID', 'Имя', 'Телефон', 'Источник', 'TG', 'Статус', ''].map(h => (
                                            <th key={h} className="px-6 py-5 text-[10px] font-black uppercase tracking-widest text-gray-500">{h}</th>
                                        ))}
                                    </tr>
                                </thead>
                                <tbody className="divide-y divide-white/5">
                                    {referrals.map(r => (
                                        <tr key={r.id} className={`group transition-colors ${theme === 'dark' ? 'hover:bg-white/[0.02]' : 'hover:bg-gray-50/50'}`}>
                                            <td className="px-6 py-4">
                                                <span className={`text-sm font-bold ${headingColor}`}>{users.find(u => u.id === r.ownerId)?.name || '—'}</span>
                                            </td>
                                            <td className="px-6 py-4">
                                                <span className="text-xs font-mono font-bold text-emerald-500">{r.referralId}</span>
                                            </td>
                                            <td className="px-6 py-4 text-sm font-medium">{r.name}</td>
                                            <td className="px-6 py-4 text-sm font-medium">{r.phone || '—'}</td>
                                            <td className="px-6 py-4 text-sm font-medium">{r.source || '—'}</td>
                                            <td className="px-6 py-4">
                                                <span className="text-xs font-bold text-pink-500">{r.tgAccount || '—'}</span>
                                            </td>
                                            <td className="px-6 py-4">
                                                <span className={`px-3 py-1 rounded-full text-[10px] font-black uppercase tracking-widest ${r.status === 'active' || !r.status ? 'bg-emerald-500/10 text-emerald-500' :
                                                    r.status === 'inactive' ? 'bg-amber-500/10 text-amber-500' :
                                                        'bg-rose-500/10 text-rose-500'
                                                    }`}>
                                                    {r.status || 'active'}
                                                </span>
                                            </td>
                                            <td className="px-6 py-4 text-right">
                                                <button
                                                    onClick={() => {
                                                        setEditingReferral(r)
                                                        setShowModal(true)
                                                    }}
                                                    className={`p-2 rounded-lg opacity-0 group-hover:opacity-100 transition-all ${theme === 'dark' ? 'hover:bg-white/10 text-gray-400 hover:text-white' : 'hover:bg-emerald-50 text-gray-400 hover:text-emerald-500'}`}
                                                >
                                                    <EditIcon className="w-4 h-4" />
                                                </button>
                                            </td>
                                        </tr>
                                    ))}
                                </tbody>
                            </table>
                        </div>
                    </div>
                )}

                {/* User Table (My Referrals) */}
                {!isAdmin && (
                    <div className={`rounded-[2.5rem] border overflow-hidden ${theme === 'dark' ? 'bg-[#0b1015] border-white/5' : 'bg-white border-gray-100'} shadow-2xl`}>
                        <div className="p-8 border-b border-white/5 flex items-center justify-between">
                            <div className="flex items-center gap-3">
                                <UserIcon className="w-5 h-5 text-pink-500" />
                                <h3 className={`text-xl font-black tracking-tight ${headingColor}`}>Ваши рефералы</h3>
                            </div>
                        </div>
                        <div className="overflow-x-auto">
                            <table className="w-full text-left border-collapse">
                                <thead>
                                    <tr className={theme === 'dark' ? 'bg-white/[0.02]' : 'bg-gray-50'}>
                                        {['ID', 'Имя', 'Телефон', 'Источник', 'TG', 'Статус'].map(h => (
                                            <th key={h} className="px-6 py-5 text-[10px] font-black uppercase tracking-widest text-gray-500">{h}</th>
                                        ))}
                                    </tr>
                                </thead>
                                <tbody className="divide-y divide-white/5">
                                    {myReferrals.length > 0 ? myReferrals.map(r => (
                                        <tr key={r.id} className={`group transition-colors ${theme === 'dark' ? 'hover:bg-white/[0.02]' : 'hover:bg-gray-50/50'}`}>
                                            <td className="px-6 py-4">
                                                <span className="text-xs font-mono font-bold text-emerald-500">{r.referralId}</span>
                                            </td>
                                            <td className="px-6 py-4 text-sm font-medium">{r.name}</td>
                                            <td className="px-6 py-4 text-sm font-medium">{r.phone || '—'}</td>
                                            <td className="px-6 py-4 text-sm font-medium">{r.source || '—'}</td>
                                            <td className="px-6 py-4">
                                                <span className="text-xs font-bold text-pink-500">{r.tgAccount || '—'}</span>
                                            </td>
                                            <td className="px-6 py-4">
                                                <span className={`px-3 py-1 rounded-full text-[10px] font-black uppercase tracking-widest ${r.status === 'active' || !r.status ? 'bg-emerald-500/10 text-emerald-500' :
                                                    r.status === 'inactive' ? 'bg-amber-500/10 text-amber-500' :
                                                        'bg-rose-500/10 text-rose-500'
                                                    }`}>
                                                    {r.status || 'active'}
                                                </span>
                                            </td>
                                        </tr>
                                    )) : (
                                        <tr>
                                            <td colSpan={6} className="px-6 py-12 text-center text-gray-500 font-bold uppercase tracking-widest text-xs">Рефералов пока нет</td>
                                        </tr>
                                    )}
                                </tbody>
                            </table>
                        </div>
                    </div>
                )}

                {/* Global Stats Table */}
                <div className={`rounded-[2.5rem] border overflow-hidden ${theme === 'dark' ? 'bg-[#0b1015] border-white/5' : 'bg-white border-gray-100'} shadow-2xl`}>
                    <div className="p-8 border-b border-white/5">
                        <div className="flex items-center gap-3">
                            <TrendingUp className="w-5 h-5 text-emerald-500" />
                            <h3 className={`text-xl font-black tracking-tight ${headingColor}`}>Общая статистика</h3>
                        </div>
                    </div>
                    <div className="overflow-x-auto">
                        <table className="w-full text-left border-collapse">
                            <thead>
                                <tr className={theme === 'dark' ? 'bg-white/[0.02]' : 'bg-gray-50'}>
                                    {['Участник', 'Всего', 'Активные', 'Неактивные', 'Удаленные'].map(h => (
                                        <th key={h} className="px-6 py-5 text-[10px] font-black uppercase tracking-widest text-gray-500">{h}</th>
                                    ))}
                                </tr>
                            </thead>
                            <tbody className="divide-y divide-white/5">
                                {statsTable.map(s => (
                                    <tr key={s.userId} className={`group transition-colors ${theme === 'dark' ? 'hover:bg-white/[0.02]' : 'hover:bg-gray-50/50'} ${s.userId === user?.id ? (theme === 'dark' ? 'bg-emerald-500/5' : 'bg-emerald-50/50') : ''}`}>
                                        <td className="px-6 py-4 flex items-center gap-3">
                                            <div className={`w-8 h-8 rounded-lg flex items-center justify-center font-black text-xs ${theme === 'dark' ? 'bg-white/5 text-emerald-400' : 'bg-emerald-50 text-emerald-600'}`}>
                                                {s.name[0]}
                                            </div>
                                            <span className={`text-sm font-bold ${headingColor}`}>{s.name}</span>
                                        </td>
                                        <td className="px-6 py-4 font-black">{s.total}</td>
                                        <td className="px-6 py-4 text-emerald-500 font-bold">{s.active}</td>
                                        <td className="px-6 py-4 text-amber-500 font-bold">{s.inactive}</td>
                                        <td className="px-6 py-4 text-rose-500 font-bold">{s.deleted}</td>
                                    </tr>
                                ))}
                            </tbody>
                        </table>
                    </div>
                </div>
            </div>

            {showModal && (
                <ReferralModal
                    referral={editingReferral}
                    onClose={() => {
                        setShowModal(false)
                        setEditingReferral(null)
                    }}
                    onSave={() => {
                        setShowModal(false)
                        setEditingReferral(null)
                        loadData()
                    }}
                    theme={theme}
                />
            )}
        </div>
    )
}

const X = ({ className }: { className?: string }) => <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className={className}><path d="M18 6 6 18" /><path d="m6 6 12 12" /></svg>
const EditIcon = ({ className }: { className?: string }) => <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className={className}><path d="M17 3a2.85 2.83 0 1 1 4 4L7.5 20.5 2 22l1.5-5.5Z" /><path d="m15 5 4 4" /></svg>
