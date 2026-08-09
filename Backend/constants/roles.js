const ROLE_NAME_TO_ID = {
    admin: 1,
    "purchase manager": 2,
    "purchase executive": 3,
    "purchase senior executive": 4,
    "purchase junior executive": 5,
    "site supervisor": 6,
};

const normalizeRole = (role) => {
    // Allows old role names like "Admin" and new role ids like 1 to compare the same way.
    if (role === undefined || role === null) return NaN;

    const numericRole = Number(role);

    if (!Number.isNaN(numericRole)) {
        return numericRole;
    }

    return ROLE_NAME_TO_ID[String(role).trim().toLowerCase()] ?? NaN;
};

module.exports = { ROLE_NAME_TO_ID, normalizeRole };
