// UserNickname component that automatically updates when nickname changes
import { useUserNickname } from '@/utils/userUtils'

interface UserNicknameProps {
  userId: string
  className?: string
  fallback?: string
  formatter?: (nickname: string) => string
}

export const UserNickname = ({
  userId,
  className = '',
  fallback = 'unknown',
  formatter
}: UserNicknameProps) => {
  const nickname = useUserNickname(userId)
  const displayNickname = nickname || fallback
  return <span className={className}>{formatter ? formatter(displayNickname) : displayNickname}</span>
}










