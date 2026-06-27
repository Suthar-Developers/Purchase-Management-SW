import axios from 'axios'

const API_BASE_URL = import.meta.env.VITE_API_BASE_URL || 'http://localhost:3000/api'

const api = axios.create({
  baseURL: API_BASE_URL,
  timeout: 30000,
})

const unwrap = (response) => response.data?.data ?? response.data

export const reportApi = {
  async getModules() {
    return unwrap(await api.get('/reports/modules'))
  },
  async getOverview(filters) {
    return unwrap(await api.get('/reports/overview', { params: filters }))
  },
  async getReport(reportId, filters) {
    return unwrap(await api.get(`/reports/${reportId}`, { params: filters }))
  },
  async getFilterOptions() {
    return unwrap(await api.get('/reports/filter-options'))
  },
  async getPreferences() {
    return unwrap(await api.get('/reports/preferences'))
  },
  async saveFilter(payload) {
    return unwrap(await api.post('/reports/saved-filters', payload))
  },
  async saveTemplate(payload) {
    return unwrap(await api.post('/reports/templates', payload))
  },
  async saveSchedule(payload) {
    return unwrap(await api.post('/reports/schedules', payload))
  },
  async saveAlert(payload) {
    return unwrap(await api.post('/reports/alerts', payload))
  },
  async toggleFavorite(reportId) {
    return unwrap(await api.post(`/reports/favorites/${reportId}`))
  },
  async deletePreference(collection, id) {
    return unwrap(await api.delete(`/reports/${collection}/${id}`))
  },
}
