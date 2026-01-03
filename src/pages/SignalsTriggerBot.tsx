import React, { useState, useEffect, useMemo } from 'react'
import { useThemeStore } from '@/store/themeStore'
import { useAuthStore } from '@/store/authStore'
import { getTriggerAlerts, addTriggerAlert, updateTriggerAlert, deleteTriggerAlert } from '@/services/firestoreService'
import { TriggerAlert, TriggerStrategy } from '@/types'
import { Plus, Edit, Trash2, Save, X, Copy, Check, Zap, Table, Filter, ArrowUp, ArrowDown, RotateCcw, ChevronDown, TrendingUp } from 'lucide-react'

type SortField = 'date' | 'drop' | 'profit'
type SortOrder = 'asc' | 'desc'

// Стратегии для выбора
const STRATEGIES: TriggerStrategy[] = ['Фиба', 'Market Entry']

export const SignalsTriggerBot = () => {
    const { theme } = useThemeStore()
    const { user } = useAuthStore()

    const [alerts, setAlerts] = useState<TriggerAlert[]>([])
    const [loading, setLoading] = useState(true)
    const [showModal, setShowModal] = useState(false)
    const [editingAlert, setEditingAlert] = useState<TriggerAlert | null>(null)
    const [copyingId, setCopyingId] = useState<string | null>(null)
    const [isCopyingTable, setIsCopyingTable] = useState(false)

    // Filter states
    const [showFilters, setShowFilters] = useState(false)
    const [specificDate, setSpecificDate] = useState('')
    const [dateFrom, setDateFrom] = useState('')
    const [dateTo, setDateTo] = useState('')
    const [minDrop, setMinDrop] = useState('')
    const [maxDrop, setMaxDrop] = useState('')
    const [minProfit, setMinProfit] = useState('')
    const [maxProfit, setMaxProfit] = useState('')
    const [sortBy, setSortBy] = useState<SortField>('date')
    const [sortOrder, setSortOrder] = useState<SortOrder>('desc')

    // Form state for single alert
    const [formData, setFormData] = useState<Partial<TriggerAlert>>({
        signalDate: new Date().toISOString().split('T')[0],
        signalTime: new Date().toLocaleTimeString('ru-RU', { hour: '2-digit', minute: '2-digit' }),
        marketCap: '',
        address: '',
        strategy: 'Фиба',
        maxDrop: '',
        maxProfit: '',
        comment: ''
    })

    // Common date for all alerts in batch mode
    const [commonDate, setCommonDate] = useState<string>(new Date().toISOString().split('T')[0])
    
    // List of alerts to add (batch mode)
    const [alertsToAdd, setAlertsToAdd] = useState<Partial<TriggerAlert>[]>([])

    useEffect(() => {
        loadAlerts()
    }, [])

    const loadAlerts = async () => {
        try {
            const data = await getTriggerAlerts()
            setAlerts(data)
        } catch (error) {
            console.error('Error loading alerts:', error)
        } finally {
            setLoading(false)
        }
    }

    // Add current form to the list
    const handleAddToList = () => {
        if (!formData.address) {
            alert('Введите адрес токена')
            return
        }
        
        const newAlert: Partial<TriggerAlert> = {
            signalDate: commonDate,
            signalTime: formData.signalTime,
            marketCap: formData.marketCap,
            address: formData.address,
            strategy: formData.strategy,
            maxDrop: formData.maxDrop,
            maxProfit: formData.maxProfit,
            comment: formData.comment
        }
        
        setAlertsToAdd([...alertsToAdd, newAlert])
        
        // Reset form fields except date (which is now common) and strategy
        setFormData({
            signalTime: new Date().toLocaleTimeString('ru-RU', { hour: '2-digit', minute: '2-digit' }),
            marketCap: '',
            address: '',
            strategy: formData.strategy,
            maxDrop: '',
            maxProfit: '',
            comment: ''
        })
    }

    // Remove alert from list
    const handleRemoveFromList = (index: number) => {
        setAlertsToAdd(alertsToAdd.filter((_, i) => i !== index))
    }

    // Save all alerts to Firestore
    const handleSaveAll = async () => {
        if (alertsToAdd.length === 0) {
            alert('Добавьте хотя бы один сигнал')
            return
        }

        try {
            const promises = alertsToAdd.map(alert => 
                addTriggerAlert({
                    ...alert as TriggerAlert,
                    createdAt: new Date().toISOString(),
                    createdBy: user?.id || 'admin'
                })
            )
            await Promise.all(promises)
            
            // Reset
            setAlertsToAdd([])
            setFormData({
                signalDate: new Date().toISOString().split('T')[0],
                signalTime: new Date().toLocaleTimeString('ru-RU', { hour: '2-digit', minute: '2-digit' }),
                marketCap: '',
                address: '',
                strategy: 'Фиба',
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
                await updateTriggerAlert(editingAlert.id, { ...formData, signalDate: commonDate } as TriggerAlert)
            } else {
                await addTriggerAlert({
                    ...formData as TriggerAlert,
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
                strategy: 'Фиба',
                maxDrop: '',
                maxProfit: '',
                comment: ''
            })
            await loadAlerts()
        } catch (error: any) {
            console.error('Error saving alert:', error)
        }
    }

    const subTextColor = theme === 'dark' ? 'text-gray-400' : 'text-gray-600'
    const headingColor = theme === 'dark' ? 'text-white' : 'text-gray-900'
    const cardBg = theme === 'dark' ? 'bg-[#10141c]' : 'bg-white'
    const cardBorder = theme === 'dark' ? 'border-[#f59e0b]/30' : 'border-[#f59e0b]/20'
    const cardShadow = theme === 'dark' ? 'shadow-[0_24px_80px_rgba(0,0,0,0.45)]' : 'shadow-[0_24px_80px_rgba(0,0,0,0.15)]'

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
            <th>Стратегия</th>
            <th>Market Cap</th>
            <th>Адрес</th>
            <th>Макс. Падение</th>
            <th>Макс. Профит</th>
            <th>Комментарий</th>
          </tr>
        </thead>
        <tbody>
          ${filteredAlerts.map((a: TriggerAlert) => `
            <tr>
              <td>${formatDateForDisplay(a.signalDate)}</td>
              <td>${a.signalTime}</td>
              <td>${a.strategy || '-'}</td>
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
        const year = parts[0].slice(-2)
        return `${parts[2]}.${parts[1]}.${year}`
    }

    // Truncate address for display: 5 chars + ... + 3 chars
    const truncateAddress = (address: string) => {
        if (!address) return '-'
        if (address.length <= 9) return address
        return `${address.slice(0, 5)}...${address.slice(-3)}`
    }

    // Parse numeric value from drop/profit string
    const parseValue = (value: string | undefined): number => {
        if (!value) return 0
        const cleaned = value.replace(/[+%]/g, '').toUpperCase()
        if (cleaned.startsWith('X')) {
            const multiplier = parseFloat(cleaned.slice(1))
            return isNaN(multiplier) ? 0 : multiplier * 100
        }
        const num = parseFloat(cleaned)
        return isNaN(num) ? 0 : num
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

        // Sort
        result.sort((a, b) => {
            let comparison = 0
            switch (sortBy) {
                case 'date':
                    comparison = a.signalDate.localeCompare(b.signalDate)
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
    }, [alerts, specificDate, dateFrom, dateTo, minDrop, maxDrop, minProfit, maxProfit, sortBy, sortOrder])

    // Reset all filters
    const resetFilters = () => {
        setSpecificDate('')
        setDateFrom('')
        setDateTo('')
        setMinDrop('')
        setMaxDrop('')
        setMinProfit('')
        setMaxProfit('')
        setSortBy('date')
        setSortOrder('desc')
    }

    // Check if any filter is active
    const hasActiveFilters = useMemo(() => {
        return specificDate || dateFrom || dateTo || minDrop || maxDrop || minProfit || maxProfit || sortBy !== 'date' || sortOrder !== 'desc'
    }, [specificDate, dateFrom, dateTo, minDrop, maxDrop, minProfit, maxProfit, sortBy, sortOrder])

    const handleDelete = async (id: string) => {
        if (!confirm('Удалить алерт?')) return
        try {
            await deleteTriggerAlert(id)
            await loadAlerts()
        } catch (error) {
            console.error('Error deleting alert:', error)
        }
    }

    const handleEdit = (alert: TriggerAlert) => {
        setEditingAlert(alert)
        setFormData(alert)
        setShowModal(true)
    }

    // Получение цвета для стратегии
    const getStrategyColor = (strategy?: TriggerStrategy) => {
        switch (strategy) {
            case 'Фиба': return 'bg-purple-500/20 text-purple-400'
            case 'Market Entry': return 'bg-green-500/20 text-green-400'
            default: return 'bg-gray-500/20 text-gray-400'
        }
    }

    return (
        <>
            <div className="space-y-6">
                {/* Header */}
                <div className={`relative overflow-hidden rounded-3xl border ${cardBorder} ${cardShadow} ${cardBg}`}>
                    <div className="absolute inset-0 pointer-events-none">
                        <div className="absolute -left-16 -bottom-10 w-80 h-80 bg-amber-500/10 blur-3xl"></div>
                        <div className={`absolute inset-0 ${theme === 'dark' ? 'bg-[radial-gradient(circle_at_50%_0%,rgba(255,255,255,0.05),transparent_45%)]' : 'bg-[radial-gradient(circle_at_50%_0%,rgba(245,158,11,0.05),transparent_45%)]'}`}></div>
                    </div>

                    <div className="relative p-6 sm:p-8 flex flex-col lg:flex-row items-stretch lg:items-center justify-between gap-6">
                        <div className="flex items-center gap-4">
                            <div className={`p-3 rounded-2xl ${theme === 'dark' ? 'bg-white/10 border-white/20' : 'bg-amber-500/10 border-amber-500/30'} shadow-inner`}>
                                <Zap className={`w-8 h-8 ${theme === 'dark' ? 'text-white' : 'text-amber-500'}`} />
                            </div>
                            <div className="flex flex-col">
                                <h1 className={`text-3xl font-black ${headingColor}`}>Signals Trigger Bot</h1>
                                <p className={`text-sm ${subTextColor}`}>Trading Signals (Independent)</p>
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
                                className={`px-4 py-2 rounded-xl text-sm font-semibold transition-all flex items-center gap-2 border ${showFilters ? 'bg-amber-500 border-amber-500 text-white' : theme === 'dark' ? 'bg-white/5 border-white/10 hover:bg-white/10 text-gray-300' : 'bg-gray-100 border-gray-200 hover:bg-gray-100 text-gray-700'}`}
                            >
                                <Filter className="w-4 h-4" />
                                <span>Фильтры</span>
                            </button>

                            {hasActiveFilters && (
                                <button
                                    onClick={resetFilters}
                                    className={`px-4 py-2 rounded-xl text-sm font-semibold transition-all flex items-center gap-2 border ${theme === 'dark' ? 'bg-white/5 border-white/10 hover:bg-white/10' : 'bg-gray-100 border-gray-200 hover:bg-gray-100 text-gray-700'}`}
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
                                        strategy: 'Фиба',
                                        maxDrop: '',
                                        maxProfit: '',
                                        comment: ''
                                    })
                                    setShowModal(true)
                                }}
                                className="px-4 py-2 rounded-xl bg-amber-500 hover:bg-amber-600 text-white font-semibold transition-colors flex items-center gap-2 shadow-lg shadow-amber-500/20"
                            >
                                <Plus className="w-4 h-4" />
                                <span>Добавить сигнал</span>
                            </button>
                        </div>
                    </div>
                </div>

                {/* Filters Panel */}
                {showFilters && (
                    <div className={`rounded-3xl border ${cardBorder} ${cardBg} p-6 space-y-4`}>
                        <div className="flex items-center gap-2 mb-4">
                            <Filter className={`w-5 h-5 ${theme === 'dark' ? 'text-white' : 'text-gray-900'}`} />
                            <h3 className={`text-lg font-semibold ${headingColor}`}>Фильтры и сортировка</h3>
                        </div>

                        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
                            {/* Date Filters */}
                            <div className="space-y-3">
                                <h4 className={`text-xs font-semibold uppercase ${subTextColor}`}>Дата</h4>
                                <div className="space-y-2">
                                    <div>
                                        <label className={`text-xs ${subTextColor}`}>Конкретная дата</label>
                                        <input
                                            type="date"
                                            value={specificDate}
                                            onChange={(e) => setSpecificDate(e.target.value)}
                                            className={`w-full p-2 rounded-lg border text-sm outline-none mt-1 ${theme === 'dark' ? 'bg-black/30 border-white/10 text-white' : 'bg-white border-gray-200 text-gray-900'}`}
                                        />
                                    </div>
                                    <div className="grid grid-cols-2 gap-2">
                                        <div>
                                            <label className={`text-xs ${subTextColor}`}>От</label>
                                            <input
                                                type="date"
                                                value={dateFrom}
                                                onChange={(e) => setDateFrom(e.target.value)}
                                                className={`w-full p-2 rounded-lg border text-sm outline-none mt-1 ${theme === 'dark' ? 'bg-black/30 border-white/10 text-white' : 'bg-white border-gray-200 text-gray-900'}`}
                                            />
                                        </div>
                                        <div>
                                            <label className={`text-xs ${subTextColor}`}>До</label>
                                            <input
                                                type="date"
                                                value={dateTo}
                                                onChange={(e) => setDateTo(e.target.value)}
                                                className={`w-full p-2 rounded-lg border text-sm outline-none mt-1 ${theme === 'dark' ? 'bg-black/30 border-white/10 text-white' : 'bg-white border-gray-200 text-gray-900'}`}
                                            />
                                        </div>
                                    </div>
                                </div>
                            </div>

                            {/* Drop Filters */}
                            <div className="space-y-3">
                                <h4 className={`text-xs font-semibold uppercase ${subTextColor}`}>Макс. Падение (%)</h4>
                                <div className="grid grid-cols-2 gap-2">
                                    <div>
                                        <label className={`text-xs ${subTextColor}`}>Мин.</label>
                                        <input
                                            type="number"
                                            placeholder="-50"
                                            value={minDrop}
                                            onChange={(e) => setMinDrop(e.target.value)}
                                            className={`w-full p-2 rounded-lg border text-sm outline-none mt-1 ${theme === 'dark' ? 'bg-black/30 border-white/10 text-white' : 'bg-white border-gray-200 text-gray-900'}`}
                                        />
                                    </div>
                                    <div>
                                        <label className={`text-xs ${subTextColor}`}>Макс.</label>
                                        <input
                                            type="number"
                                            placeholder="-5"
                                            value={maxDrop}
                                            onChange={(e) => setMaxDrop(e.target.value)}
                                            className={`w-full p-2 rounded-lg border text-sm outline-none mt-1 ${theme === 'dark' ? 'bg-black/30 border-white/10 text-white' : 'bg-white border-gray-200 text-gray-900'}`}
                                        />
                                    </div>
                                </div>
                            </div>

                            {/* Profit Filters */}
                            <div className="space-y-3">
                                <h4 className={`text-xs font-semibold uppercase ${subTextColor}`}>Макс. Профит (%)</h4>
                                <div className="grid grid-cols-2 gap-2">
                                    <div>
                                        <label className={`text-xs ${subTextColor}`}>Мин.</label>
                                        <input
                                            type="number"
                                            placeholder="10"
                                            value={minProfit}
                                            onChange={(e) => setMinProfit(e.target.value)}
                                            className={`w-full p-2 rounded-lg border text-sm outline-none mt-1 ${theme === 'dark' ? 'bg-black/30 border-white/10 text-white' : 'bg-white border-gray-200 text-gray-900'}`}
                                        />
                                    </div>
                                    <div>
                                        <label className={`text-xs ${subTextColor}`}>Макс.</label>
                                        <input
                                            type="number"
                                            placeholder="500"
                                            value={maxProfit}
                                            onChange={(e) => setMaxProfit(e.target.value)}
                                            className={`w-full p-2 rounded-lg border text-sm outline-none mt-1 ${theme === 'dark' ? 'bg-black/30 border-white/10 text-white' : 'bg-white border-gray-200 text-gray-900'}`}
                                        />
                                    </div>
                                </div>
                            </div>

                            {/* Sort */}
                            <div className="space-y-3">
                                <h4 className={`text-xs font-semibold uppercase ${subTextColor}`}>Сортировка</h4>
                                <div className="space-y-2">
                                    <select
                                        value={sortBy}
                                        onChange={(e) => setSortBy(e.target.value as SortField)}
                                        className={`w-full p-2 rounded-lg border outline-none transition-all ${theme === 'dark' ? 'bg-black/30 border-white/10 text-white' : 'bg-white border-gray-200 text-gray-900'}`}
                                    >
                                        <option value="date">По дате</option>
                                        <option value="drop">По падению</option>
                                        <option value="profit">По росту</option>
                                    </select>
                                    <button
                                        onClick={() => setSortOrder(sortOrder === 'asc' ? 'desc' : 'asc')}
                                        className={`w-full p-2 rounded-lg border text-sm flex items-center justify-center gap-2 transition-all ${theme === 'dark' ? 'bg-black/30 border-white/10 text-white hover:border-amber-500/30' : 'bg-white border-gray-200 text-gray-900 hover:bg-gray-100'}`}
                                    >
                                        {sortOrder === 'asc' ? <ArrowUp className="w-4 h-4" /> : <ArrowDown className="w-4 h-4" />}
                                        <span>{sortOrder === 'asc' ? 'По возрастанию' : 'По убыванию'}</span>
                                    </button>
                                </div>
                            </div>
                        </div>

                        <div className={`text-sm ${subTextColor} pt-2`}>
                            Показано сигналов: <span className={headingColor}>{filteredAlerts.length}</span> из <span className={headingColor}>{alerts.length}</span>
                        </div>
                    </div>
                )}

                {/* Table */}
                <div className={`relative overflow-hidden rounded-3xl border ${cardBorder} ${cardShadow} ${cardBg}`}>
                    <div className="overflow-x-auto">
                        <table className="w-full text-left border-collapse">
                            <thead>
                                <tr className={`border-b ${theme === 'dark' ? 'border-white/10 bg-white/5' : 'border-gray-200 bg-gray-50'}`}>
                                    <th className={`p-4 text-xs uppercase tracking-wider font-semibold ${subTextColor}`}>Дата</th>
                                    <th className={`p-4 text-xs uppercase tracking-wider font-semibold ${subTextColor}`}>Время</th>
                                    <th className={`p-4 text-xs uppercase tracking-wider font-semibold ${subTextColor}`}>Стратегия</th>
                                    <th className={`p-4 text-xs uppercase tracking-wider font-semibold ${subTextColor}`}>Market Cap</th>
                                    <th className={`p-4 text-xs uppercase tracking-wider font-semibold ${subTextColor}`}>Адрес</th>
                                    <th className={`p-4 text-xs uppercase tracking-wider font-semibold ${subTextColor}`}>Макс. Падение</th>
                                    <th className={`p-4 text-xs uppercase tracking-wider font-semibold ${subTextColor}`}>Макс. Профит</th>
                                    <th className={`p-4 text-xs uppercase tracking-wider font-semibold ${subTextColor}`}>Комментарий</th>
                                    <th className={`p-4 text-xs uppercase tracking-wider font-semibold ${subTextColor}`}>Действия</th>
                                </tr>
                            </thead>
                            <tbody className={`divide-y ${theme === 'dark' ? 'divide-white/5' : 'divide-gray-100'}`}>
                                {loading ? (
                                    <tr>
                                        <td colSpan={9} className="p-8 text-center text-gray-500">Загрузка...</td>
                                    </tr>
                                ) : filteredAlerts.length === 0 ? (
                                    <tr>
                                        <td colSpan={9} className="p-8 text-center text-gray-500">
                                            {hasActiveFilters ? 'Нет сигналов по выбранным фильтрам' : 'Нет сигналов'}
                                        </td>
                                    </tr>
                                ) : sortBy === 'date' ? (
                                    (() => {
                                        const groupedAlerts: { [key: string]: TriggerAlert[] } = {}
                                        filteredAlerts.forEach((alert: TriggerAlert) => {
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
                                            
                                            if (dateIndex > 0) {
                                                rows.push(
                                                    <tr key={`separator-${dateKey}`}>
                                                        <td colSpan={9} className="py-2">
                                                            <div className={`h-px ${theme === 'dark' ? 'bg-white/10' : 'bg-gray-200'}`}></div>
                                                        </td>
                                                    </tr>
                                                )
                                            }

                                            rows.push(
                                                <tr key={`header-${dateKey}`} className={`${theme === 'dark' ? 'bg-white/5' : 'bg-gray-50'}`}>
                                                    <td colSpan={9} className="p-3 px-4">
                                                        <span className={`text-sm font-semibold ${subTextColor}`}>
                                                            {formatDateForDisplay(dateKey)}
                                                        </span>
                                                    </td>
                                                </tr>
                                            )

                                            dateAlerts.forEach((alert: TriggerAlert) => {
                                                rows.push(
                                                    <tr key={alert.id} className={`${theme === 'dark' ? 'hover:bg-white/5' : 'hover:bg-gray-50'} transition-colors`}>
                                                        <td className="p-4 whitespace-nowrap">
                                                            <div className={`font-mono font-medium ${headingColor}`}>{formatDateForDisplay(alert.signalDate)}</div>
                                                        </td>
                                                        <td className="p-4 whitespace-nowrap">
                                                            <div className={`font-mono ${headingColor}`}>{alert.signalTime}</div>
                                                        </td>
                                                        <td className="p-4 whitespace-nowrap">
                                                            <span className={`inline-flex items-center gap-1.5 px-2.5 py-1 rounded-lg text-xs font-semibold ${getStrategyColor(alert.strategy)}`}>
                                                                <TrendingUp className="w-3 h-3" />
                                                                {alert.strategy || '-'}
                                                            </span>
                                                        </td>
                                                        <td className="p-4 whitespace-nowrap">
                                                            <div className={`font-mono ${headingColor}`}>{alert.marketCap || '-'}</div>
                                                        </td>
                                                        <td className="p-4">
                                                            <div className="flex items-center gap-2">
                                                                <div 
                                                                    className={`font-mono text-sm ${theme === 'dark' ? 'text-blue-400' : 'text-blue-600'}`}
                                                                    title={alert.address}
                                                                >
                                                                    {truncateAddress(alert.address)}
                                                                </div>
                                                                <button
                                                                    onClick={() => handleCopy(alert.address, alert.id)}
                                                                    className={`p-1.5 rounded-lg hover:bg-white/10 transition-colors ${subTextColor}`}
                                                                >
                                                                    {copyingId === alert.id ? <Check className="w-3 h-3 text-green-500" /> : <Copy className="w-3 h-3" />}
                                                                </button>
                                                            </div>
                                                        </td>
                                                        <td className="p-4 whitespace-nowrap">
                                                            <span className={`font-mono ${alert.maxDrop && alert.maxDrop.startsWith('-') ? 'text-red-500' : headingColor}`}>
                                                                {alert.maxDrop || '-'}
                                                            </span>
                                                        </td>
                                                        <td className="p-4 whitespace-nowrap">
                                                            <span className="font-mono text-green-500 font-bold">
                                                                {alert.maxProfit || '-'}
                                                            </span>
                                                        </td>
                                                        <td className="p-4 max-w-[250px]">
                                                            <div className={`text-sm ${headingColor} break-words whitespace-pre-wrap`}>
                                                                {alert.comment || '-'}
                                                            </div>
                                                        </td>
                                                        <td className="p-4 whitespace-nowrap">
                                                            <div className="flex items-center gap-1">
                                                                <button
                                                                    onClick={() => handleEdit(alert)}
                                                                    className={`p-2 rounded-lg hover:bg-white/10 transition-colors ${theme === 'dark' ? 'text-blue-400' : 'text-blue-600'}`}
                                                                >
                                                                    <Edit className="w-4 h-4" />
                                                                </button>
                                                                <button
                                                                    onClick={() => handleDelete(alert.id)}
                                                                    className="p-2 rounded-lg hover:bg-red-500/10 text-red-500 transition-colors"
                                                                >
                                                                    <Trash2 size={16} />
                                                                </button>
                                                            </div>
                                                        </td>
                                                    </tr>
                                                )
                                            })
                                        })

                                        return rows
                                    })()
                                ) : (
                                    filteredAlerts.map((alert: TriggerAlert) => (
                                        <tr key={alert.id} className={`${theme === 'dark' ? 'hover:bg-white/5' : 'hover:bg-gray-50'} transition-colors`}>
                                            <td className="p-4 whitespace-nowrap">
                                                <div className={`font-mono font-medium ${headingColor}`}>{formatDateForDisplay(alert.signalDate)}</div>
                                            </td>
                                            <td className="p-4 whitespace-nowrap">
                                                <div className={`font-mono ${headingColor}`}>{alert.signalTime}</div>
                                            </td>
                                            <td className="p-4 whitespace-nowrap">
                                                <span className={`inline-flex items-center gap-3.5 px-2.5 py-1 rounded-lg text-xs font-semibold ${getStrategyColor(alert.strategy)}`}>
                                                    <TrendingUp className="w-3 h-3" />
                                                    {alert.strategy || '-'}
                                                </span>
                                            </td>
                                            <td className="p-4 whitespace-nowrap">
                                                <div className={`font-mono ${headingColor}`}>{alert.marketCap || '-'}</div>
                                            </td>
                                            <td className="p-4">
                                                <div className="flex items-center gap-2">
                                                    <div 
                                                        className={`font-mono text-sm ${theme === 'dark' ? 'text-blue-400' : 'text-blue-600'}`}
                                                        title={alert.address}
                                                    >
                                                        {truncateAddress(alert.address)}
                                                    </div>
                                                    <button
                                                        onClick={() => handleCopy(alert.address, alert.id)}
                                                        className={`p-1.5 rounded-lg hover:bg-white/10 transition-colors ${subTextColor}`}
                                                    >
                                                        {copyingId === alert.id ? <Check className="w-3 h-3 text-green-500" /> : <Copy className="w-3 h-3" />}
                                                    </button>
                                                </div>
                                            </td>
                                            <td className="p-4 whitespace-nowrap">
                                                <span className={`font-mono ${alert.maxDrop && alert.maxDrop.startsWith('-') ? 'text-red-500' : headingColor}`}>
                                                    {alert.maxDrop || '-'}
                                                </span>
                                            </td>
                                            <td className="p-4 whitespace-nowrap">
                                                <span className="font-mono text-green-500 font-bold">
                                                    {alert.maxProfit || '-'}
                                                </span>
                                            </td>
                                            <td className="p-4 max-w-[250px]">
                                                <div className={`text-sm ${headingColor} break-words whitespace-pre-wrap`}>
                                                    {alert.comment || '-'}
                                                </div>
                                            </td>
                                            <td className="p-4 whitespace-nowrap">
                                                <div className="flex items-center gap-1">
                                                    <button
                                                        onClick={() => handleEdit(alert)}
                                                        className={`p-2 rounded-lg hover:bg-white/10 transition-colors ${theme === 'dark' ? 'text-blue-400' : 'text-blue-600'}`}
                                                    >
                                                        <Edit className="w-4 h-4" />
                                                    </button>
                                                    <button
                                                        onClick={() => handleDelete(alert.id)}
                                                        className="p-2 rounded-lg hover:bg-red-500/10 text-red-500 transition-colors"
                                                    >
                                                        <Trash2 size={16} />
                                                    </button>
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
                <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm">
                    <div className={`w-full max-w-2xl rounded-3xl ${cardBg} ${cardBorder} border shadow-2xl overflow-hidden max-h-[90vh] flex flex-col`}>
                        <div className={`p-6 border-b ${theme === 'dark' ? 'border-white/10' : 'border-gray-100'} flex items-center justify-between flex-shrink-0`}>
                            <div>
                                <h3 className={`text-xl font-bold ${headingColor}`}>
                                    {editingAlert ? 'Редактировать сигнал' : 'Добавить сигналы'}
                                </h3>
                                {!editingAlert && (
                                    <p className={`text-sm ${subTextColor}`}>Добавьте один или несколько сигналов за одну дату</p>
                                )}
                            </div>
                            <button onClick={() => {
                                setShowModal(false)
                                setAlertsToAdd([])
                                setFormData({
                                    signalDate: new Date().toISOString().split('T')[0],
                                    signalTime: new Date().toLocaleTimeString('ru-RU', { hour: '2-digit', minute: '2-digit' }),
                                    marketCap: '',
                                    address: '',
                                    strategy: 'Фиба',
                                    maxDrop: '',
                                    maxProfit: '',
                                    comment: ''
                                })
                            }} className={`p-2 rounded-lg hover:bg-white/10 transition-colors ${subTextColor}`}>
                                <X className="w-5 h-5" />
                            </button>
                        </div>

                        <div className="flex-1 overflow-y-auto p-6 space-y-6">
                            {/* Common Date */}
                            <div className="space-y-1">
                                <label className={`text-xs font-semibold uppercase ${subTextColor}`}>Дата для всех сигналов</label>
                                <input
                                    type="date"
                                    disabled={!!editingAlert}
                                    value={commonDate}
                                    onChange={(e) => setCommonDate(e.target.value)}
                                    className={`w-full p-3 rounded-xl border outline-none transition-all ${theme === 'dark' ? 'bg-black/30 border-white/10 text-white focus:border-amber-500' : 'bg-white border-gray-200 text-gray-900 focus-border-amber-500'} ${editingAlert ? 'opacity-50' : ''}`}
                                />
                            </div>

                            {editingAlert ? (
                                <form onSubmit={handleSubmit} className="space-y-4">
                                    <div className="grid grid-cols-2 gap-4">
                                        <div className="space-y-1">
                                            <label className={`text-xs font-semibold uppercase ${subTextColor}`}>Время</label>
                                            <input
                                                type="time"
                                                required
                                                value={formData.signalTime}
                                                onChange={(e) => setFormData({ ...formData, signalTime: e.target.value })}
                                                className={`w-full p-3 rounded-xl border outline-none transition-all ${theme === 'dark' ? 'bg-black/30 border-white/10 text-white focus:border-amber-500' : 'bg-white border-gray-200 text-gray-900 focus-border-amber-500'}`}
                                            />
                                        </div>
                                        <StrategySelector
                                            value={formData.strategy}
                                            onChange={(strategy) => setFormData({ ...formData, strategy })}
                                            theme={theme}
                                        />
                                    </div>

                                    <div className="space-y-1">
                                        <label className={`text-xs ${subTextColor}`}>Адрес токена</label>
                                        <input
                                            type="text"
                                            required
                                            placeholder="Адрес контракта..."
                                            value={formData.address || ''}
                                            onChange={(e) => setFormData({ ...formData, address: e.target.value })}
                                            className={`w-full p-3 rounded-xl border outline-none transition-all font-mono text-sm ${theme === 'dark' ? 'bg-black/30 border-white/10 text-white focus-border-amber-500' : 'bg-white border-gray-200 text-gray-900 focus-border-amber-500'}`}
                                        />
                                    </div>

                                    <div className="grid grid-cols-3 gap-4">
                                        <div className="space-y-1">
                                            <label className={`text-xs ${subTextColor}`}>Market Cap</label>
                                            <input
                                                type="text"
                                                placeholder="e.g. 300,77"
                                                value={formData.marketCap || ''}
                                                onChange={(e) => setFormData({ ...formData, marketCap: e.target.value })}
                                                className={`w-full p-3 rounded-xl border outline-none transition-all ${theme === 'dark' ? 'bg-black/30 border-white/10 text-white focus-border-amber-500' : 'bg-white border-gray-200 text-gray-900 focus-border-amber-500'}`}
                                            />
                                        </div>
                                        <div className="space-y-1">
                                            <label className={`text-xs ${subTextColor}`}>Макс. Падение</label>
                                            <input
                                                type="text"
                                                placeholder="e.g. -16"
                                                value={formData.maxDrop || ''}
                                                onChange={(e) => setFormData({ ...formData, maxDrop: e.target.value })}
                                                className={`w-full p-3 rounded-xl border outline-none transition-all ${theme === 'dark' ? 'bg-black/30 border-white/10 text-white focus-border-amber-500' : 'bg-white border-gray-200 text-gray-900 focus-border-amber-500'}`}
                                            />
                                        </div>
                                        <div className="space-y-1">
                                            <label className={`text-xs ${subTextColor}`}>Макс. Профит</label>
                                            <input
                                                type="text"
                                                placeholder="e.g. +28"
                                                value={formData.maxProfit || ''}
                                                onChange={(e) => setFormData({ ...formData, maxProfit: e.target.value })}
                                                className={`w-full p-3 rounded-xl border outline-none transition-all ${theme === 'dark' ? 'bg-black/30 border-white/10 text-white focus-border-amber-500' : 'bg-white border-gray-200 text-gray-900 focus-border-amber-500'}`}
                                            />
                                        </div>
                                    </div>

                                    <div className="space-y-1">
                                        <label className={`text-xs ${subTextColor}`}>Комментарий</label>
                                        <input
                                            type="text"
                                            placeholder="Дополнительная информация..."
                                            value={formData.comment || ''}
                                            onChange={(e) => setFormData({ ...formData, comment: e.target.value })}
                                            className={`w-full p-2 rounded-xl border outline-none transition-all font-mono text-sm ${theme === 'dark' ? 'bg-black/30 border-white/10 text-white' : 'bg-white border-gray-200 text-gray-900'}`}
                                        />
                                    </div>

                                    <div className="pt-4 flex gap-3">
                                        <button
                                            type="button"
                                            onClick={() => {
                                                setShowModal(false)
                                                setEditingAlert(null)
                                            }}
                                            className={`flex-1 py-3 rounded-xl font-semibold transition-colors ${theme === 'dark' ? 'bg-white/5 hover:bg-white/10 text-white' : 'bg-gray-100 hover:bg-gray-200 text-gray-800'}`}
                                        >
                                            Отмена
                                        </button>
                                        <button
                                            type="submit"
                                            className="flex-1 py-3 rounded-xl bg-amber-500 hover:bg-amber-600 text-white font-semibold transition-colors flex items-center justify-center gap-2"
                                        >
                                            <Save className="w-4 h-4" />
                                            <span>Сохранить</span>
                                        </button>
                                    </div>
                                </form>
                            ) : (
                                <>
                                    {/* Form for new alert */}
                                    <div className={`p-4 rounded-2xl ${theme === 'dark' ? 'bg-white/5' : 'bg-gray-50'} space-y-4`}>
                                        <h4 className={`text-sm font-semibold ${headingColor}`}>Новый сигнал</h4>
                                        
                                        <div className="grid grid-cols-2 gap-4">
                                            <div className="space-y-1">
                                                <label className={`text-xs font-semibold uppercase ${subTextColor}`}>Время</label>
                                                <input
                                                    type="time"
                                                    value={formData.signalTime}
                                                    onChange={(e) => setFormData({ ...formData, signalTime: e.target.value })}
                                                    className={`w-full p-2 rounded-lg border outline-none transition-all ${theme === 'dark' ? 'bg-black/30 border-white/10 text-white' : 'bg-white border-gray-200 text-gray-900'}`}
                                                />
                                            </div>
                                            <StrategySelector
                                                value={formData.strategy}
                                                onChange={(strategy) => setFormData({ ...formData, strategy })}
                                                theme={theme}
                                            />
                                        </div>

                                        <div className="space-y-1">
                                            <label className={`text-xs font-semibold uppercase ${subTextColor}`}>Адрес токена</label>
                                            <input
                                                type="text"
                                                placeholder="Адрес контракта..."
                                                value={formData.address || ''}
                                                onChange={(e) => setFormData({ ...formData, address: e.target.value })}
                                                className={`w-full p-2 rounded-lg border outline-none transition-all font-mono text-sm ${theme === 'dark' ? 'bg-black/30 border-white/10 text-white' : 'bg-white border-gray-200 text-gray-900'}`}
                                            />
                                        </div>

                                        <div className="grid grid-cols-3 gap-4">
                                            <div className="space-y-1">
                                                <label className={`text-xs font-semibold uppercase ${subTextColor}`}>Market Cap</label>
                                                <input
                                                    type="text"
                                                    placeholder="e.g. 300,77"
                                                    value={formData.marketCap || ''}
                                                    onChange={(e) => setFormData({ ...formData, marketCap: e.target.value })}
                                                    className={`w-full p-2 rounded-lg border outline-none transition-all ${theme === 'dark' ? 'bg-black/30 border-white/10 text-white' : 'bg-white border-gray-200 text-gray-900'}`}
                                                />
                                            </div>
                                            <div className="space-y-1">
                                                <label className={`text-xs font-semibold uppercase ${subTextColor}`}>Макс. Падение</label>
                                                <input
                                                    type="text"
                                                    placeholder="e.g. -16"
                                                    value={formData.maxDrop || ''}
                                                    onChange={(e) => setFormData({ ...formData, maxDrop: e.target.value })}
                                                    className={`w-full p-2 rounded-lg border outline-none transition-all ${theme === 'dark' ? 'bg-black/30 border-white/10 text-white' : 'bg-white border-gray-200 text-gray-900'}`}
                                                />
                                            </div>
                                            <div className="space-y-1">
                                                <label className={`text-xs font-semibold uppercase ${subTextColor}`}>Макс. Профит</label>
                                                <input
                                                    type="text"
                                                    placeholder="e.g. +28"
                                                    value={formData.maxProfit || ''}
                                                    onChange={(e) => setFormData({ ...formData, maxProfit: e.target.value })}
                                                    className={`w-full p-2 rounded-lg border outline-none transition-all ${theme === 'dark' ? 'bg-black/30 border-white/10 text-white' : 'bg-white border-gray-200 text-gray-900'}`}
                                                />
                                            </div>
                                        </div>

                                        <div className="space-y-1">
                                            <label className={`text-xs ${subTextColor}`}>Комментарий</label>
                                            <input
                                                type="text"
                                                placeholder="Дополнительная информация..."
                                                value={formData.comment || ''}
                                                onChange={(e) => setFormData({ ...formData, comment: e.target.value })}
                                                className={`w-full p-2 rounded-xl border outline-none transition-all font-mono text-sm ${theme === 'dark' ? 'bg-black/30 border-white/10 text-white' : 'bg-white border-gray-200 text-gray-900'}`}
                                            />
                                        </div>

                                        <button
                                            type="button"
                                            onClick={handleAddToList}
                                            className="w-full py-2 rounded-xl bg-amber-500/20 hover:bg-amber-500/30 text-amber-500 font-semibold transition-colors flex items-center justify-center gap-2"
                                        >
                                            <Plus className="w-4 h-4" />
                                            <span>Добавить в список</span>
                                        </button>
                                    </div>

                                    {/* List of alerts to add */}
                                    {alertsToAdd.length > 0 && (
                                        <div className="space-y-3">
                                            <div className="flex items-center justify-between">
                                                <h4 className={`text-sm font-semibold ${headingColor}`}>
                                                    Сигналы для добавления ({alertsToAdd.length})
                                                </h4>
                                                <button
                                                    type="button"
                                                    onClick={() => setAlertsToAdd([])}
                                                    className={`text-xs ${subTextColor} hover:text-red-500 transition-colors`}
                                                >
                                                    Очистить всё
                                                </button>
                                            </div>
                                            
                                            <div className="space-y-2 max-h-60 overflow-y-auto">
                                                {alertsToAdd.map((alert, index) => (
                                                    <div 
                                                        key={index}
                                                        className={`flex items-center justify-between p-3 rounded-xl ${theme === 'dark' ? 'bg-white/5' : 'bg-gray-50'}`}
                                                    >
                                                        <div className="flex items-center gap-3 overflow-hidden">
                                                            <div className={`w-2 h-2 rounded-full flex-shrink-0 ${alert.maxDrop?.startsWith('-') ? 'bg-red-500' : 'bg-green-500'}`}></div>
                                                            <div className="flex flex-col min-w-0">
                                                                <span className={`text-xs font-medium truncate ${headingColor}`}>
                                                                    {truncateAddress(alert.address || '')}
                                                                </span>
                                                                <span className={`text-[10px] ${subTextColor}`}>
                                                                    {alert.signalTime} • {alert.strategy} • {alert.maxDrop || '-'} / {alert.maxProfit || '-'}
                                                                </span>
                                                            </div>
                                                        </div>
                                                        <button
                                                            type="button"
                                                            onClick={() => handleRemoveFromList(index)}
                                                            className="p-1.5 rounded-lg hover:bg-red-500/10 text-red-500 transition-colors flex-shrink-0"
                                                        >
                                                            <X className="w-4 h-4" />
                                                        </button>
                                                    </div>
                                                ))}
                                            </div>

                                            <button
                                                type="button"
                                                onClick={handleSaveAll}
                                                className="w-full py-3 rounded-xl bg-amber-500 hover:bg-amber-600 text-white font-semibold transition-colors flex items-center justify-center gap-2"
                                            >
                                                <Save className="w-4 h-4" />
                                                <span>Сохранить все ({alertsToAdd.length})</span>
                                            </button>
                                        </div>
                                    )}
                                </>
                            )}
                        </div>
                    </div>
                </div>
            )}
        </>
    )
}

// Компонент выбора стратегии (стиль как MemberSelector)
interface StrategySelectorProps {
    value: TriggerStrategy | undefined
    onChange: (strategy: TriggerStrategy) => void
    theme: string
}

const StrategySelector: React.FC<StrategySelectorProps> = ({ value, onChange, theme }) => {
    const [isOpen, setIsOpen] = React.useState(false)
    const containerRef = React.useRef<HTMLDivElement>(null)

    const subTextColor = theme === 'dark' ? 'text-gray-400' : 'text-gray-600'

    const getStrategyColor = (strategy: TriggerStrategy) => {
        switch (strategy) {
            case 'Фиба': return 'bg-purple-500/20 text-purple-400'
            case 'Market Entry': return 'bg-green-500/20 text-green-400'
        }
    }

    const getStrategyIcon = (strategy: TriggerStrategy) => {
        switch (strategy) {
            case 'Фиба': return <TrendingUp className="w-4 h-4" />
            case 'Market Entry': return <TrendingUp className="w-4 h-4" />
        }
    }

    React.useEffect(() => {
        const handleClickOutside = (event: MouseEvent) => {
            if (containerRef.current && !containerRef.current.contains(event.target as Node)) {
                setIsOpen(false)
            }
        }
        document.addEventListener('mousedown', handleClickOutside)
        return () => document.removeEventListener('mousedown', handleClickOutside)
    }, [])

    const selectedStrategy = value || 'Фиба'

    return (
        <div className="relative w-full" ref={containerRef}>
            <label className={`text-xs font-semibold uppercase ${subTextColor}`}>Стратегия</label>
            <button
                onClick={() => setIsOpen(!isOpen)}
                className={`w-full flex items-center justify-between gap-3 px-4 py-2.5 rounded-xl border transition-all mt-1 ${theme === 'dark'
                        ? 'bg-[#151a21] border-white/5 text-gray-300 hover:border-amber-500/30'
                        : 'bg-gray-50 border-gray-200 text-gray-700 hover:bg-gray-100'}`}
            >
                <div className="flex items-center gap-2.5 overflow-hidden">
                    <span className={getStrategyColor(selectedStrategy)}>
                        {getStrategyIcon(selectedStrategy)}
                    </span>
                    <span className={`text-sm font-bold ${getStrategyColor(selectedStrategy)}`}>
                        {selectedStrategy}
                    </span>
                </div>
                <ChevronDown size={16} className={`text-gray-500 transition-transform ${isOpen ? 'rotate-180' : ''}`} />
            </button>

            {isOpen && (
                <div className={`absolute z-50 top-full mt-2 w-full min-w-[180px] rounded-2xl border shadow-2xl overflow-hidden animate-in fade-in slide-in-from-top-2 duration-200 ${theme === 'dark' ? 'bg-[#1a1f26] border-white/10' : 'bg-white border-gray-200'
                    }`}>
                    <div className="p-1.5">
                        {STRATEGIES.map((strategy) => (
                            <button
                                key={strategy}
                                onClick={() => {
                                    onChange(strategy)
                                    setIsOpen(false)
                                }}
                                className={`w-full flex items-center gap-3 px-3 py-2.5 rounded-lg transition-all text-left ${value === strategy
                                        ? theme === 'dark' ? 'bg-amber-500/10 text-amber-400' : 'bg-amber-50 text-amber-600'
                                        : theme === 'dark' ? 'hover:bg-white/5 text-gray-300' : 'hover:bg-gray-50 text-gray-700'
                                    }`}
                            >
                                <span className="text-lg">{getStrategyIcon(strategy)}</span>
                                <span className={`text-sm font-bold ${value === strategy ? '' : getStrategyColor(strategy)}`}>
                                    {strategy}
                                </span>
                                {value === strategy && (
                                    <Check size={16} className={`ml-auto ${theme === 'dark' ? 'text-amber-400' : 'text-amber-500'}`} />
                                )}
                            </button>
                        ))}
                    </div>
                </div>
            )}
        </div>
    )
}