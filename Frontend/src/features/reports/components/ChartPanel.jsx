const colors = ['#2563eb', '#059669', '#f59e0b', '#dc2626', '#7c3aed', '#0891b2', '#be123c', '#65a30d']

const Card = ({ title, children, className = '' }) => (
  <section className={`min-w-0 rounded-lg border border-slate-200 bg-white p-3 shadow-sm dark:border-slate-800 dark:bg-slate-900 sm:p-4 ${className}`}>
    <h3 className="mb-3 text-sm font-bold text-slate-950 dark:text-white">{title}</h3>
    <div className="min-h-60 min-w-0">{children}</div>
  </section>
)

const safeData = (data = []) => (Array.isArray(data) && data.length ? data : [{ label: 'No Data', value: 0, orders: 0 }])

const getValue = (item) => Number(item?.value ?? item?.orders ?? item?.quantity ?? item?.averageRate ?? 0)

const maxValue = (data) => Math.max(...data.map(getValue), 1)

const formatCompact = (value) =>
  new Intl.NumberFormat('en-IN', {
    notation: Number(value) >= 100000 ? 'compact' : 'standard',
    maximumFractionDigits: 1,
  }).format(Number(value || 0))

const EmptyHint = () => (
  <div className="flex min-h-48 items-center justify-center rounded-md border border-dashed border-slate-200 text-xs text-slate-500">
    No chart data available
  </div>
)

const BarList = ({ data, valueKey = 'value', color = '#2563eb' }) => {
  const rows = safeData(data).slice(0, 8)
  const max = Math.max(...rows.map((row) => Number(row[valueKey] || getValue(row))), 1)

  if (rows.every((row) => Number(row[valueKey] || getValue(row)) === 0)) return <EmptyHint />

  return (
    <div className="space-y-3">
      {rows.map((row, index) => {
        const value = Number(row[valueKey] || getValue(row))
        return (
          <div key={`${row.label}-${index}`} className="min-w-0">
            <div className="mb-1 flex items-center justify-between gap-3 text-xs">
              <span className="truncate font-medium text-slate-700 dark:text-slate-200">{row.label || 'Unknown'}</span>
              <span className="shrink-0 font-semibold text-slate-950 dark:text-white">{formatCompact(value)}</span>
            </div>
            <div className="h-2.5 rounded-full bg-slate-100 dark:bg-slate-800">
              <div
                className="h-full rounded-full"
                style={{ width: `${Math.max(4, (value / max) * 100)}%`, backgroundColor: color || colors[index % colors.length] }}
              />
            </div>
          </div>
        )
      })}
    </div>
  )
}

const MonthlyTrend = ({ data }) => {
  const rows = safeData(data).slice(-12)
  const max = maxValue(rows)

  if (rows.every((row) => getValue(row) === 0)) return <EmptyHint />

  return (
    <div className="flex min-h-60 items-end gap-2">
      {rows.map((row, index) => {
        const value = getValue(row)
        const height = Math.max(8, (value / max) * 100)
        return (
          <div key={`${row.label}-${index}`} className="flex min-w-0 flex-1 flex-col items-center gap-2">
            <div className="flex h-44 w-full items-end rounded-md bg-slate-50 px-1 dark:bg-slate-800">
              <div
                className="w-full rounded-t-md bg-blue-600"
                title={`${row.label}: ${formatCompact(value)}`}
                style={{ height: `${height}%` }}
              />
            </div>
            <span className="w-full truncate text-center text-[10px] text-slate-500">{row.label}</span>
          </div>
        )
      })}
    </div>
  )
}

const DonutLegend = ({ data }) => {
  const rows = safeData(data).filter((item) => getValue(item) > 0)
  const total = rows.reduce((sum, item) => sum + getValue(item), 0)

  if (!rows.length || total === 0) return <EmptyHint />

  let current = 0
  const gradient = rows.map((row, index) => {
    const start = current
    const end = current + (getValue(row) / total) * 100
    current = end
    return `${colors[index % colors.length]} ${start}% ${end}%`
  }).join(', ')

  return (
    <div className="grid min-h-60 items-center gap-5 sm:grid-cols-[160px_minmax(0,1fr)]">
      <div
        className="mx-auto h-36 w-36 rounded-full"
        style={{ background: `conic-gradient(${gradient})` }}
      >
        <div className="grid h-full place-items-center rounded-full p-7">
          <div className="grid h-full w-full place-items-center rounded-full bg-white text-center dark:bg-slate-900">
            <span className="text-lg font-bold text-slate-950 dark:text-white">{formatCompact(total)}</span>
          </div>
        </div>
      </div>
      <div className="space-y-2">
        {rows.map((row, index) => (
          <div key={`${row.label}-${index}`} className="flex items-center justify-between gap-3 text-xs">
            <span className="flex min-w-0 items-center gap-2 text-slate-600 dark:text-slate-300">
              <span className="h-2.5 w-2.5 shrink-0 rounded-full" style={{ backgroundColor: colors[index % colors.length] }} />
              <span className="truncate">{row.label}</span>
            </span>
            <span className="font-semibold text-slate-950 dark:text-white">{formatCompact(getValue(row))}</span>
          </div>
        ))}
      </div>
    </div>
  )
}

