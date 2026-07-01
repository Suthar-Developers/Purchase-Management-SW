import { useState } from 'react'
import { builderFields } from '../data/reportConfig'

const Panel = ({ title, icon, children }) => (
  <section className="min-w-0 rounded-lg border border-slate-200 bg-white p-3 shadow-sm dark:border-slate-800 dark:bg-slate-900 sm:p-4">
    <h3 className="mb-3 flex min-w-0 items-center gap-2 text-sm font-bold text-slate-950 dark:text-white">
      <i className={`fa-solid ${icon} text-blue-600`}></i>
      {title}
    </h3>
    {children}
  </section>
)

const EnterprisePanels = ({ preferences = {}, onSaveTemplate, onSaveSchedule, onSaveAlert }) => {
  const [templateName, setTemplateName] = useState('Executive Purchase Summary')
  const [selectedFields, setSelectedFields] = useState(['PO Number', 'Vendor', 'Project', 'Grand Total'])
  const [scheduleName, setScheduleName] = useState('Weekly Purchase Review')
  const [alertName, setAlertName] = useState('High Value PO Alert')

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
          {(preferences.schedules || []).slice(0, 4).map((item) => (
            <div key={item.id} className="truncate rounded-md bg-slate-50 p-2 dark:bg-slate-950">{item.name} | {item.frequency}</div>
          ))}
        </div>
      </Panel>

      <Panel title="Threshold Alerts" icon="fa-bell">
        <input value={alertName} onChange={(event) => setAlertName(event.target.value)} className="mb-2 h-10 w-full rounded-md border border-slate-300 px-3 text-sm dark:border-slate-700 dark:bg-slate-950 dark:text-white" />
        <button onClick={() => onSaveAlert({ name: alertName, metric: 'grand_total', operator: '>', threshold_value: 500000, severity: 'high' })} className="w-full rounded-md bg-red-600 px-3 py-2 text-xs font-semibold text-white hover:bg-red-700">
          Create Budget Alert
        </button>
        <div className="mt-3 space-y-2 text-xs text-slate-600 dark:text-slate-300">
          {(preferences.alerts || []).slice(0, 4).map((item) => (
            <div key={item.id} className="truncate rounded-md bg-slate-50 p-2 dark:bg-slate-950">{item.name} | {item.metric} {item.operator} {item.threshold_value}</div>
          ))}
        </div>
      </Panel>

      <Panel title="Saved Filters" icon="fa-filter">
        <div className="space-y-2 text-xs text-slate-600 dark:text-slate-300">
          {(preferences.savedFilters || []).length === 0 && <p>No saved filters yet.</p>}
          {(preferences.savedFilters || []).slice(0, 6).map((item) => (
            <div key={item.id} className="truncate rounded-md bg-slate-50 p-2 dark:bg-slate-950">{item.name}</div>
          ))}
        </div>
      </Panel>

      <Panel title="Dashboard Personalization" icon="fa-sliders">
        <div className="grid grid-cols-1 gap-2 text-xs sm:grid-cols-2">
          {['KPI cards', 'Charts', 'Insights', 'Tables', 'Alerts', 'Timeline'].map((item) => (
            <label key={item} className="flex min-w-0 items-center gap-2 rounded-md border border-slate-200 px-2 py-2 dark:border-slate-800 dark:text-slate-200">
              <input type="checkbox" defaultChecked />
              <span className="truncate">{item}</span>
            </label>
          ))}
        </div>
      </Panel>

      <Panel title="Activity Timeline" icon="fa-timeline">
        <ol className="space-y-3 text-xs text-slate-600 dark:text-slate-300">
          {['Report viewed', 'Filters refreshed', 'Insight generated', 'Export ready'].map((item, index) => (
            <li key={item} className="flex gap-2">
              <span className="mt-1 h-2 w-2 rounded-full bg-blue-600"></span>
              <span>{item} {index + 1} min ago</span>
            </li>
          ))}
        </ol>
      </Panel>
    </div>
  )
}

export default EnterprisePanels
