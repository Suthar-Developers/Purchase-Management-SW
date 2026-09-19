const db = require("../config/db")

const newProject = async (req, res) => {
    const connection = await db.getConnection();

    try {
        const { projectName, projectCode, clientName, projectAreaSqft, scopeOfWork, state, stateCode, city, address, startDate, endDate, contactPersonName, contactPersonNumber, contactPersonEmail, secondaryContactPerson, projectManagerName, projectManagerNumber, projectManagerEmail, supervisorName, supervisorNumber, supervisorEmail, secondarySupervisors, status, budget, description } = req.body

        if (!projectName || !projectCode) {
            return res.status(400).json({ message: "Project name and project code are required." })
        }

        await connection.beginTransaction();

        // 1. INSERT PROJECT
        const projectSql = `
        INSERT INTO projects(projectName, projectCode, clientName, projectAreaSqft, scopeOfWork, state, stateCode, city, address, startDate, endDate, contactPersonName, contactPersonNumber, contactPersonEmail, status, budget, description)
        VALUES(?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)
        `;

        const projectValues = [projectName, projectCode, clientName || null, projectAreaSqft || null, scopeOfWork || null, state || null, stateCode || null, city || null, address || null, startDate || null, endDate || null, contactPersonName || null, contactPersonNumber || null, contactPersonEmail || null, status || "Planned", budget || null, description || null]

        const [projectResult] = await connection.query(projectSql, projectValues);

        const projectId = projectResult.insertId;

        // 2. PRIMARY CONTACT PERSON
        if (contactPersonName && contactPersonName.trim()) {
            await connection.query(
                `
                INSERT INTO project_contacts
                (
                    project_id,
                    contact_type,
                    name,
                    phone,
                    email,
                    is_primary
                )
                VALUES (?, ?, ?, ?, ?, ?)
                `,
                [
                    projectId,
                    "CONTACT_PERSON",
                    contactPersonName.trim(),
                    contactPersonNumber || null,
                    contactPersonEmail || null,
                    true
                ]
            );
        }

        // 3. SECONDARY CONTACT PERSON
        if (
            secondaryContactPerson &&
            secondaryContactPerson.name &&
            secondaryContactPerson.name.trim()
        ) {
            await connection.query(
                `
                INSERT INTO project_contacts
                (
                    project_id,
                    contact_type,
                    name,
                    phone,
                    email,
                    is_primary
                )
                VALUES (?, ?, ?, ?, ?, ?)
                `,
                [
                    projectId,
                    "CONTACT_PERSON",
                    secondaryContactPerson.name.trim(),
                    secondaryContactPerson.number || null,
                    secondaryContactPerson.email || null,
                    false
                ]
            );
        }

        // 4. PROJECT MANAGER
        if (projectManagerName && projectManagerName.trim()) {
            await connection.query(
                `
                INSERT INTO project_contacts
                (
                    project_id,
                    contact_type,
                    name,
                    phone,
                    email,
                    is_primary
                )
                VALUES (?, ?, ?, ?, ?, ?)
                `,
                [
                    projectId,
                    "PROJECT_MANAGER",
                    projectManagerName.trim(),
                    projectManagerNumber || null,
                    projectManagerEmail || null,
                    true
                ]
            );
        }

        // 5. PRIMARY SUPERVISOR
        if (supervisorName && supervisorName.trim()) {
            await connection.query(
                `
                INSERT INTO project_contacts
                (
                    project_id,
                    contact_type,
                    name,
                    phone,
                    email,
                    is_primary
                )
                VALUES (?, ?, ?, ?, ?, ?)
                `,
                [
                    projectId,
                    "SUPERVISOR",
                    supervisorName.trim(),
                    supervisorNumber || null,
                    supervisorEmail || null,
                    true
                ]
            );
        }

        // 6. SECONDARY SUPERVISORS
        if (
            Array.isArray(secondarySupervisors) &&
            secondarySupervisors.length > 0
        ) {
            for (const supervisor of secondarySupervisors) {
                if (!supervisor.name || !supervisor.name.trim()) {
                    continue;
                }

                await connection.query(
                    `
                    INSERT INTO project_contacts
                    (
                        project_id,
                        contact_type,
                        name,
                        phone,
                        email,
                        is_primary
                    )
                    VALUES (?, ?, ?, ?, ?, ?)
                    `,
                    [
                        projectId,
                        "SUPERVISOR",
                        supervisor.name.trim(),
                        supervisor.number || null,
                        supervisor.email || null,
                        false
                    ]
                );
            }
        }

        // COMMIT
        await connection.commit();

        return res.status(201).json({
            success: true,
            message: "New project created successfully.",
            project_id: projectId
        });
    } catch (error) {
        await connection.rollback();

        console.error("Create Project Error:", error);

        // Duplicate project code
        if (error.code === "ER_DUP_ENTRY") {
            return res.status(409).json({
                success: false,
                message: "Project code already exists."
            });
        }

        return res.status(500).json({
            success: false,
            message: "Server Error"
        });
    } finally {
        connection.release();
    }
}

