import { useThemeStore } from '@/store/themeStore'
import { LineChart, Construction } from 'lucide-react'

export const TokenAnalysis = () => {
    const { theme } = useThemeStore()
    const headingColor = theme === 'dark' ? 'text-white' : 'text-gray-900'

    return (
        <div className="space-y-6">
            {/* Header */}
            <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
                <div className="flex items-center gap-4">
                    <div className="p-3 bg-emerald-500/10 rounded-2xl border border-emerald-500/20">
                        <LineChart className="w-8 h-8 text-emerald-500" />
                    </div>
                    <div>
                        <h1 className={`text-2xl md:text-3xl font-black tracking-tight ${headingColor}`}>
                            Анализ токенов
                        </h1>
                        <p className={`text-sm font-medium ${theme === 'dark' ? 'text-gray-400' : 'text-gray-500'}`}>
                            Инструменты анализа и статистики токенов
                        </p>
                    </div>
                </div>
            </div>

            {/* Placeholder Content */}
            <div className={`flex flex-col items-center justify-center min-h-[400px] rounded-3xl border ${theme === 'dark' ? 'bg-[#0b1015] border-white/5' : 'bg-white border-gray-100'}`}>
                <div className="p-4 bg-emerald-500/10 rounded-full mb-4">
                    <Construction className="w-12 h-12 text-emerald-500" />
                </div>
                <h2 className={`text-xl font-bold mb-2 ${headingColor}`}>Раздел в разработке</h2>
                <p className={`text-center max-w-md ${theme === 'dark' ? 'text-gray-400' : 'text-gray-500'}`}>
                    Мы работаем над созданием мощных инструментов для анализа токенов.
                    Следите за обновлениями!
                </p>
            </div>
        </div>
    )
}
