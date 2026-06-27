import { useMemo, useState } from 'react'
import {
  Bar,
  BarChart,
  CartesianGrid,
  Legend,
  Line,
  ResponsiveContainer,
  Tooltip,
  XAxis,
  YAxis,
  ComposedChart,
} from 'recharts'
import { formatCurrency, formatNumber } from '../utils/formatters'

const pickRows = (rows = [], key, value) => (!value ? rows : rows.filter((row) => row[key] === value))

const DataTable = ({ title, rows = [], columns = [] }) => (
  <section className="min-w-0 rounded-lg border border-slate-200 bg-white p-3 shadow-sm dark:border-slate-800 dark:bg-slate-900">
    <div className="mb-3 flex items-center justify-between gap-3">
      <h3 className="text-sm font-bold text-slate-950 dark:text-white">{title}</h3>
      <span className="rounded-full bg-slate-100 px-2 py-1 text-[11px] font-semibold text-slate-600 dark:bg-slate-800 dark:text-slate-300">{rows.length} rows</span>
    </div>
    <div className="max-h-80 overflow-auto">
      <table className="min-w-190 w-full border-separate border-spacing-0 text-left text-xs">
        <thead className="sticky top-0 bg-slate-100 text-slate-700 dark:bg-slate-950 dark:text-slate-200">
          <tr>
            {columns.map((column) => (
              <th key={column.key} className={`border-b border-slate-200 p-2 font-semibold dark:border-slate-800 ${column.align === 'right' ? 'text-right' : ''}`}>
                {column.label}
              </th>
            ))}
          </tr>
        </thead>
        <tbody>
          {rows.slice(0, 100).map((row, index) => (
            <tr key={`${title}-${index}`} className="hover:bg-blue-50 dark:hover:bg-slate-800">
              {columns.map((column) => {
                const raw = row[column.key]
                const value = column.type === 'currency' ? formatCurrency(raw) : column.type === 'number' ? formatNumber(raw) : raw ?? '-'
                return (
                  <td key={column.key} className={`border-b border-slate-100 p-2 dark:border-slate-800 ${column.align === 'right' ? 'text-right' : ''}`}>
                    {value}
                  </td>
                )
              })}
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  </section>
)

const Select = ({ label, value, onChange, options }) => (
  <label className="flex min-w-0 flex-col gap-1 text-xs font-semibold text-slate-600 dark:text-slate-300">
    {label}
    <select value={value} onChange={(event) => onChange(event.target.value)} className="h-10 rounded-md border border-slate-300 bg-white px-3 text-sm dark:border-slate-700 dark:bg-slate-950 dark:text-white">
      <option value="">All</option>
      {options.map((option) => <option key={option} value={option}>{option}</option>)}
    </select>
  </label>
)

const ChartCard = ({ title, data, children }) => (
  <section className="min-w-0 rounded-lg border border-slate-200 bg-white p-3 shadow-sm dark:border-slate-800 dark:bg-slate-900">
    <h3 className="mb-3 text-sm font-bold text-slate-950 dark:text-white">{title}</h3>
    <div className="h-72 min-w-0">
      {data?.length ? children : <div className="flex h-full items-center justify-center text-xs text-slate-500">No data for selected filter</div>}
    </div>
  </section>
)

const ReportWorkspace = ({ activeReport, analytics = {}, setFilters }) => {
  const charts = analytics.charts || {}
  const [selectedItem, setSelectedItem] = useState('')
  const [selectedVendor, setSelectedVendor] = useState('')
  const [selectedProject, setSelectedProject] = useState('')

  const itemOptions = useMemo(() => [...new Set((charts.itemVendorRates || []).map((row) => row.item).filter(Boolean))], [charts.itemVendorRates])
  const vendorOptions = useMemo(() => [...new Set((charts.vendorProjectAssignments || []).map((row) => row.vendor).filter(Boolean))], [charts.vendorProjectAssignments])
  const projectOptions = useMemo(() => [...new Set((charts.projectItemDetails || []).map((row) => row.project).filter(Boolean))], [charts.projectItemDetails])

  const itemVendorRows = pickRows(charts.itemVendorRates || [], 'item', selectedItem)
  const itemProjectRows = pickRows(charts.itemProjectRates || [], 'item', selectedItem)
  const projectItemRows = pickRows(charts.projectItemDetails || [], 'project', selectedProject)
  const vendorProjectRows = pickRows(charts.vendorProjectAssignments || [], 'vendor', selectedVendor)
  const recommendationRows = pickRows(charts.vendorRecommendations || [], 'item', selectedItem)
  const bestRecommendation = recommendationRows[0]

  const commonRateColumns = [
    { key: 'item', label: 'Item' },
    { key: 'vendor', label: 'Vendor' },
    { key: 'project', label: 'Project' },
    { key: 'lowestRate', label: 'Lowest Rate', align: 'right', type: 'currency' },
    { key: 'averageRate', label: 'Average Rate', align: 'right', type: 'currency' },
    { key: 'highestRate', label: 'Highest Rate', align: 'right', type: 'currency' },
    { key: 'quantity', label: 'Quantity', align: 'right', type: 'number' },
    { key: 'value', label: 'Cost', align: 'right', type: 'currency' },
    { key: 'orders', label: 'POs', align: 'right', type: 'number' },
  ]

  if (activeReport === 'projects') {
    return (
      <div className="space-y-4">
        <div className="grid grid-cols-1 gap-3 md:grid-cols-3">
          <Select label="Select Project" value={selectedProject} onChange={setSelectedProject} options={projectOptions} />
          <button onClick={() => setFilters({ project: selectedProject })} className="self-end rounded-md bg-blue-600 px-3 py-2 text-xs font-semibold text-white">Apply Project Filter</button>
        </div>
        <ChartCard title="Project Spend and PO Comparison" data={charts.projectWise}>
          <ResponsiveContainer width="100%" height="100%">
            <ComposedChart data={charts.projectWise || []}>
              <CartesianGrid strokeDasharray="3 3" />
              <XAxis dataKey="label" />
              <YAxis />
              <Tooltip />
              <Legend />
              <Bar dataKey="value" fill="#2563eb" name="Cost" />
              <Line dataKey="orders" stroke="#059669" name="PO Count" />
            </ComposedChart>
          </ResponsiveContainer>
        </ChartCard>
        <DataTable title="Project Item Frequency and Cost" rows={projectItemRows.length ? projectItemRows : charts.projectItemDetails || []} columns={[
          { key: 'project', label: 'Project' },
          { key: 'item', label: 'Item' },
          { key: 'orders', label: 'Times Purchased', align: 'right', type: 'number' },
          { key: 'quantity', label: 'Quantity', align: 'right', type: 'number' },
          { key: 'averageRate', label: 'Average Rate', align: 'right', type: 'currency' },
          { key: 'value', label: 'Total Cost', align: 'right', type: 'currency' },
        ]} />
      </div>
    )
  }

  if (activeReport === 'vendors' || activeReport === 'vendor-price-comparison') {
    return (
      <div className="space-y-4">
        <div className="grid grid-cols-1 gap-3 md:grid-cols-3">
          <Select label="Select Vendor" value={selectedVendor} onChange={setSelectedVendor} options={vendorOptions} />
          <Select label="Select Item" value={selectedItem} onChange={setSelectedItem} options={itemOptions} />
          <button onClick={() => setFilters({ vendor: selectedVendor, item: selectedItem })} className="self-end rounded-md bg-blue-600 px-3 py-2 text-xs font-semibold text-white">Apply Selection</button>
        </div>
        {bestRecommendation && (
          <div className="rounded-lg border border-emerald-200 bg-emerald-50 p-4 text-sm text-emerald-900 dark:border-emerald-900 dark:bg-emerald-950/40 dark:text-emerald-200">
            <p className="font-bold">Best vendor for {bestRecommendation.item}: {bestRecommendation.vendor}</p>
            <p className="mt-1">Average rate {formatCurrency(bestRecommendation.averageRate)} across {bestRecommendation.orders} POs. Recommendation: {bestRecommendation.recommendation}.</p>
          </div>
        )}
        <DataTable title="Vendor Item Rate Comparison" rows={selectedItem ? recommendationRows : charts.vendorRecommendations || []} columns={[
          { key: 'item', label: 'Item' },
          { key: 'vendor', label: 'Vendor' },
          { key: 'averageRate', label: 'Average Rate', align: 'right', type: 'currency' },
          { key: 'lowestRate', label: 'Lowest Rate', align: 'right', type: 'currency' },
          { key: 'highestRate', label: 'Highest Rate', align: 'right', type: 'currency' },
          { key: 'orders', label: 'POs', align: 'right', type: 'number' },
          { key: 'projects', label: 'Projects', align: 'right', type: 'number' },
          { key: 'recommendation', label: 'Recommendation' },
        ]} />
        <DataTable title="Projects Assigned to Selected Vendor" rows={vendorProjectRows.length ? vendorProjectRows : charts.vendorProjectAssignments || []} columns={[
          { key: 'vendor', label: 'Vendor' },
          { key: 'project', label: 'Project' },
          { key: 'orders', label: 'POs', align: 'right', type: 'number' },
          { key: 'quantity', label: 'Quantity', align: 'right', type: 'number' },
          { key: 'averageRate', label: 'Average Rate', align: 'right', type: 'currency' },
          { key: 'value', label: 'Value', align: 'right', type: 'currency' },
        ]} />
      </div>
    )
  }

  if (activeReport === 'items' || activeReport === 'rates' || activeReport === 'quantities') {
    return (
      <div className="space-y-4">
        <div className="grid grid-cols-1 gap-3 md:grid-cols-3">
          <Select label="Select Item" value={selectedItem} onChange={setSelectedItem} options={itemOptions} />
          <button onClick={() => setFilters({ item: selectedItem })} className="self-end rounded-md bg-blue-600 px-3 py-2 text-xs font-semibold text-white">Apply Item Filter</button>
        </div>
        <ChartCard title="Same Item Rate by Vendor" data={itemVendorRows}>
          <ResponsiveContainer width="100%" height="100%">
            <BarChart data={itemVendorRows}>
              <CartesianGrid strokeDasharray="3 3" />
              <XAxis dataKey="vendor" />
              <YAxis />
              <Tooltip />
              <Legend />
              <Bar dataKey="averageRate" fill="#2563eb" name="Average Rate" />
              <Bar dataKey="lowestRate" fill="#059669" name="Lowest Rate" />
              <Bar dataKey="highestRate" fill="#dc2626" name="Highest Rate" />
            </BarChart>
          </ResponsiveContainer>
        </ChartCard>
        <DataTable title="Item Rate Comparison by Vendor" rows={itemVendorRows.length ? itemVendorRows : charts.itemVendorRates || []} columns={commonRateColumns.filter((column) => column.key !== 'project')} />
        <DataTable title="Item Rate and Quantity by Project" rows={itemProjectRows.length ? itemProjectRows : charts.itemProjectRates || []} columns={commonRateColumns.filter((column) => column.key !== 'vendor')} />
      </div>
    )
  }

  if (activeReport === 'costs' || activeReport === 'financials') {
    return (
      <div className="space-y-4">
        <ChartCard title="Monthly Cost Breakdown" data={charts.costByMonth}>
          <ResponsiveContainer width="100%" height="100%">
            <ComposedChart data={charts.costByMonth || []}>
              <CartesianGrid strokeDasharray="3 3" />
              <XAxis dataKey="label" />
              <YAxis />
              <Tooltip />
              <Legend />
              <Bar dataKey="grandTotal" fill="#2563eb" name="Grand Total" />
              <Bar dataKey="tax" fill="#f59e0b" name="Tax" />
              <Line dataKey="discount" stroke="#059669" name="Discount" />
            </ComposedChart>
          </ResponsiveContainer>
        </ChartCard>
        <div className="grid grid-cols-1 gap-4 xl:grid-cols-2">
          <DataTable title="Cost by Project" rows={charts.costByProject || []} columns={[
            { key: 'label', label: 'Project' },
            { key: 'orders', label: 'POs', align: 'right', type: 'number' },
            { key: 'grandTotal', label: 'Grand Total', align: 'right', type: 'currency' },
            { key: 'discount', label: 'Discount', align: 'right', type: 'currency' },
            { key: 'tax', label: 'Tax', align: 'right', type: 'currency' },
          ]} />
          <DataTable title="Cost by Vendor" rows={charts.costByVendor || []} columns={[
            { key: 'label', label: 'Vendor' },
            { key: 'orders', label: 'POs', align: 'right', type: 'number' },
            { key: 'grandTotal', label: 'Grand Total', align: 'right', type: 'currency' },
            { key: 'discount', label: 'Discount', align: 'right', type: 'currency' },
            { key: 'tax', label: 'Tax', align: 'right', type: 'currency' },
          ]} />
        </div>
      </div>
    )
  }

  return (
    <div className="space-y-4">
      <DataTable title="Vendor Share Detail" rows={charts.vendorShareDetails || []} columns={[
        { key: 'vendor', label: 'Vendor' },
        { key: 'orders', label: 'POs', align: 'right', type: 'number' },
        { key: 'projects', label: 'Projects', align: 'right', type: 'number' },
        { key: 'items', label: 'Items', align: 'right', type: 'number' },
        { key: 'quantity', label: 'Quantity', align: 'right', type: 'number' },
        { key: 'averageRate', label: 'Average Rate', align: 'right', type: 'currency' },
        { key: 'grandTotal', label: 'Share Value', align: 'right', type: 'currency' },
      ]} />
      <DataTable title="City Detail" rows={charts.cityDetails || []} columns={[
        { key: 'label', label: 'City' },
        { key: 'projects', label: 'Projects', align: 'right', type: 'number' },
        { key: 'orders', label: 'POs', align: 'right', type: 'number' },
        { key: 'quantity', label: 'Quantity', align: 'right', type: 'number' },
        { key: 'averageRate', label: 'Avg Rate', align: 'right', type: 'currency' },
        { key: 'cost', label: 'Cost', align: 'right', type: 'currency' },
      ]} />
    </div>
  )
}

export default ReportWorkspace
