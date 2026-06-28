import { useMemo, useState } from 'react'
import { builderFields } from '../data/reportConfig'
import { exportCsv } from '../utils/exporters'

// Shared panel wrapper for templates, schedules, alerts, personalization, and timeline.
const Panel = ({ title, icon, children }) => (
  <section className="min-w-0 rounded-lg border border-slate-200 bg-white p-3 shadow-sm dark:border-slate-800 dark:bg-slate-900 sm:p-4">
    <h3 className="mb-3 flex min-w-0 items-center gap-2 text-sm font-bold text-slate-950 dark:text-white">
      <i className={`fa-solid ${icon} text-blue-600`}></i>
      {title}
    </h3>
    {children}
  </section>
)

// Backend audit action names are translated to readable text here.
const timelineLabels = {
  REPORT_OVERVIEW_VIEWED: 'Overview loaded',
  REPORT_VIEWED: 'Report opened',
  REPORT_FILTER_SAVED: 'Filter saved',
  REPORT_TEMPLATE_SAVED: 'Template saved',
  REPORT_SCHEDULE_SAVED: 'Schedule created',
  REPORT_ALERT_SAVED: 'Alert created',
  REPORT_FAVORITE_TOGGLED: 'Favorite updated',
}

const timeAgo = (value) => {
  const diff = Math.max(0, Date.now() - new Date(value).getTime())
  const minutes = Math.max(1, Math.round(diff / 60000))
  if (minutes < 60) return `${minutes} min ago`
  const hours = Math.round(minutes / 60)
  if (hours < 24) return `${hours} hr ago`
  return `${Math.round(hours / 24)} day ago`
}

// Custom Report Builder display labels mapped to actual row keys.
const fieldToColumn = {
  'PO Number': 'po_number',
  Status: 'po_status',
  Vendor: 'vendorName',
  Project: 'projectName',
  City: 'city',
  State: 'state',
  Quantity: 'quantity',
  'Average Rate': 'average_rate',
  Discount: 'total_discount',
  Tax: 'total_gst',
  'Grand Total': 'grand_total',
}

