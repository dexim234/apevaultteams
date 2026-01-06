import React, { useState, useEffect, useMemo } from 'react'
import { useThemeStore } from '@/store/themeStore'
import { useAuthStore } from '@/store/authStore'
import { getAiAlerts, addAiAlert, updateAiAlert, deleteAiAlert } from '@/services/firestoreService'
import { AiAlert } from '@/types'
import { Plus, Edit, Trash2, Save, X, Copy, Check, Terminal, Table, Filter, ArrowUp, ArrowDown, RotateCcw, Calendar, ChevronDown, Hash, Coins, TrendingDown, TrendingUp, Search, Activity, Clock, FileText, Target, AlertTriangle } from 'lucide-react'
import { UserNickname } from '../components/UserNickname'
import { useAdminStore } from '@/store/adminStore'

type SortField = 'date' | 'drop' | 'profit'
type SortOrder = 'asc' | 'desc'

export const AiAoAlerts = () => {
    const { theme } = useThemeStore()
    const { user } = useAuthStore()
    const { isAdmin } = useAdminStore()

    const subTextColor = theme === 'dark' ? 'text-gray-400' : 'text-gray-600'
    const headingColor = theme === 'dark' ? 'text-white' : 'text-gray-900'
    const cardBg = theme === 'dark' ? 'bg-[#10141c]' : 'bg-white'
    const cardBorder = theme === 'dark' ? 'border-indigo-500/30' : 'border-indigo-500/20'
    const cardShadow = theme === 'dark' ? 'shadow-[0_24px_80px_rgba(0,0,0,0.45)]' : 'shadow-[0_24px_80px_rgba(0,0,0,0.15)]'

    const [alerts, setAlerts] = useState<AiAlert[]>([])
    const [loading, setLoading] = useState(true)
    const [showModal, setShowModal] = useState(false)
    const [editingAlert, setEditingAlert] = useState<AiAlert | null>(null)
    const [copyingId, setCopyingId] = useState<string | null>(null)
    const [isCopyingTable, setIsCopyingTable] = useState(false)
    const [showSuccess, setShowSuccess] = useState(false)
    const [successCount, setSuccessCount] = useState(0)

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

    // Form state for single alert
    const [formData, setFormData] = useState<Partial<AiAlert>>({
        signalDate: new Date().toISOString().split('T')[0],
        signalTime: new Date().toLocaleTimeString('ru-RU', { hour: '2-digit', minute: '2-digit' }),
        marketCap: '',
        address: '',
        maxDrop: '',
        maxProfit: '',
        comment: '',
        strategy: 'Market Entry'
    })

    // Common date for all alerts in batch mode
    const [commonDate, setCommonDate] = useState<string>(formData.signalDate || '')

    // List of alerts to add (batch mode)
    const [alertsToAdd, setAlertsToAdd] = useState<Partial<AiAlert>[]>([])

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
            maxProfit: formData.maxProfit,
            comment: formData.comment,
            strategy: formData.strategy
        }

        setAlertsToAdd([...alertsToAdd, newAlert])

        // Reset form fields except date (which is now common)
        setFormData({
            ...formData,
            signalTime: new Date().toLocaleTimeString('ru-RU', { hour: '2-digit', minute: '2-digit' }),
            marketCap: '',
            address: '',
            maxDrop: '',
            maxProfit: '',
            comment: ''
        })
    }

    // Remove alert from list
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
            if (editingAlert) {
                await updateAiAlert(editingAlert.id, { ...formData, signalDate: commonDate } as AiAlert)
            } else {
                await addAiAlert({
                    ...formData as AiAlert,
                    signalDate: commonDate,
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
            await loadAlerts()
        } catch (error: any) {
            console.error('Error saving alert:', error)
        }
    }

    useEffect(() => {
        loadAlerts()
    }, [])

    const loadAlerts = async () => {
        try {
            const data = await getAiAlerts()
            setAlerts(data)
        } catch (error) {
            console.error('Error loading alerts:', error)
        } finally {
            setLoading(false)
        }
    }

    const handleCopy = (text: string, id: string) => {
        navigator.clipboard.writeText(text)
        setCopyingId(id)
        setTimeout(() => setCopyingId(null), 2000)
    }

    const handleCopyTable = () => {
        // Construct HTML for rich copying (Excel compatible)
        const html = `
      <table border="1">
        <thead>
          <tr>
            <th>Дата</th>
            <th>Время</th>
            <th>Market Cap</th>
            <th>Адрес</th>
            <th>Макс. Падение</th>
            <th>Макс. Профит</th>
            <th>Комментарий</th>
          </tr>
        </thead>
        <tbody>
          ${filteredAlerts.map((a: AiAlert) => `
            <tr>
              <td>${formatDateForDisplay(a.signalDate)}</td>
              <td>${a.signalTime}</td>
              <td>${a.marketCap || '-'}</td>
              <td>${a.address}</td>
              <td>${a.maxDrop || '-'}</td>
              <td>${a.maxProfit || '-'}</td>
              <td>${a.comment || ''}</td>
            </tr>
          `).join('')}
        </tbody>
      </table>
    `
        const type = "text/html"
        const blob = new Blob([html], { type })
        const data = [new ClipboardItem({ [type]: blob })]
        navigator.clipboard.write(data)
        setIsCopyingTable(true)
        setTimeout(() => setIsCopyingTable(false), 2000)
    }

    // Format date from YYYY-MM-DD to DD.MM.GG
    const formatDateForDisplay = (dateStr: string) => {
        if (!dateStr) return '-'
        const parts = dateStr.split('-')
        if (parts.length !== 3) return dateStr
        const year = parts[0].slice(-2) // последние 2 цифры года
        return `${parts[2]}.${parts[1]}.${year}`
    }

    // Truncate address for display: 5 chars + ... + 3 chars
    const truncateAddress = (address: string) => {
        if (!address) return '-'
        if (address.length <= 9) return address
        return `${address.slice(0, 5)}...${address.slice(-3)}`
    }

    // Parse numeric value from drop/profit string (e.g., "-16" -> -16, "+28" -> 28, "X3" -> 300)
    const parseValue = (value: string | undefined): number => {
        if (!value) return 0
        // Remove + and % signs, handle X multiplier
        const cleaned = value.replace(/[+%]/g, '').toUpperCase()
        if (cleaned.startsWith('X')) {
            const multiplier = parseFloat(cleaned.slice(1))
            return isNaN(multiplier) ? 0 : multiplier * 100
        }
        const num = parseFloat(cleaned)
        return isNaN(num) ? 0 : num
    }

    // Parse market cap value (e.g., "300K" -> 300000, "1.5M" -> 1500000)
    const parseMarketCap = (value: string | undefined): number => {
        if (!value) return 0
        const cleaned = value.toUpperCase().replace(/[^0-9.]/g, '')
        const num = parseFloat(cleaned)
        if (isNaN(num)) return 0
        if (value.toUpperCase().includes('K')) return num * 1000
        if (value.toUpperCase().includes('M')) return num * 1000000
        if (value.toUpperCase().includes('B')) return num * 1000000000
        return num
    }

    // Filter and sort alerts
    const filteredAlerts = useMemo(() => {
        let result = [...alerts]

        // Filter by specific date
        if (specificDate) {
            result = result.filter(a => a.signalDate === specificDate)
        }

        // Filter by date range
        if (dateFrom) {
            result = result.filter(a => a.signalDate >= dateFrom)
        }
        if (dateTo) {
            result = result.filter(a => a.signalDate <= dateTo)
        }

        // Filter by max drop range
        if (minDrop) {
            const minVal = parseFloat(minDrop)
            if (!isNaN(minVal)) {
                result = result.filter(a => parseValue(a.maxDrop) >= minVal)
            }
        }
        if (maxDrop) {
            const maxVal = parseFloat(maxDrop)
            if (!isNaN(maxVal)) {
                result = result.filter(a => parseValue(a.maxDrop) <= maxVal)
            }
        }

        // Filter by max profit range
        if (minProfit) {
            const minVal = parseFloat(minProfit)
            if (!isNaN(minVal)) {
                result = result.filter(a => parseValue(a.maxProfit) >= minVal)
            }
        }
        if (maxProfit) {
            const maxVal = parseFloat(maxProfit)
            if (!isNaN(maxVal)) {
                result = result.filter(a => parseValue(a.maxProfit) <= maxVal)
            }
        }

        // Filter by market cap range
        if (minMc) {
            const minVal = parseMarketCap(minMc)
            if (!isNaN(minVal) && minVal > 0) {
                result = result.filter(a => parseMarketCap(a.marketCap) >= minVal)
            }
        }
        if (maxMc) {
            const maxVal = parseMarketCap(maxMc)
            if (!isNaN(maxVal) && maxVal > 0) {
                result = result.filter(a => parseMarketCap(a.marketCap) <= maxVal)
            }
        }

        // Sort
        result.sort((a, b) => {
            let comparison = 0
            switch (sortBy) {
                case 'date':
                    comparison = a.signalDate.localeCompare(b.signalDate)
                    if (comparison === 0) {
                        comparison = a.signalTime.localeCompare(b.signalTime)
                    }
                    break
                case 'drop':
                    comparison = parseValue(a.maxDrop) - parseValue(b.maxDrop)
                    break
                case 'profit':
                    comparison = parseValue(a.maxProfit) - parseValue(b.maxProfit)
                    break
            }
            return sortOrder === 'asc' ? comparison : -comparison
        })

        return result
    }, [alerts, specificDate, dateFrom, dateTo, minDrop, maxDrop, minProfit, maxProfit, minMc, maxMc, sortBy, sortOrder])

    // Reset all filters
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
        setSortBy('date')
        setSortOrder('desc')
    }

    // Check if any filter is active
    const hasActiveFilters = useMemo(() => {
        return specificDate || dateFrom || dateTo || minDrop || maxDrop || minProfit || maxProfit || minMc || maxMc || sortBy !== 'date' || sortOrder !== 'desc'
    }, [specificDate, dateFrom, dateTo, minDrop, maxDrop, minProfit, maxProfit, minMc, maxMc, sortBy, sortOrder])

    const handleDelete = async (id: string) => {
        if (!confirm('Удалить алерт?')) return
        try {
            await deleteAiAlert(id)
            await loadAlerts()
        } catch (error) {
            console.error('Error deleting alert:', error)
        }
    }

    const handleEdit = (alert: AiAlert) => {
        setEditingAlert(alert)
        setFormData(alert)
        setCommonDate(alert.signalDate || '')
        setShowModal(true)
    }

    return (
        <>
            <div className="space-y-6">
                {/* Header */}
                <div className={`relative overflow-hidden rounded-3xl border ${cardBorder} ${cardShadow} ${cardBg}`}>
                    <div className="absolute inset-0 pointer-events-none">
                        <div className="absolute -left-16 -bottom-10 w-80 h-80 bg-emerald-500/10 blur-3xl"></div>
                        <div className={`absolute inset-0 ${theme === 'dark' ? 'bg-[radial-gradient(circle_at_50%_0%,rgba(255,255,255,0.05),transparent_45%)]' : 'bg-[radial-gradient(circle_at_50%_0%,rgba(78,110,73,0.05),transparent_45%)]'}`}></div>
                    </div>

                    <div className="relative p-6 sm:p-8 flex flex-col lg:flex-row items-stretch lg:items-center justify-between gap-6">
                        <div className="flex items-center gap-4">
                            <div className={`p-3 rounded-2xl ${theme === 'dark' ? 'bg-white/10 border-white/20' : 'bg-indigo-600/10 border-indigo-600/30'} shadow-inner`}>
                                <Terminal className={`w-8 h-8 ${theme === 'dark' ? 'text-white' : 'text-indigo-600'}`} />
                            </div>
                            <div className="flex flex-col">
                                <h1 className={`text-3xl font-black ${headingColor}`}>AL Agent AO</h1>
                                <p className={`text-sm ${subTextColor}`}>AI - AO Alerts</p>
                            </div>
                        </div>

                        <div className="flex flex-wrap items-center gap-3">
                            <button
                                onClick={handleCopyTable}
                                disabled={filteredAlerts.length === 0}
                                className={`px-4 py-2 rounded-xl text-sm font-semibold transition-all flex items-center gap-2 border ${theme === 'dark' ? 'bg-white/5 border-white/10 hover:bg-white/10 text-gray-300' : 'bg-gray-100 border-gray-200 hover:bg-gray-200 text-gray-700'} disabled:opacity-50`}
                            >
                                {isCopyingTable ? (
                                    <>
                                        <Check className="w-4 h-4 text-green-500" />
                                        <span>Таблица скопирована</span>
                                    </>
                                ) : (
                                    <>
                                        <Table className="w-4 h-4" />
                                        <span>Копировать ({filteredAlerts.length})</span>
                                    </>
                                )}
                            </button>

                            <button
                                onClick={() => setShowFilters(!showFilters)}
                                className={`px-4 py-2 rounded-xl text-sm font-semibold transition-all flex items-center gap-2 border ${showFilters ? 'bg-[#4E6E49] border-[#4E6E49] text-white' : theme === 'dark' ? 'bg-white/5 border-white/10 hover:bg-white/10 text-gray-300' : 'bg-gray-100 border-gray-200 hover:bg-gray-100 text-gray-700'}`}
                            >
                                <Filter className="w-4 h-4" />
                                <span>Фильтры</span>
                            </button>

                            {hasActiveFilters && (
                                <button
                                    onClick={resetFilters}
                                    className={`px-4 py-2 rounded-xl text-sm font-semibold transition-all flex items-center gap-2 border ${theme === 'dark' ? 'bg-white/5 border-white/10 hover:bg-white/10 text-gray-300' : 'bg-gray-100 border-gray-200 hover:bg-gray-100 text-gray-700'}`}
                                >
                                    <RotateCcw className="w-4 h-4" />
                                    <span>Сброс</span>
                                </button>
                            )}

                            <button
                                onClick={() => {
                                    setEditingAlert(null)
                                    setAlertsToAdd([])
                                    setCommonDate(new Date().toISOString().split('T')[0])
                                    setFormData({
                                        signalTime: new Date().toLocaleTimeString('ru-RU', { hour: '2-digit', minute: '2-digit' }),
                                        marketCap: '',
                                        address: '',
                                        maxDrop: '',
                                        maxProfit: '',
                                        comment: ''
                                    })
                                    setShowModal(true)
                                }}
                                className="px-4 py-2 rounded-xl bg-[#4E6E49] hover:bg-[#3d5a39] text-white font-semibold transition-colors flex items-center gap-2 shadow-lg shadow-[#4E6E49]/20"
                            >
                                <Plus className="w-4 h-4" />
                                <span>Добавить сигнал</span>
                            </button>
                        </div>
                    </div>
                </div>

                {/* Filters Panel */}
                {showFilters && (
                    <div className={`rounded-3xl border ${cardBorder} ${cardBg} p-6 pb-4 sm:p-8 space-y-6 shadow-2xl relative overflow-hidden group transition-all duration-500`}>
                        {/* Decorative Background Element */}
                        <div className={`absolute top-0 right-0 -mt-10 -mr-10 w-40 h-40 rounded-full blur-3xl opacity-10 ${theme === 'dark' ? 'bg-white' : 'bg-[#4E6E49]'}`}></div>

                        <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 relative z-10">
                            <div className="flex items-center gap-3">
                                <div className={`p-2 rounded-xl border ${theme === 'dark' ? 'bg-white/5 border-white/10' : 'bg-gray-100 border-gray-200'}`}>
                                    <Filter className={`w-5 h-5 ${theme === 'dark' ? 'text-white' : 'text-gray-900'}`} />
                                </div>
                                <div className="flex flex-col">
                                    <h3 className={`text-lg font-bold tracking-tight ${headingColor}`}>Управление выборкой</h3>
                                    <p className={`text-[10px] font-medium uppercase tracking-widest ${subTextColor} opacity-60`}>Настройка фильтрации и сортировки</p>
                                </div>
                            </div>

                            <div className={`px-4 py-1.5 rounded-full text-[11px] font-bold border flex items-center gap-2 ${theme === 'dark' ? 'bg-white/5 border-white/10 text-gray-400' : 'bg-gray-50 border-gray-200 text-gray-500'}`}>
                                <Activity className="w-3.5 h-3.5" />
                                <span>Адаптивный фильтр</span>
                            </div>
                        </div>

                        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-12 gap-6 relative z-10">
                            {/* Date Group */}
                            <div className="lg:col-span-3 space-y-4">
                                <div className="flex items-center gap-2 px-1">
                                    <Calendar className="w-3.5 h-3.5 text-blue-500" />
                                    <span className={`text-[11px] font-bold uppercase tracking-wider ${subTextColor}`}>Временные рамки</span>
                                </div>
                                <div className="space-y-3">
                                    <PremiumInput
                                        icon={Search}
                                        type="date"
                                        label="Конкретный день"
                                        value={specificDate}
                                        onChange={(e) => setSpecificDate(e.target.value)}
                                        theme={theme}
                                    />
                                    <div className="grid grid-cols-2 gap-3">
                                        <PremiumInput
                                            type="date"
                                            label="От"
                                            value={dateFrom}
                                            onChange={(e) => setDateFrom(e.target.value)}
                                            theme={theme}
                                        />
                                        <PremiumInput
                                            type="date"
                                            label="До"
                                            value={dateTo}
                                            onChange={(e) => setDateTo(e.target.value)}
                                            theme={theme}
                                        />
                                    </div>
                                </div>
                            </div>

                            {/* Drop Group */}
                            <div className="lg:col-span-2 space-y-4">
                                <div className="flex items-center gap-2 px-1">
                                    <TrendingDown className="w-3.5 h-3.5 text-rose-500" />
                                    <span className={`text-[11px] font-bold uppercase tracking-wider ${subTextColor}`}>Падение (%)</span>
                                </div>
                                <div className="grid grid-cols-2 gap-3">
                                    <PremiumInput
                                        icon={TrendingDown}
                                        placeholder="Min"
                                        value={minDrop}
                                        onChange={(e) => setMinDrop(e.target.value)}
                                        theme={theme}
                                    />
                                    <PremiumInput
                                        placeholder="Max"
                                        value={maxDrop}
                                        onChange={(e) => setMaxDrop(e.target.value)}
                                        theme={theme}
                                    />
                                </div>
                            </div>

                            {/* Profit Group */}
                            <div className="lg:col-span-2 space-y-4">
                                <div className="flex items-center gap-2 px-1">
                                    <TrendingUp className="w-3.5 h-3.5 text-emerald-500" />
                                    <span className={`text-[11px] font-bold uppercase tracking-wider ${subTextColor}`}>Профит (%)</span>
                                </div>
                                <div className="grid grid-cols-2 gap-3">
                                    <PremiumInput
                                        icon={TrendingUp}
                                        placeholder="Min"
                                        value={minProfit}
                                        onChange={(e) => setMinProfit(e.target.value)}
                                        theme={theme}
                                    />
                                    <PremiumInput
                                        placeholder="Max"
                                        value={maxProfit}
                                        onChange={(e) => setMaxProfit(e.target.value)}
                                        theme={theme}
                                    />
                                </div>
                            </div>

                            {/* Market Cap Group */}
                            <div className="lg:col-span-2 space-y-4">
                                <div className="flex items-center gap-2 px-1">
                                    <Coins className="w-3.5 h-3.5 text-amber-500" />
                                    <span className={`text-[11px] font-bold uppercase tracking-wider ${subTextColor}`}>Капитализация</span>
                                </div>
                                <div className="grid grid-cols-2 gap-3">
                                    <PremiumInput
                                        icon={Coins}
                                        placeholder="Напр: 100K"
                                        value={minMc}
                                        onChange={(e) => setMinMc(e.target.value)}
                                        theme={theme}
                                    />
                                    <PremiumInput
                                        placeholder="Напр: 5M"
                                        value={maxMc}
                                        onChange={(e) => setMaxMc(e.target.value)}
                                        theme={theme}
                                    />
                                </div>
                            </div>

                            {/* Sort Group */}
                            <div className="lg:col-span-3 space-y-4">
                                <div className="flex items-center gap-2 px-1">
                                    <Hash className="w-3.5 h-3.5 text-purple-500" />
                                    <span className={`text-[11px] font-bold uppercase tracking-wider ${subTextColor}`}>Древо сортировки</span>
                                </div>
                                <div className="flex gap-2">
                                    <div className="flex-1">
                                        <PremiumSelect
                                            value={sortBy}
                                            options={[
                                                { value: 'date', label: 'По дате' },
                                                { value: 'drop', label: 'По падению' },
                                                { value: 'profit', label: 'По росту' }
                                            ]}
                                            onChange={(val) => setSortBy(val as SortField)}
                                            theme={theme}
                                        />
                                    </div>
                                    <button
                                        onClick={() => setSortOrder(sortOrder === 'asc' ? 'desc' : 'asc')}
                                        className={`w-12 flex items-center justify-center rounded-xl border transition-all shadow-sm ${theme === 'dark'
                                            ? 'bg-white/5 border-white/10 hover:bg-white/10 text-white active:scale-95'
                                            : 'bg-white border-gray-200 text-gray-900 hover:border-gray-300 active:scale-95'}`}
                                    >
                                        {sortOrder === 'asc' ? <ArrowUp className="w-5 h-5 text-emerald-500" /> : <ArrowDown className="w-5 h-5 text-rose-500" />}
                                    </button>
                                </div>
                            </div>
                        </div>

                        <div className="flex items-center justify-between pt-4 border-t border-white/5 relative z-10">
                            <div className={`flex items-center gap-4 text-xs font-bold ${subTextColor}`}>
                                <div className="flex items-center gap-2">
                                    <div className={`w-1.5 h-1.5 rounded-full ${filteredAlerts.length > 0 ? 'bg-emerald-500 animate-pulse' : 'bg-rose-500'}`}></div>
                                    <span>Сигналов: <span className={headingColor}>{filteredAlerts.length}</span></span>
                                </div>
                                <span className="opacity-30">|</span>
                                <span>Всего в базе: <span className={headingColor}>{alerts.length}</span></span>
                            </div>

                            {hasActiveFilters && (
                                <button
                                    onClick={resetFilters}
                                    className="flex items-center gap-1.5 text-[11px] font-bold text-rose-500 hover:text-rose-400 transition-colors uppercase tracking-widest px-3 py-1.5 rounded-lg hover:bg-rose-500/10 active:scale-95"
                                >
                                    <RotateCcw className="w-3 h-3" />
                                    Очистить фильтры
                                </button>
                            )}
                        </div>
                    </div>
                )}

                {/* Table */}
                <div className={`relative overflow-hidden rounded-3xl border ${cardBorder} ${cardShadow} ${cardBg}`}>
                    <div className="overflow-x-auto">
                        <table className="w-full text-left border-collapse">
                            <thead>
                                <tr className={`border-b ${theme === 'dark' ? 'border-white/10 bg-white/5' : 'border-gray-200 bg-gray-50'}`}>
                                    <th className={`p-4 text-[10px] sm:text-xs uppercase tracking-wider font-semibold ${subTextColor} text-center w-10 border-r ${theme === 'dark' ? 'border-white/10' : 'border-gray-200'} last:border-r-0`}>#</th>
                                    <th className={`p-4 text-xs uppercase tracking-wider font-semibold ${subTextColor} text-center border-r ${theme === 'dark' ? 'border-white/10' : 'border-gray-200'} last:border-r-0`}>Дата</th>
                                    <th className={`p-4 text-xs uppercase tracking-wider font-semibold ${subTextColor} text-center border-r ${theme === 'dark' ? 'border-white/10' : 'border-gray-200'} last:border-r-0`}>Время</th>
                                    <th className={`p-4 text-xs uppercase tracking-wider font-semibold ${subTextColor} text-center border-r ${theme === 'dark' ? 'border-white/10' : 'border-gray-200'} last:border-r-0`}>Market Cap</th>
                                    <th className={`p-4 text-xs uppercase tracking-wider font-semibold ${subTextColor} text-center border-r ${theme === 'dark' ? 'border-white/10' : 'border-gray-200'} last:border-r-0`}>Адрес</th>
                                    <th className={`p-4 text-xs uppercase tracking-wider font-semibold ${subTextColor} text-center border-r ${theme === 'dark' ? 'border-white/10' : 'border-gray-200'} last:border-r-0`}>Макс. Падение</th>
                                    <th className={`p-4 text-xs uppercase tracking-wider font-semibold ${subTextColor} text-center border-r ${theme === 'dark' ? 'border-white/10' : 'border-gray-200'} last:border-r-0`}>Макс. Профит</th>
                                    <th className={`p-4 text-xs uppercase tracking-wider font-semibold ${subTextColor} text-center border-r ${theme === 'dark' ? 'border-white/10' : 'border-gray-200'} last:border-r-0`}>Комментарий</th>
                                    <th className={`p-4 text-xs uppercase tracking-wider font-semibold ${subTextColor} text-center border-r ${theme === 'dark' ? 'border-white/10' : 'border-gray-200'} last:border-r-0`}>Автор</th>
                                    <th className={`p-4 text-xs uppercase tracking-wider font-semibold ${subTextColor} text-center last:border-r-0`}>Действия</th>
                                </tr>
                            </thead>
                            <tbody className={`divide-y ${theme === 'dark' ? 'divide-white/5' : 'divide-gray-100'}`}>
                                {loading ? (
                                    <tr>
                                        <td colSpan={10} className="p-8 text-center text-gray-500">Загрузка...</td>
                                    </tr>
                                ) : filteredAlerts.length === 0 ? (
                                    <tr>
                                        <td colSpan={10} className="p-8 text-center text-gray-500">
                                            {hasActiveFilters ? 'Нет сигналов по выбранным фильтрам' : 'Нет сигналов'}
                                        </td>
                                    </tr>
                                ) : sortBy === 'date' ? (
                                    // Group by date when sorting by date
                                    (() => {
                                        const groupedAlerts: { [key: string]: AiAlert[] } = {}
                                        filteredAlerts.forEach((alert: AiAlert) => {
                                            const dateKey = alert.signalDate
                                            if (!groupedAlerts[dateKey]) {
                                                groupedAlerts[dateKey] = []
                                            }
                                            groupedAlerts[dateKey].push(alert)
                                        })

                                        const dates = Object.keys(groupedAlerts).sort().reverse()
                                        const rows: React.ReactNode[] = []

                                        dates.forEach((dateKey, dateIndex) => {
                                            const dateAlerts = groupedAlerts[dateKey]

                                            // Add date separator row (except for first group)
                                            if (dateIndex > 0) {
                                                rows.push(
                                                    <tr key={`separator-${dateKey}`}>
                                                        <td colSpan={10} className="py-2">
                                                            <div className={`h-px ${theme === 'dark' ? 'bg-white/10' : 'bg-gray-200'}`}></div>
                                                        </td>
                                                    </tr>
                                                )
                                            }

                                            // Add date header row
                                            rows.push(
                                                <tr key={`header-${dateKey}`} className={`${theme === 'dark' ? 'bg-white/5' : 'bg-gray-50'}`}>
                                                    <td colSpan={10} className="p-3 px-4">
                                                        <span className={`text-sm font-semibold ${subTextColor}`}>
                                                            {formatDateForDisplay(dateKey)}
                                                        </span>
                                                    </td>
                                                </tr>
                                            )

                                            // Add alert rows
                                            dateAlerts.forEach((alert: AiAlert) => {
                                                const globalIndex = filteredAlerts.indexOf(alert) + 1;
                                                rows.push(
                                                    <tr key={alert.id} className={`${theme === 'dark' ? 'hover:bg-white/5' : 'hover:bg-gray-50'} transition-colors`}>
                                                        <td className={`p-4 text-center whitespace-nowrap border-r ${theme === 'dark' ? 'border-white/10' : 'border-gray-200'} last:border-r-0`}>
                                                            <div className={`font-mono text-[10px] sm:text-xs font-bold ${subTextColor}`}>{globalIndex}</div>
                                                        </td>
                                                        <td className={`p-4 whitespace-nowrap text-center border-r ${theme === 'dark' ? 'border-white/10' : 'border-gray-200'} last:border-r-0`}>
                                                            <div className={`font-mono font-medium ${headingColor}`}>{formatDateForDisplay(alert.signalDate)}</div>
                                                        </td>
                                                        <td className={`p-4 whitespace-nowrap text-center border-r ${theme === 'dark' ? 'border-white/10' : 'border-gray-200'} last:border-r-0`}>
                                                            <div className={`font-mono ${headingColor}`}>{alert.signalTime}</div>
                                                        </td>
                                                        <td className={`p-4 whitespace-nowrap text-center border-r ${theme === 'dark' ? 'border-white/10' : 'border-gray-200'} last:border-r-0`}>
                                                            <div className={`font-mono ${headingColor}`}>{alert.marketCap || '-'}</div>
                                                        </td>
                                                        <td className={`p-4 text-center border-r ${theme === 'dark' ? 'border-white/10' : 'border-gray-200'} last:border-r-0`}>
                                                            <div className="flex items-center justify-center gap-2">
                                                                <a
                                                                    href={`https://gmgn.ai/sol/token/${alert.address}`}
                                                                    target="_blank"
                                                                    rel="noopener noreferrer"
                                                                    className={`font-mono text-sm ${theme === 'dark' ? 'text-blue-400 hover:text-blue-300' : 'text-blue-600 hover:text-blue-500'} cursor-pointer`}
                                                                    title={alert.address}
                                                                >
                                                                    {truncateAddress(alert.address)}
                                                                </a>
                                                                <button
                                                                    onClick={() => handleCopy(alert.address, alert.id)}
                                                                    className={`p-1.5 rounded-lg hover:bg-white/10 transition-colors ${subTextColor}`}
                                                                >
                                                                    {copyingId === alert.id ? <Check className="w-3 h-3 text-green-500" /> : <Copy className="w-3 h-3" />}
                                                                </button>
                                                            </div>
                                                        </td>
                                                        <td className={`p-4 whitespace-nowrap text-center border-r ${theme === 'dark' ? 'border-white/10' : 'border-gray-200'} last:border-r-0`}>
                                                            <span className={`font-mono ${alert.maxDrop && alert.maxDrop.startsWith('-') ? 'text-red-500' : headingColor}`}>
                                                                {alert.maxDrop || '-'}
                                                            </span>
                                                        </td>
                                                        <td className={`p-4 whitespace-nowrap text-center border-r ${theme === 'dark' ? 'border-white/10' : 'border-gray-200'} last:border-r-0`}>
                                                            <span className="font-mono text-green-500 font-bold">
                                                                {alert.maxProfit || '-'}
                                                            </span>
                                                        </td>
                                                        <td className={`p-4 max-w-[250px] text-center border-r ${theme === 'dark' ? 'border-white/10' : 'border-gray-200'} last:border-r-0`}>
                                                            <div className={`text-sm ${headingColor} break-words whitespace-pre-wrap`}>
                                                                {alert.comment || '-'}
                                                            </div>
                                                        </td>
                                                        <td className={`p-4 whitespace-nowrap text-center border-r ${theme === 'dark' ? 'border-white/10' : 'border-gray-200'} last:border-r-0`}>
                                                            <UserNickname userId={alert.createdBy} className="text-[10px] sm:text-xs font-medium" />
                                                        </td>
                                                        <td className={`p-4 whitespace-nowrap text-center last:border-r-0`}>
                                                            <div className="flex items-center justify-center gap-1">
                                                                {(isAdmin || user?.id === alert.createdBy) && (
                                                                    <button
                                                                        onClick={() => handleEdit(alert)}
                                                                        className={`p-2 rounded-lg hover:bg-white/10 transition-colors ${theme === 'dark' ? 'text-blue-400' : 'text-blue-600'}`}
                                                                    >
                                                                        <Edit className="w-4 h-4" />
                                                                    </button>
                                                                )}
                                                                {isAdmin && (
                                                                    <button
                                                                        onClick={() => handleDelete(alert.id)}
                                                                        className="p-2 rounded-lg hover:bg-red-500/10 text-red-500 transition-colors"
                                                                    >
                                                                        <Trash2 className="w-4 h-4" />
                                                                    </button>
                                                                )}
                                                            </div>
                                                        </td>
                                                    </tr>
                                                )
                                            })
                                        })

                                        return rows
                                    })()
                                ) : (
                                    // Simple list when sorting by drop or profit
                                    filteredAlerts.map((alert: AiAlert, index: number) => (
                                        <tr key={alert.id} className={`${theme === 'dark' ? 'hover:bg-white/5' : 'hover:bg-gray-50'} transition-colors`}>
                                            <td className={`p-4 text-center whitespace-nowrap border-r ${theme === 'dark' ? 'border-white/10' : 'border-gray-200'} last:border-r-0`}>
                                                <div className={`font-mono text-[10px] sm:text-xs font-bold ${subTextColor}`}>{index + 1}</div>
                                            </td>
                                            <td className={`p-4 whitespace-nowrap text-center border-r ${theme === 'dark' ? 'border-white/10' : 'border-gray-200'} last:border-r-0`}>
                                                <div className={`font-mono font-medium ${headingColor}`}>{formatDateForDisplay(alert.signalDate)}</div>
                                            </td>
                                            <td className={`p-4 whitespace-nowrap text-center border-r ${theme === 'dark' ? 'border-white/10' : 'border-gray-200'} last:border-r-0`}>
                                                <div className={`font-mono ${headingColor}`}>{alert.signalTime}</div>
                                            </td>
                                            <td className={`p-4 whitespace-nowrap text-center border-r ${theme === 'dark' ? 'border-white/10' : 'border-gray-200'} last:border-r-0`}>
                                                <div className={`font-mono ${headingColor}`}>{alert.marketCap || '-'}</div>
                                            </td>
                                            <td className={`p-4 text-center border-r ${theme === 'dark' ? 'border-white/10' : 'border-gray-200'} last:border-r-0`}>
                                                <div className="flex items-center justify-center gap-2">
                                                    <a
                                                        href={`https://gmgn.ai/sol/token/${alert.address}`}
                                                        target="_blank"
                                                        rel="noopener noreferrer"
                                                        className={`font-mono text-sm ${theme === 'dark' ? 'text-blue-400 hover:text-blue-300' : 'text-blue-600 hover:text-blue-500'} cursor-pointer`}
                                                        title={alert.address}
                                                    >
                                                        {truncateAddress(alert.address)}
                                                    </a>
                                                    <button
                                                        onClick={() => handleCopy(alert.address, alert.id)}
                                                        className={`p-1.5 rounded-lg hover:bg-white/10 transition-colors ${subTextColor}`}
                                                    >
                                                        {copyingId === alert.id ? <Check className="w-3 h-3 text-green-500" /> : <Copy className="w-3 h-3" />}
                                                    </button>
                                                </div>
                                            </td>
                                            <td className={`p-4 whitespace-nowrap text-center border-r ${theme === 'dark' ? 'border-white/10' : 'border-gray-200'} last:border-r-0`}>
                                                <span className={`font-mono ${alert.maxDrop && alert.maxDrop.startsWith('-') ? 'text-red-500' : headingColor}`}>
                                                    {alert.maxDrop || '-'}
                                                </span>
                                            </td>
                                            <td className={`p-4 whitespace-nowrap text-center border-r ${theme === 'dark' ? 'border-white/10' : 'border-gray-200'} last:border-r-0`}>
                                                <span className="font-mono text-green-500 font-bold">
                                                    {alert.maxProfit || '-'}
                                                </span>
                                            </td>
                                            <td className={`p-4 max-w-[250px] text-center border-r ${theme === 'dark' ? 'border-white/10' : 'border-gray-200'} last:border-r-0`}>
                                                <div className={`text-sm ${headingColor} break-words whitespace-pre-wrap`}>
                                                    {alert.comment || ''}
                                                </div>
                                            </td>
                                            <td className={`p-4 whitespace-nowrap text-center border-r ${theme === 'dark' ? 'border-white/10' : 'border-gray-200'} last:border-r-0`}>
                                                <UserNickname userId={alert.createdBy} className="text-[10px] sm:text-xs font-medium" />
                                            </td>
                                            <td className={`p-4 whitespace-nowrap text-center last:border-r-0`}>
                                                <div className="flex items-center justify-center gap-1">
                                                    {(isAdmin || user?.id === alert.createdBy) && (
                                                        <button
                                                            onClick={() => handleEdit(alert)}
                                                            className={`p-2 rounded-lg hover:bg-white/10 transition-colors ${theme === 'dark' ? 'text-blue-400' : 'text-blue-600'}`}
                                                        >
                                                            <Edit className="w-4 h-4" />
                                                        </button>
                                                    )}
                                                    {isAdmin && (
                                                        <button
                                                            onClick={() => handleDelete(alert.id)}
                                                            className="p-2 rounded-lg hover:bg-red-500/10 text-red-500 transition-colors"
                                                        >
                                                            <Trash2 className="w-4 h-4" />
                                                        </button>
                                                    )}
                                                </div>
                                            </td>
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
                        {/* Header */}
                        <div className={`p-6 border-b ${theme === 'dark' ? 'border-white/10' : 'border-gray-100'} flex items-center justify-between flex-shrink-0 relative z-10`}>
                            <div className="flex items-center gap-4">
                                <div className={`p-3 rounded-2xl ${theme === 'dark' ? 'bg-indigo-500/10' : 'bg-indigo-50'}`}>
                                    <Activity className="w-6 h-6 text-indigo-500" />
                                </div>
                                <div>
                                    <h3 className={`text-xl font-bold ${headingColor}`}>
                                        {editingAlert ? 'Редактировать сигнал' : 'Добавить новые сигналы'}
                                    </h3>
                                    <p className={`text-sm ${subTextColor}`}>
                                        {editingAlert ? 'Изменение параметров существующего сигнала' : 'Заполнение данных для одного или нескольких сигналов'}
                                    </p>
                                </div>
                            </div>
                            <button
                                onClick={() => {
                                    setShowModal(false)
                                    setEditingAlert(null)
                                    setAlertsToAdd([])
                                }}
                                className={`p-2 rounded-xl hover:bg-white/10 transition-colors ${subTextColor}`}
                            >
                                <X className="w-6 h-6" />
                            </button>
                        </div>

                        <div className="flex-1 overflow-y-auto p-6 lg:p-8 relative z-10">
                            <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 lg:gap-12">
                                {/* Left Column: Signal Info */}
                                <div className="space-y-6">
                                    <div className="flex items-center gap-2 mb-2">
                                        <div className="w-1.5 h-1.5 rounded-full bg-indigo-500"></div>
                                        <span className={`text-xs font-bold uppercase tracking-widest ${subTextColor} opacity-60`}>Параметры сигнала</span>
                                    </div>

                                    <div className="grid grid-cols-2 gap-4">
                                        <div className="space-y-1.5">
                                            <label className={`text-[10px] font-bold uppercase tracking-wider ml-1 ${subTextColor}`}>Дата</label>
                                            <div className="relative">
                                                <Calendar className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-500" />
                                                <input
                                                    type="date"
                                                    value={editingAlert ? formData.signalDate : commonDate}
                                                    onChange={(e) => {
                                                        if (editingAlert) {
                                                            setFormData({ ...formData, signalDate: e.target.value })
                                                        } else {
                                                            setCommonDate(e.target.value)
                                                        }
                                                    }}
                                                    className={`w-full pl-10 pr-4 py-3 rounded-xl border outline-none transition-all text-sm font-semibold ${theme === 'dark' ? 'bg-black/20 border-white/5 text-white focus:border-indigo-500/50 focus:ring-4 focus:ring-indigo-500/5' : 'bg-gray-50 border-gray-100 text-gray-900 focus:border-indigo-500/30'}`}
                                                />
                                            </div>
                                        </div>
                                        <div className="space-y-1.5">
                                            <label className={`text-[10px] font-bold uppercase tracking-wider ml-1 ${subTextColor}`}>Время</label>
                                            <div className="relative">
                                                <Clock className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-500" />
                                                <input
                                                    type="time"
                                                    value={formData.signalTime}
                                                    onChange={(e) => setFormData({ ...formData, signalTime: e.target.value })}
                                                    className={`w-full pl-10 pr-4 py-3 rounded-xl border outline-none transition-all text-sm font-semibold ${theme === 'dark' ? 'bg-black/20 border-white/5 text-white focus:border-indigo-500/50 focus:ring-4 focus:ring-indigo-500/5' : 'bg-gray-50 border-gray-100 text-gray-900 focus:border-indigo-500/30'}`}
                                                />
                                            </div>
                                        </div>
                                    </div>

                                    <div className="space-y-1.5">
                                        <label className={`text-[10px] font-bold uppercase tracking-wider ml-1 ${subTextColor}`}>Market Cap</label>
                                        <div className="relative">
                                            <Activity className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-500" />
                                            <input
                                                type="text"
                                                placeholder="Напр: 300K или 1.5M"
                                                value={formData.marketCap}
                                                onChange={(e) => setFormData({ ...formData, marketCap: e.target.value })}
                                                className={`w-full pl-10 pr-4 py-3 rounded-xl border outline-none transition-all text-sm font-semibold ${theme === 'dark' ? 'bg-black/20 border-white/5 text-white focus:border-indigo-500/50 focus:ring-4 focus:ring-indigo-500/5' : 'bg-gray-50 border-gray-100 text-gray-900 focus:border-indigo-500/30'}`}
                                            />
                                        </div>
                                    </div>

                                    <div className="grid grid-cols-2 gap-4">
                                        <div className="space-y-1.5">
                                            <label className={`text-[10px] font-bold uppercase tracking-wider ml-1 ${subTextColor}`}>Max Drop</label>
                                            <div className="relative">
                                                <TrendingDown className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-rose-500/50" />
                                                <input
                                                    type="text"
                                                    placeholder="-16%"
                                                    value={formData.maxDrop}
                                                    onChange={(e) => setFormData({ ...formData, maxDrop: e.target.value })}
                                                    className={`w-full pl-10 pr-4 py-3 rounded-xl border outline-none transition-all text-sm font-semibold ${theme === 'dark' ? 'bg-black/20 border-white/5 text-white focus:border-rose-500/30 focus:ring-4 focus:ring-rose-500/5' : 'bg-gray-50 border-gray-100 text-gray-900 focus:border-rose-500/20'}`}
                                                />
                                            </div>
                                        </div>
                                        <div className="space-y-1.5">
                                            <label className={`text-[10px] font-bold uppercase tracking-wider ml-1 ${subTextColor}`}>Max Profit</label>
                                            <div className="relative">
                                                <TrendingUp className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-emerald-500/50" />
                                                <input
                                                    type="text"
                                                    placeholder="+28% / X2"
                                                    value={formData.maxProfit}
                                                    onChange={(e) => setFormData({ ...formData, maxProfit: e.target.value })}
                                                    className={`w-full pl-10 pr-4 py-3 rounded-xl border outline-none transition-all text-sm font-semibold ${theme === 'dark' ? 'bg-black/20 border-white/5 text-white focus:border-emerald-500/30 focus:ring-4 focus:ring-emerald-500/5' : 'bg-gray-50 border-gray-100 text-gray-900 focus:border-emerald-500/20'}`}
                                                />
                                            </div>
                                        </div>
                                    </div>

                                    <div className="space-y-1.5">
                                        <label className={`text-[10px] font-bold uppercase tracking-wider ml-1 ${subTextColor}`}>Комментарий</label>
                                        <div className="relative">
                                            <FileText className="absolute left-3 top-3 w-4 h-4 text-gray-500" />
                                            <textarea
                                                rows={4}
                                                placeholder="Дополнительная информация о сигналу..."
                                                value={formData.comment}
                                                onChange={(e) => setFormData({ ...formData, comment: e.target.value })}
                                                className={`w-full pl-10 pr-4 py-3 rounded-2xl border outline-none transition-all text-sm font-semibold resize-none ${theme === 'dark' ? 'bg-black/20 border-white/5 text-white focus:border-indigo-500/50' : 'bg-gray-50 border-gray-100 text-gray-900 focus:border-indigo-500/30'}`}
                                            ></textarea>
                                        </div>
                                    </div>

                                    <button
                                        type="button"
                                        onClick={() => setFormData({ ...formData, isScam: !formData.isScam })}
                                        className={`w-full p-4 rounded-2xl border-2 border-dashed flex items-center gap-4 transition-all ${formData.isScam ? 'bg-red-500/10 border-red-500/50 text-red-500' : 'bg-black/10 border-white/5 text-gray-500 hover:border-white/10'}`}
                                    >
                                        <div className={`w-10 h-10 rounded-xl flex items-center justify-center ${formData.isScam ? 'bg-red-500 text-white' : 'bg-white/5'}`}>
                                            <AlertTriangle size={20} />
                                        </div>
                                        <div className="text-left">
                                            <h4 className="text-sm font-bold">SCAM ALERT</h4>
                                            <p className="text-[10px] opacity-70">Пометить этот сигнал как скам/мошенничество</p>
                                        </div>
                                    </button>
                                </div>

                                {/* Right Column: Strategy & Address */}
                                <div className="space-y-6">
                                    <div className="flex items-center gap-2 mb-2">
                                        <div className="w-1.5 h-1.5 rounded-full bg-indigo-500"></div>
                                        <span className={`text-xs font-bold uppercase tracking-widest ${subTextColor} opacity-60`}>Стратегия и адрес</span>
                                    </div>

                                    <div className="space-y-3">
                                        <label className={`text-[10px] font-bold uppercase tracking-wider ml-1 ${subTextColor}`}>Выбор стратегии</label>
                                        <div className="grid grid-cols-2 gap-3">
                                            {(['Фиба', 'Market Entry'] as AiAlert['strategy'][]).map((strat) => (
                                                <button
                                                    key={strat}
                                                    type="button"
                                                    onClick={() => setFormData({ ...formData, strategy: strat })}
                                                    className={`flex items-center justify-between p-3 rounded-xl border transition-all ${formData.strategy === strat
                                                        ? 'border-indigo-500 bg-indigo-500/10 text-indigo-500'
                                                        : theme === 'dark'
                                                            ? 'border-white/5 bg-white/5 text-gray-400 hover:border-white/10 hover:bg-white/10'
                                                            : 'border-gray-100 bg-gray-50 text-gray-500 hover:border-gray-200'
                                                        }`}
                                                >
                                                    <span className="text-sm font-bold">{strat}</span>
                                                    <div className={`w-4 h-4 rounded-full border-2 flex items-center justify-center ${formData.strategy === strat ? 'border-indigo-500 bg-indigo-500' : 'border-gray-500/30'}`}>
                                                        {formData.strategy === strat && <Check className="w-2.5 h-2.5 text-white stroke-[4]" />}
                                                    </div>
                                                </button>
                                            ))}
                                        </div>
                                    </div>

                                    <div className="space-y-1.5">
                                        <label className={`text-[10px] font-bold uppercase tracking-wider ml-1 ${subTextColor}`}>Contract Address</label>
                                        <div className="relative">
                                            <Target className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-500" />
                                            <input
                                                type="text"
                                                placeholder="Введите адрес контракта..."
                                                value={formData.address}
                                                onChange={(e) => setFormData({ ...formData, address: e.target.value })}
                                                className={`w-full pl-10 pr-4 py-3 rounded-xl border outline-none transition-all text-sm font-mono ${theme === 'dark' ? 'bg-black/20 border-white/5 text-white focus:border-indigo-500/50' : 'bg-gray-50 border-gray-100 text-gray-900 focus:border-indigo-500/30'}`}
                                            />
                                        </div>
                                    </div>
                                </div>
                            </div>

                            {/* Footer: Multi-Add Buttons */}
                            {!editingAlert && (
                                <div className="mt-8 pt-6 border-t border-white/5 flex flex-col sm:flex-row items-center gap-4">
                                    <button onClick={handleAddToList} className="flex-1 w-full py-4 rounded-2xl bg-white/5 border border-white/10 hover:bg-white/10 text-white font-bold flex items-center justify-center gap-2 transition-all">
                                        <Plus className="w-5 h-5" />
                                        Добавить в список
                                    </button>
                                    {alertsToAdd.length > 0 && (
                                        <button onClick={handleSaveAll} className="flex-1 w-full py-4 rounded-2xl bg-indigo-500 hover:bg-indigo-600 text-white font-black flex items-center justify-center gap-2 transition-all shadow-lg shadow-indigo-500/20">
                                            <Save className="w-5 h-5" />
                                            СОХРАНИТЬ ВСЁ ({alertsToAdd.length})
                                        </button>
                                    )}
                                </div>
                            )}

                            {editingAlert && (
                                <div className="mt-8 pt-6 border-t border-white/5">
                                    <button onClick={handleSubmit} className="w-full py-4 rounded-2xl bg-indigo-500 hover:bg-indigo-600 text-white font-black flex items-center justify-center gap-2 transition-all shadow-lg shadow-indigo-500/20">
                                        <Save className="w-5 h-5" />
                                        СОХРАНИТЬ ИЗМЕНЕНИЯ
                                    </button>
                                </div>
                            )}

                            {!editingAlert && alertsToAdd.length > 0 && (
                                <div className="mt-12 space-y-4 pt-8 border-t border-white/5">
                                    <div className="flex items-center justify-between">
                                        <div className="flex items-center gap-3">
                                            <div className="w-10 h-10 rounded-xl bg-indigo-500/10 flex items-center justify-center">
                                                <Table className="w-5 h-5 text-indigo-500" />
                                            </div>
                                            <h4 className={`text-lg font-bold ${headingColor}`}>
                                                Подготовленные сигналы ({alertsToAdd.length})
                                            </h4>
                                        </div>
                                        <button
                                            onClick={() => setAlertsToAdd([])}
                                            className={`text-xs font-bold uppercase tracking-widest text-rose-500 hover:text-rose-400 transition-colors p-2`}
                                        >
                                            Очистить всё
                                        </button>
                                    </div>

                                    <div className={`rounded-2xl border ${theme === 'dark' ? 'border-white/5 bg-white/5' : 'border-gray-100 bg-gray-50'} overflow-hidden`}>
                                        <table className="w-full text-left text-sm">
                                            <thead>
                                                <tr className={`border-b ${theme === 'dark' ? 'border-white/5' : 'border-gray-200'}`}>
                                                    <th className={`p-4 font-bold ${subTextColor}`}>Время</th>
                                                    <th className={`p-4 font-bold ${subTextColor}`}>Адрес</th>
                                                    <th className={`p-4 font-bold ${subTextColor}`}>MC</th>
                                                    <th className={`p-4 font-bold ${subTextColor}`}>Strategy</th>
                                                    <th className="p-4"></th>
                                                </tr>
                                            </thead>
                                            <tbody className={`divide-y ${theme === 'dark' ? 'divide-white/5' : 'divide-gray-100'}`}>
                                                {alertsToAdd.map((alert, index) => (
                                                    <tr key={index} className="hover:bg-white/5 transition-colors">
                                                        <td className={`p-4 font-mono font-bold ${headingColor}`}>{alert.signalTime}</td>
                                                        <td className={`p-4 font-mono ${subTextColor}`}>{truncateAddress(alert.address || '')}</td>
                                                        <td className={`p-4 font-mono ${headingColor}`}>{alert.marketCap || '-'}</td>
                                                        <td className="p-4">
                                                            <span className="px-2 py-1 rounded-lg bg-indigo-500/10 text-indigo-500 text-[10px] font-bold uppercase">
                                                                {alert.strategy || 'ME'}
                                                            </span>
                                                        </td>
                                                        <td className="p-4 text-right">
                                                            <button
                                                                onClick={() => setAlertsToAdd(prev => prev.filter((_, i) => i !== index))}
                                                                className="p-2 rounded-lg hover:bg-rose-500/10 text-rose-500 transition-colors"
                                                            >
                                                                <Trash2 className="w-4 h-4" />
                                                            </button>
                                                        </td>
                                                    </tr>
                                                ))}
                                            </tbody>
                                        </table>
                                    </div>
                                </div>
                            )}
                        </div>
                    </div>
                </div>
            )}

            {/* Success Modal */}
            {showSuccess && (
                <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm animate-in fade-in duration-200">
                    <div className={`w-full max-w-sm rounded-3xl ${cardBg} ${cardBorder} border shadow-2xl p-8 flex flex-col items-center text-center animate-in zoom-in-95 duration-300`}>
                        <div className="w-16 h-16 rounded-full bg-indigo-500/20 flex items-center justify-center mb-4">
                            <Check className="w-8 h-8 text-indigo-500" />
                        </div>
                        <h3 className={`text-2xl font-bold ${headingColor} mb-2`}>
                            Успешно!
                        </h3>
                        <p className={`${subTextColor}`}>
                            {successCount} сигнал{successCount === 1 ? '' : successCount >= 2 && successCount <= 4 ? 'а' : 'ов'} добавлен{successCount === 1 ? '' : 'о'}
                        </p>
                        <div className={`mt-6 px-4 py-2 rounded-full ${theme === 'dark' ? 'bg-white/5' : 'bg-indigo-50'}`}>
                            <span className="text-sm font-bold text-indigo-500">
                                AI Agent AO
                            </span>
                        </div>
                    </div>
                </div>
            )}
        </>
    )
}

// --- Premium Helper Components ---

const PremiumInput: React.FC<{
    icon?: any;
    label?: string;
    placeholder?: string;
    value: string;
    onChange: (e: React.ChangeEvent<HTMLInputElement>) => void;
    type?: string;
    theme: string;
}> = ({ icon: Icon, label, placeholder, value, onChange, type = "text", theme }) => {
    return (
        <div className="space-y-1.5 group/input">
            {label && (
                <label className={`text-[10px] font-bold uppercase tracking-wider ml-1 opacity-50 ${theme === 'dark' ? 'text-gray-400' : 'text-gray-600'}`}>
                    {label}
                </label>
            )}
            <div className="relative">
                {Icon && (
                    <div className="absolute left-3 top-1/2 -translate-y-1/2 flex items-center pointer-events-none transition-transform group-focus-within/input:scale-110">
                        <Icon size={14} className={theme === 'dark' ? 'text-gray-500' : 'text-gray-400'} />
                    </div>
                )}
                <input
                    type={type}
                    value={value}
                    onChange={onChange}
                    placeholder={placeholder}
                    className={`w-full px-4 py-2.5 ${Icon ? 'pl-10' : ''} rounded-xl border text-sm font-semibold transition-all outline-none shadow-sm
                        ${theme === 'dark'
                            ? 'bg-white/5 border-white/5 text-white placeholder:text-gray-600 focus:bg-white/10 focus:border-indigo-500/30 focus:ring-4 focus:ring-indigo-500/5'
                            : 'bg-white border-gray-200 text-gray-900 placeholder:text-gray-400 focus:border-indigo-500/30 focus:ring-4 focus:ring-indigo-500/5 hover:border-gray-300'}`}
                />
            </div>
        </div>
    );
};

const PremiumSelect: React.FC<{
    value: string;
    options: { value: string; label: string }[];
    onChange: (val: string) => void;
    theme: string;
}> = ({ value, options, onChange, theme }) => {
    const [isOpen, setIsOpen] = useState(false);
    const containerRef = React.useRef<HTMLDivElement>(null);
    const selectedOption = options.find(o => o.value === value);

    useEffect(() => {
        const handleClickOutside = (event: MouseEvent) => {
            if (containerRef.current && !containerRef.current.contains(event.target as Node)) {
                setIsOpen(false);
            }
        };
        document.addEventListener('mousedown', handleClickOutside);
        return () => document.removeEventListener('mousedown', handleClickOutside);
    }, []);

    return (
        <div className="relative" ref={containerRef}>
            <div className="flex flex-col space-y-1.5">
                <label className={`text-[10px] font-bold uppercase tracking-wider ml-1 opacity-50 ${theme === 'dark' ? 'text-gray-400' : 'text-gray-600'}`}>
                    Поля данных
                </label>
                <button
                    type="button"
                    onClick={() => setIsOpen(!isOpen)}
                    className={`w-full flex items-center justify-between px-4 py-2.5 rounded-xl border text-sm font-bold transition-all shadow-sm
                        ${theme === 'dark'
                            ? 'bg-white/5 border-white/5 text-white hover:bg-white/10 hover:border-white/10 active:scale-95'
                            : 'bg-white border-gray-200 text-gray-900 hover:bg-gray-50 active:scale-95'}`}
                >
                    <span className="truncate">{selectedOption?.label}</span>
                    <ChevronDown size={14} className={`text-gray-500 transition-transform duration-300 ${isOpen ? 'rotate-180' : ''}`} />
                </button>
            </div>

            {isOpen && (
                <div className={`absolute z-50 bottom-full mb-2 w-full min-w-[160px] rounded-xl border shadow-2xl overflow-hidden animate-in fade-in slide-in-from-bottom-2 duration-200 
                    ${theme === 'dark' ? 'bg-[#151a21] border-white/10' : 'bg-white border-gray-200'}`}>
                    <div className="p-1 space-y-1">
                        {options.map(opt => (
                            <button
                                key={opt.value}
                                type="button"
                                onClick={() => {
                                    onChange(opt.value);
                                    setIsOpen(false);
                                }}
                                className={`w-full flex items-center px-4 py-2.5 rounded-lg text-xs font-bold transition-all text-left
                                    ${opt.value === value
                                        ? theme === 'dark' ? 'bg-indigo-500/10 text-white' : 'bg-indigo-500/10 text-indigo-600'
                                        : theme === 'dark' ? 'text-gray-400 hover:bg-white/5 hover:text-white' : 'text-gray-600 hover:bg-gray-50 hover:text-gray-900'
                                    }`}
                            >
                                {opt.label}
                                {opt.value === value && <Check size={12} className="ml-auto" />}
                            </button>
                        ))}
                    </div>
                </div>
            )}
        </div>
    );
};
