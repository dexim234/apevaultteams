const cn = (...classes: (string | undefined | null | false)[]) => {
  return classes.filter(Boolean).join(' ')
}

export const FasolSignalsStrategy = () => {
  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
        <div>
          <h1 className="text-2xl font-black text-[#4E6E49] dark:text-white uppercase tracking-wider">
            Анализ наших сделок
          </h1>
        </div>
        <button
          className={cn(
            "px-4 py-2 rounded-xl font-bold text-sm transition-all",
            "bg-[#4E6E49]/10 text-[#4E6E49] hover:bg-[#4E6E49]/20",
            "border border-[#4E6E49]/20 cursor-default"
          )}
        >
          Учебная платформа (в разработке)
        </button>
      </div>
    </div>
  )
}
