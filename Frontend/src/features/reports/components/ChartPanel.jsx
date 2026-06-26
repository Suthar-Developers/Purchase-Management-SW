import {
  Area,
  AreaChart,
  Bar,
  BarChart,
  CartesianGrid,
  Cell,
  ComposedChart,
  Funnel,
  FunnelChart,
  LabelList,
  Legend,
  Line,
  LineChart,
  Pie,
  PieChart,
  Radar,
  RadarChart,
  PolarAngleAxis,
  PolarGrid,
  PolarRadiusAxis,
  ResponsiveContainer,
  Scatter,
  ScatterChart,
  Tooltip,
  Treemap,
  XAxis,
  YAxis,
} from 'recharts'

const colors = ['#2563eb', '#059669', '#f59e0b', '#dc2626', '#7c3aed', '#0891b2', '#be123c', '#65a30d']

const Card = ({ title, children, className = '' }) => (
  <section className={`min-w-0 rounded-lg border border-slate-200 bg-white p-3 shadow-sm dark:border-slate-800 dark:bg-slate-900 sm:p-4 ${className}`}>
    <h3 className="mb-3 text-sm font-bold text-slate-950 dark:text-white">{title}</h3>
    <div className="h-60 min-w-0 sm:h-72">{children}</div>
  </section>
)

const safeData = (data = []) => (data.length ? data : [{ label: 'No Data', value: 0 }])

