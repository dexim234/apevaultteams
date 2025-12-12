import { useEffect, useState } from 'react'
import { CheckCircle2, Clock, ThumbsDown, CheckSquare, Square } from 'lucide-react'
import { getApprovalRequests, approveApprovalRequest, rejectApprovalRequest } from '@/services/firestoreService'
import { ApprovalRequest, DayStatus, WorkSlot } from '@/types'
import { formatDate } from '@/utils/dateUtils'
import { getUserNicknameSync, clearNicknameCache } from '@/utils/userUtils'
import { useAuthStore } from '@/store/authStore'

const actionLabelMap: Record<ApprovalRequest['action'], string> = {
  create: 'Создание',
  update: 'Изменение',
  delete: 'Удаление',
}

const entityLabelMap: Record<ApprovalRequest['entity'], string> = {
  slot: 'Слот',
  status: 'Статус',
  earning: 'Заработок',
  referral: 'Реферал',
  login: 'Ник',
}

const statusToneMap: Record<ApprovalRequest['status'], string> = {
  pending: 'bg-amber-50 text-amber-900 border border-amber-200 shadow-inner dark:bg-amber-900/25 dark:text-amber-50 dark:border-amber-700',
  approved: 'bg-emerald-50 text-emerald-900 border border-emerald-200 shadow-inner dark:bg-emerald-900/25 dark:text-emerald-50 dark:border-emerald-700',
  rejected: 'bg-rose-50 text-rose-900 border border-rose-200 shadow-inner dark:bg-rose-900/25 dark:text-rose-50 dark:border-rose-700',
}

const statusBadgeMap: Record<ApprovalRequest['status'], JSX.Element> = {
  pending: (
    <span className="inline-flex items-center gap-1 px-2 py-1 rounded-full text-xs font-semibold bg-amber-100 text-amber-900 dark:bg-amber-900/40 dark:text-amber-100">
      <Clock className="w-3 h-3" /> На согласовании
    </span>
  ),
  approved: (
    <span className="inline-flex items-center gap-1 px-2 py-1 rounded-full text-xs font-semibold bg-emerald-100 text-emerald-900 dark:bg-emerald-900/40 dark:text-emerald-100">
      <CheckCircle2 className="w-3 h-3" /> Принято
    </span>
  ),
  rejected: (
    <span className="inline-flex items-center gap-1 px-2 py-1 rounded-full text-xs font-semibold bg-rose-100 text-rose-900 dark:bg-rose-900/40 dark:text-rose-100">
      <ThumbsDown className="w-3 h-3" /> Отклонено
    </span>
  ),
}

const getMemberName = (userId: string) =>
  getUserNicknameSync(userId)

const safeFormatDate = (value?: string | Date) => {
  if (!value) return '—'
  try {
    return formatDate(value, 'dd.MM.yyyy')
  } catch {
    return '—'
  }
}

const formatSlotPreview = (slot?: WorkSlot | null) => {
  if (!slot) return '—'
  const times = slot.slots
    ?.map((s) => `${s.start}-${s.end}${s.endDate ? ` (до ${safeFormatDate(s.endDate)})` : ''}`)
    ?.join(', ')
  return `${safeFormatDate(slot.date)}${times ? ` · ${times}` : ''}`
}

const formatStatusPreview = (status?: DayStatus | null) => {
  if (!status) return '—'
  const label =
    status.type === 'dayoff' ? 'Выходной' : status.type === 'sick' ? 'Больничный' : 'Отпуск'
  const range = status.endDate ? ` (${safeFormatDate(status.endDate)})` : ''
  return `${safeFormatDate(status.date)} · ${label}${range}`
}

