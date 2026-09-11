import { useMemo, useState } from 'react'
import { reportColumns } from '../data/reportConfig'
import { formatCurrency, formatNumber } from '../utils/formatters'

// Formats a table cell and highlights matching search text.
const renderCell = (row, column, search) => {
  const raw = row[column.key]
  const value = column.type === 'currency' ? formatCurrency(raw) : typeof raw === 'number' ? formatNumber(raw) : raw ?? '-'
  if (!search || typeof value !== 'string') return value
  const index = value.toLowerCase().indexOf(search.toLowerCase())
  if (index < 0) return value
  return (
    <>
      {value.slice(0, index)}
      <mark className="rounded bg-amber-200 px-0.5">{value.slice(index, index + search.length)}</mark>
      {value.slice(index + search.length)}
    </>
  )
}

const reportColumnPriority = {
  'purchase-requests': ['po_status', 'projectName', 'order_date'],
  'purchase-orders': ['po_status', 'order_date', 'projectName'],
  projects: ['projectName', 'grand_total', 'items', 'quantity'],
  vendors: ['vendorName', 'grand_total', 'average_rate'],
  items: ['items', 'quantity', 'average_rate'],
  costs: ['grand_total', 'total_amount', 'total_discount', 'total_gst'],
  discounts: ['total_discount', 'grand_total', 'total_amount'],
  rates: ['average_rate', 'total_amount', 'quantity'],
  quantities: ['quantity', 'items', 'average_rate'],
  'project-consumption': ['projectName', 'quantity', 'grand_total'],
  'po-number': ['po_number', 'po_status', 'order_date'],
  cities: ['city', 'state', 'grand_total'],
  users: ['po_status', 'approvedBy', 'grand_total'],
  approvals: ['po_status', 'order_date', 'grand_total'],
  financials: ['grand_total', 'total_amount', 'total_gst', 'total_discount'],
  taxes: ['total_gst', 'grand_total', 'total_amount'],
  delivery: ['order_date', 'po_status', 'projectName'],
}

