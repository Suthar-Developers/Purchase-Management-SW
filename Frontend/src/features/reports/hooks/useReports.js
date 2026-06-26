import { useCallback, useEffect, useMemo, useState } from 'react'
import { reportApi } from '../../../api/reportApi'
import { defaultFilters } from '../data/reportConfig'
import { resolveDatePreset } from '../utils/dateRanges'

const hydrateFilters = (filters) => ({
  ...filters,
  ...(filters.datePreset && filters.datePreset !== 'custom' ? resolveDatePreset(filters.datePreset) : {}),
})

export const useReports = () => {
  const [filters, setFiltersState] = useState(() => hydrateFilters(defaultFilters))
  const [activeReport, setActiveReport] = useState('purchase-orders')
  const [modules, setModules] = useState([])
  const [options, setOptions] = useState({})
  const [preferences, setPreferences] = useState({})
  const [report, setReport] = useState(null)
  const [overview, setOverview] = useState(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState('')

  const effectiveFilters = useMemo(() => hydrateFilters(filters), [filters])

  const setFilters = useCallback((next) => {
    setFiltersState((current) => {
      const updated = typeof next === 'function' ? next(current) : next
      return hydrateFilters({ ...current, ...updated, page: updated.page ?? 1 })
    })
  }, [])

  const resetFilters = useCallback(() => setFiltersState(hydrateFilters(defaultFilters)), [])

  const loadStaticData = useCallback(async () => {
    const [moduleData, optionData, preferenceData] = await Promise.all([
      reportApi.getModules(),
      reportApi.getFilterOptions(),
      reportApi.getPreferences(),
    ])
    setModules(moduleData)
    setOptions(optionData)
    setPreferences(preferenceData)
  }, [])

  const loadReport = useCallback(async () => {
    setLoading(true)
    setError('')
    try {
      const [overviewData, reportData] = await Promise.all([
        reportApi.getOverview(effectiveFilters),
        reportApi.getReport(activeReport, effectiveFilters),
      ])
      setOverview(overviewData)
      setReport(reportData)
    } catch (err) {
      setError(err?.response?.data?.message || err.message || 'Unable to load reports')
    } finally {
      setLoading(false)
    }
  }, [activeReport, effectiveFilters])

  useEffect(() => {
    loadStaticData().catch((err) => setError(err?.response?.data?.message || err.message))
  }, [loadStaticData])

  useEffect(() => {
    loadReport()
  }, [loadReport])

  const saveFilter = async (name) => {
    const saved = await reportApi.saveFilter({ name, reportId: activeReport, filters: effectiveFilters })
    setPreferences((current) => ({ ...current, savedFilters: [saved, ...(current.savedFilters || [])] }))
    return saved
  }

  const saveTemplate = async (payload) => {
    const saved = await reportApi.saveTemplate({ reportId: activeReport, ...payload })
    setPreferences((current) => ({ ...current, templates: [saved, ...(current.templates || [])] }))
    return saved
  }

  const saveSchedule = async (payload) => {
    const saved = await reportApi.saveSchedule({ reportId: activeReport, ...payload })
    setPreferences((current) => ({ ...current, schedules: [saved, ...(current.schedules || [])] }))
    return saved
  }

  const saveAlert = async (payload) => {
    const saved = await reportApi.saveAlert({ reportId: activeReport, ...payload })
    setPreferences((current) => ({ ...current, alerts: [saved, ...(current.alerts || [])] }))
    return saved
  }

  const toggleFavorite = async (reportId) => {
    await reportApi.toggleFavorite(reportId)
    await loadStaticData()
  }

  return {
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
    reload: loadReport,
    saveFilter,
    saveTemplate,
    saveSchedule,
    saveAlert,
    toggleFavorite,
  }
}
