// Utility functions for user data
import { TEAM_MEMBERS } from '@/types'
import { getUserNicknameValue } from '@/services/firestoreService'

// Default nickname map (from ManagementTable)
const defaultNicknameMap: Record<string, string> = {
  '1': 'Dex',
  '2': 'Enowk',
  '3': 'Xenia',
  '4': 'Olenka',
  '5': 'Sydney',
}

// Cache for custom nicknames to avoid multiple async calls
const nicknameCache = new Map<string, string | null>()

/**
 * Get user nickname - checks custom nickname first, then default nickname map, then login
 * This is a synchronous version that uses cache
 */
export const getUserNicknameSync = (userId: string): string => {
  // Check cache first
  const cached = nicknameCache.get(userId)
  if (cached !== undefined) {
    return cached || defaultNicknameMap[userId] || TEAM_MEMBERS.find((m) => m.id === userId)?.login || userId
  }

  // Return default if not in cache
  return defaultNicknameMap[userId] || TEAM_MEMBERS.find((m) => m.id === userId)?.login || userId
}

/**
 * Get user nickname - async version that fetches from Firestore
 * Use this when you need the most up-to-date value
 */
export const getUserNicknameAsync = async (userId: string): Promise<string> => {
  try {
    const customNickname = await getUserNicknameValue(userId)
    if (customNickname) {
      nicknameCache.set(userId, customNickname)
      return customNickname
    }

    const defaultNickname = defaultNicknameMap[userId] || TEAM_MEMBERS.find((m) => m.id === userId)?.login || userId
    nicknameCache.set(userId, null) // Cache null to indicate no custom nickname
    return defaultNickname
  } catch (error) {
    console.error('Error fetching user nickname:', error)
    return getUserNicknameSync(userId)
  }
}

/**
 * Clear nickname cache for a user (call after nickname change is approved)
 */
export const clearNicknameCache = (userId: string) => {
  nicknameCache.delete(userId)
}

/**
 * Clear all nickname cache
 */
export const clearAllNicknameCache = () => {
  nicknameCache.clear()
}

// Legacy aliases for backward compatibility (will be removed)
export const getUserLoginSync = getUserNicknameSync
export const getUserLoginAsync = getUserNicknameAsync
export const clearLoginCache = clearNicknameCache
export const clearAllLoginCache = clearAllNicknameCache

/**
 * React hook for user nickname that automatically updates when nickname changes
 */
import { useState, useEffect } from 'react'

export const useUserNickname = (userId: string): string => {
  const [nickname, setNickname] = useState(() => getUserNicknameSync(userId))

  useEffect(() => {
    // Initial fetch if not in cache or if it's currently a fallback
    // We check if the cache has the exact userId to see if we've ever fetched it
    if (!nicknameCache.has(userId)) {
      getUserNicknameAsync(userId).then(val => setNickname(val))
    }

    const handleNicknameUpdate = (event: Event) => {
      const customEvent = event as CustomEvent<{ userId: string }>
      const { userId: updatedUserId } = customEvent.detail || {}

      // Update if it's our userId or if it's a global update (no userId in detail)
      if (!updatedUserId || updatedUserId === userId) {
        setNickname(getUserNicknameSync(userId))
      }
    }

    window.addEventListener('nicknameUpdated', handleNicknameUpdate)
    return () => window.removeEventListener('nicknameUpdated', handleNicknameUpdate)
  }, [userId])

  return nickname
}














