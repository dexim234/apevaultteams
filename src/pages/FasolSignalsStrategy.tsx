import { useState, useEffect, useRef, useMemo } from 'react'
import { useThemeStore } from '@/store/themeStore'
import { useAuthStore } from '@/store/authStore'
import { useAdminStore } from '@/store/adminStore'
import { getFasolTriggerAlerts, addFasolTriggerAlert, updateFasolTriggerAlert, deleteFasolTriggerAlert } from '@/services/firestoreService'
import { FasolTriggerAlert, TriggerStrategy, TriggerProfit } from '@/types'
import { Plus, Edit, Trash2, Save, X, Copy, Check, Table, Filter, ArrowUp, ArrowDown, RotateCcw, Zap, Image, XCircle, Activity, Target } from 'lucide-react'
import { MultiStrategySelector } from '../components/Management/MultiStrategySelector'
import { UserNickname } from '../components/UserNickname'

type SortField = 'date' | 'drop' | 'profit'
type SortOrder = 'asc' | 'desc'

export const FasolSignalsStrategy = () => {
    const { theme } = useThemeStore()
    const { user } = useAuthStore()
    const { isAdmin } = useAdminStore()

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
                isScam: false
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

    const subTextColor = theme === 'dark' ? 'text-gray-400' : 'text-gray-600'
    const headingColor = theme === 'dark' ? 'text-white' : 'text-gray-900'
    const cardBg = theme === 'dark' ? 'bg-[#10141c]' : 'bg-white'
    const cardBorder = theme === 'dark' ? 'border-purple-500/30' : 'border-purple-500/20'
    const cardShadow = theme === 'dark' ? 'shadow-[0_24px_80px_rgba(0,0,0,0.45)]' : 'shadow-[0_24px_80px_rgba(0,0,0,0.15)]'

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
                                <Zap className={`w-8 h-8 ${theme === 'dark' ? 'text-white' : 'text-purple-500'}`} />
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
                    <div className={`rounded-3xl border ${cardBorder} ${cardBg} p-6 space-y-4`}>
                        <div className="flex items-center gap-2 mb-4">
                            <Filter className={`w-5 h-5 ${theme === 'dark' ? 'text-white' : 'text-gray-900'}`} />
                            <h3 className={`text-lg font-semibold ${headingColor}`}>Фильтры и сортировка</h3>
                        </div>

                        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
                            <div className="space-y-3">
                                <h4 className={`text-xs font-semibold uppercase ${subTextColor}`}>Дата</h4>
                                <div className="space-y-2">
                                    <div>
                                        <label className={`text-xs ${subTextColor}`}>Конкретная дата</label>
                                        <input type="date" value={specificDate} onChange={(e) => setSpecificDate(e.target.value)} className={`w-full p-2 rounded-lg border text-sm outline-none mt-1 ${theme === 'dark' ? 'bg-black/30 border-white/10 text-white' : 'bg-white border-gray-200 text-gray-900'}`} />
                                    </div>
                                    <div className="grid grid-cols-2 gap-2">
                                        <div><label className={`text-xs ${subTextColor}`}>От</label><input type="date" value={dateFrom} onChange={(e) => setDateFrom(e.target.value)} className={`w-full p-2 rounded-lg border text-sm outline-none mt-1 ${theme === 'dark' ? 'bg-black/30 border-white/10 text-white' : 'bg-white border-gray-200 text-gray-900'}`} /></div>
                                        <div><label className={`text-xs ${subTextColor}`}>До</label><input type="date" value={dateTo} onChange={(e) => setDateTo(e.target.value)} className={`w-full p-2 rounded-lg border text-sm outline-none mt-1 ${theme === 'dark' ? 'bg-black/30 border-white/10 text-white' : 'bg-white border-gray-200 text-gray-900'}`} /></div>
                                    </div>
                                </div>
                            </div>
                            <div className="space-y-3">
                                <h4 className={`text-xs font-semibold uppercase ${subTextColor}`}>Макс. падение (%)</h4>
                                <div className="grid grid-cols-2 gap-2">
                                    <div><label className={`text-xs ${subTextColor}`}>Мин.</label><input type="number" placeholder="-50" value={minDrop} onChange={(e) => setMinDrop(e.target.value)} className={`w-full p-2 rounded-lg border text-sm outline-none mt-1 ${theme === 'dark' ? 'bg-black/30 border-white/10 text-white' : 'bg-white border-gray-200 text-gray-900'}`} /></div>
                                    <div><label className={`text-xs ${subTextColor}`}>Макс.</label><input type="number" placeholder="-5" value={maxDrop} onChange={(e) => setMaxDrop(e.target.value)} className={`w-full p-2 rounded-lg border text-sm outline-none mt-1 ${theme === 'dark' ? 'bg-black/30 border-white/10 text-white' : 'bg-white border-gray-200 text-gray-900'}`} /></div>
                                </div>
                            </div>
                            <div className="space-y-3">
                                <h4 className={`text-xs font-semibold uppercase ${subTextColor}`}>Стратегия и скам</h4>
                                <div className="space-y-2">
                                    <select value={strategyFilter} onChange={(e) => setStrategyFilter(e.target.value as any)} className={`w-full p-2 rounded-lg border text-sm outline-none mt-1 ${theme === 'dark' ? 'bg-black/30 border-white/10 text-white' : 'bg-white border-gray-200 text-gray-900'}`}>
                                        <option value="all">Все</option>
                                        <option value="Фиба">Фиба</option>
                                        <option value="Market Entry">Market Entry</option>
                                    </select>
                                    <label className="flex items-center gap-2 cursor-pointer">
                                        <input type="checkbox" checked={showScamOnly} onChange={(e) => setShowScamOnly(e.target.checked)} className="rounded border-gray-300 text-red-500 focus:ring-red-500" />
                                        <span className={`text-sm ${theme === 'dark' ? 'text-white' : 'text-gray-900'}`}>Только скам</span>
                                    </label>
                                </div>
                            </div>
                            <div className="space-y-3">
                                <h4 className={`text-xs font-semibold uppercase ${subTextColor}`}>Сортировка</h4>
                                <div className="space-y-2">
                                    <select value={sortBy} onChange={(e) => setSortBy(e.target.value as SortField)} className={`w-full p-2 rounded-lg border outline-none transition-all ${theme === 'dark' ? 'bg-black/30 border-white/10 text-white' : 'bg-white border-gray-200 text-gray-900'}`}>
                                        <option value="date">По дате</option>
                                        <option value="drop">По падению</option>
                                        <option value="profit">По росту</option>
                                    </select>
                                    <button onClick={() => setSortOrder(sortOrder === 'asc' ? 'desc' : 'asc')} className={`w-full p-2 rounded-lg border text-sm flex items-center justify-center gap-2 transition-all ${theme === 'dark' ? 'bg-black/30 border-white/10 text-white hover:bg-white/10' : 'bg-white border-gray-200 text-gray-900 hover:bg-gray-100'}`}>
                                        {sortOrder === 'asc' ? <ArrowUp className="w-4 h-4" /> : <ArrowDown className="w-4 h-4" />}
                                        <span>{sortOrder === 'asc' ? 'По возрастанию' : 'По убыванию'}</span>
                                    </button>
                                </div>
                            </div>
                        </div>
                    </div>
                )}

                <div className={`relative overflow-hidden rounded-3xl border ${cardBorder} ${cardShadow} ${cardBg}`}>
                    <div className="overflow-x-auto">
                        <table className="w-full text-left border-collapse">
                            <thead>
                                <tr className={`border-b ${theme === 'dark' ? 'border-white/10 bg-white/5' : 'border-gray-200 bg-gray-50'}`}>
                                    {['Дата', 'Время', 'Setup', 'Стратегии', 'MC', 'Адрес', 'Drop', '0.7', 'Профит', 'Коммент', 'Автор', '📷', '⚙'].map(h => (
                                        <th key={h} className={`p-2 sm:p-3 text-[10px] sm:text-xs uppercase tracking-wider font-semibold ${subTextColor} text-center`}>{h}</th>
                                    ))}
                                </tr>
                            </thead>
                            <tbody className={`divide-y ${theme === 'dark' ? 'divide-white/5' : 'divide-gray-100'}`}>
                                {loading ? (<tr><td colSpan={11} className="p-8 text-center text-gray-500">Загрузка...</td></tr>) : filteredAlerts.length === 0 ? (<tr><td colSpan={11} className="p-8 text-center text-gray-500">Нет сигналов</td></tr>) : (
                                    filteredAlerts.map(alert => (
                                        <tr key={alert.id} className={`${theme === 'dark' ? 'hover:bg-white/5' : 'hover:bg-gray-50'} transition-colors ${alert.isScam ? 'bg-red-500/10' : ''}`}>
                                            <td className="p-2 sm:p-3 whitespace-nowrap text-center font-mono text-xs sm:text-sm">{formatDateForDisplay(alert.signalDate)}</td>
                                            <td className="p-2 sm:p-3 whitespace-nowrap text-center font-mono text-xs sm:text-sm">{alert.signalTime}</td>
                                            <td className="p-2 sm:p-3 text-center font-mono text-xs font-bold text-purple-400">{alert.setup || '-'}</td>
                                            <td className="p-2 sm:p-3 text-center">
                                                {alert.isScam ? <span className="text-red-500 font-bold text-[10px]">СКАМ</span> : (
                                                    <div className="flex flex-wrap gap-0.5 justify-center">
                                                        {alert.strategies?.map(s => {
                                                            const conf = getStrategyConfig(s); const Icon = conf.icon
                                                            return <span key={s} className={`inline-flex items-center gap-0.5 px-1 py-0.5 rounded text-[9px] font-semibold ${conf.color}`}><Icon size={10} />{conf.label}</span>
                                                        })}
                                                    </div>
                                                )}
                                            </td>
                                            <td className="p-2 sm:p-3 text-center font-mono text-xs">{alert.marketCap || '-'}</td>
                                            <td className="p-2 sm:p-3 text-center">
                                                <div className="flex items-center justify-center gap-1">
                                                    <a href={`https://gmgn.ai/sol/token/${alert.address}`} target="_blank" rel="noopener noreferrer" className={`font-mono text-[10px] sm:text-sm ${theme === 'dark' ? 'text-blue-400' : 'text-blue-600'}`}>{truncateAddress(alert.address)}</a>
                                                    <button onClick={() => handleCopy(alert.address, alert.id)} className={`p-1 rounded hover:bg-white/10 ${subTextColor}`}>
                                                        {copyingId === alert.id ? <Check size={12} className="text-green-500" /> : <Copy size={12} />}
                                                    </button>
                                                </div>
                                            </td>
                                            <td className="p-2 sm:p-3 text-center font-mono text-xs">{alert.maxDropFromSignal || '-'}</td>
                                            <td className="p-2 sm:p-3 text-center font-mono text-xs">{alert.maxDropFromLevel07 || '-'}</td>
                                            <td className="p-2 sm:p-3 text-center font-mono text-xs text-green-500 font-bold">{getProfitDisplay(alert.profits)}</td>
                                            <td className="p-2 sm:p-3 text-center"><div className="text-[10px] sm:text-xs truncate max-w-[150px] mx-auto">{alert.comment || '-'}</div></td>
                                            <td className="p-2 sm:p-3 text-center">
                                                <UserNickname userId={alert.createdBy} className="text-[10px] sm:text-xs font-medium" />
                                            </td>
                                            <td className="p-2 sm:p-3 text-center">{alert.screenshot ? <button onClick={() => setPreviewImage(alert.screenshot!)} className="text-xs">📷</button> : '—'}</td>
                                            <td className="p-2 sm:p-3 text-center">
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
                    <div className={`w-full max-w-2xl rounded-3xl ${cardBg} ${cardBorder} border shadow-2xl overflow-hidden max-h-[90vh] flex flex-col`}>
                        <div className={`p-6 border-b ${theme === 'dark' ? 'border-white/10' : 'border-gray-100'} flex items-center justify-between`}>
                            <h3 className={`text-xl font-bold ${headingColor}`}>{editingAlert ? 'Редактировать сигнал' : 'Добавить сигналы'}</h3>
                            <button onClick={() => setShowModal(false)} className={`p-2 rounded-lg hover:bg-white/10 ${subTextColor}`}><X size={20} /></button>
                        </div>
                        <div className="flex-1 overflow-y-auto p-6 space-y-6">
                            <div className="space-y-1"><label className="text-xs font-semibold uppercase">Дата</label><input type="date" value={commonDate} onChange={(e) => setCommonDate(e.target.value)} className="w-full p-2.5 rounded-xl border outline-none dark:bg-black/30" /></div>
                            {editingAlert ? (
                                <form onSubmit={handleSubmit} className="space-y-4">
                                    <div className="grid grid-cols-2 gap-4">
                                        <input type="time" value={formData.signalTime} onChange={e => setFormData({ ...formData, signalTime: e.target.value })} className="p-2.5 rounded-xl border dark:bg-black/30" />
                                        <MultiStrategySelector strategies={formData.strategies || []} profits={profitsInput} onChange={(s, p) => { setFormData({ ...formData, strategies: s }); setProfitsInput(p) }} theme={theme} />
                                    </div>
                                    <input type="text" placeholder="Адрес токена" value={formData.address || ''} onChange={e => setFormData({ ...formData, address: e.target.value })} className="w-full p-2.5 rounded-xl border dark:bg-black/30" />
                                    <div className="grid grid-cols-3 gap-2">
                                        <input placeholder="MC" value={formData.marketCap || ''} onChange={e => setFormData({ ...formData, marketCap: e.target.value })} className="p-2.5 rounded-xl border dark:bg-black/30" />
                                        <input placeholder="Drop" value={formData.maxDropFromSignal || ''} onChange={e => setFormData({ ...formData, maxDropFromSignal: e.target.value })} className="p-2.5 rounded-xl border dark:bg-black/30" />
                                        <input placeholder="0.7" value={formData.maxDropFromLevel07 || ''} onChange={e => setFormData({ ...formData, maxDropFromLevel07: e.target.value })} className="p-2.5 rounded-xl border dark:bg-black/30" />
                                    </div>
                                    <textarea placeholder="Комментарий" value={formData.comment || ''} onChange={e => setFormData({ ...formData, comment: e.target.value })} className="w-full p-2.5 rounded-xl border dark:bg-black/30" />
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
                                                <label className="flex items-center gap-2 cursor-pointer text-purple-500 hover:text-purple-400 transition-colors">
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
                                        </div>
                                    </div>

                                    <button type="submit" className="w-full py-3 rounded-xl bg-purple-600 text-white font-bold flex items-center justify-center gap-2">
                                        <Save className="w-4 h-4" />
                                        <span>Сохранить</span>
                                    </button>
                                </form>
                            ) : (
                                <div className="space-y-4">
                                    <div className="grid grid-cols-2 gap-4">
                                        <input type="time" value={formData.signalTime} onChange={e => setFormData({ ...formData, signalTime: e.target.value })} className="p-2.5 rounded-xl border dark:bg-black/30" />
                                        <MultiStrategySelector strategies={formData.strategies || []} profits={profitsInput} onChange={(s, p) => { setFormData({ ...formData, strategies: s }); setProfitsInput(p) }} theme={theme} />
                                    </div>
                                    <input type="text" placeholder="Адрес токена" value={formData.address || ''} onChange={e => setFormData({ ...formData, address: e.target.value })} className="w-full p-2.5 rounded-xl border dark:bg-black/30" />
                                    <div className="grid grid-cols-3 gap-2">
                                        <input placeholder="MC" value={formData.marketCap || ''} onChange={e => setFormData({ ...formData, marketCap: e.target.value })} className="p-2.5 rounded-xl border dark:bg-black/30" />
                                        <input placeholder="Drop" value={formData.maxDropFromSignal || ''} onChange={e => setFormData({ ...formData, maxDropFromSignal: e.target.value })} className="p-2.5 rounded-xl border dark:bg-black/30" />
                                        <input placeholder="0.7" value={formData.maxDropFromLevel07 || ''} onChange={e => setFormData({ ...formData, maxDropFromLevel07: e.target.value })} className="p-2.5 rounded-xl border dark:bg-black/30" />
                                    </div>

                                    {/* Screenshot Upload for new alerts */}
                                    <div className="space-y-2">
                                        <label className={`text-xs ${subTextColor}`}>Скриншот</label>
                                        <div className={`flex items-center gap-3 ${theme === 'dark' ? 'bg-black/30' : 'bg-gray-100'} p-3 rounded-xl border border-dashed ${theme === 'dark' ? 'border-white/10' : 'border-gray-300'}`}>
                                            {screenshotPreview ? (
                                                <div className="relative">
                                                    <img src={screenshotPreview} alt="Preview" className="w-16 h-16 object-cover rounded-lg" />
                                                    <button type="button" onClick={removeScreenshot} className="absolute -top-2 -right-2 p-0.5 rounded-full bg-red-500 text-white"><XCircle size={14} /></button>
                                                </div>
                                            ) : (
                                                <label className="flex items-center gap-2 cursor-pointer text-purple-500">
                                                    <Image size={18} />
                                                    <span className="text-sm">Загрузить фото</span>
                                                    <input ref={fileInputRef} type="file" accept="image/*" onChange={handleScreenshotChange} className="hidden" />
                                                </label>
                                            )}
                                        </div>
                                    </div>

                                    <button onClick={handleAddToList} className="w-full py-3 rounded-xl bg-purple-600 text-white font-bold">Добавить в список</button>
                                    {alertsToAdd.length > 0 && <button onClick={handleSaveAll} className="w-full py-3 rounded-xl bg-green-600 text-white font-bold">Сохранить все ({alertsToAdd.length})</button>}
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

export default FasolSignalsStrategy
