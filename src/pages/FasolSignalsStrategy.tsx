import { useState, useEffect, useRef, useMemo } from 'react'
import { useThemeStore } from '@/store/themeStore'
import { useAuthStore } from '@/store/authStore'
import { useAdminStore } from '@/store/adminStore'
import { getFasolTriggerAlerts, addFasolTriggerAlert, updateFasolTriggerAlert, deleteFasolTriggerAlert } from '@/services/firestoreService'
import { FasolTriggerAlert, TriggerStrategy, TriggerProfit } from '@/types'
import { Plus, Edit, Trash2, Save, X, Copy, Check, Table, Filter, ArrowUp, ArrowDown, RotateCcw, Activity, Target, TrendingUp, Calendar, ChevronDown, TrendingDown, Clock, AlertTriangle, FileText, Upload } from 'lucide-react'
import { MultiStrategySelector } from '../components/Management/MultiStrategySelector'
import { UserNickname } from '../components/UserNickname'

type SortField = 'date' | 'drop' | 'profit'
type SortOrder = 'asc' | 'desc'

export const FasolSignalsStrategy = () => {
    const { theme } = useThemeStore()
    const { user } = useAuthStore()
    const { isAdmin } = useAdminStore()

    const subTextColor = theme === 'dark' ? 'text-gray-400' : 'text-gray-500'
    const headingColor = theme === 'dark' ? 'text-white' : 'text-gray-900'
    const cardBg = theme === 'dark' ? 'bg-[#151a21]/80 backdrop-blur-xl' : 'bg-white/80 backdrop-blur-xl'
    const cardBorder = theme === 'dark' ? 'border-purple-500/30' : 'border-purple-500/20'
    const cardShadow = theme === 'dark' ? 'shadow-[0_8px_32px_rgba(0,0,0,0.4)]' : 'shadow-[0_8px_32px_rgba(0,0,0,0.08)]'

    const [alerts, setAlerts] = useState<FasolTriggerAlert[]>([])
    const [loading, setLoading] = useState(true)
    const [showModal, setShowModal] = useState(false)
    const [editingAlert, setEditingAlert] = useState<FasolTriggerAlert | null>(null)
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
    const [formData, setFormData] = useState<Partial<FasolTriggerAlert>>({
        signalDate: new Date().toISOString().split('T')[0],
        signalTime: new Date().toLocaleTimeString('ru-RU', { hour: '2-digit', minute: '2-digit' }),
        marketCap: '',
        address: '',
        strategies: [],
        maxDropFromSignal: '',
        maxDropFromLevel07: '',
        profits: [],
        comment: '',
        isScam: false,
        setup: 'One'
    })

    const [alertsToAdd, setAlertsToAdd] = useState<Partial<FasolTriggerAlert>[]>([])
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
            const data = await getFasolTriggerAlerts()
            setAlerts(data)
        } catch (error) {
            console.error('Error loading alerts:', error)
        } finally {
            setLoading(false)
        }
    }

    const handleAddToList = () => {
        if (!formData.address) {
            alert('Укажите адрес токена')
            return
        }

        if (!formData.isScam && (!formData.strategies || formData.strategies.length === 0)) {
            alert('Выберите стратегию или отметьте как скам')
            return
        }

        const newAlert: Partial<FasolTriggerAlert> = {
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
            isScam: formData.isScam || false,
            setup: formData.setup
        }

        setAlertsToAdd([...alertsToAdd, newAlert])

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

        setScreenshotPreview(null)
        setProfitsInput([])
    }

    const handleSaveAll = async () => {
        if (alertsToAdd.length === 0) {
            alert('Добавьте хотя бы один сигнал')
            return
        }

        try {
            const promises = alertsToAdd.map(alert =>
                addFasolTriggerAlert({
                    ...alert as FasolTriggerAlert,
                    createdAt: new Date().toISOString(),
                    createdBy: user?.id || 'admin'
                })
            )
            await Promise.all(promises)

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
                isScam: false,
                setup: 'One'
            })
            setScreenshotPreview(null)
            setProfitsInput([])
            setShowModal(false)
            await loadAlerts()
        } catch (error: any) {
            console.error('Error saving alerts:', error)
            alert('Ошибка при сохранении сигналов')
        }
    }

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
                await updateFasolTriggerAlert(editingAlert.id, alertData as FasolTriggerAlert)
            } else {
                await addFasolTriggerAlert({
                    ...alertData as FasolTriggerAlert,
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
          ${filteredAlerts.map((a: FasolTriggerAlert) => `
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

    const formatDateForDisplay = (dateStr: string) => {
        if (!dateStr) return '-'
        const parts = dateStr.split('-')
        if (parts.length !== 3) return dateStr
        const year = parts[0].slice(-2)
        return `${parts[2]}.${parts[1]}.${year}`
    }

    const truncateAddress = (address: string) => {
        if (!address) return '-'
        if (address.length <= 7) return address
        return `${address.slice(0, 3)}...${address.slice(-3)}`
    }

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

    const filteredAlerts = useMemo(() => {
        let result = [...alerts]
        if (specificDate) result = result.filter(a => a.signalDate === specificDate)
        if (dateFrom) result = result.filter(a => a.signalDate >= dateFrom)
        if (dateTo) result = result.filter(a => a.signalDate <= dateTo)
        if (showScamOnly) result = result.filter(a => a.isScam === true)
        if (strategyFilter !== 'all') {
            result = result.filter(a => a.isScam || (a.strategies && a.strategies.includes(strategyFilter)))
        }
        if (minDrop) {
            const minVal = parseFloat(minDrop)
            if (!isNaN(minVal)) result = result.filter(a => parseValue(a.maxDropFromSignal) >= minVal)
        }
        if (maxDrop) {
            const maxVal = parseFloat(maxDrop)
            if (!isNaN(maxVal)) result = result.filter(a => parseValue(a.maxDropFromSignal) <= maxVal)
        }
        if (minProfit) {
            const minVal = parseFloat(minProfit)
            if (!isNaN(minVal)) result = result.filter(a => parseValue(a.maxProfit) >= minVal)
        }
        if (maxProfit) {
            const maxVal = parseFloat(maxProfit)
            if (!isNaN(maxVal)) result = result.filter(a => parseValue(a.maxProfit) <= maxVal)
        }
        if (minMc) {
            const minVal = parseMarketCap(minMc)
            if (!isNaN(minVal) && minVal > 0) result = result.filter(a => parseMarketCap(a.marketCap) >= minVal)
        }
        if (maxMc) {
            const maxVal = parseMarketCap(maxMc)
            if (!isNaN(maxVal) && maxVal > 0) result = result.filter(a => parseMarketCap(a.marketCap) <= maxVal)
        }

        result.sort((a, b) => {
            let comparison = 0
            switch (sortBy) {
                case 'date':
                    comparison = a.signalDate.localeCompare(b.signalDate)
                    if (comparison === 0) {
                        comparison = a.signalTime.localeCompare(b.signalTime)
                    }
                    break
                case 'drop': comparison = parseValue(a.maxDropFromSignal) - parseValue(b.maxDropFromSignal); break
                case 'profit': comparison = parseValue(a.maxProfit) - parseValue(b.maxProfit); break
            }
            return sortOrder === 'asc' ? comparison : -comparison
        })
        return result
    }, [alerts, specificDate, dateFrom, dateTo, minDrop, maxDrop, minProfit, maxProfit, minMc, maxMc, strategyFilter, showScamOnly, sortBy, sortOrder])

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

    const hasActiveFilters = useMemo(() => {
        return specificDate || dateFrom || dateTo || minDrop || maxDrop || minProfit || maxProfit || minMc || maxMc || strategyFilter !== 'all' || showScamOnly || sortBy !== 'date' || sortOrder !== 'desc'
    }, [specificDate, dateFrom, dateTo, minDrop, maxDrop, minProfit, maxProfit, minMc, maxMc, strategyFilter, showScamOnly, sortBy, sortOrder])

    const handleDelete = async (id: string) => {
        if (!confirm('Удалить алерт?')) return
        try {
            await deleteFasolTriggerAlert(id)
            await loadAlerts()
        } catch (error) {
            console.error('Error deleting alert:', error)
        }
    }

    const handleEdit = (alert: FasolTriggerAlert) => {
        setEditingAlert(alert)
        setFormData(alert)
        setCommonDate(alert.signalDate || '')
        setProfitsInput(alert.profits || [])
        setScreenshotPreview(alert.screenshot || null)
        setShowModal(true)
    }

    const getStrategyConfig = (strategy: TriggerStrategy) => {
        switch (strategy) {
            case 'Фиба': return { color: 'bg-indigo-500/20 text-indigo-400', icon: Activity, label: 'Фиба' }
            case 'Market Entry': return { color: 'bg-purple-500/20 text-purple-400', icon: Target, label: 'ME' }
        }
    }

    const handleScreenshotChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const file = e.target.files?.[0]
        if (file) {
            if (file.size > 5 * 1024 * 1024) {
                alert('Файл слишком большой. Максимальный размер 5MB')
                return
            }
            const reader = new FileReader()
            reader.onloadend = () => setScreenshotPreview(reader.result as string)
            reader.readAsDataURL(file)
        }
    }

    const removeScreenshot = () => {
        setScreenshotPreview(null)
        if (fileInputRef.current) fileInputRef.current.value = ''
    }

    const getProfitDisplay = (profits: TriggerProfit[] | undefined) => {
        if (!profits || profits.length === 0) return '-'
        return profits.map(p => `${p.strategy}: ${p.value || '-'}`).join(', ')
    }

    return (
        <>
            <div className="space-y-6">
                <div className={`relative overflow-hidden rounded-3xl border ${cardBorder} ${cardShadow} ${cardBg}`}>
                    <div className="absolute inset-0 pointer-events-none">
                        <div className="absolute -left-16 -bottom-10 w-80 h-80 bg-purple-500/10 blur-3xl"></div>
                        <div className={`absolute inset-0 ${theme === 'dark' ? 'bg-[radial-gradient(circle_at_50%_0%,rgba(255,255,255,0.05),transparent_45%)]' : 'bg-[radial-gradient(circle_at_50%_0%,rgba(168,85,247,0.05),transparent_45%)]'}`}></div>
                    </div>

                    <div className="relative p-6 sm:p-8 flex flex-col lg:flex-row items-stretch lg:items-center justify-between gap-6">
                        <div className="flex items-center gap-4">
                            <div className={`p-3 rounded-2xl ${theme === 'dark' ? 'bg-white/10 border-white/20' : 'bg-purple-500/10 border-purple-500/30'} shadow-inner`}>
                                <TrendingUp className={`w-8 h-8 ${theme === 'dark' ? 'text-white' : 'text-purple-500'}`} />
                            </div>
                            <div className="flex flex-col">
                                <h1 className={`text-3xl font-black ${headingColor}`}>Fasol Signals Strategy</h1>
                                <p className={`text-sm ${subTextColor}`}>Trading Signals (Purple Edition)</p>
                            </div>
                        </div>

                        <div className="flex flex-wrap items-center gap-3">
                            <button
                                onClick={handleCopyTable}
                                disabled={filteredAlerts.length === 0}
                                className={`px-4 py-2 rounded-xl text-sm font-semibold transition-all flex items-center gap-2 border ${theme === 'dark' ? 'bg-white/5 border-white/10 hover:bg-white/10 text-gray-300' : 'bg-gray-100 border-gray-200 hover:bg-gray-200 text-gray-700'} disabled:opacity-50`}
                            >
                                {isCopyingTable ? (
                                    <><Check className="w-4 h-4 text-green-500" /><span>Таблица скопирована</span></>
                                ) : (
                                    <><Table className="w-4 h-4" /><span>Копировать ({filteredAlerts.length})</span></>
                                )}
                            </button>

                            <button
                                onClick={() => setShowFilters(!showFilters)}
                                className={`px-4 py-2 rounded-xl text-sm font-semibold transition-all flex items-center gap-2 border ${showFilters ? 'bg-purple-500 border-purple-500 text-white' : theme === 'dark' ? 'bg-white/5 border-white/10 hover:bg-white/10 text-gray-300' : 'bg-gray-100 border-gray-200 hover:bg-gray-100 text-gray-700'}`}
                            >
                                <Filter className="w-4 h-4" /><span>Фильтры</span>
                            </button>

                            {hasActiveFilters && (
                                <button onClick={resetFilters} className={`px-4 py-2 rounded-xl text-sm font-semibold transition-all flex items-center gap-2 border ${theme === 'dark' ? 'bg-white/5 border-white/10 text-white' : 'bg-gray-100 border-gray-200 text-gray-900'}`}>
                                    <RotateCcw className="w-4 h-4" /><span>Сброс</span>
                                </button>
                            )}

                            <button
                                onClick={() => {
                                    setEditingAlert(null)
                                    setAlertsToAdd([])
                                    setCommonDate(new Date().toISOString().split('T')[0])
                                    setFormData({
                                        signalTime: new Date().toLocaleTimeString('ru-RU', { hour: '2-digit', minute: '2-digit' }),
                                        setup: 'One',
                                        marketCap: '', address: '', strategies: [], maxDropFromSignal: '', maxDropFromLevel07: '', profits: [], comment: '', isScam: false
                                    })
                                    setShowModal(true)
                                }}
                                className="px-4 py-2 rounded-xl bg-purple-600 hover:bg-purple-700 text-white font-semibold transition-colors flex items-center justify-center gap-2 shadow-lg shadow-purple-500/20"
                            >
                                <Plus className="w-4 h-4" /><span>Добавить сигнал</span>
                            </button>
                        </div>
                    </div>
                </div>

                {showFilters && (
                    <div className={`rounded-3xl border ${cardBorder} ${cardBg} p-6 space-y-6 animate-in fade-in slide-in-from-top-4 duration-300 shadow-xl relative overflow-hidden`}>
                        <div className="absolute top-0 right-0 w-32 h-32 bg-purple-500/5 blur-3xl -z-10"></div>

                        <div className="flex items-center justify-between border-b border-white/5 pb-4">
                            <div className="flex items-center gap-3">
                                <div className={`p-2 rounded-xl ${theme === 'dark' ? 'bg-purple-500/10 text-purple-400' : 'bg-purple-50 text-purple-600'}`}>
                                    <Filter size={18} />
                                </div>
                                <div>
                                    <h3 className={`text-sm font-bold uppercase tracking-tight ${headingColor}`}>Параметры фильтрации</h3>
                                    <p className={`text-[10px] ${subTextColor}`}>Настройте отображение сигналов</p>
                                </div>
                            </div>
                            <button
                                onClick={resetFilters}
                                className={`flex items-center gap-2 px-3 py-1.5 rounded-lg text-xs font-bold transition-all
                                ${theme === 'dark' ? 'hover:bg-white/5 text-gray-400 hover:text-white' : 'hover:bg-gray-100 text-gray-500 hover:text-gray-900'}`}
                            >
                                <RotateCcw size={14} />
                                Сбросить
                            </button>
                        </div>

                        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-y-6 gap-x-4">
                            {/* Date Filter */}
                            <PremiumInput
                                label="Конкретная дата"
                                type="date"
                                icon={Calendar}
                                placeholder="Выберите дату..."
                                value={specificDate}
                                onChange={(e: React.ChangeEvent<HTMLInputElement>) => setSpecificDate(e.target.value)}
                                theme={theme}
                            />

                            {/* Drop Filter */}
                            <div className="grid grid-cols-2 gap-2">
                                <PremiumInput
                                    label="Мин. падение"
                                    icon={TrendingDown}
                                    placeholder="-50"
                                    value={minDrop}
                                    onChange={(e: React.ChangeEvent<HTMLInputElement>) => setMinDrop(e.target.value)}
                                    theme={theme}
                                />
                                <PremiumInput
                                    label="Макс. падение"
                                    icon={TrendingDown}
                                    placeholder="-5"
                                    value={maxDrop}
                                    onChange={(e: React.ChangeEvent<HTMLInputElement>) => setMaxDrop(e.target.value)}
                                    theme={theme}
                                />
                            </div>

                            {/* Strategy Select */}
                            <div className="space-y-1.5">
                                <label className={`text-[10px] font-bold uppercase tracking-wider ml-1 opacity-50 ${theme === 'dark' ? 'text-gray-400' : 'text-gray-600'}`}>
                                    Стратегия
                                </label>
                                <div className="relative">
                                    <div className="absolute left-3 top-1/2 -translate-y-1/2 flex items-center pointer-events-none">
                                        <Activity size={14} className={theme === 'dark' ? 'text-gray-500' : 'text-gray-400'} />
                                    </div>
                                    <select
                                        value={strategyFilter}
                                        onChange={(e: React.ChangeEvent<HTMLSelectElement>) => setStrategyFilter(e.target.value as any)}
                                        className={`w-full pl-10 pr-4 py-2.5 rounded-xl border text-sm font-bold appearance-none transition-all outline-none shadow-sm
                                        ${theme === 'dark'
                                                ? 'bg-white/5 border-white/5 text-white focus:bg-white/10 focus:border-white/20'
                                                : 'bg-white border-gray-200 text-gray-900 focus:border-purple-500/30'}`}
                                    >
                                        <option value="all">Все стратегии</option>
                                        <option value="Фиба">Фиба</option>
                                        <option value="Market Entry">Market Entry</option>
                                    </select>
                                    <div className="absolute right-3 top-1/2 -translate-y-1/2 pointer-events-none">
                                        <ChevronDown size={14} className="text-gray-500" />
                                    </div>
                                </div>
                                <label className="flex items-center gap-2 mt-2 cursor-pointer group">
                                    <div className="relative flex items-center">
                                        <input
                                            type="checkbox"
                                            checked={showScamOnly}
                                            onChange={(e: React.ChangeEvent<HTMLInputElement>) => setShowScamOnly(e.target.checked)}
                                            className="w-4 h-4 rounded border-gray-300 text-red-500 focus:ring-red-500/20 transition-all cursor-pointer"
                                        />
                                    </div>
                                    <span className={`text-[11px] font-bold uppercase tracking-tight ${theme === 'dark' ? 'text-gray-400 group-hover:text-red-400' : 'text-gray-500 group-hover:text-red-600'} transition-colors`}>
                                        Только скам
                                    </span>
                                </label>
                            </div>

                            {/* Sorting Field */}
                            <PremiumSelect
                                theme={theme}
                                value={sortBy}
                                options={[
                                    { value: 'date', label: 'По дате сигнала' },
                                    { value: 'drop', label: 'По падению' },
                                    { value: 'profit', label: 'По профиту' }
                                ]}
                                onChange={(val: string) => setSortBy(val as SortField)}
                            />

                            {/* Sort Direction */}
                            <div className="space-y-1.5">
                                <label className={`text-[10px] font-bold uppercase tracking-wider ml-1 opacity-50 ${theme === 'dark' ? 'text-gray-400' : 'text-gray-600'}`}>
                                    Направление
                                </label>
                                <button
                                    onClick={() => setSortOrder(sortOrder === 'asc' ? 'desc' : 'asc')}
                                    className={`w-full flex items-center justify-center gap-2 px-4 py-2.5 rounded-xl border text-sm font-bold transition-all shadow-sm
                                    ${theme === 'dark'
                                            ? 'bg-white/5 border-white/10 text-white hover:bg-white/10 active:scale-95'
                                            : 'bg-white border-gray-200 text-gray-900 hover:bg-gray-50 active:scale-95'}`}
                                >
                                    {sortOrder === 'asc' ? <ArrowUp size={16} className="text-purple-500" /> : <ArrowDown size={16} className="text-purple-500" />}
                                    <span>{sortOrder === 'asc' ? 'По возрастанию' : 'По убыванию'}</span>
                                </button>
                            </div>
                        </div>
                    </div>
                )}

                <div className={`relative overflow-hidden rounded-3xl border ${cardBorder} ${cardShadow} ${cardBg}`}>
                    <div className="overflow-x-auto">
                        <table className="w-full text-left border-collapse">
                            <thead>
                                <tr className={`border-b ${theme === 'dark' ? 'border-white/10 bg-white/5' : 'border-gray-200 bg-gray-50'}`}>
                                    <th className={`p-2 sm:p-3 text-[10px] sm:text-xs uppercase tracking-wider font-semibold ${subTextColor} text-center w-10 border-r ${theme === 'dark' ? 'border-white/10' : 'border-gray-200'} last:border-r-0`}>#</th>
                                    {['Дата', 'Время', 'Стратегии', 'MC', 'Адрес', 'Drop', '0.7', 'Профит', 'Коммент', 'Автор', '📷', '⚙'].map(h => (
                                        <th key={h} className={`p-2 sm:p-3 text-[10px] sm:text-xs uppercase tracking-wider font-semibold ${subTextColor} text-center border-r ${theme === 'dark' ? 'border-white/10' : 'border-gray-200'} last:border-r-0`}>{h}</th>
                                    ))}
                                </tr>
                            </thead>
                            <tbody className={`divide-y ${theme === 'dark' ? 'divide-white/5' : 'divide-gray-100'}`}>
                                {loading ? (<tr><td colSpan={14} className="p-8 text-center text-gray-500">Загрузка...</td></tr>) : filteredAlerts.length === 0 ? (<tr><td colSpan={14} className="p-8 text-center text-gray-500">Нет сигналов</td></tr>) : (
                                    filteredAlerts.map((alert, index) => (
                                        <tr key={alert.id} className={`${theme === 'dark' ? 'hover:bg-white/5' : 'hover:bg-gray-50'} transition-colors ${alert.isScam ? 'bg-red-500/10' : ''}`}>
                                            <td className={`p-2 sm:p-3 text-center whitespace-nowrap border-r ${theme === 'dark' ? 'border-white/5' : 'border-gray-100'} last:border-r-0`}>
                                                <div className={`font-mono text-[10px] sm:text-xs font-bold ${subTextColor}`}>{index + 1}</div>
                                            </td>
                                            <td className={`p-2 sm:p-3 whitespace-nowrap text-center font-mono text-xs sm:text-sm border-r ${theme === 'dark' ? 'border-white/5' : 'border-gray-100'} last:border-r-0`}>{formatDateForDisplay(alert.signalDate)}</td>
                                            <td className={`p-2 sm:p-3 whitespace-nowrap text-center font-mono text-xs sm:text-sm border-r ${theme === 'dark' ? 'border-white/5' : 'border-gray-100'} last:border-r-0`}>{alert.signalTime}</td>
                                            <td className={`p-2 sm:p-3 text-center border-r ${theme === 'dark' ? 'border-white/5' : 'border-gray-100'} last:border-r-0`}>
                                                {alert.isScam ? <span className="text-red-500 font-bold text-[10px]">СКАМ</span> : (
                                                    <div className="flex flex-wrap gap-0.5 justify-center">
                                                        {alert.strategies?.map(s => {
                                                            const conf = getStrategyConfig(s); const Icon = conf.icon
                                                            return <span key={s} className={`inline-flex items-center gap-0.5 px-1 py-0.5 rounded text-[9px] font-semibold ${conf.color}`}><Icon size={10} />{conf.label}</span>
                                                        })}
                                                    </div>
                                                )}
                                            </td>
                                            <td className={`p-2 sm:p-3 text-center font-mono text-xs border-r ${theme === 'dark' ? 'border-white/5' : 'border-gray-100'} last:border-r-0`}>{alert.marketCap || '-'}</td>
                                            <td className={`p-2 sm:p-3 text-center border-r ${theme === 'dark' ? 'border-white/5' : 'border-gray-100'} last:border-r-0`}>
                                                <div className="flex items-center justify-center gap-1">
                                                    <a href={`https://gmgn.ai/sol/token/${alert.address}`} target="_blank" rel="noopener noreferrer" className={`font-mono text-[10px] sm:text-sm ${theme === 'dark' ? 'text-blue-400' : 'text-blue-600'}`}>{truncateAddress(alert.address)}</a>
                                                    <button onClick={() => handleCopy(alert.address, alert.id)} className={`p-1 rounded hover:bg-white/10 ${subTextColor}`}>
                                                        {copyingId === alert.id ? <Check size={12} className="text-green-500" /> : <Copy size={12} />}
                                                    </button>
                                                </div>
                                            </td>
                                            <td className={`p-2 sm:p-3 text-center font-mono text-xs border-r ${theme === 'dark' ? 'border-white/5' : 'border-gray-100'} last:border-r-0`}>{alert.maxDropFromSignal || '-'}</td>
                                            <td className={`p-2 sm:p-3 text-center font-mono text-xs border-r ${theme === 'dark' ? 'border-white/5' : 'border-gray-100'} last:border-r-0`}>{alert.maxDropFromLevel07 || '-'}</td>
                                            <td className={`p-2 sm:p-3 text-center font-mono text-xs text-green-500 font-bold border-r ${theme === 'dark' ? 'border-white/5' : 'border-gray-100'} last:border-r-0`}>{getProfitDisplay(alert.profits)}</td>
                                            <td className={`p-2 sm:p-3 text-center border-r ${theme === 'dark' ? 'border-white/5' : 'border-gray-100'} last:border-r-0`}><div className="text-[10px] sm:text-xs truncate max-w-[150px] mx-auto">{alert.comment || '-'}</div></td>
                                            <td className={`p-2 sm:p-3 text-center border-r ${theme === 'dark' ? 'border-white/5' : 'border-gray-100'} last:border-r-0`}>
                                                <UserNickname userId={alert.createdBy} className="text-[10px] sm:text-xs font-medium" />
                                            </td>
                                            <td className={`p-2 sm:p-3 text-center border-r ${theme === 'dark' ? 'border-white/5' : 'border-gray-100'} last:border-r-0`}>{alert.screenshot ? <button onClick={() => setPreviewImage(alert.screenshot!)} className="text-xs">📷</button> : '—'}</td>
                                            <td className={`p-2 sm:p-3 text-center last:border-r-0`}>
                                                <div className="flex items-center justify-center gap-1">
                                                    {(isAdmin || user?.id === alert.createdBy) && (
                                                        <button onClick={() => handleEdit(alert)} className="p-1.5 rounded-lg hover:bg-white/10 text-blue-500"><Edit size={14} /></button>
                                                    )}
                                                    {isAdmin && (
                                                        <button onClick={() => handleDelete(alert.id)} className="p-1.5 rounded-lg hover:bg-red-500/10 text-red-500"><Trash2 size={14} /></button>
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

            {showModal && (
                <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm">
                    <div className={`w-full max-w-4xl rounded-3xl ${cardBg} ${cardBorder} border shadow-2xl overflow-hidden max-h-[90vh] flex flex-col`}>
                        <div className={`p-6 border-b ${theme === 'dark' ? 'border-white/10' : 'border-gray-100'} flex items-center justify-between`}>
                            <div className="space-y-1">
                                <h3 className={`text-xl font-bold ${headingColor}`}>Добавить новый сигнал</h3>
                                <p className={`text-xs ${subTextColor}`}>Заполните данные сигнала для добавления в журнал</p>
                            </div>
                            <button onClick={() => setShowModal(false)} className={`p-2 rounded-lg hover:bg-white/10 ${subTextColor}`}><X size={20} /></button>
                        </div>

                        <div className="flex-1 overflow-y-auto p-6">
                            <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
                                {/* Left Column: Basic Info */}
                                <div className="space-y-6">
                                    <div className="grid grid-cols-2 gap-4">
                                        <div className="space-y-1.5">
                                            <label className="text-[10px] font-bold uppercase tracking-wider opacity-50 ml-1">Дата сигнала</label>
                                            <div className="relative">
                                                <Calendar size={14} className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400 pointer-events-none" />
                                                <input type="date" value={commonDate} onChange={(e) => setCommonDate(e.target.value)} className={`w-full pl-10 pr-4 py-2.5 rounded-xl border outline-none text-sm font-semibold transition-all ${theme === 'dark' ? 'bg-black/30 border-white/10 focus:border-purple-500/50' : 'bg-gray-50 border-gray-200 focus:border-purple-500/30'}`} />
                                            </div>
                                        </div>
                                        <div className="space-y-1.5">
                                            <label className="text-[10px] font-bold uppercase tracking-wider opacity-50 ml-1">Время</label>
                                            <div className="relative">
                                                <Clock size={14} className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400 pointer-events-none" />
                                                <input type="time" value={formData.signalTime} onChange={e => setFormData({ ...formData, signalTime: e.target.value })} className={`w-full pl-10 pr-4 py-2.5 rounded-xl border outline-none text-sm font-semibold transition-all ${theme === 'dark' ? 'bg-black/30 border-white/10 focus:border-purple-500/50' : 'bg-gray-50 border-gray-200 focus:border-purple-500/30'}`} />
                                            </div>
                                        </div>
                                    </div>

                                    <div className="space-y-1.5">
                                        <label className="text-[10px] font-bold uppercase tracking-wider opacity-50 ml-1">Market Cap ($)</label>
                                        <div className="relative">
                                            <TrendingUp size={14} className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400 pointer-events-none" />
                                            <input placeholder="Например: 1.5M" value={formData.marketCap || ''} onChange={e => setFormData({ ...formData, marketCap: e.target.value })} className={`w-full pl-10 pr-4 py-2.5 rounded-xl border outline-none text-sm font-semibold transition-all ${theme === 'dark' ? 'bg-black/30 border-white/10 focus:border-purple-500/50' : 'bg-gray-50 border-gray-200 focus:border-purple-500/30'}`} />
                                        </div>
                                    </div>

                                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                                        <div className="space-y-1.5">
                                            <label className="text-[10px] font-bold uppercase tracking-wider opacity-50 ml-1">Max Drop от сигнала (%)</label>
                                            <div className="relative">
                                                <Activity size={14} className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400 pointer-events-none" />
                                                <input placeholder="-15%" value={formData.maxDropFromSignal || ''} onChange={e => setFormData({ ...formData, maxDropFromSignal: e.target.value })} className={`w-full pl-10 pr-4 py-2.5 rounded-xl border outline-none text-sm font-semibold transition-all ${theme === 'dark' ? 'bg-black/30 border-white/10 focus:border-purple-500/50' : 'bg-gray-50 border-gray-200 focus:border-purple-500/30'}`} />
                                            </div>
                                        </div>
                                        <div className="space-y-1.5">
                                            <label className="text-[10px] font-bold uppercase tracking-wider opacity-50 ml-1">Max Drop от 0.7 (%)</label>
                                            <div className="relative">
                                                <Activity size={14} className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400 pointer-events-none" />
                                                <input placeholder="-5%" value={formData.maxDropFromLevel07 || ''} onChange={e => setFormData({ ...formData, maxDropFromLevel07: e.target.value })} className={`w-full pl-10 pr-4 py-2.5 rounded-xl border outline-none text-sm font-semibold transition-all ${theme === 'dark' ? 'bg-black/30 border-white/10 focus:border-purple-500/50' : 'bg-gray-50 border-gray-200 focus:border-purple-500/30'}`} />
                                            </div>
                                        </div>
                                    </div>

                                    <div className="space-y-1.5">
                                        <label className="text-[10px] font-bold uppercase tracking-wider opacity-50 ml-1">Комментарий</label>
                                        <textarea placeholder="Заметки по сигналу..." value={formData.comment || ''} onChange={e => setFormData({ ...formData, comment: e.target.value })} rows={4} className={`w-full p-4 rounded-2xl border outline-none text-sm font-semibold transition-all resize-none ${theme === 'dark' ? 'bg-black/30 border-white/10 focus:border-purple-500/50' : 'bg-gray-50 border-gray-200 focus:border-purple-500/30'}`} />
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

                                {/* Right Column: Strategy & Media */}
                                <div className="space-y-6">
                                    <MultiStrategySelector
                                        strategies={formData.strategies || []}
                                        profits={profitsInput}
                                        onChange={(s, p) => { setFormData({ ...formData, strategies: s }); setProfitsInput(p) }}
                                        theme={theme}
                                        color="bg-purple-600"
                                    />

                                    <div className="space-y-1.5">
                                        <label className="text-[10px] font-bold uppercase tracking-wider opacity-50 ml-1">Contract Address</label>
                                        <div className="relative flex items-center">
                                            <FileText size={14} className="absolute left-3 text-gray-400 pointer-events-none" />
                                            <input placeholder="0x..." value={formData.address || ''} onChange={e => setFormData({ ...formData, address: e.target.value })} className={`w-full pl-10 pr-4 py-2.5 rounded-xl border outline-none text-sm font-semibold transition-all ${theme === 'dark' ? 'bg-black/30 border-white/10 focus:border-purple-500/50' : 'bg-gray-50 border-gray-200 focus:border-purple-500/30'}`} />
                                        </div>
                                    </div>

                                    <div className="space-y-1.5">
                                        <label className="text-[10px] font-bold uppercase tracking-wider opacity-50 ml-1">Скриншот / Фото</label>
                                        <div className={`relative group cursor-pointer rounded-2xl border-2 border-dashed transition-all ${theme === 'dark' ? 'bg-black/30 border-white/10 hover:border-white/20' : 'bg-gray-50 border-gray-300 hover:border-gray-400'}`}>
                                            {screenshotPreview ? (
                                                <div className="relative p-2 aspect-video">
                                                    <img src={screenshotPreview} alt="Preview" className="w-full h-full object-cover rounded-xl" />
                                                    <button type="button" onClick={removeScreenshot} className="absolute top-4 right-4 p-1.5 rounded-full bg-red-500 text-white shadow-lg hover:scale-110 transition-transform"><X size={16} /></button>
                                                </div>
                                            ) : (
                                                <label className="flex flex-col items-center justify-center p-8 cursor-pointer gap-3">
                                                    <Upload className="w-8 h-8 text-gray-500 group-hover:text-purple-500 transition-colors" />
                                                    <span className="text-sm font-bold text-gray-500 group-hover:text-purple-500 transition-colors">Загрузить изображение</span>
                                                    <input ref={fileInputRef} type="file" accept="image/*" onChange={handleScreenshotChange} className="hidden" />
                                                </label>
                                            )}
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
                                        <button onClick={handleSaveAll} className="flex-1 w-full py-4 rounded-2xl bg-sky-400 hover:bg-sky-500 text-[#0b1015] font-black flex items-center justify-center gap-2 transition-all shadow-lg shadow-sky-400/20">
                                            <Save className="w-5 h-5" />
                                            Сохранить все ({alertsToAdd.length})
                                        </button>
                                    )}
                                    {editingAlert && (
                                        <button onClick={handleSubmit} className="flex-1 w-full py-4 rounded-2xl bg-sky-400 hover:bg-sky-500 text-[#0b1015] font-black flex items-center justify-center gap-2 transition-all shadow-lg shadow-sky-400/20">
                                            <Save className="w-5 h-5" />
                                            Сохранить изменения
                                        </button>
                                    )}
                                </div>
                            )}

                            {editingAlert && (
                                <div className="mt-8 pt-6 border-t border-white/5">
                                    <button onClick={handleSubmit} className="w-full py-4 rounded-2xl bg-sky-400 hover:bg-sky-500 text-[#0b1015] font-black flex items-center justify-center gap-2 transition-all shadow-lg shadow-sky-400/20">
                                        <Save className="w-5 h-5" />
                                        Сохранить изменения
                                    </button>
                                </div>
                            )}

                            {/* Added Signals Preview */}
                            {!editingAlert && alertsToAdd.length > 0 && (
                                <div className="mt-8 space-y-4">
                                    <div className="flex items-center gap-2">
                                        <FileText size={16} className="text-purple-500" />
                                        <h4 className="text-sm font-black uppercase tracking-tight">Подготовленные сигналы</h4>
                                    </div>
                                    <div className={`rounded-2xl border ${theme === 'dark' ? 'bg-black/20 border-white/5' : 'bg-gray-50 border-gray-100'} overflow-hidden`}>
                                        <table className="w-full text-left">
                                            <thead>
                                                <tr className="border-b border-white/5 text-[10px] font-bold uppercase tracking-wider text-gray-500">
                                                    <th className="p-4">Дата</th>
                                                    <th className="p-4">Market Cap</th>
                                                    <th className="p-4">Стратегии</th>
                                                    <th className="p-4">Статус</th>
                                                    <th className="p-4 w-10"></th>
                                                </tr>
                                            </thead>
                                            <tbody className="divide-y divide-white/5">
                                                {alertsToAdd.map((alert, idx) => (
                                                    <tr key={idx} className="group hover:bg-white/5 transition-colors">
                                                        <td className="p-4 text-xs font-mono font-bold">{alert.signalDate} {alert.signalTime}</td>
                                                        <td className="p-4 text-xs font-bold text-green-500">${alert.marketCap}</td>
                                                        <td className="p-4">
                                                            <div className="flex gap-1">
                                                                {alert.strategies?.map(s => (
                                                                    <span key={s} className="px-1.5 py-0.5 rounded bg-purple-500/20 text-purple-400 text-[10px] font-bold">
                                                                        {s === 'Фиба' ? 'Fibo' : 'ME'}
                                                                    </span>
                                                                ))}
                                                            </div>
                                                        </td>
                                                        <td className="p-4">
                                                            <span className="text-[10px] font-bold px-2 py-0.5 rounded bg-white/5 text-gray-400">Active</span>
                                                        </td>
                                                        <td className="p-4">
                                                            <button onClick={() => setAlertsToAdd(alertsToAdd.filter((_, i) => i !== idx))} className="p-1.5 rounded-lg hover:bg-red-500/20 text-red-500 opacity-0 group-hover:opacity-100 transition-all"><Trash2 size={14} /></button>
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

            {previewImage && (
                <div className="fixed inset-0 z-[100] flex items-center justify-center bg-black/90 backdrop-blur-md p-4 cursor-zoom-out" onClick={() => setPreviewImage(null)}>
                    <img src={previewImage} alt="Preview" className="max-w-full max-h-[90vh] object-contain rounded-2xl" />
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
                            ? 'bg-white/5 border-white/5 text-white placeholder:text-gray-600 focus:bg-white/10 focus:border-white/20 focus:ring-4 focus:ring-white/5'
                            : 'bg-white border-gray-200 text-gray-900 placeholder:text-gray-400 focus:border-purple-500/30 focus:ring-4 focus:ring-purple-500/5 hover:border-gray-300'}`}
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
                                        ? theme === 'dark' ? 'bg-white/10 text-white' : 'bg-purple-500/10 text-purple-600'
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

export default FasolSignalsStrategy
