export const formatNumber = (value) =>
  new Intl.NumberFormat('en-IN', { maximumFractionDigits: 2 }).format(Number(value || 0))

export const formatCurrency = (value) =>
  new Intl.NumberFormat('en-IN', {
    style: 'currency',
    currency: 'INR',
    maximumFractionDigits: 0,
  }).format(Number(value || 0))

export const formatKpiValue = (value, type) => {
  if (type === 'currency') return formatCurrency(value)
  if (type === 'hours') return `${formatNumber(value)} h`
  return formatNumber(value)
}
