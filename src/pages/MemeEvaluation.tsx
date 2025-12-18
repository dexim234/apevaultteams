import { useEffect } from 'react'
import { Layout } from '@/components/Layout'
import { useThemeStore } from '@/store/themeStore'

export const MemeEvaluation = () => {
  const { theme } = useThemeStore()

  const subTextColor = theme === 'dark' ? 'text-gray-400' : 'text-gray-600'
  const headingColor = theme === 'dark' ? 'text-white' : 'text-gray-900'
  const cardBg = 'bg-[#10141c]'
  const calmBorder = 'border-[#48a35e]/60'
  const cardShadow = 'shadow-[0_24px_80px_rgba(0,0,0,0.45)]'

  useEffect(() => {
    // Load the checklist functionality
    const loadChecklist = () => {
      const checkboxes = document.querySelectorAll('.meme-checkbox')
      const progressFill = document.getElementById('meme-progress-fill')
      const checkedCount = document.getElementById('meme-checked-count')
      const totalCount = document.getElementById('meme-total-count')
      const progressPercentage = document.getElementById('meme-progress-percentage')

      if (!checkboxes.length || !progressFill || !checkedCount || !totalCount || !progressPercentage) return

      totalCount.textContent = checkboxes.length
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
      checkedCount.textContent = checkedCountValue
      progressPercentage.textContent = percentage + '%'

      // Animate progress bar
      progressFill.style.width = percentage + '%'

      // Add/remove completed class for items
      checkboxes.forEach(checkbox => {
        const item = checkbox.closest('.meme-item')
        if (checkbox.checked) {
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

      checkedCount.textContent = checkedCountValue
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
      title.addEventListener('click', function() {
        const stage = this.closest('.meme-stage')
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
        <div className="relative overflow-hidden rounded-3xl border border-[#48a35e]/60 shadow-[0_24px_80px_rgba(0,0,0,0.45)] bg-[#10141c]">
          <div className="absolute inset-0 pointer-events-none">
            <div className="absolute -left-16 -bottom-10 w-80 h-80 bg-emerald-500/18 blur-3xl"></div>
            <div className="absolute inset-0 bg-[radial-gradient(circle_at_50%_0%,rgba(255,255,255,0.08),transparent_45%)]"></div>
          </div>

          <div className="relative p-6 sm:p-8 space-y-6">
            <div className="flex flex-col gap-4 lg:flex-row lg:items-start lg:justify-between">
              <div className="space-y-3 max-w-3xl">
                <div className="flex items-start gap-3">
                  <div className="p-3 rounded-2xl bg-white/10 border border-white/20 text-white shadow-inner">
                    <span className="text-2xl">🐊</span>
                  </div>
                  <div className="space-y-2">
                    <h1 className="text-3xl sm:text-4xl font-black text-white leading-tight">Оценка мемкоина</h1>
                    <p className="text-sm text-white/70">
                      Полный чек-лист проверки мемкоина. Систематический анализ для безопасного входа.
                    </p>
                    <div className="flex flex-wrap gap-2">
                      {['Базовые метрики','Бандлы','Сообщество','DEV анализ'].map((chip, idx) => (
                        <span
                          key={chip}
                          className={`px-4 py-1.5 rounded-full text-xs font-semibold border ${
                            idx === 0
                              ? 'bg-emerald-500 text-white border-emerald-300/60 shadow-md'
                              : 'bg-white/10 text-white border-white/20'
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

            <div className="w-full h-8 bg-white/5 rounded-full overflow-hidden border border-white/10">
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
                className="px-6 py-3 rounded-xl transition-all duration-200 border border-rose-300/60 bg-rose-500/20 text-rose-50 hover:bg-rose-500/30 font-semibold flex items-center gap-2"
              >
                <span>🗑️</span>
                <span>Сбросить прогресс</span>
              </button>
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
              <div className="meme-item flex items-start gap-4 p-4 rounded-xl border border-white/10 bg-white/5 hover:bg-white/10 transition-all duration-200">
                <input type="checkbox" id="meme-1-1" className="meme-checkbox w-5 h-5 mt-1 accent-[#4E6E49] rounded flex-shrink-0" />
                <label htmlFor="meme-1-1" className="flex-1 cursor-pointer">
                  <strong className={`font-semibold block mb-2 ${headingColor}`}>Market Cap</strong>
                  <ul className={`space-y-1 text-sm ${subTextColor}`}>
                    <li>• Капа &le; 100k (оптимально 20–80k).</li>
                    <li>• Резкий скачок капы на старте без реальной ликвидности — минус.</li>
                  </ul>
                </label>
              </div>

              <div className="meme-item flex items-start gap-4 p-4 rounded-xl border border-white/10 bg-white/5 hover:bg-white/10 transition-all duration-200">
                <input type="checkbox" id="meme-1-2" className="meme-checkbox w-5 h-5 mt-1 accent-[#4E6E49] rounded flex-shrink-0" />
                <label htmlFor="meme-1-2" className="flex-1 cursor-pointer">
                  <strong className={`font-semibold block mb-2 ${headingColor}`}>Объём торгов</strong>
                  <ul className={`space-y-1 text-sm ${subTextColor}`}>
                    <li>• Объём &gt; капы в 1.5–2 раза (лучше 2.5–3).</li>
                    <li>• Проверить синхронность: объём должен совпадать с движением цены.</li>
                  </ul>
                </label>
              </div>

              <div className="meme-item flex items-start gap-4 p-4 rounded-xl border border-white/10 bg-white/5 hover:bg-white/10 transition-all duration-200">
                <input type="checkbox" id="meme-1-3" className="meme-checkbox w-5 h-5 mt-1 accent-[#4E6E49] rounded flex-shrink-0" />
                <label htmlFor="meme-1-3" className="flex-1 cursor-pointer">
                  <strong className={`font-semibold block mb-2 ${headingColor}`}>Холдеры</strong>
                  <ul className={`space-y-1 text-sm ${subTextColor}`}>
                    <li>• Рост холдеров стабильный, без искусственных всплесков.</li>
                    <li>• Проверить уникальность кошельков.</li>
                  </ul>
                </label>
              </div>

              <div className="meme-item flex items-start gap-4 p-4 rounded-xl border border-white/10 bg-white/5 hover:bg-white/10 transition-all duration-200">
                <input type="checkbox" id="meme-1-4" className="meme-checkbox w-5 h-5 mt-1 accent-[#4E6E49] rounded flex-shrink-0" />
                <label htmlFor="meme-1-4" className="flex-1 cursor-pointer">
                  <strong className={`font-semibold block mb-2 ${headingColor}`}>График</strong>
                  <ul className="text-gray-700 dark:text-gray-300 space-y-1 text-sm">
                    <li>• Органичный график, без параболического роста.</li>
                    <li>• Нет вертикальных ракет на старте.</li>
                  </ul>
                </label>
              </div>

              <div className="meme-item flex items-start gap-4 p-4 rounded-xl border border-white/10 bg-white/5 hover:bg-white/10 transition-all duration-200">
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
              <div className="meme-item flex items-start gap-4 p-4 rounded-xl border border-white/10 bg-white/5 hover:bg-white/10 transition-all duration-200">
                <input type="checkbox" id="meme-2-1" className="meme-checkbox w-5 h-5 mt-1 accent-[#4E6E49] rounded flex-shrink-0" />
                <label htmlFor="meme-2-1" className="flex-1 cursor-pointer">
                  <strong className={`font-semibold block mb-2 ${headingColor}`}>Откуплено бандлами</strong>
                  <ul className={`space-y-1 text-sm ${subTextColor}`}>
                    <li>• &le; 100, максимум 200 SOL за весь период.</li>
                  </ul>
                </label>
              </div>

              <div className="meme-item flex items-start gap-4 p-4 rounded-xl border border-white/10 bg-white/5 hover:bg-white/10 transition-all duration-200">
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
              <div className="meme-item flex items-start gap-4 p-4 rounded-xl border border-white/10 bg-white/5 hover:bg-white/10 transition-all duration-200">
                <input type="checkbox" id="meme-3-1" className="meme-checkbox w-5 h-5 mt-1 accent-[#4E6E49] rounded flex-shrink-0" />
                <label htmlFor="meme-3-1" className="flex-1 cursor-pointer">
                  <strong className={`font-semibold block mb-2 ${headingColor}`}>Twitter</strong>
                  <ul className={`space-y-1 text-sm ${subTextColor}`}>
                    <li>• Посты каждые 1–3 минуты в первые часы.</li>
                    <li>• Рост подписчиков органичный.</li>
                  </ul>
                </label>
              </div>

              <div className="meme-item flex items-start gap-4 p-4 rounded-xl border border-white/10 bg-white/5 hover:bg-white/10 transition-all duration-200">
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

          {/* Completion Note */}
          <div className="text-center py-8">
            <div className={`rounded-xl p-6 ${theme === 'dark' ? 'bg-white/5' : 'bg-gray-50'} border ${calmBorder}`}>
              <p className={`text-sm ${subTextColor}`}>
                Полная версия чек-листа включает ещё этапы анализа разработчика, контракта и финального принятия решения.
              </p>
            </div>
          </div>
        </div>
      </div>

      <style jsx>{`
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
