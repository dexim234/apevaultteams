import React from 'react'
import { User } from '@/types'

interface AvatarProps {
  user?: User
  size?: 'sm' | 'md' | 'lg'
  className?: string
}

const Avatar: React.FC<AvatarProps> = ({ user, size = 'md', className = '' }) => {
  const getSizeClasses = () => {
    switch (size) {
      case 'sm': return 'w-8 h-8 text-sm'
      case 'lg': return 'w-16 h-16 text-2xl'
      default: return 'w-10 h-10 text-base'
    }
  }

  const getInitials = () => {
    if (!user?.name) return '?'
    const names = user.name.split(' ')
    return names.length > 1 
      ? `${names[0][0]}${names[names.length - 1][0]}` 
      : names[0][0]
  }

  return (
    <div 
      className={`
        ${getSizeClasses()} 
        rounded-full flex items-center justify-center 
        bg-gradient-to-br from-emerald-500 to-teal-600 
        text-white font-semibold
        ${className}
      `}
    >
      {user?.avatar ? (
        <img 
          src={user.avatar} 
          alt={user.name} 
          className="w-full h-full rounded-full object-cover"
        />
      ) : (
        <span>{getInitials()}</span>
      )}
    </div>
  )
}

export default Avatar