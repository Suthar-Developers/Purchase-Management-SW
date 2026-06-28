import {
  Area,
  AreaChart,
  Bar,
  BarChart,
  CartesianGrid,
  Cell,
  ComposedChart,
  Legend,
  Line,
  LineChart,
  Pie,
  PieChart,
  ResponsiveContainer,
  Tooltip,
  XAxis,
  YAxis,
} from 'recharts'

const colors = ['#2563eb', '#059669', '#f59e0b', '#dc2626', '#7c3aed', '#0891b2', '#be123c', '#65a30d']

// Reusable chart card. Fixed height is important because Recharts needs dimensions.
const Card = ({ title, children, className = '' }) => (
  <section className={`min-w-0 rounded-lg border border-slate-200 bg-white p-3 shadow-sm dark:border-slate-800 dark:bg-slate-900 sm:p-4 ${className}`}>
    <h3 className="mb-3 text-sm font-bold text-slate-950 dark:text-white">{title}</h3>
    <div className="h-60 min-w-0 sm:h-72">{children}</div>
  </section>
)

const safeData = (data = []) => (data.length ? data : [{ label: 'No Data', value: 0 }])

// Shared visual dashboard. Report-specific selectors/tables live in ReportWorkspace.
const ChartPanel = ({ analytics = {}, overview = {} }) => {
  const charts = analytics.charts || {}
  const monthly = safeData(charts.monthly)
  const vendorWise = safeData(charts.vendorWise)
  const projectWise = safeData(charts.projectWise)
  const itemRates = safeData(charts.itemRates)
  const costBreakdown = safeData(charts.costBreakdown)
  const rateByVendor = safeData(charts.rateByVendor)
  const rateByProject = safeData(charts.rateByProject)
  const quantityByProject = safeData(charts.quantityByProject)
  const quantityByVendor = safeData(charts.quantityByVendor)
  const vendorProjectAssignments = safeData(charts.vendorProjectAssignments)
  const cityDetails = safeData(charts.cityDetails)
  const calendarActivity = safeData(charts.calendarActivity)
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
          <BarChart data={vendorWise} layout="vertical" margin={{ left: 24, right: 8 }}>
            <CartesianGrid strokeDasharray="3 3" />
            <XAxis type="number" />
            <YAxis dataKey="label" type="category" width={100} />
            <Tooltip />
            <Legend />
            <Bar dataKey="value" fill="#2563eb" name="Purchase Value" />
            <Bar dataKey="orders" fill="#059669" name="PO Count" />
          </BarChart>
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

      <Card title="Item Rate History">
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

      <Card title="Vendor Rate Comparison">
        <ResponsiveContainer width="100%" height="100%">
          <ComposedChart data={rateByVendor} margin={{ left: 8, right: 8 }}>
            <CartesianGrid strokeDasharray="3 3" />
            <XAxis dataKey="label" hide />
            <YAxis />
            <Tooltip />
            <Legend />
            <Bar dataKey="lowestRate" fill="#059669" name="Lowest Rate" />
            <Bar dataKey="highestRate" fill="#dc2626" name="Highest Rate" />
            <Line dataKey="averageRate" stroke="#2563eb" name="Average Rate" />
          </ComposedChart>
        </ResponsiveContainer>
      </Card>

      <Card title="Project Rate Comparison">
        <ResponsiveContainer width="100%" height="100%">
          <BarChart data={rateByProject} layout="vertical" margin={{ left: 24, right: 8 }}>
            <CartesianGrid strokeDasharray="3 3" />
            <XAxis type="number" />
            <YAxis dataKey="label" type="category" width={100} />
            <Tooltip />
            <Legend />
            <Bar dataKey="lowestRate" fill="#059669" name="Lowest" />
            <Bar dataKey="averageRate" fill="#2563eb" name="Average" />
            <Bar dataKey="highestRate" fill="#dc2626" name="Highest" />
          </BarChart>
        </ResponsiveContainer>
      </Card>

      <Card title="Quantity by Project">
        <ResponsiveContainer width="100%" height="100%">
          <BarChart data={quantityByProject} layout="vertical" margin={{ left: 24, right: 8 }}>
            <CartesianGrid strokeDasharray="3 3" />
            <XAxis type="number" />
            <YAxis dataKey="label" type="category" width={100} />
            <Tooltip />
            <Bar dataKey="quantity" fill="#0891b2" name="Quantity" />
          </BarChart>
        </ResponsiveContainer>
      </Card>

      <Card title="Quantity by Vendor">
        <ResponsiveContainer width="100%" height="100%">
          <BarChart data={quantityByVendor} layout="vertical" margin={{ left: 24, right: 8 }}>
            <CartesianGrid strokeDasharray="3 3" />
            <XAxis type="number" />
            <YAxis dataKey="label" type="category" width={100} />
            <Tooltip />
            <Bar dataKey="quantity" fill="#7c3aed" name="Quantity" />
          </BarChart>
        </ResponsiveContainer>
      </Card>

      <Card title="Vendor Recommendation Matrix">
        <ResponsiveContainer width="100%" height="100%">
          <ComposedChart data={rateByVendor.slice(0, 12)}>
            <CartesianGrid strokeDasharray="3 3" />
            <XAxis dataKey="label" hide />
            <YAxis />
            <Tooltip />
            <Legend />
            <Bar dataKey="orders" fill="#2563eb" name="PO Count" />
            <Bar dataKey="projects" fill="#f59e0b" name="Projects Assigned" />
            <Line dataKey="averageRate" stroke="#dc2626" name="Average Rate" />
          </ComposedChart>
        </ResponsiveContainer>
      </Card>

      <Card title="Vendor Project Assignment">
        <ResponsiveContainer width="100%" height="100%">
          <BarChart data={vendorProjectAssignments.slice(0, 15)} layout="vertical" margin={{ left: 24, right: 8 }}>
            <CartesianGrid strokeDasharray="3 3" />
            <XAxis type="number" />
            <YAxis dataKey="vendor" type="category" width={100} />
            <Tooltip />
            <Legend />
            <Bar dataKey="orders" fill="#059669" name="Orders" />
            <Bar dataKey="quantity" fill="#0891b2" name="Quantity" />
          </BarChart>
        </ResponsiveContainer>
      </Card>

      <Card title="City Purchase Detail">
        <ResponsiveContainer width="100%" height="100%">
          <ComposedChart data={cityDetails}>
            <CartesianGrid strokeDasharray="3 3" />
            <XAxis dataKey="label" />
            <YAxis />
            <Tooltip />
            <Legend />
            <Bar dataKey="projects" fill="#2563eb" name="Projects" />
            <Bar dataKey="orders" fill="#059669" name="POs" />
            <Line dataKey="averageRate" stroke="#dc2626" name="Avg Rate" />
          </ComposedChart>
        </ResponsiveContainer>
      </Card>

      <Card title="City Cost and Quantity">
        <ResponsiveContainer width="100%" height="100%">
          <ComposedChart data={cityDetails}>
            <CartesianGrid strokeDasharray="3 3" />
            <XAxis dataKey="label" />
            <YAxis />
            <Tooltip />
            <Legend />
            <Bar dataKey="cost" fill="#7c3aed" name="Cost" />
            <Line dataKey="quantity" stroke="#0891b2" name="Quantity" />
          </ComposedChart>
        </ResponsiveContainer>
      </Card>

      {/* Each square is a purchase date; the number is PO count for that day. */}
      <Card title="Purchase Activity Calendar">
        <div className="grid h-full min-w-0 grid-cols-7 gap-1 overflow-hidden">
          {calendarActivity.slice(0, 84).reverse().map((item, index) => (
            <div
              key={`${item.label}-${index}`}
              title={`${item.label}: ${item.orders} POs, Qty ${item.quantity}, Value ${item.value}`}
              className="flex min-h-8 items-center justify-center rounded-sm bg-blue-600 text-[10px] font-semibold text-white"
              style={{ opacity: Math.max(0.16, Math.min(1, Number(item.orders || 0) / Math.max(...calendarActivity.map((row) => Number(row.orders || 1))))) }}
            >
              {item.orders || ''}
            </div>
          ))}
        </div>
      </Card>

      <Card title="Budget Gauge">
        <div className="flex h-full flex-col items-center justify-center">
          <div className="relative h-36 w-36 rounded-full border-14 border-slate-200 dark:border-slate-800 sm:h-44 sm:w-44 sm:border-18">
            <div className="absolute -inset-4.5 rounded-full border-18 border-transparent border-t-emerald-500 border-r-amber-500"></div>
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
