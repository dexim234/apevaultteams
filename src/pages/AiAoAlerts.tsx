import React, { useState, useEffect, useRef, useMemo } from 'react'
import { useThemeStore } from '@/store/themeStore'
import { useAuthStore } from '@/store/authStore'
import { useAdminStore } from '@/store/adminStore'
import { getAiAlerts, addAiAlert, updateAiAlert, deleteAiAlert } from '@/services/firestoreService'
import { AiAlert } from '@/types'
import { Plus, Edit, Trash2, Save, X, Copy, Check, Table, Filter, ArrowUp, ArrowDown, RotateCcw, Calendar, Hash, Coins, TrendingDown, TrendingUp, Activity, Clock, FileText, Image as ImageIcon, Zap, AlertTriangle, Upload, XCircle } from 'lucide-react'
import { MultiStrategySelector } from '@/components/Management/MultiStrategySelector'
import { UserNickname } from '@/components/UserNickname'

type SortField = 'date' | 'drop' | 'profit'
type SortOrder = 'asc' | 'desc'

// Premium Input Component
const PremiumInput: React.FC<{
    icon?: React.ComponentType<{ className?: string }>
    label?: string
    placeholder?: string
    value: string
    onChange: (e: React.ChangeEvent<HTMLInputElement>) => void
    theme: string
    type?: string
}> = ({ icon: Icon, label, placeholder, value, onChange, theme, type = 'text' }) => (
    <div className="space-y-1.5">
        {label && <label className={`text-[10px] font-bold uppercase tracking-wider ml-1 ${theme === 'dark' ? 'text-gray-400' : 'text-gray-500'}`}>{label}</label>}
        <div className="relative">
            {Icon && <Icon className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-500" />}
            <input
                type={type}
                placeholder={placeholder}
                value={value}
                onChange={onChange}
                className={`w-full ${Icon ? 'pl-10' : 'pl-4'} pr-4 py-3 rounded-xl border outline-none transition-all text-sm font-mono ${theme === 'dark' ? 'bg-black/20 border-white/5 text-white focus:border-emerald-500/50' : 'bg-gray-50 border-gray-100 text-gray-900 focus:border-emerald-500/30'}`}
            />
        </div>
    </div>
)

// Premium Select Component
const PremiumSelect: React.FC<{
    value: string
    options: { value: string; label: string }[]
    onChange: (val: string) => void
    theme: string
}> = ({ value, options, onChange, theme }) => (
    <div className="relative">
        <select
            value={value}
            onChange={(e) => onChange(e.target.value)}
            className={`w-full px-4 py-3 rounded-xl border outline-none transition-all text-sm font-semibold appearance-none cursor-pointer ${theme === 'dark' ? 'bg-black/20 border-white/5 text-white focus:border-emerald-500/50' : 'bg-gray-50 border-gray-100 text-gray-900 focus:border-emerald-500/30'}`}
        >
            {options.map(opt => <option key={opt.value} value={opt.value}>{opt.label}</option>)}
        </select>
        <div className="absolute right-3 top-1/2 -translate-y-1/2 pointer-events-none">
            <div className={`w-2 h-2 border-r-2 border-b-2 rotate-45 ${theme === 'dark' ? 'border-gray-500' : 'border-gray-400'}`}></div>
        </div>
    </div>
)

export const AiAoAlerts = () => {
    const { theme } = useThemeStore()
    const { user } = useAuthStore()
    const { isAdmin } = useAdminStore()

    const subTextColor = theme === 'dark' ? 'text-gray-400' : 'text-gray-600'
    const headingColor = theme === 'dark' ? 'text-white' : 'text-gray-900'
    const cardBg = theme === 'dark' ? 'bg-[#10141c]' : 'bg-white'
    const cardBorder = theme === 'dark' ? 'border-blue-500/50' : 'border-blue-500/30'
    const cardShadow = theme === 'dark' ? 'shadow-[0_24px_80px_rgba(0,0,0,0.45)] shadow-blue-500/10' : 'shadow-[0_24px_80px_rgba(0,0,0,0.15)]'

    const [alerts, setAlerts] = useState<AiAlert[]>([])
    const [loading, setLoading] = useState(true)
    const [showModal, setShowModal] = useState(false)
    const [editingAlert, setEditingAlert] = useState<AiAlert | null>(null)
    const [copyingId, setCopyingId] = useState<string | null>(null)
    const [isCopyingTable, setIsCopyingTable] = useState(false)
    const [showSuccess, setShowSuccess] = useState(false)
    const [successCount, setSuccessCount] = useState(0)
    const [previewImage, setPreviewImage] = useState<string | null>(null)

    // Filter states
    const [showFilters, setShowFilters] = useState(false)
    const [specificDate, setSpecificDate] = useState('')
    const [dateFrom, setDateFrom] = useState('')
    const [dateTo, setDateTo] = useState('')
    const [minDrop, setMinDrop] = useState('')
    const [maxDrop, setMaxDrop] = useState('')
    const [minProfit, setMinProfit] = useState('')
    const [maxProfit, setMaxProfit] = useState('')
    const [minMc, setMinMc] = useState('')
    const [maxMc, setMaxMc] = useState('')
    const [sortBy, setSortBy] = useState<SortField>('date')
    const [sortOrder, setSortOrder] = useState<SortOrder>('desc')

    // Screenshot state
    const [screenshotPreview, setScreenshotPreview] = useState<string | null>(null)
    const fileInputRef = useRef<HTMLInputElement>(null)

    // Form state for single alert
    const [formData, setFormData] = useState<Partial<AiAlert>>({
        signalDate: new Date().toISOString().split('T')[0],
        signalTime: new Date().toLocaleTimeString('ru-RU', { hour: '2-digit', minute: '2-digit' }),
        marketCap: '',
        address: '',
        maxDrop: '',
        maxDropFromLevel07: '',
        maxProfit: '',
        comment: '',
        strategy: 'Market Entry'
    })

    // Common date for all alerts in batch mode
    const [commonDate, setCommonDate] = useState<string>(formData.signalDate || '')

    // List of alerts to add (batch mode)
    const [alertsToAdd, setAlertsToAdd] = useState<Partial<AiAlert>[]>([])

    // MultiStrategySelector state
    const [selectedStrategyId, setSelectedStrategyId] = useState<string | null>(null)

    // Scam alert toggle
    const [isScamAlert, setIsScamAlert] = useState(false)

    // Handle screenshot selection
    const handleScreenshotChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const file = e.target.files?.[0]
        if (file) {
            if (file.size > 5 * 1024 * 1024) {
                alert('Файл слишком большой. Максимальный размер 5MB')
                return
            }
            const reader = new FileReader()
            reader.onloadend = () => {
                setScreenshotPreview(reader.result as string)
            }
            reader.readAsDataURL(file)
        }
    }

    // Remove screenshot
    const removeScreenshot = () => {
        setScreenshotPreview(null)
        if (fileInputRef.current) {
            fileInputRef.current.value = ''
        }
    }

    // Add current form to the list
    const handleAddToList = () => {
        if (!formData.address) {
            alert('Введите адрес токена')
            return
        }

        const newAlert: Partial<AiAlert> = {
            signalDate: commonDate,
            signalTime: formData.signalTime,
            marketCap: formData.marketCap,
            address: formData.address,
            maxDrop: formData.maxDrop,
            maxDropFromLevel07: formData.maxDropFromLevel07,
            maxProfit: formData.maxProfit,
            comment: formData.comment,
            strategy: formData.strategy,
            screenshot: screenshotPreview || undefined
        }

        setAlertsToAdd([...alertsToAdd, newAlert])

        // Reset form fields except date (which is now common)
        setFormData({
            ...formData,
            signalTime: new Date().toLocaleTimeString('ru-RU', { hour: '2-digit', minute: '2-digit' }),
            marketCap: '',
            address: '',
            maxDrop: '',
            maxDropFromLevel07: '',
            maxProfit: '',
            comment: ''
        })
        setScreenshotPreview(null)
        setSelectedStrategyId(null)
        setIsScamAlert(false)
    }

    // Save all alerts
    const handleSaveAll = async () => {
        if (alertsToAdd.length === 0) {
            alert('Добавьте хотя бы один сигнал')
            return
        }

        try {
            const promises = alertsToAdd.map(alert =>
                addAiAlert({
                    ...alert as AiAlert,
                    createdAt: new Date().toISOString(),
                    createdBy: user?.id || 'admin'
                })
            )
            await Promise.all(promises)

            // Show success animation
            setSuccessCount(alertsToAdd.length)
            setShowSuccess(true)
            setTimeout(() => {
                setShowSuccess(false)
                setSuccessCount(0)
            }, 2500)

            // Reset
            setAlertsToAdd([])
            setFormData({
                signalDate: new Date().toISOString().split('T')[0],
                signalTime: new Date().toLocaleTimeString('ru-RU', { hour: '2-digit', minute: '2-digit' }),
                marketCap: '',
                address: '',
                maxDrop: '',
                maxProfit: '',
                comment: ''
            })
            setScreenshotPreview(null)
            setShowModal(false)
            await loadAlerts()
        } catch (error: any) {
            console.error('Error saving alerts:', error)
        }
    }

    // Handle single save (for editing or single alert)
    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault()
        try {
            const alertData = {
                ...formData,
                signalDate: commonDate,
                screenshot: screenshotPreview || formData.screenshot,
                isScam: isScamAlert || false
            }
            if (editingAlert) {
                await updateAiAlert(editingAlert.id, alertData as AiAlert)
            } else {
                await addAiAlert({
                    ...alertData as AiAlert,
                    createdAt: new Date().toISOString(),
                    createdBy: user?.id || 'admin'
                })
            }
            setShowModal(false)
            setEditingAlert(null)
            setAlertsToAdd([])
            setFormData({
                signalDate: new Date().toISOString().split('T')[0],
                signalTime: new Date().toLocaleTimeString('ru-RU', { hour: '2-digit', minute: '2-digit' }),
                marketCap: '',
                address: '',
                maxDrop: '',
                maxProfit: '',
                comment: ''
            })
            setScreenshotPreview(null)
            setSelectedStrategyId(null)
            setIsScamAlert(false)
            await loadAlerts()
        } catch (error: any) {
            console.error('Error saving alert:', error)
        }
    }

    // Helper to truncate address
    const truncateAddress = (address: string) => {
        if (address.length <= 16) return address
        return `${address.slice(0, 6)}...${address.slice(-6)}`
    }

    // Load alerts
    const loadAlerts = async () => {
        setLoading(true)
        const data = await getAiAlerts()
        setAlerts(data)
        setLoading(false)
    }

    // Copy to clipboard
    const copyToClipboard = async (text: string, id: string) => {
        try {
            await navigator.clipboard.writeText(text)
            setCopyingId(id)
            setTimeout(() => setCopyingId(null), 2000)
        } catch (err) {
            console.error('Failed to copy:', err)
        }
    }

    // Copy table to clipboard
    const copyTableToClipboard = async () => {
        setIsCopyingTable(true)
        try {
            const header = `Дата\tВремя\tMC\tАдрес\tDrop\tПрофит\n`
            const rows = filteredAlerts.map(alert =>
                `${alert.signalDate}\t${alert.signalTime}\t${alert.marketCap || '-'}\t${alert.address}\t${alert.maxDrop || '-'}\t${alert.maxProfit || '-'}`
            ).join('\n')
            await navigator.clipboard.writeText(header + rows)
            setTimeout(() => setIsCopyingTable(false), 2000)
        } catch (err) {
            console.error('Failed to copy table:', err)
            setIsCopyingTable(false)
        }
    }

    // Calculate table stats
    const calculateStats = () => {
        const total = filteredAlerts.length
        const profitable = filteredAlerts.filter(a => a.maxProfit && parseFloat(a.maxProfit.replace('%', '').replace('X', '').replace('x', '').replace('+', '')) > 0).length
        const totalProfit = filteredAlerts.reduce((sum, a) => {
            if (a.maxProfit) {
                const val = parseFloat(a.maxProfit.replace('%', '').replace('X', '').replace('x', '').replace('+', '').replace(',', '.'))
                return sum + (isNaN(val) ? 0 : val)
            }
            return sum
        }, 0)
        const totalDrop = filteredAlerts.reduce((sum, a) => {
            if (a.maxDrop) {
                const val = parseFloat(a.maxDrop.replace('%', '').replace('X', '').replace('x', '').replace(',', '.'))
                return sum + (isNaN(val) ? 0 : val)
            }
            return sum
        }, 0)
        return { total, profitable, totalProfit, totalDrop }
    }

    // Reset filters
    const resetFilters = () => {
        setSpecificDate('')
        setDateFrom('')
        setDateTo('')
        setMinDrop('')
        setMaxDrop('')
        setMinProfit('')
        setMaxProfit('')
        setMinMc('')
        setMaxMc('')
    }

    // Filter and sort alerts
    const filteredAlerts = useMemo(() => {
        let result = [...alerts]

        // Date filters
        if (specificDate) {
            result = result.filter(a => a.signalDate === specificDate)
        }
        if (dateFrom) {
            result = result.filter(a => a.signalDate >= dateFrom)
        }
        if (dateTo) {
            result = result.filter(a => a.signalDate <= dateTo)
        }

        // Numeric filters
        if (minDrop) {
            result = result.filter(a => {
                if (!a.maxDrop) return false
                const val = parseFloat(a.maxDrop.replace('%', '').replace('X', '').replace('x', ''))
                return !isNaN(val) && Math.abs(val) >= parseFloat(minDrop)
            })
        }
        if (maxDrop) {
            result = result.filter(a => {
                if (!a.maxDrop) return false
                const val = parseFloat(a.maxDrop.replace('%', '').replace('X', '').replace('x', ''))
                return !isNaN(val) && Math.abs(val) <= parseFloat(maxDrop)
            })
        }
        if (minProfit) {
            result = result.filter(a => {
                if (!a.maxProfit) return false
                const val = parseFloat(a.maxProfit.replace('%', '').replace('X', '').replace('x', '').replace('+', ''))
                return !isNaN(val) && val >= parseFloat(minProfit)
            })
        }
        if (maxProfit) {
            result = result.filter(a => {
                if (!a.maxProfit) return false
                const val = parseFloat(a.maxProfit.replace('%', '').replace('X', '').replace('x', '').replace('+', ''))
                return !isNaN(val) && val <= parseFloat(maxProfit)
            })
        }
        if (minMc) {
            result = result.filter(a => {
                if (!a.marketCap) return false
                let val = 0
                const mcStr = a.marketCap.toLowerCase()
                if (mcStr.includes('k')) val = parseFloat(mcStr) * 1000
                else if (mcStr.includes('m')) val = parseFloat(mcStr) * 1000000
                else if (mcStr.includes('b')) val = parseFloat(mcStr) * 1000000000
                else val = parseFloat(mcStr)
                return !isNaN(val) && val >= parseFloat(minMc) * 1000000
            })
        }
        if (maxMc) {
            result = result.filter(a => {
                if (!a.marketCap) return false
                let val = 0
                const mcStr = a.marketCap.toLowerCase()
                if (mcStr.includes('k')) val = parseFloat(mcStr) * 1000
                else if (mcStr.includes('m')) val = parseFloat(mcStr) * 1000000
                else if (mcStr.includes('b')) val = parseFloat(mcStr) * 1000000000
                else val = parseFloat(mcStr)
                return !isNaN(val) && val <= parseFloat(maxMc) * 1000000
            })
        }

        // Sort
        result.sort((a, b) => {
            let comparison = 0
            if (sortBy === 'date') {
                comparison = new Date(a.signalDate).getTime() - new Date(b.signalDate).getTime()
            } else if (sortBy === 'drop') {
                const dropA = a.maxDrop ? parseFloat(a.maxDrop.replace('%', '').replace('X', '').replace('x', '')) : 0
                const dropB = b.maxDrop ? parseFloat(b.maxDrop.replace('%', '').replace('X', '').replace('x', '')) : 0
                comparison = dropA - dropB
            } else if (sortBy === 'profit') {
                const profitA = a.maxProfit ? parseFloat(a.maxProfit.replace('%', '').replace('X', '').replace('x', '').replace('+', '')) : 0
                const profitB = b.maxProfit ? parseFloat(b.maxProfit.replace('%', '').replace('X', '').replace('x', '').replace('+', '')) : 0
                comparison = profitA - profitB
            }
            return sortOrder === 'asc' ? comparison : -comparison
        })

        return result
    }, [alerts, specificDate, dateFrom, dateTo, minDrop, maxDrop, minProfit, maxProfit, minMc, maxMc, sortBy, sortOrder])

    const stats = calculateStats()

    useEffect(() => {
        loadAlerts()
    }, [])

    // Handlers for editing
    const handleEdit = (alert: AiAlert) => {
        setEditingAlert(alert)
        setFormData(alert)
        setCommonDate(alert.signalDate)
        setScreenshotPreview(alert.screenshot || null)
        setShowModal(true)
    }

    const handleDelete = async (id: string) => {
        if (confirm('Вы уверены, что хотите удалить этот сигнал?')) {
            await deleteAiAlert(id)
            await loadAlerts()
        }
    }

    return (
        <div className={`min-h-screen p-6 lg:p-8 ${theme === 'dark' ? 'bg-[#0a0e14]' : 'bg-gray-50'}`}>
            <div className="max-w-7xl mx-auto">
                {/* Header */}
                <div className="flex items-center justify-between mb-8">
                    <div className="flex items-center gap-4">
                        <div className={`p-3 rounded-2xl ${theme === 'dark' ? 'bg-blue-500/20 border-blue-500/30' : 'bg-blue-600/10 border-blue-600/20'} border`}>
                            <Activity className={`w-6 h-6 ${theme === 'dark' ? 'text-blue-400' : 'text-blue-600'}`} />
                        </div>
                        <div>
                            <h1 className={`text-2xl font-bold ${headingColor}`}>AI AO ALERTS</h1>
                            <p className={`text-sm ${subTextColor}`}>Сигналы от AI AO</p>
                        </div>
                    </div>
                    <div className="flex items-center gap-3">
                        <button
                            onClick={copyTableToClipboard}
                            className={`flex items-center gap-2 px-4 py-2 rounded-xl font-semibold transition-all ${theme === 'dark' ? 'bg-white/5 hover:bg-white/10 text-white' : 'bg-gray-100 hover:bg-gray-200 text-gray-700'}`}
                        >
                            {isCopyingTable ? <Check size={18} /> : <Copy size={18} />}
                            {isCopyingTable ? 'Скопировано!' : 'Копировать'}
                        </button>
                        {isAdmin && (
                            <button
                                onClick={() => {
                                    setEditingAlert(null)
                                    setFormData({
                                        signalDate: new Date().toISOString().split('T')[0],
                                        signalTime: new Date().toLocaleTimeString('ru-RU', { hour: '2-digit', minute: '2-digit' }),
                                        marketCap: '',
                                        address: '',
                                        maxDrop: '',
                                        maxProfit: '',
                                        comment: '',
                                        strategy: 'Market Entry'
                                    })
                                    setScreenshotPreview(null)
                                    setSelectedStrategyId(null)
                                    setIsScamAlert(false)
                                    setShowModal(true)
                                }}
                                className="flex items-center gap-2 px-4 py-2 rounded-xl bg-emerald-500 hover:bg-emerald-600 text-white font-semibold transition-all shadow-lg shadow-emerald-500/25"
                            >
                                <Plus size={18} />
                                Добавить
                            </button>
                        )}
                    </div>
                </div>

                {/* Stats Bar */}
                <div className={`${theme === 'dark' ? 'bg-[#151c25]' : 'bg-white'} rounded-2xl border ${theme === 'dark' ? 'border-white/5' : 'border-gray-100'} p-4 mb-6 flex flex-wrap gap-6`}>
                    <div className="flex items-center gap-2">
                        <div className={`w-2 h-2 rounded-full ${filteredAlerts.length > 0 ? 'bg-emerald-500' : 'bg-gray-500'}`}></div>
                        <span className={`text-sm font-medium ${subTextColor}`}>Всего сигналов: <span className={`font-bold ${headingColor}`}>{stats.total}</span></span>
                    </div>
                    <div className="flex items-center gap-2">
                        <TrendingUp className="w-4 h-4 text-emerald-500" />
                        <span className={`text-sm font-medium ${subTextColor}`}>Профит: <span className={`font-bold text-emerald-500`}>{stats.totalProfit > 0 ? '+' : ''}{stats.totalProfit.toFixed(1)}</span></span>
                    </div>
                    <div className="flex items-center gap-2">
                        <TrendingDown className="w-4 h-4 text-rose-500" />
                        <span className={`text-sm font-medium ${subTextColor}`}>Просадка: <span className={`font-bold text-rose-500`}>{stats.totalDrop > 0 ? '-' : ''}{stats.totalDrop.toFixed(1)}%</span></span>
                    </div>
                    <div className="flex items-center gap-2 ml-auto">
                        <button
                            onClick={() => setShowFilters(!showFilters)}
                            className={`flex items-center gap-2 px-3 py-1.5 rounded-lg text-sm font-medium transition-colors ${showFilters ? 'bg-blue-500 text-white' : theme === 'dark' ? 'bg-white/5 text-gray-400' : 'bg-gray-100 text-gray-600'}`}
                        >
                            <Filter size={14} />
                            Фильтры
                        </button>
                        {(specificDate || dateFrom || dateTo || minDrop || maxDrop || minProfit || maxProfit || minMc || maxMc) && (
                            <button
                                onClick={resetFilters}
                                className="flex items-center gap-2 px-3 py-1.5 rounded-lg text-sm font-medium bg-rose-500/10 text-rose-500 hover:bg-rose-500/20 transition-colors"
                            >
                                <RotateCcw size={14} />
                                Сброс
                            </button>
                        )}
                    </div>
                </div>

                {/* Filters */}
                {showFilters && (
                    <div className={`${theme === 'dark' ? 'bg-[#151c25]' : 'bg-white'} rounded-2xl border ${theme === 'dark' ? 'border-white/5' : 'border-gray-100'} p-4 mb-6 animate-in slide-in-from-top-2`}>
                        <div className="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-6 gap-4">
                            <div>
                                <label className={`text-[10px] font-bold uppercase tracking-wider ml-1 ${subTextColor}`}>Дата</label>
                                <input
                                    type="date"
                                    value={specificDate}
                                    onChange={(e) => setSpecificDate(e.target.value)}
                                    className={`w-full mt-1 px-3 py-2 rounded-xl border text-sm outline-none ${theme === 'dark' ? 'bg-white/5 border-white/5 text-white' : 'bg-gray-50 border-gray-200 text-gray-900'}`}
                                />
                            </div>
                            <div>
                                <label className={`text-[10px] font-bold uppercase tracking-wider ml-1 ${subTextColor}`}>От</label>
                                <input
                                    type="date"
                                    value={dateFrom}
                                    onChange={(e) => setDateFrom(e.target.value)}
                                    className={`w-full mt-1 px-3 py-2 rounded-xl border text-sm outline-none ${theme === 'dark' ? 'bg-white/5 border-white/5 text-white' : 'bg-gray-50 border-gray-200 text-gray-900'}`}
                                />
                            </div>
                            <div>
                                <label className={`text-[10px] font-bold uppercase tracking-wider ml-1 ${subTextColor}`}>До</label>
                                <input
                                    type="date"
                                    value={dateTo}
                                    onChange={(e) => setDateTo(e.target.value)}
                                    className={`w-full mt-1 px-3 py-2 rounded-xl border text-sm outline-none ${theme === 'dark' ? 'bg-white/5 border-white/5 text-white' : 'bg-gray-50 border-gray-200 text-gray-900'}`}
                                />
                            </div>
                            <div>
                                <label className={`text-[10px] font-bold uppercase tracking-wider ml-1 ${subTextColor}`}>Мин. Drop</label>
                                <input
                                    type="number"
                                    placeholder="-5"
                                    value={minDrop}
                                    onChange={(e) => setMinDrop(e.target.value)}
                                    className={`w-full mt-1 px-3 py-2 rounded-xl border text-sm outline-none ${theme === 'dark' ? 'bg-white/5 border-white/5 text-white' : 'bg-gray-50 border-gray-200 text-gray-900'}`}
                                />
                            </div>
                            <div>
                                <label className={`text-[10px] font-bold uppercase tracking-wider ml-1 ${subTextColor}`}>Макс. Drop</label>
                                <input
                                    type="number"
                                    placeholder="-50"
                                    value={maxDrop}
                                    onChange={(e) => setMaxDrop(e.target.value)}
                                    className={`w-full mt-1 px-3 py-2 rounded-xl border text-sm outline-none ${theme === 'dark' ? 'bg-white/5 border-white/5 text-white' : 'bg-gray-50 border-gray-200 text-gray-900'}`}
                                />
                            </div>
                            <div>
                                <label className={`text-[10px] font-bold uppercase tracking-wider ml-1 ${subTextColor}`}>Мин. Профит</label>
                                <input
                                    type="number"
                                    placeholder="10"
                                    value={minProfit}
                                    onChange={(e) => setMinProfit(e.target.value)}
                                    className={`w-full mt-1 px-3 py-2 rounded-xl border text-sm outline-none ${theme === 'dark' ? 'bg-white/5 border-white/5 text-white' : 'bg-gray-50 border-gray-200 text-gray-900'}`}
                                />
                            </div>
                        </div>
                    </div>
                )}

                {/* Table */}
                <div className={`${cardBg} ${cardBorder} ${cardShadow} rounded-3xl overflow-hidden`}>
                    <div className="overflow-x-auto">
                        <table className="w-full text-left">
                            <thead>
                                <tr className={`border-b ${theme === 'dark' ? 'border-white/5' : 'border-gray-100'}`}>
                                    <th className={`p-4 text-[10px] font-bold uppercase tracking-wider ${subTextColor}`}>
                                        <button onClick={() => { setSortBy('date'); setSortOrder(sortOrder === 'asc' ? 'desc' : 'asc') }} className="flex items-center gap-1 hover:text-white transition-colors">
                                            Дата {sortBy === 'date' && (sortOrder === 'asc' ? <ArrowUp size={12} /> : <ArrowDown size={12} />)}
                                        </button>
                                    </th>
                                    <th className={`p-4 text-[10px] font-bold uppercase tracking-wider ${subTextColor}`}>Время</th>
                                    <th className={`p-4 text-[10px] font-bold uppercase tracking-wider ${subTextColor}`}>MC</th>
                                    <th className={`p-4 text-[10px] font-bold uppercase tracking-wider ${subTextColor}`}>Адрес</th>
                                    <th className={`p-4 text-[10px] font-bold uppercase tracking-wider ${subTextColor}`}>
                                        <button onClick={() => { setSortBy('drop'); setSortOrder(sortOrder === 'asc' ? 'desc' : 'asc') }} className="flex items-center gap-1 hover:text-white transition-colors">
                                            Drop {sortBy === 'drop' && (sortOrder === 'asc' ? <ArrowUp size={12} /> : <ArrowDown size={12} />)}
                                        </button>
                                    </th>
                                    <th className={`p-4 text-[10px] font-bold uppercase tracking-wider ${subTextColor}`}>Drop 0.7</th>
                                    <th className={`p-4 text-[10px] font-bold uppercase tracking-wider ${subTextColor}`}>
                                        <button onClick={() => { setSortBy('profit'); setSortOrder(sortOrder === 'asc' ? 'desc' : 'asc') }} className="flex items-center gap-1 hover:text-white transition-colors">
                                            Профит {sortBy === 'profit' && (sortOrder === 'asc' ? <ArrowUp size={12} /> : <ArrowDown size={12} />)}
                                        </button>
                                    </th>
                                    <th className={`p-4 text-[10px] font-bold uppercase tracking-wider ${subTextColor}`}>Стратегия</th>
                                    <th className={`p-4 text-[10px] font-bold uppercase tracking-wider ${subTextColor}`}>Коммент</th>
                                    {isAdmin && <th className={`p-4 text-[10px] font-bold uppercase tracking-wider ${subTextColor}`}></th>}
                                </tr>
                            </thead>
                            <tbody className={`divide-y ${theme === 'dark' ? 'divide-white/5' : 'divide-gray-50'}`}>
                                {loading ? (
                                    <tr>
                                        <td colSpan={10} className={`p-8 text-center ${subTextColor}`}>Загрузка...</td>
                                    </tr>
                                ) : filteredAlerts.length === 0 ? (
                                    <tr>
                                        <td colSpan={10} className={`p-8 text-center ${subTextColor}`}>Сигналы не найдены</td>
                                    </tr>
                                ) : (
                                    filteredAlerts.map((alert) => (
                                        <tr key={alert.id} className={`group transition-colors ${theme === 'dark' ? 'hover:bg-white/5' : 'hover:bg-gray-50'}`}>
                                            <td className={`p-4 text-sm font-semibold ${headingColor}`}>{alert.signalDate}</td>
                                            <td className={`p-4 text-sm font-mono ${subTextColor}`}>{alert.signalTime}</td>
                                            <td className={`p-4 text-sm font-mono font-bold ${headingColor}`}>{alert.marketCap || '-'}</td>
                                            <td className={`p-4 text-sm font-mono ${subTextColor}`}>
                                                <div className="flex items-center gap-2">
                                                    <button
                                                        onClick={() => copyToClipboard(alert.address, alert.id)}
                                                        className="flex items-center gap-1 hover:text-blue-400 transition-colors"
                                                    >
                                                        {truncateAddress(alert.address)}
                                                        {copyingId === alert.id ? <Check size={12} /> : <Copy size={12} />}
                                                    </button>
                                                </div>
                                            </td>
                                            <td className={`p-4 text-sm font-mono font-bold ${alert.maxDrop && parseFloat(alert.maxDrop.replace('%', '').replace('X', '').replace('x', '')) < 0 ? 'text-emerald-500' : 'text-rose-500'}`}>
                                                {alert.maxDrop || '-'}
                                            </td>
                                            <td className={`p-4 text-sm font-mono font-bold ${subTextColor}`}>{alert.maxDropFromLevel07 || '-'}</td>
                                            <td className={`p-4 text-sm font-mono font-bold ${alert.maxProfit && parseFloat(alert.maxProfit.replace('%', '').replace('X', '').replace('x', '').replace('+', '')) > 0 ? 'text-emerald-500' : headingColor}`}>
                                                {alert.maxProfit || '-'}
                                            </td>
                                            <td className={`p-4 text-sm font-semibold ${subTextColor}`}>{alert.strategy}</td>
                                            <td className={`p-4 text-sm ${subTextColor} max-w-xs truncate`}>{alert.comment || '-'}</td>
                                            {isAdmin && (
                                                <td className="p-4">
                                                    <div className="flex items-center gap-2 opacity-0 group-hover:opacity-100 transition-opacity">
                                                        <button onClick={() => handleEdit(alert)} className="p-2 rounded-lg bg-blue-500/10 text-blue-500 hover:bg-blue-500/20 transition-colors">
                                                            <Edit size={14} />
                                                        </button>
                                                        <button onClick={() => handleDelete(alert.id)} className="p-2 rounded-lg bg-rose-500/10 text-rose-500 hover:bg-rose-500/20 transition-colors">
                                                            <Trash2 size={14} />
                                                        </button>
                                                    </div>
                                                </td>
                                            )}
                                        </tr>
                                    ))
                                )}
                            </tbody>
                        </table>
                    </div>
                </div>
            </div>

            {/* Modal */}
            {showModal && (
                <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm overflow-y-auto">
                    <div className={`w-full max-w-4xl rounded-[32px] ${cardBg} ${cardBorder} border shadow-2xl overflow-hidden my-auto flex flex-col relative`}>
                        {/* Decorative background elements */}
                        <div className="absolute inset-0 overflow-hidden pointer-events-none">
                            <div className="absolute -top-24 -right-24 w-64 h-64 rounded-full bg-emerald-500/5 blur-3xl"></div>
                            <div className="absolute -bottom-24 -left-24 w-64 h-64 rounded-full bg-blue-500/5 blur-3xl"></div>
                        </div>
                        
                        {/* Header */}
                        <div className={`p-6 border-b ${theme === 'dark' ? 'border-white/10' : 'border-gray-100'} flex items-center justify-between flex-shrink-0 relative z-10`}>
                            <div className="flex items-center gap-4">
                                <div className={`p-3 rounded-2xl ${theme === 'dark' ? 'bg-white/10 border-white/20' : 'bg-emerald-600/10 border-emerald-600/30'} border`}>
                                    <Zap className={`w-6 h-6 ${theme === 'dark' ? 'text-white' : 'text-emerald-600'}`} />
                                </div>
                                <div>
                                    <h3 className={`text-xl font-bold ${headingColor}`}>
                                        {editingAlert ? 'Редактировать сигнал' : 'Добавить новые сигналы'}
                                    </h3>
                                    <p className={`text-sm ${subTextColor}`}>
                                        {editingAlert ? 'Изменение параметров' : 'Заполнение данных для сигналов'}
                                    </p>
                                </div>
                            </div>

                            <button
                                onClick={() => setShowModal(false)}
                                className={`p-2 rounded-xl ${theme === 'dark' ? 'hover:bg-white/10' : 'hover:bg-gray-100'} transition-colors`}
                            >
                                <X className={`w-6 h-6 ${subTextColor}`} />
                            </button>
                        </div>

                        {/* Body */}
                        <div className="p-6 lg:p-8 relative z-10">
                            <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 lg:gap-12">
                                {/* Left Column */}
                                <div className="space-y-4">
                                    <div className="grid grid-cols-2 gap-4">
                                        <PremiumInput
                                            icon={Calendar}
                                            label="Дата"
                                            placeholder=""
                                            value={editingAlert?.signalDate || commonDate}
                                            onChange={(e) => editingAlert ? setFormData({ ...formData, signalDate: e.target.value }) : setCommonDate(e.target.value)}
                                            theme={theme}
                                            type="date"
                                        />
                                        <PremiumInput
                                            icon={Clock}
                                            label="Время"
                                            placeholder=""
                                            value={formData.signalTime}
                                            onChange={(e) => setFormData({ ...formData, signalTime: e.target.value })}
                                            theme={theme}
                                            type="time"
                                        />
                                    </div>

                                    <div className="grid grid-cols-2 gap-4">
                                        <PremiumInput
                                            icon={Coins}
                                            label="Market Cap"
                                            placeholder="Напр: 300K или 1.5M"
                                            value={formData.marketCap || ''}
                                            onChange={(e) => setFormData({ ...formData, marketCap: e.target.value })}
                                            theme={theme}
                                        />

                                        <div className="space-y-1.5">
                                            <label className={`text-[10px] font-bold uppercase tracking-wider ml-1 ${theme === 'dark' ? 'text-gray-400' : 'text-gray-500'}`}>Drop</label>
                                            <div className="relative">
                                                <TrendingDown className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-rose-500" />
                                                <input
                                                    type="text"
                                                    placeholder="-16%"
                                                    value={formData.maxDrop || ''}
                                                    onChange={(e) => setFormData({ ...formData, maxDrop: e.target.value })}
                                                    className={`w-full pl-10 py-3 rounded-xl border outline-none transition-all text-sm font-mono ${theme === 'dark' ? 'bg-black/20 border-white/5 text-white focus:border-emerald-500/50' : 'bg-gray-50 border-gray-100 text-gray-900 focus:border-emerald-500/30'}`}
                                                />
                                            </div>
                                        </div>

                                        <div className="space-y-1.5">
                                            <label className={`text-[10px] font-bold uppercase tracking-wider ml-1 ${theme === 'dark' ? 'text-gray-400' : 'text-gray-500'}`}>Drop 0.7</label>
                                            <div className="relative">
                                                <TrendingDown className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-rose-500" />
                                                <input
                                                    type="text"
                                                    placeholder="X2"
                                                    value={formData.maxDropFromLevel07 || ''}
                                                    onChange={(e) => setFormData({ ...formData, maxDropFromLevel07: e.target.value })}
                                                    className={`w-full pl-10 py-3 rounded-xl border outline-none transition-all text-sm font-mono ${theme === 'dark' ? 'bg-black/20 border-white/5 text-white focus:border-emerald-500/50' : 'bg-gray-50 border-gray-100 text-gray-900 focus:border-emerald-500/30'}`}
                                                />
                                            </div>
                                        </div>

                                        <div className="space-y-1.5">
                                            <label className={`text-[10px] font-bold uppercase tracking-wider ml-1 ${theme === 'dark' ? 'text-gray-400' : 'text-gray-500'}`}>Профит</label>
                                            <div className="relative">
                                                <TrendingUp className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-emerald-500" />
                                                <input
                                                    type="text"
                                                    placeholder="+28% / X2"
                                                    value={formData.maxProfit || ''}
                                                    onChange={(e) => setFormData({ ...formData, maxProfit: e.target.value })}
                                                    className={`w-full pl-10 py-3 rounded-xl border outline-none transition-all text-sm font-mono ${theme === 'dark' ? 'bg-black/20 border-white/5 text-white focus:border-emerald-500/50' : 'bg-gray-50 border-gray-100 text-gray-900 focus:border-emerald-500/30'}`}
                                                />
                                            </div>
                                        </div>

                                        <div className="col-span-2 space-y-1.5">
                                            <label className={`text-[10px] font-bold uppercase tracking-wider ml-1 ${theme === 'dark' ? 'text-gray-400' : 'text-gray-500'}`}>Коммент</label>
                                            <div className="relative">
                                                <FileText className="absolute left-3 top-3 w-4 h-4 text-gray-500" />
                                                <textarea
                                                    rows={2}
                                                    placeholder="Дополнительная информация..."
                                                    value={formData.comment || ''}
                                                    onChange={(e) => setFormData({ ...formData, comment: e.target.value })}
                                                    className={`w-full pl-10 pr-4 py-3 rounded-2xl border outline-none transition-all text-sm font-semibold resize-none ${theme === 'dark' ? 'bg-black/20 border-white/5 text-white' : 'bg-white border-gray-50 border-gray-100 text-gray-900'}`}
                                                ></textarea>
                                            </div>
                                        </div>
                                    </div>

                                    {/* Screenshot Upload */}
                                    <div className="space-y-1.5">
                                        <label className={`text-[10px] font-bold tracking-wider ml-1 ${theme === 'dark' ? 'text-gray-400' : 'text-gray-500'}`}>Скриншот (опционально)</label>
                                        <div className={`relative rounded-xl border-2 border-dashed transition-all ${theme === 'dark' ? 'border-white/10 hover:border-emerald-500/30 bg-white/5' : 'border-gray-200 hover:border-emerald-500/30 bg-gray-50'}`}>
                                            {screenshotPreview ? (
                                                <div className="relative p-4">
                                                    <div className="relative rounded-lg overflow-hidden">
                                                        <img src={screenshotPreview} alt="Preview" className="w-full h-32 object-contain rounded-lg" />
                                                        <button
                                                            type="button"
                                                            onClick={removeScreenshot}
                                                            className="absolute top-2 right-2 p-1.5 rounded-lg bg-rose-500/90 text-white hover:bg-rose-500 transition-colors shadow-lg"
                                                        >
                                                            <X className="w-4 h-4" />
                                                        </button>
                                                    </div>
                                                </div>
                                            ) : (
                                                <div
                                                    className="p-6 flex flex-col items-center justify-center cursor-pointer hover:bg-white/5 transition-colors"
                                                    onClick={() => fileInputRef.current?.click()}
                                                >
                                                    <div className={`w-12 h-12 rounded-full flex items-center justify-center mb-3 ${theme === 'dark' ? 'bg-white/10' : 'bg-emerald-50'}`}>
                                                        <ImageIcon className={`w-6 h-6 ${subTextColor}`} />
                                                    </div>
                                                    <p className={`text-sm font-semibold ${headingColor}`}>Нажмите для загрузки</p>
                                                    <p className={`text-xs ${subTextColor} mt-1`}>PNG, JPG до 5MB</p>
                                                </div>
                                            )}
                                            <input ref={fileInputRef} type="file" accept="image/*" onChange={handleScreenshotChange} className="hidden" />
                                        </div>
                                    </div>
                                </div>

                                {/* Right Column */}
                                <div className="space-y-4">
                                    <div className="flex items-center gap-2 mb-2">
                                        <div className="w-1.5 h-1.5 rounded-full bg-emerald-500"></div>
                                        <span className={`text-xs font-bold uppercase tracking-widest ${subTextColor}`}>Стратегия и адрес</span>
                                    </div>

                                    {/* Multi Strategy Selector */}
                                    <MultiStrategySelector
                                        value={selectedStrategyId}
                                        onChange={setSelectedStrategyId}
                                        theme={theme}
                                        label="Выберите стратегию"
                                    />

                                    <div className="space-y-1.5">
                                        <label className={`text-[10px] font-bold uppercase tracking-wider ml-1 ${theme === 'dark' ? 'text-gray-400' : 'text-gray-500'}`}>Contract Address</label>
                                        <div className="relative">
                                            <Hash className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-500" />
                                            <input
                                                type="text"
                                                placeholder="Введите адрес контракта..."
                                                value={formData.address}
                                                onChange={(e) => setFormData({ ...formData, address: e.target.value })}
                                                className={`w-full pl-10 py-3 rounded-xl border outline-none transition-all text-sm font-mono ${theme === 'dark' ? 'bg-black/20 border-white/5 text-white focus:border-emerald-500/50' : 'bg-gray-50 border-gray-100 text-gray-900 focus:border-emerald-500/30'}`}
                                            />
                                        </div>
                                    </div>

                                    {/* Scam Alert Toggle */}
                                    <div className={`p-4 rounded-xl border transition-all ${isScamAlert ? 'bg-rose-500/10 border-rose-500/30' : theme === 'dark' ? 'bg-white/5 border-white/10' : 'bg-gray-50 border-gray-100'}`}>
                                        <button
                                            onClick={() => setIsScamAlert(!isScamAlert)}
                                            className="w-full flex items-center justify-between"
                                        >
                                            <div className="flex items-center gap-3">
                                                <div className={`p-2 rounded-lg ${isScamAlert ? 'bg-rose-500/20' : 'bg-gray-500/20'}`}>
                                                    <AlertTriangle className={`w-5 h-5 ${isScamAlert ? 'text-rose-500' : 'text-gray-500'}`} />
                                                </div>
                                                <div className="text-left">
                                                    <p className={`font-bold ${headingColor}`}>Scam Alert</p>
                                                    <p className={`text-xs ${subTextColor}`}>Пометить как скам</p>
                                                </div>
                                            </div>
                                            <div className={`w-12 h-6 rounded-full transition-colors ${isScamAlert ? 'bg-rose-500' : 'bg-gray-500/30'} relative`}>
                                                <div className={`absolute top-1 w-4 h-4 rounded-full bg-white transition-all ${isScamAlert ? 'left-7' : 'left-1'}`}></div>
                                            </div>
                                        </button>
                                    </div>

                                    {!editingAlert && (
                                        <button
                                            onClick={handleAddToList}
                                            className="w-full py-4 rounded-2xl bg-white/5 border border-white/10 hover:bg-white/10 text-white font-bold transition-all"
                                        >
                                            <Plus className="w-5 h-5 inline mr-2" />
                                            Добавить в список
                                        </button>
                                    )}

                                    {editingAlert && (
                                        <button
                                            onClick={handleSubmit}
                                            className="w-full py-4 rounded-2xl bg-emerald-500 hover:bg-emerald-600 text-white font-bold transition-all shadow-lg shadow-emerald-500/25"
                                        >
                                            <Save className="w-5 h-5 inline mr-2" />
                                            СОХРАНИТЬ
                                        </button>
                                    )}
                                </div>
                            </div>

                            {/* Alerts List */}
                            {!editingAlert && alertsToAdd.length > 0 && (
                                <div className="mt-8 pt-8 border-t border-white/5">
                                    <div className="flex items-center justify-between mb-4">
                                        <h4 className={`text-lg font-bold ${headingColor}`}>
                                            Подготовленные сигналы ({alertsToAdd.length})
                                        </h4>
                                        <button
                                            onClick={() => setAlertsToAdd([])}
                                            className="text-xs font-bold text-rose-500 uppercase tracking-widest"
                                        >
                                            Очистить
                                        </button>
                                    </div>
                                    <div className={`rounded-2xl border ${theme === 'dark' ? 'border-white/5 bg-white/5' : 'border-gray-100 bg-gray-50'} overflow-hidden`}>
                                        <table className="w-full text-left text-sm">
                                            <thead>
                                                <tr className={`border-b ${theme === 'dark' ? 'border-white/5' : 'border-gray-200'}`}>
                                                    <th className={`p-4 font-bold ${subTextColor}`}>Время</th>
                                                    <th className={`p-4 font-bold ${subTextColor}`}>Адрес</th>
                                                    <th className={`p-4 font-bold ${subTextColor}`}>MC</th>
                                                    <th className="p-4"></th>
                                                </tr>
                                            </thead>
                                            <tbody className={`divide-y ${theme === 'dark' ? 'divide-white/5' : 'divide-gray-100'}`}>
                                                {alertsToAdd.map((alert, index) => (
                                                    <tr key={index}>
                                                        <td className={`p-4 font-mono ${headingColor}`}>{alert.signalTime}</td>
                                                        <td className={`p-4 font-mono ${subTextColor}`}>{truncateAddress(alert.address || '')}</td>
                                                        <td className={`p-4 font-mono ${headingColor}`}>{alert.marketCap || '-'}</td>
                                                        <td className="p-4 text-right">
                                                            <button
                                                                onClick={() => setAlertsToAdd(prev => prev.filter((_, i) => i !== index))}
                                                                className="text-rose-500 hover:text-rose-400"
                                                            >
                                                                <Trash2 className="w-4 h-4" />
                                                            </button>
                                                        </td>
                                                    </tr>
                                                ))}
                                            </tbody>
                                        </table>
                                    </div>
                                    <button
                                        onClick={handleSaveAll}
                                        className="w-full mt-4 py-4 rounded-2xl bg-emerald-500 hover:bg-emerald-600 text-white font-bold transition-all shadow-xl shadow-emerald-500/25"
                                    >
                                        <Check className="w-5 h-5 inline mr-2" />
                                        СОХРАНИТЬ ВСЁ ({alertsToAdd.length})
                                    </button>
                                </div>
                            )}
                        </div>
                    </div>
                </div>
            )}

            {/* Success Modal */}
            {showSuccess && (
                <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm">
                    <div className={`w-full max-w-sm rounded-3xl ${cardBg} ${cardBorder} border shadow-2xl p-8 flex flex-col items-center text-center`}>
                        <div className="w-16 h-16 rounded-full bg-emerald-500/20 flex items-center justify-center mb-4">
                            <Check className="w-8 h-8 text-emerald-500" />
                        </div>
                        <h3 className={`text-2xl font-bold ${headingColor} mb-2`}>Успешно!</h3>
                        <p className={subTextColor}>{successCount} сигнал добавлен</p>
                    </div>
                </div>
            )}

            {/* Screenshot Preview Modal */}
            {previewImage && (
                <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-sm" onClick={() => setPreviewImage(null)}>
                    <div className="relative max-w-4xl w-full">
                        <button
                            onClick={() => setPreviewImage(null)}
                            className="absolute -top-12 right-0 p-2 text-white/70 hover:text-white"
                        >
                            <X className="w-6 h-6" />
                        </button>
                        <img src={previewImage} alt="Full size" className="w-full h-auto max-h-[80vh] object-contain rounded-xl shadow-2xl" />
                    </div>
                </div>
            )}
        </div>
    )
}