const getAllProjects = async (req, res) => {
    try {
        const projectSql = "SELECT * FROM projects ORDER BY LOWER(TRIM(projectName)) ASC"
        const [projects] = await db.query(projectSql);

        // Get all contacts
        const contactSql = `
            SELECT
                contact_id,
                project_id,
                contact_type,
                name,
                phone,
                email,
                is_primary
            FROM project_contacts
            ORDER BY project_id, is_primary DESC, contact_id ASC
        `;

        const [contacts] = await db.query(contactSql);

        // Attach contacts to projects
        const projectsWithContacts = projects.map(project => {
            const projectContacts = contacts.filter(
                contact => contact.project_id === project.project_id
            );

            const contactPersons = projectContacts.filter(
                contact => contact.contact_type === "CONTACT_PERSON"
            );

            const managers = projectContacts.filter(
                contact => contact.contact_type === "PROJECT_MANAGER"
            );

            const supervisors = projectContacts.filter(
                contact => contact.contact_type === "SUPERVISOR"
            );

            return {
                ...project,
                contacts: {
                    primaryContactPerson:
                        contactPersons.find(
                            c => Number(c.is_primary) === 1
                        ) || null,

                    secondaryContactPerson:
                        contactPersons.find(
                            c => Number(c.is_primary) === 0
                        ) || null,

                    projectManager:
                        managers.find(
                            c => Number(c.is_primary) === 1
                        ) || null,

                    primarySupervisor:
                        supervisors.find(
                            c => Number(c.is_primary) === 1
                        ) || null,

                    secondarySupervisors:
                        supervisors.filter(
                            c => Number(c.is_primary) === 0
                        )
                }
            };
        });

        return res.status(200).json(projectsWithContacts);
    } catch (error) {
        console.error("Get Projects Error:", error);
        return res.status(500).json({ message: "Server Error" })
    }
};

const updateProject = async (req, res) => {
    const connection = await db.getConnection();

    const id = req.params.id

    try {
        const data = req.body

        await connection.beginTransaction();

        // 1. UPDATE PROJECT
        const sql = `UPDATE projects 
        SET projectName=?, clientName=?, projectAreaSqft=?, scopeOfWork=?, state=?, stateCode=?, city=?, address=?, startDate=?, endDate=?, contactPersonName=?, contactPersonNumber=?, contactPersonEmail=?, status=?, budget=?, description=?
        WHERE project_id=?`

        await connection.query(sql,
            [data.projectName, data.clientName || null, data.projectAreaSqft || null, data.scopeOfWork || null, data.state || null, data.stateCode || null, data.city || null, data.address || null, data.startDate || null, data.endDate || null, data.contactPersonName || null, data.contactPersonNumber || null, data.contactPersonEmail || null, data.status || "Planned", data.budget || null, data.description || null, id])

        // 2. DELETE OLD CONTACT RECORDS
        await connection.query(
            `
            DELETE FROM project_contacts
            WHERE project_id=?
            `,
            [id]
        );

        // 3. RE-CREATE CONTACT RECORDS
        if (
            data.contactPersonName &&
            data.contactPersonName.trim()
        ) {
            await connection.query(
                `
                INSERT INTO project_contacts
                (
                    project_id,
                    contact_type,
                    name,
                    phone,
                    email,
                    is_primary
                )
                VALUES (?, ?, ?, ?, ?, ?)
                `,
                [
                    id,
                    "CONTACT_PERSON",
                    data.contactPersonName.trim(),
                    data.contactPersonNumber || null,
                    data.contactPersonEmail || null,
                    true
                ]
            );
        }

        // Secondary contact
        if (
            data.secondaryContactPerson &&
            data.secondaryContactPerson.name &&
            data.secondaryContactPerson.name.trim()
        ) {
            await connection.query(
                `
                INSERT INTO project_contacts
                (
                    project_id,
                    contact_type,
                    name,
                    phone,
                    email,
                    is_primary
                )
                VALUES (?, ?, ?, ?, ?, ?)
                `,
                [
                    id,
                    "CONTACT_PERSON",
                    data.secondaryContactPerson.name.trim(),
                    data.secondaryContactPerson.number || null,
                    data.secondaryContactPerson.email || null,
                    false
                ]
            );
        }

        // Project Manager
        if (
            data.projectManagerName &&
            data.projectManagerName.trim()
        ) {
            await connection.query(
                `
                INSERT INTO project_contacts
                (
                    project_id,
                    contact_type,
                    name,
                    phone,
                    email,
                    is_primary
                )
                VALUES (?, ?, ?, ?, ?, ?)
                `,
                [
                    id,
                    "PROJECT_MANAGER",
                    data.projectManagerName.trim(),
                    data.projectManagerNumber || null,
                    data.projectManagerEmail || null,
                    true
                ]
            );
        }

        // Primary Supervisor
        if (
            data.supervisorName &&
            data.supervisorName.trim()
        ) {
            await connection.query(
                `
                INSERT INTO project_contacts
                (
                    project_id,
                    contact_type,
                    name,
                    phone,
                    email,
                    is_primary
                )
                VALUES (?, ?, ?, ?, ?, ?)
                `,
                [
                    id,
                    "SUPERVISOR",
                    data.supervisorName.trim(),
                    data.supervisorNumber || null,
                    data.supervisorEmail || null,
                    true
                ]
            );
        }

        // Secondary Supervisors
        if (
            Array.isArray(data.secondarySupervisors)
        ) {
            for (const supervisor of data.secondarySupervisors) {
                if (!supervisor.name || !supervisor.name.trim()
                ) {
                    continue;
                }

                await connection.query(
                    `
                    INSERT INTO project_contacts
                    (
                        project_id,
                        contact_type,
                        name,
                        phone,
                        email,
                        is_primary
                    )
                    VALUES (?, ?, ?, ?, ?, ?)
                    `,
                    [
                        id,
                        "SUPERVISOR",
                        supervisor.name.trim(),
                        supervisor.number || null,
                        supervisor.email || null,
                        false
                    ]
                );
            }
        }

        // COMMIT
        await connection.commit();

        return res.status(200).json({
            success: true,
            message: "Project updated successfully."
        });
    } catch (error) {
        await connection.rollback();

        console.error("Update Project Error:", error);

        return res.status(500).json({
            success: false,
            message: "Server Error"
        });
    } finally {
        connection.release();
    }
};

module.exports = { newProject, getAllProjects, updateProject };