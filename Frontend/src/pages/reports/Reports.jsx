import { useMemo, useRef, useState } from 'react'
import ChartPanel from '../../features/reports/components/ChartPanel'
import EnterprisePanels from '../../features/reports/components/EnterprisePanels'
import GlobalFilters from '../../features/reports/components/GlobalFilters'
import InsightsPanel from '../../features/reports/components/InsightsPanel'
import KpiGrid from '../../features/reports/components/KpiGrid'
import ReportModuleTabs from '../../features/reports/components/ReportModuleTabs'
import ReportTable from '../../features/reports/components/ReportTable'
import { EmptyState, ErrorState, LoadingSkeleton } from '../../features/reports/components/ReportStates'
import { reportColumns } from '../../features/reports/data/reportConfig'
import { useReports } from '../../features/reports/hooks/useReports'
import { copyTable, emailReport, exportCsv, exportExcel, exportPdf, printCurrentView, screenshotElement } from '../../features/reports/utils/exporters'

const Reports = () => {
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
  } = useReports()

  const rows = report?.table?.rows || []
  const summary = overview?.summary || report?.overview?.summary || {}
  const analytics = report?.analytics || {}
  const activeModule = modules.find((module) => module.id === activeReport)
  const fileName = useMemo(() => `purchase-${activeReport}-${new Date().toISOString().slice(0, 10)}`, [activeReport])

  const notify = (message) => {
    setNotice(message)
    window.setTimeout(() => setNotice(''), 2400)
  }

  const handleSaveFilter = async () => {
    const name = window.prompt('Filter name', `${activeModule?.title || 'Report'} Filter`)
    if (!name) return
    await saveFilter(name)
    notify('Filter saved')
  }

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

  return (
    <main className="min-h-full w-full max-w-full overflow-x-hidden bg-slate-50 px-5 py-5 text-slate-900 lg:px-8 print:bg-white">
      <div ref={dashboardRef} className="mx-auto w-full space-y-4">
        <header className="flex min-w-0 flex-col gap-4 xl:flex-row xl:items-start xl:justify-between">
          <div className="min-w-0">
            <p className="text-xs font-semibold uppercase tracking-wide text-cyan-700">Enterprise ERP Dashboard</p>
            <h1 className="mt-1 text-2xl font-bold tracking-normal text-slate-950">Reports & Analytics</h1>
            <p className="mt-1 max-w-3xl text-sm text-slate-600">
              Procurement intelligence across requests, purchase orders, projects, vendors, items, cost, tax, delivery, approvals, and custom reports.
            </p>
          </div>
          <div className="grid grid-cols-2 gap-2 sm:flex sm:flex-wrap xl:justify-end">
            {exportMenu.map(([label, type, icon]) => (
              <button key={label} onClick={() => handleExport(type)} className="min-w-0 rounded-md border border-slate-300 bg-white px-3 py-2 text-xs font-semibold text-slate-700 shadow-sm hover:bg-slate-100 dark:border-slate-700 dark:bg-slate-900 dark:text-slate-200 dark:hover:bg-slate-800">
                <i className={`fa-solid ${icon} mr-2`}></i>{label}
              </button>
            ))}
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

        {!loading && modules.length === 0 && rows.length === 0 && (
          <section className="rounded-md border border-slate-200 bg-white p-8 text-center shadow-sm">
            <div className="mx-auto grid h-12 w-12 place-items-center rounded-md bg-amber-50 text-amber-700">
              <i className="fa-solid fa-triangle-exclamation"></i>
            </div>
            <h2 className="mt-4 text-base font-semibold text-slate-950">Reports are not loading</h2>
            <p className="mx-auto mt-2 max-w-xl text-sm text-slate-600">
              The reports page opened, but the backend did not return report modules or table data. Check that the backend is running and the report tables are created.
            </p>
            <button onClick={reload} className="mt-4 rounded-md bg-slate-900 px-4 py-2 text-sm font-semibold text-white hover:bg-slate-700">
              Retry reports
            </button>
          </section>
        )}

        {loading ? (
          <LoadingSkeleton />
        ) : modules.length > 0 || rows.length > 0 ? (
          <>
            <KpiGrid summary={summary} onSelect={(key) => setFilters({ search: key })} />

            <div className="grid min-w-0 grid-cols-1 gap-4 2xl:grid-cols-[minmax(0,1fr)_340px]">
              <div className="min-w-0 space-y-4">
                {rows.length === 0 ? (
                  <EmptyState />
                ) : (
                  <>
                    <ChartPanel analytics={analytics} overview={overview || report?.overview} />
                    <ReportTable
                      rows={rows}
                      pagination={report?.table?.pagination}
                      filters={filters}
                      setFilters={setFilters}
                      onBulkExport={exportRows}
                    />
                  </>
                )}
              </div>
              <div className="min-w-0 space-y-4">
                <InsightsPanel insights={report?.insights || []} />
                <section className="rounded-lg border border-slate-200 bg-white p-4 shadow-sm dark:border-slate-800 dark:bg-slate-900">
                  <h3 className="mb-3 text-sm font-bold text-slate-950 dark:text-white">Drill-through Navigation</h3>
                  <div className="grid gap-2 text-xs">
                    {['PO Number Report', 'Vendor Price Comparison', 'Approval Analytics', 'Project Consumption'].map((item) => (
                      <button key={item} className="rounded-md border border-slate-200 px-3 py-2 text-left font-semibold text-slate-700 hover:border-blue-400 hover:text-blue-700 dark:border-slate-800 dark:text-slate-200">
                        <i className="fa-solid fa-arrow-right mr-2"></i>{item}
                      </button>
                    ))}
                  </div>
                </section>
              </div>
            </div>

            <EnterprisePanels
              preferences={preferences}
              onSaveTemplate={async (payload) => { await saveTemplate(payload); notify('Template saved') }}
              onSaveSchedule={async (payload) => { await saveSchedule(payload); notify('Schedule saved') }}
              onSaveAlert={async (payload) => { await saveAlert(payload); notify('Alert saved') }}
            />
          </>
        ) : null}
      </div>
    </main>
  )
}

export default Reports
