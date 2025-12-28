import React, { useState, useEffect } from 'react'
import { useThemeStore } from '@/store/themeStore'
import { useAuthStore } from '@/store/authStore'
import { getAiAlerts, addAiAlert, updateAiAlert, deleteAiAlert } from '@/services/firestoreService'
import { AiAlert } from '@/types'
import { Plus, Edit, Trash2, Save, X, Copy, Check, Terminal, Table, FileText } from 'lucide-react'

export const AiAoAlerts = () => {
    const { theme } = useThemeStore()
    const { user } = useAuthStore()

    const [alerts, setAlerts] = useState<AiAlert[]>([])
    const [loading, setLoading] = useState(true)
    const [showModal, setShowModal] = useState(false)
    const [editingAlert, setEditingAlert] = useState<AiAlert | null>(null)
    const [copyingId, setCopyingId] = useState<string | null>(null)
    const [isCopyingAll, setIsCopyingAll] = useState(false)
    const [isCopyingTable, setIsCopyingTable] = useState(false)

    // Form state
    const [formData, setFormData] = useState<Partial<AiAlert>>({
        signalDate: new Date().toISOString().split('T')[0],
        signalTime: new Date().toLocaleTimeString('ru-RU', { hour: '2-digit', minute: '2-digit' }),
        marketCap: '',
        address: '',
        maxDrop: '',
        maxProfit: '',
        comment: ''
    })

    const subTextColor = theme === 'dark' ? 'text-gray-400' : 'text-gray-600'
    const headingColor = theme === 'dark' ? 'text-white' : 'text-gray-900'
    const cardBg = theme === 'dark' ? 'bg-[#10141c]' : 'bg-white'
    const cardBorder = theme === 'dark' ? 'border-[#48a35e]/30' : 'border-[#48a35e]/20'
    const cardShadow = theme === 'dark' ? 'shadow-[0_24px_80px_rgba(0,0,0,0.45)]' : 'shadow-[0_24px_80px_rgba(0,0,0,0.15)]'

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

    const handleCopyAllData = () => {
        const text = alerts.map((a: AiAlert) =>
            `${a.signalDate}\t${a.signalTime}\t${a.marketCap || '-'}\t${a.address}\t${a.maxDrop || '-'}\t${a.maxProfit || '-'}\t${a.comment || ''}`
        ).join('\n')
        const header = "Дата\tВремя\tMarket Cap\tАдрес\tМакс. Падение\tМакс. Профит\tКомментарий\n"
        navigator.clipboard.writeText(header + text)
        setIsCopyingAll(true)
        setTimeout(() => setIsCopyingAll(false), 2000)
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
          ${alerts.map((a: AiAlert) => `
            <tr>
              <td>${a.signalDate}</td>
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
        setShowModal(true)
    }

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault()
        try {
            if (editingAlert) {
                await updateAiAlert(editingAlert.id, formData)
            } else {
                await addAiAlert({
                    ...formData as AiAlert,
                    createdAt: new Date().toISOString(),
                    createdBy: user?.id || 'admin'
                })
            }
            setShowModal(false)
            setEditingAlert(null)
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
                            <div className={`p-3 rounded-2xl ${theme === 'dark' ? 'bg-white/10 border-white/20' : 'bg-[#4E6E49]/10 border-[#4E6E49]/30'} shadow-inner`}>
                                <Terminal className={`w-8 h-8 ${theme === 'dark' ? 'text-white' : 'text-[#4E6E49]'}`} />
                            </div>
                            <div>
                                <h1 className={`text-3xl font-black ${headingColor}`}>AI - AO Alerts</h1>
                                <p className={`text-sm ${subTextColor}`}>Мониторинг сигналов искусственного интеллекта</p>
                            </div>
                        </div>

                        <div className="flex flex-wrap items-center gap-3">
                            <button
                                onClick={handleCopyAllData}
                                disabled={alerts.length === 0}
                                className={`px-4 py-2 rounded-xl text-sm font-semibold transition-all flex items-center gap-2 border ${theme === 'dark' ? 'bg-white/5 border-white/10 hover:bg-white/10 text-gray-300' : 'bg-gray-100 border-gray-200 hover:bg-gray-200 text-gray-700'} disabled:opacity-50`}
                            >
                                {isCopyingAll ? (
                                    <>
                                        <Check className="w-4 h-4 text-green-500" />
                                        <span>Данные скопированы</span>
                                    </>
                                ) : (
                                    <>
                                        <FileText className="w-4 h-4" />
                                        <span>Копировать данные</span>
                                    </>
                                )}
                            </button>

                            <button
                                onClick={handleCopyTable}
                                disabled={alerts.length === 0}
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
                                        <span>Копировать таблицу</span>
                                    </>
                                )}
                            </button>

                            <button
                                onClick={() => {
                                    setEditingAlert(null)
                                    setFormData({
                                        signalDate: new Date().toISOString().split('T')[0],
                                        signalTime: new Date().toLocaleTimeString('ru-RU', { hour: '2-digit', minute: '2-digit' }),
                                    })
                                    setShowModal(true)
                                }}
                                className="px-4 py-2 rounded-xl bg-[#4E6E49] hover:bg-[#3d5a39] text-white font-semibold transition-colors flex items-center gap-2 shadow-lg shadow-[#4E6E49]/20 ml-auto"
                            >
                                <Plus className="w-4 h-4" />
                                <span>Добавить сигнал</span>
                            </button>
                        </div>
                    </div>
                </div>

                {/* Table */}
                <div className={`relative overflow-hidden rounded-3xl border ${cardBorder} ${cardShadow} ${cardBg}`}>
                    <div className="overflow-x-auto">
                        <table className="w-full text-left border-collapse">
                            <thead>
                                <tr className={`border-b ${theme === 'dark' ? 'border-white/10 bg-white/5' : 'border-gray-200 bg-gray-50'}`}>
                                    <th className={`p-4 text-xs uppercase tracking-wider font-semibold ${subTextColor}`}>Дата/Время</th>
                                    <th className={`p-4 text-xs uppercase tracking-wider font-semibold ${subTextColor}`}>Капитализация</th>
                                    <th className={`p-4 text-xs uppercase tracking-wider font-semibold ${subTextColor}`}>Адрес</th>
                                    <th className={`p-4 text-xs uppercase tracking-wider font-semibold ${subTextColor}`}>Макс. Падение</th>
                                    <th className={`p-4 text-xs uppercase tracking-wider font-semibold ${subTextColor}`}>Макс. Профит</th>
                                    <th className={`p-4 text-xs uppercase tracking-wider font-semibold ${subTextColor}`}>Действия</th>
                                </tr>
                            </thead>
                            <tbody className={`divide-y ${theme === 'dark' ? 'divide-white/5' : 'divide-gray-100'}`}>
                                {loading ? (
                                    <tr>
                                        <td colSpan={6} className="p-8 text-center text-gray-500">Загрузка...</td>
                                    </tr>
                                ) : alerts.length === 0 ? (
                                    <tr>
                                        <td colSpan={6} className="p-8 text-center text-gray-500">Нет сигналов</td>
                                    </tr>
                                ) : (
                                    alerts.map((alert: AiAlert) => (
                                        <tr key={alert.id} className={`${theme === 'dark' ? 'hover:bg-white/5' : 'hover:bg-gray-50'} transition-colors`}>
                                            <td className="p-4 whitespace-nowrap">
                                                <div className={`font-mono font-medium ${headingColor}`}>{alert.signalDate}</div>
                                                <div className={`text-xs ${subTextColor}`}>{alert.signalTime}</div>
                                            </td>
                                            <td className="p-4 whitespace-nowrap">
                                                <div className={`font-mono ${headingColor}`}>{alert.marketCap || '-'}</div>
                                            </td>
                                            <td className="p-4">
                                                <div className="flex items-center gap-2 max-w-[200px]">
                                                    <div className={`truncate font-mono text-sm ${theme === 'dark' ? 'text-blue-400' : 'text-blue-600'}`}>
                                                        {alert.address}
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
                                                {alert.comment && <div className={`text-xs ${subTextColor} mt-1`}>{alert.comment}</div>}
                                            </td>
                                            <td className="p-4 whitespace-nowrap">
                                                <span className="font-mono text-green-500 font-bold">
                                                    {alert.maxProfit || '-'}
                                                </span>
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
                                                        <Trash2 className="w-4 h-4" />
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
            {
                showModal && (
                    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm">
                        <div className={`w-full max-w-lg rounded-3xl ${cardBg} ${cardBorder} border shadow-2xl overflow-hidden`}>
                            <div className={`p-6 border-b ${theme === 'dark' ? 'border-white/10' : 'border-gray-100'} flex items-center justify-between`}>
                                <h3 className={`text-xl font-bold ${headingColor}`}>
                                    {editingAlert ? 'Редактировать сигнал' : 'Новый сигнал'}
                                </h3>
                                <button onClick={() => setShowModal(false)} className={`p-2 rounded-lg hover:bg-white/10 ${subTextColor}`}>
                                    <X className="w-5 h-5" />
                                </button>
                            </div>

                            <form onSubmit={handleSubmit} className="p-6 space-y-4">
                                <div className="grid grid-cols-2 gap-4">
                                    <div className="space-y-1">
                                        <label className={`text-xs font-semibold uppercase ${subTextColor}`}>Дата</label>
                                        <input
                                            type="date"
                                            required
                                            value={formData.signalDate}
                                            onChange={(e: React.ChangeEvent<HTMLInputElement>) => setFormData({ ...formData, signalDate: e.target.value })}
                                            className={`w-full p-3 rounded-xl border outline-none transition-all ${theme === 'dark' ? 'bg-black/30 border-white/10 text-white focus:border-[#4E6E49]' : 'bg-white border-gray-200 text-gray-900 focus:border-[#4E6E49]'}`}
                                        />
                                    </div>
                                    <div className="space-y-1">
                                        <label className={`text-xs font-semibold uppercase ${subTextColor}`}>Время</label>
                                        <input
                                            type="time"
                                            required
                                            value={formData.signalTime}
                                            onChange={(e: React.ChangeEvent<HTMLInputElement>) => setFormData({ ...formData, signalTime: e.target.value })}
                                            className={`w-full p-3 rounded-xl border outline-none transition-all ${theme === 'dark' ? 'bg-black/30 border-white/10 text-white focus:border-[#4E6E49]' : 'bg-white border-gray-200 text-gray-900 focus:border-[#4E6E49]'}`}
                                        />
                                    </div>
                                </div>

                                <div className="space-y-1">
                                    <label className={`text-xs font-semibold uppercase ${subTextColor}`}>Адрес токена</label>
                                    <input
                                        type="text"
                                        required
                                        placeholder="Адрес контракта..."
                                        value={formData.address || ''}
                                        onChange={(e: React.ChangeEvent<HTMLInputElement>) => setFormData({ ...formData, address: e.target.value })}
                                        className={`w-full p-3 rounded-xl border outline-none transition-all font-mono text-sm ${theme === 'dark' ? 'bg-black/30 border-white/10 text-white focus:border-[#4E6E49]' : 'bg-white border-gray-200 text-gray-900 focus:border-[#4E6E49]'}`}
                                    />
                                </div>

                                <div className="grid grid-cols-3 gap-4">
                                    <div className="space-y-1">
                                        <label className={`text-xs font-semibold uppercase ${subTextColor}`}>Market Cap</label>
                                        <input
                                            type="text"
                                            placeholder="e.g. 300,77"
                                            value={formData.marketCap || ''}
                                            onChange={(e: React.ChangeEvent<HTMLInputElement>) => setFormData({ ...formData, marketCap: e.target.value })}
                                            className={`w-full p-3 rounded-xl border outline-none transition-all ${theme === 'dark' ? 'bg-black/30 border-white/10 text-white focus:border-[#4E6E49]' : 'bg-white border-gray-200 text-gray-900 focus:border-[#4E6E49]'}`}
                                        />
                                    </div>
                                    <div className="space-y-1">
                                        <label className={`text-xs font-semibold uppercase ${subTextColor}`}>Макс. Падение</label>
                                        <input
                                            type="text"
                                            placeholder="e.g. -16"
                                            value={formData.maxDrop || ''}
                                            onChange={(e: React.ChangeEvent<HTMLInputElement>) => setFormData({ ...formData, maxDrop: e.target.value })}
                                            className={`w-full p-3 rounded-xl border outline-none transition-all ${theme === 'dark' ? 'bg-black/30 border-white/10 text-white focus:border-[#4E6E49]' : 'bg-white border-gray-200 text-gray-900 focus:border-[#4E6E49]'}`}
                                        />
                                    </div>
                                    <div className="space-y-1">
                                        <label className={`text-xs font-semibold uppercase ${subTextColor}`}>Макс. Профит</label>
                                        <input
                                            type="text"
                                            placeholder="e.g. +28"
                                            value={formData.maxProfit || ''}
                                            onChange={(e: React.ChangeEvent<HTMLInputElement>) => setFormData({ ...formData, maxProfit: e.target.value })}
                                            className={`w-full p-3 rounded-xl border outline-none transition-all ${theme === 'dark' ? 'bg-black/30 border-white/10 text-white focus:border-[#4E6E49]' : 'bg-white border-gray-200 text-gray-900 focus:border-[#4E6E49]'}`}
                                        />
                                    </div>
                                </div>

                                <div className="space-y-1">
                                    <label className={`text-xs font-semibold uppercase ${subTextColor}`}>Комментарий</label>
                                    <input
                                        type="text"
                                        placeholder="Дополнительная информация..."
                                        value={formData.comment || ''}
                                        onChange={(e: React.ChangeEvent<HTMLInputElement>) => setFormData({ ...formData, comment: e.target.value })}
                                        className={`w-full p-3 rounded-xl border outline-none transition-all ${theme === 'dark' ? 'bg-black/30 border-white/10 text-white focus:border-[#4E6E49]' : 'bg-white border-gray-200 text-gray-900 focus:border-[#4E6E49]'}`}
                                    />
                                </div>

                                <div className="pt-4 flex gap-3">
                                    <button
                                        type="button"
                                        onClick={() => setShowModal(false)}
                                        className={`flex-1 py-3 rounded-xl font-semibold transition-colors ${theme === 'dark' ? 'bg-white/5 hover:bg-white/10 text-white' : 'bg-gray-100 hover:bg-gray-200 text-gray-800'}`}
                                    >
                                        Отмена
                                    </button>
                                    <button
                                        type="submit"
                                        className="flex-1 py-3 rounded-xl bg-[#4E6E49] hover:bg-[#3d5a39] text-white font-semibold transition-colors flex items-center justify-center gap-2"
                                    >
                                        <Save className="w-4 h-4" />
                                        <span>Сохранить</span>
                                    </button>
                                </div>
                            </form>
                        </div>
                    </div>
                )
            }
        </>
    )
}