const ChartPanel = ({ analytics = {}, overview = {} }) => {
  const charts = analytics.charts || {}
  const monthly = safeData(charts.monthly)
  const vendorWise = safeData(charts.vendorWise)
  const projectWise = safeData(charts.projectWise)
  const cityWise = safeData(charts.cityWise)
  const itemRates = safeData(charts.itemRates)
  const quantity = safeData(charts.quantity)
  const costBreakdown = safeData(charts.costBreakdown)
  const status = safeData(overview.charts?.status)

  return (
    <div className="grid min-w-0 grid-cols-1 gap-4 xl:grid-cols-2 2xl:grid-cols-3">
      <Card title="Monthly Trend" className="xl:col-span-2">
        <ResponsiveContainer width="100%" height="100%">
          <ComposedChart data={monthly}>
            <CartesianGrid strokeDasharray="3 3" />
            <XAxis dataKey="label" />
            <YAxis />
            <Tooltip />
            <Legend />
            <Bar dataKey="orders" fill="#2563eb" name="Orders" />
            <Line type="monotone" dataKey="value" stroke="#059669" name="Value" />
          </ComposedChart>
        </ResponsiveContainer>
      </Card>

      <Card title="PO Status Donut">
        <ResponsiveContainer width="100%" height="100%">
          <PieChart>
            <Pie data={status} innerRadius={55} outerRadius={92} dataKey="value" nameKey="label" paddingAngle={2}>
              {status.map((_, index) => <Cell key={index} fill={colors[index % colors.length]} />)}
            </Pie>
            <Tooltip />
            <Legend />
          </PieChart>
        </ResponsiveContainer>
      </Card>

      <Card title="Project Comparison">
        <ResponsiveContainer width="100%" height="100%">
          <BarChart data={projectWise} layout="vertical" margin={{ left: 20 }}>
            <CartesianGrid strokeDasharray="3 3" />
            <XAxis type="number" />
            <YAxis dataKey="label" type="category" width={90} />
            <Tooltip />
            <Bar dataKey="value" fill="#7c3aed" />
          </BarChart>
        </ResponsiveContainer>
      </Card>

      <Card title="Vendor Share">
        <ResponsiveContainer width="100%" height="100%">
          <PieChart>
            <Pie data={vendorWise} outerRadius={92} dataKey="value" nameKey="label">
              {vendorWise.map((_, index) => <Cell key={index} fill={colors[index % colors.length]} />)}
            </Pie>
            <Tooltip />
            <Legend />
          </PieChart>
        </ResponsiveContainer>
      </Card>

      <Card title="Cost Analytics Area">
        <ResponsiveContainer width="100%" height="100%">
          <AreaChart data={monthly}>
            <CartesianGrid strokeDasharray="3 3" />
            <XAxis dataKey="label" />
            <YAxis />
            <Tooltip />
            <Area type="monotone" dataKey="value" stroke="#0891b2" fill="#bae6fd" />
          </AreaChart>
        </ResponsiveContainer>
      </Card>

      <Card title="Rate Analysis">
        <ResponsiveContainer width="100%" height="100%">
          <LineChart data={itemRates}>
            <CartesianGrid strokeDasharray="3 3" />
            <XAxis dataKey="label" hide />
            <YAxis />
            <Tooltip />
            <Legend />
            <Line dataKey="lowestRate" stroke="#059669" name="Lowest" />
            <Line dataKey="averageRate" stroke="#2563eb" name="Average" />
            <Line dataKey="highestRate" stroke="#dc2626" name="Highest" />
          </LineChart>
        </ResponsiveContainer>
      </Card>

      <Card title="Quantity Treemap">
        <ResponsiveContainer width="100%" height="100%">
          <Treemap data={quantity} dataKey="value" nameKey="label" stroke="#fff" fill="#2563eb" />
        </ResponsiveContainer>
      </Card>

      <Card title="Vendor Ranking Radar">
        <ResponsiveContainer width="100%" height="100%">
          <RadarChart data={vendorWise.slice(0, 8)}>
            <PolarGrid />
            <PolarAngleAxis dataKey="label" />
            <PolarRadiusAxis />
            <Radar dataKey="orders" stroke="#f59e0b" fill="#f59e0b" fillOpacity={0.35} />
            <Tooltip />
          </RadarChart>
        </ResponsiveContainer>
      </Card>

      <Card title="Approval Funnel">
        <ResponsiveContainer width="100%" height="100%">
          <FunnelChart>
            <Tooltip />
            <Funnel dataKey="value" data={status} isAnimationActive>
              <LabelList position="right" fill="#111827" stroke="none" dataKey="label" />
            </Funnel>
          </FunnelChart>
        </ResponsiveContainer>
      </Card>

      <Card title="City Scatter">
        <ResponsiveContainer width="100%" height="100%">
          <ScatterChart>
            <CartesianGrid strokeDasharray="3 3" />
            <XAxis dataKey="orders" name="Orders" />
            <YAxis dataKey="value" name="Value" />
            <Tooltip cursor={{ strokeDasharray: '3 3' }} />
            <Scatter data={cityWise} fill="#be123c" />
          </ScatterChart>
        </ResponsiveContainer>
      </Card>

      <Card title="Calendar Heatmap">
        <div className="grid h-full min-w-0 grid-cols-6 gap-1 sm:grid-cols-12">
          {monthly.slice(-36).map((item, index) => (
            <div
              key={`${item.label}-${index}`}
              title={`${item.label}: ${item.value}`}
              className="rounded-sm bg-blue-600"
              style={{ opacity: Math.max(0.18, Math.min(1, Number(item.value || 0) / Math.max(...monthly.map((row) => Number(row.value || 1))))) }}
            />
          ))}
        </div>
      </Card>

      <Card title="Budget Gauge">
        <div className="flex h-full flex-col items-center justify-center">
          <div className="relative h-36 w-36 rounded-full border-14 border-slate-200 dark:border-slate-800 sm:h-44 sm:w-44 sm:border-18">
            <div className="absolute inset-4.5 rounded-full border-18 border-transparent border-t-emerald-500 border-r-amber-500"></div>
            <div className="absolute inset-0 flex flex-col items-center justify-center">
              <span className="text-3xl font-bold text-slate-950 dark:text-white">{Math.min(100, Math.round((overview.summary?.totalCost || 0) / Math.max(overview.summary?.totalPurchaseValue || 1, 1) * 100))}%</span>
              <span className="text-xs text-slate-500">Utilization</span>
            </div>
          </div>
        </div>
      </Card>

      <Card title="Cost Breakdown">
        <ResponsiveContainer width="100%" height="100%">
          <BarChart data={costBreakdown}>
            <CartesianGrid strokeDasharray="3 3" />
            <XAxis dataKey="label" />
            <YAxis />
            <Tooltip />
            <Bar dataKey="value" fill="#059669" />
          </BarChart>
        </ResponsiveContainer>
      </Card>
    </div>
  )
}

export default ChartPanel