const Heatmap = ({ data }) => {
  const rows = safeData(data).slice(-36)
  const max = maxValue(rows)

  return (
    <div className="grid min-h-60 grid-cols-6 gap-1 sm:grid-cols-12">
      {rows.map((item, index) => (
        <div
          key={`${item.label}-${index}`}
          title={`${item.label}: ${formatCompact(getValue(item))}`}
          className="rounded-sm bg-blue-600"
          style={{ opacity: Math.max(0.16, Math.min(1, getValue(item) / max)) }}
        />
      ))}
    </div>
  )
}

const Gauge = ({ overview = {} }) => {
  const totalCost = Number(overview.summary?.totalCost || 0)
  const totalPurchaseValue = Number(overview.summary?.totalPurchaseValue || 0)
  const percentage = Math.min(100, Math.round((totalCost / Math.max(totalPurchaseValue, 1)) * 100))

  return (
    <div className="flex min-h-60 flex-col items-center justify-center">
      <div className="relative h-40 w-40 rounded-full bg-slate-100 dark:bg-slate-800">
        <div
          className="absolute inset-0 rounded-full"
          style={{ background: `conic-gradient(#059669 0 ${percentage}%, #e2e8f0 ${percentage}% 100%)` }}
        />
        <div className="absolute inset-5 grid place-items-center rounded-full bg-white text-center dark:bg-slate-900">
          <div>
            <span className="block text-3xl font-bold text-slate-950 dark:text-white">{percentage}%</span>
            <span className="text-xs text-slate-500">Utilization</span>
          </div>
        </div>
      </div>
    </div>
  )
}

const RateList = ({ data }) => {
  const rows = safeData(data).slice(0, 8)
  if (rows.every((row) => !row.lowestRate && !row.averageRate && !row.highestRate)) return <EmptyHint />

  return (
    <div className="space-y-3">
      {rows.map((row, index) => (
        <div key={`${row.label}-${index}`} className="rounded-md border border-slate-100 p-2 text-xs dark:border-slate-800">
          <p className="truncate font-semibold text-slate-800 dark:text-slate-100">{row.label}</p>
          <div className="mt-2 grid grid-cols-3 gap-2 text-slate-500">
            <span>Low: {formatCompact(row.lowestRate)}</span>
            <span>Avg: {formatCompact(row.averageRate)}</span>
            <span>High: {formatCompact(row.highestRate)}</span>
          </div>
        </div>
      ))}
    </div>
  )
}

const ChartPanel = ({ analytics = {}, overview = {} }) => {
  const charts = analytics.charts || {}
  const monthly = safeData(charts.monthly)
  const vendorWise = safeData(charts.vendorWise)
  const projectWise = safeData(charts.projectWise)
  const itemRates = safeData(charts.itemRates)
  const quantity = safeData(charts.quantity)
  const costBreakdown = safeData(charts.costBreakdown)
  const status = safeData(overview.charts?.status)

  return (
    <div className="grid min-w-0 grid-cols-1 gap-4 xl:grid-cols-2 2xl:grid-cols-3">
      <Card title="Monthly Trend" className="xl:col-span-2">
        <MonthlyTrend data={monthly} />
      </Card>

      <Card title="PO Status Donut">
        <DonutLegend data={status} />
      </Card>

      <Card title="Project Comparison">
        <BarList data={projectWise} color="#7c3aed" />
      </Card>

      <Card title="Vendor Share">
        <BarList data={vendorWise} color="#059669" />
      </Card>

      <Card title="Cost Analytics Area">
        <MonthlyTrend data={monthly} />
      </Card>

      <Card title="Rate Analysis">
        <RateList data={itemRates} />
      </Card>

      <Card title="Quantity Treemap">
        <BarList data={quantity} color="#2563eb" />
      </Card>

      <Card title="Vendor Ranking">
        <BarList data={vendorWise} valueKey="orders" color="#f59e0b" />
      </Card>

      <Card title="Approval Funnel">
        <BarList data={status} color="#dc2626" />
      </Card>

      <Card title="City Summary">
        <BarList data={safeData(charts.cityWise)} color="#be123c" />
      </Card>

      <Card title="Calendar Heatmap">
        <Heatmap data={monthly} />
      </Card>

      <Card title="Budget Gauge">
        <Gauge overview={overview} />
      </Card>

      <Card title="Cost Breakdown">
        <BarList data={costBreakdown} color="#059669" />
      </Card>
    </div>
  )
}

export default ChartPanel
