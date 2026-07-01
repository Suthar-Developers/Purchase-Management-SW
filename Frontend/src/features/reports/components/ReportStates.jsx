export const LoadingSkeleton = () => (
  <div className="space-y-4 animate-pulse">
    <div className="grid grid-cols-1 md:grid-cols-3 xl:grid-cols-6 gap-3">
      {Array.from({ length: 12 }).map((_, index) => (
        <div key={index} className="h-28 rounded-lg bg-slate-200 dark:bg-slate-800" />
      ))}
    </div>
    <div className="grid grid-cols-1 xl:grid-cols-3 gap-4">
      <div className="h-80 rounded-lg bg-slate-200 dark:bg-slate-800 xl:col-span-2" />
      <div className="h-80 rounded-lg bg-slate-200 dark:bg-slate-800" />
    </div>
  </div>
)

export const EmptyState = ({ title = 'No data found', message = 'Adjust filters or widen the date range.' }) => (
  <div className="flex min-h-56 flex-col items-center justify-center rounded-lg border border-dashed border-slate-300 bg-white p-8 text-center text-slate-500 dark:border-slate-700 dark:bg-slate-900 dark:text-slate-400">
    <i className="fa-solid fa-chart-simple mb-3 text-3xl text-slate-400"></i>
    <h3 className="text-sm font-semibold text-slate-900 dark:text-white">{title}</h3>
    <p className="mt-1 max-w-md text-xs">{message}</p>
  </div>
)

export const ErrorState = ({ message, onRetry }) => (
  <div className="rounded-lg border border-red-200 bg-red-50 p-5 text-red-800 dark:border-red-900/60 dark:bg-red-950/40 dark:text-red-200">
    <div className="flex items-start justify-between gap-4">
      <div>
        <h3 className="text-sm font-semibold">Reports could not be loaded</h3>
        <p className="mt-1 text-xs">{message}</p>
      </div>
      <button onClick={onRetry} className="rounded-md bg-red-600 px-3 py-2 text-xs font-semibold text-white hover:bg-red-700">
        Retry
      </button>
    </div>
  </div>
)
