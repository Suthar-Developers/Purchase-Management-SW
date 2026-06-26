const toDateInput = (date) => date.toISOString().slice(0, 10)

const startOfWeek = (date) => {
  const next = new Date(date)
  const day = next.getDay() || 7
  next.setDate(next.getDate() - day + 1)
  return next
}

export const resolveDatePreset = (preset) => {
  const now = new Date()
  const start = new Date(now)
  const end = new Date(now)

  if (preset === 'today') return { startDate: toDateInput(start), endDate: toDateInput(end) }
  if (preset === 'yesterday') {
    start.setDate(start.getDate() - 1)
    end.setDate(end.getDate() - 1)
    return { startDate: toDateInput(start), endDate: toDateInput(end) }
  }
  if (preset === 'thisWeek') {
    return { startDate: toDateInput(startOfWeek(now)), endDate: toDateInput(end) }
  }
  if (preset === 'lastWeek') {
    const weekStart = startOfWeek(now)
    weekStart.setDate(weekStart.getDate() - 7)
    const weekEnd = new Date(weekStart)
    weekEnd.setDate(weekEnd.getDate() + 6)
    return { startDate: toDateInput(weekStart), endDate: toDateInput(weekEnd) }
  }
  if (preset === 'thisMonth') {
    return { startDate: toDateInput(new Date(now.getFullYear(), now.getMonth(), 1)), endDate: toDateInput(end) }
  }
  if (preset === 'lastMonth') {
    return {
      startDate: toDateInput(new Date(now.getFullYear(), now.getMonth() - 1, 1)),
      endDate: toDateInput(new Date(now.getFullYear(), now.getMonth(), 0)),
    }
  }
  if (preset === 'quarter') {
    const quarter = Math.floor(now.getMonth() / 3)
    return { startDate: toDateInput(new Date(now.getFullYear(), quarter * 3, 1)), endDate: toDateInput(end) }
  }
  if (preset === 'financialYear') {
    const fyStartYear = now.getMonth() >= 3 ? now.getFullYear() : now.getFullYear() - 1
    return { startDate: toDateInput(new Date(fyStartYear, 3, 1)), endDate: toDateInput(end) }
  }
  return {}
}
