const severityClass = {
  low: 'border-emerald-200 bg-emerald-50 text-emerald-900 dark:border-emerald-900 dark:bg-emerald-950/40 dark:text-emerald-200',
  medium: 'border-amber-200 bg-amber-50 text-amber-900 dark:border-amber-900 dark:bg-amber-950/40 dark:text-amber-200',
  high: 'border-red-200 bg-red-50 text-red-900 dark:border-red-900 dark:bg-red-950/40 dark:text-red-200',
  critical: 'border-red-300 bg-red-100 text-red-950 dark:border-red-800 dark:bg-red-950 dark:text-red-100',
}

const InsightsPanel = ({ insights = [] }) => (
  <section className="min-w-0 rounded-lg border border-slate-200 bg-white p-3 shadow-sm dark:border-slate-800 dark:bg-slate-900 sm:p-4">
    <div className="mb-3 flex min-w-0 items-center justify-between gap-3">
      <h3 className="text-sm font-bold text-slate-950 dark:text-white">AI Procurement Insights</h3>
      <span className="rounded-full bg-blue-50 px-2 py-1 text-[11px] font-semibold text-blue-700 dark:bg-blue-950 dark:text-blue-200">Live</span>
    </div>
    <div className="space-y-3">
      {insights.map((insight, index) => (
        <article key={`${insight.type}-${index}`} className={`rounded-lg border p-3 ${severityClass[insight.severity] || severityClass.medium}`}>
          <div className="flex min-w-0 items-start gap-2">
            <i className="fa-solid fa-lightbulb mt-0.5"></i>
            <div className="min-w-0">
              <h4 className="text-xs font-bold">{insight.title}</h4>
              <p className="mt-1 text-xs leading-5">{insight.message}</p>
              <p className="mt-2 text-xs font-semibold">{insight.recommendation}</p>
            </div>
          </div>
        </article>
      ))}
    </div>
  </section>
)

export default InsightsPanel
