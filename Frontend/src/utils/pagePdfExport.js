import jsPDF from 'jspdf';
import autoTable from 'jspdf-autotable';

const formatDate = (value) => {
    if (!value) return '-';

    const date = new Date(value);

    if (Number.isNaN(date.getTime())) return '-';

    return date.toLocaleDateString('en-GB', {
        day: '2-digit',
        month: 'short',
        year: 'numeric',
    });
};

const formatCurrency = (value) => {
    if (value === null || value === undefined || value === '') {
        return '-';
    }

    return `₹ ${Number(value).toLocaleString('en-IN')}`;
};

const contactText = (person) => {
    if (!person) return '-';

    return [
        person.name,
        person.phone,
        person.email,
    ]
        .filter(Boolean)
        .join('\n');
};

const getProjectContacts = (project) => {
    const contacts = project.contacts || {};

    const primaryContact =
        contacts.primaryContactPerson ||
        (project.contactPersonName
            ? {
                name: project.contactPersonName,
                phone: project.contactPersonNumber,
                email: project.contactPersonEmail,
            }
            : null);

    const manager =
        contacts.projectManager ||
        (project.projectManagerName
            ? {
                name: project.projectManagerName,
                phone: project.projectManagerNumber,
                email: project.projectManagerEmail,
            }
            : null);

    const primarySupervisor =
        contacts.primarySupervisor ||
        (project.supervisorName
            ? {
                name: project.supervisorName,
                phone: project.supervisorNumber,
                email: project.supervisorEmail,
            }
            : null);

    const secondarySupervisors =
        contacts.secondarySupervisors ||
        project.secondarySupervisors ||
        [];

    const secondaryContacts =
        contacts.secondaryContactPersons ||
        (project.secondaryContactPerson
            ? [project.secondaryContactPerson]
            : []);

    return {
        primaryContact,
        secondaryContacts,
        manager,
        primarySupervisor,
        secondarySupervisors,
    };
};

const buildProjectRows = (projects) => {
    return projects.map((project) => {
        const {
            primaryContact,
            secondaryContacts,
            manager,
            primarySupervisor,
            secondarySupervisors,
        } = getProjectContacts(project);

        const supervisorText = [
            primarySupervisor
                ? `Primary:\n${contactText(primarySupervisor)}`
                : null,

            secondarySupervisors.length
                ? `Secondary:\n${secondarySupervisors
                    .map(
                        (person, index) =>
                            `${index + 1}. ${contactText(person)}`
                    )
                    .join('\n\n')}`
                : null,
        ]
            .filter(Boolean)
            .join('\n\n');

        const contactTextValue = [
            primaryContact
                ? `Primary:\n${contactText(primaryContact)}`
                : null,

            secondaryContacts.length
                ? `Secondary:\n${secondaryContacts
                    .map(
                        (person, index) =>
                            `${index + 1}. ${contactText(person)}`
                    )
                    .join('\n\n')}`
                : null,
        ]
            .filter(Boolean)
            .join('\n\n');

        return [
            project.projectName || '-',
            project.projectCode || '-',
            [
                project.clientName,
                project.scopeOfWork
                    ? `Scope: ${project.scopeOfWork}`
                    : null,
            ]
                .filter(Boolean)
                .join('\n'),

            [
                project.city,
                project.state
                    ? `${project.state}${project.stateCode
                        ? ` (${project.stateCode})`
                        : ''
                    }`
                    : null,
                project.address
                    ? `Address: ${project.address}`
                    : null,
            ]
                .filter(Boolean)
                .join('\n'),

            [
                project.startDate
                    ? `Start: ${formatDate(project.startDate)}`
                    : null,
                project.endDate
                    ? `End: ${formatDate(project.endDate)}`
                    : null,
            ]
                .filter(Boolean)
                .join('\n'),

            contactText(manager),
            supervisorText || '-',
            contactTextValue || '-',
            project.status || 'Planned',
            project.budget !== null &&
                project.budget !== undefined &&
                project.budget !== '' ? formatCurrency(project.budget) : '-',
            project.updated_at ? formatDate(project.updated_at) : '-',
        ];
    });
};

