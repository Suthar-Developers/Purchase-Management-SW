const PERMISSION_ACTIONS = ["view", "create", "edit", "approve", "delete"];

const PERMISSION_MODULES = [
    {
        key: "dashboard",
        label: "Dashboard",
        actions: ["view"],
    },
    {
        key: "projects",
        label: "Projects",
        actions: ["view", "create", "edit"],
    },
    {
        key: "vendors",
        label: "Vendors",
        actions: ["view", "create", "edit"],
    },
    {
        key: "purchase_requests",
        label: "Purchase Requests",
        actions: ["view", "create", "edit", "approve"],
    },
    {
        key: "purchase_orders",
        label: "Purchase Orders",
        actions: ["view", "create", "edit", "approve"],
    },
    {
        key: "reports",
        label: "Reports",
        actions: ["view", "create", "edit", "delete"],
    },
    {
        key: "users",
        label: "Users",
        actions: ["view", "create", "edit", "delete"],
        adminOnly: true,
    },
];

const ROLE_DEFAULT_PERMISSIONS = {
    Admin: Object.fromEntries(
        PERMISSION_MODULES.map((module) => [
            module.key,
            Object.fromEntries(module.actions.map((action) => [action, true])),
        ])
    ),
    "Purchase Manager": {
        dashboard: { view: true },
        projects: { view: true, create: true, edit: true },
        vendors: { view: true, create: true, edit: true },
        purchase_requests: { view: true, create: true, edit: true, approve: true },
        purchase_orders: { view: true, create: true, edit: true, approve: true },
        reports: { view: true, create: true, edit: true, delete: true },
    },
    "Purchase Senior Executive": {
        dashboard: { view: true },
        projects: { view: true, edit: true },
        vendors: { view: true, edit: true },
        purchase_requests: { view: true, create: true, edit: true, approve: true },
        purchase_orders: { view: true, create: true, edit: true },
        reports: { view: true, create: true, edit: true },
    },
    "Purchase Executive": {
        dashboard: { view: true },
        projects: { view: true },
        vendors: { view: true },
        purchase_requests: { view: true, create: true, edit: true },
        purchase_orders: { view: true, create: true, edit: true },
        reports: { view: true },
    },
    "Purchase Junior Executive": {
        dashboard: { view: true },
        projects: { view: true },
        vendors: { view: true },
        purchase_requests: { view: true, create: true },
        purchase_orders: { view: true },
        reports: { view: true },
    },
    "Site Supervisor": {
        dashboard: { view: true },
        projects: { view: true },
        vendors: { view: true },
        purchase_requests: { view: true, create: true },
        purchase_orders: { view: true },
        reports: { view: true },
    },
};

const getRoleDefaultPermissions = (role) => {
    const roleKey = Object.keys(ROLE_DEFAULT_PERMISSIONS).find(
        (knownRole) => knownRole.toLowerCase() === String(role || "").trim().toLowerCase()
    );

    return ROLE_DEFAULT_PERMISSIONS[roleKey] || {};
};

const emptyPermissions = () => Object.fromEntries(
    PERMISSION_MODULES.map((module) => [
        module.key,
        Object.fromEntries(module.actions.map((action) => [action, false])),
    ])
);

const normalizePermissions = (permissions = {}) => {
    const normalized = emptyPermissions();

    PERMISSION_MODULES.forEach((module) => {
        module.actions.forEach((action) => {
            normalized[module.key][action] = Boolean(permissions?.[module.key]?.[action]);
        });
    });

    return normalized;
};

const rowsToPermissions = (rows = []) => {
    const permissions = emptyPermissions();

    rows.forEach((row) => {
        if (permissions[row.module_key] && row.can_access) {
            permissions[row.module_key][row.action_key] = true;
        }
    });

    return permissions;
};

module.exports = {
    PERMISSION_ACTIONS,
    PERMISSION_MODULES,
    ROLE_DEFAULT_PERMISSIONS,
    getRoleDefaultPermissions,
    normalizePermissions,
    rowsToPermissions,
};
