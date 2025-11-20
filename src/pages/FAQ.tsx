// FAQ page
import { Layout } from '@/components/Layout'
import { useThemeStore } from '@/store/themeStore'
import { HelpCircle, ChevronDown, ChevronUp } from 'lucide-react'
import { useState } from 'react'

interface FAQItem {
  question: string
  answer: string
}

const faqData: FAQItem[] = [
  {
    question: 'Как добавить рабочий слот?',
    answer: 'Используйте команду /add_slot в боте или нажмите кнопку "Добавить слот" на странице Management. Укажите дату, время начала и окончания, при необходимости добавьте перерывы и комментарий.'
  },
  {
    question: 'Как добавить выходной?',
    answer: 'Используйте команду /dayoff в боте или нажмите кнопку "Добавить выходной" на странице Management. Помните: максимально 2 выходных в неделю и не более 3 человек могут быть в выходном на одну дату.'
  },
  {
    question: 'Как работает система рейтинга?',
    answer: 'Рейтинг рассчитывается на основе нескольких параметров: количество рабочих часов, заработок, количество сообщений в группе, выходные, больничные, отпуск и рефералы. Каждый параметр влияет на общий рейтинг участника.'
  },
  {
    question: 'Можно ли перекрывать слоты?',
    answer: 'Да, разрешено перекрытие слотов. Если слот начинается после начала существующего слота, перекрытие допускается. Например, если есть слот 19:00-21:00, можно создать слот 20:00-22:00.'
  },
  {
    question: 'Как добавить заработок?',
    answer: 'Используйте команду /add_earning в боте или нажмите кнопку "Добавить заработок" на странице Earnings. Укажите дату, сумму заработка и сумму пула.'
  },
  {
    question: 'Как добавить в пул?',
    answer: 'Используйте команду /add_pool в боте или нажмите кнопку "Добавить в пул" на странице Earnings. Выберите завершенный слот и укажите сумму для добавления в пул команды.'
  },
  {
    question: 'Как работает режим администратора?',
    answer: 'Для активации режима администратора используйте команду /admin и введите пароль администратора. В режиме администратора вы можете управлять слотами и статусами всех участников, а также использовать функции массового управления.'
  },
  {
    question: 'Что делать, если сообщение удалено из группы?',
    answer: 'Если сообщение было удалено из группы, администратор может удалить его из подсчета, используя команду /remove_message и ответив (reply) на это сообщение или указав его ID.'
  },
  {
    question: 'Где посмотреть расписание?',
    answer: 'Используйте команду /schedule в боте для просмотра расписания на неделю. На сайте расписание доступно на странице Management, где можно просмотреть слоты и статусы всех участников.'
  },
  {
    question: 'Как добавить реферала?',
    answer: 'Используйте команду /add_referral в боте или нажмите кнопку "Добавить реферала" на странице Rating. Укажите имя, ID и при необходимости возраст и комментарий.'
  }
]

export const FAQ = () => {
  const { theme } = useThemeStore()
  const [openItems, setOpenItems] = useState<Set<number>>(new Set())
  const headingColor = theme === 'dark' ? 'text-white' : 'text-gray-900'
  const textColor = theme === 'dark' ? 'text-gray-300' : 'text-gray-700'
  const cardBg = theme === 'dark' ? 'bg-gray-800' : 'bg-white'
  const borderColor = theme === 'dark' ? 'border-gray-700' : 'border-gray-200'
  const hoverBg = theme === 'dark' ? 'hover:bg-gray-700' : 'hover:bg-gray-50'

  const toggleItem = (index: number) => {
    const newOpenItems = new Set(openItems)
    if (newOpenItems.has(index)) {
      newOpenItems.delete(index)
    } else {
      newOpenItems.add(index)
    }
    setOpenItems(newOpenItems)
  }

  return (
    <Layout>
      <div className="space-y-6">
        {/* Header */}
        <div className="text-center mb-8">
          <div className="flex items-center justify-center mb-4">
            <HelpCircle className={`w-12 h-12 ${theme === 'dark' ? 'text-blue-400' : 'text-blue-600'}`} />
          </div>
          <h1 className={`text-3xl font-bold mb-2 ${headingColor}`}>Часто задаваемые вопросы</h1>
          <p className={textColor}>Найдите ответы на популярные вопросы о работе системы</p>
        </div>

        {/* FAQ Items */}
        <div className="space-y-4">
          {faqData.map((item, index) => (
            <div
              key={index}
              className={`${cardBg} rounded-lg shadow-lg border ${borderColor} overflow-hidden transition-all`}
            >
              <button
                onClick={() => toggleItem(index)}
                className={`w-full p-6 flex items-center justify-between text-left ${hoverBg} transition-colors`}
              >
                <h3 className={`text-lg font-semibold pr-4 ${headingColor}`}>{item.question}</h3>
                {openItems.has(index) ? (
                  <ChevronUp className={`w-5 h-5 flex-shrink-0 ${textColor}`} />
                ) : (
                  <ChevronDown className={`w-5 h-5 flex-shrink-0 ${textColor}`} />
                )}
              </button>
              {openItems.has(index) && (
                <div className={`px-6 pb-6 ${textColor}`}>
                  <p>{item.answer}</p>
                </div>
              )}
            </div>
          ))}
        </div>

        {/* Additional help */}
        <div className={`${cardBg} rounded-lg shadow-lg p-6 border ${borderColor}`}>
          <h2 className={`text-xl font-semibold mb-4 ${headingColor}`}>Нужна дополнительная помощь?</h2>
          <p className={`${textColor} mb-4`}>
            Если вы не нашли ответ на свой вопрос, обратитесь к администратору или ознакомьтесь с правилами сообщества.
          </p>
          <div className="flex flex-wrap gap-4">
            <a
              href="https://telegra.ph/Reglament-provedeniya-torgovyh-sessij-pravila-soobshchestva-ApeVault-dlya-trejderov-i-kollerov-11-20"
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center px-4 py-2 bg-green-500 hover:bg-green-600 text-white rounded-lg transition-colors"
            >
              📖 Правила сообщества
            </a>
            <div className={`inline-flex items-center px-4 py-2 rounded-lg ${theme === 'dark' ? 'bg-gray-700' : 'bg-gray-200'}`}>
              <span className={textColor}>Администратор: <span className="font-semibold">@artyommedoed</span></span>
            </div>
          </div>
        </div>
      </div>
    </Layout>
  )
}

