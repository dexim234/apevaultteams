import React, { useState, useEffect, useRef, useMemo } from 'react'
import { useThemeStore } from '@/store/themeStore'
import { useAuthStore } from '@/store/authStore'
import { useAdminStore } from '@/store/adminStore'
import { getAiAlerts, addAiAlert, updateAiAlert, deleteAiAlert } from '@/services/firestoreService'
import { AiAlert } from '@/types'
import { Plus, Edit, Trash2, Save, X, Copy, Check, Table, Filter, ArrowUp, ArrowDown, RotateCcw, Calendar, Hash, Coins, TrendingDown, TrendingUp, Activity, Clock, FileText, Image as ImageIcon } from 'lucide-react'
import { UserNickname } from '@/components/UserNickname'

type SortField = 'date' | 'drop' | 'profit'
type SortOrder = 'asc' | 'desc'

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
                screenshot: screenshotPreview || formData.screenshot
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

    // Filter and sort logic
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

        // Filter by min/max drop
        if (minDrop) {
            result = result.filter(a => a.maxDrop && parseFloat(a.maxDrop.replace('%', '').replace('X', '')) >= parseFloat(minDrop))
        }
        if (maxDrop) {
            result = result.filter(a => a.maxDrop && parseFloat(a.maxDrop.replace('%', '').replace('X', '')) <= parseFloat(maxDrop))
        }

        // Filter by min/max profit
        if (minProfit) {
            result = result.filter(a => a.maxProfit && parseFloat(a.maxProfit.replace('%', '').replace('X', '')) >= parseFloat(minProfit))
        }
        if (maxProfit) {
            result = result.filter(a => a.maxProfit && parseFloat(a.maxProfit.replace('%', '').replace('X', '')) <= parseFloat(maxProfit))
        }

        // Filter by market cap
        const parseMc = (mc: string) => {
            if (!mc) return 0
            const num = parseFloat(mc.replace(/[KMB]/i, ''))
            if (/K/i.test(mc)) return num * 1000
            if (/M/i.test(mc)) return num * 1000000
            if (/B/i.test(mc)) return num * 1000000000
            return num
        }

        if (minMc) {
            const minMcValue = parseMc(minMc)
            result = result.filter(a => parseMc(a.marketCap || '') >= minMcValue)
        }
        if (maxMc) {
            const maxMcValue = parseMc(maxMc)
            result = result.filter(a => parseMc(a.marketCap || '') <= maxMcValue)
        }

        // Sort
        result.sort((a, b) => {
            let comparison = 0
            switch (sortBy) {
                case 'date':
                    comparison = new Date(b.signalDate).getTime() - new Date(a.signalDate).getTime()
                    break
                case 'drop':
                    comparison = parseFloat(a.maxDrop?.replace('%', '') || '0') - parseFloat(b.maxDrop?.replace('%', '') || '0')
                    break
                case 'profit':
                    comparison = parseFloat(a.maxProfit?.replace('%', '') || '0') - parseFloat(b.maxProfit?.replace('%', '') || '0')
                    break
            }
            return sortOrder === 'asc' ? comparison : -comparison
        })

        return result
    }, [alerts, specificDate, dateFrom, dateTo, minDrop, maxDrop, minProfit, maxProfit, minMc, maxMc, sortBy, sortOrder])

    const hasActiveFilters = Boolean(specificDate || dateFrom || dateTo || minDrop || maxDrop || minProfit || maxProfit || minMc || maxMc)

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

    const truncateAddress = (address: string) => {
        if (address.length <= 10) return address
        return `${address.slice(0, 4)}...${address.slice(-4)}`
    }

    const formatDateForDisplay = (dateString: string) => {
        if (!dateString) return '-'
        const date = new Date(dateString)
        return date.toLocaleDateString('ru-RU', { day: '2-digit', month: '2-digit', year: '2-digit' })
    }

    const handleEdit = (alert: AiAlert) => {
        setEditingAlert(alert)
        setFormData({
            signalDate: alert.signalDate,
            signalTime: alert.signalTime,
            marketCap: alert.marketCap || '',
            address: alert.address,
            maxDrop: alert.maxDrop || '',
            maxDropFromLevel07: alert.maxDropFromLevel07 || '',
            maxProfit: alert.maxProfit || '',
            comment: alert.comment || '',
            strategy: alert.strategy || 'Market Entry',
            isScam: alert.isScam || false,
            screenshot: alert.screenshot || undefined
        })
        setScreenshotPreview(alert.screenshot || null)
        setShowModal(true)
    }

    const handleDelete = async (id: string) => {
        if (window.confirm('Вы уверены, что хотите удалить этот сигнал?')) {
            try {
                await deleteAiAlert(id)
                await loadAlerts()
            } catch (error) {
                console.error('Error deleting alert:', error)
            }
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
            <th>№</th>
            <th>Date</th>
            <th>Time</th>
            <th>MC</th>
            <th>Адрес</th>
            <th>Drop</th>
            <th>Drop 0.7</th>
            <th>Профит</th>
            <th>Коммент</th>
            <th>Photo</th>
            <th>Автор</th>
          </tr>
        </thead>
        <tbody>
          ${filteredAlerts.map((a: AiAlert, index: number) => `
            <tr>
              <td>${index + 1}</td>
              <td>${formatDateForDisplay(a.signalDate)}</td>
              <td>${a.signalTime}</td>
              <td>${a.marketCap || '-'}</td>
              <td>${a.address}</td>
              <td>${a.maxDrop || '-'}</td>
              <td>${a.maxDropFromLevel07 || '-'}</td>
              <td>${a.maxProfit || '-'}</td>
              <td>${a.comment || ''}</td>
              <td>${a.screenshot ? 'Есть' : '-'}</td>
              <td>${a.createdBy}</td>
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
                                <TerminalIcon className={`w-8 h-8 ${theme === 'dark' ? 'text-white' : 'text-indigo-600'}`} />
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
                                    <Calendar className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-500" />
                                    <span className={`text-[11px] font-bold uppercase tracking-wider ml-1 ${subTextColor}`}>Временные рамки</span>
                                </div>
                                <div className="space-y-3">
                                    <input
                                        type="date"
                                        value={specificDate}
                                        onChange={(e) => setSpecificDate(e.target.value)}
                                        className={`w-full px-4 py-2.5 rounded-xl border text-sm font-semibold outline-none ${theme === 'dark' ? 'bg-white/5 border-white/5 text-white' : 'bg-white border-gray-200 text-gray-900'}`}
                                    />
                                    <div className="grid grid-cols-2 gap-3">
                                        <input
                                            type="date"
                                            value={dateFrom}
                                            onChange={(e) => setDateFrom(e.target.value)}
                                            className={`w-full px-4 py-2.5 rounded-xl border text-sm font-semibold outline-none ${theme === 'dark' ? 'bg-white/5 border-white/5 text-white' : 'bg-white border-gray-200 text-gray-900'}`}
                                        />
                                        <input
                                            type="date"
                                            value={dateTo}
                                            onChange={(e) => setDateTo(e.target.value)}
                                            className={`w-full px-4 py-2.5 rounded-xl border text-sm font-semibold outline-none ${theme === 'dark' ? 'bg-white/5 border-white/5 text-white' : 'bg-white border-gray-200 text-gray-900'}`}
                                        />
                                    </div>
                                </div>
                            </div>

                            {/* Drop Group */}
                            <div className="lg:col-span-2 space-y-4">
                                <div className="flex items-center gap-2 px-1">
                                    <TrendingDown className="w-3.5 h-3.5 text-rose-500" />
                                    <span className={`text-[11px] font-bold uppercase tracking-wider ml-1 ${subTextColor}`}>Падение (%)</span>
                                </div>
                                <div className="grid grid-cols-2 gap-3 mt-2">
                                    <input
                                        type="text"
                                        placeholder="Min"
                                        value={minDrop}
                                        onChange={(e) => setMinDrop(e.target.value)}
                                        className={`w-full pl-10 py-2.5 rounded-xl border text-sm font-mono outline-none ${theme === 'dark' ? 'bg-white/5 border-white/5 text-white' : 'bg-white border-gray-200 text-gray-900'}`}
                                    />
                                    <input
                                        type="text"
                                        placeholder="Max"
                                        value={maxDrop}
                                        onChange={(e) => setMaxDrop(e.target.value)}
                                        className={`w-full pl-10 py-2.5 rounded-xl border text-sm font-mono outline-none ${theme === 'dark' ? 'bg-white/5 border-white/5 text-white' : 'bg-white border-gray-200 text-gray-900'}`}
                                    />
                                </div>
                            </div>

                            {/* Profit Group */}
                            <div className="lg:col-span-2 space-y-4">
                                <div className="flex items-center gap-2 px-1">
                                    <TrendingUp className="w-3.5 h-3.5 text-emerald-500" />
                                    <span className={`text-[10px] font-bold uppercase tracking-wider ml-1 ${subTextColor}`}>Профит (%)</span>
                                </div>
                                <div className="grid grid-cols-2 gap-4 mt-2">
                                    <input
                                        type="text"
                                        placeholder="+28% / X2"
                                        value={formData.maxProfit || ''}
                                        onChange={(e) => setFormData({ ...formData, maxProfit: e.target.value })}
                                        className={`w-full pl-10 py-2.5 rounded-xl border text-sm font-mono outline-none ${theme === 'dark' ? 'bg-white/5 border-white/5 text-white' : 'bg-white border-gray-200 text-gray-900'}`}
                                    />
                                </div>
                            </div>

                            {/* Market Cap Group */}
                            <div className="lg:col-span-2 space-y-4">
                                <div className="flex items-center gap-2 px-1">
                                    <Coins className="w-3.5 h-3.5 text-amber-500" />
                                    <span className={`text-[10px] font-bold uppercase tracking-wider ml-1 ${subTextColor}`}>Капитализация</span>
                                </div>
                                <div className="grid grid-cols-2 gap-3 mt-2">
                                    <input
                                        type="text"
                                        placeholder="Напр: 300K или 1.5M"
                                        value={formData.marketCap || ''}
                                        onChange={(e) => setFormData({ ...formData, marketCap: e.target.value })}
                                        className={`w-full pl-10 py-2.5 rounded-xl border text-sm font-mono outline-none ${theme === 'dark' ? 'bg-white/5 border-white/5 text-white' : 'bg-white border-gray-200 text-gray-900'}`}
                                    />
                                </div>
                            </div>

                            {/* Sort Group */}
                            <div className="lg:col-span-3 space-y-4">
                                <div className="flex items-center gap-2 px-1">
                                    <Hash className="w-3.5 h-3.5 text-purple-500" />
                                    <span className={`text-[11px] font-bold tracking-widest ml-1 ${subTextColor}`}>Сортировка</span>
                                </div>
                                <div className="flex gap-2">
                                    <select
                                        value={sortBy}
                                        onChange={(e) => setSortBy(e.target.value as SortField)}
                                        className={`flex-1 px-4 py-2.5 rounded-xl border text-sm font-semibold transition-all outline-none ${theme === 'dark' ? 'bg-white/5 border-white/5 text-white' : 'bg-white border-gray-200 text-gray-900'}`}
                                    >
                                        <option value="date">По дате</option>
                                        <option value="drop">По падению</option>
                                        <option value="profit">По росту</option>
                                    </select>
                                    <button
                                        onClick={() => setSortOrder(sortOrder === 'asc' ? 'desc' : 'asc')}
                                        className={`w-12 flex items-center justify-center rounded-xl border transition-all ${theme === 'dark' ? 'bg-white/5 border-white/10' : 'bg-white border-gray-200'}`}
                                    >
                                        {sortOrder === 'asc' ? <ArrowUp className="w-5 h-5 text-emerald-500" /> : <ArrowDown className="w-5 h-5 text-rose-500" />}
                                    </button>
                                </div>
                            </div>
                        </div>

                        <div className="flex items-center justify-between pt-4 border-t border-white/5">
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
                    <table className="w-full text-left border-collapse">
                        <thead>
                            <tr className={`border-b ${theme === 'dark' ? 'border-white/10 bg-white/5' : 'border-gray-200 bg-gray-50'}`}>
                                <th className={`p-1.5 text-[10px] uppercase tracking-wider font-semibold ${subTextColor} text-center border-r ${theme === 'dark' ? 'border-white/10' : 'border-gray-200'} last:border-r-0`}>#</th>
                                <th className={`p-1.5 text-[10px] uppercase tracking-wider font-semibold ${subTextColor} text-center border-r ${theme === 'dark' ? 'border-white/10' : 'border-gray-200'} last:border-r-0`}>Date</th>
                                <th className={`p-1.5 text-[10px] uppercase tracking-wider font-semibold ${subTextColor} text-center border-r ${theme === 'dark' ? 'border-white/10' : 'border-gray-200'} last:border-r-0`}>Time</th>
                                <th className={`p-1.5 text-[10px] uppercase tracking-wider font-semibold ${subTextColor} text-center border-r ${theme === 'dark' ? 'border-white/10' : 'border-gray-200'} last:border-r-0`}>MC</th>
                                <th className={`p-1.5 text-[10px] uppercase tracking-wider font-semibold ${subTextColor} text-center border-r ${theme === 'dark' ? 'border-white/10' : 'border-gray-200'} last:border-r-0`}>Адрес</th>
                                <th className={`p-1.5 text-[10px] uppercase tracking-wider font-semibold ${subTextColor} text-center border-r ${theme === 'dark' ? 'border-white/10' : 'border-gray-200'} last:border-r-0`}>Drop</th>
                                <th className={`p-1.5 text-[10px] uppercase tracking-wider font-semibold ${subTextColor} text-center border-r ${theme === 'dark' ? 'border-white/10' : 'border-gray-200'} last:border-r-0`}>Drop 0,7</th>
                                <th className={`p-1.5 text-[10px] uppercase tracking-wider font-semibold ${subTextColor} text-center border-r ${theme === 'dark' ? 'border-white/10' : 'border-gray-200'} last:border-r-0`}>Профит</th>
                                <th className={`p-1.5 text-[10px] uppercase tracking-wider font-semibold ${subTextColor} text-center border-r ${theme === 'dark' ? 'border-white/10' : 'border-gray-200'} last:border-r-0`}>Коммент</th>
                                <th className={`p-1.5 text-[10px] uppercase tracking-wider font-semibold ${subTextColor} text-center border-r ${theme === 'dark' ? 'border-white/10' : 'border-gray-200'} last:border-r-0`}>Photo</th>
                                <th className={`p-1.5 text-[10px] uppercase tracking-wider font-semibold ${subTextColor} text-center border-r ${theme === 'dark' ? 'border-white/10' : 'border-gray-200'} last:border-r-0`}>Автор</th>
                                <th className={`p-1.5 text-[10px] uppercase tracking-wider font-semibold ${subTextColor} text-center last:border-r-0`}>⚙</th>
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

                                        dateAlerts.forEach((alert: AiAlert) => {
                                            const globalIndex = filteredAlerts.indexOf(alert) + 1
                                            rows.push(
                                                <tr key={alert.id} className={`${theme === 'dark' ? 'hover:bg-white/5' : 'hover:bg-gray-50'} transition-colors`}>
                                                    <td className={`p-1.5 text-center whitespace-nowrap border-r ${theme === 'dark' ? 'border-white/5' : 'border-gray-100'} last:border-r-0`}>
                                                        <div className={`font-mono text-[10px] sm:text-xs font-bold ${subTextColor}`}>{globalIndex}</div>
                                                    </td>
                                                    <td className={`p-1.5 text-center whitespace-nowrap border-r ${theme === 'dark' ? 'border-white/5' : 'border-gray-100'} last:border-r-0`}>
                                                        <div className={`font-mono font-medium text-[10px] sm:text-xs ${headingColor}`}>{formatDateForDisplay(alert.signalDate)}</div>
                                                    </td>
                                                    <td className={`p-1.5 text-center whitespace-nowrap border-r ${theme === 'dark' ? 'border-white/5' : 'border-gray-100'} last:border-r-0`}>
                                                        <div className={`font-mono text-[10px] sm:text-xs ${headingColor}`}>{alert.signalTime}</div>
                                                    </td>
                                                    <td className={`p-1.5 text-center whitespace-nowrap border-r ${theme === 'dark' ? 'border-white/5' : 'border-gray-100'} last:border-r-0`}>
                                                        <div className={`font-mono text-[10px] sm:text-xs ${headingColor}`}>{alert.marketCap || '-'}</div>
                                                    </td>
                                                    <td className={`p-1.5 text-center whitespace-nowrap border-r ${theme === 'dark' ? 'border-white/5' : 'border-gray-100'} last:border-r-0`}>
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
                                                    <td className={`p-1.5 text-center whitespace-nowrap border-r ${theme === 'dark' ? 'border-white/5' : 'border-gray-100'} last:border-r-0`}>
                                                        <span className={`font-mono text-[10px] sm:text-xs ${alert.maxDrop && alert.maxDrop.startsWith('-') ? 'text-red-500' : headingColor}`}>
                                                            {alert.maxDrop || '-'}
                                                        </span>
                                                    </td>
                                                    <td className={`p-1.5 text-center whitespace-nowrap border-r ${theme === 'dark' ? 'border-white/5' : 'border-gray-100'} last:border-r-0`}>
                                                        <span className={`font-mono text-[10px] sm:text-xs ${alert.maxDropFromLevel07 && alert.maxDropFromLevel07.startsWith('-') ? 'text-red-500' : headingColor}`}>
                                                            {alert.maxDropFromLevel07 || '-'}
                                                        </span>
                                                    </td>
                                                    <td className={`p-1.5 text-center whitespace-nowrap border-r ${theme === 'dark' ? 'border-white/5' : 'border-gray-100'} last:border-r-0`}>
                                                        <span className="font-mono text-[10px] sm:text-xs text-green-500 font-bold">
                                                            {alert.maxProfit || '-'}
                                                        </span>
                                                    </td>
                                                    <td className={`p-1.5 text-center whitespace-nowrap border-r ${theme === 'dark' ? 'border-white/5' : 'border-gray-100'} last:border-r-0`}>
                                                        <div className={`text-[10px] ${headingColor} break-words whitespace-pre-wrap max-w-[200px] text-center`}>
                                                            {alert.comment || '-'}
                                                        </div>
                                                    </td>
                                                    <td className={`p-1.5 text-center whitespace-nowrap border-r ${theme === 'dark' ? 'border-white/5' : 'border-gray-100'} last:border-r-0`}>
                                                        {alert.screenshot ? (
                                                            <button
                                                                onClick={() => setPreviewImage(alert.screenshot!)}
                                                                className={`text-[10px] ${subTextColor} hover:text-emerald-500 transition-colors cursor-pointer`}
                                                                title="Просмотр фото"
                                                            >
                                                                📷
                                                            </button>
                                                        ) : (
                                                            <span className={`text-[10px] ${subTextColor}`}>—</span>
                                                        )}
                                                    </td>
                                                    <td className={`p-1.5 text-center whitespace-nowrap border-r ${theme === 'dark' ? 'border-white/5' : 'border-gray-100'} last:border-r-0`}>
                                                        <UserNickname userId={alert.createdBy} className="text-[10px] font-medium" />
                                                    </td>
                                                    <td className="p-1.5 text-center whitespace-nowrap last:border-r-0">
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
                                                                    <Trash2 className="w-3 h-3" />
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
                                filteredAlerts.map((alert: AiAlert, index: number) => (
                                    <tr key={alert.id} className={`${theme === 'dark' ? 'hover:bg-white/5' : 'hover:bg-gray-50'} transition-colors`}>
                                        <td className={`p-1.5 text-center whitespace-nowrap border-r ${theme === 'dark' ? 'border-white/5' : 'border-gray-100'} last:border-r-0`}>
                                            <div className={`font-mono text-[10px] sm:text-xs font-bold ${subTextColor}`}>{index + 1}</div>
                                        </td>
                                        <td className={`p-1.5 text-center whitespace-nowrap border-r ${theme === 'dark' ? 'border-white/5' : 'border-gray-100'} last:border-r-0`}>
                                            <div className={`font-mono font-medium text-[10px] sm:text-xs ${headingColor}`}>{formatDateForDisplay(alert.signalDate)}</div>
                                        </td>
                                        <td className={`p-1.5 text-center whitespace-nowrap border-r ${theme === 'dark' ? 'border-white/5' : 'border-gray-100'} last:border-r-0`}>
                                            <div className={`font-mono text-[10px] sm:text-xs ${headingColor}`}>{alert.signalTime}</div>
                                        </td>
                                        <td className={`p-1.5 text-center whitespace-nowrap border-r ${theme === 'dark' ? 'border-white/5' : 'border-gray-100'} last:border-r-0`}>
                                            <div className={`font-mono text-[10px] sm:text-xs ${headingColor}`}>{alert.marketCap || '-'}</div>
                                        </td>
                                        <td className={`p-1.5 text-center whitespace-nowrap border-r ${theme === 'dark' ? 'border-white/5' : 'border-gray-100'} last:border-r-0`}>
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
                                        <td className={`p-1.5 text-center whitespace-nowrap border-r ${theme === 'dark' ? 'border-white/5' : 'border-gray-100'} last:border-r-0`}>
                                            <span className={`font-mono text-[10px] sm:text-xs ${alert.maxDrop && alert.maxDrop.startsWith('-') ? 'text-red-500' : headingColor}`}>
                                                {alert.maxDrop || '-'}
                                            </span>
                                        </td>
                                        <td className={`p-1.5 text-center whitespace-nowrap border-r ${theme === 'dark' ? 'border-white/5' : 'border-gray-100'} last:border-r-0`}>
                                            <span className={`font-mono text-[10px] sm:text-xs ${alert.maxDropFromLevel07 && alert.maxDropFromLevel07.startsWith('-') ? 'text-red-500' : headingColor}`}>
                                                {alert.maxDropFromLevel07 || '-'}
                                            </span>
                                        </td>
                                        <td className={`p-1.5 text-center whitespace-nowrap border-r ${theme === 'dark' ? 'border-white/5' : 'border-gray-100'} last:border-r-0`}>
                                            <span className="font-mono text-[10px] sm:text-xs text-green-500 font-bold">
                                                {alert.maxProfit || '-'}
                                            </span>
                                        </td>
                                        <td className={`p-1.5 text-center whitespace-nowrap border-r ${theme === 'dark' ? 'border-white/5' : 'border-gray-100'} last:border-r-0`}>
                                            <div className={`text-[10px] ${headingColor} break-words whitespace-pre-wrap max-w-[200px] text-center`}>
                                                {alert.comment || '-'}
                                            </div>
                                        </td>
                                        <td className={`p-1.5 text-center whitespace-nowrap border-r ${theme === 'dark' ? 'border-white/5' : 'border-gray-100'} last:border-r-0`}>
                                            {alert.screenshot ? (
                                                <button
                                                    onClick={() => setPreviewImage(alert.screenshot!)}
                                                    className={`text-[10px] ${subTextColor} hover:text-emerald-500 transition-colors cursor-pointer`}
                                                    title="Просмотр фото"
                                                >
                                                    📷
                                                </button>
                                            ) : (
                                                <span className={`text-[10px] ${subTextColor}`}>—</span>
                                            )}
                                        </td>
                                        <td className={`p-1.5 text-center whitespace-nowrap border-r ${theme === 'dark' ? 'border-white/5' : 'border-gray-100'} last:border-r-0`}>
                                            <UserNickname userId={alert.createdBy} className="text-[10px] font-medium" />
                                        </td>
                                        <td className="p-1.5 text-center whitespace-nowrap last:border-r-0">
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
                                                        <Trash2 className="w-3 h-3" />
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

            {/* Modal */}
            {showModal && (
                <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm overflow-y-auto">
                    <div className={`w-full max-w-4xl rounded-[32px] ${cardBg} ${cardBorder} border shadow-2xl overflow-hidden my-auto flex flex-col relative`}>
                        {/* Header */}
                        <div className={`p-6 border-b ${theme === 'dark' ? 'border-white/10' : 'border-gray-100'} flex items-center justify-between flex-shrink-0 relative z-10`}>
                            <div className="flex items-center gap-4">
                                <div className={`p-3 rounded-2xl ${theme === 'dark' ? 'bg-white/10 border-white/20' : 'bg-indigo-600/10 border-indigo-600/30'}`}>
                                    <Activity className={`w-6 h-6 ${theme === 'dark' ? 'text-white' : 'text-indigo-600'}`} />
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
                                        <div>
                                            <label className={`text-[10px] font-bold uppercase tracking-wider ml-1 ${subTextColor}`}>Дата</label>
                                            <div className="relative">
                                                <Calendar className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-500" />
                                                <input
                                                    type="date"
                                                    value={editingAlert?.signalDate || commonDate}
                                                    onChange={(e) => editingAlert ? setFormData({ ...formData, signalDate: e.target.value }) : setCommonDate(e.target.value)}
                                                    className={`w-full pl-10 pr-4 py-3 rounded-xl border text-sm font-semibold outline-none ${theme === 'dark' ? 'bg-white/5 border-white/5 text-white' : 'bg-white border-gray-200 text-gray-900'}`}
                                                />
                                            </div>
                                        </div>
                                        <div>
                                            <label className={`text-[10px] font-bold uppercase tracking-wider ml-1 ${subTextColor}`}>Время</label>
                                            <div className="relative">
                                                <Clock className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-500" />
                                                <input
                                                    type="time"
                                                    value={formData.signalTime}
                                                    onChange={(e) => setFormData({ ...formData, signalTime: e.target.value })}
                                                    className={`w-full pl-10 pr-4 py-3 rounded-xl border text-sm font-semibold outline-none ${theme === 'dark' ? 'bg-white/5 border-white/5 text-white' : 'bg-white border-gray-200 text-gray-900'}`}
                                                />
                                            </div>
                                        </div>
                                    </div>

                                    <div className="grid grid-cols-2 gap-4">
                                        <div>
                                            <label className={`text-[10px] font-bold uppercase tracking-wider ml-1 ${subTextColor}`}>Market Cap</label>
                                            <div className="relative">
                                                <Coins className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-amber-500" />
                                                <input
                                                    type="text"
                                                    placeholder="Напр: 300K или 1.5M"
                                                    value={formData.marketCap || ''}
                                                    onChange={(e) => setFormData({ ...formData, marketCap: e.target.value })}
                                                    className={`w-full pl-10 py-2.5 rounded-xl border text-sm font-mono outline-none ${theme === 'dark' ? 'bg-white/5 border-white/5 text-white' : 'bg-white border-gray-200 text-gray-900'}`}
                                                />
                                            </div>
                                        </div>

                                        <div>
                                            <label className={`text-[10px] font-bold uppercase tracking-wider ml-1 ${subTextColor}`}>Drop</label>
                                            <div className="relative">
                                                <TrendingDown className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-rose-500/50" />
                                                <input
                                                    type="text"
                                                    placeholder="-16%"
                                                    value={formData.maxDrop || ''}
                                                    onChange={(e) => setFormData({ ...formData, maxDrop: e.target.value })}
                                                    className={`w-full pl-10 py-2.5 rounded-xl border text-sm font-semibold outline-none ${theme === 'dark' ? 'bg-white/5 border-white/5 text-white' : 'bg-white border-gray-200 text-gray-900'}`}
                                                />
                                            </div>
                                        </div>

                                        <div>
                                            <label className={`text-[10px] font-bold uppercase tracking-wider ml-1 ${subTextColor}`}>Drop 0.7</label>
                                            <div className="relative">
                                                <TrendingDown className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-rose-500/50" />
                                                <input
                                                    type="text"
                                                    placeholder="X2"
                                                    value={formData.maxDropFromLevel07 || ''}
                                                    onChange={(e) => setFormData({ ...formData, maxDropFromLevel07: e.target.value })}
                                                    className={`w-full pl-10 py-2.5 rounded-xl border text-sm font-semibold outline-none ${theme === 'dark' ? 'bg-white/5 border-white/5 text-white' : 'bg-white border-gray-200 text-gray-900'}`}
                                                />
                                            </div>
                                        </div>

                                        <div>
                                            <label className={`text-[10px] font-bold uppercase tracking-wider ml-1 ${subTextColor}`}>Профит</label>
                                            <div className="relative">
                                                <TrendingUp className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-emerald-500/50" />
                                                <input
                                                    type="text"
                                                    placeholder="+28% / X2"
                                                    value={formData.maxProfit || ''}
                                                    onChange={(e) => setFormData({ ...formData, maxProfit: e.target.value })}
                                                    className={`w-full pl-10 py-2.5 rounded-xl border text-sm font-mono outline-none ${theme === 'dark' ? 'bg-white/5 border-white/5 text-white' : 'bg-white border-gray-200 text-gray-900'}`}
                                                />
                                            </div>
                                        </div>

                                        <div>
                                            <label className={`text-[10px] font-bold uppercase tracking-wider ml-1 ${subTextColor}`}>Коммент</label>
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
                                        <label className={`text-[10px] font-bold tracking-wider ml-1 ${subTextColor}`}>Скриншот (опционально)</label>
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

                                    <div className="space-y-3">
                                        <label className={`text-[10px] font-bold uppercase tracking-wider ml-1 ${subTextColor}`}>Стратегия</label>
                                        <div className="grid grid-cols-2 gap-3 mt-2">
                                            {(['ФИБА', 'Market Entry'] as AiAlert['strategy'][]).map((strat) => (
                                                <button
                                                    key={strat}
                                                    onClick={() => setFormData({ ...formData, strategy: strat })}
                                                    className={`p-3 rounded-xl border transition-all text-sm font-bold ${formData.strategy === strat ? 'border-emerald-500 bg-emerald-500/10 text-emerald-500' : theme === 'dark' ? 'border-white/5 bg-white/5 text-gray-400' : 'border-gray-200 bg-gray-50 text-gray-500'}`}
                                                >
                                                    <span>{strat}</span>
                                                    <div className={`w-4 h-4 rounded-full border-2 flex items-center justify-center ${formData.strategy === strat ? 'border-emerald-500 bg-emerald-500' : 'border-gray-500/30'}`}>
                                                        {formData.strategy === strat && <Check size={12} className="text-white stroke-[4]" />}
                                                    </div>
                                                </button>
                                            ))}
                                        </div>
                                    </div>

                                    <div className="space-y-1.5">
                                        <label className={`text-[10px] font-bold uppercase tracking-wider ml-1 ${subTextColor}`}>Contract Address</label>
                                        <input
                                            type="text"
                                            placeholder="Введите адрес контракта..."
                                            value={formData.address}
                                            onChange={(e) => setFormData({ ...formData, address: e.target.value })}
                                            className={`w-full pl-10 py-2.5 rounded-xl border text-sm font-mono outline-none ${theme === 'dark' ? 'bg-black/20 border-white/5 text-white' : 'bg-white border-gray-200 text-gray-900'}`}
                                        />
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
                                            className="w-full py-4 rounded-2xl bg-emerald-500 hover:bg-emerald-600 text-white font-bold transition-all shadow-lg"
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
                                        className="w-full mt-4 py-4 rounded-2xl bg-emerald-500 hover:bg-emerald-600 text-white font-bold transition-all shadow-xl"
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
        </>
    )
}

// Terminal Icon component since it's not in lucide-react
const TerminalIcon: React.FC<{ className?: string }> = ({ className }) => (
    <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className={className}>
        <polyline points="4 17 10 11 4 5"></polyline>
        <line x1="12" y1="19" x2="20" y2="19"></line>
    </svg>
)