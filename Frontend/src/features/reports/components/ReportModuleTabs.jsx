const ReportModuleTabs = ({ modules, activeReport, setActiveReport, onFavorite }) => (
  <div className="flex max-w-full gap-2 overflow-x-auto pb-2">
    {modules.map((module) => (
      <button
        key={module.id}
        onClick={() => setActiveReport(module.id)}
        className={`flex max-w-55 shrink-0 items-center gap-2 rounded-md border px-3 py-2 text-xs font-semibold transition sm:max-w-none ${activeReport === module.id
            ? 'border-blue-600 bg-blue-600 text-white'
            : 'border-slate-200 bg-white text-slate-700 hover:border-blue-300 hover:text-blue-700 dark:border-slate-800 dark:bg-slate-900 dark:text-slate-200'
          }`}
      >
        <span className="truncate">{module.title}</span>
        <span
          role="button"
          tabIndex={0}
          onClick={(event) => {
            event.stopPropagation()
            onFavorite(module.id)
          }}
          className={module.favorite ? 'text-amber-300' : 'text-slate-400'}
        >
          <i className="fa-solid fa-star"></i>
        </span>
      </button>
    ))}
  </div>
)

export default ReportModuleTabs
