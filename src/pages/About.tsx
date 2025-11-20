// About community page
import { Layout } from '@/components/Layout'
import { useThemeStore } from '@/store/themeStore'
import { Info, Users, Target, Award } from 'lucide-react'

export const About = () => {
  const { theme } = useThemeStore()
  const headingColor = theme === 'dark' ? 'text-white' : 'text-gray-900'
  const textColor = theme === 'dark' ? 'text-gray-300' : 'text-gray-700'
  const cardBg = theme === 'dark' ? 'bg-gray-800' : 'bg-white'
  const borderColor = theme === 'dark' ? 'border-gray-700' : 'border-gray-200'

  return (
    <Layout>
      <div className="space-y-6">
        {/* Header */}
        <div className="text-center mb-8">
          <h1 className={`text-3xl font-bold mb-2 ${headingColor}`}>О сообществе ApeVault</h1>
          <p className={textColor}>Профессиональное сообщество трейдеров и коллеров</p>
        </div>

        {/* Main info card */}
        <div className={`${cardBg} rounded-lg shadow-lg p-6 border ${borderColor}`}>
          <div className="flex items-start space-x-4 mb-6">
            <Info className={`w-8 h-8 flex-shrink-0 ${theme === 'dark' ? 'text-blue-400' : 'text-blue-600'}`} />
            <div>
              <h2 className={`text-xl font-semibold mb-2 ${headingColor}`}>Что такое ApeVault?</h2>
              <p className={textColor}>
                ApeVault — это закрытое профессиональное сообщество трейдеров и коллеров, объединяющее опытных специалистов 
                в области финансовых рынков. Мы создаем среду для эффективной работы, обмена опытом и совместного роста.
              </p>
            </div>
          </div>
        </div>

        {/* Features */}
        <div className="grid md:grid-cols-3 gap-6">
          <div className={`${cardBg} rounded-lg shadow-lg p-6 border ${borderColor}`}>
            <Users className={`w-8 h-8 mb-4 ${theme === 'dark' ? 'text-green-400' : 'text-green-600'}`} />
            <h3 className={`text-lg font-semibold mb-2 ${headingColor}`}>Командная работа</h3>
            <p className={textColor}>
              Слаженная работа команды профессионалов, где каждый участник вносит свой вклад в общий успех.
            </p>
          </div>

          <div className={`${cardBg} rounded-lg shadow-lg p-6 border ${borderColor}`}>
            <Target className={`w-8 h-8 mb-4 ${theme === 'dark' ? 'text-purple-400' : 'text-purple-600'}`} />
            <h3 className={`text-lg font-semibold mb-2 ${headingColor}`}>Профессионализм</h3>
            <p className={textColor}>
              Высокие стандарты работы, строгий регламент и профессиональный подход к торговым сессиям.
            </p>
          </div>

          <div className={`${cardBg} rounded-lg shadow-lg p-6 border ${borderColor}`}>
            <Award className={`w-8 h-8 mb-4 ${theme === 'dark' ? 'text-yellow-400' : 'text-yellow-600'}`} />
            <h3 className={`text-lg font-semibold mb-2 ${headingColor}`}>Рейтинг и мотивация</h3>
            <p className={textColor}>
              Система рейтинга, которая отражает эффективность каждого участника и мотивирует к достижению лучших результатов.
            </p>
          </div>
        </div>

        {/* Rules link */}
        <div className={`${cardBg} rounded-lg shadow-lg p-6 border ${borderColor}`}>
          <h2 className={`text-xl font-semibold mb-4 ${headingColor}`}>Правила сообщества</h2>
          <p className={`${textColor} mb-4`}>
            Для обеспечения эффективной работы всех участников мы разработали подробный регламент торговых сессий и правила сообщества.
          </p>
          <a
            href="https://telegra.ph/Reglament-provedeniya-torgovyh-sessij-pravila-soobshchestva-ApeVault-dlya-trejderov-i-kollerov-11-20"
            target="_blank"
            rel="noopener noreferrer"
            className="inline-flex items-center px-4 py-2 bg-green-500 hover:bg-green-600 text-white rounded-lg transition-colors"
          >
            📖 Ознакомиться с правилами
          </a>
        </div>

        {/* Contact */}
        <div className={`${cardBg} rounded-lg shadow-lg p-6 border ${borderColor}`}>
          <h2 className={`text-xl font-semibold mb-4 ${headingColor}`}>Контакты</h2>
          <p className={textColor}>
            По вопросам работы системы и правил обращайтесь к администратору: <span className="font-semibold">@artyommedoed</span>
          </p>
        </div>
      </div>
    </Layout>
  )
}

