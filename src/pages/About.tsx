// About community page
import { Layout } from '@/components/Layout'
import { useThemeStore } from '@/store/themeStore'
import { Info, Users, Target, Award, BookOpen, Mail } from 'lucide-react'

export const About = () => {
  const { theme } = useThemeStore()
  const headingColor = theme === 'dark' ? 'text-white' : 'text-gray-900'
  const subTextColor = theme === 'dark' ? 'text-gray-400' : 'text-gray-600'
  const cardBg = theme === 'dark' ? 'bg-gray-800' : 'bg-white'

  return (
    <Layout>
      <div className="space-y-6">
        {/* Header */}
        <div className={`rounded-xl sm:rounded-2xl p-4 sm:p-6 md:p-8 ${cardBg} shadow-xl border-2 ${
          theme === 'dark' 
            ? 'border-blue-500/30 bg-gradient-to-br from-gray-800 via-gray-800 to-gray-900' 
            : 'border-blue-200 bg-gradient-to-br from-white via-blue-50/30 to-white'
        } relative overflow-hidden`}>
          {/* Decorative elements */}
          <div className="absolute top-0 right-0 w-32 h-32 sm:w-64 sm:h-64 bg-gradient-to-br from-blue-500/10 to-purple-500/10 rounded-full blur-3xl -mr-16 sm:-mr-32 -mt-16 sm:-mt-32" />
          <div className="absolute bottom-0 left-0 w-24 h-24 sm:w-48 sm:h-48 bg-gradient-to-tr from-green-500/10 to-yellow-500/10 rounded-full blur-2xl -ml-12 sm:-ml-24 -mb-12 sm:-mb-24" />
          
          <div className="relative z-10">
            <div className="flex items-center gap-3 sm:gap-4 mb-3 sm:mb-4">
              <div
                className={`p-3 sm:p-4 rounded-xl sm:rounded-2xl shadow-lg flex-shrink-0 ${
                  theme === 'dark'
                    ? 'bg-gradient-to-br from-blue-600 to-purple-600'
                    : 'bg-gradient-to-br from-blue-500 to-purple-500'
                } text-white transform transition-transform active:scale-95 sm:hover:scale-110`}
              >
                <Info className="w-5 h-5 sm:w-7 sm:h-7" />
              </div>
              <div className="flex-1 min-w-0">
                <h1 className={`text-2xl sm:text-3xl md:text-4xl font-extrabold ${headingColor} flex items-center gap-2 sm:gap-3`}>
                  <span className="bg-gradient-to-r from-blue-600 via-purple-600 to-pink-600 text-transparent bg-clip-text">
                    О сообществе ApeVault
                  </span>
                  <span className="text-xl sm:text-2xl flex-shrink-0">🌟</span>
                </h1>
              </div>
            </div>
            <p className={`text-sm sm:text-base font-medium ${subTextColor}`}>
              Профессиональное сообщество трейдеров и коллеров
            </p>
          </div>
        </div>

        {/* Main info card */}
        <div className={`rounded-2xl p-8 ${cardBg} shadow-xl border-2 ${
          theme === 'dark' 
            ? 'border-cyan-500/30 bg-gradient-to-br from-gray-800 to-gray-900' 
            : 'border-cyan-200 bg-gradient-to-br from-white to-cyan-50/20'
        } relative overflow-hidden`}>
          {/* Decorative background */}
          <div className="absolute top-0 right-0 w-40 h-40 bg-gradient-to-br from-cyan-500/10 to-blue-500/10 rounded-full blur-2xl -mr-20 -mt-20" />
          
          <div className="relative z-10">
            <div className="flex items-start gap-6 mb-6">
              <div className={`p-4 rounded-2xl shadow-lg ${
                theme === 'dark' 
                  ? 'bg-gradient-to-br from-cyan-600 to-blue-600' 
                  : 'bg-gradient-to-br from-cyan-500 to-blue-500'
              } text-white flex-shrink-0`}>
                <Info className="w-8 h-8" />
              </div>
              <div className="flex-1">
                <h2 className={`text-2xl font-extrabold mb-4 ${headingColor} flex items-center gap-2`}>
                  <span className="bg-gradient-to-r from-cyan-600 to-blue-600 text-transparent bg-clip-text">
                    Что такое ApeVault?
                  </span>
                </h2>
                <p className={`text-base leading-relaxed ${subTextColor}`}>
                  ApeVault — это закрытое профессиональное сообщество трейдеров и коллеров, объединяющее опытных специалистов 
                  в области финансовых рынков. Мы создаем среду для эффективной работы, обмена опытом и совместного роста.
                </p>
              </div>
            </div>
          </div>
        </div>

        {/* Features */}
        <div className="grid md:grid-cols-3 gap-6">
          <div className={`rounded-2xl p-6 ${cardBg} shadow-xl border-2 ${
            theme === 'dark' 
              ? 'border-green-500/30 bg-gradient-to-br from-gray-800 to-gray-900' 
              : 'border-green-200 bg-gradient-to-br from-white to-green-50/20'
          } relative overflow-hidden`}>
            <div className="absolute top-0 right-0 w-32 h-32 bg-gradient-to-br from-green-500/10 to-emerald-500/10 rounded-full blur-xl -mr-16 -mt-16" />
            <div className="relative z-10">
              <div className={`p-3 rounded-xl shadow-lg mb-4 inline-block ${
                theme === 'dark' 
                  ? 'bg-gradient-to-br from-green-600 to-emerald-600' 
                  : 'bg-gradient-to-br from-green-500 to-emerald-500'
              } text-white`}>
                <Users className="w-6 h-6" />
              </div>
              <h3 className={`text-xl font-extrabold mb-3 ${headingColor}`}>Командная работа</h3>
              <p className={`${subTextColor} leading-relaxed`}>
                Слаженная работа команды профессионалов, где каждый участник вносит свой вклад в общий успех.
              </p>
            </div>
          </div>

          <div className={`rounded-2xl p-6 ${cardBg} shadow-xl border-2 ${
            theme === 'dark' 
              ? 'border-purple-500/30 bg-gradient-to-br from-gray-800 to-gray-900' 
              : 'border-purple-200 bg-gradient-to-br from-white to-purple-50/20'
          } relative overflow-hidden`}>
            <div className="absolute top-0 right-0 w-32 h-32 bg-gradient-to-br from-purple-500/10 to-pink-500/10 rounded-full blur-xl -mr-16 -mt-16" />
            <div className="relative z-10">
              <div className={`p-3 rounded-xl shadow-lg mb-4 inline-block ${
                theme === 'dark' 
                  ? 'bg-gradient-to-br from-purple-600 to-pink-600' 
                  : 'bg-gradient-to-br from-purple-500 to-pink-500'
              } text-white`}>
                <Target className="w-6 h-6" />
              </div>
              <h3 className={`text-xl font-extrabold mb-3 ${headingColor}`}>Профессионализм</h3>
              <p className={`${subTextColor} leading-relaxed`}>
                Высокие стандарты работы, строгий регламент и профессиональный подход к торговым сессиям.
              </p>
            </div>
          </div>

          <div className={`rounded-2xl p-6 ${cardBg} shadow-xl border-2 ${
            theme === 'dark' 
              ? 'border-yellow-500/30 bg-gradient-to-br from-gray-800 to-gray-900' 
              : 'border-yellow-200 bg-gradient-to-br from-white to-yellow-50/20'
          } relative overflow-hidden`}>
            <div className="absolute top-0 right-0 w-32 h-32 bg-gradient-to-br from-yellow-500/10 to-orange-500/10 rounded-full blur-xl -mr-16 -mt-16" />
            <div className="relative z-10">
              <div className={`p-3 rounded-xl shadow-lg mb-4 inline-block ${
                theme === 'dark' 
                  ? 'bg-gradient-to-br from-yellow-600 to-orange-600' 
                  : 'bg-gradient-to-br from-yellow-500 to-orange-500'
              } text-white`}>
                <Award className="w-6 h-6" />
              </div>
              <h3 className={`text-xl font-extrabold mb-3 ${headingColor}`}>Рейтинг и мотивация</h3>
              <p className={`${subTextColor} leading-relaxed`}>
                Система рейтинга, которая отражает эффективность каждого участника и мотивирует к достижению лучших результатов.
              </p>
            </div>
          </div>
        </div>

        {/* Rules link */}
        <div className={`rounded-2xl p-8 ${cardBg} shadow-xl border-2 ${
          theme === 'dark' 
            ? 'border-indigo-500/30 bg-gradient-to-br from-gray-800 to-gray-900' 
            : 'border-indigo-200 bg-gradient-to-br from-white to-indigo-50/20'
        } relative overflow-hidden`}>
          <div className="absolute top-0 right-0 w-40 h-40 bg-gradient-to-br from-indigo-500/10 to-purple-500/10 rounded-full blur-2xl -mr-20 -mt-20" />
          
          <div className="relative z-10">
            <div className="flex items-center gap-4 mb-6">
              <div className={`p-4 rounded-2xl shadow-lg ${
                theme === 'dark' 
                  ? 'bg-gradient-to-br from-indigo-600 to-purple-600' 
                  : 'bg-gradient-to-br from-indigo-500 to-purple-500'
              } text-white flex-shrink-0`}>
                <BookOpen className="w-8 h-8" />
              </div>
              <div className="flex-1">
                <h2 className={`text-2xl font-extrabold mb-2 ${headingColor} flex items-center gap-2`}>
                  <span className="bg-gradient-to-r from-indigo-600 to-purple-600 text-transparent bg-clip-text">
                    Правила сообщества
                  </span>
                </h2>
                <p className={`${subTextColor} mb-6 font-medium`}>
                  Для обеспечения эффективной работы всех участников мы разработали подробный регламент торговых сессий и правила сообщества.
                </p>
                <a
                  href="https://telegra.ph/Reglament-provedeniya-torgovyh-sessij-pravila-soobshchestva-ApeVault-dlya-trejderov-i-kollerov-11-20"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="inline-flex items-center gap-2 px-6 py-3 bg-gradient-to-r from-green-500 to-green-600 hover:from-green-600 hover:to-green-700 text-white rounded-xl transition-all duration-200 font-semibold shadow-lg hover:shadow-xl hover:scale-105 transform"
                >
                  <BookOpen className="w-5 h-5" />
                  <span>Ознакомиться с правилами</span>
                </a>
              </div>
            </div>
          </div>
        </div>

        {/* Contact */}
        <div className={`rounded-2xl p-8 ${cardBg} shadow-xl border-2 ${
          theme === 'dark' 
            ? 'border-pink-500/30 bg-gradient-to-br from-gray-800 to-gray-900' 
            : 'border-pink-200 bg-gradient-to-br from-white to-pink-50/20'
        } relative overflow-hidden`}>
          <div className="absolute top-0 right-0 w-40 h-40 bg-gradient-to-br from-pink-500/10 to-rose-500/10 rounded-full blur-2xl -mr-20 -mt-20" />
          
          <div className="relative z-10">
            <div className="flex items-center gap-4 mb-4">
              <div className={`p-4 rounded-2xl shadow-lg ${
                theme === 'dark' 
                  ? 'bg-gradient-to-br from-pink-600 to-rose-600' 
                  : 'bg-gradient-to-br from-pink-500 to-rose-500'
              } text-white flex-shrink-0`}>
                <Mail className="w-8 h-8" />
              </div>
              <div className="flex-1">
                <h2 className={`text-2xl font-extrabold mb-2 ${headingColor} flex items-center gap-2`}>
                  <span className="bg-gradient-to-r from-pink-600 to-rose-600 text-transparent bg-clip-text">
                    Контакты
                  </span>
                </h2>
                <p className={`${subTextColor} font-medium`}>
                  По вопросам работы системы и правил обращайтесь к администратору:{' '}
                  <span className={`font-extrabold ${headingColor}`}>@artyommedoed</span>
                </p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </Layout>
  )
}

