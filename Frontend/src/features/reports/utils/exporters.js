import { toPng } from 'html-to-image'
import jsPDF from 'jspdf'
import autoTable from 'jspdf-autotable'
import { formatCurrency } from './formatters'

const sanitize = (value) => String(value ?? '').replaceAll('"', '""')

// Converts any table rows + column config into CSV text.
export const rowsToCsv = (rows, columns) => {
  const header = columns.map((column) => `"${sanitize(column.label)}"`).join(',')
  const body = rows.map((row) => columns.map((column) => `"${sanitize(row[column.key])}"`).join(',')).join('\n')
  return `${header}\n${body}`
}

const downloadBlob = (blob, fileName) => {
  // Browser-only download helper used by CSV, Excel, and screenshot exports.
  const url = URL.createObjectURL(blob)
  const link = document.createElement('a')
  link.href = url
  link.download = fileName
  link.click()
  URL.revokeObjectURL(url)
}

export const exportCsv = (rows, columns, fileName) => {
  downloadBlob(new Blob([rowsToCsv(rows, columns)], { type: 'text/csv;charset=utf-8' }), `${fileName}.csv`)
}

// Generates an HTML table with .xls extension so Excel can open it directly.
export const exportExcel = (rows, columns, fileName) => {
  const table = `
    <table>
      <thead><tr>${columns.map((column) => `<th>${column.label}</th>`).join('')}</tr></thead>
      <tbody>
        ${rows
          .map((row) => `<tr>${columns.map((column) => `<td>${sanitize(row[column.key])}</td>`).join('')}</tr>`)
          .join('')}
      </tbody>
    </table>`
  downloadBlob(new Blob([table], { type: 'application/vnd.ms-excel' }), `${fileName}.xls`)
}

// PDF export uses jsPDF + autoTable. Add header/footer changes here.
export const exportPdf = (rows, columns, fileName, summary = {}) => {
  const doc = new jsPDF({ orientation: 'landscape' })
  doc.setFontSize(14)
  doc.text('Purchase Reports & Analytics', 14, 14)
  doc.setFontSize(9)
  doc.text(`Generated: ${new Date().toLocaleString()}`, 14, 21)
  if (summary.totalPurchaseValue) doc.text(`Total Value: ${formatCurrency(summary.totalPurchaseValue)}`, 14, 27)
  autoTable(doc, {
    startY: 34,
    head: [columns.map((column) => column.label)],
    body: rows.map((row) => columns.map((column) => row[column.key] ?? '')),
    styles: { fontSize: 7, cellPadding: 2 },
    headStyles: { fillColor: [15, 23, 42] },
  })
  doc.save(`${fileName}.pdf`)
}

export const copyTable = async (rows, columns) => {
  await navigator.clipboard.writeText(rowsToCsv(rows, columns))
}

export const printCurrentView = () => window.print()

// Lightweight email sharing: opens user's mail client with CSV text in body.
export const emailReport = (rows, columns) => {
  const csv = encodeURIComponent(rowsToCsv(rows, columns).slice(0, 12000))
  window.location.href = `mailto:?subject=Purchase Report&body=${csv}`
}

// Captures the visible dashboard area as a PNG.
export const screenshotElement = async (node, fileName) => {
  if (!node) return
  const dataUrl = await toPng(node, { cacheBust: true, pixelRatio: 2 })
  const link = document.createElement('a')
  link.href = dataUrl
  link.download = `${fileName}.png`
  link.click()
}
