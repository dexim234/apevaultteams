import { useEffect } from 'react'
import { Layout } from '@/components/Layout'
import { useThemeStore } from '@/store/themeStore'

export const MemeEvaluation = () => {
  const { theme } = useThemeStore()

  const subTextColor = theme === 'dark' ? 'text-gray-400' : 'text-gray-600'
  const headingColor = theme === 'dark' ? 'text-white' : 'text-gray-900'
  const cardBg = theme === 'dark' ? 'bg-[#10141c]' : 'bg-white'
  const calmBorder = 'border-[#48a35e]/60'
  const cardShadow = theme === 'dark' ? 'shadow-[0_24px_80px_rgba(0,0,0,0.45)]' : 'shadow-[0_24px_80px_rgba(0,0,0,0.15)]'

  const headerBg = theme === 'dark' ? 'bg-[#10141c]' : 'bg-white'
  const headerBorder = theme === 'dark' ? 'border-[#48a35e]/60' : 'border-[#48a35e]/40'
  const headerShadow = theme === 'dark' ? 'shadow-[0_24px_80px_rgba(0,0,0,0.45)]' : 'shadow-[0_24px_80px_rgba(0,0,0,0.1)]'

  const iconBg = theme === 'dark' ? 'bg-white/10 border-white/20' : 'bg-[#4E6E49]/10 border-[#4E6E49]/30'
  const iconText = theme === 'dark' ? 'text-white' : 'text-[#4E6E49]'

  const chipBg = theme === 'dark' ? 'bg-white/10 border-white/20' : 'bg-gray-100 border-gray-300'
  const chipText = theme === 'dark' ? 'text-white' : 'text-gray-800'

  useEffect(() => {
    // Load the checklist functionality
    const loadChecklist = () => {
      const checkboxes = document.querySelectorAll('.meme-checkbox')
      const progressFill = document.getElementById('meme-progress-fill')
      const checkedCount = document.getElementById('meme-checked-count')
      const totalCount = document.getElementById('meme-total-count')
      const progressPercentage = document.getElementById('meme-progress-percentage')

      if (!checkboxes.length || !progressFill || !checkedCount || !totalCount || !progressPercentage) return

      totalCount.textContent = checkboxes.length.toString()
      loadProgress()

      // Add event listeners for checkboxes
      checkboxes.forEach(checkbox => {
        checkbox.addEventListener('change', updateProgress)
      })
    }

    const updateProgress = () => {
      const checkboxes = document.querySelectorAll('.meme-checkbox')
      const checkedBoxes = document.querySelectorAll('.meme-checkbox:checked')
      const progressFill = document.getElementById('meme-progress-fill')
      const checkedCount = document.getElementById('meme-checked-count')
      const progressPercentage = document.getElementById('meme-progress-percentage')

      if (!progressFill || !checkedCount || !progressPercentage) return

      const checkedCountValue = checkedBoxes.length
      const totalCountValue = checkboxes.length
      const percentage = Math.round((checkedCountValue / totalCountValue) * 100)

      // Update counters
      checkedCount.textContent = checkedCountValue.toString()
      progressPercentage.textContent = percentage + '%'

      // Animate progress bar
      progressFill.style.width = percentage + '%'

      // Add/remove completed class for items
      checkboxes.forEach(checkbox => {
        const inputCheckbox = checkbox as HTMLInputElement
        const item = checkbox.closest('.meme-item')
        if (inputCheckbox.checked) {
          item?.classList.add('completed')
        } else {
          item?.classList.remove('completed')
        }
      })

      // Save progress to localStorage
      saveProgress()
    }

    const saveProgress = () => {
      const checkboxes = document.querySelectorAll('.meme-checkbox')
      const checkedStates: { [key: string]: boolean } = {}
      checkboxes.forEach(checkbox => {
        const cb = checkbox as HTMLInputElement
        checkedStates[cb.id] = cb.checked
      })
      localStorage.setItem('memeChecklistProgress', JSON.stringify(checkedStates))
    }

    const loadProgress = () => {
      const checkboxes = document.querySelectorAll('.meme-checkbox')
      const savedProgress = localStorage.getItem('memeChecklistProgress')
      if (savedProgress) {
        const checkedStates = JSON.parse(savedProgress)
        checkboxes.forEach(checkbox => {
          const cb = checkbox as HTMLInputElement
          if (checkedStates[cb.id]) {
            cb.checked = true
            cb.closest('.meme-item')?.classList.add('completed')
          }
        })
        // Update display after loading
        updateProgressDisplay()
      }
    }

    const updateProgressDisplay = () => {
      const checkboxes = document.querySelectorAll('.meme-checkbox')
      const checkedBoxes = document.querySelectorAll('.meme-checkbox:checked')
      const progressFill = document.getElementById('meme-progress-fill')
      const checkedCount = document.getElementById('meme-checked-count')
      const progressPercentage = document.getElementById('meme-progress-percentage')

      if (!progressFill || !checkedCount || !progressPercentage) return

      const checkedCountValue = checkedBoxes.length
      const totalCountValue = checkboxes.length
      const percentage = Math.round((checkedCountValue / totalCountValue) * 100)

      checkedCount.textContent = checkedCountValue.toString()
      progressPercentage.textContent = percentage + '%'
      progressFill.style.width = percentage + '%'
    }

    const resetProgress = () => {
      const checkboxes = document.querySelectorAll('.meme-checkbox')
      checkboxes.forEach(checkbox => {
        const cb = checkbox as HTMLInputElement
        cb.checked = false
        cb.closest('.meme-item')?.classList.remove('completed')
      })
      localStorage.removeItem('memeChecklistProgress')
      updateProgressDisplay()
    }

    // Add reset button functionality
    const resetButton = document.getElementById('meme-reset-button')
    if (resetButton) {
      resetButton.addEventListener('click', resetProgress)
    }

    // Add smooth scrolling to stages
    document.querySelectorAll('.meme-stage-title').forEach(title => {
      title.addEventListener('click', (e) => {
        const stage = (e.currentTarget as Element).closest('.meme-stage')
        stage?.scrollIntoView({ behavior: 'smooth', block: 'start' })
      })
    })

    // Add intersection observer for animations
    const observerOptions = {
      threshold: 0.1,
      rootMargin: '0px 0px -50px 0px'
    }

    const observer = new IntersectionObserver((entries) => {
      entries.forEach(entry => {
        if (entry.isIntersecting) {
          entry.target.setAttribute('style', 'opacity: 1; transform: translateY(0);')
        }
      })
    }, observerOptions)

    // Apply animation to all stages
    document.querySelectorAll('.meme-stage').forEach(stage => {
      stage.setAttribute('style', 'opacity: 0; transform: translateY(30px); transition: opacity 0.6s ease, transform 0.6s ease;')
      observer.observe(stage)
    })

    loadChecklist()
  }, [])

  return (
    <Layout>
      <div className="space-y-6">
        {/* Header */}
        <div className={`relative overflow-hidden rounded-3xl border ${headerBorder} ${headerShadow} ${headerBg}`}>
          <div className="absolute inset-0 pointer-events-none">
            <div className="absolute -left-16 -bottom-10 w-80 h-80 bg-emerald-500/18 blur-3xl"></div>
            <div className={`absolute inset-0 ${theme === 'dark' ? 'bg-[radial-gradient(circle_at_50%_0%,rgba(255,255,255,0.08),transparent_45%)]' : 'bg-[radial-gradient(circle_at_50%_0%,rgba(78,110,73,0.05),transparent_45%)]'}`}></div>
          </div>

          <div className="relative p-6 sm:p-8 space-y-6">
            <div className="flex flex-col gap-4 lg:flex-row lg:items-start lg:justify-between">
              <div className="space-y-3 max-w-3xl">
                <div className="flex items-start gap-3">
                  <div className={`p-3 rounded-2xl ${iconBg} ${iconText} shadow-inner`}>
                    <span className="text-2xl">🐊</span>
                  </div>
                  <div className="space-y-2">
                    <h1 className={`text-3xl sm:text-4xl font-black ${theme === 'dark' ? 'text-white' : 'text-gray-900'} leading-tight`}>Оценка мемкоина</h1>
                    <p className={`text-sm ${theme === 'dark' ? 'text-white/70' : 'text-gray-600'}`}>
                      Полный чек-лист проверки мемкоина. Систематический анализ для безопасного входа.
                    </p>
                    <div className="flex flex-wrap gap-2">
                      {['Базовые метрики','Бандлы','Сообщество','DEV анализ'].map((chip, idx) => (
                        <span
                          key={chip}
                          className={`px-4 py-1.5 rounded-full text-xs font-semibold border ${
                            idx === 0
                              ? 'bg-emerald-500 text-white border-emerald-300/60 shadow-md'
                              : `${chipBg} ${chipText} border-gray-300`
                          }`}
                        >
                          {chip}
                        </span>
                      ))}
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Checklist Stages */}
        <div className="space-y-6">
          {/* Stage 1 */}
          <div className={`meme-stage rounded-2xl p-6 sm:p-7 ${cardBg} ${cardShadow} border ${calmBorder}`}>
            <div className="flex flex-col gap-2 mb-6">
              <p className={`text-xs uppercase tracking-[0.12em] ${subTextColor}`}>Этап 1</p>
              <h3 className={`text-2xl font-bold ${headingColor}`}>Базовые метрики (первичный фильтр)</h3>
              <p className={`text-sm ${subTextColor}`}>Убираем мусор, скам и неподходящие ранние фазы проекта.</p>
            </div>

            <div className="space-y-4">
              {/* Checklist items */}
              <div className={`meme-item flex items-start gap-4 p-4 rounded-xl border ${theme === 'dark' ? 'border-white/10 bg-white/5 hover:bg-white/10' : 'border-gray-200 bg-gray-50 hover:bg-gray-100'} transition-all duration-200`}>
                <input type="checkbox" id="meme-1-1" className="meme-checkbox w-5 h-5 mt-1 accent-[#4E6E49] rounded flex-shrink-0" />
                <label htmlFor="meme-1-1" className="flex-1 cursor-pointer">
                  <strong className={`font-semibold block mb-2 ${headingColor}`}>Market Cap</strong>
                  <ul className={`space-y-1 text-sm ${subTextColor}`}>
                    <li>• Капа &le; 100k (оптимально 20–80k).</li>
                    <li>• Резкий скачок капы на старте без реальной ликвидности — минус.</li>
                  </ul>
                </label>
              </div>

              <div className="meme-item flex items-start gap-4 p-4 rounded-xl ${theme === 'dark' ? 'border-white/10 bg-white/5 hover:bg-white/10' : 'border-gray-200 bg-gray-50 hover:bg-gray-100'} transition-all duration-200">
                <input type="checkbox" id="meme-1-2" className="meme-checkbox w-5 h-5 mt-1 accent-[#4E6E49] rounded flex-shrink-0" />
                <label htmlFor="meme-1-2" className="flex-1 cursor-pointer">
                  <strong className={`font-semibold block mb-2 ${headingColor}`}>Объём торгов</strong>
                  <ul className={`space-y-1 text-sm ${subTextColor}`}>
                    <li>• Объём &gt; капы в 1.5–2 раза (лучше 2.5–3).</li>
                    <li>• Проверить синхронность: объём должен совпадать с движением цены.</li>
                  </ul>
                </label>
              </div>

              <div className="meme-item flex items-start gap-4 p-4 rounded-xl ${theme === 'dark' ? 'border-white/10 bg-white/5 hover:bg-white/10' : 'border-gray-200 bg-gray-50 hover:bg-gray-100'} transition-all duration-200">
                <input type="checkbox" id="meme-1-3" className="meme-checkbox w-5 h-5 mt-1 accent-[#4E6E49] rounded flex-shrink-0" />
                <label htmlFor="meme-1-3" className="flex-1 cursor-pointer">
                  <strong className={`font-semibold block mb-2 ${headingColor}`}>Холдеры</strong>
                  <ul className={`space-y-1 text-sm ${subTextColor}`}>
                    <li>• Рост холдеров стабильный, без искусственных всплесков.</li>
                    <li>• Проверить уникальность кошельков.</li>
                  </ul>
                </label>
              </div>

              <div className="meme-item flex items-start gap-4 p-4 rounded-xl ${theme === 'dark' ? 'border-white/10 bg-white/5 hover:bg-white/10' : 'border-gray-200 bg-gray-50 hover:bg-gray-100'} transition-all duration-200">
                <input type="checkbox" id="meme-1-4" className="meme-checkbox w-5 h-5 mt-1 accent-[#4E6E49] rounded flex-shrink-0" />
                <label htmlFor="meme-1-4" className="flex-1 cursor-pointer">
                  <strong className={`font-semibold block mb-2 ${headingColor}`}>График</strong>
                  <ul className="text-gray-700 dark:text-gray-300 space-y-1 text-sm">
                    <li>• Органичный график, без параболического роста.</li>
                    <li>• Нет вертикальных ракет на старте.</li>
                  </ul>
                </label>
              </div>

              <div className="meme-item flex items-start gap-4 p-4 rounded-xl ${theme === 'dark' ? 'border-white/10 bg-white/5 hover:bg-white/10' : 'border-gray-200 bg-gray-50 hover:bg-gray-100'} transition-all duration-200">
                <input type="checkbox" id="meme-1-5" className="meme-checkbox w-5 h-5 mt-1 accent-[#4E6E49] rounded flex-shrink-0" />
                <label htmlFor="meme-1-5" className="flex-1 cursor-pointer">
                  <strong className={`font-semibold block mb-2 ${headingColor}`}>Ликвидность</strong>
                  <ul className={`space-y-1 text-sm ${subTextColor}`}>
                    <li>• Ликвидность &gt; 15k (лучше 25–40k).</li>
                    <li>• Проверить соотношение ликвидности к капе.</li>
                  </ul>
                </label>
              </div>
            </div>
          </div>

          {/* Stage 2 */}
          <div className={`meme-stage rounded-2xl p-6 sm:p-7 ${cardBg} ${cardShadow} border ${calmBorder}`}>
            <div className="flex flex-col gap-2 mb-6">
              <p className={`text-xs uppercase tracking-[0.12em] ${subTextColor}`}>Этап 2</p>
              <h3 className={`text-2xl font-bold ${headingColor}`}>Бандлы (MEV-активность)</h3>
              <p className={`text-sm ${subTextColor}`}>Анализ влияния бандлеров на токен и рыночную манипуляцию.</p>
            </div>

            <div className="space-y-4">
              <div className="meme-item flex items-start gap-4 p-4 rounded-xl ${theme === 'dark' ? 'border-white/10 bg-white/5 hover:bg-white/10' : 'border-gray-200 bg-gray-50 hover:bg-gray-100'} transition-all duration-200">
                <input type="checkbox" id="meme-2-1" className="meme-checkbox w-5 h-5 mt-1 accent-[#4E6E49] rounded flex-shrink-0" />
                <label htmlFor="meme-2-1" className="flex-1 cursor-pointer">
                  <strong className={`font-semibold block mb-2 ${headingColor}`}>Откуплено бандлами</strong>
                  <ul className={`space-y-1 text-sm ${subTextColor}`}>
                    <li>• &le; 100, максимум 200 SOL за весь период.</li>
                  </ul>
                </label>
              </div>

              <div className="meme-item flex items-start gap-4 p-4 rounded-xl ${theme === 'dark' ? 'border-white/10 bg-white/5 hover:bg-white/10' : 'border-gray-200 bg-gray-50 hover:bg-gray-100'} transition-all duration-200">
                <input type="checkbox" id="meme-2-2" className="meme-checkbox w-5 h-5 mt-1 accent-[#4E6E49] rounded flex-shrink-0" />
                <label htmlFor="meme-2-2" className="flex-1 cursor-pointer">
                  <strong className={`font-semibold block mb-2 ${headingColor}`}>Остаток бандлов</strong>
                  <ul className={`space-y-1 text-sm ${subTextColor}`}>
                    <li>• &le; 30 SOL.</li>
                  </ul>
                </label>
              </div>
            </div>
          </div>

          {/* Stage 3 */}
          <div className={`meme-stage rounded-2xl p-6 sm:p-7 ${cardBg} ${cardShadow} border ${calmBorder}`}>
            <div className="flex flex-col gap-2 mb-6">
              <p className={`text-xs uppercase tracking-[0.12em] ${subTextColor}`}>Этап 3</p>
              <h3 className={`text-2xl font-bold ${headingColor}`}>Сообщество и социальные сети</h3>
              <p className={`text-sm ${subTextColor}`}>Проверка органичности сообщества и качества информационного поля.</p>
            </div>

            <div className="space-y-4">
              <div className="meme-item flex items-start gap-4 p-4 rounded-xl ${theme === 'dark' ? 'border-white/10 bg-white/5 hover:bg-white/10' : 'border-gray-200 bg-gray-50 hover:bg-gray-100'} transition-all duration-200">
                <input type="checkbox" id="meme-3-1" className="meme-checkbox w-5 h-5 mt-1 accent-[#4E6E49] rounded flex-shrink-0" />
                <label htmlFor="meme-3-1" className="flex-1 cursor-pointer">
                  <strong className={`font-semibold block mb-2 ${headingColor}`}>Twitter</strong>
                  <ul className={`space-y-1 text-sm ${subTextColor}`}>
                    <li>• Посты каждые 1–3 минуты в первые часы.</li>
                    <li>• Рост подписчиков органичный.</li>
                  </ul>
                </label>
              </div>

              <div className="meme-item flex items-start gap-4 p-4 rounded-xl ${theme === 'dark' ? 'border-white/10 bg-white/5 hover:bg-white/10' : 'border-gray-200 bg-gray-50 hover:bg-gray-100'} transition-all duration-200">
                <input type="checkbox" id="meme-3-2" className="meme-checkbox w-5 h-5 mt-1 accent-[#4E6E49] rounded flex-shrink-0" />
                <label htmlFor="meme-3-2" className="flex-1 cursor-pointer">
                  <strong className={`font-semibold block mb-2 ${headingColor}`}>Сайт</strong>
                  <ul className={`space-y-1 text-sm ${subTextColor}`}>
                    <li>• Дизайн прикольный, ссылки рабочие.</li>
                  </ul>
                </label>
              </div>
            </div>
          </div>

          {/* Stage 4 */}
          <div className={`meme-stage rounded-2xl p-6 sm:p-7 ${cardBg} ${cardShadow} border ${calmBorder}`}>
            <div className="flex flex-col gap-2 mb-6">
              <p className={`text-xs uppercase tracking-[0.12em] ${subTextColor}`}>Этап 4</p>
              <h3 className={`text-2xl font-bold ${headingColor}`}>DEV и контракт</h3>
              <p className={`text-sm ${subTextColor}`}>Исключение манипуляций, контроль и потенциальный скам.</p>
            </div>

            <div className="space-y-4">
              <div className="meme-item flex items-start gap-4 p-4 rounded-xl ${theme === 'dark' ? 'border-white/10 bg-white/5 hover:bg-white/10' : 'border-gray-200 bg-gray-50 hover:bg-gray-100'} transition-all duration-200">
                <input type="checkbox" id="meme-4-1" className="meme-checkbox w-5 h-5 mt-1 accent-[#4E6E49] rounded flex-shrink-0" />
                <label htmlFor="meme-4-1" className="flex-1 cursor-pointer">
                  <strong className={`font-semibold block mb-2 ${headingColor}`}>Активность DEV</strong>
                  <ul className={`space-y-1 text-sm ${subTextColor}`}>
                    <li>• Продал ли DEV: если да, то как много и в какой фазе.</li>
                    <li>• Что делает DEV сейчас: покупки, сливы, пополнение ликвы?</li>
                  </ul>
                </label>
              </div>

              <div className="meme-item flex items-start gap-4 p-4 rounded-xl ${theme === 'dark' ? 'border-white/10 bg-white/5 hover:bg-white/10' : 'border-gray-200 bg-gray-50 hover:bg-gray-100'} transition-all duration-200">
                <input type="checkbox" id="meme-4-2" className="meme-checkbox w-5 h-5 mt-1 accent-[#4E6E49] rounded flex-shrink-0" />
                <label htmlFor="meme-4-2" className="flex-1 cursor-pointer">
                  <strong className={`font-semibold block mb-2 ${headingColor}`}>История монет DEV</strong>
                  <ul className={`space-y-1 text-sm ${subTextColor}`}>
                    <li>• Создавал ли ранее токены.</li>
                    <li>• Как они себя вели (пампы/дампы, длительность жизни).</li>
                  </ul>
                </label>
              </div>

              <div className="meme-item flex items-start gap-4 p-4 rounded-xl ${theme === 'dark' ? 'border-white/10 bg-white/5 hover:bg-white/10' : 'border-gray-200 bg-gray-50 hover:bg-gray-100'} transition-all duration-200">
                <input type="checkbox" id="meme-4-3" className="meme-checkbox w-5 h-5 mt-1 accent-[#4E6E49] rounded flex-shrink-0" />
                <label htmlFor="meme-4-3" className="flex-1 cursor-pointer">
                  <strong className={`font-semibold block mb-2 ${headingColor}`}>Токены DEV</strong>
                  <ul className={`space-y-1 text-sm ${subTextColor}`}>
                    <li>• Если перевёл более 15% — высокий риск.</li>
                  </ul>
                </label>
              </div>

              <div className="meme-item flex items-start gap-4 p-4 rounded-xl ${theme === 'dark' ? 'border-white/10 bg-white/5 hover:bg-white/10' : 'border-gray-200 bg-gray-50 hover:bg-gray-100'} transition-all duration-200">
                <input type="checkbox" id="meme-4-4" className="meme-checkbox w-5 h-5 mt-1 accent-[#4E6E49] rounded flex-shrink-0" />
                <label htmlFor="meme-4-4" className="flex-1 cursor-pointer">
                  <strong className={`font-semibold block mb-2 ${headingColor}`}>Безопасность контракта</strong>
                  <ul className={`space-y-1 text-sm ${subTextColor}`}>
                    <li>• Mint отключён.</li>
                    <li>• Freeze отключён.</li>
                    <li>• Trading limits отключены.</li>
                    <li>• Владелец LP — сожжён или передан в отказ (renounce).</li>
                  </ul>
                </label>
              </div>

              <div className="meme-item flex items-start gap-4 p-4 rounded-xl ${theme === 'dark' ? 'border-white/10 bg-white/5 hover:bg-white/10' : 'border-gray-200 bg-gray-50 hover:bg-gray-100'} transition-all duration-200">
                <input type="checkbox" id="meme-4-5" className="meme-checkbox w-5 h-5 mt-1 accent-[#4E6E49] rounded flex-shrink-0" />
                <label htmlFor="meme-4-5" className="flex-1 cursor-pointer">
                  <strong className={`font-semibold block mb-2 ${headingColor}`}>Curve-Manipulation Check</strong>
                  <ul className={`space-y-1 text-sm ${subTextColor}`}>
                    <li>• Нет скрытых функций, влияющих на цену.</li>
                    <li>• Проверить контракт на сторонних аудит-ботах.</li>
                  </ul>
                </label>
              </div>
            </div>
          </div>

          {/* Stage 5 */}
          <div className={`meme-stage rounded-2xl p-6 sm:p-7 ${cardBg} ${cardShadow} border ${calmBorder}`}>
            <div className="flex flex-col gap-2 mb-6">
              <p className={`text-xs uppercase tracking-[0.12em] ${subTextColor}`}>Этап 5</p>
              <h3 className={`text-2xl font-bold ${headingColor}`}>Распределение холдеров</h3>
              <p className={`text-sm ${subTextColor}`}>Убедиться, что флоат распределён и нет доминирующих кластеров.</p>
            </div>

            <div className="space-y-4">
              <div className="meme-item flex items-start gap-4 p-4 rounded-xl ${theme === 'dark' ? 'border-white/10 bg-white/5 hover:bg-white/10' : 'border-gray-200 bg-gray-50 hover:bg-gray-100'} transition-all duration-200">
                <input type="checkbox" id="meme-5-1" className="meme-checkbox w-5 h-5 mt-1 accent-[#4E6E49] rounded flex-shrink-0" />
                <label htmlFor="meme-5-1" className="flex-1 cursor-pointer">
                  <strong className={`font-semibold block mb-2 ${headingColor}`}>Топ-кошельки</strong>
                  <ul className={`space-y-1 text-sm ${subTextColor}`}>
                    <li>• Топ-держатели ≤ 5–7%.</li>
                    <li>• Оптимально: ранний лидер имеет не более 3–4%.</li>
                  </ul>
                </label>
              </div>

              <div className="meme-item flex items-start gap-4 p-4 rounded-xl ${theme === 'dark' ? 'border-white/10 bg-white/5 hover:bg-white/10' : 'border-gray-200 bg-gray-50 hover:bg-gray-100'} transition-all duration-200">
                <input type="checkbox" id="meme-5-2" className="meme-checkbox w-5 h-5 mt-1 accent-[#4E6E49] rounded flex-shrink-0" />
                <label htmlFor="meme-5-2" className="flex-1 cursor-pointer">
                  <strong className={`font-semibold block mb-2 ${headingColor}`}>Кластеры</strong>
                  <ul className={`space-y-1 text-sm ${subTextColor}`}>
                    <li>• Нет крупных связанных кошельков.</li>
                    <li>• Нет "пачек" кошельков, созданных в одну минуту.</li>
                  </ul>
                </label>
              </div>

              <div className="meme-item flex items-start gap-4 p-4 rounded-xl ${theme === 'dark' ? 'border-white/10 bg-white/5 hover:bg-white/10' : 'border-gray-200 bg-gray-50 hover:bg-gray-100'} transition-all duration-200">
                <input type="checkbox" id="meme-5-3" className="meme-checkbox w-5 h-5 mt-1 accent-[#4E6E49] rounded flex-shrink-0" />
                <label htmlFor="meme-5-3" className="flex-1 cursor-pointer">
                  <strong className={`font-semibold block mb-2 ${headingColor}`}>Фермы</strong>
                  <ul className={`space-y-1 text-sm ${subTextColor}`}>
                    <li>• Фермы не перегружены.</li>
                    <li>• Нет пачки фармеров с одинаковой стратегией.</li>
                  </ul>
                </label>
              </div>

              <div className="meme-item flex items-start gap-4 p-4 rounded-xl ${theme === 'dark' ? 'border-white/10 bg-white/5 hover:bg-white/10' : 'border-gray-200 bg-gray-50 hover:bg-gray-100'} transition-all duration-200">
                <input type="checkbox" id="meme-5-4" className="meme-checkbox w-5 h-5 mt-1 accent-[#4E6E49] rounded flex-shrink-0" />
                <label htmlFor="meme-5-4" className="flex-1 cursor-pointer">
                  <strong className={`font-semibold block mb-2 ${headingColor}`}>PNL/RPL-анализ</strong>
                  <ul className={`space-y-1 text-sm ${subTextColor}`}>
                    <li>• Холдеры не сидят в прибыли 4–5х (сливы неизбежны).</li>
                  </ul>
                </label>
              </div>

              <div className="meme-item flex items-start gap-4 p-4 rounded-xl ${theme === 'dark' ? 'border-white/10 bg-white/5 hover:bg-white/10' : 'border-gray-200 bg-gray-50 hover:bg-gray-100'} transition-all duration-200">
                <input type="checkbox" id="meme-5-5" className="meme-checkbox w-5 h-5 mt-1 accent-[#4E6E49] rounded flex-shrink-0" />
                <label htmlFor="meme-5-5" className="flex-1 cursor-pointer">
                  <strong className={`font-semibold block mb-2 ${headingColor}`}>Активность торговли</strong>
                  <ul className={`space-y-1 text-sm ${subTextColor}`}>
                    <li>• Нет торговли только команды.</li>
                    <li>• Есть новые кошельки.</li>
                    <li>• Нет явного копитрейдинга.</li>
                  </ul>
                </label>
              </div>

              <div className="meme-item flex items-start gap-4 p-4 rounded-xl ${theme === 'dark' ? 'border-white/10 bg-white/5 hover:bg-white/10' : 'border-gray-200 bg-gray-50 hover:bg-gray-100'} transition-all duration-200">
                <input type="checkbox" id="meme-5-6" className="meme-checkbox w-5 h-5 mt-1 accent-[#4E6E49] rounded flex-shrink-0" />
                <label htmlFor="meme-5-6" className="flex-1 cursor-pointer">
                  <strong className={`font-semibold block mb-2 ${headingColor}`}>Время удержания токена</strong>
                  <ul className={`space-y-1 text-sm ${subTextColor}`}>
                    <li>• Если все держат ≤3 минут — чистый скальпинг, можно словить дамп.</li>
                  </ul>
                </label>
              </div>
            </div>
          </div>

          {/* Stage 6 */}
          <div className={`meme-stage rounded-2xl p-6 sm:p-7 ${cardBg} ${cardShadow} border ${calmBorder}`}>
            <div className="flex flex-col gap-2 mb-6">
              <p className={`text-xs uppercase tracking-[0.12em] ${subTextColor}`}>Этап 6</p>
              <h3 className={`text-2xl font-bold ${headingColor}`}>Технический вход</h3>
              <p className={`text-sm ${subTextColor}`}>Войти по адекватной цене после фильтрации ончейн-данных.</p>
            </div>

            <div className="space-y-4">
              <div className="meme-item flex items-start gap-4 p-4 rounded-xl ${theme === 'dark' ? 'border-white/10 bg-white/5 hover:bg-white/10' : 'border-gray-200 bg-gray-50 hover:bg-gray-100'} transition-all duration-200">
                <input type="checkbox" id="meme-6-1" className="meme-checkbox w-5 h-5 mt-1 accent-[#4E6E49] rounded flex-shrink-0" />
                <label htmlFor="meme-6-1" className="flex-1 cursor-pointer">
                  <strong className={`font-semibold block mb-2 ${headingColor}`}>Фибо</strong>
                  <ul className={`space-y-1 text-sm ${subTextColor}`}>
                    <li>• Строим сетку по ключевому импульсу.</li>
                  </ul>
                </label>
              </div>

              <div className="meme-item flex items-start gap-4 p-4 rounded-xl ${theme === 'dark' ? 'border-white/10 bg-white/5 hover:bg-white/10' : 'border-gray-200 bg-gray-50 hover:bg-gray-100'} transition-all duration-200">
                <input type="checkbox" id="meme-6-2" className="meme-checkbox w-5 h-5 mt-1 accent-[#4E6E49] rounded flex-shrink-0" />
                <label htmlFor="meme-6-2" className="flex-1 cursor-pointer">
                  <strong className={`font-semibold block mb-2 ${headingColor}`}>Уровни</strong>
                  <ul className={`space-y-1 text-sm ${subTextColor}`}>
                    <li>• Совпадение 0.5/0.618/0.702 с зонами проторговки.</li>
                  </ul>
                </label>
              </div>

              <div className="meme-item flex items-start gap-4 p-4 rounded-xl ${theme === 'dark' ? 'border-white/10 bg-white/5 hover:bg-white/10' : 'border-gray-200 bg-gray-50 hover:bg-gray-100'} transition-all duration-200">
                <input type="checkbox" id="meme-6-3" className="meme-checkbox w-5 h-5 mt-1 accent-[#4E6E49] rounded flex-shrink-0" />
                <label htmlFor="meme-6-3" className="flex-1 cursor-pointer">
                  <strong className={`font-semibold block mb-2 ${headingColor}`}>Вход</strong>
                  <ul className={`space-y-1 text-sm ${subTextColor}`}>
                    <li>• 50–70% откат от локального хая.</li>
                  </ul>
                </label>
              </div>

              <div className="meme-item flex items-start gap-4 p-4 rounded-xl ${theme === 'dark' ? 'border-white/10 bg-white/5 hover:bg-white/10' : 'border-gray-200 bg-gray-50 hover:bg-gray-100'} transition-all duration-200">
                <input type="checkbox" id="meme-6-4" className="meme-checkbox w-5 h-5 mt-1 accent-[#4E6E49] rounded flex-shrink-0" />
                <label htmlFor="meme-6-4" className="flex-1 cursor-pointer">
                  <strong className={`font-semibold block mb-2 ${headingColor}`}>Дополнительно</strong>
                  <ul className={`space-y-1 text-sm ${subTextColor}`}>
                    <li>• Проверить, есть ли ликвидность на уровнях покупок.</li>
                    <li>• Проверить объёмы на откате: ослабление продавцов.</li>
                    <li>• Проверить, не обновляет ли токен лоу (в таком случае вход отменяется).</li>
                  </ul>
                </label>
              </div>
            </div>
          </div>

          {/* Stage 7 */}
          <div className={`meme-stage rounded-2xl p-6 sm:p-7 ${cardBg} ${cardShadow} border ${calmBorder}`}>
            <div className="flex flex-col gap-2 mb-6">
              <p className={`text-xs uppercase tracking-[0.12em] ${subTextColor}`}>Этап 7</p>
              <h3 className={`text-2xl font-bold ${headingColor}`}>Анализ риска</h3>
              <p className={`text-sm ${subTextColor}`}>Формализовать риск-менеджмент.</p>
            </div>

            <div className="space-y-4">
              <div className="meme-item flex items-start gap-4 p-4 rounded-xl ${theme === 'dark' ? 'border-white/10 bg-white/5 hover:bg-white/10' : 'border-gray-200 bg-gray-50 hover:bg-gray-100'} transition-all duration-200">
                <input type="checkbox" id="meme-7-1" className="meme-checkbox w-5 h-5 mt-1 accent-[#4E6E49] rounded flex-shrink-0" />
                <label htmlFor="meme-7-1" className="flex-1 cursor-pointer">
                  <strong className={`font-semibold block mb-2 ${headingColor}`}>Стоп-логика</strong>
                  <ul className={`space-y-1 text-sm ${subTextColor}`}>
                    <li>• Стоп по структуре (обновление локального лоу).</li>
                    <li>• Стоп по ончейн-сигналу (DEV слил, появились новые бандлы, появились киты).</li>
                  </ul>
                </label>
              </div>

              <div className="meme-item flex items-start gap-4 p-4 rounded-xl ${theme === 'dark' ? 'border-white/10 bg-white/5 hover:bg-white/10' : 'border-gray-200 bg-gray-50 hover:bg-gray-100'} transition-all duration-200">
                <input type="checkbox" id="meme-7-2" className="meme-checkbox w-5 h-5 mt-1 accent-[#4E6E49] rounded flex-shrink-0" />
                <label htmlFor="meme-7-2" className="flex-1 cursor-pointer">
                  <strong className={`font-semibold block mb-2 ${headingColor}`}>Целевые зоны</strong>
                  <ul className={`space-y-1 text-sm ${subTextColor}`}>
                    <li>• Минимум 2 стратегии выхода: частичный выход на 1.5–2х, остальное — трейл.</li>
                  </ul>
                </label>
              </div>
            </div>
          </div>

          {/* Trading Rules Reminder */}
          <div className={`meme-stage rounded-2xl p-6 sm:p-7 ${cardBg} ${cardShadow} border ${calmBorder}`}>
            <div className="flex flex-col gap-2 mb-6">
              <p className={`text-xs uppercase tracking-[0.12em] ${subTextColor}`}>Напоминание</p>
              <h3 className={`text-2xl font-bold ${headingColor}`}>Ключевые правила входа в сделки</h3>
              <p className={`text-sm ${subTextColor}`}>Трейдинг-дисциплина превыше всего.</p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className={`meme-item flex items-start gap-3 p-4 rounded-xl ${theme === 'dark' ? 'border-white/10 bg-white/5' : 'border-gray-200 bg-gray-50'}`}>
                <div className="text-2xl">📈</div>
                <div>
                  <strong className={`font-semibold block mb-1 ${headingColor}`}>Уровни Фибоначчи</strong>
                  <p className={`text-sm ${subTextColor}`}>Заходим только когда уровни поддержки совпадают с зоной проторговки и на прошлом уровне были высокие объёмы.</p>
                </div>
              </div>

              <div className={`meme-item flex items-start gap-3 p-4 rounded-xl ${theme === 'dark' ? 'border-white/10 bg-white/5' : 'border-gray-200 bg-gray-50'}`}>
                <div className="text-2xl">🎯</div>
                <div>
                  <strong className={`font-semibold block mb-1 ${headingColor}`}>Зона входа</strong>
                  <p className={`text-sm ${subTextColor}`}>Преимущественно заходим в канале 0.7, в идеале — строго от линии 0.7.</p>
                </div>
              </div>

              <div className={`meme-item flex items-start gap-3 p-4 rounded-xl ${theme === 'dark' ? 'border-white/10 bg-white/5' : 'border-gray-200 bg-gray-50'}`}>
                <div className="text-2xl">🛡️</div>
                <div>
                  <strong className={`font-semibold block mb-1 ${headingColor}`}>Stop Loss</strong>
                  <p className={`text-sm ${subTextColor}`}>Устанавливаем от линии 0.7 до 50% от позиции в зависимости от волатильности.</p>
                </div>
              </div>

              <div className={`meme-item flex items-start gap-3 p-4 rounded-xl ${theme === 'dark' ? 'border-white/10 bg-white/5' : 'border-gray-200 bg-gray-50'}`}>
                <div className="text-2xl">⚠️</div>
                <div>
                  <strong className={`font-semibold block mb-1 ${headingColor}`}>Альтернативный вход</strong>
                  <p className={`text-sm ${subTextColor}`}>Допустимо заходить по уровню 0.6, но только при наличии активного роста холдеров.</p>
                </div>
              </div>

              <div className={`meme-item flex items-start gap-3 p-4 rounded-xl ${theme === 'dark' ? 'border-white/10 bg-white/5' : 'border-gray-200 bg-gray-50'}`}>
                <div className="text-2xl">🚀</div>
                <div>
                  <strong className={`font-semibold block mb-1 ${headingColor}`}>Сигнал роста</strong>
                  <p className={`text-sm ${subTextColor}`}>Рост холдеров при сильной поддержке = высокая вероятность скачка вверх.</p>
                </div>
              </div>

              <div className={`meme-item flex items-start gap-3 p-4 rounded-xl ${theme === 'dark' ? 'border-white/10 bg-white/5' : 'border-gray-200 bg-gray-50'}`}>
                <div className="text-2xl">💰</div>
                <div>
                  <strong className={`font-semibold block mb-1 ${headingColor}`}>Take Profit</strong>
                  <p className={`text-sm ${subTextColor}`}>Целевые зоны 30-45% от входа, шаг фиксации прибыли — 12%.</p>
                </div>
              </div>

              <div className={`meme-item flex items-start gap-3 p-4 rounded-xl ${theme === 'dark' ? 'border-white/10 bg-white/5' : 'border-gray-200 bg-gray-50'}`}>
                <div className="text-2xl">🏠</div>
                <div>
                  <strong className={`font-semibold block mb-1 ${headingColor}`}>Правило выхода</strong>
                  <p className={`text-sm ${subTextColor}`}>По общему правилу фиксируем максимум на 70-80% позиции, если токен продолжает движение — выходим в оранжевой зоне Фибоначчи.</p>
                </div>
              </div>

              <div className={`meme-item flex items-start gap-3 p-4 rounded-xl ${theme === 'dark' ? 'border-white/10 bg-white/5' : 'border-gray-200 bg-gray-50'}`}>
                <div className="text-2xl">⏰</div>
                <div>
                  <strong className={`font-semibold block mb-1 ${headingColor}`}>Тайминг входа</strong>
                  <p className={`text-sm ${subTextColor}`}>Помните, что в токен лучше заходить спустя 10-15 минут от миграции, чтобы избежать ранних рисков.</p>
                </div>
              </div>

              <div className={`meme-item flex items-start gap-3 p-4 rounded-xl ${theme === 'dark' ? 'border-white/10 bg-white/5' : 'border-gray-200 bg-gray-50'}`}>
                <div className="text-2xl">✅</div>
                <div>
                  <strong className={`font-semibold block mb-1 ${headingColor}`}>Минимальные суммы</strong>
                  <p className={`text-sm ${subTextColor}`}>Старайтесь проверять токен минимальными суммами, если не уверены — достаточно 10-15 секунд анализа.</p>
                </div>
              </div>

              <div className={`meme-item flex items-start gap-3 p-4 rounded-xl ${theme === 'dark' ? 'border-white/10 bg-white/5' : 'border-gray-200 bg-gray-50'}`}>
                <div className="text-2xl">🔍</div>
                <div>
                  <strong className={`font-semibold block mb-1 ${headingColor}`}>Сервисы проверки</strong>
                  <p className={`text-sm ${subTextColor}`}>Используйте для анализа: <a href="https://rugcheck.xyz" className={`underline ${theme === 'dark' ? 'text-[#4E6E49]' : 'text-[#4E6E49]'}`} target="_blank">rugcheck.xyz</a> и <a href="https://gmgn.ai/?chain=sol" className={`underline ${theme === 'dark' ? 'text-[#4E6E49]' : 'text-[#4E6E49]'}`} target="_blank">gmgn.ai</a></p>
                </div>
              </div>
            </div>
          </div>

          {/* Progress Section */}
          <div className={`rounded-2xl p-6 sm:p-7 ${cardBg} ${cardShadow} border ${calmBorder}`}>
            <div className="flex flex-col gap-2 mb-4">
              <p className={`text-xs uppercase tracking-[0.12em] ${subTextColor}`}>Прогресс</p>
              <h3 className={`text-2xl font-bold ${headingColor}`}>Состояние проверки</h3>
              <p className={`text-sm ${subTextColor}`}>Отмечайте выполненные пункты для отслеживания прогресса анализа.</p>
            </div>

            <div className="space-y-6">
              <div className="text-center">
                <div id="meme-progress-percentage" className="text-6xl font-bold text-[#4E6E49] mb-2">0%</div>
                <p className={`text-sm ${subTextColor}`}>завершено</p>
              </div>

            <div className={`w-full h-8 ${theme === 'dark' ? 'bg-white/5' : 'bg-gray-200'} rounded-full overflow-hidden border ${theme === 'dark' ? 'border-white/10' : 'border-gray-300'}`}>
              <div
                id="meme-progress-fill"
                className="h-full bg-gradient-to-r from-[#4E6E49] to-[#6b8f5f] transition-all duration-800 ease-out relative"
              >
                <div className="absolute right-3 top-1/2 -translate-y-1/2 text-white text-sm opacity-0 animate-pulse">
                  🐊
                </div>
              </div>
            </div>

              <div className="flex items-center justify-between text-center">
                <div className="flex-1">
                  <div className={`text-2xl font-bold ${headingColor}`}>
                    <span id="meme-checked-count">0</span>
                    <span className={`text-sm ${subTextColor} ml-1`}>из</span>
                    <span id="meme-total-count" className={`text-sm ${subTextColor} ml-1`}>0</span>
                  </div>
                  <p className={`text-xs ${subTextColor} mt-1`}>пунктов выполнено</p>
                </div>
              </div>

              <div className="flex justify-center">
                <button
                  id="meme-reset-button"
                  className={`px-6 py-3 rounded-xl transition-all duration-200 border ${theme === 'dark' ? 'border-rose-300/60 bg-rose-500/20 text-rose-50 hover:bg-rose-500/30' : 'border-rose-400 bg-rose-50 text-rose-700 hover:bg-rose-100'} font-semibold flex items-center gap-2`}
                >
                  <span>🗑️</span>
                  <span>Сбросить прогресс</span>
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>

      <style>{`
        .completed {
          background: rgba(255, 255, 255, 0.1) !important;
          border-color: #4E6E49 !important;
        }

        .meme-item.completed strong {
          color: #4E6E49 !important;
        }

        .meme-checkbox:checked {
          background-color: #4E6E49;
          border-color: #4E6E49;
        }

        .meme-checkbox:checked::after {
          content: '🐊';
          position: absolute;
          top: 50%;
          left: 50%;
          transform: translate(-50%, -50%);
          font-size: 12px;
          color: white;
        }
      `}</style>
    </Layout>
  )
}
