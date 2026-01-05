import { useState, useEffect, useRef, useMemo } from 'react'
import { useThemeStore } from '@/store/themeStore'
import { useAuthStore } from '@/store/authStore'
import { getTriggerAlerts, addTriggerAlert, updateTriggerAlert, deleteTriggerAlert } from '@/services/firestoreService'
import { TriggerAlert, TriggerStrategy, TriggerProfit } from '@/types'
import { Plus, Edit, Trash2, Save, X, Copy, Check, Table, Filter, ArrowUp, ArrowDown, RotateCcw, Zap, Image, XCircle, Activity, Target } from 'lucide-react'
import { MultiStrategySelector } from '@/components/Management/MultiStrategySelector'

type SortField = 'date' | 'drop' | 'profit'
type SortOrder = 'asc' | 'desc'

export const SignalsTriggerBot = () => {
    const { theme } = useThemeStore()
    const { user } = useAuthStore()

    const [alerts, setAlerts] = useState<TriggerAlert[]>([])
    const [loading, setLoading] = useState(true)
    const [showModal, setShowModal] = useState(false)
    const [editingAlert, setEditingAlert] = useState<TriggerAlert | null>(null)
    const [copyingId, setCopyingId] = useState<string | null>(null)
    const [isCopyingTable, setIsCopyingTable] = useState(false)
    const [showSuccess, setShowSuccess] = useState(false)
    const [successCount, setSuccessCount] = useState(0)
    const [showConfirmSave, setShowConfirmSave] = useState(false)
    const [pendingAlertsCount, setPendingAlertsCount] = useState(0)
    const [successMessage, setSuccessMessage] = useState('')
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

    // Screenshot preview state
    const [screenshotPreview, setScreenshotPreview] = useState<string | null>(null)
    const fileInputRef = useRef<HTMLInputElement>(null)

    // Multiple profits input state
    const [profitsInput, setProfitsInput] = useState<{ strategy: TriggerStrategy; value: string }[]>([])

    // Common date for all alerts in batch mode
    const [commonDate, setCommonDate] = useState<string>(formData.signalDate || '')

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

        // Require strategies only if not marked as scam
        if (!formData.isScam && (!formData.strategies || formData.strategies.length === 0)) {
            alert('Выберите хотя бы одну стратегию')
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
    const handleRemoveFromList = (index: number) => {
        setAlertsToAdd(alertsToAdd.filter((_, i) => i !== index))
    }

    // Save all alerts to Firestore
    const handleSaveAll = async () => {
        if (alertsToAdd.length === 0) {
            alert('Добавьте хотя бы один сигнал')
            return
        }

        // Показываем окно подтверждения
        setPendingAlertsCount(alertsToAdd.length)
        setShowConfirmSave(true)
    }

    // Подтверждение сохранения
    const confirmSave = async () => {
        setShowConfirmSave(false)
        
        try {
            const promises = alertsToAdd.map(alert =>
                addTriggerAlert({
                    ...alert as TriggerAlert,
                    createdAt: new Date().toISOString(),
                    createdBy: user?.id || 'admin'
                })
            )
            await Promise.all(promises)

            // Show success animation
            setSuccessCount(pendingAlertsCount)
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

    // Add profit entry
    const addProfitEntry = () => {
        if (formData.strategies && formData.strategies.length > 0) {
            const availableStrategy = formData.strategies.find(
                s => !profitsInput.some(p => p.strategy === s)
            )
            if (availableStrategy) {
                setProfitsInput([...profitsInput, { strategy: availableStrategy, value: '' }])
            } else {
                alert('Все стратегии уже имеют профит')
            }
        }
    }

    // Update profit value
    const updateProfitValue = (strategy: TriggerStrategy, value: string) => {
        setProfitsInput(prev => prev.map(p => 
            p.strategy === strategy ? { ...p, value } : p
        ))
    }

    // Remove profit entry
    const removeProfitEntry = (strategy: TriggerStrategy) => {
        setProfitsInput(prev => prev.filter(p => p.strategy !== strategy))
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
                                        comment: ''
                                    })
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
                                <h4 className={`text-xs font-semibold uppercase ${subTextColor}`}>Макс. падение от сигнала (%)</h4>
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

                            {/* Strategy & Scam Filters */}
                            <div className="space-y-3">
                                <h4 className={`text-xs font-semibold uppercase ${subTextColor}`}>Стратегия и скам</h4>
                                <div className="space-y-2">
                                    <div>
                                        <label className={`text-xs ${subTextColor}`}>Стратегия</label>
                                        <select
                                            value={strategyFilter}
                                            onChange={(e) => setStrategyFilter(e.target.value as 'all' | 'Фиба' | 'Market Entry')}
                                            className={`w-full p-2 rounded-lg border text-sm outline-none mt-1 ${theme === 'dark' ? 'bg-black/30 border-white/10 text-white' : 'bg-white border-gray-200 text-gray-900'}`}
                                        >
                                            <option value="all">Все</option>
                                            <option value="Фиба">Фиба</option>
                                            <option value="Market Entry">Market Entry</option>
                                        </select>
                                    </div>
                                    <label className="flex items-center gap-2 cursor-pointer">
                                        <input
                                            type="checkbox"
                                            checked={showScamOnly}
                                            onChange={(e) => setShowScamOnly(e.target.checked)}
                                            className="rounded border-gray-300 text-red-500 focus:ring-red-500"
                                        />
                                        <span className={`text-sm ${theme === 'dark' ? 'text-white' : 'text-gray-900'}`}>Только скам</span>
                                    </label>
                                </div>
                            </div>

                            {/* Profit Filters */}
                            <div className="space-y-3">
                                <h4 className={`text-xs font-semibold uppercase ${subTextColor}`}>Макс. Профит (%)</h4>
                                <div className="grid grid-cols-2 gap-2">
                                    <div>
                                        <label className={`text-xs ${subTextColor}`}>Мин.</label>
                                        <input
                                            type="text"
                                            placeholder="10"
                                            value={minProfit}
                                            onChange={(e) => setMinProfit(e.target.value)}
                                            className={`w-full p-2 rounded-lg border text-sm outline-none mt-1 ${theme === 'dark' ? 'bg-black/30 border-white/10 text-white' : 'bg-white border-gray-200 text-gray-900'}`}
                                        />
                                    </div>
                                    <div>
                                        <label className={`text-xs ${subTextColor}`}>Макс.</label>
                                        <input
                                            type="text"
                                            placeholder="500"
                                            value={maxProfit}
                                            onChange={(e) => setMaxProfit(e.target.value)}
                                            className={`w-full p-2 rounded-lg border text-sm outline-none mt-1 ${theme === 'dark' ? 'bg-black/30 border-white/10 text-white' : 'bg-white border-gray-200 text-gray-900'}`}
                                        />
                                    </div>
                                </div>
                            </div>

                            {/* Market Cap Filters */}
                            <div className="space-y-3">
                                <h4 className={`text-xs font-semibold uppercase ${subTextColor}`}>Market Cap</h4>
                                <div className="grid grid-cols-2 gap-2">
                                    <div>
                                        <label className={`text-xs ${subTextColor}`}>Мин.</label>
                                        <input
                                            type="text"
                                            placeholder=" напр. 100K"
                                            value={minMc}
                                            onChange={(e) => setMinMc(e.target.value)}
                                            className={`w-full p-2 rounded-lg border text-sm outline-none mt-1 ${theme === 'dark' ? 'bg-black/30 border-white/10 text-white' : 'bg-white border-gray-200 text-gray-900'}`}
                                        />
                                    </div>
                                    <div>
                                        <label className={`text-xs ${subTextColor}`}>Макс.</label>
                                        <input
                                            type="text"
                                            placeholder="напр. 5M"
                                            value={maxMc}
                                            onChange={(e) => setMaxMc(e.target.value)}
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
                                        className={`w-full p-2 rounded-lg border text-sm flex items-center justify-center gap-2 transition-all ${theme === 'dark' ? 'bg-black/30 border-white/10 text-white hover:bg-white/10' : 'bg-white border-gray-200 text-gray-900 hover:bg-gray-100'}`}
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
                                    <th className={`p-2 sm:p-3 text-[10px] sm:text-xs uppercase tracking-wider font-semibold ${subTextColor} text-center`}>Дата</th>
                                    <th className={`p-2 sm:p-3 text-[10px] sm:text-xs uppercase tracking-wider font-semibold ${subTextColor} text-center`}>Время</th>
                                    <th className={`p-2 sm:p-3 text-[10px] sm:text-xs uppercase tracking-wider font-semibold ${subTextColor} text-center`}>Стратегии</th>
                                    <th className={`p-2 sm:p-3 text-[10px] sm:text-xs uppercase tracking-wider font-semibold ${subTextColor} text-center`}>MC</th>
                                    <th className={`p-2 sm:p-3 text-[10px] sm:text-xs uppercase tracking-wider font-semibold ${subTextColor} text-center`}>Адрес</th>
                                    <th className={`p-2 sm:p-3 text-[10px] sm:text-xs uppercase tracking-wider font-semibold ${subTextColor} text-center`}>Drop</th>
                                    <th className={`p-2 sm:p-3 text-[10px] sm:text-xs uppercase tracking-wider font-semibold ${subTextColor} text-center`}>Drop 0.7</th>
                                    <th className={`p-2 sm:p-3 text-[10px] sm:text-xs uppercase tracking-wider font-semibold ${subTextColor} text-center`}>Профит</th>
                                    <th className={`p-2 sm:p-3 text-[10px] sm:text-xs uppercase tracking-wider font-semibold ${subTextColor} text-center`}>Коммент</th>
                                    <th className={`p-2 sm:p-3 text-[10px] sm:text-xs uppercase tracking-wider font-semibold ${subTextColor} text-center`}>📷</th>
                                    <th className={`p-2 sm:p-3 text-[10px] sm:text-xs uppercase tracking-wider font-semibold ${subTextColor} text-center`}>⚙</th>
                                </tr>
                            </thead>
                            <tbody className={`divide-y ${theme === 'dark' ? 'divide-white/5' : 'divide-gray-100'}`}>
                                {loading ? (
                                    <tr>
                                        <td colSpan={12} className="p-8 text-center text-gray-500">Загрузка...</td>
                                    </tr>
                                ) : filteredAlerts.length === 0 ? (
                                    <tr>
                                        <td colSpan={12} className="p-8 text-center text-gray-500">
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
                                                        <td colSpan={12} className="py-1">
                                                            <div className={`h-px ${theme === 'dark' ? 'bg-white/10' : 'bg-gray-200'}`}></div>
                                                        </td>
                                                    </tr>
                                                )
                                            }

                                            rows.push(
                                                <tr key={`header-${dateKey}`} className={`${theme === 'dark' ? 'bg-white/5' : 'bg-gray-50'}`}>
                                                    <td colSpan={12} className="p-2 px-3">
                                                        <span className={`text-xs sm:text-sm font-semibold ${subTextColor}`}>
                                                            {formatDateForDisplay(dateKey)}
                                                        </span>
                                                    </td>
                                                </tr>
                                            )

                                            dateAlerts.forEach((alert: TriggerAlert) => {
                                                rows.push(
                                                    <tr key={alert.id} className={`${theme === 'dark' ? 'hover:bg-white/5' : 'hover:bg-gray-50'} transition-colors ${alert.isScam ? 'bg-red-500/10' : ''}`}>
                                                        <td className="p-2 sm:p-3 whitespace-nowrap text-center">
                                                            <div className={`font-mono font-medium text-xs sm:text-sm ${headingColor}`}>{formatDateForDisplay(alert.signalDate)}</div>
                                                        </td>
                                                        <td className="p-2 sm:p-3 whitespace-nowrap text-center">
                                                            <div className={`font-mono text-xs sm:text-sm ${headingColor}`}>{alert.signalTime}</div>
                                                        </td>
                                                        <td className="p-2 sm:p-3 whitespace-nowrap text-center">
                                                            {alert.isScam ? (
                                                                <span className="text-red-500 font-bold text-[10px] sm:text-xs">СКАМ</span>
                                                            ) : (
                                                                <div className="flex flex-wrap gap-0.5 justify-center">
                                                                    {alert.strategies?.map((strategy) => {
                                                                        const config = getStrategyConfig(strategy)
                                                                        const Icon = config.icon
                                                                        return (
                                                                            <span key={strategy} className={`inline-flex items-center gap-0.5 px-1.5 py-0.5 rounded text-[9px] sm:text-xs font-semibold ${config.color}`}>
                                                                                <Icon className="w-2.5 h-2.5 sm:w-3 sm:h-3" />
                                                                                <span>{config.label}</span>
                                                                            </span>
                                                                        )
                                                                    }) || '-'}
                                                                </div>
                                                            )}
                                                        </td>
                                                        <td className="p-2 sm:p-3 whitespace-nowrap text-center">
                                                            <div className={`font-mono text-xs sm:text-sm ${headingColor}`}>{alert.marketCap || '-'}</div>
                                                        </td>
                                                        <td className="p-2 sm:p-3 text-center">
                                                            <div className="flex items-center justify-center gap-1">
                                                                <a
                                                                    href={`https://gmgn.ai/sol/token/${alert.address}`}
                                                                    target="_blank"
                                                                    rel="noopener noreferrer"
                                                                    className={`font-mono text-[10px] sm:text-sm ${theme === 'dark' ? 'text-blue-400 hover:text-blue-300' : 'text-blue-600 hover:text-blue-500'} cursor-pointer`}
                                                                    title={alert.address}
                                                                >
                                                                    {truncateAddress(alert.address)}
                                                                </a>
                                                                <button
                                                                    onClick={() => handleCopy(alert.address, alert.id)}
                                                                    className={`p-1 rounded hover:bg-white/10 transition-colors ${subTextColor}`}
                                                                >
                                                                    {copyingId === alert.id ? <Check className="w-3 h-3 text-green-500" /> : <Copy className="w-3.5 h-3.5 sm:w-4 sm:h-4" />}
                                                                </button>
                                                            </div>
                                                        </td>
                                                        <td className="p-2 sm:p-3 whitespace-nowrap text-center">
                                                            <span className={`font-mono text-xs sm:text-sm ${alert.maxDropFromSignal && alert.maxDropFromSignal.startsWith('-') ? 'text-red-500' : headingColor}`}>
                                                                {alert.maxDropFromSignal || '-'}
                                                            </span>
                                                        </td>
                                                        <td className="p-2 sm:p-3 whitespace-nowrap text-center">
                                                            <span className={`font-mono text-xs sm:text-sm ${alert.maxDropFromLevel07 && alert.maxDropFromLevel07.startsWith('-') ? 'text-red-500' : headingColor}`}>
                                                                {alert.maxDropFromLevel07 || '-'}
                                                            </span>
                                                        </td>
                                                        <td className="p-2 sm:p-3 whitespace-nowrap text-center">
                                                            <span className="font-mono text-xs sm:text-sm text-green-500 font-bold">
                                                                {getProfitDisplay(alert.profits)}
                                                            </span>
                                                        </td>
                                                        <td className="p-2 sm:p-3 text-center">
                                                            <div className={`text-[10px] sm:text-sm ${headingColor} break-words whitespace-pre-wrap max-w-[250px] sm:max-w-[350px]`}>
                                                                {alert.comment || '-'}
                                                            </div>
                                                        </td>
                                                        <td className="p-2 sm:p-3 whitespace-nowrap text-center">
                                                            {alert.screenshot ? (
                                                                <button
                                                                    onClick={() => setPreviewImage(alert.screenshot || null)}
                                                                    className={`text-xs ${subTextColor} hover:text-amber-500 transition-colors cursor-pointer`}
                                                                    title="Просмотр фото"
                                                                >
                                                                    📷
                                                                </button>
                                                            ) : (
                                                                <span className={`text-xs ${subTextColor}`}>—</span>
                                                            )}
                                                        </td>
                                                        <td className="p-2 sm:p-3 whitespace-nowrap text-center">
                                                            <div className="flex items-center justify-center gap-0.5 sm:gap-1">
                                                                <button
                                                                    onClick={() => handleEdit(alert)}
                                                                    className={`p-1 sm:p-2 rounded-lg hover:bg-white/10 transition-colors ${theme === 'dark' ? 'text-blue-400' : 'text-blue-600'}`}
                                                                >
                                                                    <Edit className="w-3.5 h-3.5 sm:w-4 sm:h-4" />
                                                                </button>
                                                                <button
                                                                    onClick={() => handleDelete(alert.id)}
                                                                    className="p-1 sm:p-2 rounded-lg hover:bg-red-500/10 text-red-500 transition-colors"
                                                                >
                                                                    <Trash2 size={16} className="w-3.5 h-3.5 sm:w-4 sm:h-4" />
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
                                        <tr key={alert.id} className={`${theme === 'dark' ? 'hover:bg-white/5' : 'hover:bg-gray-50'} transition-colors ${alert.isScam ? 'bg-red-500/10' : ''}`}>
                                            <td className="p-2 sm:p-3 whitespace-nowrap text-center">
                                                <div className={`font-mono font-medium text-xs sm:text-sm ${headingColor}`}>{formatDateForDisplay(alert.signalDate)}</div>
                                            </td>
                                            <td className="p-2 sm:p-3 whitespace-nowrap text-center">
                                                <div className={`font-mono text-xs sm:text-sm ${headingColor}`}>{alert.signalTime}</div>
                                            </td>
                                            <td className="p-2 sm:p-3 whitespace-nowrap text-center">
                                                {alert.isScam ? (
                                                    <span className="text-red-500 font-bold text-[10px] sm:text-xs">СКАМ</span>
                                                ) : (
                                                    <div className="flex flex-wrap gap-0.5 justify-center">
                                                        {alert.strategies?.map((strategy) => {
                                                            const config = getStrategyConfig(strategy)
                                                            const Icon = config.icon
                                                            return (
                                                                <span key={strategy} className={`inline-flex items-center gap-0.5 px-1.5 py-0.5 rounded text-[9px] sm:text-xs font-semibold ${config.color}`}>
                                                                    <Icon className="w-2.5 h-2.5 sm:w-3 sm:h-3" />
                                                                    <span>{config.label}</span>
                                                                </span>
                                                            )
                                                        }) || '-'}
                                                    </div>
                                                )}
                                            </td>
                                            <td className="p-2 sm:p-3 whitespace-nowrap text-center">
                                                <div className={`font-mono text-xs sm:text-sm ${headingColor}`}>{alert.marketCap || '-'}</div>
                                            </td>
                                            <td className="p-2 sm:p-3 text-center">
                                                <div className="flex items-center justify-center gap-1">
                                                    <a
                                                        href={`https://gmgn.ai/sol/token/${alert.address}`}
                                                        target="_blank"
                                                        rel="noopener noreferrer"
                                                        className={`font-mono text-[10px] sm:text-sm ${theme === 'dark' ? 'text-blue-400 hover:text-blue-300' : 'text-blue-600 hover:text-blue-500'} cursor-pointer`}
                                                        title={alert.address}
                                                    >
                                                        {truncateAddress(alert.address)}
                                                    </a>
                                                    <button
                                                        onClick={() => handleCopy(alert.address, alert.id)}
                                                        className={`p-1 rounded hover:bg-white/10 transition-colors ${subTextColor}`}
                                                    >
                                                        {copyingId === alert.id ? <Check className="w-3 h-3 text-green-500" /> : <Copy className="w-3.5 h-3.5 sm:w-4 sm:h-4" />}
                                                    </button>
                                                </div>
                                            </td>
                                            <td className="p-2 sm:p-3 whitespace-nowrap text-center">
                                                <span className={`font-mono text-xs sm:text-sm ${alert.maxDropFromSignal && alert.maxDropFromSignal.startsWith('-') ? 'text-red-500' : headingColor}`}>
                                                    {alert.maxDropFromSignal || '-'}
                                                </span>
                                            </td>
                                            <td className="p-2 sm:p-3 whitespace-nowrap text-center">
                                                <span className={`font-mono text-xs sm:text-sm ${alert.maxDropFromLevel07 && alert.maxDropFromLevel07.startsWith('-') ? 'text-red-500' : headingColor}`}>
                                                    {alert.maxDropFromLevel07 || '-'}
                                                </span>
                                            </td>
                                            <td className="p-2 sm:p-3 whitespace-nowrap text-center">
                                                <span className="font-mono text-xs sm:text-sm text-green-500 font-bold">
                                                    {getProfitDisplay(alert.profits)}
                                                </span>
                                            </td>
                                            <td className="p-2 sm:p-3 text-center">
                                                <div className={`text-[10px] sm:text-sm ${headingColor} break-words whitespace-pre-wrap max-w-[250px] sm:max-w-[350px]`}>
                                                    {alert.comment || '-'}
                                                </div>
                                            </td>
                                            <td className="p-2 sm:p-3 whitespace-nowrap text-center">
                                                {alert.screenshot ? (
                                                    <button
                                                        onClick={() => setPreviewImage(alert.screenshot || null)}
                                                        className={`text-xs ${subTextColor} hover:text-amber-500 transition-colors cursor-pointer`}
                                                        title="Просмотр фото"
                                                    >
                                                        📷
                                                    </button>
                                                ) : (
                                                    <span className={`text-xs ${subTextColor}`}>—</span>
                                                )}
                                            </td>
                                            <td className="p-2 sm:p-3 whitespace-nowrap text-center">
                                                <div className="flex items-center justify-center gap-0.5 sm:gap-1">
                                                    <button
                                                        onClick={() => handleEdit(alert)}
                                                        className={`p-1 sm:p-2 rounded-lg hover:bg-white/10 transition-colors ${theme === 'dark' ? 'text-blue-400' : 'text-blue-600'}`}
                                                    >
                                                        <Edit className="w-3.5 h-3.5 sm:w-4 sm:h-4" />
                                                    </button>
                                                    <button
                                                        onClick={() => handleDelete(alert.id)}
                                                        className="p-1 sm:p-2 rounded-lg hover:bg-red-500/10 text-red-500 transition-colors"
                                                    >
                                                        <Trash2 size={16} className="w-3.5 h-3.5 sm:w-4 sm:h-4" />
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
                                setCommonDate(new Date().toISOString().split('T')[0])
                                setFormData({
                                    signalTime: new Date().toLocaleTimeString('ru-RU', { hour: '2-digit', minute: '2-digit' }),
                                    marketCap: '',
                                    address: '',
                                    strategies: [],
                                    maxDropFromSignal: '',
                                    maxDropFromLevel07: '',
                                    comment: ''
                                })
                            }} className={`p-2 rounded-lg hover:bg-white/10 transition-colors ${subTextColor}`}>
                                <X className="w-5 h-5" />
                            </button>
                        </div>

                        <div className="flex-1 overflow-y-auto p-6 space-y-6">
                            {/* Common Date */}
                            <div className="space-y-1">
                                <label className={`text-xs font-semibold uppercase ${subTextColor}`}>Дата</label>
                                <input
                                    type="date"
                                    value={editingAlert?.signalDate || commonDate || formData.signalDate || ''}
                                    onChange={(e) => {
                                        setCommonDate(e.target.value)
                                        setFormData({ ...formData, signalDate: e.target.value })
                                    }}
                                    className={`w-full p-3 rounded-xl border outline-none transition-all ${theme === 'dark' ? 'bg-black/30 border-white/10 text-white focus:border-amber-500' : 'bg-white border-gray-200 text-gray-900 focus:border-amber-500'}`}
                                />
                            </div>

                            {editingAlert ? (
                                <form onSubmit={handleSubmit} className="space-y-4">
                                    <div className="grid grid-cols-2 gap-4">
                                        <div className="space-y-1">
                                            <label className={`text-xs ${subTextColor}`}>Время</label>
                                            <input
                                                type="time"
                                                required
                                                value={formData.signalTime}
                                                onChange={(e) => setFormData({ ...formData, signalTime: e.target.value })}
                                                className={`w-full p-3 rounded-xl border outline-none transition-all ${theme === 'dark' ? 'bg-black/30 border-white/10 text-white focus-border-amber-500' : 'bg-white border-gray-200 text-gray-900 focus-border-amber-500'}`}
                                            />
                                        </div>
                                        <MultiStrategySelector
                                            value={formData.strategies || []}
                                            onChange={(strategies) => setFormData({ ...formData, strategies })}
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
                                                className={`w-full p-2 rounded-lg border text-sm outline-none mt-1 ${theme === 'dark' ? 'bg-black/30 border-white/10 text-white' : 'bg-white border-gray-200 text-gray-900'}`}
                                            />
                                        </div>
                                        <div className="space-y-1">
                                            <label className={`text-xs ${subTextColor}`}>Макс. падение от сигнала</label>
                                            <input
                                                type="text"
                                                placeholder="e.g. -16"
                                                value={formData.maxDropFromSignal || ''}
                                                onChange={(e) => setFormData({ ...formData, maxDropFromSignal: e.target.value })}
                                                className={`w-full p-2 rounded-lg border text-sm outline-none mt-1 ${theme === 'dark' ? 'bg-black/30 border-white/10 text-white' : 'bg-white border-gray-200 text-gray-900'}`}
                                            />
                                        </div>
                                        <div className="space-y-1">
                                            <label className={`text-xs ${subTextColor}`}>Макс. падение от 0.7</label>
                                            <input
                                                type="text"
                                                placeholder="e.g. -5"
                                                value={formData.maxDropFromLevel07 || ''}
                                                onChange={(e) => setFormData({ ...formData, maxDropFromLevel07: e.target.value })}
                                                className={`w-full p-2 rounded-lg border text-sm outline-none mt-1 ${theme === 'dark' ? 'bg-black/30 border-white/10 text-white' : 'bg-white border-gray-200 text-gray-900'}`}
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
                                            className={`w-full p-2 rounded-xl border outline-none transition-all font-mono text-sm ${theme === 'dark' ? 'bg-black/30 border-white/10 text-white focus-border-amber-500' : 'bg-white border-gray-200 text-gray-900'}`}
                                        />
                                    </div>

                                    {/* Multiple Profits Input */}
                                    {formData.strategies && formData.strategies.length > 0 && !formData.isScam && (
                                        <div className="space-y-2">
                                            <div className="flex items-center justify-between">
                                                <label className={`text-xs font-semibold uppercase ${subTextColor}`}>Профиты по стратегиям</label>
                                                <button
                                                    type="button"
                                                    onClick={addProfitEntry}
                                                    className="text-xs text-amber-500 hover:text-amber-400 transition-colors flex items-center gap-1"
                                                >
                                                    <Plus className="w-3 h-3" />
                                                    Добавить
                                                </button>
                                            </div>

                                            {profitsInput.length > 0 ? (
                                                <div className="space-y-2">
                                                    {profitsInput.map((profit, idx) => (
                                                        <div key={idx} className={`flex items-center gap-2 p-2 rounded-lg ${theme === 'dark' ? 'bg-black/30' : 'bg-gray-100'}`}>
                                                            <span className={`text-xs font-medium w-24 ${subTextColor}`}>
                                                                {profit.strategy}
                                                            </span>
                                                            <input
                                                                type="text"
                                                                placeholder="+28 или X3"
                                                                value={profit.value}
                                                                onChange={(e) => updateProfitValue(profit.strategy, e.target.value)}
                                                                className={`flex-1 p-1.5 rounded border text-sm outline-none ${theme === 'dark' ? 'bg-[#1a1f26] border-white/10 text-white' : 'bg-white border-gray-200 text-gray-900'}`}
                                                            />
                                                            <button
                                                                type="button"
                                                                onClick={() => removeProfitEntry(profit.strategy)}
                                                                className="p-1 rounded hover:bg-red-500/20 text-red-500 transition-colors"
                                                            >
                                                                <XCircle className="w-4 h-4" />
                                                            </button>
                                                        </div>
                                                    ))}
                                                </div>
                                            ) : (
                                                <p className={`text-xs ${subTextColor}`}>Выберите стратегии и добавьте профиты для каждой</p>
                                            )}
                                        </div>
                                    )}

                                    {/* Screenshot Upload */}
                                    <div className="space-y-2">
                                        <label className={`text-xs ${subTextColor}`}>Скриншот</label>
                                        <div className={`flex items-center gap-3 ${theme === 'dark' ? 'bg-black/30' : 'bg-gray-100'} p-3 rounded-xl border border-dashed ${theme === 'dark' ? 'border-white/10' : 'border-gray-300'}`}>
                                            {screenshotPreview ? (
                                                <div className="relative">
                                                    <img 
                                                        src={screenshotPreview} 
                                                        alt="Preview" 
                                                        className="w-16 h-16 object-cover rounded-lg"
                                                    />
                                                    <button
                                                        type="button"
                                                        onClick={removeScreenshot}
                                                        className="absolute -top-2 -right-2 p-0.5 rounded-full bg-red-500 text-white hover:bg-red-600 transition-colors"
                                                    >
                                                        <XCircle className="w-4 h-4" />
                                                    </button>
                                                </div>
                                            ) : (
                                                <label className="flex items-center gap-2 cursor-pointer text-amber-500 hover:text-amber-400 transition-colors">
                                                    <Image className="w-5 h-5" />
                                                    <span className="text-sm">Загрузить фото</span>
                                                    <input
                                                        ref={fileInputRef}
                                                        type="file"
                                                        accept="image/*"
                                                        onChange={handleScreenshotChange}
                                                        className="hidden"
                                                    />
                                                </label>
                                            )}
                                            {!screenshotPreview && (
                                                <span className={`text-xs ${subTextColor}`}>Макс. 5MB</span>
                                            )}
                                        </div>
                                    </div>

                                    {/* Is Scam checkbox */}
                                    <div className="flex items-center gap-3 p-3 rounded-xl bg-red-500/10 border border-red-500/20">
                                        <input
                                            type="checkbox"
                                            id="isScamNew"
                                            checked={formData.isScam || false}
                                            onChange={(e) => setFormData({ ...formData, isScam: e.target.checked })}
                                            className={`w-5 h-5 rounded border-2 ${theme === 'dark' ? 'border-gray-700 bg-gray-800' : 'border-gray-300 bg-white'} cursor-pointer accent-red-500`}
                                        />
                                        <label htmlFor="isScamNew" className="cursor-pointer">
                                            <span className={`text-sm font-semibold ${theme === 'dark' ? 'text-red-400' : 'text-red-600'}`}>Это скам</span>
                                            <p className={`text-xs ${subTextColor} mt-0.5`}>При отметке выбор стратегии необязателен</p>
                                        </label>
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
                                                <label className={`text-xs ${subTextColor}`}>Время</label>
                                                <input
                                                    type="time"
                                                    value={formData.signalTime}
                                                    onChange={(e) => setFormData({ ...formData, signalTime: e.target.value })}
                                                    className={`w-full p-2 rounded-lg border outline-none transition-all ${theme === 'dark' ? 'bg-black/30 border-white/10 text-white' : 'bg-white border-gray-200 text-gray-900'}`}
                                                />
                                            </div>
                                            <MultiStrategySelector
                                                value={formData.strategies || []}
                                                onChange={(strategies) => setFormData({ ...formData, strategies })}
                                                theme={theme}
                                            />
                                        </div>

                                        <div className="space-y-1">
                                            <label className={`text-xs ${subTextColor}`}>Адрес токена</label>
                                            <input
                                                type="text"
                                                placeholder="Адрес контракта..."
                                                value={formData.address || ''}
                                                onChange={(e) => setFormData({ ...formData, address: e.target.value })}
                                                className={`w-full p-2 rounded-lg border outline-none transition-all font-mono text-sm ${theme === 'dark' ? 'bg-black/30 border-white/10 text-white focus-border-amber-500' : 'bg-white border-gray-200 text-gray-900'}`}
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
                                                    className={`w-full p-2 rounded-lg border text-sm outline-none mt-1 ${theme === 'dark' ? 'bg-black/30 border-white/10 text-white' : 'bg-white border-gray-200 text-gray-900'}`}
                                                />
                                            </div>
                                            <div className="space-y-1">
                                                <label className={`text-xs ${subTextColor}`}>Макс. падение от сигнала</label>
                                                <input
                                                    type="text"
                                                    placeholder="e.g. -16"
                                                    value={formData.maxDropFromSignal || ''}
                                                    onChange={(e) => setFormData({ ...formData, maxDropFromSignal: e.target.value })}
                                                    className={`w-full p-2 rounded-lg border text-sm outline-none mt-1 ${theme === 'dark' ? 'bg-black/30 border-white/10 text-white' : 'bg-white border-gray-200 text-gray-900'}`}
                                                />
                                            </div>
                                            <div className="space-y-1">
                                                <label className={`text-xs ${subTextColor}`}>Макс. падение от 0.7</label>
                                                <input
                                                    type="text"
                                                    placeholder="e.g. -5"
                                                    value={formData.maxDropFromLevel07 || ''}
                                                    onChange={(e) => setFormData({ ...formData, maxDropFromLevel07: e.target.value })}
                                                    className={`w-full p-2 rounded-lg border text-sm outline-none mt-1 ${theme === 'dark' ? 'bg-black/30 border-white/10 text-white' : 'bg-white border-gray-200 text-gray-900'}`}
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
                                                className={`w-full p-2 rounded-xl border outline-none transition-all font-mono text-sm ${theme === 'dark' ? 'bg-black/30 border-white/10 text-white focus-border-amber-500' : 'bg-white border-gray-200 text-gray-900'}`}
                                            />
                                        </div>

                                        {/* Multiple Profits Input */}
                                        {formData.strategies && formData.strategies.length > 0 && !formData.isScam && (
                                            <div className="space-y-2">
                                                <div className="flex items-center justify-between">
                                                    <label className={`text-xs font-semibold uppercase ${subTextColor}`}>Профиты по стратегиям</label>
                                                    <button
                                                        type="button"
                                                        onClick={addProfitEntry}
                                                        className="text-xs text-amber-500 hover:text-amber-400 transition-colors flex items-center gap-1"
                                                    >
                                                        <Plus className="w-3 h-3" />
                                                        Добавить
                                                    </button>
                                                </div>
                                                
                                                {profitsInput.length > 0 ? (
                                                    <div className="space-y-2">
                                                        {profitsInput.map((profit, idx) => (
                                                            <div key={idx} className={`flex items-center gap-2 p-2 rounded-lg ${theme === 'dark' ? 'bg-black/30' : 'bg-gray-100'}`}>
                                                                <span className={`text-xs font-medium w-24 ${subTextColor}`}>
                                                                    {profit.strategy}
                                                                </span>
                                                                <input
                                                                    type="text"
                                                                    placeholder="+28 или X3"
                                                                    value={profit.value}
                                                                    onChange={(e) => updateProfitValue(profit.strategy, e.target.value)}
                                                                    className={`flex-1 p-1.5 rounded border text-sm outline-none ${theme === 'dark' ? 'bg-[#1a1f26] border-white/10 text-white' : 'bg-white border-gray-200 text-gray-900'}`}
                                                                />
                                                                <button
                                                                    type="button"
                                                                    onClick={() => removeProfitEntry(profit.strategy)}
                                                                    className="p-1 rounded hover:bg-red-500/20 text-red-500 transition-colors"
                                                                >
                                                                    <XCircle className="w-4 h-4" />
                                                                </button>
                                                            </div>
                                                        ))}
                                                    </div>
                                                ) : (
                                                    <p className={`text-xs ${subTextColor}`}>Выберите стратегии и добавьте профиты для каждой</p>
                                                )}
                                            </div>
                                        )}

                                        {/* Screenshot Upload */}
                                        <div className="space-y-2">
                                            <label className={`text-xs ${subTextColor}`}>Скриншот</label>
                                            <div className={`flex items-center gap-3 ${theme === 'dark' ? 'bg-black/30' : 'bg-gray-100'} p-3 rounded-xl border border-dashed ${theme === 'dark' ? 'border-white/10' : 'border-gray-300'}`}>
                                                {screenshotPreview ? (
                                                    <div className="relative">
                                                        <img 
                                                            src={screenshotPreview} 
                                                            alt="Preview" 
                                                            className="w-16 h-16 object-cover rounded-lg"
                                                        />
                                                        <button
                                                            type="button"
                                                            onClick={removeScreenshot}
                                                            className="absolute -top-2 -right-2 p-0.5 rounded-full bg-red-500 text-white hover:bg-red-600 transition-colors"
                                                        >
                                                            <XCircle className="w-4 h-4" />
                                                        </button>
                                                    </div>
                                                ) : (
                                                    <label className="flex items-center gap-2 cursor-pointer text-amber-500 hover:text-amber-400 transition-colors">
                                                        <Image className="w-5 h-5" />
                                                        <span className="text-sm">Загрузить фото</span>
                                                        <input
                                                            ref={fileInputRef}
                                                            type="file"
                                                            accept="image/*"
                                                            onChange={handleScreenshotChange}
                                                            className="hidden"
                                                        />
                                                    </label>
                                                )}
                                                {!screenshotPreview && (
                                                    <span className={`text-xs ${subTextColor}`}>Макс. 5MB</span>
                                                )}
                                            </div>
                                        </div>

                                        {/* Is Scam checkbox */}
                                        <div className="flex items-center gap-3 p-3 rounded-xl bg-red-500/10 border border-red-500/20">
                                            <input
                                                type="checkbox"
                                                id="isScamNew"
                                                checked={formData.isScam || false}
                                                onChange={(e) => setFormData({ ...formData, isScam: e.target.checked })}
                                                className={`w-5 h-5 rounded border-2 ${theme === 'dark' ? 'border-gray-700 bg-gray-800' : 'border-gray-300 bg-white'} cursor-pointer accent-red-500`}
                                            />
                                            <label htmlFor="isScamNew" className="cursor-pointer">
                                                <span className={`text-sm font-semibold ${theme === 'dark' ? 'text-red-400' : 'text-red-600'}`}>Это скам</span>
                                                <p className={`text-xs ${subTextColor} mt-0.5`}>При отметке выбор стратегии необязателен</p>
                                            </label>
                                        </div>

                                        <div className="pt-4 flex gap-3">
                                            <button
                                                type="button"
                                                onClick={() => {
                                                    setShowModal(false)
                                                    setAlertsToAdd([])
                                                    setFormData({
                                                        signalDate: new Date().toISOString().split('T')[0],
                                                        signalTime: new Date().toLocaleTimeString('ru-RU', { hour: '2-digit', minute: '2-digit' }),
                                                        marketCap: '',
                                                        address: '',
                                                        strategies: [],
                                                        maxDropFromSignal: '',
                                                        maxDropFromLevel07: '',
                                                        comment: ''
                                                    })
                                                }}
                                                className={`flex-1 py-3 rounded-xl font-semibold transition-colors ${theme === 'dark' ? 'bg-white/5 hover:bg-white/10 text-white' : 'bg-gray-100 hover:bg-gray-200 text-gray-800'}`}
                                            >
                                                Отмена
                                            </button>
                                            <button
                                                type="button"
                                                onClick={handleAddAlerts}
                                                className="flex-1 py-3 rounded-xl bg-amber-500 hover:bg-amber-600 text-white font-semibold transition-colors flex items-center justify-center gap-2"
                                            >
                                                <Plus className="w-4 h-4" />
                                                <span>Добавить</span>
                                            </button>
                                        </div>
                                    </div>
                                </>
                            )}
                        </div>
                    </div>
                </div>
            </>
        </>
    )
}

export default SignalsTriggerBot
}
}