import { useState, useMemo } from 'react'
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
  
  // Delete confirmation modal state
  const [showDeleteModal, setShowDeleteModal] = useState(false)
  const [deletingId, setDeletingId] = useState<string | null>(null)

  const resetForm = () => {
    setNewDeal({ contract: '', marketCap: '', drop07: '', profit: '', screenshot: '' })
    setEditingId(null)
  }

  const handleAddDeal = () => {
    if (!newDeal.contract || !newDeal.marketCap) return

    const deal: OurDealSignal = {
      id: Date.now().toString(),
      contract: newDeal.contract,
      marketCap: newDeal.marketCap,
      drop07: newDeal.drop07 || '-',
      profit: newDeal.profit || '-',
      screenshot: newDeal.screenshot || undefined,
      createdAt: new Date().toISOString().split('T')[0],
      createdBy: user?.id || 'admin'
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
            screenshot: newDeal.screenshot || undefined
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
    setNewDeal({
      contract: deal.contract,
      marketCap: deal.marketCap,
      drop07: deal.drop07,
      profit: deal.profit,
      screenshot: deal.screenshot || ''
    })
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
      return acc + Math.abs(val)
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
              <div>
                <h1 className={`text-3xl font-black tracking-tight ${headingColor} whitespace-nowrap`}>
                  Deal Analysis
                </h1>
              </div>
              <p className={`text-sm ${mutedColor} mt-1`}>
                Tracking our trading signals results
              </p>
            </div>
          </div>

          {/* Center: Action Button */}
          <div className="flex items-center gap-3">
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
                <th className="p-4 text-xs uppercase tracking-wider font-semibold text-center w-12">№</th>
                <th className="p-4 text-xs uppercase tracking-wider font-semibold text-center">Дата</th>
                <th className="p-4 text-xs uppercase tracking-wider font-semibold text-center">Контракт</th>
                <th className="p-4 text-xs uppercase tracking-wider font-semibold text-center">MC</th>
                <th className="p-4 text-xs uppercase tracking-wider font-semibold text-center">DROP 0,7</th>
                <th className="p-4 text-xs uppercase tracking-wider font-semibold text-center">Профит</th>
                <th className="p-4 text-xs uppercase tracking-wider font-semibold text-center w-20">Скрин</th>
                <th className="p-4 text-xs uppercase tracking-wider font-semibold text-center w-24">Автор</th>
                <th className="p-4 text-xs uppercase tracking-wider font-semibold text-center w-24"></th>
              </tr>
            </thead>
            <tbody className={`divide-y ${theme === 'dark' ? 'divide-white/5' : 'divide-gray-100'}`}>
              {deals.map((deal, index) => (
                <tr key={deal.id} className={`${hoverBg} transition-colors`}>
                  <td className="p-4 text-center">
                    <span className={`font-mono text-sm font-bold ${mutedColor}`}>
                      {index + 1}
                    </span>
                  </td>
                  <td className="p-4 text-center">
                    <span className={`font-mono text-sm ${mutedColor}`}>
                      {formatDate(deal.createdAt)}
                    </span>
                  </td>
                  <td className="p-4 text-center">
                    <div className="flex items-center justify-center gap-2">
                      {deal.contract ? (
                        <a
                          href={`https://gmgn.ai/sol/token/${deal.contract}`}
                          target="_blank"
                          rel="noopener noreferrer"
                          className={`font-mono text-sm text-blue-400 hover:text-blue-300 underline cursor-pointer`}
                          title="Открыть в GMGN"
                        >
                          {truncateAddress(deal.contract)}
                        </a>
                      ) : (
                        <span className={`font-mono text-sm ${mutedColor}`}>-</span>
                      )}
                      <button
                        onClick={() => copyToClipboard(deal.contract, deal.id)}
                        className={`p-1 rounded transition-colors ${copiedId === deal.id ? 'text-green-500' : mutedColor} hover:bg-white/10`}
                        title="Копировать"
                      >
                        {copiedId === deal.id ? (
                          <Calculator className="w-4 h-4" />
                        ) : (
                          <Copy className="w-4 h-4" />
                        )}
                      </button>
                    </div>
                  </td>
                  <td className="p-4 text-center">
                    <span className={`font-mono text-sm font-bold text-emerald-500`}>
                      {deal.marketCap || '-'}
                    </span>
                  </td>
                  <td className="p-4 text-center">
                    <span className={`font-mono text-sm ${deal.drop07.startsWith('-') ? 'text-rose-500' : headingColor}`}>
                      {deal.drop07 || '-'}
                    </span>
                  </td>
                  <td className="p-4 text-center">
                    <span className="font-mono text-sm font-bold text-green-500">
                      {deal.profit || '-'}
                    </span>
                  </td>
                  <td className="p-4 text-center">
                    {deal.screenshot ? (
                      <button
                        onClick={() => window.open(deal.screenshot, '_blank')}
                        className={`p-2 rounded-lg ${hoverBg} transition-colors`}
                        title="Просмотр скрин"
                      >
                        <Eye className="w-4 h-4 text-emerald-500" />
                      </button>
                    ) : (
                      <span className={`text-xs ${mutedColor}`}>-</span>
                    )}
                  </td>
                  <td className="p-4 text-center">
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
                        title="Редактировать"
                      >
                        <Edit2 className="w-4 h-4 text-blue-500" />
                      </button>
                      {isAdmin && (
                        <button
                          onClick={() => confirmDelete(deal.id)}
                          className={`p-2 rounded-lg ${hoverBg} transition-colors`}
                          title="Удалить"
                        >
                          <Trash2 className="w-4 h-4 text-rose-500" />
                        </button>
                      )}
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>

          {deals.length === 0 && (
            <div className="p-16 text-center">
              <TrendingUp className={`w-12 h-12 mx-auto mb-3 opacity-20 ${mutedColor}`} />
              <p className={`text-sm ${mutedColor}`}>Нет записей</p>
            </div>
          )}
        </div>
      </div>

      {/* Add/Edit Modal */}
      {showModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm">
          <div className={`w-full max-w-md rounded-3xl ${cardBg} ${cardBorder} border shadow-2xl overflow-hidden`}>
            {/* Header */}
            <div className={`p-6 border-b ${theme === 'dark' ? 'border-white/10' : 'border-gray-100'} flex items-center justify-between`}>
              <div className="space-y-1">
                <h3 className={`text-xl font-bold ${headingColor}`}>
                  {editingId ? 'Редактировать сделку' : 'Добавить сделку'}
                </h3>
                <p className={`text-xs ${mutedColor}`}>
                  {editingId ? 'Измените данные торговой сделки' : 'Заполните данные торговой сделки'}
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
                    Профит
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

              <div>
                <label className={`block text-xs font-bold uppercase tracking-wider mb-2 ${mutedColor}`}>
                  Скрин (URL)
                </label>
                <div className="relative">
                  <input
                    type="text"
                    placeholder="https://..."
                    value={newDeal.screenshot}
                    onChange={(e) => setNewDeal({ ...newDeal, screenshot: e.target.value })}
                    className={`w-full px-4 py-3 rounded-xl border outline-none transition-all font-mono text-sm ${theme === 'dark' ? 'bg-white/5 border-white/10 text-white focus:border-emerald-500/50' : 'bg-gray-50 border-gray-200 text-gray-900 focus:border-emerald-500/30'}`}
                  />
                  <ImageIcon className={`absolute right-3 top-1/2 -translate-y-1/2 w-5 h-5 ${mutedColor}`} />
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
                Отмена
              </button>
              <button
                onClick={editingId ? handleEditDeal : handleAddDeal}
                disabled={!newDeal.contract || !newDeal.marketCap}
                className={`flex-1 px-4 py-3 rounded-xl font-semibold transition-all shadow-lg ${!newDeal.contract || !newDeal.marketCap ? 'opacity-50 cursor-not-allowed bg-emerald-500 text-white' : 'bg-emerald-500 hover:bg-emerald-600 text-white shadow-emerald-500/20'}`}
              >
                {editingId ? 'Сохранить' : 'Добавить'}
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
              <div className={`w-12 h-12 rounded-full bg-rose-500/10 flex items-center justify-center mx-auto mb-4`}>
                <Trash2 className="w-6 h-6 text-rose-500" />
              </div>
              <h3 className={`text-lg font-bold text-center ${headingColor} mb-2`}>
                Удалить сделку?
              </h3>
              <p className={`text-sm text-center ${mutedColor} mb-6`}>
                Это действие нельзя отменить. Сделка будет удалена навсегда.
              </p>
              <div className="flex gap-3">
                <button
                  onClick={() => {
                    setDeletingId(null)
                    setShowDeleteModal(false)
                  }}
                  className={`flex-1 px-4 py-3 rounded-xl font-semibold transition-all ${theme === 'dark' ? 'bg-white/5 hover:bg-white/10 text-gray-300' : 'bg-gray-100 hover:bg-gray-200 text-gray-700'}`}
                >
                  Отмена
                </button>
                <button
                  onClick={handleDeleteDeal}
                  className="flex-1 px-4 py-3 rounded-xl font-semibold transition-all shadow-lg bg-rose-500 hover:bg-rose-600 text-white shadow-rose-500/20"
                >
                  Удалить
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  )
}