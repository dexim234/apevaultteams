import { useState, useEffect, useRef, useMemo } from 'react'
import { useThemeStore } from '@/store/themeStore'
import { useAuthStore } from '@/store/authStore'
import { useAdminStore } from '@/store/adminStore'
import { getTriggerAlerts, addTriggerAlert, updateTriggerAlert, deleteTriggerAlert } from '@/services/firestoreService'
import { TriggerAlert, TriggerStrategy, TriggerProfit } from '@/types'
import { Plus, Edit, Trash2, Save, X, Copy, Check, Table, Filter, ArrowUp, ArrowDown, RotateCcw, Zap, Activity, Target, Search, Calendar, ChevronDown, Hash, Coins, TrendingDown, TrendingUp, Clock, FileText, AlertTriangle, Upload, XCircle } from 'lucide-react'
import { MultiStrategySelector } from '../components/Management/MultiStrategySelector'
import { UserNickname } from '../components/UserNickname'




type SortField = 'date' | 'drop' | 'profit'
type SortOrder = 'asc' | 'desc'

export const SignalsTriggerBot = () => {
    const { theme } = useThemeStore()
    const { user } = useAuthStore()
    const { isAdmin } = useAdminStore()

    const subTextColor = theme === 'dark' ? 'text-gray-400' : 'text-gray-500'
    const headingColor = theme === 'dark' ? 'text-white' : 'text-gray-900'
    const cardBg = theme === 'dark' ? 'bg-[#151a21]/80 backdrop-blur-xl' : 'bg-white/80 backdrop-blur-xl'
    const cardBorder = theme === 'dark' ? 'border-amber-500/30' : 'border-amber-500/20'
    const cardShadow = theme === 'dark' ? 'shadow-[0_24px_80px_rgba(0,0,0,0.45)]' : 'shadow-[0_24px_80px_rgba(0,0,0,0.15)]'

    const [alerts, setAlerts] = useState<TriggerAlert[]>([])
    const [loading, setLoading] = useState(true)
    const [showModal, setShowModal] = useState(false)
    const [editingAlert, setEditingAlert] = useState<TriggerAlert | null>(null)
    const [copyingId, setCopyingId] = useState<string | null>(null)
    const [isCopyingTable, setIsCopyingTable] = useState(false)
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
    const [strategyFilter, setStrategyFilter] = useState<'all' | 'Фиба' | 'Market Entry'>('all')
    const [showScamOnly, setShowScamOnly] = useState(false)
    const [sortBy, setSortBy] = useState<SortField>('date')
    const [sortOrder, setSortOrder] = useState<SortOrder>('desc')

    // Form state for single alert
    const [formData, setFormData] = useState<Partial<TriggerAlert>>({
        signalDate: new Date().toISOString().split('T')[0],
        signalTime: new Date().toLocaleTimeString('ru-RU', { hour: '2-digit', minute: '2-digit' }),
        marketCap: '',
        address: '',
        strategies: [],
        maxDropFromSignal: '',
        maxDropFromLevel07: '',
        profits: [],
        comment: '',
        isScam: false
    })

    const [alertsToAdd, setAlertsToAdd] = useState<Partial<TriggerAlert>[]>([])
    const [commonDate, setCommonDate] = useState(new Date().toISOString().split('T')[0])
    const [profitsInput, setProfitsInput] = useState<{ strategy: TriggerStrategy, value: string }[]>([])
    const fileInputRef = useRef<HTMLInputElement>(null)
    const [screenshotPreview, setScreenshotPreview] = useState<string | null>(null)

    useEffect(() => {
        loadAlerts()
    }, [])

    const loadAlerts = async () => {
        try {
            setLoading(true)
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
            alert('Укажите адрес токена')
            return
        }

        // Require strategies only if not marked as scam
        if (!formData.isScam && (!formData.strategies || formData.strategies.length === 0)) {
            alert('Выберите стратегию или отметьте как скам')
            return
        }

        const newAlert: Partial<TriggerAlert> = {
            signalDate: commonDate,
            signalTime: formData.signalTime,
            marketCap: formData.marketCap,
            address: formData.address,
            ...(!formData.isScam && { strategies: formData.strategies }),
            maxDropFromSignal: formData.maxDropFromSignal,
            maxDropFromLevel07: formData.maxDropFromLevel07,
            profits: profitsInput.length > 0 ? profitsInput : undefined,
            comment: formData.comment,
            screenshot: screenshotPreview || undefined,
            isScam: formData.isScam || false
        }

        setAlertsToAdd([...alertsToAdd, newAlert])

        // Reset form fields except date (which is now common), strategies, and isScam
        setFormData({
            signalTime: new Date().toLocaleTimeString('ru-RU', { hour: '2-digit', minute: '2-digit' }),
            marketCap: '',
            address: '',
            strategies: formData.strategies,
            maxDropFromSignal: '',
            maxDropFromLevel07: '',
            profits: [],
            comment: ''
        })

        // Reset screenshot and profits
        setScreenshotPreview(null)
        setProfitsInput([])
    }

    // Remove alert from list
    // eslint-disable-next-line @typescript-eslint/no-unused-vars
    /*
    const _handleRemoveFromList = (index: number) => {
        setAlertsToAdd(alertsToAdd.filter((_, i) => i !== index))
    }
    */

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
                strategies: [],
                maxDropFromSignal: '',
                maxDropFromLevel07: '',
                profits: [],
                comment: '',
                isScam: false
            })
            setScreenshotPreview(null)
            setProfitsInput([])
            setShowModal(false)
            await loadAlerts()
            // Removed success alert for smoother flow
        } catch (error: any) {
            console.error('Error saving alerts:', error)
            alert('Ошибка при сохранении сигналов')
        }
    }

    // Handle single save (for editing or single alert)
    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault()
        try {
            const alertData = {
                ...formData,
                signalDate: commonDate,
                profits: profitsInput.length > 0 ? profitsInput : (formData.profits || []),
                screenshot: screenshotPreview || formData.screenshot
            }
            if (editingAlert) {
                await updateTriggerAlert(editingAlert.id, alertData as TriggerAlert)
            } else {
                await addTriggerAlert({
                    ...alertData as TriggerAlert,
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
                strategies: [],
                maxDropFromSignal: '',
                maxDropFromLevel07: '',
                profits: [],
                comment: '',
                isScam: false
            })
            setScreenshotPreview(null)
            setProfitsInput([])
            await loadAlerts()
        } catch (error: any) {
            console.error('Error saving alert:', error)
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
            <th>Стратегии</th>
            <th>Market Cap</th>
            <th>Адрес</th>
            <th>Макс. Падение от сигнала</th>
            <th>Макс. Падение от 0.7</th>
            <th>Макс. Профит</th>
            <th>Комментарий</th>
          </tr>
        </thead>
        <tbody>
          ${filteredAlerts.map((a: TriggerAlert) => `
            <tr>
              <td>${formatDateForDisplay(a.signalDate)}</td>
              <td>${a.signalTime}</td>
              <td>${a.strategies?.join(', ') || '-'}</td>
              <td>${a.marketCap || '-'}</td>
              <td>${a.address}</td>
              <td>${a.maxDropFromSignal || '-'}</td>
              <td>${a.maxDropFromLevel07 || '-'}</td>
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

    // Truncate address for display: 3 chars + ... + 3 chars
    const truncateAddress = (address: string) => {
        if (!address) return '-'
        if (address.length <= 7) return address
        return `${address.slice(0, 3)}...${address.slice(-3)}`
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

        // Filter by scam only
        if (showScamOnly) {
            result = result.filter(a => a.isScam === true)
        }

        // Filter by strategy (only for non-scam alerts)
        if (strategyFilter !== 'all') {
            result = result.filter(a => a.isScam || (a.strategies && a.strategies.includes(strategyFilter)))
        }

        // Filter by max drop range (maxDropFromSignal)
        if (minDrop) {
            const minVal = parseFloat(minDrop)
            if (!isNaN(minVal)) {
                result = result.filter(a => parseValue(a.maxDropFromSignal) >= minVal)
            }
        }
        if (maxDrop) {
            const maxVal = parseFloat(maxDrop)
            if (!isNaN(maxVal)) {
                result = result.filter(a => parseValue(a.maxDropFromSignal) <= maxVal)
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
                    comparison = parseValue(a.maxDropFromSignal) - parseValue(b.maxDropFromSignal)
                    break
                case 'profit':
                    comparison = parseValue(a.maxProfit) - parseValue(b.maxProfit)
                    break
            }
            return sortOrder === 'asc' ? comparison : -comparison
        })

        return result
    }, [alerts, specificDate, dateFrom, dateTo, minDrop, maxDrop, minProfit, maxProfit, minMc, maxMc, strategyFilter, showScamOnly, sortBy, sortOrder])

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
        setStrategyFilter('all')
        setShowScamOnly(false)
        setSortBy('date')
        setSortOrder('desc')
    }

    // Check if any filter is active
    const hasActiveFilters = useMemo(() => {
        return specificDate || dateFrom || dateTo || minDrop || maxDrop || minProfit || maxProfit || minMc || maxMc || strategyFilter !== 'all' || showScamOnly || sortBy !== 'date' || sortOrder !== 'desc'
    }, [specificDate, dateFrom, dateTo, minDrop, maxDrop, minProfit, maxProfit, minMc, maxMc, strategyFilter, showScamOnly, sortBy, sortOrder])

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
        setCommonDate(alert.signalDate || '')
        setShowModal(true)
    }

    // Получение цвета и иконки для стратегии
    const getStrategyConfig = (strategy: TriggerStrategy) => {
        switch (strategy) {
            case 'Фиба': return { color: 'bg-purple-500/20 text-purple-400', icon: Activity, label: 'Фиба' }
            case 'Market Entry': return { color: 'bg-green-500/20 text-green-400', icon: Target, label: 'ME' }
        }
    }

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



    // Get profit display text
    const getProfitDisplay = (profits: TriggerProfit[] | undefined) => {
        if (!profits || profits.length === 0) return '-'
        return profits.map(p => `${p.strategy}: ${p.value || '-'}`).join(', ')
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
                                    className={`px-4 py-2 rounded-xl text-sm font-semibold transition-all flex items-center gap-2 border ${theme === 'dark' ? 'bg-white/5 border-white/10 text-white' : 'bg-gray-100 border-gray-200 text-gray-900'}`}
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
                                        strategies: [],
                                        maxDropFromSignal: '',
                                        maxDropFromLevel07: '',
                                        profits: [],
                                        comment: '',
                                        isScam: false
                                    })
                                    setShowModal(true)
                                }}
                                className="px-4 py-2 rounded-xl bg-amber-500 hover:bg-amber-600 text-white font-semibold transition-colors flex items-center justify-center gap-2 shadow-lg shadow-amber-500/20"
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
                        <div className={`absolute top-0 right-0 -mt-10 -mr-10 w-40 h-40 rounded-full blur-3xl opacity-10 ${theme === 'dark' ? 'bg-white' : 'bg-amber-500'}`}></div>

                        <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 relative z-10">
                            <div className="flex items-center gap-3">
                                <div className={`p-2 rounded-xl border ${theme === 'dark' ? 'bg-white/5 border-white/10' : 'bg-amber-50 border-amber-100'}`}>
                                    <Filter className={`w-5 h-5 ${theme === 'dark' ? 'text-white' : 'text-amber-600'}`} />
                                </div>
                                <div className="flex flex-col">
                                    <h3 className={`text-lg font-bold tracking-tight ${headingColor}`}>Параметры ботов</h3>
                                    <p className={`text-[10px] font-medium uppercase tracking-widest ${subTextColor} opacity-60`}>Фильтрация независимых сигналов</p>
                                </div>
                            </div>

                            <div className="flex items-center gap-4">
                                <label className="flex items-center gap-3 cursor-pointer group/scam relative hover:scale-[1.02] transition-transform">
                                    <div className="relative">
                                        <input
                                            type="checkbox"
                                            checked={showScamOnly}
                                            onChange={(e) => setShowScamOnly(e.target.checked)}
                                            className="peer sr-only"
                                        />
                                        <div className={`w-10 h-5 rounded-full transition-all duration-300 ${theme === 'dark' ? 'bg-white/10' : 'bg-gray-200'} peer-checked:bg-rose-500`}></div>
                                        <div className="absolute top-0.5 left-0.5 w-4 h-4 bg-white rounded-full transition-all duration-300 peer-checked:translate-x-5 shadow-sm"></div>
                                    </div>
                                    <div className="flex flex-col">
                                        <span className={`text-[11px] font-bold uppercase tracking-wider ${showScamOnly ? 'text-rose-500' : subTextColor}`}>Scam Only</span>
                                        <span className="text-[9px] opacity-40 font-medium leading-none">Режим отсева</span>
                                    </div>
                                </label>
                            </div>
                        </div>

                        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-12 gap-6 relative z-10">
                            {/* Date Group */}
                            <div className="lg:col-span-3 space-y-4">
                                <div className="flex items-center gap-2 px-1">
                                    <Calendar className="w-3.5 h-3.5 text-blue-500" />
                                    <span className={`text-[11px] font-bold uppercase tracking-wider ${subTextColor}`}>Дата сигнала</span>
                                </div>
                                <div className="space-y-3">
                                    <PremiumInput
                                        icon={Search}
                                        type="date"
                                        label="Поиск по дню"
                                        value={specificDate}
                                        onChange={(e: React.ChangeEvent<HTMLInputElement>) => setSpecificDate(e.target.value)}
                                        theme={theme}
                                    />
                                    <div className="grid grid-cols-2 gap-3">
                                        <PremiumInput
                                            type="date"
                                            label="От"
                                            value={dateFrom}
                                            onChange={(e: React.ChangeEvent<HTMLInputElement>) => setDateFrom(e.target.value)}
                                            theme={theme}
                                        />
                                        <PremiumInput
                                            type="date"
                                            label="До"
                                            value={dateTo}
                                            onChange={(e: React.ChangeEvent<HTMLInputElement>) => setDateTo(e.target.value)}
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
                                        onChange={(e: React.ChangeEvent<HTMLInputElement>) => setMinDrop(e.target.value)}
                                        theme={theme}
                                    />
                                    <PremiumInput
                                        placeholder="Max"
                                        value={maxDrop}
                                        onChange={(e: React.ChangeEvent<HTMLInputElement>) => setMaxDrop(e.target.value)}
                                        theme={theme}
                                    />
                                </div>
                            </div>

                            {/* Strategy Group */}
                            <div className="lg:col-span-2 space-y-4">
                                <div className="flex items-center gap-2 px-1">
                                    <Target className="w-3.5 h-3.5 text-amber-500" />
                                    <span className={`text-[11px] font-bold uppercase tracking-wider ${subTextColor}`}>Стратегия</span>
                                </div>
                                <PremiumSelect
                                    value={strategyFilter}
                                    options={[
                                        { value: 'all', label: 'Все стратегии' },
                                        { value: 'Фиба', label: 'Фиба' },
                                        { value: 'Market Entry', label: 'Market Entry' }
                                    ]}
                                    onChange={(val: string) => setStrategyFilter(val as 'all' | 'Фиба' | 'Market Entry')}
                                    theme={theme}
                                />
                            </div>

                            {/* Profit/MC Group */}
                            <div className="lg:col-span-2 space-y-4">
                                <div className="flex items-center gap-2 px-1">
                                    <Coins className="w-3.5 h-3.5 text-emerald-500" />
                                    <span className={`text-[11px] font-bold uppercase tracking-wider ${subTextColor}`}>Профит / Кап</span>
                                </div>
                                <div className="space-y-3">
                                    <div className="grid grid-cols-2 gap-3">
                                        <PremiumInput
                                            icon={TrendingUp}
                                            placeholder="Min"
                                            value={minProfit}
                                            onChange={(e: React.ChangeEvent<HTMLInputElement>) => setMinProfit(e.target.value)}
                                            theme={theme}
                                        />
                                        <PremiumInput
                                            placeholder="Max"
                                            value={maxProfit}
                                            onChange={(e: React.ChangeEvent<HTMLInputElement>) => setMaxProfit(e.target.value)}
                                            theme={theme}
                                        />
                                    </div>
                                    <PremiumInput
                                        icon={Coins}
                                        placeholder="Market Cap (напр. 1M)"
                                        value={minMc}
                                        onChange={(e: React.ChangeEvent<HTMLInputElement>) => setMinMc(e.target.value)}
                                        theme={theme}
                                    />
                                </div>
                            </div>

                            {/* Sort Group */}
                            <div className="lg:col-span-3 space-y-4">
                                <div className="flex items-center gap-2 px-1">
                                    <Hash className="w-3.5 h-3.5 text-purple-500" />
                                    <span className={`text-[11px] font-bold uppercase tracking-wider ${subTextColor}`}>Сортировка</span>
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
                                            onChange={(val: string) => setSortBy(val as SortField)}
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
                                    <div className={`w-1.5 h-1.5 rounded-full ${filteredAlerts.length > 0 ? 'bg-amber-500 animate-pulse' : 'bg-rose-500'}`}></div>
                                    <span>Найдено: <span className={headingColor}>{filteredAlerts.length}</span></span>
                                </div>
                                <span className="opacity-30">|</span>
                                <span>Всего: <span className={headingColor}>{alerts.length}</span></span>
                            </div>

                            {hasActiveFilters && (
                                <button
                                    onClick={resetFilters}
                                    className="flex items-center gap-1.5 text-[11px] font-bold text-rose-500 hover:text-rose-400 transition-colors uppercase tracking-widest px-3 py-1.5 rounded-lg hover:bg-rose-500/10 active:scale-95"
                                >
                                    <RotateCcw className="w-3 h-3" />
                                    Очистить
                                </button>
                            )}
                        </div>
                    </div>
                )}

                <div className={`text-sm ${subTextColor} pt-2`}>
                    Показано сигналов: <span className={headingColor}>{filteredAlerts.length}</span> из <span className={headingColor}>{alerts.length}</span>
                </div>

                {/* Table */}
                <div className={`relative overflow-hidden rounded-3xl border ${cardBorder} ${cardShadow} ${cardBg}`}>
                    <div className="overflow-x-auto">
                        <table className="w-full text-left border-collapse">
                            <thead>
                                <tr className={`border-b ${theme === 'dark' ? 'border-white/10 bg-white/5' : 'border-gray-200 bg-gray-50'}`}>
                                    <th className={`p-1.5 sm:p-2 text-[10px] sm:text-xs uppercase tracking-wider font-semibold ${subTextColor} text-center w-8 border-r ${theme === 'dark' ? 'border-white/10' : 'border-gray-200'} last:border-r-0`}>#</th>
                                    <th className={`p-1.5 sm:p-2 text-[10px] sm:text-xs uppercase tracking-wider font-semibold ${subTextColor} text-center border-r ${theme === 'dark' ? 'border-white/10' : 'border-gray-200'} last:border-r-0`}>Дата</th>
                                    <th className={`p-1.5 sm:p-2 text-[10px] sm:text-xs uppercase tracking-wider font-semibold ${subTextColor} text-center border-r ${theme === 'dark' ? 'border-white/10' : 'border-gray-200'} last:border-r-0`}>Время</th>
                                    <th className={`p-1.5 sm:p-2 text-[10px] sm:text-xs uppercase tracking-wider font-semibold ${subTextColor} text-center border-r ${theme === 'dark' ? 'border-white/10' : 'border-gray-200'} last:border-r-0`}>Стратегии</th>
                                    <th className={`p-1.5 sm:p-2 text-[10px] sm:text-xs uppercase tracking-wider font-semibold ${subTextColor} text-center border-r ${theme === 'dark' ? 'border-white/10' : 'border-gray-200'} last:border-r-0`}>MC</th>
                                    <th className={`p-1.5 sm:p-2 text-[10px] sm:text-xs uppercase tracking-wider font-semibold ${subTextColor} text-center border-r ${theme === 'dark' ? 'border-white/10' : 'border-gray-200'} last:border-r-0`}>Адрес</th>
                                    <th className={`p-1.5 sm:p-2 text-[10px] sm:text-xs uppercase tracking-wider font-semibold ${subTextColor} text-center border-r ${theme === 'dark' ? 'border-white/10' : 'border-gray-200'} last:border-r-0`}>Drop</th>
                                    <th className={`p-1.5 sm:p-2 text-[10px] sm:text-xs uppercase tracking-wider font-semibold ${subTextColor} text-center border-r ${theme === 'dark' ? 'border-white/10' : 'border-gray-200'} last:border-r-0`}>Drop 0.7</th>
                                    <th className={`p-1.5 sm:p-2 text-[10px] sm:text-xs uppercase tracking-wider font-semibold ${subTextColor} text-center border-r ${theme === 'dark' ? 'border-white/10' : 'border-gray-200'} last:border-r-0`}>Профит</th>
                                    <th className={`p-1.5 sm:p-2 text-[10px] sm:text-xs uppercase tracking-wider font-semibold ${subTextColor} text-center border-r ${theme === 'dark' ? 'border-white/10' : 'border-gray-200'} last:border-r-0`}>Коммент</th>
                                    <th className={`p-1.5 sm:p-2 text-[10px] sm:text-xs uppercase tracking-wider font-semibold ${subTextColor} text-center border-r ${theme === 'dark' ? 'border-white/10' : 'border-gray-200'} last:border-r-0`}>Автор</th>
                                    <th className={`p-1.5 sm:p-2 text-[10px] sm:text-xs uppercase tracking-wider font-semibold ${subTextColor} text-center border-r ${theme === 'dark' ? 'border-white/10' : 'border-gray-200'} last:border-r-0`}>📷</th>
                                    <th className={`p-1.5 sm:p-2 text-[10px] sm:text-xs uppercase tracking-wider font-semibold ${subTextColor} text-center last:border-r-0`}>⚙</th>
                                </tr>
                            </thead>
                            <tbody className={`divide-y ${theme === 'dark' ? 'divide-white/5' : 'divide-gray-100'}`}>
                                {loading ? (
                                    <tr>
                                        <td colSpan={13} className="p-8 text-center text-gray-500">Загрузка...</td>
                                    </tr>
                                ) : filteredAlerts.length === 0 ? (
                                    <tr>
                                        <td colSpan={13} className="p-8 text-center text-gray-500">
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
                                                        <td colSpan={13} className="py-1">
                                                            <div className={`h-px ${theme === 'dark' ? 'bg-white/10' : 'bg-gray-200'}`}></div>
                                                        </td>
                                                    </tr>
                                                )
                                            }

                                            rows.push(
                                                <tr key={`header-${dateKey}`} className={`${theme === 'dark' ? 'bg-white/5' : 'bg-gray-50'}`}>
                                                    <td colSpan={13} className="p-2 px-3">
                                                        <span className={`text-xs sm:text-sm font-semibold ${subTextColor}`}>
                                                            {formatDateForDisplay(dateKey)}
                                                        </span>
                                                    </td>
                                                </tr>
                                            )

                                            dateAlerts.forEach((alert: TriggerAlert) => {
                                                const globalIndex = filteredAlerts.indexOf(alert) + 1;
                                                rows.push(
                                                    <tr key={alert.id} className={`${theme === 'dark' ? 'hover:bg-white/5' : 'hover:bg-gray-50'} transition-colors ${alert.isScam ? 'bg-red-500/10' : ''}`}>
                                                        <td className={`p-1.5 sm:p-2 text-center whitespace-nowrap border-r ${theme === 'dark' ? 'border-white/5' : 'border-gray-100'} last:border-r-0`}>
                                                            <div className={`font-mono text-[10px] sm:text-xs font-bold ${subTextColor}`}>{globalIndex}</div>
                                                        </td>
                                                        <td className={`p-1.5 sm:p-2 whitespace-nowrap text-center border-r ${theme === 'dark' ? 'border-white/5' : 'border-gray-100'} last:border-r-0`}>
                                                            <div className={`font-mono font-medium text-[10px] sm:text-xs ${headingColor}`}>{formatDateForDisplay(alert.signalDate)}</div>
                                                        </td>
                                                        <td className={`p-1.5 sm:p-2 whitespace-nowrap text-center border-r ${theme === 'dark' ? 'border-white/5' : 'border-gray-100'} last:border-r-0`}>
                                                            <div className={`font-mono text-[10px] sm:text-xs ${headingColor}`}>{alert.signalTime}</div>
                                                        </td>
                                                        <td className={`p-1.5 sm:p-2 whitespace-nowrap text-center border-r ${theme === 'dark' ? 'border-white/5' : 'border-gray-100'} last:border-r-0`}>
                                                            {alert.isScam ? (
                                                                <span className="text-red-500 font-bold text-[10px]">СКАМ</span>
                                                            ) : (
                                                                <div className="flex flex-wrap gap-0.5 justify-center">
                                                                    {alert.strategies?.map((strategy) => {
                                                                        const config = getStrategyConfig(strategy)
                                                                        const Icon = config.icon
                                                                        return (
                                                                            <span key={strategy} className={`inline-flex items-center gap-0.5 px-1 py-0.5 rounded text-[9px] font-semibold ${config.color}`}>
                                                                                <Icon className="w-2.5 h-2.5" />
                                                                                <span>{config.label}</span>
                                                                            </span>
                                                                        )
                                                                    }) || '-'}
                                                                </div>
                                                            )}
                                                        </td>
                                                        <td className={`p-1.5 sm:p-2 whitespace-nowrap text-center border-r ${theme === 'dark' ? 'border-white/5' : 'border-gray-100'} last:border-r-0`}>
                                                            <div className={`font-mono text-[10px] sm:text-xs ${headingColor}`}>{alert.marketCap || '-'}</div>
                                                        </td>
                                                        <td className={`p-1.5 sm:p-2 text-center border-r ${theme === 'dark' ? 'border-white/5' : 'border-gray-100'} last:border-r-0`}>
                                                            <div className="flex items-center justify-center gap-1">
                                                                <a
                                                                    href={`https://gmgn.ai/sol/token/${alert.address}`}
                                                                    target="_blank"
                                                                    rel="noopener noreferrer"
                                                                    className={`font-mono text-[10px] ${theme === 'dark' ? 'text-blue-400 hover:text-blue-300' : 'text-blue-600 hover:text-blue-500'} cursor-pointer`}
                                                                    title={alert.address}
                                                                >
                                                                    {truncateAddress(alert.address)}
                                                                </a>
                                                                <button
                                                                    onClick={() => handleCopy(alert.address, alert.id)}
                                                                    className={`p-1 rounded hover:bg-white/10 transition-colors ${subTextColor}`}
                                                                >
                                                                    {copyingId === alert.id ? <Check className="w-3 h-3 text-green-500" /> : <Copy className="w-3 h-3" />}
                                                                </button>
                                                            </div>
                                                        </td>
                                                        <td className={`p-1.5 sm:p-2 whitespace-nowrap text-center border-r ${theme === 'dark' ? 'border-white/5' : 'border-gray-100'} last:border-r-0`}>
                                                            <span className={`font-mono text-[10px] sm:text-xs ${alert.maxDropFromSignal && alert.maxDropFromSignal.startsWith('-') ? 'text-red-500' : headingColor}`}>
                                                                {alert.maxDropFromSignal || '-'}
                                                            </span>
                                                        </td>
                                                        <td className={`p-1.5 sm:p-2 whitespace-nowrap text-center border-r ${theme === 'dark' ? 'border-white/5' : 'border-gray-100'} last:border-r-0`}>
                                                            <span className={`font-mono text-[10px] sm:text-xs ${alert.maxDropFromLevel07 && alert.maxDropFromLevel07.startsWith('-') ? 'text-red-500' : headingColor}`}>
                                                                {alert.maxDropFromLevel07 || '-'}
                                                            </span>
                                                        </td>
                                                        <td className={`p-1.5 sm:p-2 whitespace-nowrap text-center border-r ${theme === 'dark' ? 'border-white/5' : 'border-gray-100'} last:border-r-0`}>
                                                            <span className="font-mono text-[10px] sm:text-xs text-green-500 font-bold">
                                                                {getProfitDisplay(alert.profits)}
                                                            </span>
                                                        </td>
                                                        <td className={`p-1.5 sm:p-2 text-center border-r ${theme === 'dark' ? 'border-white/5' : 'border-gray-100'} last:border-r-0`}>
                                                            <div className={`text-[10px] ${headingColor} break-words whitespace-pre-wrap max-w-[200px]`}>
                                                                {alert.comment || '-'}
                                                            </div>
                                                        </td>
                                                        <td className={`p-1.5 sm:p-2 text-center border-r ${theme === 'dark' ? 'border-white/5' : 'border-gray-100'} last:border-r-0`}>
                                                            <UserNickname userId={alert.createdBy} className="text-[10px] font-medium" />
                                                        </td>
                                                        <td className={`p-1.5 sm:p-2 whitespace-nowrap text-center border-r ${theme === 'dark' ? 'border-white/5' : 'border-gray-100'} last:border-r-0`}>
                                                            {alert.screenshot ? (
                                                                <button
                                                                    onClick={() => setPreviewImage(alert.screenshot || null)}
                                                                    className={`text-[10px] ${subTextColor} hover:text-amber-500 transition-colors cursor-pointer`}
                                                                    title="Просмотр фото"
                                                                >
                                                                    📷
                                                                </button>
                                                            ) : (
                                                                <span className={`text-[10px] ${subTextColor}`}>—</span>
                                                            )}
                                                        </td>
                                                        <td className={`p-1.5 sm:p-2 whitespace-nowrap text-center last:border-r-0`}>
                                                            <div className="flex items-center justify-center gap-0.5">
                                                                {(isAdmin || user?.id === alert.createdBy) && (
                                                                    <button
                                                                        onClick={() => handleEdit(alert)}
                                                                        className={`p-1 rounded-lg hover:bg-white/10 transition-colors ${theme === 'dark' ? 'text-blue-400' : 'text-blue-600'}`}
                                                                    >
                                                                        <Edit className="w-3 h-3" />
                                                                    </button>
                                                                )}
                                                                {isAdmin && (
                                                                    <button
                                                                        onClick={() => handleDelete(alert.id)}
                                                                        className="p-1 rounded-lg hover:bg-red-500/10 text-red-500 transition-colors"
                                                                    >
                                                                        <Trash2 size={16} className="w-3 h-3" />
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
                                    filteredAlerts.map((alert: TriggerAlert, index: number) => (
                                        <tr key={alert.id} className={`${theme === 'dark' ? 'hover:bg-white/5' : 'hover:bg-gray-50'} transition-colors ${alert.isScam ? 'bg-red-500/10' : ''}`}>
                                            <td className={`p-1.5 sm:p-2 text-center whitespace-nowrap border-r ${theme === 'dark' ? 'border-white/5' : 'border-gray-100'} last:border-r-0`}>
                                                <div className={`font-mono text-[10px] sm:text-xs font-bold ${subTextColor}`}>{index + 1}</div>
                                            </td>
                                            <td className={`p-1.5 sm:p-2 whitespace-nowrap text-center border-r ${theme === 'dark' ? 'border-white/5' : 'border-gray-100'} last:border-r-0`}>
                                                <div className={`font-mono font-medium text-[10px] sm:text-xs ${headingColor}`}>{formatDateForDisplay(alert.signalDate)}</div>
                                            </td>
                                            <td className={`p-1.5 sm:p-2 whitespace-nowrap text-center border-r ${theme === 'dark' ? 'border-white/5' : 'border-gray-100'} last:border-r-0`}>
                                                <div className={`font-mono text-[10px] sm:text-xs ${headingColor}`}>{alert.signalTime}</div>
                                            </td>
                                            <td className={`p-1.5 sm:p-2 whitespace-nowrap text-center border-r ${theme === 'dark' ? 'border-white/5' : 'border-gray-100'} last:border-r-0`}>
                                                {alert.isScam ? (
                                                    <span className="text-red-500 font-bold text-[10px]">СКАМ</span>
                                                ) : (
                                                    <div className="flex flex-wrap gap-0.5 justify-center">
                                                        {alert.strategies?.map((strategy) => {
                                                            const config = getStrategyConfig(strategy)
                                                            const Icon = config.icon
                                                            return (
                                                                <span key={strategy} className={`inline-flex items-center gap-0.5 px-1 py-0.5 rounded text-[9px] font-semibold ${config.color}`}>
                                                                    <Icon className="w-2.5 h-2.5" />
                                                                    <span>{config.label}</span>
                                                                </span>
                                                            )
                                                        }) || '-'}
                                                    </div>
                                                )}
                                            </td>
                                            <td className={`p-1.5 sm:p-2 whitespace-nowrap text-center border-r ${theme === 'dark' ? 'border-white/5' : 'border-gray-100'} last:border-r-0`}>
                                                <div className={`font-mono text-[10px] sm:text-xs ${headingColor}`}>{alert.marketCap || '-'}</div>
                                            </td>
                                            <td className={`p-1.5 sm:p-2 text-center border-r ${theme === 'dark' ? 'border-white/5' : 'border-gray-100'} last:border-r-0`}>
                                                <div className="flex items-center justify-center gap-1">
                                                    <a
                                                        href={`https://gmgn.ai/sol/token/${alert.address}`}
                                                        target="_blank"
                                                        rel="noopener noreferrer"
                                                        className={`font-mono text-[10px] ${theme === 'dark' ? 'text-blue-400 hover:text-blue-300' : 'text-blue-600 hover:text-blue-500'} cursor-pointer`}
                                                        title={alert.address}
                                                    >
                                                        {truncateAddress(alert.address)}
                                                    </a>
                                                    <button
                                                        onClick={() => handleCopy(alert.address, alert.id)}
                                                        className={`p-1 rounded hover:bg-white/10 transition-colors ${subTextColor}`}
                                                    >
                                                        {copyingId === alert.id ? <Check className="w-3 h-3 text-green-500" /> : <Copy className="w-3 h-3" />}
                                                    </button>
                                                </div>
                                            </td>
                                            <td className={`p-1.5 sm:p-2 whitespace-nowrap text-center border-r ${theme === 'dark' ? 'border-white/5' : 'border-gray-100'} last:border-r-0`}>
                                                <span className={`font-mono text-[10px] sm:text-xs ${alert.maxDropFromSignal && alert.maxDropFromSignal.startsWith('-') ? 'text-red-500' : headingColor}`}>
                                                    {alert.maxDropFromSignal || '-'}
                                                </span>
                                            </td>
                                            <td className={`p-1.5 sm:p-2 whitespace-nowrap text-center border-r ${theme === 'dark' ? 'border-white/5' : 'border-gray-100'} last:border-r-0`}>
                                                <span className={`font-mono text-[10px] sm:text-xs ${alert.maxDropFromLevel07 && alert.maxDropFromLevel07.startsWith('-') ? 'text-red-500' : headingColor}`}>
                                                    {alert.maxDropFromLevel07 || '-'}
                                                </span>
                                            </td>
                                            <td className={`p-1.5 sm:p-2 whitespace-nowrap text-center border-r ${theme === 'dark' ? 'border-white/5' : 'border-gray-100'} last:border-r-0`}>
                                                <span className="font-mono text-[10px] sm:text-xs text-green-500 font-bold">
                                                    {getProfitDisplay(alert.profits)}
                                                </span>
                                            </td>
                                            <td className={`p-1.5 sm:p-2 text-center border-r ${theme === 'dark' ? 'border-white/5' : 'border-gray-100'} last:border-r-0`}>
                                                <div className={`text-[10px] ${headingColor} break-words whitespace-pre-wrap max-w-[200px]`}>
                                                    {alert.comment || '-'}
                                                </div>
                                            </td>
                                            <td className={`p-1.5 sm:p-2 text-center border-r ${theme === 'dark' ? 'border-white/5' : 'border-gray-100'} last:border-r-0`}>
                                                <UserNickname userId={alert.createdBy} className="text-[10px] font-medium" />
                                            </td>
                                            <td className={`p-1.5 sm:p-2 whitespace-nowrap text-center border-r ${theme === 'dark' ? 'border-white/5' : 'border-gray-100'} last:border-r-0`}>
                                                {alert.screenshot ? (
                                                    <button
                                                        onClick={() => setPreviewImage(alert.screenshot || null)}
                                                        className={`text-[10px] ${subTextColor} hover:text-amber-500 transition-colors cursor-pointer`}
                                                        title="Просмотр фото"
                                                    >
                                                        📷
                                                    </button>
                                                ) : (
                                                    <span className={`text-[10px] ${subTextColor}`}>—</span>
                                                )}
                                            </td>
                                            <td className={`p-1.5 sm:p-2 whitespace-nowrap text-center last:border-r-0`}>
                                                <div className="flex items-center justify-center gap-0.5">
                                                    {(isAdmin || user?.id === alert.createdBy) && (
                                                        <button
                                                            onClick={() => handleEdit(alert)}
                                                            className={`p-1 rounded-lg hover:bg-white/10 transition-colors ${theme === 'dark' ? 'text-blue-400' : 'text-blue-600'}`}
                                                        >
                                                            <Edit className="w-3 h-3" />
                                                        </button>
                                                    )}
                                                    {isAdmin && (
                                                        <button
                                                            onClick={() => handleDelete(alert.id)}
                                                            className="p-1 rounded-lg hover:bg-red-500/10 text-red-500 transition-colors"
                                                        >
                                                            <Trash2 size={16} className="w-3.5 h-3.5 sm:w-4 sm:h-4" />
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

            {/* Modals and Overlays */}
            {showModal && (
                <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm overflow-y-auto">
                    <div className={`w-full max-w-4xl rounded-[32px] ${cardBg} ${cardBorder} border shadow-2xl overflow-hidden my-auto flex flex-col relative`}>
                        {/* Decorative Background Elements */}
                        <div className="absolute top-0 right-0 w-64 h-64 bg-amber-500/10 rounded-full blur-[100px] -mr-32 -mt-32"></div>
                        <div className="absolute bottom-0 left-0 w-64 h-64 bg-amber-500/5 rounded-full blur-[100px] -ml-32 -mb-32"></div>

                        {/* Header */}
                        <div className="p-8 border-b border-white/5 flex items-center justify-between relative z-10">
                            <div>
                                <div className="flex items-center gap-3 mb-1">
                                    <div className="w-10 h-10 rounded-2xl bg-amber-500/20 flex items-center justify-center">
                                        <Zap className="w-6 h-6 text-amber-500" />
                                    </div>
                                    <h3 className={`text-2xl font-black uppercase tracking-tight ${headingColor}`}>
                                        {editingAlert ? 'Редактировать сигнал' : 'Добавить сигналы'}
                                    </h3>
                                </div>
                                {!editingAlert && (
                                    <p className={`text-sm ${subTextColor} font-medium`}>Сигналы будут сгруппированы за выбранную дату</p>
                                )}
                            </div>
                            <button
                                onClick={() => {
                                    setShowModal(false)
                                    setEditingAlert(null)
                                    setAlertsToAdd([])
                                    setFormData({
                                        signalTime: new Date().toLocaleTimeString('ru-RU', { hour: '2-digit', minute: '2-digit' }),
                                        marketCap: '',
                                        address: '',
                                        strategies: [],
                                        maxDropFromSignal: '',
                                        maxDropFromLevel07: '',
                                        comment: ''
                                    })
                                    setScreenshotPreview(null)
                                }}
                                className={`p-3 rounded-2xl ${theme === 'dark' ? 'hover:bg-white/5' : 'hover:bg-gray-100'} transition-all group active:scale-95`}
                            >
                                <X className={`w-6 h-6 ${subTextColor} group-hover:text-amber-500 transition-colors`} />
                            </button>
                        </div>

                        {/* Body */}
                        <div className="flex-1 overflow-y-auto p-6 lg:p-8 relative z-10">
                            <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 lg:gap-12">
                                {/* Left Column: Info */}
                                <div className="space-y-6">
                                    <div className="flex items-center gap-2 mb-2">
                                        <div className="w-1.5 h-1.5 rounded-full bg-amber-500 shadow-[0_0_8px_rgba(245,158,11,0.5)]"></div>
                                        <span className={`text-xs font-bold uppercase tracking-widest ${subTextColor} opacity-60`}>Основная информация</span>
                                    </div>

                                    <div className="grid grid-cols-2 gap-4">
                                        <div className="space-y-1.5">
                                            <label className={`text-[10px] font-bold uppercase tracking-wider ml-1 ${subTextColor}`}>Дата сигнала</label>
                                            <div className="relative">
                                                <Calendar className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-500" />
                                                <input
                                                    type="date"
                                                    value={editingAlert?.signalDate || commonDate}
                                                    onChange={(e) => setCommonDate(e.target.value)}
                                                    className={`w-full pl-10 pr-4 py-3 rounded-xl border outline-none transition-all text-sm ${theme === 'dark' ? 'bg-black/20 border-white/5 text-white focus:border-amber-500/50' : 'bg-gray-50 border-gray-100 text-gray-900 focus:border-amber-500/30'}`}
                                                />
                                            </div>
                                        </div>

                                        <div className="space-y-1.5">
                                            <label className={`text-[10px] font-bold uppercase tracking-wider ml-1 ${subTextColor}`}>Время (UTC)</label>
                                            <div className="relative">
                                                <Clock className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-500" />
                                                <input
                                                    type="time"
                                                    value={formData.signalTime}
                                                    onChange={(e) => setFormData({ ...formData, signalTime: e.target.value })}
                                                    className={`w-full pl-10 pr-4 py-3 rounded-xl border outline-none transition-all text-sm ${theme === 'dark' ? 'bg-black/20 border-white/5 text-white focus:border-amber-500/50' : 'bg-gray-50 border-gray-100 text-gray-900 focus:border-amber-500/30'}`}
                                                />
                                            </div>
                                        </div>
                                    </div>

                                    <div className="grid grid-cols-1 gap-4">
                                        <PremiumInput
                                            icon={Activity}
                                            label="Market Cap"
                                            placeholder="Напр. 300,77"
                                            value={formData.marketCap || ''}
                                            onChange={(e) => setFormData({ ...formData, marketCap: e.target.value })}
                                            theme={theme}
                                        />
                                    </div>

                                    <div className="grid grid-cols-2 gap-4">
                                        <PremiumInput
                                            icon={TrendingDown}
                                            label="Max Drop (Signal)"
                                            placeholder="Напр. -16"
                                            value={formData.maxDropFromSignal || ''}
                                            onChange={(e) => setFormData({ ...formData, maxDropFromSignal: e.target.value })}
                                            theme={theme}
                                        />
                                        <PremiumInput
                                            icon={TrendingDown}
                                            label="Max Drop (0.7)"
                                            placeholder="Напр. -5"
                                            value={formData.maxDropFromLevel07 || ''}
                                            onChange={(e) => setFormData({ ...formData, maxDropFromLevel07: e.target.value })}
                                            theme={theme}
                                        />
                                    </div>

                                    <div className="space-y-1.5">
                                        <label className={`text-[10px] font-bold uppercase tracking-wider ml-1 ${subTextColor}`}>Комментарий</label>
                                        <div className="relative">
                                            <FileText className="absolute left-3 top-3 w-4 h-4 text-gray-500" />
                                            <textarea
                                                rows={2}
                                                placeholder="Дополнительные детали..."
                                                value={formData.comment || ''}
                                                onChange={(e) => setFormData({ ...formData, comment: e.target.value })}
                                                className={`w-full pl-10 pr-4 py-3 rounded-xl border outline-none transition-all text-sm resize-none ${theme === 'dark' ? 'bg-black/20 border-white/5 text-white focus:border-amber-500/50' : 'bg-gray-50 border-gray-100 text-gray-900 focus:border-amber-500/30'}`}
                                            />
                                        </div>
                                    </div>

                                    <div className={`p-4 rounded-2xl border transition-all ${formData.isScam ? 'border-rose-500/50 bg-rose-500/5' : 'border-white/5 bg-white/5'}`}>
                                        <div className="flex items-center justify-between">
                                            <div className="flex items-center gap-3">
                                                <div className={`w-10 h-10 rounded-xl flex items-center justify-center ${formData.isScam ? 'bg-rose-500 text-white shadow-lg shadow-rose-500/20' : 'bg-white/10 text-gray-500'}`}>
                                                    <AlertTriangle className="w-5 h-5" />
                                                </div>
                                                <div>
                                                    <p className={`text-sm font-bold ${formData.isScam ? 'text-rose-500' : headingColor}`}>Scam Alert</p>
                                                    <p className={`text-[10px] ${subTextColor} opacity-60`}>Пометить как мошеннический</p>
                                                </div>
                                            </div>
                                            <button
                                                type="button"
                                                onClick={() => setFormData({ ...formData, isScam: !formData.isScam })}
                                                className={`w-12 h-6 rounded-full relative transition-all duration-300 ${formData.isScam ? 'bg-rose-500 shadow-lg shadow-rose-500/40' : 'bg-gray-700'}`}
                                            >
                                                <div className={`absolute top-1 w-4 h-4 rounded-full bg-white transition-all duration-300 shadow-sm ${formData.isScam ? 'left-7' : 'left-1'}`}></div>
                                            </button>
                                        </div>
                                    </div>
                                </div>

                                {/* Right Column: Strategy & Address */}
                                <div className="space-y-6">
                                    <div className="flex items-center gap-2 mb-2">
                                        <div className="w-1.5 h-1.5 rounded-full bg-amber-500 shadow-[0_0_8px_rgba(245,158,11,0.5)]"></div>
                                        <span className={`text-xs font-bold uppercase tracking-widest ${subTextColor} opacity-60`}>Стратегия и медиа</span>
                                    </div>

                                    <MultiStrategySelector
                                        strategies={formData.strategies || []}
                                        profits={profitsInput}
                                        onChange={(strategies, profits) => {
                                            setFormData({ ...formData, strategies })
                                            setProfitsInput(profits)
                                        }}
                                        theme={theme}
                                        color="orange"
                                    />

                                    <div className="space-y-1.5">
                                        <label className={`text-[10px] font-bold uppercase tracking-wider ml-1 ${subTextColor}`}>Contract Address</label>
                                        <div className="relative">
                                            <Target className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-500" />
                                            <input
                                                type="text"
                                                placeholder="Введите адрес контракта..."
                                                value={formData.address}
                                                onChange={(e) => setFormData({ ...formData, address: e.target.value })}
                                                className={`w-full pl-10 pr-4 py-3 rounded-xl border outline-none transition-all text-sm font-mono ${theme === 'dark' ? 'bg-black/20 border-white/5 text-white focus:border-amber-500/50' : 'bg-gray-50 border-gray-100 text-gray-900 focus:border-amber-500/30'}`}
                                            />
                                        </div>
                                    </div>

                                    <div className="space-y-2">
                                        <label className={`text-[10px] font-bold uppercase tracking-wider ml-1 ${subTextColor}`}>Скриншот графика</label>
                                        <div
                                            onClick={() => fileInputRef.current?.click()}
                                            className={`group relative h-32 rounded-2xl border-2 border-dashed transition-all cursor-pointer overflow-hidden flex flex-col items-center justify-center gap-2
                                                    ${screenshotPreview
                                                    ? 'border-amber-500/50 bg-amber-500/5'
                                                    : 'border-white/10 hover:border-amber-500/30 hover:bg-white/5'}`}
                                        >
                                            {screenshotPreview ? (
                                                <>
                                                    <img src={screenshotPreview} alt="Preview" className="absolute inset-0 w-full h-full object-cover opacity-40" />
                                                    <div className="relative z-10 flex flex-col items-center gap-1">
                                                        <Check className="w-8 h-8 text-amber-500" />
                                                        <span className="text-xs font-bold text-amber-500 uppercase tracking-widest">Фото загружено</span>
                                                    </div>
                                                    <button
                                                        onClick={(e) => {
                                                            e.stopPropagation()
                                                            removeScreenshot()
                                                        }}
                                                        className="absolute top-2 right-2 p-1.5 rounded-lg bg-rose-500 text-white shadow-lg hover:scale-110 transition-transform"
                                                    >
                                                        <XCircle className="w-4 h-4" />
                                                    </button>
                                                </>
                                            ) : (
                                                <>
                                                    <div className="w-10 h-10 rounded-xl bg-white/5 flex items-center justify-center group-hover:scale-110 transition-transform">
                                                        <Upload className="w-5 h-5 text-gray-500" />
                                                    </div>
                                                    <div className="text-center">
                                                        <p className={`text-xs font-bold ${headingColor}`}>Нажмите для загрузки</p>
                                                        <p className={`text-[10px] ${subTextColor} opacity-60`}>PNG, JPG до 5MB</p>
                                                    </div>
                                                </>
                                            )}
                                        </div>
                                        <input ref={fileInputRef} type="file" accept="image/*" onChange={handleScreenshotChange} className="hidden" />
                                    </div>

                                    {!editingAlert && (
                                        <button
                                            type="button"
                                            onClick={handleAddToList}
                                            className="w-full py-4 rounded-2xl bg-amber-500 hover:bg-amber-600 text-white font-bold transition-all shadow-lg shadow-amber-500/20 active:scale-95 flex items-center justify-center gap-3"
                                        >
                                            <Plus className="w-5 h-5" />
                                            <span>Добавить в список</span>
                                        </button>
                                    )}

                                    {editingAlert && (
                                        <button
                                            type="button"
                                            onClick={handleSubmit}
                                            className="w-full py-4 rounded-2xl bg-amber-600 hover:bg-amber-700 text-white font-bold transition-all shadow-lg shadow-amber-600/20 active:scale-95 flex items-center justify-center gap-3"
                                        >
                                            <Save className="w-5 h-5" />
                                            <span>Сохранить изменения</span>
                                        </button>
                                    )}
                                </div>
                            </div>

                            {!editingAlert && alertsToAdd.length > 0 && (
                                <div className="mt-12 space-y-4 pt-8 border-t border-white/5">
                                    <div className="flex items-center justify-between">
                                        <div className="flex items-center gap-3">
                                            <div className="w-10 h-10 rounded-xl bg-amber-500/10 flex items-center justify-center">
                                                <Table className="w-5 h-5 text-amber-500" />
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
                                                    <th className={`p-4 font-bold ${subTextColor}`}>Strategies</th>
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
                                                            <div className="flex flex-wrap gap-1">
                                                                {alert.strategies?.map(s => (
                                                                    <span key={s} className="px-2 py-1 rounded-lg bg-amber-500/10 text-amber-500 text-[10px] font-bold uppercase">
                                                                        {s}
                                                                    </span>
                                                                ))}
                                                            </div>
                                                        </td>
                                                        <td className="p-4 text-right">
                                                            <button
                                                                onClick={() => setAlertsToAdd(alertsToAdd.filter((_, i) => i !== index))}
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

                                    <button
                                        onClick={handleSaveAll}
                                        className="w-full py-4 rounded-2xl bg-emerald-500 hover:bg-emerald-600 text-white font-black transition-all shadow-xl shadow-emerald-500/20 active:scale-95 flex items-center justify-center gap-3 mt-4"
                                    >
                                        <Check className="w-6 h-6 stroke-[3]" />
                                        <span className="text-lg">СОХРАНИТЬ ВСЕ ДАННЫЕ В БАЗУ</span>
                                    </button>
                                </div>
                            )}
                        </div>
                    </div>
                </div>
            )}

            {/* Image Preview Modal */}
            {previewImage && (
                <div
                    className="fixed inset-0 z-[100] flex items-center justify-center p-4 bg-black/90 backdrop-blur-sm cursor-zoom-out"
                    onClick={() => setPreviewImage(null)}
                >
                    <div className="relative max-w-5xl w-full max-h-[90vh] flex items-center justify-center">
                        <img
                            src={previewImage}
                            alt="Screenshot Preview"
                            className="max-w-full max-h-[90vh] object-contain rounded-xl shadow-2xl"
                        />
                        <button
                            onClick={(e) => {
                                e.stopPropagation();
                                setPreviewImage(null);
                            }}
                            className="absolute -top-12 right-0 p-2 text-white hover:text-amber-500 transition-colors"
                        >
                            <X size={32} />
                        </button>
                    </div>
                </div>
            )}
        </>
    )
}

// --- Premium Helper Components ---

interface PremiumInputProps {
    icon?: any;
    label?: string;
    placeholder?: string;
    value: string;
    onChange: (e: React.ChangeEvent<HTMLInputElement>) => void;
    type?: string;
    theme: string;
}

const PremiumInput: React.FC<PremiumInputProps> = ({ icon: Icon, label, placeholder, value, onChange, type = "text", theme }) => {
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
                            ? 'bg-white/5 border-white/5 text-white placeholder:text-gray-600 focus:bg-white/10 focus:border-amber-500/30 focus:ring-4 focus:ring-amber-500/5'
                            : 'bg-white border-gray-200 text-gray-900 placeholder:text-gray-400 focus:border-amber-500/30 focus:ring-4 focus:ring-amber-500/5 hover:border-gray-300'}`}
                />
            </div>
        </div>
    );
};

interface PremiumSelectProps {
    value: string;
    options: { value: string; label: string }[];
    onChange: (val: string) => void;
    theme: string;
}

const PremiumSelect: React.FC<PremiumSelectProps> = ({ value, options, onChange, theme }) => {
    const [isOpen, setIsOpen] = useState(false);
    const containerRef = useRef<HTMLDivElement>(null);
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
                    Сортировать по
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
                                        ? theme === 'dark' ? 'bg-amber-500/10 text-white' : 'bg-amber-500/10 text-amber-600'
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

export default SignalsTriggerBot


