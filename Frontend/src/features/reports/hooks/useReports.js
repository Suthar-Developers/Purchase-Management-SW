import { useCallback, useEffect, useMemo, useState } from 'react'
import { reportApi } from '../../../api/reportApi'
import { fetchProjects } from '../../../api/projectApi'
import { fetchApprovedPurchaseOrders, fetchDraftedPurchaseOrders } from '../../../api/purchaseOrderApi'
import { fetchPurchaseRequests } from '../../../api/purchaseRequestApi'
import { fetchVendors } from '../../../api/vendorApi'
import { defaultFilters } from '../data/reportConfig'
import { resolveDatePreset } from '../utils/dateRanges'

const fallbackModules = [
  { id: 'purchase-orders', title: 'Purchase Order Report', category: 'Procurement', favorite: false },
  { id: 'purchase-requests', title: 'Purchase Request Report', category: 'Procurement', favorite: false },
  { id: 'projects', title: 'Project Report', category: 'Projects', favorite: false },
  { id: 'vendors', title: 'Vendor Analytics', category: 'Vendors', favorite: false },
]

const toNumber = (value) => Number(value || 0)

const isInsideDateRange = (dateValue, filters) => {
  if (!dateValue) return true
  const time = new Date(dateValue).getTime()
  if (Number.isNaN(time)) return true
  if (filters.startDate && time < new Date(filters.startDate).getTime()) return false
  if (filters.endDate && time > new Date(filters.endDate).getTime()) return false
  return true
}

// Builds a usable Reports screen from existing purchase APIs when /api/reports fails.
// This keeps the important Reports page working even if report tables are not ready yet.
const buildFallbackReports = async (activeReport, filters) => {
  const [draftedOrders, approvedOrders, purchaseRequests, projects, vendors] = await Promise.all([
    fetchDraftedPurchaseOrders(),
    fetchApprovedPurchaseOrders(),
    fetchPurchaseRequests(),
    fetchProjects(),
    fetchVendors(),
  ])

  const orders = [...(draftedOrders || []), ...(approvedOrders || [])].filter((order) => isInsideDateRange(order.order_date || order.created_at, filters))
  const search = String(filters.search || '').toLowerCase()
  const filteredOrders = search
    ? orders.filter((order) => [order.po_number, order.po_status, order.projectName, order.vendorName].some((value) => String(value || '').toLowerCase().includes(search)))
    : orders

  const rows = filteredOrders.map((order) => ({
    id: order.po_id,
    po_number: order.po_number,
    po_status: order.po_status,
    order_date: order.order_date,
    projectName: order.projectName,
    vendorName: order.vendorName,
    city: order.city || '-',
    state: order.state || '-',
    items: order.items || 0,
    quantity: order.quantity || 0,
    average_rate: order.average_rate || 0,
    total_amount: toNumber(order.total_amount),
    total_discount: toNumber(order.total_discount),
    total_gst: toNumber(order.total_gst),
    grand_total: toNumber(order.grand_total),
  }))

  const totalPurchaseValue = filteredOrders.reduce((sum, order) => sum + toNumber(order.grand_total), 0)
  const approvedPO = filteredOrders.filter((order) => order.po_status === 'Approved' || order.po_status === 'Revised').length
  const pendingPO = filteredOrders.filter((order) => order.po_status === 'Draft' || order.po_status === 'Pending').length
  const rejectedPO = filteredOrders.filter((order) => order.po_status === 'Rejected').length
  const holdPO = filteredOrders.filter((order) => order.po_status === 'Hold').length

  const summary = {
    totalPurchaseRequests: purchaseRequests?.length || 0,
    totalPurchaseOrders: filteredOrders.length,
    approvedPO,
    pendingPO,
    rejectedPO,
    holdPO,
    itemHoldPO: 0,
    totalVendors: vendors?.length || 0,
    activeVendors: (vendors || []).filter((vendor) => vendor.status === 'Active').length,
    totalProjects: projects?.length || 0,
    totalCities: new Set((projects || []).map((project) => project.city).filter(Boolean)).size,
    totalPurchaseValue,
    averagePOValue: filteredOrders.length ? totalPurchaseValue / filteredOrders.length : 0,
    averageApprovalTime: 0,
    totalDiscount: filteredOrders.reduce((sum, order) => sum + toNumber(order.total_discount), 0),
    totalTax: filteredOrders.reduce((sum, order) => sum + toNumber(order.total_gst), 0),
    totalSavings: filteredOrders.reduce((sum, order) => sum + toNumber(order.total_discount), 0),
    totalCost: filteredOrders.reduce((sum, order) => sum + toNumber(order.total_amount), 0),
    totalQuantityPurchased: rows.reduce((sum, row) => sum + toNumber(row.quantity), 0),
  }

  const groupOrders = (key, fallbackLabel = 'Unassigned') => Object.values(filteredOrders.reduce((acc, order) => {
    const label = order[key] || fallbackLabel
    acc[label] = acc[label] || { label, orders: 0, value: 0 }
    acc[label].orders += 1
    acc[label].value += toNumber(order.grand_total)
    return acc
  }, {}))

  const monthly = Object.values(filteredOrders.reduce((acc, order) => {
    const label = String(order.order_date || '').slice(0, 7) || 'No Date'
    acc[label] = acc[label] || { label, orders: 0, value: 0 }
    acc[label].orders += 1
    acc[label].value += toNumber(order.grand_total)
    return acc
  }, {}))

  const status = [
    { label: 'Approved', value: approvedPO },
    { label: 'Draft', value: pendingPO },
    { label: 'Rejected', value: rejectedPO },
    { label: 'Hold', value: holdPO },
  ].filter((item) => item.value > 0)

  const overview = { summary, charts: { trend: monthly, status, vendorShare: groupOrders('vendorName') } }
  const analytics = {
    reportId: activeReport,
    charts: {
      monthly,
      projectWise: groupOrders('projectName'),
      cityWise: [],
      vendorWise: groupOrders('vendorName'),
      itemRates: [],
      quantity: [],
      costBreakdown: [
        { label: 'Total Amount', value: summary.totalCost },
        { label: 'Discount', value: summary.totalDiscount },
        { label: 'GST', value: summary.totalTax },
        { label: 'Grand Total', value: summary.totalPurchaseValue },
      ],
    },
  }

  return {
    overview,
    report: {
      module: fallbackModules.find((module) => module.id === activeReport) || fallbackModules[0],
      overview,
      analytics,
      table: {
        rows,
        pagination: { page: 1, limit: rows.length || 25, total: rows.length, pages: 1 },
      },
      insights: [
        { title: 'Fallback report mode', message: 'Using live purchase APIs because the reports API did not respond.' },
      ],
    },
  }
}

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
    if (moduleResult.status === 'fulfilled') setModules(Array.isArray(moduleResult.value) ? moduleResult.value : fallbackModules)
    if (optionResult.status === 'fulfilled') setOptions(optionResult.value)
    if (preferenceResult.status === 'fulfilled') setPreferences(preferenceResult.value)
    if (moduleResult.status === 'rejected' || optionResult.status === 'rejected') {
      setModules(fallbackModules)
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
      try {
        const fallback = await buildFallbackReports(activeReport, effectiveFilters)
        setModules((current) => current.length ? current : fallbackModules)
        setOverview(fallback.overview)
        setReport(fallback.report)
        setError('Reports API is not available, so this page is showing live fallback data from the purchase modules.')
      } catch (fallbackErr) {
        setError(fallbackErr?.response?.data?.message || fallbackErr.message || err?.response?.data?.message || err.message || 'Unable to load reports')
      }
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
