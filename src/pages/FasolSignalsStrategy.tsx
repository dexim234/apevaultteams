import React, { useState, useMemo } from 'react'
import { useThemeStore } from '@/store/themeStore'
import { useAuthStore } from '@/store/authStore'
import { useAdminStore } from '@/store/adminStore'
import { Plus, X, Copy, TrendingUp, DollarSign, TrendingDown, Calculator, Image as ImageIcon, Eye, User, Edit2, Trash2 } from 'lucide-react'

// Types
interface OurDealSignal {
  id: string
  contract: string
  marketCap: string
  drop07: string
  profit: string
  screenshot?: string
  createdAt: string
  createdBy: string
}

// Mock API functions (replace with real API calls)
const mockDeals: OurDealSignal[] = []

export const FasolSignalsStrategy = () => {
  const { theme } = useThemeStore()
  const { user } = useAuthStore()
  const { isAdmin } = useAdminStore()
  const [deals, setDeals] = useState<OurDealSignal[]>(mockDeals)
  const [showModal, setShowModal] = useState(false)
  const [copiedId, setCopiedId] = useState<string | null>(null)
  const [editingId, setEditingId] = useState<string | null>(null)

  // Form state
  const [newDeal, setNewDeal] = useState({
    contract: '',
    marketCap: '',
    drop07: '',
    profit: '',
    screenshot: ''
  })
  
  // Time input state
  const [timeValue, setTimeValue] = useState('12:00')
  
  // Delete confirmation modal state
  const [showDeleteModal, setShowDeleteModal] = useState(false)
  const [deletingId, setDeletingId] = useState<string | null>(null)
  const [copyFeedback, setCopyFeedback] = useState(false)

  // Screenshot preview modal state
  const [showScreenshotModal, setShowScreenshotModal] = useState(false)
  const [currentScreenshot, setCurrentScreenshot] = useState<string | null>(null)
  const [currentDealInfo, setCurrentDealInfo] = useState<{ date: string; time: string; contract: string } | null>(null)

  const resetForm = () => {
    setNewDeal({ contract: '', marketCap: '', drop07: '', profit: '', screenshot: '' })
    setTimeValue(`${String(new Date().getHours()).padStart(2, '0')}:${String(new Date().getMinutes()).padStart(2, '0')}`)
    setEditingId(null)
  }

  const handleScreenshotUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0]
    if (file) {
      processImageFile(file)
    }
  }

  const processImageFile = (file: File) => {
    if (!file.type.startsWith('image/')) return
    const reader = new FileReader()
    reader.onloadend = () => {
      setNewDeal({ ...newDeal, screenshot: reader.result as string })
    }
    reader.readAsDataURL(file)
  }

  const handleScreenshotPaste = async (e: React.ClipboardEvent) => {
    const items = e.clipboardData.items
    for (let i = 0; i < items.length; i++) {
      if (items[i].type.startsWith('image/')) {
        const file = items[i].getAsFile()
        if (file) {
          processImageFile(file)
          break
        }
      }
    }
  }

  const handleScreenshotDrop = (e: React.DragEvent) => {
    e.preventDefault()
    const files = e.dataTransfer.files
    if (files.length > 0 && files[0].type.startsWith('image/')) {
      processImageFile(files[0])
    }
  }

  const openScreenshotModal = (screenshot: string, deal: OurDealSignal) => {
    const dateTime = deal.createdAt.includes('T') 
      ? deal.createdAt.split('T') 
      : [deal.createdAt, deal.createdAt.split(' ')[1] || '00:00']
    setCurrentScreenshot(screenshot)
    setCurrentDealInfo({
      date: formatDate(dateTime[0]),
      time: deal.createdAt.includes('T') ? deal.createdAt.split('T')[1].substring(0, 5) : deal.createdAt.split(' ')[1] || '',
      contract: deal.contract
    })
    setShowScreenshotModal(true)
  }

  // Updated handleAddDeal with timestamp and username fallback
  const handleAddDeal = () => {
    if (!newDeal.contract || !newDeal.marketCap) return

    const deal: OurDealSignal = {
      id: Date.now().toString(),
      contract: newDeal.contract,
      marketCap: newDeal.marketCap,
      drop07: newDeal.drop07 || '-',
      profit: newDeal.profit || '-',
      screenshot: newDeal.screenshot || undefined,
      createdAt: `${new Date().toISOString().split('T')[0]}T${timeValue}`,
      createdBy: user?.name || user?.nickname || user?.id || 'admin'
    }

    setDeals([deal, ...deals])
    resetForm()
    setShowModal(false)
  }

  const handleEditDeal = () => {
    if (!editingId || !newDeal.contract || !newDeal.marketCap) return

    setDeals(deals.map(deal =>
      deal.id === editingId
        ? {
            ...deal,
            contract: newDeal.contract,
            marketCap: newDeal.marketCap,
            drop07: newDeal.drop07 || '-',
            profit: newDeal.profit || '-',
            screenshot: newDeal.screenshot || undefined,
            createdAt: `${deal.createdAt.split('T')[0]}T${timeValue}`
          }
        : deal
    ))
    resetForm()
    setShowModal(false)
  }

  const openAddModal = () => {
    resetForm()
    setShowModal(true)
  }

  const openEditModal = (deal: OurDealSignal) => {
    const timePart = deal.createdAt.includes('T') ? deal.createdAt.split('T')[1].substring(0, 5) : '12:00'
    setNewDeal({
      contract: deal.contract,
      marketCap: deal.marketCap,
      drop07: deal.drop07,
      profit: deal.profit,
      screenshot: deal.screenshot || ''
    })
    setTimeValue(timePart)
    setEditingId(deal.id)
    setShowModal(true)
  }

  const handleDeleteDeal = () => {
    if (!deletingId) return
    setDeals(deals.filter(deal => deal.id !== deletingId))
    setDeletingId(null)
    setShowDeleteModal(false)
  }

  const confirmDelete = (id: string) => {
    setDeletingId(id)
    setShowDeleteModal(true)
  }

  const handleCopyTable = () => {
    if (deals.length === 0) return

    // Create tab-separated content for analysis
    const headers = ['№', 'Дата', 'Контракт', 'MC', 'DROP 0,7', 'Профит', 'Автор']
    const rows = deals.map((deal, index) => {
      return [
        String(index + 1),
        deal.createdAt,
        deal.contract,
        deal.marketCap,
        deal.drop07,
        deal.profit,
        deal.createdBy
      ].join('\t')
    })

    const clipboardText = [headers.join('\t'), ...rows].join('\n')
    navigator.clipboard.writeText(clipboardText)
    setCopyFeedback(true)
    setTimeout(() => setCopyFeedback(false), 2000)
  }

  const cardBg = theme === 'dark' ? 'bg-[#151a21]/80 backdrop-blur-xl' : 'bg-white/80 backdrop-blur-xl'
  const cardBorder = theme === 'dark' ? 'border-white/10' : 'border-gray-200'
  const headingColor = theme === 'dark' ? 'text-white' : 'text-gray-900'
  const mutedColor = theme === 'dark' ? 'text-gray-400' : 'text-gray-500'
  const hoverBg = theme === 'dark' ? 'hover:bg-white/10' : 'hover:bg-gray-100'

  const copyToClipboard = async (text: string, id: string) => {
    await navigator.clipboard.writeText(text)
    setCopiedId(id)
    setTimeout(() => setCopiedId(null), 2000)
  }

  const stats = useMemo(() => {
    const total = deals.length
    const avgProfit = deals.reduce((acc, d) => {
      const val = parseFloat(d.profit.replace(/[^0-9.-]/g, '') || '0')
      return acc + (d.profit.includes('-') ? 0 : val)
    }, 0)
    const avgDrop = deals.reduce((acc, d) => {
      const val = parseFloat(d.drop07.replace(/[^0-9.-]/g, '') || '0')
      return acc + val
    }, 0)

    return {
      total,
      avgProfit: total > 0 ? avgProfit / total : 0,
      avgDrop: total > 0 ? avgDrop / total : 0
    }
  }, [deals])

  const formatDate = (dateStr: string) => {
    const date = new Date(dateStr)
    return date.toLocaleDateString('ru-RU', { day: '2-digit', month: '2-digit' })
  }

  const truncateAddress = (addr: string) => {
    if (!addr) return '-'
    return addr.length > 10 ? addr.slice(0, 4) + '...' + addr.slice(-4) : addr
  }

  return (
    <div className="space-y-6">
      {/* Beautiful Header */}
      <div className={`relative overflow-hidden rounded-3xl border ${cardBorder} ${cardBg} shadow-lg`}>
        {/* Decorative elements */}
        <div className="absolute inset-0 pointer-events-none">
          <div className="absolute -left-16 -bottom-10 w-80 h-80 bg-emerald-500/10 blur-3xl" />
          <div className={`absolute inset-0 ${theme === 'dark' ? 'bg-[radial-gradient(circle_at_50%_0%,rgba(255,255,255,0.05),transparent_45%)]' : 'bg-[radial-gradient(circle_at_50%_0%,rgba(78,110,73,0.05),transparent_45%)]'}`} />
        </div>

        <div className="relative p-6 sm:p-8 flex flex-col lg:flex-row items-center justify-between gap-6">
          {/* Left: Title */}
          <div className="flex items-center gap-4">
            <div className={`p-3 rounded-2xl ${theme === 'dark' ? 'bg-white/10 border-white/20' : 'bg-[#4E6E49]/10 border-[#4E6E49]/30'}`}>
              <TrendingUp className={`w-8 h-8 ${theme === 'dark' ? 'text-white' : 'text-[#4E6E49]'}`} />
            </div>
            <div>
              <h1 className={`text-3xl font-black tracking-tight ${headingColor} whitespace-nowrap`}>
                Deal Analysis
              </h1>
            </div>
          </div>

          {/* Center: Action Buttons */}
          <div className="flex items-center gap-3">
            <button
              onClick={handleCopyTable}
              disabled={deals.length === 0}
              className={`flex items-center gap-2 px-4 py-2.5 rounded-xl font-semibold transition-all ${copyFeedback ? 'bg-green-500 text-white' : theme === 'dark' ? 'bg-white/10 hover:bg-white/20 text-white border border-white/10' : 'bg-gray-100 hover:bg-gray-200 text-gray-900 border border-gray-200'} ${deals.length === 0 ? 'opacity-50 cursor-not-allowed' : ''}`}
            >
              <Copy className="w-4 h-4" />
              <span>Copy {deals.length > 0 ? `(${deals.length})` : ''}</span>
            </button>
            <button
              onClick={openAddModal}
              className="flex items-center gap-2 px-5 py-2.5 rounded-xl bg-emerald-500 hover:bg-emerald-600 text-white font-semibold transition-all shadow-lg shadow-emerald-500/20 hover:scale-105 active:scale-95"
            >
              <Plus className="w-4 h-4" />
              <span>Add Deal</span>
            </button>
          </div>

          {/* Right: Stats */}
          <div className="flex flex-col items-end gap-2">
            <div className="flex items-center gap-2">
              <div className={`w-2 h-2 rounded-full ${deals.length > 0 ? 'bg-emerald-500' : 'bg-gray-500'}`} />
              <span className={`text-sm font-medium ${mutedColor}`}>
                Total: <span className={`font-bold ${headingColor}`}>{stats.total}</span>
              </span>
            </div>
            <div className="flex items-center gap-2">
              <DollarSign className="w-4 h-4 text-emerald-500" />
              <span className={`text-sm font-medium ${mutedColor}`}>
                Avg Profit: <span className="font-bold text-emerald-500">+{stats.avgProfit.toFixed(1)}%</span>
              </span>
            </div>
            <div className="flex items-center gap-2">
              <TrendingDown className="w-4 h-4 text-rose-500" />
              <span className={`text-sm font-medium ${mutedColor}`}>
                Avg Drop 0.7: <span className="font-bold text-rose-500">-{stats.avgDrop.toFixed(1)}%</span>
              </span>
            </div>
          </div>
        </div>
      </div>

      {/* Table */}
      <div className={`relative overflow-hidden rounded-3xl border ${cardBorder} ${cardBg} shadow-lg`}>
        <div className="overflow-x-auto">
          <table className="w-full text-left border-collapse">
            <thead>
              <tr className={`border-b ${theme === 'dark' ? 'border-white/10 bg-white/5' : 'border-gray-200 bg-gray-50'}`}>
                <th className={`p-4 text-xs uppercase tracking-wider font-semibold text-center w-12 ${theme === 'dark' ? 'text-gray-400' : 'text-gray-600'}`}>№</th>
                <th className={`p-4 text-xs uppercase tracking-wider font-semibold text-center ${theme === 'dark' ? 'text-gray-400' : 'text-gray-600'}`}>Дата</th>
                <th className={`p-4 text-xs uppercase tracking-wider font-semibold text-center ${theme === 'dark' ? 'text-gray-400' : 'text-gray-600'}`}>Контракт</th>
                <th className={`p-4 text-xs uppercase tracking-wider font-semibold text-center ${theme === 'dark' ? 'text-gray-400' : 'text-gray-600'}`}>MC</th>
                <th className={`p-4 text-xs uppercase tracking-wider font-semibold text-center ${theme === 'dark' ? 'text-gray-400' : 'text-gray-600'}`}>DROP 0,7</th>
                <th className={`p-4 text-xs uppercase tracking-wider font-semibold text-center ${theme === 'dark' ? 'text-gray-400' : 'text-gray-600'}`}>Профит</th>
                <th className={`p-4 text-xs uppercase tracking-wider font-semibold text-center w-20 ${theme === 'dark' ? 'text-gray-400' : 'text-gray-600'}`}>Скрин</th>
                <th className={`p-4 text-xs uppercase tracking-wider font-semibold text-center w-24 ${theme === 'dark' ? 'text-gray-400' : 'text-gray-600'}`}>Автор</th>
                <th className="p-4 text-center"></th>
              </tr>
            </thead>
            <tbody className={`divide-y ${theme === 'dark' ? 'divide-white/5' : 'divide-gray-100'}`}>
              {(() => {
                // Group deals by date
                const groupedDeals: { [key: string]: typeof deals } = {}
                deals.forEach(deal => {
                  const dateKey = deal.createdAt
                  if (!groupedDeals[dateKey]) {
                    groupedDeals[dateKey] = []
                  }
                  groupedDeals[dateKey].push(deal)
                })

                const dates = Object.keys(groupedDeals).sort().reverse()
                const rows: React.ReactNode[] = []

                dates.forEach((dateKey, dateIndex) => {
                  const dateDeals = groupedDeals[dateKey]

                  // Date separator row (horizontal line before each date group except first)
                  if (dateIndex > 0) {
                    rows.push(
                      <tr key={`separator-${dateKey}`}>
                        <td colSpan={9} className="py-2 px-4">
                          <div className={`h-px ${theme === 'dark' ? 'bg-white/10' : 'bg-gray-200'}`} />
                        </td>
                      </tr>
                    )
                  }

                  // Date header row
                  rows.push(
                    <tr key={`header-${dateKey}`} className={`${theme === 'dark' ? 'bg-white/5' : 'bg-gray-50'}`}>
                      <td colSpan={9} className="p-3 px-4">
                        <span className={`text-sm font-semibold ${theme === 'dark' ? 'text-gray-400' : 'text-gray-600'}`}>
                          {formatDate(dateKey)}
                        </span>
                      </td>
                    </tr>
                  )

                  // Deal rows
                  dateDeals.forEach((deal) => {
                    const globalIndex = deals.findIndex(d => d.id === deal.id)
                    rows.push(
                      <tr key={deal.id} className={`${hoverBg} transition-colors`}>
                        <td className={`p-4 text-center border-r ${theme === 'dark' ? 'border-white/5' : 'border-gray-100'}`}>
                          <span className={`font-mono text-sm font-bold ${mutedColor}`}>
                            {globalIndex + 1}
                          </span>
                        </td>
                        <td className={`p-4 text-center border-r ${theme === 'dark' ? 'border-white/5' : 'border-gray-100'}`}>
                          <span className={`font-mono text-sm ${mutedColor}`}>
                            {formatDate(deal.createdAt)}
                          </span>
                        </td>
                        <td className={`p-4 text-center border-r ${theme === 'dark' ? 'border-white/5' : 'border-gray-100'}`}>
                          <div className="flex items-center justify-center gap-2">
                            {deal.contract ? (
                              <a
                                href={`https://gmgn.ai/sol/token/${deal.contract}`}
                                target="_blank"
                                rel="noopener noreferrer"
                                className={`font-mono text-sm text-blue-400 hover:text-blue-300 underline cursor-pointer`}
                                title="Open in GMGN"
                              >
                                {truncateAddress(deal.contract)}
                              </a>
                            ) : (
                              <span className={`font-mono text-sm ${mutedColor}`}>-</span>
                            )}
                            <button
                              onClick={() => copyToClipboard(deal.contract, deal.id)}
                              className={`p-1 rounded transition-colors ${copiedId === deal.id ? 'text-green-500' : mutedColor} hover:bg-white/10`}
                              title="Copy"
                            >
                              {copiedId === deal.id ? (
                                <Calculator className="w-4 h-4" />
                              ) : (
                                <Copy className="w-4 h-4" />
                              )}
                            </button>
                          </div>
                        </td>
                        <td className={`p-4 text-center border-r ${theme === 'dark' ? 'border-white/5' : 'border-gray-100'}`}>
                          <span className={`font-mono text-sm font-bold text-emerald-500`}>
                            {deal.marketCap || '-'}
                          </span>
                        </td>
                        <td className={`p-4 text-center border-r ${theme === 'dark' ? 'border-white/5' : 'border-gray-100'}`}>
                          <span className={`font-mono text-sm ${deal.drop07.startsWith('-') ? 'text-rose-500' : headingColor}`}>
                            {deal.drop07 || '-'}
                          </span>
                        </td>
                        <td className={`p-4 text-center border-r ${theme === 'dark' ? 'border-white/5' : 'border-gray-100'}`}>
                          <span className="font-mono text-sm font-bold text-green-500">
                            {deal.profit || '-'}
                          </span>
                        </td>
                        <td className={`p-4 text-center border-r ${theme === 'dark' ? 'border-white/5' : 'border-gray-100'}`}>
                          {deal.screenshot ? (
                            <button
                              onClick={() => deal.screenshot && openScreenshotModal(deal.screenshot, deal)}
                              className={`p-2 rounded-lg ${hoverBg} transition-colors`}
                              title="View screenshot"
                            >
                              <Eye className="w-4 h-4 text-emerald-500" />
                            </button>
                          ) : (
                            <span className={`text-xs ${mutedColor}`}>-</span>
                          )}
                        </td>
                        <td className={`p-4 text-center border-r ${theme === 'dark' ? 'border-white/5' : 'border-gray-100'}`}>
                          <div className="flex items-center justify-center gap-1">
                            <User className={`w-3 h-3 ${mutedColor}`} />
                            <span className={`text-xs ${mutedColor}`}>{deal.createdBy}</span>
                          </div>
                        </td>
                        <td className="p-4 text-center">
                          <div className="flex items-center justify-center gap-1">
                            <button
                              onClick={() => openEditModal(deal)}
                              className={`p-2 rounded-lg ${hoverBg} transition-colors`}
                              title="Edit"
                            >
                              <Edit2 className="w-4 h-4 text-blue-500" />
                            </button>
                            {isAdmin && (
                              <button
                                onClick={() => confirmDelete(deal.id)}
                                className={`p-2 rounded-lg ${hoverBg} transition-colors`}
                                title="Delete"
                              >
                                <Trash2 className="w-4 h-4 text-rose-500" />
                              </button>
                            )}
                          </div>
                        </td>
                      </tr>
                    )
                  })
                })

                return rows.length > 0 ? rows : (
                  <tr>
                    <td colSpan={9} className="p-16 text-center">
                      <TrendingUp className={`w-12 h-12 mx-auto mb-3 opacity-20 ${mutedColor}`} />
                      <p className={`text-sm ${mutedColor}`}>No records</p>
                    </td>
                  </tr>
                )
              })()}
            </tbody>
          </table>

          {deals.length === 0 && (
            <div className="p-16 text-center">
              <TrendingUp className={`w-12 h-12 mx-auto mb-4 opacity-20 ${mutedColor}`} />
              <p className={`text-sm ${mutedColor}`}>Нет записей</p>
            </div>
          )}
        </div>
      </div>

      {/* Screenshot Preview Modal */}
      {showScreenshotModal && currentScreenshot && currentDealInfo && (
        <div 
          className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-sm"
          onClick={() => setShowScreenshotModal(false)}
        >
          <div 
            className={`relative max-w-4xl w-full rounded-3xl overflow-hidden ${cardBg} shadow-2xl`}
            onClick={(e) => e.stopPropagation()}
          >
            {/* Header */}
            <div className={`p-4 border-b ${theme === 'dark' ? 'border-white/10' : 'border-gray-100'} flex items-center justify-between`}>
              <div className="flex items-center gap-4">
                <span className={`font-mono text-sm ${mutedColor}`}>
                  {currentDealInfo.date} at {currentDealInfo.time}
                </span>
                <a
                  href={`https://gmgn.ai/sol/token/${currentDealInfo.contract}`}
                  target="_blank"
                  rel="noopener noreferrer"
                  className={`font-mono text-sm text-blue-400 hover:text-blue-300 underline`}
                >
                  {truncateAddress(currentDealInfo.contract)}
                </a>
              </div>
              <button
                onClick={() => setShowScreenshotModal(false)}
                className={`p-2 rounded-lg hover:bg-white/10 ${mutedColor}`}
              >
                <X className="w-5 h-5" />
              </button>
            </div>
            
            {/* Screenshot */}
            <div className="p-4">
              <img
                src={currentScreenshot}
                alt="Deal screenshot"
                className="w-full h-auto rounded-xl"
              />
            </div>
          </div>
        </div>
      )}

      {/* Add/Edit Modal */}
      {showModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm">
          <div className={`w-full max-w-md rounded-3xl ${cardBg} ${cardBorder} border shadow-2xl overflow-hidden`}>
            {/* Header */}
            <div className={`p-6 border-b ${theme === 'dark' ? 'border-white/10' : 'border-gray-100'} flex items-center justify-between`}>
              <div className="space-y-1">
                <h3 className={`text-xl font-bold ${headingColor}`}>
                  {editingId ? 'Edit Deal' : 'Add Deal'}
                </h3>
                <p className={`text-xs ${mutedColor}`}>
                  {editingId ? 'Edit deal details' : 'Fill in deal details'}
                </p>
              </div>
              <button
                onClick={() => {
                  resetForm()
                  setShowModal(false)
                }}
                className={`p-2 rounded-lg hover:bg-white/10 ${mutedColor}`}
              >
                <X className="w-5 h-5" />
              </button>
            </div>
            {/* Form */}
            <div className="p-6 space-y-4">
              <div>
                <label className={`block text-xs font-bold uppercase tracking-wider mb-2 ${mutedColor}`}>
                  Контракт *
                </label>
                <input
                  type="text"
                  placeholder="0x..."
                  value={newDeal.contract}
                  onChange={(e) => setNewDeal({ ...newDeal, contract: e.target.value })}
                  className={`w-full px-4 py-3 rounded-xl border outline-none transition-all font-mono text-sm ${theme === 'dark' ? 'bg-white/5 border-white/10 text-white focus:border-emerald-500/50' : 'bg-gray-50 border-gray-200 text-gray-900 focus:border-emerald-500/30'}`}
                />
              </div>

              <div>
                <label className={`block text-xs font-bold uppercase tracking-wider mb-2 ${mutedColor}`}>
                  Market Cap *
                </label>
                <input
                  type="text"
                  placeholder="$500K или $1.2M"
                  value={newDeal.marketCap}
                  onChange={(e) => setNewDeal({ ...newDeal, marketCap: e.target.value })}
                  className={`w-full px-4 py-3 rounded-xl border outline-none transition-all font-mono text-sm ${theme === 'dark' ? 'bg-white/5 border-white/10 text-white focus:border-emerald-500/50' : 'bg-gray-50 border-gray-200 text-gray-900 focus:border-emerald-500/30'}`}
                />
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className={`block text-xs font-bold uppercase tracking-wider mb-2 ${mutedColor}`}>
                    DROP 0,7
                  </label>
                  <input
                    type="text"
                    placeholder="-5%"
                    value={newDeal.drop07}
                    onChange={(e) => setNewDeal({ ...newDeal, drop07: e.target.value })}
                    className={`w-full px-4 py-3 rounded-xl border outline-none transition-all font-mono text-sm ${theme === 'dark' ? 'bg-white/5 border-white/10 text-white focus:border-emerald-500/50' : 'bg-gray-50 border-gray-200 text-gray-900 focus:border-emerald-500/30'}`}
                  />
                </div>
                <div>
                  <label className={`block text-xs font-bold uppercase tracking-wider mb-2 ${mutedColor}`}>
                    Profit
                  </label>
                  <input
                    type="text"
                    placeholder="+25%"
                    value={newDeal.profit}
                    onChange={(e) => setNewDeal({ ...newDeal, profit: e.target.value })}
                    className={`w-full px-4 py-3 rounded-xl border outline-none transition-all font-mono text-sm ${theme === 'dark' ? 'bg-white/5 border-white/10 text-white focus:border-emerald-500/50' : 'bg-gray-50 border-gray-200 text-gray-900 focus:border-emerald-500/30'}`}
                  />
                </div>
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className={`block text-xs font-bold uppercase tracking-wider mb-2 ${mutedColor}`}>
                    Date
                  </label>
                  <input
                    type="date"
                    value={new Date().toISOString().split('T')[0]}
                    onChange={() => {}}
                    className={`w-full px-4 py-3 rounded-xl border outline-none transition-all font-mono text-sm ${theme === 'dark' ? 'bg-white/5 border-white/10 text-white' : 'bg-gray-50 border-gray-200 text-gray-900'}`}
                    disabled
                  />
                </div>
                <div>
                  <label className={`block text-xs font-bold uppercase tracking-wider mb-2 ${mutedColor}`}>
                    Time
                  </label>
                  <input
                    type="time"
                    value={timeValue}
                    onChange={(e) => setTimeValue(e.target.value)}
                    className={`w-full px-4 py-3 rounded-xl border outline-none transition-all font-mono text-sm ${theme === 'dark' ? 'bg-white/5 border-white/10 text-white focus:border-emerald-500/50' : 'bg-gray-50 border-gray-200 text-gray-900 focus:border-emerald-500/30'}`}
                  />
                </div>
              </div>

              <div>
                <label className={`block text-xs font-bold uppercase tracking-wider mb-2 ${mutedColor}`}>
                  Screenshot
                </label>
                <div className="space-y-3">
                  {/* Screenshot preview */}
                  {newDeal.screenshot && (
                    <div className="relative">
                      <img
                        src={newDeal.screenshot}
                        alt="Screenshot preview"
                        className="w-full h-32 object-cover rounded-xl border border-white/10"
                      />
                      <button
                        onClick={() => setNewDeal({ ...newDeal, screenshot: '' })}
                        className="absolute top-2 right-2 p-1.5 rounded-lg bg-rose-500 text-white hover:bg-rose-600 transition-colors"
                      >
                        <X className="w-4 h-4" />
                      </button>
                    </div>
                  )}
                  
                  {/* File upload area */}
                  <div 
                    className={`relative flex items-center justify-center gap-2 px-4 py-4 rounded-xl border border-dashed cursor-pointer transition-all ${theme === 'dark' ? 'border-white/20 hover:border-emerald-500/50 hover:bg-white/5' : 'border-gray-300 hover:border-emerald-500/50 hover:bg-gray-50'}`}
                    onPaste={handleScreenshotPaste}
                    onDrop={handleScreenshotDrop}
                    onDragOver={(e) => e.preventDefault()}
                  >
                    <input
                      type="file"
                      accept="image/*"
                      onChange={handleScreenshotUpload}
                      className="absolute inset-0 w-full h-full opacity-0 cursor-pointer"
                    />
                    <ImageIcon className={`w-5 h-5 ${mutedColor}`} />
                    <div className="text-center">
                      <span className={`text-sm ${mutedColor}`}>
                        {newDeal.screenshot ? 'Replace file' : 'Drop, paste or upload'}
                      </span>
                      <p className={`text-xs ${mutedColor} mt-1 opacity-60`}>
                        Supports drag & drop, Ctrl+V, file upload
                      </p>
                    </div>
                  </div>
                </div>
              </div>
            </div>

            {/* Footer */}
            <div className={`p-6 border-t ${theme === 'dark' ? 'border-white/10' : 'border-gray-100'} flex gap-3`}>
              <button
                onClick={() => {
                  resetForm()
                  setShowModal(false)
                }}
                className={`flex-1 px-4 py-3 rounded-xl font-semibold transition-all ${theme === 'dark' ? 'bg-white/5 hover:bg-white/10 text-gray-300' : 'bg-gray-100 hover:bg-gray-200 text-gray-700'}`}
              >
                Cancel
              </button>
              <button
                onClick={editingId ? handleEditDeal : handleAddDeal}
                disabled={!newDeal.contract || !newDeal.marketCap}
                className={`flex-1 px-4 py-3 rounded-xl font-semibold transition-all shadow-lg ${!newDeal.contract || !newDeal.marketCap ? 'opacity-50 cursor-not-allowed bg-emerald-500 text-white' : 'bg-emerald-500 hover:bg-emerald-600 text-white shadow-emerald-500/20'}`}
              >
                {editingId ? 'Save' : 'Add'}
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Delete Confirmation Modal */}
      {showDeleteModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm">
          <div className={`w-full max-w-sm rounded-3xl ${cardBg} ${cardBorder} border shadow-2xl overflow-hidden`}>
            <div className="p-6">
              <div className="w-12 h-12 rounded-full bg-rose-500/10 flex items-center justify-center mx-auto mb-4">
                <Trash2 className="w-6 h-6 text-rose-500" />
              </div>
              <h3 className={`text-lg font-bold text-center ${headingColor} mb-2`}>
                Delete Deal?
              </h3>
              <p className={`text-sm text-center ${mutedColor} mb-6`}>
                This action cannot be undone. The deal will be deleted permanently.
              </p>
              <div className="flex gap-3">
                <button
                  onClick={() => {
                    setDeletingId(null)
                    setShowDeleteModal(false)
                  }}
                  className={`flex-1 px-4 py-3 rounded-xl font-semibold transition-all ${theme === 'dark' ? 'bg-white/5 hover:bg-white/10 text-gray-300' : 'bg-gray-100 hover:bg-gray-200 text-gray-700'}`}
                >
                  Cancel
                </button>
                <button
                  onClick={handleDeleteDeal}
                  className="flex-1 px-4 py-3 rounded-xl font-semibold transition-all shadow-lg bg-rose-500 hover:bg-rose-600 text-white shadow-rose-500/20"
                >
                  Delete
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  )
}