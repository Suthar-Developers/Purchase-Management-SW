import api, { unwrap } from './http'

export const reportApi = {
  // Report tab metadata: id, title, category, icon, and favorite state.
  async getModules() {
    return unwrap(await api.get('/reports/modules'))
  },
  // Top KPI cards and high-level chart data.
  async getOverview(filters) {
    return unwrap(await api.get('/reports/overview', { params: filters }))
  },
  // Main report payload for the selected report tab and filters.
  async getReport(reportId, filters) {
    return unwrap(await api.get(`/reports/${reportId}`, { params: filters }))
  },
  // Dropdown options used by GlobalFilters.
  async getFilterOptions() {
    return unwrap(await api.get('/reports/filter-options'))
  },
  // Saved filters, templates, schedules, alerts, favorites, and audit logs.
  async getPreferences() {
    return unwrap(await api.get('/reports/preferences'))
  },
  // Save current global filters for reuse.
  async saveFilter(payload) {
    return unwrap(await api.post('/reports/saved-filters', payload))
  },
  // Save Custom Report Builder column selections.
  async saveTemplate(payload) {
    return unwrap(await api.post('/reports/templates', payload))
  },
  // Save schedule metadata. "Run Now" export is handled in the frontend.
  async saveSchedule(payload) {
    return unwrap(await api.post('/reports/schedules', payload))
  },
  // Save threshold alert rules checked while creating POs.
  async saveAlert(payload) {
    return unwrap(await api.post('/reports/alerts', payload))
  },
  async toggleFavorite(reportId) {
    return unwrap(await api.post(`/reports/favorites/${reportId}`))
  },
  // Delete saved filters/templates/schedules/alerts.
  async deletePreference(collection, id) {
    return unwrap(await api.delete(`/reports/${collection}/${id}`))
  },
}
