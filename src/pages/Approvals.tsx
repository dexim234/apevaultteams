import { Navigate } from 'react-router-dom'
import { Layout } from '@/components/Layout'
import { ApprovalsTable } from '@/components/Management/ApprovalsTable'
import { useAdminStore } from '@/store/adminStore'

export const Approvals = () => {
  const { isAdmin } = useAdminStore()

  if (!isAdmin) {
    return <Navigate to="/management" replace />
  }

  return (
    <Layout>
      <div className="max-w-6xl mx-auto px-4 sm:px-6 py-6 sm:py-8 space-y-6">
        <div>
          <p className="text-sm text-gray-500 dark:text-gray-400">Администрирование</p>
          <h1 className="text-2xl sm:text-3xl font-bold">Согласования изменений</h1>
          <p className="text-sm text-gray-500 dark:text-gray-400">
            Подтверждайте или отклоняйте изменения слотов, перерывов и статусов участников.
          </p>
        </div>

        <ApprovalsTable />
      </div>
    </Layout>
  )
}









