import jsPDF from 'jspdf'
import autoTable from 'jspdf-autotable'

const toTime = (value) => {
  if (!value) return null
  const time = new Date(value).getTime()
  return Number.isNaN(time) ? null : time
}

// Filters rows using the date field chosen by the page using this helper.
export const filterRowsByDateRange = (rows, startDate, endDate, getDate) => {
  const start = startDate ? new Date(startDate).getTime() : null
  const end = endDate ? new Date(`${endDate}T23:59:59`).getTime() : null

  return rows.filter((row) => {
    const rowTime = toTime(getDate(row))
    if (!rowTime) return true
    if (start && rowTime < start) return false
    if (end && rowTime > end) return false
    return true
  })
}

// Creates a simple page-specific PDF table for Projects, Vendors, and PR pages.
export const exportPagePdf = ({ title, fileName, rows, columns, startDate, endDate }) => {
  const doc = new jsPDF({ orientation: 'landscape' })
  doc.setFontSize(14)
  doc.text(title, 14, 14)
  doc.setFontSize(9)
  doc.text(`Generated: ${new Date().toLocaleString('en-IN')}`, 14, 21)
  doc.text(`Date range: ${startDate || 'All'} to ${endDate || 'All'}`, 14, 27)

  autoTable(doc, {
    startY: 34,
    head: [columns.map((column) => column.label)],
    body: rows.map((row) => columns.map((column) => column.render ? column.render(row) : row[column.key] ?? '-')),
    styles: { fontSize: 7, cellPadding: 2 },
    headStyles: { fillColor: [15, 23, 42] },
  })

  doc.save(`${fileName}-${new Date().toISOString().slice(0, 10)}.pdf`)
}