const ReportTable = ({ rows = [], pagination = {}, filters, setFilters, onBulkExport, reportTitle = 'Purchase Report', reportCategory = 'Procurement', activeReport = 'purchase-orders' }) => {
  // Main paginated report table. Column visibility changes only affect the UI/export.
  const [visibleColumns, setVisibleColumns] = useState(() => reportColumns.map((column) => column.key))
  const [selectedRows, setSelectedRows] = useState([])
  const [density, setDensity] = useState('normal')

  // Recalculate visible columns only when user changes the column list.
  const columns = useMemo(() => {
    const visible = reportColumns.filter((column) => visibleColumns.includes(column.key))
    const priority = reportColumnPriority[activeReport] || []
    const rank = new Map(priority.map((key, index) => [key, index]))
    return visible.sort((left, right) => {
      if (left.key === 'po_number') return -1
      if (right.key === 'po_number') return 1
      return (rank.get(left.key) ?? 999) - (rank.get(right.key) ?? 999)
    })
  }, [activeReport, visibleColumns])

  const selectedData = rows.filter((row) => selectedRows.includes(row.id))
  const allVisibleSelected = rows.length > 0 && rows.every((row) => selectedRows.includes(row.id))
  const densityClass = density === 'compact' ? 'p-2' : density === 'comfortable' ? 'p-4' : 'p-3'

  return (
    <section className="min-w-0 rounded-lg border border-slate-200 bg-white shadow-sm dark:border-slate-800 dark:bg-slate-900">
      <div className="flex min-w-0 flex-col gap-3 border-b border-slate-200 p-3 dark:border-slate-800 lg:flex-row lg:items-center lg:justify-between sm:p-4">
        <div className="min-w-0">
          <div>
            <p className="mb-1 text-[10px] font-bold uppercase tracking-wide text-blue-600 dark:text-blue-300">{reportCategory}</p>
            <h3 className="text-sm font-bold text-slate-950 dark:text-white">{reportTitle}</h3>
            <p className="text-xs text-slate-500 dark:text-slate-400">Detailed records, sorting, search highlighting, pagination, selection, and export.</p>
          </div>
        </div>
        <div className="grid grid-cols-3 gap-2 sm:flex sm:flex-wrap lg:justify-end">
          <select value={density} onChange={(event) => setDensity(event.target.value)} className="rounded-md border border-slate-300 bg-white px-2 py-2 text-xs dark:border-slate-700 dark:bg-slate-950 dark:text-white">
            <option value="compact">Compact</option>
            <option value="normal">Normal</option>
            <option value="comfortable">Comfortable</option>
          </select>
          <details className="relative">
            <summary className="cursor-pointer rounded-md border border-slate-300 px-3 py-2 text-xs font-semibold dark:border-slate-700 dark:text-white">
              Columns
            </summary>
            <div className="absolute right-0 z-30 mt-2 grid max-h-72 w-56 gap-2 overflow-y-auto rounded-lg border border-slate-200 bg-white p-3 shadow-lg dark:border-slate-800 dark:bg-slate-950">
              {reportColumns.map((column) => (
                <label key={column.key} className="flex items-center gap-2 text-xs text-slate-700 dark:text-slate-200">
                  <input
                    type="checkbox"
                    checked={visibleColumns.includes(column.key)}
                    onChange={(event) => {
                      setVisibleColumns((current) =>
                        event.target.checked ? [...current, column.key] : current.filter((key) => key !== column.key),
                      )
                    }}
                  />
                  {column.label}
                </label>
              ))}
            </div>
          </details>
          {/* If rows are selected, export selected rows; otherwise export current page. */}
          <button onClick={() => onBulkExport(selectedData.length ? selectedData : rows, columns)} className="rounded-md bg-blue-600 px-3 py-2 text-xs font-semibold text-white hover:bg-blue-700">
            <i className="fa-solid fa-download mr-2"></i>Bulk Export
          </button>
        </div>
      </div>

      <div className="max-h-[60vh] max-w-full overflow-auto">
        <table className="min-w-190 border-separate border-spacing-0 text-left text-xs lg:min-w-260">
          <thead className="sticky top-0 z-10 bg-slate-100 text-slate-700 dark:bg-slate-950 dark:text-slate-200">
            <tr>
              <th className="sticky left-0 z-20 w-12 border-b border-slate-200 bg-slate-100 p-3 dark:border-slate-800 dark:bg-slate-950">
                <input
                  type="checkbox"
                  checked={allVisibleSelected}
                  onChange={(event) => setSelectedRows(event.target.checked ? rows.map((row) => row.id) : [])}
                />
              </th>
              {columns.map((column, index) => (
                <th
                  key={column.key}
                  className={`${index === 0 ? 'sticky left-12 z-20 bg-slate-100 dark:bg-slate-950' : ''} resize-x overflow-hidden border-b border-slate-200 p-3 font-semibold dark:border-slate-800`}
                  style={{ minWidth: column.sticky ? 140 : 112 }}
                >
                  {/* Header click updates backend sorting and reloads rows. */}
                  <button
                    onClick={() => setFilters({ sortBy: column.key, sortOrder: filters.sortOrder === 'ASC' ? 'DESC' : 'ASC' })}
                    className="flex items-center gap-2"
                  >
                    {column.label}
                    <i className="fa-solid fa-sort text-slate-400"></i>
                  </button>
                </th>
              ))}
            </tr>
          </thead>
          <tbody>
            {rows.map((row) => (
              <tr key={row.id} className="report-table-row group">
                <td className="report-sticky-cell sticky left-0 z-10 border-b border-slate-100 bg-white p-3 dark:border-slate-800 dark:bg-slate-900">
                  <input
                    type="checkbox"
                    checked={selectedRows.includes(row.id)}
                    onChange={(event) => {
                      setSelectedRows((current) => (event.target.checked ? [...current, row.id] : current.filter((id) => id !== row.id)))
                    }}
                  />
                </td>
                {columns.map((column, index) => (
                  <td
                    key={column.key}
                    className={`${index === 0 ? 'report-sticky-cell report-primary-cell sticky left-12 z-10 bg-white font-semibold text-slate-950 dark:bg-slate-900 dark:text-white' : 'text-slate-700 dark:text-slate-300'} ${column.align === 'right' ? 'text-right' : ''} border-b border-slate-100 ${densityClass} dark:border-slate-800`}
                  >
                    {renderCell(row, column, filters.search)}
                  </td>
                ))}
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      <div className="flex flex-col gap-3 border-t border-slate-200 p-3 text-xs text-slate-600 dark:border-slate-800 dark:text-slate-300 sm:flex-row sm:flex-wrap sm:items-center sm:justify-between sm:p-4">
        <span>
          Page {pagination.page || 1} of {pagination.pages || 1} | {formatNumber(pagination.total || rows.length)} records
        </span>
        <div className="flex flex-wrap items-center gap-2">
          <select value={filters.limit} onChange={(event) => setFilters({ limit: Number(event.target.value), page: 1 })} className="rounded-md border border-slate-300 bg-white px-2 py-2 dark:border-slate-700 dark:bg-slate-950">
            {[10, 25, 50, 100, 250].map((size) => <option key={size} value={size}>{size} rows</option>)}
          </select>
          <button disabled={(pagination.page || 1) <= 1} onClick={() => setFilters({ page: (pagination.page || 1) - 1 })} className="rounded-md border border-slate-300 px-3 py-2 disabled:opacity-40 dark:border-slate-700">
            <i className="fa-solid fa-chevron-left"></i>
          </button>
          <button disabled={(pagination.page || 1) >= (pagination.pages || 1)} onClick={() => setFilters({ page: (pagination.page || 1) + 1 })} className="rounded-md border border-slate-300 px-3 py-2 disabled:opacity-40 dark:border-slate-700">
            <i className="fa-solid fa-chevron-right"></i>
          </button>
        </div>
      </div>
    </section>
  )
}

export default ReportTable
