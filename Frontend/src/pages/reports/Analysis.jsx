import { useEffect, useState } from 'react'
import { Link } from 'react-router-dom'
import ChartPanel from '../../features/reports/components/ChartPanel'
import EnterprisePanels from '../../features/reports/components/EnterprisePanels'
import GlobalFilters from '../../features/reports/components/GlobalFilters'
import InsightsPanel from '../../features/reports/components/InsightsPanel'
import KpiGrid from '../../features/reports/components/KpiGrid'
import ReportModuleTabs from '../../features/reports/components/ReportModuleTabs'
import ReportTable from '../../features/reports/components/ReportTable'
import ReportWorkspace from '../../features/reports/components/ReportWorkspace'
import { ErrorState, LoadingSkeleton } from '../../features/reports/components/ReportStates'
import { useReports } from '../../features/reports/hooks/useReports'

// Analysis owns decision support; detailed rows and exports stay on Reports.
const Analysis = () => {
  const [notice, setNotice] = useState('')
  const [widgets, setWidgets] = useState(() => JSON.parse(localStorage.getItem('reportDashboardWidgets') || '{"KPI cards":true,"Charts":true,"Insights":true,"Alerts":true,"Timeline":true}'))
  const { activeReport, setActiveReport, filters, setFilters, resetFilters, modules, options, preferences, report, overview, loading, error, reload, saveFilter, saveTemplate, saveSchedule, saveAlert, toggleFavorite, deletePreference } = useReports()
  const summary = overview?.summary || report?.overview?.summary || {}
  const analytics = report?.analytics || {}
  const activeModule = modules.find((module) => module.id === activeReport)

  useEffect(() => localStorage.setItem('reportDashboardWidgets', JSON.stringify(widgets)), [widgets])
  const notify = (message) => { setNotice(message); window.setTimeout(() => setNotice(''), 2400) }
  const saveCurrentFilter = async () => {
    const name = window.prompt('Filter name', `${activeModule?.title || 'Analysis'} Filter`)
    if (!name) return
    try { await saveFilter(name); notify('Filter saved') } catch (err) { notify(err?.response?.data?.message || 'Filter could not be saved') }
  }
  const selectKpi = (key) => setFilters({ status: { approvedPO: 'Approved', pendingPO: 'Draft,Pending', rejectedPO: 'Rejected', holdPO: 'Hold' }[key] || '', sortBy: key })
  const savePreference = async (action, payload) => { try { await action(payload); notify('Saved') } catch (err) { notify(err?.response?.data?.message || 'Could not save') } }

  return <main className="min-h-full bg-slate-50 px-3 py-3 text-slate-900 dark:bg-slate-950 dark:text-white sm:px-4 lg:px-5">
    <div className="mx-auto w-full max-w-400 space-y-4">
      <header className="flex flex-col gap-4 xl:flex-row xl:items-start xl:justify-between"><div><p className="text-xs font-semibold uppercase tracking-wide text-blue-700 dark:text-blue-300">Purchase intelligence</p><h1 className="text-xl font-bold sm:text-2xl">Analysis</h1><p className="mt-1 text-sm text-slate-600 dark:text-slate-300">Understand spend, supplier performance, approvals, and purchasing trends at a glance.</p></div><Link to="/reports" className="rounded-md border border-blue-200 bg-blue-50 px-3 py-2 text-center text-xs font-semibold text-blue-700 dark:border-blue-900 dark:bg-blue-950/40 dark:text-blue-200"><i className="fa-solid fa-file-lines mr-2" />Open Reports</Link></header>
      {notice && <div className="fixed right-4 top-4 z-50 rounded-md bg-slate-900 px-4 py-3 text-xs font-semibold text-white shadow-lg">{notice}</div>}
      <GlobalFilters filters={filters} setFilters={setFilters} resetFilters={resetFilters} options={options} onSaveFilter={saveCurrentFilter} />
      <ReportModuleTabs modules={modules} activeReport={activeReport} setActiveReport={setActiveReport} onFavorite={toggleFavorite} />
      {error && <ErrorState message={error} onRetry={reload} />}
      {loading ? <LoadingSkeleton /> : <>
        {widgets['KPI cards'] && <KpiGrid summary={summary} onSelect={selectKpi} />}
        <ReportWorkspace activeReport={activeReport} analytics={analytics} options={options} setFilters={setFilters} />
        {widgets.Charts && <ChartPanel analytics={analytics} overview={overview || report?.overview} />}
        {widgets.Insights && <InsightsPanel insights={report?.insights || []} />}
        <ReportTable rows={report?.table?.rows || []} pagination={report?.table?.pagination} filters={filters} setFilters={setFilters} onBulkExport={() => notify('Use Reports for export options')} reportTitle={activeModule?.title} reportCategory={activeModule?.category} activeReport={activeReport} />
        <EnterprisePanels preferences={preferences} widgets={widgets} setWidgets={setWidgets} rows={[]} reportColumns={[]} showAlerts={widgets.Alerts} showTimeline={widgets.Timeline} onApplyFilter={(saved) => { setFilters(saved || {}); notify('Saved filter applied') }} onDeletePreference={(collection, id) => savePreference((value) => deletePreference(collection, value), id)} onSaveTemplate={(payload) => savePreference(saveTemplate, payload)} onSaveSchedule={(payload) => savePreference(saveSchedule, payload)} onSaveAlert={(payload) => savePreference(saveAlert, payload)} />
      </>}
    </div>
  </main>
}

export default Analysis
