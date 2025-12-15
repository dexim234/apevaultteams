// UserNickname component that automatically updates when nickname changes
import { useUserNickname } from '@/utils/userUtils'

interface UserNicknameProps {
  userId: string
  className?: string
  fallback?: string
}

export const UserNickname = ({ userId, className = '', fallback = 'unknown' }: UserNicknameProps) => {
  const nickname = useUserNickname(userId)
  return <span className={className}>{nickname || fallback}</span>
}