export const exportProjectsPdf = ({
    title = 'Projects',
    fileName = 'projects',
    rows = [],
}) => {
    const doc = new jsPDF({
        orientation: 'landscape',
        unit: 'mm',
        format: 'a4',
    });

    const pageWidth = doc.internal.pageSize.getWidth();

    // PAGE HEADER
    doc.setFillColor(15, 23, 42);
    doc.rect(0, 0, pageWidth, 27, 'F');

    doc.setTextColor(255, 255, 255);
    doc.setFontSize(17);
    doc.setFont('helvetica', 'bold');
    doc.text(title, 14, 12);

    doc.setFontSize(8);
    doc.setFont('helvetica', 'normal');
    doc.text(
        `${rows.length} project${rows.length === 1 ? '' : 's'}`,
        14,
        19
    );

    doc.text(
        `Generated: ${new Date().toLocaleString('en-IN')}`,
        pageWidth - 14,
        19,
        { align: 'right' }
    );

    const projectRows = buildProjectRows(rows);

    // PROJECT TABLE
    autoTable(doc, {
        startY: 28,

        head: [[
            'PROJECT',
            'CODE',
            'CLIENT / SCOPE',
            'LOCATION',
            'SCHEDULE',
            'PROJECT MANAGER',
            'SUPERVISOR',
            'CONTACT PERSON',
            'STATUS',
            'BUDGET',
            'UPDATED',
        ]],

        body: projectRows,

        margin: {
            left: 8,
            right: 8,
        },

        tableWidth: 'auto',

        styles: {
            fontSize: 5.5,
            cellPadding: 1.5,
            overflow: 'linebreak',
            valign: 'middle',
            lineColor: [203, 213, 225],
            lineWidth: 0.2,
        },

        headStyles: {
            fillColor: [15, 23, 42],
            textColor: [255, 255, 255],
            fontSize: 5.5,
            fontStyle: 'bold',
            halign: 'center',
            valign: 'middle',
        },

        bodyStyles: {
            fontSize: 5.5,
            valign: 'middle',
        },

        alternateRowStyles: {
            fillColor: [248, 250, 252],
        },

        columnStyles: {
            0: { cellWidth: 24 },
            1: { cellWidth: 17 },
            2: { cellWidth: 30 },
            3: { cellWidth: 26 },
            4: { cellWidth: 24 },
            5: { cellWidth: 28 },
            6: { cellWidth: 33 },
            7: { cellWidth: 33 },
            8: { cellWidth: 16 },
            9: { cellWidth: 19 },
            10: { cellWidth: 22 },
        },

        showHead: 'everyPage',
        pageBreak: 'auto',
        rowPageBreak: 'auto',

        didDrawPage: (data) => {
            doc.setFontSize(7);
            doc.setTextColor(100, 116, 139);

            doc.text(
                `Page ${data.pageNumber}`,
                doc.internal.pageSize.getWidth() - 25,
                doc.internal.pageSize.getHeight() - 8
            );
        },
    });

    // SAVE
    doc.save(
        `${fileName}-${new Date()
            .toISOString()
            .slice(0, 10)}.pdf`
    );
};

// EXISTING GENERIC PDF EXPORT
export const exportPagePdf = ({
    title,
    fileName,
    rows,
    columns,
}) => {
    const doc = new jsPDF({
        orientation: 'landscape',
    });

    doc.setFontSize(14);
    doc.text(title, 14, 14);

    doc.setFontSize(9);
    doc.text(
        `Generated: ${new Date().toLocaleString('en-IN')}`,
        14,
        21
    );

    autoTable(doc, {
        startY: 28,

        head: [
            columns.map(
                (column) => column.label
            ),
        ],

        body: rows.map((row) =>
            columns.map((column) =>
                column.render ? column.render(row) : row[column.key] ?? '-'
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

    doc.save(
        `${fileName}-${new Date().toISOString().slice(0, 10)}.pdf`
    );
};