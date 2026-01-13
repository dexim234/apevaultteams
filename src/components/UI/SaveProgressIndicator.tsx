import { useEffect, useState } from 'react'

interface SaveProgressIndicatorProps {
  loading: boolean
  message?: string
  onComplete?: () => void
}

export const SaveProgressIndicator = ({ loading, message = 'Сохранение...', onComplete }: SaveProgressIndicatorProps) => {
  const [progress, setProgress] = useState(0)
  const [showSuccess, setShowSuccess] = useState(false)

  useEffect(() => {
    if (!loading) {
      // Анимация завершения
      setProgress(100)
      setShowSuccess(true)
      
      // Уведомление о завершении
      onComplete?.()

      // Через небольшую паузу скрываем индикатор
      const timer = setTimeout(() => {
        setShowSuccess(false)
      }, 1000)

      return () => clearTimeout(timer)
    }

    // Имитация прогресса при загрузке
    setProgress(0)
    setShowSuccess(false)

    // Плавная анимация прогресса
    const duration = 2000 // 2 секунды на "полную" загрузку
    const interval = 50
    let currentProgress = 0

    const timer = setInterval(() => {
      currentProgress += (100 / (duration / interval))
      
      // Добавляем случайные "рывки" для реалистичности
      const randomBoost = Math.random() > 0.7 ? 5 : 0
      
      setProgress(Math.min(currentProgress + randomBoost, 85)) // Останавливаемся на 85%, ждем реального завершения
    }, interval)

    return () => clearInterval(timer)
  }, [loading, onComplete])

  if (!loading && !showSuccess && progress === 0) {
    return null
  }

  return (
    <div className="fixed inset-0 z-[100] flex items-center justify-center pointer-events-none">
      {/* Overlay с размытием */}
      <div className={`absolute inset-0 transition-all duration-300 ${
        loading || showSuccess ? 'bg-black/40 backdrop-blur-sm' : 'bg-transparent'
      }`} />

      {/* Центральный индикатор */}
      <div className={`relative transform transition-all duration-300 ${
        showSuccess ? 'scale-110' : 'scale-100'
      }`}>
        {/* Кольцо прогресса */}
        <div className="relative w-24 h-24">
          {/* Фоновое кольцо */}
          <svg className="w-full h-full transform -rotate-90">
            <circle
              cx="48"
              cy="48"
              r="40"
              fill="none"
              stroke="rgba(255,255,255,0.1)"
              strokeWidth="6"
            />
            {/* Прогресс кольцо */}
            <circle
              cx="48"
              cy="48"
              r="40"
              fill="none"
              stroke={showSuccess ? '#10B981' : '#4E6E49'}
              strokeWidth="6"
              strokeLinecap="round"
              strokeDasharray={`${2 * Math.PI * 40}`}
              strokeDashoffset={`${2 * Math.PI * 40 * (1 - progress / 100)}`}
              className="transition-all duration-300 ease-out"
              style={{
                filter: showSuccess 
                  ? 'drop-shadow(0 0 8px rgba(16, 185, 129, 0.6))' 
                  : 'drop-shadow(0 0 6px rgba(78, 110, 73, 0.4))'
              }}
            />
          </svg>

          {/* Иконка внутри */}
          <div className="absolute inset-0 flex items-center justify-center">
            {showSuccess ? (
              // Успех - зеленая галочка
              <div className="w-10 h-10 text-emerald-400 animate-bounce-in">
                <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round">
                  <polyline points="20 6 9 17 4 12" />
                </svg>
              </div>
            ) : loading ? (
              // Загрузка - спиннер
              <div className="w-8 h-8 relative">
                <div className="absolute inset-0 border-3 border-emerald-400/30 rounded-full" />
                <div className="absolute inset-0 border-3 border-transparent border-t-emerald-400 rounded-full animate-spin" />
              </div>
            ) : null}
          </div>
        </div>

        {/* Текст сообщения */}
        <div className={`absolute -bottom-10 left-1/2 transform -translate-x-1/2 whitespace-nowrap transition-all duration-300 ${
          showSuccess ? 'translate-y-0 opacity-100' : 'translate-y-2 opacity-0'
        }`}>
          <span className="text-white text-sm font-medium drop-shadow-lg">
            {showSuccess ? 'Сохранено!' : message}
          </span>
        </div>

        {/* Анимированные частицы при успехе */}
        {showSuccess && (
          <>
            {[...Array(6)].map((_, i) => (
              <div
                key={i}
                className="absolute w-2 h-2 bg-emerald-400 rounded-full animate-particle"
                style={{
                  top: '50%',
                  left: '50%',
                  '--angle': `${i * 60}deg` as any,
                  animationDelay: `${i * 0.1}s`,
                } as React.CSSProperties}
              />
            ))}
          </>
        )}
      </div>

      {/* Дополнительная анимация - пульсирующий эффект при загрузке */}
      {!showSuccess && loading && (
        <div className="absolute inset-0 flex items-center justify-center pointer-events-none">
          <div className="w-32 h-32 bg-emerald-500/20 rounded-full animate-ping" />
        </div>
      )}

      <style>{`
        @keyframes bounce-in {
          0% { transform: scale(0); opacity: 0; }
          50% { transform: scale(1.2); }
          100% { transform: scale(1); opacity: 1; }
        }

        @keyframes particle {
          0% {
            transform: translate(-50%, -50%) rotate(var(--angle)) translateX(0);
            opacity: 1;
          }
          100% {
            transform: translate(-50%, -50%) rotate(var(--angle)) translateX(40px);
            opacity: 0;
          }
        }

        .animate-bounce-in {
          animation: bounce-in 0.4s ease-out forwards;
        }

        .animate-particle {
          animation: particle 0.6s ease-out forwards;
        }
      `}</style>
    </div>
  )
}

// Компактная версия для интеграции в кнопки
export const SavingButtonIndicator = ({ loading }: { loading: boolean }) => {
  if (!loading) return null

  return (
    <div className="inline-flex items-center gap-2">
      <div className="relative">
        <div className="w-4 h-4 border-2 border-white/30 rounded-full" />
        <div className="absolute top-0 left-0 w-4 h-4 border-2 border-transparent border-t-white rounded-full animate-spin" />
      </div>
      <span>Сохранение...</span>
    </div>
  )
}
