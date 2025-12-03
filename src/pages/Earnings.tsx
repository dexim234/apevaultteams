// Earnings page
import { useState, useEffect } from 'react'
import { Layout } from '@/components/Layout'
import { useThemeStore } from '@/store/themeStore'
import { EarningsForm } from '@/components/Earnings/EarningsForm'
import { EarningsTable } from '@/components/Earnings/EarningsTable'
import { EarningsList } from '@/components/Earnings/EarningsList'
import { getEarnings } from '@/services/firestoreService'
import { Earnings as EarningsType } from '@/types'
import { Plus, DollarSign, TrendingUp, Sparkles, Wallet, PiggyBank } from 'lucide-react'
import { getWeekRange, formatDate } from '@/utils/dateUtils'

export const Earnings = () => {
  const { theme } = useThemeStore()
  const [showForm, setShowForm] = useState(false)
  const [editingEarning, setEditingEarning] = useState<EarningsType | null>(null)
  const [earnings, setEarnings] = useState<EarningsType[]>([])
  const [loading, setLoading] = useState(true)
  const [stats, setStats] = useState({
    weekTotal: 0,
    weekPool: 0,
    monthTotal: 0,
    monthPool: 0
  })

  const headingColor = theme === 'dark' ? 'text-white' : 'text-gray-900'
  const cardBg = theme === 'dark' ? 'bg-[#1a1a1a]' : 'bg-white'

  const calculateStats = () => {
    const weekRange = getWeekRange()
    const weekStart = formatDate(weekRange.start, 'yyyy-MM-dd')
    const weekEnd = formatDate(weekRange.end, 'yyyy-MM-dd')
    
    const monthStart = formatDate(new Date(new Date().getFullYear(), new Date().getMonth(), 1), 'yyyy-MM-dd')
    const monthEnd = formatDate(new Date(new Date().getFullYear(), new Date().getMonth() + 1, 0), 'yyyy-MM-dd')

    const weekEarnings = earnings.filter((e: EarningsType) => e.date >= weekStart && e.date <= weekEnd)
    const monthEarnings = earnings.filter((e: EarningsType) => e.date >= monthStart && e.date <= monthEnd)

    setStats({
      weekTotal: weekEarnings.reduce((sum: number, e: EarningsType) => sum + e.amount, 0),
      weekPool: weekEarnings.reduce((sum: number, e: EarningsType) => sum + e.poolAmount, 0),
      monthTotal: monthEarnings.reduce((sum: number, e: EarningsType) => sum + e.amount, 0),
      monthPool: monthEarnings.reduce((sum: number, e: EarningsType) => sum + e.poolAmount, 0)
    })
  }

  useEffect(() => {
    loadEarnings()
  }, [])

  useEffect(() => {
    if (earnings.length > 0) {
      calculateStats()
    }
  }, [earnings])

  const loadEarnings = async () => {
    setLoading(true)
    try {
      const allEarnings = await getEarnings()
      setEarnings(allEarnings)
    } catch (error) {
      console.error('Error loading earnings:', error)
    } finally {
      setLoading(false)
    }
  }

  const handleEdit = (earning: EarningsType) => {
    setEditingEarning(earning)
    setShowForm(true)
  }

  const handleCloseForm = () => {
    setShowForm(false)
    setEditingEarning(null)
  }

  const handleSave = () => {
    setShowForm(false)
    setEditingEarning(null)
    loadEarnings()
  }

  return (
    <Layout>
      <div className="space-y-6">
        {/* Header */}
        <div className={`rounded-xl sm:rounded-2xl p-4 sm:p-6 md:p-8 ${cardBg} shadow-xl border-2 ${
          theme === 'dark' 
            ? 'border-[#4E6E49]/30 bg-gradient-to-br from-[#1a1a1a] via-[#1a1a1a] to-[#0A0A0A]' 
            : 'border-green-200 bg-gradient-to-br from-white via-green-50/30 to-white'
        } relative overflow-hidden`}>
          {/* Decorative elements */}
          <div className="absolute top-0 right-0 w-32 h-32 sm:w-64 sm:h-64 bg-gradient-to-br from-[#4E6E49]/10 to-emerald-700/10 rounded-full blur-3xl -mr-16 sm:-mr-32 -mt-16 sm:-mt-32" />
          <div className="absolute bottom-0 left-0 w-24 h-24 sm:w-48 sm:h-48 bg-gradient-to-tr from-yellow-500/10 to-orange-500/10 rounded-full blur-2xl -ml-12 sm:-ml-24 -mb-12 sm:-mb-24" />
          
          <div className="relative z-10">
            <div className="flex flex-col gap-4 sm:gap-6 lg:flex-row lg:items-start lg:justify-between mb-4 sm:mb-6">
              <div className="flex-1 min-w-0 space-y-3 sm:space-y-4">
                <div className="flex items-center gap-3 sm:gap-4">
                  <div
                    className={`p-3 sm:p-4 rounded-xl sm:rounded-2xl shadow-lg flex-shrink-0 ${
                      theme === 'dark'
                        ? 'bg-gradient-to-br from-[#4E6E49] to-emerald-700'
                        : 'bg-gradient-to-br from-[#4E6E49] to-emerald-700'
                    } text-white transform transition-transform active:scale-95 sm:hover:scale-110`}
                  >
                    <DollarSign className="w-5 h-5 sm:w-7 sm:h-7" />
                  </div>
                  <div className="flex-1 min-w-0">
                    <h1
                      className={`text-2xl sm:text-3xl md:text-4xl font-extrabold ${headingColor} flex items-center gap-2 sm:gap-3`}
                    >
                      <span className="bg-gradient-to-r from-[#4E6E49] via-emerald-700 to-yellow-600 text-transparent bg-clip-text">
                        Заработок команды
                      </span>
                      <Sparkles
                        className={`w-5 h-5 sm:w-6 sm:h-6 flex-shrink-0 ${
                          theme === 'dark' ? 'text-yellow-400' : 'text-yellow-500'
                        } animate-pulse`}
                      />
                    </h1>
                  </div>
                </div>
                <p className={`text-sm sm:text-base font-medium ${theme === 'dark' ? 'text-gray-400' : 'text-gray-600'}`}>
                  Отслеживайте доходы и вклад каждого участника в общий успех
                </p>
              </div>
              <button
                onClick={() => setShowForm(true)}
                className={`w-full lg:w-auto px-4 sm:px-6 py-3 sm:py-4 bg-gradient-to-r from-[#4E6E49] to-[#4E6E49] hover:from-[#4E6E49] hover:to-[#4E6E49] text-white rounded-lg sm:rounded-xl transition-all duration-200 flex items-center justify-center gap-2 text-sm sm:text-base font-semibold shadow-lg hover:shadow-xl active:scale-95 sm:hover:scale-105 transform touch-manipulation`}
              >
                <Plus className="w-4 h-4 sm:w-5 sm:h-5 flex-shrink-0" />
                <span className="whitespace-nowrap">Добавить заработок</span>
              </button>
            </div>
          </div>

          {/* Stats cards */}
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 mb-6">
            <div className={`p-4 rounded-xl border-2 ${
              theme === 'dark' 
                ? 'bg-blue-500/10 border-blue-500/30' 
                : 'bg-blue-50 border-blue-200'
            }`}>
              <div className="flex items-center gap-3 mb-2">
                <div className={`p-2 rounded-lg ${
                  theme === 'dark' ? 'bg-blue-500/20' : 'bg-blue-100'
                }`}>
                  <TrendingUp className={`w-5 h-5 ${theme === 'dark' ? 'text-blue-400' : 'text-blue-600'}`} />
                </div>
                <p className={`text-xs ${theme === 'dark' ? 'text-gray-400' : 'text-gray-600'}`}>Неделя</p>
              </div>
              <p className={`text-2xl font-bold ${theme === 'dark' ? 'text-blue-400' : 'text-blue-600'}`}>
                {stats.weekTotal.toFixed(2)} ₽
              </p>
            </div>
            <div className={`p-4 rounded-xl border-2 ${
              theme === 'dark' 
                ? 'bg-purple-500/10 border-purple-500/30' 
                : 'bg-purple-50 border-purple-200'
            }`}>
              <div className="flex items-center gap-3 mb-2">
                <div className={`p-2 rounded-lg ${
                  theme === 'dark' ? 'bg-purple-500/20' : 'bg-purple-100'
                }`}>
                  <PiggyBank className={`w-5 h-5 ${theme === 'dark' ? 'text-purple-400' : 'text-purple-600'}`} />
                </div>
                <p className={`text-xs ${theme === 'dark' ? 'text-gray-400' : 'text-gray-600'}`}>Пул за неделю</p>
              </div>
              <p className={`text-2xl font-bold ${theme === 'dark' ? 'text-purple-400' : 'text-purple-600'}`}>
                {stats.weekPool.toFixed(2)} ₽
              </p>
            </div>
            <div className={`p-4 rounded-xl border-2 ${
              theme === 'dark' 
                ? 'bg-[#4E6E49]/10 border-[#4E6E49]/30' 
                : 'bg-green-50 border-green-200'
            }`}>
              <div className="flex items-center gap-3 mb-2">
                <div className={`p-2 rounded-lg ${
                  theme === 'dark' ? 'bg-[#4E6E49]/20' : 'bg-green-100'
                }`}>
                  <Wallet className={`w-5 h-5 ${theme === 'dark' ? 'text-[#4E6E49]' : 'text-[#4E6E49]'}`} />
                </div>
                <p className={`text-xs ${theme === 'dark' ? 'text-gray-400' : 'text-gray-600'}`}>Месяц</p>
              </div>
              <p className={`text-2xl font-bold ${theme === 'dark' ? 'text-[#4E6E49]' : 'text-[#4E6E49]'}`}>
                {stats.monthTotal.toFixed(2)} ₽
              </p>
            </div>
            <div className={`p-4 rounded-xl border-2 ${
              theme === 'dark' 
                ? 'bg-orange-500/10 border-orange-500/30' 
                : 'bg-orange-50 border-orange-200'
            }`}>
              <div className="flex items-center gap-3 mb-2">
                <div className={`p-2 rounded-lg ${
                  theme === 'dark' ? 'bg-orange-500/20' : 'bg-orange-100'
                }`}>
                  <PiggyBank className={`w-5 h-5 ${theme === 'dark' ? 'text-orange-400' : 'text-orange-600'}`} />
                </div>
                <p className={`text-xs ${theme === 'dark' ? 'text-gray-400' : 'text-gray-600'}`}>Пул за месяц</p>
              </div>
              <p className={`text-2xl font-bold ${theme === 'dark' ? 'text-orange-400' : 'text-orange-600'}`}>
                {stats.monthPool.toFixed(2)} ₽
              </p>
            </div>
          </div>

          <div className="hidden sm:flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between pt-4 border-t border-gray-800/50 dark:border-gray-800">
            <h2 className={`text-base sm:text-lg md:text-xl font-semibold ${theme === 'dark' ? 'text-white' : 'text-gray-900'}`}>Управление заработком</h2>
          </div>
        </div>

        {/* Earnings statistics */}
        {loading ? (
          <div className={`rounded-xl p-8 text-center border-2 ${
            theme === 'dark' 
              ? 'bg-[#1a1a1a] border-gray-800' 
              : 'bg-white border-gray-200'
          } shadow-md`}>
            <div className="flex flex-col items-center gap-3">
              <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-[#4E6E49]"></div>
              <p className={theme === 'dark' ? 'text-gray-400' : 'text-gray-600'}>Загрузка данных...</p>
            </div>
          </div>
        ) : (
          <>
            <EarningsTable earnings={earnings} />
            <EarningsList
              earnings={earnings}
              onEdit={handleEdit}
              onDelete={loadEarnings}
            />
          </>
        )}

        {/* Form */}
        {showForm && (
          <EarningsForm
            onClose={handleCloseForm}
            onSave={handleSave}
            editingEarning={editingEarning}
          />
        )}
      </div>
    </Layout>
  )
}

