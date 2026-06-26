import { kpiDefinitions } from '../data/reportConfig'
import { formatKpiValue } from '../utils/formatters'

const accentClasses = [
  'border-l-blue-500',
  'border-l-emerald-500',
  'border-l-amber-500',
  'border-l-rose-500',
  'border-l-cyan-500',
  'border-l-violet-500',
]

const KpiGrid = ({ summary = {}, onSelect }) => (
  <div className="grid min-w-0 grid-cols-1 gap-3 sm:grid-cols-2 lg:grid-cols-3 2xl:grid-cols-6">
    {kpiDefinitions.map(([key, label, type], index) => (
      <button
        key={key}
        onClick={() => onSelect?.(key)}
        className={`group min-h-28 min-w-0 rounded-lg border border-slate-200 border-l-4 ${accentClasses[index % accentClasses.length]} bg-white p-3 text-left shadow-sm transition hover:-translate-y-0.5 hover:shadow-md focus:outline-none focus:ring-2 focus:ring-blue-500 dark:border-slate-800 dark:bg-slate-900 sm:p-4`}
      >
        <div className="flex items-start justify-between gap-3">
          <p className="min-w-0 text-xs font-medium uppercase tracking-wide text-slate-500 dark:text-slate-400">{label}</p>
          <i className="fa-solid fa-arrow-up-right-from-square text-[10px] text-slate-300 transition group-hover:text-blue-500"></i>
        </div>
        <p className="mt-3 wrap-break-words text-xl font-bold text-slate-950 dark:text-white sm:text-2xl">{formatKpiValue(summary[key], type)}</p>
      </button>
    ))}
  </div>
)

export default KpiGrid