// Enterprise actions: templates, schedules, alert rules, personalization, and audit log.
const EnterprisePanels = ({
  preferences = {},
  onSaveTemplate,
  onSaveSchedule,
  onSaveAlert,
  onApplyFilter,
  onDeletePreference,
  widgets,
  setWidgets,
  rows = [],
  showAlerts = true,
  showTimeline = true,
}) => {
  const [templateName, setTemplateName] = useState('Executive Purchase Summary')
  const [selectedFields, setSelectedFields] = useState(['PO Number', 'Vendor', 'Project', 'Grand Total'])
  const [activeTemplate, setActiveTemplate] = useState(null)
  const [scheduleName, setScheduleName] = useState('Weekly Purchase Review')
  const [alertName, setAlertName] = useState('High Value PO Alert')
  const [alertMetric, setAlertMetric] = useState('grand_total')
  const [alertOperator, setAlertOperator] = useState('>')
  const [alertValue, setAlertValue] = useState(500000)
  const auditLogs = useMemo(() => preferences.auditLogs || [], [preferences.auditLogs])
  // Preview/export uses this mapping to pull selected columns out of current rows.
  const templateColumns = (activeTemplate?.columns || selectedFields).map((field) => ({
    key: fieldToColumn[field] || field,
    label: field,
  }))

  return (
    <div className="grid min-w-0 grid-cols-1 gap-4 xl:grid-cols-2 2xl:grid-cols-3">
      <Panel title="Custom Report Builder" icon="fa-table-columns">
        <input value={templateName} onChange={(event) => setTemplateName(event.target.value)} className="mb-3 h-10 w-full rounded-md border border-slate-300 px-3 text-sm dark:border-slate-700 dark:bg-slate-950 dark:text-white" />
        <div className="grid max-h-56 grid-cols-1 gap-2 overflow-auto sm:grid-cols-2">
          {builderFields.map((field) => (
            <label key={field} className="flex min-w-0 items-center gap-2 rounded-md border border-slate-200 px-2 py-2 text-xs dark:border-slate-800 dark:text-slate-200">
              <input
                type="checkbox"
                checked={selectedFields.includes(field)}
                onChange={(event) => {
                  setSelectedFields((current) => event.target.checked ? [...current, field] : current.filter((item) => item !== field))
                }}
              />
              <span className="truncate">{field}</span>
            </label>
          ))}
        </div>
        <button onClick={() => onSaveTemplate({ name: templateName, columns: selectedFields, grouping: ['Project'], aggregations: ['SUM', 'AVG'] })} className="mt-3 w-full rounded-md bg-slate-900 px-3 py-2 text-xs font-semibold text-white hover:bg-blue-700">
          Save Template
        </button>
        <div className="mt-3 space-y-2 text-xs text-slate-600 dark:text-slate-300">
          {(preferences.templates || []).length === 0 && <p>No templates saved yet.</p>}
          {(preferences.templates || []).slice(0, 4).map((item) => (
            <div key={item.id} className="rounded-md bg-slate-50 p-2 dark:bg-slate-950">
              <p className="truncate font-semibold">{item.name}</p>
              <p className="truncate">{(item.columns || []).join(', ')}</p>
              <div className="mt-2 flex gap-2">
                <button onClick={() => setActiveTemplate(item)} className="rounded bg-blue-600 px-2 py-1 text-[11px] font-semibold text-white">Use</button>
                <button onClick={() => exportCsv(rows, (item.columns || []).map((field) => ({ key: fieldToColumn[field] || field, label: field })), item.name)} className="rounded border border-slate-300 px-2 py-1 text-[11px] font-semibold dark:border-slate-700">Export</button>
                <button onClick={() => onDeletePreference('templates', item.id)} className="rounded border border-red-300 px-2 py-1 text-[11px] font-semibold text-red-700">Delete</button>
              </div>
            </div>
          ))}
        </div>
        {activeTemplate && (
          <div className="mt-3 max-h-48 overflow-auto rounded-md border border-slate-200 dark:border-slate-800">
            <table className="min-w-130 text-left text-[11px]">
              <thead className="bg-slate-100 dark:bg-slate-950">
                <tr>{templateColumns.map((column) => <th key={column.key} className="p-2">{column.label}</th>)}</tr>
              </thead>
              <tbody>
                {rows.slice(0, 8).map((row, index) => (
                  <tr key={index}>
                    {templateColumns.map((column) => <td key={column.key} className="border-t border-slate-100 p-2 dark:border-slate-800">{row[column.key] ?? '-'}</td>)}
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </Panel>

      <Panel title="Scheduled Reports" icon="fa-calendar-check">
        <input value={scheduleName} onChange={(event) => setScheduleName(event.target.value)} className="mb-2 h-10 w-full rounded-md border border-slate-300 px-3 text-sm dark:border-slate-700 dark:bg-slate-950 dark:text-white" />
        <div className="grid grid-cols-1 gap-2 text-xs sm:grid-cols-2">
          {['daily', 'weekly', 'monthly', 'quarterly'].map((frequency) => (
            <button key={frequency} onClick={() => onSaveSchedule({ name: scheduleName, frequency, recipients: ['finance@company.local'], export_format: 'pdf' })} className="rounded-md border border-slate-300 px-3 py-2 font-semibold capitalize hover:bg-slate-100 dark:border-slate-700 dark:text-white dark:hover:bg-slate-800">
              {frequency}
            </button>
          ))}
        </div>
        <div className="mt-3 space-y-2 text-xs text-slate-600 dark:text-slate-300">
          {(preferences.schedules || []).length === 0 && <p>No scheduled reports yet.</p>}
          {(preferences.schedules || []).slice(0, 4).map((item) => (
            <div key={item.id} className="rounded-md bg-slate-50 p-2 dark:bg-slate-950">
              <p className="truncate font-semibold">{item.name}</p>
              <p className="truncate capitalize">{item.frequency} | {item.exportFormat || item.export_format || 'pdf'}</p>
              <div className="mt-2 flex gap-2">
                {/* Run Now exports immediately. Real email/cron dispatch can be added in backend later. */}
                <button onClick={() => exportCsv(rows, [{ key: 'po_number', label: 'PO Number' }, { key: 'vendorName', label: 'Vendor' }, { key: 'projectName', label: 'Project' }, { key: 'grand_total', label: 'Grand Total' }], item.name)} className="rounded bg-blue-600 px-2 py-1 text-[11px] font-semibold text-white">Run Now</button>
                <button onClick={() => onDeletePreference('schedules', item.id)} className="rounded border border-red-300 px-2 py-1 text-[11px] font-semibold text-red-700">Delete</button>
              </div>
            </div>
          ))}
        </div>
      </Panel>

      {showAlerts && <Panel title="Threshold Alerts" icon="fa-bell">
        <input value={alertName} onChange={(event) => setAlertName(event.target.value)} className="mb-2 h-10 w-full rounded-md border border-slate-300 px-3 text-sm dark:border-slate-700 dark:bg-slate-950 dark:text-white" />
        <div className="mb-2 grid grid-cols-1 gap-2 sm:grid-cols-3">
          <select value={alertMetric} onChange={(event) => setAlertMetric(event.target.value)} className="h-10 rounded-md border border-slate-300 px-2 text-xs dark:border-slate-700 dark:bg-slate-950 dark:text-white">
            <option value="grand_total">Grand Total</option>
            <option value="quantity">Quantity</option>
            <option value="averageRate">Average Rate</option>
            <option value="total_gst">GST</option>
            <option value="total_discount">Discount</option>
          </select>
          <select value={alertOperator} onChange={(event) => setAlertOperator(event.target.value)} className="h-10 rounded-md border border-slate-300 px-2 text-xs dark:border-slate-700 dark:bg-slate-950 dark:text-white">
            {['>', '>=', '<', '<=', '='].map((operator) => <option key={operator} value={operator}>{operator}</option>)}
          </select>
          <input type="number" value={alertValue} onChange={(event) => setAlertValue(event.target.value)} className="h-10 rounded-md border border-slate-300 px-2 text-xs dark:border-slate-700 dark:bg-slate-950 dark:text-white" />
        </div>
        {/* Alerts are evaluated in Backend/controller/purchaseOrderController.js during PO creation. */}
        <button onClick={() => onSaveAlert({ name: alertName, metric: alertMetric, operator: alertOperator, threshold_value: Number(alertValue), severity: Number(alertValue) > 500000 ? 'high' : 'medium' })} className="w-full rounded-md bg-red-600 px-3 py-2 text-xs font-semibold text-white hover:bg-red-700">
          Create Alert
        </button>
        <div className="mt-3 space-y-2 text-xs text-slate-600 dark:text-slate-300">
          {(preferences.alerts || []).length === 0 && <p>No alerts created yet.</p>}
          {(preferences.alerts || []).slice(0, 4).map((item) => (
            <div key={item.id} className="rounded-md bg-slate-50 p-2 dark:bg-slate-950">
              <p className="truncate font-semibold">{item.name}</p>
              <p className="truncate">{item.metric} {item.operator} {item.thresholdValue || item.threshold_value}</p>
              <button onClick={() => onDeletePreference('alerts', item.id)} className="mt-2 rounded border border-red-300 px-2 py-1 text-[11px] font-semibold text-red-700">Delete Alert</button>
            </div>
          ))}
        </div>
      </Panel>}

      <Panel title="Saved Filters" icon="fa-filter">
        <div className="space-y-2 text-xs text-slate-600 dark:text-slate-300">
          {(preferences.savedFilters || []).length === 0 && <p>No saved filters yet.</p>}
          {(preferences.savedFilters || []).slice(0, 6).map((item) => (
            <button key={item.id} onClick={() => onApplyFilter(item.filters)} className="w-full rounded-md bg-slate-50 p-2 text-left hover:bg-blue-50 hover:text-blue-700 dark:bg-slate-950 dark:hover:bg-slate-800">
              <span className="block truncate font-semibold">{item.name}</span>
              <span className="block truncate text-[11px] opacity-70">{item.reportId || 'All reports'}</span>
            </button>
          ))}
        </div>
      </Panel>

      <Panel title="Dashboard Personalization" icon="fa-sliders">
        <div className="grid grid-cols-1 gap-2 text-xs sm:grid-cols-2">
          {['KPI cards', 'Charts', 'Insights', 'Tables', 'Alerts', 'Timeline'].map((item) => (
            <label key={item} className="flex min-w-0 items-center gap-2 rounded-md border border-slate-200 px-2 py-2 dark:border-slate-800 dark:text-slate-200">
              <input
                type="checkbox"
                checked={Boolean(widgets?.[item])}
                onChange={(event) => setWidgets((current) => ({ ...current, [item]: event.target.checked }))}
              />
              <span className="truncate">{item}</span>
            </label>
          ))}
        </div>
      </Panel>

      {showTimeline && <Panel title="Activity Timeline" icon="fa-timeline">
        <ol className="space-y-3 text-xs text-slate-600 dark:text-slate-300">
          {auditLogs.length === 0 && <li>No report activity yet.</li>}
          {auditLogs.slice(0, 8).map((item) => (
            <li key={item.id} className="flex gap-2">
              <span className="mt-1 h-2 w-2 rounded-full bg-blue-600"></span>
              <span>
                <span className="font-semibold">{timelineLabels[item.action] || item.action}</span>
                <span className="block opacity-70">{timeAgo(item.createdAt)}</span>
              </span>
            </li>
          ))}
        </ol>
      </Panel>}
    </div>
  )
}

export default EnterprisePanels