import { useCallback, useEffect, useMemo, useState } from 'react'
import { reportApi } from '../../../api/reportApi'
import { defaultFilters } from '../data/reportConfig'
import { resolveDatePreset } from '../utils/dateRanges'

// Date presets are converted to real dates before API calls.
const hydrateFilters = (filters) => ({
  ...filters,
  ...(filters.datePreset && filters.datePreset !== 'custom' ? resolveDatePreset(filters.datePreset) : {}),
})

export const useReports = () => {
  // Single data/state controller for the whole Reports page.
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
    // Any filter change returns to page 1 unless caller sends an explicit page.
    setFiltersState((current) => {
      const updated = typeof next === 'function' ? next(current) : next
      return hydrateFilters({ ...current, ...updated, page: updated.page ?? 1 })
    })
  }, [])

  const resetFilters = useCallback(() => setFiltersState(hydrateFilters(defaultFilters)), [])

  const loadStaticData = useCallback(async () => {
    // Load independently so preference errors do not blank dropdown filters.
    const [moduleResult, optionResult, preferenceResult] = await Promise.allSettled([
      reportApi.getModules(),
      reportApi.getFilterOptions(),
      reportApi.getPreferences(),
    ])
    if (moduleResult.status === 'fulfilled') setModules(moduleResult.value)
    if (optionResult.status === 'fulfilled') setOptions(optionResult.value)
    if (preferenceResult.status === 'fulfilled') setPreferences(preferenceResult.value)
    if (moduleResult.status === 'rejected' || optionResult.status === 'rejected') {
      throw moduleResult.reason || optionResult.reason
    }
  }, [])

  const loadReport = useCallback(async () => {
    // Reloads report data whenever filters or selected report tab change.
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
    // Reload preferences after saving so the Saved Filters panel updates.
    const saved = await reportApi.saveFilter({ name, reportId: activeReport, filters: effectiveFilters })
    await loadStaticData()
    return saved
  }

  const saveTemplate = async (payload) => {
    const saved = await reportApi.saveTemplate({ reportId: activeReport, ...payload })
    await loadStaticData()
    return saved
  }

  const saveSchedule = async (payload) => {
    const saved = await reportApi.saveSchedule({ reportId: activeReport, ...payload })
    await loadStaticData()
    return saved
  }

  const saveAlert = async (payload) => {
    const saved = await reportApi.saveAlert({ reportId: activeReport, ...payload })
    await loadStaticData()
    return saved
  }

  const toggleFavorite = async (reportId) => {
    await reportApi.toggleFavorite(reportId)
    await loadStaticData()
  }

  // collection matches backend route names: templates, schedules, alerts, savedFilters.
  const deletePreference = async (collection, id) => {
    await reportApi.deletePreference(collection, id)
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
    refreshPreferences: loadStaticData,
    deletePreference,
  }
}