export const ApprovalsTable = () => {
  const { user } = useAuthStore()
  const [approvals, setApprovals] = useState<ApprovalRequest[]>([])
  const [loading, setLoading] = useState(true)
  const [submittingId, setSubmittingId] = useState<string | null>(null)
  const [bulkSubmitting, setBulkSubmitting] = useState(false)
  const [selectedIds, setSelectedIds] = useState<string[]>([])
  const [error, setError] = useState<string | null>(null)

  const loadApprovals = async () => {
    setLoading(true)
    setError(null)
    try {
      const data = await getApprovalRequests()
      setApprovals(data)
    } catch (error) {
      console.error('Не удалось загрузить заявки на согласование', error)
      setError('Не удалось загрузить заявки')
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => {
    loadApprovals()
  }, [])

  const handleApprove = async (approvalId: string) => {
    if (submittingId) return
    setSubmittingId(approvalId)
    setError(null)
    try {
      const approval = approvals.find(a => a.id === approvalId)
      await approveApprovalRequest(approvalId, user?.id || 'admin')
      // Clear nickname cache if this was a nickname change request
      if (approval?.entity === 'login') {
        clearNicknameCache(approval.targetUserId)
      }
      await loadApprovals()
      setSelectedIds((prev) => prev.filter((id) => id !== approvalId))
    } catch (e: any) {
      console.error('Ошибка при подтверждении', e)
      setError(`Не удалось подтвердить заявку: ${e?.message || e}`)
      await loadApprovals()
    } finally {
      setSubmittingId(null)
    }
  }

  const handleReject = async (approvalId: string) => {
    if (submittingId) return
    const adminComment = prompt('Комментарий для отклонения заявки', 'Уточните детали') || 'Отклонено без комментария'
    setSubmittingId(approvalId)
    setError(null)
    try {
      await rejectApprovalRequest(approvalId, user?.id || 'admin', adminComment)
      await loadApprovals()
    } catch (e) {
      console.error('Ошибка при отклонении', e)
      setError('Не удалось отклонить заявку')
    } finally {
      setSubmittingId(null)
    }
  }

  const handleApproveSelected = async () => {
    if (bulkSubmitting || submittingId || selectedIds.length === 0) return
    setBulkSubmitting(true)
    setError(null)
    try {
      for (const id of selectedIds) {
        const approval = approvals.find(a => a.id === id)
        await approveApprovalRequest(id, user?.id || 'admin')
        // Clear nickname cache if this was a nickname change request
        if (approval?.entity === 'login') {
          clearNicknameCache(approval.targetUserId)
        }
      }
      await loadApprovals()
      setSelectedIds([])
    } catch (e: any) {
      console.error('Ошибка при подтверждении выбранных', e)
      setError(`Не удалось подтвердить выбранные заявки: ${e?.message || e}`)
      await loadApprovals()
    } finally {
      setBulkSubmitting(false)
    }
  }

  const handleRejectSelected = async () => {
    if (bulkSubmitting || submittingId || selectedIds.length === 0) return
    
    const adminComment = prompt('Комментарий для отклонения выбранных заявок', 'Отклонено без комментария') || 'Отклонено без комментария'
    if (adminComment === null) return // User cancelled
    
    setBulkSubmitting(true)
    setError(null)
    try {
      for (const id of selectedIds) {
        await rejectApprovalRequest(id, user?.id || 'admin', adminComment)
      }
      await loadApprovals()
      setSelectedIds([])
    } catch (e: any) {
      console.error('Ошибка при отклонении выбранных', e)
      setError(`Не удалось отклонить выбранные заявки: ${e?.message || e}`)
      await loadApprovals()
    } finally {
      setBulkSubmitting(false)
    }
  }

  const toggleSelection = (id: string) => {
    setSelectedIds((prev) => (prev.includes(id) ? prev.filter((x) => x !== id) : [...prev, id]))
  }

  const toggleSelectAllPending = () => {
    const pendingIds = approvals.filter((a) => a.status === 'pending').map((a) => a.id)
    const allSelected = pendingIds.every((id) => selectedIds.includes(id))
    setSelectedIds(allSelected ? [] : pendingIds)
  }

  const renderChangePreview = (approval: ApprovalRequest) => {
    // Check entity type first to avoid incorrect type casting
    // IMPORTANT: Check 'login' entity BEFORE 'status' to prevent incorrect type inference
    if (approval.entity === 'login') {
      const beforeData = approval.before as any
      const afterData = approval.after as any
      // Read nickname field directly from data object
      const beforeValue = beforeData?.nickname || '—'
      const afterValue = afterData?.nickname || '—'
      return `${beforeValue} → ${afterValue}`
    }
    if (approval.entity === 'slot') {
      const beforeSlot = approval.before as WorkSlot | null
      const afterSlot = approval.after as WorkSlot | null
      return `${formatSlotPreview(beforeSlot)} → ${formatSlotPreview(afterSlot)}`
    }
    if (approval.entity === 'status') {
      const beforeStatus = approval.before as DayStatus | null
      const afterStatus = approval.after as DayStatus | null
      return `${formatStatusPreview(beforeStatus)} → ${formatStatusPreview(afterStatus)}`
    }
    // For other entities (earning, referral), show basic info
    return approval.after ? 'Изменение' : approval.before ? 'Удаление' : 'Создание'
  }

  if (loading) {
    return (
      <div className="rounded-xl border border-gray-200 dark:border-gray-800 p-6 text-center text-sm text-gray-600 dark:text-gray-300">
        Загружаем заявки...
      </div>
    )
  }

  return (
    <div className="rounded-xl border border-gray-200 dark:border-gray-800 overflow-hidden shadow-sm">
      <div className="p-4 sm:p-5 border-b border-gray-200 dark:border-gray-800 flex items-center justify-between">
        <div>
          <p className="text-lg font-semibold">Согласования</p>
          <p className="text-sm text-gray-500 dark:text-gray-400">Заявки на изменение слотов и статусов</p>
        </div>
        <div className="flex items-center gap-2">
          <button
            onClick={handleApproveSelected}
            disabled={bulkSubmitting || submittingId !== null || selectedIds.length === 0}
            className="text-sm px-3 py-2 rounded-lg bg-emerald-600 hover:bg-emerald-700 disabled:bg-emerald-400 text-white font-semibold"
          >
            {bulkSubmitting ? 'Подтверждаем...' : `Принять выбранные (${selectedIds.length})`}
          </button>
          <button
            onClick={handleRejectSelected}
            disabled={bulkSubmitting || submittingId !== null || selectedIds.length === 0}
            className="text-sm px-3 py-2 rounded-lg bg-rose-600 hover:bg-rose-700 disabled:bg-rose-400 text-white font-semibold"
          >
            {bulkSubmitting ? 'Отклоняем...' : `Отклонить выбранные (${selectedIds.length})`}
          </button>
          <button
            onClick={loadApprovals}
            className="text-sm px-3 py-2 rounded-lg bg-gray-100 hover:bg-gray-200 dark:bg-gray-800 dark:hover:bg-gray-700 text-gray-700 dark:text-gray-200"
          >
            Обновить
          </button>
        </div>
      </div>
      {error && (
        <div className="px-4 py-3 bg-rose-100 text-rose-900 dark:bg-rose-900/30 dark:text-rose-100 text-sm">
          {error}
        </div>
      )}

      <div className="overflow-x-auto">
        <table className="min-w-full divide-y divide-gray-200 dark:divide-gray-800 text-sm">
          <thead className="bg-gray-50 dark:bg-gray-900/40">
            <tr>
              <th className="px-4 py-3 text-left font-semibold text-gray-700 dark:text-gray-200">Статус</th>
              <th className="px-4 py-3 text-left font-semibold text-gray-700 dark:text-gray-200">Тип</th>
              <th className="px-4 py-3 text-left font-semibold text-gray-700 dark:text-gray-200">Действие</th>
              <th className="px-4 py-3 text-left font-semibold text-gray-700 dark:text-gray-200">Кто</th>
              <th className="px-4 py-3 text-left font-semibold text-gray-700 dark:text-gray-200">Изменение</th>
              <th className="px-4 py-3 text-left font-semibold text-gray-700 dark:text-gray-200">Комментарий</th>
              <th className="px-4 py-3 text-left font-semibold text-gray-700 dark:text-gray-200">Действия</th>
              <th className="px-4 py-3 text-left font-semibold text-gray-700 dark:text-gray-200">
                <button
                  onClick={toggleSelectAllPending}
                  className="inline-flex items-center gap-1 text-sm text-[#4E6E49] hover:text-emerald-700"
                  title="Выбрать все на согласовании"
                >
                  {approvals.some((a) => a.status === 'pending') ? (
                    <>{approvals.filter((a) => a.status === 'pending').every((a) => selectedIds.includes(a.id)) ? <CheckSquare className="w-4 h-4" /> : <Square className="w-4 h-4" />} Все</>
                  ) : (
                    <Square className="w-4 h-4 opacity-50" />
                  )}
                </button>
              </th>
            </tr>
          </thead>
          <tbody className="divide-y divide-gray-200 dark:divide-gray-800">
            {approvals.map((approval) => (
              <tr key={approval.id} className={`bg-white dark:bg-[#0f1624] ${statusToneMap[approval.status]}`}>
                <td className="px-4 py-3 align-top">{statusBadgeMap[approval.status]}</td>
                <td className="px-4 py-3 align-top font-semibold">{entityLabelMap[approval.entity]}</td>
                <td className="px-4 py-3 align-top">{actionLabelMap[approval.action]}</td>
                <td className="px-4 py-3 align-top">
                  <div className="flex flex-col gap-1">
                    <span className="font-semibold">{getMemberName(approval.targetUserId)}</span>
                    <span className="text-xs text-gray-500 dark:text-gray-400">Автор: {getMemberName(approval.authorId)}</span>
                    <span className="text-xs text-gray-500 dark:text-gray-400">
                      Создано: {safeFormatDate(approval.createdAt)} {/* safe on missing */}
                    </span>
                  </div>
                </td>
                <td className="px-4 py-3 align-top">
                  <div className="text-xs sm:text-sm font-medium">{renderChangePreview(approval)}</div>
                  {approval.after && approval.entity === 'slot' && (approval.after as WorkSlot).comment && (
                    <div className="text-xs text-gray-500 dark:text-gray-400 mt-1">Комментарий слота: {(approval.after as WorkSlot).comment}</div>
                  )}
                  {approval.after && approval.entity === 'status' && (approval.after as DayStatus).comment && (
                    <div className="text-xs text-gray-500 dark:text-gray-400 mt-1">Комментарий статуса: {(approval.after as DayStatus).comment}</div>
                  )}
                </td>
                <td className="px-4 py-3 align-top">
                  <div className="text-xs sm:text-sm text-gray-700 dark:text-gray-200 whitespace-pre-wrap">
                    {approval.comment || '—'}
                  </div>
                  {approval.adminComment && (
                    <div className="text-xs text-gray-500 dark:text-gray-400 mt-1">Ответ админа: {approval.adminComment}</div>
                  )}
                </td>
                <td className="px-4 py-3 align-top">
                  {approval.status === 'pending' ? (
                    <div className="flex flex-col gap-2">
                      <button
                        onClick={() => handleApprove(approval.id)}
                        disabled={!!submittingId}
                        className="px-3 py-2 rounded-lg bg-emerald-600 hover:bg-emerald-700 disabled:bg-emerald-400 text-white text-xs sm:text-sm font-semibold"
                      >
                        {submittingId === approval.id ? 'Применяем...' : 'Подтвердить и применить'}
                      </button>
                      <button
                        onClick={() => handleReject(approval.id)}
                        disabled={!!submittingId}
                        className="px-3 py-2 rounded-lg bg-rose-600 hover:bg-rose-700 disabled:bg-rose-400 text-white text-xs sm:text-sm font-semibold"
                      >
                        {submittingId === approval.id ? 'Отклоняем...' : 'Отклонить'}
                      </button>
                    </div>
                  ) : (
                    <div className="text-xs text-gray-500 dark:text-gray-400">Действие выполнено</div>
                  )}
                </td>
                <td className="px-4 py-3 align-top">
                  {approval.status === 'pending' ? (
                    <button
                      onClick={() => toggleSelection(approval.id)}
                      className="inline-flex items-center gap-1 text-sm text-[#4E6E49] hover:text-emerald-700"
                    >
                      {selectedIds.includes(approval.id) ? <CheckSquare className="w-4 h-4" /> : <Square className="w-4 h-4" />}
                      <span className="sr-only">Выбрать заявку</span>
                    </button>
                  ) : (
                    <span className="text-xs text-gray-400">—</span>
                  )}
                </td>
              </tr>
            ))}
            {approvals.length === 0 && (
              <tr>
                <td colSpan={7} className="px-4 py-6 text-center text-sm text-gray-500 dark:text-gray-400">
                  Нет заявок на согласование
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>
    </div>
  )
}


