import { useState, useEffect } from 'react'
import { useAuthStore } from '@/store/authStore'
import { useAdminStore } from '@/store/adminStore'
import { checkUserAccess } from '@/services/firestoreService'

export interface AccessResult {
    hasAccess: boolean
    loading: boolean
    reason?: string
    expiresAt?: string
}

export const useAccessControl = (feature: string): AccessResult => {
    const { user } = useAuthStore()
    const { isAdmin } = useAdminStore()
    const [access, setAccess] = useState<AccessResult>({
        hasAccess: true,
        loading: true
    })

    useEffect(() => {
        const check = async () => {
            if (!user) {
                setAccess({ hasAccess: false, loading: false, reason: 'Необходима авторизация' })
                return
            }

            if (isAdmin) {
                setAccess({ hasAccess: true, loading: false })
                return
            }

            try {
                const result = await checkUserAccess(user.id, feature)
                setAccess({
                    hasAccess: result.hasAccess,
                    loading: false,
                    reason: result.reason,
                    expiresAt: result.expiresAt
                })
            } catch (error) {
                console.error(`Error checking access for ${feature}:`, error)
                // Default to allow on error to not block users if service fails (as in original code)
                setAccess({ hasAccess: true, loading: false })
            }
        }

        check()
    }, [user, isAdmin, feature])

    return access
}
