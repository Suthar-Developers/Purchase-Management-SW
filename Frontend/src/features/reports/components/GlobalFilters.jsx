import { datePresets } from '../data/reportConfig'

// Generic select used by all report filters.
// Multi-select values are stored as comma-separated strings for query params.
const Select = ({ label, value, onChange, options = [], multiple = false }) => (
  <label className="flex min-w-0 flex-1 flex-col gap-1 text-xs font-medium text-slate-600 dark:text-slate-300">
    {label}
    <select
      multiple={multiple}
      value={multiple ? (value ? String(value).split(',') : []) : value}
      onChange={(event) => {
        if (multiple) {
          onChange(Array.from(event.target.selectedOptions).map((option) => option.value).join(','))
        } else {
          onChange(event.target.value)
        }
      }}
      className="min-h-10 w-full rounded-md border border-slate-300 bg-white px-3 text-sm text-slate-900 outline-none transition focus:border-blue-500 focus:ring-2 focus:ring-blue-100 dark:border-slate-700 dark:bg-slate-950 dark:text-white"
    >
      <option value="">All</option>
      {options.map((option) => (
        <option key={`${option.value}-${option.label}`} value={option.value}>
          {option.label}
        </option>
      ))}
    </select>
  </label>
)

// Generic input wrapper keeps all filter controls visually consistent.
const Input = ({ label, value, onChange, type = 'text', placeholder = '' }) => (
  <label className="flex min-w-0 flex-1 flex-col gap-1 text-xs font-medium text-slate-600 dark:text-slate-300">
    {label}
    <input
      type={type}
      value={value}
      placeholder={placeholder}
      onChange={(event) => onChange(event.target.value)}
      className="h-10 w-full rounded-md border border-slate-300 bg-white px-3 text-sm text-slate-900 outline-none transition focus:border-blue-500 focus:ring-2 focus:ring-blue-100 dark:border-slate-700 dark:bg-slate-950 dark:text-white"
    />
  </label>
)

