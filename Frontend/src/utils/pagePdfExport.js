import jsPDF from 'jspdf';
import autoTable from 'jspdf-autotable';

export const exportPagePdf = ({
    title,
    fileName,
    rows,
    columns,
}) => {
    const doc = new jsPDF({ orientation: 'landscape' });

    doc.setFontSize(14);
    doc.text(title, 14, 14);

    doc.setFontSize(9);
    doc.text(`Generated: ${new Date().toLocaleString('en-IN')}`, 14, 21);

    autoTable(doc, {
        startY: 28,
        head: [columns.map(column => column.label)],
        body: rows.map(row =>
            columns.map(column =>
                column.render
                    ? column.render(row)
                    : row[column.key] ?? '-'
            )
        ),
        styles: {
            fontSize: 7,
            cellPadding: 2,
        },
        headStyles: {
            fillColor: [15, 23, 42],
        },
    });

    doc.save(`${fileName}-${new Date().toISOString().slice(0, 10)}.pdf`);
};