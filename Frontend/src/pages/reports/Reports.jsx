import { useEffect, useMemo, useRef, useState } from 'react'
import { Link } from 'react-router-dom'
import ChartPanel from '../../features/reports/components/ChartPanel'
import EnterprisePanels from '../../features/reports/components/EnterprisePanels'
import GlobalFilters from '../../features/reports/components/GlobalFilters'
import InsightsPanel from '../../features/reports/components/InsightsPanel'
import KpiGrid from '../../features/reports/components/KpiGrid'
import ReportModuleTabs from '../../features/reports/components/ReportModuleTabs'
import ReportTable from '../../features/reports/components/ReportTable'
import ReportWorkspace from '../../features/reports/components/ReportWorkspace'
import { EmptyState, ErrorState, LoadingSkeleton } from '../../features/reports/components/ReportStates'
import { reportColumns } from '../../features/reports/data/reportConfig'
import { useReports } from '../../features/reports/hooks/useReports'
import { copyTable, emailReport, exportCsv, exportExcel, exportPdf, printCurrentView, screenshotElement } from '../../features/reports/utils/exporters'

const Reports = ({ view = 'reports' }) => {
  const isAnalysis = view === 'analysis'
  // Main shell for the Reports module. Data is loaded by useReports.
  const dashboardRef = useRef(null)
  const [notice, setNotice] = useState('')
  const {
    activeReport,
    setActiveReport,
    filters,
    setFilters,
    resetFilters,
    modules,
    options,
    preferences,
    report,
    overview,
    loading,
    error,
    reload,
    saveFilter,
    saveTemplate,
    saveSchedule,
    saveAlert,
    toggleFavorite,
    deletePreference,
  } = useReports()
  const [widgets, setWidgets] = useState(() => {
    // Dashboard personalization is saved in the browser for quick UI customization.
    const saved = localStorage.getItem('reportDashboardWidgets')
    return saved ? JSON.parse(saved) : {
      'KPI cards': true,
      Charts: true,
      Insights: true,
      Tables: true,
      Alerts: true,
      Timeline: true,
    }
  })

  const rows = report?.table?.rows || []
  const summary = overview?.summary || report?.overview?.summary || {}
  const analytics = report?.analytics || {}
  const activeModule = modules.find((module) => module.id === activeReport)
  const fileName = useMemo(() => `purchase-${activeReport}-${new Date().toISOString().slice(0, 10)}`, [activeReport])

  useEffect(() => {
    localStorage.setItem('reportDashboardWidgets', JSON.stringify(widgets))
  }, [widgets])

  const notify = (message) => {
    setNotice(message)
    window.setTimeout(() => setNotice(''), 2400)
  }

  // Saves current GlobalFilters to the backend saved-filters table.
  const handleSaveFilter = async () => {
    const name = window.prompt('Filter name', `${activeModule?.title || 'Report'} Filter`)
    if (!name) return
    try {
      await saveFilter(name)
      notify('Filter saved')
    } catch (err) {
      notify(err?.response?.data?.message || 'Filter could not be saved')
    }
  }

  // Used by table bulk export and "Export Current View".
  const exportRows = (targetRows = rows, columns = reportColumns) => {
    exportExcel(targetRows, columns, fileName)
    notify('Current view exported to Excel')
  }

  const exportMenu = [
    ['PDF', 'pdf', 'fa-file-pdf'],
    ['Excel', 'excel', 'fa-file-excel'],
    ['CSV', 'csv', 'fa-file-csv'],
    ['Print', 'print', 'fa-print'],
    ['Email', 'email', 'fa-envelope'],
    ['Copy Table', 'copy', 'fa-copy'],
    ['Screenshot', 'screenshot', 'fa-camera'],
  ]

  // Header export buttons are routed here. Add new export types in exportMenu too.
  const handleExport = async (type) => {
    if (type === 'pdf') exportPdf(rows, reportColumns, fileName, summary)
    if (type === 'excel') exportExcel(rows, reportColumns, fileName)
    if (type === 'csv') exportCsv(rows, reportColumns, fileName)
    if (type === 'print') printCurrentView()
    if (type === 'email') emailReport(rows, reportColumns)
    if (type === 'copy') {
      await copyTable(rows, reportColumns)
      notify('Table copied')
    }
    if (type === 'screenshot') screenshotElement(dashboardRef.current, fileName)
  }

  // KPI cards apply quick filters. Add mappings here for any new KPI cards.
  const handleKpiSelect = (key) => {
    const filterByKpi = {
      approvedPO: { status: 'Approved' },
      pendingPO: { status: 'Draft,Pending' },
      rejectedPO: { status: 'Rejected' },
      holdPO: { status: 'Hold' },
      itemHoldPO: { status: 'Hold' },
      activeVendors: { search: 'Active' },
      totalVendors: { search: '' },
      totalProjects: { search: '' },
      totalCities: { search: '' },
      totalPurchaseRequests: { search: '' },
      totalPurchaseOrders: { search: '' },
    }
    setFilters(filterByKpi[key] || { sortBy: key, sortOrder: 'DESC', search: '' })
    notify('Detailed view updated')
  }

  return (
    <main className="min-h-full w-full max-w-full overflow-x-hidden bg-slate-50 px-3 py-3 text-slate-900 dark:bg-slate-950 dark:text-white sm:px-4 lg:px-5 print:bg-white">
      <div ref={dashboardRef} className="mx-auto w-full max-w-400 space-y-4">
        <header className="flex min-w-0 flex-col gap-4 xl:flex-row xl:items-start xl:justify-between">
          <div className="min-w-0">
            <p className="text-xs font-semibold uppercase tracking-wide text-blue-700 dark:text-blue-300">Purchase intelligence</p>
            <h1 className="text-xl font-bold tracking-normal text-slate-950 dark:text-white sm:text-2xl">{isAnalysis ? 'Analysis' : 'Reports'}</h1>
            <p className="mt-1 max-w-3xl text-sm text-slate-600 dark:text-slate-300">
              {isAnalysis ? 'Understand spend, supplier performance, approvals, and purchasing trends at a glance.' : 'Review, filter, export, and share detailed purchase records.'}
            </p>
          </div>
          <div className="grid grid-cols-2 gap-2 sm:flex sm:flex-wrap xl:justify-end">
            <Link to={isAnalysis ? '/reports' : '/analysis'} className="col-span-2 rounded-md border border-blue-200 bg-blue-50 px-3 py-2 text-center text-xs font-semibold text-blue-700 hover:bg-blue-100 dark:border-blue-900 dark:bg-blue-950/40 dark:text-blue-200 sm:col-span-1">
              <i className={`fa-solid ${isAnalysis ? 'fa-file-lines' : 'fa-chart-line'} mr-2`}></i>{isAnalysis ? 'Open Reports' : 'Open Analysis'}
            </Link>
          {!isAnalysis && <>
            {exportMenu.map(([label, type, icon]) => (
              <button key={label} onClick={() => handleExport(type)} className="min-w-0 rounded-md border border-slate-300 bg-white px-3 py-2 text-xs font-semibold text-slate-700 shadow-sm hover:bg-slate-100 dark:border-slate-700 dark:bg-slate-900 dark:text-slate-200 dark:hover:bg-slate-800">
                <i className={`fa-solid ${icon} mr-2`}></i>{label}
              </button>
            ))}
          </>}
          </div>
        </header>

        {notice && (
          <div className="fixed right-4 top-4 z-50 rounded-md bg-slate-900 px-4 py-3 text-xs font-semibold text-white shadow-lg">
            {notice}
          </div>
        )}

        <GlobalFilters
          filters={filters}
          setFilters={setFilters}
          resetFilters={resetFilters}
          options={options}
          onSaveFilter={handleSaveFilter}
          onExportView={() => exportRows()}
        />

        <ReportModuleTabs modules={modules} activeReport={activeReport} setActiveReport={setActiveReport} onFavorite={toggleFavorite} />

        {error && <ErrorState message={error} onRetry={reload} />}

        {loading ? (
          <LoadingSkeleton />
        ) : (
          <>
            {isAnalysis && widgets['KPI cards'] && <KpiGrid summary={summary} onSelect={handleKpiSelect} />}

            <div className="grid min-w-0 grid-cols-1 gap-4 2xl:grid-cols-[minmax(0,1fr)_340px]">
              <div className="min-w-0 space-y-4">
                {rows.length === 0 ? (
                  <EmptyState />
                ) : (
                  <>
                    {/* ReportWorkspace changes its content based on the selected report tab. */}
                    {isAnalysis && <ReportWorkspace activeReport={activeReport} analytics={analytics} options={options} setFilters={setFilters} />}
                    {isAnalysis && widgets.Charts && <ChartPanel analytics={analytics} overview={overview || report?.overview} />}
                    {(!isAnalysis || widgets.Tables) && (
                      <ReportTable
                        rows={rows}
                        pagination={report?.table?.pagination}
                        filters={filters}
                        setFilters={setFilters}
                        onBulkExport={exportRows}
                        reportTitle={activeModule?.title}
                        reportCategory={activeModule?.category}
                        activeReport={activeReport}
                      />
                    )}
                  </>
                )}
              </div>
              <div className="min-w-0 space-y-4">
                {isAnalysis && widgets.Insights && <InsightsPanel insights={report?.insights || []} />}
                {/* Drill-through buttons are quick links to related report tabs. */}
                {isAnalysis && <section className="rounded-lg border border-slate-200 bg-white p-4 shadow-sm dark:border-slate-800 dark:bg-slate-900">
                  <h3 className="mb-3 text-sm font-bold text-slate-950 dark:text-white">Drill-through Navigation</h3>
                  <div className="grid gap-2 text-xs">
                    {[
                      ['PO Number Report', 'po-number'],
                      ['Vendor Price Comparison', 'vendor-price-comparison'],
                      ['Approval Analytics', 'approvals'],
                      ['Project Consumption', 'project-consumption'],
                      ['Rate Analysis', 'rates'],
                      ['Cost Analytics', 'costs'],
                    ].map(([label, id]) => (
                      <button key={id} onClick={() => setActiveReport(id)} className="rounded-md border border-slate-200 px-3 py-2 text-left font-semibold text-slate-700 hover:border-blue-400 hover:text-blue-700 dark:border-slate-800 dark:text-slate-200">
                        <i className="fa-solid fa-arrow-right mr-2"></i>{label}
                      </button>
                    ))}
                  </div>
                </section>}
              </div>
            </div>

            {isAnalysis && <EnterprisePanels
              preferences={preferences}
              widgets={widgets}
              setWidgets={setWidgets}
              rows={rows}
              reportColumns={reportColumns}
              showAlerts={widgets.Alerts}
              showTimeline={widgets.Timeline}
              onApplyFilter={(savedFilters) => { setFilters(savedFilters || {}); notify('Saved filter applied') }}
              onDeletePreference={async (collection, id) => {
                try {
                  await deletePreference(collection, id)
                  notify('Deleted')
                } catch (err) {
                  notify(err?.response?.data?.message || 'Delete failed')
                }
              }}
              onSaveTemplate={async (payload) => {
                try {
                  await saveTemplate(payload)
                  notify('Template saved')
                } catch (err) {
                  notify(err?.response?.data?.message || 'Template could not be saved')
                }
              }}
              onSaveSchedule={async (payload) => {
                try {
                  await saveSchedule(payload)
                  notify('Schedule saved')
                } catch (err) {
                  notify(err?.response?.data?.message || 'Schedule could not be saved')
                }
              }}
              onSaveAlert={async (payload) => {
                try {
                  await saveAlert(payload)
                  notify('Alert saved')
                } catch (err) {
                  notify(err?.response?.data?.message || 'Alert could not be saved')
                }
              }}
            />}
          </>
        )}
      </div>
    </main>
  )
}

export default Reports