// Global filters feed every KPI, chart, workspace table, and export.
// When adding a new filter here, map it in Backend/utils/reportQueryBuilder.js.
const GlobalFilters = ({ filters, setFilters, resetFilters, options, onSaveFilter, onExportView }) => (
  <div className="sticky top-0 z-20 max-w-full rounded-lg border border-slate-200 bg-white/95 p-3 shadow-sm backdrop-blur dark:border-slate-800 dark:bg-slate-950/95">
    <div className="mb-3 flex min-w-0 flex-col gap-3 lg:flex-row lg:items-center lg:justify-between">
      <div className="min-w-0">
        <h2 className="text-sm font-bold text-slate-950 dark:text-white">Global Filters</h2>
        <p className="text-xs text-slate-500 dark:text-slate-400">Filters affect every KPI, chart, table, export, and insight.</p>
      </div>
      <div className="grid grid-cols-3 gap-2 sm:flex sm:flex-wrap lg:justify-end">
        <button onClick={onSaveFilter} className="rounded-md border border-slate-300 px-2 py-2 text-xs font-semibold text-slate-700 hover:bg-slate-100 dark:border-slate-700 dark:text-slate-200 dark:hover:bg-slate-800 sm:px-3">
          <i className="fa-solid fa-bookmark mr-2"></i>Save Filter
        </button>
        <button onClick={resetFilters} className="rounded-md border border-slate-300 px-2 py-2 text-xs font-semibold text-slate-700 hover:bg-slate-100 dark:border-slate-700 dark:text-slate-200 dark:hover:bg-slate-800 sm:px-3">
          <i className="fa-solid fa-rotate-left mr-2"></i>Reset
        </button>
        <button onClick={onExportView} className="rounded-md bg-slate-900 px-2 py-2 text-xs font-semibold text-white hover:bg-blue-700 dark:bg-blue-600 dark:hover:bg-blue-500 sm:px-3">
          <i className="fa-solid fa-file-export mr-2"></i>Export Current View
        </button>
      </div>
    </div>

    <div className="grid min-w-0 grid-cols-1 gap-3 sm:grid-cols-2 xl:grid-cols-5">
      <Select label="Date Range" value={filters.datePreset} onChange={(value) => setFilters({ datePreset: value })} options={datePresets} />
      <Input label="Start Date" type="date" value={filters.startDate} onChange={(value) => setFilters({ datePreset: 'custom', startDate: value })} />
      <Input label="End Date" type="date" value={filters.endDate} onChange={(value) => setFilters({ datePreset: 'custom', endDate: value })} />
      <Input label="Search Box" value={filters.search} placeholder="PO, vendor, item..." onChange={(value) => setFilters({ search: value })} />
      <Select label="Status" value={filters.status} onChange={(value) => setFilters({ status: value })} options={options.statuses || []} multiple />
    </div>

    <details className="mt-3">
      {/* Advanced filters are collapsed by default to keep mobile layout usable. */}
      <summary className="cursor-pointer text-xs font-semibold text-blue-700 dark:text-blue-300">Advanced Filters, Sorting, Grouping</summary>
      <div className="mt-3 grid min-w-0 grid-cols-1 gap-3 sm:grid-cols-2 xl:grid-cols-4 2xl:grid-cols-6">
        <Select label="Project" value={filters.projectId} onChange={(value) => setFilters({ projectId: value })} options={options.projects || []} multiple />
        <Select label="Vendor" value={filters.vendorId} onChange={(value) => setFilters({ vendorId: value })} options={options.vendors || []} multiple />
        <Select label="City" value={filters.city} onChange={(value) => setFilters({ city: value })} options={options.cities || []} multiple />
        <Select label="State" value={filters.state} onChange={(value) => setFilters({ state: value })} options={options.states || []} multiple />
        <Input label="Department" value={filters.department} onChange={(value) => setFilters({ department: value })} />
        <Input label="Requester" value={filters.requester} onChange={(value) => setFilters({ requester: value })} />
        <Select label="Created By" value={filters.createdBy} onChange={(value) => setFilters({ createdBy: value })} options={options.creators || []} />
        <Select label="Approved By" value={filters.approvedBy} onChange={(value) => setFilters({ approvedBy: value })} options={options.approvers || []} />
        <Input label="PO Number" value={filters.poNumber} onChange={(value) => setFilters({ poNumber: value })} />
        <Input label="Purchase Request Number" value={filters.purchaseRequestNumber} onChange={(value) => setFilters({ purchaseRequestNumber: value })} />
        <Input label="Category" value={filters.category} onChange={(value) => setFilters({ category: value })} />
        <Select label="Item" value={filters.item} onChange={(value) => setFilters({ item: value })} options={options.items || []} />
        <Select label="GST %" value={filters.gstPercent} onChange={(value) => setFilters({ gstPercent: value })} options={options.gstRates || []} />
        <Input label="Minimum Amount" type="number" value={filters.minAmount} onChange={(value) => setFilters({ minAmount: value })} />
        <Input label="Maximum Amount" type="number" value={filters.maxAmount} onChange={(value) => setFilters({ maxAmount: value })} />
        <Input label="Minimum Quantity" type="number" value={filters.minQuantity} onChange={(value) => setFilters({ minQuantity: value })} />
        <Input label="Maximum Quantity" type="number" value={filters.maxQuantity} onChange={(value) => setFilters({ maxQuantity: value })} />
        <Select label="Approval Status" value={filters.approvalStatus} onChange={(value) => setFilters({ approvalStatus: value })} options={options.statuses || []} />
        <Input label="Delivery Status" value={filters.deliveryStatus} onChange={(value) => setFilters({ deliveryStatus: value })} />
        <Input label="Material Received Status" value={filters.materialReceivedStatus} onChange={(value) => setFilters({ materialReceivedStatus: value })} />
        <Select label="Cancelled" value={filters.cancelled} onChange={(value) => setFilters({ cancelled: value })} options={[{ label: 'Yes', value: 'yes' }, { label: 'No', value: 'no' }]} />
        <Select label="Hold" value={filters.hold} onChange={(value) => setFilters({ hold: value })} options={[{ label: 'Yes', value: 'yes' }, { label: 'No', value: 'no' }]} />
        <Select label="Rejected" value={filters.rejected} onChange={(value) => setFilters({ rejected: value })} options={[{ label: 'Yes', value: 'yes' }, { label: 'No', value: 'no' }]} />
        <Select label="Sorting" value={filters.sortBy} onChange={(value) => setFilters({ sortBy: value })} options={[
          { label: 'Created Date', value: 'created_at' },
          { label: 'Order Date', value: 'order_date' },
          { label: 'Grand Total', value: 'grand_total' },
          { label: 'PO Number', value: 'po_number' },
          { label: 'Status', value: 'po_status' },
        ]} />
        <Select label="Order" value={filters.sortOrder} onChange={(value) => setFilters({ sortOrder: value })} options={[{ label: 'Descending', value: 'DESC' }, { label: 'Ascending', value: 'ASC' }]} />
        <Select label="Grouping" value={filters.groupBy} onChange={(value) => setFilters({ groupBy: value })} options={[
          { label: 'Project', value: 'project' },
          { label: 'Vendor', value: 'vendor' },
          { label: 'City', value: 'city' },
          { label: 'Status', value: 'status' },
          { label: 'Month', value: 'month' },
        ]} />
      </div>
    </details>
  </div>
)

export default GlobalFilters
